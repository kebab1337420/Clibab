# Undoes what install-prebuilt.ps1 did: unpatches Discord and unsets Vesktop's
# Vencord Location. The bundle in %APPDATA%\Vencord\clipper is removed too.
#
# Vencord settings (%APPDATA%\Vencord\settings) are left alone.

param(
    [string] $InstallDir = (Join-Path $env:APPDATA "Vencord\clipper"),
    [switch] $KeepBundle
)

$ErrorActionPreference = "Stop"

$restored = 0

# ---- Discord -----------------------------------------------------------------
$roots = @(
    "$env:LOCALAPPDATA\Discord",
    "$env:LOCALAPPDATA\DiscordPTB",
    "$env:LOCALAPPDATA\DiscordCanary",
    "$env:LOCALAPPDATA\DiscordDevelopment"
) | Where-Object { Test-Path $_ }

foreach ($root in $roots) {
    $name = Split-Path $root -Leaf

    if (Get-Process | Where-Object { $_.Path -like "$root\*" }) {
        Write-Host "      [!] $name is running - close it and run this again."
        continue
    }

    foreach ($appDir in (Get-ChildItem $root -Directory -Filter "app-*")) {
        $resources = Join-Path $appDir.FullName "resources"
        $asar = Join-Path $resources "app.asar"
        $original = Join-Path $resources "_app.asar"

        if (-not (Test-Path $original)) {
            # Leftover of an interrupted run: the original is intact under .bak.
            if (Test-Path "$asar.bak") {
                Move-Item "$asar.bak" $original -Force
            } else { continue }
        }

        # Only remove app.asar when it is the patch stub, never a real bundle.
        if (Test-Path $asar) {
            if ((Get-Item $asar).Length -ge 4096) {
                Write-Host "      $name looks unpatched already, leaving it alone."
                continue
            }
            Remove-Item $asar -Force
        }

        # Through a backup, never a gap: a crash between removing the stub
        # and restoring the original would leave no app.asar at all, and
        # Discord would not start.
        try {
            Move-Item $original "$asar.bak" -Force
            Move-Item "$asar.bak" $asar -Force
            Write-Host "      $name unpatched."
            $restored++
        } catch {
            if ((Test-Path "$asar.bak") -and -not (Test-Path $asar)) {
                Move-Item "$asar.bak" $asar -Force
            }
            Write-Host "      [!] $name could not be unpatched - $($_.Exception.Message)"
        }
    }
}

# ---- Vesktop -----------------------------------------------------------------
$dist = Join-Path $InstallDir "dist"

$dataDirs = @("vesktop", "Vesktop", "equibop", "Equibop") |
    ForEach-Object { Join-Path $env:APPDATA $_ } |
    Where-Object { Test-Path $_ } |
    Sort-Object -Unique

if ($dataDirs -and (Get-Process -Name "Vesktop", "Equibop" -ErrorAction SilentlyContinue)) {
    Write-Host "      [!] Vesktop is running - close it and run this again."
} else {
    foreach ($dir in $dataDirs) {
        $stateFile = Join-Path $dir "state.json"
        if (-not (Test-Path $stateFile)) { continue }

        try {
            $state = Get-Content $stateFile -Raw | ConvertFrom-Json
        } catch { continue }

        if ($state.vencordDir -ne $dist) { continue }

        $state.PSObject.Properties.Remove("vencordDir")

        # Through a temp file: a crash between truncate and write would leave
        # Vesktop with no state file at all.
        $temp = "$stateFile.tmp-$PID"
        $state | ConvertTo-Json -Depth 20 | Set-Content $temp -Encoding UTF8
        Move-Item $temp $stateFile -Force
        Write-Host "      Vencord Location cleared ($dir) - Vesktop falls back to its own Vencord."
        $restored++
    }
}

# ---- bundle ------------------------------------------------------------------
if (-not $KeepBundle -and (Test-Path $InstallDir)) {
    Remove-Item $InstallDir -Recurse -Force
    Write-Host "      Removed $InstallDir"
}

# ---- SteamVR side ----------------------------------------------------------
# Lives outside everything above (its own folders, its own settings keys), so
# the VR installer is the one that knows how to take it back out. Never fatal:
# most installs never had it.
$vrInstaller = Join-Path (Split-Path $PSScriptRoot -Parent) "VRinstaller.bat"
if (Test-Path $vrInstaller) {
    & cmd /d /c "`"$vrInstaller`" --uninstall" 2>&1 | ForEach-Object { Write-Host "      $_" }
} else {
    Write-Host "      No VR installer found; if the VR side was ever installed, run VRinstaller.bat --uninstall."
}

if ($restored -eq 0) {
    Write-Host "      Nothing to undo."
}

exit 0
