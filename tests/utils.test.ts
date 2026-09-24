import assert from "node:assert/strict";
import { test } from "node:test";

import * as utils from "../src/userplugins/Clipper/utils.ts";
import { CAPTURE_PRESETS, chaptersOf, findDuplicates, clipRetentionSeconds as retention, formatKeybind, isLinux, keybindMatches, parseKeybind, toAccelerator } from "../src/userplugins/Clipper/utils.ts";

test("capture presets stay within sane bounds", () => {
    assert.ok(CAPTURE_PRESETS.length >= 2);

    for (const preset of CAPTURE_PRESETS) {
        // Held memory, same estimate the picker shows: bitrate over the
        // whole length plus container overhead, under the 512MB buffer cap.
        const held = (preset.bitrate * 1_000_000) / 8 * preset.length * 1.1;
        assert.ok(held < 512 * 1024 * 1024, `${preset.label} holds ${held}`);

        // Each value must survive the clamps that sanitize the settings.
        assert.equal(utils.captureFrameRate(preset.fps), preset.fps);
        assert.equal(utils.captureHeight(preset.resolution), preset.resolution);
        assert.ok(utils.captureVideoBitrate(preset.bitrate) === preset.bitrate * 1_000_000);
        assert.ok(retention(preset.length) >= preset.length);
        assert.ok(["mp4-h264", "webm-vp9", "webm-vp8"].includes(preset.container), `${preset.label} container`);
    }
});

test("capture frame rates remain finite and within encoder limits", () => {
    for (const value of [NaN, Infinity, -Infinity, undefined, null, "60", {}, 0, -10]) {
        assert.equal(utils.captureFrameRate(value), 30);
    }
    assert.equal(utils.captureFrameRate(0.5), 1);
    assert.equal(utils.captureFrameRate(24), 24);
    assert.equal(utils.captureFrameRate(30), 30);
    assert.equal(utils.captureFrameRate(60), 60);
    assert.equal(utils.captureFrameRate(120), 120);
    assert.equal(utils.captureFrameRate(240), 120);
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

    assert.equal(toAccelerator("ctrl+KeyS"), "Control+S");
    assert.equal(toAccelerator("alt+F10"), "Alt+F10");
    assert.equal(toAccelerator("ctrl+shift+Digit1"), "Control+Shift+1");
    assert.equal(toAccelerator(""), "");
    assert.equal(toAccelerator("ctrl+Foo"), "");
});

test("linux detection reads chromium first, legacy platform second", () => {
    // Node's global navigator is a getter-only accessor: plain assignment
    // silently does nothing, so the stub goes through defineProperty.
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, "navigator");
    const stub = (value: unknown) =>
        Object.defineProperty(globalThis, "navigator", { value, configurable: true });
    const restore = () => {
        if (descriptor) Object.defineProperty(globalThis, "navigator", descriptor);
    };

    try {
        stub({ userAgentData: { platform: "Linux" }, platform: "Win32" });
        assert.equal(isLinux(), true);

        stub({ userAgentData: { platform: "Windows" }, platform: "Linux x86_64" });
        assert.equal(isLinux(), false);

        stub({ platform: "Linux armv8l" });
        assert.equal(isLinux(), true);

        stub({ platform: "Win32" });
        assert.equal(isLinux(), false);
    } finally {
        restore();
    }
});

test("duplicates are same-game saves seconds apart", () => {
    const at = (s: number) => ({ size: 10, modified: s * 1000, game: "CS2", name: `c${s}` });

    assert.deepEqual(findDuplicates([]), []);
    assert.deepEqual(findDuplicates([at(0)]), []);

    // Save, POV request and auto-clip of one play.
    const burst = findDuplicates([at(0), at(20), at(70)]);
    assert.equal(burst.length, 1);
    assert.deepEqual(burst[0].map(e => e.name), ["c0", "c20", "c70"]);

    // Different games never group, however close.
    const other = { size: 10, modified: 10_000, game: "LoL", name: "x" };
    assert.deepEqual(findDuplicates([at(0), other]), []);

    // An hour-long session does not chain into one group.
    const evening = [0, 100, 200, 300, 400].map(at);
    assert.deepEqual(findDuplicates(evening), []);

    // Two bursts stay two groups, newest first.
    const two = findDuplicates([at(0), at(30), at(1000), at(1030)]);
    assert.equal(two.length, 2);
    assert.deepEqual(two[0].map(e => e.name), ["c1000", "c1030"]);
});

test("chapters read like chapters", () => {
    assert.equal(chaptersOf([]), "");
    assert.equal(chaptersOf([75], ["a kill in Counter-Strike 2"]), "00:00 Start\n01:15 a kill in Counter-Strike 2");
    assert.equal(chaptersOf([0, 65], ["", "woo"]), "00:00 Highlight 1\n01:05 woo");
    assert.equal(chaptersOf([3661], []), "00:00 Start\n1:01:01 Highlight 1");
    assert.equal(chaptersOf([30, 10], ["b", "a"]), "00:00 Start\n00:10 a\n00:30 b");
});
