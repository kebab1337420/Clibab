/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/*
 * Vencord Clipper - isolating a voice out of a mixed call recording.
 *
 * The speech-band notch (`voiceBand.ts`, driven by `voiceDuckAt`) can only
 * turn the whole band down while a muted person is audible: two voices are
 * the same samples. What it cannot know is *whose* energy a bin holds - but
 * the clip usually does. Whoever speaks alone for a stretch hands over their
 * spectral fingerprint for free, and an overlap of familiar voices can then
 * be unpicked per frequency bin instead of ducked as one band.
 *
 * So this module learns one average magnitude spectrum per person from their
 * solo stretches, and a worklet node below applies a smoothed ratio mask
 * (theirs out, the rest kept) only while a muted person is actually audible.
 * No solo data, indistinguishable voices, or no mute at all: the node is
 * never built and the notch path runs exactly as before.
 */

import type { VoiceTrack } from "./voice";
import { VOICE_HZ } from "./voice";

/** STFT frame, in samples. Bins follow as frame/2 + 1. */
export const MASK_FRAME = 1024;
/** Hop between frames, in samples. */
export const MASK_HOP = 256;
/** Floor of the mask: what leaks through is game under speech, not a voice. */
export const MASK_FLOOR = 0.05;
/** Per-hop smoothing of the gains: sudden bins read as musical noise. */
export const MASK_SMOOTH = 0.3;
/** Cosine past which two voice prints count as the same voice. */
const SIMILARITY_LIMIT = 0.93;
/** Solo stretch shorter than this teaches nothing (a few hundred ms). */
const MIN_SOLO_FRAMES = 30;
/** Activity threshold, mirroring the lane reader. */
const ACTIVE_AT = 0.12;

/** In-place radix-2 FFT over separate real/imaginary arrays. */
export function fft(re: Float32Array, im: Float32Array, invert: boolean): void {
    const n = re.length;

    for (let i = 1, j = 0; i < n; i++) {
        let bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;

        if (i < j) {
            let t = re[i]; re[i] = re[j]; re[j] = t;
            t = im[i]; im[i] = im[j]; im[j] = t;
        }
    }

    for (let len = 2; len <= n; len <<= 1) {
        const ang = (2 * Math.PI) / len * (invert ? -1 : 1);
        const wr = Math.cos(ang);
        const wi = Math.sin(ang);

        for (let i = 0; i < n; i += len) {
            let cwr = 1;
            let cwi = 0;

            for (let k = 0; k < len / 2; k++) {
                const ur = re[i + k];
                const ui = im[i + k];
                const vr = re[i + k + len / 2] * cwr - im[i + k + len / 2] * cwi;
                const vi = re[i + k + len / 2] * cwi + im[i + k + len / 2] * cwr;

                re[i + k] = ur + vr;
                im[i + k] = ui + vi;
                re[i + k + len / 2] = ur - vr;
                im[i + k + len / 2] = ui - vi;

                const nwr = cwr * wr - cwi * wi;
                cwi = cwr * wi + cwi * wr;
                cwr = nwr;
            }
        }
    }

    if (invert) {
        for (let i = 0; i < n; i++) {
            re[i] /= n;
            im[i] /= n;
        }
    }
}

function hannWindow(size: number): Float32Array {
    const window = new Float32Array(size);
    for (let n = 0; n < size; n++) window[n] = 0.5 * (1 - Math.cos((2 * Math.PI * n) / size));

    return window;
}

/** Average magnitude spectrum of one channel, for learning and tests. */
export function averageSpectrum(pcm: Float32Array): Float32Array {
    const bins = MASK_FRAME / 2 + 1;
    const out = new Float32Array(bins);
    const window = hannWindow(MASK_FRAME);

    const re = new Float32Array(MASK_FRAME);
    const im = new Float32Array(MASK_FRAME);
    let frames = 0;

    for (let s = 0; s + MASK_FRAME <= pcm.length; s += MASK_HOP) {
        for (let n = 0; n < MASK_FRAME; n++) {
            re[n] = pcm[s + n] * window[n];
            im[n] = 0;
        }

        fft(re, im, false);

        for (let k = 0; k < bins; k++) out[k] += Math.hypot(re[k], im[k]);
        frames++;
    }

    if (frames) for (let k = 0; k < bins; k++) out[k] /= frames;

    return out;
}

