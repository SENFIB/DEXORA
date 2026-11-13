const { app, BrowserWindow, ipcMain, dialog, shell, Tray, Menu, nativeImage } = require('electron');
const path = require('path'), fs = require('fs'), cp = require('child_process');
const si = require('systeminformation');
if (!app.requestSingleInstanceLock()) app.quit();
app.commandLine.appendSwitch('disable-features', 'Translate,MediaRouter,AutofillServerCommunication,OptimizationHints,CalculateNativeWinOcclusion');
app.commandLine.appendSwitch('disable-component-update'); app.commandLine.appendSwitch('no-pings'); app.commandLine.appendSwitch('disable-background-networking');

let win, tray, quitting = false, toTray = true, timer = null, tick = 0, gpuCache = null, busy = false, interval = 2000;
const U = () => app.getPath('userData');
const F = () => path.join(U(), 'sen-data.json');
const log = m => { try { fs.appendFileSync(path.join(U(), 'sen.log'), `${new Date().toISOString()} ${m}\n`); } catch {} };
const E = process.env;
const env = s => String(s || '').replace(/%([^%]+)%/g, (m, k) => E[k] || m);
const PF = E.ProgramFiles || 'C:\\Program Files', PF86 = E['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
const LA = E.LOCALAPPDATA || '', RA = E.APPDATA || '';

const POP = [
  { id: 'telegram', re: /^telegram/i, name: 'Telegram', c: '#27a7e7', l: 'T', exe: [RA + '\\Telegram Desktop\\Telegram.exe'], url: 'https://web.telegram.org' },
  { id: 'instagram', re: /^instagram/i, name: 'Instagram', c: '#e1306c', l: 'I', url: 'https://www.instagram.com' },
  { id: 'spotify', re: /^spotify/i, name: 'Spotify', c: '#1db954', l: 'S', exe: [RA + '\\Spotify\\Spotify.exe'], url: 'https://open.spotify.com' },
  { id: 'discord', re: /^discord/i, name: 'Discord', c: '#5865f2', l: 'D', exe: [LA + '\\Discord\\Update.exe'], args: ['--processStart', 'Discord.exe'], url: 'https://discord.com/app' },
  { id: 'whatsapp', re: /^whatsapp/i, name: 'WhatsApp', c: '#25d366', l: 'W', exe: [LA + '\\WhatsApp\\WhatsApp.exe'], url: 'https://web.whatsapp.com' },
  { id: 'youtube', re: /^youtube/i, name: 'YouTube', c: '#ff0000', l: 'Y', url: 'https://www.youtube.com' },
  { id: 'steam', re: /^steam$/i, name: 'Steam', c: '#1b2838', l: 'S', exe: [PF86 + '\\Steam\\steam.exe', PF + '\\Steam\\steam.exe'], url: 'https://store.steampowered.com' },
  { id: 'epic', re: /epic games launcher/i, name: 'Epic Games', c: '#2a2a2a', l: 'E', exe: [PF86 + '\\Epic Games\\Launcher\\Portal\\Binaries\\Win32\\EpicGamesLauncher.exe', PF + '\\Epic Games\\Launcher\\Portal\\Binaries\\Win64\\EpicGamesLauncher.exe'], url: 'https://store.epicgames.com' },
  { id: 'chrome', re: /^google chrome$/i, name: 'Google Chrome', c: '#4285f4', l: 'C', exe: [PF + '\\Google\\Chrome\\Application\\chrome.exe', PF86 + '\\Google\\Chrome\\Application\\chrome.exe', LA + '\\Google\\Chrome\\Application\\chrome.exe'], url: 'https://www.google.com/chrome' },
  { id: 'edge', re: /^microsoft edge$/i, name: 'Microsoft Edge', c: '#0f7ed8', l: 'E', exe: [PF86 + '\\Microsoft\\Edge\\Application\\msedge.exe', PF + '\\Microsoft\\Edge\\Application\\msedge.exe'], url: 'https://www.microsoft.com/edge' }
];
const found = p => (p.exe || []).find(x => fs.existsSync(x));

const run = (cmd, args = [], opt = {}) => new Promise(res => {
  try {
    const c = cp.spawn(cmd, args, { detached: true, stdio: 'ignore', ...opt });
    c.once('error', e => res({ ok: false, error: e.message }));
    c.once('spawn', () => { c.unref(); res({ ok: true }); });
  } catch (e) { res({ ok: false, error: e.message }); }
});
const ext = u => shell.openExternal(u).then(() => ({ ok: true }), e => ({ ok: false, error: String(e) }));
const SYS = {
  thispc: () => run('explorer.exe', ['shell:MyComputerFolder']),
  recycle: () => run('explorer.exe', ['shell:RecycleBinFolder']),
  control: () => run('control.exe'),
  settings: () => ext('ms-settings:'),
  store: () => ext('ms-windows-store:'),
  xbox: () => ext('xbox:'),
  explorer: () => run('explorer.exe'),
  taskmgr: () => run('taskmgr.exe'),
  terminal: () => run('wt.exe'),
  cmd: () => run('cmd.exe', ['/c', 'start', 'cmd.exe']),
  powershell: () => run('cmd.exe', ['/c', 'start', 'powershell.exe']),
  devmgr: () => run('mmc.exe', ['devmgmt.msc']),
  network: () => ext('ms-settings:network')
};

ipcMain.handle('launch', async (_, it) => {
  try {
    if (it.type === 'system') { const f = SYS[it.id.slice(4)]; return f ? await f() : { ok: false, error: 'unknown' }; }
    if (it.type === 'popular') {
      const p = POP.find(x => 'pop:' + x.id === it.id); if (!p) return { ok: false, error: 'unknown' };
      await loadStart(); const r = resolve(p);
      if (r.via === 'exe') return await run(r.exe, p.args || []);
      if (r.via === 'store') return await run('explorer.exe', ['shell:AppsFolder\\' + r.appid]);
      return { ...(await ext(p.url)), web: true };
    }
    if (it.type === 'store') return await run('explorer.exe', ['shell:AppsFolder\\' + it.path]);
    if (it.type === 'url' || it.type === 'web') return await ext(it.path);
    if (it.type === 'cmd') return await run('cmd.exe', ['/c', 'start "" ' + it.path], { windowsVerbatimArguments: true, windowsHide: true });
    if (!fs.existsSync(it.path)) return { ok: false, error: 'missing' };
    const r = await shell.openPath(it.path);
    return r ? { ok: false, error: r } : { ok: true };
  } catch (e) { log(e.stack); return { ok: false, error: e.message }; }
});
ipcMain.handle('path:info', (_, p) => {
  p = env(String(p || '').trim().replace(/^"|"$/g, ''));
  try {
    if (/^https?:\/\//i.test(p)) return { kind: 'url', path: p, name: new URL(p).hostname.replace(/^www\./, '') };
    try { const s = fs.statSync(p); return { kind: s.isDirectory() ? 'folder' : 'app', path: p, name: path.basename(p, path.extname(p)) || p }; } catch {}
    if (/^[a-z][a-z0-9+.-]{2,}:/i.test(p)) return { kind: 'url', path: p, name: p.split(':')[0] };
    if (p && !/[\\/]/.test(p) && cp.spawnSync('where.exe', [p.split(' ')[0]]).status === 0) return { kind: 'cmd', path: p, name: p.split(' ')[0] };
  } catch (e) { log(e.message); }
  return { kind: null, path: p };
});
ipcMain.handle('icon', async (_, p) => {
  try {
    p = env(p); let tgt = p;
    if (/\.lnk$/i.test(p)) { try { const l = shell.readShortcutLink(p); if (l.icon && /\.(ico|exe)$/i.test(l.icon) && !l.iconIndex && fs.existsSync(env(l.icon))) tgt = env(l.icon); else if (l.target) tgt = env(l.target); } catch {} }
    let i = null; try { i = await nativeImage.createThumbnailFromPath(tgt, { width: 256, height: 256 }); } catch {}
    if (!i || i.isEmpty()) i = await app.getFileIcon(tgt, { size: 'large' });
    return i.isEmpty() ? null : i.toDataURL();
  } catch { return null; }
});
ipcMain.handle('pick', async (_, k) => {
  const o = {
    files: { properties: ['openFile', 'multiSelections'], filters: [{ name: 'Apps', extensions: ['exe', 'lnk', 'bat', 'cmd', 'msi', 'url'] }, { name: 'All', extensions: ['*'] }] },
    folder: { properties: ['openDirectory', 'multiSelections'] },
    image: { properties: ['openFile'], filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'ico', 'svg', 'webp'] }] },
    video: { properties: ['openFile', 'multiSelections'], filters: [{ name: 'Video', extensions: MEDIA.video.map(x => x.slice(1)) }] },
    audio: { properties: ['openFile', 'multiSelections'], filters: [{ name: 'Audio', extensions: MEDIA.music.map(x => x.slice(1)) }] },
    sub: { properties: ['openFile', 'multiSelections'], filters: [{ name: 'Subtitles', extensions: ['srt', 'vtt', 'ass', 'ssa'] }] }
  }[k];
  const r = await dialog.showOpenDialog(win, o); if (r.canceled) return null;
  if (k === 'image') {
    const f = r.filePaths[0], e = path.extname(f).slice(1).toLowerCase();
    const mime = e === 'svg' ? 'image/svg+xml' : e === 'ico' ? 'image/x-icon' : 'image/' + (e === 'jpg' ? 'jpeg' : e);
    return `data:${mime};base64,` + fs.readFileSync(f).toString('base64');
  }
  return r.filePaths;
});
ipcMain.handle('data:load', () => {
  try { return JSON.parse(fs.readFileSync(F(), 'utf8')); }
  catch (e) { if (fs.existsSync(F())) try { fs.copyFileSync(F(), F() + '.corrupt'); } catch {} return null; }
});
ipcMain.handle('data:save', (_, d) => {
  try { const t = F() + '.tmp'; fs.writeFileSync(t, JSON.stringify(d)); fs.renameSync(t, F()); return true; }
  catch (e) { log(e.message); return false; }
});
ipcMain.handle('json:open', async () => {
  const r = await dialog.showOpenDialog(win, { properties: ['openFile'], filters: [{ name: 'JSON', extensions: ['json'] }] });
  if (r.canceled) return null;
  try { return JSON.parse(fs.readFileSync(r.filePaths[0], 'utf8')); } catch { return { __error: 1 }; }
});
ipcMain.handle('json:save', async (_, d) => {
  const r = await dialog.showSaveDialog(win, { defaultPath: 'sen-launcher-backup.json' });
  if (r.canceled) return false; fs.writeFileSync(r.filePath, JSON.stringify(d, null, 2)); return true;
});
ipcMain.handle('prefs', (_, p) => { toTray = !!p.tray; app.setLoginItemSettings({ openAtLogin: !!p.autostart }); return true; });
ipcMain.handle('opendate', () => ext('ms-settings:dateandtime'));

