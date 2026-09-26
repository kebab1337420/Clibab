# Installs the prebuilt Vencord+Clipper bundle without any build toolchain.
#
# Nothing here needs node, pnpm or a Vencord checkout: the bundle in
# <repo>\prebuilt\dist is a finished Vencord build with Clipper compiled in.
#
# What it does:
#   1. copies the bundle to %APPDATA%\Vencord\clipper\dist (a stable path, so
#      moving or deleting this repo afterwards does not break the install)
#   2. stops there by default. Vencord itself is not touched: install and manage
#      it yourself, then re-run with -PatchClients to point your clients at this
#      dist folder. Never copy clipper\dist over your Vencord dist: that puts
#      the bundle where the official updater rebuilds in place. Leave Vencord's
#      own updater ON - this bundle ships the non-standalone build whose git
#      updater fails safe in a folder without git, so it never touches Clipper.
#   3. with -PatchClients, also restores the old behaviour: patches every
#      Discord flavour found (real app.asar renamed to _app.asar and replaced
#      by a stub asar that requires dist\patcher.js, exactly like the Vencord
#      installer does) and points every Vesktop / Equibop install at the same
#      dist folder.
#
# Exit codes: 0 = bundle delivered (patch mode: at least one client set up),
# 1 = nothing was set up.

param(
    [string] $DistSource = (Join-Path (Split-Path $PSScriptRoot -Parent) "prebuilt\dist"),
    [string] $InstallDir = (Join-Path $env:APPDATA "Vencord\clipper"),
    # also patch Discord / Vesktop to load this bundle. Off by default: Vencord
    # is the user's own business, this script only delivers the Clipper bundle.
    [switch] $PatchClients,
    # verify the installed bundle and the client stubs and fix them: an
    # official reinstall (or a copy over Vencord\dist) wipes clipper\dist, and
    # this re-copies it from the newest verified source - recovery snapshot,
    # prebuilt\dist, then the GitHub release - and rewrites the fallback stub.
    # Refuses while a client holds the files, same as the patch loop below.
    [switch] $Repair
)