export interface LaneInput {
    userId: string;
    /** Activity samples at hz per second, 0-255 like the voice lanes. */
    levels: Uint8Array;
}

/**
 * One spectral fingerprint per person, learned from their solo stretches.
 *
 * A frame belongs to whoever is alone in it; frames where nobody, or more
 * than one body, is active teach nothing. People without enough solo time
 * get no print rather than a bad one.
 */
export function learnProfiles(
    pcm: Float32Array,
    sampleRate: number,
    lanes: LaneInput[],
    hz: number
): Map<string, Float32Array> {
    const bins = MASK_FRAME / 2 + 1;
    const window = hannWindow(MASK_FRAME);
    const sums = new Map<string, { sum: Float32Array; count: number; }>();

    const re = new Float32Array(MASK_FRAME);
    const im = new Float32Array(MASK_FRAME);

    for (let s = 0; s + MASK_FRAME <= pcm.length; s += MASK_HOP) {
        const laneIndex = Math.floor(((s + MASK_FRAME / 2) / sampleRate) * hz);

        let solo: string | null = null;
        let crowded = false;

        for (const lane of lanes) {
            if ((lane.levels[laneIndex] ?? 0) / 255 <= ACTIVE_AT) continue;

            if (solo === null) solo = lane.userId;
            else {
                crowded = true;
                break;
            }
        }

        if (solo === null || crowded) continue;

        for (let n = 0; n < MASK_FRAME; n++) {
            re[n] = pcm[s + n] * window[n];
            im[n] = 0;
        }

        fft(re, im, false);

        let entry = sums.get(solo);
        if (!entry) {
            entry = { sum: new Float32Array(bins), count: 0 };
            sums.set(solo, entry);
        }

        for (let k = 0; k < bins; k++) entry.sum[k] += Math.hypot(re[k], im[k]);
        entry.count++;
    }

    const profiles = new Map<string, Float32Array>();
    for (const [userId, entry] of sums) {
        if (entry.count < MIN_SOLO_FRAMES) continue;

        for (let k = 0; k < bins; k++) entry.sum[k] /= entry.count;
        profiles.set(userId, entry.sum);
    }

    return profiles;
}

/** Cosine similarity of two spectra, for the same-voice guard. */
export function cosineSimilarity(a: Float32Array, b: Float32Array): number {
    let dot = 0;
    let aa = 0;
    let bb = 0;

    for (let k = 0; k < a.length; k++) {
        dot += a[k] * b[k];
        aa += a[k] * a[k];
        bb += b[k] * b[k];
    }

    if (aa <= 0 || bb <= 0) return 0;

    return dot / Math.sqrt(aa * bb);
}

function summed(profiles: Map<string, Float32Array>, ids: string[]): Float32Array | null {
    let out: Float32Array | null = null;

    for (const id of ids) {
        const spectrum = profiles.get(id);
        if (!spectrum) continue;

        if (!out) out = new Float32Array(spectrum.length);
        for (let k = 0; k < spectrum.length; k++) out[k] += spectrum[k];
    }

    return out;
}

/**
 * Per-bin keep gains for an overlap: what is likely the others stays.
 *
 * Pure, so the worklet below mirrors it and the tests pin it: same inputs,
 * same gains, no drift between the two copies.
 */
export function maskGains(
    profiles: Map<string, Float32Array>,
    muted: string[],
    others: string[],
    floor = MASK_FLOOR
): Float32Array | null {
    const first = profiles.values().next();
    if (first.done) return null;

    const bins = first.value.length;
    const x = summed(profiles, muted);
    if (!x) return null;

    const o = summed(profiles, others);
    if (!o) {
        // Nobody else in the print set: whatever is audible is the muted
        // voice (and the game, which lives outside every print).
        return new Float32Array(bins);
    }

    const gains = new Float32Array(bins);
    for (let k = 0; k < bins; k++) {
        const xx = x[k] * x[k];
        const oo = o[k] * o[k];
        const gain = oo / (xx + oo + 1e-12);

        gains[k] = Math.min(1, Math.max(floor, gain));
    }

    return gains;
}

