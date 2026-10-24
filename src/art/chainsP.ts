// Season 14: desert («کویر») chain and its generator (the saddlebag).

import { INK, O, THIN, g, shadow, shine, sparkle } from './kit';

/** A camel facing left; origin at its feet, about 60 wide and 52 tall. `pack` dresses the hump. */
export const camel = (x: number, base: number, s: number, pack = '') =>
  g(`<path d="M-16 -22 V0 M-10 -22 V0 M12 -22 V0 M18 -22 V0" stroke="#9a6a3a" stroke-width="3.4" stroke-linecap="round"/>` +
    `<path d="M24 -30 q6 4 4 12" fill="none" stroke="#9a6a3a" stroke-width="2"/>` +
    `<path d="M-20 -22 C-23 -32 -14 -38 -6 -36 C-2 -50 12 -50 14 -36 C22 -37 27 -30 24 -22 Z" fill="#d6a468" ${O}/>` +
    `<path d="M-17 -30 C-25 -31 -27 -41 -31 -47 L-26 -51 C-23 -45 -19 -39 -12 -35 Z" fill="#d6a468" ${O}/>` +
    `<ellipse cx="-33" cy="-49" rx="7" ry="4.4" transform="rotate(-14 -33 -49)" fill="#d6a468" ${O}/><circle cx="-33" cy="-51" r="1.1" fill="${INK}"/>` +
    pack, `translate(${x} ${base}) scale(${s})`);

const blanket = (fill: string) =>
  `<path d="M-8 -38 C-4 -48 10 -48 12 -38 L14 -28 H-10 Z" fill="${fill}" ${THIN}/><path d="M-10 -28 H14" stroke="#f6c945" stroke-width="2"/>`;

const dune = (y: number, fill: string) => `<path d="M8 ${y} Q30 ${y - 14} 60 ${y - 4} T92 ${y - 6} C90 88 72 96 50 96 C28 96 10 88 8 ${y} Z" fill="${fill}"/>`;

/** Saddlebag (خورجین): two pockets joined by a strap. */
const saddlebag = (x: number, base: number, w: number, fill: string, motif: string) =>
  `<path d="M${x - w / 2 + 4} ${base - w * 0.55} Q${x} ${base - w * 0.75} ${x + w / 2 - 4} ${base - w * 0.55}" fill="none" stroke="#8b5328" stroke-width="5"/>` +
  [x - w / 4, x + w / 4].map((cx) => `<path d="M${cx - w / 4} ${base - w * 0.55} H${cx + w / 4} V${base - 6} Q${cx} ${base + 2} ${cx - w / 4} ${base - 6} Z" fill="${fill}" ${O}/>` +
    `<path d="M${cx - w / 4} ${base - w * 0.4} H${cx + w / 4}" stroke="#f6c945" stroke-width="2"/>` + motif.replace(/CX/g, String(cx)).replace(/CY/g, String(base - w * 0.22))).join('');

const DIAMOND = `<path d="M CX CY m0 -6 l5 6 l-5 6 l-5 -6 Z" fill="#fffdf6" stroke="#4b2e1e" stroke-width=".8"/>`;

