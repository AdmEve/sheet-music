// Season 19: Qamsar rosewater («قمصر») chain and its generator (the damask rose bush).

import { INK, O, THIN, g, shadow, shine, sparkle } from './kit';

const petal = (x: number, y: number, r: number, rot: number, fill = 'url(#gRoseDeep)') =>
  `<path d="M0 0 C${-r} ${-r * 0.4} ${-r * 0.8} ${-r * 1.4} 0 ${-r * 1.6} C${r * 0.8} ${-r * 1.4} ${r} ${-r * 0.4} 0 0 Z" fill="${fill}" stroke="${INK}" stroke-width=".8" transform="translate(${x} ${y}) rotate(${rot})"/>`;

const rose = (x: number, y: number, r: number) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gRoseDeep)" ${THIN}/><path d="M${x - r * 0.5} ${y} q${r * 0.5} -${r * 0.7} ${r} 0 M${x - r * 0.3} ${y + r * 0.3} q${r * 0.3} -${r * 0.4} ${r * 0.6} 0" fill="none" stroke="#ffd0dc" stroke-width="1" opacity=".9"/>`;

/** A pink rosewater bottle with a rose label, centred on x, standing on `base`. */
const bottle = (x: number, base: number, h: number) =>
  `<path d="M${x - h * 0.28} ${base} V${base - h * 0.55} Q${x - h * 0.28} ${base - h * 0.72} ${x - h * 0.08} ${base - h * 0.78} V${base - h * 0.92} H${x + h * 0.08} V${base - h * 0.78} Q${x + h * 0.28} ${base - h * 0.72} ${x + h * 0.28} ${base - h * 0.55} V${base} Z" fill="url(#gGlass)" ${O}/>` +
  `<rect x="${x - h * 0.24}" y="${base - h * 0.5}" width="${h * 0.48}" height="${h * 0.46}" fill="#ffd0dc" opacity=".8"/>` +
  `<rect x="${x - h * 0.1}" y="${base - h}" width="${h * 0.2}" height="${h * 0.1}" rx="1" fill="url(#gGold)" ${THIN} stroke-width="1"/>` +
  `<rect x="${x - h * 0.18}" y="${base - h * 0.38}" width="${h * 0.36}" height="${h * 0.22}" rx="2" fill="#fffdf6" ${THIN} stroke-width=".8"/>` + rose(x, base - h * 0.27, h * 0.06);

/** A big green demijohn (قرابه) in a wicker jacket. */
const carboy = (x: number, base: number, r: number) =>
  `<path d="M${x - r * 0.25} ${base - r * 1.9} H${x + r * 0.25} V${base - r * 1.6} Q${x + r} ${base - r * 1.4} ${x + r} ${base - r * 0.7} Q${x + r} ${base} ${x} ${base} Q${x - r} ${base} ${x - r} ${base - r * 0.7} Q${x - r} ${base - r * 1.4} ${x - r * 0.25} ${base - r * 1.6} Z" fill="#4aa86a" opacity=".9" ${O}/>` +
  `<path d="M${x - r} ${base - r * 0.7} Q${x - r} ${base} ${x} ${base} Q${x + r} ${base} ${x + r} ${base - r * 0.7} Z" fill="url(#gWicker)" ${THIN}/>` +
  Array.from({ length: 5 }, (_, i) => `<path d="M${x - r + (i + 0.5) * r * 0.4} ${base - r * 0.7} V${base - 2}" stroke="#8a5a22" stroke-width="1" opacity=".7"/>`).join('') +
  shine(x - r * 0.4, base - r * 1.2, r * 0.12, r * 0.3, 20, 0.8);

/** Copper still with a dome lid and a side pipe. */
const still = (x: number, base: number, w: number) =>
  `<path d="M${x - w / 2} ${base - w * 0.6} H${x + w / 2} L${x + w / 2 - 4} ${base} H${x - w / 2 + 4} Z" fill="url(#gCopper)" ${O}/>` +
  `<path d="M${x - w / 2} ${base - w * 0.6} Q${x} ${base - w * 1.05} ${x + w / 2} ${base - w * 0.6} Z" fill="url(#gCopper)" ${O}/>` +
  `<path d="M${x} ${base - w * 0.83} V${base - w * 0.95} H${x + w * 0.75} V${base - w * 0.5}" fill="none" stroke="#b05a2a" stroke-width="3.4"/>` +
  shine(x - w / 4, base - w * 0.35, w * 0.05, w * 0.12, 10, 0.6);

