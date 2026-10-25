// Season 15 («رفیق یزدی») place scenes. Same contract as scenes.ts: each task layer is drawn
// "before" until done, then "after".

import { INK, O, THIN, g, sparkle } from './kit';
import { Layer, SCENES1, SceneDef, boardedDoor, cobweb, dustPile, glow, plank } from './scenes';
import { text } from './scenes3';

const MUD = '#c99a62';
const MUD_D = '#a8783e';
const MUD_L = '#dcb47e';

const straw = (x: number, y: number, w: number, h: number, n: number) =>
  Array.from({ length: n }, (_, i) => `<path d="M${x + ((i * 37) % 100) / 100 * w} ${y + ((i * 61) % 100) / 100 * h} l5 ${i % 2 ? -2 : 2}" stroke="#f2d48a" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>`).join('');

const knocker = (x: number, y: number, r: number) =>
  `<circle cx="${x}" cy="${y - r}" r="${r * 0.35}" fill="#d9a63a" ${THIN} stroke-width=".8"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#d9a63a" stroke-width="${Math.max(1.6, r * 0.4)}"/>`;

const doubleDoor = (x: number, base: number, w: number, h: number) =>
  `<path d="M${x - w / 2 - 6} ${base} V${base - h + w / 2} Q${x - w / 2 - 6} ${base - h - 6} ${x} ${base - h - 6} Q${x + w / 2 + 6} ${base - h - 6} ${x + w / 2 + 6} ${base - h + w / 2} V${base} Z" fill="${MUD_D}" ${O}/>` +
  `<path d="M${x - w / 2} ${base} V${base - h + w / 2} Q${x - w / 2} ${base - h} ${x} ${base - h} Q${x + w / 2} ${base - h} ${x + w / 2} ${base - h + w / 2} V${base} Z" fill="url(#gWoodDark)" ${O}/>` +
  `<path d="M${x} ${base - h} V${base}" stroke="#3b2216" stroke-width="1.4"/>` +
  Array.from({ length: 6 }, (_, i) => `<circle cx="${x + (i % 2 ? w / 4 : -w / 4)}" cy="${base - h + 18 + Math.floor(i / 2) * (h / 4)}" r="1.6" fill="#d9a63a"/>`).join('') +
  knocker(x - 7, base - h * 0.45, 4) + `<path d="M${x + 7} ${base - h * 0.52} v10" stroke="#d9a63a" stroke-width="3" stroke-linecap="round"/>`;

/** A windcatcher tower centred on x, standing on `base`. */
const windcatcher = (x: number, base: number, w: number, h: number, broken = false) => {
  const n = Math.max(2, Math.round(w / 10)), vw = (w - 8) / n;
  return `<rect x="${x - w / 2}" y="${base - h}" width="${w}" height="${h}" fill="${broken ? '#a89070' : MUD}" ${O}/>` +
    (broken ? `<path d="M${x - w / 2} ${base - h} l${w * 0.3} ${h * 0.2} l${w * 0.3} ${-h * 0.12} l${w * 0.4} ${h * 0.25}" fill="none" stroke="${INK}" stroke-width="1.6"/>`
      : `<rect x="${x - w / 2 - 3}" y="${base - h - 6}" width="${w + 6}" height="8" rx="1" fill="${MUD_D}" ${THIN}/>` +
        Array.from({ length: n }, (_, i) => `<rect x="${x - w / 2 + 4 + i * vw}" y="${base - h + 8}" width="${vw - 3}" height="${h * 0.4}" rx="1" fill="#5e3418"/>`).join('')) +
    `<path d="M${x - w / 2} ${base - h * 0.42} H${x + w / 2}" stroke="${MUD_D}" stroke-width="2"/>`;
};

// ------------------------------------------------------------------ کوچه‌های کاهگلی

