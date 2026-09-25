/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/*
 * Vencord Clipper - updates
 *
 * The plugin is installed as a finished bundle, not from a store that keeps it
 * current, so it has to look after itself: every launch asks GitHub for the
 * newest release, and a newer one is offered - or taken, when the setting says
 * so - and written over the installed bundle by ./native.
 *
 * Nothing here downloads anything on its own. The check reads a release list;
 * the install only happens on `installUpdate`, which is either the user
 * pressing the button or the automatic setting being on.
 */

import { showNotification } from "@api/Notifications";
import { Logger } from "@utils/Logger";
import type { PluginNative } from "@utils/types";
import { Alerts, Toasts } from "@webpack/common";

import type { UpdateInfo } from "./native";
import { recorder } from "./recorder";
import { settings } from "./settings";
import { toast as showToast } from "./toasts";
import { clipRetentionSeconds, errorMessage } from "./utils";

const Native = VencordNative.pluginHelpers.Clipper as PluginNative<typeof import("./native")>;
const logger = new Logger("Clipper");

/**
 * The version this bundle was built as.
 *
 * Bumped by hand, and read back by scripts\build-prebuilt.ps1, which stamps
 * it into prebuilt\build-info.json. The check compares it against the newest
 * release tag, so a build has to go out under the tag it names here: publish
 * this one as v5.5.1, or the clients already running it are offered it again.
 */
export const CLIPPER_VERSION = "1.0.0";

interface UpdateState {
    /** A check is in flight. */
    checking: boolean;
    /** The bundle is being fetched and swapped in. */
    installing: boolean;
    /** What the last check found, or null when none has finished. */
    latest: UpdateInfo | null;
    /** Why the last check or install failed, in one line. */
    error: string;
    /** True once an update has been written and only a restart is missing. */
    restartNeeded: boolean;
}

const state: UpdateState = {
    checking: false,
    installing: false,
    latest: null,
    error: "",
    restartNeeded: false
};

const listeners = new Set<() => void>();

/**
 * The check currently running, if any.
 *
 * A launch check and a hand-pressed "check now" overlap on a slow network,
 * and the second caller must wait on the first one's answer rather than read
 * a stale `latest`: on a first launch that value is null while `error` is
 * empty, which the manual path would toast as a failure that never happened.
 */
let flight: Promise<UpdateInfo | null> | null = null;

export function updateState(): UpdateState {
    return state;
}

/** Subscribes to every change of the state above. Returns the unsubscribe. */
export function watchUpdates(listener: () => void): () => void {
    listeners.add(listener);
    return () => void listeners.delete(listener);
}

function change(patch: Partial<UpdateState>): void {
    Object.assign(state, patch);
    for (const listener of [...listeners]) {
        try {
            listener();
        } catch (e) {
            logger.warn("An update listener threw", e);
        }
    }
}

/** An update failure is read once and dismissed, so it is given a moment. */
function toast(message: string, type: string): void {
    showToast(message, type, 6000);
}

/** Extra settings keys kept out of the panel: a pending restart and the first-run hello. */
type ExtraStore = typeof settings.store & {
    pendingRestartVersion?: string;
    welcomedShown?: boolean;
};

/*
 * Read lazily, never at module load: settings.tsx pulls UpdateStatus, which
 * pulls this module, so reading settings.store here would run while the
 * settings module is still evaluating and throw at startup (taking the whole
 * renderer bundle with it).
 */
function extraStore(): ExtraStore {
    return settings.store as ExtraStore;
}

/**
 * Turns a raw failure into something to do about it.
 *
 * The native side throws technical errors (errno names, HTTP codes); those go
 * to the log, while the user gets the one action that helps.
 */
function friendlyUpdateError(raw: string): string {
    const text = raw.toLowerCase();
    if (text.includes("eacces") || text.includes("eperm") || text.includes("access is denied") || text.includes("permission"))
        return "Clipper could not write the new files — re-run install.bat as admin, then try again.";
    if (text.includes("404") || text.includes("not found") || text.includes("hash") || text.includes("checksum") || text.includes("mismatch"))
        return "The download failed, retry in a moment.";
    if (text.includes("403") || text.includes("rate") || text.includes("limit") || text.includes("busy"))
        return "GitHub is busy, retry in an hour.";
    return raw;
}

