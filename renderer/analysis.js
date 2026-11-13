// SEN Analysis engine: smart-money-concepts (structure, order blocks, FVG, liquidity, premium/discount) + projected path + canvas candlestick chart.
// Educational tool: a rule-based model, NOT a prediction guarantee and NOT financial advice.
window.SENAN = (function () {
const sum = a => a.reduce((x, y) => x + y, 0), mean = a => sum(a) / (a.length || 1), sgn = v => v > 0 ? 1 : v < 0 ? -1 : 0, clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ema = (v, n) => { const k = 2 / (n + 1), o = []; let e = v[0]; for (let i = 0; i < v.length; i++) { e = i ? v[i] * k + e * (1 - k) : v[0]; o.push(e); } return o; };
const atrArr = (c, n = 14) => ema(c.map((x, i) => i ? Math.max(x.h - x.l, Math.abs(x.h - c[i - 1].c), Math.abs(x.l - c[i - 1].c)) : x.h - x.l), n);
const rsiArr = (v, n = 14) => { let g = 0, l = 0; const o = [50]; for (let i = 1; i < v.length; i++) { const d = v[i] - v[i - 1]; g = (g * (n - 1) + Math.max(0, d)) / n; l = (l * (n - 1) + Math.max(0, -d)) / n; o.push(l === 0 ? 100 : 100 - 100 / (1 + g / l)); } return o; };
const hashN = n => { const s = Math.sin(n * 127.1 + 11.7) * 43758.5453; return s - Math.floor(s); };

// ---- market structure: swings, BOS / CHoCH ----
function structure(c, k = 3) {
  const n = c.length, sw = [], ev = [], trendAt = new Array(n).fill(0); let hi = null, lo = null, trend = 0;
  for (let i = 0; i < n; i++) {
    const j = i - k;
    if (j >= k) {
      let isH = true, isL = true;
      for (let m = 1; m <= k; m++) { if (c[j].h <= c[j - m].h || c[j].h < c[j + m].h) isH = false; if (c[j].l >= c[j - m].l || c[j].l > c[j + m].l) isL = false; }
      if (isH) { hi = { i: j, p: c[j].h, type: 'H', broken: false }; sw.push(hi); }
      if (isL) { lo = { i: j, p: c[j].l, type: 'L', broken: false }; sw.push(lo); }
    }
    if (hi && !hi.broken && c[i].c > hi.p) { hi.broken = true; ev.push({ i, p: hi.p, from: hi.i, dir: 1, kind: trend === -1 ? 'CHoCH' : 'BOS' }); trend = 1; }
    if (lo && !lo.broken && c[i].c < lo.p) { lo.broken = true; ev.push({ i, p: lo.p, from: lo.i, dir: -1, kind: trend === 1 ? 'CHoCH' : 'BOS' }); trend = -1; }
    trendAt[i] = trend;
  }
  let pH = null, pL = null;
  for (const s of sw) { if (s.type === 'H') { s.lab = pH == null ? 'H' : s.p > pH ? 'HH' : 'LH'; pH = s.p; } else { s.lab = pL == null ? 'L' : s.p > pL ? 'HL' : 'LL'; pL = s.p; } }
  return { sw, ev, trend, trendAt, hi, lo };
}
function orderBlocks(c, st) {
  const out = [];
  for (const e of st.ev.slice(-14)) {
    let m = e.from, q;
    if (e.dir > 0) { for (let i = e.from; i <= e.i; i++) if (c[i].l < c[m].l) m = i; for (q = m; q >= Math.max(0, m - 4); q--) if (c[q].c < c[q].o) break; if (q < Math.max(0, m - 4)) q = m; }
    else { for (let i = e.from; i <= e.i; i++) if (c[i].h > c[m].h) m = i; for (q = m; q >= Math.max(0, m - 4); q--) if (c[q].c > c[q].o) break; if (q < Math.max(0, m - 4)) q = m; }
    const ob = { i: q, hi: c[q].h, lo: c[q].l, dir: e.dir, kind: e.kind, mit: -1, broken: false };
    for (let j = e.i + 1; j < c.length; j++) { if (ob.mit < 0 && ((e.dir > 0 && c[j].l <= ob.hi) || (e.dir < 0 && c[j].h >= ob.lo))) ob.mit = j; if ((e.dir > 0 && c[j].c < ob.lo) || (e.dir < 0 && c[j].c > ob.hi)) { ob.broken = true; break; } }
    out.push(ob);
  }
  return out;
}
function fvgs(c, A) {
  const out = [], n = c.length;
  for (let i = Math.max(2, n - 160); i < n; i++) {
    let g = null;
    if (c[i].l > c[i - 2].h) g = { i: i - 1, lo: c[i - 2].h, hi: c[i].l, dir: 1 }; else if (c[i].h < c[i - 2].l) g = { i: i - 1, lo: c[i].h, hi: c[i - 2].l, dir: -1 };
    if (!g || g.hi - g.lo < A[i] * .15) continue;
    g.filled = false; g.touched = false;
    for (let j = i + 1; j < n; j++) { if (g.dir > 0) { if (c[j].l < g.hi) g.touched = true; if (c[j].l <= g.lo) { g.filled = true; break; } } else { if (c[j].h > g.lo) g.touched = true; if (c[j].h >= g.hi) { g.filled = true; break; } } }
    if (!g.filled) out.push(g);
  }
  return out.slice(-10);
}
function liquidity(c, st, A, tf) {
  const n = c.length, last = c[n - 1].c, a = A[n - 1], tol = Math.max(a * .18, last * .0003), pools = [];
  const hs = st.sw.filter(s => s.type === 'H').slice(-14), ls = st.sw.filter(s => s.type === 'L').slice(-14);
  const swept = (p, i0, dir) => { for (let j = i0 + 1; j < n; j++) if ((dir > 0 && c[j].h > p) || (dir < 0 && c[j].l < p)) return true; return false; };
  const add = (p, i, kind, dir) => { if (!swept(p, i, dir)) pools.push({ p, i, kind, dir }); };
  hs.forEach((s, x) => { let eq = false; for (let y = x + 1; y < hs.length; y++) if (Math.abs(hs[y].p - s.p) <= tol) eq = true; add(s.p, s.i, eq ? 'EQH' : 'SH', 1); });
  ls.forEach((s, x) => { let eq = false; for (let y = x + 1; y < ls.length; y++) if (Math.abs(ls[y].p - s.p) <= tol) eq = true; add(s.p, s.i, eq ? 'EQL' : 'SL', -1); });
  if (tf !== '1d' && tf !== '1w') {
    const day = t => Math.floor(t / 86400000), d0 = day(c[n - 1].t); let pd = null;
    for (let i = n - 1; i >= 0; i--) { if (day(c[i].t) < d0) { const dd = day(c[i].t); let h = -1e18, l = 1e18, i0 = i; for (let j = i; j >= 0 && day(c[j].t) === dd; j--) { h = Math.max(h, c[j].h); l = Math.min(l, c[j].l); i0 = j; } pd = { h, l, i: i0 }; break; } }
    if (pd) { add(pd.h, pd.i, 'PDH', 1); add(pd.l, pd.i, 'PDL', -1); }
  }
  const bsl = pools.filter(x => x.p > last).sort((x, y) => x.p - y.p), ssl = pools.filter(x => x.p < last).sort((x, y) => y.p - x.p);
  // recent stop-runs (wick beyond a swing, close back inside)
  const sweeps = [];
  for (const s of st.sw.slice(-16)) for (let j = s.i + 4; j < n; j++) {
    if (s.type === 'H' && c[j].h > s.p) { if (c[j].c < s.p) sweeps.push({ i: j, p: s.p, dir: 1 }); break; }
    if (s.type === 'L' && c[j].l < s.p) { if (c[j].c > s.p) sweeps.push({ i: j, p: s.p, dir: -1 }); break; }
  }
  return { bsl, ssl, sweeps };
}
function sweepFreq(c, st) {
  let tests = 0, hits = 0;
  for (const s of st.sw.slice(-60)) for (let j = s.i + 4; j < Math.min(c.length, s.i + 40); j++) {
    const beyond = s.type === 'H' ? c[j].h > s.p : c[j].l < s.p; if (!beyond) continue;
    tests++; if (s.type === 'H' ? c[j].c < s.p : c[j].c > s.p) hits++; break;
  }
  return tests >= 4 ? hits / tests : .35;
}
function backtest(c, st, H) {
  const e20 = ema(c.map(x => x.c), 20), e50 = ema(c.map(x => x.c), 50); let ok = 0, tot = 0, up = 0, all = 0;
  for (let i = 60; i < c.length - H; i++) {
    const up1 = c[i + H].c > c[i].c; all++; if (up1) up++;
    const s = st.trendAt[i] * 2 + sgn(e20[i] - e50[i]); if (!s) continue; tot++; if (sgn(s) === (up1 ? 1 : -1)) ok++;
  }
  const upRate = all ? up / all : .5; return { acc: tot ? ok / tot : null, n: tot, base: Math.max(upRate, 1 - upRate) };
}
const HORIZON = { '1m': 30, '5m': 36, '15m': 32, '30m': 24, '1h': 24, '4h': 18, '1d': 14, '1w': 10 };
function buildPath(dir, ctx) {
  const { cur, A, bsl, ssl, H, dipFirst, wickP, step, t0 } = ctx;
  const up = dir > 0, tgtList = up ? bsl : ssl, optList = up ? ssl : bsl;
  const T1 = tgtList[0] && Math.abs(tgtList[0].p - cur) >= .8 * A ? tgtList[0].p : cur + dir * 2.2 * A;
  const T2 = tgtList[1] && Math.abs(tgtList[1].p - cur) > Math.abs(T1 - cur) + .5 * A ? tgtList[1].p : T1 + dir * 1.4 * A;
  let dip = optList[0] && Math.abs(optList[0].p - cur) <= 2.6 * A ? optList[0].p : cur - dir * .9 * A;
  dip = dip - dir * -1 * 0; const wick = dip - dir * .35 * A * (wickP > .45 ? 1 : .6);
  const W = [[0, cur]];
  if (dipFirst) { W.push([.2, cur - dir * .3 * A], [.3, wick], [.5, wick + dir * .55 * (T1 - wick) * dir * dir], [.62, wick + (T1 - wick) * .38], [.86, T1], [1, T1 + (T2 - T1) * .3]); W[3] = [.5, wick + (T1 - wick) * .6]; }
  else W.push([.18, cur + (T1 - cur) * .38], [.34, cur + (T1 - cur) * .2], [.66, T1 - dir * .1 * A], [.84, T1 + dir * .15 * A], [1, T1 - dir * .2 * A + (T2 - T1) * .25]);
  const pts = [];
  for (let b = 0; b <= H; b++) {
    const f = b / H; let k = 0; while (k < W.length - 2 && f > W[k + 1][0]) k++;
    const [f0, p0] = W[k], [f1, p1] = W[k + 1], u = clamp((f - f0) / (f1 - f0 || 1), 0, 1), e = u * u * (3 - 2 * u);
    const noise = (hashN(b * 3.1 + dir * 7 + t0 % 97) - .5) * .22 * A * Math.sin(Math.PI * u);
    pts.push({ k: b, p: p0 + (p1 - p0) * e + noise, t: t0 + b * step });
  }
  return { pts, T1, T2, dip: wick };
}
function sentiment(titles) {
  const bull = /\b(surge|surges|rally|rallies|rise|rises|rose|gain|gains|jump|jumps|soar|soars|record high|bullish|beat|beats|strong|upgrade|boost|recover|rebound|climb|climbs|higher)\b/i, bear = /\b(fall|falls|fell|drop|drops|slump|slumps|plunge|plunges|decline|declines|bearish|miss|misses|weak|downgrade|selloff|sell-off|crash|tumble|tumbles|slide|slides|lower|fear|risk-off)\b/i;
  let b = 0, r = 0; for (const t of titles) { if (bull.test(t)) b++; if (bear.test(t)) r++; } const n = b + r; return { score: n ? (b - r) / n : 0, b, r, n };
}
function analyze(c, o = {}) {
  const tf = o.tf || '15m', n = c.length; if (n < 60) return { error: 'few' };
  const A = atrArr(c), a = A[n - 1], last = c[n - 1].c, cl = c.map(x => x.c), e20 = ema(cl, 20), e50 = ema(cl, 50), e200 = ema(cl, 200), rs = rsiArr(cl);
  const st = structure(c, 3), obs = orderBlocks(c, st), fv = fvgs(c, A), liq = liquidity(c, st, A, tf), H = HORIZON[tf] || 24;
  const step = (() => { const d = []; for (let i = n - 1; i > Math.max(1, n - 30); i--) d.push(c[i].t - c[i - 1].t); d.sort((x, y) => x - y); return d[d.length >> 1] || 60000; })();
  const lastH = st.sw.filter(s => s.type === 'H').slice(-1)[0], lastL = st.sw.filter(s => s.type === 'L').slice(-1)[0];
  const rngHi = lastH ? lastH.p : Math.max(...c.slice(-60).map(x => x.h)), rngLo = lastL ? lastL.p : Math.min(...c.slice(-60).map(x => x.l)), eq = (rngHi + rngLo) / 2, R = Math.max(1e-9, rngHi - rngLo);
  const zones = { hi: rngHi, lo: rngLo, eq, ote: st.trend >= 0 ? [rngHi - .79 * R, rngHi - .618 * R] : [rngLo + .618 * R, rngLo + .79 * R], premium: last > eq };
  const comps = [], add = (key, v, txt) => { if (v) comps.push({ key, v, txt }); };
  add('htf', (o.htfTrend || 0) * 2, 'HTF'); add('struct', st.trend * 2, 'structure');
  const le = st.ev[st.ev.length - 1]; if (le && n - 1 - le.i <= 30) add('event', le.dir * (le.kind === 'CHoCH' ? 2 : 1.5), le.kind);
  add('ema', e20[n - 1] > e50[n - 1] && e50[n - 1] > e200[n - 1] ? 1 : e20[n - 1] < e50[n - 1] && e50[n - 1] < e200[n - 1] ? -1 : 0, 'EMA 20/50/200');
  add('zone', st.trend > 0 ? (zones.premium ? -.5 : 1) : st.trend < 0 ? (zones.premium ? 1 : -.5) : 0, zones.premium ? 'premium' : 'discount');
  const fo = obs.filter(x => x.mit < 0 && !x.broken); const bOB = fo.filter(x => x.dir > 0 && x.hi < last && last - x.hi < 2 * a)[0], sOB = fo.filter(x => x.dir < 0 && x.lo > last && x.lo - last < 2 * a)[0];
  add('ob', (bOB ? 1 : 0) - (sOB ? 1 : 0), 'OB');
  add('fvg', (fv.some(x => x.dir > 0 && x.hi < last && last - x.hi < 2 * a) ? .5 : 0) - (fv.some(x => x.dir < 0 && x.lo > last && x.lo - last < 2 * a) ? .5 : 0), 'FVG');
  const rec = liq.sweeps.filter(s => n - 1 - s.i <= 20); add('sweep', (rec.some(s => s.dir < 0) ? 1.5 : 0) - (rec.some(s => s.dir > 0) ? 1.5 : 0), 'sweep');
  add('rsi', rs[n - 1] > 75 ? -.7 : rs[n - 1] < 25 ? .7 : 0, 'RSI'); add('news', (o.news || 0) * 1, 'news');
  const score = sum(comps.map(x => x.v)), dir = score > 1.5 ? 1 : score < -1.5 ? -1 : 0;
  let conf = dir ? clamp(50 + Math.abs(score) * 6, 50, 88) : 50 - clamp(Math.abs(score) * 3, 0, 15);
  const cal = (o.cal || []).filter(e => e.t - Date.now() > -15 * 60000 && e.t - Date.now() < 60 * 60000);
  if (cal.length) conf *= .85;
  const sf = sweepFreq(c, st), bt = backtest(c, st, Math.min(H, 24)), hr = new Date(c[n - 1].t).getUTCHours();
  const session = hr < 7 ? 'Asia' : hr < 12 ? 'London' : hr < 17 ? 'New York' : hr < 21 ? 'NY close' : 'Asia';
  const dipFirst = dir ? (dir > 0 ? !!(liq.ssl[0] && last - liq.ssl[0].p < 2 * a) : !!(liq.bsl[0] && liq.bsl[0].p - last < 2 * a)) || sf > .45 : false;
  const ctx = { cur: last, A: a, bsl: liq.bsl, ssl: liq.ssl, H, dipFirst, wickP: sf, step, t0: c[n - 1].t };
  const mainDir = dir || (e20[n - 1] >= e50[n - 1] ? 1 : -1), main = buildPath(mainDir, ctx), alt = buildPath(-mainDir, { ...ctx, dipFirst: !dipFirst });
  const wicks = [...liq.bsl.slice(0, 2).map(x => ({ lvl: x.p, lo: x.p, hi: x.p + .4 * a, side: 1, kind: x.kind })), ...liq.ssl.slice(0, 2).map(x => ({ lvl: x.p, lo: x.p - .4 * a, hi: x.p, side: -1, kind: x.kind }))].map(w => ({ ...w, p: Math.round(clamp(sf * 100 * (1 - Math.min(.6, Math.abs(w.lvl - last) / (6 * a))), 8, 75)) }));
  let plan = null;
  if (dir) {
    const zs = [...fo.filter(x => x.dir === dir).map(x => ({ lo: x.lo, hi: x.hi, t: 'OB' })), ...fv.filter(x => x.dir === dir).map(x => ({ lo: x.lo, hi: x.hi, t: 'FVG' })), { lo: Math.min(...zones.ote), hi: Math.max(...zones.ote), t: 'OTE' }];
    const cand = zs.filter(z => dir > 0 ? z.hi <= last + .3 * a : z.lo >= last - .3 * a).sort((x, y) => dir > 0 ? y.hi - x.hi : x.lo - y.lo)[0];
    const entry = cand ? (dir > 0 ? cand.hi : cand.lo) : last, sl = cand ? (dir > 0 ? cand.lo - .3 * a : cand.hi + .3 * a) : last - dir * 1.2 * a, tp1 = main.T1, tp2 = main.T2, risk = Math.abs(entry - sl) || a;
    plan = { dir, entry, sl, tp1, tp2, rr1: Math.abs(tp1 - entry) / risk, rr2: Math.abs(tp2 - entry) / risk, zone: cand ? cand.t : 'market', wait: !!cand && Math.abs(entry - last) > .3 * a };
  }
  return { n, last, atr: a, tf, structure: st, obs: obs.filter(x => !x.broken).slice(-8), fvg: fv, liq, zones, comps, score, dir, conf: Math.round(conf), session, cal, sweepFreq: sf, bt, main, alt, wicks, plan, mainDir, horizon: H, step, rsi: rs[n - 1], e: { e20: e20[n - 1], e50: e50[n - 1], e200: e200[n - 1] } };
}
function trendOf(c) { if (!c || c.length < 60) return 0; const st = structure(c, 3), e = ema(c.map(x => x.c), 50); return sgn(st.trend * 2 + sgn(c[c.length - 1].c - e[e.length - 1])); }

// ---- candlestick chart ----
function chart(cv, opt = {}) {
  const S = { c: [], an: null, col: { bg: '#000000', up: '#00c853', dn: '#ff1744', grid: '#141414', tx: '#8a8f98' }, ov: { ob: 1, fvg: 1, liq: 1, str: 1, zone: 1, fc: 1, wick: 1, plan: 1 }, s: 0, count: 90, x: null, y: null, drag: null, raf: 0, fmt: opt.fmt || (t => new Date(t).toISOString().slice(5, 16)) };
  const g = cv.getContext('2d'); let W = 0, H = 0;
  const R = 66, B = 22;
  function size() { W = cv.clientWidth || 600; H = cv.clientHeight || 400; const d = Math.min(window.devicePixelRatio || 1, 1.5); if (cv.width !== Math.round(W * d) || cv.height !== Math.round(H * d)) { cv.width = Math.round(W * d); cv.height = Math.round(H * d); } g.setTransform(d, 0, 0, d, 0, 0); }
  const fut = () => (S.ov.fc && S.an ? S.an.horizon : 0);
  const clampS = () => { const n = S.c.length; S.count = clamp(S.count, 20, Math.max(20, Math.min(400, n))); S.s = clamp(S.s, 0, Math.max(0, n - S.count)); };
  function draw() {
    S.raf = 0; size(); const c = S.c, n = c.length, col = S.col; g.fillStyle = col.bg; g.fillRect(0, 0, W, H); if (!n) return; clampS();
    const slots = S.count + fut(), pw = W - R, ph = H - B, bw = pw / slots, i0 = S.s, i1 = Math.min(n, S.s + S.count), an = S.an;
    const X = i => (i - i0 + .5) * bw; let lo = 1e18, hi = -1e18;
    for (let i = i0; i < i1; i++) { lo = Math.min(lo, c[i].l); hi = Math.max(hi, c[i].h); }
    if (an && S.ov.fc) for (const p of an.main.pts) { lo = Math.min(lo, p.p); hi = Math.max(hi, p.p); }
    if (an && S.ov.plan && an.plan) for (const v of [an.plan.sl, an.plan.tp1]) { if (v > lo - (hi - lo) * 1 && v < hi + (hi - lo) * 1) { lo = Math.min(lo, v); hi = Math.max(hi, v); } }
    const pad = (hi - lo) * .07 || 1; lo -= pad; hi += pad; const Y = p => ph - (p - lo) / (hi - lo) * ph;
    g.font = '11px "Segoe UI",sans-serif'; g.textBaseline = 'middle';
    g.strokeStyle = col.grid; g.fillStyle = col.tx; g.lineWidth = 1;
    const nice = (hi - lo) / 7, mag = Math.pow(10, Math.floor(Math.log10(nice))), stp = [1, 2, 2.5, 5, 10].map(x => x * mag).find(x => x >= nice) || nice;
    const dec = stp < 1 ? Math.min(6, Math.ceil(-Math.log10(stp)) + 1) : stp < 10 ? 2 : 0, fp = v => v.toFixed(Math.abs(v) >= 1000 ? Math.min(dec, 2) : dec);
    for (let v = Math.ceil(lo / stp) * stp; v < hi; v += stp) { const y = Y(v); g.beginPath(); g.moveTo(0, y); g.lineTo(pw, y); g.stroke(); g.fillText(fp(v), pw + 6, y); }
    const tk = Math.max(1, Math.round(S.count / 6)); for (let i = i0; i < i1; i += tk) { const x = X(i); g.beginPath(); g.moveTo(x, 0); g.lineTo(x, ph); g.stroke(); g.textAlign = 'center'; g.fillText(S.fmt(c[i].t), clamp(x, 40, pw - 40), ph + 11); g.textAlign = 'left'; }
    const clip = () => { g.save(); g.beginPath(); g.rect(0, 0, pw, ph); g.clip(); }, tag = (txt, x, y, color) => { g.fillStyle = color; g.font = '10px "Segoe UI",sans-serif'; g.fillText(txt, x, y); g.font = '11px "Segoe UI",sans-serif'; };
    clip();
    if (an) {
      const xr = Math.min(pw, X(n - 1 + fut()) + bw), rect = (a, b, y0, y1, fill, stroke) => { const x0 = Math.max(0, X(a)), y = Math.min(Y(y0), Y(y1)), h = Math.abs(Y(y0) - Y(y1)); g.fillStyle = fill; g.fillRect(x0, y, Math.max(0, b - x0), Math.max(1, h)); if (stroke) { g.strokeStyle = stroke; g.strokeRect(x0, y, Math.max(0, b - x0), Math.max(1, h)); } };
      if (S.ov.zone) { const z = an.zones; rect(i0, xr, z.hi, z.eq, 'rgba(255,23,68,.05)'); rect(i0, xr, z.eq, z.lo, 'rgba(0,200,83,.05)'); g.strokeStyle = 'rgba(200,200,200,.35)'; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(0, Y(z.eq)); g.lineTo(pw, Y(z.eq)); g.stroke(); g.setLineDash([]); tag('EQ 50%', 6, Y(z.eq) - 7, 'rgba(200,200,200,.7)'); rect(i0, xr, z.ote[0], z.ote[1], 'rgba(255,214,0,.08)'); tag('OTE', 6, Y((z.ote[0] + z.ote[1]) / 2), 'rgba(255,214,0,.8)'); }
      if (S.ov.fvg) for (const f of an.fvg) { rect(f.i, xr, f.lo, f.hi, f.dir > 0 ? 'rgba(41,182,246,.16)' : 'rgba(255,152,0,.16)'); tag('FVG', Math.max(4, X(f.i)), Y(f.hi) - 6, f.dir > 0 ? '#29b6f6' : '#ff9800'); }
      if (S.ov.ob) for (const o of an.obs) { const fresh = o.mit < 0; rect(o.i, xr, o.lo, o.hi, o.dir > 0 ? `rgba(0,200,83,${fresh ? .2 : .08})` : `rgba(255,23,68,${fresh ? .2 : .08})`, o.dir > 0 ? 'rgba(0,200,83,.5)' : 'rgba(255,23,68,.5)'); tag((o.dir > 0 ? 'Bull OB' : 'Bear OB') + (fresh ? '' : ' (mit.)'), Math.max(4, X(o.i)), Y(o.hi) - 6, o.dir > 0 ? '#00e676' : '#ff5252'); }
      if (S.ov.liq) { g.setLineDash([6, 4]); for (const p of [...an.liq.bsl.slice(0, 4), ...an.liq.ssl.slice(0, 4)]) { g.strokeStyle = p.dir > 0 ? 'rgba(255,82,82,.7)' : 'rgba(105,240,174,.7)'; g.beginPath(); g.moveTo(Math.max(0, X(p.i)), Y(p.p)); g.lineTo(pw, Y(p.p)); g.stroke(); tag((p.dir > 0 ? 'BSL ' : 'SSL ') + p.kind, pw - 74, Y(p.p) - 6, p.dir > 0 ? '#ff8a80' : '#b9f6ca'); } g.setLineDash([]); }
      if (S.ov.str) {
        for (const e of an.structure.ev.slice(-8)) { if (e.i < i0) continue; g.strokeStyle = e.dir > 0 ? 'rgba(0,230,118,.7)' : 'rgba(255,82,82,.7)'; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(X(e.from), Y(e.p)); g.lineTo(X(e.i), Y(e.p)); g.stroke(); g.setLineDash([]); tag(e.kind, (X(e.from) + X(e.i)) / 2 - 10, Y(e.p) + (e.dir > 0 ? -8 : 9), e.dir > 0 ? '#69f0ae' : '#ff8a80'); }
        for (const s of an.structure.sw.slice(-24)) if (s.i >= i0 && s.i < i1) tag(s.lab, X(s.i) - 7, s.type === 'H' ? Y(s.p) - 9 : Y(s.p) + 10, 'rgba(200,200,210,.7)');
        for (const s of an.liq.sweeps) if (s.i >= i0 && s.i < i1) { g.fillStyle = '#ffd600'; g.beginPath(); const x = X(s.i), y = Y(s.p); g.moveTo(x, y + (s.dir > 0 ? -4 : 4)); g.lineTo(x - 4, y + (s.dir > 0 ? -12 : 12)); g.lineTo(x + 4, y + (s.dir > 0 ? -12 : 12)); g.fill(); }
      }
    }
    g.restore();
    // candles
    clip(); const body = Math.max(1, bw * .62);
    for (let i = i0; i < i1; i++) { const k = c[i], x = X(i), up = k.c >= k.o, cc = up ? col.up : col.dn; g.strokeStyle = cc; g.fillStyle = cc; g.lineWidth = 1; g.beginPath(); g.moveTo(x, Y(k.h)); g.lineTo(x, Y(k.l)); g.stroke(); const y1 = Y(Math.max(k.o, k.c)), y2 = Y(Math.min(k.o, k.c)); g.fillRect(x - body / 2, y1, body, Math.max(1, y2 - y1)); }
    g.restore(); clip();
    if (an && S.ov.wick) for (const w of an.wicks) { const x0 = X(n - 1) + bw, x1 = Math.min(pw, X(n - 1 + fut()) + bw), y0 = Y(w.hi), y1 = Y(w.lo); g.fillStyle = w.side > 0 ? 'rgba(255,214,0,.16)' : 'rgba(255,214,0,.16)'; g.fillRect(x0, Math.min(y0, y1), x1 - x0, Math.max(3, Math.abs(y1 - y0))); g.strokeStyle = 'rgba(255,214,0,.6)'; g.setLineDash([2, 3]); g.strokeRect(x0, Math.min(y0, y1), x1 - x0, Math.max(3, Math.abs(y1 - y0))); g.setLineDash([]); tag(`wick ~${w.p}%`, x0 + 4, (y0 + y1) / 2, '#ffd600'); }
    if (an && S.ov.fc) {
      const path = (pts, color, lw, dash, alpha) => { g.globalAlpha = alpha; g.strokeStyle = color; g.lineWidth = lw; g.setLineDash(dash); g.shadowColor = color; g.shadowBlur = alpha > .6 ? 8 : 0; g.beginPath(); pts.forEach((p, j) => { const x = X(n - 1 + p.k), y = Y(p.p); j ? g.lineTo(x, y) : g.moveTo(x, y); }); g.stroke(); g.setLineDash([]); g.shadowBlur = 0; g.globalAlpha = 1; };
      path(an.alt.pts, '#b0b0b0', 1.4, [3, 5], .45); const col2 = an.mainDir > 0 ? '#00e676' : '#ff5252'; path(an.main.pts, col2, 2.2, [7, 4], .95);
      const a = an.main.pts, e = a[a.length - 1], pr = a[a.length - 2], ang = Math.atan2(Y(e.p) - Y(pr.p), X(n - 1 + e.k) - X(n - 1 + pr.k)), ex = X(n - 1 + e.k), ey = Y(e.p);
      g.fillStyle = col2; g.beginPath(); g.moveTo(ex, ey); g.lineTo(ex - 10 * Math.cos(ang - .45), ey - 10 * Math.sin(ang - .45)); g.lineTo(ex - 10 * Math.cos(ang + .45), ey - 10 * Math.sin(ang + .45)); g.fill();
      tag(`T1 ${fp(an.main.T1)}`, Math.min(pw - 90, X(n - 1 + Math.round(an.horizon * .85)) - 20), Y(an.main.T1) - 8, col2);
    }
    if (an && S.ov.plan && an.plan) { const p = an.plan; for (const [v, lab, cc] of [[p.entry, 'Entry', '#ffffff'], [p.sl, 'SL', '#ff5252'], [p.tp1, 'TP1', '#69f0ae'], [p.tp2, 'TP2', '#69f0ae']]) { g.strokeStyle = cc; g.globalAlpha = .55; g.setLineDash([2, 4]); g.beginPath(); g.moveTo(X(n - 1), Y(v)); g.lineTo(pw, Y(v)); g.stroke(); g.setLineDash([]); g.globalAlpha = 1; tag(`${lab} ${fp(v)}`, X(n - 1) + 6, Y(v) - 6, cc); } }
    g.restore();
    const lp = c[n - 1].c, ly = Y(lp), upc = c[n - 1].c >= c[n - 1].o ? col.up : col.dn;
    g.strokeStyle = upc; g.globalAlpha = .6; g.setLineDash([2, 3]); g.beginPath(); g.moveTo(0, ly); g.lineTo(pw, ly); g.stroke(); g.setLineDash([]); g.globalAlpha = 1; g.fillStyle = upc; g.fillRect(pw, ly - 9, R, 18); g.fillStyle = '#000'; g.fillText(fp(lp), pw + 6, ly);
    if (S.x != null && S.x < pw && S.y < ph) {
      g.strokeStyle = 'rgba(255,255,255,.3)'; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(S.x, 0); g.lineTo(S.x, ph); g.moveTo(0, S.y); g.lineTo(pw, S.y); g.stroke(); g.setLineDash([]);
      const pv = lo + (ph - S.y) / ph * (hi - lo); g.fillStyle = '#2a2a2a'; g.fillRect(pw, S.y - 9, R, 18); g.fillStyle = '#fff'; g.fillText(fp(pv), pw + 6, S.y);
      const i = Math.floor(S.x / bw + i0); if (i >= i0 && i < i1 && opt.onHover) opt.onHover(c[i], i);
    }
  }
  const req = () => { if (!S.raf) S.raf = requestAnimationFrame(draw); };
  cv.addEventListener('wheel', e => { e.preventDefault(); const k = e.deltaY > 0 ? 1.15 : .87, old = S.count; S.count = clamp(Math.round(S.count * k), 20, Math.min(400, S.c.length || 400)); S.s += old - S.count; req(); }, { passive: false });
  cv.addEventListener('pointerdown', e => { S.drag = { x: e.clientX, s: S.s }; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); S.x = e.clientX - r.left; S.y = e.clientY - r.top; if (S.drag) { const bw = (W - R) / (S.count + fut()); S.s = Math.round(S.drag.s - (e.clientX - S.drag.x) / bw); } req(); });
  cv.addEventListener('pointerup', () => { S.drag = null; }); cv.addEventListener('pointerleave', () => { S.x = null; req(); });
  cv.addEventListener('dblclick', () => { S.count = 90; S.s = Math.max(0, S.c.length - 90); req(); });
  return { set(c, an) { const first = !S.c.length || (c.length && S.c[0] && c[0].t !== S.c[0].t), wasEnd = S.s >= Math.max(0, S.c.length - S.count) - 1; S.c = c; S.an = an; if (first) { S.count = 90; S.s = Math.max(0, c.length - 90); } else if (wasEnd) S.s = Math.max(0, c.length - S.count); req(); }, setColors(o) { Object.assign(S.col, o); req(); }, setOv(o) { Object.assign(S.ov, o); req(); }, redraw: req, fmt(f) { S.fmt = f; req(); }, destroy() { cancelAnimationFrame(S.raf); } };
}
return { analyze, chart, sentiment, trendOf };
})();
