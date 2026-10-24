// Season 3 («نامه‌ای از اون ور دنیا») place scenes. Same contract as scenes.ts: each task
// layer is drawn "before" until done, then "after".

import { INK, O, THIN, g, sparkle } from './kit';
import { Layer, SceneDef, brickWall, cobweb, dustPile, floor, glow, plank, stringLights } from './scenes';

export const darkness = (op = 0.3) => `<rect width="360" height="240" fill="#1c1430" opacity="${op}"/>`;
export const wall = (fill: string, h = 170) => `<rect width="360" height="${h}" fill="${fill}"/><path d="M0 ${h - 16} H360" stroke="rgba(0,0,0,.12)" stroke-width="10"/>`;
export const text = (x: number, y: number, t: string, size: number, fill: string, extra = '') =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="Vazirmatn, sans-serif" font-weight="900" font-size="${size}" fill="${fill}"${extra}>${t}</text>`;

// ------------------------------------------------------------------ پستخونه

const POSTOFFICE: Record<string, Layer> = {
  counter: (d) =>
    d
      ? `<rect x="90" y="150" width="180" height="60" rx="4" fill="url(#gWood)" ${O}/><rect x="84" y="142" width="192" height="12" rx="3" fill="url(#gWoodDark)" ${O}/>` +
        `<rect x="140" y="92" width="80" height="52" rx="6" fill="url(#gGlass)" ${O}/>` + Array.from({ length: 7 }, (_, i) => `<path d="M${148 + i * 10.5} 92 V144" stroke="#c9952e" stroke-width="2.4"/>`).join('') +
        `<rect x="160" y="132" width="40" height="12" rx="3" fill="#3b2216"/>` + g(`<rect x="-14" y="-10" width="28" height="18" rx="2" fill="#fffdf6" ${THIN}/><path d="M-14 -10 L0 0 L14 -10" fill="none" ${THIN}/>`, 'translate(118 134)')
      : `<rect x="90" y="160" width="180" height="50" rx="4" fill="#7a6a5a" ${O} transform="rotate(-3 180 185)"/>` + dustPile(150, 222) + cobweb(270, 90, 0.8, true),
  boxes: (d) =>
    Array.from({ length: 12 }, (_, i) => {
      const x = 16 + (i % 3) * 22, y = 36 + Math.floor(i / 3) * 26;
      return `<rect x="${x}" y="${y}" width="20" height="24" rx="2" fill="${d ? 'url(#gBrass)' : '#7a7a6a'}" ${THIN}/>` +
        (d ? `<circle cx="${x + 14}" cy="${y + 12}" r="1.6" fill="${INK}"/><rect x="${x + 4}" y="${y + 4}" width="8" height="4" fill="#fffdf6"/>` : i % 4 === 1 ? `<path d="M${x + 2} ${y + 2} L${x + 18} ${y + 22}" stroke="${INK}" stroke-width="1.4"/>` : '');
    }).join('') + `<rect x="12" y="32" width="74" height="112" rx="3" fill="none" ${O}/>`,
  scale: (d) =>
    d
      ? glow(306, 150, 34, 0.4) + `<rect x="296" y="160" width="20" height="48" fill="url(#gWoodDark)" ${O}/><rect x="282" y="152" width="48" height="10" rx="3" fill="url(#gBrass)" ${O}/>` +
        `<path d="M306 152 V120 M282 120 H330" ${O} stroke="url(#gBrass)" stroke-width="4"/><path d="M276 120 L282 132 L288 120 M324 120 L330 132 L336 120" fill="none" stroke="url(#gBrass)" stroke-width="2.4"/>` +
        `<rect x="318" y="114" width="24" height="16" rx="2" fill="#c9a26b" ${THIN}/><path d="M318 122 H342 M330 114 V130" stroke="#8a5a22" stroke-width="1.6"/>`
      : `<rect x="290" y="196" width="40" height="14" rx="3" fill="#8a7a5a" ${O} transform="rotate(12 310 203)"/>`,
  phone: (d) =>
    d
      ? `<rect x="226" y="40" width="54" height="120" rx="8" fill="url(#gYellow)" ${O}/><rect x="234" y="52" width="38" height="58" rx="4" fill="url(#gGlass)" ${THIN}/>` +
        `<rect x="240" y="60" width="26" height="40" rx="4" fill="#2a2a3a" ${THIN}/><path d="M244 66 C244 60 262 60 262 66" fill="none" stroke="#e2507a" stroke-width="4"/>` +
        [0, 1, 2].map((r) => [0, 1, 2].map((c) => `<circle cx="${247 + c * 6}" cy="${76 + r * 7}" r="2" fill="#ddd"/>`).join('')).join('') +
        text(253, 128, 'تلفن', 12, '#7a4a0c')
      : `<rect x="226" y="60" width="54" height="100" rx="8" fill="#8a8a7a" ${O}/><path d="M236 70 l30 40 M266 72 l-26 34" stroke="${INK}" stroke-width="1.6"/>`,
  sign: (d) =>
    d
      ? `<rect x="110" y="6" width="140" height="34" rx="8" fill="url(#gBlue)" ${O}/>` + text(196, 30, 'پُست', 18, '#fff') +
        g(`<path d="M-14 4 C-14 -6 -4 -10 4 -6 L14 -10 L14 10 L4 6 C-4 10 -14 8 -14 4 Z" fill="url(#gGold)" ${THIN}/>`, 'translate(138 23)')
      : `<g transform="rotate(-9 180 23)"><rect x="110" y="6" width="140" height="34" rx="8" fill="#6a6a7a" ${O}/>${text(180, 30, 'پـ…', 16, '#a0a0b0')}</g>`,
};

// ------------------------------------------------------------------ عکاسخونه

const PHOTO: Record<string, Layer> = {
  backdrop: (d) =>
    d
      ? `<rect x="100" y="14" width="160" height="150" fill="url(#gRose)" ${O}/>` +
        Array.from({ length: 18 }, (_, i) => {
          const x = 116 + (i % 6) * 26, y = 32 + Math.floor(i / 6) * 44 + (i % 2) * 12;
          return [0, 72, 144, 216, 288].map((a) => `<ellipse cx="${x}" cy="${y - 5}" rx="3.4" ry="5" transform="rotate(${a} ${x} ${y})" fill="#fffdf6" opacity=".85"/>`).join('') + `<circle cx="${x}" cy="${y}" r="2.4" fill="url(#gGold)"/>`;
        }).join('') + `<path d="M96 12 H264" ${O} stroke="url(#gWoodDark)" stroke-width="6"/>`
      : `<path d="M100 14 L150 14 L140 120 L110 90 Z" fill="#a9a59c" ${O} opacity=".85"/>` + cobweb(260, 10, 0.9, true),
  camera: (d) =>
    d
      ? `<path d="M64 150 L46 214 M64 150 L64 216 M64 150 L84 214" ${O} stroke="url(#gWoodDark)" stroke-width="4"/>` +
        `<rect x="40" y="110" width="40" height="40" rx="3" fill="url(#gWood)" ${O}/><path d="M80 116 L104 122 L104 140 L80 146 Z" fill="#2a2a2a" ${O}/>` +
        [86, 92, 98].map((x) => `<path d="M${x} 119 V145" stroke="#555" stroke-width="1.4"/>`).join('') +
        `<circle cx="108" cy="131" r="7" fill="url(#gBrass)" ${O}/><circle cx="108" cy="131" r="3.4" fill="url(#gSky)"/>` +
        `<path d="M40 112 C26 116 24 142 34 160 L44 158 C36 140 38 122 44 116 Z" fill="#1d1d1d" ${THIN}/>`
      : `<rect x="40" y="186" width="40" height="28" rx="3" fill="#6a5a4a" ${O} transform="rotate(20 60 200)"/>` + plank(84, 214, 50, -8),
  lights: (d) =>
    d
      ? [300, 330].map((x, k) => `<path d="M${x} 214 V${120 + k * 10}" stroke="#333" stroke-width="3"/><path d="M${x - 22} ${110 + k * 10} L${x + 22} ${110 + k * 10} L${x} ${84 + k * 10} Z" fill="url(#gSilver)" ${O}/>`).join('') +
        glow(250, 110, 80, 0.45) + sparkle(276, 70, 6)
      : `<path d="M300 214 L330 150" stroke="#555" stroke-width="3"/><path d="M314 152 L346 160 L334 136 Z" fill="#8a8a8a" ${O}/>`,
  darkroom: (d) =>
    `<rect x="296" y="30" width="54" height="110" rx="3" fill="url(#gWoodDark)" ${O}/>` +
    (d
      ? `<rect x="306" y="12" width="34" height="14" rx="4" fill="#e0303f" ${THIN}/>` + glow(323, 19, 22, 0.8) + text(323, 22, 'تاریک‌خانه', 6, '#fff') +
        `<path d="M270 70 H292" stroke="${INK}" stroke-width="1.2"/>` + [272, 282].map((x) => `<rect x="${x}" y="70" width="9" height="12" fill="#fffdf6" ${THIN}/>`).join('')
      : plank(292, 60, 64, 14) + plank(292, 100, 64, -10)),
  frames: (d) =>
    d
      ? [[12, 30, 52, 40], [20, 78, 36, 46], [62, 36, 30, 36]].map(([x, y, w, h]) =>
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="url(#gGold)" ${O}/><rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" fill="#d8c8a8"/>` +
        `<circle cx="${x + w / 2}" cy="${y + h / 2 - 3}" r="${Math.min(w, h) / 6}" fill="#8a6a4a"/><path d="M${x + w / 2 - w / 4} ${y + h - 4} Q${x + w / 2} ${y + h / 2 + 2} ${x + w / 2 + w / 4} ${y + h - 4}" fill="#8a6a4a"/>`).join('') + sparkle(90, 30, 5)
      : `<rect x="20" y="170" width="40" height="30" rx="2" fill="#8a7a6a" ${O} transform="rotate(-25 40 185)"/>`,
};

