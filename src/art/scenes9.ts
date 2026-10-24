// Season 9 («سفر شمال») place scenes. Same contract as scenes.ts: each task layer is drawn
// "before" until done, then "after".

import { INK, O, THIN, sparkle } from './kit';
import { Layer, SceneDef, floor, geranium, glow, lantern, plank, stringLights } from './scenes';
import { darkness, text } from './scenes3';

const leafy = (x: number, y: number, r: number, fill = 'url(#gLeaf)') =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${O}/><circle cx="${x - r * 0.4}" cy="${y + r * 0.2}" r="${r * 0.55}" fill="url(#gLeafDark)" opacity=".6"/>`;

const sea = (y: number) =>
  `<rect y="${y}" width="360" height="${240 - y}" fill="url(#gWater)"/>` +
  Array.from({ length: 8 }, (_, i) => `<path d="M${(i * 53) % 330} ${y + 8 + (i * 11) % 30} q10 -5 20 0 t20 0" fill="none" stroke="#fff" stroke-width="1.6" opacity=".7"/>`).join('');

// ------------------------------------------------------------------ ایستگاه قطار

const STATION: Record<string, Layer> = {
  benches: (d) =>
    [[30, 186], [250, 186]].map(([x, y]) =>
      d
        ? `<rect x="${x}" y="${y}" width="80" height="7" rx="2" fill="url(#gWood)" ${O}/><rect x="${x}" y="${y - 16}" width="80" height="7" rx="2" fill="url(#gWood)" ${O}/>` +
          `<path d="M${x + 6} ${y + 7} V${y + 24} M${x + 74} ${y + 7} V${y + 24}" ${O} stroke-width="3"/>`
        : plank(x, y + 10, 70, 8)).join(''),
  clock: (d) =>
    `<path d="M180 0 V24" ${THIN}/>` + `<circle cx="180" cy="44" r="20" fill="${d ? '#fffdf6' : '#9a9a9a'}" ${O}/>` +
    (d ? `<path d="M180 44 V32 M180 44 L189 48" ${O} stroke-width="2.4"/>` + Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<circle cx="${180 + Math.sin(a) * 15}" cy="${44 - Math.cos(a) * 15}" r="1.2" fill="${INK}"/>`; }).join('')
      : `<path d="M168 36 L192 52" stroke="${INK}" stroke-width="1.6"/>`),
  booth: (d) =>
    `<rect x="140" y="100" width="80" height="70" fill="${d ? 'url(#gWood)' : '#7a6a5a'}" ${O}/>` +
    (d ? `<rect x="150" y="110" width="60" height="30" fill="url(#gGlass)" ${THIN}/><rect x="146" y="88" width="68" height="14" rx="3" fill="url(#gNavy)" ${THIN}/>` + text(180, 99, 'بلیط', 9, '#ffe08a')
      : plank(136, 120, 88, 10)),
  luggage: (d) =>
    d
      ? [[120, 206, 26, 22, 'url(#gRed)'], [150, 200, 30, 28, 'url(#gBlue)'], [184, 208, 24, 20, '#c0782e'], [212, 196, 28, 32, 'url(#gLeaf)'], [244, 210, 22, 18, 'url(#gYellow)']].map(([x, y, w, h, c]) =>
          `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${c}" ${O}/><path d="M${Number(x) + Number(w) / 2 - 5} ${y} v-5 h10 v5" fill="none" ${THIN}/>`).join('')
      : '',
  lamps: (d) => (d ? lantern(60, 40) + lantern(300, 40) + glow(180, 150, 120, 0.2) + sparkle(340, 100, 5) : darkness(0.35)),
};

