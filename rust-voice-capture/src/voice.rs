//! Per-participant voice capture over Discord's *voice gateway UDP* path.
//!
//! Discord ships voice in two layers:
//!   1. The gateway (see `gateway.rs`) — WebSocket opcodes `VOICE_STATE_UPDATE` /
//!      `VOICE_SERVER_UPDATE` land the IP/port/nonce/key for a UDP RTP socket.
//!   2. RTP over UDP — one SSRC per speaker. **That is the demux boundary**:
//!      we never hand a single mixed blob to one `MediaRecorder` the way the
//!      Electron renderer does; each SSRC is its own participant.
//!
//! The hard part Discord hides behind `discord_voice.node`: MLS/Dave encrypts
//! the RTP. `discord_voice.node` is signed, so the plugin route is locked out —
//! this crate bypasses it by doing the crypto in-process. See the decryption
//! stub at the bottom of `VoiceSession::connect`.
//!
//! ## Transport encryption (legacy / `aead_aes256_gcm_rtpsize`)
//!
//! Per the halley reference and the discord.js `Networking` implementation:
//!
//! Wire format:
//! ```text
//! UDP datagram = RTP_header || ciphertext(+16-byte GCM tag) || 4-byte_nonce_counter
//! ```
//!
//! - The last 4 bytes of each UDP datagram are a big-endian u32 nonce counter,
//!   also called the "unpadded nonce".
//! - The AES-256-GCM nonce is 12 bytes: the 4-byte counter left-aligned and
//!   zero-padded on the right (`nonce[0..4] = counter_be`, `nonce[4..12] = 0`).
//! - The AAD (additional authenticated data) is the *unencrypted RTP header*:
//!   the fixed 12-byte header + any CSRCs + the 4-byte RTP extension preamble
//!   (when the extension bit is set). The extension payload itself is inside
//!   the encrypted region.
//! - The auth tag is the full 16-byte AES-GCM tag.
//!
//! The 32-byte `secret_key` from `VOICE_SERVER_UPDATE` is passed through
//! HKDF-SHA256 with an empty salt and info label `"Discord voice RTP"` to derive
//! the 32-byte AES-256 transport key. (The key is nominally already the AES key,
//! but HKDF is applied for forward-compatibility with DAVE/MLS ratcheting, per
//! the halley reference.)

use std::collections::HashMap;
use std::io;
use std::sync::Arc;

#[cfg(feature = "transport_decrypt")]
use aes_gcm::aead::{Aead, Key, KeyInit};
#[cfg(feature = "transport_decrypt")]
use aes_gcm::{Aes256Gcm, Nonce};
#[cfg(feature = "transport_decrypt")]
use hkdf::Hkdf;
use log::{debug, info, warn};
#[cfg(feature = "transport_decrypt")]
use sha2::Sha256;
use tokio::net::UdpSocket;

use crate::gateway::JoinResult;
use crate::wav::ParticipantWav;

/// One participant = one SSRC (maps SSRC -> Discord user_id from the gateway).
pub type Ssrc = u32;

/// SSRC table carried back by the gateway (from VOICE_STATE_UPDATE member
/// updates). Each participant speaks on exactly one SSRC, which is the demux
/// handle we key `.wav` files on.
#[derive(Debug, Clone, Default)]
pub struct SsrcTable {
    pub id: HashMap<Ssrc, String>, // ssrc -> user_id
}

/// RTP packet (minimal header parse — enough for demux + op decode).
pub struct RtpPacket {
    pub ssrc: Ssrc,
    pub timestamp: u32,
    pub payload_type: u8, // 111 = opus
    pub payload: Vec<u8>,
}

impl RtpPacket {
    /// Discord voice uses a 12-byte fixed RTP header (no CSRC/CR extension).
    pub fn parse(buf: &[u8]) -> io::Result<Self> {
        if buf.len() < 12 {
            return Err(io::Error::new(io::ErrorKind::InvalidData, "RTP packet < 12 bytes"));
        }
        let b0 = buf[0];
        let cc = (b0 & 0x0f) as usize;
        let header_len = 4 + cc * 4;
        if buf.len() < header_len {
            return Err(io::Error::new(io::ErrorKind::InvalidData, "RTP CC overrun"));
        }
        let ssrc = u32::from_be_bytes([buf[8], buf[9], buf[10], buf[11]]);
        let timestamp = u32::from_be_bytes([buf[4], buf[5], buf[6], buf[7]]);
        let payload_type = buf[1] & 0x7f;
        let payload = buf[header_len..].to_vec();
        Ok(RtpPacket { ssrc, timestamp, payload_type, payload })
    }

