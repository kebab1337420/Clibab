/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/*
 * Vencord Clipper - chat bar button
 *
 * Left click  : save the buffer (starts it first if idle)
 * Right click : start / stop the buffer
 */

import { ChatBarButton, ChatBarButtonFactory } from "@api/ChatButtons";
import { IconComponent } from "@utils/types";
import { React, Toasts, useEffect, useState } from "@webpack/common";

import { logger, recorder, RecorderState } from "../recorder";
import { settings } from "../settings";
import { toast } from "../toasts";
import { formatKeybind } from "../utils";

export const ClipperIcon: IconComponent = ({ height = 20, width = 20, className, recording = false }) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        className={className}
        aria-hidden="true"
    >
        <path
            fill="currentColor"
            d="M17 10.5V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3.5l4 3.5V7l-4 3.5Z"
        />
        {recording && <circle cx="9.5" cy="12" r="3" fill="var(--status-danger)" />}
    </svg>
);

export const ClipperChatButton: ChatBarButtonFactory = ({ isMainChat }) => {
    const [state, setState] = useState<RecorderState>(recorder.state);

    useEffect(() => recorder.subscribe(setState), []);

    if (!isMainChat) return null;

    const active = state === "recording" || state === "saving";

    const tooltip = state === "recording"
        ? `Save the last ${settings.store.clipLength}s (${formatKeybind(settings.store.saveKeybind)}) - right click to stop`
        : state === "saving"
            ? "Saving clip…"
            : "Start the clip buffer - click again to save";

    // Rejections surface as toasts, never as unhandled promise noise: a
    // save that fails still leaves the buffer running underneath.
    const act = (work: Promise<unknown>) =>
        void work.catch(e => {
            logger.warn("Clip button action failed", e);
            toast(`Clipper: ${e instanceof Error ? e.message : String(e)}`, Toasts.Type.FAILURE);
        });

    return (
        <ChatBarButton
            tooltip={tooltip}
            onClick={() => act(state === "recording" ? recorder.save() : recorder.start())}
            onContextMenu={() => act(recorder.toggle())}
        >
            <ClipperIcon recording={active} />
        </ChatBarButton>
    );
};
