/* fx3d.js - 256 صحنه سه‌بعدی (پرسپکتیو) روی Canvas. بعد از scenes.js بارگذاری شود. */
(() => {
  const BASE = window.SENFX;
  if (!BASE || window.__SEN3D) return;
  window.__SEN3D = true;

  const BASEN = BASE.count;
  const TAU = Math.PI * 2;
  const PAL = [
    ['#00e5ff', '#ff2bd6'], ['#ff8a00', '#ff2d2d'], ['#39ff14', '#f6ff00'], ['#8a5cff', '#2d7bff'],
    ['#ffd700', '#ffffff'], ['#00ffc3', '#3b3bff'], ['#ff5fa2', '#ffe066'], ['#7ff3ff', '#1a6bff']
  ];
  const SPEED = [0.6, 1, 1.5, 2.2];
  const FAMS = ['Warp Tunnel', '3D Terrain', 'Glow Sphere', 'Torus Rings', 'DNA Helix', 'Cube Lattice', 'Orbit Planets', '3D Equalizer'];
  const PV = PAL.length * SPEED.length;
  const N3 = FAMS.length * PV;

  const rgb = h => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const mix = (A, B, t, a) => {
    const p = rgb(A), q = rgb(B), k = clamp(t);
    return `rgba(${p[0] + (q[0] - p[0]) * k | 0},${p[1] + (q[1] - p[1]) * k | 0},${p[2] + (q[2] - p[2]) * k | 0},${clamp(a)})`;
  };
  const hexa = (h, a) => mix(h, h, 0, a);
  const rng = s => () => {
    s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const rotX = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c]; };
  const rotY = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c]; };
  const glow = (ctx, x, y, r, col, a) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, hexa(col, a)); g.addColorStop(1, hexa(col, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  };

  /* ---------- ۸ خانواده‌ی صحنه ---------- */

  // 1) تونل ستاره‌ای با حلقه‌های سه‌بعدی
  const fWarp = st => {
    let S = [];
    return {
      init() { const r = rng(st.seed); S = Array.from({ length: 280 }, (_, i) => ({ a: r() * TAU, rr: 0.15 + r() * 1.3, z0: r() * 40, c: i & 1 })); },
      draw(ctx, t, w, h) {
        const cx = w / 2, cy = h / 2, F = Math.min(w, h) * 0.9, sp = st.sp, L = 40;
        const zf = z0 => ((z0 - t * 8 * sp) % L + L) % L + 0.5;
        ctx.lineCap = 'round';
        for (const s of S) {
          const zz = zf(s.z0), zp = zz + 1.5 + sp;
          const x = Math.cos(s.a) * s.rr * 12, y = Math.sin(s.a) * s.rr * 12;
          ctx.strokeStyle = mix(st.c1, st.c2, s.c, clamp((L + 0.5 - zz) / 10) * clamp(zz / 3));
          ctx.lineWidth = 0.6 + 2.2 * (1 - zz / L);
          ctx.beginPath();
          ctx.moveTo(cx + x * F / zp, cy + y * F / zp);
          ctx.lineTo(cx + x * F / zz, cy + y * F / zz);
          ctx.stroke();
        }
        for (let i = 0; i < 5; i++) {
          const zr = zf(i * 8);
          ctx.strokeStyle = mix(st.c1, st.c2, 0.5, clamp((L + 0.5 - zr) / 12) * clamp(zr / 3) * 0.8);
          ctx.lineWidth = Math.min(5, 1 + 3 / zr);
          ctx.beginPath(); ctx.arc(cx, cy, 12 * F / zr, 0, TAU); ctx.stroke();
        }
      }
    };
  };

  // 2) زمین موج‌دار سه‌بعدی که به سمت دوربین حرکت می‌کند
  const fTerrain = st => ({
    init() {},
    draw(ctx, t, w, h) {
      const F = Math.min(w, h) * 1.1, hz = h * 0.4, C = 26, R = 20, gap = 1.2, cam = 1.6;
      const off = (t * 2.4 * st.sp) % gap;
      const rows = [];
      for (let j = 0; j < R; j++) {
        const z = Math.max(0.25, gap * (j + 1) - off), row = [];
        for (let i = 0; i < C; i++) {
          const x = -14 + i * 28 / (C - 1);
          const y = 2.2 * Math.sin(x * 0.45 + t * 0.9 * st.sp) * Math.cos(z * 0.35 - t * 0.6 * st.sp)
                  + 1.2 * Math.sin(z * 0.9 + x * 0.2 - t * 1.4 * st.sp);
          row.push([w / 2 + x * F / z, hz + (cam - y) * F / z, z, y]);
        }
        rows.push(row);
      }
      ctx.lineWidth = 1.2;
      for (let j = R - 1; j >= 0; j--) {
        const row = rows[j], z = row[0][2];
        const hAvg = row.reduce((s, p) => s + p[3], 0) / C;
        const a = clamp(z / 2.5) * clamp(1 - z / (R * gap), 0.08);
        ctx.beginPath();
        row.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
        ctx.strokeStyle = mix(st.c1, st.c2, (hAvg + 3) / 6, a);
        ctx.stroke();
      }
      for (let i = 0; i < C; i += 2) {
        ctx.beginPath();
        for (let j = 0; j < R; j++) { const p = rows[j][i]; j ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
        ctx.strokeStyle = mix(st.c2, st.c1, i / (C - 1), 0.18);
        ctx.stroke();
      }
    }
  });

  // 3) کره‌ی نقطه‌ای چرخان با هالهٔ نور
  const fOrb = st => {
    let P = [];
    return {
      init() {
        const n = 420, g = Math.PI * (3 - Math.sqrt(5));
        P = Array.from({ length: n }, (_, i) => {
          const y = 1 - i / (n - 1) * 2, r = Math.sqrt(1 - y * y), th = g * i;
          return [Math.cos(th) * r, y, Math.sin(th) * r, i % 3 === 0 ? 1 : 0];
        });
      },
      draw(ctx, t, w, h) {
        const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.3 * (1 + 0.04 * Math.sin(t * 2));
        glow(ctx, cx, cy, R * 2, st.c1, 0.3);
        glow(ctx, cx, cy, R * 1.25, st.c2, 0.22);
        const ry = t * 0.5 * st.sp, rx = 0.35 + 0.25 * Math.sin(t * 0.3);
        for (const p of P) {
          const q = rotY(rotX(p, rx), ry), d = clamp((q[2] + 1) / 2);
          ctx.fillStyle = mix(st.c1, st.c2, p[3], 0.15 + 0.85 * d);
          ctx.beginPath(); ctx.arc(cx + q[0] * R, cy + q[1] * R, 0.8 + 2.2 * d, 0, TAU); ctx.fill();
        }
      }
    };
  };

  // 4) حلقه‌های تورُس (دونات) سیم‌کشی شده
  const fTorus = st => ({
    init() {},
    draw(ctx, t, w, h) {
      const cx = w / 2, cy = h / 2, m = Math.min(w, h), S = m * 0.9, D = 4.5, U = 40, V = 16, Rr = 2, r = 0.8;
      const rx = 1 + 0.2 * Math.sin(t * 0.4), ry = t * 0.7 * st.sp;
      const pt = (u, v) => { const k = Rr + r * Math.cos(v); return [k * Math.cos(u), r * Math.sin(v), k * Math.sin(u)]; };
      const P = (u, v) => { const q = rotY(rotX(pt(u, v), rx), ry), k = S / (D + q[2]); return [cx + q[0] * k, cy + q[1] * k, q[2]]; };
      const dA = zavg => 0.3 + 0.35 * ((zavg(zavg) => zavg)(zavg) / 2.8 + 1) / 2;
      ctx.lineWidth = 1.3;
      for (let j = 0; j < U; j++) {
        ctx.beginPath(); let zs = 0;
        for (let k = 0; k <= V; k++) { const p = P(j / U * TAU, k / V * TAU); zs += p[2]; k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
        ctx.strokeStyle = mix(st.c1, st.c2, j / U, dA(zs / (V + 1)));
        ctx.stroke();
      }
      for (let k = 0; k < V; k++) {
        ctx.beginPath(); let zs = 0;
        for (let j = 0; j <= U; j++) { const p = P(j / U * TAU, k / V * TAU); zs += p[2]; j ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
        ctx.strokeStyle = mix(st.c2, st.c1, k / V, dA(zs / (U + 1)));
        ctx.stroke();
      }
    }
  });

  // 5) مارپیچ DNA که بالا می‌رود
  const fDna = st => ({
    init() {},
    draw(ctx, t, w, h) {
      const cx = w / 2, cy = h / 2, m = Math.min(w, h), S = m * 0.9, D = 5, ry = t * 0.6 * st.sp, rx = 0.25;
      const P = (x, y, z) => { const q = rotY(rotX([x, y, z], rx), ry), k = S / (D + q[2]); return [cx + q[0] * k, cy + q[1] * k, q[2]]; };
      const fr = (t * 3 * st.sp) % 1, rot = t * 1.4 * st.sp;
      const A = [], B = [];
      for (let k = -6; k < 96; k++) {
        const idx = k + fr, y = idx * 0.1 - 4.5, a = idx * 0.2618 + rot;
        A.push(P(Math.cos(a) * 1.2, y, Math.sin(a) * 1.2));
        B.push(P(-Math.cos(a) * 1.2, y, -Math.sin(a) * 1.2));
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < A.length; i += 3) {
        const p = A[i], q = B[i];
        ctx.strokeStyle = mix(st.c1, st.c2, i / A.length, 0.35);
        ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
      }
      for (const [arr, col] of [[A, st.c1], [B, st.c2]]) {
        ctx.lineWidth = 2;
        ctx.beginPath();
        arr.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
        ctx.strokeStyle = hexa(col, 0.7); ctx.stroke();
        for (const p of arr) {
          const d = clamp((p[2] + 1.2) / 2.4);
          ctx.fillStyle = hexa(col, 0.3 + 0.7 * d);
          ctx.beginPath(); ctx.arc(p[0], p[1], 1.5 + 3 * d, 0, TAU); ctx.fill();
        }
      }
    }
  });

  // 6) شبکه‌ی مکعب‌های سیم‌کشی چرخان
  const fCube = st => {
    const V = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
    const E = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
    const G = 4, gap = 1.7;
    return {
      init() {},
      draw(ctx, t, w, h) {
        const cx = w / 2, cy = h / 2, m = Math.min(w, h), S = m * 1.1, D = 8;
        const rx = 0.5 + 0.25 * Math.sin(t * 0.3), ry = t * 0.45 * st.sp;
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 * st.sp);
        const P = p => { const q = rotY(rotX(p, rx), ry), k = S / (D + q[2]); return [cx + q[0] * k, cy + q[1] * k, q[2]]; };
        const list = [];
        for (let x = 0; x < G; x++) for (let y = 0; y < G; y++) for (let z = 0; z < G; z++) {
          const c = [(x - (G - 1) / 2) * gap, (y - (G - 1) / 2) * gap, (z - (G - 1) / 2) * gap];
          const sc = 0.22 + 0.12 * pulse * (((x + y + z) & 1) ? 1 : 0.3);
          const pts = V.map(v => P([c[0] + v[0] * sc, c[1] + v[1] * sc, c[2] + v[2] * sc]));
          list.push({ pts, z: pts.reduce((s, p) => s + p[2], 0) / 8, col: (x + y + z) / (3 * (G - 1)) });
        }
        list.sort((a, b) => b.z - a.z);
        for (const c of list) {
          const d = clamp((c.z + 4.5) / 9);
          ctx.lineWidth = 1;
          ctx.strokeStyle = mix(st.c1, st.c2, c.col, 0.25 + 0.6 * d);
          ctx.beginPath();
          for (const [a, b] of E) { ctx.moveTo(c.pts[a][0], c.pts[a][1]); ctx.lineTo(c.pts[b][0], c.pts[b][1]); }
          ctx.stroke();
          ctx.fillStyle = hexa(st.c2, 0.4 + 0.6 * d);
          for (const p of c.pts) { ctx.beginPath(); ctx.arc(p[0], p[1], 1.6, 0, TAU); ctx.fill(); }
        }
      }
    };
  };

  // 7) سیاره‌های کروی روی مدارهای مایل دور یک خورشید
  const fPlanet = st => {
    let O = [];
    return {
      init() {
        const r = rng(st.seed);
        O = Array.from({ length: 5 }, (_, i) => ({
          r: 1.3 + i * 0.6 + r() * 0.2, tilt: (r() - 0.5) * 1.8,
          spd: (0.5 + r() * 0.8) / (1 + i * 0.3), s: 0.22 + r() * 0.2, ph: r() * TAU, c: r()
        }));
      },
      draw(ctx, t, w, h) {
        const cx = w / 2, cy = h / 2, m = Math.min(w, h), S = m, D = 9, ry = t * 0.15 * st.sp;
        const P = p => { const q = rotY(p, ry), k = S / (D + q[2]); return [cx + q[0] * k, cy + q[1] * k, q[2], k]; };
        glow(ctx, cx, cy, m * 0.25, st.c1, 0.35);
        ctx.lineWidth = 1;
        for (const o of O) {
          ctx.beginPath();
          for (let i = 0; i <= 72; i++) {
            const a = i / 72 * TAU, p = P(rotX([o.r * Math.cos(a), 0, o.r * Math.sin(a)], o.tilt));
            i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]);
          }
          ctx.strokeStyle = hexa(st.c2, 0.18); ctx.stroke();
        }
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(cx, cy, m * 0.04, 0, TAU); ctx.fill();
        const items = O.map(o => {
          const a = o.ph + t * o.spd * st.sp;
          return { o, p: P(rotX([o.r * Math.cos(a), 0, o.r * Math.sin(a)], o.tilt)) };
        }).sort((a, b) => b.p[2] - a.p[2]);
        for (const { o, p } of items) {
          const x = p[0], y = p[1], R = o.s * p[3];
          const g = ctx.createRadialGradient(x - R * 0.35, y - R * 0.35, R * 0.1, x, y, R);
          g.addColorStop(0, '#ffffff');
          g.addColorStop(0.35, mix(st.c1, st.c2, o.c, 1));
          g.addColorStop(1, 'rgba(0,0,0,0.9)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.fill();
        }
      }
    };
  };

  // 8) اکولایزر سه‌بعدی روی زمین پرسپکتیو
  const fEq = st => ({
    init() {},
    draw(ctx, t, w, h) {
      const C = 18, R = 12, gap = 1.1, hz = h * 0.42, F = Math.min(w, h) * 1.1, cam = 1.2, sp = st.sp;
      const off = (t * 1.5 * sp) % gap;
      for (let j = R - 1; j >= 0; j--) {
        const z = Math.max(0.6, gap * (j + 1) - off), k = F / z;
        const a = clamp(z / 2) * clamp(1 - z / (R * gap), 0.12);
        for (let i = 0; i < C; i++) {
          const x = (i - (C - 1) / 2) * 0.9;
          const amp = Math.abs(Math.sin(i * 0.55 + j * 0.25 + t * 3 * sp)) * (0.55 + 0.45 * Math.sin(t * 1.1 * sp + i * 0.4));
          const hgt = 0.2 + amp * 3.2;
          const bw = Math.max(1, 0.32 * k), bx = w / 2 + x * k - bw / 2;
          const top = hz + (cam - hgt) * k, base = hz + cam * k;
          ctx.fillStyle = mix(st.c1, st.c2, amp, a * 0.85);
          ctx.fillRect(bx, top, bw, base - top);
          ctx.fillStyle = hexa(st.c2, a);
          ctx.fillRect(bx, top, bw, Math.max(1, 0.05 * k));
        }
      }
    }
  });

  const FNS = [fWarp, fTerrain, fOrb, fTorus, fDna, fCube, fPlanet, fEq];

  /* ---------- موتور اجرا ---------- */
  const make = (g, canvas, playing) => {
    const f = Math.floor(g / PV), rem = g % PV, p = Math.floor(rem / SPEED.length), v = rem % SPEED.length;
    const st = { c1: PAL[p][0], c2: PAL[p][1], sp: SPEED[v], seed: 7919 + g * 104729, t: 0 };
    const R = FNS[f](st);
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, raf = 0, alive = true, run = !!playing, last = 0;

    const fit = () => {
      const r = canvas.getBoundingClientRect();
      const W = Math.max(2, Math.round(r.width)), H = Math.max(2, Math.round(r.height));
      if (W === w && H === h) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      w = W; h = H; R.init(w, h);
    };
    const paint = () => {
      fit();
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#05060b'; ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      R.draw(ctx, st.t, w, h);
      ctx.globalCompositeOperation = 'source-over';
    };
    const frame = now => {
      raf = 0;
      if (!alive) return;
      if (last && run) st.t += Math.min(0.05, (now - last) / 1000);
      last = now;
      paint();
      if (run) raf = requestAnimationFrame(frame);
    };
    const go = () => { if (alive && run && !raf) { last = 0; raf = requestAnimationFrame(frame); } };
    const set = val => {
      run = !!val;
      if (run) go();
      else { if (raf) cancelAnimationFrame(raf); raf = 0; last = 0; paint(); }
    };
    paint();
    if (run) go();
    return {
      play: () => set(true), pause: () => set(false), stop: () => set(false), setPlaying: set,
      destroy() { alive = false; if (raf) cancelAnimationFrame(raf); raf = 0; }
    };
  };

  /* ---------- اتصال به سیستم صحنه‌ها ---------- */
  const META3 = Array.from({ length: N3 }, (_, g) => {
    const f = Math.floor(g / PV), rem = g % PV;
    return { k: 'x3d' + g, name: `${FAMS[f]} ${Math.floor(rem / SPEED.length) + 1}.${rem % SPEED.length + 1}` };
  });

  window.SENFX = {
    count: BASEN + N3,
    meta: [...BASE.meta, ...META3],
    create(canvas, spec, playing) {
      if (typeof spec === 'number' && spec >= BASEN && spec < BASEN + N3) return make(spec - BASEN, canvas, playing);
      return BASE.create(canvas, spec, playing);
    }
  };
})();
