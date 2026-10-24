// Season 5: lamps («چراغ») chain and its generator (the coppersmith's anvil).

import { INK, O, THIN, g, shadow, shine, sparkle } from './kit';

const flame = (x: number, y: number, s = 1) =>
  g(`<path d="M0 -14 C5 -8 7 -4 6 0 C5 4 -5 4 -6 0 C-7 -4 -3 -7 0 -14 Z" fill="url(#gFire)" ${THIN} stroke-width="1"/><path d="M0 -6 C2 -4 3 -2 2 0 C1 2 -1 2 -2 0 C-3 -2 -1 -3 0 -6 Z" fill="#fff6c8"/>`,
    `translate(${x} ${y}) scale(${s})`);

const halo = (x: number, y: number, r: number, op = 0.7) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#rGlow)" opacity="${op}"/>`;

export const LAMP: string[] = [
  // 1 کبریت
  shadow(50, 84, 24) + g(`<rect x="-22" y="-14" width="44" height="28" rx="3" fill="url(#gRed)" ${O}/><rect x="-22" y="-4" width="44" height="8" fill="#fffdf6" ${THIN}/>` +
    `<path d="M-14 0 h28" stroke="${INK}" stroke-width="1.4" stroke-dasharray="2 2"/>`, 'translate(46 68) rotate(-8)') +
    `<path d="M62 50 L80 30" stroke="#f2d3a0" stroke-width="3.4" stroke-linecap="round"/><circle cx="81" cy="29" r="4" fill="url(#gRed)" ${THIN}/>`,
  // 2 شمع
  shadow(50, 88, 20) + halo(50, 30, 22, 0.6) + `<rect x="40" y="38" width="20" height="42" rx="3" fill="#fffdf6" ${O}/><path d="M42 44 q4 6 0 12" fill="none" stroke="#e8dcc6" stroke-width="2"/>` +
    `<ellipse cx="50" cy="82" rx="18" ry="5" fill="url(#gBrass)" ${O}/><path d="M50 38 V32" ${THIN}/>` + flame(50, 32, 1.1),
  // 3 پیه‌سوز (clay oil lamp)
  shadow(50, 86, 28) + halo(74, 46, 18, 0.6) + `<path d="M20 64 C20 50 40 46 56 50 L78 56 C82 58 82 62 78 64 L56 68 C40 76 20 76 20 64 Z" fill="url(#gTerracotta)" ${O}/>` +
    `<ellipse cx="38" cy="56" rx="10" ry="3" fill="#5a3a1a" ${THIN}/><path d="M20 62 C10 58 10 72 22 70" fill="none" ${O} stroke-width="3"/>` + flame(78, 54, 0.9) + shine(32, 62, 3, 6, 40, 0.5),
  // 4 فانوس
  shadow(50, 90, 18) + halo(50, 52, 26, 0.7) + `<path d="M50 10 V20" ${O}/><path d="M38 20 H62 L66 28 H34 Z" fill="url(#gCopper)" ${O}/>` +
    `<path d="M34 28 H66 L62 76 H38 Z" fill="#ffe7a0" ${O}/><path d="M44 28 L42 76 M56 28 L58 76" stroke="${INK}" stroke-width="1.6" opacity=".6"/>` +
    `<rect x="34" y="76" width="32" height="8" rx="2" fill="url(#gCopper)" ${O}/>` + flame(50, 60, 1),
  // 5 چراغ گردسوز (round-wick kerosene lamp)
  shadow(50, 90, 24) + halo(50, 34, 24, 0.6) + `<path d="M30 84 C26 70 30 58 50 56 C70 58 74 70 70 84 Z" fill="url(#gTurq)" ${O}/>` +
    `<rect x="40" y="48" width="20" height="10" rx="2" fill="url(#gBrass)" ${O}/><path d="M42 48 C34 40 36 22 44 14 H56 C64 22 66 40 58 48 Z" fill="url(#gGlass)" fill-opacity=".7" ${O}/>` +
    flame(50, 40, 1.1) + `<circle cx="64" cy="54" r="3" fill="url(#gBrass)" ${THIN}/>` + shine(38, 72, 3, 7, 30, 0.6),
  // 6 چراغ توری (pressure lamp)
  shadow(50, 92, 26) + halo(50, 46, 30, 0.75) + `<path d="M40 14 H60 L66 24 H34 Z" fill="url(#gSteel)" ${O}/><path d="M48 14 V8 H52 V14" ${THIN}/>` +
    `<path d="M34 24 H66 V58 H34 Z" fill="url(#gGlass)" fill-opacity=".6" ${O}/><ellipse cx="50" cy="42" rx="8" ry="10" fill="#fff6c8" ${THIN}/>` +
    `<path d="M30 58 H70 L74 88 H26 Z" fill="url(#gRed)" ${O}/><circle cx="74" cy="70" r="4" fill="url(#gBrass)" ${THIN}/><path d="M74 70 H84" ${O} stroke-width="3"/>` + shine(36, 74, 3, 8, 20, 0.5),
  // 7 لاله‌ی شیشه‌ای (glass tulip lamp)
  shadow(50, 92, 22) + halo(50, 40, 26, 0.6) + `<path d="M38 90 H62 L58 80 H42 Z" fill="url(#gBrass)" ${O}/><path d="M50 80 V60" ${O} stroke="url(#gBrass)" stroke-width="4"/>` +
    `<path d="M34 22 C30 40 38 58 50 60 C62 58 70 40 66 22 C60 30 56 18 50 14 C44 18 40 30 34 22 Z" fill="#e0303f" fill-opacity=".8" ${O}/>` +
    `<path d="M40 30 C38 40 42 50 48 54" fill="none" stroke="#fff" stroke-width="2.4" opacity=".6"/>` + flame(50, 46, 0.9) + sparkle(78, 20, 5),
  // 8 چلچراغ (chandelier)
  `<circle cx="50" cy="50" r="46" fill="url(#rGlow)" opacity=".6"/>` + `<path d="M50 4 V20" ${O}/>` +
    `<path d="M20 44 Q50 64 80 44" fill="none" ${O} stroke="url(#gGold)" stroke-width="4"/><path d="M30 34 Q50 48 70 34" fill="none" ${O} stroke="url(#gGold)" stroke-width="3"/>` +
    `<path d="M50 20 V58" ${O} stroke="url(#gGold)" stroke-width="4"/>` +
    [[20, 44], [36, 50], [64, 50], [80, 44], [30, 34], [70, 34], [50, 42]].map(([x, y]) => `<rect x="${x - 3}" y="${y - 10}" width="6" height="10" rx="1" fill="#fffdf6" ${THIN} stroke-width="1"/>` + flame(x, y - 10, 0.6)).join('') +
    [26, 38, 50, 62, 74].map((x, i) => `<path d="M${x} ${52 + (i % 2) * 4} l-3 8 l3 6 l3 -6 Z" fill="url(#gGlass)" ${THIN} stroke-width="1"/>`).join('') +
    `<circle cx="50" cy="66" r="5" fill="url(#gGold)" ${THIN}/>` + sparkle(12, 20, 5) + sparkle(88, 26, 6),
];