    /// Discord voice RTP has version 2 (top 2 bits of byte 0). Use this to reject
    /// garbage that accidentally parses as a 12-byte struct but isn't voice RTP
    /// (prevents runaway SSRC lanes on non-RTP UDP noise).
    pub fn version_is_valid(&self, version_byte: u8) -> bool {
        (version_byte >> 6) == 2
    }
}

/// Holds the AES-256-GCM cipher needed to undo Discord's transport encryption.
///
/// The cipher is derived from the 32-byte `secret_key` handed back by
/// `VOICE_SERVER_UPDATE` via HKDF-SHA256. The nonce is reconstructed per-packet
/// from the 4-byte trailing counter in the UDP datagram.
#[cfg(feature = "transport_decrypt")]
pub struct TransportCipher {
    cipher: Aes256Gcm,
}

#[cfg(feature = "transport_decrypt")]
impl TransportCipher {
    /// Derive the AES-256 transport key from the 32-byte `secret_key` using
    /// HKDF-SHA256. Discord nominally ships the AES key directly, but halley's
    /// reference routes it through HKDF for forward-compatibility with DAVE/MLS
    /// ratcheting. Empty salt, info label `"Discord voice RTP"`, 32-byte output.
    pub fn from_key(secret_key: &[u8]) -> io::Result<Self> {
        let hk = Hkdf::<Sha256>::new(None, secret_key);
        let mut okm = [0u8; 32];
        hk.expand(b"Discord voice RTP", &mut okm)
            .map_err(|e| io::Error::new(io::ErrorKind::InvalidData, e.to_string()))?;
        let key = Key::<Aes256Gcm>::from(okm);
        let cipher = Aes256Gcm::new(&key);
        Ok(TransportCipher { cipher })
    }

    /// Decrypt one RTP datagram produced by Discord's voice gateway.
    ///
    /// Returns the *plaintext* RTP packet (header + decrypted payload) with the
    /// 4-byte nonce suffix removed.
    fn decrypt_rtp(&self, datagram: &[u8]) -> io::Result<Vec<u8>> {
        // Need at least: 12-byte RTP header + 4-byte nonce suffix + 16-byte GCM tag
        if datagram.len() < 12 + 4 + 16 {
            return Err(io::Error::new(io::ErrorKind::InvalidData, "datagram too short"));
        }

        // --- Nonce: last 4 bytes of the datagram, left-aligned + zero-padded to 12 ---
        let n = datagram.len();
        let nonce_counter = &datagram[n - 4..n];
        let mut nonce_bytes = [0u8; 12];
        nonce_bytes[..4].copy_from_slice(nonce_counter);
        // aes-gcm 0.11 made `Nonce` generic over its length param (U12 = 12 bytes).
        let nonce: Nonce<aes_gcm::aead::array::typenum::U12> = Nonce::from(nonce_bytes);

        // --- AAD: the unencrypted RTP prefix ---
        //   fixed 12-byte header + CSRCs (CC * 4) + extension preamble (4 bytes if X bit set)
        //   The extension payload is part of the encrypted region (per _rtpsize modes).
        let b0 = datagram[0];
        let cc = (b0 & 0x0f) as usize;
        let has_ext = (b0 & 0x10) != 0;
        let mut aad_len = 12 + cc * 4;
        if has_ext {
            // Read the 4-byte extension preamble (profile + length in 32-bit words)
            let ext_preamble_offset = 12 + cc * 4;
            if datagram.len() < ext_preamble_offset + 4 {
                return Err(io::Error::new(io::ErrorKind::InvalidData, "RTP extension truncated"));
            }
            let ext_words = u16::from_be_bytes([
                datagram[ext_preamble_offset + 2],
                datagram[ext_preamble_offset + 3],
            ]);
            aad_len += 4 + ext_words as usize * 4;
        }
        let aad = &datagram[..aad_len];

        // --- Ciphertext + tag: everything between AAD and the nonce suffix ---
        let ct_start = aad_len;
        let ct_end = n - 4; // strip the 4-byte nonce suffix
        if ct_end < ct_start {
            return Err(io::Error::new(io::ErrorKind::InvalidData, "ciphertext region empty"));
        }
        let ciphertext_and_tag = &datagram[ct_start..ct_end];

        let plaintext = self
            .cipher
            .decrypt(&nonce, aes_gcm::aead::Payload { msg: ciphertext_and_tag, aad })
            .map_err(|e| io::Error::new(io::ErrorKind::InvalidData, format!("AES-GCM decrypt: {e}")))?;

        // Reassemble: clear header (with unpadded ext preamble) + plaintext
        let mut out = Vec::with_capacity(aad_len + plaintext.len());
        out.extend_from_slice(aad);
        out.extend_from_slice(&plaintext);
        Ok(out)
    }
}

