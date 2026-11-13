// renderer/scenes.js — 1020 generated music scenes (12 types x 17 palettes x 5 motions)
(function () {
  const base = window.SENFX;
  if (!base) return;
  const ORIG = base.count;
  const TYPES = ['Starfield', 'Waves', 'Rain', 'Particles', 'Grid', 'Aurora', 'Equalizer', 'Rings', 'Blobs', 'Constellation', 'Snow', 'Fireflies'];
  const PAL = [
    ['#05060f', '#4a8cff', '#a046ff', '#00e5ff'], ['#0b1622', '#2aa7ff', '#7fe3ff', '#ffffff'],
    ['#0c1713', '#2ecc8f', '#a6ffd6', '#e5f5ee'], ['#1c0f14', '#ff7a45', '#ffc36b', '#ff3d6e'],
    ['#fdf1f5', '#e0457b', '#ff9ec0', '#8b6573'], ['#f6f0e4', '#c1862b', '#ffd27a', '#857a63'],
    ['#07070f', '#8b7bff', '#c6b8ff', '#ffffff'], ['#070b10', '#00f0c8', '#00a3ff', '#d8fff7'],
    ['#000000', '#ffffff', '#9aa0a6', '#4285f4'], ['#0a0a0a', '#ff1744', '#ff8a00', '#ffea00'],
    ['#001219', '#005f73', '#0a9396', '#94d2bd'], ['#10002b', '#7b2cbf', '#c77dff', '#e0aaff'],
    ['#1a1a2e', '#e94560', '#0f9ed5', '#ffd6e0'], ['#0d1b2a', '#415a77', '#778da9', '#e0e1dd'],
    ['#2b2118', '#ffb347', '#ff6f61', '#fdf6e3'], ['#021b1b', '#00ffa3', '#00b3ff', '#ffffff'],
    ['#eef2f3', '#2c3e50', '#3498db', '#95a5a6']
  ];
  const MO = [{ s: .25, d: 1, a: .6 }, { s: .5, d: 1, a: 1 }, { s: 1, d: -1, a: 1 }, { s: 1.6, d: 1, a: 1.4 }, { s: .4, d: -1, a: 2 }];
  const PER = PAL.length * MO.length; // 85 scenes per type
  const GEN = TYPES.length * PER;     // 1020

  const rng = seed => { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  const N = (R, n, f) => Array.from({ length: n }, () => f(R));

  const TY = [
    { // 0 Starfield
      init: R => N(R, 260, R => ({ x: R() * 2 - 1, y: R() * 2 - 1, z: R(), c: R() })),
      draw: (x, S, W, H, tt, P, M) => {
        for (const s of S) {
          const z = (((s.z - tt * .12 * M.d) % 1) + 1) % 1 * .98 + .02;
          const px = W / 2 + s.x / z * W * .25, py = H / 2 + s.y / z * H * .25;
          if (px < 0 || px > W || py < 0 || py > H) continue;
          x.globalAlpha = 1 - z; x.fillStyle = P[1 + Math.floor(s.c * 3)];
          x.beginPath(); x.arc(px, py, (1 - z) * 2.4 + .4, 0, 7); x.fill();
        }
        x.globalAlpha = 1;
      }
    },
    { // 1 Waves
      init: R => N(R, 7, R => ({ f: .004 + R() * .01, p: R() * 6.3, a: .4 + R() * .6, y: .3 + R() * .5 })),
      draw: (x, S, W, H, tt, P, M) => {
        S.forEach((w, k) => {
          x.globalAlpha = .55; x.strokeStyle = P[1 + k % 3]; x.lineWidth = 2; x.beginPath();
          for (let px = 0; px <= W; px += 6) {
            const py = H * w.y + Math.sin(px * w.f + tt * 2 * M.d + w.p) * H * .08 * w.a * M.a;
            if (px === 0) x.moveTo(px, py); else x.lineTo(px, py);
          }
          x.stroke();
        });
        x.globalAlpha = 1;
      }
    },
    { // 2 Rain
      init: R => N(R, 140, R => ({ x: R(), y: R(), v: .4 + R() * .9, l: 6 + R() * 16 })),
      draw: (x, S, W, H, tt, P, M) => {
        x.strokeStyle = P[3]; x.lineWidth = 1.2; x.globalAlpha = .6; x.beginPath();
        for (const d of S) { const y = (((d.y + tt * d.v * .5 * M.d) % 1) + 1) % 1 * H, px = d.x * W; x.moveTo(px, y); x.lineTo(px - d.l * .2, y - d.l); }
        x.stroke(); x.globalAlpha = 1;
      }
    },
    { // 3 Particles
      init: R => N(R, 90, R => ({ x: R(), y: R(), v: .01 + R() * .04, f: .5 + R() * 1.5, p: R() * 6.3, a: .01 + R() * .03, r: .8 + R() * 2.6, c: 1 + Math.floor(R() * 3) })),
      draw: (x, S, W, H, tt, P, M) => {
        for (const p of S) {
          const px = (p.x + Math.sin(tt * p.f + p.p) * p.a) * W, py = (((p.y - tt * p.v * M.d) % 1) + 1) % 1 * H;
          x.fillStyle = P[p.c]; x.globalAlpha = .75; x.beginPath(); x.arc(px, py, p.r, 0, 7); x.fill();
        }
        x.globalAlpha = 1;
      }
    },
    { // 4 Grid (perspective)
      init: () => null,
      draw: (x, S, W, H, tt, P, M) => {
        const hz = H * .42, vx = W / 2;
        x.strokeStyle = P[1]; x.lineWidth = 1; x.globalAlpha = .5; x.beginPath();
        for (let i = -12; i <= 12; i++) { x.moveTo(vx + i * W * .12, H); x.lineTo(vx + i * W * .02, hz); }
        for (let k = 0; k < 14; k++) { const u = (((k / 14 + tt * .08 * M.d) % 1) + 1) % 1, y = hz + (H - hz) * u * u; x.moveTo(0, y); x.lineTo(W, y); }
        x.stroke(); x.globalAlpha = 1;
      }
    },
    { // 5 Aurora
      init: R => N(R, 5, R => ({ p: R() * 6.3, f: .002 + R() * .003, y: .15 + R() * .3, c: 1 + Math.floor(R() * 3) })),
      draw: (x, S, W, H, tt, P, M) => {
        S.forEach(a => {
          const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, P[a.c]); g.addColorStop(1, 'rgba(0,0,0,0)');
          x.fillStyle = g; x.globalAlpha = .35; x.beginPath(); x.moveTo(0, H);
          for (let px = 0; px <= W; px += 6) x.lineTo(px, H * a.y + Math.sin(px * a.f + tt * .8 * M.d + a.p) * H * .12);
          x.lineTo(W, H); x.closePath(); x.fill();
        });
        x.globalAlpha = 1;
      }
    },
    { // 6 Equalizer
      init: R => N(R, 48, R => ({ f: .6 + R() * 2.4, p: R() * 6.3 })),
      draw: (x, S, W, H, tt, P, M) => {
        const bw = W / S.length;
        S.forEach((b, i) => {
          const v = Math.min(1, (.1 + .85 * Math.abs(Math.sin(tt * b.f * 2 + b.p))) * M.a), hh = v * H * .9;
          const g = x.createLinearGradient(0, H, 0, H - hh); g.addColorStop(0, P[1]); g.addColorStop(1, P[3]);
          x.fillStyle = g; x.fillRect(i * bw + bw * .2, H - hh, bw * .6, hh);
        });
      }
    },
    { // 7 Rings
      init: () => null,
      draw: (x, S, W, H, tt, P, M) => {
        const R0 = Math.max(W, H) * .75; x.lineWidth = 2.5;
        for (let k = 0; k < 9; k++) {
          const u = (((k / 9 + tt * .08 * M.d) % 1) + 1) % 1;
          x.globalAlpha = (1 - u) * .8; x.strokeStyle = P[1 + k % 3];
          x.beginPath(); x.arc(W / 2, H / 2, u * R0, 0, 7); x.stroke();
        }
        x.globalAlpha = 1;
      }
    },
    { // 8 Blobs
      init: R => N(R, 6, R => ({ x: R(), y: R(), r: .25 + R() * .3, f: .05 + R() * .15, p: R() * 6.3, c: 1 + Math.floor(R() * 3) })),
      draw: (x, S, W, H, tt, P, M) => {
        x.globalCompositeOperation = 'lighter';
        for (const b of S) {
          const px = (b.x + Math.sin(tt * b.f * M.a + b.p) * .2) * W, py = (b.y + Math.cos(tt * b.f * M.a + b.p) * .2) * H, r = b.r * Math.max(W, H);
          const g = x.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, P[b.c]); g.addColorStop(1, 'rgba(0,0,0,0)');
          x.globalAlpha = .55; x.fillStyle = g; x.fillRect(0, 0, W, H);
        }
        x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
      }
    },
    { // 9 Constellation
      init: R => N(R, 46, R => ({ x: R(), y: R(), vx: (R() - .5) * .04, vy: (R() - .5) * .04 })),
      draw: (x, S, W, H, tt, P, M) => {
        const pts = S.map(p => [(((p.x + p.vx * tt * M.d) % 1) + 1) % 1 * W, (((p.y + p.vy * tt * M.d) % 1) + 1) % 1 * H]);
        const lim = Math.min(W, H) * .22; x.lineWidth = 1; x.strokeStyle = P[1];
        for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
          if (d < lim) { x.globalAlpha = (1 - d / lim) * .7; x.beginPath(); x.moveTo(pts[i][0], pts[i][1]); x.lineTo(pts[j][0], pts[j][1]); x.stroke(); }
        }
        x.fillStyle = P[3];
        for (const [px, py] of pts) { x.globalAlpha = .9; x.beginPath(); x.arc(px, py, 1.8, 0, 7); x.fill(); }
        x.globalAlpha = 1;
      }
    },
    { // 10 Snow
      init: R => N(R, 120, R => ({ x: R(), y: R(), v: .03 + R() * .05, f: .4 + R() * .8, p: R() * 6.3, a: .02 + R() * .03, r: 1 + R() * 2.5 })),
      draw: (x, S, W, H, tt, P, M) => {
        x.fillStyle = P[3];
        for (const p of S) {
          const px = (p.x + Math.sin(tt * p.f + p.p) * p.a * M.a) * W, py = (((p.y + tt * p.v * M.d) % 1) + 1) % 1 * H;
          x.globalAlpha = .85; x.beginPath(); x.arc(px, py, p.r, 0, 7); x.fill();
        }
        x.globalAlpha = 1;
      }
    },
    { // 11 Fireflies
      init: R => N(R, 40, R => ({ x: R(), y: R(), ax: .05 + R() * .1, ay: .05 + R() * .1, f: .2 + R() * .6, p: R() * 6.3, c: 1 + Math.floor(R() * 3) })),
      draw: (x, S, W, H, tt, P, M) => {
        x.globalCompositeOperation = 'lighter';
        for (const b of S) {
          const px = (b.x + Math.sin(tt * b.f * M.a + b.p) * b.ax) * W, py = (b.y + Math.cos(tt * b.f * .7 * M.a + b.p * 2) * b.ay) * H;
          const glow = .5 + .5 * Math.sin(tt * 2 + b.p), r = 10 + glow * 8;
          const g = x.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, P[b.c]); g.addColorStop(1, 'rgba(0,0,0,0)');
          x.globalAlpha = .3 + glow * .6; x.fillStyle = g; x.fillRect(px - r, py - r, r * 2, r * 2);
        }
        x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
      }
    }
  ];

  function gen(canvas, g, playing) {
    const ty = Math.floor(g / PER), p = Math.floor(g / MO.length) % PAL.length, m = g % MO.length;
    const P = PAL[p], M = MO[m], T = TY[ty], x = canvas.getContext('2d');
    let W = 0, H = 0, S = null, raf = 0, alive = true, last = 0, tt = 0;
    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1), w = canvas.clientWidth || 320, h = canvas.clientHeight || 180;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
      x.setTransform(canvas.width / w, 0, 0, canvas.height / h, 0, 0);
      if (w !== W || h !== H || !S) { W = w; H = h; S = T.init(rng(g * 9973 + 17), W, H, P, M); }
    };
    const draw = () => { x.globalAlpha = 1; x.fillStyle = P[0]; x.fillRect(0, 0, W, H); T.draw(x, S, W, H, tt, P, M); };
    const loop = now => {
      if (!alive) return;
      if (!canvas.isConnected) { alive = false; return; }
      raf = requestAnimationFrame(loop);
      const live = !playing || playing(), fps = live ? (window.SEN_ECO ? 15 : 30) : 3;
      if (now - last < 1000 / fps) return;
      const dt = last ? Math.min(.1, (now - last) / 1000) : 0; last = now;
      if (live) tt += dt * M.s;
      fit(); draw();
    };
    fit(); draw(); raf = requestAnimationFrame(loop);
    return () => { alive = false; cancelAnimationFrame(raf); };
  }

  window.SENFX = {
    count: ORIG + GEN,
    meta: [...base.meta.slice(0, ORIG), ...Array.from({ length: GEN }, (_, g) => ({ k: 'gen' + g, name: `${TYPES[Math.floor(g / PER)]} ${Math.floor(g / MO.length) % PAL.length + 1}·${g % MO.length + 1}` }))],
    create: (canvas, spec, playing) => (typeof spec === 'number' && spec >= ORIG) ? gen(canvas, spec - ORIG, playing) : base.create(canvas, spec, playing)
  };
})();
