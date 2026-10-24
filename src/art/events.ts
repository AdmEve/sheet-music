// Event chains (6 levels each) and their one-level generators: Yalda, Nowruz, and the two
// weekly themes (kites, lavashak). Same 100×100 style as the main chains.

import { INK, O, THIN, g, shadow, shine, sparkle } from './kit';

// ---------------------------------------------------------------- shared pieces

const pom = (x: number, y: number, s = 1) =>
  g(
    `<path d="M-5 -18 L-7 -26 L-2.5 -22 L0 -28 L2.5 -22 L7 -26 L5 -18 Z" fill="url(#gPom)" ${O}/>` +
      `<circle cx="0" cy="0" r="20" fill="url(#gPom)" ${O}/>` +
      shine(-8, -8, 4, 7, 30, 0.55),
    `translate(${x} ${y}) scale(${s})`,
  );

const seed = (x: number, y: number, s = 1, rot = 0) =>
  g(`<path d="M0 -5 L4 -1.5 L3 4 L-3 4 L-4 -1.5 Z" fill="url(#gSeed)" stroke="${INK}" stroke-width="1.1" stroke-linejoin="round"/><circle cx="-1.2" cy="-1.5" r="1.1" fill="#fff" opacity=".8"/>`,
    `translate(${x} ${y}) rotate(${rot}) scale(${s})`);

const bowl = (fill = 'url(#gTurq)', y = 60) =>
  `<path d="M20 ${y} L80 ${y} C78 ${y + 20} 66 ${y + 26} 50 ${y + 26} C34 ${y + 26} 22 ${y + 20} 20 ${y} Z" fill="${fill}" ${O}/>` +
  `<path d="M26 ${y + 8} Q50 ${y + 14} 74 ${y + 8}" fill="none" stroke="#fff" stroke-width="2" opacity=".5"/>`;

const leaf = (x: number, y: number, rot: number, s = 1) =>
  g(`<path d="M0 0 C6 -8 18 -8 22 0 C18 8 6 8 0 0 Z" fill="url(#gLeaf)" ${THIN}/><path d="M2 0 L18 0" stroke="${INK}" stroke-width="1" opacity=".5"/>`,
    `translate(${x} ${y}) rotate(${rot}) scale(${s})`);

const basket = (y = 56) =>
  `<path d="M16 ${y} L84 ${y} L76 ${y + 30} L24 ${y + 30} Z" fill="url(#gWicker)" ${O}/>` +
  [0, 1, 2].map((k) => `<path d="M${19 + k} ${y + 9 + k * 9} L${81 - k} ${y + 9 + k * 9}" stroke="#8a5a22" stroke-width="1.5" opacity=".7"/>`).join('') +
  [30, 42, 54, 66].map((x) => `<path d="M${x} ${y} L${x + (x < 50 ? 2 : -2)} ${y + 30}" stroke="#8a5a22" stroke-width="1.2" opacity=".5"/>`).join('') +
  `<rect x="13" y="${y - 4}" width="74" height="8" rx="4" fill="url(#gWicker)" ${O}/>`;

const egg = (x: number, y: number, s: number, a: string, b: string, rot = 0) =>
  g(`<ellipse cx="0" cy="0" rx="9" ry="12" fill="${a}" ${O}/><path d="M-8.6 -2 Q0 3 8.6 -2 M-8 4 Q0 9 8 4" fill="none" stroke="${b}" stroke-width="2.4"/>` +
    `<path d="M-6 -2 l2 -3 l2 3 l2 -3 l2 3 l2 -3" fill="none" stroke="#fff" stroke-width="1.2" opacity=".9"/>` + shine(-3.5, -6, 1.6, 3, 20, 0.7),
    `translate(${x} ${y}) rotate(${rot}) scale(${s})`);

const apple = (x: number, y: number, s = 1) =>
  g(`<path d="M0 -14 C-6 -20 -22 -18 -22 -2 C-22 12 -10 20 0 16 C10 20 22 12 22 -2 C22 -18 6 -20 0 -14 Z" fill="url(#gRed)" ${O}/>` +
    `<path d="M0 -14 Q2 -22 6 -26" fill="none" ${O}/>` + leaf(4, -22, -30, 0.55) + shine(-11, -6, 3, 6, 20, 0.55),
    `translate(${x} ${y}) scale(${s})`);

