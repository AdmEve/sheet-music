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
  sparkles: sparkle(30, 30, 14) + sparkle(70, 60, 10) + sparkle(64, 22, 7),
};
