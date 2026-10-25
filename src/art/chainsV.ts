// Season 20: excavation («کاوش») chain and its generator (the dig basket).

import { INK, O, THIN, g, shadow, shine, sparkle } from './kit';

const LAPIS = '#2a5aa8';
const TURQ = '#2aa8a8';

/** A lustre-glazed bowl or plate rim pattern. */
const bird = (x: number, y: number, s: number, fill: string) =>
  `<path d="M${x - 8 * s} ${y} Q${x - 2 * s} ${y - 6 * s} ${x + 4 * s} ${y - 2 * s} L${x + 9 * s} ${y - 5 * s} L${x + 7 * s} ${y + 1 * s} Q${x} ${y + 5 * s} ${x - 8 * s} ${y} Z" fill="${fill}"/><circle cx="${x + 3 * s}" cy="${y - 2 * s}" r="${0.8 * s}" fill="#fffdf6"/>`;

const jar = (x: number, base: number, h: number, glaze: string) =>
  `<path d="M${x - h * 0.14} ${base - h} H${x + h * 0.14} V${base - h * 0.86} Q${x + h * 0.42} ${base - h * 0.7} ${x + h * 0.36} ${base - h * 0.28} Q${x + h * 0.3} ${base} ${x} ${base} Q${x - h * 0.3} ${base} ${x - h * 0.36} ${base - h * 0.28} Q${x - h * 0.42} ${base - h * 0.7} ${x - h * 0.14} ${base - h * 0.86} Z" fill="${glaze}" ${O}/>` +
  `<path d="M${x - h * 0.34} ${base - h * 0.5} Q${x} ${base - h * 0.44} ${x + h * 0.34} ${base - h * 0.5}" fill="none" stroke="#fffdf6" stroke-width="2" opacity=".8"/>` +
  shine(x - h * 0.16, base - h * 0.6, h * 0.04, h * 0.12, 15, 0.7);

