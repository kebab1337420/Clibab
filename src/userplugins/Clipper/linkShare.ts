/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/*
 * Vencord Clipper - sharing a clip as a link that plays in chat
 *
 * Discord's attachment cap is the wall this whole module walks around: a clip
 * that fits is attached, a clip that does not is shrunk or GIFfed, and a clip
 * the user wants whole goes up to a file host instead, with the link pasted
 * where the file would have gone.
 *
 * The host is 0x0.st, deliberately, not catbox: Discord's embed proxy only
 * streams a link inline when the server answers fast, with the right
 * content-type and with range requests, and catbox answers slowly enough that
 * the player spins. A direct 0x0.st URL unfurls into a player that starts.
 * No account, no key: one multipart POST, one URL back as plain text.
 */

import { Toasts } from "@webpack/common";

import { CLIPS_AVAILABLE, loadClipFile } from "./clips";
import { logger } from "./recorder";
import { toast } from "./toasts";
import { formatBytes } from "./utils";

/** Where the clip goes, and the most it will take. */
const SHARE_ENDPOINT = "https://0x0.st";
const MAX_SHARE_BYTES = 512 * 1024 * 1024;

/** A step of a long job, for a caller that has somewhere to show it. */
type Progress = (step: string) => void;

/**
 * Reads a share URL back out of the host's answer.
 *
 * The host answers the URL as plain text, nothing else; anything else is an
 * error page wearing a 200, and pasting that into chat is worse than no link.
 */
export function parseShareUrl(answer: string): string | null {
    const url = answer.trim();
    return /^https:\/\/0x0\.st\/\S+$/.test(url) ? url : null;
}

/**
 * Puts the file on the host, reporting the upload as it goes.
 *
 * XHR rather than fetch for one reason: fetch cannot say how far a POST has
 * got, and a hundred-megabyte clip with no progress bar reads as a hang.
 */
function upload(file: File, onProgress?: Progress): Promise<string> {
    return new Promise((resolve, reject) => {
        const form = new FormData();
        // The name matters: the host mints the URL's extension from it, and
        // Discord leans on that extension when it decides the link is a video.
        form.append("file", file, file.name);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", SHARE_ENDPOINT);
        xhr.timeout = 10 * 60 * 1000;

        let bucket = -1;
        xhr.upload.onprogress = e => {
            if (!e.lengthComputable) return;
            const step = Math.floor(e.loaded / e.total / 0.1);
            if (step !== bucket) {
                bucket = step;
                onProgress?.(`Uploading… ${Math.floor(e.loaded / e.total * 100)}%`);
            }
        };
        xhr.onload = () => {
            if (xhr.status !== 200) return reject(new Error(`The host answered ${xhr.status}`));
            const url = parseShareUrl(xhr.responseText);
            if (!url) return reject(new Error("The host did not return a link"));
            resolve(url);
        };
        xhr.onerror = () => reject(new Error("The upload did not reach the host"));
        xhr.ontimeout = () => reject(new Error("The upload took too long"));
        xhr.send(form);
    });
}

/**
 * Uploads a clip whole and copies the link, ready to paste in chat.
 *
 * The link outlives the session by design: the host keeps small files up to a
 * year, thirty days at worst, so a clip linked tonight still plays next month.
 */
export async function shareClipLink(name: string, onProgress?: Progress): Promise<boolean> {
    if (!CLIPS_AVAILABLE) {
        toast("Clips are only readable in the desktop client", Toasts.Type.FAILURE);
        return false;
    }

    try {
        const file = await loadClipFile(name);
        if (file.size > MAX_SHARE_BYTES) {
            toast(`That clip is ${formatBytes(file.size)} - the link host takes 512MB at most. Trim it or make a GIF first.`, Toasts.Type.FAILURE);
            return false;
        }

        onProgress?.("Uploading… 0%");
        const url = await upload(file, onProgress);

        try {
            await navigator.clipboard?.writeText(url);
        } catch {
            // Clipboard wants a focused window; the toast below carries the
            // link either way, so a denial is not a failure.
        }

        toast(`Link ready, good for 30+ days - paste it in chat, it plays right there: ${url}`, Toasts.Type.SUCCESS);
        return true;
    } catch (e) {
        logger.error("Could not share that clip", e);
        toast("Could not upload that clip - check your connection and try again.", Toasts.Type.FAILURE);
        return false;
    }
}
