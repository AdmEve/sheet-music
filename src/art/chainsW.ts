// Season 21: herbalist («عطاری») chain and its generator (the herb planter).

import { INK, O, THIN, g, shadow, shine, sparkle } from './kit';

const leaf = (x: number, y: number, r: number, rot: number, fill = 'url(#gLeaf)') =>
  `<ellipse cx="${x}" cy="${y}" rx="${r * 0.45}" ry="${r}" transform="rotate(${rot} ${x} ${y})" fill="${fill}" ${THIN} stroke-width=".8"/>`;

const jarOf = (x: number, base: number, w: number, h: number, fill: string, label: string) =>
  `<rect x="${x - w / 2}" y="${base - h}" width="${w}" height="${h}" rx="3" fill="url(#gGlass)" ${O}/>` +
  `<rect x="${x - w / 2 + 2}" y="${base - h * 0.7}" width="${w - 4}" height="${h * 0.66}" fill="${fill}" opacity=".85"/>` +
  `<rect x="${x - w / 2 - 1}" y="${base - h - 5}" width="${w + 2}" height="6" rx="2" fill="url(#gWood)" ${THIN} stroke-width="1"/>` +
  `<rect x="${x - w * 0.32}" y="${base - h * 0.5}" width="${w * 0.64}" height="${h * 0.24}" rx="1" fill="#fffdf6" ${THIN} stroke-width=".6"/><path d="M${x - w * 0.22} ${base - h * 0.38} h${w * 0.44}" stroke="${label}" stroke-width="1.2"/>`;

const sack = (x: number, base: number, w: number, top: string) =>
  `<path d="M${x - w / 2} ${base} C${x - w / 2 - 4} ${base - w * 0.6} ${x - w * 0.42} ${base - w * 0.9} ${x - w * 0.3} ${base - w * 0.92} H${x + w * 0.3} C${x + w * 0.42} ${base - w * 0.9} ${x + w / 2 + 4} ${base - w * 0.6} ${x + w / 2} ${base} Z" fill="#c9a26b" ${O}/>` +
  `<ellipse cx="${x}" cy="${base - w * 0.9}" rx="${w * 0.32}" ry="${w * 0.1}" fill="${top}" ${THIN} stroke-width="1"/>`;

