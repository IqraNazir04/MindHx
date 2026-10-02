// Ported from "The Tree Within" - a framework-free Three.js scene originally
// built as a standalone artifact (a living maple used as a mental-health
// metaphor: roots = foundational core/values, trunk = inner strength and
// resilience, crown = outward expression/emotions/connections). Kept as
// plain JS (not type-checked) because it's a large, math-heavy procedural
// generator ported close to verbatim from that artifact; this file only
// trims the full-page HUD/season-picker/storm-button bootstrap that isn't
// needed for an ambient, bounded-box version of the scene.
//
//   import * as THREE from 'three';
//   const tree = createMapleScene(THREE, canvas, { season: 'spring' });
//   tree.focusZone('roots'); tree.storm(); tree.setSeason('autumn'); tree.dispose();

export const SEASONS = {
  spring: {
    name: 'Spring',
    leaves: ['#9cc95f', '#b6d86a', '#86bb52', '#c9df7d', '#7fae4a', '#a7d06e'],
    litter: ['#8a7a4c', '#9b8a57', '#6f6a3d'],
    flowers: ['#ffd3e2', '#ffc0d6', '#fff2f6', '#ffe0ea'],
    meadow: ['#f9e45b', '#ffffff', '#c9a8ff', '#ff9fc4'],
    grass: ['#7fb04a', '#94c25a', '#6a9c3e', '#a3c763'],
    hover: ['#fff07a', '#ff7fb4'],
    skyTop: '#6aa3d8', skyBottom: '#f1e8d2', fog: '#dfe1cc', ground: '#6b8a48', soil: '#3a2a1e',
    bark: '#b49c86', sun: '#fff1d6', hemiSky: '#e6f0ff', hemiGround: '#5e6c3c', accent: '#ff8fbd', bloomGlow: 0.14,
  },
  summer: {
    name: 'Summer',
    leaves: ['#3f7a2e', '#4f8f35', '#5f9e3c', '#356b2a', '#6aa443', '#2f6126'],
    litter: ['#6d6a3a', '#7d7243', '#5b5a31'],
    flowers: ['#ffffff', '#fff6d6', '#ffe3ef', '#f4f0ff'],
    meadow: ['#ffffff', '#ffd84a', '#ff7a59', '#8fbaff'],
    grass: ['#4f8a33', '#5f9a3a', '#3f7429', '#6aa443'],
    hover: ['#eaff5c', '#3fe3c8'],
    skyTop: '#2b72b4', skyBottom: '#c8e4e7', fog: '#b3cdc8', ground: '#46632e', soil: '#33261b',
    bark: '#a68e7a', sun: '#fff4dc', hemiSky: '#d7ebff', hemiGround: '#3b4b25', accent: '#d6f25a', bloomGlow: 0.12,
  },
  autumn: {
    name: 'Autumn',
    leaves: ['#c8401f', '#e0702a', '#efa335', '#a52a1c', '#d8b23a', '#b85a1e', '#8f9a35'],
    litter: ['#9a5a2a', '#7e4422', '#a8783a', '#6a3a1e'],
    flowers: ['#ffeccf', '#ffd98a', '#f8c6a6', '#fff4e2'],
    meadow: ['#f0b442', '#e0773f', '#f6dc84', '#c7b3ea'],
    grass: ['#8f8a3e', '#a8924a', '#77803a', '#b39a55'],
    hover: ['#ffe45c', '#ff5fa8'],
    skyTop: '#33244a', skyBottom: '#e09a62', fog: '#a06a4c', ground: '#4a3527', soil: '#2c1d14',
    bark: '#a88c76', sun: '#ffd09a', hemiSky: '#ffd2a6', hemiGround: '#3b2318', accent: '#ffc35a', bloomGlow: 0.14,
  },
  moonlit: {
    name: 'Moonlit',
    leaves: ['#6476d6', '#8466d2', '#4a9cbd', '#a98ae0', '#3c5cab', '#5f86d8'],
    litter: ['#3a3f78', '#4a3f80', '#2e4a6e'],
    flowers: ['#e8e2ff', '#cff3ff', '#ffdcf6', '#f4f1ff'],
    meadow: ['#a9bcff', '#e3cfff', '#8ff6ff', '#ffc6ef'],
    grass: ['#2f4a6e', '#3a5a7e', '#2a3f60', '#40618a'],
    hover: ['#7df9ff', '#ff9de6'],
    skyTop: '#060a1c', skyBottom: '#2e3470', fog: '#20254d', ground: '#181c3a', soil: '#0e1024',
    bark: '#7d7a96', sun: '#a9bcff', hemiSky: '#8ea4ff', hemiGround: '#14142a', accent: '#8fe9ff', bloomGlow: 0.55,
  },
};

/** Default copy for the three parts of the tree. Override with options.zoneCopy (e.g. for Urdu). */
export const ZONE_COPY = {
  roots: {
    title: 'Roots',
    line: 'Our foundational core',
    body: "Our values and past experiences. Strong roots keep us stable during life's storms.",
  },
  trunk: {
    title: 'Trunk',
    line: 'Inner strength and resilience',
    body: 'The self that carries the weight of daily life.',
  },
  crown: {
    title: 'Branches & Leaves',
    line: 'Outward expression',
    body: 'Reaching toward goals, connections and emotional states.',
  },
  storm: "Strong roots keep us stable during life's storms.",
};

const ZONE_COLORS = { roots: '#ffb44a', trunk: '#8de0c4', crown: '#ff9ed2' };

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

/* Maple outline in polar form. th = 0 points to the leaf tip, th = PI to the stem. */
function mapleRadius(th) {
  const lobe = Math.pow(Math.abs(Math.cos(2.5 * th)), 0.9);
  const sub = Math.pow(Math.abs(Math.cos(12.5 * th + 0.4)), 4);
  const teeth = Math.abs(Math.sin(34 * th + Math.sin(th * 3)));
  const L = Math.abs(Math.cos(2.5 * th));
  let r = 0.42 + 0.4 * lobe + 0.16 * Math.pow(L, 14) + 0.07 * sub * lobe - (0.012 + 0.03 * lobe * lobe) * teeth;
  r *= 1 + 0.17 * Math.cos(th);
  let d = th - Math.PI;
  const stem = Math.exp(-Math.pow(d / 0.28, 2));
  return r * (1 - 0.62 * stem);
}

/* Procedural leaf: blade with palmate veins, mottling, sun-burnt edges, blemishes, petiole.
   Grayscale-ish so the per-leaf instance colour tints it. */
function makeLeafCanvas(rand, size = 512) {
  const c = makeCanvas(size, size);
  const g = c.getContext('2d');
  const S = size / 512;
  const cx = 256 * S, cy = 262 * S, R = 198 * S;
  const pt = (th, r) => [cx + Math.sin(th) * r * R, cy - Math.cos(th) * r * R];

  const outline = () => {
    g.beginPath();
    const N = 720;
    for (let i = 0; i <= N; i++) {
      const th = (i / N) * Math.PI * 2;
      const [x, y] = pt(th, mapleRadius(th));
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.closePath();
  };

  // petiole (behind the blade)
  g.lineCap = 'round';
  g.strokeStyle = 'rgb(176,150,120)';
  for (let i = 0; i < 12; i++) {
    const t0 = i / 12, t1 = (i + 1) / 12;
    g.lineWidth = (6 - 3.5 * t0) * S;
    g.beginPath();
    g.moveTo(cx + Math.sin(t0 * 2) * 6 * S, cy + t0 * 190 * S);
    g.lineTo(cx + Math.sin(t1 * 2) * 6 * S, cy + t1 * 190 * S);
    g.stroke();
  }

  g.save();
  outline();
  g.clip();

  // base tone: lighter at the heart of the leaf
  const base = g.createRadialGradient(cx, cy - 20 * S, 10 * S, cx, cy, R * 1.25);
  base.addColorStop(0, 'rgb(248,246,240)');
  base.addColorStop(0.6, 'rgb(226,222,214)');
  base.addColorStop(1, 'rgb(186,180,170)');
  g.fillStyle = base;
  g.fillRect(0, 0, size, size);

  // mottling
  for (let i = 0; i < 1400; i++) {
    const x = rand() * size, y = rand() * size, r = (1 + rand() * 9) * S;
    g.fillStyle = rand() < 0.5 ? `rgba(255,255,255,${0.03 + rand() * 0.05})` : `rgba(40,30,20,${0.015 + rand() * 0.03})`;
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  }

  // areole network: faint fine cells
  g.strokeStyle = 'rgba(255,255,255,0.07)';
  g.lineWidth = 0.8 * S;
  for (let i = 0; i < 520; i++) {
    const x = rand() * size, y = rand() * size, a = rand() * Math.PI;
    const l = (6 + rand() * 14) * S;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
  }

  // veins: 5 primaries from the petiole to each lobe tip, secondaries off them
  const primaries = [0, 1.2566, -1.2566, 2.5133, -2.5133];
  const drawVein = (x0, y0, x1, y1, bend, w0, w1, alpha) => {
    const mx = (x0 + x1) / 2 + (y1 - y0) * bend, my = (y0 + y1) / 2 - (x1 - x0) * bend;
    const steps = 14;
    let px = x0, py = y0;
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const qx = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * mx + t * t * x1;
      const qy = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * my + t * t * y1;
      const w = w0 + (w1 - w0) * t;
      g.lineWidth = w + 2 * S; g.strokeStyle = `rgba(30,20,10,${alpha * 0.28})`;
      g.beginPath(); g.moveTo(px + S, py + S); g.lineTo(qx + S, qy + S); g.stroke();
      g.lineWidth = w; g.strokeStyle = `rgba(255,252,238,${alpha})`;
      g.beginPath(); g.moveTo(px, py); g.lineTo(qx, qy); g.stroke();
      px = qx; py = qy;
    }
  };
  for (const th of primaries) {
    const rt = mapleRadius(th) * 0.97;
    const [tx, ty] = pt(th, rt);
    const bend = (rand() - 0.5) * 0.08;
    drawVein(cx, cy, tx, ty, bend, 5 * S, 0.8 * S, 0.6);
    // secondaries
    for (let k = 0; k < 5; k++) {
      const t = 0.2 + k * 0.14 + rand() * 0.05;
      const [sx, sy] = pt(th, rt * t);
      for (const side of [-1, 1]) {
        if (rand() < 0.2) continue;
        const a = th + side * (0.5 + rand() * 0.45);
        const len = (0.2 + rand() * 0.12) * (1 - t * 0.55);
        const ex = sx + Math.sin(a) * len * R, ey = sy - Math.cos(a) * len * R;
        drawVein(sx, sy, ex, ey, side * (0.04 + rand() * 0.1), 1.8 * S, 0.4 * S, 0.3);
      }
    }
  }

  // edges: darker, slightly burnt rim
  outline();
  for (let w = 46; w >= 6; w -= 8) { g.lineWidth = w * S; g.strokeStyle = 'rgba(70,40,15,0.045)'; g.stroke(); }

  // blemishes & tar spots
  const nSpots = 3 + Math.floor(rand() * 5);
  for (let i = 0; i < nSpots; i++) {
    const th = rand() * Math.PI * 2, rr = (0.3 + rand() * 0.55) * mapleRadius(th);
    const [x, y] = pt(th, rr);
    const r = (3 + rand() * 11) * S;
    const sg = g.createRadialGradient(x, y, 0, x, y, r * 1.8);
    sg.addColorStop(0, 'rgba(55,32,12,0.38)');
    sg.addColorStop(0.5, 'rgba(90,55,20,0.28)');
    sg.addColorStop(1, 'rgba(90,55,20,0)');
    g.fillStyle = sg;
    g.beginPath(); g.arc(x, y, r * 1.8, 0, Math.PI * 2); g.fill();
  }
  g.restore();
  return c;
}

