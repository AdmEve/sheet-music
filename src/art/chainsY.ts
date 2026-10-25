// Season 23: watermill («آسیاب») chain and its generator (the grain store).

import { INK, O, THIN, g, shadow, shine, sparkle } from './kit';

const STONE = '#a8a29a';

/** A burlap sack with grain at its mouth. */
const sack = (x: number, base: number, w: number) =>
  `<path d="M${x - w / 2} ${base} C${x - w / 2 - 4} ${base - w * 0.6} ${x - w * 0.42} ${base - w * 0.9} ${x - w * 0.3} ${base - w * 0.94} H${x + w * 0.3} C${x + w * 0.42} ${base - w * 0.9} ${x + w / 2 + 4} ${base - w * 0.6} ${x + w / 2} ${base} Z" fill="#c9a26b" ${O}/>` +
  `<path d="M${x - w * 0.36} ${base - w * 0.5} q${w * 0.36} ${w * 0.1} ${w * 0.72} 0" fill="none" stroke="#a07a48" stroke-width="1.4"/>` +
  `<ellipse cx="${x}" cy="${base - w * 0.94}" rx="${w * 0.3}" ry="${w * 0.1}" fill="#e8b860" ${THIN} stroke-width="1"/>`;

/** A wheat ear leaning at `rot` degrees, rooted at (x, y). */
const ear = (x: number, y: number, len: number, rot: number) =>
  g(`<path d="M0 0 V${-len}" stroke="#c9952e" stroke-width="1.6"/>` +
    Array.from({ length: 5 }, (_, i) => `<ellipse cx="-2.4" cy="${-len + 4 + i * 4}" rx="2" ry="3.4" transform="rotate(-25 -2.4 ${-len + 4 + i * 4})" fill="#f0c050" stroke="#a5621f" stroke-width=".6"/><ellipse cx="2.4" cy="${-len + 6 + i * 4}" rx="2" ry="3.4" transform="rotate(25 2.4 ${-len + 6 + i * 4})" fill="#f0c050" stroke="#a5621f" stroke-width=".6"/>`).join(''),
  `translate(${x} ${y}) rotate(${rot})`);

/** A millstone seen face-on. */
const millstone = (x: number, y: number, r: number) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${STONE}" ${O}/><circle cx="${x}" cy="${y}" r="${r * 0.2}" fill="#5a544c" ${THIN}/>` +
  Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `<path d="M${x + Math.cos(a) * r * 0.3} ${y + Math.sin(a) * r * 0.3} L${x + Math.cos(a + 0.3) * r * 0.9} ${y + Math.sin(a + 0.3) * r * 0.9}" stroke="#86807a" stroke-width="1.6"/>`; }).join('') +
  shine(x - r * 0.45, y - r * 0.45, r * 0.12, r * 0.24, 30, 0.5);

/** A wooden water wheel (paddles round a hub). */
const waterWheel = (x: number, y: number, r: number) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#5e3418" stroke-width="${r * 0.16}"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#8b5328" stroke-width="${r * 0.09}"/>` +
  Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `<path d="M${x} ${y} L${x + Math.cos(a) * r} ${y + Math.sin(a) * r}" stroke="#8b5328" stroke-width="${r * 0.08}"/>` +
    `<rect x="${x + Math.cos(a) * r - r * 0.12}" y="${y + Math.sin(a) * r - r * 0.2}" width="${r * 0.24}" height="${r * 0.4}" fill="url(#gWood)" ${THIN} stroke-width="1" transform="rotate(${(a * 180) / Math.PI} ${x + Math.cos(a) * r} ${y + Math.sin(a) * r})"/>`; }).join('') +
  `<circle cx="${x}" cy="${y}" r="${r * 0.16}" fill="url(#gWoodDark)" ${THIN}/>`;

