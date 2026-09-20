/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/*
 * Vencord Clipper - settings definition
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

import { ClipSoundInput } from "./components/ClipSoundInput";
import { KeybindInput } from "./components/KeybindInput";
import { SaveDirectoryInput } from "./components/SaveDirectoryInput";
import { SettingsSection } from "./components/SettingsSection";
import { UpdateStatus } from "./components/UpdateStatus";
import { VrBindings } from "./components/VrBindings";

export const enum Container {
    WebmVp9 = "webm-vp9",
    WebmVp8 = "webm-vp8",
    Mp4H264 = "mp4-h264"
}

export const settings = definePluginSettings({
    /*
     * Capture and audio settings live in the clip studio and in the source
     * picker, which is where they are actually needed. Kept here as stored
     * values only, so the panel does not show the same knobs twice.
     */
    autoStart: {
        type: OptionType.BOOLEAN,
        description: "Start the buffer automatically when Discord launches, on the last used source",
        default: false
    },
    followGame: {
        type: OptionType.BOOLEAN,
        description: "Prefer the running game over the picked source",
        default: true
    },
    markersSection: {
        type: OptionType.COMPONENT,
        component: () => (
            <SettingsSection
                title="Auto-markers"
                note="Markers the plugin drops by itself when something happens."
            />
        )
    },
    autoHighlight: {
        type: OptionType.BOOLEAN,
        description: "Drop markers automatically when something notable happens",
        default: true
    },
    voiceHighlights: {
        type: OptionType.BOOLEAN,
        description: "Let loud moments in the call count towards auto-markers. Off by default",
        default: false
    },
    highlightSensitivity: {
        hidden: () => !settings.store.autoHighlight,
        type: OptionType.SELECT,
        description: "How much has to happen before an automatic marker drops",
        options: [
            { label: "Strict", value: "strict" },
            { label: "Normal", value: "normal", default: true },
            { label: "Loose", value: "loose" }
        ]
    },
    gameAudioWatch: {
        type: OptionType.BOOLEAN,
        description: "Detect loud game moments (leave off if game sound comes through the call)",
        default: false
    },
    gameVideoWatch: {
        type: OptionType.BOOLEAN,
        description: "Watch the picture for markers (motion, red flashes, fade to black). Costs almost nothing",
        default: true
    },
    gameIntegrations: {
        type: OptionType.BOOLEAN,
        description: "Let CS2 and League of Legends report their own events for markers. Nothing leaves your PC",
        default: false
    },
    autoHighlightSave: {
        type: OptionType.BOOLEAN,
        description: "Auto-save a clip when auto-markers fire. At most one every 2 minutes",
        default: false
    },
    clipLength: {
        type: OptionType.CUSTOM,
        default: 30
    },
    fps: {
        type: OptionType.CUSTOM,
        default: 30
    },
    resolution: {
        type: OptionType.CUSTOM,
        default: 0
    },
    videoBitrate: {
        type: OptionType.CUSTOM,
        default: 8
    },
    container: {
        type: OptionType.CUSTOM,
        default: Container.Mp4H264
    },
    /*
     * Containers whose encoder failed on this client, against the build they
     * failed on: `{ build, mimes }`. Read and written by ./recorder, which is
     * where the reasoning lives.
     */
    brokenEncoders: {
        type: OptionType.CUSTOM,
        default: {}
    },
    /*
     * Containers whose encoder works here only on a capture redrawn into a
     * canvas, against the build that needed it: `{ build, mimes }`. Same shape
     * and same owner as the list above.
     */
    relayEncoders: {
        type: OptionType.CUSTOM,
        default: {}
    },
    includeMic: {
        type: OptionType.CUSTOM,
        default: false
    },
    micGate: {
        type: OptionType.BOOLEAN,
        description: "Only record the mic while Discord transmits your voice",
        default: true
    },
    audioBitrate: {
        type: OptionType.CUSTOM,
        default: 128
    },
    // Per-channel levels of the recording mix. Edited through the studio mixer.
    audioMixer: {
        type: OptionType.CUSTOM,
        // Left empty on purpose: `readMixer` fills in every missing level, and
        // importing the defaults here would close a cycle with ./mixer.
        default: {}
    },
    /**
     * Sounds and pictures kept for reuse across montages.
     *
     * Paths, not bytes: a sound effect lives wherever the user keeps it, and
     * copying a megabyte of samples into the settings file for every entry
     * would be both slow to read and impossible to keep in sync with the file
     * itself. Validated by ./assets, which is also where the shape lives.
     */
    assetLibrary: {
        type: OptionType.CUSTOM,
        default: {}
    },
    // Per-game capture knobs, keyed case-insensitively. Read and written by
    // ./profiles, which is also where the shape lives.
    gameProfiles: {
        type: OptionType.CUSTOM,
        default: {}
    },
    clipsSection: {
        type: OptionType.COMPONENT,
        component: () => (
            <SettingsSection
                title="Clips"
                note="Where the files land, and what happens once one is written."
            />
        )
    },
    saveDirectory: {
        type: OptionType.CUSTOM,
        default: ""
    },
    saveDirectoryInput: {
        type: OptionType.COMPONENT,
        component: SaveDirectoryInput
    },
    autoCleanup: {
        type: OptionType.BOOLEAN,
        description: "Move clips older than a while to the trash automatically. Pinned clips are spared",
        default: false
    },
    autoCleanupDays: {
        hidden: () => !settings.store.autoCleanup,
        type: OptionType.SLIDER,
        description: "Days a clip may sit before it is trashed",
        markers: [7, 14, 30, 60, 90],
        default: 30,
        stickToMarkers: true
    },
    notifications: {
        type: OptionType.BOOLEAN,
        description: "Show a desktop notification when a clip is saved",
        default: true
    },
    clipSound: {
        type: OptionType.BOOLEAN,
        description: "Play a confirmation sound when a clip is saved. Kept out of the clip itself",
        default: true
    },
    // Absolute path of a custom clip sound. Empty means the built-in blip.
    clipSoundPath: {
        type: OptionType.CUSTOM,
        default: ""
    },
    clipSoundVolume: {
        type: OptionType.CUSTOM,
        default: 70
    },
    clipSoundInput: {
        type: OptionType.COMPONENT,
        component: ClipSoundInput
    },
    autoClipsSection: {
        type: OptionType.COMPONENT,
        component: () => (
            <SettingsSection
                title="End-of-call clips"
                note="One clip saved automatically when a call ends."
            />
        )
    },
    autoClipOnCallEnd: {
        type: OptionType.BOOLEAN,
        description: "Auto-save the end of the call when you leave with the buffer running",
        default: false
    },
    autoClipEndLength: {
        hidden: () => !settings.store.autoClipOnCallEnd,
        type: OptionType.SLIDER,
        description: "Seconds of the call's end to keep. Capped at the buffer length",
        markers: [5, 10, 15, 30, 45, 60],
        default: 30,
        stickToMarkers: true
    },
    interfaceSection: {
        type: OptionType.COMPONENT,
        component: () => (
            <SettingsSection title="Interface" />
        )
    },
    nativeEngine: {
        type: OptionType.BOOLEAN,
        description: "Use Discord's engine when possible (per-person audio), otherwise the built-in buffer",
        default: true
    },
    panelButton: {
        type: OptionType.BOOLEAN,
        description: "Show the floating Clipper button above the account panel",
        default: true
    },
    /*
     * Which clip studio opens. The simple one is one clip picked, trimmed and
     * saved; the advanced one is the full montage timeline. The advanced studio
     * only gained its long tail of controls over time, so it stays the default:
     * nobody who already uses it should come back to a bare trimmer.
     */
    studioMode: {
        type: OptionType.SELECT,
        description: "Which editor opens: full montage timeline, or simple trim",
        options: [
            { label: "Advanced", value: "advanced", default: true },
            { label: "Simple", value: "simple" }
        ]
    },
    overlayNotice: {
        type: OptionType.BOOLEAN,
        description: "Show a small notice over the game when a clip is saved or requested",
        default: true
    },
    overlayCorner: {
        type: OptionType.SELECT,
        description: "Corner where the in-game notice and replay appear",
        options: [
            { label: "Bottom right", value: "bottom-right", default: true },
            { label: "Bottom left", value: "bottom-left" },
            { label: "Top right", value: "top-right" },
            { label: "Top left", value: "top-left" }
        ]
    },
    overlaySize: {
        type: OptionType.SELECT,
        description: "Size of the in-game replay window",
        options: [
            { label: "Small", value: "small" },
            { label: "Medium", value: "medium", default: true },
            { label: "Large", value: "large" }
        ]
    },
    overlaySeconds: {
        type: OptionType.SLIDER,
        description: "Replay length back from the end (0 = whole clip)",
        markers: [0, 5, 10, 15, 20, 30, 45, 60],
        default: 10,
        stickToMarkers: true
    },
    overlayVolume: {
        type: OptionType.SLIDER,
        description: "Volume of the in-game replay. Muted by default",
        markers: [0, 10, 25, 50, 75, 100],
        default: 0,
        stickToMarkers: false
    },
    // Remembered capture source, set from the picker. Hidden from the settings UI.
    sourceId: {
        type: OptionType.CUSTOM,
        default: ""
    },
    sourceName: {
        type: OptionType.CUSTOM,
        default: ""
    },
    keybindsSection: {
        type: OptionType.COMPONENT,
        component: () => (
            <SettingsSection
                title="Keybinds"
                note="Registered with the OS, so they fire from inside a game. On Wayland they only fire while Discord is focused."
            />
        )
    },
    globalKeybinds: {
        type: OptionType.BOOLEAN,
        description: "Make keybinds work while in-game. Off keeps them Discord-only",
        default: true
    },
    saveKeybind: {
        type: OptionType.COMPONENT,
        default: "ctrl+alt+F10",
        component: () => (
            <KeybindInput
                title="Save clip keybind"
                note="Save the buffered footage. Avoid Ctrl+R (reserved by Electron)."
                value={settings.store.saveKeybind}
                onChange={v => (settings.store.saveKeybind = v)}
            />
        )
    },
    toggleKeybind: {
        type: OptionType.COMPONENT,
        default: "ctrl+alt+F9",
        component: () => (
            <KeybindInput
                title="Start / stop capture keybind"
                note="Start or stop the rolling buffer."
                value={settings.store.toggleKeybind}
                onChange={v => (settings.store.toggleKeybind = v)}
            />
        )
    },
    markKeybind: {
        type: OptionType.COMPONENT,
        default: "ctrl+alt+F11",
        component: () => (
            <KeybindInput
                title="Drop a marker keybind"
                note="Drop a marker without saving. Markers show on the studio timeline."
                value={settings.store.markKeybind}
                onChange={v => (settings.store.markKeybind = v)}
            />
        )
    },
    povKeybind: {
        type: OptionType.COMPONENT,
        default: "ctrl+alt+F12",
        component: () => (
            <KeybindInput
                title="Clip everyone's angle keybind"
                note="Save your clip and ask everyone in the call to save theirs."
                value={settings.store.povKeybind}
                onChange={v => (settings.store.povKeybind = v)}
            />
        )
    },
    replayKeybind: {
        type: OptionType.COMPONENT,
        default: "ctrl+alt+F8",
        component: () => (
            <KeybindInput
                title="Clip editor keybind"
                note="Open the last clip in the in-game editor."
                value={settings.store.replayKeybind}
                onChange={v => (settings.store.replayKeybind = v)}
            />
        )
    },
    povRequests: {
        type: OptionType.BOOLEAN,
        description: "Auto-save your clip when someone in your call requests everyone's angle",
        default: true
    },
    /*
     * Written by VRinstaller.bat, never shown, and the only thing that decides
     * whether any of the VR settings below appear at all.
     *
     * Most people have no headset, and a section about SteamVR in the middle of
     * their settings is noise they have to read past every time they come here
     * to change the buffer length. So the VR side is opt-in from outside
     * Discord: run the installer and it appears, run it again with -Uninstall
     * and it goes away. Nothing about the capture changes either way.
     */
    vrInstalled: {
        type: OptionType.BOOLEAN,
        description: "Whether the SteamVR side of the plugin has been installed",
        default: false,
        hidden: true
    },
    vrSection: {
        type: OptionType.COMPONENT,
        hidden: () => !settings.store.vrInstalled,
        component: () => (
            <SettingsSection
                title="VR"
                note="Somebody in a headset cannot see Discord, cannot see the overlay and cannot reach the keyboard."
            />
        )
    },
    vrControls: {
        hidden: () => !settings.store.vrInstalled,
        type: OptionType.BOOLEAN,
        description: "Control Clipper from a VR controller via SteamVR bindings",
        default: false
    },
    vrBindings: {
        type: OptionType.COMPONENT,
        hidden: () => !settings.store.vrInstalled,
        component: VrBindings
    },
    vrPanel: {
        hidden: () => !settings.store.vrInstalled,
        type: OptionType.BOOLEAN,
        description: "Show notices inside the headset",
        default: true
    },
    vrMotionWatch: {
        hidden: () => !settings.store.vrInstalled,
        type: OptionType.BOOLEAN,
        description: "Let fast hand movement count towards markers (corroboration only)",
        default: true
    },
    updatesSection: {
        type: OptionType.COMPONENT,
        component: () => (
            <SettingsSection
                title="Updates"
                note="The plugin ships as a bundle and updates itself."
            />
        )
    },
    updateStatus: {
        type: OptionType.COMPONENT,
        component: UpdateStatus
    },
    updateCheck: {
        type: OptionType.BOOLEAN,
        description: "Check for updates when Discord starts. The check downloads nothing",
        default: true
    },
    updateAutomatic: {
        type: OptionType.BOOLEAN,
        description: "Install updates without asking. Takes effect on next restart",
        default: false
    }
});

