// Season 18: winter («زمستون») chain and its generator (the wood stove).

import { INK, O, THIN, g, shadow, shine, sparkle } from './kit';

const flake = (x: number, y: number, r: number, stroke = '#9ec4e8', w = 2.4) =>
  [0, 60, 120].map((a) => `<path d="M${x} ${y - r} V${y + r} M${x - r * 0.3} ${y - r * 0.7} L${x} ${y - r * 0.45} L${x + r * 0.3} ${y - r * 0.7} M${x - r * 0.3} ${y + r * 0.7} L${x} ${y + r * 0.45} L${x + r * 0.3} ${y + r * 0.7}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" transform="rotate(${a} ${x} ${y})"/>`).join('');

const knit = (x: number, y: number, w: number, h: number) =>
  Array.from({ length: Math.floor(w / 6) }, (_, i) => `<path d="M${x + 3 + i * 6} ${y} l3 4 l3 -4" fill="none" stroke="#fff" stroke-width="1.2" opacity=".7"/>`).join('') +
  `<path d="M${x} ${y + h} H${x + w}" stroke="#fff" stroke-width="1.2" opacity=".5"/>`;

const beet = (x: number, y: number, r: number) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#8e1240" ${THIN}/><path d="M${x - r * 0.5} ${y - r * 0.2} q${r * 0.5} -${r * 0.4} ${r} 0" fill="none" stroke="#c0386a" stroke-width="1.2" opacity=".8"/>`;

/** A korsi: low table under a big quilt. */
const korsi = (x: number, base: number, w: number) =>
  `<path d="M${x - w / 2} ${base} Q${x - w / 2 - 6} ${base - w * 0.32} ${x - w * 0.36} ${base - w * 0.4} H${x + w * 0.36} Q${x + w / 2 + 6} ${base - w * 0.32} ${x + w / 2} ${base} Z" fill="url(#gRed)" ${O}/>` +
  `<path d="M${x - w * 0.36} ${base - w * 0.4} H${x + w * 0.36} L${x + w * 0.3} ${base - w * 0.48} H${x - w * 0.3} Z" fill="#fffdf6" ${THIN}/>` +
  Array.from({ length: 5 }, (_, i) => `<circle cx="${x - w * 0.3 + i * w * 0.15}" cy="${base - w * 0.2}" r="${w * 0.03}" fill="#f6c945"/>`).join('');