export const DESERT: string[] = [
  // 1 خرما
  shadow(50, 88, 24) + `<ellipse cx="50" cy="78" rx="28" ry="7" fill="url(#gCream)" ${O}/>` +
    [[38, 70], [50, 72], [62, 70], [44, 62], [56, 62], [50, 54]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="9" transform="rotate(${(i % 3) * 20 - 20} ${x} ${y})" fill="#7a3a1a" ${THIN}/>` + shine(x - 2, y - 3, 1.4, 3, 20, 0.6)).join(''),
  // 2 مشک آب
  shadow(50, 90, 26) + `<path d="M30 40 C20 50 22 80 40 86 C56 90 74 84 76 64 C78 48 66 38 52 40 Z" fill="#b8814a" ${O}/>` +
    `<path d="M48 40 L44 26 H56 L54 40" fill="#9a6a3a" ${THIN}/><rect x="42" y="20" width="16" height="7" rx="2" fill="#7a4a2a" ${THIN}/>` +
    `<path d="M32 56 q20 8 42 0" fill="none" stroke="#7a4a2a" stroke-width="1.4" opacity=".7"/><path d="M66 90 q3 4 0 6 q-3 -2 0 -6 Z" fill="#6cc0ea" stroke="#3a76c4" stroke-width=".8"/>` + shine(40, 58, 4, 10, 20, 0.5),
  // 3 زنگوله‌ی شتر
  shadow(50, 90, 18) + `<path d="M50 8 V30" stroke="#c0392b" stroke-width="6"/><path d="M47 8 V30" stroke="#f6c945" stroke-width="1.4"/>` +
    `<path d="M34 76 C34 50 38 34 50 32 C62 34 66 50 66 76 Z" fill="url(#gBrass)" ${O}/><path d="M30 76 H70" ${O} stroke-width="4"/>` +
    `<circle cx="50" cy="82" r="5" fill="url(#gBrass)" ${THIN}/><path d="M38 54 H62" stroke="#93661a" stroke-width="1.6"/>` +
    `<path d="M50 76 l-8 12 M50 76 l8 12 M50 76 v14" stroke="#e0303f" stroke-width="2"/>` + shine(42, 48, 2.4, 8, 10, 0.8),
  // 4 قطب‌نما
  shadow(50, 88, 26) + `<circle cx="50" cy="56" r="30" fill="url(#gBrass)" ${O}/><circle cx="50" cy="56" r="23" fill="#f6ead2" ${THIN}/>` +
    `<rect x="46" y="20" width="8" height="8" rx="2" fill="url(#gBrass)" ${THIN}/>` +
    [0, 90, 180, 270].map((a) => `<path d="M50 35 l2 5 h-4 Z" fill="${INK}" transform="rotate(${a} 50 56)"/>`).join('') +
    `<path d="M50 38 L55 56 L50 74 L45 56 Z" fill="#e0303f" ${THIN} stroke-width="1"/><path d="M50 56 L55 56 L50 74 L45 56 Z" fill="#fffdf6" ${THIN} stroke-width="1"/><circle cx="50" cy="56" r="2.4" fill="url(#gGold)" ${THIN} stroke-width=".8"/>`,
  // 5 ساعت آفتابی
  shadow(50, 90, 32) + `<path d="M22 84 H78 L74 76 H26 Z" fill="url(#gTerracotta)" ${O}/><ellipse cx="50" cy="66" rx="32" ry="12" fill="#e8d3a8" ${O}/>` +
    Array.from({ length: 9 }, (_, i) => { const a = Math.PI + (i / 8) * Math.PI; return `<path d="M${50 + Math.cos(a) * 22} ${66 + Math.sin(a) * 8} L${50 + Math.cos(a) * 28} ${66 + Math.sin(a) * 10.4}" stroke="${INK}" stroke-width="1.2"/>`; }).join('') +
    `<path d="M50 66 L50 38 L64 66 Z" fill="url(#gBrass)" ${THIN}/><path d="M50 66 L28 74" stroke="#9b8a76" stroke-width="3" opacity=".6"/>` +
    `<circle cx="80" cy="22" r="9" fill="#f6c945" ${THIN}/>` + [0, 60, 120, 180, 240, 300].map((a) => `<path d="M80 9 V5" stroke="#f6c945" stroke-width="2" transform="rotate(${a} 80 22)"/>`).join(''),
  // 6 نقشه‌ی جاده‌ی ابریشم
  shadow(50, 88, 36) + `<rect x="18" y="30" width="64" height="48" fill="#f2deb0" ${O}/>` +
    `<rect x="10" y="26" width="10" height="56" rx="5" fill="url(#gWood)" ${O}/><rect x="80" y="26" width="10" height="56" rx="5" fill="url(#gWood)" ${O}/>` +
    `<path d="M24 66 C34 52 42 64 50 50 S66 46 74 38" fill="none" stroke="#c0392b" stroke-width="1.8" stroke-dasharray="3 2"/>` +
    [[24, 66], [50, 50], [74, 38]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#c0392b" ${THIN} stroke-width=".8"/>`).join('') +
    `<path d="M30 42 q4 -6 8 0 M58 64 q5 -7 10 0" fill="none" stroke="#9b8a76" stroke-width="1.4"/>` + camel(62, 72, 0.18),
  // 7 اسطرلاب
  `<circle cx="50" cy="54" r="44" fill="url(#rGlow)" opacity=".4"/>` + shadow(50, 92, 26) +
    `<path d="M50 10 V20" ${O} stroke-width="3"/><circle cx="50" cy="10" r="4" fill="none" stroke="url(#gBrass)" stroke-width="3"/>` +
    `<circle cx="50" cy="54" r="32" fill="url(#gBrass)" ${O}/><circle cx="50" cy="54" r="25" fill="#c9a24a" ${THIN}/>` +
    `<path d="M30 54 Q50 32 70 54 M34 64 Q50 46 66 64" fill="none" stroke="#7a5a1a" stroke-width="1.2"/>` +
    Array.from({ length: 24 }, (_, i) => `<path d="M50 23 V26" stroke="${INK}" stroke-width="1" transform="rotate(${i * 15} 50 54)"/>`).join('') +
    `<path d="M26 54 L74 54" stroke="#5e3418" stroke-width="2.4"/><path d="M50 30 l4 18 l-4 6 l-4 -6 Z" fill="url(#gGold)" ${THIN} stroke-width=".8"/>` + shine(38, 40, 4, 8, 30, 0.6) + sparkle(84, 22, 5),
  // 8 کاروان شتر
  `<circle cx="50" cy="50" r="46" fill="#ffd9a0" opacity=".7"/><circle cx="66" cy="36" r="12" fill="#f6a03a" opacity=".85"/>` +
    dune(78, '#e8b46a') + dune(86, '#d9984a') + camel(68, 84, 0.62, blanket('url(#gRed)')) + camel(30, 82, 0.5, blanket('url(#gTurq)')) +
    `<path d="M48 64 Q42 60 40 66" fill="none" stroke="#8b5328" stroke-width="1.2"/>` + sparkle(14, 20, 5) + sparkle(88, 14, 5),
];

export const GEN_DESERT: string[] = [
  // خورجین کوچک
  shadow(50, 90, 28) + saddlebag(50, 86, 56, 'url(#gRed)', DIAMOND),
  // خورجین
  shadow(50, 90, 36) + saddlebag(50, 86, 72, 'url(#gCarpet)', DIAMOND) + sparkle(86, 30, 5),
  // بار شتر
  `<circle cx="50" cy="52" r="44" fill="#ffe7b8" opacity=".6"/>` + shadow(50, 92, 36) + camel(54, 90, 1.05, blanket('url(#gRed)') + `<rect x="-12" y="-52" width="10" height="10" rx="2" fill="url(#gWicker)" ${THIN}/><rect x="2" y="-52" width="12" height="10" rx="2" fill="url(#gCarpet)" ${THIN}/>`),
];
