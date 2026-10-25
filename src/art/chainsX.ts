// Season 22: toys («بازی») chain and its generator (the toy chest).

import { INK, O, THIN, g, shadow, shine, sparkle } from './kit';

const marble = (x: number, y: number, r: number, c: string) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${THIN}/><path d="M${x - r * 0.6} ${y + r * 0.2} q${r * 0.6} -${r * 0.9} ${r * 1.2} -${r * 0.2}" fill="none" stroke="#fff" stroke-width="1.4" opacity=".7"/>` + shine(x - r * 0.35, y - r * 0.35, r * 0.18, r * 0.3, 30, 0.9);

const wheel = (x: number, y: number, r: number) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#2a2a2a" ${O}/><circle cx="${x}" cy="${y}" r="${r * 0.4}" fill="url(#gSilver)" ${THIN} stroke-width="1"/>`;

export const TOYS: string[] = [
  // 1 تیله
  shadow(50, 86, 24) + marble(40, 70, 10, 'url(#gBlue)') + marble(60, 72, 9, 'url(#gRed)') + marble(50, 54, 9, 'url(#gLeaf)'),
  // 2 فرفره‌ی کاغذی
  shadow(50, 90, 14) + `<path d="M50 50 V90" stroke="#8b5328" stroke-width="3"/>` +
    [['#e0303f', 0], ['#f6c945', 90], ['#3a76c4', 180], ['#3f8a2a', 270]].map(([c, a]) => `<path d="M50 50 L50 20 Q64 18 68 32 Z" fill="${c}" ${THIN} stroke-width="1" transform="rotate(${a} 50 50)"/>`).join('') + `<circle cx="50" cy="50" r="3" fill="url(#gGold)" ${THIN} stroke-width=".8"/>`,
  // 3 یویو
  shadow(50, 88, 20) + `<path d="M50 10 V40" stroke="#c9a26b" stroke-width="1.6"/><circle cx="50" cy="12" r="4" fill="none" stroke="#c9a26b" stroke-width="2"/>` +
    `<circle cx="50" cy="58" r="22" fill="url(#gRoseDeep)" ${O}/><circle cx="50" cy="58" r="13" fill="url(#gRose)" ${THIN}/><circle cx="50" cy="58" r="4" fill="#fffdf6" ${THIN} stroke-width="1"/>` + shine(40, 48, 3, 6, 30, 0.8),
  // 4 هواپیمای کاغذی
  shadow(50, 86, 28) + g(`<path d="M-34 6 L34 -10 L-10 12 Z" fill="#fffdf6" ${O}/><path d="M-10 12 L34 -10 L-4 22 Z" fill="#e6ecf2" ${O}/><path d="M-34 6 L-10 12" stroke="#c9d1dc" stroke-width="1.4"/>`, 'translate(50 56) rotate(-10)') +
    `<path d="M16 76 q10 -8 20 -2 t20 -4" fill="none" stroke="#9ec4e8" stroke-width="2" stroke-dasharray="3 3"/>`,
  // 5 قطار چوبی
  shadow(50, 90, 36) + `<rect x="16" y="54" width="34" height="24" rx="3" fill="url(#gRed)" ${O}/><rect x="24" y="40" width="16" height="16" fill="url(#gRed)" ${O}/><rect x="40" y="46" width="8" height="10" fill="#2a2a2a" ${THIN}/>` +
    `<rect x="54" y="60" width="30" height="18" rx="3" fill="url(#gBlue)" ${O}/><path d="M50 70 H54" ${O} stroke-width="3"/>` + wheel(24, 82, 6) + wheel(42, 82, 6) + wheel(60, 82, 5) + wheel(78, 82, 5) +
    `<path d="M44 40 q-2 -8 4 -12" fill="none" stroke="#cfd8dc" stroke-width="3"/>`,
  // 6 اسب چوبی
  shadow(50, 92, 36) + `<path d="M14 84 Q50 98 86 84" fill="none" stroke="url(#gWoodDark)" stroke-width="6"/><path d="M14 84 Q50 98 86 84" fill="none" stroke="#5e3418" stroke-width="2"/>` +
    `<path d="M30 84 L36 62 M70 84 L64 62" stroke="#8b5328" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M28 64 H68 Q74 50 66 44 L70 26 Q60 22 56 30 L52 44 H34 Q26 50 28 64 Z" fill="url(#gWood)" ${O}/>` +
    `<path d="M58 30 q-8 -6 -4 -14 M54 34 q-8 -4 -6 -12" fill="none" stroke="#3b2216" stroke-width="3" stroke-linecap="round"/><circle cx="64" cy="32" r="1.8" fill="${INK}"/>` +
    `<path d="M40 50 H54" stroke="#e0303f" stroke-width="5"/>`,
  // 7 سه‌چرخه
  shadow(50, 92, 38) + wheel(26, 82, 8) + wheel(66, 72, 18) +
    ['M26 82 L40 60 L60 46 M60 46 L66 72 M60 46 V38'].map((d) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#e0303f" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`).join('') +
    `<path d="M52 38 H68" stroke="#2a2a2a" stroke-width="4" stroke-linecap="round"/><rect x="32" y="52" width="16" height="6" rx="3" fill="#2a2a2a"/>` +
    `<path d="M66 72 l6 7" stroke="#5a5a5a" stroke-width="2.4"/><rect x="69" y="78" width="9" height="3" rx="1" fill="#2a2a2a"/>`,
  // 8 چرخ‌وفلک
  `<circle cx="50" cy="50" r="46" fill="url(#rGlow)" opacity=".55"/>` + shadow(50, 92, 36) +
    `<path d="M20 40 L50 14 L80 40 Z" fill="url(#gRed)" ${O}/>` + Array.from({ length: 6 }, (_, i) => `<path d="M${20 + i * 10} 40 q5 6 10 0" fill="${i % 2 ? '#fffdf6' : 'url(#gRed)'}" ${THIN} stroke-width="1"/>`).join('') +
    `<path d="M50 40 V84" stroke="url(#gGold)" stroke-width="4"/><path d="M50 40 V84" stroke="#d9a63a" stroke-width="4"/><ellipse cx="50" cy="86" rx="32" ry="6" fill="url(#gBlue)" ${O}/>` +
    [[28, 62], [72, 62]].map(([x, y], i) => `<path d="M${x} 42 V${y - 8}" stroke="#d9a63a" stroke-width="2"/>` + g(`<path d="M-10 0 H8 Q12 -8 6 -12 L8 -20 Q2 -22 0 -16 L-2 -8 H-8 Q-12 -4 -10 0 Z" fill="${i ? 'url(#gYellow)' : 'url(#gTurq)'}" ${THIN}/>`, `translate(${x} ${y})`)).join('') +
    `<circle cx="50" cy="14" r="3" fill="url(#gGold)" ${THIN} stroke-width=".8"/>` + sparkle(14, 22, 5) + sparkle(88, 26, 5),
];

const chest = (x: number, base: number, w: number, open: boolean, top: string) =>
  `<rect x="${x - w / 2}" y="${base - w * 0.5}" width="${w}" height="${w * 0.5}" rx="3" fill="url(#gWood)" ${O}/>` +
  (open ? `<path d="M${x - w / 2} ${base - w * 0.5} L${x - w / 2 + 4} ${base - w * 0.86} H${x + w / 2 - 4} L${x + w / 2} ${base - w * 0.5} Z" fill="url(#gWoodDark)" ${O}/>` + top
    : `<rect x="${x - w / 2 - 2}" y="${base - w * 0.62}" width="${w + 4}" height="${w * 0.14}" rx="3" fill="url(#gWoodDark)" ${O}/>`) +
  `<rect x="${x - 5}" y="${base - w * 0.42}" width="10" height="8" rx="2" fill="url(#gBrass)" ${THIN} stroke-width="1"/>`;

export const GEN_TOYS: string[] = [
  // جعبه‌ی تیله
  shadow(50, 88, 26) + chest(50, 86, 44, false, '') + marble(30, 82, 5, 'url(#gBlue)') + marble(72, 84, 4, 'url(#gRed)'),
  // صندوق اسباب‌بازی
  shadow(50, 90, 32) + chest(50, 88, 56, true, marble(36, 60, 5, 'url(#gLeaf)') + `<circle cx="54" cy="54" r="8" fill="url(#gRoseDeep)" ${THIN}/>` + `<path d="M64 60 L70 42" stroke="#8b5328" stroke-width="2"/><path d="M70 42 l-6 -4 l8 -2 Z" fill="#f6c945" ${THIN} stroke-width=".8"/>`),
  // دکه‌ی اسباب‌بازی
  `<circle cx="50" cy="52" r="44" fill="#ffe0ef" opacity=".55"/>` + shadow(50, 92, 40) +
    `<path d="M10 34 L50 18 L90 34 V40 H10 Z" fill="url(#gTurq)" ${O}/>` + Array.from({ length: 6 }, (_, i) => `<path d="M${12 + i * 13} 40 q6.5 6 13 0" fill="${i % 2 ? '#fffdf6' : 'url(#gTurq)'}" ${THIN} stroke-width="1"/>`).join('') +
    `<path d="M16 40 V90 M84 40 V90" ${O} stroke-width="4"/><rect x="14" y="70" width="72" height="20" fill="url(#gWood)" ${O}/>` +
    marble(30, 64, 6, 'url(#gBlue)') + `<circle cx="50" cy="60" r="9" fill="url(#gRoseDeep)" ${THIN}/>` + marble(70, 64, 6, 'url(#gRed)') + sparkle(88, 22, 5),
];