/// One participant's lane: stateful decoder + wav writer. One .wav per person.
pub struct VoiceLane {
    pub user_id: String,
    pub ssrc: Ssrc,
    pub wav: Arc<ParticipantWav>,
    /// Running byte count of raw (encrypted, undecoded) payload recorded, so the
    /// file is never empty even if decryption is stubbed in this skeleton.
    pub bytes_recorded: u64,
    /// The Opus decoder, created lazily on first successful decode.
    #[cfg(feature = "opus_decode")]
    decoder: Option<opus_decoder::OpusDecoder>,
}

impl VoiceLane {
    pub fn new(user_id: String, ssrc: Ssrc, path: &str) -> io::Result<Self> {
        let wav = Arc::new(ParticipantWav::create(path)?);
        Ok(VoiceLane {
            user_id,
            ssrc,
            wav,
            bytes_recorded: 0,
            #[cfg(feature = "opus_decode")]
            decoder: None,
        })
    }

    /// Record this packet for the participant. Real decode is a TODO (see the
    /// opus stub note); for now we hash-tag the raw RTP payload as a marker so
    /// the pipeline stays end-to-end testable without a C toolchain.
    pub fn record(&mut self, pkt: &RtpPacket) -> io::Result<()> {
        // TODO(opus) — when `transport_decrypt` is OFF we never see plaintext, so this
        // records a per-packet marker (encrypted payload length) to keep the wav advance.
        // Enable feature `opus_decode` (which implies transport_decrypt for real audio):
        //   let mut d = opus_decoder::OpusDecoder::new(48_000, 2)?;
        //   let mut pcm = [0i16; opus_decoder::MAX_FRAME_SIZE_48K * 2];
        //   let n = d.decode(&pkt.payload, &mut pcm, false)?;
        // Until then, write the *raw encrypted* payload length so each lane's
        // wav advances (monotonic per-packet), keeping the writer alive.
        self.bytes_recorded += pkt.payload.len() as u64;
        // A single 16-bit sample carrying the payload length as a marker — so
        // a file is always playable and its size tracks voice activity volume.
        let marker = [(self.bytes_recorded & 0xffff) as i16, 0];
        self.wav.write_samples(&[marker[0] as f32 / f32::from(i16::MAX), marker[1] as f32])?;
        debug!("lane {} recorded {} bytes (total {})", self.user_id, pkt.payload.len(), self.bytes_recorded);
        Ok(())
    }

