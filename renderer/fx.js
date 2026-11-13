// SEN scenic effects: procedural canvas scenes (car on the road in different weather/environments/cameras)
(function () {
const hex = c => { const n = parseInt(c.slice(1), 16); return [n >> 16, n >> 8 & 255, n & 255]; };
const h2 = n => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
const mix = (a, b, k) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => h2(Math.round(v + (B[i] - v) * k))).join(''); };
const dim = (c, k) => mix(c, '#000000', 1 - k);
const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const TAU = Math.PI * 2;
const ENV = {
  mountain: { amp: .30, fr: .0055, ground: '#4a6b3a' },
  desert: { amp: .13, fr: .0035, tint: '#d9a45f', k: .6, ground: '#d7a866' },
  forest: { amp: .20, fr: .007, tint: '#2f6b3a', k: .5, ground: '#2e5a30' },
  snow: { amp: .32, fr: .0065, tint: '#ffffff', k: .55, ground: '#e8eef5' },
  coast: { amp: .10, fr: .004, tint: '#2d6f9e', k: .3, ground: '#d9c493' },
  city: { amp: 0, tint: '#1a1a2e', k: .7, ground: '#2a2a33' }
};
const WEA = {
  sun: { sky: ['#3a9bff', '#cfeaff'], m: ['#8aa2bd', '#6a86a3', '#4a6a52'], a: 1, sunc: '#fff4c0', cl: '#ffffff', ca: .85 },
  cloud: { sky: ['#6f8196', '#c9d3dd'], m: ['#8a98a8', '#7a8898', '#5d6e66'], a: .85, cl: '#eef2f6', ca: .92 },
  rain: { sky: ['#4a5260', '#9aa4ae'], m: ['#707a86', '#5a6571', '#3a4a42'], a: .78, cl: '#59616d', ca: .8 },
  storm: { sky: ['#141826', '#444c62'], m: ['#343c4e', '#282f3f', '#1a212b'], a: .55, cl: '#2a3040', ca: .85 },
  fog: { sky: ['#b3bcc4', '#e3e8eb'], m: ['#aeb7be', '#9ba6ae', '#86948b'], a: .92, cl: '#dfe4e8', ca: .7 },
  snow: { sky: ['#8ea5c0', '#e9f1f9'], m: ['#dfe8f2', '#c3d1e0', '#a9bccf'], a: 1, cl: '#cfd9e4', ca: .8 },
  night: { sky: ['#03050e', '#1b2252'], m: ['#151b3a', '#10152d', '#0b0f22'], a: .45, cl: '#1a2040', ca: .6 },
  sunset: { sky: ['#43286e', '#ffb865'], m: ['#6d3e6e', '#4e2c5a', '#2f1c40'], a: .8, sunc: '#ffd9a0', cl: '#ffc08a', ca: .7 },
  neon: { sky: ['#0b0320', '#4a0f6b'], m: ['#1f0b3d', '#150832', '#0d0522'], a: .55, cl: '#3a1a5c', ca: .6 }
};
// [environment, weather, camera, car colour]
const SC = [
  ['mountain', 'sun', 'side', '#d83a3a'], ['mountain', 'rain', 'pov'], ['desert', 'sun', 'side', '#e8a020'], ['desert', 'night', 'pov'],
  ['forest', 'rain', 'side', '#2a6fd1'], ['forest', 'sun', 'pov'], ['mountain', 'sun', 'orbit', '#d83a3a'], ['city', 'rain', 'orbit', '#e8e8ee'],
  ['snow', 'snow', 'side', '#cc3333'], ['coast', 'sunset', 'side', '#f2c200'], ['forest', 'fog', 'pov'], ['mountain', 'storm', 'side', '#3a7bd5'],
  ['city', 'neon', 'pov'], ['desert', 'sunset', 'orbit', '#2fb27a'], ['forest', 'fog', 'orbit', '#7a4bd1']
];
function mk(spec) {
  const [env, wea, cam, car, x] = typeof spec === 'number' ? SC[spec % SC.length] : spec;
  const E = ENV[env], W = WEA[wea];
  const m = W.m.map(c => E.tint ? mix(c, E.tint, E.k) : c);
  const ground = dim(wea === 'snow' && env !== 'snow' ? mix(E.ground, '#ffffff', .5) : E.ground, W.a);
  return { env, wea, cam, car: car || '#d83a3a', x: x || {}, E, W, m, ground, sky: W.sky, tree: dim(env === 'snow' ? '#dfeaf2' : env === 'desert' ? '#4d8a3d' : '#2f6b3a', Math.max(.55, W.a)) };
}
function ridge(g, W, H, base, amp, fr, off, col, seed) {
  g.beginPath(); g.moveTo(0, H);
  for (let x = 0; x <= W + 8; x += 8) { const u = (x + off) * fr; const v = Math.sin(u + seed) * .55 + Math.sin(u * 2.3 + seed * 2) * .3 + Math.sin(u * 5.1 + seed * 3) * .15; g.lineTo(x, base - amp * (.55 + .45 * v)); }
  g.lineTo(W, H); g.closePath(); g.fillStyle = col; g.fill();
}
function cityL(g, W, hy, off, col, lit, seed, hmax) {
  const bw = 46, i0 = Math.floor(off / bw);
  for (let i = i0 - 1; i < i0 + W / bw + 2; i++) {
    const w = bw * (.7 + hash(i + seed) * .9), x = i * bw - off, hh = hmax * (.25 + hash(i * 3 + seed) * .75);
    g.fillStyle = col; g.fillRect(x, hy - hh, w, hh + 4);
    if (lit) for (let yy = hy - hh + 6; yy < hy - 4; yy += 9) for (let xx = x + 4; xx < x + w - 4; xx += 8) if (hash(xx * .37 + yy * 1.7 + i) > .62) { g.fillStyle = hash(xx + yy) > .5 ? '#ffd27a' : '#7ad7ff'; g.fillRect(xx, yy, 3, 4); }
  }
}
function prop(g, sc, x, y, s) {
  const env = sc.env, dark = /night|neon|storm|rain|sunset/.test(sc.wea);
  if (env === 'desert') {
    g.fillStyle = sc.tree; const w = s * .14;
    g.fillRect(x - w / 2, y - s, w, s); g.fillRect(x - s * .3, y - s * .6, s * .3, w * .8); g.fillRect(x - s * .3, y - s * .8, w * .8, s * .2 + w * .8);
    g.fillRect(x + w / 2, y - s * .45, s * .28, w * .8); g.fillRect(x + w / 2 + s * .28 - w * .8, y - s * .63, w * .8, s * .18 + w * .8);
  } else if (env === 'city') {
    g.fillStyle = '#3b3d46'; g.fillRect(x - s * .02, y - s, s * .04, s); g.fillRect(x - s * .02, y - s, s * .22, s * .04);
    g.fillStyle = dark ? '#ffe9a0' : '#cfcfcf'; g.beginPath(); g.arc(x + s * .2, y - s * .97, s * .05, 0, TAU); g.fill();
  } else if (env === 'coast') {
    g.strokeStyle = '#6b4a2b'; g.lineWidth = Math.max(1, s * .06); g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + s * .1, y - s * .5, x + s * .05, y - s); g.stroke();
    g.strokeStyle = '#3f8f45'; g.lineWidth = Math.max(1, s * .05);
    for (const a of [-2.7, -2.1, -1.3, -.6, .1]) { g.beginPath(); g.moveTo(x + s * .05, y - s); g.lineTo(x + s * .05 + Math.cos(a) * s * .38, y - s + Math.sin(a) * s * .25 + s * .12); g.stroke(); }
  } else {
    g.fillStyle = '#4a3526'; g.fillRect(x - s * .03, y - s * .2, s * .06, s * .2);
    for (let k = 0; k < 3; k++) {
      const w = s * (.34 - k * .07), top = y - s * (.25 + k * .27), bot = y - s * (.2 + k * .2);
      g.fillStyle = sc.tree; g.beginPath(); g.moveTo(x - w, bot); g.lineTo(x, top - s * .3); g.lineTo(x + w, bot); g.closePath(); g.fill();
      if (env === 'snow') { g.fillStyle = '#fff'; g.beginPath(); g.moveTo(x - w * .5, top - s * .08); g.lineTo(x, top - s * .3); g.lineTo(x + w * .5, top - s * .08); g.closePath(); g.fill(); }
    }
  }
}
function propsRow(g, sc, W, baseY, size, off, gap, seed) {
  const i0 = Math.floor(off / gap) - 1;
  for (let i = i0; i < i0 + W / gap + 3; i++) {
    if (hash(i * 7 + seed) < .25) continue;
    prop(g, sc, i * gap - off + hash(i + seed) * gap * .5, baseY, size * (.7 + hash(i + seed * 2) * .6));
  }
}
function bg(g, W, H, sc, hy, ob) {
  const E = sc.E;
  if (sc.env === 'city') {
    const lit = /night|neon|storm|rain|sunset/.test(sc.wea);
    cityL(g, W, hy, ob * .05, sc.m[0], false, 1, H * .34); cityL(g, W, hy, ob * .12, sc.m[1], lit, 7, H * .28); cityL(g, W, hy, ob * .25, sc.m[2], lit, 13, H * .22);
  } else {
    ridge(g, W, H, hy + 2, H * E.amp, E.fr, ob * .05, sc.m[0], 1); ridge(g, W, H, hy + 6, H * E.amp * .75, E.fr * 1.4, ob * .12, sc.m[1], 4); ridge(g, W, H, hy + 10, H * E.amp * .5, E.fr * 2, ob * .25, sc.m[2], 9);
  }
  let gy = hy;
  if (sc.env === 'coast') { const sg = g.createLinearGradient(0, hy, 0, hy + H * .1); sg.addColorStop(0, '#5aa6d6'); sg.addColorStop(1, '#2d6f9e'); g.fillStyle = sg; g.fillRect(0, hy, W, H * .1); gy = hy + H * .1; }
  const gg = g.createLinearGradient(0, gy, 0, H); gg.addColorStop(0, mix(sc.ground, '#ffffff', .12)); gg.addColorStop(1, sc.ground); g.fillStyle = gg; g.fillRect(0, gy, W, H);
}
function carSide(g, x, y, s, col, t, lights) {
  g.save(); g.translate(x, y);
  g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(0, 0, s * 2.2, s * .14, 0, 0, TAU); g.fill();
  g.translate(0, Math.sin(t * 16) * s * .015);
  const L = s * 2.1;
  g.fillStyle = col; g.beginPath(); g.moveTo(-L, -s * .3); g.lineTo(-L, -s * .68); g.lineTo(-L * .62, -s * .75); g.lineTo(-L * .42, -s * 1.2); g.lineTo(L * .18, -s * 1.22); g.lineTo(L * .45, -s * .78); g.lineTo(L, -s * .64); g.lineTo(L, -s * .3); g.closePath(); g.fill();
  g.fillStyle = 'rgba(150,200,235,.85)'; g.beginPath(); g.moveTo(-L * .4, -s * .8); g.lineTo(-L * .3, -s * 1.12); g.lineTo(L * .12, -s * 1.14); g.lineTo(L * .34, -s * .8); g.closePath(); g.fill();
  for (const wx of [-L * .55, L * .58]) {
    g.save(); g.translate(wx, -s * .3); g.fillStyle = '#15161a'; g.beginPath(); g.arc(0, 0, s * .3, 0, TAU); g.fill();
    g.rotate(t * 18); g.strokeStyle = '#b8bcc6'; g.lineWidth = s * .04; for (let k = 0; k < 5; k++) { g.rotate(TAU / 5); g.beginPath(); g.moveTo(0, 0); g.lineTo(s * .2, 0); g.stroke(); } g.restore();
  }
  if (lights) { const bx = L, by = -s * .55, lg = g.createLinearGradient(bx, 0, bx + s * 3, 0); lg.addColorStop(0, 'rgba(255,240,170,.55)'); lg.addColorStop(1, 'rgba(255,240,170,0)'); g.fillStyle = lg; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + s * 3.2, by - s * .5); g.lineTo(bx + s * 3.2, by + s * .7); g.closePath(); g.fill(); }
  g.fillStyle = '#ffe9a0'; g.fillRect(L - s * .08, -s * .62, s * .1, s * .1); g.fillStyle = '#ff3030'; g.fillRect(-L, -s * .62, s * .07, s * .1);
  g.restore();
}
function side(g, W, H, sc, st, hy) {
  const ry = H * .76, rh = H * .14, wet = /rain|storm/.test(sc.wea);
  propsRow(g, sc, W, hy + H * .07, H * .12, st.X * .4, 170, 3);
  g.fillStyle = wet ? '#1d2026' : '#2b2d33'; g.fillRect(0, ry, W, rh);
  if (wet) { const sg = g.createLinearGradient(0, ry, 0, ry + rh); sg.addColorStop(0, 'rgba(255,255,255,.18)'); sg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = sg; g.fillRect(0, ry, W, rh); }
  g.fillStyle = '#d6d6d6'; g.fillRect(0, ry + 2, W, 3); g.fillRect(0, ry + rh - 5, W, 3);
  g.fillStyle = '#f0c040'; for (let x = -(st.X % 90); x < W; x += 90) g.fillRect(x, ry + rh / 2 - 2, 46, 4);
  carSide(g, W * .4, ry + rh * .78, H * .12, sc.car, st.time, /night|storm|rain|fog|neon/.test(sc.wea));
  propsRow(g, sc, W, H + 4, H * .3, st.X * 1.5, 380, 5);
}
function pov(g, W, H, sc, st, hy) {
  const sw = Math.sin(st.time * .55) * W * .035 + Math.sin(st.time * .21) * W * .02, vx = W / 2 + sw * .4, cx = W / 2 + sw * 2.2, bw = W * .7, wet = /rain|storm/.test(sc.wea);
  const P = (f, l) => [vx + (cx - vx) * f + l * f * bw / 2, hy + (H - hy) * f];
  const poly = (a, b, c, d, col) => { g.fillStyle = col; g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.lineTo(...c); g.lineTo(...d); g.closePath(); g.fill(); };
  poly(P(0, -.03), P(0, .03), P(1.05, 1.02), P(1.05, -1.02), wet ? '#1d2026' : '#2b2d33');
  for (const l of [-.92, .92]) poly(P(0, l - .01), P(0, l + .01), P(1.05, l + .03), P(1.05, l - .03), '#dddddd');
  const N = 10, s = (st.X / 260) % 1;
  for (let k = 0; k < N; k++) { const u1 = (k + s) / N, u2 = (k + s + .45) / N; if (u2 > 1.02) continue; const f1 = u1 * u1, f2 = u2 * u2; poly(P(f1, -.03), P(f1, .03), P(f2, .03), P(f2, -.03), '#f0c040'); }
  const items = [], M = 9;
  for (let i = 0; i < M; i++) { const u = ((st.X / 520) + i / M) % 1, f = u * u, sd = i % 2 ? 1 : -1, lat = 1.35 + (i % 3) * .4, p = P(f, sd * lat); items.push({ f, x: p[0], y: p[1] }); }
  items.sort((a, b) => a.f - b.f); for (const it of items) prop(g, sc, it.x, it.y, it.f * H * .6);
  g.fillStyle = '#101116'; g.beginPath(); g.moveTo(0, H); g.lineTo(0, H * .84); g.quadraticCurveTo(W / 2, H * .74, W, H * .84); g.lineTo(W, H); g.fill();
  g.save(); g.translate(W / 2, H * 1.02); g.rotate(sw / W * 3); g.strokeStyle = '#1b1d25'; g.lineWidth = H * .04; g.beginPath(); g.arc(0, 0, H * .3, Math.PI * 1.08, Math.PI * 1.92); g.stroke(); g.restore();
  if (wet) {
    g.fillStyle = 'rgba(255,255,255,.22)'; for (const d of st.drops) { g.beginPath(); g.arc(d.x, d.y, d.r, 0, TAU); g.fill(); }
    for (const px of [.38, .62]) { const a = -.9 + (Math.sin(st.time * 2.4) + 1) / 2 * 1.4; g.save(); g.translate(W * px, H * .84); g.rotate(a); g.strokeStyle = '#0b0b0e'; g.lineWidth = 4; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -H * .42); g.stroke(); g.restore(); }
  }
}
const sub = (a, b) => a.map((v, i) => v - b[i]), dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nz = a => { const l = Math.hypot(...a) || 1; return a.map(v => v / l); };
const CC = [0, 3.4, 9.5], CF = nz(sub([0, .6, 0], CC)), CR = nz(cr(CF, [0, 1, 0])), CU = cr(CR, CF), LIGHT = nz([-.4, .9, .5]);
const proj = (p, W, H, cy, F) => { const v = sub(p, CC), z = dot(v, CF); return [W / 2 + dot(v, CR) / z * F, cy - dot(v, CU) / z * F, z]; };
const box = (x0, x1, y0, y1, z0, z1) => [[x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [x0, y0, z1], [x0, y1, z1], [x1, y1, z1], [x1, y0, z1]];
const FACES = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [3, 2, 6, 7], [1, 2, 6, 5]];
const PARTS = [[[-2.1, 2.1, .38, 1.0, -.92, .92], 'body'], [[-.95, 1.1, 1.0, 1.55, -.78, .78], 'glass'], [[-1.55, -1.0, 0, .62, .8, 1.02], 'tire'], [[-1.55, -1.0, 0, .62, -1.02, -.8], 'tire'],
  [[1.0, 1.55, 0, .62, .8, 1.02], 'tire'], [[1.0, 1.55, 0, .62, -1.02, -.8], 'tire'], [[2.08, 2.16, .55, .8, -.8, -.5], 'lamp'], [[2.08, 2.16, .55, .8, .5, .8], 'lamp']];
