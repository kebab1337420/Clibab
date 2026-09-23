# Worker behind the NSIS setup wizard (installer\clipper.nsi): downloads the
# newest Clipper release, verifies it against the published file list, and
# runs its scripts\install-prebuilt.ps1 -PatchClients - plus VRinstaller.bat
# when -SteamVR is given.
#
# This is the PowerShell port of what installer\Program.cs used to do. NSIS
# ships no HTTPS downloader and no SHA256 hasher in its stock plugins, while
# every Windows 10/11 machine already has both in PowerShell - so the wizard
# owns the pages and the progress bar, and this owns the network and the
# bytes. Nothing is run until every shipped file has matched the published
# hashes: that is the one check that tells a genuine release from something
# slipped in on the way down.
#
# Exit codes: 0 = done, 1 = nothing was installed (message on stdout).

param(
    # also run the release's VRinstaller.bat after the plugin install
    [switch] $SteamVR
)

$ErrorActionPreference = "Stop"

$UpdateRepo = "kebab1337420/Clibab"

function Get-LatestRelease {
    # The version is read from the release list rather than pinned: a tag
    # that moved on is how a hardcoded one starts installing an archive
    # nobody is looking at any more.
    $headers = @{ "User-Agent" = "ClipperInstaller/2.0 (+https://github.com/$UpdateRepo)" }
    try {
        $release = Invoke-RestMethod -Uri "https://api.github.com/repos/$UpdateRepo/releases/latest" `
            -Headers $headers -TimeoutSec 60
    } catch {
        throw "GitHub rejected the release lookup ($($_.Exception.Message)). Try again shortly."
    }

    $tag = $release.tag_name
    if (-not $tag) { throw "GitHub answered a release with no tag." }
    $version = $tag -replace '^[vV]', ''

    # The bundle-only asset, looked up by name because that is the contract:
    # package-bundle.ps1 ships it as clipper-bundle-vX.zip. Releases without
    # the asset fall back to GitHub's source archive, which is all they carry.
    $bundleUrl = ""
    foreach ($asset in @($release.assets)) {
        if ($asset.name -eq "clipper-bundle-v$version.zip") { $bundleUrl = $asset.browser_download_url; break }
    }
    if (-not $bundleUrl) { $bundleUrl = "https://github.com/$UpdateRepo/archive/refs/tags/$tag.zip" }

    return @{ Tag = $tag; Version = $version; Url = $bundleUrl }
}

function Find-ReleaseRoot([string] $extractDir) {
    # The extracted release's root: the folder that holds install.bat. A
    # source archive and the bundle asset both wrap themselves in one
    # folder, so that folder is walked for; a zip put flat in the temp
    # directory is accepted too.
    if (Test-Path (Join-Path $extractDir "install.bat")) { return $extractDir }
    foreach ($dir in (Get-ChildItem $extractDir -Directory)) {
        if (Test-Path (Join-Path $dir.FullName "install.bat")) { return $dir.FullName }
    }
    return $null
}

function Test-Bundle([string] $tag, [string] $repoRoot) {
    # Checks the extracted repo's shipped bundle against the hashes the
    # release published for it, failing rather than running an unmatched one.
    try {
        $response = Invoke-WebRequest -Uri "https://raw.githubusercontent.com/$UpdateRepo/$tag/prebuilt/build-info.json" `
            -TimeoutSec 60 -UseBasicParsing
    } catch {
        throw "The release carries no file list, refusing to install it unchecked."
    }
    if ($response.StatusCode -eq 404) {
        throw "The release carries no file list, refusing to install it unchecked."
    }

    try {
        $files = ($response.Content | ConvertFrom-Json).files
    } catch {
        throw "The release's file list could not be read, so there is nothing to check the bundle against."
    }

    foreach ($entry in $files.PSObject.Properties) {
        $name = $entry.Name
        if ($name -ne (Split-Path $name -Leaf) -or $name.StartsWith('.')) {
            throw "The release lists a file named $name, which is refused."
        }

        $size = $entry.Value.size
        $sha256 = $entry.Value.sha256
        if ($null -eq $size -or $size -lt 0 -or -not $sha256) {
            throw "The release lists no size and hash for $name."
        }

        $file = Join-Path $repoRoot "prebuilt\dist\$name"
        if (-not (Test-Path $file)) {
            throw "The release names $name and the archive does not carry it."
        }

        $info = Get-Item $file
        if ($info.Length -ne $size) {
            throw "$name is $($info.Length) bytes, the release says $size."
        }

        $got = (Get-FileHash $file -Algorithm SHA256).Hash.ToLowerInvariant()
        if ($got -ne $sha256.ToLowerInvariant()) {
            throw "$name does not match its published hash."
        }
    }
}

function Invoke-Prebuilt([string] $repoRoot) {
    # The release's own installer: copies the bundle and patches every client
    # it finds (plain install.bat never patched anything, which is how a
    # "successful" install once left Discord unpatched). A nonzero exit means
    # no client was set up, and that fails the install rather than silently
    # leaving a bundle nobody loads.
    $script = Join-Path $repoRoot "scripts\install-prebuilt.ps1"
    if (-not (Test-Path $script)) { throw "The release archive is missing scripts\install-prebuilt.ps1." }

    $process = Start-Process "powershell.exe" `
        -ArgumentList "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", "`"$script`"", "-PatchClients" `
        -WorkingDirectory $repoRoot -NoNewWindow -Wait -PassThru
    if ($process.ExitCode -ne 0) {
        throw "The bundle installed, but no Discord or Vesktop install was set up (exit $($process.ExitCode))."
    }
}