const sabzeh = (x: number, y: number, s = 1) =>
  g(`<ellipse cx="0" cy="8" rx="22" ry="7" fill="url(#gCream)" ${O}/>` +
    Array.from({ length: 15 }, (_, i) => {
      const bx = -16 + i * 2.3;
      const h = 18 + ((i * 7) % 9);
      return `<path d="M${bx} 6 Q${bx + (i % 2 ? 2 : -2)} ${6 - h / 2} ${bx + (i % 3) - 1} ${6 - h}" fill="none" stroke="${i % 2 ? '#3fae5a' : '#2a7d3e'}" stroke-width="2.4" stroke-linecap="round"/>`;
    }).join('') +
    `<path d="M-18 -2 Q0 4 18 -2" fill="none" stroke="#e0303f" stroke-width="3.5"/><path d="M-2 0 l-6 8 M2 0 l6 8" stroke="#e0303f" stroke-width="2.6" stroke-linecap="round"/>`,
    `translate(${x} ${y}) scale(${s})`);

const fishBowl = (x: number, y: number, s = 1) =>
  g(`<path d="M-16 -18 L16 -18 C30 -6 28 18 0 20 C-28 18 -30 -6 -16 -18 Z" fill="url(#gWater)" fill-opacity=".85" ${O}/>` +
    `<path d="M-20 -6 Q0 -2 20 -6" fill="none" stroke="#fff" stroke-width="1.5" opacity=".7"/>` +
    `<path d="M-6 4 C0 -4 10 -2 12 4 C10 10 0 12 -6 4 Z" fill="url(#gOrange)" ${THIN}/><path d="M-6 4 L-13 -1 L-12 9 Z" fill="url(#gOrange)" ${THIN}/>` +
    `<circle cx="7" cy="3" r="1.3" fill="${INK}"/>` + shine(-12, -6, 2.5, 6, 15, 0.7),
    `translate(${x} ${y}) scale(${s})`);

const hyacinth = (x: number, y: number, s = 1) =>
  g(`<path d="M-12 8 L12 8 L9 26 L-9 26 Z" fill="url(#gTerracotta)" ${O}/><rect x="-14" y="4" width="28" height="6" rx="3" fill="url(#gTerracotta)" ${O}/>` +
    leaf(-2, 4, -110, 0.9) + leaf(2, 4, -70, 0.9) +
    `<path d="M0 4 L0 -26" stroke="#3fae5a" stroke-width="3"/>` +
    [-24, -18, -12, -6, 0].flatMap((yy, k) => [-5, 0, 5].map((xx) => `<circle cx="${xx + (k % 2 ? 2 : 0)}" cy="${yy - 2}" r="3.6" fill="url(#gPurple)" stroke="${INK}" stroke-width="1"/>`)).join(''),
    `translate(${x} ${y}) scale(${s})`);

const kite = (x: number, y: number, s: number, a: string, b: string, rot = 0, tail = true) =>
  g(`<path d="M0 -24 L17 0 L0 30 L-17 0 Z" fill="${a}" ${O}/><path d="M0 -24 L0 30 M-17 0 L17 0" stroke="${INK}" stroke-width="1.6"/>` +
    `<path d="M0 -24 L17 0 L0 0 Z M0 0 L-17 0 L0 30 Z" fill="${b}" opacity=".85"/>` +
    (tail ? `<path d="M0 30 C-6 40 6 46 0 56 C-6 64 4 70 0 78" fill="none" stroke="${INK}" stroke-width="1.6"/>` +
      [[-1, 42, 20], [1, 58, -20], [0, 72, 15]].map(([tx, ty, r]) => `<path d="M${tx - 6} ${ty - 3} L${tx + 6} ${ty + 3} L${tx + 6} ${ty - 3} L${tx - 6} ${ty + 3} Z" fill="${b}" stroke="${INK}" stroke-width="1.1" transform="rotate(${r} ${tx} ${ty})"/>`).join('') : ''),
    `translate(${x} ${y}) rotate(${rot}) scale(${s})`);

