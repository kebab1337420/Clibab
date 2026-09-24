/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/*
 * Vencord Clipper - shared helpers
 */

/**
 * Name of the thumbnail that belongs to a clip.
 *
 * A sidecar rather than an entry in the library file: it is written once, it is
 * binary, and a clip copied out of the folder by hand should take its picture
 * with it.
 */
export function thumbNameFor(name: string): string {
    return `${name.replace(/\.(webm|mp4)$/i, "")}.thumb.jpg`;
}

export function captureFrameRate(value: unknown): number {
    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return 30;
    return Math.min(120, Math.max(1, value));
}

export function captureVideoBitrate(value: unknown): number {
    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return 8_000_000;
    return Math.round(Math.min(50, Math.max(1, value)) * 1_000_000);
}

export function captureHeight(value: unknown): number {
    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return 0;
    if (value < 120 || value > 4320) return 0;
    return Math.round(value);
}

export function clipRetentionSeconds(value: unknown): number {
    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return 30;
    return Math.min(600, Math.max(5, value));
}

export interface Keybind {
    code: string;
    ctrl: boolean;
    shift: boolean;
    alt: boolean;
    meta: boolean;
}

/** Serializes a keybind to a stable string, e.g. "ctrl+shift+KeyS". */
export function serializeKeybind(kb: Keybind): string {
    const parts: string[] = [];
    if (kb.ctrl) parts.push("ctrl");
    if (kb.shift) parts.push("shift");
    if (kb.alt) parts.push("alt");
    if (kb.meta) parts.push("meta");
    parts.push(kb.code);
    return parts.join("+");
}

export function parseKeybind(value: string): Keybind | null {
    if (typeof value !== "string" || !value) return null;

    const parts = value.split("+").filter(Boolean);
    const code = parts.pop();
    if (!code) return null;

    return {
        code,
        ctrl: parts.includes("ctrl"),
        shift: parts.includes("shift"),
        alt: parts.includes("alt"),
        meta: parts.includes("meta")
    };
}

const KEY_LABELS: Record<string, string> = {
    ControlLeft: "Ctrl",
    ControlRight: "Ctrl",
    ShiftLeft: "Shift",
    ShiftRight: "Shift",
    AltLeft: "Alt",
    AltRight: "Alt",
    Space: "Space",
    Escape: "Esc"
};

/** Human readable label, e.g. "Ctrl + Shift + S". */
export function formatKeybind(value: string): string {
    const kb = parseKeybind(value);
    if (!kb) return "Unbound";

    const parts: string[] = [];
    if (kb.ctrl) parts.push("Ctrl");
    if (kb.shift) parts.push("Shift");
    if (kb.alt) parts.push("Alt");
    if (kb.meta) parts.push("Meta");

    let key = KEY_LABELS[kb.code] ?? kb.code;
    key = key.replace(/^Key/, "").replace(/^Digit/, "").replace(/^Numpad/, "Num ");
    parts.push(key);

    return parts.join(" + ");
}

const MODIFIER_CODES = ["ControlLeft", "ControlRight", "ShiftLeft", "ShiftRight", "AltLeft", "AltRight", "MetaLeft", "MetaRight"];

export function isModifierKey(code: string): boolean {
    return MODIFIER_CODES.includes(code);
}

export function keybindMatches(value: string, event: KeyboardEvent): boolean {
    const kb = parseKeybind(value);
    if (!kb) return false;

    return event.code === kb.code
        && event.ctrlKey === kb.ctrl
        && event.shiftKey === kb.shift
        && event.altKey === kb.alt
        && event.metaKey === kb.meta;
}

export function keybindFromEvent(event: KeyboardEvent): Keybind {
    return {
        code: event.code,
        ctrl: event.ctrlKey,
        shift: event.shiftKey,
        alt: event.altKey,
        meta: event.metaKey
    };
}

/*
 * Electron accelerators, used to register the keybinds system-wide so they also
 * fire while Discord is not the focused window.
 *
 * Only the keys below can be registered globally; anything else keeps working
 * through the in-client listener only.
 */
