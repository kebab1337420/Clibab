//! Discord gateway (wss://gateway.discord.gg) — just enough to join a voice
//! channel and collect the UDP RTP key + endpoint + SSRC table.
//!
//! Mirrors what `discord.js`'s `joinVoiceChannel` does but without a library,
//! because the whole point is to reach the UDP RTP socket directly.

use std::net::SocketAddr;
use std::sync::Arc;
use std::time::Duration;

use log::{info, warn};
use base64::Engine;
use serde_json::Value;
use tokio::sync::Mutex as AsyncMutex;
use tokio_tungstenite::{connect_async, tungstenite::Message, MaybeTlsStream, WebSocketStream};
use futures::{SinkExt, StreamExt};

use crate::voice::SsrcTable;

const GATEWAY_URL: &str = "wss://gateway.discord.gg/?v=10&encoding=json";
const INTENT_GUILD_VOICE_STATES: u32 = 1 << 6;

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

pub struct DiscordGateway {
    token: String,
    ws: Arc<AsyncMutex<Option<WebSocketStream<MaybeTlsStream<tokio::net::TcpStream>>>>>,
    seq: Arc<AsyncMutex<u32>>,
}

impl DiscordGateway {
    pub async fn new(token: &str) -> Result<Self, Box<dyn std::error::Error + Send + Sync>> {
        let (ws, _resp) = connect_async(GATEWAY_URL).await?;
        Ok(Self {
            token: token.to_string(),
            ws: Arc::new(AsyncMutex::new(Some(ws))),
            seq: Arc::new(AsyncMutex::new(0)),
        })
    }

    async fn send(&self, op: u8, d: Value) {
        let seq = *self.seq.lock().await;
        let payload = serde_json::json!({ "op": op, "d": d, "s": seq, "t": null });
        let mut ws = self.ws.lock().await;
        if let Some(s) = ws.as_mut() {
            if s.send(Message::Text(payload.to_string())).await.is_err() {
                warn!("gateway send failed");
            }
            *self.seq.lock().await = seq.wrapping_add(1);
        }
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
        })).await;

        // 2. Request to join the vchannel. Emits VOICE_STATE_UPDATE (sourced table).
        self.send(4, serde_json::json!({
            "guild_id": args.guild_id,
            "channel_id": args.channel_id,
            "self_mute": false,
            "self_deaf": false,
        })).await;

        // 3. Collect VOICE_SERVER_UPDATE (token + endpoint + key) + SSRC table.
        let endpoint = Arc::new(AsyncMutex::new(None::<SocketAddr>));
        let enc_key = Arc::new(AsyncMutex::new(Vec::<u8>::new()));
        let table = Arc::new(AsyncMutex::new(SsrcTable::default()));

        let ep2 = endpoint.clone(); let ek2 = enc_key.clone(); let tbl2 = table.clone();
        let ws2 = self.ws.clone();
        let recv = async {
            loop {
                let txt = {
                    let mut ws = ws2.lock().await;
                    if let Some(s) = ws.as_mut() {
                        match s.next().await {
                            Some(Ok(Message::Text(t))) => t,
                            _ => continue,
                        }
                    } else { return; }
                };
                let v: Value = match serde_json::from_str(&txt) { Ok(v) => v, Err(_) => continue };
                let t = v.get("t").and_then(|x| x.as_str());
                let d = v.get("d");
                match t {
                    Some("VOICE_SERVER_UPDATE") => {
                        if let Some(d) = d {
                            if let Some(ep) = d.get("endpoint").and_then(|x| x.as_str()) {
                                let host = ep.split(':').next().unwrap_or(ep);
                                // IP discovery: the real public ip:port comes from the
                                // type-0x1/0x2 UDP exchange now in `voice.rs::discover`.
                                // We use :50001 as the initial UDP connect target
                                // (discord.js does the same) — `VoiceSession::connect`
                                // then runs `discover()` and exposes the real (ip, port)
                                // as `session.discovered`, which main.rs feeds back to
                                // the gateway via `select_protocol` (op 1). See
                                // docs/mls_handshake.md §"Where we are today".
                                let addr: SocketAddr = format!("{host}:50001").parse().unwrap();
                                *ep2.lock().await = Some(addr);
                                let key = d.get("key").and_then(|x| x.as_str()).unwrap_or("");
                                *ek2.lock().await = base64::engine::general_purpose::STANDARD.decode(key).unwrap_or_default();
                            }
                        }
                    }
                    Some("VOICE_STATE_UPDATE") => {
                        if let Some(d) = d {
                            if d.get("guild_id").and_then(|x| x.as_str()) == Some(&args.guild_id) {
                                if let (Some(uid), Some(ssrc)) =
                                    (d.get("user_id").and_then(|x| x.as_str()),
                                     d.get("ssrc").and_then(|x| x.as_u64()))
                                {
                                    tbl2.lock().await.id.insert(ssrc as u32, uid.to_string());
                                    info!("ssrc {ssrc} -> {uid}");
                                }
                            }
                        }
                    }
                    _ => {}
                }
                if ep2.lock().await.is_some() && !ek2.lock().await.is_empty() {
                    break;
                }
            }
        };

        // 4. Heartbeat so Discord doesn't drop the session before voice lands.
        let seq2 = self.seq.clone();
        let hb_ws = self.ws.clone();
        let hb = async move {
            tokio::time::sleep(Duration::from_secs(5)).await;
            let mut interval = tokio::time::interval(Duration::from_secs(40));
            loop {
                interval.tick().await;
                let s = *seq2.lock().await;
                let payload = serde_json::json!({ "op": 10, "d": s });
                let mut ws = hb_ws.lock().await;
                if let Some(s) = ws.as_mut() { let _ = s.send(Message::Text(payload.to_string())).await; }
            }
        };

        tokio::pin!(recv, hb);
        // Timeout the recv branch so a bad token/guild/channel (no VOICE_SERVER_UPDATE)
        // fails fast instead of hanging forever with a blind heartbeat.
        let res = tokio::select! {
            _ = tokio::time::timeout(Duration::from_secs(15), &mut recv) => { None::<Box<dyn std::error::Error + Send + Sync>> }
            _ = &mut hb => { None }
        };

        let Some(addr) = endpoint.lock().await.take() else {
            return Err("never received VOICE_SERVER_UPDATE (timeout or disconnect)".into());
        };
        let key = enc_key.lock().await.split_off(0);
        let table = table.lock().await.clone();
        let _ = res;
        Ok(JoinResult { endpoint: addr, key, ssrc_table: table })
    }

    pub async fn leave_voice(&self, guild_id: &str) {
        self.send(4, serde_json::json!({ "guild_id": guild_id, "channel_id": None::<&str>, "self_mute": false, "self_deaf": false })).await;
        info!("left voice");
    }

    /// SelectProtocol (gateway op 1): feed the IP-discovered public ip:port back
    /// to Discord over the voice WS so it routes UDP to the right 4-tuple.
    /// `ip` is the public IP string returned by `discover`; `port` is the 16-bit port.
    pub async fn select_protocol(&self, ip: &str, port: u16) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        self.send(1, serde_json::json!({ "ip": ip, "port": port })).await;
        info!("select_protocol ip={ip} port={port}");
        Ok(())
    }
}

#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::time::{SystemTime, UNIX_EPOCH};
