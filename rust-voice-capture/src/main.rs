//! Entry point: connects to the gateway, joins a voice channel, and feeds each
//! participant's SSRC to `VoiceSession` (one .wav per speaker).
//!
//! Two modes:
//!
//! * **CLI (legacy / standalone)** — provide the guild/channel via positional
//!   args or env vars, set `DISCORD_TOKEN`, and a `Ctrl-C` drains the UDP
//!   loop gracefully then leaves the voice channel:
//!
//!   DISCORD_TOKEN=... cargo run --release -- <guild_id> [channel_id]
//!   # or
//!   DISCORD_TOKEN=... GUILD_ID=<g> CHANNEL_ID=<c> cargo run --release
//!
//! * **stdio (Vesktop / native addon host)** — pass `--stdio` and the parent
//!   (e.g. Electron's `native.ts`) drives the capture over JSON lines on
//!   stdin/stdout:
//!
//!   {"cmd":"start","token":"...","guild_id":"...","channel_id":"..."}
//!   {"cmd":"stop"}
//!
//!   Events are emitted back as JSON object lines:
//!   {"event":"connected","endpoint":"1.2.3.4:50001"}
//!   {"event":"wav_ready","user_id":"123","path":"clips/123.wav"}
//!   {"event":"error","detail":"..."}
//!
//! Outputs land in `./clips/<user_id>.wav`, finalized on `Drop` (so they're
//! playable even on a crash).

use std::env;
use std::io::{self, BufRead, Write};
use std::path::PathBuf;
use std::sync::Arc;
use std::time::Duration;

use clap::Parser;
use discord_voice_capture::gateway::{DiscordGateway, JoinArgs};
use discord_voice_capture::voice::VoiceSession;

#[derive(Parser, Debug)]
#[command(name = "discord-voice-capture")]
struct Args {
    /// Run in stdio JSON-IPC mode (parent drives start/stop over stdin/stdout).
    #[arg(long)]
    stdio: bool,

    /// Guild (server) ID whose voice channel will be joined (CLI mode).
    guild_id: Option<String>,
    /// Voice channel ID to join (env CHANNEL_ID wins if both are set, CLI mode).
    channel_id: Option<String>,
}

fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let args = Args::parse();
    let token = env::var("DISCORD_TOKEN").expect("DISCORD_TOKEN env var not set");

    env_logger::init();
    let rt = tokio::runtime::Runtime::new()?;

    if args.stdio {
        // Vesktop / native addon host mode: parent drives us over JSON lines.
        return rt.block_on(async_stdio(&token));
    }

    // Legacy CLI mode: positional / env args + Ctrl-C drain.
    let guild_id = env::var("GUILD_ID").unwrap_or_else(|_| {
        args.guild_id.clone().expect("guild_id positional arg or GUILD_ID env required")
    });
    let channel_id = env::var("CHANNEL_ID")
        .unwrap_or_else(|_| args.channel_id.clone().unwrap_or_default());

    rt.block_on(async move { run(&token, &guild_id, &channel_id, None).await })
}