/**
 * Whether the main process half of the plugin knows about updates.
 *
 * The renderer and the main bundle are loaded at different moments: reloading
 * the client window (Ctrl+R) picks up a freshly installed renderer while the
 * main process keeps the one it started with. A client in that state has an
 * updater in the window and none behind it, and calling through would throw a
 * TypeError at launch, which is exactly the moment nothing should shout.
 */
function nativeReady(): boolean {
    return typeof Native?.checkUpdate === "function" && typeof Native?.downloadUpdate === "function";
}

export const RESTART_FIRST = "Clipper was updated while Discord was still running. Fully quit Discord (right-click the Discord icon in the Windows tray > Quit Discord), then start it again — Ctrl+R is not enough.";

/**
 * Asks GitHub what the newest release is.
 *
 * Throws nothing: a client with no network, or a rate limit, must not turn a
 * launch into an error the user has to dismiss.
 */
export async function checkForUpdate(): Promise<UpdateInfo | null> {
    if (flight) return flight;

    if (!nativeReady()) {
        logger.info("The main process is still on an older Clipper, so the check waits for a full restart");
        change({ error: RESTART_FIRST });

        return null;
    }

    change({ checking: true, error: "" });

    flight = (async () => {
        try {
            const info = await Native.checkUpdate(CLIPPER_VERSION);
            change({ latest: info });

            logger.info(`Update check: installed ${CLIPPER_VERSION}, published ${info.version || "unknown"}`);

            return info;
        } catch (e) {
            logger.warn("Could not check for updates", e);
            change({ error: errorMessage(e) });

            return null;
        } finally {
            flight = null;
            change({ checking: false });
        }
    })();

    return flight;
}

/**
 * Fetches a release and writes it over the installed bundle.
 *
 * The client keeps running on the bundle it loaded at startup, so nothing
 * changes until it restarts; that is what the modal at the end is for.
 */
export async function installUpdate(info: UpdateInfo, quiet = false): Promise<boolean> {
    if (state.installing) return false;

    if (!nativeReady()) {
        change({ error: RESTART_FIRST });
        if (!quiet) toast(RESTART_FIRST, Toasts.Type.FAILURE);

        return false;
    }

    if (!info.writable) {
        const message = `Clipper cannot write to ${info.directory}. Re-run install.bat as admin, then try again.`;
        change({ error: message });
        if (!quiet) toast(message, Toasts.Type.FAILURE);

        return false;
    }

    change({ installing: true, error: "" });
    // A long toast, not the usual 6 seconds: quitting mid-write is the one
    // thing that leaves a half-written bundle behind. Both check-now buttons
    // stay disabled through `installing` (see UpdateStatus and checkNow).
    if (!quiet) showToast(`Installing Clipper ${info.version}… do not quit Discord`, Toasts.Type.MESSAGE, 30000);

    try {
        const files = await Native.downloadUpdate(info.tag, CLIPPER_VERSION);
        logger.info(`Installed Clipper ${info.version}: ${files.length} files replaced`);

        // Kept in settings, not just in memory: after "Later", or a window
        // reload that wipes this module's state, the next launch still knows
        // a restart is owed. Cleared once the new bundle is seen running.
        extraStore().pendingRestartVersion = info.version;
        change({ restartNeeded: true });
        offerRestart(info);

        return true;
    } catch (e) {
        logger.error("Could not install the update", e);
        const reason = friendlyUpdateError(errorMessage(e));
        change({ error: reason });
        toast(`Could not install Clipper ${info.version}: ${reason}`, Toasts.Type.FAILURE);

        return false;
    } finally {
        change({ installing: false });
    }
}

/** Asks whether to restart now, since the new bundle only loads on a restart. */
function offerRestart(info: UpdateInfo): void {
    Alerts.show({
        title: `Clipper ${info.version} is ready`,
        body: `Fully quit Discord (right-click the Discord icon in the Windows tray > Quit Discord), then start it again — Ctrl+R is not enough. Your unsaved recording (the last ${clipRetentionSeconds(settings.store.clipLength)} seconds you haven't saved yet) is lost on restart, so save the clip first if there is one worth keeping.`,
        confirmText: "Restart now",
        cancelText: "Later",
        onConfirm: () => {
            // Written down before it happens: a client that restarts by itself
            // is otherwise indistinguishable, in the log, from one that crashed.
            logger.info(`Restarting the client to load Clipper ${info.version}`);
            void Native.relaunchClient();
        }
    });
}

