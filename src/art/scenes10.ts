// Season 10 («اصفهان») place scenes. Same contract as scenes.ts: each task layer is drawn
// "before" until done, then "after".

import { INK, O, THIN, sparkle } from './kit';
import { Layer, SceneDef, cobweb, dustPile, floor, geranium, glow, lantern, plank, stringLights } from './scenes';
import { darkness, text, wall } from './scenes3';

/** A pointed arch path from x0 to x1, springing at y and peaking at top. */
const pointed = (x0: number, x1: number, y: number, top: number, bottom: number) => {
  const m = (x0 + x1) / 2;
  return `M${x0} ${bottom} V${y} Q${x0} ${top + (y - top) * 0.25} ${m} ${top} Q${x1} ${top + (y - top) * 0.25} ${x1} ${y} V${bottom} Z`;
};

const dome = (x: number, base: number, r: number, fill: string) =>
  `<path d="M${x - r} ${base} C${x - r} ${base - r * 1.5} ${x + r} ${base - r * 1.5} ${x + r} ${base} Z" fill="${fill}" ${O}/>` +
  `<path d="M${x - r * 0.6} ${base - r * 0.3} Q${x} ${base - r * 1.2} ${x + r * 0.6} ${base - r * 0.3}" fill="none" stroke="#f6c945" stroke-width="1.6"/>` +
  `<path d="M${x} ${base - r * 1.12} V${base - r * 1.4}" ${O} stroke-width="2"/><circle cx="${x}" cy="${base - r * 1.45}" r="2.4" fill="url(#gGold)" ${THIN}/>`;

// ------------------------------------------------------------------ خونه‌ی صفوی

const SAFAVID: Record<string, Layer> = {
  iwan: (d) =>
    `<rect x="100" y="20" width="160" height="140" fill="${d ? 'url(#gCream)' : '#a9a196'}" ${O}/>` +
    `<path d="${pointed(126, 234, 70, 30, 160)}" fill="${d ? 'url(#gTurq)' : '#7a7a6a'}" ${O}/>` +
    (d ? Array.from({ length: 4 }, (_, r) => Array.from({ length: 6 - r }, (_, i) => `<path d="M${140 + r * 9 + i * 16} ${54 + r * 12} q8 -10 16 0" fill="#fffdf6" ${THIN} stroke-width="1"/>`).join('')).join('') +
        `<rect x="104" y="24" width="152" height="8" fill="url(#gBlue)" ${THIN}/>`
      : `<path d="M150 60 l14 26 l-6 18 M220 50 l-14 22" stroke="${INK}" stroke-width="2" opacity=".6"/>` + cobweb(126, 70, 0.6)),
  pool: (d) =>
    `<rect x="120" y="188" width="120" height="30" rx="4" fill="url(#gTurq)" ${O}/><rect x="128" y="193" width="104" height="20" rx="3" fill="${d ? '#7fd6e6' : '#6a5a3a'}" ${THIN}/>` +
    (d ? `<path d="M150 203 q10 -4 20 0 M190 200 q10 -4 20 0" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/>` : dustPile(180, 204)),
  garden: (d) =>
    [[20, 180], [270, 180]].map(([x, y]) => `<rect x="${x}" y="${y}" width="70" height="40" fill="url(#gSoil)" ${O}/>` +
      (d ? Array.from({ length: 6 }, (_, i) => `<circle cx="${x + 8 + i * 11}" cy="${y + 14 + (i % 2) * 8}" r="5" fill="${['#e0303f', '#f6c945', '#ff7a9c'][i % 3]}" ${THIN} stroke-width=".8"/>`).join('') +
          `<path d="M${x + 35} ${y} V${y - 40}" stroke="#6a4a2a" stroke-width="4"/><circle cx="${x + 35}" cy="${y - 50}" r="16" fill="url(#gLeaf)" ${O}/>`
        : dustPile(x + 35, y + 20))).join(''),
  doors: (d) =>
    [[44, 100], [292, 100]].map(([x, y]) => `<rect x="${x - 22}" y="${y}" width="44" height="70" rx="4" fill="${d ? 'url(#gWoodDark)' : '#6b5a4a'}" ${O}/>` +
      (d ? [0, 1, 2].map((r) => [0, 1].map((c) => `<path d="M${x - 11 + c * 22} ${y + 14 + r * 20} l7 7 l-7 7 l-7 -7 Z" fill="url(#gTurq)" ${THIN} stroke-width="1"/>`).join('')).join('')
        : plank(x - 26, y + 26, 52, 10))).join(''),
  lights: (d) => (d ? lantern(150, 34) + lantern(210, 34) + glow(180, 110, 90, 0.3) + sparkle(70, 40, 5) + sparkle(300, 46, 5) : darkness(0.32)),
};