const anvil = (y: number, s = 1) =>
  g(`<path d="M-30 -10 H24 C36 -10 40 -4 44 -2 C36 0 30 2 24 2 H14 L10 14 H22 V22 H-22 V14 H-10 L-14 2 H-30 Z" fill="url(#gSteel)" ${O}/>` +
    `<path d="M-26 -6 H20" stroke="#fff" stroke-width="2" opacity=".5"/>`, `translate(50 ${y}) scale(${s})`);

const hammer = (x: number, y: number, rot: number) =>
  g(`<path d="M0 0 V-30" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M0 0 V-30" stroke="#c99a5a" stroke-width="2.6" stroke-linecap="round"/><rect x="-10" y="-38" width="20" height="9" rx="2" fill="url(#gSteel)" ${THIN}/>`,
    `translate(${x} ${y}) rotate(${rot})`);

export const GEN_LAMP: string[] = [
  // سندان کوچک
  shadow(50, 90, 30) + anvil(70, 0.9) + hammer(70, 56, 24),
  // سندان مسگری
  shadow(50, 90, 36) + anvil(70, 1) + hammer(74, 54, 24) +
    `<path d="M20 48 Q30 30 44 44 Z" fill="url(#gCopper)" ${THIN}/>` + `<path d="M58 40 l4 -6 M64 44 l6 -4" stroke="#ffd36b" stroke-width="2" stroke-linecap="round"/>`,
  // کارگاه مسگری
  shadow(50, 92, 40) + `<rect x="12" y="20" width="76" height="8" rx="2" fill="url(#gWoodDark)" ${O}/>` +
    [24, 42, 60, 76].map((x, i) => `<path d="M${x} 28 v6" ${THIN}/><path d="M${x - 7} 34 h14 l-2 ${8 + (i % 2) * 4} h-10 Z" fill="url(#gCopper)" ${THIN}/>`).join('') +
    anvil(76, 0.9) + hammer(76, 60, 24) + sparkle(14, 56, 5) + sparkle(88, 60, 4),
];
