import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";
import { setImmediate } from "node:timers/promises";

const hooks = registerHooks({
    resolve(specifier, context, nextResolve) {
        if (context.parentURL?.endsWith("/voiceRecord.ts")) {
            const stubs = {
                "@utils/Logger": "export class Logger { info() {} warn() {} }",
                "./settings": "export const settings = { store: { clipLength: 30 } };",
                "./voiceTaps": "export const voiceTaps = () => [];"
            };
            if (Object.hasOwn(stubs, specifier)) {
                return { shortCircuit: true, url: `data:text/javascript,${encodeURIComponent(stubs[specifier])}` };
            }
        }
        return nextResolve(specifier, context);
    }
});
const { voiceBuffers } = await import("../src/userplugins/Clipper/voiceRecord.ts");
hooks.deregister();

class CaptureRecorder {
    static instances: CaptureRecorder[] = [];
    static isTypeSupported() { return true; }
    state = "inactive";
    ondataavailable: ((event: { data: Blob; }) => void) | null = null;
    requests = 0;
    constructor() { CaptureRecorder.instances.push(this); }
    start() { this.state = "recording"; }
    stop() { this.state = "inactive"; }
    requestData() { this.requests++; }
    emit() { this.ondataavailable?.({ data: new Blob() }); }
}

for (const action of ["chunk", "stop"] as const) {
    test(`concurrent voice harvests both settle on ${action} without the fallback deadline`, async t => {
        t.mock.timers.enable({ apis: ["setTimeout", "setInterval"] });
        const original = Object.getOwnPropertyDescriptor(globalThis, "MediaRecorder");
        Object.defineProperty(globalThis, "MediaRecorder", { configurable: true, value: CaptureRecorder });
        t.after(() => {
            voiceBuffers.stop();
            if (original) Object.defineProperty(globalThis, "MediaRecorder", original);
            else Reflect.deleteProperty(globalThis, "MediaRecorder");
            CaptureRecorder.instances = [];
        });
        voiceBuffers.start();
        voiceBuffers.attach({ getAudioTracks: () => [{ readyState: "live" }] } as unknown as MediaStream, "123", "Speaker");
        const capture = CaptureRecorder.instances[0];
        const results: unknown[] = [];
        const first = voiceBuffers.harvest(0, Date.now()).then(value => results.push(value));
        const second = voiceBuffers.harvest(0, Date.now()).then(value => results.push(value));
        assert.equal(capture.requests, 2);
        if (action === "chunk") capture.emit();
        else voiceBuffers.stop();
        await setImmediate();
        assert.deepEqual(results, [[], []]);
        await Promise.all([first, second]);
    });
}
