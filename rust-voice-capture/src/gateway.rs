//! Discord gateway (wss://gateway.discord.gg) — just enough to join a voice
//! channel and collect the UDP RTP key + endpoint + SSRC table.
//!
//! Mirrors what `discord.js`'s `joinVoiceChannel` does but without a library,
//! because the whole point is to reach the UDP RTP socket directly.

use std::net::SocketAddr;
use std::time::Duration;

use log::{info, warn};
use base64::Engine;
use serde_json::Value;
use tokio::net::lookup_host;
use tokio::sync::{broadcast, mpsc, oneshot, watch};
use tokio_tungstenite::{connect_async, tungstenite::Message, MaybeTlsStream, WebSocketStream};
use futures::{SinkExt, StreamExt};

use crate::voice::SsrcTable;

const GATEWAY_URL: &str = "wss://gateway.discord.gg/?v=10&encoding=json";
const INTENT_GUILD_VOICE_STATES: u32 = 1 << 6;
/// Cadence of the OP 1 heartbeat. This loop used to live only for the duration
/// of `join_voice`, which is why `leave_voice` ended up writing into a dead
/// socket and Discord kept showing the bot in voice.
const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(40);

/// What the caller hands to `Gateway::join_voice`.
#[derive(Debug, Clone)]
pub struct JoinArgs {
    pub guild_id: String,
    pub channel_id: String,
}

/// What the gateway yields after VOICE_SERVER_UPDATE + the SSRC table.
#[derive(Debug)]
pub struct JoinResult {
    pub endpoint: SocketAddr,      // UDP voice endpoint
    pub key: Vec<u8>,              // 256-bit encryption key (base64-decoded)
    pub ssrc_table: SsrcTable,     // user_id <-> ssrc
}

/// Frames the connection driver task executes against the WebSocket. Writes are
/// acked once the frame is on the wire, so `leave_voice` knows its OP 4 really
/// reached Discord before the socket closes.
enum GatewayCommand {
    Send { op: u8, d: Value, ack: oneshot::Sender<Result<(), String>> },
    Close,
}

type GatewaySocket = WebSocketStream<MaybeTlsStream<tokio::net::TcpStream>>;

/// One long-lived gateway connection per capture. A single spawned driver task
/// owns the socket, the read loop and the heartbeat for the lifetime of the
/// struct; `join_voice` / `leave_voice` only push `GatewayCommand`s at it.
pub struct DiscordGateway {
    token: String,
    cmds: mpsc::UnboundedSender<GatewayCommand>,
    events: broadcast::Sender<Value>,
    close: watch::Sender<Option<String>>,
}

impl DiscordGateway {
    pub async fn new(token: &str) -> Result<Self, Box<dyn std::error::Error + Send + Sync>> {
        let (ws, _resp) = connect_async(GATEWAY_URL).await?;
        let (cmds_tx, cmds_rx) = mpsc::unbounded_channel();
        let (events_tx, _) = broadcast::channel(256);
        let (close_tx, _) = watch::channel(None);
        let gateway = Self {
            token: token.to_string(),
            cmds: cmds_tx,
            events: events_tx,
            close: close_tx,
        };
        gateway.spawn_driver(ws, cmds_rx);
        Ok(gateway)
    }

