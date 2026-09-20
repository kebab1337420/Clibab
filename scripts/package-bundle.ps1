# Maintainer script: packages the bundle-only release asset distributed with
# a Clipper release.
#
# The exe installer (installer\Program.cs) used to pull GitHub's source archive
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

# The version comes from the same manifest the updater reads, so the asset
# name matches what a client already on that version expects to download.
if (-not $Version) {
    $infoPath = Join-Path $prebuilt "build-info.json"
    if (Test-Path $infoPath) {
        $info = Get-Content $infoPath -Raw | ConvertFrom-Json
        $Version = $info.clipperVersion
    }
}
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

# ---------------------------------------------------------------- ship it ----
New-Item -ItemType Directory -Force $outputDir | Out-Null
$zip = Join-Path $outputDir $asset
if (Test-Path $zip) { Remove-Item $zip -Force }

Compress-Archive -Path (Join-Path $stage "clipper-bundle-v$Version") -DestinationPath $zip -CompressionLevel Optimal

Remove-Item $stage -Recurse -Force

$size = "{0:N1} MB" -f ((Get-Item $zip).Length / 1MB)
$sha = (Get-FileHash $zip -Algorithm SHA256).Hash.ToLower()

Write-Host "Bundle asset packaged: $zip ($size)"
Write-Host "sha256: $sha"
Write-Host ""
Write-Host "Upload it as a release asset named $asset. The exe installer downloads"
Write-Host "this asset instead of the repo's source archive; it falls back to the"
Write-Host "source archive only when the asset is absent."