export interface MaskPlan {
    /** Muted users a print exists for: the only ones the mask may touch. */
    muted: string[];
    /** False when there is nothing to isolate with: the notch path runs. */
    engaged: boolean;
}

/**
 * Decides once per render whether the mask runs at all.
 *
 * Needs a muted user with a print; refuses when that print looks like
 * everybody else's (same microphone twice, one person twice under two ids),
 * where the mask would muffle the call for no isolation.
 */
export function planMask(profiles: Map<string, Float32Array>, levels: Record<string, number> | undefined): MaskPlan {
    const muted = [...profiles.keys()].filter(id => {
        const value = Number(levels?.[id]);

        return Number.isFinite(value) && value === 0;
    });

    if (!muted.length) return { muted: [], engaged: false };

    const x = summed(profiles, muted);
    const o = summed(profiles, [...profiles.keys()].filter(id => !muted.includes(id)));

    if (!x || !o) return { muted, engaged: true };
    if (cosineSimilarity(x, o) > SIMILARITY_LIMIT) return { muted: [], engaged: false };

    return { muted, engaged: true };
}

/*
 * The worklet twin of the math above.
 *
 * An AudioWorklet module cannot import this file, so the constants below are
 * injected into the source and the FFT and gain rule mirror `fft` and
 * `maskGains` - same inputs, same gains. Touched together or not at all.
 *
 * Two deliberate properties: the windowed overlap-add divides by the summed
 * window (a Hann applied twice is a gain, not unity), and the whole mix
 * leaves ~one frame late (~21ms at 48kHz) - constant, under lip-sync notice,
 * paid by every source through the node whether the mask is working or not.
 */