    /// Decrypt + Opus-decode a decrypted RTP payload and push PCM into `self.wav`.
    ///
    /// The `payload` is the plaintext bytes after transport-decryption: any RTP
    /// header extension (if present) followed by the Opus packet.
    #[cfg(all(feature = "transport_decrypt", feature = "opus_decode"))]
    pub fn decode_and_write(&mut self, payload: &[u8]) -> io::Result<()> {
        // Strip the 1-byte-hop RTP header extension if present (extension bit set).
        // The `payload` here starts at the extension data (after the 12-byte fixed
        // header).  If it begins with the 0xBEDE one-byte extension profile, skip
        // 4 bytes (profile + length-in-words) plus the extension body.
        let opus_payload = if payload.len() >= 4 && payload[..2] == [0xBE, 0xDE] {
            let ext_words = u16::from_be_bytes([payload[2], payload[3]]) as usize;
            let ext_len = 4 + ext_words * 4;
            if payload.len() > ext_len {
                &payload[ext_len..]
            } else {
                &payload[..0]
            }
        } else {
            payload
        };

        // Lazily create the Opus decoder (48 kHz, stereo per Discord spec).
        if self.decoder.is_none() {
            self.decoder = Some(
                opus_decoder::OpusDecoder::new(48_000, 2)
                    .map_err(|e| io::Error::new(io::ErrorKind::InvalidData, e.to_string()))?,
            );
        }

        let decoder = self.decoder.as_mut().unwrap();

        // Discord Opus is stereo at 48 kHz.  A 20 ms frame = 960 samples/channel,
        // but the decoder buffer must hold up to a 120 ms frame:
        // MAX_FRAME_SIZE_48K (5760 samples/channel) × 2 channels.
        let max_samples = opus_decoder::OpusDecoder::MAX_FRAME_SIZE_48K * 2; // stereo
        let mut pcm = vec![0i16; max_samples];

        let n = decoder
            .decode(opus_payload, &mut pcm, false)
            .map_err(|e| io::Error::new(io::ErrorKind::InvalidData, e.to_string()))?;

        // `n` = samples per channel.  Convert i16 → f32 (stereo interleaved) and
        // push into the participant's wav (which expects [L0, R0, L1, R1, ...]).
        let scale = 1.0_f32 / f32::from(i16::MAX);
        let mut interleaved = Vec::with_capacity(n * 2);
        for i in 0..n {
            interleaved.push(pcm[i * 2] as f32 * scale);        // left
            interleaved.push(pcm[i * 2 + 1] as f32 * scale);     // right
        }
        self.wav.write_samples(&interleaved)?;
        Ok(())
    }
}

/// Holds the live voice session state negotiated by the gateway.
pub struct VoiceSession {
    /// SSRC -> lane. Opened lazily on first packet if the gateway's table was
    /// incomplete (it sometimes misses late joiners).
    pub lanes: HashMap<Ssrc, VoiceLane>,
    /// SSRC -> Discord user_id, populated by the gateway from VOICE_STATE_UPDATE.
    pub ssrc_table: SsrcTable,
    socket: Arc<UdpSocket>,
    started: std::time::Instant,
    /// Public ip:port as revealed by IP discovery (type-0x1/0x2 UDP exchange).
    /// Exposed so the caller can feed it back to the gateway via SelectProtocol.
    pub discovered: Option<(String, u16)>,
    /// The transport cipher derived from the session key via HKDF-SHA256.
    #[cfg(feature = "transport_decrypt")]
    cipher: Option<TransportCipher>,
}

