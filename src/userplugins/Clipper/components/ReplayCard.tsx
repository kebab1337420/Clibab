/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/*
 * Vencord Clipper - the clip that was just saved, playing straight back.
 *
 * A save used to end in a toast, which says a file exists somewhere and
 * nothing about whether the moment was actually in it. Finding that out meant
 * opening the studio or a file manager, usually much later, usually to a folder
 * of clips that turned out to have missed it.
 *
 * So the clip plays itself, immediately, in the corner, muted and small, next
 * to the things anybody does about a clip they just watched: send it, turn the
 * good part of it into a GIF, shorten it, throw it away, or open it properly.
 * It leaves on its own if it is ignored, and it stays as long as the pointer is
 * on it.
 */

import { Toasts, useEffect, useState } from "@webpack/common";

import { CLIPS_AVAILABLE, loadClipUrl } from "../clips";
import { recorder, type SavedClip } from "../recorder";
import { sendClipFitted, sendClipGif } from "../send";
import { settings } from "../settings";
import { shareClipLink } from "../share";
import { toast } from "../toasts";
import { chaptersOf, formatBytes, TRIM_CUTS } from "../utils";

/** How long the card sits there before it takes itself off screen. */
const DISMISS_MS = 20_000;

export function ReplayCard({ clip, onStudio, onRefresh, onClose }: {
    clip: SavedClip;
    onStudio(name: string): void;
    /** Called when the clip on disk changed under the card, as a trim does. */
    onRefresh(): void;
    onClose(): void;
}) {
    const [url, setUrl] = useState("");
    const [held, setHeld] = useState(false);
    const [busy, setBusy] = useState(false);
    const [step, setStep] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        // Loaded off disk for the card alone: the save lets go of the
        // footage once it is written, so nothing pins a whole clip in RAM
        // between two saves. Without a URL the card still shows the name
        // and every action but the preview.
        let made = "";
        let alive = true;

        void loadClipUrl(clip.name)
            .then(url => { if (alive) { made = url; setUrl(url); } else URL.revokeObjectURL(url); })
            .catch(() => { if (alive) setUrl(""); });

        return () => {
            alive = false;
            if (made) URL.revokeObjectURL(made);
        };
    }, [clip]);

    // Held while the pointer is on the card, or while something it started is
    // still running: nothing should vanish out from under a click.
    useEffect(() => {
        if (held || busy) return;

        const id = setTimeout(onClose, DISMISS_MS);
        return () => clearTimeout(id);
    }, [held, busy, clip]);

    /**
     * Runs one action, then either gets out of the way or picks up whatever the
     * action left behind - a trim writes a second file and that one is now the
     * clip this card is about.
     */
    const act = (run: () => Promise<unknown>, refresh = false) => () => {
        if (busy) return;

        setBusy(true);
        void run()
            .catch(() => { })
            .then(() => {
                setBusy(false);
                setStep("");
                if (refresh) onRefresh();
                else onClose();
            });
    };

    // Whatever is shorter than the clip: trimming to more than was saved is a
    // rewrite of the same file for nothing.
    const trim = TRIM_CUTS.find(n => n < settings.store.clipLength);

    return (
        <div
            className="vc-clipper-replay"
            onClick={e => e.stopPropagation()}
            onMouseEnter={() => setHeld(true)}
            onMouseLeave={() => setHeld(false)}
        >
            {url && (
                <video
                    className="vc-clipper-replay-video"
                    src={url}
                    autoPlay
                    loop
                    muted
                    onClick={e => {
                        // Click to hear it, click again to shut it up.
                        const video = e.currentTarget;
                        video.muted = !video.muted;
                    }}
                />
            )}

            <div className="vc-clipper-replay-head">
                <span className="vc-clipper-replay-name" title={clip.path}>{step || clip.name}</span>
                {!step && <span>{formatBytes(clip.size)}</span>}
                <button className="vc-clipper-close" onClick={onClose} aria-label="Dismiss">&times;</button>
            </div>

            <div className="vc-clipper-replay-actions">
                <button disabled={busy} onClick={act(() => sendClipFitted(clip.name, setStep))}>Send</button>
                <button
                    disabled={busy}
                    title="Upload it and copy a share link instead of the file"
                    onClick={act(() => shareClipLink(clip.name))}
                >
                    Link
                </button>
                <button
                    disabled={busy}
                    title="The last few seconds, as a looping GIF small enough to post"
                    onClick={act(() => sendClipGif(clip.name, { onProgress: setStep }))}
                >
                    GIF
                </button>
                {trim && (
                    <button disabled={busy} onClick={act(() => recorder.trimLastSaved(trim), true)}>
                        Keep {trim}s
                    </button>
                )}
                <button
                    disabled={busy}
                    title="Copy video chapters for the markers"
                    onClick={() => {
                        if (busy) return;

                        const text = chaptersOf(clip.markers ?? [], clip.markerLabels);
                        if (!text) {
                            toast("No markers on this clip", Toasts.Type.MESSAGE);
                            return;
                        }

                        void navigator.clipboard.writeText(text).then(
                            () => toast("Chapters copied", Toasts.Type.SUCCESS),
                            () => toast("Could not reach the clipboard", Toasts.Type.FAILURE)
                        );
                    }}
                >
                    Chapters
                </button>
                {CLIPS_AVAILABLE && (
                    <button disabled={busy} onClick={() => { onStudio(clip.name); onClose(); }}>Studio</button>
                )}
                <button
                    className="vc-clipper-danger"
                    disabled={busy}
                    onClick={() => {
                        if (busy) return;

                        if (!confirmDelete) {
                            setConfirmDelete(true);
                            setTimeout(() => setConfirmDelete(false), 4000);
                            return;
                        }

                        setConfirmDelete(false);
                        void act(() => recorder.discardLastSaved())();
                    }}
                >
                    {confirmDelete ? "Sure?" : "Delete"}
                </button>
            </div>
            <div className="vc-clipper-replay-hint">Later: right-click the Clipper button for this clip again.</div>
        </div>
    );
}
