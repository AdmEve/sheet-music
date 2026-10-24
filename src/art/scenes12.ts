// Season 12 («تولد ننه‌گلاب») place scenes. Same contract as scenes.ts: each task layer is drawn
// "before" until done, then "after".

import { INK, O, THIN, samovar, sparkle } from './kit';
import { Layer, SceneDef, cobweb, dustPile, floor, geranium, glow, lantern, plank, stringLights } from './scenes';
import { darkness, text, wall } from './scenes3';

const frame = (x: number, y: number, w: number, h: number, inner: string) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="url(#gGold)" ${O}/><rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" fill="#e8d3a8" ${THIN}/>` + inner;

/** A woman in a headscarf, in sepia, for old photographs. */
const sepiaLady = (cx: number, base: number, s: number) =>
  `<g transform="translate(${cx} ${base}) scale(${s})"><path d="M-12 0 C-12 -18 12 -18 12 0 Z" fill="#8a6a48"/>` +
  `<path d="M-11 -18 C-13 -34 13 -34 11 -18 C13 -10 7 -6 0 -6 C-7 -6 -13 -10 -11 -18 Z" fill="#8a6a48"/><circle cx="0" cy="-20" r="6.5" fill="#e8c8a0"/></g>`;

const cake = (x: number, base: number, s: number, candles: number) =>
  `<g transform="translate(${x} ${base}) scale(${s})">` +
  `<ellipse cx="0" cy="0" rx="40" ry="6" fill="url(#gSilver)" ${O}/>` +
  [[36, 22], [28, 20], [20, 18]].map(([w, h], i) => { const y = -h - [0, 22, 42][i]; return `<rect x="${-w}" y="${y}" width="${w * 2}" height="${h}" rx="4" fill="#fffdf6" ${O}/><path d="M${-w} ${y + 6} q${w / 4} 6 ${w / 2} 0 t${w / 2} 0 t${w / 2} 0 t${w / 2} 0" fill="none" stroke="#ff9ec4" stroke-width="2.4"/>`; }).join('') +
  Array.from({ length: candles }, (_, i) => { const cx = -12 + i * (24 / Math.max(1, candles - 1)); return `<rect x="${cx - 1.6}" y="-72" width="3.2" height="12" fill="${['#e0303f', '#3a76c4', '#f6c945'][i % 3]}" ${THIN} stroke-width=".6"/><path d="M${cx} -80 q3 4 0 7 q-3 -3 0 -7 Z" fill="url(#gFire)"/>`; }).join('') +
  [-24, 0, 24].map((dx) => `<circle cx="${dx}" cy="-30" r="3" fill="url(#gRose)" ${THIN} stroke-width=".6"/>`).join('') + `</g>`;

// ------------------------------------------------------------------ خونه‌ی خاله مهین

