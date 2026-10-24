// Season 12: party («جشن») chain and its generator (the party box).

import { INK, O, THIN, g, shadow, shine, sparkle } from './kit';

const balloon = (x: number, y: number, r: number, fill: string, tail = 30) =>
  `<path d="M${x} ${y + r} q-4 ${tail / 2} 2 ${tail}" fill="none" stroke="${INK}" stroke-width="1.2"/>` +
  `<ellipse cx="${x}" cy="${y}" rx="${r * 0.86}" ry="${r}" fill="${fill}" ${O}/><path d="M${x - 3} ${y + r} h6 l-3 4 Z" fill="${fill}" ${THIN} stroke-width="1"/>` +
  shine(x - r * 0.35, y - r * 0.35, r * 0.16, r * 0.3, 30, 0.7);

const gift = (x: number, y: number, w: number, box: string, ribbon = '#fffdf6') =>
  `<rect x="${x - w / 2}" y="${y - w * 0.8}" width="${w}" height="${w * 0.8}" fill="${box}" ${O}/><rect x="${x - w / 2 - 3}" y="${y - w * 0.8 - 8}" width="${w + 6}" height="10" rx="2" fill="${box}" ${O}/>` +
  `<path d="M${x} ${y - w * 0.8 - 8} V${y}" stroke="${ribbon}" stroke-width="4"/>` +
  `<path d="M${x} ${y - w * 0.8 - 8} q-12 -12 -16 -2 q8 4 16 2 q12 -12 16 -2 q-8 4 -16 2" fill="${ribbon}" ${THIN} stroke-width="1"/>`;

const flower = (x: number, y: number, r: number, petal: string) =>
  [0, 72, 144, 216, 288].map((a) => `<ellipse cx="${x}" cy="${y - r * 0.6}" rx="${r * 0.4}" ry="${r * 0.6}" transform="rotate(${a} ${x} ${y})" fill="${petal}" ${THIN} stroke-width=".8"/>`).join('') +
  `<circle cx="${x}" cy="${y}" r="${r * 0.35}" fill="#f6c945" ${THIN} stroke-width=".8"/>`;