impl VoiceSession {
    #[cfg_attr(not(feature = "transport_decrypt"), allow(unused_variables))]
    pub async fn connect(JoinResult { endpoint, key, ssrc_table }: JoinResult) -> io::Result<Self> {
        let socket = UdpSocket::bind("0.0.0.0:0").await?;
        socket.connect(&endpoint).await?;

        // --- IP discovery (§IP Discovery, Discord voice-connections) ---
        // Tell Discord our SSRC so it can reply with our PUBLIC ip:port. The port
        // Discord will send RTP to is revealed here — it is NOT always 50001.
        // We use the first known peer SSRC as a dummy (discord.js uses the local
        // outgoing SSRC; for a receive-only capture bot any SSRC echoes back port).
        let ssrc = ssrc_table.id.keys().next().copied().unwrap_or(0);
        let discovered = Self::discover(&socket, ssrc).await;

        /*
         * === MLS / Dave decryption stub ===
         *
         * Discord encrypts RTP with xsalsa20-poly1305 (legacy) or
         * AES-128-CTR + GCM (the "aead" modes negotiated in VOICE_READY).
         * The key handed back by VOICE_SERVER_UPDATE is base64; the per-packet
         * nonce is `(salt || 4-byte sequence)` XOR'd with the RTP header.
         *
         * `discord_voice.node` does this in closed Rust. Halley reproduces it:
         *   - HKDF over the welcome/secret to derive the SRTP master key
         *     (crate: `aes` + `ctr`, or `xsalsa20`) — see halley/src/voice/sodium.rs
         *
         * ---------------------------------------------------------------------
         * TODO(mls) — OpenMLS epoch key-negotiation splice (<15 min, OPTION A):
         * See docs/mls_handshake.md for the full discord.js Networking + libdave
         * reference. High-level cut:
         *
         *  1. After VOICE_SERVER_UPDATE we hold `token`, `session_id`,
         *     `endpoint` and the voice WS endpoint. Open a SECOND websocket
         *     `wss://<endpoint>?v=8` (this crate currently only opens UDP).
         *  2. Send { op:0 (Identify), d:{server_id, user_id, session_id, token} }
         *     → server replies { op:3 Heartbeat, op:2 Ready {ip, port, ssrc, modes} }.
         *  3. Do ip_discovery (see TODO(ip_discovery) below), then
         *     { op:1 SelectProtocol, d:{protocol:"udp", data:{address, port, mode}} }.
         *  4. Server → { op:4 SessionDescription, d:{mode, secret_key,
         *     dave_protocol_version} }. IF dave_protocol_version > 0 the
         *     group is DAVE/MLS: `secret_key` is the MLS epoch's transport key,
         *     NOT the raw VOICE_SERVER_UPDATE key. ELSE (legacy, ==0) the
         *     existing `TransportCipher::from_key(&key)` path is authoritative.
         *  5. Generate an MLS KeyPackage (ciphersuite
         *     MLS_256_DHKEM_X25519_AES_128_GCM_SHA256_Ed25519 / Discord's
         *     DHKEMP256_AES128GCM_SHA256_P256) and send it as a BINARY
         *     message with opcode 26 (DaveMlsKeyPackage /
         *     DaveMlsCommitWelcome in discord-api-types v8).
         *  6. Binary opcodes to handle (discord.js onWsBinary):
         *       op 24 DaveMlsExternalSender  → dave.setExternalSender(payload)
         *       op 25 DaveMlsProposals       → dave.processProposals(payload, peers)
         *                          → if pending commit: send op 26 {Commit[+Welcome]}
         *       op 27 DaveMlsAnnounceCommitTransition → dave.processCommit(payload)
         *       op 28 DaveMlsWelcome         → dave.processWelcome(payload)
         *                          → on success: send op 23 DaveTransitionReady
         *     op 29 DaveMlsInvalidCommitWelcome → trigger rejoin (discard epoch)
         *     op 20 DavePrepareEpoch       → queue a Commit for the new epoch
         *     op 21 DavePrepareTransition  → prepareTransition()
         *     op 22 DaveExecuteTransition  → executeTransition(id) before takeoff
         *  7. Each successful Commit/Welcome advances the MLS epoch; the epoch
         *     secret → HKDF("Discord voice RTP") → new TransportCipher. That is
         *     the "rotate secret_key" step this stub is missing today.
         *
         * Wire-in one-liner (drop-in for `TransportCipher::from_key(&key)?`):
         *   let epoch_secret = mls_client.epoch_secret()?;        // RFC 9420
         *   let cipher = TransportCipher::from_key(&epoch_secret)?;
         *
         * Until MLS lands, `RtpPacket::payload` here is the raw
         * ENCRYPTED payload; `VoiceLane::record` stubs decode (see TODO(opus)).
         * -------------------------------------------------------------------
         */

        #[cfg(feature = "transport_decrypt")]
        let cipher = if key.is_empty() {
            warn!("session key is empty — transport decryption will be unavailable");
            None
        } else {
            Some(TransportCipher::from_key(&key)?)
        };

        info!(
            "voice session connected to {} ({} lanes known{})",
            endpoint,
            ssrc_table.id.len(),
            discovered.as_ref().map(|(ip, p)| format!("; public {ip}:{p}")).unwrap_or_default(),
        );
        Ok(VoiceSession {
            lanes: HashMap::new(),
            ssrc_table,
            socket: Arc::new(socket),
            started: std::time::Instant::now(),
            discovered,
            #[cfg(feature = "transport_decrypt")]
            cipher,
        })
    }

