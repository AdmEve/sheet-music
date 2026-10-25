// Season 20 («مترو») place scenes. Same contract as scenes.ts: each task layer is drawn
// "before" until done, then "after".

import { INK, O, THIN, estekan, samovar, sparkle } from './kit';
import { DIG } from './chainsV';
import { PARTY } from './chainsN';
import { Layer, SceneDef, dustPile, glow, plank, stringLights } from './scenes';
import { darkness, text } from './scenes3';

/** A chain drawing (100×100) placed with its bottom centre on (x, base), without its backdrop disc. */
const art = (src: string, x: number, base: number, s: number) =>
  `<g transform="translate(${x - 50 * s} ${base - 90 * s}) scale(${s})">${src.replace(/^<circle cx="50" cy="5\d" r="4\d"[^>]*\/>/, '')}</g>`;

const metroM = (x: number, y: number, r: number) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#e0303f" ${THIN}/>` + text(x, y + r * 0.45, 'M', r * 1.2, '#fffdf6');

/** Brick courses between y0 and y1 only (brickWall always starts at the top). */
const brickBand = (y0: number, y1: number, fill = '#d9a873', line = '#b5804d') => {
  let out = `<rect x="0" y="${y0}" width="360" height="${y1 - y0}" fill="${fill}"/>`;
  for (let y = y0 + 14, row = 0; y <= y1; y += 14, row++) {
    out += `<path d="M0 ${y} H360" stroke="${line}" stroke-width="1.2" opacity=".6"/>`;
    for (let x = row % 2 ? 14 : 0; x < 360; x += 28) out += `<path d="M${x} ${y - 14} V${y}" stroke="${line}" stroke-width="1.2" opacity=".5"/>`;
  }
  return out;
};

const lot = () => `<rect width="360" height="110" fill="url(#gSky)"/>` + brickBand(60, 150) +
  `<rect y="146" width="360" height="94" fill="#b8b0a0"/>` + Array.from({ length: 30 }, (_, i) => `<circle cx="${(i * 47) % 356 + 2}" cy="${152 + (i * 31) % 84}" r="${1 + (i % 3)}" fill="#9a9284"/>`).join('');

// ------------------------------------------------------------------ دفتر کارگاه مترو

const SITEOFFICE: Record<string, Layer> = {
  container: (d) =>
    `<rect x="200" y="96" width="150" height="76" fill="${d ? '#3a76c4' : '#7a8a9a'}" ${O}/>` + Array.from({ length: 14 }, (_, i) => `<path d="M${208 + i * 10} 98 V170" stroke="${d ? '#2a5aa8' : '#5a6a7a'}" stroke-width="2"/>`).join('') +
    `<rect x="218" y="116" width="30" height="56" fill="${d ? '#e8e8e2' : '#6a6a6a'}" ${THIN}/><rect x="270" y="114" width="56" height="28" fill="${d ? 'url(#gGlass)' : '#5a6a7a'}" ${THIN}/>` +
    (d ? '' : `<path d="M276 118 l44 20" stroke="${INK}" stroke-width="1.2"/>`),
  maps: (d) =>
    `<path d="M40 190 L56 108 L72 190 M56 108 V190" fill="none" stroke="#6b4a2a" stroke-width="3"/>` +
    (d ? `<rect x="22" y="100" width="68" height="52" fill="#fffdf6" ${O}/><path d="M28 140 Q50 110 84 120" fill="none" stroke="#e0303f" stroke-width="3"/><path d="M28 120 H84" stroke="#3a76c4" stroke-width="3"/>` +
        metroM(56, 126, 6) + `<path d="M30 110 h14 M30 146 h20" stroke="#9b8a76" stroke-width="1.4"/>`
      : `<rect x="26" y="112" width="60" height="40" fill="#c9c0b0" ${THIN} transform="rotate(-8 56 132)"/>`),
  table: (d) =>
    d
      ? `<rect x="96" y="178" width="116" height="10" rx="2" fill="url(#gWood)" ${O}/><path d="M104 188 V214 M204 188 V214" ${O} stroke-width="4"/>` +
        [96, 212].map((x) => `<rect x="${x - 10}" y="190" width="20" height="6" rx="2" fill="url(#gNavy)" ${THIN}/><path d="M${x - 8} 196 V214 M${x + 8} 196 V214" stroke="#2a2a44" stroke-width="2"/>`).join('') +
        `<rect x="126" y="172" width="30" height="6" fill="#fffdf6" ${THIN} stroke-width="1"/>`
      : plank(100, 200, 100, 6) + dustPile(150, 212),
  sign: (d) =>
    `<path d="M120 146 V100 M190 146 V100" stroke="#5a5a60" stroke-width="4"/>` +
    (d ? `<rect x="110" y="70" width="90" height="36" rx="3" fill="#fffdf6" ${O}/>` + metroM(126, 88, 9) + text(166, 86, 'ایستگاه محله', 8, '#1d4fa8') + text(166, 99, 'با همکاری اهالی', 6, '#5a5a60')
      : `<rect x="112" y="84" width="86" height="30" rx="3" fill="#a8a8a0" ${THIN} transform="rotate(10 155 99)"/>`),
  tea: (d) => (d ? glow(180, 160, 26, 0.4) + `<g transform="translate(168 132) scale(.32)">${samovar('url(#gBrass)')}</g>` + estekan(140, 176, 0.22, true, false) + estekan(200, 176, 0.22, true, false) : ''),
};

