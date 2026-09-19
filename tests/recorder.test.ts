import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";

const fixture = {
    initialized: false,
    settingsReads: 0,
    warnings: [] as unknown[],
    toasts: [] as unknown[],
    listed: [] as string[],
    adopted: [] as string[]
};
Object.assign(globalThis, {
    __clipperTest: fixture,
    IS_DISCORD_DESKTOP: true,
    IS_VESKTOP: false,
    VencordNative: { pluginHelpers: { Clipper: {
        async listClips(directory: string) {
            fixture.listed.push(directory);
            return [{ name: "known.webm" }, { name: "orphan.webm" }];
        }
    } } }
});

const hooks = registerHooks({
    resolve(specifier, context, nextResolve) {
        if (context.parentURL?.endsWith("/recorder.ts")) {
            const stubs = {
                "@api/Notifications": "export const showNotification = () => {};",
                "@utils/Logger": "export class Logger { info() {} warn(...args) { globalThis.__clipperTest.warnings.push(args); } error() {} }",
                "@webpack/common": "export const FluxDispatcher = { subscribe() {} }; export const Toasts = { Type: { MESSAGE: 'message', SUCCESS: 'success', FAILURE: 'error' } }; export const UserStore = {};",
                "./chat": "export class chatLog {} export const shiftChat = () => {};",
                "./clipSound": "export const playClipSound = () => {};",
                "./game": "export const runningGame = () => ''; export const watchRunningGame = () => () => {};",
                "./highlights": "export const highlights = {};",
                "./library": "export const dropMeta = async () => {}; export const readMeta = async () => ({ 'known.webm': { title: 'Keep' } }); export const setMeta = async name => { globalThis.__clipperTest.adopted.push(name); }; export const tagSavedClip = async () => {};",
                "./micInput": "export class MicInput {}",
                "./mixer": "export const gainOf = () => 1; export const readMixer = () => ({}); export const MIC_CHANNEL = 'mic'; export const SYSTEM_CHANNEL = 'system'; export const voiceLevelsFrom = () => ({});",
                "./mp4": "export const lengthMp4 = () => 0; export const probeAudioTracks = async () => []; export const trimMp4 = () => null;",
                "./mux": "export const muxNativeAudio = async () => null;",
                "./nativeClips": "export const arm = async () => {}; export const disarm = () => {}; export const canRecord = () => false; export const engineTornDown = () => false; export const goLiveActive = () => false; export const nativeAvailability = async () => ({ canUse: false }); export const saveNativeClip = async () => null; export const setOnIdleCallback = () => {}; export const setRecordUser = () => {}; export const watchRecording = () => {};",
                "./nativeTracks": "export const hasVideoTrack = () => false;",
                "./repair": "export const lengthBytes = () => 0; export const repairBytes = b => b; export const trimBytes = b => b;",
                "./thumbnail": "export const writeThumbnail = async () => {};",
                "./toasts": "export const toast = (...args) => { globalThis.__clipperTest.toasts.push(args); };",
                "./utils": "export const captureFrameRate = () => 30; export const captureHeight = () => 0; export const captureVideoBitrate = () => 8_000_000; export const clipRetentionSeconds = () => 30; export const errorMessage = e => String(e); export const formatBytes = () => '0'; export const TIMESLICE = 1000; export const timestampName = () => 'clip';",
                "./voice": "export const shiftTracks = () => []; export const toMeta = () => ({}); export const voiceActivity = () => []; export const voiceChannelId = () => undefined; export const voiceParticipants = () => [];",
                "./voiceRecord": "export const voiceBuffers = {};",
                "./settings": "export const Container = {}; export const extensionFor = () => 'webm'; export const mimeTypeChain = () => []; export const settings = { get store() { const f = globalThis.__clipperTest; f.settingsReads++; if (!f.initialized) throw new Error('Cannot access settings before plugin is initialized'); return { saveDirectory: 'clips' }; } };"
            };
            if (Object.hasOwn(stubs, specifier)) {
                return { shortCircuit: true, url: `data:text/javascript,${encodeURIComponent(stubs[specifier])}` };
            }
        }
        return nextResolve(specifier, context);
    }
});
const mod = await import("../src/userplugins/Clipper/recorder.ts");
hooks.deregister();

test("importing the recorder does not touch settings before the plugin is initialized", async () => {
    assert.equal(mod.recorder.state, "idle");
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(fixture.settingsReads, 0);
    assert.deepEqual(fixture.warnings, []);
    assert.deepEqual(fixture.listed, []);
});

test("a save with the buffer stopped says so and reports failure", async () => {
    (mod.recorder as any).state = "idle";
    try {
        const before = fixture.toasts.length;
        assert.equal(await mod.recorder.save(), false);
        assert.equal(fixture.toasts.length, before + 1);
        assert.match(String(fixture.toasts[before][0]), /not running/i);
    } finally {
        (mod.recorder as any).state = "idle";
    }
});

test("a save pressed while one is running says so instead of vanishing", async () => {
    (mod.recorder as any).state = "saving";
    try {
        const before = fixture.toasts.length;
        await mod.recorder.save();
        assert.equal(fixture.toasts.length, before + 1);
        assert.match(String(fixture.toasts[before][0]), /already/i);
    } finally {
        (mod.recorder as any).state = "idle";
    }
});

test("orphan adoption runs after initialization and preserves known clips", async () => {
    fixture.initialized = true;
    await mod.adoptOrphans();
    assert.deepEqual(fixture.listed, ["clips"]);
    assert.deepEqual(fixture.adopted, ["orphan.webm"]);
    assert.deepEqual(fixture.warnings, []);
});
