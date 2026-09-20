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
