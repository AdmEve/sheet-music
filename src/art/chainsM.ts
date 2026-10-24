// Season 11: calligraphy («خوشنویسی») chain and its generator (the calligrapher's desk).

import { INK, O, THIN, g, shadow, shine, sparkle } from './kit';

const reed = (x: number, y: number, rot: number, s = 1) =>
  g(`<path d="M-3 -30 H3 V18 L0 26 L-3 18 Z" fill="#d8b860" ${THIN}/><path d="M-3 -10 H3 M-3 6 H3" stroke="#a8883a" stroke-width="1.4"/><path d="M-1 22 L0 26 L1 22 Z" fill="${INK}"/>`,
    `translate(${x} ${y}) rotate(${rot}) scale(${s})`);

/** A calligraphic stroke cluster suggesting nastaliq script (not real words). */
const script = (x: number, y: number, w: number, color = INK) =>
  `<path d="M${x} ${y} q${w * 0.12} ${-w * 0.14} ${w * 0.24} 0 q${w * 0.1} ${-w * 0.1} ${w * 0.2} ${w * 0.02} q${w * 0.14} ${-w * 0.12} ${w * 0.28} ${w * 0.04}" fill="none" stroke="${color}" stroke-width="${Math.max(1.4, w * 0.05)}" stroke-linecap="round"/>` +
  `<circle cx="${x + w * 0.3}" cy="${y - w * 0.16}" r="${Math.max(1, w * 0.03)}" fill="${color}"/><path d="M${x + w * 0.78} ${y - w * 0.02} q${w * 0.08} ${-w * 0.2} ${w * 0.2} ${-w * 0.16}" fill="none" stroke="${color}" stroke-width="${Math.max(1.2, w * 0.04)}" stroke-linecap="round"/>`;

const gilded = (x: number, y: number, w: number, h: number) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="url(#gGold)" stroke-width="3"/>` +
  [[x, y], [x + w, y], [x, y + h], [x + w, y + h]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="3" fill="url(#gGold)" ${THIN} stroke-width=".8"/>`).join('');