const lanesBase = () =>
  `<rect width="360" height="120" fill="url(#gSky)"/>` + windcatcher(208, 72, 24, 40) +
  `<rect x="120" y="70" width="120" height="132" fill="${MUD_L}" ${THIN}/>` +
  `<path d="M0 20 L120 66 V204 L0 240 Z" fill="${MUD}" ${O}/><path d="M360 20 L240 66 V204 L360 240 Z" fill="${MUD}" ${O}/>` +
  `<path d="M120 204 H240 L360 240 H0 Z" fill="#d8b48a"/>` + straw(10, 70, 90, 120, 12) + straw(260, 70, 90, 120, 12) + straw(130, 80, 100, 60, 6);

const YAZDLANES: Record<string, Layer> = {
  sabat: (d) =>
    d
      ? `<path d="M120 66 H240 V112 Q180 82 120 112 Z" fill="${MUD_D}" ${O}/><path d="M128 104 Q180 80 232 104" fill="none" stroke="#7a5432" stroke-width="2"/>` +
        `<rect x="170" y="70" width="20" height="12" rx="2" fill="#5e3418" ${THIN} stroke-width="1"/>`
      : `<path d="M120 66 H150 V96 Q136 92 120 104 Z M240 66 H214 V90 Q228 92 240 100 Z" fill="#a89070" ${O}/>` + dustPile(180, 210) + plank(150, 196, 60, 6),
  door: (d) => (d ? doubleDoor(180, 202, 42, 74) : boardedDoor(158, 130, 44, 72)),
  benches: (d) =>
    d
      ? [[132, 186], [206, 186]].map(([x, y]) => `<rect x="${x}" y="${y}" width="22" height="16" rx="2" fill="${MUD_D}" ${O}/><rect x="${x + 2}" y="${y - 5}" width="18" height="6" rx="3" fill="url(#gCarpet)" ${THIN} stroke-width="1"/>`).join('')
      : `<path d="M132 202 V194 L144 190 L154 198 V202 Z M206 202 V192 L220 196 L228 190 V202 Z" fill="#a89070" ${THIN}/>`,
  lamps: (d) =>
    [[46, 92], [314, 92]].map(([x, y]) => `<path d="M${x} ${y - 14} h${x < 180 ? 12 : -12} v8" fill="none" ${THIN}/>` +
      (d ? `<path d="M${x + (x < 180 ? 6 : -18)} ${y - 6} h12 l-2 16 h-8 Z" fill="#ffe7a0" ${THIN}/>` + glow(x + (x < 180 ? 12 : -12), y + 2, 28, 0.7)
        : `<path d="M${x + (x < 180 ? 8 : -16)} ${y - 4} l8 12" stroke="#6a6a6a" stroke-width="2"/>`)).join(''),
  sign: (d) =>
    d
      ? `<path d="M262 120 L320 104 V126 L262 140 Z" fill="url(#gBlue)" ${O}/>` + g(text(0, 0, 'کوچه‌ی بادگیر', 8, '#fffdf6'), 'translate(291 126) skewY(-15)') + sparkle(330, 96, 5)
      : `<path d="M262 120 L320 104 V126 L262 140 Z" fill="#9aa4b0" ${O}/>`,
};

// ------------------------------------------------------------------ قنات

const qanatBase = () =>
  `<rect width="360" height="100" fill="url(#gSky)"/><path d="M0 100 Q90 88 180 96 T360 92 V130 H0 Z" fill="#e3c38c"/>` +
  `<rect y="128" width="360" height="112" fill="#8a6240"/>` + [148, 168, 230].map((y, i) => `<path d="M0 ${y} Q120 ${y - 6} 240 ${y + 4} T360 ${y}" fill="none" stroke="${['#a07450', '#6e4a2e', '#6e4a2e'][i]}" stroke-width="3" opacity=".6"/>`).join('') +
  `<ellipse cx="320" cy="104" rx="22" ry="6" fill="#d4b07a" ${THIN}/><ellipse cx="320" cy="103" rx="8" ry="2.4" fill="#3b2216"/>`;