const MAHINHOME: Record<string, Layer> = {
  papers: (d) =>
    d
      ? `<rect x="16" y="60" width="90" height="110" fill="url(#gWoodDark)" ${O}/>` + [84, 112, 140].map((y) => `<path d="M16 ${y} H106" ${THIN}/>` +
          Array.from({ length: 6 }, (_, i) => `<rect x="${22 + i * 14}" y="${y - 22}" width="10" height="20" fill="${['#f2e6cc', '#e8dcc6', '#fffdf6'][i % 3]}" ${THIN} stroke-width=".8"/>`).join('')).join('')
      : [[30, 200], [60, 210], [90, 196], [130, 214], [250, 206]].map(([x, y]) => `<rect x="${x - 18}" y="${y - 20}" width="36" height="26" fill="#e8dcc6" ${THIN} transform="rotate(${(x % 7) * 3 - 9} ${x} ${y})"/>`).join('') + cobweb(360, 0, 1, true),
  radio: (d) =>
    `<rect x="130" y="110" width="70" height="44" rx="8" fill="${d ? 'url(#gWood)' : '#6b5a4a'}" ${O}/>` +
    (d ? `<rect x="138" y="118" width="34" height="28" rx="4" fill="#e8d3a8" ${THIN}/><path d="M142 124 h26 M142 130 h26 M142 136 h26" stroke="#9b8a76" stroke-width="1.4"/>` +
        `<circle cx="186" cy="124" r="5" fill="url(#gBrass)" ${THIN}/><circle cx="186" cy="140" r="5" fill="url(#gBrass)" ${THIN}/>` + glow(165, 132, 30, 0.3)
      : `<path d="M140 120 l20 26" stroke="${INK}" stroke-width="1.4" opacity=".5"/>`),
  sofa: (d) =>
    d
      ? `<rect x="210" y="160" width="130" height="40" rx="10" fill="url(#gPurple)" ${O}/><rect x="216" y="136" width="118" height="30" rx="10" fill="url(#gPurple)" ${O}/>` +
        `<path d="M214 206 V220 M336 206 V220" ${O} stroke-width="4"/>` + [236, 274, 312].map((x) => `<rect x="${x - 12}" y="146" width="24" height="18" rx="6" fill="url(#gYellow)" ${THIN}/>`).join('')
      : `<rect x="210" y="170" width="130" height="34" rx="6" fill="#7a6a7a" ${O}/>` + plank(220, 160, 100, -6),
  albums: (d) =>
    d
      ? [[150, 190, 'url(#gRed)'], [176, 186, 'url(#gNavy)'], [164, 178, 'url(#gLeaf)']].map(([x, y, c]) => `<rect x="${Number(x) - 16}" y="${Number(y) - 10}" width="32" height="12" rx="2" fill="${c}" ${O}/>`).join('') +
        frame(60, 20, 46, 34, sepiaLady(83, 48, 0.7))
      : '',
  board: (d) =>
    d
      ? `<rect x="230" y="30" width="110" height="80" rx="3" fill="#c9a26b" ${O}/>` +
        [[240, 40, '#fff6a8'], [276, 46, '#ffd0dc'], [306, 40, '#c8e6c9'], [250, 76, '#c8d8ff'], [290, 80, '#fff6a8']].map(([x, y, c]) => `<rect x="${x}" y="${y}" width="26" height="20" fill="${c}" ${THIN} stroke-width=".8"/><circle cx="${Number(x) + 13}" cy="${y}" r="2" fill="#e0303f"/>`).join('') +
        `<path d="M266 52 L280 60 M302 56 L280 86" stroke="#e0303f" stroke-width="1.2" stroke-dasharray="3 2"/>` + sparkle(222, 30, 5)
      : '',
};

// ------------------------------------------------------------------ کیک‌پزی اوستا رضا

