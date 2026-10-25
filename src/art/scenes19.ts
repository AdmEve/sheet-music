// Season 19 («گلاب‌گیری») place scenes. Same contract as scenes.ts: each task layer is drawn
// "before" until done, then "after".

import { INK, O, THIN, estekan, sparkle } from './kit';
import { QAMSAR } from './chainsU';
import { Layer, SceneDef, brickWall, dustPile, floor, glow, plank, takht } from './scenes';
import { text } from './scenes3';

/** One of the Qamsar chain's drawings (100×100), its bottom centre on (x, base), without its backdrop disc. */
const item = (level: number, x: number, base: number, s: number) =>
  `<g transform="translate(${x - 50 * s} ${base - 90 * s}) scale(${s})">${QAMSAR[level - 1].replace(/^<circle cx="50" cy="5\d" r="4\d"[^>]*\/>/, '')}</g>`;

const rose = (x: number, y: number, r: number) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gRoseDeep)" ${THIN} stroke-width="1"/><path d="M${x - r * 0.5} ${y} q${r * 0.5} -${r * 0.6} ${r} 0" fill="none" stroke="#ffd0dc" stroke-width=".9"/>`;

const bushRow = (y: number, n: number, x0: number, dx: number, s: number, bloom: boolean) =>
  Array.from({ length: n }, (_, i) => {
    const x = x0 + i * dx;
    return `<ellipse cx="${x}" cy="${y}" rx="${18 * s}" ry="${13 * s}" fill="${bloom ? 'url(#gLeafDark)' : '#7a6a4a'}" ${THIN}/>` +
      (bloom ? [[-8, -4], [6, -6], [0, 4], [10, 3], [-10, 5]].map(([a, b]) => rose(x + a * s, y + b * s, 3.4 * s)).join('')
        : `<path d="M${x - 10 * s} ${y} l6 -8 M${x + 6 * s} ${y + 2} l6 -10" stroke="#5a4a2a" stroke-width="1.4"/>`);
  }).join('');

// ------------------------------------------------------------------ باغ گل محمدی

const dawnBase = () =>
  `<rect width="360" height="140" fill="#ffd9c0"/><rect width="360" height="60" fill="#f6b8c8" opacity=".6"/><circle cx="290" cy="96" r="22" fill="#ffe7a0"/>` +
  `<path d="M0 110 L50 70 L90 96 L150 52 L210 92 L260 66 L320 100 L360 80 V140 H0 Z" fill="#b89aa8"/>` +
  `<path d="M0 124 L60 100 L120 118 L190 94 L250 120 L320 104 L360 116 V140 H0 Z" fill="#9a7a88"/>` +
  `<rect y="136" width="360" height="104" fill="#a8904a"/>`;

const ROSEGARDEN: Record<string, Layer> = {
  stream: (d) =>
    `<path d="M0 214 Q120 196 220 206 T360 196 V206 Q260 214 220 216 T0 226 Z" fill="${d ? 'url(#gWater)' : '#8a6a3a'}" ${THIN}/>` +
    (d ? `<path d="M40 216 q10 -3 20 0 M160 208 q10 -3 20 0 M290 202 q10 -3 20 0" fill="none" stroke="#fff" stroke-width="1.4"/>` : ''),
  bushes: (d) => bushRow(150, 8, 20, 46, 0.7, d) + bushRow(176, 7, 36, 50, 0.95, d),
  shade: (d) =>
    d
      ? `<path d="M250 236 V150 M344 236 V150" stroke="#8b5328" stroke-width="4"/><path d="M240 150 H354 L346 140 H248 Z" fill="#d8b860" ${O}/>` +
        Array.from({ length: 10 }, (_, i) => `<path d="M${252 + i * 10} 140 V150" stroke="#a8883a" stroke-width="1.2"/>`).join('')
      : plank(250, 220, 90, -6) + plank(260, 230, 70, 4),
  tea: (d) =>
    d ? `<path d="M256 226 H340 L346 236 H250 Z" fill="url(#gCarpet)" ${THIN}/>` + estekan(280, 222, 0.26, true) + estekan(300, 222, 0.26, true) + `<g transform="translate(314 196) scale(.3)">${QAMSAR[3]}</g>`
      : '',
  baskets: (d) => (d ? item(2, 80, 236, 0.5) + item(2, 150, 238, 0.44) + item(1, 196, 232, 0.3) : dustPile(110, 228)),
};