const QANAT: Record<string, Layer> = {
  channel: (d) =>
    `<path d="M90 186 H360 V222 H90 Z" fill="${d ? '#2a1a10' : '#5a3a22'}" ${O}/>` +
    (d ? `<path d="M90 212 H360 V222 H90 Z" fill="url(#gWater)"/><path d="M110 216 q10 -3 20 0 t20 0 M200 216 q10 -3 20 0 t20 0 M290 216 q10 -3 20 0 t20 0" fill="none" stroke="#e6f7ff" stroke-width="1.4"/>`
      : [120, 170, 240, 300].map((x, i) => `<ellipse cx="${x}" cy="${212 - (i % 2) * 6}" rx="${16 + (i % 3) * 4}" ry="9" fill="#7a5232" ${THIN}/>`).join('')),
  payab: (d) =>
    d
      ? `<path d="M20 128 V100 Q20 84 44 84 Q68 84 68 100 V128 Z" fill="${MUD}" ${O}/><path d="M30 128 V104 Q30 94 44 94 Q58 94 58 104 V128 Z" fill="#3b2216"/>` +
        Array.from({ length: 6 }, (_, i) => `<rect x="${30 + i * 10}" y="${130 + i * 10}" width="16" height="10" fill="${MUD_D}" ${THIN} stroke-width="1"/>`).join('')
      : `<path d="M20 128 L28 100 L46 92 L62 106 L68 128 Z" fill="#a89070" ${O}/>` + `<path d="M30 140 L90 196 L60 200 Z" fill="#6e4a2e" ${THIN}/>`,
  shaft: (d) =>
    `<rect x="208" y="104" width="24" height="84" fill="${d ? '#2a1a10' : '#6e4a2e'}" ${THIN}/>` +
    `<path d="M186 106 Q220 88 254 106 Q220 118 186 106 Z" fill="#d4b07a" ${O}/><ellipse cx="220" cy="105" rx="11" ry="3" fill="#2a1a10"/>` +
    (d ? '' : plank(198, 98, 46, 8) + `<path d="M210 120 h20 M212 140 h18" stroke="#8a6240" stroke-width="5"/>`),
  windlass: (d) =>
    d
      ? `<path d="M196 106 V62 M244 106 V62" ${O} stroke-width="5"/><rect x="192" y="58" width="56" height="10" rx="5" fill="url(#gWood)" ${O}/><path d="M248 63 h8 v12" fill="none" ${O} stroke-width="3"/>`
      : `<path d="M196 106 L190 76 M244 106 L252 84" ${O} stroke-width="5"/><rect x="160" y="112" width="40" height="8" rx="4" fill="#8a7a6a" ${THIN} transform="rotate(10 180 116)"/>`,
  bucket: (d) =>
    d
      ? `<path d="M220 68 V150" stroke="#b8945a" stroke-width="2"/><path d="M212 150 H228 L226 166 Q220 170 214 166 Z" fill="#8a5a32" ${THIN}/><ellipse cx="220" cy="150" rx="8" ry="2.4" fill="#6cc0ea"/>`
      : `<path d="M150 124 q20 -8 30 2 q8 8 26 0" fill="none" stroke="#b8945a" stroke-width="2" stroke-dasharray="6 3"/>`,
};

// ------------------------------------------------------------------ خونه‌ی بادگیر

const windhouseBase = () =>
  `<rect width="360" height="110" fill="url(#gSky)"/><rect y="84" width="360" height="96" fill="${MUD}" ${O}/>` + straw(10, 96, 340, 70, 14) +
  `<rect y="170" width="360" height="70" fill="#c9a27a"/>` + Array.from({ length: 8 }, (_, i) => `<path d="M${i * 48} 170 L${i * 48 - 26} 240" stroke="${INK}" stroke-width="1" opacity=".15"/>`).join('');

