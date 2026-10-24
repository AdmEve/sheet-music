// Garden/rosewater, tools, textile/carpet, pottery/tile chains plus their generators.

import { INK, O, THIN, g, shadow, shine, sparkle } from './kit';

const leaf = (x: number, y: number, rot: number, s = 1, fill = 'url(#gLeaf)') =>
  g(
    `<path d="M0 0 C10 -14 30 -14 38 0 C30 14 10 14 0 0 Z" fill="${fill}" ${O}/><path d="M3 0 Q20 -2 34 0" fill="none" stroke="${INK}" stroke-width="1.6" opacity=".55"/>`,
    `translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  );

const pot = (x: number, y: number, s = 1, fill = 'url(#gTerracotta)') =>
  g(
    `<path d="M-18 -4 L18 -4 L13 22 L-13 22 Z" fill="${fill}" ${O}/><rect x="-21" y="-10" width="42" height="9" rx="3" fill="${fill}" ${O}/>` +
      shine(-10, 6, 2, 7, 10, 0.4),
    `translate(${x} ${y}) scale(${s})`,
  );

const soil = (x: number, y: number, w: number) =>
  `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${w * 0.22}" fill="url(#gSoil)" ${O}/>`;

/** Damask rose (gol-e mohammadi) bloom. */
const rose = (x: number, y: number, s = 1, fill = 'url(#gRose)') =>
  g(
    [0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-9" rx="8" ry="10" transform="rotate(${a})" fill="${fill}" ${THIN}/>`).join('') +
      `<circle cx="0" cy="0" r="7" fill="url(#gRoseDeep)" ${THIN}/><path d="M-3 -1 q3 -4 6 0 q-3 3 -6 0" fill="none" stroke="#fff" stroke-width="1" opacity=".8"/>` +
      `<circle cx="0" cy="0" r="2" fill="#ffd36b"/>`,
    `translate(${x} ${y}) scale(${s})`,
  );

const bud = (x: number, y: number, s = 1) =>
  g(
    `<path d="M0 -14 C9 -10 9 4 0 8 C-9 4 -9 -10 0 -14 Z" fill="url(#gRoseDeep)" ${O}/>` +
      `<path d="M-7 2 C-4 10 4 10 7 2 L4 10 L-4 10 Z" fill="url(#gLeaf)" ${THIN}/>`,
    `translate(${x} ${y}) scale(${s})`,
  );

const bottle = (x: number, y: number, s = 1, liquid = 'url(#gRose)') =>
  g(
    `<path d="M-6 -30 L6 -30 L6 -16 C18 -12 22 -2 22 10 C22 24 12 30 0 30 C-12 30 -22 24 -22 10 C-22 -2 -18 -12 -6 -16 Z" fill="url(#gGlass)" ${O}/>` +
      `<path d="M-19 6 C-19 22 -10 27 0 27 C10 27 19 22 19 6 Z" fill="${liquid}" opacity=".85"/>` +
      `<rect x="-8" y="-38" width="16" height="9" rx="3" fill="url(#gGold)" ${O}/>` +
      shine(-12, 4, 3, 9, 15, 0.8) + rose(0, 13, 0.45),
    `translate(${x} ${y}) scale(${s})`,
  );

export const GARDEN: string[] = [
  // 1 دانه
  shadow(50, 84, 24) +
    [[38, 66], [52, 70], [62, 62], [46, 58], [58, 76], [34, 76]].map(([x, y], i) =>
      `<ellipse cx="${x}" cy="${y}" rx="6" ry="4.4" transform="rotate(${i * 40} ${x} ${y})" fill="url(#gCrust)" ${THIN}/>`).join(''),
  // 2 جوانه
  shadow(50, 86, 26) + soil(50, 78, 26) +
    `<path d="M50 78 C50 66 50 60 50 52" stroke="#5d9a2c" stroke-width="4" stroke-linecap="round"/>` + leaf(50, 54, -150, 0.55) + leaf(50, 54, -30, 0.55),
  // 3 نهال
  shadow(50, 89, 22) + pot(50, 66, 1) +
    `<path d="M50 58 L50 30" stroke="#6b8f2c" stroke-width="4" stroke-linecap="round"/>` +
    leaf(50, 36, -160, 0.6) + leaf(50, 44, -20, 0.6) + leaf(50, 30, -90, 0.5) + leaf(50, 50, -170, 0.5, 'url(#gLeafDark)'),
  // 4 گلدان شمعدانی
  shadow(50, 89, 24) + pot(50, 68, 1.05) +
    leaf(50, 52, -170, 0.7, 'url(#gLeafDark)') + leaf(50, 52, -10, 0.7, 'url(#gLeafDark)') +
    [[40, 34], [52, 28], [62, 36], [46, 42], [58, 44]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="url(#gRed)" ${THIN}/><circle cx="${x}" cy="${y}" r="2" fill="#ffd36b"/>`).join(''),
  // 5 غنچه گل محمدی
  shadow(50, 88, 20) +
    `<path d="M50 84 C50 70 50 56 50 40" stroke="#4f8a2a" stroke-width="4" stroke-linecap="round"/>` +
    leaf(50, 66, -160, 0.55) + leaf(50, 58, -20, 0.55) + bud(50, 34, 1.5),
  // 6 گل محمدی
  shadow(50, 88, 22) +
    `<path d="M50 86 C50 72 50 60 50 48" stroke="#4f8a2a" stroke-width="4" stroke-linecap="round"/>` +
    leaf(50, 70, -160, 0.6) + leaf(50, 62, -20, 0.6) + rose(50, 38, 1.6),
  // 7 دسته گل
  shadow(50, 89, 26) +
    leaf(50, 56, -150, 0.6) + leaf(50, 56, -30, 0.6) +
    rose(38, 36, 1.05) + rose(62, 36, 1.05) + rose(50, 24, 1.05) + rose(50, 46, 1.1) +
    `<path d="M36 56 L64 56 L56 86 L44 86 Z" fill="url(#gPaper)" ${O}/><path d="M40 64 Q50 70 60 64" fill="none" stroke="#e2507a" stroke-width="4" stroke-linecap="round"/>`,
  // 8 شیشه گلاب
  shadow(50, 90, 26) + bottle(50, 56, 1.1),
  // 9 گلاب‌پاش نقره
  `<circle cx="50" cy="52" r="46" fill="url(#rGlow)" opacity=".7"/>` + shadow(50, 90, 22) +
    `<path d="M47 6 L53 6 L54 30 C66 36 70 48 70 60 C70 74 60 82 50 82 C40 82 30 74 30 60 C30 48 34 36 46 30 Z" fill="url(#gSilver)" ${O}/>` +
    `<path d="M40 82 L60 82 L64 90 L36 90 Z" fill="url(#gSilver)" ${O}/>` +
    `<path d="M34 58 Q50 66 66 58" fill="none" stroke="#7f8a99" stroke-width="1.6"/>` +
    rose(50, 64, 0.55) + `<circle cx="50" cy="5" r="3.4" fill="url(#gSilver)" ${THIN}/>` + shine(40, 52, 3, 10, 10, 0.9) +
    `<path d="M60 4 l4 -3 M62 9 l5 0 M38 4 l-4 -3" stroke="#9fd8ff" stroke-width="2" stroke-linecap="round"/>` + sparkle(80, 30, 5),
];

const fence = (y: number) =>
  [18, 34, 66, 82].map((x) => `<path d="M${x} ${y} L${x} ${y - 20} L${x + 4} ${y - 25} L${x + 8} ${y - 20} L${x + 8} ${y} Z" fill="url(#gCream)" ${THIN}/>`).join('') +
  `<path d="M14 ${y - 12} L92 ${y - 12}" stroke="#d9c79f" stroke-width="3"/>`;

export const GEN_GARDEN: string[] = [
  shadow(50, 86, 34) + soil(50, 72, 36) +
    [36, 50, 64].map((x) => `<path d="M${x} 72 L${x} 60" stroke="#5d9a2c" stroke-width="3" stroke-linecap="round"/>` + leaf(x, 62, -140, 0.35) + leaf(x, 62, -40, 0.35)).join(''),
  shadow(50, 88, 40) + fence(80) + soil(50, 76, 34) +
    [32, 50, 68].map((x) => `<path d="M${x} 76 L${x} 58" stroke="#5d9a2c" stroke-width="3" stroke-linecap="round"/>` + leaf(x, 62, -150, 0.45) + leaf(x, 64, -30, 0.45) + bud(x, 54, 0.6)).join(''),
  shadow(50, 89, 42) + fence(82) + soil(50, 78, 36) +
    [28, 50, 72].map((x, i) => `<path d="M${x} 78 L${x} ${54 - i % 2 * 6}" stroke="#4f8a2a" stroke-width="3" stroke-linecap="round"/>` + leaf(x, 66, -150, 0.5) + leaf(x, 66, -30, 0.5) + rose(x, 48 - (i % 2) * 6, 0.8)).join('') +
    sparkle(86, 26, 5),
];

export const TOOLS: string[] = [
  // 1 میخ
  shadow(50, 86, 26) +
    [[38, 30, -15], [52, 28, 5], [64, 34, 20]].map(([x, y, r]) =>
      g(`<rect x="-2.5" y="0" width="5" height="44" rx="1.5" fill="url(#gSteel)" ${THIN}/><ellipse cx="0" cy="0" rx="8" ry="3.2" fill="url(#gSteel)" ${THIN}/><path d="M-2.5 44 L0 52 L2.5 44 Z" fill="#8e99a6" ${THIN}/>`, `translate(${x} ${y}) rotate(${r})`)).join(''),
  // 2 پیچ‌گوشتی
  shadow(50, 86, 26) +
    g(`<rect x="-3" y="-38" width="6" height="34" fill="url(#gSteel)" ${THIN}/><path d="M-3 -38 L0 -44 L3 -38 Z" fill="#8e99a6" ${THIN}/>` +
      `<path d="M-9 -4 L9 -4 L8 30 C8 34 -8 34 -8 30 Z" fill="url(#gRed)" ${O}/><path d="M-3 0 L-3 28 M3 0 L3 28" stroke="#8f1d1d" stroke-width="1.5"/>`, 'translate(52 52) rotate(35)'),
  // 3 آچار
  shadow(50, 86, 28) +
    g(`<path d="M-5 -26 L5 -26 L5 24 L-5 24 Z" fill="url(#gSteel)" ${O}/>` +
      `<path d="M-12 -30 C-14 -42 -4 -48 0 -44 L0 -36 L6 -36 L6 -44 C12 -46 16 -36 12 -28 C8 -22 -8 -22 -12 -30 Z" fill="url(#gSteel)" ${O}/>` +
      `<circle cx="0" cy="30" r="10" fill="url(#gSteel)" ${O}/><circle cx="0" cy="30" r="4" fill="#fff7e6" ${THIN}/>`, 'translate(50 50) rotate(-35)'),
  // 4 چکش
  shadow(50, 87, 28) +
    g(`<rect x="-4" y="-14" width="8" height="54" rx="3" fill="url(#gWood)" ${O}/>` +
      `<path d="M-24 -26 L18 -26 L24 -20 L24 -10 L18 -4 L-24 -4 C-28 -8 -28 -22 -24 -26 Z" fill="url(#gSteel)" ${O}/>` + shine(-12, -20, 8, 2, 0, 0.8), 'translate(50 48) rotate(-25)'),
  // 5 اره
  shadow(50, 86, 34) +
    g(`<path d="M-30 -8 L26 -14 L26 8 L-30 10 Z" fill="url(#gSteel)" ${O}/>` +
      `<path d="M-30 10 ${Array.from({ length: 10 }, (_, i) => `L${-26 + i * 5.6} 14 L${-23 + i * 5.6} 10`).join(' ')} L26 8" fill="url(#gSteel)" ${THIN}/>` +
      `<path d="M24 -18 C40 -20 44 -4 42 6 C40 14 28 12 24 10 Z" fill="url(#gWood)" ${O}/><ellipse cx="33" cy="-2" rx="4" ry="6" fill="#fff7e6" ${THIN}/>`, 'translate(46 54) rotate(-15)'),
  // 6 قلم‌مو
  shadow(50, 86, 26) +
    g(`<rect x="-4" y="-6" width="8" height="40" rx="3" fill="url(#gWood)" ${O}/><rect x="-7" y="-14" width="14" height="10" rx="2" fill="url(#gSteel)" ${O}/>` +
      `<path d="M-8 -14 C-8 -26 -4 -36 0 -40 C4 -36 8 -26 8 -14 Z" fill="url(#gTurq)" ${O}/>`, 'translate(50 54) rotate(30)') +
    `<path d="M24 74 q8 -6 16 0 q8 6 16 0" fill="none" stroke="#14879a" stroke-width="4" stroke-linecap="round"/>`,
  // 7 سطل رنگ
  shadow(50, 88, 28) +
    `<path d="M28 40 L72 40 L68 84 L32 84 Z" fill="url(#gSteel)" ${O}/>` +
    `<ellipse cx="50" cy="40" rx="22" ry="6" fill="url(#gTurq)" ${O}/>` +
    `<path d="M30 46 C34 54 38 46 40 56 C42 64 46 50 48 50" fill="none" stroke="#14879a" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M28 40 C26 18 74 18 72 40" fill="none" ${O}/>` +
    `<rect x="36" y="60" width="28" height="14" rx="2" fill="url(#gCream)" ${THIN}/>` + shine(36, 56, 2, 8, 0, 0.6),
  // 8 نردبان
  shadow(50, 90, 26) +
    `<path d="M34 10 L26 88 M66 10 L74 88" ${O} stroke="url(#gWood)" stroke-width="7"/>` +
    `<path d="M34 10 L26 88 M66 10 L74 88" fill="none" ${THIN}/>` +
    [22, 38, 54, 70].map((y) => { const k = (y - 10) / 78 * 8; return `<rect x="${34 - k}" y="${y}" width="${32 + 2 * k}" height="5" rx="2" fill="url(#gWood)" ${THIN}/>`; }).join('') +
    sparkle(84, 20, 4),
];

const toolbox = (fill: string, w = 36) =>
  `<path d="M${50 - w * 0.4} 40 L${50 - w * 0.4} 30 L${50 + w * 0.4} 30 L${50 + w * 0.4} 40" fill="none" ${O} stroke-width="4"/>` +
  `<rect x="${50 - w}" y="40" width="${2 * w}" height="40" rx="5" fill="${fill}" ${O}/><path d="M${50 - w} 54 L${50 + w} 54" ${O}/>` +
  `<rect x="44" y="50" width="12" height="9" rx="2" fill="url(#gGold)" ${THIN}/>` + shine(50 - w + 8, 64, 2, 8, 0, 0.5);

export const GEN_TOOLS: string[] = [
  shadow(50, 87, 32) + toolbox('url(#gRed)', 30),
  shadow(50, 88, 38) +
    g(`<rect x="-3" y="-30" width="6" height="30" fill="url(#gWood)" ${THIN}/><path d="M-12 -34 L10 -34 L12 -28 L-12 -28 Z" fill="url(#gSteel)" ${THIN}/>`, 'translate(40 42) rotate(-20)') +
    toolbox('url(#gBlue)', 36),
  shadow(50, 90, 44) +
    `<rect x="10" y="44" width="80" height="10" rx="2" fill="url(#gWood)" ${O}/><path d="M16 54 L16 88 M84 54 L84 88" ${O} stroke-width="5"/>` +
    `<rect x="18" y="66" width="64" height="6" fill="url(#gWoodDark)" ${THIN}/>` +
    g(`<rect x="-3" y="-30" width="6" height="30" fill="url(#gWood)" ${THIN}/><path d="M-12 -34 L10 -34 L12 -28 L-12 -28 Z" fill="url(#gSteel)" ${THIN}/>`, 'translate(30 44) rotate(-15)') +
    `<path d="M50 44 L50 22 M44 22 L56 22" ${O} stroke="url(#gSteel)" stroke-width="4"/>` +
    `<rect x="62" y="30" width="18" height="14" rx="2" fill="url(#gRed)" ${THIN}/>` + sparkle(88, 18, 4),
];

const yarn = (x: number, y: number, r: number, fill: string) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${O}/>` +
  `<path d="M${x - r * 0.8} ${y - r * 0.3} Q${x} ${y - r * 0.9} ${x + r * 0.8} ${y - r * 0.2} M${x - r * 0.9} ${y + r * 0.2} Q${x} ${y - r * 0.3} ${x + r * 0.9} ${y + r * 0.3} M${x - r * 0.6} ${y + r * 0.7} Q${x} ${y + r * 0.2} ${x + r * 0.7} ${y + r * 0.6}" fill="none" stroke="${INK}" stroke-width="1.3" opacity=".45"/>`;

const boteh = (x: number, y: number, s: number, fill: string) =>
  g(`<path d="M0 10 C-10 10 -12 -4 -4 -8 C2 -12 10 -10 8 -16 C14 -10 12 10 0 10 Z" fill="${fill}" stroke="#f6c945" stroke-width="1.2"/>`, `translate(${x} ${y}) scale(${s})`);

const carpet = (x: number, y: number, w: number, h: number, field: string, border: string, medal = true) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${border}" ${O}/>` +
  `<rect x="${x + 5}" y="${y + 5}" width="${w - 10}" height="${h - 10}" fill="${field}" stroke="#f6e3b0" stroke-width="1.4"/>` +
  (medal
    ? `<path d="M${x + w / 2} ${y + 10} L${x + w - 12} ${y + h / 2} L${x + w / 2} ${y + h - 10} L${x + 12} ${y + h / 2} Z" fill="url(#gNavy)" stroke="#f6e3b0" stroke-width="1.4"/><circle cx="${x + w / 2}" cy="${y + h / 2}" r="${Math.min(w, h) / 8}" fill="url(#gGold)" ${THIN}/>`
    : '') +
  Array.from({ length: Math.floor(w / 6) }, (_, i) => `<path d="M${x + 3 + i * 6} ${y + h} l0 4 M${x + 3 + i * 6} ${y} l0 -4" stroke="#f6e3b0" stroke-width="1.4"/>`).join('');

export const TEXTILE: string[] = [
  // 1 پشم
  shadow(50, 84, 28) +
    [[40, 62, 14], [58, 60, 15], [50, 48, 14], [34, 52, 10], [66, 50, 10]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#rWool)" ${THIN}/>`).join(''),
  // 2 کلاف نخ
  shadow(50, 86, 26) + yarn(50, 58, 24, 'url(#gRed)') + `<path d="M70 72 C80 80 84 70 90 78" fill="none" stroke="#c02a2a" stroke-width="3" stroke-linecap="round"/>`,
  // 3 کلاف رنگی
  shadow(50, 88, 34) + yarn(32, 64, 16, 'url(#gBlue)') + yarn(68, 64, 16, 'url(#gYellow)') + yarn(50, 42, 17, 'url(#gRed)'),
  // 4 دستمال
  shadow(50, 86, 30) +
    `<path d="M22 40 L78 34 L82 78 L26 82 Z" fill="url(#gCream)" ${O}/>` +
    `<path d="M28 46 L74 41 L77 73 L31 76 Z" fill="none" stroke="#c0392b" stroke-width="2.4"/>` +
    boteh(42, 58, 0.9, '#c0392b') + boteh(60, 62, 0.8, '#1d4fa8'),
  // 5 رومیزی ترمه
  shadow(50, 86, 36) +
    `<path d="M14 38 L86 38 L90 80 L10 80 Z" fill="url(#gCarpet)" ${O}/>` +
    `<path d="M10 80 L90 80" stroke="#f6c945" stroke-width="3"/>` +
    [[26, 52], [46, 58], [66, 52], [36, 70], [58, 70], [76, 68]].map(([x, y], i) => boteh(x, y, 0.85, i % 2 ? '#1b6b4a' : '#1d4fa8')).join('') +
    Array.from({ length: 13 }, (_, i) => `<path d="M${12 + i * 6.3} 80 l0 6" stroke="#f6c945" stroke-width="1.8"/>`).join(''),
  // 6 گلیم
  shadow(50, 88, 38) +
    `<rect x="12" y="30" width="76" height="54" rx="2" fill="#f2e6cc" ${O}/>` +
    [[34, '#c0392b'], [44, '#1d4fa8'], [54, '#e7a512'], [64, '#c0392b'], [74, '#1b6b4a']].map(([y, c]) => `<path d="M14 ${y} L86 ${y}" stroke="${c}" stroke-width="6"/>`).join('') +
    [24, 50, 76].map((x) => `<path d="M${x} 36 l6 8 l-6 8 l-6 -8 Z" fill="#4b2e1e" opacity=".7"/>`).join('') +
    `<rect x="12" y="30" width="76" height="54" rx="2" fill="none" ${O}/>`,
  // 7 قالیچه
  shadow(50, 88, 36) + carpet(18, 26, 64, 58, 'url(#gCarpet)', 'url(#gNavy)'),
  // 8 فرش کاشان
  `<circle cx="50" cy="52" r="46" fill="url(#rGlow)" opacity=".6"/>` + shadow(50, 90, 42) +
    carpet(8, 22, 84, 64, 'url(#gCarpet)', 'url(#gNavy)') +
    [[22, 34], [78, 34], [22, 74], [78, 74]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="url(#gGold)" ${THIN}/>`).join('') +
    sparkle(88, 14, 5),
];

export const GEN_TEXTILE: string[] = [
  // دوک نخ‌ریسی
  shadow(50, 86, 26) +
    `<path d="M50 10 L50 82" stroke="#b07a46" stroke-width="5" stroke-linecap="round"/><path d="M50 10 L50 82" ${THIN}/>` +
    `<ellipse cx="50" cy="70" rx="20" ry="7" fill="url(#gWoodDark)" ${O}/>` + yarn(50, 44, 15, 'url(#rWool)'),
  // دار قالی
  shadow(50, 89, 38) +
    `<rect x="16" y="14" width="68" height="70" rx="3" fill="none" ${O} stroke="url(#gWood)" stroke-width="7"/><rect x="16" y="14" width="68" height="70" rx="3" fill="none" ${THIN}/>` +
    Array.from({ length: 11 }, (_, i) => `<path d="M${24 + i * 5.2} 18 L${24 + i * 5.2} 80" stroke="#efe4cc" stroke-width="1.4"/>`).join('') +
    carpet(22, 52, 56, 26, 'url(#gCarpet)', 'url(#gNavy)', false),
  // دار قالی بزرگ
  shadow(50, 90, 44) +
    `<rect x="8" y="10" width="84" height="76" rx="3" fill="none" ${O} stroke="url(#gWoodDark)" stroke-width="8"/><rect x="8" y="10" width="84" height="76" rx="3" fill="none" ${THIN}/>` +
    Array.from({ length: 14 }, (_, i) => `<path d="M${16 + i * 5.2} 14 L${16 + i * 5.2} 82" stroke="#efe4cc" stroke-width="1.4"/>`).join('') +
    carpet(14, 36, 72, 44, 'url(#gCarpet)', 'url(#gNavy)') + yarn(84, 16, 7, 'url(#gYellow)') + sparkle(14, 16, 4),
];

const tile = (x: number, y: number, s: number, base: string, pattern: string) =>
  g(`<rect x="-22" y="-22" width="44" height="44" rx="4" fill="${base}" ${O}/>` + pattern + shine(-12, -12, 6, 3, -30, 0.55), `translate(${x} ${y}) scale(${s})`);

const minaPattern = (r: number) =>
  `<circle r="${r}" fill="url(#gBlue)" ${O}/><circle r="${r * 0.72}" fill="none" stroke="#f6c945" stroke-width="2"/>` +
  [0, 60, 120, 180, 240, 300].map((a) => `<ellipse cx="0" cy="${-r * 0.45}" rx="${r * 0.12}" ry="${r * 0.22}" transform="rotate(${a})" fill="#fff" opacity=".9"/>`).join('') +
  `<circle r="${r * 0.18}" fill="url(#gGold)"/>`;

export const POTTERY: string[] = [
  // 1 گل رس
  shadow(50, 84, 28) + `<path d="M22 74 C16 58 30 44 44 46 C52 38 70 42 76 54 C84 64 78 78 66 78 L32 80 C26 80 24 78 22 74 Z" fill="url(#gClay)" ${O}/>` +
    shine(40, 54, 8, 3, -20, 0.5) + `<path d="M56 60 q6 2 8 8" fill="none" stroke="#8f4a2a" stroke-width="2" stroke-linecap="round"/>`,
  // 2 خشت
  shadow(50, 86, 34) +
    `<path d="M16 54 L60 46 L84 56 L40 66 Z" fill="#d9a873" ${O}/><path d="M16 54 L40 66 L40 82 L16 70 Z" fill="#b5804d" ${O}/><path d="M40 66 L84 56 L84 72 L40 82 Z" fill="#c69260" ${O}/>` +
    `<path d="M30 56 l6 -2 M50 58 l8 -2 M60 52 l4 1" stroke="#8f6a3a" stroke-width="1.5" stroke-linecap="round"/>`,
  // 3 کاسه سفالی
  shadow(50, 84, 30) +
    `<path d="M16 46 L84 46 C82 70 66 80 50 80 C34 80 18 70 16 46 Z" fill="url(#gTerracotta)" ${O}/>` +
    `<ellipse cx="50" cy="46" rx="34" ry="8" fill="#7a3a1e" ${O}/>` +
    `<path d="M24 58 Q50 66 76 58" fill="none" stroke="#f2e6cc" stroke-width="2.4"/>` + shine(28, 58, 2.5, 7, 30, 0.45),
  // 4 کوزه
  shadow(50, 89, 24) +
    `<path d="M40 18 L60 18 L58 28 C76 34 80 54 72 70 C66 82 34 82 28 70 C20 54 24 34 42 28 Z" fill="url(#gTerracotta)" ${O}/>` +
    `<path d="M58 30 C74 26 80 40 70 50" fill="none" ${O} stroke-width="4"/>` +
    `<ellipse cx="50" cy="18" rx="11" ry="3.5" fill="#7a3a1e" ${O}/>` +
    `<path d="M28 52 Q50 60 72 52" fill="none" stroke="#f2e6cc" stroke-width="2.4"/>` + shine(36, 46, 3, 10, 10, 0.45),
  // 5 کاشی فیروزه‌ای
  shadow(50, 86, 28) + tile(50, 54, 1.25, 'url(#gTurq)', `<path d="M0 -14 L14 0 L0 14 L-14 0 Z" fill="#fff" opacity=".85"/><circle r="5" fill="url(#gBlue)"/>`),
  // 6 کاشی گل‌دار
  shadow(50, 86, 28) + tile(50, 54, 1.25, 'url(#gCream)',
    `<rect x="-19" y="-19" width="38" height="38" rx="2" fill="none" stroke="#1d4fa8" stroke-width="2.2"/>` +
    [0, 90, 180, 270].map((a) => `<path d="M0 -4 C-6 -10 -4 -16 0 -16 C4 -16 6 -10 0 -4 Z" transform="rotate(${a})" fill="url(#gBlue)"/>`).join('') +
    [45, 135, 225, 315].map((a) => `<ellipse cx="0" cy="-12" rx="2.5" ry="5" transform="rotate(${a})" fill="url(#gTurq)"/>`).join('') + `<circle r="4" fill="url(#gYellow)"/>`),
  // 7 بشقاب مینا
  shadow(50, 88, 34) + g(minaPattern(36), 'translate(50 52)'),
  // 8 گلدان مینا
  `<circle cx="50" cy="52" r="46" fill="url(#rGlow)" opacity=".6"/>` + shadow(50, 90, 24) +
    `<path d="M38 12 L62 12 L58 26 C78 34 82 56 72 74 C66 84 34 84 28 74 C18 56 22 34 42 26 Z" fill="url(#gBlue)" ${O}/>` +
    `<ellipse cx="50" cy="12" rx="13" ry="4" fill="url(#gGold)" ${O}/>` +
    `<path d="M26 44 Q50 52 74 44 M24 64 Q50 72 76 64" fill="none" stroke="#f6c945" stroke-width="2.4"/>` +
    [[38, 54], [50, 56], [62, 54]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="#fff"/><circle cx="${x}" cy="${y}" r="1.4" fill="url(#gRoseDeep)"/>`).join('') +
    shine(34, 40, 3, 10, 15, 0.6) + sparkle(84, 22, 5),
];

const kiln = (s: number, extra = '') =>
  g(
    `<path d="M-30 32 L-30 -4 C-30 -26 30 -26 30 -4 L30 32 Z" fill="url(#gTerracotta)" ${O}/>` +
      `<path d="M-30 6 L30 6 M-30 20 L30 20 M-12 -6 L-12 6 M12 -6 L12 6 M0 6 L0 20 M-20 20 L-20 32 M20 20 L20 32" stroke="${INK}" stroke-width="1.4" opacity=".45"/>` +
      `<path d="M-12 32 L-12 18 C-12 10 12 10 12 18 L12 32 Z" fill="#3b1d10" ${O}/><path d="M-7 32 C-8 24 -2 20 0 16 C3 21 8 25 7 32 Z" fill="url(#gFire)"/>` +
      `<rect x="-6" y="-34" width="12" height="12" fill="url(#gTerracotta)" ${O}/>` + extra,
    `translate(50 50) scale(${s})`,
  );

export const GEN_POTTERY: string[] = [
  shadow(50, 88, 28) + kiln(0.85),
  shadow(50, 89, 32) + kiln(1, `<path d="M0 -36 q-6 -8 0 -14" fill="none" stroke="#d8d8d8" stroke-width="3" stroke-linecap="round" opacity=".8"/>`),
  shadow(50, 90, 40) + kiln(1.05, `<path d="M-34 32 L34 32 L36 38 L-36 38 Z" fill="url(#gClay)" ${O}/>`) +
    g(minaPattern(9), 'translate(84 74)') + sparkle(14, 22, 5),
];
