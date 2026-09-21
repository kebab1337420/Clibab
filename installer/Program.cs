using System.Diagnostics;
using System.IO.Compression;
using System.Net.Http;
using System.Text.Json;

namespace ClipperInstaller;

internal static class Program
{
    private const string UpdateRepo = "kebab1337420/Clibab";

    [STAThread]
    private static void Main()
    {
        ApplicationConfiguration.Initialize();
        Application.Run(new InstallerForm());
        // Exit code is 0 by default (success). InstallAsync sets 1 on failure
        // so automation can tell that the popup was not all right.
    }

    private sealed class InstallerForm : Form
    {
        // Dark palette, so the wizard does not glare against Discord's dark UI.
        private static readonly Color Background = Color.FromArgb(0x20, 0x20, 0x20);
        private static readonly Color Surface = Color.FromArgb(0x28, 0x28, 0x28);
        private static readonly Color TextBright = Color.FromArgb(0xF0, 0xF0, 0xF0);
        private static readonly Color TextSoft = Color.FromArgb(0xB0, 0xB0, 0xB0);
        private static readonly Color Border = Color.FromArgb(0x48, 0x48, 0x48);

        // ------------------------------------------------------------------ pages --
        private readonly Panel[] pages = new Panel[4];

        // Choice page controls, read by InstallAsync.
        private readonly CheckBox steamVr = new()
        {
            AutoSize = true,
            Text = "Install SteamVR integration",
            Checked = false,
            Location = new Point(24, 122)
        };

        private readonly CheckBox cleanReinstall = new()
        {
            AutoSize = true,
            Text = "Clean reinstall (ignore the cache, download fresh)",
            Checked = false,
            Location = new Point(24, 213)
        };

        // Install page label, written as each step starts.
        private readonly Label status = new()
        {
            AutoSize = false,
            Location = new Point(24, 30),
            Size = new Size(430, 48),
            Text = "Ready to install Clipper."
        };

        private readonly ProgressBar progress = new()
        {
            Style = ProgressBarStyle.Blocks,
            Minimum = 0,
            Maximum = 100,
            Value = 0,
            Location = new Point(24, 96),
            Size = new Size(430, 20),
            BackColor = Surface
        };

        private NotifyIcon? tray;

        /// <summary>
        /// Moves the bar and the status line together. Every step of the
        /// install reports through here, so a stuck bar always names the step
        /// it is stuck on.
        /// </summary>
        private void Report(int percent, string? statusText = null)
        {
            progress.Value = Math.Min(100, Math.Max(0, percent));
            if (statusText is not null) status.Text = statusText;
        }

        private readonly Label finishDetails = new();

        private readonly Button back = DarkButton("< Back");
        private readonly Button next = DarkButton("Next >");
        private readonly Button cancel = DarkButton("Cancel");

        private int page;

        public InstallerForm()
        {
            Text = "Clipper installer";
            ClientSize = new Size(478, 332);
            FormBorderStyle = FormBorderStyle.FixedDialog;
            MaximizeBox = false;
            MinimizeBox = false;
            StartPosition = FormStartPosition.CenterScreen;
            BackColor = Background;
            ForeColor = TextBright;

            BuildWelcomePage();
            BuildChoicePage();
            BuildInstallPage();
            BuildFinishPage();

            foreach (var panel in pages) Controls.Add(panel);

            back.Click += (_, _) => ShowPage(page - 1);
            next.Click += async (_, _) =>
            {
                if (page == 1) await InstallAsync();
                else ShowPage(page + 1);
            };
            cancel.Click += (_, _) =>
            {
                if (page == 3) Application.Exit();
                else Close();
            };

            ShowPage(0);

            FormClosed += (_, _) => tray?.Dispose();
        }