    /// IP discovery (§IP Discovery). Sends a type-`0x1` request carrying our SSRC
    /// to the voice UDP port and parses the type-`0x2` reply → (public_ip, public_port).
    /// Discord's RTP actually arrives from an ephemeral port Discord chose, so our
    /// bound socket (already connected to `endpoint`) receives it regardless —
    /// this discovery mainly exists so we can report the public 4-tuple the gateway
    /// expects in the SelectProtocol (op 1) round-trip that `gateway.rs` would do.
    async fn discover(socket: &UdpSocket, ssrc: Ssrc) -> Option<(String, u16)> {
        // Request: type(2)=0x0001, length(2)=70, ssrc(4) + 66 zero bytes => 74 total.
        let mut req = vec![0u8; 74];
        req[0..2].copy_from_slice(&0x0001u16.to_be_bytes());
        req[2..4].copy_from_slice(&70u16.to_be_bytes());
        req[4..8].copy_from_slice(&ssrc.to_be_bytes());
        if socket.send(&req).await.is_err() {
            warn!("ip discovery: send failed");
            return None;
        }
        let mut buf = [0u8; 74];
        match socket.recv(&mut buf[..]).await {
            Ok(n) => {
                if n < 74 || buf[0..2] != [0x00, 0x02] {
                    // Discord sometimes pads to a full datagram; tolerate longer.
                    if buf[0..2] != [0x00, 0x02] {
                        warn!("ip discovery: bad reply type");
                        return None;
                    }
                }
                // Layout: type(2) + length(2) + ssrc(4) + address(64, null-term) + port(2).
                let addr_start = 8;
                let port = u16::from_be_bytes([buf[n - 2], buf[n - 1]]);
                let null = buf[addr_start..addr_start + 64]
                    .iter()
                    .position(|&b| b == 0)
                    .unwrap_or(64);
                let ip = std::str::from_utf8(&buf[addr_start..addr_start + null])
                    .ok()?
                    .trim()
                    .to_string();
                if ip.is_empty() {
                    warn!("ip discovery: empty address in reply");
                    None
                } else {
                    Some((ip, port))
                }
            }
            Err(e) => {
                warn!("ip discovery: recv failed: {e}");
                None
            }
        }
    }

    /// Resolve or create a lane for an SSRC seen on the wire.
    pub async fn lane_for(&mut self, ssrc: Ssrc) -> io::Result<()> {
        let user_id = self.ssrc_table.id.get(&ssrc).cloned()
            .unwrap_or_else(|| format!("user-{:#x}", ssrc));
        let path = format!("./clips/{}.wav", user_id);
        let lane = VoiceLane::new(user_id.clone(), ssrc, &path)?;
        self.lanes.insert(ssrc, lane);
        info!("lane open for {} (ssrc {:#x})", user_id, ssrc);
        Ok(())
    }

