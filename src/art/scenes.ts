// Place illustrations (viewBox 0 0 360 240). Every restoration task has a layer that is
// drawn "before" until the task is done and "after" once it is.

import { INK, O, THIN, estekan, samovar, sparkle } from './kit';

type Layer = (done: boolean) => string;

const brickWall = (fill = '#d9a873', line = '#b5804d', h = 170) => {
  let s = `<rect x="0" y="0" width="360" height="${h}" fill="${fill}"/>`;
  for (let y = 14; y < h; y += 14) {
    s += `<path d="M0 ${y} H360" stroke="${line}" stroke-width="1.2" opacity=".6"/>`;
    const off = (y / 14) % 2 ? 0 : 14;
    for (let x = off; x < 360; x += 28) s += `<path d="M${x} ${y - 14} V${y}" stroke="${line}" stroke-width="1.2" opacity=".5"/>`;
  }
  return s;
};
const floor = (fill = '#b98652', y = 170) =>
  `<rect x="0" y="${y}" width="360" height="${240 - y}" fill="${fill}"/>` +
  Array.from({ length: 9 }, (_, i) => `<path d="M${i * 45} ${y} L${i * 45 - 30} 240" stroke="${INK}" stroke-width="1" opacity=".2"/>`).join('') +
  `<path d="M0 ${y} H360" stroke="${INK}" stroke-width="2" opacity=".4"/>`;

const cobweb = (x: number, y: number, s = 1, flip = false) =>
  `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})" stroke="#f4f0e6" stroke-width="1.2" fill="none" opacity=".9">` +
  `<path d="M0 0 L40 0 M0 0 L0 40 M0 0 L32 32 M0 0 L40 18 M0 0 L18 40"/>` +
  `<path d="M12 0 Q10 10 0 12 M24 0 Q20 20 0 24 M36 0 Q30 30 0 36"/></g>`;

const dustPile = (x: number, y: number) =>
  `<ellipse cx="${x}" cy="${y}" rx="22" ry="6" fill="#9b8a76" opacity=".7"/><ellipse cx="${x - 6}" cy="${y - 3}" rx="10" ry="4" fill="#b3a28d" opacity=".8"/>`;

const plank = (x: number, y: number, w: number, rot: number) =>
  `<rect x="${x}" y="${y}" width="${w}" height="9" rx="2" fill="#a77a4f" ${THIN} transform="rotate(${rot} ${x} ${y})"/>`;

const glow = (x: number, y: number, r: number, op = 0.55) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#rGlow)" opacity="${op}"/>`;

const stringLights = (y: number, colors = ['#ffd36b', '#ff7a9c', '#5fe0e0', '#9be36b']) =>
  `<path d="M0 ${y} Q90 ${y + 22} 180 ${y} T360 ${y}" fill="none" stroke="${INK}" stroke-width="1.5"/>` +
  Array.from({ length: 13 }, (_, i) => {
    const x = 14 + i * 27;
    const t = (x % 180) / 180;
    const yy = y + Math.sin(t * Math.PI) * 11 + 3;
    return `<circle cx="${x}" cy="${yy}" r="8" fill="url(#rGlow)" opacity=".7"/><circle cx="${x}" cy="${yy}" r="3.6" fill="${colors[i % colors.length]}" ${THIN} stroke-width="1"/>`;
  }).join('');

/** Wooden lattice (gereh-chini) double door. */
const latticeDoor = (x: number, y: number, w: number, hgt: number) => {
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${hgt}" rx="${w / 2}" ry="${w / 3}" fill="url(#gWoodDark)" ${O}/>`;
  s += `<path d="M${x + w / 2} ${y + 6} V${y + hgt}" ${THIN}/>`;
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 2; c++) {
      const cx = x + w / 4 + (c * w) / 2, cy = y + hgt * 0.32 + r * hgt * 0.17;
      s += `<path d="M${cx} ${cy - 9} L${cx + 9} ${cy} L${cx} ${cy + 9} L${cx - 9} ${cy} Z" fill="url(#gTurq)" ${THIN} stroke-width="1.2"/>`;
    }
  return s + `<circle cx="${x + w / 2 - 6}" cy="${y + hgt * 0.6}" r="2.6" fill="url(#gGold)" ${THIN}/><circle cx="${x + w / 2 + 6}" cy="${y + hgt * 0.6}" r="2.6" fill="url(#gGold)" ${THIN}/>`;
};

