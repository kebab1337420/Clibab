# Maintainer script: refreshes prebuilt\dist from a Vencord checkout.
#
# Users never run this. It builds Vencord with the plugin copied in, then copies
# the resulting bundle (without source maps, which are 14 MB of no use to anyone
# installing it) into prebuilt\dist, alongside a build-info.json describing what
# went in.
#
# Usage:  scripts\build-prebuilt.ps1 [-VencordDir <path>]

param(
    [string] $VencordDir = (Join-Path (Split-Path $PSScriptRoot -Parent) "Vencord"),
    [string] $PluginName = "Clipper"
)

$ErrorActionPreference = "Stop"

$repo = Split-Path $PSScriptRoot -Parent
$pluginSrc = Join-Path $repo "src\userplugins\$PluginName"
$prebuilt = Join-Path $repo "prebuilt\dist"

# ---- local-build guard ------------------------------------------------------
# A rebuilt bundle silently rewrites tracked files (prebuilt\dist + build-info).
# Publishing a local, untested bundle under a tag breaks VerifyBundleAsync for
# everyone who installs it. Local iteration is not blocked, only warned about.
if ($env:CLIPPER_SKIP_DIRTY_CHECK -ne "1") {
    $dirty = $null
    Push-Location $repo
    try { $dirty = (& git status --porcelain -- prebuilt/ 2>$null) } catch { }
    finally { Pop-Location }

    if ($dirty) {
        Write-Host ""
        Write-Host "      [!!!] prebuilt/ has uncommitted local changes:"
        $dirty | ForEach-Object { Write-Host "            $_" }
        Write-Host "      [!!!] The bundle this script writes is NOT the one the last tag shipped."
        Write-Host "      [!!!] Commit the regenerated bundle first, or set CLIPPER_SKIP_DIRTY_CHECK=1 to push on anyway."
        Write-Host ""
    }
}

if (-not (Test-Path (Join-Path $VencordDir "package.json"))) {
    Write-Host "[ERROR] Not a Vencord repository: $VencordDir"
    exit 1
}

if (-not (Test-Path (Join-Path $pluginSrc "index.tsx"))) {
    Write-Host "[ERROR] Plugin sources not found at $pluginSrc"
    exit 1
}

# ---- plugin into the checkout ------------------------------------------------
$dest = Join-Path $VencordDir "src\userplugins\$PluginName"
New-Item -ItemType Directory -Force (Split-Path $dest -Parent) | Out-Null
if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
Copy-Item $pluginSrc $dest -Recurse -Force
Write-Host "Plugin copied to $dest"

# ---- build -------------------------------------------------------------------
if (-not (Test-Path (Join-Path $VencordDir "node_modules"))) {
    Push-Location $VencordDir
    try { & cmd /c "pnpm install --frozen-lockfile" } finally { Pop-Location }
}

& (Join-Path $PSScriptRoot "build-vencord.ps1") -VencordDir $VencordDir -KeepPlugin $PluginName
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Vencord build failed."
    exit 1
}

# ---- copy the bundle ---------------------------------------------------------
$dist = Join-Path $VencordDir "dist"
if (-not (Test-Path (Join-Path $dist "patcher.js"))) {
    Write-Host "[ERROR] $dist has no patcher.js - the build produced nothing."
    exit 1
}

if (Test-Path $prebuilt) { Remove-Item $prebuilt -Recurse -Force }
New-Item -ItemType Directory -Force $prebuilt | Out-Null

Get-ChildItem $dist -File |
    Where-Object { $_.Extension -in ".js", ".css", ".txt" } |
    Copy-Item -Destination $prebuilt

# The renderer bundle must contain the plugin, otherwise the whole point is lost.
$renderer = Join-Path $prebuilt "renderer.js"
if (-not (Select-String -Path $renderer -SimpleMatch $PluginName -Quiet)) {
    Write-Host "[ERROR] $PluginName is not in the built renderer - was it quarantined?"
    exit 1
}