function Invoke-Batch([string] $file, [string] $workingDirectory) {
    # stdin comes from NUL: install scripts end in `pause`, and there is no
    # console to press a key on under the wizard.
    $process = Start-Process "cmd.exe" -ArgumentList "/d", "/c", "`"$file`" < NUL" `
        -WorkingDirectory $workingDirectory -NoNewWindow -Wait -PassThru `
        -RedirectStandardOutput "$env:TEMP\clipper-install-out.txt" `
        -RedirectStandardError "$env:TEMP\clipper-install-err.txt"
    $output = Get-Content "$env:TEMP\clipper-install-out.txt" -Raw -ErrorAction SilentlyContinue
    $errorText = Get-Content "$env:TEMP\clipper-install-err.txt" -Raw -ErrorAction SilentlyContinue
    Remove-Item "$env:TEMP\clipper-install-out.txt", "$env:TEMP\clipper-install-err.txt" `
        -Force -ErrorAction SilentlyContinue
    if ($output) { Write-Host $output }
    if ($process.ExitCode -ne 0) {
        $message = if ([string]::IsNullOrWhiteSpace($errorText)) { $output } else { $errorText }
        throw $message.Trim()
    }
}

try {
    Write-Host "Looking up the newest release..."
    $release = Get-LatestRelease

    $cacheDir = Join-Path $env:LOCALAPPDATA "ClipperInstaller"
    New-Item -ItemType Directory -Force $cacheDir | Out-Null
    $cachePath = Join-Path $cacheDir "clipper-v$($release.Version).zip"

    $zipPath = $null
    $temporaryZip = $null
    $useCache = $false
    if ((Test-Path $cachePath) -and ((Get-Date) - (Get-Item $cachePath).LastWriteTime).TotalHours -lt 24) {
        $useCache = $true
        $zipPath = $cachePath
    }

    if (-not $useCache) {
        $temporaryZip = Join-Path ([IO.Path]::GetTempPath()) ("clipper-installer-" + [Guid]::NewGuid().ToString("N") + ".zip")
        Write-Host "Downloading Clipper $($release.Version)..."
        Invoke-WebRequest -Uri $release.Url -OutFile $temporaryZip -TimeoutSec 600
        Copy-Item $temporaryZip $cachePath -Force
        $zipPath = $temporaryZip
    } else {
        Write-Host "Using cached installer data..."
    }

    $temporaryExtractDir = Join-Path ([IO.Path]::GetTempPath()) ("clipper-installer-" + [Guid]::NewGuid().ToString("N"))
    try {
        New-Item -ItemType Directory -Force $temporaryExtractDir | Out-Null
        Write-Host "Preparing the installer..."
        Expand-Archive $zipPath $temporaryExtractDir -Force

        $root = Find-ReleaseRoot $temporaryExtractDir
        if (-not $root) { throw "The release archive is missing install.bat." }

        Write-Host "Verifying the bundle against the release..."
        try {
            Test-Bundle $release.Tag $root
        } catch {
            # A stale cache verifies against a tag that moved on: fetch once
            # more rather than failing the install on yesterday's bytes.
            if (-not $useCache) { throw }
            Write-Host "Cached data failed verification - refetching a fresh copy..."
            Remove-Item $cachePath -Force -ErrorAction SilentlyContinue
            $temporaryZip = Join-Path ([IO.Path]::GetTempPath()) ("clipper-installer-" + [Guid]::NewGuid().ToString("N") + ".zip")
            Invoke-WebRequest -Uri $release.Url -OutFile $temporaryZip -TimeoutSec 600
            Copy-Item $temporaryZip $cachePath -Force
            Remove-Item $temporaryExtractDir -Recurse -Force -ErrorAction SilentlyContinue
            New-Item -ItemType Directory -Force $temporaryExtractDir | Out-Null
            Expand-Archive $temporaryZip $temporaryExtractDir -Force
            $root = Find-ReleaseRoot $temporaryExtractDir
            if (-not $root) { throw "The release archive is missing install.bat." }
            Test-Bundle $release.Tag $root
        }

        Write-Host "Installing Clipper..."
        Invoke-Prebuilt $root

        if ($SteamVR) {
            Write-Host "Installing SteamVR integration..."
            Invoke-Batch (Join-Path $root "VRinstaller.bat") $root
        }

        Write-Host ""
        if ($SteamVR) {
            Write-Host "Clipper and SteamVR integration installed. Restart Discord."
        } else {
            Write-Host "Clipper installed. Restart Discord."
        }
        exit 0
    } finally {
        if (Test-Path $temporaryExtractDir) {
            Remove-Item $temporaryExtractDir -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
} catch {
    Write-Host "Installation failed: $($_.Exception.Message)"
    exit 1
} finally {
    # The downloaded zip is only needed for the copy into the cache; leaving
    # it in %TEMP% would let it pile up. The cache itself persists for future runs.
    if ($temporaryZip -and (Test-Path $temporaryZip)) {
        Remove-Item $temporaryZip -Force -ErrorAction SilentlyContinue
    }
}
