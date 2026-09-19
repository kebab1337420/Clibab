/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import assert from "node:assert/strict";
import { test } from "node:test";

import { lengthBytes, repairBytes, trimBytes } from "../src/userplugins/Clipper/repair.ts";
import { lengthWebm, rebaseWebm, trimWebm } from "../src/userplugins/Clipper/webm.ts";

/** Hostile inputs: nothing here is a WebM, and none may throw. */
const HOSTILE: Array<[string, Uint8Array]> = [
    ["empty", new Uint8Array(0)],
    ["garbage", Uint8Array.from(Buffer.from("not a webm at all, just text"))],
    ["truncated header", new Uint8Array([0x1a, 0x45, 0xdf, 0xa3])],
    ["zeros", new Uint8Array(128)],
    ["lone cluster id", new Uint8Array([0x1f, 0x43, 0xb6, 0x75])],
];

for (const [label, data] of HOSTILE) {
    test(`webm readers answer for ${label} without throwing`, () => {
        assert.equal(lengthWebm(data), 0);
        assert.equal(rebaseWebm(data), null);
        assert.equal(trimWebm(data, 0, 10_000), null);
    });
}

test("repair dispatch refuses what it does not know", () => {
    const data = new Uint8Array([1, 2, 3]);

    assert.equal(repairBytes(data, "video/avi"), null);
    assert.equal(trimBytes(data, "video/avi", 0, 10), null);
    assert.equal(lengthBytes(data, "video/avi"), 0);
});

test("trim dispatch refuses an empty or inverted range", () => {
    const data = new Uint8Array([1, 2, 3]);

    assert.equal(trimBytes(data, "video/webm", 10, 10), null);
    assert.equal(trimBytes(data, "video/webm", 10, 5), null);
    assert.equal(trimBytes(data, "video/mp4", 10, 5), null);
});
