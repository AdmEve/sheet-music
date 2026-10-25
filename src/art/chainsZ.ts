// Season 24: science lab («آزمایشگاه») chain and its generator (the experiment kit).

import { INK, O, THIN, g, shadow, shine, sparkle } from './kit';

/** A glass flask with coloured liquid (conical when `erlen`, else a test tube). */
const flask = (x: number, base: number, h: number, liquid: string, erlen: boolean) =>
  erlen
    ? `<path d="M${x - h * 0.1} ${base - h} V${base - h * 0.62} L${x - h * 0.42} ${base - h * 0.06} Q${x - h * 0.44} ${base} ${x - h * 0.36} ${base} H${x + h * 0.36} Q${x + h * 0.44} ${base} ${x + h * 0.42} ${base - h * 0.06} L${x + h * 0.1} ${base - h * 0.62} V${base - h} Z" fill="url(#gGlass)" ${O}/>` +
      `<path d="M${x - h * 0.3} ${base - h * 0.22} H${x + h * 0.3} L${x + h * 0.38} ${base - h * 0.06} Q${x + h * 0.38} ${base - 2} ${x + h * 0.32} ${base - 2} H${x - h * 0.32} Q${x - h * 0.38} ${base - 2} ${x - h * 0.38} ${base - h * 0.06} Z" fill="${liquid}" opacity=".85"/>` +
      `<rect x="${x - h * 0.14}" y="${base - h - 3}" width="${h * 0.28}" height="5" rx="2" fill="#d8d8d8" ${THIN} stroke-width="1"/>` + shine(x - h * 0.16, base - h * 0.4, h * 0.03, h * 0.1, 30, 0.8)
    : `<path d="M${x - h * 0.12} ${base - h} V${base - h * 0.12} Q${x} ${base + h * 0.04} ${x + h * 0.12} ${base - h * 0.12} V${base - h} Z" fill="url(#gGlass)" ${O}/>` +
      `<path d="M${x - h * 0.1} ${base - h * 0.5} V${base - h * 0.12} Q${x} ${base + h * 0.02} ${x + h * 0.1} ${base - h * 0.12} V${base - h * 0.5} Z" fill="${liquid}" opacity=".85"/>` +
      `<path d="M${x - h * 0.16} ${base - h} H${x + h * 0.16}" ${O} stroke-width="2"/>`;

