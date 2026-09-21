# Cutting a Clipper release

Prerequisites: a Vencord checkout beside the repo (or `-VencordDir`), pnpm,
cargo and the .NET 8 SDK for the native voice exe and the installer, node on
`PATH` for `test.ps1`. The Vencord checkout must be clean, or set
`CLIPPER_SKIP_DIRTY_CHECK=1` to build anyway.

1. Merge everything the release should carry, then bump `CLIPPER_VERSION` in
   `src/userplugins/Clipper/updater.ts`.
2. Rebuild the bundle: `.\scripts\build-prebuilt.ps1 -VencordDir <path>`.
   This refreshes `prebuilt/dist` and `prebuilt/build-info.json` (hashes are
   taken over LF-normalized text so checkouts and raw downloads agree).
3. Verify the bundle contains the version (`Select-String 6.x.y`) and run
   `.\scripts\test.ps1` (must be fully green).
4. Commit as `chore: cut 6.x.y`, tag `v6.x.y`, push both.
5. Build the installer: `.\scripts\build-installer.ps1` (needs the .NET 8 SDK).
6. Create the release **as a draft**, upload both assets:
   - `release/installer/ClipperInstaller.exe`
   - the bundle asset below (without it, the exe installer falls back to the
     full source archive).
7. Test from the draft, then publish.

## Bundle asset

The exe installer prefers `clipper-bundle-v<version>.zip` over the source
archive. Build it from the **tag itself** so the bytes match what the
installer verifies:

```powershell
git worktree add $env:TEMP\clibab-tag v6.x.y
pwsh -NoProfile -File $env:TEMP\clibab-tag\scripts\package-bundle.ps1
gh release upload v6.x.y $env:TEMP\clibab-tag\release\bundle\clipper-bundle-v6.x.y.zip
git worktree remove --force $env:TEMP\clibab-tag
```

Version, tag and asset name must agree: the installer looks up
`clipper-bundle-v<version>.zip` where `<version>` is the tag without `v`.
A republished tag needs a fresh asset — the installer cache is keyed by
version and refetches on verify failure, but do not rely on it.
