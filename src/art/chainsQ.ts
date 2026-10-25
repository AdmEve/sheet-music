// Season 15: old Yazd («یزد کهن») chain and its generator (the brick mould).

import { INK, O, THIN, g, shadow, shine, sparkle } from './kit';

const MUD = '#c99a62';
const MUD_D = '#a8783e';

/** Straw flecks on mud plaster. */
const straw = (x: number, y: number, w: number, h: number, n = 8) =>
  Array.from({ length: n }, (_, i) => { const px = x + ((i * 37) % 100) / 100 * w, py = y + ((i * 53) % 100) / 100 * h; return `<path d="M${px} ${py} l${4 + (i % 3)} ${(i % 2 ? -1 : 1) * 2}" stroke="#f2d48a" stroke-width="1.2" stroke-linecap="round"/>`; }).join('');

const knocker = (x: number, y: number, r: number) =>
  `<circle cx="${x}" cy="${y - r}" r="${r * 0.3}" fill="url(#gBrass)" ${THIN} stroke-width="1"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="url(#gBrass)" stroke-width="${Math.max(2, r * 0.35)}"/>`;

const vents = (x: number, top: number, w: number, h: number) => {
  const n = Math.max(2, Math.round(w / 9)), vw = (w - 8) / n;
  return Array.from({ length: n }, (_, i) => `<rect x="${x - w / 2 + 4 + i * vw}" y="${top}" width="${vw - 3}" height="${h}" rx="1" fill="#5e3418"/>`).join('');
};

/** A windcatcher tower centred on x, standing on `base`. */
const windcatcher = (x: number, base: number, w: number, h: number) =>
  `<rect x="${x - w / 2}" y="${base - h}" width="${w}" height="${h}" fill="${MUD}" ${O}/>` +
  `<rect x="${x - w / 2 - 3}" y="${base - h - 5}" width="${w + 6}" height="7" rx="1" fill="${MUD_D}" ${THIN}/>` +
  vents(x, base - h + 6, w, h * 0.38) +
  `<path d="M${x - w / 2} ${base - h * 0.5} H${x + w / 2}" stroke="${MUD_D}" stroke-width="2"/>`;

export const YAZD: string[] = [
  // 1 خشت خام
  shadow(50, 84, 26) + g(`<path d="M-26 -8 L6 -18 L28 -6 L-4 4 Z" fill="#d8ac74" ${O}/><path d="M-26 -8 V6 L-4 18 V4 Z" fill="${MUD}" ${O}/><path d="M-4 4 V18 L28 8 V-6 Z" fill="${MUD_D}" ${O}/>` +
    straw(-18, -12, 36, 10, 6), 'translate(50 64)'),
  // 2 سطل کاهگل
  shadow(50, 88, 26) + `<path d="M28 44 H72 L66 84 H34 Z" fill="url(#gSteel)" ${O}/><path d="M28 44 Q50 20 72 44" fill="none" stroke="${INK}" stroke-width="2"/>` +
    `<ellipse cx="50" cy="44" rx="22" ry="6" fill="#9a6a3a" ${THIN}/>` + straw(32, 40, 34, 7, 7) + `<path d="M60 40 l14 -22" stroke="#8b5328" stroke-width="3" stroke-linecap="round"/><path d="M70 14 l10 6 l-6 8 l-8 -6 Z" fill="url(#gSteel)" ${THIN}/>`,
  // 3 کوبه‌ی در
  shadow(50, 88, 20) + `<rect x="26" y="14" width="48" height="74" rx="3" fill="url(#gWoodDark)" ${O}/><path d="M50 14 V88" stroke="#3b2216" stroke-width="1.2"/>` +
    knocker(50, 52, 11) + `<rect x="44" y="64" width="12" height="7" rx="2" fill="url(#gBrass)" ${THIN} stroke-width="1"/>` + shine(44, 46, 1.8, 5, 20, 0.8),
  // 4 دلو قنات
  shadow(50, 90, 22) + `<path d="M50 6 V30" stroke="#b8945a" stroke-width="3"/><path d="M36 34 Q50 24 64 34" fill="none" stroke="#5e3418" stroke-width="3"/>` +
    `<path d="M32 36 H68 C70 60 64 82 50 84 C36 82 30 60 32 36 Z" fill="#8a5a32" ${O}/><ellipse cx="50" cy="36" rx="18" ry="5" fill="#6cc0ea" ${THIN}/>` +
    `<path d="M34 52 q16 6 32 0" fill="none" stroke="#5e3418" stroke-width="1.4"/>` + `<path d="M62 86 q3 4 0 6 q-3 -2 0 -6 Z" fill="#6cc0ea" stroke="#3a76c4" stroke-width=".8"/>`,
  // 5 چرخ چاه
  shadow(50, 90, 34) + `<ellipse cx="50" cy="80" rx="30" ry="8" fill="${MUD_D}" ${O}/><ellipse cx="50" cy="78" rx="20" ry="5" fill="#2a1a10"/>` +
    `<path d="M24 80 V34 M76 80 V34" ${O} stroke-width="5"/><rect x="22" y="34" width="56" height="10" rx="5" fill="url(#gWood)" ${O}/>` +
    `<path d="M50 44 V70" stroke="#b8945a" stroke-width="2"/><rect x="44" y="66" width="12" height="10" rx="2" fill="#8a5a32" ${THIN}/>` +
    `<path d="M78 39 h8 v14" fill="none" ${O} stroke-width="3"/>`,
  // 6 در دوکوبه‌ای
  shadow(50, 90, 32) + `<path d="M18 88 V30 Q18 12 50 12 Q82 12 82 30 V88 Z" fill="${MUD}" ${O}/>` +
    `<path d="M26 88 V34 Q26 20 50 20 Q74 20 74 34 V88 Z" fill="url(#gWoodDark)" ${O}/><path d="M50 20 V88" stroke="#3b2216" stroke-width="1.6"/>` +
    Array.from({ length: 6 }, (_, i) => `<circle cx="${i % 2 ? 62 : 38}" cy="${36 + Math.floor(i / 2) * 18}" r="1.8" fill="url(#gBrass)"/>`).join('') +
    knocker(42, 58, 6) + `<path d="M58 50 v14" stroke="#d9a63a" stroke-width="4" stroke-linecap="round"/><circle cx="58" cy="50" r="2.4" fill="url(#gBrass)" ${THIN} stroke-width=".8"/>`,
  // 7 یخچال خشتی
  shadow(50, 90, 40) + `<path d="M10 88 V74 H90 V88 Z" fill="${MUD_D}" ${O}/>` +
    `<path d="M22 74 L26 66 H74 L78 74 Z M30 66 L34 58 H66 L70 66 Z M36 58 Q50 4 64 58 Z" fill="${MUD}" ${O}/>` +
    `<path d="M40 50 Q50 20 54 40" fill="none" stroke="#f2d48a" stroke-width="1.6" opacity=".7"/><path d="M44 88 V80 Q50 74 56 80 V88 Z" fill="#5e3418" ${THIN}/>` + straw(30, 60, 40, 12, 6),
  // 8 برج بادگیر
  `<circle cx="50" cy="50" r="46" fill="url(#rGlow)" opacity=".5"/>` + shadow(50, 92, 36) +
    `<rect x="14" y="66" width="72" height="22" fill="${MUD}" ${O}/><path d="M42 88 V76 Q50 68 58 76 V88 Z" fill="#5e3418" ${THIN}/>` +
    windcatcher(50, 66, 34, 56) + windcatcher(22, 70, 14, 22) + sparkle(84, 18, 6) + sparkle(14, 26, 4),
];

