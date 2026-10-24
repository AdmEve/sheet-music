// Season 2: sweets (qannadi) chain and its generators.

import { O, THIN, g, shadow, shine, sparkle } from './kit';

const plate = (w = 34) =>
  `<ellipse cx="50" cy="78" rx="${w}" ry="${w * 0.24}" fill="url(#gCream)" ${O}/><ellipse cx="50" cy="77" rx="${w * 0.7}" ry="${w * 0.13}" fill="none" stroke="#3a76c4" stroke-width="1.6"/>`;

const noghl = (x: number, y: number, r = 4.5) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#fffdf6" ${THIN}/>` +
  [0, 60, 120, 180, 240, 300].map((a) => `<path d="M${x} ${y} l${Math.cos((a * Math.PI) / 180) * r * 1.3} ${Math.sin((a * Math.PI) / 180) * r * 1.3}" stroke="#e8dcc6" stroke-width="1.2"/>`).join('');

const zoolbia = (x: number, y: number, s = 1) =>
  g(
    `<path d="M-14 0 C-14 -12 14 -12 14 0 C14 10 -6 12 -8 2 C-10 -6 6 -8 6 0 C6 4 -2 4 -2 0" fill="none" stroke="#e7a512" stroke-width="5" stroke-linecap="round"/>` +
      `<path d="M-14 0 C-14 -12 14 -12 14 0 C14 10 -6 12 -8 2 C-10 -6 6 -8 6 0 C6 4 -2 4 -2 0" fill="none" stroke="#ffd36b" stroke-width="2" stroke-linecap="round"/>`,
    `translate(${x} ${y}) scale(${s})`,
  );

const bamieh = (x: number, y: number, rot: number) =>
  g(`<rect x="-10" y="-4" width="20" height="8" rx="4" fill="url(#gYellow)" ${THIN}/><path d="M-6 -4 v8 M0 -4 v8 M6 -4 v8" stroke="#b7801c" stroke-width="1"/>`, `translate(${x} ${y}) rotate(${rot})`);

const baklava = (x: number, y: number, s = 1) =>
  g(
    `<path d="M0 -12 L12 0 L0 12 L-12 0 Z" fill="url(#gBread)" ${O}/><path d="M-8 -2 L8 -2 M-6 3 L6 3" stroke="#a5621f" stroke-width="1.2"/>` +
      `<circle cx="0" cy="-6" r="2.4" fill="#7fbf4a"/>`,
    `translate(${x} ${y}) scale(${s})`,
  );

const sohan = (x: number, y: number, s = 1) =>
  g(
    `<circle r="13" fill="url(#gCrust)" ${O}/><circle r="8" fill="none" stroke="#8f4f17" stroke-width="1.4" opacity=".6"/>` +
      [[-4, -3], [3, -5], [5, 3], [-3, 5], [0, 0]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="2" ry="1.3" fill="#8fbf4a"/>`).join(''),
    `translate(${x} ${y}) scale(${s})`,
  );

const creamPuff = (x: number, y: number, s = 1) =>
  g(
    `<ellipse cx="0" cy="4" rx="12" ry="7" fill="url(#gBread)" ${O}/><path d="M-11 0 C-8 -10 8 -10 11 0 Z" fill="#fffdf6" ${O}/>` +
      `<ellipse cx="0" cy="-8" rx="5" ry="3" fill="url(#gBread)" ${THIN}/><circle cx="4" cy="-10" r="2" fill="#e2507a"/>`,
    `translate(${x} ${y}) scale(${s})`,
  );

export const SWEETS: string[] = [
  // 1 شکر (sugar in a small bowl)
  shadow(50, 86, 26) +
    `<path d="M24 56 L76 56 C74 74 64 82 50 82 C36 82 26 74 24 56 Z" fill="url(#gTurq)" ${O}/>` +
    `<path d="M26 56 C30 44 70 44 74 56 Z" fill="#fffdf6" ${O}/>` +
    Array.from({ length: 10 }, (_, i) => `<rect x="${32 + (i * 7) % 36}" y="${47 + (i * 5) % 7}" width="2.4" height="2.4" fill="#d8e4ec"/>`).join('') + shine(32, 64, 2.5, 7, 20, 0.6),
  // 2 نقل
  shadow(50, 86, 30) + plate(30) + noghl(40, 70) + noghl(52, 72) + noghl(62, 68) + noghl(46, 62) + noghl(57, 60) + noghl(36, 62, 4),
  // 3 نان برنجی
  shadow(50, 86, 32) + plate(32) +
    [[38, 66], [56, 70], [48, 58], [64, 60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="url(#gCream)" ${O}/><path d="M${x - 4} ${y - 2} l8 4 M${x - 4} ${y + 2} l8 -4" stroke="#e7a512" stroke-width="1.4"/><circle cx="${x}" cy="${y}" r="1.4" fill="#d4a24a"/>`).join(''),
  // 4 زولبیا بامیه
  shadow(50, 86, 34) + plate(34) + zoolbia(38, 64, 1) + zoolbia(60, 62, 0.9) + bamieh(48, 74, -10) + bamieh(64, 74, 15) + bamieh(32, 76, 5),
  // 5 باقلوا
  shadow(50, 86, 34) + plate(34) + baklava(36, 66) + baklava(52, 70) + baklava(64, 62) + baklava(48, 56),
  // 6 سوهان قم
  shadow(50, 87, 32) +
    `<rect x="18" y="52" width="64" height="32" rx="6" fill="url(#gTurq)" ${O}/><rect x="18" y="52" width="64" height="10" rx="5" fill="#fff" opacity=".35"/>` +
    sohan(36, 52, 1) + sohan(64, 50, 1) + sohan(50, 40, 1.05),
  // 7 شیرینی خامه‌ای
  shadow(50, 86, 34) + plate(34) + creamPuff(36, 66) + creamPuff(60, 66) + creamPuff(48, 52, 1.05),
  // 8 جعبه شیرینی
  shadow(50, 88, 36) +
    `<path d="M16 50 L84 50 L80 86 L20 86 Z" fill="#fff6f0" ${O}/>` +
    creamPuff(32, 50, 0.8) + baklava(50, 48, 0.9) + creamPuff(68, 50, 0.8) +
    `<path d="M14 50 L86 50" ${O} stroke-width="3"/><path d="M16 64 L84 64" stroke="#e2507a" stroke-width="6"/><path d="M50 50 L50 86" stroke="#e2507a" stroke-width="6"/>` +
    `<path d="M50 64 C40 54 36 62 44 66 M50 64 C60 54 64 62 56 66" fill="none" stroke="#b8204e" stroke-width="3" stroke-linecap="round"/>`,
  // 9 کیک عروسی
  `<circle cx="50" cy="50" r="46" fill="url(#rGlow)" opacity=".7"/>` + shadow(50, 90, 32) +
    `<rect x="20" y="62" width="60" height="24" rx="5" fill="#fffdf6" ${O}/><rect x="28" y="42" width="44" height="22" rx="5" fill="#fffdf6" ${O}/><rect x="36" y="24" width="28" height="20" rx="5" fill="#fffdf6" ${O}/>` +
    ([[20, 70, 6], [28, 52, 4], [36, 34, 3]] as const).map(([x, y, n]) => `<path d="M${x + (60 - 10 * n - (x - 20) * 2) / 2} ${y + 4} ${'q5 5 10 0 '.repeat(n)}" fill="none" stroke="#ff9ec4" stroke-width="2.4" stroke-linecap="round"/>`).join('') +
    `<circle cx="46" cy="18" r="4" fill="url(#gRoseDeep)" ${THIN}/><circle cx="54" cy="18" r="4" fill="url(#gRoseDeep)" ${THIN}/><path d="M42 21 Q50 26 58 21" fill="none" stroke="#3f9a32" stroke-width="2"/>` +
    sparkle(14, 30, 6) + sparkle(86, 40, 5),
];