// ------------------------------------------------------------------ سی‌وسه‌پل (night)

const SIOSEPOL: Record<string, Layer> = {
  river: (d) =>
    `<rect y="150" width="360" height="90" fill="${d ? '#1d4e7a' : '#5a4a3a'}"/>` +
    (d ? Array.from({ length: 6 }, (_, i) => `<path d="M${20 + i * 56} ${176 + (i % 2) * 18} q12 -4 24 0" fill="none" stroke="#7fd6e6" stroke-width="1.6" opacity=".6"/>`).join('')
      : dustPile(80, 190) + dustPile(260, 210)),
  arches: (d) =>
    `<rect x="0" y="80" width="360" height="74" fill="${d ? '#d9a873' : '#8a7a6a'}" ${O}/>` +
    Array.from({ length: 9 }, (_, i) => `<path d="${pointed(8 + i * 40, 36 + i * 40, 120, 96, 154)}" fill="#1f2a55" ${THIN}/>`).join('') +
    Array.from({ length: 9 }, (_, i) => `<path d="${pointed(14 + i * 40, 30 + i * 40, 98, 86, 108)}" fill="#1f2a55" ${THIN} stroke-width="1"/>`).join('') +
    (d ? '' : `<path d="M60 84 l10 20 M250 90 l-12 16" stroke="${INK}" stroke-width="1.6" opacity=".6"/>`),
  lights: (d) =>
    d
      ? Array.from({ length: 9 }, (_, i) => `<path d="${pointed(8 + i * 40, 36 + i * 40, 120, 96, 154)}" fill="#ffd36b" opacity=".75"/>` + `<path d="M${22 + i * 40} 156 V196" stroke="#ffd36b" stroke-width="10" opacity=".25"/>`).join('') + glow(180, 120, 160, 0.25)
      : darkness(0.3),
  boat: (d) =>
    d
      ? `<g transform="translate(260 200)"><path d="M-26 0 Q0 14 26 0 Z" fill="#fffdf6" ${O}/><path d="M14 -2 C14 -22 26 -28 30 -20 C24 -20 20 -14 22 -2" fill="#fffdf6" ${O}/><circle cx="28" cy="-22" r="1.6" fill="${INK}"/></g>` +
        `<g transform="translate(90 214)"><path d="M-22 0 Q0 12 22 0 Z" fill="url(#gRed)" ${O}/></g>`
      : '',
  song: (d) =>
    d
      ? [[100, 130], [260, 126], [180, 110]].map(([x, y], i) => `<path d="M${x} ${y} v-14 l10 -3 v14" fill="none" stroke="#fff6c8" stroke-width="2"/><circle cx="${x - 2}" cy="${y}" r="3" fill="#fff6c8"/><circle cx="${x + 8}" cy="${y - 3}" r="3" fill="#fff6c8"/>` + (i === 2 ? sparkle(x + 20, y - 20, 5, '#fff6c8') : '')).join('')
      : '',
};

const siosepolBase = () =>
  `<rect width="360" height="160" fill="#1f2a55"/>` + Array.from({ length: 24 }, (_, i) => `<circle cx="${(i * 83) % 356 + 2}" cy="${(i * 37) % 70 + 4}" r="${1 + (i % 3) * 0.4}" fill="#fff6c8" opacity=".9"/>`).join('') +
  `<path d="M318 30 a14 14 0 1 1 -9 -23 a11 11 0 1 0 9 23 Z" fill="#fff6c8"/>`;

// ------------------------------------------------------------------ میدان نقش جهان

