// Season 17: kitchen («آشپزخونه») chain and its generator (the stove).

import { INK, O, THIN, g, shadow, shine, sparkle } from './kit';

const steam = (x: number, y: number) =>
  `<path d="M${x} ${y} q-5 -6 0 -12 q5 -6 0 -12" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".85"/>`;

const herb = (x: number, y: number, rot: number, fill: string) =>
  `<ellipse cx="${x}" cy="${y}" rx="4" ry="9" transform="rotate(${rot} ${x} ${y})" fill="${fill}" ${THIN} stroke-width=".8"/>`;

/** A copper pot with lid, centred on x, standing on `base`. */
const pot = (x: number, base: number, w: number, lid = true) =>
  `<path d="M${x - w / 2} ${base - w * 0.55} H${x + w / 2} L${x + w / 2 - 3} ${base - 4} Q${x} ${base + 2} ${x - w / 2 + 3} ${base - 4} Z" fill="url(#gCopper)" ${O}/>` +
  `<path d="M${x - w / 2 - 8} ${base - w * 0.45} h8 M${x + w / 2} ${base - w * 0.45} h8" ${O} stroke-width="4"/>` +
  (lid ? `<path d="M${x - w / 2 - 2} ${base - w * 0.55} Q${x} ${base - w * 0.85} ${x + w / 2 + 2} ${base - w * 0.55} Z" fill="url(#gCopper)" ${O}/><circle cx="${x}" cy="${base - w * 0.75}" r="3" fill="url(#gBrass)" ${THIN} stroke-width="1"/>` : '') +
  shine(x - w / 4, base - w * 0.32, 2.4, 6, 10, 0.6);

/** Golden crust of rice (tahdig) as seen on a platter. */
const tahdig = (x: number, y: number, r: number) =>
  `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.42}" fill="#e8a040" ${O}/><ellipse cx="${x}" cy="${y - 2}" rx="${r * 0.8}" ry="${r * 0.32}" fill="#f6c35a"/>` +
  Array.from({ length: 7 }, (_, i) => `<circle cx="${x - r * 0.6 + i * r * 0.2}" cy="${y - 2 + (i % 2 ? 2 : -2)}" r="1.4" fill="#c06a1a" opacity=".7"/>`).join('');