// ---- hardware monitor (only real values; null => UI shows N/A) ----
ipcMain.handle('mon:static', async () => {
  const g = await si.graphics().catch(() => null);
  return { cpu: (require('os').cpus()[0] || {}).model || null, gpu: g && g.controllers[0] ? g.controllers[0].model : null };
});
const num = v => (typeof v === 'number' && isFinite(v) ? v : null);
const os = require('os');
let sens = { cpu: 1, gpu: 1, ram: 1, disk: 1, net: 1 }, prevCpu = null, cache = { t: null, d: [], g: null, n: null, io: null }, tk = 0;
function cpuLoad() { const c = os.cpus(); let idle = 0, tot = 0; c.forEach(x => { for (const k in x.times) tot += x.times[k]; idle += x.times.idle; }); const r = prevCpu ? (1 - (idle - prevCpu.idle) / Math.max(1, tot - prevCpu.tot)) * 100 : null; prevCpu = { idle, tot }; return r; }
async function sample() {
  if (busy || !win || !win.isVisible() || win.isMinimized()) return;
  const T = tk++; if (!win.isFocused() && T % 4) return;
  busy = true;
  try {
    const ok = p => p.catch(() => null);
    if (sens.cpu && T % 5 === 0) { const t = await ok(si.cpuTemperature()); cache.t = t ? num(t.main) : null; }
    if (sens.disk && T % 20 === 0) { const d = await ok(si.fsSize()); if (Array.isArray(d)) cache.d = d.filter(x => x.size > 0).map(x => ({ mount: x.mount, size: x.size, used: x.used })); }
    if (sens.disk && T % 2 === 0) { const io = await ok(si.fsStats()); cache.io = io ? { r: num(io.rx_sec), w: num(io.wx_sec) } : null; }
    if (sens.net && T % 2 === 0) { const n = await ok(si.networkStats()); if (Array.isArray(n)) cache.n = { d: n.reduce((a, x) => a + (num(x.rx_sec) || 0), 0), u: n.reduce((a, x) => a + (num(x.tx_sec) || 0), 0) }; }
    if (sens.gpu && T % 8 === 0) { const g = await ok(si.graphics()); const c = g && g.controllers && g.controllers[0]; cache.g = c ? { load: num(c.utilizationGpu), temp: num(c.temperatureGpu), vu: num(c.memoryUsed), vt: num(c.memoryTotal) } : null; }
    const tm = os.totalmem(), fm = os.freemem();
    win.webContents.send('mon', { cpu: sens.cpu ? cpuLoad() : null, cpuT: cache.t, ram: sens.ram ? { total: tm, used: tm - fm, avail: fm } : null, disk: cache.d, io: cache.io, net: cache.n, gpu: cache.g });
  } catch (e) { log('mon ' + e.message); } finally { busy = false; }
}
ipcMain.handle('mon:cfg', (_, ms, s) => { interval = Math.max(1500, ms | 0); if (s) sens = { ...sens, ...s }; clearInterval(timer); timer = setInterval(sample, interval); sample(); return true; });

