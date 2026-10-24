// Season 6: musical instruments («ساز») chain and its generator (the luthier's bench).

import { INK, O, THIN, g, shadow, shine, sparkle } from './kit';

/** A long-necked lute: body (rx × ry), neck length, tilted by rot, at x, y (body centre). */
const lute = (x: number, y: number, rx: number, ry: number, neck: number, rot: number, body = 'url(#gWood)', strings = 3) =>
  g(`<rect x="-2.6" y="${-ry - neck}" width="5.2" height="${neck + 4}" rx="2" fill="url(#gWoodDark)" ${THIN}/>` +
    `<rect x="-4" y="${-ry - neck - 8}" width="8" height="10" rx="2" fill="url(#gWoodDark)" ${THIN}/>` +
    [-1, 1].map((sx) => `<path d="M${sx * 4} ${-ry - neck - 4} h${sx * 4}" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`).join('') +
    `<ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="${body}" ${O}/>` +
    Array.from({ length: strings }, (_, i) => `<path d="M${(i - (strings - 1) / 2) * 1.2} ${-ry - neck} V${ry * 0.6}" stroke="#f6e3b0" stroke-width=".7"/>`).join('') +
    `<rect x="-5" y="${ry * 0.5}" width="10" height="3" rx="1" fill="#3b2216"/>` + shine(-rx * 0.4, -ry * 0.3, rx * 0.15, ry * 0.3, 20, 0.5),
    `translate(${x} ${y}) rotate(${rot})`);

const drumSkin = (x: number, y: number, r: number) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gCream)" ${O}/><circle cx="${x}" cy="${y}" r="${r * 0.72}" fill="none" stroke="#e8d3a8" stroke-width="2"/>`;

export const SAZ: string[] = [
  // 1 سیم ساز (a coil of string)
  shadow(50, 84, 22) + `<circle cx="50" cy="58" r="26" fill="none" ${O} stroke-width="7"/><circle cx="50" cy="58" r="26" fill="none" stroke="url(#gSilver)" stroke-width="5"/>` +
    `<circle cx="50" cy="58" r="17" fill="none" ${O} stroke-width="5"/><circle cx="50" cy="58" r="17" fill="none" stroke="url(#gSilver)" stroke-width="3"/><path d="M68 54 Q80 40 86 26" fill="none" stroke="#c9ced4" stroke-width="2"/>`,
  // 2 مضراب (plectrum and its tin)
  shadow(50, 84, 26) + `<ellipse cx="54" cy="66" rx="20" ry="10" fill="url(#gTurq)" ${O}/><ellipse cx="54" cy="62" rx="20" ry="9" fill="url(#gTurq)" ${O}/>` +
    g(`<path d="M0 -16 C10 -16 12 -4 6 8 L0 18 L-6 8 C-12 -4 -10 -16 0 -16 Z" fill="url(#gGold)" ${O}/><path d="M0 -10 V8" stroke="#fff" stroke-width="1.4" opacity=".6"/>`, 'translate(38 46) rotate(-20)'),
  // 3 دف (frame drum with rings)
  shadow(50, 90, 30) + `<circle cx="50" cy="54" r="32" fill="url(#gWood)" ${O}/>` + drumSkin(50, 54, 27) +
    Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return `<circle cx="${50 + Math.cos(a) * 30}" cy="${54 + Math.sin(a) * 30}" r="2.2" fill="url(#gSilver)" ${THIN} stroke-width=".8"/>`; }).join(''),
  // 4 تنبک (goblet drum)
  shadow(50, 92, 22) + `<path d="M28 26 C28 52 42 56 44 66 L40 88 L60 88 L56 66 C58 56 72 52 72 26 Z" fill="url(#gWood)" ${O}/>` +
    `<ellipse cx="50" cy="26" rx="22" ry="7" fill="url(#gCream)" ${O}/><path d="M34 44 Q50 52 66 44 M42 74 H58" fill="none" stroke="#6b3a1a" stroke-width="2"/>` + shine(38, 40, 3, 8, 10, 0.5),
  // 5 کمانچه (spike fiddle with its bow)
  shadow(50, 92, 22) + `<path d="M50 6 V20" ${O} stroke-width="4"/><path d="M50 20 V56" stroke="url(#gWoodDark)" stroke-width="6"/>` +
    `<circle cx="50" cy="64" r="15" fill="url(#gWood)" ${O}/>` + drumSkin(50, 66, 9) + `<path d="M50 79 V92" ${O} stroke-width="3"/>` +
    `<path d="M47 16 V72 M53 16 V72" stroke="#f6e3b0" stroke-width=".7"/>` +
    `<path d="M18 46 Q50 34 84 52" fill="none" ${O} stroke-width="2.4"/><path d="M20 48 Q50 38 82 54" fill="none" stroke="#f6e3b0" stroke-width="1"/>`,
  // 6 سه‌تار
  shadow(50, 92, 20) + lute(52, 74, 13, 17, 40, 18, 'url(#gWood)', 3),
  // 7 ساز عاشیقی
  shadow(50, 92, 26) + lute(52, 70, 17, 20, 34, 22, 'url(#gWoodDark)', 3) +
    `<path d="M40 62 q6 -4 12 0 q6 4 12 0" fill="none" stroke="#f6c945" stroke-width="1.6" transform="rotate(22 52 70)"/>` + sparkle(18, 30, 4),
  // 8 تار (figure-eight body of mulberry wood)
  `<circle cx="50" cy="52" r="46" fill="url(#rGlow)" opacity=".55"/>` + shadow(50, 94, 28) +
    g(`<rect x="-3" y="-70" width="6" height="52" rx="2" fill="url(#gWoodDark)" ${THIN}/><rect x="-5" y="-80" width="10" height="12" rx="2" fill="url(#gWoodDark)" ${THIN}/>` +
      `<path d="M0 -22 C14 -24 18 -10 10 -2 C20 4 20 24 0 26 C-20 24 -20 4 -10 -2 C-18 -10 -14 -24 0 -22 Z" fill="url(#gWood)" ${O}/>` +
      `<ellipse cx="0" cy="12" rx="9" ry="8" fill="url(#gCream)" ${THIN}/><ellipse cx="0" cy="-12" rx="5" ry="5" fill="url(#gCream)" ${THIN}/>` +
      [-1.6, 0, 1.6].map((dx) => `<path d="M${dx} -70 V18" stroke="#f6e3b0" stroke-width=".7"/>`).join('') + `<rect x="-6" y="16" width="12" height="3" rx="1" fill="#3b2216"/>`,
      'translate(50 72) rotate(18) scale(.78)') +
    sparkle(16, 24, 5) + sparkle(84, 30, 6),
];