        private void BuildWelcomePage()
        {
            var panel = NewPage();
            panel.Controls.Add(NewTitle(24, 22, "Install Vencord + Clipper"));
            panel.Controls.Add(DarkLabel(24, 84, 430, 120,
                "This installs Vencord with the Clipper plugin built in.\r\n\r\n" +
                "The bundle is downloaded from the official GitHub release and verified before anything runs.\r\n\r\n" +
                "You can also add the SteamVR integration: save clips and drop markers from your VR controllers."));
        }

        private void BuildChoicePage()
        {
            var panel = NewPage();
            panel.Controls.Add(NewTitle(24, 22, "Choose what to install"));
            panel.Controls.Add(new CheckBox
            {
                AutoSize = true,
                Text = "Clipper for Discord (required)",
                Checked = true,
                Enabled = false,
                Location = new Point(24, 84),
                ForeColor = TextSoft,
                BackColor = Background
            });
            panel.Controls.Add(DarkLabel(40, 104, 414, 34,
                "Vencord plus the clip plugin, the studio and the muxing."));
            panel.Controls.Add(steamVr);
            steamVr.ForeColor = TextBright;
            steamVr.BackColor = Background;
            panel.Controls.Add(DarkLabel(40, 144, 414, 66,
                "The VR bridge, the default controller bindings and the in-headset notifications.\r\n\r\n" +
                "Needs SteamVR installed and Discord closed while the installer writes the settings."));
            panel.Controls.Add(cleanReinstall);
            cleanReinstall.ForeColor = TextBright;
            cleanReinstall.BackColor = Background;
        }

        private void BuildInstallPage()
        {
            var panel = NewPage();
            panel.Controls.Add(NewTitle(24, 22, "Installation"));
            status.ForeColor = TextSoft;
            status.BackColor = Background;
            panel.Controls.Add(status);
            panel.Controls.Add(progress);
        }

        private void BuildFinishPage()
        {
            var panel = NewPage();
            panel.Controls.Add(NewTitle(24, 22, "Complete"));
            finishDetails.AutoSize = false;
            finishDetails.Location = new Point(24, 84);
            finishDetails.Size = new Size(430, 130);
            finishDetails.ForeColor = TextSoft;
            finishDetails.BackColor = Background;
            panel.Controls.Add(finishDetails);
        }

        private Panel NewPage()
        {
            var panel = new Panel
            {
                Location = new Point(0, 0),
                Size = new Size(478, 232),
                BackColor = Background
            };
            pages[Array.IndexOf(pages, null)] = panel;
            return panel;
        }

        private Label NewTitle(int x, int y, string text) => new()
        {
            AutoSize = false,
            Location = new Point(x, y),
            Size = new Size(430, 54),
            Text = text,
            Font = new Font(Font.FontFamily, 18, FontStyle.Bold),
            ForeColor = TextBright,
            BackColor = Background
        };

        private static Label DarkLabel(int x, int y, int width, int height, string text) => new()
        {
            AutoSize = false,
            Location = new Point(x, y),
            Size = new Size(width, height),
            Text = text,
            ForeColor = TextSoft,
            BackColor = Background
        };

        private static Button DarkButton(string text) => new()
        {
            Text = text,
            Size = new Size(92, 32),
            FlatStyle = FlatStyle.Flat,
            BackColor = Surface,
            ForeColor = TextBright,
            FlatAppearance = { BorderColor = Border, MouseOverBackColor = Color.FromArgb(0x38, 0x38, 0x38) }
        };

