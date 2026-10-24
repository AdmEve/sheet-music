// Season 9: seaside («دریا») chain and its generator (the beach basket).

import { INK, O, THIN, g, shadow, shine, sparkle } from './kit';

const shell = (x: number, y: number, s: number, fill = '#ffd0dc') =>
  g(`<path d="M0 14 L-16 -2 Q-14 -16 0 -18 Q14 -16 16 -2 Z" fill="${fill}" ${O}/>` +
    [-10, -5, 0, 5, 10].map((dx) => `<path d="M0 12 L${dx} -14" stroke="#e8a0b0" stroke-width="1.4"/>`).join('') +
    `<path d="M-6 14 H6 V18 H-6 Z" fill="${fill}" ${THIN} stroke-width="1"/>`, `translate(${x} ${y}) scale(${s})`);

const starfish = (x: number, y: number, s: number) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2, r = i % 2 ? 9 : 22;
    return `${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;
  });
  return g(`<path d="M${pts.join(' L')} Z" fill="url(#gOrange)" ${O}/>` + [0, 1, 2, 3, 4].map((k) => { const a = (k / 5) * Math.PI * 2 - Math.PI / 2; return `<circle cx="${(Math.cos(a) * 12).toFixed(1)}" cy="${(Math.sin(a) * 12).toFixed(1)}" r="1.6" fill="#fff6c8"/>`; }).join(''),
    `translate(${x} ${y}) scale(${s})`);
};

const wave = (y: number) => `<path d="M14 ${y} q9 -6 18 0 t18 0 t18 0 t18 0" fill="none" stroke="#6cc0ea" stroke-width="3" stroke-linecap="round"/>`;

export const SEA: string[] = [
  // 1 صدف کوچک
  shadow(50, 84, 20) + shell(50, 62, 1.2),
  // 2 ستاره‌ی دریایی
  shadow(50, 86, 24) + starfish(50, 60, 1.3),
  // 3 سطل و بیلچه
  shadow(50, 88, 28) + `<path d="M28 44 H64 L60 82 H32 Z" fill="url(#gRed)" ${O}/><path d="M28 44 Q46 26 64 44" fill="none" ${O} stroke-width="2.4"/><path d="M30 56 H62" stroke="#fff" stroke-width="3"/>` +
    `<path d="M66 82 L80 40" ${O} stroke="url(#gYellow)" stroke-width="4"/><path d="M74 40 Q80 26 88 40 Z" fill="url(#gYellow)" ${O}/>`,
  // 4 تیوپ (swim ring)
  shadow(50, 88, 28) + `<ellipse cx="50" cy="60" rx="30" ry="20" fill="#fffdf6" ${O}/><ellipse cx="50" cy="58" rx="13" ry="8" fill="#f2d8a0" ${O}/>` +
    `<ellipse cx="50" cy="59" rx="22" ry="14" fill="none" stroke="#e0303f" stroke-width="10" stroke-dasharray="14.5 14.5"/>` +
    `<ellipse cx="50" cy="60" rx="30" ry="20" fill="none" ${O}/>` + shine(36, 50, 3, 7, 60, 0.6),
  // 5 قلعه‌ی شنی
  shadow(50, 90, 32) + `<path d="M22 84 V56 H34 V48 H44 V56 H56 V48 H66 V56 H78 V84 Z" fill="#e9c98a" ${O}/>` +
    `<path d="M40 84 V70 Q50 62 60 70 V84 Z" fill="#c9a26b" ${THIN}/><path d="M50 48 V30" ${THIN}/><path d="M50 30 L64 35 L50 40 Z" fill="url(#gRed)" ${THIN}/>` + shell(30, 84, 0.4) + starfish(72, 86, 0.35),
  // 6 قایق بادبانی
  shadow(50, 90, 32) + wave(84) + `<path d="M20 70 H80 L70 84 H30 Z" fill="url(#gWood)" ${O}/><path d="M50 70 V18" ${O} stroke-width="3"/>` +
    `<path d="M52 20 L78 64 H52 Z" fill="#fffdf6" ${O}/><path d="M48 26 L26 64 H48 Z" fill="url(#gRed)" ${O}/>`,
  // 7 فانوس دریایی
  shadow(50, 92, 26) + `<path d="M36 88 L42 32 H58 L64 88 Z" fill="#fffdf6" ${O}/>` +
    [44, 60, 76].map((y) => `<path d="M${38 + (88 - y) * 0.0} ${y} L${62} ${y}" stroke="#e0303f" stroke-width="7"/>`).join('') +
    `<path d="M36 88 L42 32 H58 L64 88 Z" fill="none" ${O}/><rect x="40" y="18" width="20" height="14" rx="2" fill="#ffe08a" ${O}/><path d="M38 18 L50 8 L62 18 Z" fill="url(#gRed)" ${O}/>` +
    `<path d="M60 22 L92 12 L92 34 Z M40 22 L8 12 L8 34 Z" fill="#fff6c8" opacity=".55"/>`,
  // 8 کشتی
  `<circle cx="50" cy="52" r="46" fill="url(#rGlow)" opacity=".55"/>` + shadow(50, 92, 38) + wave(86) +
    `<path d="M10 66 H90 L80 84 H20 Z" fill="url(#gNavy)" ${O}/><path d="M14 66 H86" stroke="#fffdf6" stroke-width="3"/>` +
    `<rect x="28" y="48" width="44" height="18" fill="#fffdf6" ${O}/>` + [36, 50, 64].map((x) => `<circle cx="${x}" cy="57" r="3.4" fill="url(#gSky)" ${THIN} stroke-width="1"/>`).join('') +
    `<rect x="40" y="30" width="20" height="18" fill="url(#gRed)" ${O}/><rect x="40" y="30" width="20" height="5" fill="${INK}"/>` +
    `<path class="steam" d="M50 28 q-6 -8 0 -16" fill="none" stroke="#e8e8e8" stroke-width="3" stroke-linecap="round" opacity=".8"/>` + sparkle(14, 30, 5) + sparkle(88, 26, 6),
];

const basket = (y: number, w: number) =>
  `<path d="M${50 - w / 2} ${y} H${50 + w / 2} L${50 + w / 2 - 6} ${y + 30} H${50 - w / 2 + 6} Z" fill="url(#gWicker)" ${O}/>` +
  [0, 1, 2].map((k) => `<path d="M${50 - w / 2 + 3 + k} ${y + 9 + k * 9} H${50 + w / 2 - 3 - k}" stroke="#8a5a22" stroke-width="1.5" opacity=".7"/>`).join('') +
  `<path d="M${50 - w / 3} ${y} Q50 ${y - 26} ${50 + w / 3} ${y}" fill="none" ${O} stroke="url(#gWicker)" stroke-width="4"/>`;

export const GEN_SEA: string[] = [
  // زنبیل ساحلی کوچک
  shadow(50, 90, 28) + basket(56, 48) + shell(38, 54, 0.45) + starfish(60, 52, 0.4),
  // زنبیل ساحلی
  shadow(50, 90, 34) + `<path d="M68 50 L78 22" ${O} stroke-width="2"/><path d="M60 24 Q76 8 92 26 Z" fill="url(#gTurq)" ${O}/>` + basket(56, 56) + shell(34, 54, 0.5) + starfish(56, 50, 0.45),
  // صندوق ساحلی
  shadow(50, 92, 38) + `<rect x="14" y="48" width="72" height="40" rx="4" fill="url(#gTurq)" ${O}/><path d="M14 60 H86" ${THIN}/>` +
    `<rect x="44" y="54" width="12" height="9" rx="2" fill="url(#gGold)" ${THIN}/>` + shell(28, 44, 0.5) + starfish(70, 42, 0.5) + sparkle(88, 22, 5),
];
