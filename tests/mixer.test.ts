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
        if (context.parentURL?.endsWith("/mixer.ts")) {
            const stubs = {
                "@utils/Logger": "export class Logger { info() {} warn() {} error() {} }",
                "./settings": "export const settings = { get store() { return { audioMixer: globalThis.__mixerStore ?? {} }; } };"
            };
            if (Object.hasOwn(stubs, specifier)) {
                return { shortCircuit: true, url: `data:text/javascript,${encodeURIComponent(stubs[specifier])}` };
            }
        }
        return nextResolve(specifier, context);
    }
});
const mod = await import("../src/userplugins/Clipper/mixer.ts");
hooks.deregister();

test("gains are clamped to something an encoder can take", () => {
    assert.equal(mod.clampGain(NaN), 1);
    assert.equal(mod.clampGain("x"), 1);
    assert.equal(mod.clampGain(-1), 0);
    assert.equal(mod.clampGain(1.234), 1.23);
    assert.equal(mod.clampGain(99), 3);
    assert.equal(mod.gainOf({ gain: 2, muted: false }), 2);
    assert.equal(mod.gainOf({ gain: 2, muted: true }), 0);
});

test("untouched voices leave no levels behind", () => {
    assert.deepEqual(mod.voiceLevelsFrom(mod.DEFAULT_MIXER), {});
    assert.deepEqual(
        mod.voiceLevelsFrom({
            ...mod.DEFAULT_MIXER,
            voices: { "1": { gain: 1, muted: false }, "2": { gain: 0.5, muted: false }, "3": { gain: 1, muted: true } }
        }),
        { "2": 0.5, "3": 0 }
    );
});

test("a corrupt mixer setting reads as defaults", () => {
    (globalThis as any).__mixerStore = {
        system: { gain: NaN, muted: "yes" },
        voices: { abc: { gain: 5, muted: true }, "7": { gain: 2.5, muted: false } }
    };

    const mixer = mod.readMixer();
    assert.deepEqual(mixer.system, { gain: 1, muted: false });
    assert.deepEqual(mixer.voices, { "7": { gain: 2.5, muted: false } });

    delete (globalThis as any).__mixerStore;
});