        private void ShowPage(int target)
        {
            page = target;
            for (var i = 0; i < pages.Length; i++)
            {
                pages[i].Visible = pages[i] == pages[target];
                if (pages[i] == pages[target]) pages[i].BringToFront();
            }

            back.Visible = target is > 0 and < 3;
            next.Visible = target < 3;
            next.Text = target == 1 ? "Install" : "Next >";
            cancel.Text = target == 3 ? "Close" : "Cancel";

            if (target == 3)
            {
                finishDetails.Text = steamVr.Checked
                    ? "Clipper and the SteamVR integration are installed.\r\n\r\nRestart Discord, then enable \u201cClipper\u201d in Settings > Vencord > Plugins.\r\n\r\n" +
                      "In the headset, double-tap B on the right controller to save a clip, hold A to drop a marker."
                    : "Clipper is installed.\r\n\r\nRestart Discord, then enable \u201cClipper\u201d in Settings > Vencord > Plugins.\r\n\r\n" +
                      "Default keybinds:  Ctrl+Alt+F9 start/stop buffer, Ctrl+Alt+F10 save a clip.";

                NotifyInstalled(steamVr.Checked);
            }

            Controls.Add(back);
            Controls.Add(next);
            Controls.Add(cancel);
            back.Location = new Point(478 - 3 * 92 - 36, 264);
            next.Location = new Point(478 - 2 * 92 - 24, 264);
            cancel.Location = new Point(478 - 92 - 12, 264);
        }

        /// <summary>
        /// Puts the success where it cannot be missed: a system notification
        /// on top of the finish page, since the wizard closes behind it.
        /// </summary>
        private void NotifyInstalled(bool withVr)
        {
            tray ??= new NotifyIcon
            {
                Icon = SystemIcons.Information,
                Visible = true,
                Text = "Clipper installer"
            };

            tray.ShowBalloonTip(
                8000,
                "Clipper installed",
                withVr
                    ? "Clipper and the SteamVR integration are installed. Restart Discord to use them."
                    : "Clipper is installed. Restart Discord, then enable it in Settings > Vencord > Plugins.",
                ToolTipIcon.Info);
        }

        private static HttpClient NewClient() => new() { Timeout = TimeSpan.FromMinutes(10) };