const WORKLET_SOURCE = `
"use strict";
var W = ${MASK_FRAME}, H = ${MASK_HOP}, BINS = ${MASK_FRAME / 2 + 1}, FLOOR = ${MASK_FLOOR}, SMOOTH = ${MASK_SMOOTH};
function hann() {
    var w = new Float32Array(W);
    for (var n = 0; n < W; n++) w[n] = 0.5 * (1 - Math.cos(2 * Math.PI * n / W));
    return w;
}
var HANN = hann();
function fft(re, im, invert) {
    var n = re.length, i, j, bit, len, k, t, ur, ui, vr, vi, ang, wr, wi, cwr, cwi, nwr;
    for (i = 1, j = 0; i < n; i++) {
        bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) {
            t = re[i]; re[i] = re[j]; re[j] = t;
            t = im[i]; im[i] = im[j]; im[j] = t;
        }
    }
    for (len = 2; len <= n; len <<= 1) {
        ang = 2 * Math.PI / len * (invert ? -1 : 1);
        wr = Math.cos(ang); wi = Math.sin(ang);
        for (i = 0; i < n; i += len) {
            cwr = 1; cwi = 0;
            for (k = 0; k < len / 2; k++) {
                ur = re[i + k]; ui = im[i + k];
                vr = re[i + k + len / 2] * cwr - im[i + k + len / 2] * cwi;
                vi = re[i + k + len / 2] * cwi + im[i + k + len / 2] * cwr;
                re[i + k] = ur + vr; im[i + k] = ui + vi;
                re[i + k + len / 2] = ur - vr; im[i + k + len / 2] = ui - vi;
                nwr = cwr * wr - cwi * wi;
                cwi = cwr * wi + cwi * wr; cwr = nwr;
            }
        }
    }
    if (invert) for (i = 0; i < n; i++) { re[i] /= n; im[i] /= n; }
}
class ClipperMask extends AudioWorkletProcessor {
    constructor() {
        super();
        this.ibuf = new Float32Array(W + 256);
        this.ilen = 0;
        this.obuf = new Float32Array(W + 256);
        this.wsum = new Float32Array(W + 256);
        this.olen = 0;
        this.gains = new Float32Array(BINS).fill(1);
        this.tgt = new Float32Array(BINS);
        this.profiles = new Map();
        this.muted = [];
        this.others = [];
        this.re = new Float32Array(W);
        this.im = new Float32Array(W);
        var self = this;
        this.port.onmessage = function (e) {
            var m = e.data || {};
            if (m.type === "profiles") {
                self.profiles = new Map((m.users || []).map(function (u) { return [u.id, Float32Array.from(u.spectrum)]; }));
            } else if (m.type === "frame") {
                self.muted = m.muted || [];
                self.others = m.others || [];
            }
        };
    }
    target() {
        var x = null, o = null, i, k, s;
        for (i = 0; i < this.muted.length; i++) {
            s = this.profiles.get(this.muted[i]);
            if (!s) continue;
            if (!x) x = new Float32Array(s.length);
            for (k = 0; k < s.length; k++) x[k] += s[k];
        }
        if (!x) { this.tgt.fill(1); return; }
        for (i = 0; i < this.others.length; i++) {
            s = this.profiles.get(this.others[i]);
            if (!s) continue;
            if (!o) o = new Float32Array(s.length);
            for (k = 0; k < s.length; k++) o[k] += s[k];
        }
        if (!o) { this.tgt.fill(0); return; }
        for (k = 0; k < this.tgt.length; k++) {
            var xx = x[k] * x[k], oo = o[k] * o[k];
            var g = oo / (xx + oo + 1e-12);
            this.tgt[k] = Math.min(1, Math.max(FLOOR, g));
        }
    }
    process(inputs, outputs) {
        var input = inputs[0], output = outputs[0];
        if (!input || !input.length || !output || !output.length) return true;
        var inch = input[0], nCh = input.length, need = output[0].length, c, i, k;
        if (this.ilen + inch.length > this.ibuf.length) {
            var keep = Math.min(this.ilen, W);
            this.ibuf.copyWithin(0, this.ilen - keep, this.ilen);
            this.ilen = keep;
        }
        this.ibuf.set(inch, this.ilen);
        this.ilen += inch.length;
        while (this.ilen >= W) {
            for (k = 0; k < W; k++) { this.re[k] = this.ibuf[k] * HANN[k]; this.im[k] = 0; }
            fft(this.re, this.im, false);
            this.target();
            for (k = 0; k < BINS; k++) {
                var g = this.gains[k] + (this.tgt[k] - this.gains[k]) * SMOOTH;
                this.gains[k] = g;
                this.re[k] *= g; this.im[k] *= g;
            }
            for (k = BINS; k < W; k++) {
                var m = W - k;
                this.re[k] = this.re[m];
                this.im[k] = -this.im[m];
            }
            fft(this.re, this.im, true);
            for (k = 0; k < W; k++) {
                this.obuf[k] = (k < this.olen ? this.obuf[k] : 0) + this.re[k] * HANN[k];
                this.wsum[k] = (k < this.olen ? this.wsum[k] : 0) + HANN[k] * HANN[k];
            }
            if (this.olen < W) this.olen = W;
            this.ibuf.copyWithin(0, H, this.ilen);
            this.ilen -= H;
        }
        // One masked mix for every channel: voices arrive mono-mixed here.
        for (c = 0; c < nCh; c++) {
            var outch = output[c];
            for (i = 0; i < need; i++) {
                outch[i] = i < this.olen && this.wsum[i] > 1e-9 ? this.obuf[i] / this.wsum[i] : 0;
            }
        }
        if (this.olen >= need) {
            this.obuf.copyWithin(0, need, this.olen);
            this.wsum.copyWithin(0, need, this.olen);
            this.olen -= need;
        } else {
            this.olen = 0;
        }
        return true;
    }
}
registerProcessor("clipper-mask", ClipperMask);
`;

/*
 * The round trip costs one frame of latency (~19ms at 48kHz: the first
 * frames leave as silence while the ring fills). Constant, so the whole
 * mix shifts together and nothing drifts - and far under what lip-sync
 * notices. Only masked sources pay it; the notch path never enters here.
 */

export interface MaskHandle {
    node: AudioWorkletNode;
    setProfiles(profiles: Map<string, Float32Array>): void;
    /** Muted voices now audible, and the other voices heard with them. */
    setFrame(muted: string[], others: string[]): void;
    disconnect(): void;
}

let moduleUrl: string | null = null;
let moduleFor: BaseAudioContext | null = null;

