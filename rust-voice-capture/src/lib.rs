//! Per-participant Discord voice capture — library crate.
//!
//! Exposes the gateway handshake (`gateway`) and the UDP demux/decode loop
//! (`voice`) that turn one voice channel into N `.wav` files.

pub mod gateway;
pub mod voice;
pub mod wav;