const stationBase = () =>
  `<rect width="360" height="170" fill="url(#gSky)"/>` +
  `<path d="M0 60 Q60 40 120 58 Q200 30 280 54 Q330 44 360 56 V100 H0 Z" fill="#7fae4a"/>` +
  // The canopy, the platform and the rails.
  `<rect x="0" y="70" width="360" height="12" fill="url(#gWoodDark)" ${O}/>` + [20, 120, 240, 340].map((x) => `<path d="M${x} 82 V170" ${O} stroke-width="5"/>`).join('') +
  `<rect y="170" width="360" height="40" fill="#b8a888"/><path d="M0 170 H360" ${O}/>` +
  `<rect y="210" width="360" height="30" fill="#7a6a5a"/>` + Array.from({ length: 12 }, (_, i) => `<rect x="${i * 32}" y="214" width="20" height="22" fill="#5a4a3a"/>`).join('') +
  `<path d="M0 220 H360 M0 232 H360" stroke="#9aa4ae" stroke-width="3"/>`;

// ------------------------------------------------------------------ ویلای کنار دریا

const SEAVILLA: Record<string, Layer> = {
  porch: (d) =>
    `<rect x="190" y="60" width="160" height="100" fill="${d ? '#f6e3b0' : '#9a8a72'}" ${O}/><path d="M180 60 L270 24 L360 60 Z" fill="${d ? 'url(#gTerracotta)' : '#6a5a4a'}" ${O}/>` +
    `<rect x="186" y="150" width="174" height="12" fill="${d ? 'url(#gWood)' : '#7a6a5a'}" ${O}/>` +
    (d ? [214, 266, 318].map((x) => `<rect x="${x - 14}" y="80" width="28" height="36" rx="3" fill="url(#gSky)" ${THIN}/><path d="M${x} 80 V116" ${THIN}/>`).join('') + [196, 242, 288, 334].map((x) => `<path d="M${x} 150 V122" ${O} stroke-width="3"/>`).join('')
      : `<path d="M210 90 l30 40 M300 80 l-20 40" stroke="${INK}" stroke-width="1.6" opacity=".5"/>`),
  hammock: (d) =>
    `<path d="M30 170 V70" ${O} stroke="#6a4a2a" stroke-width="7"/><path d="M150 170 V80" ${O} stroke="#6a4a2a" stroke-width="7"/>` + leafy(30, 60, 26) + leafy(150, 70, 24) +
    (d ? `<path d="M34 110 Q90 150 146 114" fill="none" stroke="#e0303f" stroke-width="7"/><path d="M34 110 Q90 150 146 114" fill="none" stroke="#f6c945" stroke-width="2" stroke-dasharray="6 6"/>` : ''),
  grill: (d) =>
    d
      ? `<rect x="190" y="182" width="56" height="16" fill="#3b3b44" ${O}/><path d="M196 198 V214 M240 198 V214" ${O} stroke-width="3"/>` +
        [198, 210, 222, 234].map((x) => `<path d="M${x - 4} 182 L${x + 10} 176" stroke="url(#gSilver)" stroke-width="2.4"/><circle cx="${x + 3}" cy="179" r="3" fill="#c0782e"/>`).join('') +
        `<path class="steam" d="M210 170 q-6 -8 0 -16 M226 170 q-6 -8 0 -16" fill="none" stroke="#d8d8d8" stroke-width="2.6" stroke-linecap="round" opacity=".7"/>` + glow(218, 190, 20, 0.6)
      : '',
  umbrellas: (d) =>
    d
      ? [[80, 196, '#e0303f'], [300, 200, '#14879a']].map(([x, y, c]) => `<path d="M${x} ${y} V${Number(y) - 40}" ${O} stroke-width="2"/><path d="M${Number(x) - 32} ${Number(y) - 40} Q${x} ${Number(y) - 72} ${Number(x) + 32} ${Number(y) - 40} Z" fill="${c}" ${O}/>` +
          `<path d="M${Number(x) - 16} ${Number(y) - 40} Q${x} ${Number(y) - 66} ${x} ${Number(y) - 40} M${Number(x) + 16} ${Number(y) - 40} Q${x} ${Number(y) - 66} ${x} ${Number(y) - 40}" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/>`).join('')
      : '',
  lights: (d) => (d ? stringLights(52, ['#ffd36b', '#ff7a9c', '#5fe0e0']) + sparkle(60, 20, 5) + sparkle(130, 34, 4) : darkness(0.3)),
};

