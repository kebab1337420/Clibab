/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/*
 * Vencord Clipper
 * Shadowplay-style clipping inside Discord: a rolling buffer of the last N
 * seconds that you dump to a file with a keybind or the chat bar button.
 */

import { SettingsStore } from "@api/Settings";
import ErrorBoundary from "@components/ErrorBoundary";
import definePlugin from "@utils/types";
import { createRoot, Toasts } from "@webpack/common";

import { attachMenuPatch } from "./attachMenu";
import { cleanupOldClips } from "./clips";
import { ClipperChatButton, ClipperIcon } from "./components/ClipperChatButton";
import { ClipperOverlay } from "./components/ClipperOverlay";
import { encoderSummary, probeEncoders } from "./encoders";
import { gameAudioReport } from "./gameAudio";
import { gameEventReport, stopGameEvents, syncGameEvents } from "./gameEvents";
import { hideGameOverlay } from "./gameOverlay";
import { gameVideo } from "./gameVideo";
import { runShortcut, startGlobalKeybinds, stopGlobalKeybinds, syncGlobalKeybinds } from "./globalKeybinds";
import { micReport } from "./micInput";
import { SYSTEM_CHANNEL } from "./mixer";
import { installPovRequests, requestPov, uninstallPovRequests } from "./multipov";
import { adoptOrphans, logger, recorder } from "./recorder";
import { settings } from "./settings";
import { toast } from "./toasts";
import { checkAtLaunch } from "./updater";
import { isTypingTarget, keybindMatches, keybindsSuspended, parseKeybind } from "./utils";
import { installVoiceTaps, probeVoiceTaps, uninstallVoiceTaps } from "./voiceTaps";
import { stopVr, syncVr, vrReport } from "./vr";

/*
 * In-client fallback. The same binds are registered with the OS (see
 * ./globalKeybinds), which normally swallows the key before Discord sees it;
 * this listener covers the binds the OS refused and the ones with no
 * accelerator, and `runShortcut` drops the duplicate when both paths fire.
 */
function onKeyDown(e: KeyboardEvent) {
    if (e.repeat) return;

    // A picker is open and the user is pressing the very bind it is replacing:
    // that keystroke belongs to the picker, not to the recorder.
    if (keybindsSuspended()) return;

    const { saveKeybind, toggleKeybind, markKeybind, povKeybind, replayKeybind } = settings.store;

    for (const [bind, action] of [
        [saveKeybind, "save"],
        [toggleKeybind, "toggle"],
        [markKeybind, "mark"],
        [povKeybind, "pov"],
        [replayKeybind, "replay"]
    ] as const) {
        if (!keybindMatches(bind, e)) continue;

        // A bare key must not fire while the user is writing a message.
        const parsed = parseKeybind(bind)!;
        const bare = !parsed.ctrl && !parsed.shift && !parsed.alt && !parsed.meta;
        if (bare && isTypingTarget()) continue;

        e.preventDefault();
        e.stopPropagation();
        runShortcut(action);
        return;
    }
}

/**
 * Settings that something outside the settings panel has to be told about, and
 * what to tell.
 *
 * The keybinds go to the OS-level registration. The highlight watcher listens
 * to the call, and has to start or stop the moment it is asked to rather than at
 * the next start of the buffer - somebody who turns it on mid-game means now.
 */
const WATCHED: Array<readonly [string, () => void]> = [
    ["saveKeybind", () => void syncGlobalKeybinds()],
    ["toggleKeybind", () => void syncGlobalKeybinds()],
    ["markKeybind", () => void syncGlobalKeybinds()],
    ["povKeybind", () => void syncGlobalKeybinds()],
    ["replayKeybind", () => void syncGlobalKeybinds()],
    ["globalKeybinds", () => void syncGlobalKeybinds()],
    ["autoHighlight", () => recorder.syncHighlights()],
    ["gameAudioWatch", () => recorder.restartHighlights()],
    ["gameVideoWatch", () => recorder.restartHighlights()],
    ["gameIntegrations", () => void syncGameEvents()],
    ["vrInstalled", () => void syncVr()],
    ["vrControls", () => void syncVr()]
];