// ------------------------------------------------------------------ زورخونه

const domeWall = () =>
  brickWall('#c98a52', '#9c6a3a', 180) +
  `<path d="M0 0 H360 V40 Q180 -24 0 40 Z" fill="#a5733f"/>` +
  [60, 300].map((x) => `<path d="M${x - 26} 150 V90 A26 26 0 0 1 ${x + 26} 90 V150 Z" fill="#7a4a22" ${THIN}/>`).join('');

const ZURKHANEH: Record<string, Layer> = {
  pit: (d) =>
    `<path d="M70 196 L110 176 L250 176 L290 196 L250 216 L110 216 Z" fill="${d ? 'url(#gTurq)' : '#7a6a5a'}" ${O}/>` +
    `<path d="M84 196 L116 182 L244 182 L276 196 L244 210 L116 210 Z" fill="${d ? '#c9a26b' : '#5a4a3a'}" ${THIN}/>` +
    (d ? '' : `<rect x="120" y="170" width="46" height="34" fill="#c9a26b" ${O}/><rect x="190" y="174" width="46" height="30" fill="#b48a52" ${O}/><path d="M120 182 h46 M190 186 h46" ${THIN}/>`),
  meel: (d) =>
    d
      ? [96, 112, 248, 264].map((x, k) => `<path d="M${x} ${180 - (k % 2) * 4} L${x + 6} 120 Q${x + 8} 108 ${x + 14} 106 Q${x + 18} 112 ${x + 16} 124 L${x + 12} ${180 - (k % 2) * 4} Z" fill="${k < 2 ? 'url(#gWood)' : 'url(#gWoodDark)'}" ${O}/>`).join('') +
        `<path d="M150 150 Q180 120 210 150" fill="none" ${O} stroke="url(#gSteel)" stroke-width="5"/>`
      : `<path d="M150 214 L200 200 M210 216 L250 206" stroke="#8a6a4a" stroke-width="8" stroke-linecap="round"/>`,
  drum: (d) =>
    `<rect x="150" y="70" width="60" height="44" rx="4" fill="url(#gWoodDark)" ${O}/><rect x="146" y="64" width="68" height="8" rx="2" fill="url(#gWood)" ${O}/>` +
    (d
      ? `<path d="M168 70 L164 46 Q180 30 196 46 L192 70 Z" fill="url(#gClay)" ${O}/><ellipse cx="180" cy="44" rx="16" ry="5" fill="#f2e6cc" ${THIN}/>` + sparkle(214, 40, 5)
      : `<path d="M168 70 L172 54 L190 60 L192 70 Z" fill="#8a7a6a" ${O}/>`),
  bell: (d) =>
    d
      ? `<path d="M230 20 V40" ${O}/><path d="M218 62 C218 44 242 44 242 62 L246 68 L214 68 Z" fill="url(#gGold)" ${O}/><circle cx="230" cy="70" r="3" fill="url(#gBrass)" ${THIN}/>` + glow(230, 56, 20, 0.6)
      : `<path d="M230 20 V30" ${O}/><path d="M226 30 L234 30" ${O}/>`,
  photos: (d) =>
    d
      ? [[96, 22], [250, 22]].map(([x, y], k) =>
        `<rect x="${x}" y="${y}" width="34" height="42" rx="2" fill="url(#gGold)" ${O}/><rect x="${x + 4}" y="${y + 4}" width="26" height="34" fill="#cbb89a"/>` +
        `<circle cx="${x + 17}" cy="${y + 15}" r="5" fill="#6a4a2a"/><path d="M${x + 8} ${y + 36} Q${x + 17} ${y + 20} ${x + 26} ${y + 36}" fill="#6a4a2a"/>` +
        `<path d="M${x + 12} ${y + 13} q5 ${k ? 4 : 3} 10 0" stroke="#3b2216" stroke-width="1.6" fill="none"/>`).join('') +
        `<path d="M130 40 Q180 60 250 40" fill="none" stroke="#2a7d3e" stroke-width="3"/>` + [140, 160, 180, 200, 220, 240].map((x, i) => `<rect x="${x - 3}" y="${44 + Math.sin(i) * 3}" width="6" height="9" fill="${['#2a7d3e', '#fff', '#c0392b'][i % 3]}"/>`).join('')
      : cobweb(0, 0, 1.3) + cobweb(360, 0, 1.2, true),
};