const villaBase = () =>
  `<rect width="360" height="120" fill="url(#gSky)"/>` + sea(110) + `<path d="M0 160 Q120 150 360 166 V240 H0 Z" fill="#f2d8a0"/>` +
  `<circle cx="80" cy="34" r="16" fill="#ffe08a" opacity=".9"/>`;

// ------------------------------------------------------------------ شالیزار

const PADDY: Record<string, Layer> = {
  water: (d) =>
    [130, 160, 192].map((y, i) => `<path d="M0 ${y} H360 V${y + 28 + i * 2} H0 Z" fill="${d ? '#9fd0e8' : '#8a6a48'}" ${THIN}/>` +
      (d ? `<path d="M${40 + i * 90} ${y + 12} q10 -4 20 0" fill="none" stroke="#fff" stroke-width="1.4" opacity=".8"/>` : '')).join(''),
  seedlings: (d) =>
    d
      ? [130, 160, 192].map((y, r) => Array.from({ length: 18 }, (_, i) => `<path d="M${10 + i * 20 + (r % 2) * 10} ${y + 22} l-3 -12 m3 12 l3 -12 m-3 12 v-14" stroke="#3fae5a" stroke-width="1.8" stroke-linecap="round"/>`).join('')).join('')
      : '',
  kumeh: (d) =>
    `<rect x="250" y="84" width="80" height="46" fill="${d ? 'url(#gWood)' : '#6a5a4a'}" ${O}/>` +
    `<path d="M238 86 L290 50 L342 86 Z" fill="${d ? '#d8b860' : '#7a6a5a'}" ${O}/>` +
    (d ? Array.from({ length: 6 }, (_, i) => `<path d="M${248 + i * 16} ${84 - (i < 3 ? i * 8 : (5 - i) * 8)} l6 6" stroke="#a8883a" stroke-width="1.6"/>`).join('') + `<rect x="280" y="100" width="20" height="30" fill="#3b2a20" ${THIN}/>`
      : `<path d="M260 60 l20 20 M320 70 l-14 14" stroke="${INK}" stroke-width="1.6" opacity=".5"/>`),
  scarecrow: (d) =>
    d
      ? `<path d="M80 170 V100 M60 116 H100" ${O} stroke="#6a4a2a" stroke-width="4"/><circle cx="80" cy="94" r="10" fill="#f2d3a0" ${O}/>` +
        `<path d="M66 88 H94 L88 76 H72 Z" fill="#5a4a3a" ${O}/><path d="M70 110 L90 110 L94 140 L66 140 Z" fill="url(#gRed)" ${O}/><path d="M74 96 q6 4 12 0" fill="none" ${THIN}/>`
      : `<path d="M80 170 V130" stroke="#6a4a2a" stroke-width="4"/>`,
  sunset: (d) =>
    d
      ? `<circle cx="196" cy="44" r="20" fill="#ff9f43" opacity=".9"/>` + glow(196, 44, 50, 0.5) + `<rect width="360" height="240" fill="#ff9f43" opacity=".12"/>` +
        [[40, 40], [200, 30], [300, 50]].map(([x, y]) => `<path d="M${x} ${y} q5 -5 10 0 q5 -5 10 0" fill="none" stroke="${INK}" stroke-width="1.6"/>`).join('')
      : darkness(0.2),
};

const paddyBase = () =>
  `<rect width="360" height="132" fill="url(#gSky)"/>` +
  `<path d="M0 120 Q60 60 130 100 Q200 50 280 96 Q330 70 360 90 V132 H0 Z" fill="#2f7d3e"/>` + leafy(40, 104, 18, 'url(#gLeafDark)') + leafy(200, 108, 16, 'url(#gLeafDark)');

// ------------------------------------------------------------------ ماسوله (stepped village)