/// Parent-driven JSON-IPC loop over stdin/stdout.
async fn async_stdio(token: &str) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let mut out = io::stdout().lock();
    let mut emit = |obj: &serde_json::Value| {
        let _ = writeln!(out, "{}", obj);
        let _ = out.flush();
    };

    // Drive one capture session at a time. The parent sends "start" + "stop".
    let mut handle: Option<tokio::task::JoinHandle<()>> = None;
    let mut shutdown: Option<tokio::sync::broadcast::Sender<()>> = None;
    let mut clips_dir: PathBuf = std::env::current_dir().unwrap_or(".".into());
    clips_dir.push("clips");
    // Snapshot the filenames we have already announced so a poll never
    // double-reports a single .wav (run() finalizes on Drop).
    let mut seen: std::collections::HashSet<PathBuf> = std::collections::HashSet::new();

    for line in io::BufReader::new(io::stdin()).lines() {
        let line = line?;
        let v: serde_json::Value = match serde_json::from_str(&line) {
            Ok(v) => v,
            Err(_) => {
                emit(&serde_json::json!({"event":"error","detail":"invalid JSON on stdin"}));
                continue;
            }
        };

        let cmd = v.get("cmd").and_then(|x| x.as_str()).unwrap_or("");
        match cmd {
            "start" => {
                if handle.is_some() {
                    emit(&serde_json::json!({"event":"error","detail":"already running"}));
                    continue;
                }

                let token = token.to_string();
                let guild_id = v.get("guild_id").and_then(|x| x.as_str()).unwrap_or("").to_string();
                let channel_id = v.get("channel_id").and_then(|x| x.as_str()).unwrap_or("").to_string();
                let (tx, rx) = tokio::sync::broadcast::channel::<()>(1);
                shutdown = Some(tx);

                let h = tokio::spawn(async move {
                    if let Err(e) = run(&token, &guild_id, &channel_id, Some(rx)).await {
                        eprintln!("capture exited: {e}");
                    }
                });
                handle = Some(h);
                // Announce connection lazily — the driver writes the first wav
                // when RTP starts flowing; `connected` is implied by wav_ready.
            }
            "stop" => {
                if let (Some(h), Some(tx)) = (handle.take(), shutdown.take()) {
                    let _ = tx.send(());
                    let _ = h.await;
                }
            }
            _ => {
                emit(&serde_json::json!({"event":"error","detail":format!("unknown cmd: {cmd}")}));
            }
        }

        // Poll the clips dir for freshly-finalized participant .wavs and emit
        // a wav_ready event once per file. This is zero-touch into voice.rs /
        // wav.rs (no coupling) at the cost of a 200ms poll on a small dir.
        if std::path::Path::exists(&clips_dir) {
            if let Ok(rd) = std::fs::read_dir(&clips_dir) {
                for entry in rd.flatten() {
                    let path = entry.path();
                    if path.extension().and_then(|e| e.to_str()) != Some("wav") {
                        continue;
                    }
                    if seen.insert(path.clone()) {
                        let user_id = path
                            .file_stem()
                            .and_then(|s| s.to_str())
                            .unwrap_or("unknown")
                            .to_string();
                        emit(&serde_json::json!({
                            "event":"wav_ready",
                            "user_id":user_id,
                            "path":path.to_string_lossy()
                        }));
                    }
                }
            }
        }
    }

    // stdin closed: drain any active session then return.
    if let (Some(h), Some(tx)) = (handle, shutdown) {
        let _ = tx.send(());
        let _ = h.await;
    }
    Ok(())
}

/// Core: gateway → voice channel → UDP RTP demux + per-participant .wav.
///
/// In stdio mode the drain signal comes from the parent's `stop` JSON cmd
/// (via `shutdown_rx`); in CLI mode it comes from `SIGINT` (ctrl_c).
async fn run(
    token: &str,
    guild_id: &str,
    channel_id: &str,
    shutdown_rx: Option<tokio::sync::broadcast::Receiver<()>>,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let gateway = Arc::new(DiscordGateway::new(token).await?);

    // Asks Discord to put us in the voice channel; lands VOICE_SERVER_UPDATE
    // (token + endpoint + key) + the VOICE_STATE_UPDATE ssrc table.
    let join = gateway
        .join_voice(&JoinArgs {
            guild_id: guild_id.to_string(),
            channel_id: channel_id.to_string(),
        })
        .await?;
    println!("joined voice channel {channel_id} (endpoint {})", join.endpoint);

    // Spin up the UDP socket + per-participant .wav lanes keyed by SSRC.
    let mut session = VoiceSession::connect(join).await?;
    // Feed the IP-discovered public ip:port back to the gateway (SelectProtocol
    // op 1) so Discord routes incoming RTP to our real 4-tuple instead of :50001.
    if let Some((ip, port)) = session.discovered.clone() {
        gateway.select_protocol(&ip, port).await.ok();
    }
    // Open a lane for every participant already known at join time.
    let ssrcs: Vec<_> = session.ssrc_table.id.keys().copied().collect();
    for ssrc in ssrcs {
        let user_id = session
            .ssrc_table
            .id
            .get(&ssrc)
            .cloned()
            .unwrap_or_else(|| format!("user-{:#x}", ssrc));
        if let Err(e) = session.lane_for(ssrc).await {
            eprintln!("lane open failed for {user_id}: {e}");
        }
    }

    let (tx, rx) = tokio::sync::broadcast::channel::<()>(1);
    let mut h = tokio::spawn(async move {
        if let Err(e) = session.run(rx).await {
            eprintln!("voice session exited: {e}");
        }
    });

    match shutdown_rx {
        Some(mut parent_rx) => {
            // stdio mode: wait for the parent's "stop" (or the session exiting).
            tokio::select! {
                _ = parent_rx.recv() => {}
                _ = &mut h => {}
                // Safety net: never hang forever if the parent vanishes.
                _ = tokio::time::sleep(Duration::from_secs(60)) => {}
            };
        }
        None => {
            // CLI mode: Ctrl-C drains the UDP loop, then leaves the channel.
            tokio::signal::ctrl_c().await?;
        }
    }

    let _ = tx.send(()); // graceful drain of the UDP recv loop
    h.await.ok(); // let run() finish its cleanup + wav Drop finalize
    gateway.leave_voice(guild_id).await;
    Ok(())
}
