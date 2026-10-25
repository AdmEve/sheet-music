// Season 16: night class («کلاس شبونه») chain and its generator (the teacher's desk).

import { INK, O, THIN, g, shadow, shine, sparkle } from './kit';

const letters = (x: number, y: number, t: string, size: number, fill: string) =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="Vazirmatn, sans-serif" font-weight="900" font-size="${size}" fill="${fill}">${t}</text>`;

const book = (x: number, base: number, w: number, h: number, fill: string) =>
  `<rect x="${x}" y="${base - h}" width="${w}" height="${h}" rx="1.5" fill="${fill}" ${THIN} stroke-width="1"/><path d="M${x + 2} ${base - h + 4} h${w - 4}" stroke="#f6c945" stroke-width="1"/>`;

/** A school desk with a bench, the classic two-seat one. */
const desk = (x: number, base: number, s: number) =>
  g(`<path d="M-30 -30 H30 L26 -22 H-26 Z" fill="url(#gWood)" ${O}/><path d="M-24 -22 V0 M24 -22 V0" ${O} stroke-width="3.4"/>` +
    `<rect x="-26" y="-14" width="52" height="5" fill="url(#gWoodDark)" ${THIN} stroke-width="1"/><circle cx="16" cy="-27" r="2.4" fill="#2a2a44"/>`, `translate(${x} ${base}) scale(${s})`);

export const CLASS: string[] = [
  // 1 گچ
  shadow(50, 84, 24) + g(`<rect x="-22" y="-5" width="40" height="10" rx="4" fill="#fffdf6" ${O}/><rect x="-14" y="8" width="34" height="10" rx="4" fill="#ffe08a" ${O}/>`, 'translate(50 60) rotate(-14)') +
    [[30, 80], [38, 84], [64, 82]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#fffdf6" opacity=".9"/>`).join(''),
  // 2 تخته‌پاک‌کن
  shadow(50, 86, 26) + `<path d="M24 54 H76 L72 70 H28 Z" fill="#7f8a99" ${O}/><path d="M26 44 H74 Q78 44 76 54 H24 Q22 44 26 44 Z" fill="url(#gWood)" ${O}/>` +
    `<path d="M30 70 q4 8 0 14 M44 72 q-3 6 0 12 M60 72 q3 6 0 12" fill="none" stroke="#fffdf6" stroke-width="2" opacity=".7"/>`,
  // 3 کارت الفبا
  shadow(50, 88, 26) + g(`<rect x="-26" y="-32" width="52" height="64" rx="5" fill="#fffdf6" ${O}/><rect x="-20" y="-26" width="40" height="52" rx="3" fill="none" stroke="#3a76c4" stroke-width="1.6"/>` +
    letters(0, 8, 'آ ب', 22, '#e0303f'), 'translate(50 54) rotate(-6)'),
  // 4 دفتر مشق شب
  shadow(50, 88, 32) + `<path d="M50 32 C40 26 24 26 16 30 V80 C24 76 40 76 50 82 Z" fill="#fffdf6" ${O}/><path d="M50 32 C60 26 76 26 84 30 V80 C76 76 60 76 50 82 Z" fill="#fffdf6" ${O}/>` +
    [40, 48, 56, 64, 72].map((y) => `<path d="M22 ${y} Q34 ${y - 3} 46 ${y + 1} M54 ${y + 1} Q66 ${y - 3} 78 ${y}" fill="none" stroke="#9ec4e8" stroke-width="1"/>`).join('') +
    `<path d="M24 46 q4 -4 8 0 t8 0 M24 54 q4 -4 8 0" fill="none" stroke="${INK}" stroke-width="1.4"/>` +
    g(`<rect x="-3" y="-28" width="6" height="40" fill="url(#gYellow)" ${THIN} stroke-width="1"/><path d="M-3 12 L0 20 L3 12 Z" fill="#f2d9a0" ${THIN} stroke-width=".8"/><rect x="-3" y="-32" width="6" height="5" fill="#ff9ec4" ${THIN} stroke-width=".8"/>`, 'translate(72 50) rotate(30)'),
  // 5 چراغ مطالعه
  `<circle cx="50" cy="56" r="40" fill="url(#rGlow)" opacity=".45"/>` + shadow(50, 90, 26) +
    `<ellipse cx="50" cy="86" rx="22" ry="5" fill="url(#gBrass)" ${O}/><path d="M50 84 V44" ${O} stroke-width="3.4"/>` +
    `<path d="M26 44 Q50 22 74 44 Z" fill="url(#gLeafDark)" ${O}/><path d="M30 44 H70" stroke="#f6c945" stroke-width="2"/><ellipse cx="50" cy="46" rx="10" ry="3" fill="#fff6a8"/>` +
    `<path d="M58 72 l8 8" stroke="#d9a63a" stroke-width="2"/><circle cx="67" cy="81" r="2" fill="url(#gBrass)"/>`,
  // 6 کره‌ی جغرافیا
  shadow(50, 90, 24) + `<path d="M38 88 H62 L58 80 H42 Z" fill="url(#gWoodDark)" ${O}/><path d="M50 80 V74" ${O} stroke-width="3"/>` +
    `<path d="M24 42 A28 28 0 0 0 76 52" fill="none" stroke="#d9a63a" stroke-width="3"/>` +
    `<circle cx="50" cy="46" r="26" fill="url(#gBlue)" ${O}/>` +
    `<path d="M36 34 q8 -6 14 0 q4 6 -4 10 q-8 2 -10 -10 Z M54 46 q8 -2 12 6 q-2 8 -10 6 q-6 -6 -2 -12 Z M34 54 q6 0 6 6 q-4 4 -8 0 Z" fill="url(#gLeaf)" ${THIN} stroke-width="1"/>` + shine(40, 34, 4, 8, 30, 0.6),
  // 7 کتاب شعر
  shadow(50, 88, 34) + `<path d="M18 40 L60 28 L84 42 L42 56 Z" fill="#fffdf6" ${O}/><path d="M18 40 V64 L42 80 V56 Z" fill="url(#gRed)" ${O}/><path d="M42 56 V80 L84 66 V42 Z" fill="url(#gRoseDeep)" ${O}/>` +
    `<path d="M48 62 l28 -9 M48 70 l28 -9" stroke="#f6c945" stroke-width="1.6"/><path d="M62 64 l4 -6 l4 4 l-4 6 Z" fill="url(#gGold)" ${THIN} stroke-width=".8"/>` +
    `<path d="M30 76 V90 l3 -3 l3 3 V78" fill="#3a76c4" ${THIN} stroke-width=".8"/>` +
    `<circle cx="54" cy="36" r="5" fill="url(#gRoseDeep)" ${THIN}/><path d="M59 37 q6 -1 8 3" fill="none" stroke="#3f8a2a" stroke-width="1.6"/>`,
  // 8 گواهی‌نامه‌ی سواد
  `<circle cx="50" cy="50" r="46" fill="url(#rGlow)" opacity=".55"/>` + shadow(50, 90, 36) +
    `<rect x="18" y="22" width="64" height="58" fill="#f6e3b0" ${O}/><rect x="23" y="27" width="54" height="48" fill="none" stroke="url(#gGold)" stroke-width="2"/>` +
    letters(50, 44, 'تقدیرنامه', 9, '#8e1230') + `<path d="M30 52 h40 M30 58 h34 M30 64 h26" stroke="#9b8a76" stroke-width="1.4"/>` +
    `<path d="M62 70 l-6 18 l6 -4 l6 4 Z M70 70 l2 18 l4 -6 l6 2 Z" fill="url(#gRed)" ${THIN} stroke-width="1"/><circle cx="66" cy="68" r="8" fill="url(#gGold)" ${O}/><circle cx="66" cy="68" r="4" fill="none" stroke="#b7801c" stroke-width="1.2"/>` +
    sparkle(16, 18, 5) + sparkle(88, 26, 6),
];