const houseRow = (y: number, xs: number[], lit: boolean, wins: boolean, flowers: boolean) =>
  xs.map((x) => `<rect x="${x}" y="${y}" width="60" height="40" fill="${lit ? '#e8c99a' : '#9a8a72'}" ${O}/>` +
    (wins ? [x + 14, x + 40].map((wx) => `<rect x="${wx - 6}" y="${y + 10}" width="14" height="18" fill="url(#gYellow)" ${THIN}/><path d="M${wx + 1} ${y + 10} V${y + 28}" stroke="${INK}" stroke-width="1"/>`).join('') : '') +
    (flowers ? [x + 14, x + 40].map((wx) => `<rect x="${wx - 7}" y="${y + 28}" width="16" height="5" fill="url(#gTerracotta)" ${THIN} stroke-width="1"/>` + [wx - 3, wx + 1, wx + 5].map((fx) => `<circle cx="${fx}" cy="${y + 27}" r="2.2" fill="#e0303f"/>`).join('')).join('') : '')).join('');

const MASULEH: Record<string, Layer> = {
  roofs: (d) => [[40, [10, 80, 150]], [80, [60, 130, 200, 270]], [120, [0, 100, 170, 240, 310]], [160, [40, 110, 180, 250]]].map(([y, xs]) =>
    (xs as number[]).map((x) => `<rect x="${x - 4}" y="${Number(y) - 6}" width="68" height="8" fill="${d ? '#c9a26b' : '#7a6a5a'}" ${THIN}/>`).join('')).join(''),
  windows: (d) => [[40, [10, 80, 150]], [80, [60, 130, 200, 270]], [120, [0, 100, 170, 240, 310]], [160, [40, 110, 180, 250]]].map(([y, xs]) => houseRow(Number(y), xs as number[], d, d, false)).join(''),
  flowers: (d) => (d ? [[80, [60, 130, 200, 270]], [120, [0, 100, 170, 240, 310]]].map(([y, xs]) => houseRow(Number(y), xs as number[], true, true, true)).join('') : ''),
  teahouse: (d) =>
    d
      ? `<rect x="140" y="196" width="80" height="40" fill="url(#gWood)" ${O}/><rect x="136" y="188" width="88" height="10" rx="2" fill="url(#gWoodDark)" ${O}/>` +
        text(180, 196, 'چای‌خونه', 8, '#ffe08a') + `<path class="steam" d="M200 184 q-5 -8 0 -14" fill="none" stroke="#fff" stroke-width="2" opacity=".7"/>` + geranium(130, 236, 0.6) + geranium(230, 236, 0.6)
      : plank(140, 220, 80, 6),
  lanterns: (d) =>
    d
      ? [[50, 78], [160, 118], [270, 78], [330, 158]].map(([x, y]) => `<rect x="${x - 4}" y="${y - 10}" width="8" height="10" rx="2" fill="#ffe08a" ${THIN} stroke-width="1"/>` + glow(x, y - 5, 18, 0.7)).join('') +
        `<rect width="360" height="240" fill="#fffdf6" opacity=".18"/>`
      : `<rect width="360" height="240" fill="#e8e8e8" opacity=".35"/>`,
};

const masulehBase = () =>
  `<rect width="360" height="240" fill="#a8c4d0"/><path d="M0 70 Q90 0 180 50 Q270 0 360 60 V240 H0 Z" fill="#3f6a4a"/>` + floor('#9a8a72', 210);

// ------------------------------------------------------------------ سیزده‌به‌در

const kite = (x: number, y: number, a: string, b: string) =>
  `<path d="M${x} ${y - 16} L${x + 12} ${y} L${x} ${y + 16} L${x - 12} ${y} Z" fill="${a}" ${O}/><path d="M${x} ${y - 16} V${y + 16} M${x - 12} ${y} H${x + 12}" stroke="${b}" stroke-width="1.4"/>` +
  `<path d="M${x} ${y + 16} q6 10 0 20 q-6 10 0 20" fill="none" stroke="${INK}" stroke-width="1.2"/>`;

