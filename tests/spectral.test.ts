/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";

const hooks = registerHooks({
    resolve(specifier, context, nextResolve) {
        if (context.parentURL?.endsWith("/spectralMask.ts") || context.parentURL?.endsWith("/voice.ts")) {
            const stubs = {
                "@utils/Logger": "export class Logger { info() {} warn() {} error() {} }",
                "@webpack/common": "export const FluxDispatcher = { subscribe() {}, unsubscribe() {} }; export const MediaEngineStore = {}; export const SelectedChannelStore = {}; export const UserStore = {}; export const VoiceStateStore = {};"
            };
            if (Object.hasOwn(stubs, specifier)) {
                return { shortCircuit: true, url: `data:text/javascript,${encodeURIComponent(stubs[specifier])}` };
            }
        }
        return nextResolve(specifier, context);
    }
});
const mod = await import("../src/userplugins/Clipper/spectralMask.ts");
hooks.deregister();

const SR = 8000;

function tone(freq: number, seconds: number, harmonics = 4): Float32Array {
    const out = new Float32Array(Math.floor(SR * seconds));
    for (let n = 0; n < out.length; n++) {
        let s = 0;
        for (let h = 1; h <= harmonics; h++) s += Math.sin(2 * Math.PI * freq * h * (n / SR)) / h;
        out[n] = s * 0.3;
    }

    return out;
}

function levelsFor(active: Array<[number, number]>, seconds: number): Uint8Array {
    const out = new Uint8Array(Math.ceil(seconds * 5));
    for (const [from, to] of active) {
        for (let i = Math.floor(from * 5); i < Math.min(out.length, Math.ceil(to * 5)); i++) out[i] = 200;
    }

    return out;
}

test("fft roundtrips a signal", () => {
    const signal = tone(110, 1);
    const re = Float32Array.from(signal.slice(0, 1024));
    const im = new Float32Array(1024);

    mod.fft(re, im, false);
    mod.fft(re, im, true);

    let err = 0;
    for (let i = 0; i < 1024; i++) err = Math.max(err, Math.abs(re[i] - signal[i]));

    assert.ok(err < 1e-4, `roundtrip error ${err}`);
});

test("average spectrum peaks at the tone", () => {
    const spectrum = mod.averageSpectrum(tone(440, 1));
    const peak = spectrum.indexOf(Math.max(...spectrum));

    // 440Hz at 7.8Hz bins.
    assert.ok(Math.abs(peak - 56) <= 1, `peak at bin ${peak}`);
});

test("profiles learn solo stretches, never crowds", () => {
    // A speaks 0-2.5s, B speaks 1.5-4s: the ends are solo, the middle is a crowd.
    const a = tone(110, 4);
    const b = tone(220, 4);
    const pcm = new Float32Array(a.length);
    const gate = (t: number, from: number, to: number) => (t >= from && t < to ? 1 : 0);
    for (let n = 0; n < pcm.length; n++) {
        const t = n / SR;
        pcm[n] = a[n] * gate(t, 0, 2.5) + b[n] * gate(t, 1.5, 4);
    }

    const profiles = mod.learnProfiles(pcm, SR, [
        { userId: "a", levels: levelsFor([[0, 2.5]], 4) },
        { userId: "b", levels: levelsFor([[1.5, 4]], 4) }
    ], 5);

    assert.ok(profiles.has("a") && profiles.has("b"));

    // Each print peaks near its own fundamental, not the other's.
    const peakOf = (spectrum: Float32Array) => spectrum.indexOf(Math.max(...spectrum));
    assert.ok(Math.abs(peakOf(profiles.get("a")!) - 14) <= 2, "a peaks near 110Hz");
    assert.ok(Math.abs(peakOf(profiles.get("b")!) - 28) <= 2, "b peaks near 220Hz");
});

test("mask keeps the others, drops the muted", () => {
    const bins = 513;
    const x = new Float32Array(bins).fill(1);
    const o = new Float32Array(bins).fill(1);
    x[10] = 10;
    o[20] = 10;

    const profiles = new Map([["x", x], ["o", o]]);
    const gains = mod.maskGains(profiles, ["x"], ["o"])!;

    assert.ok(gains[10] < 0.2, `x bin kept ${gains[10]}`);
    assert.ok(gains[20] > 0.8, `o bin kept ${gains[20]}`);
});

test("mask with nobody else around removes everything", () => {
    const profiles = new Map([["x", new Float32Array(513).fill(1)]]);

    assert.deepEqual([...mod.maskGains(profiles, ["x"], [])!], new Array(513).fill(0));
});

test("plan refuses indistinguishable prints", () => {
    const same = new Float32Array(513).fill(1);
    const profiles = new Map([["x", same], ["y", Float32Array.from(same)]]);

    assert.equal(mod.planMask(profiles, { x: 0 }).engaged, false);
    assert.equal(mod.planMask(new Map(), { x: 0 }).engaged, false);
    assert.equal(mod.planMask(profiles, undefined).engaged, false);
});
