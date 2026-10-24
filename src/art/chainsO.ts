// Season 13: wedding («عروسی») chain and its generator (the dowry bundle).

import { INK, O, THIN, g, shadow, shine, sparkle } from './kit';

const flame = (x: number, y: number, s = 1) =>
  `<path d="M${x} ${y} q${4 * s} ${6 * s} 0 ${10 * s} q${-4 * s} ${-4 * s} 0 ${-10 * s} Z" fill="url(#gFire)" ${THIN} stroke-width=".7"/>`;

const candle = (x: number, top: number, bottom: number, w = 6) =>
  `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${bottom - top}" rx="1.5" fill="#fffdf6" ${THIN} stroke-width="1"/>` + flame(x, top - 10);

/** Paisley (بته‌جقه), the termeh motif. */
const boteh = (x: number, y: number, s: number, fill: string) =>
  `<path d="M0 6 C-7 6 -8 -4 -2 -8 C2 -11 6 -10 5 -14 C9 -9 8 6 0 6 Z" fill="${fill}" stroke="${INK}" stroke-width=".7" transform="translate(${x} ${y}) scale(${s})"/>`;

const rose = (x: number, y: number, r: number, fill: string) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${THIN} stroke-width=".8"/><path d="M${x - r * 0.4} ${y} q${r * 0.4} ${-r * 0.6} ${r * 0.8} 0" fill="none" stroke="${INK}" stroke-width=".7" opacity=".6"/>`;

/** A crystal candelabrum (شمعدان) with three candles, centred on x, standing on `base`. */
const candelabrum = (x: number, base: number, s: number) =>
  g(`<ellipse cx="0" cy="0" rx="16" ry="5" fill="url(#gSilver)" ${O}/><path d="M-3 0 V-36 H3 V0 Z" fill="url(#gSilver)" ${THIN}/>` +
    `<path d="M-24 -36 Q0 -20 24 -36" fill="none" stroke="#9aa4b0" stroke-width="4" stroke-linecap="round"/>` +
    [-24, 0, 24].map((cx) => `<rect x="${cx - 5}" y="${cx ? -40 : -42}" width="10" height="5" rx="1.5" fill="url(#gSilver)" ${THIN} stroke-width="1"/>` + candle(cx, cx ? -60 : -64, cx ? -40 : -42, 5)).join('') +
    [-16, -8, 8, 16].map((cx) => `<ellipse cx="${cx}" cy="${-28 + Math.abs(cx) / 4}" rx="1.8" ry="3" fill="#e6f7ff" stroke="#7f8a99" stroke-width=".6"/>`).join(''),
    `translate(${x} ${base}) scale(${s})`);

/** A mirror of fortune (آینه‌ی بخت) with an arched gilt frame. */
const mirror = (x: number, base: number, w: number, h: number) =>
  `<path d="M${x - w / 2} ${base} V${base - h + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w / 2} ${base - h + w / 2} V${base} Z" fill="url(#gGold)" ${O}/>` +
  `<path d="M${x - w / 2 + 5} ${base - 4} V${base - h + w / 2} A${w / 2 - 5} ${w / 2 - 5} 0 0 1 ${x + w / 2 - 5} ${base - h + w / 2} V${base - 4} Z" fill="url(#gGlass)" ${THIN}/>` +
  shine(x - w / 6, base - h * 0.55, w / 12, h / 5, 20, 0.8);

export const WEDDING: string[] = [
  // 1 نقل
  shadow(50, 88, 24) + `<path d="M24 62 H76 C74 78 64 84 50 84 C36 84 26 78 24 62 Z" fill="url(#gSilver)" ${O}/>` +
    [[34, 60], [44, 58], [56, 58], [66, 60], [40, 52], [52, 50], [62, 53], [46, 44], [56, 45]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="5.5" ry="3.8" transform="rotate(${(i * 37) % 60 - 30} ${x} ${y})" fill="#fffdf6" ${THIN} stroke-width="1"/>`).join('') +
    `<path d="M30 70 q20 6 40 0" fill="none" stroke="#fff" stroke-width="1.6" opacity=".7"/>`,
  // 2 کله‌قند
  shadow(50, 90, 22) + `<path d="M50 12 L72 84 H28 Z" fill="url(#rSugar)" ${O}/><path d="M34 64 H66 L72 84 H28 Z" fill="url(#gBlue)" ${O}/>` +
    `<path d="M36 70 H64" stroke="#f6c945" stroke-width="2"/>` + shine(44, 36, 2.5, 10, 16, 0.8) + sparkle(64, 22, 5),
  // 3 سینی حنا
  shadow(50, 90, 36) + `<ellipse cx="50" cy="72" rx="38" ry="13" fill="url(#gBrass)" ${O}/><ellipse cx="50" cy="70" rx="30" ry="9" fill="none" stroke="#93661a" stroke-width="1.4"/>` +
    `<path d="M36 58 H64 C62 70 57 74 50 74 C43 74 38 70 36 58 Z" fill="url(#gRed)" ${O}/><ellipse cx="50" cy="58" rx="14" ry="4" fill="#8a6a2a" ${THIN}/>` +
    `<path d="M42 66 h16" stroke="#f6c945" stroke-width="1.6"/>` + candle(24, 52, 70) + candle(76, 52, 70),
  // 4 جعبه‌ی حلقه
  shadow(50, 88, 28) + `<path d="M26 58 L30 28 H70 L74 58 Z" fill="url(#gRoseDeep)" ${O}/><path d="M33 52 L35 34 H65 L67 52 Z" fill="#7a1030" opacity=".5"/>` +
    `<rect x="24" y="56" width="52" height="28" rx="4" fill="url(#gRed)" ${O}/><rect x="30" y="52" width="40" height="10" rx="5" fill="#7a1030" ${THIN}/>` +
    `<ellipse cx="50" cy="52" rx="9" ry="7" fill="none" stroke="url(#gGold)" stroke-width="4"/><path d="M50 38 l5 5 l-5 6 l-5 -6 Z" fill="#e6f7ff" ${THIN} stroke-width="1"/>` + sparkle(62, 36, 5),
  // 5 شمعدان
  shadow(50, 92, 22) + candelabrum(50, 88, 1),
  // 6 خونچای عروس
  shadow(50, 92, 38) + `<ellipse cx="50" cy="80" rx="38" ry="10" fill="url(#gSilver)" ${O}/>` +
    `<path d="M22 78 L30 60 H70 L78 78 Z" fill="url(#gRed)" ${O}/>` + [30, 42, 54, 66].map((x) => boteh(x + 4, 70, 0.6, '#f6c945')).join('') +
    `<path d="M32 60 L38 46 H62 L68 60 Z" fill="#fffdf6" ${O}/><path d="M40 46 L44 36 H56 L60 46 Z" fill="url(#gTurq)" ${O}/>` +
    `<path d="M50 36 V26" stroke="#e0303f" stroke-width="3"/><path d="M50 28 q-12 -10 -14 0 q7 3 14 0 q12 -10 14 0 q-7 3 -14 0" fill="#e0303f" ${THIN} stroke-width="1"/>` +
    candle(16, 64, 78, 5) + candle(84, 64, 78, 5),
  // 7 آینه و شمعدان
  `<circle cx="50" cy="52" r="46" fill="url(#rGlow)" opacity=".5"/>` + shadow(50, 92, 42) + mirror(50, 84, 40, 64) + candelabrum(16, 88, 0.55) + candelabrum(84, 88, 0.55) + sparkle(50, 12, 5),
  // 8 ماشین عروس
  `<circle cx="50" cy="56" r="46" fill="url(#rGlow)" opacity=".6"/>` + shadow(50, 88, 44) +
    `<path d="M52 40 Q30 28 12 58 M52 40 Q72 28 88 57" fill="none" stroke="#ff7a9c" stroke-width="2.2"/>` +
    `<path d="M8 66 Q8 58 16 57 L28 56 L38 42 H66 L76 56 L88 58 Q93 60 92 68 V74 H8 Z" fill="#fbfbf6" ${O}/>` +
    `<path d="M41 45 H52 V56 H33 Z" fill="url(#gGlass)" ${THIN}/><path d="M55 45 H64 L72 56 H55 Z" fill="url(#gGlass)" ${THIN}/>` +
    `<path d="M54 57 V72" stroke="${INK}" stroke-width="1.2"/><path d="M10 64 H90" stroke="#c9d1dc" stroke-width="1.6"/>` +
    `<rect x="5" y="69" width="9" height="5" rx="2" fill="url(#gSilver)" ${THIN} stroke-width="1"/><rect x="86" y="69" width="9" height="5" rx="2" fill="url(#gSilver)" ${THIN} stroke-width="1"/>` +
    `<circle cx="89" cy="62" r="2.4" fill="#fff6a8" ${THIN} stroke-width=".8"/>` +
    [26, 74].map((x) => `<circle cx="${x}" cy="75" r="9" fill="#2a2a2a" ${O}/><circle cx="${x}" cy="75" r="4" fill="url(#gSilver)" ${THIN} stroke-width="1"/>`).join('') +
    `<path d="M74 55 q8 -6 16 2" fill="url(#gLeaf)" ${THIN} stroke-width=".8"/>` + rose(78, 52, 4, '#e0303f') + rose(85, 54, 3.6, '#ff9ec4') + rose(81, 47, 3.4, '#fffdf6') +
    `<path d="M52 41 q-7 -7 -9 0 q4 2 9 0 q7 -7 9 0 q-4 2 -9 0" fill="#ff7a9c" ${THIN} stroke-width=".8"/>` + sparkle(14, 28, 5) + sparkle(90, 24, 6),
];