const SIZDAH: Record<string, Layer> = {
  sofreh: (d) =>
    d
      ? `<path d="M90 236 L120 186 L240 186 L270 236 Z" fill="url(#gCarpet)" ${O}/><path d="M104 230 L126 192 H234 L256 230 Z" fill="#fffdf6" ${THIN}/>` +
        [[150, 206], [210, 206]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="16" ry="5" fill="url(#gCream)" ${THIN}/><ellipse cx="${x}" cy="${y - 2}" rx="11" ry="3" fill="${x < 180 ? '#e9b949' : '#7a8a3a'}"/>`).join('')
      : // Litter the neighbours clear before they sit down.
        [[120, 210, 20], [200, 222, -30], [270, 200, 60]].map(([x, y, r]) => `<g transform="rotate(${r} ${x} ${y})"><rect x="${Number(x) - 4}" y="${Number(y) - 10}" width="8" height="18" rx="2" fill="#bfe9ff" ${THIN} stroke-width="1"/><rect x="${Number(x) - 2}" y="${Number(y) - 13}" width="4" height="4" fill="#3a76c4"/></g>`).join('') +
        `<path d="M160 196 l14 -4 l4 10 l-12 4 Z" fill="#e8e8e8" ${THIN} stroke-width="1"/><ellipse cx="230" cy="214" rx="16" ry="5" fill="#9b8a76" opacity=".6"/>`,
  kites: (d) => (d ? kite(80, 50, 'url(#gRed)', '#fff') + kite(250, 36, 'url(#gTurq)', '#fff') + kite(310, 70, 'url(#gYellow)', '#e0303f') : ''),
  lettuce: (d) =>
    d
      ? `<ellipse cx="180" cy="220" rx="18" ry="6" fill="url(#gTurq)" ${THIN}/>` + [-8, 0, 8].map((dx) => `<path d="M${180 + dx} 218 q-6 -14 0 -22 q6 8 0 22 Z" fill="url(#gLeaf)" ${THIN} stroke-width="1"/>`).join('') +
        `<path d="M196 222 L200 204 L210 204 L214 222 Z" fill="url(#gGlass)" ${THIN}/><rect x="200" y="210" width="12" height="10" fill="#e9b949" opacity=".8"/>`
      : '',
  sabzeh: (d) =>
    d
      ? `<g transform="translate(60 150)"><ellipse cx="0" cy="0" rx="14" ry="5" fill="#c9a26b" ${THIN}/>` + [-8, -4, 0, 4, 8].map((dx) => `<path d="M${dx} -2 V-16" stroke="#3fae5a" stroke-width="2.4"/>`).join('') +
        `<path d="M-4 -12 Q0 -18 4 -12" fill="none" stroke="#e0303f" stroke-width="2"/></g>` + `<path d="M40 160 q10 -4 20 0 q10 4 20 0" fill="none" stroke="#fff" stroke-width="2"/>` + sparkle(90, 140, 5)
      : '',
  photo: (d) =>
    d
      ? `<path d="M300 236 L312 196 L324 236 M312 196 V236" ${O} stroke-width="2.4"/><rect x="298" y="180" width="30" height="18" rx="3" fill="#333" ${O}/><circle cx="313" cy="189" r="5" fill="url(#gSky)" ${THIN}/>` +
        glow(306, 172, 26, 0.8) + sparkle(306, 168, 7, '#fff') + sparkle(180, 120, 6)
      : darkness(0.18),
};

export const SCENES9: Record<string, SceneDef> = {
  station: { base: stationBase(), order: ['booth', 'clock', 'benches', 'luggage', 'lamps'], layers: STATION },
  seavilla: { base: villaBase(), order: ['porch', 'hammock', 'umbrellas', 'grill', 'lights'], layers: SEAVILLA },
  paddy: { base: paddyBase(), order: ['water', 'seedlings', 'kumeh', 'scarecrow', 'sunset'], layers: PADDY },
  masuleh: { base: masulehBase(), order: ['roofs', 'windows', 'flowers', 'teahouse', 'lanterns'], layers: MASULEH },
  sizdah: { base: `<rect width="360" height="130" fill="url(#gSky)"/>` + sea(120) + `<path d="M0 170 Q120 158 360 176 V240 H0 Z" fill="#f2d8a0"/>`, order: ['sofreh', 'kites', 'lettuce', 'sabzeh', 'photo'], layers: SIZDAH },
};

