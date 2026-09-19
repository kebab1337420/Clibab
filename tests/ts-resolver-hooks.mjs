import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

function withTs(specifier, parentURL) {
    if (!/^\.{1,2}\//.test(specifier)) return null;
    if (/\.[cm]?[jt]sx?$/.test(specifier)) return null;

    const base = parentURL ? fileURLToPath(new URL(specifier, parentURL)) : path.resolve(specifier);
    const file = `${base}.ts`;
    return existsSync(file) ? pathToFileURL(file).href : null;
}

export function resolve(specifier, context, nextResolve) {
    const ts = withTs(specifier, context.parentURL);
    if (ts) return { shortCircuit: true, url: ts };
    return nextResolve(specifier, context);
}