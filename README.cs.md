# SMB Rescan

🇬🇧 [English version](README.md)

Plugin pro [Obsidian](https://obsidian.md) pro vaulty uložené na **síťovém disku (SMB/NAS)**.

## Problém

Když je vault na SMB sdílení, Obsidian obvykle nedostává notifikace o změnách souborů. Soubory přidané, přejmenované, smazané nebo upravené z jiného zařízení či aplikace se v Obsidianu neobjeví, dokud ho nerestartujete.

## Co plugin dělá

Pravidelně porovnává seznam souborů na disku s tím, co zná Obsidian, a rozdíly mu oznámí:

- skenuje při **návratu do okna Obsidianu**,
- skenuje na pozadí **každých 60 sekund**,
- skenuje **na vyžádání** – ikonou v levé liště (🔄) nebo příkazem *Přeskenovat vault teď*,
- zachytí **nové** soubory/složky, **smazané** soubory/složky a znovu načte **otevřené poznámky** změněné na disku,
- ignoruje skryté soubory a složky (názvy začínající `.`).

## Instalace

1. Stáhněte `smb-rescan-1.0.0.zip` z [posledního release](https://github.com/DanielDocekal/obsidian-smb-rescan/releases/latest).
2. Rozbalte do `<váš vault>/.obsidian/plugins/`, aby vzniklo `<váš vault>/.obsidian/plugins/smb-rescan/main.js` a `manifest.json`. (Případně stáhněte jen `main.js` a `manifest.json` a vložte je do té složky ručně.)
3. V Obsidianu: **Nastavení → Komunitní pluginy** → případně vypněte Omezený režim → obnovte seznam → zapněte **SMB Rescan**.

Plugin se instaluje do konkrétního vaultu, takže ho dejte do vaultu, který leží na síťovém disku.

## Použití
Žádné nastavení není. Stačí plugin zapnout. Upozornění se zobrazí jen při ručním skenu („N změn načteno" / „vše aktuální").

## Omezení
- **Jen desktop**, vyžaduje Obsidian 1.4.0+.
- Využívá **interní** funkce adaptéru Obsidianu (`reconcileFile`, `reconcileFolderCreation`, `reconcileDeletion`), které nejsou veřejné API a mohou se změnit. Pokud chybí, plugin jednou zobrazí upozornění a nic nedělá.
- Interval skenu (60 s) je konstanta v `main.js`, nastavení v UI není.
- U velmi velkého vaultu může skenování přes SMB každou minutu trvat; případně upravte `INTERVAL_MS` v `main.js`.

## Řešení potíží
Otevřete vývojářskou konzoli (`Cmd+Opt+I`) a hledejte chyby `SMB Rescan`.

## O projektu
Plugin vznikl za pomoci **[Claude](https://claude.com/claude-code)** (AI od Anthropic). Autor ho sám neprogramoval, proto si kód (jediný soubor, cca 130 řádků) před použitím prohlédněte. Plugin soubory nikdy nezapisuje, nepřesouvá ani nemaže – jen čte výpis vaultu a volá vlastní reconcile funkce Obsidianu.

## Podpora
Issues a pull requesty vítány na GitHubu, případně daniel@pooh.cz.

## Licence
[MIT](LICENSE) © Daniel Dočekal
