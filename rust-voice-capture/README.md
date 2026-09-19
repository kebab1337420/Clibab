# discord-voice-capture

Minimal Discord **alt-client** that connects to the voice gateway, receives UDP
RTP, demuxes one stream per participant (by SSRC), and writes a separate
`.wav` per speaker — bypassing Discord's Nitro/Clips experiment gate and the
renderer `EXCEPTION_BREAKPOINT` crash entirely.

This lives alongside the Vencord Clipper plugin (same dev tree) as a research
spike; see `../../src/userplugins/Clipper/` for the plugin.

## Build

```sh
cargo build --release
```

No C/cmake toolchain required: RTP → PCM decode is stubbed (records a per-packet
activity marker so wav size tracks voice activity) so `cargo check` is green on
a stock Rust install. A real decoder is one `opus`/`symphonia` feature-flag
away (see `Cargo.toml`).

## Run

The bot token goes through the **Bot** auth flow (NOT user tokens — keep it
scoped). Provide it via env; guild/channel IDs may be positional or env:

```sh
DISCORD_TOKEN=... cargo run --release -- <guild_id> [channel_id]
# or
DISCORD_TOKEN=... GUILD_ID=<guild> CHANNEL_ID=<chan> cargo run --release
```

Outputs land in `./clips/<user_id_or_ssrc>.wav`, finalized on `Drop` (so
they're playable even on a crash).

## Architecture

- `src/gateway.rs` — WSS to `wss://gateway.discord.gg` (v10): HELLO/identify,
  READY, GUILD_CREATE, VOICE_STATE_UPDATE (to join a channel),
  VOICE_SERVER_UPDATE (UDP endpoint + secret key), the member SSRC table,
  and a periodic HEARTBEAT. Returns `JoinResult { endpoint, key, ssrc_table }`.
- `src/voice.rs` — UDP socket to the voice endpoint, RTP packet parsing
  (header + payload type 111/Opus), **demux by SSRC** → one `VoiceLane` per
  participant, Opus decode stub, 20 ms frame push to each lane.
- `src/wav.rs` — one `hound::WavWriter` per participant (48 kHz / 16-bit /
  stereo LE), finalized on Drop.
- `src/main.rs` — orchestrates the two, spawns the UDP recv loop, handles
  Ctrl-C → `leave_voice` + clean WAV flush.

## MLS / WebRTC encryption

Discord voice RTP is encrypted. See commented stubs in `src/voice.rs`:

- HKDF-SHA256 key derivation per `halley`'s reverse-engineering of the MLS
  epoch.
- OpenMLS group key package parsing (the hard part — TODO).
- Nonce construction + AES-GCM / `xsalsa20-poly1305` decryption of the RTP
  payload.

Reference: `halley` reverse-engineers the voice gateway + MLS layer; the
encryption is the remaining gap before real PCM hits the WAVs.