const WINDHOUSE: Record<string, Layer> = {
  tower: (d) => windcatcher(124, 88, 52, 76, !d),
  poolroom: (d) =>
    `<path d="M80 170 V122 Q80 98 124 96 Q168 98 168 122 V170 Z" fill="${d ? '#6b4a2a' : '#7a6a5a'}" ${O}/>` +
    (d ? `<rect x="96" y="150" width="56" height="10" rx="2" fill="url(#gWater)" ${THIN}/><path d="M124 150 v-10" stroke="#e6f7ff" stroke-width="2"/>` + glow(124, 140, 36, 0.3)
      : dustPile(124, 166) + cobweb(80, 100, 0.6)),
  window: (d) =>
    d
      ? `<rect x="226" y="100" width="88" height="56" rx="3" fill="url(#gWoodDark)" ${O}/>` +
        Array.from({ length: 8 }, (_, i) => { const x = 236 + (i % 4) * 20, y = 112 + Math.floor(i / 4) * 24; return `<path d="M${x} ${y - 8} l8 8 l-8 8 l-8 -8 Z" fill="${['#5fe0e0', '#ffd36b', '#ff7a9c', '#9be36b'][i % 4]}" ${THIN} stroke-width="1" opacity=".9"/>`; }).join('')
      : boardedDoor(236, 98, 70, 58),
  garden: (d) =>
    `<path d="M120 182 H300 L286 232 H134 Z" fill="${d ? '#7a5a32' : '#9a7a5a'}" ${O}/>` + [0, 1, 2].map((i) => `<path d="M${124 + i * 4} ${186 + i * 14} H${296 - i * 4}" stroke="${MUD_D}" stroke-width="3"/>`).join('') +
    (d ? [[170, 200, 18, 'url(#gLeaf)'], [250, 196, 20, 'url(#gLeafDark)'], [212, 212, 14, 'url(#gLeaf)']].map(([x, y, r, c]) => `<path d="M${x} ${Number(y) + 22} V${y}" stroke="#6b4a2a" stroke-width="4"/><circle cx="${x}" cy="${Number(y) - 4}" r="${r}" fill="${c}" ${THIN}/>`).join('') +
        [[164, 190], [176, 200], [244, 186], [258, 198]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.4" fill="#e0303f" ${THIN} stroke-width=".8"/>`).join('')
      : dustPile(210, 226)),
  box: (d) =>
    `<rect x="16" y="184" width="84" height="10" rx="2" fill="url(#gWood)" ${O}/><path d="M22 194 V214 M94 194 V214" ${O} stroke-width="4"/>` +
    (d ? `<path d="M30 184 V166 H86 V184 Z" fill="url(#gWoodDark)" ${O}/><path d="M30 166 L24 148 H80 L86 166 Z" fill="url(#gWood)" ${THIN}/>` +
        [0, 1, 2].map((i) => `<rect x="${36 + i * 4}" y="${160 - i * 4}" width="40" height="12" fill="#f6ead2" ${THIN} stroke-width="1" transform="rotate(${i * 4 - 4} 56 166)"/>`).join('') +
        `<path d="M40 158 h32" stroke="#c0392b" stroke-width="1.6"/>` + glow(58, 164, 30, 0.5)
      : `<rect x="30" y="164" width="56" height="20" fill="#7a5a4a" ${O}/>` + dustPile(58, 166)),
};

// ------------------------------------------------------------------ قنادی رفاقت

const sweetsBase = () =>
  `<rect width="360" height="172" fill="#f6ead2"/><rect y="120" width="360" height="52" fill="url(#gTurq)" opacity=".45"/>` +
  Array.from({ length: 12 }, (_, i) => `<path d="M${i * 30 + 15} 130 l8 8 l-8 8 l-8 -8 Z" fill="#fffdf6" opacity=".6"/>`).join('') +
  `<rect y="168" width="360" height="72" fill="#b98652"/><path d="M0 168 H360" stroke="${INK}" stroke-width="2" opacity=".4"/>`;

const tray = (x: number, y: number, r: number, metal = 'url(#gCopper)') => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.3}" fill="${metal}" ${O}/>`;

