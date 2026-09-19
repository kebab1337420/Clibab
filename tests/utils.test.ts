import assert from "node:assert/strict";
import { test } from "node:test";

import * as utils from "../src/userplugins/Clipper/utils.ts";
import { clipRetentionSeconds as retention, formatKeybind, keybindMatches, parseKeybind } from "../src/userplugins/Clipper/utils.ts";

test("capture frame rates remain finite and within encoder limits", () => {
    for (const value of [NaN, Infinity, -Infinity, undefined, null, "60", {}, 0, -10]) {
        assert.equal(utils.captureFrameRate(value), 30);
    }
    assert.equal(utils.captureFrameRate(0.5), 1);
    assert.equal(utils.captureFrameRate(24), 24);
    assert.equal(utils.captureFrameRate(30), 30);
    assert.equal(utils.captureFrameRate(60), 60);
    assert.equal(utils.captureFrameRate(240), 60);
});

test("video bitrate settings produce bounded bits per second for the encoder", () => {
    for (const value of [NaN, Infinity, -Infinity, undefined, null, "8", {}, 0, -1]) {
        assert.equal(utils.captureVideoBitrate(value), 8_000_000);
    }
    assert.equal(utils.captureVideoBitrate(0.5), 1_000_000);
    assert.equal(utils.captureVideoBitrate(8), 8_000_000);
    assert.equal(utils.captureVideoBitrate(12.5), 12_500_000);
    assert.equal(utils.captureVideoBitrate(50), 50_000_000);
    assert.equal(utils.captureVideoBitrate(Number.MAX_VALUE), 50_000_000);
});

test("capture heights outside any sane display fall back to the source", () => {
    for (const value of [NaN, Infinity, -Infinity, undefined, null, "1080", {}, -720, 100_000]) {
        assert.equal(utils.captureHeight(value), 0);
    }
    assert.equal(utils.captureHeight(0), 0);
    assert.equal(utils.captureHeight(480), 480);
    assert.equal(utils.captureHeight(1080), 1080);
    assert.equal(utils.captureHeight(2160), 2160);
});

test("invalid clip durations retain a finite default buffer", () => {
    for (const value of [NaN, Infinity, -Infinity, undefined, null, "30", {}, 0, -10]) {
        assert.equal(retention(value), 30);
        const cutoff = 100_000 - (retention(value) * 1000 + 1000);
        assert.deepEqual([1000, 50_000, 80_000, 99_000].filter(at => at >= cutoff), [80_000, 99_000]);
    }
    assert.equal(retention(1), 5);
    assert.equal(retention(300), 300);
    assert.equal(retention(60.5), 60.5);
    assert.equal(retention(1e9), 600);
});

const event = {
    code: "KeyS",
    ctrlKey: true,
    shiftKey: false,
    altKey: false,
    metaKey: false
} as KeyboardEvent;

test("corrupt keybind settings are ignored by parsing, matching and formatting", () => {
    for (const value of [null, undefined, 42, true, {}, [], ["ctrl", "KeyS"]]) {
        const bind = value as unknown as string;
        assert.equal(parseKeybind(bind), null);
        assert.equal(keybindMatches(bind, event), false);
        assert.equal(formatKeybind(bind), "Unbound");
    }
});

test("valid shortcuts still parse and match their modifiers", () => {
    assert.deepEqual(parseKeybind("ctrl+KeyS"), {
        code: "KeyS", ctrl: true, shift: false, alt: false, meta: false
    });
    assert.equal(keybindMatches("ctrl+KeyS", event), true);
    assert.equal(keybindMatches("alt+KeyS", event), false);
    assert.equal(parseKeybind(""), null);
});
