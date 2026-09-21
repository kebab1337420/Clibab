/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/*
 * The measuring half of `laneMix.ts`, shipped to a real worker.
 *
 * Moving the first volume slider in the studio runs `prepare`: an envelope for
 * the bed and one per track, a per-sentence lag search and a per-track level
 * match. On a long clip that is seconds of arithmetic, all of it on the
 * renderer's single thread, which is what the freeze was. The work lives here
 * instead.
 *
 * The renderer bundles into one IIFE and has no worker entry points, so this
 * file is not a second chunk esbuild emits: the worker is built at runtime
 * from the source of `laneMixWorker()` below, put behind a Blob URL and
 * started. Everything that function needs therefore has to live inside it -
 * nothing it touches may come from an import.
 *
 * Every constant in that function has a twin in `laneMix.ts`, and every step
 * is a copy of one in `prepareChunked` there. They are the same number and the
 * same code on purpose, so the worker's answer is byte-identical to the
 * thread's; if one side is tuned, tune the other. `laneMix.ts` keeps the
 * original functions and runs them itself whenever a worker cannot be started.
 */

/** What the worker measures: the bed's loudness curve and each track's. */
export interface LanePreparation {
    bedEnvelope: Float32Array;
    lanes: { offset: number; gain: number; rms: Float32Array; gate: Float32Array; }[];
}

/** A raw track as the worker needs it: clock offset and first channel only. */
interface LaneForWorker {
    offset: number;
    buffer: AudioBuffer;
}

interface WorkerInput {
    bed: Float32Array | null;
    bedRate: number;
    bedOffset: number;
    points: number;
    lanes: { offset: number; rate: number; samples: Float32Array; }[];
}

interface WorkerReply {
    id: number;
    result: LanePreparation;
}

/**
 * How long one job may take in the worker before it is given up on.
 *
 * A clip this plugin records is around a minute, which is a few seconds of
 * worker arithmetic at most. Anything past this is a worker that has stopped
 * answering, and a promise that never settles would strand the render.
 */
const WORKER_TIMEOUT = 30_000;

/** `undefined` while untried, a live worker once one runs, null when dead. */
let worker: Worker | null | undefined;
let nextId = 1;

const pending = new Map<number, {
    resolve: (value: LanePreparation) => void;
    reject: (reason: unknown) => void;
    timer: number;
}>();

function startWorker(): Worker | null {
    try {
        const source = `(${laneMixWorker.toString()})()`;
        const url = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
        const created = new Worker(url);

        // Revoked at once: the worker holds its own copy, and the URL would
        // otherwise sit in the blob store for the rest of the session.
        URL.revokeObjectURL(url);

        created.onmessage = (event: MessageEvent) => {
            const reply = event.data as WorkerReply;
            const entry = pending.get(reply.id);
            if (!entry) return;
            pending.delete(reply.id);
            entry.resolve(reply.result);
        };

        created.onerror = event => {
            worker = null;
            const list = [...pending.values()];
            pending.clear();
            for (const entry of list) {
                clearTimeout(entry.timer);
                entry.reject(new Error(event.message || "laneMix worker failed"));
            }
        };

        return created;
    } catch {
        return null;
    }
}

/** Drops the worker and every job still travelling to it. */
function loseWorker(): void {
    worker?.terminate();
    worker = null;

    const list = [...pending.values()];
    pending.clear();
    for (const entry of list) {
        clearTimeout(entry.timer);
        entry.reject(new Error("laneMix worker unusable"));
    }
}

/**
 * Hand back the running worker, after a quick ping proves one can run at all.
 *
 * A CSP that will not host a blob worker fails here - construction can succeed
 * while every message it carries is refused - and is then never tried again.
 */
