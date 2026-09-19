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

        // Install page label, written as each step starts.
        private readonly Label status = new()
        {
            AutoSize = false,
            Location = new Point(24, 30),
            Size = new Size(430, 48),
            Text = "Ready to install Clipper."
        };

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
            panel.Controls.Add(DarkLabel(40, 144, 414, 70,
                "The VR bridge, the default controller bindings and the in-headset notifications.\r\n\r\n" +
                "Needs SteamVR installed and Discord closed while the installer writes the settings."));
        }

        private void BuildInstallPage()
        {
            var panel = NewPage();
            panel.Controls.Add(NewTitle(24, 22, "Installation"));
            status.ForeColor = TextSoft;
            status.BackColor = Background;
            panel.Controls.Add(status);
            panel.Controls.Add(new ProgressBar
            {
                Style = ProgressBarStyle.Marquee,
                MarqueeAnimationSpeed = 20,
                Location = new Point(24, 96),
                Size = new Size(430, 20),
                BackColor = Surface
            });
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
                      "Default keybinds:  Alt+F9 start/stop buffer, Alt+F10 save a clip.";
            }

            Controls.Add(back);
            Controls.Add(next);
            Controls.Add(cancel);
            back.Location = new Point(478 - 3 * 92 - 36, 264);
            next.Location = new Point(478 - 2 * 92 - 24, 264);
            cancel.Location = new Point(478 - 92 - 12, 264);
        }

        private static HttpClient NewClient() => new() { Timeout = TimeSpan.FromMinutes(10) };

        private async Task InstallAsync()
        {
            SetNavEnabled(false);
            status.Text = "Looking up the newest release...";

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
                if (File.Exists(cachePath))
                {
                    var fileInfo = new FileInfo(cachePath);
                    if ((DateTime.Now - fileInfo.LastWriteTime).TotalHours < 24)
                    {
                        useCache = true;
                        zipPath = cachePath;
                    }
                }

                if (!useCache)
                {
                    // Download to a temporary zip file
                    temporaryZip = Path.Combine(Path.GetTempPath(), "clipper-installer-" + Guid.NewGuid().ToString("N") + ".zip");
                    status.Text = $"Downloading Clipper {version}...";
                    await using (var input = await client.GetStreamAsync(downloadUrl))
                    await using (var output = File.Create(temporaryZip))
                        await input.CopyToAsync(output);
                    // Copy to cache for future use
                    File.Copy(temporaryZip, cachePath, true);
                    zipPath = temporaryZip;
                }
                else
                {
                    status.Text = "Using cached installer data...";
                }

                // Extract the zip to a temporary directory
                if (zipPath is null) throw new InvalidOperationException("No release archive was downloaded.");
                temporaryExtractDir = Path.Combine(Path.GetTempPath(), "clipper-installer-" + Guid.NewGuid().ToString("N"));
                Directory.CreateDirectory(temporaryExtractDir);
                status.Text = "Preparing the installer...";
                ZipFile.ExtractToDirectory(zipPath, temporaryExtractDir);

                // The bundle-only asset wraps itself in one folder, the way
                // GitHub's source archive does, so either layout lands here.
                var root = FindRoot(temporaryExtractDir);
                if (root is null) throw new InvalidOperationException("The release archive is missing install.bat.");

                // The bundle's own file list, published with the release, is what
                // carries the hashes. Nothing is run until every shipped file has
                // matched it: that is the one check that tells a genuine release
                // from something slipped in on the way down.
                status.Text = "Verifying the bundle against the release...";
                await VerifyBundleAsync(client, tag, root);

                await RunBatchAsync(Path.Combine(root, "install.bat"), root);

                if (steamVr.Checked)
                {
                    status.Text = "Installing SteamVR integration...";
                    await RunBatchAsync(Path.Combine(root, "VRinstaller.bat"), root);
                }

                status.Text = steamVr.Checked
                    ? "Clipper and SteamVR integration installed. Restart Discord."
                    : "Clipper installed. Restart Discord.";
                ShowPage(3);
            }
            catch (Exception error)
            {
                status.Text = "Installation failed.";
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

            return (tag, version, bundleDownloadUrl.Length > 0 ? bundleDownloadUrl : ArchiveUrl(tag));
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
        /// </summary>
        private static async Task VerifyBundleAsync(HttpClient client, string tag, string repoRoot)
        {
            using var response = await client.GetAsync($"https://raw.githubusercontent.com/{UpdateRepo}/{tag}/prebuilt/build-info.json");
            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                throw new InvalidOperationException($"The release carries no file list, refusing to install it unchecked.");
            if (!response.IsSuccessStatusCode)
                throw new InvalidOperationException($"The release's file list answered {response.StatusCode}, so there is nothing to check the bundle against.");

            JsonElement files;
            try
            {
                await using var stream = await response.Content.ReadAsStreamAsync();
                using var doc = await JsonDocument.ParseAsync(stream);
                // Cloned: the element below outlives the document, and reading
                // an uncloned one after its Dispose throws ObjectDisposed.
                files = doc.RootElement.GetProperty("files").Clone();
            }
            catch (Exception ex) when (ex is InvalidOperationException or JsonException)
            {
                throw new InvalidOperationException("The release's file list could not be read, so there is nothing to check the bundle against.");
            }

            foreach (var entry in files.EnumerateObject())
            {
                string name = entry.Name;
                if (name != Path.GetFileName(name) || name.StartsWith('.'))
                    throw new InvalidOperationException($"The release lists a file named {name}, which is refused.");

                long size = entry.Value.TryGetProperty("size", out var sizeElement) ? sizeElement.GetInt64() : -1;
                string sha256 = entry.Value.TryGetProperty("sha256", out var hashElement) ? hashElement.GetString() ?? "" : "";
                if (size < 0 || sha256.Length == 0)
                    throw new InvalidOperationException($"The release lists no size and hash for {name}.");

                string file = Path.Combine(Path.Combine(Path.Combine(repoRoot, "prebuilt"), "dist"), name);
                if (!File.Exists(file))
                    throw new InvalidOperationException($"The release names {name} and the archive does not carry it.");

                var info = new FileInfo(file);
                if (info.Length != size)
                    throw new InvalidOperationException($"{name} is {info.Length} bytes, the release says {size}.");

                await using var fileStream = File.OpenRead(file);
                using var hasher = System.Security.Cryptography.SHA256.Create();
                string got = Convert.ToHexString(await hasher.ComputeHashAsync(fileStream)).ToLowerInvariant();
                if (got != sha256.ToLowerInvariant())
                    throw new InvalidOperationException($"{name} does not match its published hash.");
            }
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