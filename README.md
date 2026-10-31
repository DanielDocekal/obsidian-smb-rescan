# SMB Rescan

🇨🇿 [Česká verze](README.cs.md)

An [Obsidian](https://obsidian.md) plugin for vaults stored on a **network drive (SMB/NAS)**.

## The problem

When a vault lives on an SMB share, macOS/Windows usually don't deliver file-change notifications to Obsidian. Files added, renamed, deleted or edited by another device (or another app) don't show up until you restart Obsidian.

## What this plugin does

It periodically compares the file list on disk with what Obsidian knows, and tells Obsidian about the differences:

- scans when you **switch back to the Obsidian window**,
- scans in the background **every 60 seconds**,
- scans **on demand** via the ribbon icon (🔄) or the command palette: *Přeskenovat vault teď* (Rescan vault now),
- picks up **new** files/folders, **deleted** files/folders, and reloads **open notes** that changed on disk,
- ignores hidden files and folders (names starting with `.`).

## Installation

### Manual (from a release)
1. Download `smb-rescan-1.0.0.zip` from the [latest release](https://github.com/DanielDocekal/obsidian-smb-rescan/releases/latest).
2. Unzip it into `<your vault>/.obsidian/plugins/` so you end up with `<your vault>/.obsidian/plugins/smb-rescan/main.js` and `manifest.json`.
   (Alternatively download just `main.js` and `manifest.json` and put them into that folder yourself.)
3. In Obsidian: **Settings → Community plugins** → turn off Restricted mode if needed → reload the list → enable **SMB Rescan**.

### Installing to a vault on the network drive
Install it into the vault you want to fix. Plugins are stored per vault (`.obsidian/plugins/`), so it must be in the vault that lives on the SMB share.

## Usage
There are no settings. Enable the plugin and it works. A notice is shown only for manual rescans ("N changes loaded" / "up to date").

## Limitations
- **Desktop only** (`isDesktopOnly`), requires Obsidian 1.4.0+.
- It relies on Obsidian's **internal** adapter functions (`reconcileFile`, `reconcileFolderCreation`, `reconcileDeletion`). These are not part of the public API and may change. If they are missing, the plugin shows a one-time notice and does nothing.
- The scan interval (60 s) is a constant in `main.js`; there is no settings UI.
- Notices and command names are currently in Czech.
- Scanning a very large vault over SMB every minute may be slow; edit `INTERVAL_MS` in `main.js` if needed.

## Troubleshooting
- Nothing happens: open the developer console (`Cmd+Opt+I` / `Ctrl+Shift+I`) and look for `SMB Rescan` errors.
- "this version of Obsidian lacks the required internal functions": update Obsidian, or open an issue with your version.

## About this project
This plugin was written with the help of **[Claude](https://claude.com/claude-code)** (Anthropic's AI). The author did not program it by hand, so review the code (it's a single ~130-line file) before use, and expect to rely on issues/PRs for fixes. It reads the vault listing and only calls Obsidian's own reconcile functions; it never writes, moves or deletes your files.

## Support
Issues and pull requests are welcome on GitHub, or contact daniel@pooh.cz.

## License
[MIT](LICENSE) © Daniel Dočekal