async function readyWorker(): Promise<Worker | null> {
    if (worker !== undefined) return worker;
    worker = startWorker();
    if (!worker) return null;

    const answered = await new Promise<boolean>(resolve => {
        const id = nextId++;
        const timer = window.setTimeout(() => {
            pending.delete(id);
            resolve(false);
        }, 500);

        pending.set(id, {
            resolve() { clearTimeout(timer); resolve(true); },
            reject() { clearTimeout(timer); resolve(false); },
            timer
        });

        try {
            worker!.postMessage({
                id,
                input: { bed: null, bedRate: 48_000, bedOffset: 0, points: 2, lanes: [] }
            });
        } catch {
            clearTimeout(timer);
            pending.delete(id);
            resolve(false);
        }
    });

    if (answered && worker) return worker;

    loseWorker();
    return null;
}

/**
 * Sends the measurement to the worker, or answers null when none can run.
 *
 * The track bytes are copied rather than transferred: the same decoded buffers
 * answer every later slider movement and the render, so they have to stay here.
 */
export async function prepareRemote(
    bed: AudioBuffer | null,
    bedOffset: number,
    raw: LaneForWorker[],
    points: number
): Promise<LanePreparation | null> {
    const ready = await readyWorker();
    if (!ready) return null;

    const id = nextId++;
    const input: WorkerInput = {
        bed: bed ? bed.getChannelData(0) : null,
        bedRate: bed?.sampleRate ?? 0,
        bedOffset,
        points,
        lanes: raw.map(lane => ({
            offset: lane.offset,
            rate: lane.buffer.sampleRate,
            samples: lane.buffer.getChannelData(0)
        }))
    };

    return await new Promise((resolve, reject) => {
        const timer = window.setTimeout(() => {
            pending.delete(id);
            loseWorker();
            reject(new Error("laneMix worker timed out"));
        }, WORKER_TIMEOUT);

        pending.set(id, {
            resolve(value) { clearTimeout(timer); resolve(value); },
            reject(reason) { clearTimeout(timer); reject(reason); },
            timer
        });

        try {
            worker!.postMessage({ id, input });
        } catch (e) {
            clearTimeout(timer);
            pending.delete(id);
            loseWorker();
            reject(e);
        }
    });
}

/*
 * Everything below is the one function that becomes the worker's source.
 *
 * Keep it self-contained: it is copied out by `toString`, so it must not
 * reference anything from this module. Its math is the twin of `laneMix.ts`'s
 * `prepareChunked`.
 */