export const GEN_SAZ: string[] = [
  // میز سازسازی کوچک
  shadow(50, 92, 32) + `<rect x="16" y="58" width="68" height="10" rx="2" fill="url(#gWood)" ${O}/><path d="M24 68 V88 M76 68 V88" ${O} stroke-width="4"/>` +
    `<ellipse cx="44" cy="52" rx="14" ry="7" fill="url(#gWood)" ${O}/><path d="M64 56 L80 40" stroke="url(#gSteel)" stroke-width="3" stroke-linecap="round"/>`,
  // میز سازسازی
  shadow(50, 92, 36) + `<rect x="12" y="58" width="76" height="10" rx="2" fill="url(#gWood)" ${O}/><path d="M20 68 V88 M80 68 V88" ${O} stroke-width="4"/>` +
    lute(46, 46, 10, 12, 22, -60, 'url(#gWood)', 2) + `<path d="M66 56 L84 38" stroke="url(#gSteel)" stroke-width="3" stroke-linecap="round"/>` + drumSkin(72, 50, 6),
  // کارگاه سازسازی
  shadow(50, 94, 40) + `<rect x="10" y="16" width="80" height="6" rx="2" fill="url(#gWoodDark)" ${O}/>` +
    [26, 50, 74].map((x, i) => `<path d="M${x} 22 v4" ${THIN}/>` + lute(x, 40, 6, 8, 8, 0, i === 1 ? 'url(#gWoodDark)' : 'url(#gWood)', 2)).join('') +
    `<rect x="12" y="62" width="76" height="10" rx="2" fill="url(#gWood)" ${O}/><path d="M20 72 V90 M80 72 V90" ${O} stroke-width="4"/>` + drumSkin(36, 56, 7) +
    `<path d="M62 60 L80 46" stroke="url(#gSteel)" stroke-width="3" stroke-linecap="round"/>` + sparkle(88, 60, 4),
];
