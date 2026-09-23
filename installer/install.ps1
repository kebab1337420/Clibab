# Worker behind the NSIS setup wizard (installer\clipper.nsi): extracts the
# bundle embedded in the setup exe, verifies it against the manifest it ships
# with, and runs its scripts\install-prebuilt.ps1 -PatchClients - plus
# VRinstaller.bat when -SteamVR is given.
#
# Fully offline: the bundle rides inside the setup, so there is no download
# at install time and no version lookup to go stale. Nothing is run until
# every shipped file has matched the published hashes: that is the one check
# that tells a genuine release from something slipped in on the way down.
#
# Exit codes: 0 = done, 1 = nothing was installed (message on stdout).

param(
    # also run the release's VRinstaller.bat after the plugin install
    [switch] $SteamVR
)

$ErrorActionPreference = "Stop"

# NOTE: this script runs under Windows PowerShell 5.1 (the `powershell` the
# wizard calls), not PowerShell 7 - no `??`, `?.` or other v7-only syntax.

# A running log next to the spoken output: under the wizard there is no
# console to scroll back through, so failures leave this file behind.
$InstallLog = Join-Path ([IO.Path]::GetTempPath()) "clipper-install.log"
function Write-InstallLog([string] $message) {
    Add-Content $InstallLog "[$(Get-Date -Format s)] $message" -ErrorAction SilentlyContinue
}
Write-InstallLog "worker started: $PSCommandPath"

function Find-ReleaseRoot([string] $extractDir) {
    # The extracted bundle's root: the folder that holds install.bat. The zip
    # wraps itself in one folder, so that folder is walked for; a zip put
    # flat in the temp directory is accepted too.
    if (Test-Path (Join-Path $extractDir "install.bat")) { return $extractDir }
    foreach ($dir in (Get-ChildItem $extractDir -Directory)) {
        if (Test-Path (Join-Path $dir.FullName "install.bat")) { return $dir.FullName }
    }
    return $null
}

function Test-Bundle([string] $repoRoot) {
    # Checks the extracted bundle against the hashes it ships with, failing
    # rather than running an unmatched one. The manifest lives next to the
    # files it describes, so a tampered bundle fails closed: its hashes would
    # have to be recomputed, and these are cross-checked against the release
    # notes before publishing.
    $manifest = Join-Path $repoRoot "prebuilt\build-info.json"
    if (-not (Test-Path $manifest)) {
        throw "The bundle carries no file list, refusing to install it unchecked."
    }

    try {
        $files = (Get-Content $manifest -Raw | ConvertFrom-Json).files
    } catch {
        throw "The bundle's file list could not be read, so there is nothing to check it against."
    }
    if (-not $files) {
        throw "The bundle's file list is empty, refusing to install it unchecked."
    }

    foreach ($entry in $files.PSObject.Properties) {
        $name = $entry.Name
        if ($name -ne (Split-Path $name -Leaf) -or $name.StartsWith('.')) {
            throw "The bundle lists a file named $name, which is refused."
        }

        $size = $entry.Value.size
        $sha256 = $entry.Value.sha256
        if ($null -eq $size -or $size -lt 0 -or -not $sha256) {
            throw "The bundle lists no size and hash for $name."
        }

        $file = Join-Path $repoRoot "prebuilt\dist\$name"
        if (-not (Test-Path $file)) {
            throw "The bundle names $name and does not carry it."
        }

        $info = Get-Item $file
        if ($info.Length -ne $size) {
            throw "$name is $($info.Length) bytes, the bundle says $size."
        }

        # .NET directly, not Get-FileHash: under a bare launch (the wizard's
        # nsExec, no console) module autoload can resolve the Utility module
        # from PowerShell 7's folder, whose binary cmdlets do not load in 5.1.
        $stream = [IO.File]::OpenRead($file)
        try {
            $hash = [Security.Cryptography.SHA256]::Create().ComputeHash($stream)
        } finally {
            $stream.Close()
        }
        $got = ([BitConverter]::ToString($hash) -replace '-', '').ToLowerInvariant()
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
    if (-not (Test-Path $script)) { throw "The bundle is missing scripts\install-prebuilt.ps1." }

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
    $here = Split-Path $PSCommandPath -Parent
    $zip = Join-Path $here "bundle.zip"
    if (-not (Test-Path $zip)) { throw "The setup is missing its embedded bundle." }
    Write-InstallLog "bundle found: $zip"

    $extractDir = Join-Path ([IO.Path]::GetTempPath()) ("clipper-installer-" + [Guid]::NewGuid().ToString("N"))
    try {
        New-Item -ItemType Directory -Force $extractDir | Out-Null
        Write-Host "Preparing the installer..."
        Expand-Archive $zip $extractDir -Force

        $root = Find-ReleaseRoot $extractDir
        if (-not $root) { throw "The embedded bundle is missing install.bat." }

        Write-Host "Verifying the bundle..."
        Test-Bundle $root
        Write-InstallLog "bundle verified: $root"

        Write-Host "Installing Clipper..."
        Invoke-Prebuilt $root
        Write-InstallLog "prebuilt install done"

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
        Write-InstallLog "worker done"
        exit 0
    } finally {
        if (Test-Path $extractDir) {
            Remove-Item $extractDir -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
} catch {
    Write-Host "Installation failed: $($_.Exception.Message)"
    Write-InstallLog "FAILED: $($_.Exception.Message)"
    exit 1
}