const YAZDSWEETS: Record<string, Layer> = {
  oven: (d) =>
    `<rect x="262" y="40" width="90" height="128" fill="${d ? '#c0603a' : '#8a6a5a'}" ${O}/><path d="M276 120 V94 Q276 74 307 74 Q338 74 338 94 V120 Z" fill="#2a1a10" ${THIN}/>` +
    Array.from({ length: 8 }, (_, i) => `<path d="M262 ${52 + i * 14} H352" stroke="#8a3a1a" stroke-width="1" opacity=".5"/>`).join('') +
    (d ? `<path d="M282 120 C284 104 296 100 300 88 C306 100 318 104 332 120 Z" fill="url(#gFire)"/>` + glow(307, 104, 40, 0.6) : ''),
  pashmak: (d) =>
    `<rect x="16" y="56" width="120" height="6" rx="2" fill="url(#gWoodDark)" ${O}/>` +
    (d ? [32, 62, 92, 120].map((x, i) => `<rect x="${x - 10}" y="34" width="20" height="22" fill="${['#ff9ec4', '#fffdf6', '#ffd0dc', '#fff6a8'][i]}" ${THIN} stroke-width="1"/><path d="M${x - 10} 40 h20" stroke="${INK}" stroke-width=".6" opacity=".4"/>` +
          `<path d="M${x - 8} 34 q4 -6 8 0 q4 -6 8 0" fill="${['#ffd0dc', '#fffdf6', '#ffe0ef', '#fffdf6'][i]}" ${THIN} stroke-width=".8"/>`).join('')
      : cobweb(16, 0, 0.8) + dustPile(76, 56)),
  showcase: (d) =>
    `<rect x="20" y="132" width="230" height="64" rx="4" fill="${d ? 'url(#gWood)' : '#8a7a6a'}" ${O}/>` +
    `<rect x="28" y="138" width="214" height="34" rx="2" fill="${d ? 'url(#gGlass)' : '#9aa4b0'}" ${THIN}/>` +
    (d ? `<path d="M20 132 H250" stroke="#d9a63a" stroke-width="3"/>` + text(135, 188, 'قنادی رفاقت', 10, '#ffe08a') +
        [60, 110, 160, 210].map((x, i) => `<circle cx="${x}" cy="158" r="7" fill="${['#f2d9a0', '#e0b070', '#fffdf6', '#c0e070'][i]}" ${THIN} stroke-width="1"/>`).join('')
      : `<path d="M40 142 l40 26 M170 140 l-24 30" stroke="${INK}" stroke-width="1.2" opacity=".6"/>`),
  ghotab: (d) =>
    tray(76, 128, 34, d ? 'url(#gSilver)' : '#9a9aa8') +
    (d ? [[60, 122], [74, 120], [88, 122], [66, 114], [82, 114], [74, 108]].map(([x, y]) => `<path d="M${x - 7} ${y} Q${x} ${y - 9} ${x + 7} ${y} Q${x} ${y + 3} ${x - 7} ${y} Z" fill="#e8b860" ${THIN} stroke-width=".8"/><path d="M${x - 5} ${y - 2} q5 -5 10 0" fill="none" stroke="#fffdf6" stroke-width="2" opacity=".9"/>`).join('') : ''),
  baklava: (d) =>
    tray(186, 128, 38) +
    (d ? [[168, 122], [186, 122], [204, 122], [177, 114], [195, 114], [186, 106]].map(([x, y]) => `<path d="M${x} ${y - 7} l8 7 l-8 7 l-8 -7 Z" fill="#f2c060" ${THIN} stroke-width=".8"/><circle cx="${x}" cy="${y}" r="1.8" fill="#6fbf4a"/>`).join('') + sparkle(222, 100, 5) : ''),
};

// ------------------------------------------------------------------ مهمون یزدی

const TEA = SCENES1.teahouse;
const reunionBase = () => TEA.base + TEA.order.filter((k) => k !== 'samovar').map((k) => TEA.layers[k](true)).join('');