// ------------------------------------------------------------------ سینما

const cinemaWall = () =>
  `<rect width="360" height="240" fill="#4a1a24"/>` + Array.from({ length: 10 }, (_, i) => `<path d="M${18 + i * 36} 0 V160" stroke="#5c2430" stroke-width="12"/>`).join('') + floor('#3a2a2a', 170);

const seatRow = (y: number, n: number, x0: number, step: number, good: boolean) =>
  Array.from({ length: n }, (_, i) => {
    const x = x0 + i * step;
    return good
      ? `<rect x="${x}" y="${y}" width="${step - 6}" height="22" rx="6" fill="url(#gRed)" ${THIN}/><rect x="${x - 2}" y="${y + 16}" width="${step - 2}" height="10" rx="4" fill="#8e1a24" ${THIN}/>`
      : `<rect x="${x}" y="${y + 6}" width="${step - 6}" height="18" rx="3" fill="#5a4a4a" ${THIN} transform="rotate(${(i % 3) * 7 - 7} ${x + 10} ${y + 16})"/>`;
  }).join('');

const CINEMA: Record<string, Layer> = {
  screen: (d) =>
    `<rect x="70" y="16" width="220" height="110" rx="4" fill="url(#gWoodDark)" ${O}/>` +
    (d
      ? `<rect x="80" y="24" width="200" height="94" fill="#f4f4ee"/>` +
        `<path d="M70 14 Q90 70 72 128 L56 128 Q66 70 56 14 Z M290 14 Q270 70 288 128 L304 128 Q294 70 304 14 Z" fill="url(#gRoseDeep)" ${O}/>`
      : `<rect x="80" y="24" width="200" height="94" fill="#6a6a6a"/><path d="M100 24 L130 118 M200 24 L170 90 L240 118" stroke="#3a3a3a" stroke-width="3"/>`),
  seats: (d) => seatRow(164, 9, 22, 36, d) + seatRow(194, 9, 4, 40, d),
  projector: (d) =>
    d
      ? `<path d="M330 40 L80 30 L80 116 L330 56 Z" fill="#fff8d0" opacity=".22"/>` +
        `<rect x="318" y="34" width="34" height="26" rx="4" fill="url(#gSteel)" ${O}/><circle cx="326" cy="30" r="9" fill="#333" ${THIN}/><circle cx="344" cy="30" r="9" fill="#333" ${THIN}/>` +
        g(`<path d="M18 40 L60 70 L30 90 Z" fill="#fff" opacity=".9"/>`, 'translate(120 10) scale(.6)')
      : `<rect x="318" y="40" width="34" height="26" rx="4" fill="#6a6a6a" ${O}/>`,
  posters: (d) =>
    d
      ? [[6, 30], [304, 76]].map(([x, y], k) =>
        `<rect x="${x}" y="${y}" width="50" height="68" rx="2" fill="${k ? 'url(#gYellow)' : 'url(#gTurq)'}" ${O}/>` +
        `<circle cx="${x + 25}" cy="${y + 26}" r="12" fill="${k ? '#c0392b' : '#fffdf6'}" ${THIN}/>` + text(x + 25, y + 58, k ? 'گنج قارون' : 'عاشقانه', 8, k ? '#5a2a0a' : '#fff')).join('')
      : `<path d="M10 40 L56 34 L50 90 L8 96 Z" fill="#7a6a5a" opacity=".7" ${THIN}/>`,
  marquee: (d) =>
    d
      ? `<rect x="120" y="128" width="120" height="28" rx="6" fill="#1d1d3a" ${O}/>` + text(180, 148, 'سینما محله', 15, '#ffd36b', ' style="filter:drop-shadow(0 0 4px #ffd36b)"') +
        Array.from({ length: 12 }, (_, i) => `<circle cx="${126 + i * 10}" cy="130" r="2" fill="#ffd36b"/>`).join('') + glow(180, 142, 60, 0.5)
      : `<rect x="120" y="128" width="120" height="28" rx="6" fill="#3a3a4a" ${O} transform="rotate(5 180 142)"/>` + darkness(0.25),
};

