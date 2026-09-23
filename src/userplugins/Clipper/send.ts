/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/*
 * Vencord Clipper - sending a clip to the channel that is open
 *
 * Saving a clip and posting it are almost always the same intention, and the
 * gap between them is a file picker, a folder to find again and a drag. This
 * puts the clip in the message box instead: the upload is not sent, it is
 * attached, so the caption and the channel are still the user's to change.
 *
 * A clip that is too big to send is the other half of the same gap. Discord's
 * answer is to refuse it, which leaves the moment on disk, so this one re-encodes
 * it down to the limit first - or, when what is wanted is the three seconds
 * everyone will quote back, turns it into a GIF instead.
 */

import { getCurrentChannel } from "@utils/discord";
import { DraftType, Toasts, UploadHandler } from "@webpack/common";

import { CLIPS_AVAILABLE, loadClipFile, loadClipUrl, probeRange, readClipBytes, typeOfClip } from "./clips";
import { clipToGif, type GifRequest, saveGif } from "./gifExport";
import { readMeta } from "./library";
import { logger } from "./recorder";
import { trimBytes } from "./repair";
import { extensionFor } from "./settings";
import { shrinkVideo } from "./shrink";
import { toast } from "./toasts";
import { formatBytes } from "./utils";
import { voiceLevelsTouched } from "./voice";

/**
 * Largest attachment a plain account may send.
 *
 * Nitro raises it, and the client knows the real number, but reading it out of
 * the store is fragile and being wrong the safe way costs nothing: the check
 * only decides whether to warn, the upload is attempted either way. Nothing
 * here reads the account's plan (no premiumType use anywhere in src), so this
 * stays at the free level and the warning names the way out instead.
 */
const FREE_LIMIT = 10 * 1024 * 1024;

function attach(file: File): boolean {
    const channel = getCurrentChannel();
    if (!channel) {
        toast("Open a channel first", Toasts.Type.FAILURE);
        return false;
    }

    if (file.size > FREE_LIMIT) {
        toast(`That clip is ${formatBytes(file.size)} - Discord may refuse files over 10MB. Shrink it, make a GIF, or send anyway (Nitro raises the limit).`, Toasts.Type.MESSAGE);
    }

    UploadHandler.promptToUpload([file], channel, DraftType.ChannelMessage);
    toast("Attached in Discord - press Enter in the message box to send it", Toasts.Type.MESSAGE);
    return true;
}

/** A step of a long job, for a caller that has somewhere to show it. */
type Progress = (step: string) => void;

/**
 * Says out loud that per-person levels do not travel with the file.
 *
 * Shared with the link path, which uploads the same untouched bytes.
 */
export async function warnUnrenderedLevels(name: string): Promise<void> {
    try {
        const meta = (await readMeta())[name];
        if (voiceLevelsTouched(meta?.levels)) {
            toast("Per-person levels only apply in a studio render - this file is untouched", Toasts.Type.MESSAGE, 8000);
        }
    } catch {
        // Metadata unreadable: the attach goes ahead as before.
    }
}

/**
 * Attaches a file, then says out loud when per-person levels stayed behind.
 *
 * Mixer moves live in the studio render only, so an attached file carrying
 * moved levels would arrive with the muted voice intact and read as broken.
 */
async function attachAndWarn(file: File, name: string): Promise<boolean> {
    const attached = attach(file);
    if (attached) await warnUnrenderedLevels(name);

    return attached;
}

/**
 * Attaches part of a clip, leaving the file on disk alone.
 *
 * The handles in the overlay over the game are a selection rather than an edit:
 * what lands in the message box is the range that was picked, and the clip in
 * the library is still the whole thing. The cut is lossless and happens in
 * memory, so nothing is written and nothing is re-encoded.
 */
export async function sendClipRange(name: string, from: number, to: number): Promise<boolean> {
    if (!CLIPS_AVAILABLE) {
        toast("Clips are only readable in the desktop client", Toasts.Type.FAILURE);
        return false;
    }

    try {
        const type = typeOfClip(name);
        const data = await readClipBytes(name);
        const cut = trimBytes(data, type, from, to);

        // Nothing back: the range covers the clip, or this container is not one
        // the parser knows. Either way the whole file is the right answer, fitted
        // to the limit the same way a whole-clip send would be.
        if (!cut) return sendClipFitted(name);

        const stem = name.replace(/\.[^.]+$/, "");
        const extension = name.split(".").pop() || "webm";

        return attachAndWarn(new File([cut as BlobPart], `${stem}-cut.${extension}`, { type }), name);
    } catch (e) {
        logger.error("Could not attach the selection", e);
        toast("Could not read that clip (file moved or deleted?).", Toasts.Type.FAILURE);
        return false;
    }
}