const ACCELERATOR_KEYS: Record<string, string> = {
    Space: "Space",
    Escape: "Esc",
    Enter: "Return",
    NumpadEnter: "Return",
    Tab: "Tab",
    Backspace: "Backspace",
    Delete: "Delete",
    Insert: "Insert",
    Home: "Home",
    End: "End",
    PageUp: "PageUp",
    PageDown: "PageDown",
    ArrowUp: "Up",
    ArrowDown: "Down",
    ArrowLeft: "Left",
    ArrowRight: "Right",
    PrintScreen: "PrintScreen",
    CapsLock: "Capslock",
    NumpadAdd: "numadd",
    NumpadSubtract: "numsub",
    NumpadMultiply: "nummult",
    NumpadDivide: "numdiv",
    NumpadDecimal: "numdec",
    Minus: "-",
    Equal: "=",
    BracketLeft: "[",
    BracketRight: "]",
    Backslash: "\\",
    Semicolon: ";",
    Quote: "'",
    Comma: ",",
    Period: ".",
    Slash: "/",
    Backquote: "`"
};

/** Maps a key code to its accelerator name, empty when it cannot be registered. */
function acceleratorKey(code: string): string {
    if (/^Key[A-Z]$/.test(code)) return code.slice(3);
    if (/^Digit[0-9]$/.test(code)) return code.slice(5);
    if (/^Numpad[0-9]$/.test(code)) return `num${code.slice(6)}`;
    if (/^F([1-9]|1[0-9]|2[0-4])$/.test(code)) return code;

    return ACCELERATOR_KEYS[code] ?? "";
}

/**
 * Converts a stored keybind to an Electron accelerator, e.g. "alt+F10" to
 * "Alt+F10". Returns an empty string when the key has no accelerator name, in
 * which case the bind cannot be registered globally.
 */
export function toAccelerator(value: string): string {
    const kb = parseKeybind(value);
    if (!kb) return "";

    const key = acceleratorKey(kb.code);
    if (!key) return "";

    const parts: string[] = [];
    if (kb.ctrl) parts.push("Control");
    if (kb.shift) parts.push("Shift");
    if (kb.alt) parts.push("Alt");
    if (kb.meta) parts.push("Super");
    parts.push(key);

    return parts.join("+");
}

export function formatBytes(bytes: number): string {
    // A size read off a broken file can be NaN or Infinity; nothing renders
    // those well, and "0 B" is the honest fallback for them.
    if (!Number.isFinite(bytes)) return "0 B";

    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
    return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

/** File-system safe timestamp, e.g. "2026-08-19_14-32-07". */
export function timestampName(prefix = "clip"): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${prefix}-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
}

/** True when the user is typing in a text field and the keybind has no modifier. */
export function isTypingTarget(): boolean {
    const el = document.activeElement as HTMLElement | null;
    if (!el) return false;
    return el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable;
}

/**
 * True on a Linux client.
 *
 * userAgentData is Chromium-only and exact; navigator.platform covers the
 * rest ("Linux x86_64", "Linux armv8l"...). Needed because loopback audio
 * through Chromium exists only on Windows: on Linux the silent capture
 * paths come back without a sound track, and the plugin must notice.
 */
export function isLinux(): boolean {
    try {
        const branded = (navigator as Navigator & { userAgentData?: { platform?: string; }; }).userAgentData?.platform;
        if (typeof branded === "string" && branded) return branded.toLowerCase().includes("linux");
    } catch {
        // Non-Chromium client: fall through to the legacy platform string.
    }

    try {
        return navigator.platform.toLowerCase().startsWith("linux");
    } catch {
        return false;
    }
}

/** A position on a timeline, e.g. "1:07.5". */
export function formatTime(seconds: number): string {
    // NaN and Infinity make no sensible position; a zero time is the honest
    // fallback for one that cannot be expressed.
    if (!Number.isFinite(seconds)) return "0:00";

    const value = Math.max(0, seconds);
    const minutes = Math.floor(value / 60);
    const rest = value - minutes * 60;

    return `${minutes}:${rest.toFixed(1).padStart(4, "0")}`;
}