# ---- the Rust voice-capture binary -----------------------------------------
# The per-person voice capture ships as a native exe next to the bundle, and
# native.ts finds it there (voiceBinaryPath). build-info.json below picks every
# file present in prebuilt\dist, so the exe is shipped and integrity-checked
# like the rest. A cargo failure fails the script: a release with the exe
# missing would answer "binary not found" to every user.
$crate = Join-Path $repo "rust-voice-capture"
Write-Host "Building discord-voice-capture with cargo..."
$cargoOut = $null
Push-Location $crate
try {
    $cargoOut = & cargo build --release 2>&1
    $cargoCode = $LASTEXITCODE
} finally { Pop-Location }

if ($cargoCode -ne 0) {
    Write-Host "[ERROR] cargo build --release failed:"
    $cargoOut | ForEach-Object { Write-Host "        $_" }
    exit 1
}

$exeName = if ($IsWindows) { "discord-voice-capture.exe" } else { "discord-voice-capture" }
$bin = Join-Path $crate "target\release\$exeName"
if (-not (Test-Path $bin)) {
    Write-Host "[ERROR] Built binary not found at $bin"
    exit 1
}
Copy-Item $bin $prebuilt -Force
Write-Host "Copied $exeName into prebuilt\dist"

$version = (Get-Content (Join-Path $VencordDir "package.json") -Raw | ConvertFrom-Json).version

$commit = $null
Push-Location $VencordDir
try { $commit = (& git rev-parse --short HEAD 2>$null) } catch { }
finally { Pop-Location }

# ---- what the updater reads --------------------------------------------------
# The in-client updater compares the version compiled into the plugin against
# the newest release tag, then fetches this manifest from the tag it found and
# checks every file it downloads against the hash recorded here. A release whose
# tag does not match the constant is invisible to every client already on it,
# hence the warning.
$clipperVersion = $null
$updaterSource = Join-Path $pluginSrc "updater.ts"
if (Test-Path $updaterSource) {
    $match = [regex]::Match((Get-Content $updaterSource -Raw), 'CLIPPER_VERSION\s*=\s*"([^"]+)"')
    if ($match.Success) { $clipperVersion = $match.Groups[1].Value }
}

if (-not $clipperVersion) {
    Write-Host "      [!] No CLIPPER_VERSION in $updaterSource - the updater cannot compare versions."
}

$clipperCommit = $null
Push-Location $repo
try {
    $clipperCommit = (& git rev-parse --short HEAD 2>$null)
    $tag = (& git describe --tags --abbrev=0 2>$null)
    if ($tag -and $clipperVersion -and ($tag -replace '^v', '') -ne $clipperVersion) {
        Write-Host "      [!] Newest tag is $tag but CLIPPER_VERSION is $clipperVersion - bump one of them before releasing."
    }
} catch { }
finally { Pop-Location }

$files = [ordered] @{}
Get-ChildItem $prebuilt -File | Sort-Object Name | ForEach-Object {
    $files[$_.Name] = [ordered] @{
        size   = $_.Length
        sha256 = (Get-FileHash $_.FullName -Algorithm SHA256).Hash.ToLower()
    }
}

# The scripts the installer runs (install.bat, VRinstaller.bat) are checked
# against these by the installer itself: verifying the bundle but running
# unchecked scripts would check the wrong half.
$root = [ordered] @{}
foreach ($name in @("install.bat", "VRinstaller.bat")) {
    $file = Join-Path $repo $name
    if (Test-Path $file) {
        $hash = (Get-FileHash $file -Algorithm SHA256).Hash.ToLower()
        $root[$name] = [ordered] @{
            size   = (Get-Item $file).Length
            sha256 = $hash
        }
    }
}

[ordered] @{
    vencordVersion = $version
    vencordCommit  = $commit
    plugin         = $PluginName
    clipperVersion = $clipperVersion
    clipperCommit  = $clipperCommit
    builtAt        = (Get-Date).ToString("s")
    files          = $files
    root           = $root
} | ConvertTo-Json -Depth 4 | Set-Content (Join-Path (Split-Path $prebuilt -Parent) "build-info.json") -Encoding UTF8

$size = "{0:N1} MB" -f ((Get-ChildItem $prebuilt -File | Measure-Object Length -Sum).Sum / 1MB)
Write-Host "prebuilt\dist refreshed from Vencord $version ($size)"
exit 0