export const DIG: string[] = [
  // 1 تکه‌سفال
  shadow(50, 84, 24) + `<path d="M28 70 L40 48 L64 44 L74 62 L58 76 Z" fill="url(#gTerracotta)" ${O}/><path d="M38 64 L44 52 L62 50 L68 60 L56 70 Z" fill="${TURQ}" opacity=".8"/>` +
    `<path d="M46 58 q6 -4 12 0" fill="none" stroke="#fffdf6" stroke-width="1.4"/>`,
  // 2 برس کاوش
  shadow(50, 86, 24) + g(`<rect x="-5" y="-34" width="10" height="38" rx="3" fill="url(#gWood)" ${THIN}/><rect x="-9" y="2" width="18" height="8" rx="2" fill="url(#gBrass)" ${THIN}/>` +
    Array.from({ length: 7 }, (_, i) => `<path d="M${-8 + i * 2.6} 10 V24" stroke="#c9a26b" stroke-width="1.8"/>`).join(''), 'translate(50 58) rotate(28)') +
    `<path d="M24 80 q8 -4 14 2 q-4 4 -14 -2 Z" fill="#c9a27a" opacity=".8"/>`,
  // 3 سکه‌ی قدیمی
  shadow(50, 86, 22) + `<circle cx="50" cy="56" r="24" fill="#b08a4a" ${O}/><circle cx="50" cy="56" r="18" fill="none" stroke="#7a5a2a" stroke-width="1.6"/>` +
    `<path d="M42 50 q8 -8 16 0 q-2 10 -8 12 q-6 -2 -8 -12 Z" fill="#8a6a3a"/>` + Array.from({ length: 12 }, (_, i) => `<circle cx="${50 + Math.cos(i / 12 * Math.PI * 2) * 21}" cy="${56 + Math.sin(i / 12 * Math.PI * 2) * 21}" r="1" fill="#7a5a2a"/>`).join('') +
    `<path d="M68 40 l6 -4" stroke="#4aa86a" stroke-width="3" stroke-linecap="round" opacity=".7"/>` + shine(40, 46, 3, 6, 30, 0.6),
  // 4 کوزه‌ی لعابی
  shadow(50, 90, 24) + jar(50, 88, 68, `url(#gTurq)`),
  // 5 مُهر سنگی
  shadow(50, 88, 26) + `<path d="M36 40 H64 V74 Q50 82 36 74 Z" fill="#8a8a80" ${O}/><ellipse cx="50" cy="40" rx="14" ry="5" fill="#a8a89a" ${THIN}/>` +
    `<path d="M50 30 V40" stroke="#6a6a60" stroke-width="5"/><circle cx="50" cy="28" r="4" fill="none" stroke="#6a6a60" stroke-width="2.4"/>` +
    `<path d="M40 56 h20 M44 64 l12 0 M42 50 l4 4 l4 -4 l4 4 l4 -4" fill="none" stroke="#5a5a50" stroke-width="1.6"/>`,
  // 6 بشقاب زرین‌فام
  shadow(50, 88, 36) + `<ellipse cx="50" cy="62" rx="38" ry="22" fill="#e8c878" ${O}/><ellipse cx="50" cy="62" rx="28" ry="15" fill="#f6e0a0" ${THIN}/>` +
    bird(50, 62, 1.6, '#b8801c') + Array.from({ length: 10 }, (_, i) => { const a = i / 10 * Math.PI * 2; return `<circle cx="${50 + Math.cos(a) * 33}" cy="${62 + Math.sin(a) * 18.5}" r="2" fill="#b8801c"/>`; }).join('') + sparkle(82, 38, 5),
  // 7 جام مفرغی
  shadow(50, 90, 26) + `<path d="M28 34 H72 Q70 62 54 66 V78 H64 L66 86 H34 L36 78 H46 V66 Q30 62 28 34 Z" fill="url(#gBrass)" ${O}/>` +
    `<path d="M32 42 H68" stroke="#4aa86a" stroke-width="3" opacity=".55"/><path d="M38 50 q12 6 24 0" fill="none" stroke="#93661a" stroke-width="1.6"/>` + bird(50, 48, 1, '#93661a') + shine(36, 44, 3, 8, 10, 0.7),
  // 8 ویترین موزه
  `<circle cx="50" cy="52" r="46" fill="url(#rGlow)" opacity=".45"/>` + shadow(50, 94, 38) +
    `<rect x="16" y="68" width="68" height="24" fill="url(#gWoodDark)" ${O}/><rect x="20" y="20" width="60" height="48" fill="url(#gGlass)" ${O}/>` +
    jar(36, 64, 30, LAPIS) + `<ellipse cx="62" cy="58" rx="13" ry="6" fill="#e8c878" ${THIN}/>` + bird(62, 58, 0.8, '#b8801c') +
    `<path d="M24 26 l10 -4" stroke="#fff" stroke-width="2" opacity=".8"/><rect x="40" y="76" width="20" height="8" rx="1" fill="url(#gGold)" ${THIN} stroke-width="1"/>` + sparkle(86, 20, 5) + sparkle(14, 30, 4),
];

export const GEN_DIG: string[] = [
  // بیلچه‌ی کاوش
  shadow(50, 88, 24) + g(`<path d="M-12 0 L0 -28 L12 0 Q0 8 -12 0 Z" fill="url(#gSilver)" ${O}/><rect x="-3" y="2" width="6" height="30" rx="3" fill="url(#gWood)" ${THIN}/>`, 'translate(52 52) rotate(150)') +
    `<path d="M26 84 Q38 72 52 80 Q66 74 76 84 Z" fill="#a8784a" ${THIN}/>`,
  // سبد کاوش
  shadow(50, 90, 32) + `<path d="M20 56 H80 L74 88 H26 Z" fill="url(#gWicker)" ${O}/><path d="M28 56 Q50 30 72 56" fill="none" ${O} stroke="#a8702d" stroke-width="4"/>` +
    `<path d="M30 56 L36 48 L48 50 L44 56 Z" fill="url(#gTerracotta)" ${THIN}/><path d="M56 56 L60 46 L70 50 L68 56 Z" fill="${TURQ}" ${THIN}/>` + `<path d="M24 68 H76" stroke="#8a5a22" stroke-width="1.4" opacity=".7"/>`,
  // کارگاه باستان‌شناسی
  `<circle cx="50" cy="50" r="44" fill="#ffe7b8" opacity=".55"/>` + shadow(50, 92, 42) +
    `<path d="M10 90 L50 22 L90 90 Z" fill="#e8dcc6" ${O}/><path d="M50 22 V90" stroke="${INK}" stroke-width="1.4"/><path d="M38 90 L50 60 L62 90 Z" fill="#5e3418" ${THIN}/>` +
    `<path d="M14 90 H86" stroke="#a8784a" stroke-width="3"/>` + jar(76, 90, 18, 'url(#gTurq)') + sparkle(84, 20, 5),
];