const boardedDoor = (x: number, y: number, w: number, hgt: number) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${hgt}" rx="${w / 2}" ry="${w / 3}" fill="#6b5a4a" ${O}/>` +
  plank(x - 4, y + hgt * 0.35, w + 8, 12) + plank(x - 4, y + hgt * 0.62, w + 8, -10) +
  `<path d="M${x + 10} ${y + 30} l14 20 M${x + w - 14} ${y + 50} l-8 26" stroke="${INK}" stroke-width="1.5" opacity=".6"/>`;

const takht = (x: number, y: number, w: number) =>
  `<rect x="${x}" y="${y}" width="${w}" height="16" rx="3" fill="url(#gWood)" ${O}/>` +
  `<path d="M${x + 6} ${y + 16} V${y + 38} M${x + w - 6} ${y + 16} V${y + 38}" ${O} stroke-width="5"/>` +
  `<rect x="${x + 4}" y="${y - 6}" width="${w - 8}" height="8" fill="#c0392b" ${THIN}/>` +
  Array.from({ length: Math.floor((w - 8) / 10) }, (_, i) => `<path d="M${x + 9 + i * 10} ${y - 6} l4 8" stroke="#f6c945" stroke-width="1.4"/>`).join('') +
  `<rect x="${x + 8}" y="${y - 26}" width="26" height="22" rx="8" fill="url(#gCarpet)" ${THIN}/><rect x="${x + w - 34}" y="${y - 26}" width="26" height="22" rx="8" fill="url(#gNavy)" ${THIN}/>`;

const sign = (x: number, y: number, text: string, hanging: boolean) =>
  hanging
    ? `<path d="M${x + 20} ${y - 14} L${x + 30} ${y} M${x + 130} ${y - 14} L${x + 120} ${y}" stroke="${INK}" stroke-width="2"/>` +
      `<rect x="${x}" y="${y}" width="150" height="34" rx="6" fill="url(#gNavy)" ${O}/><rect x="${x + 5}" y="${y + 5}" width="140" height="24" rx="4" fill="none" stroke="#f6c945" stroke-width="1.6"/>` +
      `<text x="${x + 75}" y="${y + 23}" text-anchor="middle" font-family="Vazirmatn, sans-serif" font-weight="800" font-size="15" fill="#ffe08a">${text}</text>`
    : `<g transform="rotate(-8 ${x + 75} ${y + 150})"><rect x="${x}" y="${y + 140}" width="150" height="30" rx="6" fill="#4a4a5a" ${O}/><text x="${x + 75}" y="${y + 160}" text-anchor="middle" font-family="Vazirmatn, sans-serif" font-weight="800" font-size="13" fill="#9a9aaa">${text}</text></g>`;

// ------------------------------------------------------------------ teahouse

