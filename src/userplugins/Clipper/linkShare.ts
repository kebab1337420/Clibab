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
 *
 * The POST itself lives in the main process, not here: Discord's content
 * security policy refuses a renderer-side request to anywhere but Discord,
 * and the host answers no CORS headers, so a browser upload is blocked before
 * it leaves the page. The main process respects neither rule, so `native.ts`
 * reads the clip and performs the upload; this module only drives it.
 */

import type { PluginNative } from "@utils/types";
import { Toasts } from "@webpack/common";

import { CLIPS_AVAILABLE } from "./clips";
import { logger } from "./recorder";
import { settings } from "./settings";
import { toast } from "./toasts";

const Native = VencordNative.pluginHelpers.Clipper as PluginNative<typeof import("./native")>;

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
 * Puts the clip on the host, reporting the upload as it goes.
 *
 * The work happens in `native.ts`: it reads the file itself and POSTs it from
 * the main process, where Discord's CSP and the host's CORS silence do not
 * apply. The progress reporting that used to sit on the XHR is gone because
 * the main-process upload cannot stream it back; callers get the start and the
 * result, which is what the toasts below promise.
 */
function upload(name: string, onProgress?: Progress): Promise<string> {
    onProgress?.("Uploading…");
    return Native.shareClipToHost(settings.store.saveDirectory, name);
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
        const url = await upload(name, onProgress);

        try {
            await navigator.clipboard?.writeText(url);
        } catch {
            // Clipboard wants a focused window; the toast below carries the
            // link either way, so a denial is not a failure.
        }

        toast(`Link ready, good for 30+ days - paste it in chat, it plays right there: ${url}`, Toasts.Type.SUCCESS);
        return true;
    } catch (e) {
        const tooLarge = e instanceof Error && /too large to share/.test(e.message);
        if (tooLarge) {
            toast("That clip is too large - the link host takes 512MB at most. Trim it or make a GIF first.", Toasts.Type.FAILURE);
            return false;
        }

        logger.error("Could not share that clip", e);
        toast("Could not upload that clip - check your connection and try again.", Toasts.Type.FAILURE);
        return false;
    }
}