// ------------------------------------------------------------------ کارگاه گلاب‌گیری

const workshopBase = () => brickWall('#b8804a', '#8a5a32', 170) + `<path d="M0 0 H360 V24 Q180 -6 0 24 Z" fill="#6a4a2a"/>` + floor('#8a6a4a', 170);

const DISTILLERY: Record<string, Layer> = {
  fire: (d) =>
    `<rect x="16" y="150" width="200" height="30" fill="#8a5a32" ${O}/>` + [56, 116, 176].map((x) => `<path d="M${x - 16} 180 V164 Q${x} 152 ${x + 16} 164 V180 Z" fill="#2a1a10" ${THIN}/>` +
      (d ? `<path d="M${x - 10} 178 C${x - 12} 168 ${x - 2} 166 ${x} 158 C${x + 4} 166 ${x + 12} 168 ${x + 10} 178 Z" fill="url(#gFire)"/>` + glow(x, 168, 18, 0.6) : '')).join(''),
  pots: (d) => (d ? [56, 116, 176].map((x) => item(6, x - 8, 160, 0.62)).join('') : [56, 116, 176].map((x) => `<ellipse cx="${x}" cy="146" rx="18" ry="6" fill="#7a5a3a" ${THIN}/>`).join('')),
  pipes: (d) =>
    d ? [62, 122, 182].map((x, i) => `<path d="M${x + 12} 108 Q${x + 40} ${100 - i * 4} ${250} ${120 + i * 10}" fill="none" stroke="#b05a2a" stroke-width="3.4"/>`).join('')
      : `<path d="M240 130 l40 10 M246 150 l30 -6" stroke="#7a5a3a" stroke-width="3"/>`,
  pool: (d) =>
    `<rect x="234" y="112" width="110" height="56" rx="3" fill="#b8a898" ${O}/>` + (d ? `<rect x="240" y="118" width="98" height="44" fill="url(#gWater)"/><path d="M248 130 h20 M290 144 h24" stroke="#fff" stroke-width="1.4"/>` : dustPile(290, 168)),
  carboys: (d) => (d ? item(7, 262, 232, 0.5) + item(3, 316, 230, 0.5) + item(4, 346, 232, 0.3) + sparkle(300, 180, 5) : ''),
};

// ------------------------------------------------------------------ مسافرخونه‌ی قدیمی

const innBase = () =>
  `<rect width="360" height="60" fill="url(#gSky)"/><rect y="40" width="360" height="130" fill="#d8b48a"/>` + Array.from({ length: 9 }, (_, i) => `<path d="M0 ${54 + i * 13} H360" stroke="#b8946a" stroke-width="1" opacity=".6"/>`).join('') +
  floor('#c9a27a', 168);

const pointed = (cx: number, base: number, w: number, h: number) =>
  `M${cx - w / 2} ${base} V${base - h + w * 0.45} Q${cx - w / 2} ${base - h + 4} ${cx} ${base - h} Q${cx + w / 2} ${base - h + 4} ${cx + w / 2} ${base - h + w * 0.45} V${base} Z`;

