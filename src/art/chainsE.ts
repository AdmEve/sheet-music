// Season 3: letters & post chain and its generator (writing desk).

import { INK, O, THIN, g, shadow, shine, sparkle } from './kit';

const envelope = (x: number, y: number, s = 1, fill = 'url(#gPaper)', rot = 0) =>
  g(
    `<rect x="-24" y="-15" width="48" height="30" rx="3" fill="${fill}" ${O}/>` +
      `<path d="M-24 -15 L0 4 L24 -15" fill="none" ${THIN}/><path d="M-24 15 L-6 0 M24 15 L6 0" fill="none" ${THIN} opacity=".5"/>`,
    `translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  );

const stamp = (x: number, y: number, s = 1, fill = 'url(#gTurq)') =>
  g(
    `<rect x="-14" y="-17" width="28" height="34" fill="#fffdf6" ${THIN}/>` +
      Array.from({ length: 5 }, (_, i) => `<circle cx="${-11 + i * 5.5}" cy="-17" r="1.6" fill="#f6ead2"/><circle cx="${-11 + i * 5.5}" cy="17" r="1.6" fill="#f6ead2"/>`).join('') +
      `<rect x="-10" y="-13" width="20" height="22" fill="${fill}"/>` +
      `<path d="M-6 9 V-1 A6 6 0 0 1 6 -1 V9 Z" fill="url(#gGold)" stroke="${INK}" stroke-width="1"/><path d="M0 -7 V-11" stroke="${INK}" stroke-width="1"/>`,
    `translate(${x} ${y}) scale(${s})`,
  );

const seal = (x: number, y: number, r = 6) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#c0392b" ${THIN}/><circle cx="${x}" cy="${y}" r="${r * 0.55}" fill="none" stroke="#8e1a24" stroke-width="1.2"/>` +
  `<path d="M${x - r * 0.9} ${y + r * 0.6} l-3 4 M${x + r * 0.9} ${y + r * 0.6} l3 4" stroke="#c0392b" stroke-width="2" stroke-linecap="round"/>`;

const desk = (w: number, top: string) =>
  `<rect x="${50 - w / 2}" y="56" width="${w}" height="8" rx="2" fill="url(#gWoodDark)" ${O}/>` +
  `<rect x="${50 - w / 2 + 4}" y="64" width="${w - 8}" height="20" fill="url(#gWood)" ${O}/>` +
  `<path d="M${50 - w / 2 + 8} 84 V92 M${50 + w / 2 - 8} 84 V92" ${O} stroke-width="5"/>` +
  `<rect x="${50 - 10}" y="70" width="20" height="8" rx="2" fill="url(#gWoodDark)" ${THIN}/><circle cx="50" cy="74" r="1.6" fill="url(#gGold)"/>` +
  top;

export const POST: string[] = [
  // 1 مداد
  shadow(50, 80, 26) + g(`<rect x="-30" y="-6" width="52" height="12" rx="2" fill="url(#gYellow)" ${O}/><path d="M22 -6 L36 0 L22 6 Z" fill="#f2d2a2" ${O}/><path d="M32 -2 L36 0 L32 2 Z" fill="${INK}"/>` +
    `<rect x="-36" y="-6" width="8" height="12" rx="2" fill="url(#gRose)" ${O}/><path d="M-28 -6 V6" stroke="url(#gSilver)" stroke-width="3"/><path d="M-24 -2 H20" stroke="#fff" stroke-width="1.6" opacity=".6"/>`, 'translate(50 60) rotate(-25)'),
  // 2 کاغذ نامه
  shadow(50, 86, 26) + `<path d="M26 18 L74 18 L74 84 L26 84 Z" fill="#fffdf6" ${O} transform="rotate(-6 50 50)"/>` +
    Array.from({ length: 7 }, (_, i) => `<path d="M32 ${30 + i * 8} Q50 ${28 + i * 8} 68 ${30 + i * 8}" fill="none" stroke="#7a8aa8" stroke-width="1.4" transform="rotate(-6 50 50)"/>`).join(''),
  // 3 پاکت نامه
  shadow(50, 80, 30) + envelope(50, 58, 1.25),
  // 4 تمبر
  shadow(50, 84, 22) + stamp(50, 56, 1.45) + sparkle(76, 28, 5),
  // 5 نامه‌ی لاک‌ومهر
  shadow(50, 82, 30) + envelope(50, 58, 1.25, 'url(#gCream)') + seal(50, 62, 8),
  // 6 دسته‌ی نامه
  shadow(50, 86, 32) + envelope(50, 72, 1, 'url(#gPaper)', -8) + envelope(52, 60, 1, 'url(#gCream)', 6) + envelope(48, 48, 1, '#fffdf6', -4) +
    `<path d="M50 24 V92 M18 58 H82" stroke="#a5621f" stroke-width="3"/><path d="M44 40 q6 -8 12 0 q-6 6 -12 0 Z" fill="none" stroke="#a5621f" stroke-width="2.4"/>`,
  // 7 بسته‌ی پستی
  shadow(50, 88, 34) + `<path d="M18 40 L50 28 L82 40 L82 78 L50 90 L18 78 Z" fill="#c9a26b" ${O}/><path d="M18 40 L50 52 L82 40 M50 52 V90" fill="none" ${THIN}/>` +
    `<path d="M34 34 L66 46 V84 M66 46 L34 58" fill="none" stroke="#8a5a22" stroke-width="2.6"/>` + g(stamp(0, 0, 0.5), 'translate(28 62) skewY(20)') + seal(70, 70, 4),
  // 8 صندوق پست
  `<circle cx="50" cy="50" r="44" fill="url(#rGlow)" opacity=".55"/>` + shadow(50, 92, 22) +
    `<path d="M47 92 V72" ${O} stroke-width="6"/><path d="M26 30 C26 14 74 14 74 30 V72 H26 Z" fill="url(#gYellow)" ${O}/>` +
    `<rect x="26" y="40" width="48" height="10" fill="url(#gBlue)" ${THIN}/><rect x="36" y="28" width="28" height="5" rx="2" fill="${INK}"/>` +
    g(`<path d="M-10 4 C-10 -4 -3 -7 3 -4 L10 -7 L10 7 L3 4 C-3 7 -10 5 -10 4 Z" fill="#fff" ${THIN}/>`, 'translate(50 60)') + shine(34, 26, 3, 8, 15, 0.6) + sparkle(84, 20, 6) + sparkle(16, 40, 4),
];

export const GEN_POST: string[] = [
  // میز تحریر کوچک
  shadow(50, 94, 30) + desk(60, `<rect x="30" y="44" width="16" height="12" rx="3" fill="url(#gBlue)" ${O}/><path d="M38 44 L46 22" stroke="#e9e9e9" stroke-width="2"/><path d="M52 50 L68 46 L70 54 L54 56 Z" fill="#fffdf6" ${THIN}/>`),
  // میز تحریر با چراغ
  shadow(50, 94, 36) + desk(70, `<path d="M70 56 V30 L58 22" fill="none" ${O} stroke-width="3"/><path d="M50 18 L66 14 L64 30 Z" fill="url(#gTurq)" ${O}/>` +
    `<circle cx="58" cy="28" r="10" fill="url(#rGlow)" opacity=".8"/>` + envelope(38, 50, 0.45) + `<rect x="22" y="44" width="10" height="12" rx="2" fill="url(#gNavy)" ${THIN}/>`),
  // میز تحریر چوبی با ماشین تحریر
  shadow(50, 94, 42) + desk(82, `<path d="M30 56 L32 40 L68 40 L70 56 Z" fill="#2a2a2a" ${O}/><rect x="36" y="22" width="28" height="20" fill="#fffdf6" ${THIN}/>` +
    `<path d="M40 28 h20 M40 33 h16" stroke="#7a8aa8" stroke-width="1.4"/>` + Array.from({ length: 6 }, (_, i) => `<circle cx="${38 + i * 5}" cy="50" r="1.8" fill="#ddd"/>`).join('') +
    `<rect x="12" y="44" width="14" height="12" rx="2" fill="url(#gBrass)" ${THIN}/>`) + sparkle(84, 24, 5),
];
