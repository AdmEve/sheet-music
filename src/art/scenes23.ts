// Season 23 («شاگرد نونوا») place scenes. Same contract as scenes.ts: each task layer is drawn
// "before" until done, then "after".

import { INK, O, THIN, estekan, samovar, sparkle, teapot } from './kit';
import { MILL } from './chainsY';
import { Layer, SceneDef, brickWall, cobweb, dustPile, floor, geranium, glow, latticeDoor, plank, sangak } from './scenes';
import { text } from './scenes3';

/** A chain drawing (100×100) placed with its bottom centre on (x, base), without its backdrop disc. */
const art = (src: string, x: number, base: number, s: number) =>
  `<g transform="translate(${x - 50 * s} ${base - 90 * s}) scale(${s})">${src.replace(/^<circle cx="50" cy="5\d" r="4\d"[^>]*\/>/, '')}</g>`;

/** A domed sangak oven: brick dome with a glowing mouth. */
const tanoor = (x: number, base: number, w: number, lit: boolean, fresh: boolean) =>
  `<path d="M${x - w / 2} ${base} V${base - w * 0.4} Q${x - w / 2} ${base - w * 0.95} ${x} ${base - w * 0.95} Q${x + w / 2} ${base - w * 0.95} ${x + w / 2} ${base - w * 0.4} V${base} Z" fill="${fresh ? '#c98a52' : '#6a5040'}" ${O}/>` +
  Array.from({ length: 4 }, (_, i) => `<path d="M${x - w / 2 + 2} ${base - w * (0.2 + i * 0.16)} H${x + w / 2 - 2}" stroke="${fresh ? '#a8683a' : '#4a3a30'}" stroke-width="1.4" opacity=".7"/>`).join('') +
  `<path d="M${x - w * 0.26} ${base - w * 0.1} V${base - w * 0.36} Q${x} ${base - w * 0.56} ${x + w * 0.26} ${base - w * 0.36} V${base - w * 0.1} Z" fill="${lit ? 'url(#gFire)' : '#2a1a12'}" ${O}/>` +
  (lit ? glow(x, base - w * 0.26, w * 0.5, 0.6) : '');

const sky = (h = 140) => `<rect width="360" height="${h}" fill="url(#gSky)"/>`;
const mountains = (y: number) =>
  `<path d="M0 ${y} L60 ${y - 50} L110 ${y - 20} L170 ${y - 70} L240 ${y - 24} L300 ${y - 60} L360 ${y - 18} V${y + 10} H0 Z" fill="#9aa8b8" ${THIN}/>` +
  `<path d="M160 ${y - 58} L170 ${y - 70} L182 ${y - 56} L174 ${y - 60} Z M292 ${y - 50} L300 ${y - 60} L310 ${y - 48} Z" fill="#fffdf6"/>`;

// ------------------------------------------------------------------ خمیرخونه‌ی اوستا رضا

const doughBase = () => brickWall('#b88a62', '#8f6444', 170) + floor('#8a6a4a', 170) + tanoor(300, 200, 110, true, false) + `<rect x="0" y="0" width="360" height="240" fill="#3a2010" opacity=".08"/>`;