const GUESTHOUSE: Record<string, Layer> = {
  iwan: (d) =>
    `<path d="${pointed(170, 168, 110, 120)}" fill="${d ? '#8a5a32' : '#9a8a76'}" ${O}/><path d="${pointed(170, 168, 86, 100)}" fill="${d ? '#4a2a18' : '#6a5a4a'}"/>` +
    (d ? `<path d="M126 70 Q170 40 214 70" fill="none" stroke="url(#gTurq)" stroke-width="4"/>` : `<path d="M140 80 l20 30 M196 74 l-10 24" stroke="${INK}" stroke-width="1.4"/>`),
  orosi: (d) =>
    d
      ? `<rect x="250" y="64" width="92" height="88" rx="2" fill="url(#gWoodDark)" ${O}/>` +
        Array.from({ length: 12 }, (_, i) => `<rect x="${256 + (i % 4) * 21}" y="${70 + Math.floor(i / 4) * 26}" width="18" height="22" fill="${['#e0303f', '#3a76c4', '#f6c945', '#3f8a2a'][(i + Math.floor(i / 4)) % 4]}" opacity=".75" ${THIN} stroke-width=".8"/>`).join('') +
        `<path d="M250 170 L342 170 L360 200 L240 200 Z" fill="#f6c945" opacity=".18"/>`
      : `<rect x="250" y="64" width="92" height="88" rx="2" fill="#7a6a5a" ${O}/><path d="M256 70 l80 76 M336 70 l-80 76" stroke="#5a4a3a" stroke-width="1.4"/>`,
  pool: (d) =>
    `<path d="M110 206 L130 192 H230 L250 206 L230 220 H130 Z" fill="url(#gTurq)" ${O}/>` +
    (d ? `<path d="M120 206 L136 196 H224 L240 206 L224 216 H136 Z" fill="url(#gWater)" ${THIN}/>` + [150, 176, 202, 222].map((x) => rose(x, 206, 3)).join('')
      : `<path d="M120 206 L136 196 H224 L240 206 L224 216 H136 Z" fill="#a89070" ${THIN}/>`),
  takht: (d) => (d ? takht(14, 182, 92) : plank(18, 206, 80, 6) + plank(24, 196, 70, -8)),
  ledger: (d) =>
    d
      ? `<path d="M40 168 L60 162 L80 168 L80 158 L60 152 L40 158 Z" fill="#f6ead2" ${O}/><path d="M60 152 V162" stroke="${INK}" stroke-width="1"/>` +
        `<path d="M44 158 h12 M64 158 h12 M44 162 h10" stroke="#3a76c4" stroke-width="1"/>` + glow(60, 156, 26, 0.6) + sparkle(84, 146, 5)
      : `<rect x="44" y="158" width="32" height="12" rx="2" fill="#7a5a4a" ${O}/>`,
};

// ------------------------------------------------------------------ جشن گلاب‌گیری