        private async Task InstallAsync()
        {
            SetNavEnabled(false);
            Report(2, "Looking up the newest release...");

            string? zipPath = null;
            string? temporaryZip = null;
            string? temporaryExtractDir = null;
            try
            {
                // The version is read from the release list rather than pinned:
                // a tag that moved on is how a hardcoded one starts installing
                // an archive nobody is looking at any more.
                string tag;
                string version;
                string downloadUrl;
                using (var probe = NewClient())
                {
                    (tag, version, downloadUrl) = await ResolveLatestAsync(probe);
                }

                string cacheDir = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                    "ClipperInstaller");
                Directory.CreateDirectory(cacheDir);
                string cachePath = Path.Combine(cacheDir, $"clipper-v{version}.zip");
                using var client = NewClient();

                bool useCache = false;
                if (cleanReinstall.Checked)
                {
                    // A clean reinstall starts with no history: whatever the
                    // cache holds for this version goes before anything runs.
                    try { if (File.Exists(cachePath)) File.Delete(cachePath); } catch { /* already gone */ }
                }
                else if (File.Exists(cachePath))
                {
                    var fileInfo = new FileInfo(cachePath);
                    if ((DateTime.Now - fileInfo.LastWriteTime).TotalHours < 24)
                    {
                        useCache = true;
                        zipPath = cachePath;
                    }
                }

                // At most twice: a cached zip predating the release fails the
                // check below, in which case it is thrown away and fetched
                // fresh once. A fresh failure is genuine and stops here.
                bool cacheRetried = false;
                string? root = null;

                while (true)
                {
                    if (!useCache)
                    {
                        // Download to a temporary zip file, reporting bytes against
                        // the announced length so the bar moves with the download.
                        temporaryZip = Path.Combine(Path.GetTempPath(), "clipper-installer-" + Guid.NewGuid().ToString("N") + ".zip");
                        Report(5, $"Downloading Clipper {version}...");
                        await DownloadAsync(client, downloadUrl, temporaryZip, version);
                        // Copy to cache for future use
                        File.Copy(temporaryZip, cachePath, true);
                        zipPath = temporaryZip;
                    }
                    else
                    {
                        Report(50, "Using cached installer data...");
                    }

                    // Extract the zip to a temporary directory
                    if (zipPath is null) throw new InvalidOperationException("No release archive was downloaded.");
                    temporaryExtractDir = Path.Combine(Path.GetTempPath(), "clipper-installer-" + Guid.NewGuid().ToString("N") + "-extract");
                    Directory.CreateDirectory(temporaryExtractDir);
                    status.Text = "Preparing the installer...";
                    ExtractChecked(zipPath, temporaryExtractDir, fraction => Report(50 + (int)(fraction * 15)));

                    // The bundle-only asset wraps itself in one folder, the way
                    // GitHub's source archive does, so either layout lands here.
                    root = FindRoot(temporaryExtractDir);
                    if (root is null) throw new InvalidOperationException("The release archive is missing install.bat.");

                    // The bundle's own file list, published with the release, is what
                    // carries the hashes. Nothing is run until every shipped file has
                    // matched it: that is the one check that tells a genuine release
                    // from something slipped in on the way down.
                    Report(65, "Verifying the bundle against the release...");
                    try
                    {
                        await VerifyBundleAsync(client, tag, root, fraction => Report(65 + (int)(fraction * 15)));
                        break;
                    }
                    catch (InvalidOperationException) when (useCache && !cacheRetried)
                    {
                        // The cache is keyed by version, not content: a release
                        // republished under the same tag (draft to final, amended
                        // cut) leaves a stale zip that can never verify.
                        cacheRetried = true;
                        useCache = false;

                        try { File.Delete(cachePath); } catch { /* already gone */ }
                        try
                        {
                            if (temporaryExtractDir is not null && Directory.Exists(temporaryExtractDir))
                                Directory.Delete(temporaryExtractDir, recursive: true);
                            if (temporaryZip is not null && File.Exists(temporaryZip))
                                File.Delete(temporaryZip);
                        }
                        catch { /* best effort; the finally sweeps the rest */ }

                        temporaryExtractDir = null;
                        Report(5, "Cached data is stale, downloading fresh...");
                    }
                }

                Report(82, "Installing Clipper...");
                await RunPowerShellAsync(
                    Path.Combine(root, "scripts", "install-prebuilt.ps1"),
                    "-PatchClients",
                    root);
                Report(92, "Clipper installed.");

                if (steamVr.Checked)
                {
                    Report(94, "Installing SteamVR integration...");
                    await RunBatchAsync(Path.Combine(root, "VRinstaller.bat"), root);
                    Report(98, "SteamVR integration installed.");
                }

                Report(100, "Done.");
                ShowPage(3);
            }
            catch (Exception error)
            {
                Report(0, "Installation failed.");
                // A GUI app has no console to read an exit code from; this is the
                // one channel automation has.
                Environment.ExitCode = 1;
                MessageBox.Show(this, error.Message, "Clipper installation failed", MessageBoxButtons.OK, MessageBoxIcon.Error);
                ShowPage(1);
            }
            finally
            {
                SetNavEnabled(true);
                // Clean up temporary extraction directory
                if (temporaryExtractDir is not null && Directory.Exists(temporaryExtractDir))
                {
                    try { Directory.Delete(temporaryExtractDir, recursive: true); }
                    catch { /* Ignore errors on cleanup */ }
                }
                // The downloaded zip is only needed for the copy into the cache;
                // leaving it in %TEMP% would let it pile up.
                if (temporaryZip is not null)
                {
                    try { File.Delete(temporaryZip); }
                    catch { /* Ignore errors on cleanup */ }
                }
                // Note: we do not delete the cached zip file here; it persists for future runs.
            }
        }

        private void SetNavEnabled(bool enabled)
        {
            back.Enabled = enabled;
            next.Enabled = enabled;
            cancel.Enabled = enabled;
        }

        private static string ArchiveUrl(string tag) =>
            $"https://github.com/{UpdateRepo}/archive/refs/tags/{tag}.zip";