export const HERBS: string[] = [
  // 1 گل گاوزبون
  shadow(50, 86, 22) + [[40, 60], [56, 54], [50, 70], [62, 68], [44, 46]].map(([x, y]) =>
    [0, 72, 144, 216, 288].map((a) => `<ellipse cx="${x}" cy="${y - 5}" rx="2.6" ry="5" transform="rotate(${a} ${x} ${y})" fill="#7a6ad0" stroke="${INK}" stroke-width=".6"/>`).join('') + `<circle cx="${x}" cy="${y}" r="2" fill="#f6c945"/>`).join(''),
  // 2 شاخه‌ی نبات
  shadow(50, 88, 18) + `<path d="M50 14 V88" stroke="#c9a26b" stroke-width="2"/>` +
    Array.from({ length: 9 }, (_, i) => `<path d="M${50 - 8 - (i % 2) * 3} ${24 + i * 7} l8 -5 l8 5 l-8 6 Z" fill="#f6d28a" opacity=".9" ${THIN} stroke-width=".8"/>`).join('') + shine(44, 34, 2, 8, 10, 0.9),
  // 3 دارچین
  shadow(50, 86, 26) + [[40, -18], [52, -8], [62, 6]].map(([x, r]) => g(`<rect x="-5" y="-26" width="10" height="52" rx="5" fill="#a0522d" ${O}/><path d="M-1 -24 V24" stroke="#6b3a1a" stroke-width="1.4"/>`, `translate(${x} 58) rotate(${r})`)).join('') +
    `<path d="M34 80 H66" stroke="#c0392b" stroke-width="3" stroke-linecap="round"/>`,
  // 4 کیسه‌ی گیاه
  shadow(50, 90, 26) + sack(50, 88, 44, '#6fae4a') + leaf(44, 40, 7, -30) + leaf(56, 38, 7, 30) + `<path d="M36 64 q14 6 28 0" fill="none" stroke="#8a6a3a" stroke-width="1.4"/>`,
  // 5 هاون برنجی
  shadow(50, 90, 28) + `<path d="M26 54 H74 L68 86 H32 Z" fill="url(#gBrass)" ${O}/><ellipse cx="50" cy="54" rx="24" ry="6" fill="#93661a" ${THIN}/>` +
    `<path d="M60 52 L76 20" stroke="#b7801c" stroke-width="7" stroke-linecap="round"/><path d="M60 52 L76 20" stroke="#ffe08a" stroke-width="2.4" stroke-linecap="round"/>` +
    `<path d="M32 66 H68" stroke="#93661a" stroke-width="1.4"/>` + shine(36, 70, 2.4, 6, 10, 0.7),
  // 6 شیشه‌ی شربت
  shadow(50, 90, 22) + `<path d="M36 88 V50 Q36 40 44 36 V24 H56 V36 Q64 40 64 50 V88 Z" fill="url(#gGlass)" ${O}/><path d="M38 86 V56 H62 V86 Z" fill="#e0303f" opacity=".75"/>` +
    `<rect x="42" y="18" width="16" height="8" rx="2" fill="url(#gWood)" ${THIN}/><rect x="40" y="62" width="20" height="12" rx="2" fill="#fffdf6" ${THIN} stroke-width=".8"/>` + leaf(50, 68, 3.4, 0, 'url(#gLeafDark)') + shine(42, 52, 2, 8, 0, 0.8),
  // 7 قفسه‌ی عطاری
  shadow(50, 92, 38) + `<rect x="14" y="16" width="72" height="76" rx="2" fill="url(#gWoodDark)" ${O}/>` +
    [42, 66, 90].map((y, r) => `<rect x="18" y="${y - 22}" width="64" height="22" fill="#3b2216"/><path d="M16 ${y} H84" stroke="#8b5328" stroke-width="2.4"/>` +
      [28, 44, 60, 74].map((x, i) => jarOf(x, y - 1, 11, 14, ['#f6c945', '#6fae4a', '#c0281a', '#7a6ad0', '#a0522d'][(i + r) % 5], INK)).join('')).join(''),
  // 8 دکه‌ی عطاری
  `<circle cx="50" cy="52" r="46" fill="url(#rGlow)" opacity=".5"/>` + shadow(50, 92, 42) +
    `<path d="M8 30 L50 16 L92 30 V36 H8 Z" fill="url(#gRed)" ${O}/>` + Array.from({ length: 6 }, (_, i) => `<path d="M${14 + i * 14} 36 q7 6 14 0" fill="url(#gRed)" ${THIN} stroke-width="1"/>`).join('') +
    `<rect x="16" y="54" width="68" height="4" fill="url(#gWoodDark)" ${THIN} stroke-width="1"/>` + [24, 40, 60, 76].map((x, i) => jarOf(x, 54, 10, 12, ['#7a6ad0', '#a0522d', '#f6d28a', '#6fae4a'][i], INK)).join('') +
    `<rect x="14" y="66" width="72" height="24" fill="url(#gWood)" ${O}/>` + sack(28, 70, 18, '#f6c945') + sack(50, 70, 18, '#6fae4a') + sack(72, 70, 18, '#c0281a') + sparkle(90, 50, 5) + sparkle(10, 46, 4),
];

export const GEN_HERBS: string[] = [
  // گلدون نعنا
  shadow(50, 88, 22) + `<path d="M36 70 H64 L60 88 H40 Z" fill="url(#gTerracotta)" ${O}/>` +
    [[-24, 44, 60], [0, 50, 52], [24, 56, 60], [-12, 42, 48], [14, 58, 46]].map(([r, x, y]) => leaf(x, y, 9, r, 'url(#gLeafDark)')).join(''),
  // جعبه‌ی گیاه
  shadow(50, 90, 34) + `<rect x="16" y="64" width="68" height="24" fill="url(#gWood)" ${O}/>` +
    [26, 42, 58, 74].map((x, i) => [-20, 0, 20].map((r) => leaf(x + r / 5, 58 - (i % 2) * 4, 8, r, i % 2 ? 'url(#gLeaf)' : 'url(#gLeafDark)')).join('')).join('') +
    `<circle cx="42" cy="46" r="3" fill="#7a6ad0"/><circle cx="74" cy="48" r="3" fill="#7a6ad0"/>`,
  // باغچه‌ی دارویی
  `<circle cx="50" cy="50" r="44" fill="#e3f3d6" opacity=".7"/>` + shadow(50, 92, 42) + `<path d="M8 92 Q50 78 92 92 Z" fill="#8a6a3a"/>` +
    Array.from({ length: 7 }, (_, i) => { const x = 16 + i * 11; return [-24, 0, 24].map((r) => leaf(x + r / 6, 80 - (i % 3) * 6, 8, r, ['url(#gLeaf)', 'url(#gLeafDark)', '#7fc85a'][i % 3])).join('') + (i % 2 ? `<circle cx="${x}" cy="${70 - (i % 3) * 6}" r="3" fill="#7a6ad0"/>` : ''); }).join('') + sparkle(86, 22, 5),
];