const mould = (x: number, base: number, w: number, cells: number, filled: boolean[]) =>
  `<rect x="${x - w / 2}" y="${base - 16}" width="${w}" height="16" rx="2" fill="url(#gWood)" ${O}/>` +
  Array.from({ length: cells }, (_, i) => { const cw = (w - 8) / cells; const cx = x - w / 2 + 4 + i * cw; return `<rect x="${cx + 1}" y="${base - 13}" width="${cw - 2}" height="10" fill="${filled[i] ? MUD : '#3b2216'}" ${THIN} stroke-width="1"/>`; }).join('');

export const GEN_YAZD: string[] = [
  // قالب خشت
  shadow(50, 86, 30) + `<ellipse cx="50" cy="56" rx="20" ry="9" fill="${MUD_D}" ${THIN}/>` + straw(36, 50, 26, 6, 4) + mould(50, 82, 56, 1, [true]) + `<path d="M22 74 h-8 M78 74 h8" ${O} stroke-width="4"/>` + straw(38, 70, 22, 6, 3),
  // قالب دوتایی
  shadow(50, 86, 34) + mould(50, 80, 62, 2, [true, false]) + `<path d="M18 74 h-8 M82 74 h8" ${O} stroke-width="4"/>` +
    g(`<path d="M-12 -4 L4 -10 L14 -4 L-2 2 Z" fill="#d8ac74" ${THIN}/><path d="M-12 -4 V4 L-2 10 V2 Z" fill="${MUD}" ${THIN}/><path d="M-2 2 V10 L14 4 V-4 Z" fill="${MUD_D}" ${THIN}/>`, 'translate(50 50)'),
  // کارگاه خشت‌زنی
  `<circle cx="50" cy="50" r="44" fill="#ffe7b8" opacity=".6"/>` + shadow(50, 90, 40) + mould(36, 86, 50, 2, [true, true]) +
    [[66, 82], [80, 82], [73, 70]].map(([x, y]) => g(`<path d="M-10 -3 L3 -8 L11 -3 L-2 2 Z" fill="#d8ac74" ${THIN} stroke-width="1"/><path d="M-10 -3 V3 L-2 8 V2 Z" fill="${MUD}" ${THIN} stroke-width="1"/><path d="M-2 2 V8 L11 3 V-3 Z" fill="${MUD_D}" ${THIN} stroke-width="1"/>`, `translate(${x} ${y})`)).join('') +
    `<path d="M20 58 H52 L48 70 H24 Z" fill="url(#gSteel)" ${THIN}/><ellipse cx="36" cy="58" rx="16" ry="4" fill="#9a6a3a" ${THIN}/>` + sparkle(86, 30, 5),
];
