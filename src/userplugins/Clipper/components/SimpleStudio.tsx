/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/*
 * Vencord Clipper - the simple studio.
 *
 * The basic side of the clip studio: one clip picked out of the library, a
 * range trimmed out of it with the In and Out buttons, and a render that saves
 * the result back next to the clips. Everything a montage needs - a timeline
 * of several clips, captions, sounds, overlays - stays in the advanced studio,
 * which is ClipStudio.tsx. This file shares that studio's stylesheet but keeps
 * none of its state.
 *
 * Same isolation rules as the rest of the overlay: own React root, no Discord
 * internal component, one shared stylesheet.
 */

import { React, Toasts, useEffect, useRef, useState } from "@webpack/common";

import {
    listClips,
    loadClipUrl,
    loadThumbUrl,
    probeRange,
    renderName,
    type StoredClip,
    typeOfClip,
    writeClipCopy
} from "../clips";
import { probeAudioTracks } from "../mp4";
import { trimBytes } from "../repair";
import { logger } from "../recorder";
import {
    DEFAULT_CAPTION_STYLE,
    DEFAULT_EFFECTS,
    newId,
    type Project,
    renderProject,
    type StudioSource
} from "../studio";
import { writeThumbnail } from "../thumbnail";
import { toast } from "../toasts";
import { settings } from "../settings";
import { formatBytes, formatTime } from "../utils";

/** Clamp a trim point to the file's own range. */
function clampPoint(point: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, point));
}

