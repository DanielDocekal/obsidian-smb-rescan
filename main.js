const { Plugin, Notice, TFile } = require('obsidian');

const INTERVAL_MS = 60 * 1000; // jak často skenovat na pozadí

module.exports = class SmbRescanPlugin extends Plugin {
  async onload() {
    this.running = false;
    this.warned = false;

    // při návratu do okna Obsidianu
    this.registerDomEvent(window, 'focus', () => this.rescan(false));
    // pravidelně na pozadí
    this.registerInterval(window.setInterval(() => this.rescan(false), INTERVAL_MS));
    // ruční možnost, kdyby byla potřeba (ikonka v levé liště)
    this.addRibbonIcon('refresh-cw', 'Přeskenovat vault', () => this.rescan(true));
    this.addCommand({ id: 'rescan-now', name: 'Přeskenovat vault teď', callback: () => this.rescan(true) });

    this.app.workspace.onLayoutReady(() => this.rescan(false));
  }

  clean(p) {
    return p.replace(/^\/+/, '');
  }

  isHidden(p) {
    return p.split('/').some((part) => part.startsWith('.'));
  }

  async listDisk(path, files, folders) {
    const res = await this.app.vault.adapter.list(path);
    for (const raw of res.folders) {
      const f = this.clean(raw);
      if (this.isHidden(f)) continue;
      folders.add(f);
      await this.listDisk(f, files, folders);
    }
    for (const raw of res.files) {
      const f = this.clean(raw);
      if (this.isHidden(f)) continue;
      files.add(f);
    }
  }

  async rescan(manual) {
    if (this.running) return;
    this.running = true;
    const a = this.app.vault.adapter;

    try {
      if (typeof a.reconcileFile !== 'function') {
        if (!this.warned) {
          new Notice('SMB Rescan: tahle verze Obsidianu nemá potřebné interní funkce.');
          this.warned = true;
        }
        return;
      }

      // co je na disku
      const diskFiles = new Set();
      const diskFolders = new Set();
      await this.listDisk('/', diskFiles, diskFolders);

      // co zná Obsidian
      const knownFiles = new Set();
      const knownFolders = new Set();
      for (const f of this.app.vault.getAllLoadedFiles()) {
        if (!f.path || f.path === '/') continue;
        if (f instanceof TFile) knownFiles.add(f.path);
        else knownFolders.add(f.path);
      }

      const depth = (p) => p.split('/').length;
      let changes = 0;

      // nové složky (od nejmělčích)
      const newFolders = [...diskFolders].filter((p) => !knownFolders.has(p)).sort((x, y) => depth(x) - depth(y));
      for (const p of newFolders) {
        if (typeof a.reconcileFolderCreation === 'function') await a.reconcileFolderCreation(p, p);
        else await a.reconcileFile(p, p);
        changes++;
      }

      // nové soubory
      for (const p of diskFiles) {
        if (!knownFiles.has(p)) {
          await a.reconcileFile(p, p);
          changes++;
        }
      }

      // smazané soubory, pak smazané složky (od nejhlubších)
      if (typeof a.reconcileDeletion === 'function') {
        for (const p of knownFiles) {
          if (!diskFiles.has(p)) {
            await a.reconcileDeletion(p, p, true);
            changes++;
          }
        }
        const goneFolders = [...knownFolders].filter((p) => !diskFolders.has(p)).sort((x, y) => depth(y) - depth(x));
        for (const p of goneFolders) {
          await a.reconcileDeletion(p, p, true);
          changes++;
        }
      }

      // změněný obsah otevřených poznámek
      const open = new Set();
      this.app.workspace.iterateAllLeaves((leaf) => {
        const f = leaf.view && leaf.view.file;
        if (f instanceof TFile) open.add(f);
      });
      for (const f of open) {
        const st = await a.stat(f.path);
        if (st && st.mtime > f.stat.mtime) {
          await a.reconcileFile(f.path, f.path);
          changes++;
        }
      }

      if (manual) new Notice(changes ? `SMB Rescan: ${changes} změn načteno.` : 'SMB Rescan: vše aktuální.');
    } catch (e) {
      console.error('SMB Rescan', e);
      if (manual) new Notice('SMB Rescan: chyba, detail v konzoli (Cmd+Opt+I).');
    } finally {
      this.running = false;
    }
  }
};