        /// <summary>
        /// The newest release's tag, its version without the leading v, and the
        /// URL to download it from. GitHub's release list answers a JSON object;
        /// the tag is read out of it. A release that published the bundle-only
        /// asset (clipper-bundle) is downloaded from there, so nobody fetching
        /// the installer pulls the plugin sources; releases without the asset
        /// fall back to GitHub's source archive, which is all they carry.
        /// </summary>
        private static async Task<(string Tag, string Version, string DownloadUrl)> ResolveLatestAsync(HttpClient client)
        {
            client.DefaultRequestHeaders.UserAgent.ParseAdd("ClipperInstaller/1.0 (+https://github.com/" + UpdateRepo + ")");

            using var response = await client.GetAsync($"https://api.github.com/repos/{UpdateRepo}/releases/latest");
            if (!response.IsSuccessStatusCode)
                throw new InvalidOperationException($"GitHub rejected the release lookup ({response.StatusCode}). Try again shortly.");

            await using var stream = await response.Content.ReadAsStreamAsync();
            using var doc = await JsonDocument.ParseAsync(stream);
            var root = doc.RootElement;

            string tag = root.TryGetProperty("tag_name", out var element)
                ? element.GetString() ?? ""
                : "";
            if (tag.Length == 0) throw new InvalidOperationException("GitHub answered a release with no tag.");

            string version = tag.StartsWith("v", StringComparison.OrdinalIgnoreCase) ? tag[1..] : tag;

            // The bundle-only asset, looked up by name because that is the
            // contract: package-bundle.ps1 ships it as clipper-bundle-vX.zip.
            // The URL still has to live on a host releases come from: the JSON
            // above is data, and data does not get to pick download servers.
            string bundleDownloadUrl = "";
            if (root.TryGetProperty("assets", out var assets) && assets.ValueKind == JsonValueKind.Array)
            {
                foreach (var asset in assets.EnumerateArray())
                {
                    if (asset.TryGetProperty("name", out var name) &&
                        asset.TryGetProperty("browser_download_url", out var url) &&
                        string.Equals(name.GetString(), $"clipper-bundle-v{version}.zip", StringComparison.OrdinalIgnoreCase))
                    {
                        bundleDownloadUrl = url.GetString() ?? "";
                        break;
                    }
                }
            }

            if (bundleDownloadUrl.Length > 0 && !IsReleaseHost(bundleDownloadUrl))
                throw new InvalidOperationException("The release points its bundle somewhere releases never come from.");

            return (tag, version, bundleDownloadUrl.Length > 0 ? bundleDownloadUrl : ArchiveUrl(tag));
        }

        private static bool IsReleaseHost(string url)
        {
            if (!Uri.TryCreate(url, UriKind.Absolute, out var uri) || uri.Scheme != Uri.UriSchemeHttps)
                return false;

            string host = uri.Host.ToLowerInvariant();

            return host == "github.com"
                || host == "codeload.github.com"
                || host == "objects.githubusercontent.com"
                || host.EndsWith(".githubusercontent.com");
        }

        /// <summary>
        /// Downloads with the bar moving on the announced length, in megabytes
        /// when the server names none.
        /// </summary>
        private async Task DownloadAsync(HttpClient client, string downloadUrl, string temporaryZip, string version)
        {
            using var download = await client.SendAsync(
                new HttpRequestMessage(HttpMethod.Get, downloadUrl),
                HttpCompletionOption.ResponseHeadersRead);
            download.EnsureSuccessStatusCode();

            long? total = download.Content.Headers.ContentLength;

            await using var input = await download.Content.ReadAsStreamAsync();
            await using var output = File.Create(temporaryZip);

            var buffer = new byte[81920];
            long received = 0;
            int read;

            while ((read = await input.ReadAsync(buffer)) > 0)
            {
                await output.WriteAsync(buffer.AsMemory(0, read));
                received += read;

                if (total > 0)
                    Report(5 + (int)(received * 45 / total.Value), $"Downloading Clipper {version}... {received * 100 / total.Value}%");
                else
                    Report(5, $"Downloading Clipper {version}... {received / 1048576}MB");
            }
        }