export const KITCHEN: string[] = [
  // 1 زعفرون
  shadow(50, 84, 22) + `<ellipse cx="50" cy="72" rx="22" ry="7" fill="url(#gCream)" ${O}/><ellipse cx="50" cy="70" rx="16" ry="4.4" fill="#f6ead2"/>` +
    Array.from({ length: 9 }, (_, i) => `<path d="M${38 + i * 3} ${70 - (i % 3)} l${(i % 2 ? 4 : -3)} -7" stroke="#c0281a" stroke-width="2" stroke-linecap="round"/>`).join('') +
    `<path d="M58 44 q8 -10 14 0 q-6 8 -14 0 Z" fill="#9a5ad0" ${THIN} stroke-width="1"/><path d="M64 46 l0 14" stroke="#3f8a2a" stroke-width="2"/>`,
  // 2 دسته‌ی سبزی
  shadow(50, 88, 22) + [[-20, 'url(#gLeaf)'], [-8, 'url(#gLeafDark)'], [6, 'url(#gLeaf)'], [18, 'url(#gLeafDark)'], [-14, '#7fc85a'], [12, '#7fc85a']].map(([r, c], i) =>
    g(`<path d="M0 30 V-6" stroke="#3f8a2a" stroke-width="1.6"/>` + herb(-5, -10, -20, String(c)) + herb(5, -14, 20, String(c)) + herb(0, -24, 0, String(c)), `translate(${46 + (i % 3) * 4} 52) rotate(${r})`)).join('') +
    `<path d="M40 74 H60" stroke="#c0392b" stroke-width="4" stroke-linecap="round"/>`,
  // 3 کاسه‌ی ماست
  shadow(50, 88, 26) + `<path d="M24 54 H76 C74 74 64 84 50 84 C36 84 26 74 24 54 Z" fill="url(#gBlue)" ${O}/><ellipse cx="50" cy="54" rx="26" ry="7" fill="#fffdf6" ${THIN}/>` +
    `<path d="M40 52 q10 -6 20 0" fill="none" stroke="#e6ecf2" stroke-width="2"/>` + [[44, 52], [54, 50], [50, 56]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="1.4" fill="#3f8a2a"/>`).join('') +
    `<path d="M30 66 q20 8 40 0" fill="none" stroke="#fffdf6" stroke-width="1.6" opacity=".7"/>`,
  // 4 قابلمه‌ی مسی
  shadow(50, 90, 30) + pot(50, 86, 52) + steam(42, 40) + steam(58, 38),
  // 5 دیس ته‌دیگ
  shadow(50, 88, 34) + `<ellipse cx="50" cy="72" rx="38" ry="12" fill="url(#gSilver)" ${O}/>` + tahdig(50, 66, 28) + sparkle(80, 44, 5),
  // 6 دیگ پلو
  shadow(50, 92, 38) + `<path d="M16 46 H84 L80 82 Q50 92 20 82 Z" fill="url(#gSteel)" ${O}/><path d="M10 54 h6 M84 54 h6" ${O} stroke-width="4"/>` +
    `<ellipse cx="50" cy="46" rx="34" ry="8" fill="#fffdf6" ${THIN}/>` + Array.from({ length: 14 }, (_, i) => `<ellipse cx="${24 + (i % 7) * 8}" cy="${44 + Math.floor(i / 7) * 4}" rx="2.4" ry="1.2" fill="${i % 4 ? '#fff6e0' : '#f6c35a'}"/>`).join('') +
    `<path d="M36 40 q14 -6 28 0" fill="none" stroke="#f6c35a" stroke-width="3"/>` + steam(40, 34) + steam(60, 32),
  // 7 سینی کباب
  shadow(50, 90, 38) + `<ellipse cx="50" cy="72" rx="40" ry="12" fill="url(#gBrass)" ${O}/>` +
    `<path d="M20 70 Q50 56 80 70 Q50 80 20 70 Z" fill="#fffdf6" ${THIN}/>` +
    [62, 68].map((y, i) => `<path d="M${22 + i * 6} ${y} H${78 - i * 4}" stroke="#7f8a99" stroke-width="1.6"/><rect x="${26 + i * 6}" y="${y - 3}" width="${46 - i * 8}" height="6" rx="3" fill="#8f4f17" ${THIN} stroke-width=".8"/>`).join('') +
    `<circle cx="72" cy="58" r="6" fill="#e0303f" ${THIN}/><path d="M68 56 q4 -2 8 0" fill="none" stroke="#fff" stroke-width="1" opacity=".7"/>` + herb(28, 60, -60, 'url(#gLeaf)'),
  // 8 ملاقه‌ی طلایی (the contest trophy)
  `<circle cx="50" cy="50" r="46" fill="url(#rGlow)" opacity=".55"/>` + shadow(50, 92, 26) +
    `<path d="M34 88 H66 L62 80 H38 Z" fill="url(#gWoodDark)" ${O}/><rect x="44" y="70" width="12" height="10" fill="url(#gGold)" ${THIN}/>` +
    `<path d="M50 70 C50 50 56 34 66 22" fill="none" stroke="#b7801c" stroke-width="6" stroke-linecap="round"/><path d="M50 70 C50 50 56 34 66 22" fill="none" stroke="#f6c945" stroke-width="3" stroke-linecap="round"/>` +
    `<path d="M30 52 Q32 70 48 70 Q64 70 62 54 Z" fill="url(#gGold)" ${O}/>` + shine(40, 58, 3, 6, 30, 0.8) + sparkle(18, 24, 5) + sparkle(84, 40, 6),
];

/** A stove top with burners; `n` burners, lit or not. */
const stove = (x: number, base: number, w: number, n: number) =>
  `<rect x="${x - w / 2}" y="${base - 16}" width="${w}" height="16" rx="3" fill="url(#gSteel)" ${O}/>` +
  Array.from({ length: n }, (_, i) => { const cx = x - w / 2 + (i + 0.5) * (w / n); return `<ellipse cx="${cx}" cy="${base - 16}" rx="${w / n / 2 - 3}" ry="3" fill="#2a2a2a" ${THIN} stroke-width="1"/><path d="M${cx - 5} ${base - 17} q5 -8 10 0" fill="none" stroke="#5aa7ff" stroke-width="2"/>`; }).join('');

export const GEN_KITCHEN: string[] = [
  // اجاق پیک‌نیکی
  shadow(50, 88, 22) + `<ellipse cx="50" cy="80" rx="20" ry="8" fill="#3a76c4" ${O}/><path d="M42 72 H58 V62 H42 Z" fill="url(#gSteel)" ${THIN}/>` +
    `<path d="M36 62 H64" ${O} stroke-width="3"/><path d="M44 60 q6 -10 12 0" fill="none" stroke="#5aa7ff" stroke-width="2.4"/>` + pot(50, 58, 26, false),
  // اجاق گاز
  shadow(50, 90, 34) + `<rect x="18" y="52" width="64" height="38" rx="3" fill="#fffdf6" ${O}/><rect x="26" y="62" width="48" height="22" rx="2" fill="#3b3b44" ${THIN}/>` +
    stove(50, 52, 64, 2) + pot(36, 38, 22) + `<circle cx="30" cy="57" r="2" fill="${INK}"/><circle cx="70" cy="57" r="2" fill="${INK}"/>`,
  // آشپزخونه‌ی کامل
  `<circle cx="50" cy="50" r="44" fill="#ffe7b8" opacity=".6"/>` + shadow(50, 92, 40) +
    `<rect x="12" y="14" width="76" height="7" rx="2" fill="url(#gWood)" ${O}/>` + [22, 38, 54, 70].map((x, i) => `<rect x="${x}" y="3" width="10" height="11" rx="2" fill="url(#gGlass)" ${THIN} stroke-width="1"/><rect x="${x + 1}" y="7" width="8" height="6" fill="${['#f6c945', '#c0281a', '#3f8a2a', '#e07b1d'][i]}" opacity=".8"/>`).join('') +
    `<rect x="10" y="54" width="80" height="36" rx="3" fill="#fffdf6" ${O}/><path d="M50 58 V88" stroke="${INK}" stroke-width="1.4"/>` + stove(38, 54, 52, 2) + pot(28, 40, 20) + pot(50, 40, 18) +
    sparkle(86, 34, 5),
];