const TEAHOUSE: Record<string, Layer> = {
  dust: (d) =>
    d
      ? `<rect x="150" y="24" width="56" height="64" rx="4" fill="url(#gWood)" ${O}/><rect x="157" y="31" width="42" height="50" fill="#e9d6b5" ${THIN}/>` +
        `<circle cx="178" cy="50" r="11" fill="#c9a07a" ${THIN}/><path d="M168 47 q10 6 20 0" fill="none" stroke="#3b2216" stroke-width="3" stroke-linecap="round"/><path d="M164 80 q14 -18 28 0" fill="#5a4a3a"/>`
      : cobweb(0, 0, 1.4) + cobweb(360, 0, 1.2, true) + dustPile(80, 214) + dustPile(270, 222) + dustPile(190, 230) +
        `<rect x="0" y="0" width="360" height="240" fill="#6b5a4a" opacity=".25"/>`,
  door: (d) => (d ? latticeDoor(20, 64, 70, 106) : boardedDoor(20, 64, 70, 106)),
  samovar: (d) =>
    d
      ? glow(300, 120, 50, 0.6) + `<g transform="translate(262 72) scale(.78)">${samovar('url(#gBrass)')}</g>` +
        `<path d="M300 66 q-8 -10 0 -20 q8 -10 0 -20" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>`
      : `<g transform="translate(262 72) scale(.78)" opacity=".75" style="filter:grayscale(1)">${samovar('url(#gSteel)')}</g>`,
  takht: (d) =>
    d
      ? takht(104, 168, 130) + `<g transform="translate(140 152) scale(.4)">${estekan(0, 0, 1, true)}</g><g transform="translate(196 152) scale(.4)">${estekan(0, 0, 1, true)}</g>`
      : plank(110, 200, 80, 8) + plank(160, 214, 70, -12) + plank(120, 222, 60, 3),
  sign: (d) => sign(110, 6, 'قهوه‌خانه‌ی حاج‌بابا', d),
  lights: (d) => (d ? stringLights(4) + `<rect x="0" y="0" width="360" height="240" fill="#ffcf7a" opacity=".12"/>` : `<rect x="0" y="0" width="360" height="240" fill="#1c1430" opacity=".28"/>`),
};

// ------------------------------------------------------------------ bakery

