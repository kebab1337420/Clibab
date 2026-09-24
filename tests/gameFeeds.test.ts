/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import assert from "node:assert/strict";
import { test } from "node:test";

import { readLeagueEvent } from "../src/userplugins/Clipper/gameFeeds.ts";

// riotName() lowercases: callers pass the already-normalized summoner name.
const ME = "kebab";

test("your kills and deaths read, nobody else's do", () => {
    assert.deepEqual(readLeagueEvent({ EventName: "ChampionKill", KillerName: ME }, ME), {
        kind: "kill", note: "a kill in League of Legends"
    });
    assert.deepEqual(readLeagueEvent({ EventName: "ChampionKill", VictimName: ME }, ME), {
        kind: "death", note: "your death in League of Legends"
    });

    assert.equal(readLeagueEvent({ EventName: "ChampionKill", KillerName: "Riven", VictimName: "Yasuo" }, ME), null);
    assert.equal(readLeagueEvent({ EventName: "GameStart" }, ME), null);
});

test("runs, aces and objectives map to marker kinds", () => {
    assert.deepEqual(readLeagueEvent({ EventName: "Multikill", KillerName: ME, KillStreak: 4 }, ME)?.kind, "multikill");
    assert.deepEqual(readLeagueEvent({ EventName: "Multikill", KillerName: "Riven" }, ME), null);
    assert.deepEqual(readLeagueEvent({ EventName: "Ace", Acer: ME }, ME)?.kind, "multikill");
    assert.deepEqual(readLeagueEvent({ EventName: "FirstBlood", Recipient: ME }, ME)?.kind, "kill");

    assert.match(readLeagueEvent({ EventName: "DragonKill", KillerName: ME, DragonType: "Ocean" }, ME)?.note ?? "", /ocean dragon/);
    assert.deepEqual(readLeagueEvent({ EventName: "BaronKill", KillerName: ME }, ME)?.kind, "objective");
    assert.deepEqual(readLeagueEvent({ EventName: "HeraldKill", KillerName: ME }, ME)?.kind, "objective");
    assert.deepEqual(readLeagueEvent({ EventName: "TurretKilled", KillerName: ME }, ME)?.kind, "objective");
    assert.deepEqual(readLeagueEvent({ EventName: "InhibKilled", KillerName: "Riven" }, ME), null);
});
