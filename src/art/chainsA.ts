// Tea and bread chains plus their generators.

import { INK, O, THIN, estekan, g, roseMotif, samovar, shadow, shine, sparkle, sugarCube, teapot } from './kit';

const leaf = (x: number, y: number, rot: number, s = 1, fill = 'url(#gLeaf)') =>
  g(
    `<path d="M0 0 C10 -14 30 -14 38 0 C30 14 10 14 0 0 Z" fill="${fill}" ${O}/><path d="M3 0 Q20 -2 34 0" fill="none" stroke="${INK}" stroke-width="1.6" opacity=".55"/>`,
    `translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  );

export const TEA: string[] = [
  // 1 برگ چای
  shadow(50, 86, 22) +
    `<path d="M50 80 C50 66 46 56 40 46" fill="none" stroke="#5d7a2c" stroke-width="4" stroke-linecap="round"/>` +
    leaf(42, 50, -120, 0.9) + leaf(48, 60, -40, 0.85, 'url(#gLeafDark)') + leaf(46, 44, -75, 0.7),
  // 2 چای خشک — paper cone of dried tea
  shadow(50, 86, 26) +
    `<path d="M24 52 L76 52 L60 84 L40 84 Z" fill="url(#gPaper)" ${O}/>` +
    `<path d="M22 52 C26 34 40 30 50 30 C62 30 74 36 78 52 Z" fill="#3b2216" ${O}/>` +
    Array.from({ length: 14 }, (_, i) => {
      const x = 30 + ((i * 37) % 40), y = 36 + ((i * 23) % 14);
      return `<path d="M${x} ${y} l4 -2" stroke="#7a4a2a" stroke-width="2" stroke-linecap="round"/>`;
    }).join('') +
    `<path d="M30 60 L70 60" stroke="#c0392b" stroke-width="3"/>`,
  // 3 حبه قند
  shadow(50, 88, 30) + sugarCube(35, 70, 1.65) + sugarCube(65, 70, 1.65) + sugarCube(50, 46, 1.65),
  // 4 استکان کمرباریک
  shadow(50, 90, 26) + estekan(50, 58, 1.15),
  // 5 استکان چای
  shadow(50, 90, 26) + estekan(50, 58, 1.15, true) + sugarCube(72, 84, 0.65) +
    `<path d="M44 22 q-4 -6 0 -12 M54 22 q-4 -6 0 -12" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>`,
  // 6 سینی چای
  shadow(50, 88, 38, 6) +
    `<ellipse cx="50" cy="74" rx="42" ry="13" fill="url(#gCopper)" ${O}/><ellipse cx="50" cy="72" rx="34" ry="9" fill="#e08a4c" stroke="#9c4a1c" stroke-width="1.5"/>` +
    estekan(34, 52, 0.75, true, false) + estekan(66, 52, 0.75, true, false) + sugarCube(50, 70, 0.7),
  // 7 قوری گل‌سرخی
  shadow(50, 88, 30) + teapot(52, 60, 1.05, 'url(#gCream)', roseMotif(0, 6, 5.5) + roseMotif(-13, 0, 3) + roseMotif(13, 0, 3)),
  // 8 سماور مسی
  samovar('url(#gCopper)'),
  // 9 سماور برنجی (with teapot crown)
  g(samovar('url(#gBrass)'), 'translate(5 12) scale(.9)') + teapot(50, 17, 0.36, 'url(#gCream)', roseMotif(0, 4, 5)),
  // 10 سماور طلایی
  `<circle cx="50" cy="52" r="46" fill="url(#rGlow)"/>` +
    g(samovar('url(#gGold)', true), 'translate(5 12) scale(.9)') + teapot(50, 17, 0.36, 'url(#gCream)', roseMotif(0, 4, 5)) +
    sparkle(18, 30, 6) + sparkle(84, 62, 5) + sparkle(80, 20, 4),
];

/** Tea tins / tea chest that drop tea items. */
export const GEN_TEA: string[] = [
  shadow(50, 88, 26) +
    `<rect x="30" y="34" width="40" height="50" rx="5" fill="url(#gRed)" ${O}/><rect x="28" y="26" width="44" height="12" rx="4" fill="url(#gGold)" ${O}/>` +
    `<rect x="36" y="46" width="28" height="26" rx="3" fill="url(#gCream)" ${THIN}/>` + leaf(41, 60, -20, 0.45) + shine(35, 50, 2, 8, 0),
  shadow(50, 88, 30) +
    `<rect x="26" y="30" width="48" height="54" rx="6" fill="url(#gNavy)" ${O}/><rect x="24" y="22" width="52" height="12" rx="4" fill="url(#gGold)" ${O}/>` +
    `<rect x="32" y="42" width="36" height="32" rx="4" fill="url(#gGold)" ${THIN}/><circle cx="50" cy="58" r="10" fill="url(#gTurq)" ${THIN}/>` + leaf(44, 58, -20, 0.38) +
    shine(31, 48, 2, 10, 0),
  shadow(50, 89, 38) +
    `<path d="M14 48 L86 48 L82 86 L18 86 Z" fill="url(#gWood)" ${O}/><path d="M12 36 Q50 18 88 36 L88 50 L12 50 Z" fill="url(#gWoodDark)" ${O}/>` +
    `<path d="M18 62 L82 62 M20 74 L80 74" stroke="${INK}" stroke-width="1.5" opacity=".4"/>` +
    `<rect x="44" y="44" width="12" height="14" rx="2" fill="url(#gGold)" ${THIN}/>` +
    leaf(26, 34, -30, 0.5) + leaf(66, 30, -150, 0.5) + `<circle cx="50" cy="40" r="3" fill="#3b2216"/>`,
];

const wheatHead = (x: number, y: number, rot: number, s = 1) =>
  g(
    `<path d="M0 30 L0 -2" stroke="#b07a2a" stroke-width="3" stroke-linecap="round"/>` +
      [0, 7, 14, 21].map((dy) =>
        `<ellipse cx="-4" cy="${dy - 16}" rx="4" ry="6.5" transform="rotate(-25 -4 ${dy - 16})" fill="url(#gBread)" ${THIN}/>` +
        `<ellipse cx="4" cy="${dy - 16}" rx="4" ry="6.5" transform="rotate(25 4 ${dy - 16})" fill="url(#gBread)" ${THIN}/>`,
      ).join('') +
      `<ellipse cx="0" cy="-22" rx="3.5" ry="6" fill="url(#gBread)" ${THIN}/>`,
    `translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  );

