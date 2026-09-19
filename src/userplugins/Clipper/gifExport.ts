/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/*
 * Vencord Clipper - turning a piece of a clip into a GIF that will actually send
 *
 * Two jobs. Getting frames out of a clip, which is a matter of seeking a hidden
 * video and drawing each stop onto a canvas; and getting the result under
 * Discord's attachment limit, which is a matter of giving something up.
 *
 * The order things are given up in is the whole design. Resolution goes last,
 * because a GIF that is too small to read is worth nothing. Frame rate goes
 * first: a clip at 10 fps still reads as motion, and halving the frames halves
 * the file almost exactly. Colours go second, because the frame differencing in
 * the encoder means a smaller palette also makes more pixels count as unchanged,
 * so it pays twice.
 *
 * Every step is measured rather than estimated - the encoder is cheap enough to
 * run again, and the alternative is a guess that comes back over the limit after
 * the user has already waited.
 */

import { Logger } from "@utils/Logger";

import { loadClipUrl, probeRange, writeClipCopy } from "./clips";
import { encodeGif } from "./gif";
import { seekVideo as seek } from "./utils";

const logger = new Logger("Clipper");

/** Frames grabbed per second, and the widest a GIF is made before shrinking. */
const DEFAULT_FPS = 12;
const DEFAULT_WIDTH = 480;

/** Longest piece worth making a GIF of, whatever was asked for. */
const MAX_SECONDS = 15;

/**
 * Hard ceilings on a request. The frame count is fps x MAX_SECONDS and every
 * frame is a full-width image in memory, so a 120fps grab at a width nobody
 * checked is how a renderer's memory dies; requests under these are taken as
 * asked, nothing above them is.
 */
const MAX_FPS = 30;
const MAX_WIDTH = 480;

/** How long a clip is waited on to hand over its first frame of data. */
const LOAD_TIMEOUT_MS = 10_000;

export interface GifRequest {
    /** Seconds into the clip, or the beginning. */
    from?: number;
    /** Seconds into the clip, or as far as `MAX_SECONDS` allows. */
    to?: number;
    fps?: number;
    width?: number;
    /** Size to come in under, in bytes. Ignored when it cannot be met. */
    limit?: number;
    /** Called with a line describing what is happening, for a busy UI. */
    onProgress?(step: string): void;
}

interface GifResult {
    blob: Blob;
    width: number;
    fps: number;
    colors: number;
    /** Whether it came in under the limit that was asked for. */
    fits: boolean;
}

/**
 * Each rung of the ladder, roughest last.
 *
 * `every` drops frames, `colors` shrinks the palette, `scale` is applied to the
 * grabbed frames and only enters at the bottom.
 */
const LADDER: Array<{ every: number; colors: number; scale: number; }> = [
    { every: 1, colors: 128, scale: 1 },
    { every: 2, colors: 96, scale: 1 },
    { every: 2, colors: 48, scale: 1 },
    { every: 3, colors: 48, scale: .75 },
    { every: 3, colors: 32, scale: .55 }
];

/** Loads a clip, takes the asked-for piece of it, and returns a GIF of it. */
export async function clipToGif(name: string, request: GifRequest = {}): Promise<GifResult> {
    const url = await loadClipUrl(name);

    try {
        return await urlToGif(url, request);
    } finally {
        URL.revokeObjectURL(url);
    }
}

/** The same, on a blob URL the caller owns. */
async function urlToGif(url: string, request: GifRequest = {}): Promise<GifResult> {
    const { limit = 0, onProgress } = request;

    onProgress?.("Reading the clip");

    const frames = await grabFrames(url, request);
    if (!frames.length) throw new Error("Nothing could be read out of that clip");

    // The ladder below derives its rate from this fps, so the clamp used when
    // grabbing has to be the same value the encoder's timing was built on.
    const fps = Math.min(MAX_FPS, request.fps || DEFAULT_FPS);

    let last: GifResult | null = null;

    for (const rung of LADDER) {
        onProgress?.(last ? "Too big - trying again smaller" : "Encoding");

        const picked = rung.every === 1 ? frames : frames.filter((_, i) => i % rung.every === 0);
        // Only the last rung may free the frames it downsized from: the picks
        // of every rung up to it are the same backing ImageData, still needed
        // until the coarser picks have had their turn.
        const scaled = rung.scale === 1 ? picked : rescale(picked, rung.scale, rung === LADDER[LADDER.length - 1]);
        const rate = fps / rung.every;

        const blob = encodeGif(scaled, { delay: 1000 / rate, colors: rung.colors });

        last = {
            blob,
            width: scaled[0].width,
            fps: rate,
            colors: rung.colors,
            fits: !limit || blob.size <= limit
        };

        if (last.fits) break;

        logger.info(`GIF at ${last.width}px / ${rate}fps / ${rung.colors} colours came out at ${blob.size} bytes`);
    }

    return last!;
}