export const QAMSAR: string[] = [
  // 1 گلبرگ
  shadow(50, 84, 22) + petal(42, 74, 12, -30) + petal(56, 76, 13, 20) + petal(50, 62, 11, 5, 'url(#gRose)') + sparkle(74, 40, 4),
  // 2 سبد گل‌چینی
  shadow(50, 90, 30) + `<path d="M20 52 H80 L72 86 H28 Z" fill="url(#gWicker)" ${O}/><path d="M28 52 Q50 20 72 52" fill="none" ${O} stroke="#a8702d" stroke-width="4"/>` +
    [[32, 50], [44, 46], [56, 48], [68, 50], [38, 42], [52, 40], [62, 43]].map(([x, y]) => rose(x, y, 6)).join('') + `<path d="M24 64 H76" stroke="#8a5a22" stroke-width="1.4" opacity=".7"/>`,
  // 3 قرابه‌ی کوچک
  shadow(50, 88, 22) + carboy(50, 86, 22),
  // 4 شیشه‌ی گلاب قمصر
  shadow(50, 90, 20) + bottle(50, 88, 66) + sparkle(76, 28, 5),
  // 5 صابون گل
  shadow(50, 88, 30) + g(`<rect x="-26" y="-12" width="52" height="24" rx="8" fill="#ffc6d6" ${O}/><path d="M-20 -6 Q0 -14 20 -6" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/>` + rose(0, 2, 7), 'translate(50 66) rotate(-6)') +
    petal(24, 84, 7, -40) + petal(76, 82, 7, 30),
  // 6 دیگ گلاب‌گیری
  shadow(50, 92, 36) + `<path d="M22 92 H62 L58 82 H26 Z" fill="#7a4a2a" ${THIN}/><path d="M30 82 C30 76 54 76 54 82" fill="url(#gFire)"/>` + still(42, 80, 40) + sparkle(84, 20, 5),
  // 7 قرابه‌ی بزرگ
  shadow(50, 92, 32) + carboy(50, 90, 32) + `<path d="M44 26 h12" stroke="#c0392b" stroke-width="3"/>`,
  // 8 دستگاه گلاب‌گیری
  `<circle cx="50" cy="52" r="46" fill="url(#rGlow)" opacity=".5"/>` + shadow(50, 92, 42) +
    `<path d="M10 92 H52 L48 82 H14 Z" fill="#7a4a2a" ${THIN}/><path d="M18 82 C18 74 44 74 44 82" fill="url(#gFire)"/>` + still(31, 80, 34) +
    `<rect x="58" y="44" width="30" height="30" rx="3" fill="url(#gWater)" ${O}/><path d="M56 40 h4 v34 h-4" fill="none" stroke="#b05a2a" stroke-width="2.4"/>` +
    `<path d="M73 74 V80" stroke="#b05a2a" stroke-width="2.4"/>` + bottle(73, 94, 18) + rose(80, 26, 6) + sparkle(14, 20, 5),
];

const bush = (x: number, base: number, s: number, roses: number) =>
  g(`<path d="M0 0 C-18 -4 -26 -22 -14 -34 C-8 -48 10 -48 16 -34 C28 -22 20 -4 0 0 Z" fill="url(#gLeafDark)" ${O}/>` +
    Array.from({ length: 6 }, (_, i) => `<ellipse cx="${-12 + (i % 3) * 12}" cy="${-14 - Math.floor(i / 3) * 14}" rx="3" ry="5" fill="url(#gLeaf)" transform="rotate(${i * 30} ${-12 + (i % 3) * 12} ${-14 - Math.floor(i / 3) * 14})"/>`).join('') +
    [[-10, -28], [8, -32], [0, -16], [-14, -12], [14, -16], [2, -42]].slice(0, roses).map(([rx, ry]) => rose(rx, ry, 5)).join(''), `translate(${x} ${base}) scale(${s})`);

export const GEN_QAMSAR: string[] = [
  // نهال گل
  shadow(50, 88, 22) + `<path d="M36 72 H64 L60 88 H40 Z" fill="url(#gTerracotta)" ${O}/>` + bush(50, 72, 0.7, 1),
  // بوته‌ی گل محمدی
  shadow(50, 90, 30) + bush(50, 88, 1.1, 4),
  // باغچه‌ی گل محمدی
  `<circle cx="50" cy="52" r="44" fill="#ffe0ef" opacity=".55"/>` + shadow(50, 92, 42) + `<path d="M8 92 Q50 80 92 92 Z" fill="#8a6a3a"/>` +
    bush(28, 88, 0.8, 4) + bush(72, 88, 0.8, 4) + bush(50, 90, 1, 6) + sparkle(88, 22, 5),
];