const planet = (x: number, y: number, r: number, fill: string) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${THIN} stroke-width="1"/>`;

export const SCIENCE: string[] = [
  // 1 ذره‌بین
  shadow(50, 86, 22) + g(`<rect x="-4" y="14" width="8" height="30" rx="4" fill="url(#gWoodDark)" ${THIN}/><circle cx="0" cy="0" r="18" fill="url(#gGlass)" stroke="#2a2a2a" stroke-width="5"/><circle cx="0" cy="0" r="18" fill="none" ${THIN}/>`, 'translate(46 46) rotate(-35)') +
    shine(40, 40, 3, 7, 30, 0.9),
  // 2 آهن‌ربا
  shadow(50, 86, 26) + `<path d="M24 30 V58 A26 26 0 0 0 76 58 V30 H60 V58 A10 10 0 0 1 40 58 V30 Z" fill="url(#gRed)" ${O}/>` +
    `<rect x="24" y="24" width="16" height="12" fill="url(#gSilver)" ${O}/><rect x="60" y="24" width="16" height="12" fill="url(#gSilver)" ${O}/>` +
    `<path d="M28 18 l-4 -6 M36 16 l2 -7 M64 16 l-2 -7 M72 18 l4 -6" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`,
  // 3 لوله‌ی آزمایش
  shadow(50, 88, 28) + `<rect x="20" y="58" width="60" height="8" rx="2" fill="url(#gWood)" ${O}/><path d="M26 66 V86 M74 66 V86" ${O} stroke-width="4"/>` +
    flask(34, 80, 50, '#4aa86a', false) + flask(50, 80, 54, '#e0303f', false) + flask(66, 80, 48, '#3a76c4', false),
  // 4 ارلن
  shadow(50, 90, 26) + flask(50, 88, 66, 'url(#gTurq)', true) + [[46, 52], [54, 44], [50, 34]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${2 + i}" fill="#bfe9ff" ${THIN} stroke-width=".8"/>`).join(''),
  // 5 میکروسکوپ
  shadow(50, 90, 30) + `<path d="M26 86 H74 L70 78 H30 Z" fill="#2a2a2a" ${O}/><path d="M60 78 C76 64 72 40 58 34" fill="none" stroke="#3a3a3a" stroke-width="8" stroke-linecap="round"/><path d="M60 78 C76 64 72 40 58 34" fill="none" stroke="#5a5a5a" stroke-width="5" stroke-linecap="round"/>` +
    `<rect x="32" y="58" width="30" height="5" fill="#5a5a5a" ${THIN}/>` + g(`<rect x="-6" y="-24" width="12" height="40" rx="3" fill="url(#gSilver)" ${O}/><rect x="-8" y="-30" width="16" height="8" rx="2" fill="#2a2a2a" ${THIN}/><path d="M-4 16 h8 l-2 6 h-4 Z" fill="#2a2a2a"/>`, 'translate(48 34) rotate(-18)') +
    `<rect x="38" y="54" width="16" height="4" fill="url(#gGlass)" ${THIN} stroke-width=".8"/>`,
  // 6 کره‌ی ماه
  shadow(50, 90, 26) + `<path d="M40 86 H60 L56 78 H44 Z" fill="url(#gWoodDark)" ${O}/><path d="M50 78 V70" ${O} stroke-width="3"/>` +
    `<circle cx="50" cy="44" r="27" fill="#d8d8d0" ${O}/>` + [[40, 36, 5], [58, 50, 6], [48, 58, 3.4], [62, 32, 3], [36, 52, 3]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#b8b8b0" ${THIN} stroke-width=".8"/>`).join('') + shine(38, 30, 4, 7, 30, 0.6),
  // 7 منظومه‌ی شمسی
  shadow(50, 92, 32) + `<path d="M50 92 V66" ${O} stroke-width="3"/><ellipse cx="50" cy="48" rx="40" ry="14" fill="none" stroke="#c9a26b" stroke-width="1.4"/><ellipse cx="50" cy="48" rx="26" ry="9" fill="none" stroke="#c9a26b" stroke-width="1.4"/>` +
    `<circle cx="50" cy="48" r="11" fill="#f6c945" ${O}/>` + planet(24, 52, 4, '#3a76c4') + planet(74, 42, 5, '#e0703f') + planet(88, 50, 3, '#a8a8a0') + planet(36, 40, 3.4, '#4aa86a') + sparkle(16, 22, 4) + sparkle(84, 20, 4),
  // 8 تلسکوپ
  `<circle cx="50" cy="50" r="46" fill="#2e2a5a" opacity=".85"/>` + Array.from({ length: 9 }, (_, i) => `<circle cx="${14 + (i * 29) % 74}" cy="${12 + (i * 17) % 40}" r="1.2" fill="#fff"/>`).join('') + shadow(50, 92, 34) +
    `<path d="M50 62 L32 90 M50 62 L68 90 M50 62 V90" stroke="#5e3418" stroke-width="4" stroke-linecap="round"/>` +
    g(`<rect x="-34" y="-8" width="58" height="16" rx="3" fill="url(#gBrass)" ${O}/><rect x="24" y="-11" width="10" height="22" rx="2" fill="#b7801c" ${O}/><rect x="-42" y="-5" width="10" height="10" rx="2" fill="#2a2a2a" ${THIN}/><path d="M-14 -8 V8 M6 -8 V8" stroke="#93661a" stroke-width="1.6"/>`, 'translate(52 56) rotate(-30)') +
    sparkle(82, 22, 5, '#fff6d0'),
];

export const GEN_SCIENCE: string[] = [
  // کیف آزمایش
  shadow(50, 88, 26) + `<rect x="22" y="44" width="56" height="42" rx="4" fill="url(#gBlue)" ${O}/><path d="M40 44 V36 H60 V44" fill="none" ${O} stroke-width="3"/><rect x="44" y="58" width="12" height="8" rx="2" fill="url(#gSilver)" ${THIN} stroke-width="1"/>` +
    `<path d="M28 74 h10 M62 74 h10" stroke="#fffdf6" stroke-width="2"/>`,
  // جعبه‌ی آزمایش
  shadow(50, 90, 32) + `<rect x="16" y="54" width="68" height="34" rx="3" fill="url(#gWood)" ${O}/><path d="M16 54 L22 40 H78 L84 54 Z" fill="url(#gWoodDark)" ${O}/>` +
    flask(34, 54, 30, '#4aa86a', false) + flask(50, 54, 34, '#e0303f', true) + flask(66, 54, 28, '#3a76c4', false),
  // میز آزمایشگاه
  `<circle cx="50" cy="50" r="44" fill="#dcefff" opacity=".7"/>` + shadow(50, 92, 40) +
    `<rect x="10" y="60" width="80" height="8" rx="2" fill="#2a2a2a" ${O}/><rect x="16" y="68" width="68" height="22" fill="url(#gWood)" ${O}/><path d="M50 68 V90" stroke="#8b5328" stroke-width="1.6"/>` +
    flask(24, 60, 30, 'url(#gTurq)', true) + flask(44, 60, 28, '#e0303f', false) + `<path d="M58 60 L62 40 H72 L76 60 Z" fill="#5a5a5a" ${THIN}/><circle cx="67" cy="36" r="5" fill="#f6c945" ${THIN} stroke-width="1"/>` + sparkle(86, 24, 5),
];