/**
 * Attaches a clip, making it fit first when it does not.
 *
 * The re-encode runs in real time, so the size is checked before anything is
 * started: most clips are already small enough and the only honest thing to do
 * with those is attach them untouched.
 */
export async function sendClipFitted(name: string, onProgress?: Progress): Promise<boolean> {
    if (!CLIPS_AVAILABLE) {
        toast("Clips are only readable in the desktop client", Toasts.Type.FAILURE);
        return false;
    }

    try {
        const file = await loadClipFile(name);
        if (file.size <= FREE_LIMIT) return attachAndWarn(file, name);

        onProgress?.("Too big to send - re-encoding");

        const url = URL.createObjectURL(file);
        try {
            const result = await shrinkVideo(url, { limit: FREE_LIMIT, onProgress });
            const stem = name.replace(/\.(webm|mp4)$/i, "");
            const ext = extensionFor(result.mimeType);

            if (!result.fits) {
                toast(`Smallest this clip goes is ${formatBytes(result.blob.size)} - still over the limit. Try a shorter range or GIF.`, Toasts.Type.FAILURE);
                return false;
            }

            return attachAndWarn(new File([result.blob], `${stem}-small.${ext}`, { type: result.mimeType }), name);
        } finally {
            URL.revokeObjectURL(url);
        }
    } catch (e) {
        logger.error("Could not fit the clip", e);
        toast("Could not re-encode that clip - try a shorter range or MP4 instead of WebM.", Toasts.Type.FAILURE);
        return false;
    }
}

/**
 * Start and end of a clip in seconds, or null when it cannot be read.
 *
 * Only what the GIF clamp decision needs: the export keeps 15s at most, and
 * whether the request (or the whole clip, when nothing was asked for) runs
 * longer has to be known before it starts.
 */
async function clipRange(name: string): Promise<{ start: number; end: number; } | null> {
    let url = "";

    try {
        url = await loadClipUrl(name);

        const video = document.createElement("video");
        video.preload = "auto";
        video.muted = true;
        video.src = url;

        await new Promise<void>(resolve => {
            if (video.readyState >= 1) return resolve();

            let done = false;
            const settle = () => {
                if (done) return;
                done = true;
                clearTimeout(timer);
                resolve();
            };

            const timer = setTimeout(settle, 10_000);
            video.addEventListener("loadedmetadata", settle, { once: true });
            video.addEventListener("error", settle, { once: true });
        });

        const range = await probeRange(video);

        video.removeAttribute("src");
        video.load();

        return range;
    } catch (e) {
        logger.warn("Could not measure that clip", e);
        return null;
    } finally {
        if (url) URL.revokeObjectURL(url);
    }
}

/**
 * Turns part of a clip into a GIF, keeps it next to the clips, and attaches it.
 *
 * Both, rather than either: a GIF is made to be posted, and one that only landed
 * in the message box is gone the moment the box is cleared.
 */
export async function sendClipGif(name: string, request: GifRequest = {}): Promise<boolean> {
    if (!CLIPS_AVAILABLE) {
        toast("Clips are only readable in the desktop client", Toasts.Type.FAILURE);
        return false;
    }

    try {
        // Whether the export will clamp: it keeps 15s at most, from the end
        // when nothing was asked for, so a longer window loses footage silently
        // unless it is said out loud.
        const full = await clipRange(name);
        let clamped = false;
        if (full) {
            const stop = Math.min(full.end, request.to ?? full.end);
            const start = Math.max(full.start, request.from ?? stop - 15);
            clamped = stop - start > 15;
        }

        const result = await clipToGif(name, {
            limit: FREE_LIMIT,
            ...request,
            onProgress: request.onProgress ?? (step => toast(step, Toasts.Type.MESSAGE))
        });
        const saved = await saveGif(name, result.blob);

        if (clamped) toast("Only the last 15s were kept for the GIF", Toasts.Type.MESSAGE);
        toast(
            `GIF ready: ${saved} (${formatBytes(result.blob.size)}) - attached below, press Enter to send`,
            result.fits ? Toasts.Type.SUCCESS : Toasts.Type.MESSAGE
        );

        return attachAndWarn(new File([result.blob], saved, { type: typeOfClip(saved) }), name);
    } catch (e) {
        logger.error("Could not make a GIF", e);
        toast("Could not make a GIF - try a shorter moment (15s max).", Toasts.Type.FAILURE);
        return false;
    }
}