/** A sepia photo of two old friends in front of a two-knocker door. */
const friendsPhoto = (x: number, y: number, w: number, h: number) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="url(#gWood)" ${O}/><rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" fill="#e8d3a8" ${THIN}/>` +
  `<path d="M${x + w / 2 - 6} ${y + h - 4} V${y + 12} H${x + w / 2 + 6} V${y + h - 4}" fill="#9a7a5a"/>` +
  [x + 10, x + w - 10].map((cx) => `<circle cx="${cx}" cy="${y + h - 18}" r="3.4" fill="#8a6a48"/><path d="M${cx - 5} ${y + h - 4} Q${cx} ${y + h - 16} ${cx + 5} ${y + h - 4} Z" fill="#8a6a48"/>`).join('');

const REUNION: Record<string, Layer> = {
  photo: (d) => (d ? friendsPhoto(212, 34, 42, 40) + sparkle(258, 30, 4) : `<circle cx="233" cy="34" r="1.6" fill="${INK}"/><rect x="214" y="38" width="38" height="34" fill="#c9a27a" opacity=".5"/>`),
  letter: (d) =>
    d
      ? `<rect x="216" y="82" width="34" height="26" rx="2" fill="url(#gGold)" ${THIN}/><rect x="219" y="85" width="28" height="20" fill="#fffdf6"/>` +
        `<path d="M222 90 q6 -2 12 0 t10 0 M222 96 q6 -2 12 0 t8 0 M222 101 q5 -2 10 0" fill="none" stroke="#3a76c4" stroke-width="1"/>`
      : `<rect x="206" y="178" width="18" height="12" fill="#fffdf6" ${THIN} stroke-width="1" transform="rotate(-8 215 184)"/>`,
  sweets: (d) =>
    `<ellipse cx="178" cy="226" rx="34" ry="8" fill="${d ? 'url(#gBrass)' : '#9a8a76'}" ${O}/>` +
    (d ? [[164, 222], [176, 220], [188, 222], [170, 216], [182, 215]].map(([x, y]) => `<path d="M${x - 6} ${y} Q${x} ${y - 8} ${x + 6} ${y} Q${x} ${y + 3} ${x - 6} ${y} Z" fill="#e8b860" ${THIN} stroke-width=".8"/><path d="M${x - 4} ${y - 2} q4 -4 8 0" fill="none" stroke="#fffdf6" stroke-width="1.6"/>`).join('') : ''),
  model: (d) =>
    d
      ? `<rect x="314" y="212" width="40" height="8" rx="2" fill="url(#gWood)" ${O}/>` + windcatcher(334, 212, 18, 36) + `<rect x="320" y="198" width="28" height="14" fill="${MUD}" ${THIN}/>`
      : `<rect x="316" y="200" width="34" height="20" fill="#b8945a" ${THIN}/><path d="M316 210 h34" stroke="#8a6a3a" stroke-width="1.4"/>`,
  samovar: (d) => (d ? TEA.layers.samovar(true) : `<ellipse cx="301" cy="138" rx="24" ry="5" fill="#e8dcc6" ${THIN}/>`),
};

export const SCENES15: Record<string, SceneDef> = {
  yazdlanes: { base: lanesBase(), order: ['sabat', 'door', 'benches', 'lamps', 'sign'], layers: YAZDLANES },
  qanat: { base: qanatBase(), order: ['channel', 'payab', 'shaft', 'windlass', 'bucket'], layers: QANAT },
  windhouse: { base: windhouseBase(), order: ['tower', 'poolroom', 'window', 'garden', 'box'], layers: WINDHOUSE },
  yazdsweets: { base: sweetsBase(), order: ['oven', 'pashmak', 'showcase', 'ghotab', 'baklava'], layers: YAZDSWEETS },
  reunion: { base: reunionBase(), order: ['photo', 'letter', 'sweets', 'model', 'samovar'], layers: REUNION },
};