export const GEN_CLASS: string[] = [
  // میز کوچک
  shadow(50, 90, 30) + desk(50, 88, 1.1),
  // میز معلم
  shadow(50, 90, 38) + `<rect x="14" y="52" width="72" height="8" rx="2" fill="url(#gWoodDark)" ${O}/><rect x="56" y="60" width="26" height="28" fill="url(#gWood)" ${O}/><path d="M20 60 V88" ${O} stroke-width="4"/>` +
    `<rect x="62" y="66" width="14" height="6" rx="2" fill="url(#gBrass)" ${THIN} stroke-width="1"/>` +
    book(22, 52, 10, 14, 'url(#gRed)') + book(33, 52, 8, 18, 'url(#gBlue)') +
    `<path d="M58 44 C58 36 70 36 70 44 Z" fill="url(#gBrass)" ${THIN}/><path d="M64 36 V31" ${O} stroke-width="2.4"/><path d="M56 44 H72" ${O} stroke-width="2"/>`,
  // کتابخونه‌ی کلاس
  `<circle cx="50" cy="50" r="44" fill="#ffe7b8" opacity=".55"/>` + shadow(50, 92, 36) +
    `<rect x="20" y="14" width="60" height="76" rx="2" fill="url(#gWoodDark)" ${O}/>` +
    [36, 58, 80].map((y, r) => `<rect x="24" y="${y - 20}" width="52" height="20" fill="#3b2216"/>` +
      Array.from({ length: 6 }, (_, i) => book(25 + i * 8.5, y, 7, 14 + ((i + r) % 3) * 2, ['url(#gRed)', 'url(#gBlue)', 'url(#gLeaf)', 'url(#gYellow)', 'url(#gTurq)', 'url(#gRoseDeep)'][(i + r) % 6])).join('') +
      `<path d="M22 ${y} H78" stroke="#8b5328" stroke-width="2.4"/>`).join('') + sparkle(86, 18, 5),
];