function makeBarkCanvas(rand, size = 512) {
  const c = makeCanvas(size, size);
  const g = c.getContext('2d');
  g.fillStyle = 'rgb(214,208,200)';
  g.fillRect(0, 0, size, size);
  for (let i = 0; i < 2600; i++) {
    const x = rand() * size, y = rand() * size, r = 1 + rand() * 6;
    g.fillStyle = rand() < 0.5 ? `rgba(255,255,255,${rand() * 0.06})` : `rgba(0,0,0,${rand() * 0.08})`;
    g.fillRect(x, y, r, r * 3);
  }
  // vertical furrows, tiled
  for (let i = 0; i < 160; i++) {
    let x = rand() * size, y = rand() * size;
    const len = 60 + rand() * 260, w = 1.5 + rand() * 6;
    const dark = rand() < 0.7;
    g.strokeStyle = dark ? `rgba(40,30,22,${0.18 + rand() * 0.28})` : `rgba(255,250,240,${0.08 + rand() * 0.12})`;
    g.lineWidth = w; g.lineCap = 'round';
    g.beginPath(); g.moveTo(x, y);
    for (let s = 0; s < len; s += 12) {
      x += (rand() - 0.5) * 5; y += 12;
      g.lineTo(x, y);
      if (y > size) { g.stroke(); y -= size; g.beginPath(); g.moveTo(x, y); }
    }
    g.stroke();
  }
  // horizontal lenticels / cracks
  for (let i = 0; i < 90; i++) {
    const x = rand() * size, y = rand() * size;
    g.strokeStyle = `rgba(25,18,12,${0.2 + rand() * 0.3})`;
    g.lineWidth = 1 + rand() * 1.5;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + 6 + rand() * 18, y + (rand() - 0.5) * 3); g.stroke();
  }
  return c;
}


/* Five-petal blossom with notched tips, petal veins and stamens. Light so instance colour tints it. */
function makeFlowerCanvas(rand, size = 256) {
  const c = makeCanvas(size, size);
  const g = c.getContext('2d');
  const cx = size / 2, cy = size / 2, R = size * 0.46;
  for (let p = 0; p < 5; p++) {
    const a = (p / 5) * Math.PI * 2 - Math.PI / 2 + (rand() - 0.5) * 0.08;
    g.save();
    g.translate(cx, cy); g.rotate(a);
    // petal: teardrop from centre to a notched tip
    const L = R * (0.92 + rand() * 0.08), W = R * 0.36;
    g.beginPath();
    g.moveTo(0, 0);
    g.bezierCurveTo(L * 0.25, -W * 1.05, L * 0.85, -W * 1.05, L, -W * 0.22);
    g.lineTo(L * 0.9, 0);
    g.lineTo(L, W * 0.22);
    g.bezierCurveTo(L * 0.85, W * 1.05, L * 0.25, W * 1.05, 0, 0);
    g.closePath();
    const pg = g.createLinearGradient(0, 0, L, 0);
    pg.addColorStop(0, 'rgb(214,200,206)');
    pg.addColorStop(0.35, 'rgb(246,240,242)');
    pg.addColorStop(1, 'rgb(255,253,253)');
    g.fillStyle = pg; g.fill();
    g.save(); g.clip();
    g.strokeStyle = 'rgba(150,120,130,0.18)'; g.lineWidth = 1;
    for (let v = -3; v <= 3; v++) {
      g.beginPath(); g.moveTo(L * 0.08, 0);
      g.quadraticCurveTo(L * 0.5, v * W * 0.18, L * 0.95, v * W * 0.28); g.stroke();
    }
    g.restore();
    g.strokeStyle = 'rgba(120,90,100,0.25)'; g.lineWidth = 1.2; g.stroke();
    g.restore();
  }
  // centre and stamens
  const cg = g.createRadialGradient(cx, cy, 0, cx, cy, R * 0.22);
  cg.addColorStop(0, 'rgb(190,200,120)'); cg.addColorStop(1, 'rgba(210,170,150,0)');
  g.fillStyle = cg; g.beginPath(); g.arc(cx, cy, R * 0.22, 0, Math.PI * 2); g.fill();
  for (let s = 0; s < 22; s++) {
    const a = rand() * Math.PI * 2, l = R * (0.18 + rand() * 0.14);
    const x = cx + Math.cos(a) * l, y = cy + Math.sin(a) * l;
    g.strokeStyle = 'rgba(235,225,200,0.9)'; g.lineWidth = 1.2;
    g.beginPath(); g.moveTo(cx, cy); g.lineTo(x, y); g.stroke();
    g.fillStyle = 'rgb(240,196,80)'; g.beginPath(); g.arc(x, y, 2.4, 0, Math.PI * 2); g.fill();
  }
  return c;
}

const OVERLAY_CSS = `
.mt-overlay{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:1}
.mt-pin{position:absolute;left:0;top:0;display:flex;align-items:flex-start;gap:10px;pointer-events:auto;background:none;border:0;padding:0;margin:0;color:var(--mt-ink,#fbf6ee);font:inherit;text-align:left;cursor:pointer;will-change:transform;transition:opacity .3s}
.mt-pin.flip{flex-direction:row-reverse;text-align:right}
.mt-pin:focus-visible .mt-card{outline:2px solid var(--z);outline-offset:2px}
.mt-dot{position:relative;flex:none;width:18px;height:18px;border-radius:50%;border:2px solid var(--z);box-sizing:border-box;box-shadow:0 0 12px var(--z)}
.mt-dot::after{content:"";position:absolute;inset:3px;border-radius:50%;background:var(--z)}
.mt-dot::before{content:"";position:absolute;inset:-7px;border-radius:50%;border:1.5px solid var(--z);opacity:0;animation:mt-pulse 2.6s ease-out infinite}
@keyframes mt-pulse{0%{transform:scale(.55);opacity:.8}100%{transform:scale(1.5);opacity:0}}
.mt-card{display:block;margin-top:-6px;padding:8px 13px;border-radius:14px;background:var(--mt-card,rgba(16,12,18,.74));-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border:1px solid var(--mt-line,rgba(255,245,230,.22));max-width:min(270px,58vw);box-shadow:0 8px 28px rgba(0,0,0,.22);transition:border-color .3s,background .3s}
.mt-title{display:flex;align-items:center;gap:8px;font-weight:600;font-size:14px;line-height:1.25;letter-spacing:.01em}
.mt-pin.flip .mt-title{justify-content:flex-end}
.mt-line{display:block;font-size:12px;line-height:1.35;opacity:.78;margin-top:1px}
.mt-body{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows .4s ease,opacity .35s ease,margin .4s ease}
.mt-body>span{overflow:hidden;font-size:13.5px;line-height:1.5}
.mt-pin.is-active .mt-body{grid-template-rows:1fr;opacity:1;margin-top:7px}
.mt-pin.is-active .mt-card{border-color:var(--z);background:rgba(16,12,18,.78)}
.mt-pin.is-dim{opacity:.62}
.mt-pin.is-active{z-index:2}
.mt-pin.up{align-items:flex-end}
.mt-pin.up .mt-card{margin-top:0;margin-bottom:-6px}
.mt-caption{position:absolute;left:50%;top:16%;transform:translate(-50%,8px);max-width:calc(100% - 32px);padding:10px 20px;border-radius:999px;background:var(--mt-card,rgba(16,12,18,.74));-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border:1px solid var(--mt-line,rgba(255,245,230,.22));color:var(--mt-ink,#fbf6ee);font-size:15px;line-height:1.4;text-align:center;opacity:0;transition:opacity .9s ease,transform .9s ease}
.mt-caption.on{opacity:1;transform:translate(-50%,0)}
@media (max-width:600px){.mt-card{padding:6px 10px}.mt-title{font-size:13px}.mt-line{display:none}.mt-pin.is-active .mt-line{display:block}.mt-caption{font-size:13px;top:12%}}
@media (prefers-reduced-motion:reduce){.mt-dot::before{animation:none}.mt-body,.mt-caption{transition:none}}
`;