// ------------------------------------------------------------------ حفاری آزمایشی

const houses = () =>
  `<rect width="360" height="100" fill="url(#gSky)"/>` +
  [[0, 50, 100, '#d9a873'], [96, 64, 90, '#c98a52'], [182, 56, 96, '#e0b07a'], [274, 46, 86, '#d9a873']].map(([x, y, w, c]) => `<rect x="${x}" y="${y}" width="${w}" height="${150 - Number(y)}" fill="${c}" ${O}/><rect x="${Number(x) + Number(w) / 2 - 10}" y="${Number(y) + 22}" width="20" height="26" rx="9" fill="#5e3418" ${THIN}/>`).join('') +
  `<rect y="146" width="360" height="94" fill="#b8a888"/>`;

const PIT = 'M60 166 H300 L280 236 H80 Z';

const TESTDIG: Record<string, Layer> = {
  pit: (d) =>
    d ? `<path d="${PIT}" fill="#6e4a2e" ${O}/>` + [186, 206, 224].map((y, i) => `<path d="M${66 + i * 6} ${y} H${294 - i * 6}" stroke="${['#8a6240', '#5a3a22', '#4a2a18'][i]}" stroke-width="4"/>`).join('')
      : `<ellipse cx="180" cy="196" rx="70" ry="14" fill="#9a8a6a"/>` + dustPile(150, 190),
  scaffold: (d) =>
    d ? `<path d="M56 166 V136 M120 166 V136 M184 166 V136 M248 166 V136 M304 166 V136 M56 140 H304 M56 156 H304" stroke="#f6c945" stroke-width="3"/>` +
        Array.from({ length: 12 }, (_, i) => `<path d="M${58 + i * 21} 156 l10 -16" stroke="#e0303f" stroke-width="2"/>`).join('')
      : plank(70, 150, 80, -6) + plank(220, 154, 70, 8),
  sensors: (d) => [[40, 110], [140, 120], [230, 112], [320, 104]].map(([x, y]) => `<rect x="${x - 7}" y="${y - 6}" width="14" height="12" rx="2" fill="#3a3a44" ${THIN} stroke-width="1"/><circle cx="${x}" cy="${y}" r="2.6" fill="${d ? '#4cd96a' : '#6a6a6a'}"/>` + (d ? glow(x, y, 8, 0.6) : '')).join(''),
  pump: (d) =>
    d ? `<rect x="306" y="176" width="40" height="30" rx="4" fill="url(#gRed)" ${O}/><circle cx="326" cy="191" r="7" fill="#3a3a44" ${THIN}/><path d="M306 196 Q270 210 250 226" fill="none" stroke="#2a2a2a" stroke-width="4"/><path d="M246 224 q-6 6 -2 12 q6 -2 2 -12 Z" fill="#6cc0ea"/>`
      : `<rect x="310" y="196" width="34" height="18" rx="3" fill="#7a6a5a" ${THIN}/>`,
  lights: (d) =>
    [24, 336].map((x) => `<path d="M${x} 236 V120" stroke="#5a5a60" stroke-width="4"/><rect x="${x - 12}" y="${112}" width="24" height="12" rx="2" fill="#3a3a44" ${THIN}/>` +
      (d ? `<path d="M${x - 10} 124 L${x < 180 ? 140 : 220} 236 H${x < 180 ? 60 : 300} Z" fill="#fff6a8" opacity=".2"/>` + glow(x, 120, 16, 0.8) : '')).join('') + (d ? sparkle(180, 176, 7) : darkness(0.25)),
};

// ------------------------------------------------------------------ یافته‌ی باستانی

const pitBase = () =>
  `<rect width="360" height="240" fill="#7a5232"/>` + [40, 80, 120].map((y, i) => `<path d="M0 ${y} Q180 ${y - 10} 360 ${y}" fill="none" stroke="${['#8a6240', '#6a4628', '#5a3a22'][i]}" stroke-width="10" opacity=".6"/>`).join('') +
  `<path d="M120 150 Q180 76 240 150 Z" fill="#b8784a" ${O}/><path d="M164 150 V128 Q180 112 196 128 V150 Z" fill="#2a1a10"/>` +
  `<rect y="150" width="360" height="90" fill="#a8784a"/>`;