// ------------------------------------------------------------------ خونه‌ی پدری

export const courtyard = () =>
  `<rect width="360" height="170" fill="url(#gSky)"/>` + brickWall('#e0b07a', '#b5804d', 150).replace('<rect x="0" y="0" width="360" height="150"', '<rect x="0" y="20" width="360" height="130"') +
  floor('#c69260', 150);

const HOME: Record<string, Layer> = {
  room: (d) =>
    `<rect x="110" y="30" width="140" height="100" rx="4" fill="url(#gWoodDark)" ${O}/>` +
    Array.from({ length: 3 }, (_, i) => {
      const x = 118 + i * 44;
      return `<path d="M${x} 124 V58 A20 20 0 0 1 ${x + 40} 58 V124 Z" fill="${d ? '#fffdf6' : '#5a4a3a'}" ${THIN}/>` +
        (d
          ? [['#e0303f', 0], ['#14879a', 1], ['#f6c945', 2], ['#3fae5a', 3]].map(([c, k]) => `<rect x="${x + 4 + (Number(k) % 2) * 17}" y="${60 + Math.floor(Number(k) / 2) * 30}" width="15" height="26" fill="${c}" opacity=".75"/>`).join('') +
            `<path d="M${x + 20} 40 V124 M${x} 88 H${x + 40}" stroke="${INK}" stroke-width="1.6"/>`
          : `<path d="M${x + 6} 70 L${x + 34} 110 M${x + 30} 66 L${x + 10} 100" stroke="#2a1a10" stroke-width="2"/>`);
    }).join('') + (d ? glow(180, 80, 70, 0.35) : ''),
  tree: (d) =>
    `<path d="M40 170 C44 130 36 110 44 80" fill="none" ${O} stroke="#6a4a2a" stroke-width="10"/>` +
    (d
      ? [[44, 64, 34], [20, 86, 22], [70, 80, 24], [44, 40, 22]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gLeaf)" ${O}/>`).join('') +
        [[30, 70], [56, 60], [40, 90], [66, 84], [24, 92]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3" ry="4" fill="url(#gPlum)"/>`).join('')
      : `<path d="M44 80 L20 60 M44 90 L70 64 M44 100 L28 86" ${O} stroke="#6a4a2a" stroke-width="5"/>`),
  pool: (d) =>
    `<rect x="120" y="180" width="140" height="40" rx="6" fill="url(#gTurq)" ${O}/>` +
    `<rect x="128" y="186" width="124" height="28" rx="4" fill="${d ? '#7fd6e6' : '#6a5a3a'}" ${THIN}/>` +
    (d ? [[160, 198], [200, 204], [228, 196]].map(([x, y]) => `<path d="M${x} ${y} c4 -4 10 -3 12 0 c-2 3 -8 4 -12 0 Z M${x} ${y} l-5 -3 l1 6 Z" fill="url(#gOrange)" stroke="${INK}" stroke-width=".8"/>`).join('') : `<path d="M140 200 l20 4" stroke="${INK}" stroke-width="1.4" opacity=".5"/>`),
  letters: (d) =>
    `<rect x="276" y="180" width="64" height="36" rx="4" fill="url(#gWood)" ${O}/><path d="M276 192 H340" ${THIN}/><rect x="302" y="186" width="12" height="10" rx="2" fill="url(#gGold)" ${THIN}/>` +
    (d
      ? `<path d="M276 180 L284 152 L332 152 L340 180 Z" fill="url(#gWoodDark)" ${O}/>` + Array.from({ length: 6 }, (_, i) => `<rect x="${284 + i * 8}" y="${164 + (i % 2) * 4}" width="14" height="10" rx="1" fill="#fffdf6" ${THIN} stroke-width="1" transform="rotate(${i * 9 - 20} ${291 + i * 8} ${170})"/>`).join('') + glow(308, 170, 30, 0.6) + sparkle(344, 150, 5)
      : cobweb(340, 176, 0.5, true)),
  lights: (d) =>
    d
      ? stringLights(26) + [[100, 150], [260, 150]].map(([x, y]) => `<path d="M${x} ${y} V${y - 20}" stroke="#333" stroke-width="2"/><rect x="${x - 7}" y="${y - 34}" width="14" height="18" rx="3" fill="url(#gYellow)" ${THIN}/>` + glow(x, y - 25, 18, 0.7)).join('') + sparkle(330, 40, 7) + sparkle(30, 30, 6)
      : darkness(0.35),
};

export const SCENES3: Record<string, SceneDef> = {
  postoffice: { base: wall('#d8e4d4') + floor('#a9988a'), order: ['boxes', 'counter', 'scale', 'phone', 'sign'], layers: POSTOFFICE },
  photo: { base: wall('#efe0d0') + floor('#9a7a62'), order: ['backdrop', 'frames', 'darkroom', 'camera', 'lights'], layers: PHOTO },
  zurkhaneh: { base: domeWall() + floor('#8b5e34', 180), order: ['photos', 'bell', 'drum', 'pit', 'meel'], layers: ZURKHANEH },
  cinema: { base: cinemaWall(), order: ['screen', 'posters', 'projector', 'marquee', 'seats'], layers: CINEMA },
  home: { base: courtyard(), order: ['room', 'tree', 'pool', 'letters', 'lights'], layers: HOME },
};