export const PARTY: string[] = [
  // 1 بادکنک
  shadow(50, 90, 16) + balloon(50, 40, 22, 'url(#gRed)', 40),
  // 2 کلاه تولد
  shadow(50, 86, 24) + `<path d="M28 78 L50 20 L72 78 Z" fill="url(#gTurq)" ${O}/>` +
    [36, 50, 64].map((y, i) => `<circle cx="${44 + i * 6}" cy="${y + 10}" r="3" fill="#f6c945" ${THIN} stroke-width=".8"/>`).join('') +
    `<circle cx="50" cy="18" r="6" fill="url(#gRose)" ${THIN}/><path d="M26 78 Q50 86 74 78" fill="none" ${O} stroke="#fffdf6" stroke-width="4"/>`,
  // 3 شمع تولد
  shadow(50, 88, 22) + [[38, '#e0303f'], [50, '#3a76c4'], [62, '#f6c945']].map(([x, c], i) => `<rect x="${Number(x) - 4}" y="${44 - i * 4}" width="8" height="${38 + i * 4}" rx="2" fill="${c}" ${THIN}/>` +
    `<path d="M${Number(x) - 4} ${54 - i * 4} l8 -4 M${Number(x) - 4} ${66 - i * 4} l8 -4" stroke="#fff" stroke-width="1.6" opacity=".7"/>` +
    `<path d="M${x} ${32 - i * 4} q5 6 0 10 q-5 -4 0 -10 Z" fill="url(#gFire)" ${THIN} stroke-width=".8"/>`).join('') + `<ellipse cx="50" cy="84" rx="24" ry="4" fill="url(#gSilver)" ${THIN}/>`,
  // 4 کارت تبریک
  shadow(50, 88, 28) + g(`<rect x="-26" y="-20" width="52" height="40" rx="3" fill="#fffdf6" ${O}/><path d="M0 -20 V20" ${THIN} stroke-width="1"/>` +
    flower(-12, -2, 8, 'url(#gRose)') + `<path d="M6 -8 h14 M6 0 h12 M6 8 h14" stroke="#9b8a76" stroke-width="1.6"/>`, 'translate(50 60) rotate(-8)'),
  // 5 جعبه‌ی کادو
  shadow(50, 90, 30) + gift(50, 86, 50, 'url(#gBlue)'),
  // 6 دسته گل
  shadow(50, 90, 24) + `<path d="M38 60 L50 88 L62 60 Z" fill="url(#gPaper)" ${O}/>` +
    flower(40, 44, 10, 'url(#gRose)') + flower(60, 42, 10, '#fff6a8') + flower(50, 30, 10, '#ff7a9c') + flower(36, 58, 7, '#c58bff') + flower(64, 58, 7, '#fff6a8') +
    `<path d="M42 72 q8 6 16 0" fill="none" stroke="#e0303f" stroke-width="3"/>`,
  // 7 سبد هدیه
  shadow(50, 92, 34) + `<path d="M16 56 H84 L76 88 H24 Z" fill="url(#gWicker)" ${O}/><path d="M30 56 Q50 22 70 56" fill="none" ${O} stroke="url(#gWicker)" stroke-width="4"/>` +
    gift(36, 58, 18, 'url(#gRed)') + gift(60, 58, 16, 'url(#gTurq)') + flower(48, 46, 7, '#fff6a8') + `<path d="M20 64 H80" stroke="#8a5a22" stroke-width="1.5" opacity=".7"/>`,
  // 8 کیک تولد
  `<circle cx="50" cy="52" r="46" fill="url(#rGlow)" opacity=".6"/>` + shadow(50, 92, 36) +
    `<ellipse cx="50" cy="86" rx="38" ry="5" fill="url(#gSilver)" ${O}/>` +
    [[30, 18, 66], [22, 16, 50], [14, 14, 36]].map(([w, h, y]) => `<rect x="${50 - w}" y="${y}" width="${w * 2}" height="${h}" rx="4" fill="#fffdf6" ${O}/><path d="M${50 - w} ${y + 5} q${w / 4} 5 ${w / 2} 0 t${w / 2} 0 t${w / 2} 0 t${w / 2} 0" fill="none" stroke="#ff9ec4" stroke-width="2.4"/>`).join('') +
    [42, 50, 58].map((x) => `<rect x="${x - 1.5}" y="24" width="3" height="12" fill="${x === 50 ? '#3a76c4' : '#e0303f'}" ${THIN} stroke-width=".6"/><path d="M${x} 16 q3 4 0 7 q-3 -3 0 -7 Z" fill="url(#gFire)"/>`).join('') +
    sparkle(14, 26, 5) + sparkle(86, 22, 6),
];

export const GEN_PARTY: string[] = [
  // جعبه‌ی جشن کوچک
  shadow(50, 90, 28) + gift(50, 86, 40, 'url(#gRose)') + balloon(78, 24, 10, 'url(#gYellow)', 18),
  // جعبه‌ی جشن
  shadow(50, 90, 34) + gift(46, 86, 48, 'url(#gRed)') + balloon(80, 22, 10, 'url(#gTurq)', 20) + balloon(16, 26, 9, 'url(#gYellow)', 18),
  // صندوق جشن
  shadow(50, 92, 40) + `<rect x="12" y="48" width="76" height="40" rx="4" fill="url(#gPurple)" ${O}/><path d="M12 60 H88" ${THIN}/><rect x="44" y="54" width="12" height="9" rx="2" fill="url(#gGold)" ${THIN}/>` +
    balloon(24, 26, 10, 'url(#gRed)', 14) + balloon(50, 20, 11, 'url(#gYellow)', 16) + balloon(76, 26, 10, 'url(#gTurq)', 14) + sparkle(90, 50, 4),
];
