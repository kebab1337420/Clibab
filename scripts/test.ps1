# Runs the plugin's unit tests.
#
# The tests cover the pure byte-level readers - `boxes.ts` and `mp4.ts` - which
# are the part of the plugin whose bugs produce no message at all, only an
# unreadable file. Everything else in the plugin needs a browser, a canvas or
# Discord's own modules and is not reachable from here.
#
# Node runs the TypeScript directly: nothing here imports from Vencord, so no
# build step and no test framework are involved. Node 22.6 or newer is needed
# for that, and 24 or newer for it to run without a flag.
#
#     .\scripts\test.ps1

$ErrorActionPreference = "Stop"

# Node 22.6+ runs the TypeScript directly, 24+ without a flag: fail fast with
# the download link instead of a page of resolver errors on an old runtime.
try {
    $version = (node --version) -replace '^v', ''
    if ([version]$version -lt [version]"22.6.0") {
        Write-Host "[ERROR] node $($version) is too old - install node 24 or newer from https://nodejs.org, then run this again."
        exit 1
    }
} catch {
    Write-Host "[ERROR] node was not found - install node 24 or newer from https://nodejs.org, then run this again."
    exit 1
}

$root = Split-Path -Parent $PSScriptRoot

# The preload gives Node the bundler's resolution for relative imports, which
# the shipped parsers depend on (`./boxes` is `./boxes.ts` to TypeScript and
# esbuild, but Node only knows the exact file). See register-ts-resolver.mjs.
Push-Location $root
try {
    node --import "./tests/register-ts-resolver.mjs" --test "tests/*.test.ts"
    exit $LASTEXITCODE
} finally {
    Pop-Location
}