/** Writes a GIF next to the clips and returns the file name it landed on. */
export async function saveGif(clipName: string, blob: Blob): Promise<string> {
    const stem = clipName.replace(/\.(webm|mp4)$/i, "");
    const path = await writeClipCopy(blob, `${stem}.gif`);

    return path.split(/[\\/]/).pop() || `${stem}.gif`;
}

/**
 * Pulls frames out of a clip by seeking to each one in turn.
 *
 * Seeking rather than playing: a played video hands over whatever frames the
 * compositor felt like producing, which on a busy machine is not the frames
 * that were asked for and never at even spacing. Seeking is slower and exact,
 * and exact is what keeps a GIF from stuttering.
 */
async function grabFrames(url: string, { from, to, fps = DEFAULT_FPS, width = DEFAULT_WIDTH, onProgress }: GifRequest): Promise<ImageData[]> {
    // What reaches the canvas and the frame count is what the tab pays for in
    // memory, whatever the caller meant by the numbers.
    fps = Math.min(MAX_FPS, fps);
    width = Math.min(MAX_WIDTH, width);

    const video = document.createElement("video");
    video.src = url;
    video.muted = true;
    video.preload = "auto";

    // Loaded or bust, within a timeout: a clip that stalls somewhere hands
    // nothing back, and a promise that never settles reads as a hung save.
    await new Promise<void>((resolve, reject) => {
        // A clip already in the cache hands its data over before the handlers
        // below could be attached, so the ready state is checked, not waited on.
        if (video.readyState >= 2) return resolve();

        let done = false;

        const settle = (error?: Error) => {
            if (done) return;
            done = true;
            clearTimeout(timer);
            video.removeEventListener("loadeddata", onLoad);
            video.removeEventListener("error", onError);
            if (error) reject(error);
            else resolve();
        };
        const onLoad = () => settle();
        const onError = () => settle(new Error("That clip could not be decoded"));

        const timer = setTimeout(() => settle(new Error("That clip took too long to load")), LOAD_TIMEOUT_MS);

        video.addEventListener("loadeddata", onLoad);
        video.addEventListener("error", onError);
    });

    // A live-recorded container has no duration in its header, and a rolling
    // buffer's first cluster rarely starts at zero.
    const range = await probeRange(video);

    /*
     * Backwards from the end when nothing was asked for.
     *
     * A clip ends at the moment the key was pressed, which is the moment worth
     * looping; the first fifteen seconds of a thirty second clip are the run-up
     * to it.
     */
    const stop = Math.min(range.end, to ?? range.end);
    const start = Math.max(range.start, from ?? stop - MAX_SECONDS);
    const end = Math.min(stop, start + MAX_SECONDS);

    const height = Math.max(1, Math.round((video.videoHeight / video.videoWidth) * width));

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width));
    canvas.height = height;

    const ctx = canvas.getContext("2d", { alpha: false, willReadFrequently: true });
    if (!ctx) throw new Error("No 2D canvas available");

    const step = 1 / fps;
    const total = Math.max(1, Math.floor((end - start) / step));
    const frames: ImageData[] = [];

    // Released whichever way this ends: a clip that fails to decode halfway
    // through otherwise leaves its decoder holding the whole file.
    try {
        for (let i = 0; i < total; i++) {
            const at = start + i * step;

            await seek(video, at);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            frames.push(ctx.getImageData(0, 0, canvas.width, canvas.height));

            if (i % 10 === 0) onProgress?.(`Reading the clip (${i + 1}/${total})`);
        }
    } finally {
        video.removeAttribute("src");
        video.load();
    }

    return frames;
}

/**
 * Redraws every frame smaller, through a canvas, since ImageData cannot scale.
 *
 * At full resolution every frame is the whole clip in raw pixels, and each
 * rung of the ladder is a fresh full-size copy of it; when consume is set the
 * caller is done with the originals, so their buffers are emptied the moment
 * they have been drawn and can be collected instead of stacking the ladder.
 */
function rescale(frames: ImageData[], scale: number, consume = false): ImageData[] {
    const width = Math.max(1, Math.round(frames[0].width * scale));
    const height = Math.max(1, Math.round(frames[0].height * scale));

    const source = document.createElement("canvas");
    source.width = frames[0].width;
    source.height = frames[0].height;

    const target = document.createElement("canvas");
    target.width = width;
    target.height = height;

    const from = source.getContext("2d", { alpha: false });
    const into = target.getContext("2d", { alpha: false, willReadFrequently: true });
    if (!from || !into) return frames;

    into.imageSmoothingQuality = "high";

    return frames.map((frame, index) => {
        from.putImageData(frame, 0, 0);
        into.drawImage(source, 0, 0, width, height);

        // The scaled copy is what the encoder wants; the source frame's pixels
        // are not, once the last rung that reads them has had them. The entry is
        // replaced with a tiny ImageData (ImageData.data itself is read-only) so
        // the full-size buffer can be collected instead of held past the ladder.
        if (consume) frames[index] = new ImageData(1, 1);

        return into.getImageData(0, 0, width, height);
    });
}