const NAQSH: Record<string, Layer> = {
  domes: (d) =>
    dome(90, 92, 40, d ? 'url(#gTurq)' : '#8a8a8a') + dome(270, 96, 32, d ? '#e9c98a' : '#8a8a8a') +
    `<path d="M50 92 H130 V120 H50 Z M238 96 H302 V120 H238 Z" fill="${d ? 'url(#gBlue)' : '#7a7a7a'}" ${O}/>` +
    (d ? `<path d="M206 120 V40" stroke="#e9c98a" stroke-width="8"/><path d="M206 120 V40" ${THIN} stroke-width="1"/><path d="M200 40 H212 L206 30 Z" fill="url(#gTurq)" ${THIN}/>` : ''),
  arcade: (d) =>
    `<rect x="0" y="120" width="360" height="56" fill="${d ? '#e9c98a' : '#9a8a72'}" ${O}/>` +
    Array.from({ length: 12 }, (_, i) => `<path d="${pointed(6 + i * 30, 26 + i * 30, 160, 146, 176)}" fill="${d ? '#3b2a20' : '#5a4a3e'}" ${THIN} stroke-width="1"/><path d="${pointed(8 + i * 30, 24 + i * 30, 136, 126, 142)}" fill="${d ? '#3b2a20' : '#5a4a3e'}" ${THIN} stroke-width="1"/>`).join(''),
  pool: (d) =>
    `<rect x="110" y="192" width="140" height="28" rx="6" fill="url(#gTurq)" ${O}/><rect x="118" y="197" width="124" height="18" rx="4" fill="${d ? '#7fd6e6' : '#6a5a3a'}" ${THIN}/>` +
    (d ? [150, 180, 210].map((x) => `<path class="steam" d="M${x} 200 V184 M${x} 186 q-6 0 -8 8 M${x} 186 q6 0 8 8" fill="none" stroke="#e8f8ff" stroke-width="2" stroke-linecap="round"/>`).join('') : ''),
  carriage: (d) =>
    d
      ? `<g transform="translate(50 212)"><rect x="-4" y="-26" width="38" height="20" rx="4" fill="url(#gRed)" ${O}/><path d="M-4 -26 Q15 -40 34 -26" fill="url(#gGold)" ${THIN}/>` +
        `<circle cx="4" cy="-2" r="8" fill="none" ${O} stroke-width="2.4"/><circle cx="28" cy="-2" r="8" fill="none" ${O} stroke-width="2.4"/>` +
        `<path d="M-4 -12 H-22" ${O} stroke-width="2"/><path d="M-30 -2 V-18 Q-28 -28 -20 -26 L-16 -14 V-2" fill="#fffdf6" ${O}/></g>`
      : '',
  lanterns: (d) => (d ? stringLights(110, ['#ffd36b', '#5fe0e0']) + sparkle(160, 20, 6) + sparkle(320, 30, 5) : darkness(0.3)),
};

// ------------------------------------------------------------------ کارگاه هنرهای اصفهان

const WORKSHOP: Record<string, Layer> = {
  window: (d) =>
    `<rect x="230" y="30" width="110" height="90" rx="4" fill="url(#gWoodDark)" ${O}/>` +
    (d ? `<rect x="238" y="38" width="94" height="74" fill="url(#gSky)" ${THIN}/>` + dome(285, 112, 20, 'url(#gTurq)') + `<path d="M285 38 V112 M238 74 H332" stroke="${INK}" stroke-width="2"/>` + glow(285, 76, 50, 0.3)
      : `<rect x="238" y="38" width="94" height="74" fill="#5a5a60" ${THIN}/>` + cobweb(238, 38, 0.6)),
  easels: (d) =>
    [[60, 'url(#gTurq)'], [150, 'url(#gRose)']].map(([x, c]) => `<path d="M${Number(x) - 20} 220 L${x} 120 L${Number(x) + 20} 220 M${x} 120 V220" fill="none" stroke="#8b5328" stroke-width="3.4" stroke-linecap="round"/>` +
      (d ? `<rect x="${Number(x) - 24}" y="128" width="48" height="40" fill="#fffdf6" ${O}/><rect x="${Number(x) - 20}" y="132" width="40" height="32" fill="none" stroke="#f6c945" stroke-width="1.6"/>` +
          `<path d="M${Number(x) - 12} 158 q6 -14 12 -4 q6 -14 12 4" fill="${c}" ${THIN} stroke-width="1"/><circle cx="${Number(x) + 8}" cy="${140}" r="4" fill="#f6c945"/>`
        : '')).join(''),
  mina: (d) =>
    `<rect x="190" y="176" width="140" height="10" rx="2" fill="url(#gWood)" ${O}/><path d="M198 186 V230 M322 186 V230" ${O} stroke-width="4"/>` +
    (d ? `<ellipse cx="220" cy="170" rx="16" ry="6" fill="url(#gBlue)" ${O}/><ellipse cx="220" cy="169" rx="9" ry="3" fill="#fffdf6" opacity=".7"/>` +
        `<path d="M246 176 Q250 156 262 156 Q274 156 278 176 Z" fill="url(#gTurq)" ${O}/><path d="M252 166 q10 -6 20 0" fill="none" stroke="#f6c945" stroke-width="1.6"/>` : ''),
  ghalam: (d) =>
    d
      ? `<ellipse cx="306" cy="172" rx="18" ry="6" fill="url(#gCopper)" ${O}/><path d="M294 172 q12 -6 24 0" fill="none" stroke="#7a3a1a" stroke-width="1.2"/>` +
        `<path d="M300 160 L316 140" stroke="url(#gSteel)" stroke-width="3" stroke-linecap="round"/>`
      : '',
  khatam: (d) =>
    d
      ? `<rect x="100" y="196" width="46" height="26" rx="3" fill="url(#gWoodDark)" ${O}/>` +
        Array.from({ length: 10 }, (_, i) => `<path d="M${104 + (i % 5) * 8} ${200 + Math.floor(i / 5) * 10} l4 4 l-4 4 l-4 -4 Z" fill="${i % 2 ? '#fffdf6' : '#f6c945'}" stroke="${INK}" stroke-width=".5"/>`).join('') + sparkle(150, 190, 5)
      : dustPile(120, 214),
};

