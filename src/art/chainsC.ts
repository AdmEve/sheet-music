// Chests, coins and energy pick-ups.

import { O, THIN, bolt, coin, estekan, g, samovar, shadow, shine, sparkle, teapot } from './kit';

const chest = (body: string, band: string, glow = false) =>
  (glow ? `<circle cx="50" cy="56" r="44" fill="url(#rGlow)" opacity=".8"/>` : '') +
  shadow(50, 88, 36) +
  `<path d="M16 50 L84 50 L82 84 L18 84 Z" fill="${body}" ${O}/>` +
  `<path d="M14 50 C14 24 86 24 86 50 Z" fill="${body}" ${O}/>` +
  `<path d="M14 50 L86 50" ${O} stroke-width="3.5"/>` +
  `<path d="M28 30 L28 84 M72 30 L72 84" stroke="${band}" stroke-width="6"/><path d="M28 30 L28 84 M72 30 L72 84" fill="none" ${THIN} opacity=".5"/>` +
  `<rect x="42" y="44" width="16" height="16" rx="3" fill="url(#gGold)" ${O}/><circle cx="50" cy="52" r="2.5" fill="#4b2e1e"/>` +
  shine(30, 38, 8, 3, -10, 0.45);

export const CHEST: string[] = [
  chest('url(#gWood)', '#8d6e4a'),
  chest('url(#gCopper)', '#7a3a1e'),
  chest('url(#gGold)', '#b7801c', true) + sparkle(14, 24, 6) + sparkle(88, 30, 5),
];

export const COINS: string[] = [
  shadow(50, 84, 24) + coin(40, 66, 12) + coin(60, 62, 12) + coin(50, 48, 12),
  shadow(50, 88, 30) +
    `<path d="M28 50 C20 64 22 84 36 86 L64 86 C78 84 80 64 72 50 Z" fill="#c9a26b" ${O}/>` +
    `<path d="M36 50 C40 42 60 42 64 50 L58 40 L42 40 Z" fill="#b48a52" ${O}/><path d="M38 48 L62 48" stroke="#8d3d1a" stroke-width="4" stroke-linecap="round"/>` +
    coin(42, 36, 10) + coin(58, 34, 10) + coin(50, 24, 10),
  `<circle cx="50" cy="52" r="46" fill="url(#rGlow)" opacity=".7"/>` + shadow(50, 89, 26) +
    `<path d="M40 24 L60 24 L58 34 C76 40 80 58 72 74 C66 86 34 86 28 74 C20 58 24 40 42 34 Z" fill="url(#gTerracotta)" ${O}/>` +
    coin(38, 26, 10) + coin(62, 26, 10) + coin(50, 16, 10) + coin(50, 60, 13) + sparkle(84, 26, 5) + sparkle(16, 46, 4),
];

export const ENERGY: string[] = [
  shadow(50, 90, 26) + estekan(50, 60, 1.05, true) + bolt(50, 52, 0.9),
  shadow(50, 88, 30) + teapot(50, 60, 1, 'url(#gYellow)') + bolt(48, 64, 0.9),
  `<circle cx="50" cy="52" r="46" fill="url(#rGlow)"/>` + g(samovar('url(#gYellow)'), 'translate(5 6) scale(.9)') + bolt(50, 52, 1.1) + sparkle(16, 26, 6) + sparkle(86, 30, 5),
];