// ---------- media helpers (subtitles via bundled ffmpeg; text subtitles only) ----------
const MEDIA = { video: ['.mp4', '.mkv', '.webm', '.avi', '.mov', '.m4v', '.wmv', '.ts', '.mpg', '.mpeg'], music: ['.mp3', '.flac', '.wav', '.ogg', '.m4a', '.aac', '.opus', '.wma'] };
let FF = null;
try { FF = require('@ffmpeg-installer/ffmpeg').path.replace('app.asar' + path.sep, 'app.asar.unpacked' + path.sep); if (!fs.existsSync(FF)) FF = null; } catch (e) { log('ffmpeg ' + e.message); }
const ff = args => new Promise(res => {
  if (!FF) return res({ code: -1, err: 'noffmpeg' });
  let err = ''; const c = cp.spawn(FF, args, { windowsHide: true });
  c.stderr.on('data', d => { err += d; }); c.on('error', e => res({ code: -1, err: e.message })); c.on('close', code => res({ code, err }));
});
const readText = f => { const b = fs.readFileSync(f); let s = b.toString('utf8'); if (s.includes('\uFFFD')) { try { s = new TextDecoder('windows-1256').decode(b); } catch {} } return s.replace(/^\uFEFF/, ''); };
const guessLang = f => { const m = f.match(/\.(fa|per|fas|ar|ara|en|eng)\.[a-z]+$/i); return m ? m[1].toLowerCase() : ''; };
async function subToVtt(f) {
  const e = path.extname(f).toLowerCase(), s = readText(f);
  if (e === '.vtt') return s;
  if (e === '.srt') return 'WEBVTT\n\n' + s.replace(/\r/g, '').replace(/(\d+:\d+:\d+),(\d+)/g, '$1.$2');
  if (!FF) return null;
  const tmp = fs.mkdtempSync(path.join(app.getPath('temp'), 'sen-')), i = path.join(tmp, 'in' + e), o = path.join(tmp, 'o.vtt');
  fs.writeFileSync(i, s); await ff(['-hide_banner', '-nostdin', '-y', '-i', i, '-f', 'webvtt', o]);
  let v = null; try { v = fs.readFileSync(o, 'utf8'); } catch {} try { fs.rmSync(tmp, { recursive: true, force: true }); } catch {} return v;
}
ipcMain.handle('media:subfile', async (_, f) => { try { return { label: path.basename(f), lang: guessLang(f), vtt: await subToVtt(f) }; } catch (e) { log(e.message); return null; } });
ipcMain.handle('media:subs', async (_, file) => {
  const out = { tracks: [], ffmpeg: !!FF, skipped: 0 };
  try {
    const dir = path.dirname(file), base = path.basename(file, path.extname(file)).toLowerCase();
    for (const f of fs.readdirSync(dir)) {
      if (['.srt', '.vtt', '.ass', '.ssa'].includes(path.extname(f).toLowerCase()) && f.toLowerCase().startsWith(base)) {
        const v = await subToVtt(path.join(dir, f)); if (v) out.tracks.push({ label: f, lang: guessLang(f), vtt: v });
      }
    }
  } catch (e) { log('subs ext ' + e.message); }
  if (FF) {
    try {
      const info = await ff(['-hide_banner', '-i', file]), re = /Stream #0:(\d+)(?:\[[^\]]*\])?(?:\(([^)]*)\))?[^\n]*?: Subtitle: (\w+)/g, found = []; let m;
      while ((m = re.exec(info.err))) found.push({ idx: +m[1], lang: m[2] || '', codec: m[3] });
      const txt = found.filter(s => ['subrip', 'ass', 'ssa', 'mov_text', 'webvtt', 'text', 'srt'].includes(s.codec));
      out.skipped = found.length - txt.length;
      if (txt.length) {
        const tmp = fs.mkdtempSync(path.join(app.getPath('temp'), 'sen-')), args = ['-hide_banner', '-nostdin', '-y', '-i', file];
        txt.forEach((s, k) => args.push('-map', '0:' + s.idx, '-f', 'webvtt', path.join(tmp, k + '.vtt')));
        await ff(args);
        txt.forEach((s, k) => { try { out.tracks.push({ label: `#${k + 1} ${s.lang || 'und'} (${s.codec})`, lang: s.lang, vtt: fs.readFileSync(path.join(tmp, k + '.vtt'), 'utf8') }); } catch {} });
        try { fs.rmSync(tmp, { recursive: true, force: true }); } catch {}
      }
    } catch (e) { log('subs emb ' + e.message); }
  }
  return out;
});
ipcMain.handle('media:scan', (_, dir, kind) => {
  const out = [];
  const walk = (d, n) => {
    if (n > 4 || out.length > 3000) return; let ents = [];
    try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    ents.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    for (const e of ents) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p, n + 1); else if ((MEDIA[kind] || []).includes(path.extname(e.name).toLowerCase())) out.push(p); }
  };
  walk(dir, 0); return out;
});