function orbit(g, W, H, sc, st) {
  const F = H * 1.35, cy = H * .44, A = st.A, ca = Math.cos(A), sa = Math.sin(A), wet = /rain|storm/.test(sc.wea);
  const rot = (x, y, z) => [x * ca + z * sa, y, -x * sa + z * ca], P = (x, y, z) => proj(rot(x, y, z), W, H, cy, F);
  g.fillStyle = wet ? '#1d2026' : '#2b2d33'; g.beginPath();
  for (let k = 0; k <= 56; k++) { const a = k / 56 * TAU, p = P(Math.cos(a) * 6.5, 0, Math.sin(a) * 6.5); k ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); } g.fill();
  g.strokeStyle = '#f0c040'; g.lineWidth = 3;
  for (let k = 0; k < 24; k += 2) { g.beginPath(); for (let j = 0; j <= 3; j++) { const a = (k + j / 3) / 24 * TAU, p = P(Math.cos(a) * 4.8, 0, Math.sin(a) * 4.8); j ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); } g.stroke(); }
  g.fillStyle = 'rgba(0,0,0,.38)'; g.beginPath();
  for (let k = 0; k <= 32; k++) { const a = k / 32 * TAU, p = P(Math.cos(a) * 2.5, 0, Math.sin(a) * 1.3); k ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); } g.fill();
  const colors = { body: sc.car, glass: '#8fbfdc', tire: '#17181c' }, faces = [];
  for (const [b, ck] of PARTS) {
    const v = box(...b).map(p => rot(p[0], p[1], p[2])), cen = [0, 1, 2].map(i => v.reduce((s, p) => s + p[i], 0) / 8);
    for (const f of FACES) {
      const q = f.map(i => v[i]), fc = [0, 1, 2].map(i => q.reduce((s, p) => s + p[i], 0) / 4);
      let n = nz(cr(sub(q[1], q[0]), sub(q[2], q[0]))); if (dot(n, sub(fc, cen)) < 0) n = n.map(x => -x);
      if (dot(n, sub(CC, fc)) <= 0) continue;
      const br = .35 + .65 * Math.max(0, dot(n, LIGHT)), pr = q.map(p => proj(p, W, H, cy, F));
      faces.push({ pr, d: pr.reduce((s, p) => s + p[2], 0) / 4, c: ck === 'lamp' ? '#ffe9a0' : dim(colors[ck], br) });
    }
  }
  faces.sort((a, b) => b.d - a.d);
  for (const f of faces) { g.fillStyle = f.c; g.beginPath(); f.pr.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); g.fill(); g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = .8; g.stroke(); }
  if (/night|storm|rain|fog|neon/.test(sc.wea)) for (const z of [-.65, .65]) { const p = P(2.15, .68, z), rg = g.createRadialGradient(p[0], p[1], 0, p[0], p[1], 26); rg.addColorStop(0, 'rgba(255,240,170,.8)'); rg.addColorStop(1, 'rgba(255,240,170,0)'); g.fillStyle = rg; g.fillRect(p[0] - 26, p[1] - 26, 52, 52); }
}
function celestial(g, W, H, sc, st, hy) {
  const w = sc.wea, Wd = sc.W;
  if (w === 'night' || w === 'neon') {
    g.fillStyle = '#fff'; for (const s of st.stars) { g.globalAlpha = (.4 + .6 * Math.abs(Math.sin(st.time * 1.5 + s.ph))) * (w === 'neon' ? .4 : 1); g.fillRect(s.x, s.y, s.r, s.r); } g.globalAlpha = 1;
    if (w === 'night') { const mx = W * .8, my = H * .16, rg = g.createRadialGradient(mx, my, 0, mx, my, H * .22); rg.addColorStop(0, 'rgba(220,230,255,.45)'); rg.addColorStop(1, 'rgba(220,230,255,0)'); g.fillStyle = rg; g.fillRect(mx - H * .25, my - H * .25, H * .5, H * .5); g.fillStyle = '#eef2ff'; g.beginPath(); g.arc(mx, my, H * .045, 0, TAU); g.fill(); }
  }
  if (Wd.sunc) {
    const sx = W * (sc.cam === 'orbit' ? .25 + .5 * ((st.A / TAU) % 1) : .72), sy = w === 'sunset' ? hy - H * .05 : H * .18, rg = g.createRadialGradient(sx, sy, 0, sx, sy, H * .55);
    rg.addColorStop(0, Wd.sunc + 'cc'); rg.addColorStop(.25, Wd.sunc + '55'); rg.addColorStop(1, Wd.sunc + '00'); g.fillStyle = rg; g.fillRect(0, 0, W, H);
    g.fillStyle = '#fffbe6'; g.beginPath(); g.arc(sx, sy, H * .05, 0, TAU); g.fill();
  }
}
function clouds(g, W, sc, st, dt) {
  g.fillStyle = sc.W.cl; g.globalAlpha = sc.W.ca;
  for (const c of st.clouds) { c.x -= c.v * dt * 30; if (c.x < -c.s * 4) c.x = W + c.s * 2; for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(c.x + k * c.s * .7, c.y + (k % 2 ? -c.s * .15 : 0), c.s * (k === 1 || k === 2 ? 1 : .7), 0, TAU); g.fill(); } }
  g.globalAlpha = 1;
}
function weather(g, W, H, sc, st, dt, hy) {
  const w = sc.wea;
  if (w === 'rain' || w === 'storm') {
    g.strokeStyle = w === 'storm' ? 'rgba(190,205,230,.6)' : 'rgba(200,215,235,.5)'; g.lineWidth = 1.2; g.beginPath();
    for (const r of st.rain) { r.y += r.v * dt; r.x -= r.v * .18 * dt; if (r.y > H) { r.y = -20; r.x = Math.random() * W * 1.25; } if (r.x < -20) r.x += W * 1.25; g.moveTo(r.x, r.y); g.lineTo(r.x + r.l * .18, r.y - r.l); }
    g.stroke();
  }
  if (w === 'snow') { g.fillStyle = 'rgba(255,255,255,.92)'; for (const f of st.snow) { f.y += f.v * dt; f.x += Math.sin(st.time * 1.3 + f.ph) * 18 * dt; if (f.y > H) { f.y = -6; f.x = Math.random() * W; } g.beginPath(); g.arc(f.x, f.y, f.r, 0, TAU); g.fill(); } }
  if (w === 'fog') {
    const fg = g.createLinearGradient(0, hy - H * .25, 0, hy + H * .35); fg.addColorStop(0, 'rgba(225,232,236,0)'); fg.addColorStop(.5, 'rgba(225,232,236,.72)'); fg.addColorStop(1, 'rgba(225,232,236,.22)'); g.fillStyle = fg; g.fillRect(0, 0, W, H);
    g.fillStyle = 'rgba(235,240,243,.16)'; for (let i = 0; i < 3; i++) { const x = ((st.time * 22 * (i + 1)) % (W * 1.4)) - W * .2; g.beginPath(); g.ellipse(x, hy + i * H * .08, W * .5, H * .05, 0, 0, TAU); g.fill(); }
  }
  if (w === 'storm') {
    if (st.fl <= 0 && Math.random() < dt * .3) { st.fl = 1; st.bx = W * (.2 + Math.random() * .6); }
    if (st.fl > 0) { g.fillStyle = `rgba(255,255,255,${st.fl * .5})`; g.fillRect(0, 0, W, H); if (st.fl > .6) { g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 2.5; g.beginPath(); let x = st.bx, y = 0; g.moveTo(x, y); while (y < hy) { x += (Math.random() - .5) * 34; y += 18 + Math.random() * 14; g.lineTo(x, y); } g.stroke(); } st.fl -= dt * 2.2; }
  }
  if (w === 'neon') { const ng = g.createLinearGradient(0, hy - H * .1, 0, hy + H * .2); ng.addColorStop(0, 'rgba(255,0,200,0)'); ng.addColorStop(.5, 'rgba(255,0,200,.22)'); ng.addColorStop(1, 'rgba(0,220,255,0)'); g.fillStyle = ng; g.fillRect(0, hy - H * .1, W, H * .3); }
}
function extras(g, W, H, sc, st, dt, hy) {
  const X = sc.x || {};
  if (X.rays) { g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { const a = .55 + i * .12 + Math.sin(st.time * .3 + i) * .03, x0 = W * .72; g.fillStyle = lg(g, x0, H * .18, x0 - Math.cos(a) * H, H * .18 + Math.sin(a) * H, [[0, 'rgba(255,240,180,.16)'], [1, 'rgba(255,240,180,0)']]); g.beginPath(); g.moveTo(x0, H * .18); g.lineTo(x0 - Math.cos(a - .03) * H * 1.3, H * .18 + Math.sin(a - .03) * H * 1.3); g.lineTo(x0 - Math.cos(a + .03) * H * 1.3, H * .18 + Math.sin(a + .03) * H * 1.3); g.fill(); } g.globalCompositeOperation = 'source-over'; }
  if (X.rainbow) { for (let i = 0; i < 7; i++) { g.strokeStyle = `hsla(${i * 40},90%,60%,.22)`; g.lineWidth = 7; g.beginPath(); g.arc(W * .35, hy + H * .25, H * (.62 - i * .018), Math.PI * 1.1, Math.PI * 1.9); g.stroke(); } }
  if (X.birds) { g.strokeStyle = 'rgba(20,20,40,.7)'; g.lineWidth = 1.5; for (const b of st.birds) { b.x += b.v * dt; if (b.x > W + 20) b.x = -20; const f = Math.sin(st.time * 8 + b.p) * b.s * .6; g.beginPath(); g.moveTo(b.x - b.s, b.y - f); g.quadraticCurveTo(b.x - b.s * .4, b.y - b.s * .3, b.x, b.y); g.quadraticCurveTo(b.x + b.s * .4, b.y - b.s * .3, b.x + b.s, b.y - f); g.stroke(); } }
  if (X.leaves) { for (const l of st.leaves) { l.x += l.v * dt * 1.6; l.y += (Math.sin(st.time * 2 + l.r) * 20 + 14) * dt; l.r += dt * 3; if (l.x > W + 10 || l.y > H + 10) { l.x = -10; l.y = Math.random() * H * .8; } g.save(); g.translate(l.x, l.y); g.rotate(l.r); g.fillStyle = ['#d9822b', '#b5651d', '#8aa832'][(l.s | 0) % 3]; g.beginPath(); g.ellipse(0, 0, l.s, l.s * .5, 0, 0, TAU); g.fill(); g.restore(); } }
  if (X.haze) { g.fillStyle = 'rgba(255,230,190,.10)'; for (let i = 0; i < 5; i++) { g.beginPath(); for (let x = 0; x <= W; x += 12) { const y = hy + i * 7 + Math.sin(x * .05 + st.time * 3 + i) * 3; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.lineTo(W, hy + i * 7 + 8); g.lineTo(0, hy + i * 7 + 8); g.fill(); } }
}
function draw(g, W, H, sc, st, dt) {
  const hy = sc.cam === 'pov' ? H * .45 : H * .58;
  const gr = g.createLinearGradient(0, 0, 0, hy + 8); gr.addColorStop(0, sc.sky[0]); gr.addColorStop(1, sc.sky[1]); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  celestial(g, W, H, sc, st, hy); clouds(g, W, sc, st, dt);
  const ob = sc.cam === 'side' ? st.X : sc.cam === 'pov' ? st.X * .12 + Math.sin(st.time * .55) * W * .05 : st.A * W * 1.1;
  bg(g, W, H, sc, hy, ob);
  if (sc.cam !== 'none') (sc.cam === 'side' ? side : sc.cam === 'pov' ? pov : orbit)(g, W, H, sc, st, hy);
  weather(g, W, H, sc, st, dt, hy); extras(g, W, H, sc, st, dt, hy);
}
function createRoad(canvas, spec, playing) {
  const sc = mk(spec), st = { time: 0, X: 0, A: 0, fl: 0, bx: 0 };
  let last = performance.now(), raf = 0, miss = 0;
  const init = (W, H) => {
    const hy = H * .55, cm = /rain|storm|fog|cloud/.test(sc.wea) ? 1.5 : 1;
    st.rain = Array.from({ length: sc.wea === 'storm' ? 220 : 150 }, () => ({ x: Math.random() * W * 1.25, y: Math.random() * H, l: 10 + Math.random() * 14, v: 650 + Math.random() * 450 }));
    st.snow = Array.from({ length: 110 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: 1 + Math.random() * 2.4, v: 30 + Math.random() * 50, ph: Math.random() * 6 }));
    st.stars = Array.from({ length: 90 }, () => ({ x: Math.random() * W, y: Math.random() * hy, r: .6 + Math.random() * 1.4, ph: Math.random() * 6 }));
    st.clouds = Array.from({ length: sc.wea === 'cloud' ? 13 : 7 }, () => ({ x: Math.random() * W, y: 8 + Math.random() * hy * .45, s: (16 + Math.random() * 24) * cm, v: .3 + Math.random() * .9 }));
    st.birds = Array.from({ length: 6 }, () => ({ x: Math.random() * W, y: H * (.12 + Math.random() * .3), v: 20 + Math.random() * 25, p: Math.random() * 6, s: 5 + Math.random() * 4 }));
    st.leaves = Array.from({ length: 28 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 6, v: 40 + Math.random() * 60, s: 3 + Math.random() * 3 }));
    st.drops = Array.from({ length: 26 }, () => ({ x: Math.random() * W, y: Math.random() * H * .7, r: 1.5 + Math.random() * 3 }));
  };
  function frame(now) {
    if (!canvas.isConnected) { if (++miss > 40) return; raf = requestAnimationFrame(frame); return; }
    miss = 0;
    if (document.hidden || now - last < (playing() ? (window.SEN_ECO ? 90 : 42) : 200)) { raf = requestAnimationFrame(frame); return; }
    const cw = Math.max(240, Math.round((canvas.clientWidth | 0) * .8)), ch = Math.max(120, Math.round((canvas.clientHeight || 300) * .8));
    if (canvas.width !== cw || canvas.height !== ch || !st.rain) { canvas.width = cw; canvas.height = ch; init(cw, ch); }
    const dt = Math.min(.06, (now - last) / 1000); last = now; const d = dt * (playing() ? 1 : .12);
    st.time += d; st.X += d * 320; st.A += d * .5;
    try { draw(canvas.getContext('2d'), canvas.width, canvas.height, sc, st, d); } catch (e) { /* ignore frame errors */ }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}