/**
 * Kept so the listeners can be dropped again on stop(): toggling the plugin off
 * and on otherwise stacks a new set on every start, and each settings change
 * then re-registers the binds once per stacked listener.
 */
const settingsWatchers: Array<() => void> = [];

function watchSettings() {
    unwatchSettings();

    for (const [name, act] of WATCHED) {
        const path = `plugins.Clipper.${name}` as any;
        const listener = () => {
            try {
                act();
            } catch (e) {
                logger.warn(`Could not act on a change to ${name}`, e);
            }
        };

        SettingsStore.addChangeListener(path, listener);
        settingsWatchers.push(() => SettingsStore.removeChangeListener(path, listener));
    }
}

function unwatchSettings() {
    for (const drop of settingsWatchers.splice(0)) {
        try {
            drop();
        } catch (e) {
            logger.warn("Could not drop a settings listener", e);
        }
    }
}

/**
 * Chromium reloads the client on Ctrl+R / Ctrl+Shift+R before any DOM listener
 * runs, so those binds can never reach the plugin. Move anyone still on the old
 * defaults over to the new ones.
 *
 * Alt+F9 / Alt+F10 moved a second time: they are GeForce Experience's own
 * defaults (record / instant replay), so the plugin's binds lost to NVIDIA on
 * exactly the machines most likely to clip. Only exact old defaults move -
 * a custom bind is never touched.
 */
function migrateReloadKeybinds() {
    if (settings.store.toggleKeybind === "ctrl+shift+KeyR") settings.store.toggleKeybind = "ctrl+alt+F9";
    if (settings.store.saveKeybind === "ctrl+shift+KeyS") settings.store.saveKeybind = "ctrl+alt+F10";

    if (settings.store.toggleKeybind === "alt+F9") settings.store.toggleKeybind = "ctrl+alt+F9";
    if (settings.store.saveKeybind === "alt+F10") settings.store.saveKeybind = "ctrl+alt+F10";
    if (settings.store.markKeybind === "alt+F11") settings.store.markKeybind = "ctrl+alt+F11";
    if (settings.store.povKeybind === "alt+F12") settings.store.povKeybind = "ctrl+alt+F12";
    if (settings.store.replayKeybind === "alt+F8") settings.store.replayKeybind = "ctrl+alt+F8";
}

/*
 * The overlay lives in its own React root attached to <body>, outside Discord's
 * tree. Patching the account panel put the plugin inside Discord's render, so
 * any error here reloaded the whole client; here it cannot.
 */
let overlayRoot: { render(node: any): void; unmount(): void; } | null = null;
let overlayElement: HTMLElement | null = null;

function mountOverlay() {
    try {
        unmountOverlay();

        overlayElement = document.createElement("div");
        overlayElement.id = "vc-clipper-overlay";
        document.body.appendChild(overlayElement);

        overlayRoot = createRoot(overlayElement);

        // A throw inside this root unmounts all of it, and nothing remounts it:
        // the panel button, the replay card and the studio would be gone for
        // the rest of the session while the recorder went on buffering behind
        // them. The boundary keeps the root alive and puts the reason on screen
        // instead of leaving an empty corner.
        overlayRoot.render(
            <ErrorBoundary message="Clipper's overlay could not be rendered. Reload the client to bring it back.">
                <ClipperOverlay />
            </ErrorBoundary>
        );
    } catch (e) {
        logger.error("Could not mount the overlay", e);
    }
}

function unmountOverlay() {
    try {
        overlayRoot?.unmount();
    } catch (e) {
        logger.warn("Overlay unmount failed", e);
    }
    overlayRoot = null;
    overlayElement?.remove();
    overlayElement = null;
}