$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------- asar stub --
# asar layout: uint32 4, uint32 headerSize, uint32 headerStringSize+4,
# uint32 jsonLength, the JSON header, then the file contents back to back.
function New-AsarStub([string] $path, [string] $patcher, [string] $fallback = "") {
    # Two targets: the Clipper bundle first, stock Vencord as the catch. When
    # clipper\dist is wiped (official reinstall, copy over Vencord\dist) the
    # client boots official Vencord instead of a dead client, and --repair
    # brings Clipper back. The fallback is optional so older callers keep working.
    if ($fallback) {
        $index = 'try{require("' + $patcher.Replace('\', '\\') + '")}catch(e){require("' + $fallback.Replace('\', '\\') + '")}'
    } else {
        $index = 'require("' + $patcher.Replace('\', '\\') + '")'
    }
    $pkg = "{`n`t`"name`": `"discord`",`n`t`"main`": `"index.js`"`n}"

    $indexBytes = [Text.Encoding]::UTF8.GetBytes($index)
    $pkgBytes = [Text.Encoding]::UTF8.GetBytes($pkg)

    $json = '{"files":{"index.js":{"size":' + $indexBytes.Length + ',"offset":"0"},' +
            '"package.json":{"size":' + $pkgBytes.Length + ',"offset":"' + $indexBytes.Length + '"}}}'

    # every pickle field is 4-byte aligned; pad the JSON with spaces, which it tolerates
    $jsonBytes = [Text.Encoding]::UTF8.GetBytes($json)
    while ($jsonBytes.Length % 4 -ne 0) {
        $json += " "
        $jsonBytes = [Text.Encoding]::UTF8.GetBytes($json)
    }

    # Through a temp file plus rename: a crash mid-write must never leave a
    # truncated stub behind, or the client will not boot.
    $temp = "$path.new"
    $stream = [IO.File]::Create($temp)
    try {
        $writer = [IO.BinaryWriter]::new($stream)
        $writer.Write([uint32] 4)
        $writer.Write([uint32] ($jsonBytes.Length + 8))
        $writer.Write([uint32] ($jsonBytes.Length + 4))
        $writer.Write([uint32] $jsonBytes.Length)
        $writer.Write($jsonBytes)
        $writer.Write($indexBytes)
        $writer.Write($pkgBytes)
        $writer.Flush()
    } finally {
        $stream.Dispose()
    }

    Move-Item $temp $path -Force
}

# Reads the patcher path out of a stub asar, or $null when the file is a real asar.
function Get-StubTarget([string] $asar) {
    if ((Get-Item $asar).Length -ge 4096) { return $null }

    $text = [IO.File]::ReadAllText($asar)
    $match = [regex]::Match($text, 'require\("(.+?)"\)')
    if (-not $match.Success) { return $null }

    return $match.Groups[1].Value -replace '\\\\', '\'
}

# Every patcher path a stub names, primary first. Get-StubTarget above stays
# single-target for its existing callers; the patch loop and repair use this
# to tell a primary-only stub (rewrite it to add the fallback) from a current one.
function Get-StubTargets([string] $asar) {
    if ((Get-Item $asar).Length -ge 4096) { return @() }

    $text = [IO.File]::ReadAllText($asar)
    $targets = @()
    foreach ($match in [regex]::Matches($text, 'require\("(.+?)"\)')) {
        $targets += ($match.Groups[1].Value -replace '\\\\', '\')
    }

    return $targets
}

# ------------------------------------------------------------ verify/repair --
# The same fail-closed check as installer\install.ps1 Test-Bundle: every file
# must match the size and sha256 its manifest names, or the source is refused.
# Returns $null when the file checks out, the reason it does not otherwise.
function Test-FileHash([string] $file, $size, [string] $sha256) {
    if ($null -eq $size -or $size -lt 0 -or -not $sha256) { return "lists no size and hash" }
    if (-not (Test-Path $file)) { return "is missing" }

    # Hashes are taken over LF-normalized bytes for text files: git hands out
    # LF while a Windows checkout holds CRLF, and the manifest has to match no
    # matter which side hashed it. Same normalization as Get-StableHash in
    # build-prebuilt.ps1, which wrote the manifest (and the extension list in
    # package-bundle.ps1, which ships the zip LF for the same reason).
    # Binaries hash as-is: a 0D0A byte pair inside them is data, not a line ending.
    $bytes = [IO.File]::ReadAllBytes($file)
    if ([IO.Path]::GetExtension($file) -in ".bat", ".ps1", ".js", ".css", ".txt", ".json", ".md") {
        $text = [Text.Encoding]::UTF8.GetString($bytes) -replace "`r`n", "`n"
        $bytes = [Text.Encoding]::UTF8.GetBytes($text)
    }
    if ($bytes.Length -ne $size) { return "size does not match the manifest" }

    # .NET directly, not Get-FileHash: see installer\install.ps1 Test-OneFile.
    $hash = [Security.Cryptography.SHA256]::Create().ComputeHash($bytes)
    $got = ([BitConverter]::ToString($hash) -replace '-', '').ToLowerInvariant()
    if ($got -ne $sha256.ToLowerInvariant()) { return "does not match its published hash" }

    return $null
}

# A dist folder holds the bundle it claims to when every manifest file checks
# out and the renderer carries the plugin (build-prebuilt.ps1:86-89).
function Test-BundleDir([string] $dir, $files) {
    if (-not $files) { return "the manifest names no files" }

    foreach ($entry in $files.PSObject.Properties) {
        $name = $entry.Name
        if ($name -ne (Split-Path $name -Leaf) -or $name.StartsWith('.')) {
            return "the manifest lists $($entry.Name), which is refused"
        }

        $bad = Test-FileHash (Join-Path $dir $name) $entry.Value.size $entry.Value.sha256
        if ($bad) { return "$name $bad" }
    }

    if (-not (Select-String -Path (Join-Path $dir "renderer.js") -SimpleMatch "Clipper" -Quiet)) {
        return "renderer.js carries no Clipper"
    }

    return $null
}

# Stock Vencord's bundle: what the fallback stub boots when clipper\dist is gone.
function Get-FallbackPatcher {
    return (Join-Path $env:APPDATA "Vencord\dist\patcher.js")
}

# Every stub asar in every Discord flavour's app folders, newest or leftover.
function Get-StubAsars {
    $asars = @()
    $roots = @(
        "$env:LOCALAPPDATA\Discord",
        "$env:LOCALAPPDATA\DiscordPTB",
        "$env:LOCALAPPDATA\DiscordCanary",
        "$env:LOCALAPPDATA\DiscordDevelopment"
    ) | Where-Object { Test-Path $_ }

    foreach ($root in $roots) {
        foreach ($appDir in (Get-ChildItem $root -Directory -Filter "app-*")) {
            $asar = Join-Path $appDir.FullName "resources\app.asar"
            if ((Test-Path $asar) -and @(Get-StubTargets $asar).Count -gt 0) { $asars += $asar }
        }
    }

    return $asars
}

# True while any client could hold the bundle or a stub open.
function Test-ClientRunning {
    $roots = @(
        "$env:LOCALAPPDATA\Discord",
        "$env:LOCALAPPDATA\DiscordPTB",
        "$env:LOCALAPPDATA\DiscordCanary",
        "$env:LOCALAPPDATA\DiscordDevelopment"
    ) | Where-Object { Test-Path $_ }

    foreach ($root in $roots) {
        if (Get-Process | Where-Object { $_.Path -like "$root\*" }) { return $true }
    }

    if (Get-Process -Name "Vesktop", "Equibop" -ErrorAction SilentlyContinue) { return $true }

    return $false
}

function Read-RepoManifest {
    $file = Join-Path (Split-Path $PSScriptRoot -Parent) "prebuilt\build-info.json"
    if (-not (Test-Path $file)) { return $null }
    try { return (Get-Content $file -Raw | ConvertFrom-Json) } catch { return $null }
}

function Read-UpdateRepo {
    # owner/repo the in-client updater fetches from (native.ts UPDATE_REPO),
    # so repair asks the same release feed for the same tag shape.
    $source = Join-Path (Split-Path $PSScriptRoot -Parent) "src\userplugins\Clipper\native.ts"
    if (-not (Test-Path $source)) { return $null }
    $match = [regex]::Match((Get-Content $source -Raw), 'UPDATE_REPO\s*=\s*"([^"]+)"')
    if ($match.Success) { return $match.Groups[1].Value }

    return $null
}

function Save-WebBundle([string] $slug, [string] $version, [string] $dest) {
    # Last resort: the release itself, every byte hash-checked against the
    # manifest it ships with before anything lands in the bundle.
    $tag = "v$version"
    $base = "https://raw.githubusercontent.com/$slug/$tag/prebuilt"
    $manifest = ((Invoke-WebRequest -Uri "$base/build-info.json" -UseBasicParsing |
        Select-Object -ExpandProperty Content | ConvertFrom-Json).files)
    if (-not $manifest) { throw "the release's file list names no files" }

    New-Item -ItemType Directory -Force $dest | Out-Null
    foreach ($entry in $manifest.PSObject.Properties) {
        $name = $entry.Name
        if ($name -ne (Split-Path $name -Leaf) -or $name.StartsWith('.')) {
            throw "the release lists a file named $name, which is refused"
        }

        Invoke-WebRequest -Uri "$base/dist/$name" -OutFile (Join-Path $dest $name) -UseBasicParsing

        $bad = Test-FileHash (Join-Path $dest $name) $entry.Value.size $entry.Value.sha256
        if ($bad) { throw "$name $bad" }
    }

    if (-not (Select-String -Path (Join-Path $dest "renderer.js") -SimpleMatch "Clipper" -Quiet)) {
        throw "there is no Clipper in that release's renderer"
    }

    return $manifest
}

<# Every file of the source, so the exact bundle that was verified is the one
   that gets installed. Files the new bundle no longer carries are removed:
   overwriting alone would let a renamed binary or a dropped file haunt the
   install across updates. $names limits the copy to manifest-listed files
   (the recovery cache carries its build-info.json alongside, which is not a
   bundle file); $null copies everything. #>
function Copy-BundleFiles([string] $from, [string] $to, $names) {
    $wanted = @{}
    $files = if ($names) { $names } else { @(Get-ChildItem $from -File | ForEach-Object { $_.Name }) }

    foreach ($name in $files) {
        $wanted[$name] = $true
        Copy-Item (Join-Path $from $name) -Destination $to -Force
    }

    Get-ChildItem $to -File |
        Where-Object { -not $wanted.ContainsKey($_.Name) } |
        ForEach-Object {
            Write-Host "      Removing stale $($_.Name) left by the previous install."
            Remove-Item $_.FullName -Force
        }
}

function Invoke-Repair {
    $dist = Join-Path $InstallDir "dist"
    $primary = Join-Path $dist "patcher.js"
    $fallback = Get-FallbackPatcher

    if (Test-ClientRunning) {
        Write-Host "      [!] A client is running - fully quit Discord and Vesktop (check the tray) and run this again."
        return 1
    }

    # Known-good manifests, newest first: the checkout's, plus every recovery
    # snapshot's own build-info.json. The install is healthy when it verifies
    # against any one of them, so a bundle the in-client updater moved past
    # the checkout is never "repaired" backwards.
    $candidates = @()
    $repo = Read-RepoManifest
    if ($repo -and $repo.clipperVersion -and $repo.files) {
        $candidates += @{ version = [string]$repo.clipperVersion; files = $repo.files; dir = $DistSource; kind = "prebuilt" }
    }
    foreach ($cache in @(Get-ChildItem $InstallDir -Directory -Filter ".recovery-*" -ErrorAction SilentlyContinue)) {
        $manifestFile = Join-Path $cache.FullName "build-info.json"
        if (-not (Test-Path $manifestFile)) { continue }
        try { $info = Get-Content $manifestFile -Raw | ConvertFrom-Json } catch { continue }
        if (-not $info.files) { continue }
        $candidates += @{ version = ($cache.Name -replace '^\.recovery-', ''); files = $info.files; dir = $cache.FullName; kind = "cache" }
    }
    $candidates = @($candidates |
        Sort-Object { try { [version]($_.version -replace '^v', '') } catch { [version]'0.0.0' } } -Descending)

    $stage = $null
    try {
        $broken = $true
        if (Test-Path $dist) {
            foreach ($c in $candidates) {
                if (-not (Test-BundleDir $dist $c.files)) { $broken = $false; break }
            }
        }

        if ($broken) {
            # Newest verified source wins: snapshot, then the checkout's
            # prebuilt\dist, then the release itself.
            $chosen = $null
            foreach ($c in $candidates) {
                if ((Test-Path $c.dir) -and -not (Test-BundleDir $c.dir $c.files)) { $chosen = $c; break }
            }

            if (-not $chosen) {
                $top = $candidates | Select-Object -First 1
                $slug = Read-UpdateRepo
                if (-not $top) {
                    Write-Host "[ERROR] Nothing is installed and no verified source exists (no recovery snapshot, no prebuilt bundle)."
                    return 1
                }
                if (-not $slug) {
                    Write-Host "[ERROR] No verified source on disk and the release feed is unknown - reinstall from a fresh checkout."
                    return 1
                }
                $stage = Join-Path ([IO.Path]::GetTempPath()) ("clipper-repair-" + [Guid]::NewGuid().ToString("N"))
                Write-Host "      No verified copy on disk - fetching $($top.version) from the release..."
                $webFiles = Save-WebBundle $slug $top.version $stage
                $chosen = @{ version = $top.version; files = $webFiles; dir = $stage; kind = "release" }
            }

            New-Item -ItemType Directory -Force $dist | Out-Null
            Copy-BundleFiles $chosen.dir $dist @($chosen.files.PSObject.Properties | ForEach-Object { $_.Name })
            Write-Host "      Bundle repaired from $($chosen.kind) ($($chosen.version))."
        } else {
            Write-Host "      Bundle verifies - leaving it alone."
        }

        $marker = Join-Path $InstallDir "package.json"
        if (-not (Test-Path $marker)) {
            '{ "name": "vencord", "private": "true", "main": "dist/patcher.js" }' |
                Set-Content $marker -Encoding UTF8
        }

        $rewrote = 0
        foreach ($asar in @(Get-StubAsars)) {
            try {
                New-AsarStub $asar $primary $fallback
                $rewrote++
            } catch {
                Write-Host "      [!] $asar could not be rewritten - $($_.Exception.Message)"
            }
        }
        if ($rewrote -gt 0) {
            Write-Host "      Rewrote $rewrote stub(s): Clipper first, stock Vencord as fallback."
        } else {
            Write-Host "      No patched clients found - run with -PatchClients to point them at the bundle."
        }

        Write-Host "      Leave Vencord's own updater ON; it cannot touch this bundle."
        return 0
    } catch {
        Write-Host "[ERROR] Repair failed - $($_.Exception.Message)"
        return 1
    } finally {
        if ($stage -and (Test-Path $stage)) {
            Remove-Item $stage -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
}

if ($Repair) {
    exit (Invoke-Repair)
}

# ------------------------------------------------------------- copy bundle --
if (-not (Test-Path (Join-Path $DistSource "patcher.js"))) {
    Write-Host "[ERROR] No prebuilt bundle at $DistSource"
    Write-Host "        Regenerate it with scripts\build-prebuilt.ps1, or run install.bat --source."
    exit 1
}

$dist = Join-Path $InstallDir "dist"
New-Item -ItemType Directory -Force $dist | Out-Null
Copy-BundleFiles $DistSource $dist $null

# find-vencord.ps1 and Vesktop both expect a repo-shaped folder next to dist
$marker = Join-Path $InstallDir "package.json"
if (-not (Test-Path $marker)) {
    '{ "name": "vencord", "private": "true", "main": "dist/patcher.js" }' |
        Set-Content $marker -Encoding UTF8
}

Write-Host "      Bundle installed to $dist"

# The installation ends here unless the user explicitly asked for client patching.
# Vencord's own installer and updater are left alone by default.
if (-not $PatchClients) {
    Write-Host "      Vencord not installed - install it yourself and leave its updater ON,"
    Write-Host "      then re-run with -PatchClients to point your clients at $dist"
    Write-Host "      (never copy clipper\dist over your Vencord dist: the official updater"
    Write-Host "      rebuilds that folder in place. Wiped? install.bat --repair)"
    exit 0
}

# ------------------------------------------------------------ patch Discord --
$patcher = Join-Path $dist "patcher.js"
$fallbackPatcher = Get-FallbackPatcher
$patched = 0
$skipped = @()

$discordRoots = @(
    "$env:LOCALAPPDATA\Discord",
    "$env:LOCALAPPDATA\DiscordPTB",
    "$env:LOCALAPPDATA\DiscordCanary",
    "$env:LOCALAPPDATA\DiscordDevelopment"
) | Where-Object { Test-Path $_ }

foreach ($root in $discordRoots) {
    $name = Split-Path $root -Leaf

    # only the newest app-x.y.z matters; older ones are leftovers Discord no longer starts
    $appDirs = @(Get-ChildItem $root -Directory -Filter "app-*" |
        Sort-Object { try { [version]($_.Name -replace '^app-', '') } catch { [version]'0.0.0' } } -Descending)

    # Stale patch files in folders Discord will never start again: a newer
    # app dir means these are orphans of our own older installs, each holding
    # a full asar copy. The original goes back, the stub goes away.
    foreach ($old in ($appDirs | Select-Object -Skip 1)) {
        $oldResources = Join-Path $old.FullName "resources"
        $oldAsar = Join-Path $oldResources "app.asar"
        $oldOriginal = Join-Path $oldResources "_app.asar"

        if ((Test-Path $oldAsar) -and (Test-Path $oldOriginal) -and (Get-StubTarget $oldAsar)) {
            try {
                Remove-Item $oldAsar -Force
                Move-Item $oldOriginal $oldAsar -Force
                Write-Host "      Cleaned a leftover patch in $($old.Name)."
            } catch {
                Write-Host "      [!] Could not clean $($old.Name) - $($_.Exception.Message)"
            }
        }
    }

    $resources = $appDirs |
        Sort-Object { try { [version]($_.Name -replace '^app-', '') } catch { [version]'0.0.0' } } -Descending |
        ForEach-Object { Join-Path $_.FullName "resources" } |
        Where-Object { Test-Path $_ } |
        Select-Object -First 1

    if (-not $resources) { continue }

    $asar = Join-Path $resources "app.asar"
    $original = Join-Path $resources "_app.asar"

    if (-not (Test-Path $asar) -and -not (Test-Path $original)) { continue }

    # A running client is only in the way when there is something to write. The
    # stub is written once and points at the dist folder; the dist folder has
    # already been refreshed above. So a client whose stub already points here
    # is not "not set up" - it is set up, holding the old bundle in memory until
    # it restarts. Reporting that as a failed install sent someone looking for
    # an installation that had already happened.
    $running = Get-Process | Where-Object { $_.Path -like "$root\*" }
    if ($running) {
        if ((Test-Path $asar) -and (Get-StubTarget $asar) -eq $patcher) {
            Write-Host "      $name already points at this build - restart it to load the new bundle."
            $patched++
        } else {
            Write-Host "      [!] $name is running - close it (check the tray) and run this again."
            $skipped += $name
        }
        continue
    }

    if (Test-Path $asar) {
        $target = Get-StubTarget $asar

        if ($target) {
            # already patched: keep the untouched original, just retarget the stub
            $targets = @(Get-StubTargets $asar)
            if (($target -eq $patcher) -and ($targets -contains $fallbackPatcher)) {
                Write-Host "      $name already points at this build."
                $patched++
                continue
            }
            if ($target -eq $patcher) {
                Write-Host "      $name points at this build - adding the fallback."
            } else {
                Write-Host "      $name was pointed at $target - retargeting."
            }
        } elseif (Test-Path $original) {
            # a real app.asar next to a leftover _app.asar: Discord updated itself
            Remove-Item $original -Force
            Move-Item $asar $original -Force
        } else {
            Move-Item $asar $original -Force
        }
    }

    if (-not (Test-Path $original)) {
        Write-Host "      [!] $name has no app.asar to patch, skipping."
        $skipped += $name
        continue
    }

    try {
        New-AsarStub $asar $patcher $fallbackPatcher
        Write-Host "      $name patched (original kept as _app.asar)"
        $patched++
    } catch {
        Write-Host "      [!] $name could not be patched - $($_.Exception.Message)"
        # Restore the untouched original whenever the stub is missing OR a
        # truncated write: a half-written stub is a client that will not boot.
        if ((-not (Test-Path $asar)) -or ((Get-Item $asar).Length -lt 4096)) {
            if (Test-Path $asar) { Remove-Item $asar -Force }
            Move-Item $original $asar -Force
        }
        $skipped += $name
    }
}

# ------------------------------------------------------------ point Vesktop --
# install-vesktop.ps1 also exits 0 when no Vesktop is installed, so only count it
# as a client when one actually exists.
$hasVesktop = @("vesktop", "Vesktop", "equibop", "Equibop") |
    ForEach-Object { Join-Path $env:APPDATA $_ } |
    Where-Object { Test-Path $_ }

& (Join-Path $PSScriptRoot "install-vesktop.ps1") -VencordDir $InstallDir
if ($LASTEXITCODE -eq 0 -and $hasVesktop) { $patched++ }
if ($LASTEXITCODE -ne 0 -and $hasVesktop) { $skipped += "Vesktop" }

if ($skipped.Count -gt 0) {
    Write-Host "      [!] Not set up: $($skipped -join ', ') - close them and run this again."
}

if ($patched -eq 0) {
    Write-Host "[ERROR] No Discord or Vesktop install was set up."
    exit 1
}

exit 0
