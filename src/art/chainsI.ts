// Season 7: Persian tiles («کاشی») chain and its generator (the glaze box).

import { INK, O, THIN, g, shadow, shine, sparkle } from './kit';

/** One square tile with a pattern drawn inside (s = size, centred on x, y). */
const tile = (x: number, y: number, s: number, ground: string, inner: string, rot = 0) =>
  g(`<rect x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" rx="${s * 0.06}" fill="${ground}" ${O}/>` + inner + shine(-s * 0.28, -s * 0.28, s * 0.06, s * 0.14, 40, 0.55),
    `translate(${x} ${y}) rotate(${rot})`);

const star8 = (r: number, fill: string) => {
  const pts = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2, rr = i % 2 ? r * 0.55 : r;
    return `${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)}`;
  });
  return `<path d="M${pts.join(' L')} Z" fill="${fill}" ${THIN} stroke-width="1"/>`;
};

const flower = (r: number, petal: string, heart: string) =>
  [0, 60, 120, 180, 240, 300].map((a) => `<ellipse cx="0" cy="${-r * 0.55}" rx="${r * 0.28}" ry="${r * 0.45}" transform="rotate(${a})" fill="${petal}" ${THIN} stroke-width=".8"/>`).join('') +
  `<circle r="${r * 0.25}" fill="${heart}" ${THIN} stroke-width=".8"/>`;

export const TILE: string[] = [
  // 1 تکه‌ی کاشی
  shadow(50, 84, 22) + `<path d="M30 70 L44 40 L70 46 L74 72 L52 80 Z" fill="url(#gTurq)" ${O}/><path d="M44 52 L60 56 L58 68" fill="none" stroke="#fffdf6" stroke-width="2.4" opacity=".7"/>`,
  // 2 کاشی ساده
  shadow(50, 88, 26) + tile(50, 56, 50, 'url(#gTurq)', `<rect x="-17" y="-17" width="34" height="34" rx="2" fill="none" stroke="#fffdf6" stroke-width="2" opacity=".6"/>`),
  // 3 کاشی فیروزه‌ای
  shadow(50, 88, 26) + tile(50, 56, 50, 'url(#gBlue)', `<path d="M0 -18 L18 0 L0 18 L-18 0 Z" fill="url(#gTurq)" ${THIN} stroke-width="1"/><circle r="5" fill="#fffdf6"/>`),
  // 4 کاشی گل‌دار
  shadow(50, 88, 26) + tile(50, 56, 50, '#fffdf6', flower(20, 'url(#gBlue)', '#f6c945') + [[-19, -19], [19, -19], [-19, 19], [19, 19]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="url(#gTurq)"/>`).join('')),
  // 5 کاشی هفت‌رنگ
  shadow(50, 88, 26) + tile(50, 56, 52, 'url(#gNavy)', flower(16, '#fffdf6', '#e0303f') +
    [[-16, -16, '#f6c945'], [16, -16, '#3fae5a'], [-16, 16, '#3fae5a'], [16, 16, '#f6c945']].map(([x, y, c]) => `<path d="M${x} ${Number(y) - 6} l6 6 l-6 6 l-6 -6 Z" fill="${c}" ${THIN} stroke-width=".8"/>`).join('')),
  // 6 ترنج کاشی (four tiles making a medallion)
  shadow(50, 90, 34) + [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy]) => tile(50 + sx * 17, 54 + sy * 17, 34, 'url(#gTurq)', '')).join('') +
    `<g transform="translate(50 54)">${star8(22, 'url(#gNavy)')}${flower(11, '#fffdf6', '#f6c945')}</g>`,
  // 7 کاشی معرق (mosaic panel)
  shadow(50, 92, 36) + `<rect x="14" y="20" width="72" height="66" rx="3" fill="url(#gNavy)" ${O}/>` +
    `<rect x="20" y="26" width="60" height="54" fill="none" stroke="#f6c945" stroke-width="2"/>` +
    `<g transform="translate(50 53)">${star8(22, 'url(#gTurq)')}${star8(12, '#f6c945')}<circle r="4" fill="#e0303f"/></g>` +
    [[26, 32], [74, 32], [26, 74], [74, 74]].map(([x, y]) => `<g transform="translate(${x} ${y})">${flower(6, '#fffdf6', '#e0303f')}</g>`).join('') + sparkle(88, 18, 4),
  // 8 گنبد کاشی (a turquoise tiled dome)
  `<circle cx="50" cy="54" r="44" fill="url(#rGlow)" opacity=".55"/>` + shadow(50, 92, 36) +
    `<rect x="20" y="70" width="60" height="18" fill="url(#gTerracotta)" ${O}/><path d="M22 70 C22 34 78 34 78 70 Z" fill="url(#gTurq)" ${O}/>` +
    `<path d="M50 36 V22" ${O}/><circle cx="50" cy="20" r="3.4" fill="url(#gGold)" ${THIN}/>` +
    [30, 40, 50, 60, 70].map((x) => `<path d="M${x} 70 Q${x + (x - 50) * 0.2} 50 50 37" fill="none" stroke="url(#gNavy)" stroke-width="1.6" opacity=".7"/>`).join('') +
    `<path d="M26 62 Q50 54 74 62" fill="none" stroke="#f6c945" stroke-width="2"/>` + [30, 42, 58, 70].map((x) => `<path d="M${x} 88 V76 Q${x + 3} 72 ${x + 6} 76 V88 Z" fill="#3b2a20"/>`).join('') +
    sparkle(16, 28, 5) + sparkle(86, 34, 5),
];

const pot = (x: number, y: number, fill: string) =>
  `<path d="M${x - 8} ${y - 12} L${x + 8} ${y - 12} L${x + 7} ${y} L${x - 7} ${y} Z" fill="url(#gClay)" ${THIN}/><ellipse cx="${x}" cy="${y - 12}" rx="8" ry="3" fill="${fill}" ${THIN} stroke-width="1"/>`;

export const GEN_TILE: string[] = [
  // جعبه‌ی لعاب کوچک
  shadow(50, 90, 30) + `<rect x="20" y="52" width="60" height="32" rx="3" fill="url(#gWood)" ${O}/>` + pot(36, 52, 'url(#gTurq)') + pot(58, 52, 'url(#gBlue)') +
    `<path d="M70 50 L84 30" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M83 31 l3 -6" stroke="url(#gTurq)" stroke-width="4" stroke-linecap="round"/>`,
  // جعبه‌ی لعاب
  shadow(50, 90, 34) + `<rect x="14" y="52" width="72" height="32" rx="3" fill="url(#gWood)" ${O}/>` +
    pot(28, 52, 'url(#gTurq)') + pot(46, 52, 'url(#gBlue)') + pot(64, 52, '#f6c945') + tile(80, 40, 18, 'url(#gTurq)', '', 12),
  // کارگاه کاشی‌گری
  shadow(50, 92, 40) + `<rect x="10" y="58" width="80" height="30" rx="3" fill="url(#gWood)" ${O}/>` +
    pot(22, 58, 'url(#gTurq)') + pot(38, 58, 'url(#gBlue)') + pot(54, 58, '#f6c945') + pot(70, 58, '#3fae5a') +
    tile(30, 30, 20, 'url(#gBlue)', '', -8) + tile(54, 26, 20, 'url(#gTurq)', '', 6) + tile(78, 32, 20, '#fffdf6', '', -4) + sparkle(90, 14, 4),
];