// ---------- extra scenes (2D procedural) ----------
const lg = (g, x0, y0, x1, y1, st) => { const q = g.createLinearGradient(x0, y0, x1, y1); st.forEach(([o, c]) => q.addColorStop(o, c)); return q; };
const rgx = (g, x, y, r0, r1, st) => { const q = g.createRadialGradient(x, y, r0, x, y, r1); st.forEach(([o, c]) => q.addColorStop(o, c)); return q; };
const rnd = Math.random;
const NEW = [
{ k: 'synth',
  init: (W, H, st) => { st.stars = Array.from({ length: 60 }, () => ({ x: rnd() * W, y: rnd() * H * .45, r: rnd() * 1.5 + .4, p: rnd() * 6 })); },
  draw(g, W, H, st) {
    const hy = H * .56, e = st.e;
    g.fillStyle = lg(g, 0, 0, 0, hy, [[0, '#0b0120'], [.6, '#3a0a5c'], [1, '#ff2e97']]); g.fillRect(0, 0, W, hy);
    g.fillStyle = '#fff'; for (const s of st.stars) { g.globalAlpha = .4 + .6 * Math.abs(Math.sin(st.time + s.p)); g.fillRect(s.x, s.y, s.r, s.r); } g.globalAlpha = 1;
    const sx = W / 2, sy = hy - H * .14, R = H * .24 * (1 + e * .04);
    g.save(); g.beginPath(); g.arc(sx, sy, R, 0, TAU); g.clip(); g.fillStyle = lg(g, 0, sy - R, 0, sy + R, [[0, '#ffe35a'], [.5, '#ff7a45'], [1, '#ff2e97']]); g.fillRect(sx - R, sy - R, R * 2, R * 2);
    g.fillStyle = '#3a0a5c'; for (let i = 0; i < 7; i++) { const y = sy + R * (.05 + i * .14), th = 2 + i * 1.6 + Math.sin(st.time * 2 + i) * .6; g.fillRect(sx - R, y, R * 2, th); } g.restore();
    g.fillStyle = '#120426'; g.beginPath(); g.moveTo(0, hy); g.lineTo(W * .12, hy - H * .16); g.lineTo(W * .24, hy - H * .05); g.lineTo(W * .33, hy - H * .2); g.lineTo(W * .46, hy); g.moveTo(W * .6, hy); g.lineTo(W * .75, hy - H * .18); g.lineTo(W * .86, hy - H * .06); g.lineTo(W, hy - H * .15); g.lineTo(W, hy); g.fill();
    g.fillStyle = '#0a0118'; g.fillRect(0, hy, W, H - hy); g.strokeStyle = '#ff2e97'; g.lineWidth = 1.5; g.shadowColor = '#ff2e97'; g.shadowBlur = 8;
    const sp = (st.time * (.5 + e * .6)) % 1;
    for (let i = 0; i < 14; i++) { const f = ((i + sp) / 14) ** 2.2, y = hy + (H - hy) * f; g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    for (let i = -10; i <= 10; i++) { g.beginPath(); g.moveTo(W / 2 + i * W * .012, hy); g.lineTo(W / 2 + i * W * .16, H); g.stroke(); }
    g.shadowBlur = 0;
    g.fillStyle = 'rgba(255,46,151,.12)'; g.fillRect(0, hy, W, H * .03);
  } },
{ k: 'warp',
  init: (W, H, st) => { st.p = Array.from({ length: 420 }, () => ({ x: rnd() * 2 - 1, y: rnd() * 2 - 1, z: rnd() })); },
  draw(g, W, H, st, dt) {
    g.fillStyle = '#02030a'; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 2; i++) { const x = W * (.35 + .3 * i) + Math.sin(st.time * .2 + i) * 40, y = H * (.4 + .2 * i); g.fillStyle = rgx(g, x, y, 0, W * .35, [[0, i ? 'rgba(80,60,255,.28)' : 'rgba(255,60,160,.22)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(0, 0, W, H); }
    const sp = (.25 + st.e * .9) * dt, cx = W / 2, cy = H / 2, F = Math.min(W, H) * .6;
    for (const s of st.p) {
      const z0 = s.z; s.z -= sp; if (s.z <= .02) { s.x = rnd() * 2 - 1; s.y = rnd() * 2 - 1; s.z = 1; continue; }
      const x1 = cx + s.x / s.z * F * .5, y1 = cy + s.y / s.z * F * .5, x0 = cx + s.x / z0 * F * .5, y0 = cy + s.y / z0 * F * .5;
      g.strokeStyle = `hsl(${200 + s.z * 80},90%,${95 - s.z * 45}%)`; g.lineWidth = (1 - s.z) * 2.4 + .3; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
    }
  } },
{ k: 'solar',
  init: (W, H, st) => { st.stars = Array.from({ length: 120 }, () => ({ x: rnd() * W, y: rnd() * H, r: rnd() * 1.3 + .3 })); },
  draw(g, W, H, st) {
    g.fillStyle = '#04050f'; g.fillRect(0, 0, W, H); g.fillStyle = '#fff'; g.globalAlpha = .6; for (const s of st.stars) g.fillRect(s.x, s.y, s.r, s.r); g.globalAlpha = 1;
    const cx = W / 2, cy = H * .52, P = [['#b5b5b5', 3, .08, 4.1], ['#e8c27a', 5, .12, 1.6], ['#3d8bff', 5.5, .17, 1], ['#e0583a', 4.5, .22, .53], ['#d8b37e', 11, .31, .084], ['#e9d29a', 9, .4, .034, 1], ['#7fd6e6', 7, .47, .012], ['#4466ff', 7, .53, .006]];
    const pl = P.map((p, i) => { const a = st.time * p[3] * .9 + i * 1.7, rx = W * p[2], ry = rx * .26; return { p, x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry, rx, ry, back: Math.sin(a) < 0 }; });
    g.strokeStyle = 'rgba(255,255,255,.1)'; g.lineWidth = 1; for (const o of pl) { g.beginPath(); g.ellipse(cx, cy, o.rx, o.ry, 0, 0, TAU); g.stroke(); }
    const drawP = o => { const [c, r, , , ring] = o.p; if (ring) { g.strokeStyle = 'rgba(230,210,160,.8)'; g.lineWidth = 2; g.beginPath(); g.ellipse(o.x, o.y, r * 1.9, r * .55, -.3, 0, TAU); g.stroke(); } g.fillStyle = rgx(g, o.x - r * .3, o.y - r * .3, 0, r * 1.2, [[0, '#fff'], [.3, c], [1, '#000']]); g.beginPath(); g.arc(o.x, o.y, r, 0, TAU); g.fill(); };
    pl.filter(o => o.back).forEach(drawP);
    g.fillStyle = rgx(g, cx, cy, 0, 60, [[0, '#fff6c0'], [.25, '#ffb020'], [.6, 'rgba(255,120,0,.35)'], [1, 'rgba(255,80,0,0)']]); g.beginPath(); g.arc(cx, cy, 60, 0, TAU); g.fill();
    pl.filter(o => !o.back).forEach(drawP);
    const ea = pl[2]; const ma = st.time * 4; g.fillStyle = '#ddd'; g.beginPath(); g.arc(ea.x + Math.cos(ma) * 12, ea.y + Math.sin(ma) * 5, 1.8, 0, TAU); g.fill();
  } },
{ k: 'plane',
  init: (W, H, st) => { st.c = [0, 1, 2].map(l => Array.from({ length: 6 }, () => ({ x: rnd() * W * 1.3, y: H * (.5 + l * .13 + rnd() * .08), s: (30 + rnd() * 40) * (1 + l * .5) }))); },
  draw(g, W, H, st) {
    g.fillStyle = lg(g, 0, 0, 0, H, [[0, '#24185a'], [.45, '#c0508a'], [.75, '#ff9d5c'], [1, '#ffd9a0']]); g.fillRect(0, 0, W, H);
    g.fillStyle = rgx(g, W * .78, H * .62, 0, H * .5, [[0, 'rgba(255,230,160,.9)'], [1, 'rgba(255,200,120,0)']]); g.fillRect(0, 0, W, H);
    const sp = 40 + st.e * 80;
    const px = W * .42, py = H * .36 + Math.sin(st.time * .8) * 8, bank = Math.sin(st.time * .6) * .06;
    g.save(); g.translate(px, py); g.rotate(bank - .03);
    g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 3; g.beginPath(); g.moveTo(-60, 3); g.lineTo(-W * .45, 6 + Math.sin(st.time) * 2); g.stroke();
    g.fillStyle = '#f3f5fa'; g.beginPath(); g.ellipse(0, 0, 70, 11, 0, 0, TAU); g.fill();
    g.fillStyle = '#d9dde8'; g.beginPath(); g.moveTo(-18, 2); g.lineTo(-48, 30); g.lineTo(-30, 30); g.lineTo(8, 4); g.closePath(); g.fill();
    g.fillStyle = '#c9cfdd'; g.beginPath(); g.moveTo(-62, -4); g.lineTo(-76, -30); g.lineTo(-62, -30); g.lineTo(-44, -3); g.closePath(); g.fill();
    g.fillStyle = '#7a8299'; g.beginPath(); g.ellipse(-8, 16, 10, 5, 0, 0, TAU); g.fill();
    g.fillStyle = '#4a6fb0'; for (let i = -40; i < 50; i += 9) g.fillRect(i, -3, 4, 4); g.fillStyle = '#2a4a8a'; g.beginPath(); g.ellipse(60, -2, 8, 5, 0, 0, TAU); g.fill();
    g.restore();
    for (let l = 0; l < 3; l++) { g.fillStyle = ['rgba(255,190,170,.55)', 'rgba(255,225,215,.75)', 'rgba(255,245,240,.95)'][l]; for (const c of st.c[l]) { c.x -= sp * (l + 1) * .016 * 1.1; if (c.x < -c.s * 3) c.x = W + c.s * 2; for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(c.x + k * c.s * .55, c.y + (k % 2) * -c.s * .12, c.s * .62, c.s * .34, 0, 0, TAU); g.fill(); } } }
  } },
{ k: 'aurora',
  init: (W, H, st) => { st.stars = Array.from({ length: 110 }, () => ({ x: rnd() * W, y: rnd() * H * .7, r: rnd() * 1.3 + .3, p: rnd() * 6 })); st.sh = null; },
  draw(g, W, H, st, dt) {
    g.fillStyle = lg(g, 0, 0, 0, H, [[0, '#020611'], [.6, '#0a1f3a'], [1, '#12304a']]); g.fillRect(0, 0, W, H);
    g.fillStyle = '#fff'; for (const s of st.stars) { g.globalAlpha = .3 + .7 * Math.abs(Math.sin(st.time + s.p)); g.fillRect(s.x, s.y, s.r, s.r); } g.globalAlpha = 1;
    g.globalCompositeOperation = 'lighter';
    [['#22ff9a', .2, 0], ['#2ad0ff', .26, 2], ['#b45bff', .15, 4]].forEach(([c, y0, ph]) => {
      const top = x => H * y0 + Math.sin(x * .006 + st.time * .5 + ph) * H * .07 + Math.sin(x * .017 + st.time * .8 + ph) * H * .025, hh = H * (.26 + st.e * .08);
      g.beginPath(); g.moveTo(0, top(0)); for (let x = 0; x <= W; x += 10) g.lineTo(x, top(x)); for (let x = W; x >= 0; x -= 10) g.lineTo(x, top(x) + hh * (.7 + .3 * Math.sin(x * .01 + st.time + ph))); g.closePath();
      g.fillStyle = lg(g, 0, H * y0 - 20, 0, H * y0 + hh, [[0, 'rgba(0,0,0,0)'], [.25, c + 'aa'], [1, 'rgba(0,0,0,0)']]); g.fill();
    });
    g.globalCompositeOperation = 'source-over';
    if (!st.sh && rnd() < dt * .15) st.sh = { x: rnd() * W * .7, y: rnd() * H * .3, l: 0 };
    if (st.sh) { const s = st.sh; s.l += dt * 1.6; g.strokeStyle = `rgba(255,255,255,${1 - s.l})`; g.lineWidth = 1.5; g.beginPath(); g.moveTo(s.x + s.l * 180, s.y + s.l * 70); g.lineTo(s.x + s.l * 180 - 40, s.y + s.l * 70 - 16); g.stroke(); if (s.l >= 1) st.sh = null; }
    g.fillStyle = '#071220'; g.beginPath(); g.moveTo(0, H); g.lineTo(0, H * .78); for (let x = 0; x <= W; x += 20) g.lineTo(x, H * .78 - Math.abs(Math.sin(x * .011)) * H * .16 - Math.sin(x * .03) * H * .03); g.lineTo(W, H); g.fill();
    g.fillStyle = '#030a14'; g.beginPath(); g.moveTo(0, H); g.lineTo(0, H * .9); for (let x = 0; x <= W; x += 20) g.lineTo(x, H * .9 - Math.abs(Math.sin(x * .02 + 2)) * H * .08); g.lineTo(W, H); g.fill();
  } },
{ k: 'ocean',
  init: (W, H, st) => { st.b = Array.from({ length: 5 }, () => ({ x: rnd() * W, y: H * (.12 + rnd() * .2), p: rnd() * 6 })); },
  draw(g, W, H, st) {
    const hy = H * .55; g.fillStyle = lg(g, 0, 0, 0, hy, [[0, '#2b1b5e'], [.5, '#e0558a'], [1, '#ffb070']]); g.fillRect(0, 0, W, hy);
    const sx = W * .5, sy = hy - H * .02; g.fillStyle = rgx(g, sx, sy, 0, H * .5, [[0, 'rgba(255,240,190,1)'], [.2, 'rgba(255,170,90,.55)'], [1, 'rgba(255,120,60,0)']]); g.fillRect(0, 0, W, hy);
    g.fillStyle = '#fff3c8'; g.beginPath(); g.arc(sx, sy, H * .09, Math.PI, 0); g.fill();
    g.fillStyle = lg(g, 0, hy, 0, H, [[0, '#ff9a6a'], [.25, '#8a3f7a'], [1, '#101a40']]); g.fillRect(0, hy, W, H - hy);
    for (let i = 0; i < 26; i++) { const f = (i / 26) ** 1.7, y = hy + (H - hy) * f + 2, amp = 1 + f * 7; g.strokeStyle = `rgba(255,${200 - f * 120 | 0},${140 - f * 80 | 0},${.5 - f * .35})`; g.lineWidth = 1 + f * 1.5; g.beginPath(); for (let x = 0; x <= W; x += 12) { const yy = y + Math.sin(x * (.02 - f * .008) + st.time * (1 + f) + i) * amp; x ? g.lineTo(x, yy) : g.moveTo(x, yy); } g.stroke(); }
    g.fillStyle = 'rgba(255,230,170,.7)'; for (let i = 0; i < 40; i++) { const f = (i / 40) ** 1.6, y = hy + (H - hy) * f, w = 6 + f * 80 * (.5 + .5 * Math.sin(st.time * 3 + i)); g.fillRect(sx - w / 2 + Math.sin(st.time + i) * 6, y, w, 1.5); }
    const bx = W * .3 + Math.sin(st.time * .2) * 20, by = hy + H * .1 + Math.sin(st.time * 1.2) * 3; g.save(); g.translate(bx, by); g.rotate(Math.sin(st.time * 1.2) * .03); g.fillStyle = '#12091f'; g.beginPath(); g.moveTo(-26, 0); g.lineTo(26, 0); g.lineTo(18, 9); g.lineTo(-18, 9); g.closePath(); g.fill(); g.beginPath(); g.moveTo(0, -3); g.lineTo(0, -46); g.lineTo(22, -3); g.closePath(); g.fill(); g.beginPath(); g.moveTo(-2, -5); g.lineTo(-2, -36); g.lineTo(-18, -5); g.closePath(); g.fill(); g.restore();
    g.strokeStyle = '#12091f'; g.lineWidth = 1.6; for (const b of st.b) { b.x -= .4; if (b.x < -20) b.x = W + 20; const w = Math.sin(st.time * 5 + b.p) * 4; g.beginPath(); g.moveTo(b.x - 8, b.y - w); g.quadraticCurveTo(b.x - 3, b.y - 5, b.x, b.y); g.quadraticCurveTo(b.x + 3, b.y - 5, b.x + 8, b.y - w); g.stroke(); }
  } },
{ k: 'lofi',
  init: (W, H, st) => { st.bk = Array.from({ length: 36 }, () => ({ x: rnd() * W, y: rnd() * H * .8, r: 10 + rnd() * 34, c: ['#ffb36b', '#ff6b9d', '#6bd5ff', '#a78bff', '#ffe27a'][rnd() * 5 | 0], p: rnd() * 6 })); st.dr = Array.from({ length: 34 }, () => ({ x: rnd() * W, y: rnd() * H, r: 2 + rnd() * 4, v: 10 + rnd() * 40 })); },
  draw(g, W, H, st, dt) {
    g.fillStyle = lg(g, 0, 0, 0, H, [[0, '#14102e'], [1, '#2a1c4d']]); g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'lighter'; for (const b of st.bk) { const a = .35 + .25 * Math.sin(st.time * .8 + b.p); g.globalAlpha = a; g.fillStyle = rgx(g, b.x, b.y, 0, b.r, [[0, b.c], [.7, b.c + '55'], [1, 'rgba(0,0,0,0)']]); g.beginPath(); g.arc(b.x, b.y, b.r, 0, TAU); g.fill(); } g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    g.fillStyle = 'rgba(180,200,255,.1)'; g.fillRect(0, 0, W, H);
    for (const d of st.dr) { d.y += d.v * dt; if (d.y > H) { d.y = -10; d.x = rnd() * W; } g.fillStyle = 'rgba(200,220,255,.32)'; g.beginPath(); g.ellipse(d.x, d.y, d.r * .6, d.r, 0, 0, TAU); g.fill(); g.strokeStyle = 'rgba(200,220,255,.12)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(d.x, d.y - d.r); g.lineTo(d.x, d.y - d.r - d.v * .5); g.stroke(); }
    g.strokeStyle = '#0a0818'; g.lineWidth = 12; g.strokeRect(6, 6, W - 12, H - 12); g.lineWidth = 8; g.beginPath(); g.moveTo(W / 2, 6); g.lineTo(W / 2, H); g.moveTo(6, H * .52); g.lineTo(W, H * .52); g.stroke();
    g.fillStyle = '#0a0818'; g.fillRect(0, H * .86, W, H * .14); g.fillStyle = rgx(g, W * .18, H * .86, 0, W * .3, [[0, 'rgba(255,190,110,.5)'], [1, 'rgba(255,190,110,0)']]); g.fillRect(0, H * .5, W * .6, H * .5);
    const mx = W * .78, my = H * .86; g.fillStyle = '#2a2140'; g.fillRect(mx - 14, my - 26, 28, 26); g.strokeStyle = '#2a2140'; g.lineWidth = 4; g.beginPath(); g.arc(mx + 15, my - 13, 8, -1.5, 1.5); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2; for (let i = 0; i < 3; i++) { g.beginPath(); for (let k = 0; k < 24; k++) { const x = mx - 6 + i * 6 + Math.sin(st.time * 2 + k * .4 + i) * 4, y = my - 30 - k * 2.4; k ? g.lineTo(x, y) : g.moveTo(x, y); } g.globalAlpha = .6; g.stroke(); g.globalAlpha = 1; }
  } },
{ k: 'eq',
  init: (W, H, st) => { st.v = new Array(56).fill(0); st.pk = new Array(56).fill(0); },
  draw(g, W, H, st, dt) {
    g.fillStyle = lg(g, 0, 0, 0, H, [[0, '#06020f'], [1, '#150a2e']]); g.fillRect(0, 0, W, H); g.fillStyle = rgx(g, W / 2, H * .6, 0, W * .5, [[0, `rgba(160,60,255,${.12 + st.e * .2})`], [1, 'rgba(0,0,0,0)']]); g.fillRect(0, 0, W, H);
    const n = st.v.length, bw = W / n, base = H * .72;
    for (let i = 0; i < n; i++) {
      const tgt = (.3 + .7 * Math.abs(Math.sin(st.time * (1.2 + i * .07) + i * .6) * Math.sin(st.time * .7 + i * .21))) * (.35 + st.e) * H * .5;
      st.v[i] += (tgt - st.v[i]) * Math.min(1, dt * 9); st.pk[i] = Math.max(st.pk[i] - dt * 50, st.v[i]);
      const x = i * bw + bw * .15, w = bw * .7, hue = 180 + i / n * 140;
      g.fillStyle = lg(g, 0, base - st.v[i], 0, base, [[0, `hsl(${hue},100%,65%)`], [1, `hsl(${hue + 40},100%,45%)`]]); g.shadowColor = `hsl(${hue},100%,60%)`; g.shadowBlur = 10; g.fillRect(x, base - st.v[i], w, st.v[i]); g.shadowBlur = 0;
      g.fillStyle = '#fff'; g.fillRect(x, base - st.pk[i] - 4, w, 2.5);
      g.fillStyle = `hsla(${hue},100%,60%,.18)`; g.fillRect(x, base + 4, w, st.v[i] * .35);
    }
    g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(0, base + 1, W, 1.5);
  } },
{ k: 'galaxy',
  init: (W, H, st) => { st.s = Array.from({ length: 1100 }, () => { const arm = rnd() * 3 | 0, r = Math.pow(rnd(), .6); return { r, a: arm * TAU / 3 + r * 5 + (rnd() - .5) * .7 * (1.2 - r), z: (rnd() - .5) * .15 * (1 - r), c: r < .25 ? '#ffd9a0' : r < .6 ? '#bcd0ff' : '#8fa8ff', s: rnd() * 1.4 + .4 }; }); st.bg = Array.from({ length: 90 }, () => ({ x: rnd() * W, y: rnd() * H, r: rnd() * 1.1 + .2 })); },
  draw(g, W, H, st) {
    g.fillStyle = '#03030a'; g.fillRect(0, 0, W, H); g.fillStyle = '#fff'; g.globalAlpha = .5; for (const s of st.bg) g.fillRect(s.x, s.y, s.r, s.r); g.globalAlpha = 1;
    const cx = W / 2, cy = H / 2, R = Math.min(W * .42, H * 1.05), rot = st.time * .12, tilt = .5 + Math.sin(st.time * .1) * .08;
    g.globalCompositeOperation = 'lighter'; g.fillStyle = rgx(g, cx, cy, 0, R * .5, [[0, `rgba(255,220,160,${.55 + st.e * .2})`], [.4, 'rgba(255,150,90,.2)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(0, 0, W, H);
    for (const s of st.s) { const a = s.a + rot * (1.3 - s.r), x = Math.cos(a) * s.r * R, y = Math.sin(a) * s.r * R * tilt; g.fillStyle = s.c; g.globalAlpha = .45 + .4 * (1 - s.r); g.fillRect(cx + x, cy + y + s.z * R, s.s, s.s); }
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  } },
{ k: 'lava',
  init: (W, H, st) => { st.bl = Array.from({ length: 8 }, (_, i) => ({ p: rnd() * 6, sx: .2 + rnd() * .35, sy: .25 + rnd() * .4, r: 50 + rnd() * 60, c: ['#ff4d6d', '#ff9a3c', '#ffd23c', '#c04dff', '#ff6bd6'][i % 5] })); },
  draw(g, W, H, st) {
    g.fillStyle = lg(g, 0, 0, 0, H, [[0, '#1a0633'], [1, '#4a0a4a']]); g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'lighter';
    for (const b of st.bl) { const x = W / 2 + Math.sin(st.time * b.sx + b.p) * W * .36, y = H / 2 + Math.sin(st.time * b.sy + b.p * 2) * H * .38, r = b.r * (1 + st.e * .25) * (H / 300); g.fillStyle = rgx(g, x, y, 0, r, [[0, b.c + 'ee'], [.55, b.c + '66'], [1, 'rgba(0,0,0,0)']]); g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
    g.globalCompositeOperation = 'source-over';
  } },
{ k: 'matrix',
  init: (W, H, st) => { st.cw = 16; st.col = Array.from({ length: Math.ceil(W / 16) }, () => ({ y: rnd() * H, v: 60 + rnd() * 160 })); st.fresh = true; },
  draw(g, W, H, st, dt) {
    if (st.fresh) { g.fillStyle = '#000'; g.fillRect(0, 0, W, H); st.fresh = false; }
    g.fillStyle = 'rgba(0,8,0,.14)'; g.fillRect(0, 0, W, H); g.font = '15px monospace';
    const S = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄ0123456789ｦﾝ';
    st.col.forEach((c, i) => { c.y += c.v * dt * (1 + st.e); if (c.y > H + 20) { c.y = -10; c.v = 60 + rnd() * 160; } g.fillStyle = '#d6ffd6'; g.fillText(S[rnd() * S.length | 0], i * st.cw, c.y); g.fillStyle = '#19ff5a'; g.fillText(S[rnd() * S.length | 0], i * st.cw, c.y - st.cw); });
  } },
{ k: 'fireflies',
  init: (W, H, st) => { st.f = Array.from({ length: 70 }, () => ({ x: rnd() * W, y: H * (.35 + rnd() * .55), p: rnd() * 6, s: .2 + rnd() * .5, a: 10 + rnd() * 30 })); },
  draw(g, W, H, st) {
    g.fillStyle = lg(g, 0, 0, 0, H, [[0, '#050d14'], [.6, '#0b2a2a'], [1, '#08181a']]); g.fillRect(0, 0, W, H);
    const mx = W * .78, my = H * .2; g.fillStyle = rgx(g, mx, my, 0, H * .3, [[0, 'rgba(210,235,255,.5)'], [1, 'rgba(210,235,255,0)']]); g.fillRect(0, 0, W, H); g.fillStyle = '#eaf4ff'; g.beginPath(); g.arc(mx, my, H * .05, 0, TAU); g.fill();
    for (let l = 0; l < 3; l++) { g.fillStyle = ['#0a1e22', '#071419', '#040b0f'][l]; const base = H * (.62 + l * .13), s = 1 + l * .6; for (let i = -1; i < W / (40 * s) + 2; i++) { const x = i * 40 * s + (l * 17) + Math.sin(st.time * .5 + i) * 2 * s, h = (60 + ((i * 53 + l * 31) % 40)) * s; g.beginPath(); g.moveTo(x - 22 * s, base); g.lineTo(x, base - h); g.lineTo(x + 22 * s, base); g.closePath(); g.fill(); } }
    g.fillStyle = 'rgba(120,180,190,.07)'; for (let i = 0; i < 3; i++) { const x = ((st.time * 14 * (i + 1)) % (W * 1.5)) - W * .25; g.beginPath(); g.ellipse(x, H * (.7 + i * .08), W * .4, H * .05, 0, 0, TAU); g.fill(); }
    g.globalCompositeOperation = 'lighter';
    for (const f of st.f) { const x = f.x + Math.sin(st.time * f.s + f.p) * f.a, y = f.y + Math.cos(st.time * f.s * .8 + f.p) * f.a * .6, a = Math.max(0, Math.sin(st.time * 1.3 + f.p)); g.fillStyle = rgx(g, x, y, 0, 12, [[0, `rgba(220,255,120,${.9 * a})`], [.3, `rgba(180,255,80,${.4 * a})`], [1, 'rgba(0,0,0,0)']]); g.beginPath(); g.arc(x, y, 12, 0, TAU); g.fill(); }
    g.globalCompositeOperation = 'source-over';
  } },
{ k: 'deep',
  init: (W, H, st) => { st.bub = Array.from({ length: 40 }, () => ({ x: rnd() * W, y: rnd() * H, r: 1 + rnd() * 4, v: 20 + rnd() * 40, p: rnd() * 6 })); st.fish = Array.from({ length: 16 }, (_, i) => ({ x: rnd() * W, y: H * (.2 + rnd() * .5), v: 30 + rnd() * 40, s: 5 + rnd() * 6, c: ['#ffb347', '#6bd5ff', '#ff6b9d', '#c5ff6b'][i % 4], p: rnd() * 6 })); st.jl = Array.from({ length: 3 }, () => ({ x: rnd() * W, y: rnd() * H, p: rnd() * 6 })); },
  draw(g, W, H, st, dt) {
    g.fillStyle = lg(g, 0, 0, 0, H, [[0, '#0f6a8a'], [.5, '#0a3d5c'], [1, '#021524']]); g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 5; i++) { const x = W * (.1 + i * .22) + Math.sin(st.time * .3 + i) * 40; g.fillStyle = lg(g, x, 0, x + 120, H * .8, [[0, 'rgba(140,230,255,.2)'], [1, 'rgba(140,230,255,0)']]); g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 60, 0); g.lineTo(x + 200, H); g.lineTo(x + 60, H); g.fill(); } g.globalCompositeOperation = 'source-over';
    for (const f of st.fish) { f.x += f.v * dt; if (f.x > W + 30) { f.x = -30; f.y = H * (.2 + rnd() * .5); } const y = f.y + Math.sin(st.time * 1.5 + f.p) * 10, w = Math.sin(st.time * 8 + f.p) * 3; g.fillStyle = f.c; g.beginPath(); g.ellipse(f.x, y, f.s * 1.6, f.s, 0, 0, TAU); g.fill(); g.beginPath(); g.moveTo(f.x - f.s * 1.4, y); g.lineTo(f.x - f.s * 2.6, y - f.s * .8 + w); g.lineTo(f.x - f.s * 2.6, y + f.s * .8 + w); g.fill(); g.fillStyle = '#000'; g.fillRect(f.x + f.s, y - f.s * .3, 2, 2); }
    g.globalCompositeOperation = 'lighter'; for (const j of st.jl) { const x = j.x + Math.sin(st.time * .3 + j.p) * 30, y = H * .3 + Math.sin(st.time * .8 + j.p) * 30 + (j.y % 80), pu = 1 + Math.sin(st.time * 2 + j.p) * .12; g.fillStyle = rgx(g, x, y, 0, 34, [[0, 'rgba(255,150,255,.7)'], [1, 'rgba(255,150,255,0)']]); g.beginPath(); g.ellipse(x, y, 22 * pu, 18 / pu, 0, Math.PI, 0); g.fill(); g.strokeStyle = 'rgba(255,170,255,.5)'; g.lineWidth = 1.5; for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(x + k * 7, y); g.quadraticCurveTo(x + k * 7 + Math.sin(st.time * 2 + k) * 6, y + 20, x + k * 7, y + 38); g.stroke(); } } g.globalCompositeOperation = 'source-over';
    g.strokeStyle = '#0a4a3a'; g.lineWidth = 5; g.lineCap = 'round'; for (let i = 0; i < 14; i++) { const x = i * W / 13; g.beginPath(); g.moveTo(x, H); g.quadraticCurveTo(x + Math.sin(st.time + i) * 14, H - 40, x + Math.sin(st.time * 1.2 + i) * 22, H - 70 - (i % 3) * 14); g.stroke(); } g.lineCap = 'butt';
    for (const b of st.bub) { b.y -= b.v * dt; if (b.y < -10) { b.y = H + 10; b.x = rnd() * W; } const x = b.x + Math.sin(st.time * 2 + b.p) * 6; g.strokeStyle = 'rgba(200,240,255,.55)'; g.lineWidth = 1; g.beginPath(); g.arc(x, b.y, b.r, 0, TAU); g.stroke(); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(x - b.r * .4, b.y - b.r * .4, 1.5, 1.5); }
  } },
{ k: 'skyline',
  init: (W, H, st) => { st.b = []; let x = -20; while (x < W + 40) { const w = 30 + rnd() * 50, hh = H * (.18 + rnd() * .36); st.b.push({ x, w, h: hh, s: rnd() * 100, n: rnd() }); x += w + rnd() * 5; } st.stars = Array.from({ length: 70 }, () => ({ x: rnd() * W, y: rnd() * H * .45, r: rnd() * 1.3 + .3, p: rnd() * 6 })); st.cl = Array.from({ length: 5 }, () => ({ x: rnd() * W, y: H * (.08 + rnd() * .22), s: 30 + rnd() * 40 })); },
  draw(g, W, H, st, dt) {
    const hy = H * .74; g.fillStyle = lg(g, 0, 0, 0, hy, [[0, '#050818'], [.55, '#1a1450'], [1, '#8a2f72']]); g.fillRect(0, 0, W, H);
    g.fillStyle = '#fff'; for (const s of st.stars) { g.globalAlpha = .3 + .7 * Math.abs(Math.sin(st.time + s.p)); g.fillRect(s.x, s.y, s.r, s.r); } g.globalAlpha = 1;
    const mx = W * .8, my = H * .18; g.fillStyle = rgx(g, mx, my, 0, H * .26, [[0, 'rgba(255,240,220,.5)'], [1, 'rgba(255,240,220,0)']]); g.fillRect(0, 0, W, H); g.fillStyle = '#fff4e0'; g.beginPath(); g.arc(mx, my, H * .05, 0, TAU); g.fill();
    g.fillStyle = 'rgba(90,60,140,.35)'; for (const c of st.cl) { c.x -= dt * 8; if (c.x < -c.s * 3) c.x = W + c.s; for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse(c.x + k * c.s * .8, c.y, c.s, c.s * .35, 0, 0, TAU); g.fill(); } }
    const drawB = (flip) => { for (const b of st.b) { const y0 = flip ? hy : hy; g.fillStyle = '#0b0820'; if (flip) g.fillRect(b.x, hy, b.w, b.h); else g.fillRect(b.x, hy - b.h, b.w, b.h);
      for (let yy = 6; yy < b.h - 4; yy += 10) for (let xx = 4; xx < b.w - 4; xx += 8) { const on = ((Math.sin(xx * 12.9 + yy * 7.3 + b.s + Math.floor(st.time * .4 + b.n * 9)) * 43758) % 1 + 1) % 1 > .55; if (!on) continue; g.fillStyle = (xx + yy + (b.s | 0)) % 3 ? '#ffd27a' : '#7ad7ff'; if (flip) g.fillRect(b.x + xx, hy + yy, 3, 4); else g.fillRect(b.x + xx, hy - b.h + yy, 3, 4); }
      if (!flip && b.n > .8) { g.fillStyle = b.n > .9 ? '#ff2e97' : '#00e5ff'; g.shadowColor = g.fillStyle; g.shadowBlur = 12; g.fillRect(b.x + 3, hy - b.h - 6, b.w - 6, 3); g.shadowBlur = 0; } } };
    drawB(false);
    g.fillStyle = lg(g, 0, hy, 0, H, [[0, '#2a1450'], [1, '#07041a']]); g.fillRect(0, hy, W, H - hy);
    g.save(); g.globalAlpha = .22; drawB(true); g.restore();
    g.fillStyle = lg(g, 0, hy, 0, H, [[0, 'rgba(10,8,32,0)'], [1, 'rgba(7,4,26,.95)']]); g.fillRect(0, hy, W, H - hy);
    g.strokeStyle = 'rgba(255,180,255,.18)'; g.lineWidth = 1; for (let i = 0; i < 9; i++) { const y = hy + (H - hy) * ((i + 1) / 10) ** 1.3; g.beginPath(); for (let x = 0; x <= W; x += 14) { const yy = y + Math.sin(x * .03 + st.time * 1.4 + i) * 1.6; x ? g.lineTo(x, yy) : g.moveTo(x, yy); } g.stroke(); }
  } },
{ k: 'sakura',
  init: (W, H, st) => { st.p = Array.from({ length: 80 }, () => ({ x: rnd() * W, y: rnd() * H, s: 3 + rnd() * 5, v: 22 + rnd() * 40, r: rnd() * 6, w: rnd() * 6 })); st.bl = Array.from({ length: 70 }, () => ({ a: rnd(), o: (rnd() - .5) * 60, s: 6 + rnd() * 10, c: rnd() })); },
  draw(g, W, H, st, dt) {
    g.fillStyle = lg(g, 0, 0, 0, H, [[0, '#3b2a6e'], [.5, '#d9709a'], [1, '#ffc9a3']]); g.fillRect(0, 0, W, H);
    const sx = W * .3, sy = H * .3; g.fillStyle = rgx(g, sx, sy, 0, H * .35, [[0, 'rgba(255,240,230,.8)'], [1, 'rgba(255,240,230,0)']]); g.fillRect(0, 0, W, H); g.fillStyle = '#fff6ee'; g.beginPath(); g.arc(sx, sy, H * .08, 0, TAU); g.fill();
    g.fillStyle = '#5a3a7a'; g.beginPath(); g.moveTo(W * .35, H * .78); g.lineTo(W * .62, H * .38); g.lineTo(W * .7, H * .42); g.lineTo(W * .92, H * .78); g.closePath(); g.fill();
    g.fillStyle = '#fff'; g.beginPath(); g.moveTo(W * .575, H * .46); g.lineTo(W * .62, H * .38); g.lineTo(W * .7, H * .42); g.lineTo(W * .735, H * .47); g.lineTo(W * .68, H * .45); g.lineTo(W * .63, H * .48); g.closePath(); g.fill();
    g.fillStyle = lg(g, 0, H * .72, 0, H, [[0, '#7a4a8a'], [1, '#2a1650']]); g.fillRect(0, H * .72, W, H * .28);
    g.fillStyle = 'rgba(255,200,230,.2)'; for (let i = 0; i < 3; i++) { const x = ((st.time * 12 * (i + 1)) % (W * 1.4)) - W * .2; g.beginPath(); g.ellipse(x, H * (.7 + i * .03), W * .35, H * .04, 0, 0, TAU); g.fill(); }
    g.strokeStyle = '#2b1738'; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(W * 1.02, H * .18); g.bezierCurveTo(W * .8, H * .2, W * .7, H * .08, W * .52, H * .12); g.stroke(); g.lineWidth = 4; g.beginPath(); g.moveTo(W * .86, H * .19); g.bezierCurveTo(W * .84, H * .32, W * .78, H * .34, W * .72, H * .4); g.stroke(); g.lineCap = 'butt';
    for (const b of st.bl) { const t = b.a, x = W * (1.0 - t * .5) + b.o, y = H * (.17 - Math.sin(t * 3) * .05) + b.o * .6 + Math.sin(st.time * .8 + b.c * 9) * 2; g.fillStyle = b.c > .5 ? '#ffb7d0' : '#ff8fb8'; g.globalAlpha = .9; g.beginPath(); g.arc(x, y, b.s, 0, TAU); g.fill(); }
    g.globalAlpha = 1;
    for (const q of st.p) { q.y += q.v * dt * (1 + st.e * .6); q.x += (Math.sin(st.time * .9 + q.w) * 20 - 12) * dt; q.r += dt * 2; if (q.y > H + 10) { q.y = -10; q.x = rnd() * W; } if (q.x < -10) q.x = W + 10; g.save(); g.translate(q.x, q.y); g.rotate(q.r); g.fillStyle = 'rgba(255,190,215,.9)'; g.beginPath(); g.ellipse(0, 0, q.s, q.s * .55, 0, 0, TAU); g.fill(); g.restore(); }
  } },
{ k: 'dance',
  init: (W, H, st) => { st.stars = Array.from({ length: 40 }, () => ({ x: rnd() * W, y: rnd() * H * .4, r: rnd() * 1.2 + .3 })); st.dn = Array.from({ length: 6 }, (_, i) => ({ x: W * (.14 + i * .14), s: H * (.3 + (i % 3) * .03), ph: i * 1.3, c: ['#ff2e97', '#00e5ff', '#ffd23c', '#9b5cff', '#2ef08a', '#ff7a45'][i] })); },
  draw(g, W, H, st) {
    g.fillStyle = lg(g, 0, 0, 0, H, [[0, '#0a0220'], [.6, '#2a0a4a'], [1, '#12041f']]); g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 4; i++) { const a = Math.sin(st.time * (.6 + i * .15) + i * 2) * .5, x0 = W * (.2 + i * .2), col = ['rgba(255,46,151,', 'rgba(0,229,255,', 'rgba(155,92,255,', 'rgba(255,210,60,'][i]; g.fillStyle = lg(g, x0, 0, x0 + a * H, H, [[0, col + '.5)'], [1, col + '0)']]); g.beginPath(); g.moveTo(x0 - 6, 0); g.lineTo(x0 + 6, 0); g.lineTo(x0 + a * H + 70, H * .86); g.lineTo(x0 + a * H - 70, H * .86); g.fill(); }
    g.globalCompositeOperation = 'source-over';
    const fy = H * .86; g.fillStyle = lg(g, 0, fy, 0, H, [[0, '#2a1650'], [1, '#0a0418']]); g.fillRect(0, fy, W, H - fy);
    g.strokeStyle = 'rgba(255,255,255,.07)'; for (let i = -8; i < 9; i++) { g.beginPath(); g.moveTo(W / 2 + i * W * .02, fy); g.lineTo(W / 2 + i * W * .2, H); g.stroke(); }
    const beat = 3.2 + st.e * 2.2;
    for (const d of st.dn) {
      const t = st.time * beat + d.ph, s = d.s, y = fy - s * .02 + Math.abs(Math.sin(t)) * -s * .06, hx = d.x, hy2 = y - s * .5, nx = hx + Math.sin(t * .5) * s * .05, ny = hy2 - s * .42;
      g.strokeStyle = '#06020f'; g.fillStyle = '#06020f'; g.lineWidth = s * .08; g.lineCap = 'round'; g.shadowColor = d.c; g.shadowBlur = 14;
      g.beginPath(); g.moveTo(hx, hy2); g.lineTo(nx, ny); g.stroke(); g.beginPath(); g.arc(nx, ny - s * .1, s * .08, 0, TAU); g.fill();
      for (const sd of [-1, 1]) {
        const a1 = -1.2 - Math.sin(t + sd) * 1.0, a2 = a1 + .6 + Math.sin(t * 1.3 + sd) * .5, ex = nx + Math.cos(a1) * s * .24 * sd, ey = ny - Math.sin(a1) * s * .24 + s * .24;
        const ax = sd > 0 ? Math.cos(a1) : -Math.cos(a1); const ex1 = nx + ax * s * .24, ey1 = ny + Math.abs(Math.sin(a1)) * -s * .24 + s * .1; const hx2 = ex1 + (sd > 0 ? 1 : -1) * Math.cos(a2) * s * .22, hy3 = ey1 - Math.sin(a2) * s * .22 * .8;
        g.beginPath(); g.moveTo(nx, ny + s * .03); g.lineTo(ex1, ey1); g.lineTo(hx2, hy3); g.stroke();
        const k1 = Math.sin(t + (sd > 0 ? 0 : Math.PI)) * .5, kx = hx + sd * s * .1 + k1 * s * .08, ky = hy2 + s * .25, fx = kx + Math.sin(t * 1 + sd) * s * .1, fyy = fy - s * .0 + (sd > 0 ? Math.min(0, -Math.sin(t) * s * .08) : Math.min(0, Math.sin(t) * s * .08));
        g.beginPath(); g.moveTo(hx, hy2); g.lineTo(kx, ky); g.lineTo(fx, fyy); g.stroke();
      }
      g.shadowBlur = 0; g.fillStyle = d.c; g.globalAlpha = .18; g.fillRect(d.x - s * .25, fy + 4, s * .5, 3); g.globalAlpha = 1;
    }
  } },
{ k: 'club',
  init: (W, H, st) => { st.cr = Array.from({ length: 26 }, (_, i) => ({ x: (i + .5) * W / 26 + (rnd() - .5) * 10, s: .7 + rnd() * .5, p: rnd() * 6 })); st.sp = Array.from({ length: 70 }, () => ({ a: rnd() * TAU, r: rnd(), p: rnd() * 6 })); },
  draw(g, W, H, st) {
    g.fillStyle = '#06020c'; g.fillRect(0, 0, W, H); const cx = W / 2, cy = H * .26, R = H * .13;
    g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 14; i++) { const a = st.time * (.4 + (i % 3) * .15) + i * .45, col = `hsla(${(i * 40 + st.time * 40) % 360},100%,60%,`; g.fillStyle = lg(g, cx, cy, cx + Math.cos(a) * W, cy + Math.sin(a) * W, [[0, col + '.35)'], [1, col + '0)']]); g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a - .04) * W * 1.2, cy + Math.sin(a - .04) * W * 1.2); g.lineTo(cx + Math.cos(a + .04) * W * 1.2, cy + Math.sin(a + .04) * W * 1.2); g.fill(); }
    g.globalCompositeOperation = 'source-over';
    g.fillStyle = '#1a1a26'; g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.fill();
    for (let i = 0; i < 90; i++) { const a = i * 2.399 + st.time * .5, rr = Math.sqrt(i / 90) * R * .95, x = cx + Math.cos(a) * rr * Math.cos(st.time * .5 + 1), y = cy + Math.sin(a * 1.0) * rr * .9, br = (Math.sin(st.time * 3 + i) + 1) / 2; g.fillStyle = `hsl(${(i * 13 + st.time * 60) % 360},90%,${40 + br * 50}%)`; g.fillRect(x - 2, y - 2, 4, 4); }
    g.strokeStyle = '#555'; g.beginPath(); g.moveTo(cx, 0); g.lineTo(cx, cy - R); g.stroke();
    for (const s of st.sp) { const a = s.a + st.time * .3, r = R * (1.2 + s.r * 1.4), al = Math.max(0, Math.sin(st.time * 4 + s.p)); g.fillStyle = `rgba(255,255,255,${al * .8})`; g.fillRect(cx + Math.cos(a) * r, cy + Math.sin(a) * r * .8, 2, 2); }
    g.fillStyle = '#04010a'; const base = H;
    for (const c of st.cr) { const y = base - H * .12 - Math.abs(Math.sin(st.time * (3 + st.e * 2) + c.p)) * H * .03, sz = H * .09 * c.s; g.beginPath(); g.arc(c.x, y - sz * .8, sz * .42, 0, TAU); g.fill(); g.fillRect(c.x - sz * .45, y - sz * .45, sz * .9, H); g.lineWidth = sz * .22; g.strokeStyle = '#04010a'; g.lineCap = 'round'; const up = Math.sin(st.time * 4 + c.p) * .4; g.beginPath(); g.moveTo(c.x - sz * .4, y - sz * .3); g.lineTo(c.x - sz * .7, y - sz * (1.3 + up)); g.moveTo(c.x + sz * .4, y - sz * .3); g.lineTo(c.x + sz * .7, y - sz * (1.3 - up)); g.stroke(); }
  } },
{ k: 'fireworks',
  init: (W, H, st) => { st.f = []; st.t0 = 0; st.stars = Array.from({ length: 70 }, () => ({ x: rnd() * W, y: rnd() * H * .6, r: rnd() * 1.2 + .3, p: rnd() * 6 })); st.b = []; let x = 0; while (x < W) { const w = 24 + rnd() * 40; st.b.push({ x, w, h: H * (.08 + rnd() * .16) }); x += w + 2; } },
  draw(g, W, H, st, dt) {
    g.fillStyle = lg(g, 0, 0, 0, H, [[0, '#020412'], [1, '#14103a']]); g.fillRect(0, 0, W, H); g.fillStyle = '#fff'; for (const s of st.stars) { g.globalAlpha = .3 + .5 * Math.abs(Math.sin(st.time + s.p)); g.fillRect(s.x, s.y, s.r, s.r); } g.globalAlpha = 1;
    st.t0 -= dt; if (st.t0 <= 0) { st.t0 = .5 + rnd() * (1 - st.e * .4); const x = W * (.15 + rnd() * .7), y = H * (.12 + rnd() * .3), hue = rnd() * 360, n = 50 + (rnd() * 40 | 0); for (let i = 0; i < n; i++) { const a = rnd() * TAU, v = 30 + rnd() * 110; st.f.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 1, h: hue + rnd() * 30 }); } }
    g.globalCompositeOperation = 'lighter';
    st.f = st.f.filter(p => p.l > 0); for (const p of st.f) { p.vy += 60 * dt; p.vx *= .985; p.x += p.vx * dt; p.y += p.vy * dt; p.l -= dt * .7; g.fillStyle = `hsla(${p.h},100%,65%,${Math.max(0, p.l)})`; g.fillRect(p.x, p.y, 2.2, 2.2); }
    g.globalCompositeOperation = 'source-over'; g.fillStyle = '#05030f'; for (const b of st.b) { g.fillRect(b.x, H - b.h, b.w, b.h); g.fillStyle = '#ffd27a'; for (let yy = H - b.h + 6; yy < H - 4; yy += 9) for (let xx = b.x + 3; xx < b.x + b.w - 3; xx += 7) if (hash(xx + yy * 3) > .72) g.fillRect(xx, yy, 2, 3); g.fillStyle = '#05030f'; }
  } },
{ k: 'tunnel',
  init: () => {},
  draw(g, W, H, st) {
    g.fillStyle = '#02010a'; g.fillRect(0, 0, W, H); const cx = W / 2, cy = H / 2, sp = st.time * (.5 + st.e * .8); g.lineWidth = 2;
    for (let i = 0; i < 26; i++) { const z = ((i / 26 + sp) % 1), r = Math.pow(z, 2.2) * Math.max(W, H) * .9 + 4, rot = st.time * .3 + i * .12, n = 6, hue = (i * 14 + st.time * 50) % 360; g.strokeStyle = `hsla(${hue},100%,60%,${Math.min(1, z * 1.5) * (1 - z * .3)})`; g.shadowColor = `hsl(${hue},100%,60%)`; g.shadowBlur = 8; g.beginPath(); for (let k = 0; k <= n; k++) { const a = rot + k / n * TAU, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * .75; k ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
    g.shadowBlur = 0; g.fillStyle = rgx(g, cx, cy, 0, H * .25, [[0, 'rgba(255,255,255,.35)'], [1, 'rgba(255,255,255,0)']]); g.fillRect(0, 0, W, H);
  } },
{ k: 'vinyl',
  init: () => {},
  draw(g, W, H, st) {
    g.fillStyle = lg(g, 0, 0, W, H, [[0, '#1a0f2e'], [1, '#3a1646']]); g.fillRect(0, 0, W, H); const cx = W * .5, cy = H * .5, R = Math.min(W, H) * .4;
    g.strokeStyle = 'rgba(255,180,255,.12)'; for (let i = 0; i < 5; i++) { const r = R * (1.1 + ((i / 5 + st.time * .25) % 1) * .9); g.globalAlpha = 1 - ((i / 5 + st.time * .25) % 1); g.lineWidth = 2 + st.e * 3; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.stroke(); } g.globalAlpha = 1;
    g.fillStyle = '#0a0a0e'; g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.fill(); g.strokeStyle = 'rgba(255,255,255,.06)'; g.lineWidth = 1; for (let r = R * .32; r < R; r += 4) { g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.stroke(); }
    g.save(); g.translate(cx, cy); g.rotate(st.time * 2.2); g.fillStyle = 'rgba(255,255,255,.07)'; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, R, 0, .5); g.fill(); g.fillStyle = '#ff2e97'; g.beginPath(); g.arc(0, 0, R * .3, 0, TAU); g.fill(); g.fillStyle = '#ffd23c'; g.beginPath(); g.arc(R * .12, 0, R * .04, 0, TAU); g.fill(); g.fillStyle = '#0a0a0e'; g.beginPath(); g.arc(0, 0, R * .04, 0, TAU); g.fill(); g.restore();
    const ang = -.45 + Math.sin(st.time * .05) * .02 + .12; g.save(); g.translate(cx + R * 1.18, cy - R * .8); g.rotate(ang); g.strokeStyle = '#cfd3df'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, 0); g.lineTo(-R * .2, R * 1.0); g.lineTo(-R * .5, R * 1.15); g.stroke(); g.restore();
  } },
{ k: 'ripples',
  init: (W, H, st) => { st.v = new Array(96).fill(0); },
  draw(g, W, H, st, dt) {
    g.fillStyle = lg(g, 0, 0, 0, H, [[0, '#05051a'], [1, '#12063a']]); g.fillRect(0, 0, W, H); const cx = W / 2, cy = H / 2, R = Math.min(W, H) * .22, n = st.v.length;
    g.globalCompositeOperation = 'lighter'; g.fillStyle = rgx(g, cx, cy, R * .5, R * 2.4, [[0, `rgba(120,80,255,${.25 + st.e * .3})`], [1, 'rgba(0,0,0,0)']]); g.fillRect(0, 0, W, H);
    for (let i = 0; i < n; i++) { const tgt = (.25 + .75 * Math.abs(Math.sin(st.time * 1.7 + i * .35) * Math.sin(st.time * .6 + i * .11))) * R * (.4 + st.e * 1.1); st.v[i] += (tgt - st.v[i]) * Math.min(1, dt * 10); const a = i / n * TAU + st.time * .15, c = Math.cos(a), s = Math.sin(a); g.strokeStyle = `hsl(${(i / n * 300 + st.time * 40) % 360},100%,62%)`; g.lineWidth = 3; g.beginPath(); g.moveTo(cx + c * R, cy + s * R); g.lineTo(cx + c * (R + st.v[i]), cy + s * (R + st.v[i])); g.stroke(); }
    g.globalCompositeOperation = 'source-over'; g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, R * .96, 0, TAU); g.stroke();
  } },
{ k: 'birds',
  init: (W, H, st) => { st.b = Array.from({ length: 55 }, () => ({ x: rnd() * W, y: H * (.1 + rnd() * .45), vx: 40 + rnd() * 30, vy: 0, p: rnd() * 6, s: 5 + rnd() * 5 })); },
  draw(g, W, H, st, dt) {
    g.fillStyle = lg(g, 0, 0, 0, H, [[0, '#2b2a6e'], [.5, '#e0658a'], [1, '#ffc480']]); g.fillRect(0, 0, W, H); g.fillStyle = rgx(g, W * .72, H * .72, 0, H * .5, [[0, 'rgba(255,240,190,.95)'], [1, 'rgba(255,200,120,0)']]); g.fillRect(0, 0, W, H);
    g.fillStyle = '#16102e'; g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 20) g.lineTo(x, H * .86 - Math.abs(Math.sin(x * .008)) * H * .1 - Math.sin(x * .02) * H * .02); g.lineTo(W, H); g.fill();
    const tx = W * (.5 + Math.sin(st.time * .3) * .3), ty = H * (.3 + Math.sin(st.time * .5) * .12);
    g.strokeStyle = '#1a1030'; g.lineWidth = 1.6; g.lineCap = 'round';
    for (const b of st.b) { b.vx += (tx - b.x) * .12 * dt; b.vy += (ty - b.y) * .22 * dt; b.vx *= .99; b.vy *= .98; b.x += (b.vx + 50 + st.e * 40) * dt; b.y += b.vy * dt; if (b.x > W + 20) b.x = -20; if (b.x < -40) b.x = W; const f = Math.sin(st.time * 9 + b.p) * b.s * .7; g.beginPath(); g.moveTo(b.x - b.s, b.y - f); g.quadraticCurveTo(b.x - b.s * .4, b.y - b.s * .3, b.x, b.y); g.quadraticCurveTo(b.x + b.s * .4, b.y - b.s * .3, b.x + b.s, b.y - f); g.stroke(); }
  } },
{ k: 'campfire',
  init: (W, H, st) => { st.stars = Array.from({ length: 110 }, () => ({ x: rnd() * W, y: rnd() * H * .6, r: rnd() * 1.3 + .3, p: rnd() * 6 })); st.fl = []; st.sk = []; },
  draw(g, W, H, st, dt) {
    g.fillStyle = lg(g, 0, 0, 0, H, [[0, '#020611'], [1, '#101b2c']]); g.fillRect(0, 0, W, H); g.fillStyle = '#fff'; for (const s of st.stars) { g.globalAlpha = .3 + .7 * Math.abs(Math.sin(st.time * 1.2 + s.p)); g.fillRect(s.x, s.y, s.r, s.r); } g.globalAlpha = 1;
    g.fillStyle = '#0a111b'; g.beginPath(); g.moveTo(0, H * .74); for (let x = 0; x <= W; x += 20) g.lineTo(x, H * .74 - Math.abs(Math.sin(x * .007 + 1)) * H * .2); g.lineTo(W, H * .74); g.lineTo(W, H); g.lineTo(0, H); g.fill();
    g.fillStyle = '#0a0f16'; g.fillRect(0, H * .8, W, H * .2);
    const fx = W / 2, fy = H * .86; g.fillStyle = rgx(g, fx, fy - 30, 0, H * .6, [[0, `rgba(255,150,50,${.35 + st.e * .15})`], [1, 'rgba(255,100,0,0)']]); g.fillRect(0, 0, W, H);
    for (let i = 0; i < 3 + (st.e * 4 | 0); i++) st.fl.push({ x: fx + (rnd() - .5) * 26, y: fy, vx: (rnd() - .5) * 14, vy: -(50 + rnd() * 60), l: 1, r: 8 + rnd() * 10 });
    if (rnd() < dt * 6) st.sk.push({ x: fx + (rnd() - .5) * 20, y: fy - 20, vx: (rnd() - .5) * 50, vy: -(60 + rnd() * 80), l: 1 });
    g.globalCompositeOperation = 'lighter'; st.fl = st.fl.filter(p => p.l > 0);
    for (const p of st.fl) { p.x += p.vx * dt + Math.sin(st.time * 6 + p.y) * .4; p.y += p.vy * dt; p.l -= dt * 1.2; p.r *= .992; g.fillStyle = rgx(g, p.x, p.y, 0, p.r, [[0, `rgba(255,${200 * p.l + 40 | 0},60,${p.l * .55})`], [1, 'rgba(255,80,0,0)']]); g.beginPath(); g.arc(p.x, p.y, p.r, 0, TAU); g.fill(); }
    st.sk = st.sk.filter(p => p.l > 0); for (const p of st.sk) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 20 * dt; p.l -= dt * .5; g.fillStyle = `rgba(255,200,100,${p.l})`; g.fillRect(p.x, p.y, 2, 2); }
    g.globalCompositeOperation = 'source-over'; g.strokeStyle = '#2a1a10'; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(fx - 34, fy + 6); g.lineTo(fx + 30, fy - 4); g.moveTo(fx - 28, fy - 4); g.lineTo(fx + 34, fy + 6); g.stroke();
  } }
];
const ROAD = [];
const KEYS = NEW.map(s => s.k);
function createNew(canvas, sc, playing) {
  const st = { time: 0, e: .15 }; let last = performance.now(), raf = 0, miss = 0;
  function frame(now) {
    if (!canvas.isConnected) { if (++miss > 40) return; raf = requestAnimationFrame(frame); return; } miss = 0;
    const pl = playing();
    if (document.hidden || now - last < (pl ? (window.SEN_ECO ? 90 : 41) : 200)) { raf = requestAnimationFrame(frame); return; }
    const cw = Math.max(240, Math.round((canvas.clientWidth || 600) * .8)), ch = Math.max(120, Math.round((canvas.clientHeight || 300) * (window.SEN_ECO ? .55 : .8)));
    if (canvas.width !== cw || canvas.height !== ch || !st.ready) { canvas.width = cw; canvas.height = ch; st.ready = 1; sc.init(cw, ch, st); }
    const dt = Math.min(.08, (now - last) / 1000); last = now;
    st.time += dt * (pl ? 1 : .25); st.e += ((pl ? .55 + .45 * Math.sin(st.time * 2.3) * Math.sin(st.time * .7 + 1) : .12) - st.e) * Math.min(1, dt * 4);
    try { sc.draw(canvas.getContext('2d'), canvas.width, canvas.height, st, dt * (pl ? 1 : .25)); } catch (e) { /* ignore */ }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame); return () => cancelAnimationFrame(raf);
}
function create(canvas, spec, playing) {
  if (typeof spec === 'number') { if (spec < NEW.length) return createNew(canvas, NEW[spec], playing); spec = SC[0]; }
  return createRoad(canvas, spec, playing);
}
window.SENFX = { count: NEW.length + ROAD.length, meta: KEYS.map(k => ({ k })), create };
})();
