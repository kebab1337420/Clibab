/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/*
 * Vencord Clipper - capture settings remembered per game.
 *
 * A competitive shooter wants different capture settings than a slow RPG -
 * high frame rate and low resolution versus the reverse - and re-tuning four
 * knobs every time the game changes is how they stay wrong. So the current
 * knobs can be saved under the game Discord sees running, and the next time
 * that game starts the knobs move back by themselves.
 *
 * Keyed case-insensitively on Discord's own game name, which is also what
 * names the clip folder categories. Anything not four finite numbers is
 * ignored rather than applied.
 */

import { settings } from "./settings";
import { MAX_CLIP_SECONDS } from "./utils";

export interface GameProfile {
    fps: number;
    resolution: number;
    bitrate: number;
    length: number;
}

type ProfileMap = Record<string, GameProfile>;

function readAll(): ProfileMap {
    const stored = settings.store.gameProfiles;
    if (!stored || typeof stored !== "object") return {};

    return stored as ProfileMap;
}

function key(game: string): string {
    return game.trim().slice(0, 60).toLowerCase();
}

function sane(profile: GameProfile): boolean {
    return [profile.fps, profile.resolution, profile.bitrate, profile.length]
        .every(v => typeof v === "number" && Number.isFinite(v));
}

/** The profile saved for this game, if any. */
function profileFor(game: string): GameProfile | null {
    if (!game.trim()) return null;

    const found = readAll()[key(game)];
    if (!found || typeof found !== "object" || !sane(found)) return null;

    return { fps: found.fps, resolution: found.resolution, bitrate: found.bitrate, length: found.length };
}

/** Saves the current knobs under this game. */
export function saveProfile(game: string): boolean {
    const name = game.trim().slice(0, 60);
    if (!name) return false;

    const { fps, resolution, videoBitrate, clipLength } = settings.store;
    settings.store.gameProfiles = {
        ...readAll(),
        [key(game)]: { fps, resolution, bitrate: videoBitrate, length: clipLength }
    };

    return true;
}

/** True when a profile was saved for this game. */
export function hasProfile(game: string): boolean {
    return profileFor(game) !== null;
}

/** Forgets the profile saved for this game. */
export function deleteProfile(game: string): boolean {
    const map = readAll();
    if (!Object.hasOwn(map, key(game))) return false;

    delete map[key(game)];
    settings.store.gameProfiles = map;

    return true;
}

/** True when every capture knob already matches the game's profile. */
export function matchesProfile(game: string): boolean {
    const profile = profileFor(game);
    if (!profile) return false;

    const { fps, resolution, videoBitrate, clipLength } = settings.store;

    return fps === profile.fps
        && resolution === profile.resolution
        && videoBitrate === profile.bitrate
        && clipLength === profile.length;
}

/**
 * Writes the game's profile into the knobs.
 *
 * True when something moved. The caller restarts the buffer when one is
 * running, since the encoder only picks the knobs up on (re)start.
 */
export function applyProfile(game: string): boolean {
    const profile = profileFor(game);
    if (!profile || matchesProfile(game)) return false;

    settings.store.fps = profile.fps;
    settings.store.resolution = profile.resolution;
    settings.store.videoBitrate = profile.bitrate;
    settings.store.clipLength = Math.min(profile.length, MAX_CLIP_SECONDS);

    return true;
}
