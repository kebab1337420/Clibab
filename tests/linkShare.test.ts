/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";

const fixture = {
    toasts: [] as unknown[],
    fileSize: 10 * 1024 * 1024
};
Object.assign(globalThis, { __clipperTest: fixture });

const hooks = registerHooks({
    resolve(specifier, context, nextResolve) {
        if (context.parentURL?.endsWith("/linkShare.ts")) {
            const stubs = {
                "@webpack/common": "export const Toasts = { Type: { MESSAGE: 'message', SUCCESS: 'success', FAILURE: 'error' } };",
                "./clips": "export const CLIPS_AVAILABLE = true; export const loadClipFile = async name => ({ name, size: globalThis.__clipperTest.fileSize });",
                "./recorder": "export class Logger { info() {} warn() {} error() {} } export const logger = new Logger();",
                "./toasts": "export const toast = (...args) => { globalThis.__clipperTest.toasts.push(args); };"
            };
            if (Object.hasOwn(stubs, specifier)) {
                return { shortCircuit: true, url: `data:text/javascript,${encodeURIComponent(stubs[specifier])}` };
            }
        }
        return nextResolve(specifier, context);
    }
});
const mod = await import("../src/userplugins/Clipper/linkShare.ts");
hooks.deregister();

test("a proper host answer is accepted, with the extension that makes Discord treat it as video", () => {
    assert.equal(mod.parseShareUrl("https://0x0.st/Ab3x.mp4\n"), "https://0x0.st/Ab3x.mp4");
});

test("an error page wearing a 200 is not pasted into chat", () => {
    assert.equal(mod.parseShareUrl("something went wrong"), null);
    assert.equal(mod.parseShareUrl("https://catbox.moe/abcd.mp4"), null);
    assert.equal(mod.parseShareUrl(""), null);
});

test("a clip over the host limit is refused before anything is uploaded", async () => {
    fixture.fileSize = 600 * 1024 * 1024;
    fixture.toasts = [];
    try {
        assert.equal(await mod.shareClipLink("huge.webm"), false);
        assert.match(String(fixture.toasts[0][0]), /512MB/);
    } finally {
        fixture.fileSize = 10 * 1024 * 1024;
    }
});