const EXCAVATION: Record<string, Layer> = {
  grid: (d) =>
    d ? Array.from({ length: 7 }, (_, i) => `<path d="M${30 + i * 50} 156 V236" stroke="#fffdf6" stroke-width="1.2"/>`).join('') + [176, 206].map((y) => `<path d="M30 ${y} H330" stroke="#fffdf6" stroke-width="1.2"/>`).join('') +
        Array.from({ length: 7 }, (_, i) => `<rect x="${28 + i * 50}" y="152" width="4" height="8" fill="#e0303f"/>`).join('')
      : dustPile(120, 200) + dustPile(260, 214),
  shards: (d) => (d ? [[70, 192], [160, 222], [230, 188], [300, 222], [110, 230]].map(([x, y], i) => art(DIG[i % 2 ? 0 : 5], x, y, i % 2 ? 0.26 : 0.22)).join('') : ''),
  brushes: (d) => (d ? art(DIG[1], 300, 192, 0.3) + art(DIG[1], 50, 232, 0.24) : ''),
  crates: (d) =>
    d ? `<rect x="190" y="208" width="60" height="26" fill="url(#gWood)" ${O}/><path d="M190 220 H250" stroke="#8b5328" stroke-width="1.4"/>` + art(DIG[3], 220, 210, 0.3) + sparkle(256, 196, 5)
      : `<rect x="196" y="216" width="50" height="18" fill="#8a7a6a" ${THIN}/>`,
  tent: (d) =>
    d ? `<path d="M0 150 L48 60 L96 150 Z" fill="#e8dcc6" ${O}/><path d="M48 60 V150" stroke="${INK}" stroke-width="1.4"/><path d="M36 150 L48 110 L60 150 Z" fill="#5e3418" ${THIN}/>`
      : `<path d="M10 150 L40 120 L80 150 Z" fill="#9a9284" ${THIN}/>`,
};

// ------------------------------------------------------------------ ایستگاه کوچه

const stationBase = () =>
  `<rect width="360" height="240" fill="#e8ecef"/><rect y="0" width="360" height="24" fill="#c9d1dc"/>` + [70, 180, 290].map((x) => `<rect x="${x - 30}" y="4" width="60" height="8" rx="4" fill="#fffdf6"/>`).join('') +
  `<rect y="186" width="360" height="54" fill="#9aa4b0"/><path d="M0 186 H360" stroke="#f6c945" stroke-width="5"/>`;

const STATION: Record<string, Layer> = {
  portal: (d) =>
    `<path d="M110 186 V90 Q110 52 180 52 Q250 52 250 90 V186 Z" fill="${d ? '#c98a52' : '#b8b8b0'}" ${O}/><path d="M134 186 V100 Q134 76 180 76 Q226 76 226 100 V186 Z" fill="#3a4a5a"/>` +
    (d ? `<path d="M120 92 Q120 62 180 62 Q240 62 240 92" fill="none" stroke="url(#gTurq)" stroke-width="7"/>` : ''),
  tiles: (d) =>
    [[14, 'قهوه‌خونه'], [264, 'قمصر']].map(([x, label]) => `<rect x="${x}" y="48" width="82" height="70" fill="${d ? '#fffdf6' : '#d8dce0'}" ${O}/>` +
      (d ? Array.from({ length: 12 }, (_, i) => `<rect x="${Number(x) + 4 + (i % 4) * 19}" y="${52 + Math.floor(i / 4) * 21}" width="17" height="19" fill="${['#2aa8a8', '#2a5aa8', '#f6c945', '#e0303f'][(i + Math.floor(i / 4)) % 4]}" opacity=".55"/>`).join('') + text(Number(x) + 41, 112, String(label), 9, '#1d4fa8') : '')).join(''),
  showcase: (d) =>
    d ? `<rect x="22" y="132" width="76" height="52" fill="url(#gGlass)" ${O}/><rect x="18" y="182" width="84" height="6" fill="url(#gWoodDark)" ${THIN}/>` +
        `<path d="M34 182 Q60 140 86 182 Z" fill="#b8784a" ${THIN}/><path d="M54 182 V170 Q60 164 66 170 V182 Z" fill="#2a1a10"/>` + sparkle(96, 130, 5)
      : `<rect x="26" y="150" width="70" height="34" fill="#c9c9c0" ${THIN}/>`,
  escalator: (d) =>
    d ? `<path d="M250 186 L330 110 H356 V126 L280 200 H250 Z" fill="#7f8a99" ${O}/>` + Array.from({ length: 8 }, (_, i) => `<path d="M${262 + i * 10} ${190 - i * 9.5} h12" stroke="#d8dee6" stroke-width="2"/>`).join('') +
        `<path d="M246 176 L328 98" stroke="#2a2a2a" stroke-width="3"/>`
      : `<path d="M260 186 L320 130" stroke="#9a9a9a" stroke-width="10"/>`,
  sign: (d) =>
    d ? `<rect x="120" y="22" width="120" height="26" rx="4" fill="url(#gNavy)" ${O}/>` + metroM(136, 35, 8) + text(190, 40, 'ایستگاه حاج‌بابا', 11, '#fffdf6') + glow(180, 35, 30, 0.3)
      : `<rect x="140" y="28" width="80" height="16" rx="3" fill="#a8a8a0" ${THIN}/>`,
};