        /// <summary>
        /// Extracts with the traversal and size checks ExtractToDirectory
        /// does not do: no absolute paths, no parent escapes, and a cap on
        /// the unpacked total so a zip bomb dies before it lands.
        /// </summary>
        private static void ExtractChecked(string zipPath, string extractDir, Action<double>? progress = null)
        {
            const long MaxUnpackedBytes = 2L * 1024 * 1024 * 1024;

            using var archive = ZipFile.OpenRead(zipPath);
            long total = 0;

            foreach (var entry in archive.Entries)
            {
                if (Path.IsPathRooted(entry.FullName)
                    || entry.FullName.Split('/', '\\').Contains(".."))
                    throw new InvalidOperationException($"The release archive carries a path it must not: {entry.FullName}.");

                total += entry.Length;
                if (total > MaxUnpackedBytes)
                    throw new InvalidOperationException("The release archive unpacks to more than it ever should.");
            }

            // Directories have no bytes and nothing to write.
            var files = archive.Entries.Where(entry => entry.Name.Length > 0).ToList();
            int done = 0;
            int count = Math.Max(1, files.Count);
            foreach (var entry in files)
            {
                string destination = Path.Combine(extractDir, entry.FullName);
                Directory.CreateDirectory(Path.GetDirectoryName(destination)!);
                entry.ExtractToFile(destination, overwrite: true);
                progress?.Invoke((double)++done / count);
            }
        }

        /// <summary>
        /// The extracted release's root: the folder that holds install.bat.
        /// A source archive and the bundle asset both wrap themselves in one
        /// folder, so that folder is walked for; a zip put flat in the temp
        /// directory is accepted too.
        /// </summary>
        private static string? FindRoot(string extractDir)
        {
            if (File.Exists(Path.Combine(extractDir, "install.bat"))) return extractDir;
            return Directory.GetDirectories(extractDir)
                .FirstOrDefault(path => File.Exists(Path.Combine(path, "install.bat")));
        }

        /// <summary>
        /// Checks the extracted repo's shipped bundle against the hashes the
        /// release published for it, failing rather than running an unmatched one.
        ///
        /// Newer releases also list the scripts the install runs
        /// (`install.bat`, `VRinstaller.bat`) under a `root` section, and those
        /// are checked the same way: verifying the bundle while running unchecked
        /// scripts would check the wrong half. Releases predating that section
        /// keep the old behavior.
        /// </summary>
        private static async Task VerifyBundleAsync(HttpClient client, string tag, string repoRoot, Action<double>? progress = null)
        {
            using var response = await client.GetAsync($"https://raw.githubusercontent.com/{UpdateRepo}/{tag}/prebuilt/build-info.json");
            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                throw new InvalidOperationException($"The release carries no file list, refusing to install it unchecked.");
            if (!response.IsSuccessStatusCode)
                throw new InvalidOperationException($"The release's file list answered {response.StatusCode}, so there is nothing to check the bundle against.");

            JsonElement files;
            JsonElement root = default;
            bool hasRoot = false;
            try
            {
                await using var stream = await response.Content.ReadAsStreamAsync();
                using var doc = await JsonDocument.ParseAsync(stream);
                // Cloned: the element below outlives the document, and reading
                // an uncloned one after its Dispose throws ObjectDisposed.
                files = doc.RootElement.GetProperty("files").Clone();
                if (doc.RootElement.TryGetProperty("root", out var rootElement)
                    && rootElement.ValueKind == JsonValueKind.Object)
                {
                    root = rootElement.Clone();
                    hasRoot = true;
                }
            }
            catch (Exception ex) when (ex is InvalidOperationException or JsonException)
            {
                throw new InvalidOperationException("The release's file list could not be read, so there is nothing to check the bundle against.");
            }

            var listed = files.EnumerateObject().ToList();
            int done = 0;
            foreach (var entry in listed)
            {
                VerifyFile(Path.Combine(Path.Combine(Path.Combine(repoRoot, "prebuilt"), "dist"), entry.Name), entry.Value);
                progress?.Invoke((double)++done / Math.Max(1, listed.Count));
            }

            // Only what the install actually runs, by exact name: anything else
            // at the root is data, not code, and is not executed either way.
            // Same for the PowerShell the bats hand off to.
            if (hasRoot)
            {
                foreach (var name in new[] { "install.bat", "VRinstaller.bat" })
                {
                    if (root.TryGetProperty(name, out var published))
                        VerifyFile(Path.Combine(repoRoot, name), published);
                }

                foreach (var name in new[] { "install-prebuilt.ps1", "uninstall.ps1", "install-vesktop.ps1" })
                {
                    if (root.TryGetProperty($"scripts/{name}", out var published))
                        VerifyFile(Path.Combine(Path.Combine(repoRoot, "scripts"), name), published);
                }
            }
        }

