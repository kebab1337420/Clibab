# Builds the standalone Windows installer distributed with a Clipper release.
#
# Nullsoft Install System: installer\clipper.nsi plus its install.ps1 worker.
# The setup is offline - the versioned bundle asset is embedded in the exe,
# so installs need no network and nothing can go stale between the lookup
# and the download. The wizard verifies the embedded files against their
# manifest and runs install-prebuilt.ps1 -PatchClients (and VRinstaller.bat
# when the SteamVR box is ticked), so the setup exe itself stays small.
$ErrorActionPreference = "Stop"
$repo = Split-Path $PSScriptRoot -Parent

# The version stamped on the setup exe comes from the same constant the
# updater compares against, so the installer never claims a version the
# plugin does not know.
$version = [regex]::Match(
    (Get-Content (Join-Path $repo "src\userplugins\Clipper\updater.ts") -Raw),
    'CLIPPER_VERSION\s*=\s*"([^"]+)"'
).Groups[1].Value
if (-not $version) { throw "Could not read CLIPPER_VERSION from updater.ts" }

# The bundle the setup embeds: built from the current tree by
# package-bundle.ps1 when it is missing, so the exe always carries the
# release it names.
$asset = "clipper-bundle-v$version.zip"
$bundleZip = Join-Path $repo "release\bundle\$asset"
if (-not (Test-Path $bundleZip)) {
    Write-Host "No $asset - packaging it first..."
    & (Join-Path $PSScriptRoot "package-bundle.ps1") -Version $version
    if (-not (Test-Path $bundleZip)) { throw "Packaging did not produce $bundleZip" }
}

$makensis = @(
    (Get-Command makensis -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source),
    "${env:ProgramFiles(x86)}\NSIS\makensis.exe",
    "$env:ProgramFiles\NSIS\makensis.exe"
) | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1
if (-not $makensis) {
    throw "makensis not found. Install it with: winget install NSIS.NSIS"
}

$output = Join-Path $repo "release\installer"
if (Test-Path $output) { Remove-Item $output -Recurse -Force }
New-Item -ItemType Directory -Force $output | Out-Null

# Relative paths inside clipper.nsi (File, OutFile) resolve against the
# working directory, so the compile runs from installer\. The bundle zip is
# staged as build\bundle.zip first: an absolute source path with spaces does
# not survive the makensis command line, a relative one does.
$buildDir = Join-Path $repo "installer\build"
if (Test-Path $buildDir) { Remove-Item $buildDir -Recurse -Force }
New-Item -ItemType Directory -Force $buildDir | Out-Null
Copy-Item $bundleZip (Join-Path $buildDir "bundle.zip") -Force

Push-Location (Join-Path $repo "installer")
try {
    & $makensis "/DVERSION=$version" "clipper.nsi"
    if ($LASTEXITCODE -ne 0) { throw "makensis failed with exit code $LASTEXITCODE" }
} finally {
    Pop-Location
    Remove-Item $buildDir -Recurse -Force -ErrorAction SilentlyContinue
}

$exe = Join-Path $output "ClipperSetup.exe"
if (-not (Test-Path $exe)) { throw "Installer build did not produce $exe" }
$size = "{0:N1} MB" -f ((Get-Item $exe).Length / 1MB)
Write-Host "Installer built: $exe ($size)"