const villageBase = () =>
  `<rect width="360" height="120" fill="url(#gSky)"/>` +
  [[0, 70, 90], [84, 84, 70], [206, 78, 80], [284, 66, 76]].map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="${150 - y}" fill="#d8b48a" ${O}/><rect x="${x + w / 2 - 8}" y="${y + 20}" width="16" height="20" rx="7" fill="#5e3418" ${THIN}/>`).join('') +
  `<rect y="146" width="360" height="94" fill="#c9a27a"/>`;

const ROSEFEST: Record<string, Layer> = {
  arch: (d) =>
    d
      ? `<path d="M140 210 V120 A40 40 0 0 1 220 120 V210" fill="none" stroke="#3f8a2a" stroke-width="7"/>` +
        Array.from({ length: 15 }, (_, i) => { const a = Math.PI + (i / 14) * Math.PI; return rose(180 + Math.cos(a) * 40, 120 + Math.sin(a) * 40, 5); }).join('') +
        [140, 160, 180, 200].map((y, i) => rose(140, y, 4.4) + rose(220, y - (i % 2) * 6, 4.4)).join('')
      : `<path d="M142 210 L138 130 M218 210 L224 140" stroke="#8a7a6a" stroke-width="5"/>`,
  stalls: (d) =>
    `<rect x="12" y="176" width="104" height="10" rx="2" fill="url(#gWood)" ${O}/><path d="M18 186 V220 M110 186 V220" ${O} stroke-width="3"/>` +
    (d ? `<path d="M8 140 L64 128 L120 140 V150 H8 Z" fill="url(#gRose)" ${O}/>` + [30, 52, 74, 96].map((x) => item(4, x, 176, 0.26)).join('') : ''),
  bottles: (d) =>
    `<rect x="246" y="150" width="100" height="6" rx="2" fill="url(#gWood)" ${O}/><rect x="246" y="186" width="100" height="6" rx="2" fill="url(#gWood)" ${O}/>` +
    (d ? [[258, '#ffd0dc'], [278, '#c8e6c9'], [298, '#fff6a8'], [318, '#d6ecff'], [338, '#ffd0dc']].map(([x, c]) => `<path d="M${Number(x) - 6} 186 V172 Q${x} 164 ${Number(x) + 6} 172 V186 Z" fill="${c}" ${THIN} stroke-width="1"/><rect x="${Number(x) - 2}" y="164" width="4" height="5" fill="url(#gGold)"/>`).join('') +
        [262, 290, 318].map((x) => item(3, x, 150, 0.22)).join('')
      : dustPile(296, 186)),
  music: (d) =>
    d
      ? `<path d="M120 236 H196 L200 226 H116 Z" fill="url(#gCarpet)" ${THIN}/>` +
        `<g transform="translate(140 214) rotate(-24)"><path d="M-6 0 C-10 -4 -10 -10 -4 -12 C-1 -9 1 -9 4 -12 C10 -10 10 -4 6 0 C10 4 8 12 0 12 C-8 12 -10 4 -6 0 Z" fill="url(#gWood)" ${THIN}/><path d="M0 -10 V-34" ${O} stroke-width="2"/></g>` +
        `<ellipse cx="176" cy="224" rx="12" ry="9" fill="#f2e2b8" ${O}/>`
      : '',
  sweets: (d) => (d ? `<ellipse cx="236" cy="226" rx="22" ry="6" fill="url(#gBrass)" ${O}/>` + [228, 236, 244, 232, 240].map((x, i) => `<circle cx="${x}" cy="${222 - (i > 2 ? 4 : 0)}" r="3.4" fill="#fff6e0" ${THIN} stroke-width=".7"/><circle cx="${x}" cy="${222 - (i > 2 ? 4 : 0)}" r="1" fill="#e2507a"/>`).join('') : ''),
};

// ------------------------------------------------------------------ باغ گلاب کوچه

const alleyBase = () => brickWall('#d9a873', '#b5804d', 160) + `<rect y="160" width="360" height="80" fill="#b9b2a4"/><path d="M0 160 H360" stroke="${INK}" stroke-width="2" opacity=".35"/>`;

const ROSEALLEY: Record<string, Layer> = {
  saplings: (d) =>
    `<rect x="14" y="196" width="200" height="30" rx="4" fill="#7a5a3a" ${O}/>` + (d ? bushRow(194, 5, 36, 40, 0.75, true) : dustPile(110, 210)),
  sprinklers: (d) =>
    `<rect x="230" y="160" width="110" height="12" rx="3" fill="url(#gWood)" ${O}/><path d="M238 172 V200 M332 172 V200" ${O} stroke-width="4"/>` +
    (d ? [256, 286].map((x) => `<path d="M${x - 8} 160 V146 Q${x} 132 ${x + 8} 146 V160 Z" fill="url(#gSilver)" ${O}/><path d="M${x} 132 V120" ${O} stroke-width="2.4"/><circle cx="${x}" cy="118" r="3" fill="url(#gSilver)" ${THIN} stroke-width=".8"/>`).join('') : ''),
  bottle: (d) => (d ? item(4, 318, 162, 0.36) + `<path d="M300 162 H338" stroke="#c9a26b" stroke-width="2"/>` : ''),
  bench: (d) =>
    d ? `<rect x="104" y="160" width="100" height="10" rx="3" fill="url(#gWood)" ${O}/><path d="M114 170 V194 M194 170 V194" ${O} stroke-width="4"/><rect x="104" y="140" width="100" height="8" rx="3" fill="url(#gWoodDark)" ${THIN}/><path d="M110 148 V160 M198 148 V160" ${O} stroke-width="3"/>`
      : plank(110, 186, 90, 6),
  sign: (d) =>
    d ? `<path d="M40 196 V120" stroke="#6b4a2a" stroke-width="4"/><rect x="12" y="96" width="70" height="28" rx="4" fill="url(#gRoseDeep)" ${O}/>` + text(47, 115, 'باغ گلاب', 12, '#fff6d0') + sparkle(86, 92, 5)
      : `<path d="M40 196 V150" stroke="#6b4a2a" stroke-width="4"/>`,
};

export const SCENES19: Record<string, SceneDef> = {
  rosegarden: { base: dawnBase(), order: ['stream', 'bushes', 'shade', 'tea', 'baskets'], layers: ROSEGARDEN },
  distillery: { base: workshopBase(), order: ['fire', 'pots', 'pipes', 'pool', 'carboys'], layers: DISTILLERY },
  guesthouse: { base: innBase(), order: ['iwan', 'orosi', 'pool', 'takht', 'ledger'], layers: GUESTHOUSE },
  rosefest: { base: villageBase(), order: ['arch', 'stalls', 'bottles', 'music', 'sweets'], layers: ROSEFEST },
  rosealley: { base: alleyBase(), order: ['saplings', 'sprinklers', 'bottle', 'bench', 'sign'], layers: ROSEALLEY },
};