const flourSack = (x: number, y: number, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-16 -18 C-20 -4 -20 14 -14 20 L14 20 C20 14 20 -4 16 -18 Z" fill="url(#gCream)" ${O}/><path d="M-14 -18 Q0 -26 14 -18" fill="#f2e6cc" ${O}/><path d="M-8 2 h16" stroke="#a5621f" stroke-width="3"/></g>`;

const BAKERY: Record<string, Layer> = {
  flour: (d) =>
    d
      ? flourSack(300, 150, 1) + flourSack(330, 154, 0.9) + flourSack(314, 126, 0.9)
      : flourSack(120, 210, 1) + `<g transform="rotate(70 180 214)">${flourSack(180, 214, 1)}</g>` + `<ellipse cx="150" cy="228" rx="40" ry="6" fill="#fff" opacity=".8"/>`,
  pebbles: (d) =>
    `<g transform="translate(40 150)">` +
    Array.from({ length: 18 }, (_, i) => `<ellipse cx="${(i % 6) * 12}" cy="${Math.floor(i / 6) * 8}" rx="5" ry="3.5" fill="${d ? '#d8d3c9' : '#5a5148'}" ${THIN} stroke-width="1"/>`).join('') +
    `</g>`,
  oven: (d) =>
    `<path d="M120 170 L120 70 C120 30 240 30 240 70 L240 170 Z" fill="url(#gClay)" ${O}/>` +
    `<path d="M150 170 L150 120 C150 92 210 92 210 120 L210 170 Z" fill="#3b1d10" ${O}/>` +
    (d ? '' : `<path d="M140 50 l14 22 l-6 12 l12 20 M228 76 l-10 16 l8 10" fill="none" stroke="${INK}" stroke-width="2.5"/>`),
  counter: (d) =>
    d
      ? `<rect x="0" y="170" width="110" height="50" fill="url(#gWood)" ${O}/><rect x="-4" y="164" width="118" height="10" rx="2" fill="url(#gWoodDark)" ${O}/>` +
        `<rect x="14" y="146" width="80" height="18" rx="9" fill="url(#gBread)" ${O}/>`
      : `<rect x="0" y="186" width="90" height="34" fill="#7a6a5a" ${O} transform="rotate(-4 45 200)"/>`,
  awning: (d) =>
    d
      ? `<path d="M0 0 H360 V26 Q345 38 330 26 Q315 38 300 26 Q285 38 270 26 Q255 38 240 26 Q225 38 210 26 Q195 38 180 26 Q165 38 150 26 Q135 38 120 26 Q105 38 90 26 Q75 38 60 26 Q45 38 30 26 Q15 38 0 26 Z" fill="url(#gRed)" ${O}/>` +
        Array.from({ length: 6 }, (_, i) => `<rect x="${30 + i * 60}" y="0" width="30" height="26" fill="#fff" opacity=".85"/>`).join('')
      : `<path d="M0 0 H140 L120 22 L80 10 L40 26 L0 14 Z" fill="#8a6a6a" ${O} opacity=".8"/>`,
  fire: (d) =>
    d
      ? glow(180, 140, 70, 0.7) + `<path d="M160 170 C158 150 172 140 180 124 C190 142 204 150 200 170 Z" fill="url(#gFire)"/>` +
        `<rect x="250" y="176" width="100" height="16" rx="8" fill="url(#gBread)" ${O}/>` + sparkle(330, 60, 7) + sparkle(30, 90, 6)
      : `<rect x="0" y="0" width="360" height="240" fill="#1c1430" opacity=".3"/>`,
};

// ------------------------------------------------------------------ garden / courtyard

const rose = (x: number, y: number, s: number) =>
  `<g transform="translate(${x} ${y}) scale(${s})">` +
  [0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-6" rx="5" ry="7" transform="rotate(${a})" fill="url(#gRose)" ${THIN} stroke-width="1"/>`).join('') +
  `<circle r="4" fill="url(#gRoseDeep)"/></g>`;

const GARDEN: Record<string, Layer> = {
  weeds: (d) =>
    d
      ? `<rect x="0" y="170" width="360" height="70" fill="#c69260"/>` +
        Array.from({ length: 12 }, (_, i) => `<path d="M${i * 30} 170 L${i * 30 - 20} 240" stroke="#8f6a3a" stroke-width="1.4" opacity=".5"/>`).join('')
      : Array.from({ length: 30 }, (_, i) => {
          const x = (i * 47) % 360, y = 176 + ((i * 29) % 60);
          return `<path d="M${x} ${y} l-6 -18 M${x} ${y} l4 -22 M${x} ${y} l10 -14" stroke="#5d7a2c" stroke-width="2.4" stroke-linecap="round"/>`;
        }).join(''),
  pool: (d) =>
    `<ellipse cx="180" cy="200" rx="80" ry="22" fill="url(#gTurq)" ${O}/>` +
    `<ellipse cx="180" cy="200" rx="66" ry="15" fill="${d ? '#7fd6e6' : '#8a7a5a'}" ${THIN}/>` +
    (d ? `<path d="M150 196 q10 -4 20 0 M190 204 q10 -4 20 0" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/>${rose(170, 200, 0.6)}` : `<path d="M140 200 l20 4 M200 196 l14 6" stroke="${INK}" stroke-width="1.6" opacity=".5"/>`),
  roses: (d) =>
    d
      ? [30, 70, 290, 330].map((x) => `<path d="M${x} 170 V120" stroke="#4f8a2a" stroke-width="3"/>` + rose(x - 8, 128, 1) + rose(x + 8, 140, 0.9) + rose(x, 112, 1)).join('')
      : [30, 70, 290, 330].map((x) => `<path d="M${x} 170 q-6 -20 4 -36" fill="none" stroke="#8a7a5a" stroke-width="3"/>`).join(''),
  bench: (d) => (d ? takht(110, 150, 140) : plank(250, 220, 70, -20)),
  distill: (d) =>
    d
      ? `<g transform="translate(300 60)"><path d="M-24 60 C-30 30 -20 10 0 10 C20 10 30 30 24 60 Z" fill="url(#gCopper)" ${O}/><path d="M0 10 C10 -10 40 -6 44 20 L44 60" fill="none" ${O} stroke="url(#gCopper)" stroke-width="5"/><rect x="34" y="60" width="20" height="26" rx="6" fill="url(#gGlass)" ${O}/><rect x="36" y="72" width="16" height="12" fill="url(#gRose)" opacity=".8"/></g>` + sparkle(340, 40, 6)
      : '',
};

// ------------------------------------------------------------------ salon

const SALON: Record<string, Layer> = {
  mirror: (d) =>
    d
      ? [60, 180, 300].map((x) => `<rect x="${x - 34}" y="30" width="68" height="84" rx="34" fill="url(#gSky)" ${O}/><rect x="${x - 38}" y="26" width="76" height="92" rx="38" fill="none" stroke="url(#gGold)" stroke-width="5"/><path d="M${x - 18} 50 l12 -12 M${x - 20} 64 l20 -20" stroke="#fff" stroke-width="3" opacity=".7"/>`).join('')
      : [60, 180, 300].map((x) => `<rect x="${x - 34}" y="30" width="68" height="84" rx="34" fill="#7a8a90" ${O}/><path d="M${x - 20} 40 l30 50 M${x + 10} 36 l-24 60" stroke="${INK}" stroke-width="1.6"/>`).join(''),
  chairs: (d) =>
    [60, 180, 300].map((x) =>
      d
        ? `<rect x="${x - 22}" y="128" width="44" height="40" rx="12" fill="url(#gRoseDeep)" ${O}/><rect x="${x - 26}" y="160" width="52" height="16" rx="6" fill="url(#gRose)" ${O}/><path d="M${x} 176 V206 M${x - 18} 210 h36" ${O} stroke="url(#gSteel)" stroke-width="5"/>`
        : `<rect x="${x - 22}" y="150" width="44" height="30" rx="6" fill="#6a5a5a" ${O} transform="rotate(12 ${x} 165)"/>`,
    ).join(''),
  curtain: (d) =>
    d
      ? `<path d="M0 0 H40 C34 60 46 120 30 170 H0 Z M360 0 H320 C326 60 314 120 330 170 H360 Z" fill="url(#gCarpet)" ${O}/>` +
        [[16, 40], [20, 100], [344, 60], [340, 120]].map(([x, y]) => `<path d="M${x} ${y + 8} C${x - 8} ${y + 8} ${x - 8} ${y - 4} ${x - 2} ${y - 6} C${x} ${y - 10} ${x + 6} ${y - 8} ${x + 4} ${y - 14} C${x + 10} ${y - 6} ${x + 8} ${y + 8} ${x} ${y + 8} Z" fill="#1d4fa8" stroke="#f6c945" stroke-width="1"/>`).join('')
      : `<path d="M0 0 H30 L20 90 L0 100 Z" fill="#8a7a7a" ${O}/>`,
  neon: (d) =>
    d
      ? `<rect x="110" y="122" width="140" height="0" />` +
        `<text x="180" y="18" text-anchor="middle" font-family="Vazirmatn, sans-serif" font-weight="900" font-size="20" fill="#ff7a9c" stroke="#fff" stroke-width=".8" style="filter:drop-shadow(0 0 6px #ff7a9c)">آرایشگاه شیرین</text>`
      : `<text x="180" y="18" text-anchor="middle" font-family="Vazirmatn, sans-serif" font-weight="900" font-size="20" fill="#6a6a7a">آرایشگـ… شیر…</text>`,
  party: (d) =>
    d
      ? stringLights(2, ['#ff7a9c', '#ffd36b', '#c58bff']) + sparkle(120, 100, 7) + sparkle(250, 90, 6) +
        [[100, 200], [260, 200]].map(([x, y]) => `<circle cx="${x}" cy="${y - 50}" r="16" fill="url(#gRoseDeep)" ${O}/><path d="M${x} ${y - 34} q4 18 -2 34" fill="none" stroke="${INK}" stroke-width="1.4"/>`).join('')
      : `<rect x="0" y="0" width="360" height="240" fill="#1c1430" opacity=".28"/>`,
};

// ------------------------------------------------------------------ hammam

const HAMMAM: Record<string, Layer> = {
  door: (d) => (d ? latticeDoor(146, 50, 68, 120) : boardedDoor(146, 50, 68, 120) + `<rect x="170" y="120" width="20" height="16" rx="3" fill="#7a7a7a" ${O}/><path d="M174 120 v-8 a6 6 0 0 1 12 0 v8" fill="none" ${O}/>`),
  tiles: (d) =>
    [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
      const x = i < 4 ? 8 + i * 32 : 228 + (i - 4) * 32;
      return [0, 1, 2, 3].map((r) => `<rect x="${x}" y="${40 + r * 30}" width="28" height="28" rx="2" fill="${d ? (r + i) % 2 ? 'url(#gTurq)' : 'url(#gBlue)' : '#7a7a6a'}" ${THIN}/>` +
        (d ? `<circle cx="${x + 14}" cy="${54 + r * 30}" r="5" fill="#fff" opacity=".85"/>` : '')).join('');
    }).join(''),
  pool: (d) =>
    `<rect x="70" y="186" width="220" height="40" rx="8" fill="url(#gTurq)" ${O}/><rect x="80" y="192" width="200" height="28" rx="6" fill="${d ? '#7fd6e6' : '#4a4a3a'}" ${THIN}/>`,
  box: (d) =>
    d
      ? glow(180, 200, 40, 0.8) + `<g transform="translate(160 178) scale(.4)"><path d="M16 50 L84 50 L82 84 L18 84 Z" fill="url(#gGold)" ${O}/><path d="M14 50 C14 24 86 24 86 50 Z" fill="url(#gGold)" ${O}/></g>` + sparkle(214, 176, 6)
      : '',
  lights: (d) => (d ? stringLights(4, ['#ffd36b', '#5fe0e0']) + glow(180, 100, 120, 0.25) : `<rect x="0" y="0" width="360" height="240" fill="#0e0a1e" opacity=".45"/>`),
};

interface SceneDef {
  base: string;
  /** Layers in draw order (not task order). */
  order: string[];
  layers: Record<string, Layer>;
}

const SCENES: Record<string, SceneDef> = {
  teahouse: { base: brickWall() + floor(), order: ['door', 'dust', 'sign', 'samovar', 'takht', 'lights'], layers: TEAHOUSE },
  bakery: { base: brickWall('#e8c99a', '#c4a070') + floor('#a98a6a'), order: ['oven', 'pebbles', 'counter', 'flour', 'awning', 'fire'], layers: BAKERY },
  garden: { base: `<rect width="360" height="170" fill="url(#gSky)"/>` + brickWall('#d9a873', '#b5804d', 120) + `<rect y="120" width="360" height="50" fill="#c69260"/>` + floor('#b98652'), order: ['weeds', 'pool', 'roses', 'bench', 'distill'], layers: GARDEN },
  salon: { base: `<rect width="360" height="170" fill="#ffe0ef"/>` + Array.from({ length: 12 }, (_, i) => `<path d="M${i * 32} 0 V170" stroke="#ffc2d8" stroke-width="10"/>`).join('') + floor('#d8c0c8'), order: ['curtain', 'mirror', 'chairs', 'neon', 'party'], layers: SALON },
  hammam: { base: `<rect width="360" height="190" fill="#e8dcc6"/><path d="M0 40 Q180 -30 360 40" fill="#d8c8aa" ${O}/>` + floor('#c9b48f', 190), order: ['tiles', 'door', 'pool', 'box', 'lights'], layers: HAMMAM },
};

export function sceneSvg(placeId: string, done: (layer: string) => boolean): string {
  const def = SCENES[placeId];
  if (!def) return '';
  const body = def.order.map((k) => def.layers[k](done(k))).join('');
  return `<svg viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">${def.base}${body}</svg>`;
}