export default definePlugin({
    name: "Clipper",
    description: "Keeps the last seconds of a captured source in memory and saves them to a clip on a keybind, with configurable length, FPS, resolution and bitrate.",
    authors: [{ name: "yeslife", id: 0n }],
    settings,

    chatBarButton: {
        icon: ClipperIcon,
        render: ClipperChatButton
    },

    // The + on the message box, one entry under uploading a file.
    contextMenus: {
        "channel-attach": attachMenuPatch
    },

    toolboxActions: {
        "Save clip": () => recorder.save(),
        "Open the clip studio": () => recorder.openStudio(),
        "Choose capture source": () => recorder.chooseSource(),
        "Clip everyone's angle": () => void requestPov(),
        "Marker": () => recorder.mark(),
        "Edit the last clip over the game": () => void toggleGameOverlay(),
        "Watch the last clip over the game": () => void watchLastClip(),
        "Run diagnostics": () => {
            void (async () => {
                const parts: string[] = [];

                try {
                    const reports = await probeEncoders();
                    parts.push(encoderSummary(reports));

                    // A container that has just encoded is not broken, whatever it
                    // did the last time the buffer armed: let the next start try it.
                    if (reports.some(r => r.ok)) recorder.retryEncoders();
                } catch (e) {
                    parts.push(`Encoders: could not probe (${e instanceof Error ? e.message : String(e)})`);
                }

                parts.push(
                    settings.store.gameAudioWatch
                        ? gameAudioReport(recorder.channelSpectrum(SYSTEM_CHANNEL))
                        : "Game sound: not listened to.",
                    gameVideo.active ? "Picture: watched." : "Picture: not watched.",
                    await gameEventReport(),
                    // Empty unless the VR side is installed, and dropped
                    // below rather than printed as a blank line.
                    await vrReport(),
                    settings.store.voiceHighlights
                        ? "Call loudness: counts towards markers."
                        : "Call loudness: ignored."
                );

                try {
                    parts.push(probeVoiceTaps());
                } catch (e) {
                    parts.push(`Voice taps: could not probe (${e instanceof Error ? e.message : String(e)})`);
                }

                try {
                    parts.push(await micReport());
                } catch (e) {
                    parts.push(`Microphone: could not check (${e instanceof Error ? e.message : String(e)})`);
                }

                const report = parts.filter(Boolean).join("\n");
                logger.info(`Diagnostics\n${report}`);
                toast(report, Toasts.Type.MESSAGE, 12000);
            })();
        }
    },

    start() {
        migrateReloadKeybinds();
        void adoptOrphans();

        // Before anything else opens a connection: a call already running when
        // the patch lands is invisible to it.
        installVoiceTaps();
        installPovRequests();

        logger.info("started", {
            source: settings.store.sourceName || "(none, will use the primary screen)"
        });

        window.addEventListener("keydown", onKeyDown, true);
        void startGlobalKeybinds();

        // Not tied to the buffer, unlike the other watchers: the point of the
        // controller binds is being able to start the buffer while wearing a
        // headset, which cannot work if they only exist once it is running.
        void syncVr();
        watchSettings();
        mountOverlay();

        if (settings.store.autoStart) recorder.start();

        // Said once, on the first run: what is on and how to start recording.
        const extraStore = settings.store as typeof settings.store & { welcomedShown?: boolean };
        if (!extraStore.welcomedShown) {
            extraStore.welcomedShown = true;
            toast(
                `Clipper is on. Pick a source from the chat-bar button to start recording (Alt+F10 drops a marker).${settings.store.autoStart ? "" : " The recording buffer stays off until you start it."}`,
                Toasts.Type.MESSAGE,
                8000
            );
        }

        // Folder hygiene, once per launch and off the critical path: old
        // clips go to the folder's own trash, so this is undoable for 7 days.
        if (settings.store.autoCleanup) {
            void cleanupOldClips(settings.store.autoCleanupDays * 86400 * 1000)
                .then(removed => {
                    if (removed.length) {
                        logger.info(`Cleaned ${removed.length} clips older than ${settings.store.autoCleanupDays} days`, removed);
                        toast(`Cleaned ${removed.length} old clip${removed.length === 1 ? "" : "s"} (in the trash)`, Toasts.Type.MESSAGE, 8000);
                    }
                })
                .catch(e => logger.warn("Automatic cleanup failed", e));
        }

        // Not awaited: an unreachable GitHub must cost the launch nothing.
        void checkAtLaunch();
    },

    stop() {
        window.removeEventListener("keydown", onKeyDown, true);
        unwatchSettings();
        stopGlobalKeybinds();
        stopGameEvents();
        stopVr();
        hideGameOverlay();
        unmountOverlay();
        recorder.stop();
        uninstallVoiceTaps();
        uninstallPovRequests();
    }
});