/*
 * Whether a keybind is being picked right now.
 *
 * This lives here rather than beside the shortcuts themselves. The picker is a
 * settings component and the shortcut module pulls in the recorder, so having
 * the picker import it closes an import cycle around a module that builds a
 * recorder as it loads. This one imports nothing, so both sides can depend on
 * it.
 *
 * Counted rather than a flag: the settings panel holds three pickers, and
 * opening a second one before the first has closed must not hand the binds back
 * while the second is still listening.
 */
let suspensions = 0;
let onSuspension: ((suspended: boolean) => void) | null = null;

/**
 * Follows the picker, so the OS-level binds can be freed while one is open.
 *
 * Set by the shortcut module, which is the only thing that can register and
 * unregister them. Null unhooks it.
 */
export function watchKeybindSuspension(listener: ((suspended: boolean) => void) | null): void {
    onSuspension = listener;
}

/** True while a keybind is being picked, so the shortcuts must not fire. */
export function keybindsSuspended(): boolean {
    return suspensions > 0;
}

/**
 * Holds the shortcuts back until the returned function is called.
 *
 * A registered accelerator is swallowed by the OS before the renderer sees the
 * key, which is exactly why a combination could not be assigned: pressing the
 * one already bound produced no event at all. While a picker is open the
 * registration is dropped and the in-client listener stands down, so every
 * combination reaches the picker and none of them saves a clip on the way.
 */
export function suspendKeybinds(): () => void {
    suspensions++;
    if (suspensions === 1) onSuspension?.(true);

    let released = false;

    return () => {
        if (released) return;
        released = true;

        suspensions = Math.max(0, suspensions - 1);
        if (!suspensions) onSuspension?.(false);
    };
}


/**
 * Chunk interval, in ms. Smaller = finer trimming, more overhead.
 *
 * Here rather than in ./recorder because ./voiceRecord cuts on the same
 * boundaries and cannot import it - the recorder imports the voice buffers, so
 * the other direction is a cycle. It had its own copy of the number and a
 * comment saying the two had to agree, which is the arrangement where they
 * quietly stop agreeing.
 */
export const TIMESLICE = 1000;

/**
 * Short-save lengths offered wherever a clip is cut down, shortest first.
 *
 * Shared by the overlay menu, the replay card and the in-game editor, which
 * each had their own copy with their own upper bound.
 */
export const TRIM_CUTS = [15, 30, 60];

/** One-click capture setup: frame rate, height, bitrate in Mbps, length in s. */
export interface CapturePreset {
    label: string;
    fps: number;
    resolution: number;
    bitrate: number;
    length: number;
    /** Container value, as stored: presets are whole setups, not four knobs. */
    container: string;
}

/**
 * Eco sips memory (~15MB held), Balanced is the everyday middle (~90MB),
 * Quality spends more (~225MB) for demanding games. All stay well under
 * the 512MB the buffer refuses to cross.
 */
export const CAPTURE_PRESETS: CapturePreset[] = [
    { label: "Eco", fps: 30, resolution: 720, bitrate: 4, length: 30, container: "mp4-h264" },
    { label: "Balanced", fps: 60, resolution: 1080, bitrate: 12, length: 60, container: "mp4-h264" },
    { label: "Quality", fps: 60, resolution: 1440, bitrate: 20, length: 90, container: "mp4-h264" }
];

/** One clip for the duplicate hunt: size, filesystem time, filed category. */
export interface ClipEntry {
    name: string;
    size: number;
    modified: number;
    game: string;
}

/**
 * Clips that are probably the same moment saved twice.
 *
 * A manual save, a multi-angle request and an end-of-call clip of one play
 * land within seconds of each other under one game; an hour-long session of
 * distinct plays does not. Groups are per game, opened by the first clip and
 * closed 90 seconds later, so back-to-back evenings never chain into one.
 */
export function findDuplicates(entries: ClipEntry[]): ClipEntry[][] {
    const WINDOW_MS = 90_000;

    const byGame = new Map<string, ClipEntry[]>();
    for (const entry of entries) {
        const list = byGame.get(entry.game) ?? [];
        list.push(entry);
        byGame.set(entry.game, list);
    }

    const groups: ClipEntry[][] = [];

    for (const list of byGame.values()) {
        const sorted = [...list].sort((a, b) => a.modified - b.modified);

        let run: ClipEntry[] = [];
        for (const entry of sorted) {
            if (run.length && entry.modified - run[0].modified > WINDOW_MS) {
                if (run.length > 1) groups.push(run);
                run = [];
            }
            run.push(entry);
        }

        if (run.length > 1) groups.push(run);
    }

    return groups.sort((a, b) => b[0].modified - a[0].modified);
}