const lavash = (x: number, y: number, s = 1) =>
  g(
    `<path d="M-30 6 C-26 -12 26 -14 30 4 C24 16 -24 18 -30 6 Z" fill="url(#gBread)" ${O}/>` +
      `<path d="M-30 6 C-14 0 14 -2 30 4" fill="none" ${THIN} opacity=".6"/>` +
      [[-16, 4], [-6, 8], [6, 6], [16, 8], [-10, -4], [10, -4], [0, 0]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="1.8" fill="#b26b28" opacity=".7"/>`).join(''),
    `translate(${x} ${y}) scale(${s})`,
  );

const barbari = (x: number, y: number, s = 1, rot = 0) =>
  g(
    `<rect x="-32" y="-12" width="64" height="24" rx="12" fill="url(#gCrust)" ${O}/>` +
      [-20, -8, 4, 16].map((dx) => `<path d="M${dx} -8 L${dx + 2} 8" stroke="#8f4f17" stroke-width="2.4" stroke-linecap="round"/>`).join('') +
      Array.from({ length: 16 }, (_, i) => `<ellipse cx="${-26 + ((i * 13) % 52)}" cy="${-6 + ((i * 7) % 12)}" rx="1.3" ry=".8" fill="#fff4d0"/>`).join('') +
      shine(-16, -6, 8, 2, 0, 0.5),
    `translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  );

const sangak = (x: number, y: number, s = 1, rot = 0) =>
  g(
    `<path d="M-36 -10 C-30 -18 30 -18 36 -10 L38 12 C30 18 -30 18 -38 12 Z" fill="url(#gBread)" ${O}/>` +
      [[-24, -4], [-12, 4], [0, -6], [12, 4], [24, -4], [-28, 8], [26, 9], [-4, 8], [8, -1]].map(([a, b]) =>
        `<ellipse cx="${a}" cy="${b}" rx="3.4" ry="2.4" fill="#9b5a20" ${THIN} stroke-width="1"/>`).join('') +
      Array.from({ length: 10 }, (_, i) => `<circle cx="${-30 + i * 6.5}" cy="${(i % 2) * 6 - 10}" r="1" fill="#3b2216"/>`).join(''),
    `translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  );

const cheese = (x: number, y: number, s = 1) =>
  g(`<path d="M-12 -6 L12 -6 L12 8 L-12 8 Z" fill="url(#gCream)" ${O}/><circle cx="-4" cy="1" r="1.6" fill="#e3d6b8"/><circle cx="5" cy="3" r="1.2" fill="#e3d6b8"/>`, `translate(${x} ${y}) scale(${s})`);

const herbs = (x: number, y: number, s = 1) =>
  g(leaf(0, 0, -60, 0.4) + leaf(0, 0, -100, 0.42, 'url(#gLeafDark)') + leaf(0, 0, -135, 0.38), `translate(${x} ${y}) scale(${s})`);

const walnut = (x: number, y: number) =>
  `<ellipse cx="${x}" cy="${y}" rx="5" ry="4.2" fill="#b98652" ${THIN}/><path d="M${x} ${y - 4} L${x} ${y + 4}" stroke="${INK}" stroke-width="1"/>`;

const sofreh = (inner: string, w = 40) =>
  shadow(50, 88, w + 4, 5) +
  `<path d="M${50 - w} 62 L${50 + w} 62 L${54 + w} 84 L${46 - w} 84 Z" fill="#f4f0e6" ${O}/>` +
  `<path d="M${50 - w + 2} 66 L${50 + w - 2} 66 M${48 - w} 80 L${52 + w} 80" stroke="#c0392b" stroke-width="2"/>` +
  Array.from({ length: 8 }, (_, i) => `<circle cx="${50 - w + 8 + i * ((2 * w - 16) / 7)}" cy="73" r="2" fill="#e67e22" opacity=".8"/>`).join('') +
  inner;

export const BREAD: string[] = [
  // 1 خوشه گندم
  shadow(50, 88, 22) + wheatHead(42, 54, -12, 1.05) + wheatHead(58, 54, 14, 1.05) + wheatHead(50, 50, 0, 1.15),
  // 2 کیسه آرد
  shadow(50, 88, 26) +
    `<path d="M30 40 C26 56 26 76 32 84 L68 84 C74 76 74 56 70 40 Z" fill="url(#gCream)" ${O}/>` +
    `<path d="M32 40 C38 34 44 36 50 32 C56 36 62 34 68 40 Z" fill="#f2e6cc" ${O}/>` +
    `<path d="M34 42 Q50 48 66 42" fill="none" stroke="#a5621f" stroke-width="3"/>` +
    wheatHead(50, 66, 0, 0.5) + `<ellipse cx="50" cy="30" rx="10" ry="4" fill="#fff" opacity=".9"/>`,
  // 3 خمیر
  shadow(50, 86, 30) +
    `<path d="M18 74 C14 56 30 40 50 40 C70 40 86 56 82 74 C70 82 30 82 18 74 Z" fill="url(#gDough)" ${O}/>` +
    `<path d="M36 52 q6 -4 12 -2" fill="none" stroke="#d8bf8f" stroke-width="2" stroke-linecap="round"/>` +
    shine(36, 52, 9, 4, -15, 0.8) + `<circle cx="64" cy="60" r="2" fill="#e8d2a6"/>`,
  // 4 نان لواش (stack)
  lavash(50, 70, 1.15) + lavash(50, 60, 1.05) + lavash(50, 50, 0.95),
  // 5 نان بربری
  shadow(50, 84, 34) + barbari(50, 64, 1.15, -6),
  // 6 نان سنگک
  shadow(50, 86, 38) + sangak(50, 62, 1.1, -4),
  // 7 سبد نان
  shadow(50, 89, 36) +
    barbari(42, 46, 0.6, -30) + sangak(58, 44, 0.55, 25) + lavash(50, 52, 0.7) +
    `<path d="M16 54 L84 54 L76 86 L24 86 Z" fill="url(#gWood)" ${O}/>` +
    [62, 70, 78].map((y) => `<path d="M${18 + (y - 54) * 0.25} ${y} L${82 - (y - 54) * 0.25} ${y}" stroke="${INK}" stroke-width="1.6" opacity=".5"/>`).join('') +
    [30, 40, 50, 60, 70].map((x) => `<path d="M${x} 56 L${x + (50 - x) * 0.08} 84" stroke="${INK}" stroke-width="1.3" opacity=".35"/>`).join('') +
    `<path d="M14 54 L86 54" ${O} stroke-width="4"/>`,
  // 8 سفره نان و پنیر
  sofreh(sangak(42, 60, 0.5, -8) + cheese(66, 62, 0.9) + herbs(26, 62, 0.9) + walnut(74, 74), 38),
  // 9 سفره صبحانه
  sofreh(
    barbari(34, 58, 0.48, -6) + cheese(56, 66, 0.75) + herbs(16, 62, 0.8) + walnut(74, 74) + walnut(80, 70) +
      estekan(70, 52, 0.5, true, true) +
      `<ellipse cx="50" cy="76" rx="8" ry="3.5" fill="url(#gCream)" ${THIN}/><path d="M44 74 q6 -6 12 0" fill="#ffd36b" ${THIN}/>` +
      sparkle(88, 40, 4),
    44,
  ),
];

/** Clay tanoor ovens. */
const tanoor = (scale: number, extra = '') =>
  g(
    `<path d="M-30 30 C-34 0 -22 -26 0 -28 C22 -26 34 0 30 30 Z" fill="url(#gClay)" ${O}/>` +
      `<path d="M-16 30 C-16 12 -8 4 0 4 C8 4 16 12 16 30 Z" fill="#3b1d10" ${O}/>` +
      `<path d="M-9 30 C-10 22 -4 14 0 10 C4 16 10 22 9 30 Z" fill="url(#gFire)"/>` +
      `<path d="M-26 -2 Q0 -10 26 -2" fill="none" stroke="${INK}" stroke-width="1.4" opacity=".4"/>` +
      `<ellipse cx="0" cy="-27" rx="10" ry="3.5" fill="#7a3f22" ${THIN}/>` + shine(-16, -10, 3, 8, 20, 0.5) + extra,
    `translate(50 53) scale(${scale})`,
  );

export const GEN_BREAD: string[] = [
  shadow(50, 88, 26) + tanoor(0.85),
  shadow(50, 89, 30) + tanoor(0.95, `<path d="M-30 30 L30 30 L34 36 L-34 36 Z" fill="url(#gTerracotta)" ${O}/>`) +
    `<path d="M50 20 q-6 -8 0 -14 q6 -6 0 -12" fill="none" stroke="#d8d8d8" stroke-width="3" stroke-linecap="round" opacity=".8"/>`,
  shadow(50, 90, 34) + tanoor(1, `<path d="M-34 30 L34 30 L38 38 L-38 38 Z" fill="url(#gTerracotta)" ${O}/>`) +
    sangak(50, 84, 0.34) + `<path d="M50 16 q-6 -8 0 -14" fill="none" stroke="#d8d8d8" stroke-width="3" stroke-linecap="round" opacity=".8"/>` + sparkle(84, 26, 5),
];