    /// Owns the socket end-to-end: writes commands in order, fans inbound
    /// frames out to `events`, and heartbeats forever. On a read/write error or
    /// close it records the reason in `close` and exits, so `closed()` can tell
    /// `main` that the connection died mid-capture.
    fn spawn_driver(&self, mut ws: GatewaySocket, mut cmds: mpsc::UnboundedReceiver<GatewayCommand>) {
        let events = self.events.clone();
        let close = self.close.clone();
        tokio::spawn(async move {
            let mut last_seq: u32 = 0;
            let mut first_beat = true;
            let mut reason = None::<String>;
            loop {
                // First beat soon after connect (no server sequence to echo yet),
                // then on the regular cadence.
                let delay = if first_beat { Duration::from_secs(5) } else { HEARTBEAT_INTERVAL };
                first_beat = false;
                let mut heartbeat = Box::pin(tokio::time::sleep(delay));
                tokio::select! {
                    cmd = cmds.recv() => match cmd {
                        Some(GatewayCommand::Send { op, d, ack }) => {
                            let payload = serde_json::json!({ "op": op, "d": d });
                            match ws.send(Message::Text(payload.to_string())).await {
                                Ok(()) => { let _ = ack.send(Ok(())); }
                                Err(e) => {
                                    let _ = ack.send(Err(e.to_string()));
                                    reason = Some("gateway write failed".into());
                                    break;
                                }
                            }
                        }
                        Some(GatewayCommand::Close) => break,
                        None => break,
                    },
                    frame = ws.next() => match frame {
                        Some(Ok(Message::Text(t))) => {
                            if let Ok(v) = serde_json::from_str::<Value>(&t) {
                                // Remember the server sequence so HEARTBEAT (op 1)
                                // can echo it.
                                if let Some(s) = v.get("s").and_then(|x| x.as_u64()) {
                                    last_seq = s as u32;
                                }
                                let _ = events.send(v);
                            }
                        }
                        // Binary / ping / pong frames need no action.
                        Some(Ok(_)) => {}
                        Some(Err(e)) => { reason = Some(format!("gateway read error: {e}")); break; }
                        None => { reason = Some("gateway closed by server".into()); break; }
                    },
                    _ = &mut heartbeat => {
                        let payload = serde_json::json!({ "op": 1, "d": last_seq });
                        if ws.send(Message::Text(payload.to_string())).await.is_err() {
                            reason = Some("gateway heartbeat send failed".into());
                            break;
                        }
                    }
                }
            }
            let _ = close.send(reason);
            drop(ws);
        });
    }

