; Clipper setup wizard (Nullsoft Install System).
;
; Replaces the old C# WinForms installer: same job - download the newest
; release, verify it against the published hashes, run its install.bat, and
; optionally its VRinstaller.bat - with the stock NSIS look instead of a
; 160 MB self-contained .NET bundle. NSIS ships no HTTPS downloader and no
; SHA256 hasher, so the network and the bytes live in install.ps1 (run from
; $PLUGINSDIR); this script owns the pages, the checkbox and the uninstaller.
;
; Build with:  scripts\build-installer.ps1   (calls makensis /DVERSION=x.y.z)
; Directly with:  makensis /DVERSION=5.5.1 installer\clipper.nsi
;
; Per-user install throughout (no admin): the bundle lands in
; %APPDATA%\Vencord\clipper like the batch installer does, and only the
; uninstaller plus two helper scripts live in $INSTDIR.

!ifndef VERSION
  !define VERSION "0"
!endif

!include "MUI2.nsh"
!include "Sections.nsh"
!include "LogicLib.nsh"

; Global: tracks the SteamVR checkbox (see .onSelChange). Declared up here
; because the compiler reads the file top to bottom - a use inside the
; sections below would not know a Var declared after them.
Var SteamVRChoice

Name "Clipper ${VERSION}"
OutFile "..\release\installer\ClipperSetup.exe"
Unicode True
RequestExecutionLevel user
InstallDir "$LOCALAPPDATA\Clipper"
ShowInstDetails show

VIProductVersion "${VERSION}.0"
VIAddVersionKey "ProductName" "Clipper"
VIAddVersionKey "FileDescription" "Clipper setup (Vencord plugin)"
VIAddVersionKey "FileVersion" "${VERSION}"
VIAddVersionKey "LegalCopyright" "Clipper contributors"

!define MUI_ABORTWARNING
!define MUI_COMPONENTSPAGE_TEXT_TOP "Choose what to install. Clipper itself is required; the SteamVR side is opt-in, for headsets only."
!define MUI_FINISHPAGE_TEXT "Done. Restart Discord, then enable $\"Clipper$\" in Settings > Vencord > Plugins.$\r$\n$\r$\nDefault keybinds: Alt+F9 start/stop buffer, Alt+F10 save a clip."

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_LANGUAGE "English"

Section "Clipper for Discord (required)" SecClipper
  SectionIn RO

  DetailPrint "Looking up the newest release..."

  ; The worker plus the two scripts the uninstaller needs later. The worker
  ; runs from the plugins dir so nothing of it survives the install.
  SetOutPath "$PLUGINSDIR"
  File "install.ps1"
  SetOutPath "$INSTDIR"
  File "..\scripts\uninstall.ps1"
  File "..\VRinstaller.bat"

  ; The SteamVR checkbox is this section's only input: the worker does the
  ; download, the verify and install.bat either way, VRinstaller.bat on top
  ; when the box was ticked. The choice is tracked in $SteamVRChoice (see
  ; .onSelChange below) because a section declared later in the file cannot
  ; be named from inside this one.
  ${If} $SteamVRChoice <> 0
    StrCpy $1 '-File "$PLUGINSDIR\install.ps1" -SteamVR'
  ${Else}
    StrCpy $1 '-File "$PLUGINSDIR\install.ps1"'
  ${EndIf}

  nsExec::ExecToStack 'powershell -NoProfile -ExecutionPolicy Bypass $1'
  Pop $2 ; return value: "error" when PowerShell never started, else its exit code
  Pop $3 ; the worker's stdout, shown so a failure says why
  DetailPrint $3
  ${If} $2 != "0"
    MessageBox MB_ICONSTOP "Clipper installation failed. The details above say why - nothing was installed."
    Abort
  ${EndIf}

  ; Remember the SteamVR choice for the uninstaller (VR settings need the
  ; VRinstaller --uninstall pass, a plain install must not run it).
  ${If} $SteamVRChoice <> 0
    WriteRegDWORD HKCU "Software\Clipper" "SteamVR" 1
  ${Else}
    WriteRegDWORD HKCU "Software\Clipper" "SteamVR" 0
  ${EndIf}

  WriteUninstaller "$INSTDIR\Uninstall.exe"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Clipper" "DisplayName" "Clipper (Vencord plugin)"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Clipper" "DisplayVersion" "${VERSION}"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Clipper" "Publisher" "Clipper contributors"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Clipper" "UninstallString" '"$INSTDIR\Uninstall.exe"'
SectionEnd

Section "SteamVR integration" SecSteamVR
  ; Marker section only: the checkbox above is tracked by .onSelChange into
  ; $SteamVRChoice, which the Clipper section reads. Kept as a real section
  ; (not a dialog checkbox) so silent installs get the standard behavior.
SectionEnd

; Tracks the SteamVR checkbox. A section's index define only exists after
; its declaration is parsed, so the checkbox cannot be read from inside the
; Clipper section above - both live here, after every section.
Function .onInit
  StrCpy $SteamVRChoice 0
FunctionEnd

Function .onSelChange
  SectionGetFlags ${SecSteamVR} $0
  IntOp $0 $0 & ${SF_SELECTED}
  ${If} $0 <> 0
    StrCpy $SteamVRChoice 1
  ${Else}
    StrCpy $SteamVRChoice 0
  ${EndIf}
FunctionEnd

Section "Uninstall"
  ; VR side first, best effort: VRinstaller refuses under a running client
  ; without --force, and a half-undone settings write is worse than none -
  ; but the plugin uninstall below must still run, so a failure here warns
  ; instead of aborting.
  ReadRegDWORD $0 HKCU "Software\Clipper" "SteamVR"
  ${If} $0 == 1
    DetailPrint "Removing the SteamVR integration..."
    nsExec::ExecToStack 'cmd.exe /d /c ""$INSTDIR\VRinstaller.bat" --uninstall --force < NUL"'
    Pop $1
    Pop $2
    DetailPrint $2
    ${If} $1 != "0"
      DetailPrint "VR cleanup reported a problem; continuing with the plugin uninstall."
    ${EndIf}
  ${EndIf}

  DetailPrint "Unpatching Discord and removing the bundle..."
  nsExec::ExecToStack 'powershell -NoProfile -ExecutionPolicy Bypass -File "$INSTDIR\uninstall.ps1"'
  Pop $1
  Pop $2
  DetailPrint $2

  Delete "$INSTDIR\uninstall.ps1"
  Delete "$INSTDIR\VRinstaller.bat"
  Delete "$INSTDIR\Uninstall.exe"
  RMDir "$INSTDIR"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Clipper"
  DeleteRegKey HKCU "Software\Clipper"
SectionEnd