/** Offers the update found by a check, with the notes the release carries. */
function offerUpdate(info: UpdateInfo): void {
    Alerts.show({
        title: `Clipper ${info.version} is out`,
        body: `You are on ${CLIPPER_VERSION}.${info.notes ? `\n\n${info.notes}` : ""}`,
        confirmText: "Update now",
        cancelText: "Not now",
        onConfirm: () => void installUpdate(info)
    });
}

/**
 * The launch check.
 *
 * Called from the plugin's start(), and deliberately not awaited there: a slow
 * or unreachable GitHub must not hold up the buffer arming.
 */
export async function checkAtLaunch(): Promise<void> {
    // A "Later" from a previous run still owes a restart: say so again
    // instead of staying quiet. The in-memory flag covers a plugin toggle,
    // the settings flag covers a window reload that wiped this module.
    const pending = extraStore().pendingRestartVersion;
    if (pending && pending !== CLIPPER_VERSION) {
        change({ restartNeeded: true });
    }
    if (state.restartNeeded) {
        toast("Clipper update ready — restart Discord to load it (quit from the tray, then start again)", Toasts.Type.MESSAGE);
    } else if (pending) {
        // The new bundle is the one running, so nothing is owed anymore.
        extraStore().pendingRestartVersion = undefined;
    }

    if (!settings.store.updateCheck) return;

    const info = await checkForUpdate();
    if (state.error === RESTART_FIRST) {
        toast(RESTART_FIRST, Toasts.Type.FAILURE);
        return;
    }
    if (!info) {
        if (state.error) toast("Could not check for updates (no connection / GitHub busy). Will retry next launch.", Toasts.Type.FAILURE);
        return;
    }
    if (!info.available) return;

    if (!settings.store.updateAutomatic) {
        offerUpdate(info);
        return;
    }

    // Silent path: nothing is asked, and the only thing said is that a restart
    // is what is left to do.
    const installed = await installUpdate(info, true);
    if (!installed) offerUpdate(info);
    else {
        showNotification({
            title: `Clipper updated to ${info.version}`,
            body: `It loads on the next Discord restart. Your unsaved recording (the last ${clipRetentionSeconds(settings.store.clipLength)} seconds you haven't saved yet) is lost on restart, so save the clip first if there is one worth keeping.`
        });
    }
}

/** The manual check, from the toolbox or the settings button. */
export async function checkNow(): Promise<void> {
    // The settings button disables itself through `installing`; the toolbox
    // entry cannot, so it is stopped here instead of stacking a check on a write.
    if (state.installing) {
        toast("Installing Clipper… please wait until it finishes before checking again.", Toasts.Type.MESSAGE);
        return;
    }

    const info = await checkForUpdate();

    if (!info) {
        toast(
            state.error === RESTART_FIRST ? RESTART_FIRST : friendlyUpdateError(state.error || "Could not reach GitHub."),
            Toasts.Type.FAILURE
        );
        return;
    }

    if (info.available) offerUpdate(info);
    else toast(`Clipper ${CLIPPER_VERSION} is the latest release.`, Toasts.Type.SUCCESS);
}

/** Restarts the client, for the settings button. */
export function restartClient(): void {
    if (typeof Native?.relaunchClient !== "function") {
        toast("Quit Discord from the tray icon and start it again.", Toasts.Type.FAILURE);
        return;
    }

    // A restart throws away what the buffer is holding, so when it is
    // recording the button asks first rather than wiping it outright.
    if (recorder.isRecording) {
        Alerts.show({
            title: "Restart Discord?",
            body: `Restarting throws away your unsaved recording (the last ${clipRetentionSeconds(settings.store.clipLength)} seconds you haven't saved yet). Save the clip first if there is one worth keeping.`,
            confirmText: "Restart anyway",
            cancelText: "Cancel",
            onConfirm: () => {
                logger.info("Restarting the client, asked for from the settings");
                void Native.relaunchClient();
            }
        });
        return;
    }

    logger.info("Restarting the client, asked for from the settings");
    void Native.relaunchClient();
}