    /// Client → gateway frames are `{ op, d }` only; `s`/`t` are server → client.
    /// Awaits the driver's ack so the caller knows the frame was actually written.
    async fn send(&self, op: u8, d: Value) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let (ack_tx, ack_rx) = oneshot::channel();
        self.cmds.send(GatewayCommand::Send { op, d, ack: ack_tx })
            .map_err(|_| Box::<dyn std::error::Error + Send + Sync>::from("gateway connection is not running"))?;
        let res = ack_rx.await.map_err(|_| {
            Box::<dyn std::error::Error + Send + Sync>::from("gateway connection closed before frame was written")
        })?;
        res.map_err(Box::<dyn std::error::Error + Send + Sync>::from)?;
        Ok(())
    }

    /// Identify + request voice join, then collect VOICE_SERVER_UPDATE key +
    /// the SSRC table, then return the UDP session material.
    pub async fn join_voice(&self, args: &JoinArgs) -> Result<JoinResult, Box<dyn std::error::Error + Send + Sync>> {
        // 1. Identify with the guild-voice-states intent.
        self.send(2, serde_json::json!({
            "token": &self.token,
            "intents": INTENT_GUILD_VOICE_STATES,
            "properties": { "os": "linux", "browser": "discord-voice-capture", "device": "rust" },
            "shard": [0, 1],
        })).await?;

        // 2. Request to join the vchannel. Emits VOICE_STATE_UPDATE (sourced table).
        self.send(4, serde_json::json!({
            "guild_id": args.guild_id,
            "channel_id": args.channel_id,
            "self_mute": false,
            "self_deaf": false,
        })).await?;

        // 3. Collect VOICE_SERVER_UPDATE (token + endpoint + key) + SSRC table.
        let mut rx = self.events.subscribe();
        let mut endpoint: Option<SocketAddr> = None;
        let mut enc_key: Vec<u8> = Vec::new();
        let mut table = SsrcTable::default();

        let collect = async {
            loop {
                let v: Value = match rx.recv().await {
                    Ok(v) => v,
                    Err(broadcast::error::RecvError::Lagged(_)) => continue,
                    Err(broadcast::error::RecvError::Closed) => {
                        return Err(Box::<dyn std::error::Error + Send + Sync>::from(
                            "gateway connection closed before VOICE_SERVER_UPDATE"));
                    }
                };
                let t = v.get("t").and_then(|x| x.as_str());
                match t {
                    Some("VOICE_SERVER_UPDATE") => {
                        let d = match v.get("d") { Some(d) => d, None => continue };
                        if let Some(ep) = d.get("endpoint").and_then(|x| x.as_str()) {
                            let host = ep.split(':').next().unwrap_or(ep);
                            // IP discovery: the real public ip:port comes from the
                            // type-0x1/0x2 UDP exchange in `voice.rs::discover`.
                            // We use :50001 as the initial UDP connect target
                            // (discord.js does the same) — `VoiceSession::connect`
                            // then runs `discover()` and exposes the real (ip, port)
                            // as `session.discovered`, which main.rs feeds back to
                            // the gateway via `select_protocol` (op 1). See
                            // docs/mls_handshake.md §"Where we are today".
                            let addr = match lookup_host(format!("{host}:50001")).await {
                                Ok(mut it) => match it.next() {
                                    Some(a) => a,
                                    None => {
                                        return Err(Box::<dyn std::error::Error + Send + Sync>::from(
                                            format!("voice endpoint {host} resolved to no addresses")));
                                    }
                                },
                                Err(e) => {
                                    return Err(Box::<dyn std::error::Error + Send + Sync>::from(
                                        format!("bad voice endpoint {host}: {e}")));
                                }
                            };
                            endpoint = Some(addr);
                            let key = d.get("key").and_then(|x| x.as_str()).unwrap_or("");
                            match base64::engine::general_purpose::STANDARD.decode(key) {
                                Ok(k) if !k.is_empty() => enc_key = k,
                                _ => {
                                    return Err(Box::<dyn std::error::Error + Send + Sync>::from(
                                        "missing or invalid voice encryption key"));
                                }
                            }
                        }
                    }
                    Some("VOICE_STATE_UPDATE") => {
                        if let Some(d) = v.get("d") {
                            if d.get("guild_id").and_then(|x| x.as_str()) == Some(&args.guild_id) {
                                if let (Some(uid), Some(ssrc)) =
                                    (d.get("user_id").and_then(|x| x.as_str()),
                                     d.get("ssrc").and_then(|x| x.as_u64()))
                                {
                                    table.id.insert(ssrc as u32, uid.to_string());
                                    info!("ssrc {ssrc} -> {uid}");
                                }
                            }
                        }
                    }
                    _ => {}
                }
                if endpoint.is_some() && !enc_key.is_empty() {
                    break;
                }
            }
            Ok(())
        };

        // Timeout the collect so a bad token/guild/channel (no VOICE_SERVER_UPDATE)
        // fails fast instead of hanging forever with a blind heartbeat.
        tokio::time::timeout(Duration::from_secs(15), collect)
            .await
            .map_err(|_| Box::<dyn std::error::Error + Send + Sync>::from(
                "never received VOICE_SERVER_UPDATE (timeout or disconnect)"))??;

        let addr = endpoint.ok_or_else(|| Box::<dyn std::error::Error + Send + Sync>::from(
            "never received VOICE_SERVER_UPDATE (timeout or disconnect)"))?;
        Ok(JoinResult { endpoint: addr, key: enc_key, ssrc_table: table })
    }

    /// Future that completes once the gateway connection is lost (server close,
    /// read/write/heartbeat error). `main` awaits this to learn that the voice
    /// stream died while the parent was still listening.
    pub async fn closed(&self) -> Option<String> {
        let mut rx = self.close.subscribe();
        if let Some(r) = rx.borrow().as_ref() {
            return Some(r.clone());
        }
        loop {
            if rx.changed().await.is_err() {
                return None;
            }
            if let Some(r) = rx.borrow().as_ref() {
                return Some(r.clone());
            }
        }
    }

    pub async fn leave_voice(&self, guild_id: &str) {
        if let Err(e) = self.send(4, serde_json::json!({
            "guild_id": guild_id,
            "channel_id": None::<&str>,
            "self_mute": false,
            "self_deaf": false,
        })).await {
            warn!("leave_voice failed: {e}");
        } else {
            info!("left voice");
        }
        // The capture is over; stop heartbeating and drop the socket so the
        // server actually sees us out of voice (the OP 4 was acked above).
        let _ = self.cmds.send(GatewayCommand::Close);
    }
}