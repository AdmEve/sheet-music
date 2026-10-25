// Season 4: baby things («سیسمونی») chain and its generator (knitting basket).

import { INK, O, THIN, g, shadow, shine, sparkle } from './kit';

const yarn = (x: number, y: number, r: number, fill: string) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${O}/>` +
  `<path d="M${x - r * 0.8} ${y - r * 0.2} Q${x} ${y - r * 0.9} ${x + r * 0.8} ${y - r * 0.3} M${x - r * 0.7} ${y + r * 0.3} Q${x} ${y - r * 0.3} ${x + r * 0.9} ${y + r * 0.2}" fill="none" stroke="#fff" stroke-width="1.4" opacity=".6"/>`;

const onesie = (x: number, y: number, s: number, fill: string) =>
  g(`<path d="M-18 -20 L-8 -24 Q0 -16 8 -24 L18 -20 L26 -6 L16 -2 L16 26 Q0 32 -16 26 L-16 -2 L-26 -6 Z" fill="${fill}" ${O}/>` +
    `<circle cx="0" cy="-6" r="2" fill="#fff" ${THIN} stroke-width="1"/><circle cx="0" cy="4" r="2" fill="#fff" ${THIN} stroke-width="1"/>` +
    `<path d="M-6 16 l12 0" stroke="#fff" stroke-width="2" opacity=".7"/>`, `translate(${x} ${y}) scale(${s})`);

const basket = (y = 54) =>
  `<path d="M16 ${y} L84 ${y} L76 ${y + 32} L24 ${y + 32} Z" fill="url(#gWicker)" ${O}/>` +
  [0, 1, 2].map((k) => `<path d="M${19 + k} ${y + 9 + k * 9} L${81 - k} ${y + 9 + k * 9}" stroke="#8a5a22" stroke-width="1.5" opacity=".7"/>`).join('') +
  `<rect x="13" y="${y - 4}" width="74" height="8" rx="4" fill="url(#gWicker)" ${O}/>`;

export const BABY: string[] = [
  // 1 جغجغه
  shadow(50, 86, 20) + g(`<circle cx="0" cy="-16" r="13" fill="url(#gYellow)" ${O}/><circle cx="-4" cy="-20" r="3" fill="#fff" opacity=".8"/>` +
    `<rect x="-3" y="-4" width="6" height="26" rx="3" fill="url(#gRose)" ${O}/><circle cx="0" cy="24" r="5" fill="url(#gTurq)" ${O}/>`, 'translate(50 60) rotate(-20)') +
    `<path d="M70 30 q4 -4 8 0 M74 40 q4 -3 7 1" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`,
  // 2 جوراب بچه
  shadow(50, 86, 28) + [[38, -8, 'url(#gSky)'], [62, 8, 'url(#gRose)']].map(([x, r, f]) =>
    g(`<path d="M-8 -22 L8 -22 L8 6 Q8 16 -2 16 L-14 16 Q-20 16 -20 10 Q-20 4 -12 4 L-8 4 Z" fill="${f}" ${O}/><path d="M-8 -16 H8 M-8 -11 H8" stroke="#fff" stroke-width="2"/>`, `translate(${x} 64) rotate(${r})`)).join(''),
  // 3 کلاه بافتنی
  shadow(50, 84, 28) + `<path d="M24 70 C24 40 76 40 76 70 Z" fill="url(#gTurq)" ${O}/><rect x="22" y="66" width="56" height="12" rx="5" fill="#fffdf6" ${O}/>` +
    `<path d="M30 70 V76 M38 70 V76 M46 70 V76 M54 70 V76 M62 70 V76 M70 70 V76" stroke="#d8c8a8" stroke-width="1.6"/>` +
    `<circle cx="50" cy="38" r="8" fill="#fffdf6" ${O}/>` + [[36, 58], [50, 52], [64, 58]].map(([x, y]) => `<path d="M${x - 4} ${y} l4 -4 l4 4" fill="none" stroke="#fff" stroke-width="1.6"/>`).join(''),
  // 4 لباس بچه
  shadow(50, 88, 28) + onesie(50, 58, 1.15, 'url(#gYellow)') + `<path d="M40 50 q10 6 20 0" fill="none" stroke="#e0303f" stroke-width="2"/>`,
  // 5 عروسک نمدی
  shadow(50, 90, 24) + `<path d="M34 86 L38 60 Q50 54 62 60 L66 86 Z" fill="url(#gRose)" ${O}/>` +
    // Pigtails with turquoise ribbons.
    `<circle cx="35" cy="50" r="6.4" fill="#6a3a1a" ${THIN}/><circle cx="65" cy="50" r="6.4" fill="#6a3a1a" ${THIN}/><path d="M30 44 l5 4 l-5 4 Z M70 44 l-5 4 l5 4 Z" fill="url(#gTurq)" ${THIN} stroke-width="1"/>` +
    `<path d="M37 48 C35 33 43 30 50 30 C57 30 65 33 63 48 Z" fill="#6a3a1a" ${THIN}/>` +
    `<circle cx="50" cy="46" r="12" fill="#f3c7a0" ${O}/><path d="M39 42 Q42 34 50 34 Q58 34 61 42 Q56 38 50 38 Q44 38 39 42 Z" fill="#6a3a1a" ${THIN}/>` +
    `<circle cx="45" cy="47" r="1.6" fill="${INK}"/><circle cx="55" cy="47" r="1.6" fill="${INK}"/><path d="M46 52 q4 3 8 0" fill="none" ${THIN} stroke-width="1.4"/>` +
    `<path d="M38 66 L28 74 M62 66 L72 74" ${O} stroke-width="4"/>` + [44, 50, 56].map((x) => `<path d="M${x} 70 v10" stroke="#fff" stroke-width="1.2" stroke-dasharray="2 2"/>`).join(''),
  // 6 پتوی بچه
  shadow(50, 88, 34) + `<path d="M16 46 L84 46 L84 80 L16 80 Z" fill="url(#gSky)" ${O}/>` +
    [24, 36, 48, 60, 72].map((x, i) => `<path d="M${x} 52 l4 8 l4 -8" fill="none" stroke="#fff" stroke-width="2" opacity="${i % 2 ? 0.6 : 0.9}"/>`).join('') +
    `<path d="M16 66 C30 58 40 74 50 66 C60 58 70 74 84 66 L84 80 L16 80 Z" fill="url(#gYellow)" ${THIN} opacity=".85"/>` +
    `<path d="M16 46 Q50 36 84 46" fill="none" stroke="#fffdf6" stroke-width="3"/>`,
  // 7 گهواره
  shadow(50, 92, 36) + `<path d="M14 80 Q50 98 86 80" fill="none" ${O} stroke-width="4"/>` +
    `<path d="M20 52 L80 52 L76 80 L24 80 Z" fill="url(#gWood)" ${O}/>` + [30, 40, 50, 60, 70].map((x) => `<path d="M${x} 54 V78" stroke="#8b5328" stroke-width="2"/>`).join('') +
    `<path d="M16 50 Q16 34 28 32 L28 52 Z M84 50 Q84 34 72 32 L72 52 Z" fill="url(#gWood)" ${O}/>` +
    `<path d="M26 52 Q50 42 74 52 L70 62 Q50 56 30 62 Z" fill="url(#gRose)" ${THIN}/>` + sparkle(82, 24, 5),
  // 8 کالسکه
  `<circle cx="50" cy="52" r="44" fill="url(#rGlow)" opacity=".55"/>` + shadow(50, 92, 34) +
    `<path d="M24 46 L76 46 C76 70 64 76 50 76 C36 76 24 70 24 46 Z" fill="url(#gTurq)" ${O}/>` +
    `<path d="M24 46 C24 22 52 18 60 24 L50 46 Z" fill="url(#gRose)" ${O}/><path d="M30 40 Q40 30 52 30" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/>` +
    `<path d="M76 46 L88 30" ${O} stroke-width="4"/><path d="M84 30 H94" ${O} stroke-width="4"/>` +
    `<circle cx="34" cy="84" r="8" fill="url(#gSteel)" ${O}/><circle cx="66" cy="84" r="8" fill="url(#gSteel)" ${O}/><circle cx="34" cy="84" r="2.4" fill="${INK}"/><circle cx="66" cy="84" r="2.4" fill="${INK}"/>` +
    shine(36, 56, 3, 8, 20, 0.6) + sparkle(14, 30, 5),
];

export const GEN_BABY: string[] = [
  // سبد کاموای کوچک
  shadow(50, 92, 30) + yarn(36, 46, 11, 'url(#gRose)') + yarn(60, 44, 12, 'url(#gSky)') + basket(52) +
    `<path d="M66 40 L84 18 M70 42 L90 24" stroke="url(#gSteel)" stroke-width="3" stroke-linecap="round"/>`,
  // سبد کاموا
  shadow(50, 92, 34) + yarn(30, 46, 11, 'url(#gYellow)') + yarn(50, 40, 13, 'url(#gRose)') + yarn(70, 46, 11, 'url(#gLeaf)') + basket(52) +
    `<path d="M50 40 Q66 20 86 30" fill="none" stroke="#e2507a" stroke-width="2"/>`,
  // صندوق بافتنی
  shadow(50, 94, 40) + `<rect x="14" y="44" width="72" height="44" rx="5" fill="url(#gWood)" ${O}/><path d="M14 58 H86" ${THIN}/>` +
    yarn(28, 40, 10, 'url(#gSky)') + yarn(48, 34, 12, 'url(#gRose)') + yarn(70, 40, 10, 'url(#gYellow)') + onesie(50, 72, 0.4, 'url(#gLeaf)') +
    `<rect x="44" y="50" width="12" height="8" rx="2" fill="url(#gGold)" ${THIN}/>` + sparkle(88, 24, 5),
];
