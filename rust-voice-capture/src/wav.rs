//! Minimal .wav writer for a single participant, via the `hound` crate.
//!
//! One .wav per participant (named `<user_id>.wav` in `./clips/`). Using
//! `hound` (instead of hand-rolling RIFF headers like the sub-agent version)
//! avoids the seek-to-zero bug and the `pcm_bytemuck` dead code.

use std::io;
use std::path::Path;
use std::sync::Mutex;

/// One .wav = one participant. Created on first sighting of the user's SSRC.
pub struct ParticipantWav {
    writer: Mutex<hound::WavWriter<std::io::BufWriter<std::fs::File>>>,
}

impl ParticipantWav {
    pub fn create(path: &str) -> io::Result<Self> {
        // Ensure the clips dir exists.
        let prefix = Path::new(path)
            .parent()
            .filter(|p| !p.as_os_str().is_empty())
            .unwrap_or_else(|| Path::new("."));
        std::fs::create_dir_all(prefix)?;

        let writer = hound::WavWriter::create(path, hound::WavSpec {
            channels: 2,
            sample_rate: 48000,
            bits_per_sample: 16,
            sample_format: hound::SampleFormat::Int,
        }).map_err(|e| io::Error::other(e.to_string()))?;
        Ok(ParticipantWav {
            writer: Mutex::new(writer),
        })
    }

    /// `samples` is interleaved [L0, R0, L1, R1, ...].
    pub fn write_samples(&self, samples: &[f32]) -> io::Result<()> {
        let mut w = self.writer.lock().unwrap();
        for chunk in samples.chunks_exact(2) {
            let l = (chunk[0].clamp(-1.0, 1.0) * i16::MAX as f32) as i16;
            let r = (chunk[1].clamp(-1.0, 1.0) * i16::MAX as f32) as i16;
            w.write_sample(l).map_err(hound_to_io)?;
            w.write_sample(r).map_err(hound_to_io)?;
        }
        Ok(())
    }

    pub fn flush(&self) -> io::Result<()> {
        // hound's BufWriter-backed WavWriter finalizes the RIFF header length in
        // its own Drop, which this Mutex is dropped into — so flushing just
        // drains the BufWriter here; the size patch is written at Drop time.
        self.writer.lock().unwrap().flush().map_err(|e| io::Error::other(e.to_string()))?;
        Ok(())
    }
}

fn hound_to_io(e: hound::Error) -> io::Error {
    io::Error::other(e.to_string())
}

impl Drop for ParticipantWav {
    fn drop(&mut self) {
        // hound's WavWriter Drop re-writes the RIFF chunk size; drain the
        // BufWriter by flushing first, then let the writer Drop finalize.
        let _ = self.flush();
    }
}
