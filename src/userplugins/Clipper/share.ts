/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/*
 * Vencord Clipper - sharing a clip as a link instead of a file.
 *
 * Discord caps attachments, and re-encoding down to fit costs quality the
 * moment never had to lose. So a clip can go to a file host instead: no
 * account, nothing to configure, and the link it answers with lands on the
 * clipboard, ready to paste wherever the moment belongs.
 */

import type { PluginNative } from "@utils/types";
import { Toasts } from "@webpack/common";

import { CLIPS_AVAILABLE } from "./clips";
import { logger } from "./recorder";
import { settings } from "./settings";
import { toast } from "./toasts";

const Native = VencordNative.pluginHelpers.Clipper as PluginNative<typeof import("./native")>;

/**
 * Uploads the clip and copies the link it answers with.
 *
 * True when a link was copied. The studio stays open either way: unlike a
 * send, a link does not finish the visit.
 */
export async function shareClipLink(name: string): Promise<boolean> {
    if (!CLIPS_AVAILABLE) {
        toast("Links can only be made in the desktop client", Toasts.Type.FAILURE);
        return false;
    }

    toast("Uploading the clip for a link…", Toasts.Type.MESSAGE);

    try {
        const url = await Native.shareClip(settings.store.saveDirectory, name);

        try {
            await navigator.clipboard.writeText(url);
        } catch {
            // No clipboard (or no permission): the link itself is the news,
            // left on screen long enough to copy by hand.
            toast(url, Toasts.Type.MESSAGE, 12000);
            return true;
        }

        toast(`Link copied: ${url}`, Toasts.Type.SUCCESS, 12000);
        return true;
    } catch (e) {
        logger.error("Could not share the clip", e);
        toast(e instanceof Error ? e.message : "Could not upload that clip", Toasts.Type.FAILURE);
        return false;
    }
}
