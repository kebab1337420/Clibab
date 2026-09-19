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
use std::io::{self, Write};
use std::path::PathBuf;
use std::sync::Arc;
use std::time::Duration;

use clap::Parser;
use discord_voice_capture::gateway::{DiscordGateway, JoinArgs};
use discord_voice_capture::voice::VoiceSession;
use tokio::io::{AsyncBufReadExt, BufReader};

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

/// Emit one JSON object line on the parent's stdio protocol channel.
fn emit(obj: &serde_json::Value) {
    let mut out = io::stdout().lock();
    let _ = writeln!(out, "{}", obj);
    let _ = out.flush();
}

/// Report a fatal setup/runtime problem back to the parent, never panic.
fn emit_error(message: &str) {
    emit(&serde_json::json!({ "type": "error", "message": message }));
}

fn main() -> std::process::ExitCode {
    let args = Args::parse();

    env_logger::init();

    let token = match env::var("DISCORD_TOKEN") {
        Ok(t) => t,
        Err(_) => {
            emit_error("DISCORD_TOKEN env var not set");
            return std::process::ExitCode::from(2);
        }
    };

    let rt = match tokio::runtime::Runtime::new() {
        Ok(rt) => rt,
        Err(e) => {
            emit_error(&format!("failed to start async runtime: {e}"));
            return std::process::ExitCode::FAILURE;
        }
    };

    if args.stdio {
        // Vesktop / native addon host mode: parent drives us over JSON lines.
        return match rt.block_on(async_stdio(&token)) {
            Ok(()) => std::process::ExitCode::SUCCESS,
            Err(e) => {
                emit_error(&e.to_string());
                std::process::ExitCode::FAILURE
            }
        };
    }

    // Legacy CLI mode: positional / env args + Ctrl-C drain.
    let guild_id = match (env::var("GUILD_ID"), args.guild_id) {
        (Ok(g), _) => g,
        (_, Some(g)) => g,
        _ => {
            emit_error("guild_id positional arg or GUILD_ID env required");
            return std::process::ExitCode::from(2);
        }
    };
    let channel_id = env::var("CHANNEL_ID")
        .unwrap_or_else(|_| args.channel_id.clone().unwrap_or_default());

    match rt.block_on(async move { run(&token, &guild_id, &channel_id, None).await }) {
        Ok(()) => std::process::ExitCode::SUCCESS,
        Err(e) => {
            emit_error(&e.to_string());
            std::process::ExitCode::FAILURE
        }
    }
}

