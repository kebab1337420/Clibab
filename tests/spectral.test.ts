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

/*
 * Only the live planning surface is pinned here. The learning helpers
 * (averageSpectrum, learnProfiles, maskGains) and the main-thread fft were
 * removed with no production callers; the worklet carries its own copy.
 */
test("plan refuses indistinguishable prints", () => {
    const same = new Float32Array(513).fill(1);
    const profiles = new Map([["x", same], ["y", Float32Array.from(same)]]);

    assert.equal(mod.planMask(profiles, { x: 0 }).engaged, false);
    assert.equal(mod.planMask(new Map(), { x: 0 }).engaged, false);
    assert.equal(mod.planMask(profiles, undefined).engaged, false);
});
