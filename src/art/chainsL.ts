// Season 10: Isfahan handicrafts («صنایع دستی») chain and its generator (the easel).

import { INK, O, THIN, g, shadow, shine, sparkle } from './kit';

const brush = (x: number, y: number, rot: number, tip: string) =>
  g(`<rect x="-3" y="-30" width="6" height="34" rx="2" fill="url(#gWood)" ${THIN}/><rect x="-3.5" y="2" width="7" height="6" fill="url(#gSilver)" ${THIN} stroke-width="1"/>` +
    `<path d="M-3.5 8 Q0 22 3.5 8 Z" fill="${tip}" ${THIN} stroke-width="1"/>`, `translate(${x} ${y}) rotate(${rot})`);

const motif = (cx: number, cy: number, r: number) =>
  [0, 60, 120, 180, 240, 300].map((a) => `<ellipse cx="${cx}" cy="${cy - r * 0.55}" rx="${r * 0.22}" ry="${r * 0.42}" transform="rotate(${a} ${cx} ${cy})" fill="#fffdf6" ${THIN} stroke-width=".6"/>`).join('') +
  `<circle cx="${cx}" cy="${cy}" r="${r * 0.22}" fill="#e0303f"/>`;

export const CRAFT: string[] = [
  // 1 قلم‌مو
  shadow(50, 86, 20) + brush(50, 54, 30, '#e0303f'),
  // 2 رنگ‌دان (paint pots)
  shadow(50, 88, 30) + [[30, '#3a76c4'], [50, '#e0303f'], [70, '#f6c945']].map(([x, c]) => `<path d="M${Number(x) - 9} 60 H${Number(x) + 9} L${Number(x) + 7} 80 H${Number(x) - 7} Z" fill="url(#gCream)" ${O}/><ellipse cx="${x}" cy="60" rx="9" ry="3" fill="${c}" ${THIN} stroke-width="1"/>`).join('') + brush(70, 40, 40, '#3a76c4'),
  // 3 کاسه‌ی مینا
  shadow(50, 88, 28) + `<path d="M20 50 H80 C78 72 66 82 50 82 C34 82 22 72 20 50 Z" fill="url(#gBlue)" ${O}/><ellipse cx="50" cy="50" rx="30" ry="7" fill="#fffdf6" ${THIN}/>` +
    motif(50, 66, 12) + [30, 70].map((x) => `<circle cx="${x}" cy="64" r="3" fill="#f6c945" ${THIN} stroke-width=".8"/>`).join(''),
  // 4 بشقاب قلم‌زنی
  shadow(50, 88, 30) + `<ellipse cx="50" cy="60" rx="34" ry="24" fill="url(#gCopper)" ${O}/><ellipse cx="50" cy="60" rx="24" ry="16" fill="none" stroke="#7a3a1a" stroke-width="1.6"/>` +
    Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<path d="M${50 + Math.cos(a) * 24} ${60 + Math.sin(a) * 16} L${50 + Math.cos(a) * 32} ${60 + Math.sin(a) * 22}" stroke="#7a3a1a" stroke-width="1.2"/>`; }).join('') +
    `<path d="M40 60 q10 -12 20 0 q-10 12 -20 0 Z" fill="none" stroke="#7a3a1a" stroke-width="1.6"/>` + shine(34, 50, 4, 7, 50, 0.5),
  // 5 جعبه‌ی خاتم
  shadow(50, 88, 32) + `<rect x="18" y="44" width="64" height="38" rx="3" fill="url(#gWoodDark)" ${O}/><path d="M18 56 H82" ${THIN}/>` +
    Array.from({ length: 14 }, (_, i) => `<path d="M${24 + (i % 7) * 8} ${64 + Math.floor(i / 7) * 9} l4 4 l-4 4 l-4 -4 Z" fill="${i % 2 ? '#fffdf6' : '#f6c945'}" stroke="${INK}" stroke-width=".6"/>`).join('') +
    `<path d="M24 48 h52" stroke="#f6c945" stroke-width="2" stroke-dasharray="3 2"/>`,
  // 6 قاب مینیاتور
  shadow(50, 90, 28) + `<rect x="22" y="18" width="56" height="70" rx="2" fill="url(#gGold)" ${O}/><rect x="28" y="24" width="44" height="58" fill="#f6e3b0" ${THIN}/>` +
    `<path d="M32 70 Q42 52 50 64 Q58 50 68 70 Z" fill="url(#gLeaf)" ${THIN} stroke-width="1"/><circle cx="60" cy="36" r="5" fill="#f6c945"/>` +
    `<path d="M40 56 q4 -10 8 0" fill="none" stroke="#e0303f" stroke-width="2"/><path d="M28 76 H72" stroke="#3a76c4" stroke-width="2"/>`,
  // 7 قلمدان
  shadow(50, 86, 34) + g(`<rect x="-34" y="-10" width="68" height="20" rx="10" fill="url(#gRed)" ${O}/><rect x="-26" y="-10" width="52" height="20" fill="url(#gGold)" opacity=".35"/>` +
    motif(0, 0, 8) + motif(-18, 0, 6) + motif(18, 0, 6), 'translate(50 64) rotate(-10)'),
  // 8 طاووس میناکاری
  `<circle cx="50" cy="52" r="46" fill="url(#rGlow)" opacity=".55"/>` + shadow(50, 92, 30) +
    Array.from({ length: 9 }, (_, i) => { const a = (-150 + i * 15) * Math.PI / 180; return `<ellipse cx="${50 + Math.cos(a) * 30}" cy="${60 + Math.sin(a) * 30}" rx="7" ry="11" transform="rotate(${-150 + i * 15 + 90} ${50 + Math.cos(a) * 30} ${60 + Math.sin(a) * 30})" fill="url(#gTurq)" ${THIN} stroke-width="1"/><circle cx="${50 + Math.cos(a) * 32}" cy="${60 + Math.sin(a) * 32}" r="2.6" fill="url(#gBlue)"/>`; }).join('') +
    `<path d="M44 84 C40 70 42 56 50 50 C58 56 60 70 56 84 Z" fill="url(#gBlue)" ${O}/><circle cx="50" cy="44" r="6" fill="url(#gBlue)" ${O}/><path d="M50 38 v-6 M47 34 l3 -4 l3 4" stroke="${INK}" stroke-width="1.2"/>` +
    `<path d="M56 44 l6 1 l-6 2 Z" fill="#f6c945" ${THIN} stroke-width=".8"/><circle cx="52" cy="43" r="1" fill="#fff"/>` + sparkle(14, 26, 5) + sparkle(88, 24, 5),
];

const easel = (s: number, canvas: string) =>
  g(`<path d="M-20 40 L0 -36 L20 40 M0 -36 V40" fill="none" stroke="#8b5328" stroke-width="3.4" stroke-linecap="round"/>` +
    `<rect x="-22" y="-28" width="44" height="34" fill="#fffdf6" ${O}/>` + canvas + `<path d="M-24 8 H24" ${O} stroke-width="3"/>`, `translate(50 50) scale(${s})`);

export const GEN_CRAFT: string[] = [
  // سه‌پایه‌ی کوچک
  shadow(50, 92, 24) + easel(0.85, `<circle cx="0" cy="-12" r="6" fill="#f6c945"/>`),
  // سه‌پایه‌ی نقاشی
  shadow(50, 92, 28) + easel(1, `<path d="M-16 2 Q-6 -16 0 -6 Q6 -18 16 2 Z" fill="url(#gLeaf)" ${THIN} stroke-width="1"/><circle cx="10" cy="-18" r="4" fill="#f6c945"/>`) + brush(78, 66, 22, '#e0303f'),
  // کارگاه مینیاتور
  shadow(50, 94, 38) + easel(1, `<rect x="-18" y="-24" width="36" height="26" fill="#f6e3b0"/><path d="M-14 0 Q-4 -18 2 -8 Q8 -18 14 0 Z" fill="url(#gTurq)" ${THIN} stroke-width="1"/>`) +
    `<path d="M10 84 H34 L32 92 H12 Z" fill="url(#gBlue)" ${THIN}/>` + brush(24, 70, -20, '#3a76c4') + brush(78, 68, 20, '#e0303f') + sparkle(88, 18, 5),
];