/**
 * Mime type to record in, or an empty string when the client can encode none.
 *
 * The configured container comes first, then the others: MP4 recording needs a
 * recent Chromium, and a client too old for it should still be able to clip
 * rather than fail to arm the buffer at all.
 */
export function pickMimeType(container: string): string {
    return mimeTypeChain(container)[0] ?? "";
}

/**
 * Every mime type this client says it can take, the configured one first.
 *
 * `isTypeSupported` is a claim, not a guarantee: a Chromium that answers yes to
 * H.264 still fails at the first frame when the hardware encoder behind it is
 * broken, which a driver or a client update is enough to do. The buffer keeps
 * the whole list so a dead encoder costs the clip its container rather than
 * costing the user their buffer.
 */
export function mimeTypeChain(container: string): string[] {
    const others = [Container.Mp4H264, Container.WebmVp9, Container.WebmVp8].filter(c => c !== container);
    const candidates = [...new Set([container, ...others].flatMap(mimeCandidates))];

    return candidates.filter(t => MediaRecorder.isTypeSupported(t));
}

/** Resolves the configured container to a list of mime types, best first. */
function mimeCandidates(container: string): string[] {
    switch (container) {
        case Container.Mp4H264:
            return [
                "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
                "video/mp4;codecs=avc1,opus",
                "video/mp4"
            ];
        case Container.WebmVp8:
            return ["video/webm;codecs=vp8,opus", "video/webm"];
        case Container.WebmVp9:
        default:
            return ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"];
    }
}

export function extensionFor(mimeType: string): string {
    return mimeType.startsWith("video/mp4") ? "mp4" : "webm";
}