/** A knotted cloth bundle (بقچه). */
const bundle = (x: number, base: number, w: number, fill: string, motif: string) =>
  `<path d="M${x - w / 2} ${base} C${x - w / 2 - 4} ${base - w * 0.5} ${x - w * 0.3} ${base - w * 0.7} ${x} ${base - w * 0.68} C${x + w * 0.3} ${base - w * 0.7} ${x + w / 2 + 4} ${base - w * 0.5} ${x + w / 2} ${base} Z" fill="${fill}" ${O}/>` +
  motif +
  `<path d="M${x - 4} ${base - w * 0.66} q-10 -10 -14 -2 q6 4 14 2 M${x + 4} ${base - w * 0.66} q10 -10 14 -2 q-6 4 -14 2" fill="${fill}" ${THIN}/><circle cx="${x}" cy="${base - w * 0.66}" r="4" fill="${fill}" ${THIN}/>`;

export const GEN_WEDDING: string[] = [
  // بقچه‌ی کوچک
  shadow(50, 90, 28) + bundle(50, 86, 52, 'url(#gRose)', [38, 50, 62].map((x) => `<circle cx="${x}" cy="70" r="2.4" fill="#fffdf6"/>`).join('')),
  // بقچه‌ی ترمه
  shadow(50, 90, 34) + bundle(50, 86, 64, 'url(#gRed)', [32, 44, 56, 68].map((x, i) => boteh(x, 70 - (i % 2) * 6, 0.8, '#f6c945')).join('')) + sparkle(84, 34, 5),
  // صندوقچه‌ی جهیزیه
  shadow(50, 92, 42) + `<path d="M12 50 L18 30 H82 L88 50 Z" fill="url(#gWoodDark)" ${O}/>` +
    `<path d="M20 50 C30 40 40 44 50 40 C60 44 70 40 80 50 Z" fill="url(#gRed)" ${THIN}/>` + boteh(36, 46, 0.6, '#f6c945') + boteh(62, 46, 0.6, '#f6c945') +
    `<rect x="10" y="50" width="80" height="38" rx="3" fill="url(#gWood)" ${O}/><path d="M10 62 H90" stroke="#5e3418" stroke-width="2"/>` +
    [16, 84].map((x) => `<rect x="${x - 3}" y="50" width="6" height="38" fill="url(#gBrass)" ${THIN} stroke-width="1"/>`).join('') +
    `<rect x="44" y="58" width="12" height="10" rx="2" fill="url(#gBrass)" ${THIN}/><circle cx="50" cy="63" r="1.6" fill="${INK}"/>` + sparkle(90, 24, 5),
];
