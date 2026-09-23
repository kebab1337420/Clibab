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
        if (context.parentURL?.endsWith("/voice.ts")) {
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
const mod = await import("../src/userplugins/Clipper/voice.ts");
hooks.deregister();

/** n seconds of flat activity at 5Hz. */
function lane(id: string, seconds: number, level: number) {
    return { id, name: id, levels: new Uint8Array(Math.round(seconds * 5)).fill(level) };
}

test("a muted person speaking alone is removed, not ducked", () => {
    const tracks = [lane("x", 10, 200), lane("y", 10, 0)];

    assert.equal(mod.voiceDuckAt(tracks, { x: 0 }, 5), 0);
});

test("a muted person talked over keeps the floor", () => {
    const tracks = [lane("x", 10, 200), lane("y", 10, 200)];

    assert.equal(mod.voiceDuckAt(tracks, { x: 0 }, 5), 0.18);
});

test("untouched levels leave the mix alone", () => {
    const tracks = [lane("x", 10, 200), lane("y", 10, 200)];

    assert.equal(mod.voiceDuckAt(tracks, undefined, 5), 1);
    assert.equal(mod.voiceDuckAt(tracks, { x: 1, y: 1 }, 5), 1);
});

test("a muted person saying nothing changes nothing", () => {
    const tracks = [lane("x", 10, 0), lane("y", 10, 200)];

    assert.equal(mod.voiceDuckAt(tracks, { x: 0 }, 5), 1);
});

test("a half level owns half the moment", () => {
    const tracks = [lane("x", 10, 200), lane("y", 10, 200)];

    // Each owns half the instant, so half of x's dip lands: 1 - 0.5 * 0.5.
    assert.ok(Math.abs(mod.voiceDuckAt(tracks, { x: 0.5 }, 5) - 0.75) < 1e-9);
});

test("mask actors split the audible by mute", () => {
    const tracks = [lane("x", 10, 200), lane("y", 10, 200)];

    assert.deepEqual(mod.maskActors(tracks, { x: 0 }, 5), { muted: ["x"], others: ["y"] });
    assert.deepEqual(mod.maskActors(tracks, undefined, 5), { muted: [], others: [] });
    assert.deepEqual(mod.maskActors([], { x: 0 }, 5), { muted: [], others: [] });

    // Silent tracks join neither side.
    const quiet = [lane("x", 10, 0), lane("y", 10, 200)];
    assert.deepEqual(mod.maskActors(quiet, { x: 0 }, 5), { muted: [], others: ["y"] });
});

test("shifting drops whole lanes", () => {
    const tracks = [lane("x", 2, 200), lane("y", 2, 0)];

    assert.equal(mod.shiftTracks(tracks, 0), tracks);
    const shifted = mod.shiftTracks(tracks, 0.4);
    assert.equal(shifted.length, 2);
    assert.equal(shifted[0].levels.length, 8);

    // A lane shifted past its end disappears instead of going empty.
    assert.deepEqual(mod.shiftTracks(tracks, 99).length, 0);
});

test("voice metadata roundtrips", () => {
    const track = { id: "1", name: "x", avatar: "a", levels: Uint8Array.from([0, 200, 255]) };
    const back = mod.fromMeta(mod.toMeta(track));

    assert.equal(back.id, "1");
    assert.equal(back.name, "x");
    assert.equal(back.avatar, "a");
    assert.deepEqual([...back.levels], [0, 200, 255]);

    const bare = mod.fromMeta(mod.toMeta({ id: "2", name: "y", levels: Uint8Array.from([1]) }));
    assert.ok(!("avatar" in bare));
});

test("levels helpers read plainly", () => {
    assert.equal(mod.voiceGainOf(undefined, "x"), 1);
    assert.equal(mod.voiceGainOf({ x: 0.5 }, "x"), 0.5);
    assert.equal(mod.voiceGainOf({ x: 0 }, "x"), 0);
    assert.equal(mod.voiceLevelsTouched(undefined), false);
    assert.equal(mod.voiceLevelsTouched({}), false);
    assert.equal(mod.voiceLevelsTouched({ x: 1 }), false);
    assert.equal(mod.voiceLevelsTouched({ x: 0 }), true);

    // Loudest first, silenced people left out.
    const tracks = [lane("x", 10, 100), lane("y", 10, 200)];
    assert.deepEqual(mod.speakingAt(tracks, undefined, 5).map(t => t.id), ["y", "x"]);
    assert.deepEqual(mod.speakingAt(tracks, { y: 0 }, 5).map(t => t.id), ["x"]);

    // The fraction of a lane the mute would dip.
    assert.equal(mod.mutedFraction({ id: "e", name: "e", levels: new Uint8Array(0) }), 0);
    assert.ok(mod.mutedFraction(lane("f", 10, 200)) > 0.9);
});