/** A mask node on this context, with the worklet module loaded behind it. */
export async function createMaskNode(ctx: BaseAudioContext): Promise<MaskHandle> {
    if (moduleFor !== ctx) {
        if (moduleUrl) URL.revokeObjectURL(moduleUrl);

        moduleUrl = URL.createObjectURL(new Blob([WORKLET_SOURCE], { type: "application/javascript" }));
        try {
            await ctx.audioWorklet.addModule(moduleUrl);
        } catch (e) {
            // A rejected module must not leak its URL nor poison the cache:
            // without this every retry mints another blob URL that nothing
            // ever revokes.
            URL.revokeObjectURL(moduleUrl);
            moduleUrl = null;
            throw e;
        }
        moduleFor = ctx;
    }

    const node = new AudioWorkletNode(ctx, "clipper-mask");
    let lastSent = "";

    return {
        node,
        setProfiles(profiles) {
            node.port.postMessage({
                type: "profiles",
                users: [...profiles].map(([id, spectrum]) => ({ id, spectrum }))
            });
        },
        setFrame(muted, others) {
            const key = `${muted.join(",")}|${others.join(",")}`;
            if (key === lastSent) return;
            lastSent = key;

            node.port.postMessage({ type: "frame", muted, others });
        },
        disconnect() {
            // The port first: a worklet whose node is disconnected but whose
            // port stays open keeps its thread and its profile listeners.
            try {
                node.port.onmessage = null;
                node.port.close();
            } catch { /* already gone with the context */ }
            try {
                node.disconnect();
            } catch {
                // Already gone with the context.
            }
        }
    };
}

/** Drops the cached worklet module, for the end of a render. */
export function dropMaskModule(): void {
    if (moduleUrl) URL.revokeObjectURL(moduleUrl);
    moduleUrl = null;
    moduleFor = null;
}

/** Decoded prints, remembered across renders of one session. */
const profileCache = new Map<string, { rate: number; profiles: Map<string, Float32Array>; }>();

function mixMono(buffer: AudioBuffer): Float32Array {
    if (buffer.numberOfChannels < 2) return buffer.getChannelData(0).slice();

    const out = new Float32Array(buffer.length);
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const data = buffer.getChannelData(channel);
        for (let i = 0; i < out.length; i++) out[i] += data[i] / buffer.numberOfChannels;
    }

    return out;
}

/**
 * One print per person heard across these sources, learned from each file's
 * own solo stretches and averaged where somebody spans several.
 *
 * Decoding is the cost, so prints are remembered per source for the session.
 * A source that will not decode simply teaches nothing; the render falls
 * back to the notch path for everybody.
 */
export async function learnRenderProfiles(
    sources: { id: string; url: string; voices?: VoiceTrack[]; }[],
    ctx: BaseAudioContext
): Promise<Map<string, Float32Array>> {
    const merged = new Map<string, { sum: Float32Array; count: number; }>();

    for (const source of sources) {
        if (!source.voices?.length) continue;

        let cached = profileCache.get(source.id);
        if (!cached || cached.rate !== ctx.sampleRate) {
            const data = await (await fetch(source.url)).arrayBuffer();
            const decoded = await ctx.decodeAudioData(data);
            const learned = learnProfiles(
                mixMono(decoded),
                decoded.sampleRate,
                source.voices.map(voice => ({ userId: voice.id, levels: voice.levels })),
                VOICE_HZ
            );

            cached = { rate: decoded.sampleRate, profiles: learned };
            profileCache.set(source.id, cached);

            while (profileCache.size > 8) {
                const oldest = profileCache.keys().next();
                if (oldest.done) break;
                profileCache.delete(oldest.value);
            }
        }

        for (const [userId, spectrum] of cached.profiles) {
            let slot = merged.get(userId);
            if (!slot) {
                slot = { sum: new Float32Array(spectrum.length), count: 0 };
                merged.set(userId, slot);
            }

            for (let k = 0; k < spectrum.length; k++) slot.sum[k] += spectrum[k];
            slot.count++;
        }
    }

    const out = new Map<string, Float32Array>();
    for (const [userId, slot] of merged) {
        for (let k = 0; k < slot.sum.length; k++) slot.sum[k] /= slot.count;
        out.set(userId, slot.sum);
    }

    return out;
}