// ---------- Start-menu / Microsoft Store apps ----------
const { session } = require('electron');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/' + process.versions.chrome + ' Safari/537.36';
require('./gsync')({ app, ipcMain, shell, safeStorage: require('electron').safeStorage, log });
const dm = require('./dm')({ app, ipcMain, shell, clipboard: require('electron').clipboard, getWin: () => win, log, UA });
const psRun = (cmd, timeout = 25000) => new Promise(res => {
  try {
    const c = cp.spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', '[Console]::OutputEncoding=[Text.Encoding]::UTF8;' + cmd], { windowsHide: true });
    const bufs = [], tm = setTimeout(() => { try { c.kill(); } catch {} }, timeout);
    c.stdout.on('data', d => bufs.push(d)); c.on('error', () => { clearTimeout(tm); res(''); }); c.on('close', () => { clearTimeout(tm); res(Buffer.concat(bufs).toString('utf8').replace(/^\uFEFF/, '')); });
  } catch { res(''); }
});
let startApps = null, startP = null;
function loadStart() {
  if (!startP) startP = (async () => {
    const o = await psRun('Get-StartApps | ConvertTo-Json -Compress');
    try { let j = JSON.parse(o.trim() || '[]'); if (!Array.isArray(j)) j = [j]; startApps = j.filter(x => x && x.Name && x.AppID).map(x => ({ name: String(x.Name), id: String(x.AppID) })); } catch { startApps = []; }
    return startApps;
  })();
  return startP;
}
ipcMain.handle('apps:list', () => loadStart());
const startMatch = p => p.re && (startApps || []).find(a => p.re.test(a.name) && !/uninstall|remove/i.test(a.name));
const resolve = p => { const e = found(p); if (e) return { via: 'exe', exe: e }; const s = startMatch(p); if (s) return { via: 'store', appid: s.id }; return { via: 'web' }; };
ipcMain.handle('boot', () => ({ ua: UA, pop: POP.map(p => ({ id: 'pop:' + p.id, name: p.name, c: p.c, l: p.l, ...resolve(p) })) }));
let pkgMap = null;
async function pkgs() {
  if (pkgMap) return pkgMap; pkgMap = {};
  const o = await psRun('Get-AppxPackage | Select-Object PackageFamilyName,InstallLocation | ConvertTo-Json -Compress', 40000);
  try { let j = JSON.parse(o.trim() || '[]'); if (!Array.isArray(j)) j = [j]; j.forEach(x => { if (x && x.PackageFamilyName) pkgMap[x.PackageFamilyName.toLowerCase()] = x.InstallLocation; }); } catch {}
  return pkgMap;
}
function logoOf(dir, appId) {
  try {
    const mf = fs.readFileSync(path.join(dir, 'AppxManifest.xml'), 'utf8');
    const m = mf.match(new RegExp('<Application[^>]*Id="' + appId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"[\\s\\S]*?</Application>', 'i')), blk = m ? m[0] : mf;
    const L = blk.match(/Square44x44Logo="([^"]+)"/) || blk.match(/Square150x150Logo="([^"]+)"/) || mf.match(/<Logo>([^<]+)<\/Logo>/); if (!L) return null;
    const rel = L[1].replace(/\\/g, '/'), base = path.basename(rel, path.extname(rel)), d = path.join(dir, path.dirname(rel)); let best = null, bs = -1;
    for (const f of fs.readdirSync(d)) {
      if (!f.toLowerCase().endsWith('.png') || !f.startsWith(base) || /contrast|lightunplated/i.test(f)) continue;
      const sz = /targetsize-(\d+)/i.exec(f), sc = /scale-(\d+)/i.exec(f); let v = sz ? +sz[1] : sc ? 44 * (+sc[1]) / 100 : 1; if (v > 300) v = 0; if (/unplated/i.test(f)) v += .5;
      if (v > bs) { bs = v; best = f; }
    }
    return best ? path.join(d, best) : null;
  } catch { return null; }
}
ipcMain.handle('icon:app', async (_, id) => {
  try {
    if (!String(id).includes('!')) return null;
    const [pfn, aid] = id.split('!'), dir = (await pkgs())[pfn.toLowerCase()]; if (!dir) return null;
    const f = logoOf(dir, aid); return f ? 'data:image/png;base64,' + fs.readFileSync(f).toString('base64') : null;
  } catch { return null; }
});

// ---------- location (Windows Location service) + web data ----------
const GEO = "Add-Type -AssemblyName System.Device; $w=New-Object System.Device.Location.GeoCoordinateWatcher; [void]$w.TryStart($false,[TimeSpan]::FromSeconds(8)); $p=$w.Position.Location; if($p.IsUnknown){'unknown'}else{[string]::Format([Globalization.CultureInfo]::InvariantCulture,'{0},{1}',$p.Latitude,$p.Longitude)}";
ipcMain.handle('geo:get', async () => { const o = await psRun(GEO, 16000), m = /(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/.exec(o); return m ? { lat: +m[1], lon: +m[2] } : null; });
const NETOK = ['api.open-meteo.com', 'geocoding-api.open-meteo.com', 'air-quality-api.open-meteo.com', 'nominatim.openstreetmap.org', 'ipwho.is'];
ipcMain.handle('net:json', async (_, url) => {
  try {
    const u = new URL(url); if (u.protocol !== 'https:' || !NETOK.includes(u.hostname)) return { error: 'blocked' };
    const ctl = new AbortController(), tm = setTimeout(() => ctl.abort(), 12000), r = await fetch(url, { signal: ctl.signal, headers: { 'User-Agent': 'SEN-Launcher/1.0 (Windows desktop app)' } }); clearTimeout(tm);
    return r.ok ? { data: await r.json() } : { error: 'http ' + r.status };
  } catch (e) { return { error: e.message }; }
});

// ---------- built-in browser: webview hardening, ad/tracker blocking, downloads ----------
let adblock = true, blocked = 0, bsent = 0;
const AD = ['doubleclick.net', 'googlesyndication.com', 'googleadservices.com', 'google-analytics.com', 'googletagmanager.com', 'googletagservices.com', 'adservice.google.com', 'adnxs.com', 'adsrvr.org', 'taboola.com', 'outbrain.com', 'criteo.com', 'criteo.net', 'scorecardresearch.com', 'quantserve.com', 'hotjar.com', 'mixpanel.com', 'segment.io', 'amplitude.com', 'moatads.com', 'pubmatic.com', 'rubiconproject.com', 'openx.net', 'casalemedia.com', '2mdn.net', 'adform.net', 'advertising.com', 'yieldmo.com', 'smartadserver.com', 'zedo.com', 'adcolony.com', 'applovin.com', 'popads.net', 'propellerads.com', 'exoclick.com', 'mgid.com', 'revcontent.com', 'amazon-adsystem.com', 'ads-twitter.com', 'analytics.yahoo.com', 'bat.bing.com', 'clarity.ms'];
const isAd = u => { try { const h = new URL(u).hostname; return AD.some(d => h === d || h.endsWith('.' + d)); } catch { return false; } };
function hook(s) {
  try {
    s.webRequest.onBeforeRequest({ urls: ['http://*/*', 'https://*/*'] }, (d, cb) => { if (adblock && isAd(d.url)) { blocked++; return cb({ cancel: true }); } cb({}); });
    s.setPermissionRequestHandler((wc, perm, cb) => cb(['fullscreen', 'clipboard-sanitized-write', 'pointerLock'].includes(perm)));
    s.webRequest.onHeadersReceived({ urls: ['http://*/*', 'https://*/*'] }, (d, cb) => {
      if (d.resourceType === 'media' && dm.cfg().sniff) {
        try {
          const H = d.responseHeaders || {}, g = k => { const v = H[k] || H[k.toLowerCase()]; return v ? v[0] : ''; }, ct = g('content-type');
          if (/^(video|audio)\//i.test(ct)) { const cr = /\/(\d+)$/.exec(g('content-range') || ''), size = cr ? +cr[1] : +g('content-length') || 0; if (size > 300000 && win) win.webContents.send('br:media', { url: d.url.split('#')[0], type: ct, size, referer: d.referrer || '' }); }
        } catch {}
      }
      cb({});
    });
    s.on('will-download', (e, item, wc) => {
      const url = item.getURL();
      if (dm.cfg().capture && /^https?:/i.test(url)) {
        e.preventDefault(); const name = item.getFilename(), ref = wc ? wc.getURL() : '';
        s.cookies.get({ url }).then(cs => dm.add([{ url, name, referer: ref, cookie: cs.map(c => c.name + '=' + c.value).join('; ') }], true)).catch(() => dm.add([{ url, name, referer: ref }], true));
        return;
      }
      const f = path.join(app.getPath('downloads'), item.getFilename()); item.setSavePath(f);
      item.once('done', (_, st) => { if (win) win.webContents.send('br:dl', { name: item.getFilename(), path: f, state: st }); });
    });
  } catch (e) { log('hook ' + e.message); }
}
const hooked = new Set(['persist:sen-web', 'sen-private']);
ipcMain.handle('br:part', (_, p) => { if (!hooked.has(p)) { hooked.add(p); hook(session.fromPartition(p)); } return true; });
ipcMain.handle('br:shot', (_, du) => { const dir = path.join(app.getPath('pictures'), 'SEN'); fs.mkdirSync(dir, { recursive: true }); const f = path.join(dir, 'shot-' + Date.now() + '.png'); fs.writeFileSync(f, Buffer.from(String(du).split(',')[1], 'base64')); return f; });
ipcMain.handle('fs:list', (_, p) => {
  try {
    const items = fs.readdirSync(p, { withFileTypes: true }).slice(0, 4000).map(e => { let s = null; try { s = fs.statSync(path.join(p, e.name)); } catch {} return { n: e.name, d: e.isDirectory() || !!(s && s.isDirectory()), s: s && !s.isDirectory() ? s.size : 0, m: s ? s.mtimeMs : 0 }; });
    return { items };
  } catch (e) { return { error: e.code || e.message }; }
});
ipcMain.handle('fs:drives', () => { const o = []; for (let c = 65; c <= 90; c++) { const p = String.fromCharCode(c) + ':\\'; try { if (fs.existsSync(p)) { let t = 0, f = 0; try { const s = fs.statfsSync(p); t = s.blocks * s.bsize; f = s.bavail * s.bsize; } catch {} o.push({ p, t, f }); } } catch {} } return o; });
ipcMain.handle('fs:known', () => ['desktop', 'documents', 'downloads', 'pictures', 'music', 'videos'].map(k => { try { return [k, app.getPath(k)]; } catch { return null; } }).filter(Boolean));
ipcMain.handle('br:adblock', (_, on) => { adblock = !!on; return true; });
setInterval(() => { if (win && blocked !== bsent) { bsent = blocked; win.webContents.send('br:blocked', blocked); } }, 2000);
app.on('web-contents-created', (_, wc) => {
  wc.on('will-attach-webview', (e, wp) => { delete wp.preload; delete wp.preloadURL; wp.nodeIntegration = false; wp.contextIsolation = true; wp.sandbox = true; });
  if (wc.getType() === 'webview') wc.setWindowOpenHandler(({ url }) => { if (win) win.webContents.send('br:open', url); return { action: 'deny' }; });
});


// ---------- market data for the Analysis tab (Binance / Yahoo Finance / news RSS / economic calendar / tgju) ----------
const MKHOST = ['api.binance.com', 'data-api.binance.vision', 'query1.finance.yahoo.com', 'query2.finance.yahoo.com', 'news.google.com', 'nfs.faireconomy.media', 'call4.tgju.org', 'call.tgju.org'];
async function getUrl(url, asText) {
  const u = new URL(url); if (u.protocol !== 'https:' || !MKHOST.includes(u.hostname)) throw new Error('blocked');
  const ctl = new AbortController(), tm = setTimeout(() => ctl.abort(), 15000);
  try { const r = await fetch(url, { signal: ctl.signal, headers: { 'User-Agent': UA, Accept: '*/*' } }); if (!r.ok) throw new Error('HTTP ' + r.status); return asText ? await r.text() : await r.json(); } finally { clearTimeout(tm); }
}
const YALIAS = { XAUUSD: 'XAUUSD=X', XAGUSD: 'XAGUSD=X', US30: '^DJI', NAS100: '^NDX', SPX500: '^GSPC', US500: '^GSPC', GER40: '^GDAXI', UK100: '^FTSE', JP225: '^N225', USOIL: 'CL=F', WTI: 'CL=F', UKOIL: 'BZ=F', BRENT: 'BZ=F', DXY: 'DX-Y.NYB', XPTUSD: 'PL=F', NATGAS: 'NG=F', COPPER: 'HG=F' };
const FIAT = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'NZD', 'CAD', 'CHF', 'CNY', 'SEK', 'NOK', 'TRY', 'MXN', 'ZAR', 'SGD', 'HKD', 'INR', 'KRW', 'PLN', 'AED', 'SAR'];
const ySym = s => YALIAS[s] || (/^[A-Z]{6}$/.test(s) && FIAT.includes(s.slice(0, 3)) && FIAT.includes(s.slice(3)) ? s + '=X' : /^[A-Z]{3,5}USD$/.test(s) && !FIAT.includes(s.slice(0, 3)) ? s.slice(0, -3) + '-USD' : s);
const YIV = { '1m': ['1m', '5d'], '5m': ['5m', '1mo'], '15m': ['15m', '1mo'], '30m': ['30m', '1mo'], '1h': ['60m', '6mo'], '4h': ['60m', '1y'], '1d': ['1d', '2y'], '1w': ['1wk', '5y'] };
function agg(c, n) { const o = []; let cur = null; for (const x of c) { const k = Math.floor(x.t / (n * 3600000)); if (!cur || cur.k !== k) { cur = { k, t: x.t, o: x.o, h: x.h, l: x.l, c: x.c, v: x.v }; o.push(cur); } else { cur.h = Math.max(cur.h, x.h); cur.l = Math.min(cur.l, x.l); cur.c = x.c; cur.v += x.v; } } return o.map(({ t, o: a, h, l, c: z, v }) => ({ t, o: a, h, l, c: z, v })); }
ipcMain.handle('mk:candles', async (_, symIn, tf) => {
  try {
    const sym = String(symIn).toUpperCase().replace(/[\s/_-]/g, '');
    if (/^[A-Z0-9]{2,10}(USDT|BUSD|USDC|FDUSD)$/.test(sym)) {
      const iv = { '1w': '1w' }[tf] || tf;
      for (const host of ['api.binance.com', 'data-api.binance.vision']) {
        try { const j = await getUrl(`https://${host}/api/v3/klines?symbol=${sym}&interval=${iv}&limit=700`); return { src: 'Binance', sym, candles: j.map(k => ({ t: k[0], o: +k[1], h: +k[2], l: +k[3], c: +k[4], v: +k[5] })) }; } catch (e) { if (host === 'data-api.binance.vision') throw e; }
      }
    }
    const ys = ySym(sym), [iv, rg] = YIV[tf] || YIV['15m'];
    let j; for (const host of ['query1.finance.yahoo.com', 'query2.finance.yahoo.com']) { try { j = await getUrl(`https://${host}/v8/finance/chart/${encodeURIComponent(ys)}?interval=${iv}&range=${rg}&includePrePost=false`); break; } catch (e) { if (host.startsWith('query2')) throw e; } }
    const r = j.chart && j.chart.result && j.chart.result[0]; if (!r || !r.timestamp) throw new Error((j.chart && j.chart.error && j.chart.error.description) || 'no data');
    const q = r.indicators.quote[0]; let c = [];
    r.timestamp.forEach((t, i) => { if (q.open[i] != null && q.high[i] != null && q.low[i] != null && q.close[i] != null) c.push({ t: t * 1000, o: q.open[i], h: q.high[i], l: q.low[i], c: q.close[i], v: q.volume[i] || 0 }); });
    if (tf === '4h') c = agg(c, 4); return { src: 'Yahoo Finance', sym: ys, candles: c.slice(-700) };
  } catch (e) { return { error: e.message }; }
});
ipcMain.handle('mk:text', async (_, url) => { try { return { data: await getUrl(url, true) }; } catch (e) { return { error: e.message }; } });
ipcMain.handle('mk:json', async (_, url) => { try { return { data: await getUrl(url, false) }; } catch (e) { return { error: e.message }; } });

function create() {
  Menu.setApplicationMenu(null);
  win = new BrowserWindow({
    width: 1280, height: 800, minWidth: 900, minHeight: 600, backgroundColor: '#111318', title: 'SEN Launcher',
    icon: path.join(__dirname, 'renderer', 'logo.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, webviewTag: true, spellcheck: false }
  });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', e => e.preventDefault());
  win.on('close', e => { if (!quitting && toTray) { e.preventDefault(); win.hide(); } });
  try {
    tray = new Tray(nativeImage.createFromPath(path.join(__dirname, 'renderer', 'logo.png')).resize({ width: 16 }));
    tray.setToolTip('SEN Launcher');
    tray.setContextMenu(Menu.buildFromTemplate([{ label: 'Show', click: () => win.show() }, { label: 'Quit', click: () => { quitting = true; app.quit(); } }]));
    tray.on('click', () => win.show());
  } catch (e) { log('tray ' + e.message); }
}
const pendingOpen = []; let rendererReady = false;
function routeArg(a) {
  if (!a || a.startsWith('--')) return null; if (/^https?:\/\//i.test(a)) return { url: a };
  try { if (fs.existsSync(a) && fs.statSync(a).isFile()) return { file: a }; } catch {} return null;
}
function openArgs(argv) { for (const a of argv.slice(1)) { const r = routeArg(a); if (!r) continue; if (rendererReady && win) win.webContents.send('app:open', r); else pendingOpen.push(r); } }
ipcMain.handle('app:ready', () => { rendererReady = true; pendingOpen.splice(0).forEach(r => { if (win) win.webContents.send('app:open', r); }); return true; });
ipcMain.handle('app:defaults', () => ext('ms-settings:defaultapps'));
openArgs(process.argv);
app.on('second-instance', (e, argv) => { if (win) { win.show(); win.focus(); } openArgs(argv); });
app.on('before-quit', () => { quitting = true; });
app.on('window-all-closed', () => app.quit());
app.whenReady().then(() => { hook(session.fromPartition('persist:sen-web')); hook(session.fromPartition('sen-private')); create(); });