    /// Recv/demux/decode loop. Runs until the call ends or the `shutdown` receiver
    /// yields (main.rs wires this to Ctrl-C for a graceful drain instead of abort).
    pub async fn run(&mut self, mut shutdown: tokio::sync::broadcast::Receiver<()>) -> io::Result<()> {
        let mut buf = vec![0u8; 1280]; // typical Discord RTP max ~320 payload
        loop {
            // select! between datagram arrival and the shutdown signal so a Ctrl-C
            // (or main signalling shutdown) drains cleanly instead of abort().
            let (n, _from) = tokio::select! {
                r = self.socket.recv_from(&mut buf) => r?,
                _ = shutdown.recv() => {
                    info!("voice session received shutdown signal — stopping recv loop");
                    return Ok(());
                },
            };
            if n == 0 { continue; }

            #[cfg(feature = "transport_decrypt")]
            {
                if self.cipher.is_some() {
                    // process_datagram borrows self for the duration of decrypt+route;
                    // the cipher borrow ends before returning, so no clone is needed.
                    match self.process_datagram(&buf[..n]) {
                        Ok(true) => continue,
                        Ok(false) => {}
                        Err(e) => warn!("decrypt failed on {}B datagram: {e}", n),
                    }
                }
            }

            // Fallback: parse as plain RTP and record (stub decode path). In non-decrypt
            // mode we gate on a sane RTP version header (v2) to reject garbage that
            // would otherwise spawn runaway SSRC lanes on non-RTP UDP noise.
            match RtpPacket::parse(&buf[..n]) {
                Ok(pkt) if pkt.version_is_valid(buf[0]) => {
                    debug!("rtp ssrc={:#x} pt={} ts={} payload={}B", pkt.ssrc, pkt.payload_type, pkt.timestamp, pkt.payload.len());
                    if !self.lanes.contains_key(&pkt.ssrc) {
                        if let Err(e) = self.lane_for(pkt.ssrc).await {
                            warn!("lane open failed for {:#x}: {e}", pkt.ssrc);
                        }
                    }
                    if let Some(lane) = self.lanes.get_mut(&pkt.ssrc) {
                        if let Err(e) = lane.record(&pkt) {
                            warn!("record failure ssrc={:#x}: {e}", pkt.ssrc);
                        }
                    }
                }
                Ok(_) => { /* parsed but version/header sanity-check failed (RTCP or noise) — ignore */ }
                Err(e) => warn!("bad rtp: {e}"),
            }

            // Safety backstop against unbounded lane growth on very long calls.
            if self.started.elapsed().as_secs() > 7200 && self.lanes.len() > 64 {
                warn!("too many voice lanes ({}) after 2h — check SSRC table drift", self.lanes.len());
            }
        }
    }

    /// Decrypt one UDP datagram, parse the inner RTP, and route to the right lane.
    /// Returns `Ok(true)` if the packet was handled (decrypted + routed),
    /// `Ok(false)` if the caller should fall through to the plain-RTP fallback.
    #[cfg(feature = "transport_decrypt")]
    fn process_datagram(&mut self, datagram: &[u8]) -> io::Result<bool> {
        let cipher = match &self.cipher {
            Some(c) => c,
            None => return Ok(false),
        };

        let plaintext = cipher.decrypt_rtp(datagram)?;

        // Re-parse the decrypted RTP.
        let pkt = match RtpPacket::parse(&plaintext) {
            Ok(p) => p,
            Err(e) => {
                warn!("RTP parse after decrypt failed: {e}");
                return Ok(false);
            }
        };

        debug!(
            "rtp(decrypted) ssrc={:#x} pt={} ts={} payload={}B",
            pkt.ssrc, pkt.payload_type, pkt.timestamp, pkt.payload.len()
        );

        // Ensure a lane exists for this SSRC.
        if !self.lanes.contains_key(&pkt.ssrc) {
            let user_id = self.ssrc_table.id.get(&pkt.ssrc).cloned()
                .unwrap_or_else(|| format!("user-{:#x}", pkt.ssrc));
            let path = format!("./clips/{}.wav", user_id);
            let lane = VoiceLane::new(user_id.clone(), pkt.ssrc, &path)?;
            self.lanes.insert(pkt.ssrc, lane);
            info!("lane open for {} (ssrc {:#x})", user_id, pkt.ssrc);
        }

        if let Some(lane) = self.lanes.get_mut(&pkt.ssrc) {
            // With transport_decrypt + opus_decode: full Opus path; on failure,
            // fall back to marker recording so the wav still stays alive.
            #[cfg(all(feature = "transport_decrypt", feature = "opus_decode"))]
            if let Err(e) = lane.decode_and_write(&pkt.payload) {
                warn!("opus decode failure ssrc={:#x}: {e} — recording marker", pkt.ssrc);
                lane.bytes_recorded += pkt.payload.len() as u64;
                let marker = [(lane.bytes_recorded & 0xffff) as i16, 0];
                lane.wav.write_samples(&[
                    marker[0] as f32 / f32::from(i16::MAX),
                    marker[1] as f32,
                ])?;
            }
            // Without opus_decode (transport_decrypt on but no decoder): fall back
            // to the marker-only `record` path so the .wav still advances per packet.
            #[cfg(not(feature = "opus_decode"))]
            { lane.record(&pkt)?; }
        }

        Ok(true)
    }
}