// ------------------------------------------------------------------ مدرسه‌ی مرمت

const RESTOSCHOOL: Record<string, Layer> = {
  board: (d) =>
    `<rect x="90" y="30" width="180" height="90" rx="4" fill="${d ? '#2f5a3a' : '#4a4a4a'}" ${O}/><rect x="84" y="118" width="192" height="8" rx="2" fill="url(#gWood)" ${THIN}/>` +
    (d ? text(180, 60, 'درس اول', 14, '#fffdf6') + `<path d="${pointed(150, 210, 100, 70, 112)}" fill="none" stroke="#fffdf6" stroke-width="2"/><path d="M130 112 H230" stroke="#fffdf6" stroke-width="2"/>`
      : `<path d="M100 40 L260 110" stroke="#6a6a6a" stroke-width="2"/>`),
  desks: (d) =>
    [[40, 176], [140, 176], [240, 176], [90, 206], [190, 206]].map(([x, y]) =>
      d ? `<rect x="${x}" y="${y}" width="80" height="8" rx="2" fill="url(#gWood)" ${O}/><path d="M${x + 6} ${y + 8} V${y + 24} M${x + 74} ${y + 8} V${y + 24}" ${O} stroke-width="3"/>`
        : plank(x, y + 8, 70, (x % 3) * 6 - 6)).join(''),
  tools: (d) =>
    `<rect x="300" y="60" width="50" height="110" fill="url(#gWoodDark)" ${O}/><path d="M300 96 H350 M300 132 H350" ${THIN}/>` +
    (d ? `<path d="M310 90 L322 70 M330 90 L336 66 M310 126 h30 M316 120 v-14 M334 120 l6 -14" stroke="url(#gSteel)" stroke-width="3" stroke-linecap="round"/>` +
        `<rect x="308" y="140" width="34" height="24" rx="3" fill="url(#gRed)" ${THIN}/>`
      : dustPile(325, 160)),
  model: (d) =>
    d
      ? `<rect x="20" y="120" width="60" height="40" fill="url(#gCream)" ${O}/><path d="${pointed(36, 64, 136, 124, 160)}" fill="url(#gTurq)" ${THIN}/>` + dome(50, 120, 12, 'url(#gTurq)')
      : `<rect x="20" y="134" width="60" height="26" fill="#c9a26b" ${O}/>`,
  ribbon: (d) =>
    d
      ? `<path d="M0 150 Q90 164 180 150 T360 150" fill="none" stroke="#e0303f" stroke-width="5"/><path d="M180 150 l-14 -9 v18 Z M180 150 l14 -9 v18 Z" fill="url(#gRed)" ${THIN}/>` +
        geranium(16, 236, 0.6) + geranium(344, 236, 0.6) + sparkle(60, 20, 6) + sparkle(300, 24, 6)
      : darkness(0.28),
};

export const SCENES10: Record<string, SceneDef> = {
  safavid: { base: `<rect width="360" height="170" fill="url(#gSky)"/>` + floor('#d6c3a0', 170), order: ['iwan', 'garden', 'pool', 'doors', 'lights'], layers: SAFAVID },
  siosepol: { base: siosepolBase(), order: ['river', 'arches', 'lights', 'boat', 'song'], layers: SIOSEPOL },
  naqshejahan: { base: `<rect width="360" height="176" fill="url(#gSky)"/>` + floor('#d6c3a0', 176), order: ['domes', 'arcade', 'pool', 'carriage', 'lanterns'], layers: NAQSH },
  workshop: { base: wall('#efe3cc') + floor('#a5703e'), order: ['window', 'easels', 'mina', 'ghalam', 'khatam'], layers: WORKSHOP },
  restoschool: { base: wall('#f2e8d0') + floor('#b98652'), order: ['board', 'tools', 'model', 'desks', 'ribbon'], layers: RESTOSCHOOL },
};