        private static void VerifyFile(string file, JsonElement listed)
        {
            string name = Path.GetFileName(file);
            if (name != Path.GetFileName(name) || name.StartsWith('.'))
                throw new InvalidOperationException($"The release lists a file named {name}, which is refused.");

            long size = listed.TryGetProperty("size", out var sizeElement) ? sizeElement.GetInt64() : -1;
            string sha256 = listed.TryGetProperty("sha256", out var hashElement) ? hashElement.GetString() ?? "" : "";
            if (size < 0 || sha256.Length == 0)
                throw new InvalidOperationException($"The release lists no size and hash for {name}.");

            if (!File.Exists(file))
                throw new InvalidOperationException($"The release names {name} and the archive does not carry it.");

            var info = new FileInfo(file);
            if (info.Length != size)
                throw new InvalidOperationException($"{name} is {info.Length} bytes, the release says {size}.");

            using var fileStream = File.OpenRead(file);
            using var hasher = System.Security.Cryptography.SHA256.Create();
            string got = Convert.ToHexString(hasher.ComputeHash(fileStream)).ToLowerInvariant();
            if (got != sha256.ToLowerInvariant())
                throw new InvalidOperationException($"{name} does not match its published hash.");
        }

        private static async Task RunPowerShellAsync(string file, string arguments, string workingDirectory)
        {
            using var process = Process.Start(new ProcessStartInfo
            {
                FileName = "powershell.exe",
                Arguments = $"-NoProfile -ExecutionPolicy Bypass -File \"{file}\" {arguments}",
                WorkingDirectory = workingDirectory,
                UseShellExecute = false,
                CreateNoWindow = true,
                RedirectStandardOutput = true,
                RedirectStandardError = true
            }) ?? throw new InvalidOperationException("Could not start the installer.");

            // Same concurrent drain as the batch runner below: a one-sided read
            // against a chatty script blocks on a full pipe buffer instead.
            var outputTask = process.StandardOutput.ReadToEndAsync();
            var errorTask = process.StandardError.ReadToEndAsync();
            var output = await outputTask;
            var error = await errorTask;
            await process.WaitForExitAsync();
            if (process.ExitCode != 0)
                throw new InvalidOperationException(string.IsNullOrWhiteSpace(error) ? output : error);
        }

        private static async Task RunBatchAsync(string file, string workingDirectory)
        {
            using var process = Process.Start(new ProcessStartInfo
            {
                FileName = "cmd.exe",
                Arguments = $"/d /c \"\"{file}\"\"",
                WorkingDirectory = workingDirectory,
                UseShellExecute = false,
                CreateNoWindow = true,
                RedirectStandardOutput = true,
                RedirectStandardError = true
            }) ?? throw new InvalidOperationException("Could not start the installer.");

            // Read both pipes concurrently: draining stdout first to EOF while a
            // batch writes more than a pipe buffer full to stderr would block the
            // batch, and the wait below would never finish.
            var outputTask = process.StandardOutput.ReadToEndAsync();
            var errorTask = process.StandardError.ReadToEndAsync();
            var output = await outputTask;
            var error = await errorTask;
            await process.WaitForExitAsync();
            if (process.ExitCode != 0)
                throw new InvalidOperationException(string.IsNullOrWhiteSpace(error) ? output : error);
        }
    }
}