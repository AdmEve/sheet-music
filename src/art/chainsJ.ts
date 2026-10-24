// Season 8: football («فوتبال») chain and its generator (the sports bag).

import { INK, O, THIN, g, shadow, shine, sparkle } from './kit';

const ball = (x: number, y: number, r: number, fill = '#fffdf6', patch = INK) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${O}/>` +
  `<path d="M${x} ${y - r * 0.35} l${r * 0.33} ${r * 0.24} l${-r * 0.13} ${r * 0.4} h${-r * 0.4} l${-r * 0.13} ${-r * 0.4} Z" fill="${patch}"/>` +
  `<path d="M${x} ${y - r * 0.35} V${y - r} M${x + r * 0.33} ${y - r * 0.11} l${r * 0.6} ${-r * 0.2} M${x - r * 0.33} ${y - r * 0.11} l${-r * 0.6} ${-r * 0.2} M${x - r * 0.2} ${y + r * 0.29} l${-r * 0.36} ${r * 0.55} M${x + r * 0.2} ${y + r * 0.29} l${r * 0.36} ${r * 0.55}" stroke="${patch}" stroke-width="1.4"/>` +
  shine(x - r * 0.4, y - r * 0.4, r * 0.15, r * 0.25, 40, 0.6);

const shirt = (x: number, y: number, s: number, body: string, stripe: string, num: string) =>
  g(`<path d="M-20 -22 L-8 -26 Q0 -20 8 -26 L20 -22 L30 -6 L18 0 L18 26 L-18 26 L-18 0 L-30 -6 Z" fill="${body}" ${O}/>` +
    `<path d="M-6 -24 V26 M6 -24 V26" stroke="${stripe}" stroke-width="4"/><path d="M-8 -26 Q0 -18 8 -26" fill="none" ${THIN}/>` +
    `<text x="0" y="14" text-anchor="middle" font-family="Vazirmatn, sans-serif" font-weight="900" font-size="16" fill="#fffdf6" stroke="${INK}" stroke-width=".8">${num}</text>`,
    `translate(${x} ${y}) scale(${s})`);

export const FOOTBALL: string[] = [
  // 1 سوت
  shadow(50, 84, 22) + `<path d="M26 54 H58 A14 14 0 1 1 46 74 H26 Z" fill="url(#gSilver)" ${O}/><circle cx="58" cy="64" r="5" fill="#3b3b44"/>` +
    `<path d="M26 54 L22 46" ${O}/><path d="M22 46 Q10 30 28 24" fill="none" stroke="#e0303f" stroke-width="2.4"/>`,
  // 2 توپ پلاستیکی
  shadow(50, 88, 22) + `<circle cx="50" cy="58" r="24" fill="url(#gYellow)" ${O}/><path d="M28 50 Q50 64 72 50 M30 68 Q50 54 70 68" fill="none" stroke="#e0303f" stroke-width="3"/>` + shine(40, 46, 4, 7, 40, 0.7),
  // 3 کتونی
  shadow(50, 86, 30) + `<path d="M18 74 L22 52 Q34 48 42 56 L64 62 Q82 64 84 74 Z" fill="url(#gRed)" ${O}/><path d="M18 74 H84 V80 H18 Z" fill="#fffdf6" ${O}/>` +
    `<path d="M32 56 l8 4 M36 52 l8 5 M40 54 l8 5" stroke="#fff" stroke-width="2"/><path d="M60 66 l10 -2" stroke="#fff" stroke-width="2.4"/>`,
  // 4 دستکش دروازه‌بانی
  shadow(50, 88, 28) + [[-12, 34, -14], [12, 66, 14]].map(([, x, r]) => g(`<path d="M-12 18 V-4 Q-12 -12 -7 -12 V-2 M-7 -12 Q-5 -20 0 -20 V-2 M0 -20 Q5 -22 7 -17 V-2 M7 -17 Q12 -17 12 -11 V2 Q18 -2 20 4 L12 18 Z" fill="url(#gYellow)" ${O}/><rect x="-12" y="12" width="24" height="8" rx="2" fill="url(#gNavy)" ${THIN}/>`, `translate(${x} 58) rotate(${r})`)).join(''),
  // 5 پیراهن تیم
  shadow(50, 90, 30) + shirt(50, 56, 1.15, 'url(#gRed)', '#fffdf6', '۱۰'),
  // 6 توپ چرمی
  shadow(50, 90, 26) + ball(50, 58, 28),
  // 7 مدال
  shadow(50, 90, 18) + `<path d="M36 14 L50 46 L64 14 Z" fill="url(#gRed)" ${O}/><path d="M42 14 L50 34 L58 14" fill="none" stroke="#fffdf6" stroke-width="2"/>` +
    `<circle cx="50" cy="60" r="20" fill="url(#gGold)" ${O}/><circle cx="50" cy="60" r="13" fill="none" stroke="#a5621f" stroke-width="1.6"/>` +
    `<path d="M50 50 l3 7 l7 1 l-5 5 l1 7 l-6 -4 l-6 4 l1 -7 l-5 -5 l7 -1 Z" fill="#fff6c8" ${THIN} stroke-width=".8"/>` + sparkle(78, 30, 5),
  // 8 جام قهرمانی
  `<circle cx="50" cy="50" r="46" fill="url(#rGlow)" opacity=".6"/>` + shadow(50, 92, 28) +
    `<path d="M30 18 H70 C70 46 60 56 50 58 C40 56 30 46 30 18 Z" fill="url(#gGold)" ${O}/>` +
    `<path d="M30 24 C14 24 14 46 32 48 M70 24 C86 24 86 46 68 48" fill="none" ${O} stroke="url(#gGold)" stroke-width="5"/>` +
    `<path d="M45 58 H55 V70 H45 Z" fill="url(#gGold)" ${THIN}/><rect x="34" y="70" width="32" height="14" rx="2" fill="url(#gWoodDark)" ${O}/><rect x="40" y="74" width="20" height="6" rx="1" fill="url(#gGold)"/>` +
    `<path d="M38 24 Q40 42 48 50" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>` + sparkle(16, 20, 5) + sparkle(86, 16, 6),
];

const bag = (y: number, w: number, fill: string) =>
  `<path d="M${50 - w / 2} ${y} H${50 + w / 2} Q${50 + w / 2 + 8} ${y} ${50 + w / 2 + 6} ${y + 12} L${50 + w / 2} ${y + 28} H${50 - w / 2} L${50 - w / 2 - 6} ${y + 12} Q${50 - w / 2 - 8} ${y} ${50 - w / 2} ${y} Z" fill="${fill}" ${O}/>` +
  `<path d="M${50 - w / 4} ${y} Q50 ${y - 18} ${50 + w / 4} ${y}" fill="none" ${O} stroke-width="4"/><path d="M${50 - w / 2 + 4} ${y + 8} H${50 + w / 2 - 4}" stroke="#fffdf6" stroke-width="2" stroke-dasharray="3 3"/>`;

export const GEN_FOOTBALL: string[] = [
  // ساک ورزشی کوچک
  shadow(50, 90, 28) + bag(58, 44, 'url(#gBlue)') + ball(74, 50, 9),
  // ساک ورزشی
  shadow(50, 90, 34) + bag(56, 56, 'url(#gRed)') + ball(30, 48, 10) + `<path d="M62 52 L72 40" stroke="url(#gSilver)" stroke-width="3" stroke-linecap="round"/>`,
  // کمد رختکن
  shadow(50, 94, 38) + `<rect x="16" y="14" width="68" height="78" rx="3" fill="url(#gSteel)" ${O}/><path d="M50 14 V92" ${THIN}/>` +
    [22, 56].map((x) => [24, 30, 36].map((y) => `<path d="M${x} ${y} h22" stroke="#6a7a8a" stroke-width="2"/>`).join('')).join('') +
    shirt(33, 64, 0.5, 'url(#gRed)', '#fffdf6', '۷') + ball(67, 70, 10) + sparkle(88, 14, 4),
];