export const WINTER: string[] = [
  // 1 دونه‌ی برف
  shadow(50, 86, 16) + flake(50, 50, 26) + `<circle cx="50" cy="50" r="4" fill="#e6f7ff" ${THIN} stroke-width="1"/>` + sparkle(76, 26, 4),
  // 2 گلوله‌ی برف
  shadow(50, 86, 22) + `<circle cx="50" cy="60" r="24" fill="#f4faff" ${O}/><path d="M34 54 q8 -10 18 -6 M44 70 q8 4 16 -2" fill="none" stroke="#cfe2f2" stroke-width="2"/>` + shine(40, 50, 4, 7, 30, 0.9),
  // 3 دستکش بافتنی
  shadow(50, 88, 26) + g(`<path d="M-16 24 V-6 Q-16 -24 0 -24 Q16 -24 16 -6 V24 Z" fill="url(#gRed)" ${O}/><path d="M16 0 Q30 -6 28 8 Q26 16 16 14" fill="url(#gRed)" ${O}/>` +
    `<rect x="-18" y="18" width="36" height="12" rx="3" fill="#fffdf6" ${O}/>` + knit(-14, -12, 28, 18), 'translate(46 56) rotate(-8)'),
  // 4 شال‌گردن
  shadow(50, 90, 30) +
    [[44, 50, 40, 86, 52, 54, 52], [56, 50, 62, 84, 74, 64, 48]].map(([a, b, c, d, e, g2, h2]) =>
      `<path d="M${a} ${b} L${c} ${d} H${e} L${g2} ${h2} Z" fill="url(#gTurq)" ${O}/>` + [0.35, 0.6].map((t) => `<path d="M${a + (c - a) * t - 1} ${b + (d - b) * t} H${g2 + (e - g2) * t + 1}" stroke="#fffdf6" stroke-width="2.6"/>`).join('') +
      [0, 1, 2, 3].map((i) => `<path d="M${c + 2 + i * 3} ${d} v6" stroke="#14879a" stroke-width="1.4"/>`).join('')).join('') +
    `<path d="M22 40 a28 13 0 1 0 56 0 a28 13 0 1 0 -56 0 Z M34 40 a16 6 0 1 0 32 0 a16 6 0 1 0 -32 0 Z" fill-rule="evenodd" fill="url(#gTurq)" ${O}/>` +
    `<path d="M26 44 q24 12 48 0" fill="none" stroke="#fffdf6" stroke-width="2.4"/>` + knit(30, 30, 40, 6),
  // 5 کاسه‌ی لبو
  shadow(50, 88, 28) + `<path d="M22 54 H78 C76 74 66 84 50 84 C34 84 24 74 22 54 Z" fill="url(#gCream)" ${O}/><ellipse cx="50" cy="54" rx="28" ry="7" fill="#6a0e30" ${THIN}/>` +
    beet(40, 50, 8) + beet(56, 48, 9) + beet(48, 42, 7) + `<path d="M58 34 q4 -6 0 -12 M44 34 q-4 -6 0 -12" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/>`,
  // 6 کتری روی بخاری
  shadow(50, 90, 30) + `<rect x="26" y="66" width="48" height="24" rx="4" fill="url(#gSteel)" ${O}/><rect x="34" y="72" width="32" height="10" rx="2" fill="#ffb347" ${THIN}/>` +
    `<path d="M34 64 C30 42 70 42 66 64 Z" fill="url(#gBlue)" ${O}/><path d="M66 54 L80 44" ${O} stroke-width="4"/><path d="M40 44 Q50 30 60 44" fill="none" ${O} stroke-width="3"/>` +
    `<path d="M80 40 q-4 -6 0 -12 q4 -6 0 -12" fill="none" stroke="#fff" stroke-width="2.4" opacity=".85"/>` + shine(42, 54, 3, 5, 20, 0.7),
  // 7 کرسی
  `<circle cx="50" cy="56" r="40" fill="url(#rGlow)" opacity=".45"/>` + shadow(50, 90, 40) + korsi(50, 88, 76) +
    `<ellipse cx="50" cy="56" rx="12" ry="4" fill="url(#gCream)" ${THIN}/>` + [44, 50, 56].map((x, i) => `<circle cx="${x}" cy="${53 - (i % 2) * 2}" r="3.4" fill="${['#e0303f', '#f07b1d', '#c0281a'][i]}" ${THIN} stroke-width=".8"/>`).join(''),
  // 8 آدم‌برفی
  `<circle cx="50" cy="50" r="46" fill="#e6f2ff" opacity=".7"/>` + shadow(50, 92, 28) +
    `<circle cx="50" cy="72" r="20" fill="#fafdff" ${O}/><circle cx="50" cy="40" r="14" fill="#fafdff" ${O}/>` +
    `<circle cx="45" cy="37" r="1.8" fill="${INK}"/><circle cx="55" cy="37" r="1.8" fill="${INK}"/><path d="M50 41 L60 44 L50 45 Z" fill="#f07b1d" ${THIN} stroke-width=".8"/>` +
    `<path d="M38 52 Q50 58 62 52 L64 58 Q50 64 36 58 Z" fill="url(#gRed)" ${THIN}/><path d="M58 56 L62 74 H54 L54 58 Z" fill="url(#gRed)" ${THIN}/>` +
    `<path d="M38 24 H62 L60 30 H40 Z" fill="#2a2a2a" ${THIN}/><path d="M42 24 V12 H58 V24" fill="#2a2a2a" ${THIN}/>` +
    [66, 74].map((y) => `<circle cx="50" cy="${y}" r="2" fill="${INK}"/>`).join('') + `<path d="M30 66 L16 56 M70 66 L84 56" stroke="#6b4a2a" stroke-width="2.4" stroke-linecap="round"/>` +
    flake(16, 20, 6, '#9ec4e8', 1.4) + flake(86, 30, 5, '#9ec4e8', 1.4),
];

export const GEN_WINTER: string[] = [
  // منقل کوچک
  shadow(50, 88, 26) + `<path d="M26 60 H74 L68 78 H32 Z" fill="url(#gCopper)" ${O}/><path d="M34 78 L30 88 M66 78 L70 88" ${O} stroke-width="3"/>` +
    [38, 50, 62].map((x) => `<circle cx="${x}" cy="58" r="6" fill="#3a2a2a" ${THIN} stroke-width="1"/><circle cx="${x}" cy="57" r="3" fill="#ff7a2a"/>`).join(''),
  // بخاری هیزمی
  shadow(50, 90, 30) + `<rect x="28" y="46" width="44" height="40" rx="4" fill="#3a3a44" ${O}/><rect x="36" y="56" width="28" height="20" rx="3" fill="url(#gFire)" ${THIN}/>` +
    `<path d="M50 46 V14" stroke="#3a3a44" stroke-width="8"/><path d="M50 14 V10" stroke="#5a5a64" stroke-width="10"/><path d="M30 86 v4 M70 86 v4" ${O} stroke-width="3"/>` +
    `<path d="M58 10 q6 -4 10 0" fill="none" stroke="#cfd8dc" stroke-width="2"/>`,
  // شومینه‌ی سنگی
  `<circle cx="50" cy="56" r="42" fill="url(#rGlow)" opacity=".5"/>` + shadow(50, 92, 40) +
    `<rect x="12" y="22" width="76" height="68" fill="#b8a898" ${O}/>` + [34, 46, 58, 70, 82].map((y) => `<path d="M12 ${y} H88" stroke="#8a7a6a" stroke-width="1" opacity=".7"/>`).join('') +
    `<path d="M28 90 V60 Q28 44 50 44 Q72 44 72 60 V90 Z" fill="#2a1a10" ${O}/><path d="M36 88 C34 74 46 70 44 60 C52 68 50 54 56 50 C60 64 68 70 62 88 Z" fill="url(#gFire)"/>` +
    `<rect x="8" y="18" width="84" height="7" rx="2" fill="url(#gWoodDark)" ${O}/>` + sparkle(86, 12, 5),
];