/* ------------------------------------------------------------------ */
/* scene                                                               */
/* ------------------------------------------------------------------ */
export function createMapleScene(THREE, canvas, options = {}) {
  const o = {
    season: 'autumn', wind: 3, autoOrbit: true, interactive: true, zoom: false,
    sky: true, quality: 'auto', seed: 20261003, annotations: true,
    zoneCopy: null, onStats: null, onZoneChange: null, ...options,
  };
  const copy = {
    roots: { ...ZONE_COPY.roots, ...(o.zoneCopy && o.zoneCopy.roots) },
    trunk: { ...ZONE_COPY.trunk, ...(o.zoneCopy && o.zoneCopy.trunk) },
    crown: { ...ZONE_COPY.crown, ...(o.zoneCopy && o.zoneCopy.crown) },
    storm: (o.zoneCopy && o.zoneCopy.storm) || ZONE_COPY.storm,
  };
  const reduceMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const smallScreen = (canvas.clientWidth || window.innerWidth) < 700;
  const low = o.quality === 'low' || (o.quality === 'auto' && smallScreen);
  const Q = low
    ? { leaves: 3000, flowers: 480, meadow: 160, grass: 1600, falling: 120, litter: 300, shadow: 1024, dpr: 1.5 }
    : { leaves: 5400, flowers: 1000, meadow: 320, grass: 3400, falling: 200, litter: 520, shadow: 2048, dpr: 2 };

  const R = mulberry32(o.seed);
  let seasonKey = SEASONS[o.season] ? o.season : 'autumn';
  let wind = o.wind;
  let autoOrbit = o.autoOrbit && !reduceMotion;
  const motion = reduceMotion ? 0.35 : 1;
  const disposables = [];
  const track = (x) => (disposables.push(x), x);
  const ZONES = ['roots', 'trunk', 'crown'];

  /* renderer */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, Q.dpr));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = parseInt(THREE.REVISION, 10) >= 180 ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);
  const srgb = (tex) => { if ('colorSpace' in tex) tex.colorSpace = THREE.SRGBColorSpace; else tex.encoding = THREE.sRGBEncoding; return tex; };

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xa06a4c, 22, 52);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);

  /* lights */
  const hemi = new THREE.HemisphereLight(0xffd2a6, 0x3b2318, 1.5);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffd09a, 3.0);
  sun.position.set(7, 14, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(Q.shadow, Q.shadow);
  Object.assign(sun.shadow.camera, { left: -11, right: 11, top: 14, bottom: -6, near: 1, far: 50 });
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.02;
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0xffffff, 0.9);
  rim.position.set(-8, 6, -8);
  scene.add(rim);

  /* shared helpers */
  function colorsOf(key, field) {
    const s = SEASONS[key];
    if (!s['_' + field]) s['_' + field] = s[field].map((h) => new THREE.Color(h));
    return s['_' + field];
  }
  function addGlow(mat, key, base) {
    const u = { value: base };
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uGlow = u;
      sh.fragmentShader = 'uniform float uGlow;\n' + sh.fragmentShader.replace(
        '#include <emissivemap_fragment>',
        '#include <emissivemap_fragment>\n totalEmissiveRadiance += diffuseColor.rgb * uGlow;');
    };
    mat.customProgramCacheKey = () => key;
    return u;
  }
  function mergeGeos(geos) {
    let vc = 0, ic = 0;
    for (const g of geos) { vc += g.attributes.position.count; ic += g.index.count; }
    const pos = new Float32Array(vc * 3), nor = new Float32Array(vc * 3), uv = new Float32Array(vc * 2), idx = new Uint32Array(ic);
    let vo = 0, io = 0;
    for (const g of geos) {
      pos.set(g.attributes.position.array, vo * 3);
      nor.set(g.attributes.normal.array, vo * 3);
      uv.set(g.attributes.uv.array, vo * 2);
      const gi = g.index.array;
      for (let i = 0; i < gi.length; i++) idx[io + i] = gi[i] + vo;
      vo += g.attributes.position.count; io += gi.length;
      g.dispose();
    }
    const out = new THREE.BufferGeometry();
    out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    out.setIndex(new THREE.BufferAttribute(idx, 1));
    out.computeBoundingSphere();
    return track(out);
  }

  /* sky dome */
  const skyMat = track(new THREE.ShaderMaterial({
    uniforms: { top: { value: new THREE.Color() }, bottom: { value: new THREE.Color() } },
    vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix*vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }',
    fragmentShader: 'uniform vec3 top; uniform vec3 bottom; varying vec3 vW; void main(){ float h = normalize(vW - cameraPosition).y; gl_FragColor = vec4(mix(bottom, top, smoothstep(0.0, 0.22, h)), 1.0);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}',
    side: THREE.BackSide, depthWrite: false, fog: false,
  }));
  const sky = new THREE.Mesh(track(new THREE.SphereGeometry(90, 32, 16)), skyMat);
  sky.visible = o.sky;
  sky.renderOrder = -2;
  scene.add(sky);

  /* ground (fades to transparent at the rim; turns see-through to reveal roots) */
  const gfc = makeCanvas(256, 256), gfx = gfc.getContext('2d');
  const gg = gfx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gg.addColorStop(0, '#fff'); gg.addColorStop(0.55, '#fff'); gg.addColorStop(1, '#000');
  gfx.fillStyle = gg; gfx.fillRect(0, 0, 256, 256);
  const groundFade = track(new THREE.CanvasTexture(gfc));
  const groundMat = track(new THREE.MeshStandardMaterial({ color: 0x4a3527, roughness: 1, alphaMap: groundFade, transparent: true, depthWrite: false }));
  const ground = new THREE.Mesh(track(new THREE.CircleGeometry(24, 72)), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  ground.renderOrder = -1;
  scene.add(ground);
  // soil bed under the roots, only visible while they are revealed
  const soilMat = track(new THREE.MeshBasicMaterial({ color: 0x2c1d14, alphaMap: groundFade, transparent: true, opacity: 0, depthWrite: false, fog: false }));
  const soil = new THREE.Mesh(track(new THREE.CircleGeometry(9, 48)), soilMat);
  soil.rotation.x = -Math.PI / 2; soil.position.y = -3.4; soil.renderOrder = -1;
  scene.add(soil);

  /* bark materials, one per zone so each part can light up on its own */
  const barkTex = track(srgb(new THREE.CanvasTexture(makeBarkCanvas(R))));
  barkTex.wrapS = barkTex.wrapT = THREE.RepeatWrapping;
  barkTex.repeat.set(2, 3);
  barkTex.anisotropy = 4;
  const makeBark = () => track(new THREE.MeshStandardMaterial({ color: 0xa88c76, map: barkTex, bumpMap: barkTex, bumpScale: 3, roughness: 0.95, metalness: 0, emissive: 0x000000 }));
  const zoneMat = { roots: makeBark(), trunk: makeBark(), crown: makeBark() };
  const zoneGeos = { roots: [], trunk: [], crown: [] };
  const UP = new THREE.Vector3(0, 1, 0);
  const tips = [];
  const MAX_DEPTH = 4;
  const mtx = new THREE.Matrix4(), qq = new THREE.Quaternion(), one = new THREE.Vector3(1, 1, 1);

  function limb(zone, start, dir, len, r0, r1, depth, flare) {
    const radial = depth < 2 ? 18 : 8, hs = depth < 2 ? 14 : 3;
    const geo = new THREE.CylinderGeometry(r1, r0, len, radial, hs, false);
    geo.translate(0, len / 2, 0);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const a = Math.atan2(z, x);
      let k = 1 + 0.06 * Math.sin(a * 5 + y * 2.6 + depth) + 0.04 * Math.sin(a * 13 - y * 6.3) + 0.025 * Math.sin(a * 29 + y * 11);
      if (flare) k *= 1 + 1.15 * Math.exp(-y * 2.3) * (0.7 + 0.3 * Math.sin(a * 4));
      p.setXYZ(i, x * k, y, z * k);
    }
    geo.computeVertexNormals();
    const d = dir.clone().normalize();
    qq.setFromUnitVectors(UP, d);
    geo.applyMatrix4(mtx.compose(start, qq, one));
    zoneGeos[zone].push(geo);
    const end = start.clone().addScaledVector(d, len);
    if (depth < 3) {
      const k = new THREE.SphereGeometry(r1 * 1.04, 12, 8);
      k.translate(end.x, end.y, end.z);
      zoneGeos[zone].push(k);
    }
    return end;
  }
  function grow(start, dir, len, r, depth) {
    const zone = depth === 0 ? 'trunk' : 'crown';
    const rEnd = r * 0.64;
    const bent = dir.clone().add(new THREE.Vector3(R() - 0.5, R() * 0.2 - 0.05, R() - 0.5).multiplyScalar(0.32)).normalize();
    const e1 = limb(zone, start, dir, len * 0.5, r, (r + rEnd) / 2, depth, depth === 0);
    const e2 = limb(zone, e1, bent, len * 0.5, (r + rEnd) / 2, rEnd, depth, false);
    if (depth >= 2) tips.push(e1.clone().lerp(e2, 0.6));
    if (depth >= MAX_DEPTH) { tips.push(e2); return; }
    const n = depth === 0 ? 3 : R() < 0.5 ? 2 : 3;
    for (let i = 0; i < n; i++) {
      const az = (i / n) * Math.PI * 2 + R() * 1.1 + depth * 0.9;
      const tilt = (depth === 0 ? 0.55 : 0.4) + R() * 0.4;
      const perp = Math.abs(bent.x) > 0.9 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(1, 0, 0);
      perp.cross(bent).normalize().applyAxisAngle(bent, az);
      const cd = bent.clone().applyAxisAngle(perp, tilt);
      cd.y += 0.22; cd.normalize();
      grow(e2, cd, len * (0.66 + R() * 0.14), rEnd * 0.93, depth + 1);
    }
  }
  grow(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.04, 1, 0.02).normalize(), 3.6, 0.46, 0);

  /* roots: buttress roots at the surface diving into a fine network below */
  const THETA0 = 0.55;
  const rootNodes = [];
  let rootAnchor = new THREE.Vector3(1.6, 0.1, 1.4);
  function growRoot(start, dir, len, r, depth, isAnchor) {
    let p = start.clone();
    const d = dir.clone();
    const segs = depth === 0 ? 5 : 4;
    for (let s = 0; s < segs; s++) {
      const r0 = r * (1 - (s / segs) * 0.6), r1 = r * (1 - ((s + 1) / segs) * 0.6);
      d.y -= 0.07 + depth * 0.06 + R() * 0.06;
      d.x += (R() - 0.5) * 0.4; d.z += (R() - 0.5) * 0.4;
      if (depth === 0 && s < 2) d.y = Math.max(d.y, -0.14);
      d.normalize();
      p = limb('roots', p, d, len / segs, r0, r1, depth + 2, false);
      if (isAnchor && s === 1) rootAnchor = p.clone();
      if (depth < 2 && s >= 1 && R() < 0.6) {
        rootNodes.push(p.clone());
        const side = R() < 0.5 ? -1 : 1;
        const nd = d.clone().applyAxisAngle(UP, side * (0.6 + R() * 0.6));
        nd.y -= 0.25; nd.normalize();
        growRoot(p, nd, len * 0.6, r1 * 0.8, depth + 1, false);
      }
    }
    rootNodes.push(p.clone());
  }
  const NROOT = 7;
  for (let i = 0; i < NROOT; i++) {
    const a = THETA0 + 0.35 + (i / NROOT) * Math.PI * 2 + (R() - 0.5) * 0.35;
    const dx = Math.sin(a), dz = Math.cos(a);
    growRoot(new THREE.Vector3(dx * 0.28, 0.32, dz * 0.28), new THREE.Vector3(dx, -0.4, dz).normalize(), 3.4 + R() * 0.8, 0.24 + R() * 0.05, 0, i === 0);
  }
  const zoneMesh = {};
  for (const z of ZONES) {
    const m = new THREE.Mesh(mergeGeos(zoneGeos[z]), zoneMat[z]);
    m.castShadow = z !== 'roots'; m.receiveShadow = true;
    m.userData.zone = z;
    scene.add(m);
    zoneMesh[z] = m;
  }
  // glowing nodes along the roots: values and past experiences that feed the tree
  const nodeMat = track(new THREE.MeshBasicMaterial({ color: ZONE_COLORS.roots, transparent: true, opacity: 0.9, depthWrite: false, toneMapped: false }));
  const nodes = new THREE.InstancedMesh(track(new THREE.SphereGeometry(0.07, 12, 8)), nodeMat, rootNodes.length);
  nodes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(nodes);

  /* leaf texture + materials */
  const leafCanvas = makeLeafCanvas(R, 512);
  const leafTex = track(srgb(new THREE.CanvasTexture(leafCanvas)));
  leafTex.anisotropy = 4;
  const bumpTex = track(new THREE.CanvasTexture(leafCanvas));
  const leafProps = { color: 0xffffff, map: leafTex, bumpMap: bumpTex, bumpScale: 1.2, roughness: 0.55, metalness: 0, side: THREE.DoubleSide, alphaTest: 0.5 };
  const canopyMat = track(new THREE.MeshStandardMaterial(leafProps));
  const canopyGlow = addGlow(canopyMat, 'mt-canopy', 0.16);
  const leafMat = track(new THREE.MeshStandardMaterial(leafProps));
  addGlow(leafMat, 'mt-leaf', 0.16);
  const leafDepth = track(new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: leafTex, alphaTest: 0.5, side: THREE.DoubleSide }));

  const flowerTex = track(srgb(new THREE.CanvasTexture(makeFlowerCanvas(R, 256))));
  const flowerMat = track(new THREE.MeshStandardMaterial({ color: 0xffffff, map: flowerTex, roughness: 0.6, metalness: 0, side: THREE.DoubleSide, alphaTest: 0.5 }));
  const flowerGlow = addGlow(flowerMat, 'mt-flower', SEASONS[seasonKey].bloomGlow);
  const flowerDepth = track(new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: flowerTex, alphaTest: 0.5, side: THREE.DoubleSide }));

  function leafGeometry(pivotAtStem, curl) {
    const geo = track(new THREE.PlaneGeometry(1, 1, 10, 10));
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i);
      p.setZ(i, curl * (0.34 * Math.pow(Math.abs(x), 1.6) - 0.16 * Math.pow(Math.max(0, y + 0.05), 2) + 0.05 * Math.sin(x * 9) * Math.abs(x)));
    }
    geo.translate(0, pivotAtStem ? 0.38 : 0.01, 0);
    geo.computeVertexNormals();
    geo.computeBoundingSphere();
    return geo;
  }
  const canopyGeo = leafGeometry(true, 1);
  const fallGeo = leafGeometry(false, 1);
  const litterGeo = leafGeometry(false, 1.8);
  const flowerGeo = track(new THREE.PlaneGeometry(1, 1, 6, 6));
  {
    const p = flowerGeo.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, 0.22 * (x * x + y * y)); }
    flowerGeo.computeVertexNormals(); flowerGeo.computeBoundingSphere();
  }

  const Z = new THREE.Vector3(0, 0, 1);
  const tmpQ = new THREE.Quaternion(), tmpQ2 = new THREE.Quaternion(), tmpE = new THREE.Euler();
  const tmpV = new THREE.Vector3(), tmpS = new THREE.Vector3(), tmpM = new THREE.Matrix4();
  const AX = new THREE.Vector3(1, 0, 0), AY = new THREE.Vector3(0, 1, 0), AZ = new THREE.Vector3(0, 0, 1);
  const tmpN = new THREE.Vector3();
  const tmpCol = new THREE.Color();

  /* canopy */
  const PER_TIP = Math.max(16, Math.round(Q.leaves / tips.length));
  const NC = tips.length * PER_TIP;
  const canopy = new THREE.InstancedMesh(canopyGeo, canopyMat, NC);
  canopy.customDepthMaterial = leafDepth;
  canopy.castShadow = true; canopy.receiveShadow = true;
  canopy.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  canopy.userData.zone = 'crown';
  const cPos = new Float32Array(NC * 3), cQ = new Float32Array(NC * 4);
  const cScale = new Float32Array(NC), cPhase = new Float32Array(NC), cHover = new Float32Array(NC);
  const cPal = new Uint8Array(NC), cMix = new Float32Array(NC), cBright = new Float32Array(NC), cStag = new Float32Array(NC);
  const cCol = new Float32Array(NC * 3);
  let minY = Infinity, maxY = -Infinity, maxR = 0;
  function orientOut(x, y, z, spread, upBias) {
    const ol = Math.hypot(x, z) || 1;
    tmpN.set((x / ol) * 0.7 + (R() - 0.5) * spread, upBias + (R() - 0.3) * 0.6, (z / ol) * 0.7 + (R() - 0.5) * spread).normalize();
    tmpQ.setFromUnitVectors(Z, tmpN);
    tmpQ2.setFromAxisAngle(AZ, R() * Math.PI * 2);
    return tmpQ.multiply(tmpQ2);
  }
  {
    let k = 0;
    for (const tp of tips) {
      for (let j = 0; j < PER_TIP; j++, k++) {
        const u = R() * 2 - 1, a = R() * Math.PI * 2, rr = Math.cbrt(R()) * 1.35;
        const s = Math.sqrt(1 - u * u);
        const x = tp.x + Math.cos(a) * s * rr, y = tp.y + 0.2 + u * rr * 0.75, z = tp.z + Math.sin(a) * s * rr;
        cPos[k * 3] = x; cPos[k * 3 + 1] = y; cPos[k * 3 + 2] = z;
        const q = orientOut(x, y, z, 0.9, 0.9);
        cQ[k * 4] = q.x; cQ[k * 4 + 1] = q.y; cQ[k * 4 + 2] = q.z; cQ[k * 4 + 3] = q.w;
        cScale[k] = 0.42 + R() * 0.22;
        cPhase[k] = R() * Math.PI * 2;
        cPal[k] = Math.floor(R() * 255);
        cMix[k] = R();
        cBright[k] = 0.8 + R() * 0.32;
        minY = Math.min(minY, y); maxY = Math.max(maxY, y); maxR = Math.max(maxR, Math.hypot(x, z));
      }
    }
    const pal = colorsOf(seasonKey, 'leaves');
    for (let i = 0; i < NC; i++) {
      cStag[i] = 0.35 + (1.3 * (cPos[i * 3 + 1] - minY)) / (maxY - minY);
      const c = pal[cPal[i] % pal.length];
      cCol[i * 3] = c.r * cBright[i]; cCol[i * 3 + 1] = c.g * cBright[i]; cCol[i * 3 + 2] = c.b * cBright[i];
      canopy.setColorAt(i, tmpCol.setRGB(cCol[i * 3], cCol[i * 3 + 1], cCol[i * 3 + 2]));
    }
  }
  scene.add(canopy);

  /* blossoms on the outer crown */
  const NB = Q.flowers;
  const blossoms = new THREE.InstancedMesh(flowerGeo, flowerMat, NB);
  blossoms.customDepthMaterial = flowerDepth;
  blossoms.castShadow = true;
  blossoms.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  blossoms.userData.zone = 'crown';
  const bPos = new Float32Array(NB * 3), bQ = new Float32Array(NB * 4), bScale = new Float32Array(NB), bPhase = new Float32Array(NB);
  const bHover = new Float32Array(NB), bPal = new Uint8Array(NB), bMix = new Float32Array(NB), bCol = new Float32Array(NB * 3);
  {
    const pal = colorsOf(seasonKey, 'flowers');
    for (let i = 0; i < NB; i++) {
      const tp = tips[Math.floor(R() * tips.length)];
      const u = R() * 1.6 - 0.6, a = R() * Math.PI * 2, rr = 1.0 + R() * 0.4;
      const s = Math.sqrt(1 - Math.min(1, u * u));
      const x = tp.x + Math.cos(a) * s * rr, y = tp.y + 0.25 + u * rr * 0.75, z = tp.z + Math.sin(a) * s * rr;
      bPos[i * 3] = x; bPos[i * 3 + 1] = y; bPos[i * 3 + 2] = z;
      const q = orientOut(x, y, z, 0.6, 0.8);
      bQ[i * 4] = q.x; bQ[i * 4 + 1] = q.y; bQ[i * 4 + 2] = q.z; bQ[i * 4 + 3] = q.w;
      bScale[i] = 0.27 + R() * 0.12; bPhase[i] = R() * 6.28;
      bPal[i] = Math.floor(R() * 255); bMix[i] = R();
      const c = pal[bPal[i] % pal.length];
      bCol[i * 3] = c.r; bCol[i * 3 + 1] = c.g; bCol[i * 3 + 2] = c.b;
      blossoms.setColorAt(i, c);
    }
  }
  scene.add(blossoms);

  /* grass: instanced blades swayed on the GPU */
  const NG = Q.grass;
  const bladeGeo = track(new THREE.PlaneGeometry(0.07, 1, 1, 4));
  {
    bladeGeo.translate(0, 0.5, 0);
    const p = bladeGeo.attributes.position;
    for (let i = 0; i < p.count; i++) { const y = p.getY(i); p.setX(i, p.getX(i) * (1 - y * 0.92)); p.setZ(i, y * y * 0.12); }
    bladeGeo.computeVertexNormals();
  }
  const grassMat = track(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85, side: THREE.DoubleSide, transparent: true, opacity: 1 }));
  const grassU = { uTime: { value: 0 }, uWind: { value: 1 } };
  grassMat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = grassU.uTime; sh.uniforms.uWind = grassU.uWind;
    sh.vertexShader = 'uniform float uTime;\nuniform float uWind;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
      #ifdef USE_INSTANCING
        vec3 ip = vec3(instanceMatrix[3]);
      #else
        vec3 ip = vec3(0.0);
      #endif
      float bend = position.y * position.y;
      transformed.x += (sin(uTime * 1.7 + ip.x * 0.6 + ip.z * 0.45) * (0.08 + 0.05 * uWind) + 0.06 * uWind) * bend;
      transformed.z += cos(uTime * 1.3 + ip.z * 0.5 + ip.x * 0.2) * 0.05 * bend;`);
  };
  grassMat.customProgramCacheKey = () => 'mt-grass';
  const grass = new THREE.InstancedMesh(bladeGeo, grassMat, NG);
  grass.receiveShadow = true;
  const gPal = new Uint8Array(NG), gBright = new Float32Array(NG), gCol = new Float32Array(NG * 3);
  {
    const pal = colorsOf(seasonKey, 'grass');
    for (let i = 0; i < NG; i++) {
      const a = R() * Math.PI * 2, r = 0.7 + Math.pow(R(), 0.8) * 11;
      tmpV.set(Math.cos(a) * r, 0, Math.sin(a) * r);
      tmpQ.setFromAxisAngle(AY, R() * Math.PI * 2);
      tmpQ2.setFromAxisAngle(AX, (R() - 0.5) * 0.35); tmpQ.multiply(tmpQ2);
      const h = 0.18 + R() * 0.32 * (1 - r / 14);
      tmpS.set(0.7 + R() * 0.8, h, 1);
      grass.setMatrixAt(i, tmpM.compose(tmpV, tmpQ, tmpS));
      gPal[i] = Math.floor(R() * 255); gBright[i] = 0.7 + R() * 0.4;
      const c = pal[gPal[i] % pal.length];
      gCol[i * 3] = c.r * gBright[i]; gCol[i * 3 + 1] = c.g * gBright[i]; gCol[i * 3 + 2] = c.b * gBright[i];
      grass.setColorAt(i, tmpCol.setRGB(gCol[i * 3], gCol[i * 3 + 1], gCol[i * 3 + 2]));
    }
  }
  scene.add(grass);

  /* meadow flowers: stems + heads */
  const NM = Q.meadow;
  const stemGeo = track(new THREE.CylinderGeometry(0.007, 0.012, 1, 5, 1));
  stemGeo.translate(0, 0.5, 0);
  const stemMat = track(new THREE.MeshStandardMaterial({ color: 0x5f8a3a, roughness: 0.8 }));
  const stems = new THREE.InstancedMesh(stemGeo, stemMat, NM);
  stems.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const heads = new THREE.InstancedMesh(flowerGeo, flowerMat, NM);
  heads.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  heads.castShadow = true; heads.customDepthMaterial = flowerDepth;
  const mPos = new Float32Array(NM * 3), mH = new Float32Array(NM), mPhase = new Float32Array(NM), mSpin = new Float32Array(NM);
  const mScale = new Float32Array(NM), mPal = new Uint8Array(NM), mHover = new Float32Array(NM), mMix = new Float32Array(NM), mCol = new Float32Array(NM * 3);
  {
    const pal = colorsOf(seasonKey, 'meadow');
    for (let i = 0; i < NM; i++) {
      // gentle clumps
      const ca = R() * Math.PI * 2, cr = 1.8 + Math.pow(R(), 0.7) * 7.5;
      mPos[i * 3] = Math.cos(ca) * cr + (R() - 0.5) * 0.8; mPos[i * 3 + 1] = 0; mPos[i * 3 + 2] = Math.sin(ca) * cr + (R() - 0.5) * 0.8;
      mH[i] = 0.28 + R() * 0.4; mPhase[i] = R() * 6.28; mSpin[i] = R() * 6.28;
      mScale[i] = 0.13 + R() * 0.09; mPal[i] = Math.floor(R() * 255); mMix[i] = R();
      const c = pal[mPal[i] % pal.length];
      mCol[i * 3] = c.r; mCol[i * 3 + 1] = c.g; mCol[i * 3 + 2] = c.b;
      heads.setColorAt(i, c);
    }
  }
  scene.add(stems, heads);

  /* litter */
  const NL = Q.litter;
  const litter = new THREE.InstancedMesh(litterGeo, leafMat, NL);
  litter.customDepthMaterial = leafDepth;
  litter.receiveShadow = true;
  const lPal = new Uint8Array(NL), lBright = new Float32Array(NL), lCol = new Float32Array(NL * 3);
  {
    const pal = colorsOf(seasonKey, 'litter');
    for (let i = 0; i < NL; i++) {
      const a = R() * Math.PI * 2, r = 0.8 + Math.pow(R(), 0.75) * 7.5;
      tmpV.set(Math.cos(a) * r, 0.02 + R() * 0.03, Math.sin(a) * r);
      tmpQ.setFromAxisAngle(AY, R() * Math.PI * 2);
      tmpQ2.setFromAxisAngle(AX, -Math.PI / 2 + (R() - 0.5) * 0.5); tmpQ.multiply(tmpQ2);
      tmpQ2.setFromAxisAngle(AZ, R() * Math.PI * 2); tmpQ.multiply(tmpQ2);
      const s = 0.34 + R() * 0.18; tmpS.set(s, s, s);
      litter.setMatrixAt(i, tmpM.compose(tmpV, tmpQ, tmpS));
      lPal[i] = Math.floor(R() * 255); lBright[i] = 0.6 + R() * 0.35;
      const c = pal[lPal[i] % pal.length];
      lCol[i * 3] = c.r * lBright[i]; lCol[i * 3 + 1] = c.g * lBright[i]; lCol[i * 3 + 2] = c.b * lBright[i];
      litter.setColorAt(i, tmpCol.setRGB(lCol[i * 3], lCol[i * 3 + 1], lCol[i * 3 + 2]));
    }
  }
  scene.add(litter);

  /* falling leaves */
  const NF = Q.falling;
  const fall = new THREE.InstancedMesh(fallGeo, leafMat, NF);
  fall.customDepthMaterial = leafDepth;
  fall.castShadow = true;
  fall.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const fPos = new Float32Array(NF * 3), fVel = new Float32Array(NF * 3), fRot = new Float32Array(NF * 3), fSpin = new Float32Array(NF * 3);
  const fPhase = new Float32Array(NF), fSpeed = new Float32Array(NF), fScale = new Float32Array(NF);
  const fAmp = new Float32Array(NF), fFreq = new Float32Array(NF), fYaw = new Float32Array(NF), fYawRate = new Float32Array(NF), fClock = new Float32Array(NF);
  const fTumble = new Uint8Array(NF), fState = new Uint8Array(NF), fTimer = new Float32Array(NF), fHover = new Float32Array(NF);
  const fPal = new Uint8Array(NF), fMix = new Float32Array(NF), fBright = new Float32Array(NF), fCol = new Float32Array(NF * 3);
  const fRestQ = new Float32Array(NF * 4);

  function spawnLeaf(i, near) {
    let j = Math.floor(Math.random() * NC);
    if (near) {
      let bd = Infinity;
      for (let t = 0; t < 40; t++) {
        const c = Math.floor(Math.random() * NC);
        const dx = cPos[c * 3] - near.x, dy = cPos[c * 3 + 1] - near.y, dz = cPos[c * 3 + 2] - near.z;
        const dd = dx * dx + dy * dy + dz * dz;
        if (dd < bd) { bd = dd; j = c; }
      }
    }
    fPos[i * 3] = cPos[j * 3]; fPos[i * 3 + 1] = cPos[j * 3 + 1]; fPos[i * 3 + 2] = cPos[j * 3 + 2];
    const ox = cPos[j * 3], oz = cPos[j * 3 + 2], ol = Math.hypot(ox, oz) || 1;
    const burst = near ? 1.3 : 0.1;
    fVel[i * 3] = (ox / ol) * burst * (0.5 + Math.random()) + (Math.random() - 0.5) * burst;
    fVel[i * 3 + 1] = near ? 0.5 + Math.random() * 0.8 : 0;
    fVel[i * 3 + 2] = (oz / ol) * burst * (0.5 + Math.random()) + (Math.random() - 0.5) * burst;
    fRot[i * 3] = Math.random() * 6.28; fRot[i * 3 + 1] = Math.random() * 6.28; fRot[i * 3 + 2] = Math.random() * 6.28;
    fSpin[i * 3] = (Math.random() - 0.5) * 5; fSpin[i * 3 + 1] = (Math.random() - 0.5) * 3; fSpin[i * 3 + 2] = (Math.random() - 0.5) * 5;
    fTumble[i] = Math.random() < 0.25 ? 1 : 0;
    fAmp[i] = 0.35 + Math.random() * 0.5;
    fFreq[i] = 1.4 + Math.random() * 1.1;
    fYaw[i] = Math.random() * 6.28;
    fYawRate[i] = (Math.random() - 0.5) * 0.8;
    fClock[i] = Math.random() * 10;
    fState[i] = 0; fTimer[i] = 0;
    fPal[i] = cPal[j];
  }
  function land(i, timer) {
    fState[i] = 1;
    fPos[i * 3 + 1] = 0.03 + Math.random() * 0.02;
    tmpQ.setFromAxisAngle(AY, Math.random() * 6.28);
    tmpQ2.setFromAxisAngle(AX, -Math.PI / 2 + (Math.random() - 0.5) * 0.35); tmpQ.multiply(tmpQ2);
    tmpQ2.setFromAxisAngle(AZ, Math.random() * 6.28); tmpQ.multiply(tmpQ2);
    fRestQ[i * 4] = tmpQ.x; fRestQ[i * 4 + 1] = tmpQ.y; fRestQ[i * 4 + 2] = tmpQ.z; fRestQ[i * 4 + 3] = tmpQ.w;
    fTimer[i] = timer;
  }
  {
    const pal = colorsOf(seasonKey, 'leaves');
    for (let i = 0; i < NF; i++) {
      fPhase[i] = R() * 6.28; fSpeed[i] = 0.55 + R() * 0.35; fScale[i] = 0.38 + R() * 0.16;
      fMix[i] = R(); fBright[i] = 0.85 + R() * 0.25;
      spawnLeaf(i);
      if (R() < 0.35) land(i, R() * 10);
      else fPos[i * 3 + 1] = R() * fPos[i * 3 + 1];
      const c = pal[fPal[i] % pal.length];
      fCol[i * 3] = c.r; fCol[i * 3 + 1] = c.g; fCol[i * 3 + 2] = c.b;
      fall.setColorAt(i, c);
    }
  }
  scene.add(fall);

  /* environment colour tweening */
  const env = {};
  ['fog', 'ground', 'soil', 'bark', 'sun', 'hemiSky', 'hemiGround', 'hoverA', 'hoverB', 'skyTop', 'skyBottom']
    .forEach((k) => (env[k] = { cur: new THREE.Color(), tgt: new THREE.Color() }));
  let bloomGlowTgt = SEASONS[seasonKey].bloomGlow;
  function setSeasonTargets(key, instant) {
    const s = SEASONS[key];
    env.fog.tgt.set(s.fog); env.ground.tgt.set(s.ground); env.soil.tgt.set(s.soil); env.bark.tgt.set(s.bark);
    env.sun.tgt.set(s.sun); env.hemiSky.tgt.set(s.hemiSky); env.hemiGround.tgt.set(s.hemiGround);
    env.hoverA.tgt.set(s.hover[0]); env.hoverB.tgt.set(s.hover[1]);
    env.skyTop.tgt.set(s.skyTop); env.skyBottom.tgt.set(s.skyBottom);
    bloomGlowTgt = s.bloomGlow;
    if (instant) for (const k in env) env[k].cur.copy(env[k].tgt);
  }
  setSeasonTargets(seasonKey, true);
  const stormTop = new THREE.Color('#2a2f3c'), stormBottom = new THREE.Color('#6b7180');
  const zoneCol = { roots: new THREE.Color(ZONE_COLORS.roots), trunk: new THREE.Color(ZONE_COLORS.trunk), crown: new THREE.Color(ZONE_COLORS.crown) };

  /* camera framing + zone views */
  const lookAt = new THREE.Vector3(0, maxY * 0.42, 0);
  let theta = THETA0, phi = 1.38, zoom = 1, userZoom = 1, fitDist = 16, phiTween = 0;
  const views = {
    none: { y: maxY * 0.42, zoom: 1, phi: 1.38 },
    roots: { y: -0.9, zoom: 0.62, phi: 1.2 },
    trunk: { y: 2.2, zoom: 0.72, phi: 1.45 },
    crown: { y: maxY * 0.66, zoom: 0.78, phi: 1.42 },
  };
  function fit() {
    const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const t = Math.tan((camera.fov * Math.PI) / 360);
    const halfH = (maxY + 2.2) / 2, halfW = maxR + 1;
    fitDist = Math.max(halfH / t, halfW / (t * camera.aspect)) * 1.1;
  }

  /* annotations overlay */
  const host = canvas.parentElement;
  let overlay = null, caption = null;
  const pins = {};
  const anchors = {
    roots: rootAnchor,
    trunk: new THREE.Vector3(0, 1.7, 0),
    crown: new THREE.Vector3(Math.sin(THETA0 + 1.1) * maxR * 0.55, maxY * 0.78, Math.cos(THETA0 + 1.1) * maxR * 0.55),
  };
  if (o.annotations && host) {
    if (!document.getElementById('mt-overlay-style')) {
      const st = document.createElement('style'); st.id = 'mt-overlay-style'; st.textContent = OVERLAY_CSS;
      document.head.appendChild(st);
    }
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    overlay = document.createElement('div');
    overlay.className = 'mt-overlay';
    for (const z of ZONES) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'mt-pin'; b.style.setProperty('--z', ZONE_COLORS[z]);
      b.setAttribute('aria-expanded', 'false');
      b.innerHTML = `<span class="mt-dot" aria-hidden="true"></span><span class="mt-card"><span class="mt-title"></span><span class="mt-line"></span><span class="mt-body"><span></span></span></span>`;
      b.querySelector('.mt-title').textContent = copy[z].title;
      b.querySelector('.mt-line').textContent = copy[z].line;
      b.querySelector('.mt-body>span').textContent = copy[z].body;
      b.addEventListener('mouseenter', () => { pinHover = z; });
      b.addEventListener('mouseleave', () => { if (pinHover === z) pinHover = null; });
      b.addEventListener('focus', () => { pinHover = z; });
      b.addEventListener('blur', () => { if (pinHover === z) pinHover = null; });
      b.addEventListener('click', () => api.focusZone(focusZone === z ? null : z));
      overlay.appendChild(b);
      pins[z] = b;
    }
    caption = document.createElement('div');
    caption.className = 'mt-caption'; caption.setAttribute('role', 'status');
    caption.textContent = copy.storm;
    overlay.appendChild(caption);
    host.appendChild(overlay);
  }

  /* interaction */
  const ndc = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const pickTargets = [canopy, blossoms, fall, heads, zoneMesh.trunk, zoneMesh.crown, zoneMesh.roots];
  let pointerIn = false, dragging = false, moved = 0, lastX = 0, lastY = 0, lastInteract = -1e9, needsPick = false;
  let shake = 0, storm = 0;
  let hoverZone = null, pinHover = null, focusZone = null, activeZone = null;
  const zg = { roots: 0, trunk: 0, crown: 0 };
  const pick = () => { raycaster.setFromCamera(ndc, camera); return raycaster.intersectObjects(pickTargets, false)[0] || null; };
  const setNdc = (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  };
  const listeners = [];
  const on = (el, ev, fn, opt) => { el.addEventListener(ev, fn, opt); listeners.push([el, ev, fn, opt]); };

  function release(count, near) {
    const order = [];
    for (let i = 0; i < NF; i++) order.push(i);
    order.sort((a, b) => fState[b] - fState[a] || fTimer[a] - fTimer[b]);
    for (let n = 0; n < count && n < NF; n++) spawnLeaf(order[n], near);
  }
  function paint(posArr, hoverArr, n, p, rad) {
    const r2 = rad * rad;
    for (let i = 0; i < n; i++) {
      const dx = posArr[i * 3] - p.x, dy = posArr[i * 3 + 1] - p.y, dz = posArr[i * 3 + 2] - p.z;
      const d2 = dx * dx + dy * dy + dz * dz;
      if (d2 < r2) {
        const v = Math.pow(1 - Math.sqrt(d2) / rad, 0.6);
        if (v > hoverArr[i]) hoverArr[i] = v;
      }
    }
  }
  const paintCrown = (p, rad) => { paint(cPos, cHover, NC, p, rad); paint(bPos, bHover, NB, p, rad); };

  if (o.interactive) {
    canvas.style.touchAction = 'pan-y';
    on(canvas, 'pointerdown', (e) => {
      dragging = true; moved = 0; lastX = e.clientX; lastY = e.clientY;
      lastInteract = performance.now(); setNdc(e); pointerIn = true; needsPick = true;
    });
    on(canvas, 'pointermove', (e) => {
      setNdc(e); pointerIn = true; needsPick = true;
      if (dragging) {
        const dx = e.clientX - lastX, dy = e.clientY - lastY;
        moved += Math.abs(dx) + Math.abs(dy);
        if (moved > 6 && !canvas.hasPointerCapture(e.pointerId)) canvas.setPointerCapture(e.pointerId);
        theta -= dx * 0.006;
        if (e.pointerType === 'mouse') { phi = Math.min(1.5, Math.max(0.7, phi - dy * 0.004)); phiTween = 0; }
        lastX = e.clientX; lastY = e.clientY; lastInteract = performance.now();
      }
    });
    on(canvas, 'pointerup', (e) => {
      if (dragging && moved < 6) {
        const hit = pick();
        const obj = hit && hit.object;
        if (obj === canopy || obj === blossoms) { shake = 1; release(16, hit.point); paintCrown(hit.point, 2.2); api.focusZone('crown'); }
        else if (obj === fall) { const id = hit.instanceId; fState[id] = 0; fVel[id * 3 + 1] = 2; }
        else if (obj === heads) { mHover[hit.instanceId] = 1; }
        else if (obj && obj.userData.zone) api.focusZone(focusZone === obj.userData.zone ? null : obj.userData.zone);
        else api.focusZone(null);
      }
      dragging = false; lastInteract = performance.now();
      if (e.pointerType !== 'mouse') { pointerIn = false; hoverZone = null; }
    });
    on(canvas, 'pointercancel', () => { dragging = false; pointerIn = false; hoverZone = null; });
    on(canvas, 'pointerleave', () => { pointerIn = false; hoverZone = null; });
    if (o.zoom) on(canvas, 'wheel', (e) => { e.preventDefault(); userZoom = Math.min(1.8, Math.max(0.5, userZoom * (1 + Math.sign(e.deltaY) * 0.08))); lastInteract = performance.now(); }, { passive: false });
  }

  /* visibility / resize */
  let visible = true, running = true, paused = false, raf = 0;
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null;
  ro ? ro.observe(canvas) : on(window, 'resize', fit);
  const io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) kick(); }) : null;
  io && io.observe(canvas);
  on(document, 'visibilitychange', () => { if (!document.hidden) kick(); });
  fit();

  /* loop */
  let lastTs = 0;
  const clock = { getDelta() { const n = performance.now(); const d = lastTs ? (n - lastTs) / 1000 : 0; lastTs = n; return d; } };
  let t = 0, frameN = 0, statsT = 0;
  const qTmp = new THREE.Quaternion(), qSway = new THREE.Quaternion(), qa = new THREE.Quaternion();
  const pos = new THREE.Vector3(), scl = new THREE.Vector3(), mat = new THREE.Matrix4(), proj = new THREE.Vector3();

  function hoverMix(arrCol, out, i3, m, hs, hA, hB, glow) {
    const hr = (hA.r + (hB.r - hA.r) * m) * glow, hg = (hA.g + (hB.g - hA.g) * m) * glow, hb = (hA.b + (hB.b - hA.b) * m) * glow;
    out[i3] = arrCol[i3] + (hr - arrCol[i3]) * hs;
    out[i3 + 1] = arrCol[i3 + 1] + (hg - arrCol[i3 + 1]) * hs;
    out[i3 + 2] = arrCol[i3 + 2] + (hb - arrCol[i3 + 2]) * hs;
  }
  function approach(arr, i3, c, k, br) {
    arr[i3] += (c.r * br - arr[i3]) * k; arr[i3 + 1] += (c.g * br - arr[i3 + 1]) * k; arr[i3 + 2] += (c.b * br - arr[i3 + 2]) * k;
  }

  function frame() {
    raf = 0;
    if (!running) return;
    if (!visible || document.hidden || paused) { clock.getDelta(); return; }
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05) * (o.timeScale || 1);
    t += dt * motion; frameN++;
    storm = Math.max(0, storm - dt / 8);
    const stormS = Math.sin(Math.min(1, storm) * Math.PI * 0.5);
    const windEff = wind + 9 * stormS;
    const wf = windEff / 3;

    /* zones */
    let barkHit = null;
    if (pointerIn && (needsPick || frameN % 3 === 0)) {
      needsPick = false;
      const hit = pick();
      hoverZone = null;
      if (hit) {
        const obj = hit.object;
        if (obj === canopy || obj === blossoms) { paintCrown(hit.point, 1.6); hoverZone = 'crown'; }
        else if (obj === fall) fHover[hit.instanceId] = 1;
        else if (obj === heads) mHover[hit.instanceId] = 1;
        else if (obj.userData.zone) { hoverZone = obj.userData.zone; barkHit = hoverZone; }
      }
      canvas.style.cursor = dragging ? 'grabbing' : hit ? 'pointer' : 'grab';
    }
    const nextActive = pinHover || hoverZone || focusZone;
    if (nextActive !== activeZone) {
      activeZone = nextActive;
      for (const z of ZONES) if (pins[z]) {
        pins[z].classList.toggle('is-active', z === activeZone);
        pins[z].classList.toggle('is-dim', !!activeZone && z !== activeZone);
        pins[z].setAttribute('aria-expanded', String(z === activeZone));
      }
      o.onZoneChange && o.onZoneChange(activeZone);
    }
    const kz = 1 - Math.exp(-dt * 5);
    for (const z of ZONES) {
      let target = z === activeZone ? 1 : 0;
      if (z !== 'crown') target = Math.max(target, stormS * 0.85);
      zg[z] += (target - zg[z]) * kz;
    }

    /* camera */
    if (autoOrbit && !dragging && performance.now() - lastInteract > 2500) theta += dt * 0.07 * (focusZone ? 0.5 : 1);
    const view = views[focusZone || 'none'];
    const kc2 = 1 - Math.exp(-dt * 2.2);
    lookAt.y += (view.y - lookAt.y) * kc2;
    zoom += (view.zoom - zoom) * kc2;
    if (phiTween > 0) { phi += (view.phi - phi) * kc2; phiTween -= dt; }
    const radius = fitDist * zoom * userZoom;
    scene.fog.near = radius * 1.1; scene.fog.far = radius * 3.2;
    camera.position.set(lookAt.x + radius * Math.sin(phi) * Math.sin(theta), lookAt.y + radius * Math.cos(phi), lookAt.z + radius * Math.sin(phi) * Math.cos(theta));
    camera.lookAt(lookAt);

    /* environment */
    const ke = 1 - Math.exp(-dt * 2.2);
    for (const k in env) env[k].cur.lerp(env[k].tgt, ke);
    scene.fog.color.copy(env.fog.cur).lerp(stormBottom, stormS * 0.6);
    groundMat.color.copy(env.ground.cur);
    groundMat.opacity = 1 - 0.74 * zg.roots;
    grassMat.opacity = 1 - 0.85 * zg.roots;
    soilMat.color.copy(env.soil.cur);
    soilMat.opacity = 0.85 * zg.roots;
    sun.color.copy(env.sun.cur);
    sun.intensity = 3.0 * (1 - 0.55 * stormS);
    hemi.color.copy(env.hemiSky.cur); hemi.groundColor.copy(env.hemiGround.cur);
    skyMat.uniforms.top.value.copy(env.skyTop.cur).lerp(stormTop, stormS * 0.8);
    skyMat.uniforms.bottom.value.copy(env.skyBottom.cur).lerp(stormBottom, stormS * 0.75);
    flowerGlow.value += (bloomGlowTgt - flowerGlow.value) * ke;
    grassU.uTime.value = t; grassU.uWind.value = wf;
    const hA = env.hoverA.cur, hB = env.hoverB.cur;
    const pulse = 0.85 + 0.15 * Math.sin(t * 2.4);
    for (const z of ZONES) {
      zoneMat[z].color.copy(env.bark.cur).lerp(zoneCol[z], zg[z] * 0.12);
      zoneMat[z].emissive.copy(zoneCol[z]).multiplyScalar(zg[z] * (z === 'roots' ? 0.42 : 0.2) * pulse);
    }
    canopyGlow.value = 0.16 + zg.crown * 0.22;
    if (caption) caption.classList.toggle('on', storm > 0.12);

    // root nodes
    for (let i = 0; i < rootNodes.length; i++) {
      const s = Math.max(0.001, zg.roots * (0.75 + 0.35 * Math.sin(t * 2 + i * 1.7)));
      tmpS.set(s, s, s); tmpQ.identity();
      nodes.setMatrixAt(i, tmpM.compose(rootNodes[i], tmpQ, tmpS));
    }
    nodes.instanceMatrix.needsUpdate = true;
    nodes.visible = zg.roots > 0.01;

    shake *= Math.exp(-dt * 1.8);
    const sway = 0.04 + 0.045 * wf + shake * 0.3;
    const pal = colorsOf(seasonKey, 'leaves');
    const lpal = colorsOf(seasonKey, 'litter');
    const fpal = colorsOf(seasonKey, 'flowers');
    const mpal = colorsOf(seasonKey, 'meadow');
    const gpal = colorsOf(seasonKey, 'grass');
    const kc = 1 - Math.exp(-dt * 1.4);
    const decay = Math.exp(-dt * 0.75);

    /* canopy */
    const cc = canopy.instanceColor.array;
    for (let i = 0; i < NC; i++) {
      const i3 = i * 3, i4 = i * 4, ph = cPhase[i];
      const gustWave = Math.sin(t * 0.7 - cPos[i3] * 0.25 + cPos[i3 + 2] * 0.15) * 0.5 + 0.5;
      const sw = sway * (0.6 + gustWave * 0.8);
      pos.set(
        cPos[i3] + Math.sin(t * 1.1 + cPos[i3 + 1] * 0.5 + ph * 0.2) * sw * 0.5 + shake * 0.06 * Math.sin(t * 14 + ph),
        cPos[i3 + 1] + Math.sin(t * 1.9 + ph) * sw * 0.08,
        cPos[i3 + 2] + Math.cos(t * 0.9 + cPos[i3] * 0.4 + ph * 0.3) * sw * 0.35);
      qTmp.set(cQ[i4], cQ[i4 + 1], cQ[i4 + 2], cQ[i4 + 3]);
      tmpE.set(Math.sin(t * 2.3 + ph) * sw * 3.2, Math.sin(t * 1.4 + ph * 1.3) * sw * 1.5, Math.cos(t * 1.8 + ph) * sw * 1.2);
      qSway.setFromEuler(tmpE);
      qTmp.multiply(qSway);
      const h = cHover[i], hs = h * h * (3 - 2 * h);
      const s = cScale[i] * (1 + 0.32 * hs);
      scl.set(s, s, s);
      canopy.setMatrixAt(i, mat.compose(pos, qTmp, scl));
      approach(cCol, i3, pal[cPal[i] % pal.length], Math.min(1, kc * cStag[i]), cBright[i]);
      hoverMix(cCol, cc, i3, cMix[i], hs, hA, hB, 1.25);
      cHover[i] = h * decay;
    }
    canopy.instanceMatrix.needsUpdate = true;
    canopy.instanceColor.needsUpdate = true;

    /* blossoms */
    const bc = blossoms.instanceColor.array;
    for (let i = 0; i < NB; i++) {
      const i3 = i * 3, i4 = i * 4, ph = bPhase[i];
      const sw = sway * 0.9;
      pos.set(bPos[i3] + Math.sin(t * 1.1 + bPos[i3 + 1] * 0.5 + ph * 0.2) * sw * 0.5, bPos[i3 + 1], bPos[i3 + 2] + Math.cos(t * 0.9 + bPos[i3] * 0.4) * sw * 0.35);
      qTmp.set(bQ[i4], bQ[i4 + 1], bQ[i4 + 2], bQ[i4 + 3]);
      tmpE.set(Math.sin(t * 2.1 + ph) * sw * 2, 0, Math.cos(t * 1.7 + ph) * sw * 2);
      qTmp.multiply(qSway.setFromEuler(tmpE));
      const h = bHover[i], hs = h * h * (3 - 2 * h);
      const s = bScale[i] * (1 + 0.45 * hs);
      scl.set(s, s, s);
      blossoms.setMatrixAt(i, mat.compose(pos, qTmp, scl));
      approach(bCol, i3, fpal[bPal[i] % fpal.length], kc, 1);
      hoverMix(bCol, bc, i3, bMix[i], hs * 0.85, hA, hB, 1.35);
      bHover[i] = h * decay;
    }
    blossoms.instanceMatrix.needsUpdate = true;
    blossoms.instanceColor.needsUpdate = true;

    /* meadow */
    const hc = heads.instanceColor.array;
    for (let i = 0; i < NM; i++) {
      const i3 = i * 3, ph = mPhase[i];
      const ax = (Math.sin(t * 1.6 + mPos[i3] * 0.5 + ph) * (0.06 + 0.035 * wf) + 0.03 * wf);
      const az = Math.cos(t * 1.2 + mPos[i3 + 2] * 0.4 + ph) * (0.05 + 0.02 * wf);
      tmpE.set(az, 0, -ax);
      qTmp.setFromEuler(tmpE);
      pos.set(mPos[i3], 0, mPos[i3 + 2]);
      scl.set(1, mH[i], 1);
      stems.setMatrixAt(i, mat.compose(pos, qTmp, scl));
      tmpV.set(0, mH[i], 0).applyQuaternion(qTmp).add(pos);
      qa.copy(qTmp);
      qSway.setFromAxisAngle(AX, -Math.PI / 2 + 0.35); qa.multiply(qSway);
      qSway.setFromAxisAngle(AZ, mSpin[i]); qa.multiply(qSway);
      const h = mHover[i], hs = h * h * (3 - 2 * h);
      const s = mScale[i] * (1 + 0.5 * hs);
      scl.set(s, s, s);
      heads.setMatrixAt(i, mat.compose(tmpV, qa, scl));
      approach(mCol, i3, mpal[mPal[i] % mpal.length], kc, 1);
      hoverMix(mCol, hc, i3, mMix[i], hs, hA, hB, 1.3);
      mHover[i] = h * Math.exp(-dt * 0.6);
    }
    stems.instanceMatrix.needsUpdate = true;
    heads.instanceMatrix.needsUpdate = true;
    heads.instanceColor.needsUpdate = true;

    /* grass + litter colour */
    const gc = grass.instanceColor.array;
    for (let i = 0; i < NG; i++) { const i3 = i * 3; approach(gCol, i3, gpal[gPal[i] % gpal.length], kc * 0.7, gBright[i]); gc[i3] = gCol[i3]; gc[i3 + 1] = gCol[i3 + 1]; gc[i3 + 2] = gCol[i3 + 2]; }
    grass.instanceColor.needsUpdate = true;
    const lc = litter.instanceColor.array;
    for (let i = 0; i < NL; i++) { const i3 = i * 3; approach(lCol, i3, lpal[lPal[i] % lpal.length], kc * 0.6, lBright[i]); lc[i3] = lCol[i3]; lc[i3 + 1] = lCol[i3 + 1]; lc[i3 + 2] = lCol[i3 + 2]; }
    litter.instanceColor.needsUpdate = true;

    /* falling leaves: pendulum glide for most, tumbling for some */
    const fc = fall.instanceColor.array;
    const fdt = dt * motion;
    let aloft = 0, resting = 0;
    for (let i = 0; i < NF; i++) {
      const i3 = i * 3, i4 = i * 4;
      let vis = 1;
      if (fState[i] === 0) {
        aloft++;
        fClock[i] += fdt;
        const w = fFreq[i], ang = w * fClock[i] + fPhase[i];
        const sn = Math.sin(ang), cs = Math.cos(ang);
        fYaw[i] += fYawRate[i] * fdt;
        const dirX = Math.cos(fYaw[i]), dirZ = -Math.sin(fYaw[i]);
        let lat, vy;
        if (fTumble[i]) { lat = Math.sin(t * 1.6 + fPhase[i]) * 0.5; vy = fSpeed[i] * 1.35; }
        else { lat = fAmp[i] * w * cs; vy = fSpeed[i] * (1.3 * cs * cs - 0.12); }
        fPos[i3] += (fVel[i3] + dirX * lat + windEff * 0.2) * fdt;
        fPos[i3 + 1] += (fVel[i3 + 1] - vy) * fdt;
        fPos[i3 + 2] += (fVel[i3 + 2] + dirZ * lat + windEff * 0.05) * fdt;
        const vd = Math.exp(-fdt * 1.6);
        fVel[i3] *= vd; fVel[i3 + 1] *= vd; fVel[i3 + 2] *= vd;
        if (fTumble[i]) {
          const sb = 1 + wf * 0.4;
          fRot[i3] += fSpin[i3] * fdt * sb; fRot[i3 + 1] += fSpin[i3 + 1] * fdt * sb; fRot[i3 + 2] += fSpin[i3 + 2] * fdt * sb;
          tmpE.set(fRot[i3], fRot[i3 + 1], fRot[i3 + 2]);
          qTmp.setFromEuler(tmpE);
        } else {
          qTmp.setFromAxisAngle(AY, fYaw[i]);
          qa.setFromAxisAngle(AZ, sn * 0.85); qTmp.multiply(qa);
          qa.setFromAxisAngle(AX, -Math.PI / 2 + Math.sin(ang * 0.5) * 0.15); qTmp.multiply(qa);
          qa.setFromAxisAngle(AZ, fRot[i3 + 1]); qTmp.multiply(qa);
        }
        if (fPos[i3 + 1] <= 0.05) land(i, 7 + Math.random() * 9);
        if (Math.hypot(fPos[i3], fPos[i3 + 2]) > 20) spawnLeaf(i);
      } else {
        resting++;
        fTimer[i] -= fdt;
        fPos[i3] += windEff * 0.01 * fdt;
        qTmp.set(fRestQ[i4], fRestQ[i4 + 1], fRestQ[i4 + 2], fRestQ[i4 + 3]);
        vis = Math.min(1, fTimer[i] / 1.2);
        if (fTimer[i] <= 0) spawnLeaf(i);
      }
      const h = fHover[i], hs = h * h * (3 - 2 * h);
      const s = fScale[i] * Math.max(0.001, vis) * (1 + 0.5 * hs);
      pos.set(fPos[i3], fPos[i3 + 1], fPos[i3 + 2]);
      scl.set(s, s, s);
      fall.setMatrixAt(i, mat.compose(pos, qTmp, scl));
      approach(fCol, i3, pal[fPal[i] % pal.length], kc, fBright[i]);
      hoverMix(fCol, fc, i3, fMix[i], hs, hA, hB, 1.3);
      fHover[i] = h * Math.exp(-dt * 0.6);
    }
    fall.instanceMatrix.needsUpdate = true;
    fall.instanceColor.needsUpdate = true;

    if (Math.random() < dt * (0.6 + wf * 1.4) * motion) {
      for (let i = 0; i < NF; i++) if (fState[i] === 1 && fTimer[i] < 3) { spawnLeaf(i); break; }
    }

    /* pins follow their anchors */
    if (overlay) {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      for (const z of ZONES) {
        proj.copy(anchors[z]).project(camera);
        const x = (proj.x + 1) * 0.5 * w, y = (1 - proj.y) * 0.5 * h;
        const el = pins[z];
        const ew = el.offsetWidth, eh = el.offsetHeight;
        const fitsRight = x - 9 + ew <= w - 8, fitsLeft = x + 9 - ew >= 8;
        const flip = fitsRight ? (x > w * 0.62 && fitsLeft) : (fitsLeft || x > w / 2);
        const up = y > h * 0.55;
        el.classList.toggle('flip', flip);
        el.classList.toggle('up', up);
        const left = Math.min(Math.max(flip ? x + 9 - ew : x - 9, 8), Math.max(8, w - 8 - ew));
        const top = Math.min(Math.max(up ? y + 9 - eh : y - 9, 8), Math.max(8, h - 8 - eh));
        el.style.transform = `translate(${left}px, ${top}px)`;
        el.style.visibility = proj.z > 1 ? 'hidden' : 'visible';
      }
    }

    statsT -= dt;
    if (o.onStats && statsT <= 0) { statsT = 0.25; o.onStats({ aloft, resting, onTree: NC, blossoms: NB }); }

    renderer.render(scene, camera);
  }
  function kick() { if (!raf && running) { clock.getDelta(); raf = requestAnimationFrame(frame); } }

  const api = {
    seasons: SEASONS,
    setSeason(key) {
      if (!SEASONS[key] || key === seasonKey) return;
      seasonKey = key; setSeasonTargets(key, false); release(26, null);
    },
    setWind(v) { wind = Math.max(0, Number(v) || 0); },
    setAutoOrbit(v) { autoOrbit = !!v && !reduceMotion; },
    setSky(v) { sky.visible = !!v; },
    setPaused(v) { paused = !!v; if (!paused) kick(); },
    focusZone(z) {
      focusZone = ZONES.includes(z) ? z : null;
      phiTween = 2.5; lastInteract = performance.now();
    },
    gust() {
      shake = 1.6; release(Math.round(NF * 0.22), null);
      for (let i = 0; i < NC; i++) cHover[i] = Math.max(cHover[i], 0.5 + 0.5 * Math.random());
    },
    storm() {
      storm = 1; shake = 2; release(Math.round(NF * 0.45), null);
    },
    dispose() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      ro && ro.disconnect(); io && io.disconnect();
      for (const [el, ev, fn, opt] of listeners) el.removeEventListener(ev, fn, opt);
      overlay && overlay.remove();
      for (const d of disposables) d.dispose && d.dispose();
      for (const m of [canopy, blossoms, fall, litter, grass, stems, heads, nodes]) m.dispose();
      renderer.dispose();
    },
  };
  kick();
  return api;
}