const pot = (fill: string) =>
  `<path d="M24 44 L76 44 L72 82 C70 88 30 88 28 82 Z" fill="${fill}" ${O}/><rect x="18" y="38" width="64" height="9" rx="4" fill="${fill}" ${O}/>` +
  `<path d="M18 42 C10 40 10 50 18 50 M82 42 C90 40 90 50 82 50" fill="none" ${O}/>`;

export const GEN_SWEETS: string[] = [
  // قابلمه‌ی شیره (syrup pot on a flame)
  shadow(50, 90, 28) + pot('url(#gCopper)') +
    `<path d="M40 30 q-4 -8 2 -14 M56 30 q-4 -8 2 -14" fill="none" stroke="#d8d8d8" stroke-width="3" stroke-linecap="round" opacity=".8"/>` +
    `<ellipse cx="50" cy="44" rx="26" ry="5" fill="url(#gYellow)" ${THIN}/>`,
  // فر قنادی (pastry oven)
  shadow(50, 90, 36) +
    `<rect x="16" y="24" width="68" height="62" rx="8" fill="url(#gSteel)" ${O}/><rect x="24" y="42" width="52" height="34" rx="6" fill="#3b1d10" ${O}/>` +
    `<rect x="28" y="46" width="44" height="26" rx="4" fill="url(#gFire)" opacity=".55"/>` +
    creamPuff(40, 62, 0.6) + baklava(58, 62, 0.6) +
    `<circle cx="30" cy="32" r="3.5" fill="#c02a2a" ${THIN}/><circle cx="42" cy="32" r="3.5" fill="#1d4fa8" ${THIN}/><rect x="56" y="29" width="20" height="6" rx="3" fill="#4b2e1e"/>`,
  // قنادی (pastry counter with awning)
  shadow(50, 90, 42) +
    `<rect x="12" y="46" width="76" height="40" rx="4" fill="url(#gWood)" ${O}/><rect x="18" y="52" width="64" height="20" rx="3" fill="url(#gGlass)" ${THIN}/>` +
    creamPuff(32, 64, 0.55) + baklava(50, 64, 0.6) + sohan(68, 64, 0.5) +
    `<path d="M8 46 L16 24 L84 24 L92 46 Z" fill="url(#gRoseDeep)" ${O}/>` +
    [24, 40, 56, 72].map((x) => `<path d="M${x} 24 L${x - 2} 46" stroke="#fff" stroke-width="5" opacity=".9"/>`).join('') + sparkle(88, 14, 5),
];
