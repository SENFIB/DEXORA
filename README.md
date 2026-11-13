# SEN Launcher
Customizable Windows application launcher (Electron). Dashboard with draggable widgets, resizable columns,
Explorer-style views, FA/EN/AR (RTL) with Persian/Hijri/Gregorian calendars, live hardware monitor.

## Build the installer (no tools needed on your PC)
1. Create a new GitHub repository and upload **all files of this folder** (keep `.github/workflows/build.yml`).
2. Open the **Actions** tab -> **Build Windows installer** -> **Run workflow** (it also runs on every push to `main`).
3. When it finishes (~3-5 min) open the run -> **Artifacts** -> download **SEN-Launcher-Installer** -> unzip -> run `SEN-Launcher-Setup-1.0.0.exe`.

## Use
- Drag files/folders from Explorer into the window, or use **Add**. Right-click any entry for rename / icon / pin / hide / move / remove.
- Drag widget titles (⠿) between columns; drag column borders to resize; drag a widget's bottom edge to change its height.
- Settings -> Data -> **Import patchapss.json** brings in your old entries. Data lives in `%APPDATA%\sen-launcher\sen-data.json`.
- Removing an entry never uninstalls anything.

## Limits
- CPU temperature needs sensor access Windows often does not expose; GPU load/temp/VRAM are reliable mainly on NVIDIA. Otherwise **N/A** is shown.
- Windows "This PC / Recycle Bin / Settings…" use emoji glyphs; exe-based ones (Explorer, Task Manager, CMD, PowerShell) use real icons.
- Installer is unsigned: SmartScreen may warn ("More info" -> "Run anyway").
Dev: `npm install && npm run icon && npm start`.

## Media players (Video / Music)
- Playback position is saved per file. Next time a notice offers: continue / play from start / ✕. Until you choose, playback starts from the beginning.
- Embedded **text** subtitles (SRT/ASS/mov_text in MKV/MP4) and `.srt/.vtt/.ass` files next to the video are detected (bundled ffmpeg). Image subtitles (PGS/DVD) and switching audio tracks are not supported.
- Codecs the built-in engine cannot decode (e.g. HEVC on some PCs, AC3/DTS audio) show a button to open the file in your default player.

## v3 additions
- Popular & Frequent is one widget (sorted by most used). Telegram, Instagram, WhatsApp, Spotify, etc. are detected as desktop apps **or Microsoft Store apps** (via Start menu); only apps that are not installed fall back to their website. "Add -> Installed apps..." adds any Start/Store app.
- Browser tab (webview): tabs, vertical tabs, speed dial, bookmarks, history, downloads, ad/tracker blocking, private tabs, reader mode, dark pages, find, dev tools, 4 search engines. No Widevine DRM (Netflix/Spotify web will not play protected media) and no extensions.
- Weather tab (Open-Meteo, needs internet): Windows Location if allowed, otherwise manual city search (or approximate IP location).
- Appearance tab: 8 colour schemes, custom colour editor with saved schemes, sidebar/top layout, density, radius, glass strength, text size.
- Music player has 15 animated driving scenes.

## v4 additions
- **Download manager** (tab ⬇): multi-connection segmented downloads (up to 32, dynamic re-splitting), pause/resume (also after restart), retry, queue with parallel limit, speed limiter, daily scheduler, batch links (`file[01-20].jpg`), categories/folders, clipboard link watcher, capture of built-in-browser downloads, and a "detected media" button in the browser (direct video/audio files). Not supported: torrents, HLS/DASH streams, DRM.
- Lighter on CPU/RAM: CPU/RAM read through Node `os`, heavy sensors polled rarely and only when visible; scenes render at reduced resolution and pause when hidden; no per-widget blur; idle browser tabs are discarded after 10 minutes.
- Home: Windows Apps (desktop + Microsoft Store), Web Apps, Frequent, System (system apps only), Favorites; widgets and columns collapse with arrows; apps you add go to the Applications tab only (move them to Home from the right-click menu).
- Music player: 15 scenes; playlists group by folder.

## v5 notes
- **Workspace tab** (formerly Browser): web pages *and* a built-in File Explorer ("This PC") as tabs; 1 or 2 columns (panes). Web apps (Telegram Web, Instagram...) and This PC / folders open here. *Native Windows apps (e.g. desktop Telegram) cannot be embedded in a tab by Windows rules; use their web version here or launch them normally.*
- **Google sync** (Settings): create an OAuth client of type "Desktop app" in Google Cloud Console (APIs & Services -> Credentials), enable the Google Drive API, add your account as a test user, paste Client ID/secret in Settings, sign in. Bookmarks, speed dial, layout, theme, saved places and added apps are stored in your private Drive appDataFolder (`sen-sync.json`) so a future mobile build can read the same file. Chrome Sync itself is not available to third-party apps, and Google often blocks sign-in inside embedded browsers, so sign-in uses your system browser.
- Weather: Open-Meteo forecast averaged over ECMWF, GFS and ICON models, air quality, place search through Open-Meteo + OpenStreetMap, Windows Location.

## Future platforms (architecture)
All native work goes through `preload.js` -> `main.js` (the `api` object); the UI in `renderer/` is plain HTML/JS. macOS/Linux builds mostly need the Windows-specific calls in `main.js` (PowerShell, shell: URIs, Start-menu/Store detection, explorer.exe) replaced. Android/iOS need a different shell (e.g. Capacitor) that re-implements the same `api`; game consoles are closed platforms and are not realistic targets.

## v6 notes
- **Analysis tab**: candlestick chart (black background, green/red candles, all colours editable) with smart-money overlays (market structure BOS/CHoCH, order blocks, FVG, liquidity pools EQH/EQL/PDH/PDL, premium/discount + OTE, stop-run markers), a projected "heartbeat" path with an alternative scenario, likely stop-hunt wick zones, multi-timeframe bias, economic calendar and headline sentiment. Data: Binance (crypto), Yahoo Finance (forex, metals, indices, stocks), Google News RSS, ForexFactory calendar mirror, tgju (Iran, best effort). **It is a rule-based educational model. It cannot guarantee profit or prevent loss.**
- **Default apps**: the installer registers SEN Launcher as an available browser (http/https) and as a viewer for common video/audio files. Windows still requires you to pick it in Settings -> Default apps (button in SEN Launcher Settings). Links/files opened this way arrive in the Workspace / players. Windows has no "default download manager" setting; downloads from the built-in browser and copied links are captured instead (capturing downloads from Chrome/Edge would need a browser extension).
- **Power saving** (Settings): auto on battery; halves monitor polling, lowers scene frame rate/resolution, removes blur and animations.