const roll = (x: number, y: number, s = 1, rot = 0) =>
  g(`<rect x="-20" y="-7" width="40" height="14" rx="7" fill="url(#gLavashak)" ${O}/>` +
    `<ellipse cx="20" cy="0" rx="5" ry="7" fill="#8e1a33" ${THIN}/><path d="M20 0 m-2 0 a2 2.5 0 1 1 3 1" fill="none" stroke="#e8708a" stroke-width="1.2"/>` +
    `<path d="M-14 -4 L10 -4" stroke="#fff" stroke-width="2" opacity=".35" stroke-linecap="round"/>`,
    `translate(${x} ${y}) rotate(${rot}) scale(${s})`);

const plum = (x: number, y: number, r: number, fill: string) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${O}/><path d="M${x} ${y - r + 2} Q${x + 2} ${y} ${x} ${y + r - 3}" fill="none" stroke="${INK}" stroke-width="1" opacity=".35"/>` +
  shine(x - r * 0.4, y - r * 0.35, r * 0.18, r * 0.35, 25, 0.6);

const jar = (x: number, y: number, s: number, fill: string) =>
  g(`<path d="M-14 -16 L14 -16 L16 -10 C18 0 18 14 12 20 L-12 20 C-18 14 -18 0 -16 -10 Z" fill="url(#gGlass)" fill-opacity=".9" ${O}/>` +
    `<path d="M-14 -6 C-14 6 -12 14 -10 18 L10 18 C12 14 14 6 14 -6 Z" fill="${fill}" opacity=".9"/>` +
    `<rect x="-15" y="-24" width="30" height="9" rx="2" fill="url(#gRed)" ${O}/><path d="M-15 -20 h30" stroke="#fff" stroke-width="1" stroke-dasharray="2 3"/>` +
    shine(-9, -2, 2, 7, 5, 0.7),
    `translate(${x} ${y}) scale(${s})`);

// ---------------------------------------------------------------- Yalda

export const YALDA: string[] = [
  // 1 دونه‌ی انار
  shadow(50, 84, 26) + seed(40, 58, 2.7) + seed(60, 56, 2.7, 20) + seed(50, 72, 2.8, -15) + seed(66, 72, 2.4, 40) + seed(33, 74, 2.3, -30) + sparkle(74, 40, 5),
  // 2 انار
  shadow(50, 86, 26) + pom(50, 58, 1.25) + leaf(58, 30, -40, 0.8),
  // 3 کاسه‌ی انار دون‌شده
  shadow(50, 89, 32) + bowl('url(#gTurq)', 54) +
    Array.from({ length: 13 }, (_, i) => seed(28 + (i % 7) * 7.4, 50 + Math.floor(i / 7) * 6 + (i % 2) * 2, 1.25, i * 23)).join('') + `<path d="M20 54 L80 54" ${O}/>`,
  // 4 قاچ هندونه
  shadow(50, 84, 34) +
    `<path d="M10 42 A40 40 0 0 0 90 42 Z" fill="url(#gRind)" ${O}/><path d="M15 43 A35 35 0 0 0 85 43 Z" fill="#f4f7e0"/><path d="M20 43 A30 30 0 0 0 80 43 Z" fill="url(#gMelon)" ${THIN}/>` +
    [[34, 52], [50, 56], [66, 52], [42, 64], [58, 64], [50, 46]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2" ry="3.2" fill="${INK}"/>`).join('') +
    `<path d="M10 42 L90 42" ${O}/>` + shine(28, 50, 2, 6, -40, 0.6),
  // 5 سینی آجیل
  shadow(50, 86, 36) + `<ellipse cx="50" cy="70" rx="38" ry="14" fill="url(#gCopper)" ${O}/><ellipse cx="50" cy="68" rx="31" ry="10" fill="url(#gBrass)" ${THIN}/>` +
    [[36, 64], [46, 70], [58, 66], [66, 72], [42, 60], [54, 59]].map(([x, y], i) => i % 3 === 0
      ? `<ellipse cx="${x}" cy="${y}" rx="5" ry="3.5" fill="#c9a26b" ${THIN}/><ellipse cx="${x}" cy="${y - 0.5}" rx="2.5" ry="2" fill="#8fbf4a"/>`
      : i % 3 === 1 ? `<ellipse cx="${x}" cy="${y}" rx="5.5" ry="3" fill="url(#gCrust)" ${THIN}/>`
        : `<circle cx="${x}" cy="${y}" r="4.5" fill="#b07a4a" ${THIN}/><path d="M${x} ${y - 4} v8" stroke="${INK}" stroke-width="1"/>`).join('') +
    pom(70, 50, 0.45) + seed(30, 72, 1.2) + seed(74, 66, 1.2, 30),
  // 6 دیوان حافظ
  shadow(50, 88, 38) +
    `<path d="M14 74 L50 82 L86 74 L86 42 L50 50 L14 42 Z" fill="#fffdf6" ${O}/>` +
    `<path d="M50 50 L50 82" ${THIN}/><path d="M12 76 L50 85 L88 76" fill="none" stroke="url(#gRed)" stroke-width="4"/>` +
    [0, 1, 2, 3].map((k) => `<path d="M20 ${50 + k * 6} Q32 ${52 + k * 6} 44 ${55 + k * 6} M56 ${55 + k * 6} Q68 ${52 + k * 6} 80 ${50 + k * 6}" fill="none" stroke="#7a5a44" stroke-width="1.6" opacity=".7"/>`).join('') +
    `<rect x="62" y="18" width="10" height="22" rx="2" fill="#fff4c2" ${THIN}/><path d="M67 18 q-5 -6 0 -12 q5 6 0 12" fill="url(#gFire)" ${THIN}/>` +
    `<circle cx="67" cy="12" r="10" fill="url(#rGlow)" opacity=".7"/>` +
    pom(32, 34, 0.5) + sparkle(84, 24, 5) + sparkle(16, 30, 4),
];

