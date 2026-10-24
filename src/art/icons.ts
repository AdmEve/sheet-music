// HUD / button icons (100×100 inner SVG).

import { O, THIN, bolt, coin, g, sparkle } from './kit';

export const ICONS = {
  energy: bolt(50, 50, 2.6),
  coin: coin(50, 50, 36),
  gem:
    `<path d="M50 88 L12 40 L28 16 L72 16 L88 40 Z" fill="url(#gTurq)" ${O} stroke-width="4"/>` +
    `<path d="M12 40 L88 40 M28 16 L40 40 L50 88 L60 40 L72 16 M40 40 L50 16 L60 40" fill="none" ${THIN} stroke-width="2.6"/>` +
    `<path d="M30 22 L38 36" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>`,
  star:
    `<path d="M50 8 L62 36 L92 38 L69 58 L77 88 L50 72 L23 88 L31 58 L8 38 L38 36 Z" fill="url(#gGold)" ${O} stroke-width="4"/>` +
    `<path d="M40 30 L46 22" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>`,
  alley:
    `<path d="M10 90 L10 40 L30 26 L50 40 L50 90 Z" fill="url(#gClay)" ${O}/><path d="M50 90 L50 30 L70 16 L90 30 L90 90 Z" fill="url(#gTerracotta)" ${O}/>` +
    `<path d="M22 90 L22 64 Q30 54 38 64 L38 90 Z M62 90 L62 58 Q70 48 78 58 L78 90 Z" fill="url(#gTurq)" ${THIN}/>` +
    `<rect x="62" y="34" width="16" height="12" rx="2" fill="#ffe08a" ${THIN}/>`,
  bag:
    `<path d="M22 38 L78 38 L84 88 L16 88 Z" fill="url(#gWood)" ${O}/><path d="M36 38 C36 18 64 18 64 38" fill="none" ${O} stroke-width="5"/>` +
    `<path d="M20 52 L80 52" ${THIN}/><rect x="44" y="46" width="12" height="12" rx="2" fill="url(#gGold)" ${THIN}/>`,
  shop:
    `<path d="M14 40 L86 40 L80 88 L20 88 Z" fill="url(#gCream)" ${O}/><path d="M8 40 L18 16 L82 16 L92 40 Z" fill="url(#gRed)" ${O}/>` +
    `<path d="M26 16 L22 40 M42 16 L40 40 M58 16 L60 40 M74 16 L78 40" stroke="#fff" stroke-width="4"/>` +
    g(`<path d="M50 30 L28 4 L40 -14 L60 -14 L72 4 Z" fill="url(#gTurq)" ${THIN}/>`, 'translate(0 46) scale(.6) translate(33 10)'),
  gear:
    `<circle cx="50" cy="50" r="30" fill="url(#gSteel)" ${O}/>` +
    [0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<rect x="43" y="6" width="14" height="18" rx="3" fill="url(#gSteel)" ${THIN} transform="rotate(${a} 50 50)"/>`).join('') +
    `<circle cx="50" cy="50" r="12" fill="#fff7e6" ${O}/>`,
  quest:
    `<rect x="22" y="14" width="56" height="72" rx="6" fill="url(#gPaper)" ${O}/>` +
    `<rect x="16" y="10" width="68" height="12" rx="6" fill="url(#gWood)" ${O}/><rect x="16" y="80" width="68" height="12" rx="6" fill="url(#gWood)" ${O}/>` +
    `<path d="M32 36 l5 5 l9 -10 M32 54 l5 5 l9 -10" fill="none" stroke="#3fae5a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="M52 38 h16 M52 56 h16 M32 70 h36" stroke="#a5621f" stroke-width="4" stroke-linecap="round"/>`,
  video:
    `<rect x="10" y="22" width="80" height="56" rx="12" fill="url(#gRed)" ${O}/><path d="M42 36 L64 50 L42 64 Z" fill="#fff" ${THIN}/>`,
  album:
    `<path d="M50 24 C38 14 22 14 10 20 L10 84 C22 78 38 78 50 88 Z" fill="url(#gRed)" ${O}/>` +
    `<path d="M50 24 C62 14 78 14 90 20 L90 84 C78 78 62 78 50 88 Z" fill="url(#gRed)" ${O}/>` +
    `<path d="M50 28 C40 20 26 20 16 25 L16 78 C26 73 40 74 50 82 Z M50 28 C60 20 74 20 84 25 L84 78 C74 73 60 74 50 82 Z" fill="url(#gPaper)" ${THIN}/>` +
    `<rect x="22" y="34" width="20" height="18" rx="3" fill="url(#gTurq)" ${THIN}/><rect x="58" y="34" width="20" height="18" rx="3" fill="url(#gGold)" ${THIN}/>` +
    `<rect x="22" y="56" width="20" height="14" rx="3" fill="#f3b3c4" ${THIN}/><rect x="58" y="56" width="20" height="14" rx="3" fill="#bfe3a6" ${THIN}/>`,
  /** Clay piggy bank («قلک سفالی»): round pot, knob on top, coin slot, turquoise band. */
  piggy:
    `<ellipse cx="50" cy="90" rx="30" ry="5" fill="#000" opacity=".15"/>` +
    `<circle cx="50" cy="22" r="8" fill="url(#gTerracotta)" ${O}/>` +
    `<path d="M50 26 C24 26 12 44 12 60 C12 78 28 90 50 90 C72 90 88 78 88 60 C88 44 76 26 50 26 Z" fill="url(#gTerracotta)" ${O}/>` +
    `<path d="M15 66 Q50 82 85 66" fill="none" stroke="url(#gTurq)" stroke-width="7"/>` +
    `<path d="M15 66 Q50 82 85 66" fill="none" ${THIN} stroke-width="1.5" opacity=".5"/>` +
    [24, 37, 50, 63, 76].map((x) => `<circle cx="${x}" cy="${x === 50 ? 76 : x === 37 || x === 63 ? 74 : 70}" r="2.4" fill="#fff8e6"/>`).join('') +
    `<rect x="39" y="36" width="22" height="6" rx="3" fill="#5e2a12"/>` +
    `<path d="M26 54 Q28 42 38 36" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".45"/>`,
  gift:
    `<rect x="16" y="44" width="68" height="44" rx="6" fill="url(#gRed)" ${O}/>` +
    `<rect x="11" y="32" width="78" height="16" rx="5" fill="url(#gRed)" ${O}/>` +
    `<rect x="44" y="32" width="12" height="56" fill="url(#gGold)" ${THIN}/>` +
    `<path d="M50 32 C38 10 20 16 32 32 Z M50 32 C62 10 80 16 68 32 Z" fill="url(#gGold)" ${O}/>` +
    `<path d="M22 54 V80" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".45"/>`,
  /** Season-pass medal («نشان»): ribbon, gold disc, star. */
  medal:
    `<path d="M30 6 L46 46 L36 50 L20 12 Z" fill="url(#gTurq)" ${O}/><path d="M70 6 L54 46 L64 50 L80 12 Z" fill="url(#gRed)" ${O}/>` +
    `<circle cx="50" cy="62" r="28" fill="url(#gGold)" ${O}/><circle cx="50" cy="62" r="20" fill="none" ${THIN} stroke-width="2" opacity=".5"/>` +
    `<path d="M50 46 L55 57 L67 58 L58 66 L61 78 L50 72 L39 78 L42 66 L33 58 L45 57 Z" fill="#fff4c2" ${THIN} stroke-width="2"/>` +
    `<path d="M32 52 Q36 42 46 38" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".6"/>`,
  crown:
    `<path d="M14 72 L10 30 L32 50 L50 20 L68 50 L90 30 L86 72 Z" fill="url(#gGold)" ${O}/>` +
    `<rect x="14" y="70" width="72" height="14" rx="4" fill="url(#gGold)" ${O}/>` +
    `<circle cx="50" cy="52" r="6" fill="url(#gRed)" ${THIN}/><circle cx="30" cy="62" r="4" fill="url(#gTurq)" ${THIN}/><circle cx="70" cy="62" r="4" fill="url(#gTurq)" ${THIN}/>`,
  trophy:
    `<path d="M30 16 L70 16 L68 44 C66 58 58 64 50 64 C42 64 34 58 32 44 Z" fill="url(#gGold)" ${O}/>` +
    `<path d="M31 22 C16 22 16 44 34 46 M69 22 C84 22 84 44 66 46" fill="none" ${O} stroke-width="4"/>` +
    `<rect x="44" y="62" width="12" height="12" fill="url(#gGold)" ${O}/><rect x="30" y="74" width="40" height="12" rx="3" fill="url(#gWood)" ${O}/>` +
    `<path d="M40 22 Q38 38 44 50" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".6"/>`,
  /** Race flag (checkered). */
  flag:
    `<path d="M24 12 L24 90" ${O} stroke-width="5"/>` +
    `<path d="M26 16 C42 8 56 22 82 14 L82 52 C56 60 42 46 26 54 Z" fill="#fff" ${O}/>` +
    `<path d="M26 16 L38 13 L38 25 L26 28 Z M50 16 L62 19 L62 31 L50 28 Z M74 16 L82 14 L82 27 L74 29 Z M38 25 L50 28 L50 40 L38 37 Z M62 31 L74 29 L74 42 L62 43 Z M26 28 L38 37 L38 49 L26 54 Z M50 40 L62 43 L62 55 L50 52 Z M74 42 L82 40 L82 52 L74 54 Z" fill="#4b2e1e"/>` +
    `<circle cx="24" cy="10" r="5" fill="url(#gGold)" ${THIN}/>`,
  sparkles: sparkle(30, 30, 14) + sparkle(70, 60, 10) + sparkle(64, 22, 7),
};