function laneMixWorker(): void {
    const ENV_HZ = 50;
    const BAND_LO = 200;
    const BAND_HI = 4000;
    const ENV_FLOOR = 0.015;
    const GATE_FLOOR = 0.002;
    const PAD_AHEAD = 0.12;
    const PAD_BEHIND = 0.35;
    const LAG_SPAN = 8;
    const MAX_LAG = 25;
    const LAG_FIT = 0.25;
    const MATCH_HOPS = 15;
    const MATCH_MIN = 0.2;
    const MATCH_MAX = 4;

    /** Speech-band RMS per hop of one channel, on the clip's clock. */
    function envelopeOf(data: Float32Array, rate: number, offset: number, points: number): Float32Array {
        const out = new Float32Array(points);
        const hop = Math.max(1, Math.round(rate / ENV_HZ));

        const lowCoeff = Math.exp((-2 * Math.PI * BAND_HI) / rate);
        const highCoeff = Math.exp((-2 * Math.PI * BAND_LO) / rate);

        let low = 0;
        let high = 0;

        let at = Math.round(offset * ENV_HZ);

        let sum = 0;
        let taken = 0;

        for (let i = 0; i < data.length; i++) {
            low = lowCoeff * low + (1 - lowCoeff) * data[i];
            high = highCoeff * high + (1 - highCoeff) * low;

            const value = low - high;
            sum += value * value;

            if (++taken < hop) continue;

            if (at >= 0 && at < points) out[at] = Math.sqrt(sum / hop);

            at++;
            sum = 0;
            taken = 0;

            if (at >= points) break;
        }

        return out;
    }

    /** Turns loudness into a 0/1 gate, opened either side of every loud hop. */
    function gateOf(rms: Float32Array, floor: number, ahead: number, behind: number): Float32Array {
        const gate = new Float32Array(rms.length);
        const before = Math.round(ahead * ENV_HZ);
        const after = Math.round(behind * ENV_HZ);

        for (let i = 0; i < rms.length; i++) {
            if (rms[i] < floor) continue;

            const from = Math.max(0, i - before);
            const to = Math.min(rms.length - 1, i + after);

            for (let j = from; j <= to; j++) gate[j] = 1;
        }

        return gate;
    }

    /** How alike two envelopes are with the lane held `lag` points later. */
    function correlate(
        bed: Float32Array,
        lane: Float32Array,
        lag: number,
        from = 0,
        to = lane.length
    ): number {
        let count = 0;
        let bedMean = 0;
        let laneMean = 0;

        for (let i = from; i < to; i++) {
            const at = i - lag;
            if (at < 0 || at >= bed.length) continue;

            bedMean += bed[at];
            laneMean += lane[i];
            count++;
        }

        if (count < 8) return -1;

        bedMean /= count;
        laneMean /= count;

        let bedVar = 0;
        let laneVar = 0;
        let joint = 0;

        for (let i = from; i < to; i++) {
            const at = i - lag;
            if (at < 0 || at >= bed.length) continue;

            const a = bed[at] - bedMean;
            const b = lane[i] - laneMean;

            bedVar += a * a;
            laneVar += b * b;
            joint += a * b;
        }

        if (bedVar <= 0 || laneVar <= 0) return -1;

        return joint / Math.sqrt(bedVar * laneVar);
    }

    /** Where a stretch of an envelope sits best against the bed's. */
    function bestLag(
        bed: Float32Array,
        lane: Float32Array,
        from = 0,
        to = lane.length
    ): { lag: number; fit: number; } {
        let lag = 0;
        let fit = -1;

        for (let candidate = -MAX_LAG; candidate <= MAX_LAG; candidate++) {
            const score = correlate(bed, lane, candidate, from, to);

            if (score > fit) {
                fit = score;
                lag = candidate;
            }
        }

        return { lag, fit };
    }

    /** The offset this track's sentences agree on, as a weighted median. */
    function sentenceLag(bed: Float32Array, lane: Float32Array): { lag: number; fit: number; } {
        const votes: { lag: number; fit: number; }[] = [];

        for (let i = 0; i < lane.length; i++) {
            if (lane[i] < ENV_FLOOR) continue;

            let end = i;
            while (end + 1 < lane.length && lane[end + 1] >= ENV_FLOOR) end++;

            if (end + 1 - i >= LAG_SPAN) {
                const scored = bestLag(bed, lane, i, end + 1);
                if (scored.fit >= LAG_FIT) votes.push(scored);
            }

            i = end;
        }

        if (!votes.length) return { lag: 0, fit: -1 };

        votes.sort((a, b) => a.lag - b.lag);

        let total = 0;
        for (const vote of votes) total += vote.fit;

        let seen = 0;

        for (const vote of votes) {
            seen += vote.fit;
            if (seen * 2 >= total) return vote;
        }

        return votes[votes.length - 1];
    }

    /** The same envelope moved `by` points later, or earlier when negative. */
    function shiftBy(rms: Float32Array, by: number): Float32Array {
        if (!by) return rms;

        const out = new Float32Array(rms.length);

        if (by > 0) out.set(rms.subarray(0, rms.length - by), by);
        else out.set(rms.subarray(-by), 0);

        return out;
    }

    /** How much to rescale a track so it sits where the bed has it. */
    function matchGain(bed: Float32Array, lane: Float32Array, alone: Float32Array, floor: number): number {
        const ratios: number[] = [];

        for (let i = 0; i < alone.length; i++) {
            if (!alone[i] || lane[i] <= 0 || bed[i] <= floor) continue;

            ratios.push((bed[i] - floor) / lane[i]);
        }

        if (ratios.length < MATCH_HOPS) return 1;

        ratios.sort((a, b) => a - b);

        return Math.min(MATCH_MAX, Math.max(MATCH_MIN, ratios[ratios.length >> 1]));
    }

    /**
     * The whole first pass, mirroring `prepareChunked` in `laneMix.ts` step for
     * step so the answer is byte-identical whichever side ran it.
     */
    function analyze(input: WorkerInput): LanePreparation {
        const { points } = input;
        const bedEnvelope = input.bed ? envelopeOf(input.bed, input.bedRate, input.bedOffset, points) : new Float32Array(points);

        const measured = input.lanes.map(lane => ({
            offset: lane.offset,
            rms: envelopeOf(lane.samples, lane.rate, lane.offset, points)
        }));

        if (!input.bed) {
            return {
                bedEnvelope,
                lanes: measured.map(entry => ({
                    offset: entry.offset,
                    gain: 1,
                    rms: entry.rms,
                    gate: gateOf(entry.rms, GATE_FLOOR, PAD_AHEAD, PAD_BEHIND)
                }))
            };
        }

        const total = new Float32Array(points);
        for (const entry of measured) {
            for (let i = 0; i < points; i++) total[i] += entry.rms[i];
        }

        const clip = bestLag(bedEnvelope, total);

        for (const entry of measured) {
            const spoken = sentenceLag(bedEnvelope, entry.rms);
            const whole = spoken.fit >= LAG_FIT ? spoken : bestLag(bedEnvelope, entry.rms);
            const lag = whole.fit >= LAG_FIT ? whole.lag : clip.lag;

            entry.rms = shiftBy(entry.rms, -lag);
            entry.offset -= lag / ENV_HZ;
        }

        const speech = measured.map(entry => gateOf(entry.rms, ENV_FLOOR, 0.18, 0.18));
        const gates = measured.map(entry => gateOf(entry.rms, GATE_FLOOR, PAD_AHEAD, PAD_BEHIND));

        const talking = new Uint8Array(points);
        for (const gate of speech) {
            for (let i = 0; i < points; i++) if (gate[i]) talking[i]++;
        }

        let quiet = 0;
        let floor = 0;

        for (let i = 0; i < points; i++) {
            if (talking[i]) continue;

            floor += bedEnvelope[i];
            quiet++;
        }

        floor = quiet ? floor / quiet : 0;

        const lanes = measured.map((entry, index) => {
            const alone = new Float32Array(points);
            const mine = speech[index];

            for (let i = 0; i < points; i++) {
                alone[i] = entry.rms[i] >= ENV_FLOOR && talking[i] === (mine[i] ? 1 : 0) ? 1 : 0;
            }

            return {
                offset: entry.offset,
                gain: matchGain(bedEnvelope, entry.rms, alone, floor),
                rms: entry.rms,
                gate: gates[index]
            };
        });

        return { bedEnvelope, lanes };
    }

    /** The freshly built curves, handed back without keeping a copy. */
    function collect(result: LanePreparation, into: Transferable[]): void {
        into.push(result.bedEnvelope.buffer as ArrayBuffer);
        for (const lane of result.lanes) {
            into.push(lane.rms.buffer as ArrayBuffer);
            into.push(lane.gate.buffer as ArrayBuffer);
        }
    }

    const scope = self as unknown as {
        onmessage: ((event: MessageEvent) => void) | null;
        postMessage: (message: unknown, transfer: Transferable[]) => void;
    };

    scope.onmessage = (event: MessageEvent) => {
        const { id, input } = event.data as { id: number; input: WorkerInput };
        const result = analyze(input);
        const transfer: Transferable[] = [];
        collect(result, transfer);
        scope.postMessage({ id, result }, transfer);
    };
}