export const GEN_YALDA: string[] = [
  // سبد یلدا
  shadow(50, 90, 36) + pom(34, 46, 0.6) + pom(64, 44, 0.65) + pom(50, 38, 0.6) + leaf(70, 30, -30, 0.7) + basket(52) +
    `<path d="M60 64 l-3 4 l3 3 l3 -3 Z" fill="url(#gTurq)" ${THIN}/>`,
];

// ---------------------------------------------------------------- Nowruz

export const NOWRUZ: string[] = [
  // 1 تخم‌مرغ رنگی
  shadow(50, 88, 22) + egg(50, 58, 2.35, 'url(#gTurq)', '#e0303f'),
  // 2 سیب سرخ
  shadow(50, 86, 24) + apple(50, 60, 1.25),
  // 3 سبزه
  shadow(50, 86, 30) + sabzeh(50, 70, 1.3),
  // 4 ماهی قرمز
  shadow(50, 88, 28) + fishBowl(50, 62, 1.3),
  // 5 سنبل
  shadow(50, 90, 22) + hyacinth(50, 56, 1.2),
  // 6 سفره‌ی هفت‌سین
  shadow(50, 90, 44) +
    `<path d="M6 66 L94 66 L88 88 L12 88 Z" fill="url(#gCream)" ${O}/><path d="M10 72 L90 72 M14 82 L86 82" stroke="#3a76c4" stroke-width="2" stroke-dasharray="4 3"/>` +
    `<rect x="40" y="22" width="20" height="26" rx="10" fill="url(#gSilver)" ${O}/><rect x="44" y="26" width="12" height="18" rx="6" fill="url(#gWater)"/>` +
    sabzeh(24, 60, 0.6) + fishBowl(50, 58, 0.55) + apple(76, 60, 0.5) + egg(36, 64, 0.5, 'url(#gRose)', '#3a76c4') + egg(64, 64, 0.5, 'url(#gYellow)', '#3fae5a') +
    `<rect x="18" y="32" width="5" height="14" fill="#fff4c2" ${THIN}/><rect x="77" y="32" width="5" height="14" fill="#fff4c2" ${THIN}/>` +
    `<path d="M20.5 32 q-3 -4 0 -8 q3 4 0 8 M79.5 32 q-3 -4 0 -8 q3 4 0 8" fill="url(#gFire)" stroke="${INK}" stroke-width="1"/>` + sparkle(88, 18, 5),
];

