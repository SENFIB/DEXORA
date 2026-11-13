// SEN Download Manager engine: segmented multi-connection downloads, resume, queue, speed limit, scheduler, clipboard watcher
const fs = require('fs'), path = require('path'), http = require('http'), https = require('https');
module.exports = function ({ app, ipcMain, shell, clipboard, getWin, log, UA }) {
  const FILE = () => path.join(app.getPath('userData'), 'downloads.json');
  const CAT = { Video: 'mp4 mkv avi mov wmv webm flv m4v ts mpg mpeg', Music: 'mp3 flac wav aac m4a ogg opus wma', Documents: 'pdf doc docx xls xlsx ppt pptx txt epub csv', Programs: 'exe msi apk dmg iso bat', Compressed: 'zip rar 7z tar gz bz2 xz', Images: 'jpg jpeg png gif webp bmp svg' };
  const catOf = n => { const e = path.extname(n).slice(1).toLowerCase(); for (const k in CAT) if (CAT[k].split(' ').includes(e)) return k; return 'Other'; };
  let cfg = { max: 3, conn: 8, limit: 0, dir: '', clip: true, capture: true, sniff: true, retry: 6, sched: { on: false, time: '02:00' } }, jobs = [];
  const strip = j => { const o = { ...j }; delete o.rt; return o; };
  let saveT = null;
  const save = () => { clearTimeout(saveT); saveT = setTimeout(() => { try { fs.writeFileSync(FILE() + '.tmp', JSON.stringify({ cfg, jobs: jobs.map(strip) })); fs.renameSync(FILE() + '.tmp', FILE()); } catch (e) { log('dm save ' + e.message); } }, 800); };
  try { const d = JSON.parse(fs.readFileSync(FILE(), 'utf8')); cfg = { ...cfg, ...d.cfg, sched: { ...cfg.sched, ...((d.cfg || {}).sched || {}) } }; jobs = d.jobs || []; jobs.forEach(j => { if (j.status === 'downloading' || j.status === 'queued') j.status = 'paused'; }); } catch {}
  if (!cfg.dir) cfg.dir = path.join(app.getPath('downloads'), 'SEN');
  const light = j => ({ id: j.id, url: j.url, name: j.name, cat: j.cat, size: j.size, got: j.got, speed: j.speed || 0, status: j.status, error: j.error, added: j.added, done: j.done, file: j.file, conn: j.conn, resumable: j.resumable });
  const send = (ch, d) => { const w = getWin(); if (w && !w.isDestroyed()) w.webContents.send(ch, d); };
  let pushT = null; const push = () => { if (pushT) return; pushT = setTimeout(() => { pushT = null; send('dm:all', jobs.map(light)); }, 150); };
  let upT = null;
  function ticker() {
    if (upT) return;
    upT = setInterval(() => {
      const act = jobs.filter(j => j.status === 'downloading');
      for (const j of act) { j.speed = Math.max(0, j.got - (j.rt.last || 0)); j.rt.last = j.got; }
      const w = getWin(); if (w && w.isVisible() && !w.isMinimized()) send('dm:upd', act.map(j => ({ id: j.id, got: j.got, size: j.size, speed: j.speed, status: j.status, name: j.name })));
      if (!act.length) { clearInterval(upT); upT = null; }
    }, 1000);
  }
  // --- http helpers ---
  const hdrs = (j, extra) => ({ 'User-Agent': UA, Accept: '*/*', 'Accept-Encoding': 'identity', ...(j.referer ? { Referer: j.referer } : {}), ...(j.cookie ? { Cookie: j.cookie } : {}), ...extra });
  function req(url, headers, cb) {
    const u = new URL(url), lib = u.protocol === 'https:' ? https : http;
    const r = lib.request(u, { method: 'GET', headers, timeout: 25000 }, res => cb(null, res));
    r.on('error', e => cb(e)); r.on('timeout', () => r.destroy(new Error('timeout'))); r.end(); return r;
  }
  function nameFrom(cd, url) {
    let n = null;
    if (cd) { let m = /filename\*\s*=\s*(?:UTF-8|utf-8)''([^;]+)/i.exec(cd); if (m) { try { n = decodeURIComponent(m[1]); } catch {} } if (!n) { m = /filename\s*=\s*"?([^";]+)"?/i.exec(cd); if (m) n = m[1]; } }
    if (!n) { try { n = decodeURIComponent(new URL(url).pathname.split('/').pop() || ''); } catch {} }
    n = String(n || 'download').replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').trim(); return n || 'download';
  }
  function probe(j, cb, depth = 0) {
    const url = j.finalUrl || j.url;
    req(url, hdrs(j, { Range: 'bytes=0-0' }), (err, res) => {
      if (err) return cb(err);
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && depth < 8) { res.destroy(); j.finalUrl = new URL(res.headers.location, url).toString(); return probe(j, cb, depth + 1); }
      const code = res.statusCode, h = res.headers; res.destroy();
      if (code === 206) { const m = /\/(\d+)\s*$/.exec(h['content-range'] || ''); j.size = m ? +m[1] : 0; j.resumable = !!m; }
      else if (code === 200) { j.size = +h['content-length'] || 0; j.resumable = /bytes/i.test(h['accept-ranges'] || '') && j.size > 0; }
      else return cb(new Error('HTTP ' + code));
      if (!j.nameSet) j.name = nameFrom(h['content-disposition'], j.finalUrl || j.url);
      cb(null);
    });
  }
  // --- bandwidth limiter ---
  let bucket = 0, waiting = [], lim = null;
  const flush = () => { const w = waiting; waiting = []; w.forEach(f => f()); };
  function ensureLim() {
    if (cfg.limit && !lim) lim = setInterval(() => { const add = cfg.limit * 1024 * .1; bucket = Math.min(bucket + add, add); if (bucket > 0 && waiting.length) flush(); }, 100);
    if (!cfg.limit && lim) { clearInterval(lim); lim = null; bucket = 0; flush(); }
  }
  const throttle = (len, cb) => { if (!cfg.limit) return cb(); bucket -= len; if (bucket >= 0) return cb(); waiting.push(cb); };
  // --- job control ---
  const abortAll = j => { (j.rt && j.rt.reqs || []).forEach(r => { try { r && r.destroy(); } catch {} }); if (j.rt) j.rt.reqs = []; };
  const closeFd = j => { if (j.rt && j.rt.fd != null) { try { fs.closeSync(j.rt.fd); } catch {} j.rt.fd = null; } };
  function fail(j, msg) { if (j.status !== 'downloading') return; abortAll(j); closeFd(j); j.status = 'error'; j.error = String(msg); j.speed = 0; push(); save(); pump(); }
  function pause(j) { if (j.status === 'completed') return; abortAll(j); closeFd(j); j.status = 'paused'; j.speed = 0; push(); save(); pump(); }
  function prepare(j) {
    if (!j.dirSet || !j.dir) { j.cat = j.catSet ? j.cat : catOf(j.name); j.dir = path.join(cfg.dir, j.cat); }
    fs.mkdirSync(j.dir, { recursive: true });
    j.part = path.join(j.dir, j.name + '.sen');
    if (j.got > 0 && !fs.existsSync(j.part)) { j.segs = []; j.got = 0; }
    if (!j.segs || !j.segs.length) {
      if (j.resumable && j.size > 0) { const n = Math.max(1, Math.min(j.conn, Math.ceil(j.size / (512 * 1024)))), L = Math.ceil(j.size / n); j.segs = Array.from({ length: n }, (_, i) => { const a = i * L; return { a, b: Math.min(j.size - 1, a + L - 1), p: a, done: false, r: 0 }; }); }
      else j.segs = [{ a: 0, b: j.size > 0 ? j.size - 1 : -1, p: 0, done: false, r: 0 }];
      j.got = 0;
    }
    const existed = fs.existsSync(j.part); j.rt.fd = fs.openSync(j.part, existed ? 'r+' : 'w+');
    if (!existed && j.size > 0) fs.ftruncateSync(j.rt.fd, j.size);
  }
  function startJob(j) {
    if (j.status === 'downloading') return;
    j.status = 'downloading'; j.error = ''; j.rt = { reqs: [], last: j.got || 0, fd: null }; ensureLim(); push(); ticker();
    const go = () => { if (j.status !== 'downloading') return; try { prepare(j); } catch (e) { return fail(j, e.message); } j.segs.forEach((s, i) => { if (!s.done) seg(j, i); }); };
    if (!j.probed) probe(j, err => { if (j.status !== 'downloading') return; if (err) return fail(j, err.message); j.probed = true; save(); go(); }); else go();
  }
  function restart(j) { abortAll(j); closeFd(j); try { fs.unlinkSync(j.part); } catch {} j.segs = []; j.got = 0; j.status = 'paused'; startJob(j); }
  function retry(j, i, msg) {
    if (j.status !== 'downloading') return; const s = j.segs[i]; s.r = (s.r || 0) + 1;
    if (s.r > cfg.retry) return fail(j, msg);
    setTimeout(() => seg(j, i), Math.min(15000, 800 * 2 ** s.r));
  }
  function seg(j, i) {
    const s = j.segs[i]; if (!s || s.done || j.status !== 'downloading') return;
    const h = hdrs(j, j.resumable ? { Range: `bytes=${s.p}-${s.b >= 0 ? s.b : ''}` } : {});
    const r = req(j.finalUrl || j.url, h, (err, res) => {
      if (err) return retry(j, i, err.message);
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) { res.destroy(); j.finalUrl = new URL(res.headers.location, j.finalUrl || j.url).toString(); return seg(j, i); }
      if (j.resumable && res.statusCode === 200) { if (j.segs.length > 1 || s.p > 0) { res.destroy(); j.resumable = false; return restart(j); } }
      else if (res.statusCode !== 200 && res.statusCode !== 206) { res.destroy(); return retry(j, i, 'HTTP ' + res.statusCode); }
      res.on('data', chunk => {
        if (j.status !== 'downloading' || s.done) return;
        let buf = chunk; if (s.b >= 0) { const room = s.b - s.p + 1; if (room <= 0) return; if (buf.length > room) buf = buf.subarray(0, room); }
        const pos = s.p; s.p += buf.length; j.got += buf.length; const fin = s.b >= 0 && s.p > s.b;
        res.pause();
        fs.write(j.rt.fd, buf, 0, buf.length, pos, e => {
          if (e) return fail(j, e.message);
          throttle(buf.length, () => { if (j.status !== 'downloading') return; if (fin) { s.done = true; res.destroy(); segDone(j); } else res.resume(); });
        });
      });
      res.on('end', () => { if (!s.done && s.b < 0 && j.status === 'downloading') { s.done = true; j.size = j.got; segDone(j); } });
      res.on('close', () => { if (!s.done && j.status === 'downloading') retry(j, i, 'connection closed'); });
      res.on('error', () => {});
    });
    j.rt.reqs[i] = r;
  }
  function segDone(j) {
    if (!j.segs.some(s => !s.done)) return finish(j);
    if (j.resumable && j.segs.filter(s => !s.done).length < j.conn) {
      let big = null, bl = 0; j.segs.forEach(s => { if (!s.done && s.b >= 0) { const l = s.b - s.p + 1; if (l > bl) { bl = l; big = s; } } });
      if (big && bl > 2 * 1024 * 1024) { const mid = big.p + Math.floor(bl / 2); j.segs.push({ a: mid, b: big.b, p: mid, done: false, r: 0 }); big.b = mid - 1; seg(j, j.segs.length - 1); }
    }
  }
  function finish(j) {
    closeFd(j); abortAll(j);
    try {
      const ext = path.extname(j.name), base = path.basename(j.name, ext); let fn = j.name, n = 1;
      while (fs.existsSync(path.join(j.dir, fn))) fn = `${base} (${n++})${ext}`;
      j.file = path.join(j.dir, fn); fs.renameSync(j.part, j.file);
    } catch (e) { return fail(j, e.message); }
    j.status = 'completed'; j.done = Date.now(); j.speed = 0; j.segs = []; push(); save(); send('dm:done', { id: j.id, name: path.basename(j.file) }); pump();
  }
  function pump() {
    let slots = cfg.max - jobs.filter(x => x.status === 'downloading').length;
    for (const j of jobs) { if (slots <= 0) break; if (j.status === 'queued') { startJob(j); slots--; } }
  }
  function add(items, fromBrowser) {
    const ids = [];
    for (const it of items) {
      if (!/^https?:\/\//i.test(it.url || '')) continue;
      const nm = it.name || nameFrom(null, it.url);
      const j = { id: Math.random().toString(36).slice(2, 10), url: it.url, referer: it.referer || '', cookie: it.cookie || '', name: nm, nameSet: !!it.name, dir: it.dir || '', dirSet: !!it.dir, cat: catOf(nm), catSet: false,
        conn: it.conn || cfg.conn, size: null, got: 0, segs: [], status: it.paused ? 'paused' : 'queued', added: Date.now(), probed: false };
      jobs.unshift(j); ids.push(j.id);
    }
    push(); save(); pump(); if (fromBrowser) send('dm:captured', items.length); return ids;
  }
  function act(a, id) {
    const j = jobs.find(x => x.id === id);
    if (a === 'pauseall') jobs.forEach(x => { if (x.status === 'downloading' || x.status === 'queued') pause(x); });
    else if (a === 'resumeall') { jobs.forEach(x => { if (x.status === 'paused' || x.status === 'error') x.status = 'queued'; }); pump(); push(); }
    else if (a === 'clear') { jobs = jobs.filter(x => x.status !== 'completed'); push(); save(); }
    else if (!j) return;
    else if (a === 'pause') pause(j);
    else if (a === 'resume' || a === 'retry') { j.status = 'queued'; j.error = ''; if (a === 'retry') j.segs.forEach(s => { s.r = 0; }); pump(); push(); }
    else if (a === 'remove' || a === 'removefile') { pause(j); if (a === 'removefile') { try { fs.unlinkSync(j.file || j.part); } catch {} try { if (j.part) fs.unlinkSync(j.part); } catch {} } else if (j.status !== 'completed') { try { fs.unlinkSync(j.part); } catch {} } jobs = jobs.filter(x => x !== j); push(); save(); }
    else if (a === 'open' && j.file) shell.openPath(j.file);
    else if (a === 'folder') shell.showItemInFolder(j.file || j.part || cfg.dir);
  }
  // --- clipboard watcher & scheduler ---
  let clipT = null, schT = null, lastClip = '', lastDay = '';
  const LINK = /^https?:\/\/\S+\.(zip|rar|7z|exe|msi|iso|apk|mp4|mkv|avi|mov|webm|mp3|flac|wav|m4a|pdf|docx?|xlsx?|pptx?|tar|gz|dmg)(\?\S*)?$/i;
  function applyCfg() {
    ensureLim(); if (clipT) { clearInterval(clipT); clipT = null; } if (schT) { clearInterval(schT); schT = null; }
    if (cfg.clip) clipT = setInterval(() => { const w = getWin(); if (!w || !w.isVisible() || w.isMinimized()) return; let t = ''; try { t = clipboard.readText().trim(); } catch {} if (t && t !== lastClip && LINK.test(t)) { lastClip = t; send('dm:clip', t); } }, 2500);
    if (cfg.sched.on) schT = setInterval(() => { const d = new Date(), hm = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'), key = d.toDateString() + hm; if (hm === cfg.sched.time && key !== lastDay) { lastDay = key; act('resumeall'); } }, 30000);
  }
  ipcMain.handle('dm:list', () => ({ cfg, jobs: jobs.map(light) }));
  ipcMain.handle('dm:add', (_, items) => add(items, false));
  ipcMain.handle('dm:act', (_, a, id) => { act(a, id); return true; });
  ipcMain.handle('dm:cfg', (_, p) => { cfg = { ...cfg, ...p, sched: { ...cfg.sched, ...((p || {}).sched || {}) } }; applyCfg(); save(); pump(); return cfg; });
  applyCfg();
  return { add, cfg: () => cfg };
};