export const MILL: string[] = [
  // 1 غربال
  shadow(50, 86, 26) + `<ellipse cx="50" cy="56" rx="30" ry="12" fill="#efd9b0" ${O}/><ellipse cx="50" cy="56" rx="24" ry="8.6" fill="#fffdf6" ${THIN}/>` +
    Array.from({ length: 5 }, (_, i) => `<path d="M${34 + i * 8} 49 V63" stroke="#c9a26b" stroke-width=".8"/>`).join('') + `<path d="M28 56 H72 M30 52 H70 M30 60 H70" stroke="#c9a26b" stroke-width=".8"/>` +
    `<path d="M20 56 V64 Q50 80 80 64 V56" fill="none" stroke="url(#gWood)" stroke-width="5"/><path d="M20 56 V64 Q50 80 80 64 V56" fill="none" stroke="#a77a4f" stroke-width="4"/>` +
    [[42, 80], [52, 84], [60, 79]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#fffdf6" ${THIN} stroke-width=".5"/>`).join(''),
  // 2 پیمانه‌ی چوبی
  shadow(50, 88, 24) + `<path d="M28 46 H72 L68 86 H32 Z" fill="url(#gWood)" ${O}/><path d="M30 60 H70 M31 74 H69" stroke="#8b5328" stroke-width="1.6"/>` +
    `<ellipse cx="50" cy="46" rx="22" ry="7" fill="#e8b860" ${THIN}/>` + Array.from({ length: 9 }, (_, i) => `<ellipse cx="${34 + (i * 4)}" cy="${44 + (i % 3)}" rx="2" ry="1.2" fill="#c9952e"/>`).join('') + ear(64, 46, 30, 18),
  // 3 گونی گندم
  shadow(50, 90, 28) + sack(50, 88, 48) + ear(42, 42, 30, -18) + ear(52, 40, 34, 0) + ear(62, 42, 28, 20) +
    `<path d="M24 88 q4 -4 8 0 M70 88 q4 -4 8 0" fill="#e8b860" stroke="#a5621f" stroke-width=".8"/>`,
  // 4 تغار خمیر
  shadow(50, 90, 36) + `<path d="M14 50 H86 L74 86 H26 Z" fill="url(#gClay)" ${O}/><path d="M18 58 H82" stroke="#3f8a5a" stroke-width="6"/><path d="M18 58 H82" stroke="#4aa86a" stroke-width="3"/>` +
    `<ellipse cx="50" cy="50" rx="36" ry="9" fill="#8a4a2a" ${THIN}/><path d="M22 50 Q30 38 44 42 Q56 34 66 42 Q78 40 78 50 Q50 58 22 50 Z" fill="url(#gDough)" ${THIN}/>` + shine(40, 42, 4, 2, 0, 0.8),
  // 5 پاروی نونوایی
  shadow(50, 90, 36) + g(`<rect x="-3" y="-46" width="6" height="58" rx="3" fill="url(#gWood)" ${THIN}/><path d="M-20 12 H20 L16 44 H-16 Z" fill="url(#gWood)" ${O}/>`, 'translate(42 42) rotate(-35)') +
    g(`<path d="M-16 -8 Q0 -12 16 -8 L14 10 Q0 13 -14 10 Z" fill="url(#gCrust)" ${THIN}/>` + Array.from({ length: 6 }, (_, i) => `<ellipse cx="${-9 + (i % 3) * 9}" cy="${i < 3 ? -3 : 5}" rx="1.8" ry="1.3" fill="#8f4f17" opacity=".6"/>`).join(''), 'translate(64 72) rotate(-35)'),
  // 6 سنگ آسیاب
  shadow(50, 90, 34) + `<ellipse cx="50" cy="78" rx="34" ry="10" fill="#8a847c" ${O}/>` + millstone(50, 52, 30) + `<path d="M18 80 q6 -4 12 0" fill="#fffdf6" opacity=".8"/>`,
  // 7 چرخ آسیاب
  shadow(50, 92, 36) + `<path d="M8 84 Q30 78 50 84 T92 84 V92 H8 Z" fill="url(#gWater)" ${THIN}/>` + waterWheel(50, 52, 32) +
    `<path d="M20 84 q4 -8 10 -4 M70 82 q4 -8 10 -2" fill="none" stroke="#fff" stroke-width="1.6"/>` + [[24, 70], [78, 66]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#bfe9ff" ${THIN} stroke-width=".6"/>`).join(''),
  // 8 آسیاب آبی
  `<circle cx="50" cy="50" r="46" fill="url(#rGlow)" opacity=".5"/>` + shadow(50, 94, 42) +
    `<path d="M4 88 Q28 82 50 88 T96 88 V94 H4 Z" fill="url(#gWater)" ${THIN}/>` +
    `<rect x="36" y="38" width="52" height="48" fill="#c9b89a" ${O}/>` + Array.from({ length: 3 }, (_, i) => `<path d="M36 ${50 + i * 12} H88" stroke="#a8987a" stroke-width="1.2"/>`).join('') +
    `<path d="M30 40 L62 18 L94 40 Z" fill="url(#gWoodDark)" ${O}/><rect x="56" y="58" width="14" height="28" rx="2" fill="url(#gWoodDark)" ${THIN}/><rect x="74" y="48" width="10" height="10" fill="url(#gSky)" ${THIN} stroke-width="1"/>` +
    waterWheel(28, 68, 17) + `<path d="M8 40 H28 V46" fill="none" stroke="#8b5328" stroke-width="4"/><path d="M28 46 V54" stroke="#9ec4e8" stroke-width="3"/>` + sparkle(90, 14, 5) + sparkle(10, 24, 4),
];

export const GEN_MILL: string[] = [
  // کیسه‌ی گندم
  shadow(50, 88, 22) + sack(50, 86, 36) + ear(50, 52, 22, 8),
  // انبار گندم
  shadow(50, 90, 34) + `<rect x="18" y="40" width="64" height="48" fill="url(#gWood)" ${O}/><path d="M18 56 H82 M18 72 H82" stroke="#8b5328" stroke-width="1.6"/>` +
    `<path d="M14 42 L50 22 L86 42 Z" fill="url(#gWoodDark)" ${O}/><rect x="40" y="58" width="20" height="30" fill="#5e3418" ${THIN}/>` +
    `<path d="M40 88 Q50 72 60 88 Z" fill="#e8b860" ${THIN} stroke-width="1"/>` + ear(28, 40, 18, -12) + ear(72, 40, 18, 12),
  // آسیاب دستی
  `<circle cx="50" cy="50" r="44" fill="#fff0c8" opacity=".6"/>` + shadow(50, 92, 38) +
    `<ellipse cx="50" cy="80" rx="36" ry="10" fill="#fffdf6" ${THIN}/><ellipse cx="50" cy="70" rx="28" ry="9" fill="#8a847c" ${O}/><path d="M22 70 V62 M78 70 V62" stroke="${INK}" stroke-width="2.6"/>` +
    `<ellipse cx="50" cy="62" rx="28" ry="9" fill="${STONE}" ${O}/><ellipse cx="50" cy="62" rx="6" ry="2.4" fill="#5a544c"/><path d="M68 60 V36" stroke="url(#gWood)" stroke-width="6" stroke-linecap="round"/><path d="M68 60 V36" stroke="#8b5328" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M20 80 q6 -6 12 0 M68 82 q6 -5 12 0" fill="#fffdf6" ${THIN} stroke-width=".8"/>` + sparkle(86, 24, 5),
];