export const GEN_NOWRUZ: string[] = [
  // سبد نوروزی
  shadow(50, 90, 36) + egg(34, 46, 0.9, 'url(#gRose)', '#3a76c4', -15) + egg(50, 40, 0.95, 'url(#gYellow)', '#3fae5a') + egg(66, 46, 0.9, 'url(#gTurq)', '#e0303f', 15) + basket(52) +
    `<path d="M16 50 Q50 10 84 50" fill="none" stroke="url(#gWicker)" stroke-width="5"/><path d="M16 50 Q50 10 84 50" fill="none" ${THIN} opacity=".6"/>`,
];

// ---------------------------------------------------------------- kites

export const KITE: string[] = [
  // 1 کاغذ رنگی
  shadow(50, 84, 30) +
    `<rect x="22" y="40" width="44" height="34" rx="2" fill="url(#gTurq)" ${O} transform="rotate(-12 44 57)"/>` +
    `<rect x="30" y="44" width="44" height="34" rx="2" fill="url(#gYellow)" ${O} transform="rotate(6 52 61)"/>` +
    `<rect x="28" y="50" width="44" height="30" rx="2" fill="url(#gRose)" ${O}/>`,
  // 2 قرقره‌ی نخ
  shadow(50, 86, 24) + `<rect x="30" y="34" width="40" height="8" rx="3" fill="url(#gWood)" ${O}/><rect x="30" y="76" width="40" height="8" rx="3" fill="url(#gWood)" ${O}/>` +
    `<rect x="35" y="42" width="30" height="34" fill="#fffdf6" ${O}/>` + [0, 1, 2, 3, 4, 5].map((k) => `<path d="M35 ${46 + k * 5.5} L65 ${44 + k * 5.5}" stroke="#d6c7ad" stroke-width="1.4"/>`).join('') +
    `<path d="M65 60 C78 58 82 44 76 30" fill="none" stroke="${INK}" stroke-width="1.4"/>`,
  // 3 بادبادک کوچک
  shadow(50, 88, 16) + kite(50, 44, 1.1, 'url(#gRed)', '#ffd36b', 0, false) + `<path d="M50 77 C46 82 54 84 50 88" fill="none" stroke="${INK}" stroke-width="1.4"/>`,
  // 4 بادبادک دم‌دار
  kite(50, 30, 1.0, 'url(#gTurq)', '#ff7a9c', 10),
  // 5 دو بادبادک
  kite(32, 34, 0.8, 'url(#gYellow)', '#e0303f', -14) + kite(68, 26, 0.85, 'url(#gPurple)', '#5fe0e0', 10),
  // 6 بادبادک طاووسی
  `<circle cx="50" cy="44" r="40" fill="url(#rGlow)" opacity=".6"/>` +
    `<path d="M50 6 L84 36 L50 80 L16 36 Z" fill="url(#gTurq)" ${O}/>` +
    [[50, 30, 10], [36, 40, 7], [64, 40, 7], [50, 56, 8]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.3}" fill="url(#gGreenTile)" ${THIN}/><ellipse cx="${x}" cy="${y + 1}" rx="${r * 0.55}" ry="${r * 0.75}" fill="url(#gNavy)"/><circle cx="${x}" cy="${y + 1}" r="${r * 0.25}" fill="#ffd36b"/>`).join('') +
    `<path d="M50 80 C42 86 58 90 50 96" fill="none" stroke="${INK}" stroke-width="1.6"/>` + sparkle(84, 14, 6) + sparkle(14, 66, 5),
];

export const GEN_KITE: string[] = [
  // جعبه‌ی کاردستی
  shadow(50, 90, 36) +
    `<rect x="40" y="18" width="8" height="34" rx="3" fill="url(#gRose)" ${O} transform="rotate(-14 44 35)"/><rect x="52" y="20" width="8" height="32" rx="3" fill="url(#gYellow)" ${O} transform="rotate(10 56 36)"/>` +
    kite(30, 32, 0.45, 'url(#gRed)', '#ffd36b', -20, false) +
    `<path d="M16 46 L84 46 L80 86 L20 86 Z" fill="url(#gTurq)" ${O}/><path d="M16 46 L8 36 L40 34 L44 46 M84 46 L92 36 L60 34 L56 46" fill="url(#gTurq)" ${O}/>` +
    `<path d="M24 60 L76 60" stroke="#fff" stroke-width="2.5" opacity=".5"/><circle cx="64" cy="72" r="5" fill="none" ${THIN}/><circle cx="74" cy="72" r="5" fill="none" ${THIN}/><path d="M66 68 L80 56 M72 68 L58 56" ${THIN}/>`,
];

// ---------------------------------------------------------------- lavashak

export const LAVASHAK: string[] = [
  // 1 آلوچه
  shadow(50, 86, 28) + plum(38, 60, 17, 'url(#gGreenPlum)') + plum(62, 66, 15, 'url(#gGreenPlum)') + leaf(46, 42, -60, 0.9),
  // 2 زردآلو
  shadow(50, 86, 24) + plum(50, 62, 20, 'url(#gOrange)') + `<path d="M50 42 Q52 36 56 34" fill="none" ${O}/>` + leaf(54, 36, -20, 0.8),
  // 3 کاسه‌ی آلو
  shadow(50, 89, 32) + plum(36, 52, 10, 'url(#gPlum)') + plum(52, 48, 11, 'url(#gGreenPlum)') + plum(66, 53, 10, 'url(#gPlum)') + plum(44, 58, 9, 'url(#gOrange)') + bowl('url(#gCream)', 58),
  // 4 لواشک لوله‌ای
  shadow(50, 86, 32) + roll(46, 68, 1.2, -10) + roll(54, 52, 1, 8),
  // 5 سینی لواشک
  shadow(50, 88, 38) + `<rect x="12" y="50" width="76" height="34" rx="6" fill="url(#gWood)" ${O}/>` +
    `<path d="M18 56 Q30 52 42 56 T66 56 T82 56 L82 78 Q70 82 58 78 T34 78 T18 78 Z" fill="url(#gLavashak)" ${O}/>` +
    `<path d="M24 62 Q40 58 56 62 T80 62" fill="none" stroke="#e8708a" stroke-width="1.5" opacity=".7"/>` + roll(50, 44, 0.8, -5),
  // 6 سبد سوغاتی
  shadow(50, 90, 40) + jar(68, 40, 0.75, 'url(#gOrange)') + roll(34, 44, 0.75, -30) + roll(46, 40, 0.75, -60) + basket(54) +
    `<path d="M40 70 h20" stroke="#fff" stroke-width="3" opacity=".6"/>` + sparkle(86, 22, 5) + sparkle(16, 36, 4),
];

export const GEN_LAVASHAK: string[] = [
  // زنبیل میوه
  shadow(50, 90, 34) +
    `<path d="M30 46 C30 20 70 20 70 46" fill="none" stroke="url(#gWicker)" stroke-width="6"/><path d="M30 46 C30 20 70 20 70 46" fill="none" ${THIN} opacity=".6"/>` +
    plum(38, 48, 9, 'url(#gGreenPlum)') + plum(54, 44, 10, 'url(#gPlum)') + plum(66, 50, 8, 'url(#gOrange)') +
    `<path d="M22 50 L78 50 L72 88 L28 88 Z" fill="url(#gWicker)" ${O}/>` +
    [58, 66, 74, 82].map((y) => `<path d="M${22 + (y - 50) * 0.16} ${y} L${78 - (y - 50) * 0.16} ${y}" stroke="#8a5a22" stroke-width="1.5" opacity=".7"/>`).join('') +
    `<rect x="42" y="64" width="16" height="10" rx="3" fill="url(#gRed)" ${THIN}/>`,
];