// ------------------------------------------------------------------ صدسالگی کوچه

const festBase = () =>
  `<rect width="360" height="70" fill="#2a2f5a"/>` + brickBand(50, 170) +
  `<rect y="166" width="360" height="74" fill="#b9b2a4"/>` +
  `<path d="M268 166 V110 H352 V166 Z" fill="#3a4a5a" ${O}/>` + metroM(310, 100, 9) + `<rect x="282" y="122" width="56" height="44" fill="#2a3440"/>`;

const FIREWORK = (x: number, y: number, c: string) =>
  Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return `<path d="M${x + Math.cos(a) * 6} ${y + Math.sin(a) * 6} L${x + Math.cos(a) * 18} ${y + Math.sin(a) * 18}" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/>`; }).join('') + `<circle cx="${x}" cy="${y}" r="3" fill="#fff6d0"/>`;

const CENTENNIAL: Record<string, Layer> = {
  lights: (d) => (d ? stringLights(60, ['#ffd36b', '#ff7a9c', '#5fe0e0', '#9be36b']) + stringLights(84, ['#c58bff', '#ffd36b', '#ff7a9c', '#5fe0e0']) : darkness(0.3)),
  photos: (d) =>
    d ? Array.from({ length: 6 }, (_, i) => `<rect x="${14 + (i % 3) * 30}" y="${100 + Math.floor(i / 3) * 30}" width="26" height="24" fill="${i % 2 ? '#e8d3a8' : '#d8c8a8'}" ${THIN} stroke-width="1"/><path d="M${18 + (i % 3) * 30} ${118 + Math.floor(i / 3) * 30} q9 -10 18 0" fill="#8a6a48"/>`).join('') + text(58, 96, 'صد سال کوچه', 8, '#fff6d0')
      : `<rect x="14" y="100" width="86" height="54" fill="#9a8a76" opacity=".5"/>`,
  cake: (d) =>
    `<rect x="132" y="186" width="96" height="8" rx="2" fill="#fffdf6" ${O}/><path d="M140 194 V222 M220 194 V222" ${O} stroke-width="3"/>` +
    (d ? art(PARTY[7], 180, 192, 0.6) + text(180, 132, '۱۰۰', 14, '#ffe08a') : ''),
  train: (d) =>
    d ? `<rect x="282" y="122" width="56" height="44" fill="#fff6a8" opacity=".5"/>` + glow(310, 144, 40, 0.6) +
        `<rect x="236" y="182" width="110" height="24" rx="10" fill="#e8ecef" ${O}/><rect x="244" y="188" width="18" height="10" rx="2" fill="url(#gGlass)" ${THIN} stroke-width="1"/><rect x="268" y="188" width="18" height="10" rx="2" fill="url(#gGlass)" ${THIN} stroke-width="1"/><rect x="292" y="188" width="18" height="10" rx="2" fill="url(#gGlass)" ${THIN} stroke-width="1"/>` +
        `<path d="M238 202 H344" stroke="#e0303f" stroke-width="3"/>` + text(291, 222, 'اولین قطار', 8, '#1d4fa8')
      : '',
  fireworks: (d) => (d ? FIREWORK(60, 30, '#ffd36b') + FIREWORK(170, 22, '#ff7a9c') + FIREWORK(250, 36, '#5fe0e0') + sparkle(110, 40, 5) + sparkle(210, 50, 5) : ''),
};

export const SCENES20: Record<string, SceneDef> = {
  siteoffice: { base: lot(), order: ['container', 'maps', 'sign', 'table', 'tea'], layers: SITEOFFICE },
  testdig: { base: houses(), order: ['sensors', 'pit', 'scaffold', 'pump', 'lights'], layers: TESTDIG },
  excavation: { base: pitBase(), order: ['tent', 'grid', 'shards', 'brushes', 'crates'], layers: EXCAVATION },
  metrostation: { base: stationBase(), order: ['portal', 'tiles', 'showcase', 'escalator', 'sign'], layers: STATION },
  centennial: { base: festBase(), order: ['lights', 'photos', 'cake', 'train', 'fireworks'], layers: CENTENNIAL },
};