export function SimpleStudio({ onClose, initial }: { onClose(): void; initial?: string; }) {
    const [clips, setClips] = useState<StoredClip[] | null>(null);
    const [thumbs, setThumbs] = useState<Record<string, string>>({});
    const [search, setSearch] = useState("");
    const [picked, setPicked] = useState("");
    const [source, setSource] = useState<StudioSource | null>(null);

    /*
     * The trim, in source seconds.
     *
     * `length` is the full range of the file once it has been probed, so the In
     * and Out points have something to clamp against. Kept in one object so an
     * In or Out change moves a single state write.
     */
    const [trim, setTrim] = useState({ from: 0, to: 0, length: 0 });
    const [at, setAt] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(-1);
    const [note, setNote] = useState("");
    const [error, setError] = useState("");

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const cancelRef = useRef(false);
    const aliveRef = useRef(true);
    const pickToken = useRef(0);

    /** The source the render reads, kept out of the stale closure. */
    const sourceRef = useRef<StudioSource | null>(null);
    /** Frame size of the picked file, read off the decoder at probe time. */
    const sizeRef = useRef<{ width: number; height: number; } | null>(null);

    const urlLedger = useRef(new Set<string>());
    const revoke = (url: string) => {
        urlLedger.current.delete(url);
        URL.revokeObjectURL(url);
    };

    const track = (url: string) => {
        if (aliveRef.current) urlLedger.current.add(url);
        else URL.revokeObjectURL(url);
    };

    useEffect(() => () => {
        aliveRef.current = false;
        for (const url of urlLedger.current) URL.revokeObjectURL(url);
        urlLedger.current.clear();
    }, []);

    /** Reloads the clip list and every thumbnail that does not exist yet. */
    const reloadClips = async () => {
        const next = await listClips();
        if (!aliveRef.current) return;

        setClips(next);

        const fresh = await Promise.all(
            next
                .filter(clip => clip.thumb && !thumbs[clip.name])
                .map(async clip => {
                    try {
                        const url = await loadThumbUrl(clip);
                        return url ? [clip.name, url] as const : null;
                    } catch {
                        return null;
                    }
                })
        );

        if (!aliveRef.current) {
            fresh.forEach(entry => entry && URL.revokeObjectURL(entry[1]));
            return;
        }

        const loaded = fresh.filter((entry): entry is readonly [string, string] => !!entry);

        setThumbs(prev => {
            for (const [name, url] of loaded) {
                const old = prev[name];
                if (old) URL.revokeObjectURL(old);
            }
            return { ...prev, ...Object.fromEntries(loaded) };
        });
    };

    useEffect(() => {
        void reloadClips();
    }, []);

    /**
     * Loads a clip onto the stage.
     *
     * The trim starts at the file's own range - the In and Out the user sets
     * then only ever shrink it. A stale pick (a slower read resolving after a
     * newer click) is dropped rather than applied.
     */
    const pick = async (name: string) => {
        const token = ++pickToken.current;
        cancelRef.current = false;
        setError("");
        setPicked(name);

        const old = sourceRef.current;
        sourceRef.current = null;
        setSource(null);
        setPlaying(false);
        setTrim({ from: 0, to: 0, length: 0 });
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.removeAttribute("src");
            videoRef.current.load();
        }
        if (old) revoke(old.url);

        setNote("Loading…");

        try {
            const url = await loadClipUrl(name);
            if (!aliveRef.current || token !== pickToken.current) {
                URL.revokeObjectURL(url);
                return;
            }

            track(url);
            sourceRef.current = { id: "clip", name, url };
            setSource({ id: "clip", name, url });
        } catch (e) {
            if (token !== pickToken.current || !aliveRef.current) return;
            const message = e instanceof Error ? e.message : String(e);
            logger.warn("Could not open a clip in the simple studio", e);
            setError(`Could not open ${name}: ${message}`);
            setNote("");
        }
    };

    /** Measures the file once its header is readable, then sets the trim. */
    const onLoadedMetadata = async () => {
        const video = videoRef.current;
        const src = sourceRef.current;
        if (!video || !src) return;

        const range = await probeRange(video);
        if (!aliveRef.current) return;

        video.currentTime = range.start;
        sizeRef.current = { width: video.videoWidth, height: video.videoHeight };
        setTrim({ from: range.start, to: range.end, length: range.end });
        setAt(range.start);
        setNote("");
    };

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video || !source) return;
        if (video.paused) void video.play();
        else video.pause();
    };

    /** Moves the decoder, which is what the scrubber drags. */
    const seek = (v: number) => {
        const video = videoRef.current;
        if (video) video.currentTime = v;
    };

    /** The start of the clip, clamped to leave at least half a second to keep. */
    const setIn = (point: number) => {
        setTrim(t => {
            const next = clampPoint(point, 0, Math.max(0, t.to - 0.5));
            if (videoRef.current && videoRef.current.currentTime < next) videoRef.current.currentTime = next;
            return { ...t, from: next };
        });
    };

    /** The end of the clip, clamped to keep at least half a second. */
    const setOut = (point: number) => {
        setTrim(t => {
            const next = clampPoint(point, t.from + 0.5, t.length);
            if (videoRef.current && videoRef.current.currentTime > next) videoRef.current.currentTime = next;
            return { ...t, to: next };
        });
    };

    const shown = (clips ?? [])
        .filter(clip => !search || clip.name.toLowerCase().includes(search.toLowerCase()));

    const busy = progress >= 0;
    const trimmed = Math.max(0, trim.to - trim.from);
    const pct = trim.length > 0 ? Math.round((trimmed / trim.length) * 100) : 0;

    /**
     * The trim, cut out of the file instead of re-encoded.
     *
     * Null when the timeline asks for anything the container cannot express,
     * and the caller falls back to the renderer. Saved clips start at zero,
     * so the trim points read off the player are already clip time.
     */
    const losslessTrim = async (): Promise<Blob | null> => {
        const src = sourceRef.current;
        if (!src || !/\.(webm|mp4)$/i.test(src.name)) return null;

        const data = new Uint8Array(await (await fetch(src.url)).arrayBuffer());

        // A native clip keeps one track per person, and every player that
        // matters plays the first audio track alone - the game, with the
        // whole call missing. Only a render mixes them down.
        if ((probeAudioTracks(data) ?? []).length > 1) return null;

        const type = typeOfClip(src.name);
        const cut = trimBytes(data, type, trim.from, trim.to);

        // Nothing back: the range already covers the whole file.
        return new Blob([(cut ?? data) as BlobPart], { type });
    };

    const onRender = async () => {
        const src = sourceRef.current;
        if (!src) return;

        cancelRef.current = false;
        setError("");
        setProgress(0);

        const width = sizeRef.current?.width;
        const height = sizeRef.current?.height || 1080;

        const project: Project = {
            segments: [{
                id: newId(),
                sourceId: "clip",
                from: trim.from,
                to: trim.to,
                speed: 1,
                volume: 1,
                effects: { ...DEFAULT_EFFECTS }
            }],
            captions: [],
            captionStyle: { ...DEFAULT_CAPTION_STYLE },
            height,
            ...(width ? { width } : {}),
            fps: 30,
            audio: true
        };

        try {
            // A plain trim is cut out of the file, not re-encoded: seconds
            // instead of minutes. Anything else - a multi-track native clip
            // whose voices need mixing down, or an undecodable import - goes
            // through the renderer below.
            const fast = await losslessTrim();
            const blob = fast ?? await renderProject(project, [src], {
                onProgress: setProgress,
                cancelled: () => cancelRef.current
            });

            const path = await writeClipCopy(blob, renderName(src.name, blob.type));
            toast(fast ? `Cut without re-encoding (${formatBytes(blob.size)})` : `Clip saved (${formatBytes(blob.size)})`, Toasts.Type.SUCCESS);
            logger.info("Trimmed a clip from the simple studio", path);

            await writeThumbnail(blob, path.split(/[\\/]/).pop() || "");
            void reloadClips();
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);

            if (cancelRef.current) toast("Render cancelled", Toasts.Type.MESSAGE);
            else {
                logger.error("Simple studio render failed", e);
                setError(message);
                toast(`Render failed: ${message}`, Toasts.Type.FAILURE);
            }
        } finally {
            setProgress(-1);
        }
    };

    useEffect(() => {
        if (!initial || picked || !clips) return;
        if (clips.some(clip => clip.name === initial)) void pick(initial);
    }, [initial, picked, clips]);

    const scrubValue = Math.min(Math.max(at, trim.from), trim.to);

    return (
        <div className="vc-clipper-backdrop" onClick={e => { if (e.target === e.currentTarget && !busy) onClose(); }}>
            <div className="vc-clipper-modal vc-clipper-studio">
                <div className="vc-clipper-head">
                    <span className="vc-clipper-studio-emb" aria-hidden="true"><i /></span>
                    <div className="vc-clipper-studio-head-title">
                        <h2>Clip studio</h2>
                        <small>Simple - one clip, trimmed and saved</small>
                    </div>
                    <div className="vc-clipper-studio-head-right">
                        <button className="vc-clipper-studio-switch" disabled={busy} title="Open the full montage timeline" onClick={() => { settings.store.studioMode = "advanced"; }}>Advanced</button>
                        <button className="vc-clipper-studio-ok" disabled={busy} onClick={onClose}>Done</button>
                        <button className="vc-clipper-studio-close" onClick={onClose} disabled={busy} aria-label="Close">
                            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                                <path fill="currentColor" d="M18.3 5.71 12 11.99l6.3 6.27a1 1 0 1 1-1.41 1.42l-6.3-6.27-6.29 6.27a1 1 0 0 1-1.42-1.42L10.58 12 4.28 5.71A1 1 0 0 1 5.7 4.29l6.3 6.27 6.3-6.27a1 1 0 1 1 1.41 1.42Z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="vc-clipper-studio-body">
                    <div className="vc-clipper-side vc-clipper-side-left">
                        <h4>Clip library</h4>

                        {!!clips?.length && (
                            <div className="vc-clipper-field">
                                <input
                                    type="text"
                                    value={search}
                                    placeholder="Search a clip…"
                                    disabled={busy}
                                    onChange={e => setSearch(e.currentTarget.value)}
                                />
                            </div>
                        )}

                        {clips === null && <div className="vc-clipper-note">Reading the clip folder…</div>}
                        {clips?.length === 0 && <div className="vc-clipper-note">No clip saved yet.</div>}
                        {!!clips?.length && !shown.length && <div className="vc-clipper-note">No clip matches.</div>}

                        {shown.map(clip => (
                            <button
                                key={clip.name}
                                className={`vc-clipper-side-clip${clip.name === picked ? " vc-clipper-active" : ""}`}
                                disabled={busy}
                                title={clip.name}
                                onClick={() => void pick(clip.name)}
                            >
                                <div className="vc-clipper-clip-row">
                                    {thumbs[clip.name]
                                        ? <img className="vc-clipper-thumb" src={thumbs[clip.name]} alt="" />
                                        : <div className="vc-clipper-thumb vc-clipper-thumb-empty" />}
                                    <div className="vc-clipper-clip-text">
                                        <div className="vc-clipper-name">{clip.name}</div>
                                        <div className="vc-clipper-meta">{formatBytes(clip.size)}</div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="vc-clipper-studio-main">
                        {error && <div className="vc-clipper-note vc-clipper-error">{error}</div>}
                        {note && <div className="vc-clipper-note">{note}</div>}

                        <div className="vc-clipper-stage">
                            <video
                                ref={videoRef}
                                src={source?.url}
                                playsInline
                                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                onLoadedMetadata={() => void onLoadedMetadata()}
                                onTimeUpdate={() => setAt(videoRef.current?.currentTime ?? 0)}
                                onPlay={() => setPlaying(true)}
                                onPause={() => setPlaying(false)}
                                onEnded={() => { setAt(trim.to); setPlaying(false); }}
                            />

                            {!source && (
                                <div className="vc-clipper-note">Pick a clip on the left to start</div>
                            )}

                            {source && !playing && (
                                <button
                                    className="vc-clipper-bigplay"
                                    aria-label="Play"
                                    title="Play"
                                    onClick={togglePlay}
                                    disabled={busy}
                                >▶</button>
                            )}

                            {source && (
                                <div className="vc-clipper-stage-controls">
                                    <div className="vc-clipper-transport">
                                        <button
                                            disabled={busy}
                                            aria-label={playing ? "Pause" : "Play"}
                                            title={playing ? "Pause" : "Play"}
                                            onClick={togglePlay}
                                        >
                                            {playing ? "❚❚" : "▶"}
                                        </button>

                                        <input
                                            type="range"
                                            disabled={busy}
                                            min={trim.from}
                                            max={trim.to}
                                            step={0.02}
                                            value={scrubValue}
                                            style={{ "--vc-fill": `${pct}%` } as React.CSSProperties}
                                            onChange={e => seek(Number(e.currentTarget.value))}
                                        />

                                        <span className="vc-clipper-time" title="The clip kept, out of the whole file">
                                            <b>{formatTime(trimmed)}</b>
                                            <span>{" / "}{formatTime(trim.length)}</span>
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="vc-clipper-tracks">
                            <div className="vc-clipper-track">
                                <span className="vc-clipper-track-label">Trim</span>

                                <div className="vc-clipper-track-body">
                                    <div className="vc-clipper-ruler-actions">
                                        <span className="vc-clipper-mark-badge">
                                            {formatTime(trim.from)}-{formatTime(trim.to)}
                                        </span>

                                        <button
                                            disabled={busy || !source}
                                            onClick={() => setIn(at)}
                                            title="Start the clip here (I)"
                                        >
                                            In
                                        </button>
                                        <button
                                            disabled={busy || !source}
                                            onClick={() => setIn(at - 0.5)}
                                            title="Pull the start back half a second"
                                        >
                                            −0.5s
                                        </button>
                                        <button
                                            disabled={busy || !source}
                                            onClick={() => setIn(at + 0.5)}
                                            title="Push the start forward half a second"
                                        >
                                            +0.5s
                                        </button>

                                        <button
                                            disabled={busy || !source}
                                            onClick={() => setOut(at)}
                                            title="End the clip here (O)"
                                        >
                                            Out
                                        </button>
                                        <button
                                            disabled={busy || !source}
                                            onClick={() => setOut(at - 0.5)}
                                            title="Pull the end back half a second"
                                        >
                                            −0.5s
                                        </button>
                                        <button
                                            disabled={busy || !source}
                                            onClick={() => setOut(at + 0.5)}
                                            title="Push the end forward half a second"
                                        >
                                            +0.5s
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="vc-clipper-studio-foot">
                            <button className="vc-clipper-primary" disabled={busy || !source || trimmed <= 0} onClick={() => void onRender()}>
                                {progress >= 0 ? `Rendering ${Math.round(progress * 100)}%` : `Render ${formatTime(trimmed)}`}
                            </button>

                            {progress >= 0 && (
                                <>
                                    <div className="vc-clipper-progress">
                                        <div style={{ width: `${Math.round(Math.min(1, Math.max(0, progress)) * 100)}%` }} />
                                    </div>

                                    <button className="vc-clipper-danger" onClick={() => { cancelRef.current = true; }}>
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