/// Parent-driven JSON-IPC loop over stdin/stdout. One capture session per
/// process (the parent spawns a fresh binary for every "start"), so this exits
/// on "stop", when the parent's stdin closes, or when the session ends on its
/// own — which is what lets `native.ts` treat a dead process as "not running".
async fn async_stdio(token: &str) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    // Background poller: announce freshly-finalized participant .wavs on a
    // timer, so live events keep flowing between "start" and "stop" instead of
    // only being emitted when the parent happens to send the next JSON line.
    let clips_dir = PathBuf::from("clips");
    let (poll_tx, mut poll_rx) = tokio::sync::broadcast::channel::<()>(1);
    let poller = tokio::spawn(async move {
        // Snapshot the filenames we have already announced so a poll never
        // double-reports a single .wav (run() finalizes on Drop).
        let mut seen: std::collections::HashSet<PathBuf> = std::collections::HashSet::new();
        let mut interval = tokio::time::interval(Duration::from_millis(200));
        loop {
            tokio::select! {
                _ = poll_rx.recv() => break,
                _ = interval.tick() => {}
            }
            if !clips_dir.exists() {
                continue;
            }
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
    });

    // Parent commands, read async so a capture that ends on its own (e.g. a
    // lost connection) is noticed without waiting for the next JSON line.
    let mut stdin = BufReader::new(tokio::io::stdin()).lines();

    let mut handle: Option<tokio::task::JoinHandle<()>> = None;
    let mut shutdown: Option<tokio::sync::broadcast::Sender<()>> = None;
    // Fires when the spawned capture task ends on its own (disconnect/error).
    let mut session_done: Option<tokio::sync::oneshot::Receiver<()>> = None;

    loop {
        let mut finished = false;
        let line = if let Some(done) = session_done.as_mut() {
            tokio::select! {
                line = stdin.next_line() => line,
                _ = done => {
                    finished = true;
                    Ok(None)
                }
            }
        } else {
            stdin.next_line().await
        };
        if finished {
            break; // connection lost: run() already emitted the disconnected event
        }

        let Some(line) = line? else { break }; // stdin EOF: the parent is gone
        if line.trim().is_empty() {
            continue;
        }
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
                let (done_tx, done_rx) = tokio::sync::oneshot::channel();
                shutdown = Some(tx);
                session_done = Some(done_rx);

                let h = tokio::spawn(async move {
                    if let Err(e) = run(&token, &guild_id, &channel_id, Some(rx)).await {
                        emit_error(&e.to_string());
                    }
                    let _ = done_tx.send(());
                });
                handle = Some(h);
            }
            "stop" => {
                if let (Some(h), Some(tx)) = (handle.take(), shutdown.take()) {
                    let _ = tx.send(());
                    let _ = h.await;
                }
                // One session per process: a stop finishes this one for good.
                return Ok(());
            }
            _ => {
                emit(&serde_json::json!({"event":"error","detail":format!("unknown cmd: {cmd}")}));
            }
        }
    }

    // stdin closed (parent gone) or the session ended on its own: stop the
    // poller, then drain any session that is still running.
    let _ = poll_tx.send(());
    let _ = poller.await;
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
    enum StopCause {
        Parent,
        Session,
        Gateway,
    }

    let gateway = Arc::new(DiscordGateway::new(token).await?);

    // Asks Discord to put us in the voice channel; lands VOICE_SERVER_UPDATE
    // (token + endpoint + key) + the VOICE_STATE_UPDATE ssrc table.
    let join = gateway
        .join_voice(&JoinArgs {
            guild_id: guild_id.to_string(),
            channel_id: channel_id.to_string(),
        })
        .await?;
    emit(&serde_json::json!({
        "type": "connected",
        "guild_id": guild_id,
        "channel_id": channel_id,
        "endpoint": join.endpoint.to_string()
    }));

    // Spin up the UDP socket + per-participant .wav lanes keyed by SSRC.
    let mut session = VoiceSession::connect(join).await?;
    // Open a lane for every participant already known at join time.
    let ssrcs: Vec<_> = session.ssrc_table.id.keys().copied().collect();
    for ssrc in ssrcs {
        let user_id = session
            .ssrc_table
            .id
            .get(&ssrc)
            .cloned()
            .unwrap_or_else(|| format!("user-{:#x}", ssrc));
        if let Err(e) = session.lane_for(ssrc) {
            eprintln!("lane open failed for {user_id}: {e}");
        }
    }

    let (tx, rx) = tokio::sync::broadcast::channel::<()>(1);
    let mut h = tokio::spawn(async move {
        if let Err(e) = session.run(rx).await {
            eprintln!("voice session exited: {e}");
        }
    });

    let cause = match shutdown_rx {
        Some(mut parent_rx) => {
            // stdio mode: stop when the parent asks, or when the gateway
            // connection is lost while the parent is still listening. There is
            // no wall-clock watchdog: the parent's death shows up as stdin EOF
            // in `async_stdio`, so a long capture is never cut short.
            let gw_closed = gateway.closed();
            tokio::pin!(gw_closed);
            tokio::select! {
                _ = parent_rx.recv() => StopCause::Parent,
                _ = &mut h => StopCause::Session,
                reason = &mut gw_closed => {
                    let detail = reason.unwrap_or_else(|| "gateway connection closed".to_string());
                    emit(&serde_json::json!({ "type": "disconnected", "detail": detail }));
                    StopCause::Gateway
                }
            }
        }
        None => {
            // CLI mode: Ctrl-C drains the UDP loop, then leaves the channel.
            tokio::signal::ctrl_c().await?;
            StopCause::Parent
        }
    };

    let _ = tx.send(()); // graceful drain of the UDP recv loop
    h.await.ok(); // let run() finish its cleanup + wav Drop finalize

    // The stream was lost while the parent was still alive: say so before
    // tearing down (the gateway-close case already emitted its reason above).
    if matches!(cause, StopCause::Session) {
        emit(&serde_json::json!({ "type": "disconnected", "detail": "voice session ended unexpectedly" }));
    }

    gateway.leave_voice(guild_id).await;
    Ok(())
}