export const CALLIGRAPHY: string[] = [
  // 1 قلم نی
  shadow(50, 86, 18) + reed(50, 54, 30, 1.2),
  // 2 دوات و لیقه
  shadow(50, 88, 24) + `<path d="M34 54 H66 L62 82 H38 Z" fill="url(#gNavy)" ${O}/><ellipse cx="50" cy="54" rx="16" ry="5" fill="#1b1b1b" ${THIN}/>` +
    `<path d="M44 52 q6 -6 12 0" fill="none" stroke="#c9a26b" stroke-width="2"/>` + reed(70, 46, 24, 0.8) + shine(40, 66, 2, 6, 10, 0.5),
  // 3 کاغذ آهارمهره
  shadow(50, 88, 30) + `<rect x="24" y="30" width="52" height="56" fill="#f6e3b0" ${O}/><path d="M24 30 L76 30 L70 38 L30 38 Z" fill="#e8d3a8" opacity=".6"/>` + shine(36, 44, 4, 10, 20, 0.7),
  // 4 سیاه‌مشق
  shadow(50, 90, 30) + `<rect x="20" y="24" width="60" height="64" fill="#f6e3b0" ${O}/>` +
    Array.from({ length: 5 }, (_, i) => script(26 + (i % 2) * 6, 40 + i * 10, 44)).join(''),
  // 5 قطعه‌ی نستعلیق
  shadow(50, 90, 30) + `<rect x="18" y="26" width="64" height="58" fill="url(#gCream)" ${O}/><rect x="24" y="32" width="52" height="46" fill="#fffdf6" ${THIN}/>` +
    script(30, 52, 40) + script(34, 68, 32) + `<path d="M24 44 l6 -6 M76 44 l-6 -6 M24 66 l6 6 M76 66 l-6 6" stroke="url(#gBlue)" stroke-width="2"/>`,
  // 6 تابلوی خوشنویسی
  shadow(50, 92, 32) + `<rect x="14" y="20" width="72" height="68" rx="2" fill="url(#gWoodDark)" ${O}/><rect x="20" y="26" width="60" height="56" fill="#f6e3b0" ${THIN}/>` +
    gilded(26, 32, 48, 44) + script(32, 54, 36) + script(36, 68, 28) + `<circle cx="50" cy="40" r="3" fill="url(#gBlue)"/>`,
  // 7 کتاب مذهّب (illuminated book)
  shadow(50, 90, 34) + `<path d="M50 30 C40 24 24 24 16 28 V82 C24 78 40 78 50 84 Z" fill="#fffdf6" ${O}/><path d="M50 30 C60 24 76 24 84 28 V82 C76 78 60 78 50 84 Z" fill="#fffdf6" ${O}/>` +
    `<path d="M22 34 C30 32 40 32 46 36 V48 C40 44 30 44 22 46 Z" fill="url(#gBlue)" ${THIN} stroke-width="1"/><path d="M54 36 C60 32 70 32 78 34 V46 C70 44 60 44 54 48 Z" fill="url(#gBlue)" ${THIN} stroke-width="1"/>` +
    gilded(24, 34, 20, 12) + gilded(56, 34, 20, 12) + script(24, 62, 20) + script(56, 62, 20) + script(26, 72, 16) + script(58, 72, 16),
  // 8 کتیبه‌ی طلایی
  `<circle cx="50" cy="52" r="46" fill="url(#rGlow)" opacity=".6"/>` + shadow(50, 90, 40) +
    `<rect x="8" y="34" width="84" height="40" rx="4" fill="url(#gNavy)" ${O}/><rect x="13" y="39" width="74" height="30" rx="2" fill="none" stroke="url(#gGold)" stroke-width="2"/>` +
    script(20, 58, 60, '#f6c945') + `<path d="M50 34 L58 26 L50 20 L42 26 Z" fill="url(#gGold)" ${THIN}/>` + sparkle(14, 22, 5) + sparkle(88, 18, 6),
];

export const GEN_CALLIGRAPHY: string[] = [
  // جعبه‌ی قلم
  shadow(50, 88, 30) + `<rect x="20" y="58" width="60" height="22" rx="10" fill="url(#gRed)" ${O}/><rect x="28" y="58" width="44" height="22" fill="url(#gGold)" opacity=".3"/>` + reed(40, 44, -20, 0.6) + reed(58, 42, 14, 0.6),
  // میز خوشنویسی
  shadow(50, 90, 36) + `<path d="M16 60 H84 L78 70 H22 Z" fill="url(#gWood)" ${O}/><path d="M26 70 V86 M74 70 V86" ${O} stroke-width="4"/>` +
    `<rect x="30" y="44" width="34" height="16" fill="#f6e3b0" ${THIN}/>` + script(34, 54, 24) + `<ellipse cx="72" cy="58" rx="6" ry="3" fill="#1b1b1b" ${THIN}/>` + reed(76, 44, 24, 0.6),
  // کارگاه خوشنویسی
  shadow(50, 92, 40) + `<rect x="10" y="16" width="80" height="6" rx="2" fill="url(#gWoodDark)" ${O}/>` +
    [24, 50, 76].map((x) => `<rect x="${x - 9}" y="22" width="18" height="22" fill="#f6e3b0" ${THIN}/>` + script(x - 6, 34, 12)).join('') +
    `<path d="M14 64 H86 L80 74 H20 Z" fill="url(#gWood)" ${O}/><path d="M24 74 V90 M76 74 V90" ${O} stroke-width="4"/>` +
    `<ellipse cx="34" cy="62" rx="6" ry="3" fill="#1b1b1b" ${THIN}/>` + reed(60, 50, 30, 0.6) + reed(70, 52, 40, 0.6) + sparkle(88, 50, 4),
];
