# Maintainer script: packages the bundle-only release asset distributed with
# a Clipper release.
#
# The NSIS setup (installer\clipper.nsi) used to pull GitHub's source archive
# of the whole repo, because install.bat, the scripts and prebuilt\dist all live
# in it. A release that ships the source code just to install a bundle gives
# anyone who grabs it the entire plugin sources as well.
#
# This script zips only what the installer actually needs to run:
#   - install.bat, VRinstaller.bat
#   - scripts\install-prebuilt.ps1, uninstall.ps1, install-vesktop.ps1
#   - prebuilt\build-info.json and prebuilt\dist\* (the verified bundle)
#
# The zip is wrapped in a single folder named after the release, the way
# GitHub's own source archives are, so the installer's "find install.bat"
# step keeps working unchanged.
#
# Usage:  scripts\package-bundle.ps1 [-Version <clipper version>]

param(
    [string] $Version
)

$ErrorActionPreference = "Stop"

$repo = Split-Path $PSScriptRoot -Parent
$prebuilt = Join-Path $repo "prebuilt"
$dist = Join-Path $prebuilt "dist"
$outputDir = Join-Path $repo "release\bundle"

if (-not (Test-Path (Join-Path $dist "patcher.js"))) {
    Write-Host "[ERROR] No prebuilt bundle at $dist."
    Write-Host "        Regenerate it with scripts\build-prebuilt.ps1 first."
    exit 1
}

# ---------------------------------------------------------- drift guard -------
# build-info.json hashes every file in prebuilt\dist and the install scripts,
# the way the in-client updater will: LF-normalized bytes for text, raw bytes
# for the exe. A file on disk that no longer matches its manifest entry was
# regenerated without a fresh build - which is exactly how 6.5.7 first shipped
# (a rebuilt patcher.js whose bytes disagreed with the committed manifest, so
# every client refused to install it). The updater refuses such a bundle, so a
# zip built from one is a zip nobody can install: refuse to package it instead.
function Get-ManifestEntry([string] $path) {
    $bytes = [IO.File]::ReadAllBytes($path)

    if ([IO.Path]::GetExtension($path) -in ".bat", ".ps1", ".js", ".css", ".txt", ".json", ".md") {
        $text = [Text.Encoding]::UTF8.GetString($bytes) -replace "`r`n", "`n"
        $bytes = [Text.Encoding]::UTF8.GetBytes($text)
    }

    $hash = [Security.Cryptography.SHA256]::Create().ComputeHash($bytes)
    return @{ size = $bytes.Length; sha256 = ([BitConverter]::ToString($hash) -replace '-', '').ToLower() }
}

$info = Get-Content (Join-Path $prebuilt "build-info.json") -Raw | ConvertFrom-Json

$drift = @()
foreach ($file in Get-ChildItem $dist -File) {
    $entry = $info.files.($file.Name)
    if (-not $entry) {
        $drift += "$($file.Name): not listed in build-info.json"
        continue
    }

    $actual = Get-ManifestEntry $file.FullName
    if ($actual.size -ne $entry.size -or $actual.sha256 -ne $entry.sha256) {
        $drift += "$($file.Name): $($actual.size) bytes / $($actual.sha256.Substring(0, 8))... on disk"
        $drift += "        manifest says: $($entry.size) bytes / $($entry.sha256.Substring(0, 8))..."
    }
}

if ($drift.Count -gt 0) {
    Write-Host "[ERROR] prebuilt\dist drifted from build-info.json:"
    $drift | ForEach-Object { Write-Host "        $_" }
    Write-Host "        Regenerate everything with scripts\build-prebuilt.ps1, then commit all of prebuilt\."
    exit 1
}

# The version comes from the same manifest the updater reads, so the asset
# name matches what a client already on that version expects to download.
if (-not $Version) { $Version = $info.clipperVersion }
if (-not $Version) { $Version = ((git describe --tags --abbrev=0 2>$null) -replace '^v', '') }
if (-not $Version) { $Version = "0" }

$asset = "clipper-bundle-v$Version.zip"

# ------------------------------------------------------------- stage the zip --
$stage = Join-Path $env:TEMP "clipper-bundle-$([System.IO.Path]::GetRandomFileName())"
$root = Join-Path $stage "clipper-bundle-v$Version"
New-Item -ItemType Directory -Force $root | Out-Null

Copy-Item (Join-Path $repo "install.bat") $root
Copy-Item (Join-Path $repo "VRinstaller.bat") $root

New-Item -ItemType Directory -Force (Join-Path $root "scripts") | Out-Null
foreach ($script in @("install-prebuilt.ps1", "uninstall.ps1", "install-vesktop.ps1")) {
    Copy-Item (Join-Path $repo "scripts\$script") (Join-Path $root "scripts")
}

New-Item -ItemType Directory -Force (Join-Path $root "prebuilt") | Out-Null
Copy-Item (Join-Path $prebuilt "build-info.json") (Join-Path $root "prebuilt")
Copy-Item $dist (Join-Path $root "prebuilt\dist") -Recurse

# Text files ride LF, like the git blobs the installer otherwise reads: a
# CRLF checkout must not ship bytes the manifest (hashed normalized) refuses.
# The extension list mirrors Get-StableHash in build-prebuilt.ps1 - every file
# the manifest checks, minus the exe, which is binary and ships untouched.
Get-ChildItem $root -Recurse -Include *.bat, *.ps1, *.js, *.css, *.txt, *.json, *.md | ForEach-Object {
    $text = [IO.File]::ReadAllText($_.FullName) -replace "`r`n", "`n"
    [IO.File]::WriteAllText($_.FullName, $text)
}

# ---------------------------------------------------------------- ship it ----
New-Item -ItemType Directory -Force $outputDir | Out-Null
$zip = Join-Path $outputDir $asset
if (Test-Path $zip) { Remove-Item $zip -Force }

Compress-Archive -Path (Join-Path $stage "clipper-bundle-v$Version") -DestinationPath $zip -CompressionLevel Optimal

Remove-Item $stage -Recurse -Force

$size = "{0:N1} MB" -f ((Get-Item $zip).Length / 1MB)
$hash = [Security.Cryptography.SHA256]::Create().ComputeHash([IO.File]::ReadAllBytes($zip))
$sha = ([BitConverter]::ToString($hash) -replace '-', '').ToLower()

Write-Host "Bundle asset packaged: $zip ($size)"
Write-Host "sha256: $sha"
Write-Host ""
Write-Host "Upload it as a release asset named $asset. The NSIS setup embeds"
Write-Host "this asset at build time (scripts\build-installer.ps1)."