const APPRENTICE: Record<string, Layer> = {
  trough: (d) => (d ? art(MILL[3], 130, 232, 1.2) : `<path d="M70 230 L80 188 H180 L190 230 Z" fill="#7a5a4a" ${O}/><path d="M74 196 Q130 176 186 196 L188 206 Q130 186 72 206 Z" fill="#b8ad9a" ${THIN}/>` + dustPile(110, 232)),
  sieve: (d) =>
    d ? `<path d="M60 16 V30" stroke="${INK}" stroke-width="1.4"/><circle cx="60" cy="52" r="22" fill="#fffdf6" stroke="#a77a4f" stroke-width="6"/><circle cx="60" cy="52" r="22" fill="none" ${THIN}/>` +
        Array.from({ length: 5 }, (_, i) => `<path d="M${44 + i * 8} 36 V68 M42 ${38 + i * 7} H78" stroke="#c9a26b" stroke-width=".8"/>`).join('') + art(MILL[2], 214, 234, 0.6)
      : `<ellipse cx="220" cy="226" rx="24" ry="7" fill="none" stroke="#8a6a4a" stroke-width="4"/><path d="M204 222 l12 6 M222 220 l10 8" stroke="#6a5040" stroke-width="1.4"/>`,
  peel: (d) =>
    d ? `<path d="M20 230 L120 40" stroke="#5e3418" stroke-width="7" stroke-linecap="round"/><path d="M20 230 L120 40" stroke="#a77a4f" stroke-width="5" stroke-linecap="round"/><path d="M110 40 L136 50 L124 76 L100 64 Z" fill="url(#gWood)" ${O}/>`
      : plank(20, 226, 50, -20) + plank(80, 232, 34, 10),
  pebbles: (d) =>
    d ? `<ellipse cx="300" cy="224" rx="30" ry="8" fill="url(#gSilver)" ${O}/>` + Array.from({ length: 14 }, (_, i) => `<ellipse cx="${280 + (i * 11) % 40}" cy="${216 + (i % 3) * 3}" rx="3.4" ry="2.4" fill="#f4f0e6" ${THIN} stroke-width=".6"/>`).join('') + sparkle(334, 206, 4)
      : Array.from({ length: 10 }, (_, i) => `<ellipse cx="${284 + (i * 13) % 36}" cy="${220 + (i % 3) * 3}" rx="3.4" ry="2.4" fill="#5a5048"/>`).join(''),
  apron: (d) =>
    `<circle cx="186" cy="44" r="3" fill="url(#gBrass)" ${THIN} stroke-width="1"/>` +
    (d ? `<path d="M176 46 Q186 40 196 46 L200 60 H172 Z" fill="#fffdf6" ${THIN}/><path d="M170 60 H202 L206 112 H166 Z" fill="#fffdf6" ${O}/><path d="M172 74 H200" stroke="#3a76c4" stroke-width="2"/>` + text(186, 98, 'آرش', 10, '#3a76c4')
      : cobweb(160, 30, 0.7)),
};

// ------------------------------------------------------------------ آسیاب آبی

const millBase = () =>
  sky(150) + mountains(130) + `<rect y="140" width="360" height="100" fill="#8ab060"/><path d="M0 140 H360" stroke="${INK}" stroke-width="1.4" opacity=".25"/>` +
  `<rect x="150" y="80" width="150" height="110" fill="#c9b89a" ${O}/>` + Array.from({ length: 6 }, (_, i) => `<path d="M150 ${96 + i * 16} H300" stroke="#a8987a" stroke-width="1.4"/>`).join('') +
  `<path d="M140 84 L225 46 L310 84 Z" fill="url(#gWoodDark)" ${O}/><path d="M214 190 V146 Q214 134 226 134 Q238 134 238 146 V190 Z" fill="url(#gWoodDark)" ${O}/><rect x="258" y="104" width="22" height="20" fill="url(#gSky)" ${THIN}/>`;