const CAKEROOM: Record<string, Layer> = {
  oven: (d) =>
    `<rect x="240" y="70" width="100" height="100" rx="6" fill="${d ? 'url(#gSteel)' : '#6a6a70'}" ${O}/><rect x="252" y="96" width="76" height="56" rx="4" fill="#3b3b44" ${THIN}/>` +
    (d ? `<rect x="258" y="102" width="64" height="44" rx="3" fill="url(#gFire)" opacity=".7"/>` + glow(290, 124, 40, 0.6) + [256, 276, 296].map((x) => `<circle cx="${x + 10}" cy="82" r="5" fill="#3b3b44" ${THIN} stroke-width="1"/>`).join('')
      : `<path d="M260 110 l40 30" stroke="#1b1b1b" stroke-width="2"/>`),
  layers: (d) =>
    `<rect x="30" y="170" width="190" height="12" rx="2" fill="url(#gWood)" ${O}/><path d="M40 182 V230 M210 182 V230" ${O} stroke-width="5"/>` +
    (d ? [[70, 'url(#gBread)'], [130, 'url(#gBread)'], [190, '#c0782e']].map(([x, c]) => `<ellipse cx="${x}" cy="166" rx="22" ry="5" fill="${c}" ${O}/><rect x="${Number(x) - 22}" y="156" width="44" height="10" fill="${c}" ${THIN}/><ellipse cx="${x}" cy="156" rx="22" ry="5" fill="#e9b949" ${THIN}/>`).join('')
      : dustPile(120, 168)),
  cream: (d) =>
    d
      ? `<path d="M90 132 H150 L144 160 H96 Z" fill="url(#gSteel)" ${O}/><ellipse cx="120" cy="132" rx="30" ry="6" fill="#fffdf6" ${THIN}/>` +
        `<path d="M120 132 V96 M112 96 h16" ${O} stroke-width="3"/><path d="M114 120 q6 -8 12 0" fill="none" stroke="#ffd0dc" stroke-width="2"/>` +
        `<path d="M160 150 L164 128 H174 L178 150 Z" fill="url(#gGlass)" ${THIN}/><rect x="164" y="136" width="12" height="12" fill="#ff9ec4" opacity=".8"/>`
      : '',
  decor: (d) => (d ? [[44, 120], [196, 116]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="10" fill="${i ? '#ff9ec4' : '#fff6a8'}" ${THIN}/>` + `<path d="M${x} ${y + 10} V${y + 40}" stroke="#3f8a2a" stroke-width="2"/>`).join('') + sparkle(220, 100, 6) : ''),
  box: (d) =>
    d
      ? `<rect x="140" y="20" width="80" height="60" fill="#fffdf6" ${O}/><path d="M180 20 V80 M140 50 H220" stroke="#e0303f" stroke-width="5"/>` +
        `<path d="M180 20 q-16 -14 -22 0 q12 4 22 0 q16 -14 22 0 q-12 4 -22 0" fill="url(#gRed)" ${THIN}/>` + text(180, 70, 'تولدت مبارک', 7, '#e0303f')
      : '',
};

// ------------------------------------------------------------------ تالار محله

const HALL: Record<string, Layer> = {
  curtains: (d) =>
    d
      ? `<path d="M0 0 H70 C60 60 76 120 54 180 H0 Z M360 0 H290 C300 60 284 120 306 180 H360 Z" fill="url(#gRed)" ${O}/>` +
        `<path d="M0 0 H360 V20 Q330 34 300 20 Q270 34 240 20 Q210 34 180 20 Q150 34 120 20 Q90 34 60 20 Q30 34 0 20 Z" fill="url(#gRed)" ${O}/><path d="M0 20 Q30 34 60 20" fill="none" stroke="#f6c945" stroke-width="2"/>`
      : `<path d="M0 0 H40 L30 120 L0 130 Z" fill="#8a6a6a" ${O}/>`,
  tables: (d) =>
    d
      ? [[80, 200], [180, 210], [280, 200]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="36" ry="10" fill="#fffdf6" ${O}/><path d="M${Number(x) - 30} ${Number(y) + 4} V${Number(y) + 30} M${Number(x) + 30} ${Number(y) + 4} V${Number(y) + 30}" ${THIN} stroke-width="2"/>` +
          `<path d="M${x} ${Number(y) - 6} V${Number(y) - 20}" stroke="#3f8a2a" stroke-width="2"/><circle cx="${x}" cy="${Number(y) - 22}" r="5" fill="url(#gRose)" ${THIN} stroke-width=".8"/>`).join('')
      : [80, 180, 280].map((x, i) => plank(x - 30, 210 + (i % 2) * 8, 60, (i - 1) * 10)).join(''),
  flowers: (d) =>
    d
      ? Array.from({ length: 30 }, (_, i) => `<circle cx="${110 + (i % 10) * 15}" cy="${50 + Math.floor(i / 10) * 16 + (i % 2) * 4}" r="6" fill="${['#ff7a9c', '#ffd0dc', '#e0303f', '#fff6a8'][i % 4]}" ${THIN} stroke-width=".8"/>`).join('') +
        Array.from({ length: 12 }, (_, i) => `<ellipse cx="${116 + i * 12}" cy="${92 + (i % 2) * 4}" rx="4" ry="2" fill="url(#gLeaf)"/>`).join('')
      : '',
  stage: (d) =>
    d
      ? `<rect x="110" y="120" width="140" height="16" fill="url(#gWoodDark)" ${O}/>` +
        `<g transform="translate(150 112) rotate(-30)"><path d="M-6 0 C-10 -4 -10 -10 -4 -12 C-1 -9 1 -9 4 -12 C10 -10 10 -4 6 0 C10 4 8 12 0 12 C-8 12 -10 4 -6 0 Z" fill="url(#gWood)" ${THIN}/><path d="M0 -10 V-34" ${O} stroke-width="2"/></g>` +
        `<path d="M196 120 L204 104 L232 104 L240 120 Z" fill="url(#gWood)" ${O}/>` + sparkle(250, 100, 5)
      : '',
  lights: (d) =>
    d
      ? `<path d="M180 20 V40" ${THIN}/>` + glow(180, 52, 60, 0.6) + `<path d="M150 50 Q180 70 210 50" fill="none" ${O} stroke="url(#gGold)" stroke-width="3"/>` +
        [150, 165, 180, 195, 210].map((x, i) => `<path d="M${x} ${54 + Math.sin((i / 4) * Math.PI) * 8} l-3 8 l3 6 l3 -6 Z" fill="#d6ecff" ${THIN} stroke-width=".8"/><circle cx="${x}" cy="${48 + Math.sin((i / 4) * Math.PI) * 8}" r="2.6" fill="#ffe08a"/>`).join('')
      : darkness(0.35),
};

// ------------------------------------------------------------------ دیوار خاطرات

const MEMORIES: Record<string, Layer> = {
  young: (d) => (d ? frame(20, 30, 70, 84, sepiaLady(55, 104, 1.6) + `<path d="M28 104 H82" stroke="#6cc0ea" stroke-width="3"/>`) : `<rect x="20" y="30" width="70" height="84" fill="none" stroke="#9b8a76" stroke-width="2" stroke-dasharray="4 4"/>`),
  samovar: (d) =>
    d
      ? `<rect x="118" y="150" width="56" height="56" fill="url(#gCream)" ${O}/>` + glow(146, 116, 44, 0.5) + `<g transform="translate(112 74) scale(.7)">${samovar('url(#gBrass)', true)}</g>`
      : `<rect x="118" y="150" width="56" height="56" fill="#9a8a7a" ${O}/>`,
  letters: (d) =>
    d
      ? Array.from({ length: 6 }, (_, i) => `<g transform="rotate(${(i % 3) * 8 - 8} ${200 + (i % 3) * 30} ${50 + Math.floor(i / 3) * 34})"><rect x="${186 + (i % 3) * 30}" y="${38 + Math.floor(i / 3) * 34}" width="28" height="20" fill="#fffdf6" ${THIN}/><path d="M${186 + (i % 3) * 30} ${38 + Math.floor(i / 3) * 34} l14 10 l14 -10" fill="none" ${THIN} stroke-width="1"/></g>`).join('') +
        `<path d="M196 30 V20 M226 34 V24 M256 30 V20" stroke="#e0303f" stroke-width="2"/>`
      : cobweb(360, 0, 0.9, true),
  rose: (d) =>
    d
      ? `<path d="M296 200 C292 186 300 176 300 160 H316 C316 176 324 186 320 200 Z" fill="url(#gGlass)" ${O}/><path d="M298 196 C296 188 302 182 302 178 H314 C314 182 320 188 318 196 Z" fill="url(#gRose)" opacity=".8"/>` +
        `<rect x="300" y="150" width="16" height="10" fill="url(#gCopper)" ${THIN}/>` + geranium(270, 236, 0.6) + geranium(344, 236, 0.6)
      : '',
  cradle: (d) =>
    d
      ? `<g transform="translate(60 194)"><path d="M-30 20 Q0 32 30 20" fill="none" ${O} stroke="#8b5328" stroke-width="4"/><path d="M-24 -4 L24 -4 L22 18 L-22 18 Z" fill="url(#gWood)" ${O}/><path d="M-20 -4 Q0 -10 20 -4 L18 6 Q0 2 -18 6 Z" fill="url(#gRose)" ${THIN}/></g>` +
        `<path d="M0 140 Q90 154 180 140 T360 140" fill="none" stroke="#e0303f" stroke-width="2" stroke-dasharray="4 3"/>` + sparkle(110, 150, 5) + sparkle(250, 150, 5)
      : darkness(0.3),
};

// ------------------------------------------------------------------ جشن تولد

const BIRTHDAY: Record<string, Layer> = {
  cake: (d) =>
    `<rect x="130" y="184" width="100" height="12" rx="2" fill="#fffdf6" ${O}/><path d="M138 196 V236 M222 196 V236" ${O} stroke-width="4"/>` +
    (d ? cake(180, 184, 0.9, 0) : ''),
  candles: (d) => (d ? cake(180, 184, 0.9, 7) + glow(180, 112, 40, 0.7) : ''),
  gifts: (d) =>
    d
      ? [[40, 220, 30, 'url(#gBlue)'], [76, 224, 24, 'url(#gRed)'], [290, 220, 32, 'url(#gLeaf)'], [326, 224, 22, 'url(#gYellow)']].map(([x, y, w, c]) =>
          `<rect x="${Number(x) - Number(w) / 2}" y="${Number(y) - Number(w)}" width="${w}" height="${w}" fill="${c}" ${O}/><path d="M${x} ${Number(y) - Number(w)} V${y} M${Number(x) - Number(w) / 2} ${Number(y) - Number(w) / 2} H${Number(x) + Number(w) / 2}" stroke="#fffdf6" stroke-width="3"/>`).join('')
      : '',
  music: (d) =>
    d
      ? [[60, 120], [300, 116], [240, 90]].map(([x, y]) => `<path d="M${x} ${y} v-14 l10 -3 v14" fill="none" stroke="${INK}" stroke-width="2"/><circle cx="${x - 2}" cy="${y}" r="3" fill="${INK}"/><circle cx="${x + 8}" cy="${y - 3}" r="3" fill="${INK}"/>`).join('')
      : '',
  wish: (d) =>
    d
      ? stringLights(14, ['#ffd36b', '#ff7a9c', '#5fe0e0', '#c58bff']) + lantern(30, 30) + lantern(330, 30) +
        Array.from({ length: 22 }, (_, i) => `<rect x="${(i * 47) % 350 + 4}" y="${(i * 29) % 150 + 30}" width="5" height="3" rx="1" fill="${['#ff7a9c', '#ffd36b', '#5fe0e0', '#c58bff'][i % 4]}" transform="rotate(${(i * 53) % 180} ${(i * 47) % 350 + 6} ${(i * 29) % 150 + 31})"/>`).join('') +
        text(180, 70, 'تولدت مبارک ننه‌گلاب', 16, '#e0303f')
      : darkness(0.3),
};

export const SCENES12: Record<string, SceneDef> = {
  mahinhome: { base: wall('#e8d5ff') + floor('#8a6a5a'), order: ['papers', 'board', 'radio', 'sofa', 'albums'], layers: MAHINHOME },
  cakeroom: { base: wall('#f2e8d0') + floor('#b8a888'), order: ['oven', 'box', 'layers', 'cream', 'decor'], layers: CAKEROOM },
  hall: { base: wall('#fdfaf3') + floor('#a5703e'), order: ['flowers', 'curtains', 'stage', 'tables', 'lights'], layers: HALL },
  memories: { base: wall('#efe3cc') + floor('#a5703e'), order: ['young', 'letters', 'samovar', 'rose', 'cradle'], layers: MEMORIES },
  birthday: { base: wall('#ffe0ef') + floor('#a5703e'), order: ['wish', 'gifts', 'cake', 'candles', 'music'], layers: BIRTHDAY },
};
