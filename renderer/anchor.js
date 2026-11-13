/* anchor.js - گزارش بارش ۶ ساعت آینده با مجری کارتونی (FA / EN / AR) */
(() => {
  const KEY = 'sen.anchorLang';
  const pad = n => String(n).padStart(2, '0');
  const toFa = s => String(s).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  const ICO = { dry: '☀️', light: '🌦️', mid: '🌧️', heavy: '⛈️', snow: '❄️', storm: '🌩️' };

  const TXT = {
    fa: {
      dir: 'rtl', voice: 'fa', loc: 'fa-IR',
      title: 'گزارش بارش ۶ ساعت آینده',
      intro: 'سلام! گزارش بارش شش ساعت آینده را می‌دهم.',
      allDry: 'در شش ساعت آینده بارشی پیش‌بینی نمی‌شود.',
      outro: 'این بود گزارش. مراقب خودتان باشید.',
      cat: { dry: 'بدون بارش', light: 'باران ملایم', mid: 'باران متوسط', heavy: 'باران شدید', snow: 'برف', storm: 'رگبار همراه با رعد و برق' },
      seg: (a, b, n, p) => `از ساعت ${a} تا ${b}: ${n}${p == null ? '' : '، با احتمال حدود ' + p + '٪'}.`,
      ui: { replay: 'پخش دوباره', app: 'همان زبان برنامه', loading: 'در حال دریافت پیش‌بینی…',
            err: 'دریافت پیش‌بینی ممکن نشد. اینترنت را بررسی کن.',
            noVoice: 'صدای این زبان روی سیستم نصب نیست؛ متن نمایش داده می‌شود.', lang: 'زبان مجری', close: 'بستن' }
    },
    en: {
      dir: 'ltr', voice: 'en', loc: 'en-US',
      title: 'Rain report: next 6 hours',
      intro: 'Hi there! Here is the rain forecast for the next six hours.',
      allDry: 'No rain is expected in the next six hours.',
      outro: 'That was the report. Stay safe!',
      cat: { dry: 'no rain', light: 'light rain', mid: 'moderate rain', heavy: 'heavy rain', snow: 'snow', storm: 'thunderstorms' },
      seg: (a, b, n, p) => `From ${a} to ${b}: ${n}${p == null ? '' : ', chance about ' + p + '%'}.`,
      ui: { replay: 'Replay', app: 'Same as app', loading: 'Fetching forecast…',
            err: 'Could not fetch the forecast. Check your internet connection.',
            noVoice: 'No voice for this language on this system; text is shown.', lang: 'Presenter language', close: 'Close' }
    },
    ar: {
      dir: 'rtl', voice: 'ar', loc: 'ar-SA',
      title: 'تقرير الأمطار للساعات الست القادمة',
      intro: 'مرحباً! إليكم توقعات الأمطار للساعات الست القادمة.',
      allDry: 'لا يُتوقع هطول أمطار خلال الساعات الست القادمة.',
      outro: 'هذا كان التقرير. كونوا بخير!',
      cat: { dry: 'جاف', light: 'أمطار خفيفة', mid: 'أمطار متوسطة', heavy: 'أمطار غزيرة', snow: 'ثلوج', storm: 'عواصف رعدية' },
      seg: (a, b, n, p) => `من ${a} إلى ${b}: ${n}${p == null ? '' : '، باحتمال نحو ' + p + '٪'}.`,
      ui: { replay: 'إعادة التشغيل', app: 'لغة التطبيق', loading: 'جارٍ جلب التوقعات…',
            err: 'تعذّر جلب التوقعات. تحقق من اتصال الإنترنت.',
            noVoice: 'لا يوجد صوت لهذه اللغة على النظام؛ يُعرض النص.', lang: 'لغة المذيع', close: 'إغلاق' }
    }
  };

  const SVG = `<svg viewBox="0 0 200 240" aria-hidden="true">
    <path d="M22 240 C24 186 58 170 100 170 C142 170 176 186 178 240 Z" fill="#1e3a8a"/>
    <path d="M86 170 L100 196 L114 170 Z" fill="#ffffff"/>
    <path d="M95 176 L105 176 L109 200 L100 214 L91 200 Z" fill="#e11d48"/>
    <rect x="86" y="138" width="28" height="36" rx="8" fill="#f1c27d"/>
    <ellipse cx="100" cy="96" rx="50" ry="56" fill="#f8d3a9"/>
    <path d="M48 92 C40 30 160 26 152 92 C146 66 126 50 100 52 C76 52 56 66 48 92 Z" fill="#3b2415"/>
    <g class="an-blink">
      <ellipse cx="80" cy="100" rx="7" ry="8" fill="#ffffff"/>
      <ellipse cx="120" cy="100" rx="7" ry="8" fill="#ffffff"/>
      <circle cx="82" cy="102" r="3.8" fill="#1f2937"/>
      <circle cx="122" cy="102" r="3.8" fill="#1f2937"/>
    </g>
    <path d="M70 84 Q80 78 90 84" stroke="#3b2415" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M110 84 Q120 78 130 84" stroke="#3b2415" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="72" cy="116" rx="7" ry="4" fill="#fb7185" opacity=".5"/>
    <ellipse cx="128" cy="116" rx="7" ry="4" fill="#fb7185" opacity=".5"/>
    <path class="an-mc" d="M84 130 Q100 140 116 130" stroke="#7f1d1d" stroke-width="4" fill="none" stroke-linecap="round"/>
    <ellipse class="an-mo" cx="100" cy="132" rx="11" ry="8" fill="#7f1d1d" opacity="0"/>
  </svg>`;

  let root = null, hourly = null, lang = 'fa', appLang = 'fa', pref = 'app';
  let timer = 0, spoken = null;

  const norm = s => { const c = String(s || '').slice(0, 2).toLowerCase(); return TXT[c] ? c : 'en'; };
  const catOf = (code, pr) => {
    if (code >= 95) return 'storm';
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
    if (pr >= 4) return 'heavy';
    if (pr >= 1) return 'mid';
    if (pr >= 0.1 || (code >= 51 && code <= 82)) return 'light';
    return 'dry';
  };

  // ۶ ساعت از ساعت جاری به بعد را می‌گیرد و خلاصه می‌کند
  function build(h) {
    const now = new Date();
    const key = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}`;
    let from = h.time.findIndex(t => t.startsWith(key));
    if (from < 0) from = 0;
    const H = [];
    for (let i = from; i < from + 6 && i < h.time.length; i++) {
      H.push({
        hr: +h.time[i].slice(11, 13),
        c: catOf(h.weather_code?.[i] ?? 0, h.precipitation?.[i] ?? 0),
        pb: h.precipitation_probability?.[i] ?? 0
      });
    }
    const segs = [];
    for (const x of H) {
      const s = segs[segs.length - 1];
      if (s && s.c === x.c) { s.end = (x.hr + 1) % 24; s.pb = Math.max(s.pb, x.pb); }
      else segs.push({ c: x.c, start: x.hr, end: (x.hr + 1) % 24, pb: x.pb });
    }
    return { H, segs, allDry: H.every(x => x.c === 'dry') };
  }

  function scriptOf(B) {
    const T = TXT[lang], f = v => (lang === 'fa' ? toFa(v) : String(v));
    const hh = v => f(pad(v) + ':00');
    const parts = [T.intro];
    if (B.allDry) parts.push(T.allDry);
    else for (const s of B.segs) {
      const p = s.c === 'dry' ? null : f(Math.round(s.pb));
      parts.push(T.seg(hh(s.start), hh(s.end), T.cat[s.c], p));
    }
    parts.push(T.outro);
    return parts.join(' ');
  }

  async function getHourly(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&hourly=precipitation,precipitation_probability,weather_code&forecast_hours=12&timezone=auto`;
    let j;
    if (window.api && window.api.json) {
      j = await window.api.json(url);
      if (typeof j === 'string') j = JSON.parse(j);
    } else {
      j = await (await fetch(url)).json();
    }
    if (!j || !j.hourly) throw new Error('no data');
    return j.hourly;
  }

  function ensure() {
    if (root) return root;
    root = document.createElement('div');
    root.className = 'an-ov';
    root.innerHTML = `
      <div class="an-card" role="dialog" aria-modal="true">
        <div class="an-head"><span class="an-title"></span><button class="an-x" data-a="close">✕</button></div>
        <div class="an-body">
          <div class="an-stage">
            <div class="an-rain"></div>
            <div class="an-pres">${SVG}</div>
          </div>
          <div class="an-side">
            <div class="an-bubble"><div class="an-txt"></div></div>
            <div class="an-note"></div>
          </div>
        </div>
        <div class="an-tl"></div>
        <div class="an-foot">
          <button class="an-btn" data-a="replay">🔊 <span></span></button>
          <select class="an-sel"></select>
        </div>
      </div>`;
    document.body.appendChild(root);
    root.addEventListener('click', e => {
      if (e.target === root || e.target.closest('[data-a=close]')) close();
      else if (e.target.closest('[data-a=replay]') && hourly) talk(scriptOf(build(hourly)));
    });
    root.querySelector('.an-sel').addEventListener('change', e => {
      pref = e.target.value;
      localStorage.setItem(KEY, pref);
      lang = pref === 'app' ? appLang : norm(pref);
      render();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('on')) close(); });
    return root;
  }

  const setNote = msg => { root.querySelector('.an-note').textContent = msg; };

  function mouth(on) {
    root.querySelector('.an-mo').style.opacity = on ? 1 : 0;
    root.querySelector('.an-mc').style.opacity = on ? 0 : 1;
  }

  function halt() {
    clearInterval(timer); timer = 0;
    if (spoken) {
      spoken.onend = null; spoken.onboundary = null; spoken = null;
      if ('speechSynthesis' in window) speechSynthesis.cancel();
    }
    mouth(false);
  }

  function talk(text) {
    halt();
    const T = TXT[lang], bub = root.querySelector('.an-txt');
    bub.textContent = '';
    const voices = 'speechSynthesis' in window ? speechSynthesis.getVoices() : [];
    const match = voices.find(v => v.lang.toLowerCase().startsWith(T.voice));
    const canSpeak = 'speechSynthesis' in window && (voices.length === 0 || !!match);
    if (canSpeak) {
      setNote('');
      const u = new SpeechSynthesisUtterance(text);
      u.lang = T.loc; u.rate = 1;
      if (match) u.voice = match;
      let m = false;
      u.onboundary = e => { bub.textContent = text.slice(0, e.charIndex + (e.charLength || 1)); };
      u.onend = () => { halt(); bub.textContent = text; };
      spoken = u;
      timer = setInterval(() => mouth(m = !m), 160);
      speechSynthesis.speak(u);
    } else {
      setNote(T.ui.noVoice);
      const chars = [...text];
      let i = 0;
      timer = setInterval(() => {
        i++;
        bub.textContent = chars.slice(0, i).join('');
        mouth(i % 2 === 0);
        if (i >= chars.length) halt();
      }, 35);
    }
  }

  function render() {
    const T = TXT[lang], B = build(hourly), r = root, f = v => (lang === 'fa' ? toFa(v) : String(v));
    r.setAttribute('dir', T.dir);
    r.querySelector('.an-title').textContent = T.title;
    r.querySelector('[data-a=close]').title = T.ui.close;
    r.querySelector('[data-a=replay] span').textContent = T.ui.replay;
    const sel = r.querySelector('.an-sel');
    sel.innerHTML = `<option value="app">${TXT[appLang].ui.app}</option>` +
      `<option value="fa">فارسی</option><option value="en">English</option><option value="ar">العربية</option>`;
    sel.value = pref;
    sel.title = T.ui.lang;
    const pc = lang === 'fa' ? '٪' : '%';
    r.querySelector('.an-tl').innerHTML = B.H.map(x =>
      `<div class="an-cell c-${x.c}"><b>${f(pad(x.hr) + ':00')}</b><i>${ICO[x.c]}</i>` +
      `<small>${x.c === 'dry' ? '–' : f(Math.round(x.pb)) + pc}</small></div>`).join('');
    r.querySelector('.an-stage').classList.toggle('wet', !B.allDry);
    setNote('');
    talk(scriptOf(B));
  }

  function close() {
    halt();
    if (root) root.classList.remove('on');
  }

  // open({ lat, lon, appLang }) - مختصات محل و زبان برنامه را می‌گیرد
  async function open({ lat, lon, appLang: al } = {}) {
    ensure().classList.add('on');
    appLang = norm(al || document.documentElement.lang || 'fa');
    pref = localStorage.getItem(KEY) || 'app';
    lang = pref === 'app' ? appLang : norm(pref);
    setNote(TXT[lang].ui.loading);
    try {
      hourly = await getHourly(lat, lon);
      render();
    } catch (e) {
      console.error('anchor:', e);
      setNote(TXT[lang].ui.err);
    }
  }

  window.SENANCHOR = { open, close };
})();