const WATERMILL: Record<string, Layer> = {
  stream: (d) =>
    `<path d="M0 214 Q60 200 100 214 T200 222 T360 214 V236 Q260 244 180 236 T0 236 Z" fill="${d ? 'url(#gWater)' : '#a89a80'}" ${THIN}/>` +
    (d ? `<path d="M30 218 l14 -2 M140 228 l16 0 M260 222 l14 2" stroke="#fff" stroke-width="1.6"/>` : [[40, 224], [120, 228], [220, 230], [300, 222]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="8" ry="4" fill="#8a8070" ${THIN} stroke-width="1"/>`).join('')),
  chute: (d) =>
    d ? `<path d="M0 104 L92 116 L92 124 L0 112 Z" fill="url(#gWood)" ${O}/><path d="M86 120 q4 14 0 30" fill="none" stroke="#9ec4e8" stroke-width="5" stroke-linecap="round"/><path d="M10 112 V160 M60 120 V160" stroke="#8b5328" stroke-width="3"/>`
      : plank(10, 150, 40, -10) + plank(60, 156, 36, 14),
  wheel: (d) =>
    d ? art(MILL[6], 96, 226, 1.15)
      : `<circle cx="96" cy="168" r="34" fill="none" stroke="#5e4a3a" stroke-width="5" stroke-dasharray="40 30"/><path d="M96 168 L120 144 M96 168 L70 186" stroke="#5e4a3a" stroke-width="4"/>`,
  stone: (d) =>
    d ? `<circle cx="330" cy="196" r="24" fill="#a8a29a" ${O}/><circle cx="330" cy="196" r="5" fill="#5a544c"/>` + Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2; return `<path d="M${330 + Math.cos(a) * 8} ${196 + Math.sin(a) * 8} L${330 + Math.cos(a + 0.3) * 21} ${196 + Math.sin(a + 0.3) * 21}" stroke="#86807a" stroke-width="1.6"/>`; }).join('')
      : `<path d="M306 210 Q330 168 354 210 Z" fill="#7a746c" ${O}/><path d="M318 196 l10 10 l8 -14" fill="none" stroke="${INK}" stroke-width="1.6"/>`,
  store: (d) =>
    d ? art(MILL[2], 176, 200, 0.42) + art(MILL[2], 196, 202, 0.42) + art(MILL[2], 186, 186, 0.38)
      : `<path d="M166 200 L170 180 H200 L204 200 Z" fill="#7a5a3a" ${THIN}/>` + plank(170, 196, 30, 30),
};

// ------------------------------------------------------------------ گندم‌زار

const field = () =>
  sky(120) + `<path d="M0 120 Q90 96 180 112 T360 104 V140 H0 Z" fill="#9ab870" ${THIN}/>` +
  `<rect y="130" width="360" height="110" fill="#e8c060"/>` +
  Array.from({ length: 40 }, (_, i) => `<path d="M${(i * 37) % 360} ${150 + (i * 23) % 80} q2 -10 0 -18" fill="none" stroke="#c9952e" stroke-width="2" stroke-linecap="round"/>`).join('') +
  `<path d="M322 200 C318 170 326 150 322 120" fill="none" stroke="#5a3a22" stroke-width="9" stroke-linecap="round"/>` +
  [[300, 116, 30], [344, 110, 28], [322, 86, 28]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gLeafDark)" ${THIN}/>`).join('');

const sheaf = (x: number, base: number) =>
  `<path d="M${x - 10} ${base} L${x - 4} ${base - 30} L${x - 14} ${base - 50} H${x + 14} L${x + 4} ${base - 30} L${x + 10} ${base} Z" fill="#f0c050" ${THIN}/>` +
  `<path d="M${x - 6} ${base - 30} H${x + 6}" stroke="#a5621f" stroke-width="3"/>` + Array.from({ length: 5 }, (_, i) => `<ellipse cx="${x - 12 + i * 6}" cy="${base - 52}" rx="2.6" ry="5" fill="#e8b040" stroke="#a5621f" stroke-width=".6"/>`).join('');

const WHEATFIELD: Record<string, Layer> = {
  sheaves: (d) => (d ? sheaf(60, 190) + sheaf(100, 196) + sheaf(150, 186) + sheaf(196, 194) : `<rect y="150" width="230" height="60" fill="#e8c060" opacity=".6"/>` + Array.from({ length: 14 }, (_, i) => `<path d="M${10 + i * 16} 206 V160" stroke="#d9a63a" stroke-width="3"/>`).join('')),
  cart: (d) =>
    d ? `<rect x="40" y="200" width="100" height="22" fill="url(#gWood)" ${O}/><path d="M140 212 L176 204" stroke="#8b5328" stroke-width="4"/>` + sheaf(70, 202) + sheaf(96, 200) + sheaf(120, 202) +
        [60, 120].map((x) => `<circle cx="${x}" cy="226" r="12" fill="none" stroke="#5e3418" stroke-width="4"/><path d="M${x - 12} 226 H${x + 12} M${x} 214 V238" stroke="#8b5328" stroke-width="2"/>`).join('')
      : `<path d="M40 222 L140 208 L142 226 L44 238 Z" fill="#7a5a3a" ${O}/><circle cx="120" cy="232" r="10" fill="none" stroke="#5e4a3a" stroke-width="3" stroke-dasharray="14 10"/>`,
  scarecrow: (d) =>
    `<path d="M250 236 V140 M226 160 H274" stroke="#8b5328" stroke-width="5" stroke-linecap="round"/>` +
    (d ? `<path d="M234 156 H266 L262 196 H238 Z" fill="#3a76c4" ${THIN}/><path d="M226 160 L234 156 M274 160 L266 156" stroke="#3a76c4" stroke-width="6"/><circle cx="250" cy="138" r="12" fill="#e8d6a8" ${THIN}/>` +
        `<path d="M244 136 h3 M253 136 h3 M244 143 q6 4 12 0" fill="none" stroke="${INK}" stroke-width="1.6"/><path d="M236 130 C236 112 264 112 264 130 Z" fill="#fff" ${THIN}/><path d="M236 130 H264" ${THIN}/>` +
        `<path d="M226 160 l-6 4 M274 160 l6 4" stroke="#e8c060" stroke-width="3"/>`
      : ''),
  sickles: (d) =>
    d ? `<path d="M190 232 H270" stroke="url(#gWood)" stroke-width="8" stroke-linecap="round"/><path d="M190 232 H270" stroke="#8b5328" stroke-width="7" stroke-linecap="round"/>` +
        [[206, 228], [236, 228]].map(([x, y]) => `<path d="M${x} ${y} V${y - 16}" stroke="#a77a4f" stroke-width="4" stroke-linecap="round"/><path d="M${x} ${y - 16} C${x + 2} ${y - 34} ${x + 26} ${y - 36} ${x + 28} ${y - 20} C${x + 20} ${y - 28} ${x + 8} ${y - 28} ${x + 2} ${y - 16} Z" fill="url(#gSilver)" ${THIN}/>`).join('')
      : `<path d="M200 230 C202 214 226 212 228 228" fill="none" stroke="#8a5a3a" stroke-width="4"/><path d="M238 232 C240 220 256 218 258 230" fill="none" stroke="#8a5a3a" stroke-width="4"/>`,
  lunch: (d) =>
    d ? `<path d="M270 214 H350 L356 232 H264 Z" fill="#fffdf6" ${O}/><path d="M272 218 H348" stroke="#e0303f" stroke-width="2"/>` + sangak(276, 212, 30, 12) +
        `<path d="M318 220 A12 12 0 0 1 342 220 Z" fill="#e0303f" ${THIN}/><path d="M318 220 A12 12 0 0 1 342 220" fill="none" stroke="#3f8a2a" stroke-width="3"/><circle cx="326" cy="216" r="1" fill="${INK}"/><circle cx="334" cy="216" r="1" fill="${INK}"/>` +
        `<rect x="296" y="222" width="14" height="6" rx="2" fill="#fffdf6" ${THIN} stroke-width="1"/>` + estekan(346, 228, 0.16, true, false)
      : '',
};

// ------------------------------------------------------------------ نونوایی نو

const bakeryBase = () => `<rect width="360" height="170" fill="#e8d6b8"/>` + floor('#a07a54', 170);

const NEWBAKERY: Record<string, Layer> = {
  dome: (d) =>
    tanoor(180, 168, 150, true, d) +
    (d ? Array.from({ length: 7 }, (_, i) => `<path d="M${120 + i * 20} 70 l6 -6 l6 6 l-6 6 Z" fill="url(#gTurq)" ${THIN} stroke-width=".8"/>`).join('') : `<path d="M130 60 l14 20 l-6 14 M230 66 l-10 18" stroke="${INK}" stroke-width="1.6"/><ellipse cx="180" cy="40" rx="40" ry="12" fill="#2a1a12" opacity=".35"/>`),
  rack: (d) =>
    d ? `<path d="M10 70 H96 M264 70 H350" stroke="url(#gBrass)" stroke-width="4"/><path d="M10 70 H96 M264 70 H350" stroke="#c9952e" stroke-width="3"/>` +
        [20, 54, 274, 308].map((x) => `<path d="M${x + 15} 70 V76" stroke="${INK}" stroke-width="1.2"/>` + sangak(x, 76, 32, 56)).join('')
      : [30, 70, 290, 330].map((x) => `<path d="M${x} 70 l4 6" stroke="#6a5a4a" stroke-width="2.4"/>`).join(''),
  counter: (d) =>
    d ? `<rect x="20" y="186" width="320" height="44" fill="#d8d0c4" ${O}/><rect x="14" y="178" width="332" height="12" rx="3" fill="#ece6dc" ${O}/>` + Array.from({ length: 6 }, (_, i) => `<path d="M${60 + i * 50} 192 l10 30" stroke="#b8b0a4" stroke-width="1.4"/>`).join('') + sangak(40, 168, 50, 12) + sangak(270, 168, 50, 12)
      : `<rect x="20" y="190" width="320" height="40" fill="#7a5a3a" ${O} transform="rotate(-2 180 210)"/>` + plank(40, 188, 80, -8),
  fan: (d) =>
    `<path d="M306 0 V18" stroke="${INK}" stroke-width="2"/>` +
    (d ? `<path d="M306 22 L346 17 Q353 22 346 27 Z M306 22 L266 17 Q259 22 266 27 Z" fill="url(#gWood)" ${THIN} stroke-width="1"/><ellipse cx="306" cy="22" rx="8" ry="5" fill="url(#gSilver)" ${THIN}/>`
      : cobweb(340, 0, 0.6, true)),
  sign: (d) =>
    d ? `<rect x="96" y="2" width="168" height="34" rx="5" fill="url(#gNavy)" ${O}/>` + text(180, 21, 'نونوایی سنگکی', 13, '#ffe08a') + text(234, 32, 'و شاگردش آرش', 6, '#fff6d0') + sparkle(270, 8, 4)
      : `<rect x="110" y="6" width="140" height="26" rx="5" fill="#8a8a80" ${THIN} transform="rotate(-4 180 19)"/>`,
};

// ------------------------------------------------------------------ اولین سنگک آرش

const dawnBase = () =>
  `<rect width="360" height="150" fill="#ffd9c0"/><rect width="360" height="70" fill="#f6b8c8" opacity=".6"/><circle cx="180" cy="96" r="22" fill="#ffe08a"/>` + glow(180, 96, 50, 0.5) +
  `<path d="M0 40 L110 70 V190 L0 240 Z M360 40 L250 70 V190 L360 240 Z" fill="#e0b07a" ${O}/><rect x="110" y="96" width="140" height="94" fill="#d8b48a" ${THIN}/>` +
  `<path d="M110 190 H250 L360 240 H0 Z" fill="#c9b89a"/>` + latticeDoor(30, 110, 40, 90) + latticeDoor(290, 110, 40, 90) + geranium(130, 190, 0.8) + geranium(232, 190, 0.8);

const FIRSTBREAD: Record<string, Layer> = {
  sofreh: (d) =>
    d ? `<path d="M120 186 H240 L320 236 H40 Z" fill="#fffdf6" ${O}/><path d="M130 190 H230 L300 232 H60 Z" fill="none" stroke="#e0303f" stroke-width="2" stroke-dasharray="6 4"/>`
      : `<rect x="140" y="200" width="80" height="16" rx="8" fill="#e8dcc6" ${THIN}/>`,
  cheese: (d) =>
    d ? [[120, 214], [240, 214]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="18" ry="5" fill="url(#gSilver)" ${THIN}/><rect x="${x - 10}" y="${y - 8}" width="14" height="7" rx="1" fill="#fffdf6" ${THIN} stroke-width="1"/>` +
          `<circle cx="${x + 9}" cy="${y - 3}" r="3" fill="#a0724a" ${THIN} stroke-width=".8"/><path d="M${x - 16} ${y - 4} q4 -8 8 0 q4 -8 8 0" fill="#3f8a2a"/>`).join('')
      : '',
  honey: (d) =>
    d ? `<path d="M88 228 V212 Q88 206 94 206 H106 Q112 206 112 212 V228 Z" fill="url(#gGlass)" ${THIN}/><rect x="90" y="214" width="20" height="13" fill="#f0a030" opacity=".85"/><rect x="88" y="202" width="24" height="6" rx="2" fill="url(#gWood)" ${THIN} stroke-width="1"/>` +
        `<rect x="252" y="222" width="22" height="10" rx="2" fill="#fff3a8" ${THIN}/><ellipse cx="263" cy="234" rx="16" ry="3.4" fill="url(#gSilver)" ${THIN} stroke-width="1"/>`
      : '',
  samovar: (d) =>
    d ? art(samovar('url(#gBrass)', true), 300, 236, 0.7) + teapot(300, 168, 0.22) + glow(300, 190, 30, 0.4) + estekan(270, 230, 0.18, true, false) + estekan(330, 232, 0.18, true, false)
      : '',
  bread: (d) =>
    d ? sangak(152, 196, 56, 24) + `<path d="M166 188 q-4 -10 2 -18 M180 186 q-4 -10 2 -18 M194 188 q-4 -10 2 -18" fill="none" stroke="#fff" stroke-width="2" opacity=".8" stroke-linecap="round"/>` + sparkle(214, 184, 6) + sparkle(148, 180, 4) + glow(180, 206, 40, 0.5)
      : dustPile(180, 210),
};

export const SCENES23: Record<string, SceneDef> = {
  apprentice: { base: doughBase(), order: ['apron', 'peel', 'sieve', 'trough', 'pebbles'], layers: APPRENTICE },
  watermill: { base: millBase(), order: ['stream', 'chute', 'wheel', 'stone', 'store'], layers: WATERMILL },
  wheatfield: { base: field(), order: ['sheaves', 'scarecrow', 'cart', 'sickles', 'lunch'], layers: WHEATFIELD },
  newbakery: { base: bakeryBase(), order: ['fan', 'dome', 'rack', 'counter', 'sign'], layers: NEWBAKERY },
  firstbread: { base: dawnBase(), order: ['sofreh', 'cheese', 'honey', 'bread', 'samovar'], layers: FIRSTBREAD },
};