/**
 * Marker offsets as video chapters, one `timestamp title` line each.
 *
 * Labels come from the automatic markers ("a kill in Counter-Strike 2"); a
 * manual mark with none reads "Highlight N". Sorted, starting at 00:00 as
 * chapters must, empty when there is nothing to chapter.
 */
export function chaptersOf(markers: number[], labels?: Array<string | null | undefined>): string {
    const rows = markers
        .map((at, i) => ({ at: Math.max(0, Math.floor(Number(at) || 0)), index: i }))
        .filter(r => Number.isFinite(r.at))
        .sort((a, b) => a.at - b.at)
        .map((r, position) => ({
            at: r.at,
            label: labels?.[r.index]?.trim() || `Highlight ${position + 1}`
        }));

    if (!rows.length) return "";
    if (rows[0].at > 0) rows.unshift({ at: 0, label: "Start" });

    const stamp = (total: number) => {
        const hours = Math.floor(total / 3600);
        const minutes = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
        const seconds = String(total % 60).padStart(2, "0");

        return `${hours ? `${hours}:` : ""}${minutes}:${seconds}`;
    };

    return rows.map(r => `${stamp(r.at)} ${r.label}`).join("\n");
}

/**
 * Something readable out of anything that was thrown.
 *
 * `String(e)` alone is what put `[object Object]` in front of a user instead of
 * a reason: the native voice module rejects with plain objects rather than
 * `Error`s, and a plain object stringifies to nothing at all. Anything that
 * came from across the IPC boundary has to be dug into by hand, including the
 * non-enumerable properties an `Error` from another realm keeps its message in.
 */
export function errorMessage(e: unknown): string {
    if (e instanceof Error) return e.message || e.name;
    if (typeof e === "string") return e;
    if (e === null || e === undefined) return "no reason given";

    if (typeof e === "object") {
        const record = e as Record<string, unknown>;

        for (const key of ["message", "error", "reason", "detail", "description"]) {
            const value = record[key];
            if (typeof value === "string" && value) return value;
            if (value && typeof value === "object") {
                const nested = errorMessage(value);
                if (nested && nested !== "[object Object]") return nested;
            }
        }

        try {
            const json = JSON.stringify(e);
            if (json && json !== "{}" && json !== "null") return json;
        } catch {
            // Circular, or something with a throwing getter. The properties are
            // still worth reading one at a time.
        }

        try {
            const parts: string[] = [];
            for (const key of Object.getOwnPropertyNames(record)) {
                if (key === "stack") continue;
                parts.push(`${key}: ${String(record[key])}`);
            }

            if (parts.length) return parts.join(", ");
        } catch {
            // Nothing readable on it at all, which String() will say as well.
        }
    }

    return String(e);
}

/**
 * Seeks and waits, giving up rather than hanging on a frame that never lands.
 *
 * The early return is not an optimisation: a browser that is already at `at`
 * fires no `seeked` at all, so without it every frame that needed no seek waits
 * out the whole timeout before carrying on.
 *
 * `within` is how close counts as already there, and `timeout` is how long a
 * seek is waited on before the caller carries on regardless. The defaults suit
 * grabbing a frame or two out of a short file; a render walking a long one
 * wants the first tightened and the second lengthened.
 */
export function seekVideo(
    video: HTMLVideoElement,
    at: number,
    { within = .05, timeout = 2000 }: { within?: number; timeout?: number; } = {}
): Promise<void> {
    return new Promise<void>(resolve => {
        if (Math.abs(video.currentTime - at) < within) return resolve();

        let done = false;

        const settle = () => {
            if (done) return;

            done = true;
            clearTimeout(timer);
            video.removeEventListener("seeked", settle);
            resolve();
        };

        const timer = setTimeout(settle, timeout);
        video.addEventListener("seeked", settle);
        video.currentTime = at;
    });
}
