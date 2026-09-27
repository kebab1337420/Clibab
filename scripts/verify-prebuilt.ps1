# Maintainer script: checks the prebuilt bundle against its manifest before a
# release goes out.
#
# The in-client updater downloads every dist file from the release tag's raw
# tree and refuses to install if a single byte disagrees with the manifest it
# fetched from the same tree. That means a tag whose tree is internally
# inconsistent ships a release nobody can install: 6.5.7 shipped exactly that
# (a patcher.js rebuilt after the manifest was written, then committed without
# all its siblings), and every client on 6.5.6 bounced off the install until
# the tag was force-moved onto a coherent tree.
#
# This script re-derives the manifest the updater would (same LF normalization,
# same byte-for-byte hashing, same file set), proves that what is on disk still
# matches it, and asserts that every prebuilt\dist file touched by a rebuild
# is committed - so the tag you push next points at bytes the updater accepts.
#
# Usage:  scripts\verify-prebuilt.ps1

$ErrorActionPreference = "Stop"

$repo = Split-Path $PSScriptRoot -Parent
$prebuilt = Join-Path $repo "prebuilt"
$dist = Join-Path $prebuilt "dist"

$infoPath = Join-Path $prebuilt "build-info.json"
if (-not (Test-Path $dist) -or -not (Test-Path $infoPath)) {
    Write-Host "[ERROR] No prebuilt bundle (dist\ or build-info.json missing)."
    Write-Host "        Build one with scripts\build-prebuilt.ps1 first."
    exit 1
}

# The updater's manifest hashes LF-normalized bytes for text files and raw
# bytes for binaries. Any check here must reproduce it exactly or it validates
# the wrong thing.
function Get-ManifestEntry([string] $path) {
    $bytes = [IO.File]::ReadAllBytes($path)

    if ([IO.Path]::GetExtension($path) -in ".bat", ".ps1", ".js", ".css", ".txt", ".json", ".md") {
        $text = [Text.Encoding]::UTF8.GetString($bytes) -replace "`r`n", "`n"
        $bytes = [Text.Encoding]::UTF8.GetBytes($text)
    }

    $hash = [Security.Cryptography.SHA256]::Create().ComputeHash($bytes)
    return @{ size = $bytes.Length; sha256 = ([BitConverter]::ToString($hash) -replace '-', '').ToLower() }
}

$info = Get-Content $infoPath -Raw | ConvertFrom-Json
$failures = @()

# ---- every dist file matches its manifest entry ----------------------------
foreach ($file in Get-ChildItem $dist -File) {
    $entry = $info.files.($file.Name)
    if (-not $entry) {
        $failures += "$($file.Name): on disk but not in build-info.json"
        continue
    }

    $actual = Get-ManifestEntry $file.FullName
    if ($actual.size -ne $entry.size -or $actual.sha256 -ne $entry.sha256) {
        $failures += "$($file.Name): $($actual.size) bytes / $($actual.sha256.Substring(0, 8))... on disk, manifest says $($entry.size) / $($entry.sha256.Substring(0, 8))..."
    }
}

# ---- every manifest entry exists on disk -----------------------------------
foreach ($name in $info.files.PSObject.Properties.Name) {
    $path = Join-Path $dist $name
    if (-not (Test-Path $path)) {
        $failures += "$name`: in build-info.json but missing from dist"
    }
}

# ---- every tracked file in prebuilt\ is committed --------------------------
# A file rebuilt after the manifest was generated still matches build-info.json
# on disk - the manifest hashes the current bytes, whatever they are. The
# updater fetches the tag's tree, though, so the bytes only matter once they
# are committed. Uncommitted changes below make the on-disk check moot.
$dirty = $null
Push-Location $repo
try {
    $dirty = & git status --porcelain -- prebuilt/ 2>$null
    if ($LASTEXITCODE -ne 0) { $failures += "git status failed - cannot confirm prebuilt\ is committed" }
} finally { Pop-Location }

if ($dirty) {
    $failures += "prebuilt\ has uncommitted changes - commit them before tagging:"
    $dirty | ForEach-Object { $failures += "    $_" }
}

if ($failures.Count -gt 0) {
    Write-Host "[ERROR] prebuilt bundle is not release-ready:"
    $failures | ForEach-Object { Write-Host "        $_" }
    Write-Host ""
    Write-Host "        Fix the drift with scripts\build-prebuilt.ps1, commit every file it"
    Write-Host "        touched (including patcher.js and vencordDesktopMain.js), then run this"
    Write-Host "        again. Do not tag, push new assets, or open a release until it is clean."
    exit 1
}

$size = "{0:N1} MB" -f ((Get-ChildItem $dist -File | Measure-Object Length -Sum).Sum / 1MB)
Write-Host "prebuilt bundle is coherent: $($info.clipperVersion), dist $size, files all match build-info.json, nothing uncommitted."
exit 0