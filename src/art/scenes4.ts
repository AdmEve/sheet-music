// Season 4 («یه نفر تو راهه») place scenes. Same contract as scenes.ts: each task layer is
// drawn "before" until done, then "after".

import { INK, O, THIN, sparkle } from './kit';
import { Layer, SceneDef, cobweb, dustPile, floor, geranium, glow, lantern, plank, stringLights } from './scenes';
import { courtyard, darkness, text, wall } from './scenes3';

const can = (x: number, y: number, c: string) =>
  `<rect x="${x - 5}" y="${y - 14}" width="10" height="14" rx="2" fill="${c}" ${THIN} stroke-width="1"/><path d="M${x - 5} ${y - 9} h10" stroke="#fff" stroke-width="1.6" opacity=".7"/>`;
const jarS = (x: number, y: number, c: string) =>
  `<rect x="${x - 6}" y="${y - 16}" width="12" height="16" rx="3" fill="url(#gGlass)" ${THIN} stroke-width="1"/><rect x="${x - 5}" y="${y - 10}" width="10" height="9" fill="${c}"/><rect x="${x - 6}" y="${y - 19}" width="12" height="4" rx="1" fill="url(#gRed)" ${THIN} stroke-width="1"/>`;

// ------------------------------------------------------------------ بقالی

const GROCERY: Record<string, Layer> = {
  shelves: (d) =>
    [62, 102, 142].map((y) => `<rect x="10" y="${y}" width="140" height="6" fill="url(#gWoodDark)" ${THIN}/>`).join('') +
    (d
      ? [20, 34, 48, 62, 76].map((x, i) => can(x, 62, ['url(#gRed)', 'url(#gYellow)', 'url(#gTurq)', 'url(#gLeaf)', 'url(#gOrange)'][i])).join('') +
        [96, 114, 132].map((x, i) => jarS(x, 62, ['#e0303f', '#f6c945', '#7fbf4a'][i])).join('') +
        [22, 44, 66, 88, 110, 132].map((x, i) => `<rect x="${x - 8}" y="80" width="16" height="22" rx="2" fill="${['#f6e3b0', '#ffd0dc', '#d8e4ec'][i % 3]}" ${THIN} stroke-width="1"/>`).join('') +
        [24, 50, 76, 102, 128].map((x, i) => can(x, 142, ['url(#gTurq)', 'url(#gRed)', 'url(#gYellow)', 'url(#gRed)', 'url(#gLeaf)'][i])).join('')
      : cobweb(0, 40, 1) + plank(20, 140, 60, 10)),
  fridge: (d) =>
    `<rect x="272" y="44" width="76" height="160" rx="6" fill="${d ? 'url(#gRed)' : '#8a7a7a'}" ${O}/>` +
    (d
      ? `<rect x="280" y="58" width="60" height="120" rx="3" fill="url(#gSky)" ${THIN}/>` + glow(310, 110, 40, 0.4) +
        [78, 108, 138].map((y) => `<path d="M280 ${y + 18} H340" stroke="#9ab" stroke-width="2"/>` +
          [288, 300, 312, 324, 334].map((x, i) => `<rect x="${x - 4}" y="${y}" width="8" height="18" rx="3" fill="${['#e0303f', '#f6c945', '#3fae5a', '#ff9f43', '#3a76c4'][(i + y) % 5]}" ${THIN} stroke-width=".8"/>`).join('')).join('') +
        text(310, 194, 'نوشیدنی', 10, '#fff')
      : `<path d="M280 70 L340 170 M340 70 L280 170" stroke="${INK}" stroke-width="2" opacity=".5"/><rect x="290" y="110" width="40" height="10" fill="#c9b9a0"/>`),
  sacks: (d) =>
    [[40, '#fffdf6'], [80, '#c0392b'], [120, '#ff9f43'], [160, '#e9d6a8']].map(([x, c], i) =>
      d
        ? `<path d="M${Number(x) - 18} 236 C${Number(x) - 20} 214 ${Number(x) - 16} 200 ${Number(x) - 14} 196 L${Number(x) + 14} 196 C${Number(x) + 16} 200 ${Number(x) + 20} 214 ${Number(x) + 18} 236 Z" fill="#c9a26b" ${O}/>` +
          `<ellipse cx="${x}" cy="197" rx="15" ry="5" fill="${c}" ${THIN}/>` + (i === 0 ? `<path d="M${Number(x) + 4} 196 l14 -16" ${O} stroke-width="3"/><ellipse cx="${Number(x) + 20}" cy="179" rx="6" ry="3" fill="url(#gSteel)" ${THIN}/>` : '')
        : i % 2 ? '' : `<path d="M${Number(x) - 16} 236 L${Number(x) - 8} 220 L${Number(x) + 14} 230 L${Number(x) + 16} 236 Z" fill="#8a7a6a" ${O}/>`).join(''),
  scale: (d) =>
    `<rect x="170" y="164" width="96" height="50" rx="4" fill="url(#gWood)" ${O}/><rect x="164" y="156" width="108" height="10" rx="3" fill="url(#gWoodDark)" ${O}/>` +
    (d
      ? `<path d="M218 156 V120 M188 120 H248" ${O} stroke-width="3"/><path d="M180 132 Q188 142 196 132 Z M240 132 Q248 142 256 132 Z" fill="url(#gBrass)" ${THIN}/><path d="M188 120 L180 132 M188 120 L196 132 M248 120 L240 132 M248 120 L256 132" stroke="${INK}" stroke-width="1"/>` +
        `<circle cx="248" cy="128" r="4" fill="url(#gRed)" ${THIN}/><rect x="184" y="124" width="8" height="8" fill="url(#gSteel)" ${THIN}/>`
      : `<path d="M196 150 L240 140" stroke="#8a7a5a" stroke-width="4"/>` + dustPile(220, 154)),
  sign: (d) =>
    d
      ? `<rect x="100" y="6" width="160" height="34" rx="8" fill="url(#gLeaf)" ${O}/>` + text(180, 30, 'بقالی برکت', 17, '#fff')
      : `<g transform="rotate(6 180 23)"><rect x="100" y="6" width="160" height="34" rx="8" fill="#7a8a6a" ${O}/>${text(180, 29, 'بقـ… بر…', 15, '#b0b8a0')}</g>`,
};

// ------------------------------------------------------------------ سیسمونی

const pastel = () =>
  wall('#fde8ef') + Array.from({ length: 36 }, (_, i) => `<circle cx="${(i % 9) * 42 + 14 + (Math.floor(i / 9) % 2) * 21}" cy="${Math.floor(i / 9) * 40 + 16}" r="4" fill="#f9c8d8"/>`).join('') + floor('#d8c4b0');

const onesie = (x: number, y: number, c: string) =>
  `<path d="M${x - 9} ${y} L${x - 4} ${y - 2} Q${x} ${y + 2} ${x + 4} ${y - 2} L${x + 9} ${y} L${x + 12} ${y + 7} L${x + 7} ${y + 8} L${x + 7} ${y + 22} L${x - 7} ${y + 22} L${x - 7} ${y + 8} L${x - 12} ${y + 7} Z" fill="${c}" ${THIN} stroke-width="1.2"/>`;

const teddy = (x: number, y: number, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="-8" cy="-22" r="5" fill="#c98a52" ${THIN}/><circle cx="8" cy="-22" r="5" fill="#c98a52" ${THIN}/>` +
  `<ellipse cx="0" cy="0" rx="12" ry="13" fill="#c98a52" ${O}/><circle cx="0" cy="-16" r="10" fill="#d9a06a" ${O}/>` +
  `<circle cx="-3.5" cy="-17" r="1.4" fill="${INK}"/><circle cx="3.5" cy="-17" r="1.4" fill="${INK}"/><ellipse cx="0" cy="-12" rx="3" ry="2" fill="#f2d2a2"/><path d="M-8 -6 L8 -6" stroke="#e2507a" stroke-width="3"/></g>`;

const cradle = (x: number, y: number, s = 1, blanket = 'url(#gRose)', grey = false) =>
  `<g transform="translate(${x} ${y}) scale(${s})"${grey ? ' filter="url(#fGray)" opacity=".7"' : ''}>` +
  `<path d="M-50 30 Q0 50 50 30" fill="none" ${O} stroke="url(#gWoodDark)" stroke-width="5"/><path d="M-50 30 Q0 50 50 30" fill="none" ${THIN} opacity=".5"/>` +
  `<path d="M-40 -6 L40 -6 L36 28 L-36 28 Z" fill="url(#gWood)" ${O}/>` + Array.from({ length: 7 }, (_, i) => `<path d="M${-30 + i * 10} -4 V26" stroke="#8b5328" stroke-width="2"/>`).join('') +
  `<path d="M-44 -10 Q-44 -30 -30 -32 L-30 -6 Z M44 -10 Q44 -30 30 -32 L30 -6 Z" fill="url(#gWood)" ${O}/>` +
  (grey ? '' : `<path d="M-34 -6 Q0 -16 34 -6 L30 10 Q0 4 -30 10 Z" fill="${blanket}" ${THIN}/><circle cx="-14" cy="-6" r="2" fill="#fff"/><circle cx="6" cy="-9" r="2" fill="#fff"/><circle cx="22" cy="-6" r="2" fill="#fff"/>`) + `</g>`;

const SISMOONI: Record<string, Layer> = {
  window: (d) =>
    `<rect x="224" y="36" width="126" height="120" rx="4" fill="url(#gWood)" ${O}/>` +
    (d
      ? `<rect x="232" y="44" width="110" height="104" fill="url(#gSky)" ${THIN}/><path d="M246 60 l20 -12 M250 80 l40 -30" stroke="#fff" stroke-width="4" opacity=".6"/>` +
        onesie(262, 96, '#a8e0c8') + onesie(292, 92, '#ffd0dc') + `<path d="M318 130 l6 -10 l6 10 Z" fill="url(#gYellow)" ${THIN}/>` + teddy(322, 136, 0.6)
      : plank(220, 70, 136, 8) + plank(220, 116, 136, -6)),
  clothes: (d) =>
    `<path d="M10 40 Q110 60 210 40" fill="none" stroke="${INK}" stroke-width="1.4"/>` +
    (d ? [[30, '#a8e0c8'], [62, '#ffd0dc'], [96, '#fff3a8'], [130, '#c8d8ff'], [164, '#ffd0dc'], [194, '#a8e0c8']].map(([x, c], i) => onesie(Number(x), 44 + Math.sin((Number(x) / 210) * Math.PI) * 18 - (i % 2) * 2, String(c))).join('') : ''),
  toys: (d) =>
    `<rect x="16" y="128" width="120" height="7" fill="url(#gWoodDark)" ${THIN}/>` +
    (d
      ? teddy(36, 126, 0.9) + `<circle cx="74" cy="118" r="10" fill="url(#gRed)" ${THIN}/><path d="M64 118 H84 M74 108 V128" stroke="#fff" stroke-width="2"/>` +
        `<rect x="92" y="110" width="12" height="12" fill="url(#gYellow)" ${THIN}/><rect x="104" y="116" width="12" height="12" fill="url(#gTurq)" ${THIN}/><rect x="98" y="104" width="12" height="12" fill="url(#gRose)" ${THIN}/>` +
        `<circle cx="126" cy="114" r="6" fill="url(#gGold)" ${THIN}/><path d="M126 120 V128" ${THIN}/>`
      : cobweb(16, 100, 0.6) + dustPile(70, 132)),
  cradle: (d) => cradle(170, 186, 0.95, 'url(#gRose)', !d),
  sign: (d) =>
    d
      ? `<rect x="40" y="2" width="170" height="30" rx="8" fill="url(#gRose)" ${O}/>` + text(125, 23, 'سیسمونی محله', 15, '#fff')
      : `<g transform="rotate(-5 125 17)"><rect x="40" y="2" width="170" height="30" rx="8" fill="#a99aa0" ${O}/>${text(125, 22, 'سیسـ… محـ…', 14, '#d8ccd0')}</g>`,
};

// ------------------------------------------------------------------ کتابخونه

const orosiBase = () =>
  wall('#efe3cc') + floor('#a07a52') +
  `<rect x="130" y="20" width="100" height="96" rx="4" fill="url(#gWoodDark)" ${O}/>` +
  [0, 1].map((i) => {
    const x = 138 + i * 44;
    return `<path d="M${x} 110 V48 A20 20 0 0 1 ${x + 40} 48 V110 Z" fill="#fffdf6" ${THIN}/>` +
      [['#e0303f', 0], ['#14879a', 1], ['#f6c945', 2], ['#3fae5a', 3]].map(([c, k]) => `<rect x="${x + 4 + (Number(k) % 2) * 17}" y="${52 + Math.floor(Number(k) / 2) * 28}" width="15" height="24" fill="${c}" opacity=".7"/>`).join('');
  }).join('');

const books = (x: number, y: number, n: number) =>
  Array.from({ length: n }, (_, i) => `<rect x="${x + i * 9}" y="${y - 22 + (i % 3) * 2}" width="8" height="${22 - (i % 3) * 2}" fill="${['#c0392b', '#14879a', '#e7a512', '#3fae5a', '#7b4bb8', '#1d4fa8'][i % 6]}" ${THIN} stroke-width=".8"/>`).join('');

const LIBRARY: Record<string, Layer> = {
  shelves: (d) =>
    [[8, 112], [252, 352]].map(([x0, x1]) =>
      `<rect x="${x0}" y="24" width="${x1 - x0}" height="150" fill="url(#gWoodDark)" ${O}/>` +
      [64, 104, 144].map((y) => `<rect x="${x0 + 4}" y="${y}" width="${x1 - x0 - 8}" height="5" fill="url(#gWood)"/>`).join('') +
      (d ? [64, 104, 144].map((y) => books(x0 + 8, y, 10)).join('') : cobweb(x0, 24, 0.7))).join(''),
  rug: (d) =>
    d
      ? `<path d="M90 196 L270 196 L292 236 L68 236 Z" fill="url(#gCarpet)" ${O}/><path d="M100 202 L260 202 L276 230 L84 230 Z" fill="none" stroke="#f6e3b0" stroke-width="1.6"/>` +
        `<rect x="74" y="168" width="34" height="30" rx="10" fill="url(#gNavy)" ${O}/><rect x="252" y="168" width="34" height="30" rx="10" fill="url(#gCarpet)" ${O}/>`
      : `<rect x="250" y="200" width="70" height="22" rx="11" fill="url(#gCarpet)" ${O} transform="rotate(-8 285 211)"/>`,
  lamp: (d) =>
    `<path d="M236 236 V150" ${O} stroke-width="4"/><path d="M222 150 L250 150 L244 128 L228 128 Z" fill="${d ? 'url(#gYellow)' : '#9a9a8a'}" ${O}/>` + (d ? glow(236, 150, 40, 0.6) : ''),
  hafez: (d) =>
    d
      ? `<path d="M160 214 L180 176 L200 214" fill="none" ${O} stroke="url(#gWoodDark)" stroke-width="4"/><path d="M150 178 L180 170 L210 178 L204 160 L180 166 L156 160 Z" fill="#fffdf6" ${O}/>` +
        `<path d="M180 166 V170" ${THIN}/><path d="M162 168 h12 M186 168 h12" stroke="#7a5a44" stroke-width="1"/>` + sparkle(214, 150, 5)
      : '',
  globe: (d) =>
    d
      ? `<rect x="120" y="190" width="30" height="6" rx="2" fill="url(#gWoodDark)" ${THIN}/><path d="M135 190 V180" ${O}/><circle cx="135" cy="168" r="14" fill="url(#gSky)" ${O}/>` +
        `<path d="M126 162 q6 -4 10 2 q4 6 10 2 M128 174 q6 2 10 -2" fill="none" stroke="#3fae5a" stroke-width="3" stroke-linecap="round"/><path d="M135 150 A18 18 0 0 1 135 186" fill="none" stroke="url(#gBrass)" stroke-width="2"/>`
      : '',
};

// ------------------------------------------------------------------ اتاق بچه

const NURSERY: Record<string, Layer> = {
  walls: (d) =>
    d
      ? `<rect width="360" height="170" fill="#cfe8c4"/>` + Array.from({ length: 14 }, (_, i) => `<path d="M${20 + (i % 7) * 50} ${30 + Math.floor(i / 7) * 60} l3 7 l7 1 l-5 5 l1 7 l-6 -4 l-6 4 l1 -7 l-5 -5 l7 -1 Z" fill="#fff" opacity=".7"/>`).join('')
      : `<rect width="360" height="170" fill="#b8b0a4"/>` + [[40, 30, 50], [200, 60, 70], [290, 20, 40]].map(([x, y, w]) => `<path d="M${x} ${y} l${w} 6 l-10 24 l-${w - 20} -4 Z" fill="#d8d0c4" opacity=".8"/>`).join(''),
  curtain: (d) =>
    `<rect x="24" y="30" width="90" height="100" rx="4" fill="url(#gSky)" ${O}/><path d="M69 30 V130 M24 80 H114" ${THIN}/>` +
    (d
      ? `<path d="M18 24 Q30 80 22 136 L44 136 Q40 80 48 24 Z M120 24 Q108 80 116 136 L94 136 Q98 80 90 24 Z" fill="#fffdf6" ${O}/>` +
        [[32, 50], [30, 90], [108, 60], [106, 104]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="url(#gRose)"/><circle cx="${x + 5}" cy="${y + 4}" r="2.4" fill="url(#gLeaf)"/>`).join('') +
        `<path d="M14 22 H124" ${O} stroke-width="4"/>`
      : `<path d="M22 24 L44 24 L36 100 Z" fill="#c9b9a0" ${O}/>`),
  cradle: (d) => (d ? cradle(220, 186, 1, 'url(#gLeaf)') : `<rect x="190" y="190" width="50" height="34" fill="#c9a26b" ${O}/><path d="M190 200 h50" ${THIN}/>`),
  mobile: (d) =>
    d
      ? `<path d="M220 0 V40 M196 40 H244" ${THIN}/>` +
        [[196, 'moon'], [220, 'star'], [244, 'fish']].map(([x, k]) => {
          const xx = Number(x);
          const shape = k === 'moon' ? `<path d="M${xx + 4} 58 a9 9 0 1 1 -1 -16 a7 7 0 1 0 1 16 Z" fill="url(#gYellow)" ${THIN}/>`
            : k === 'star' ? `<path d="M${xx} 44 l3 7 l7 1 l-5 5 l1 7 l-6 -4 l-6 4 l1 -7 l-5 -5 l7 -1 Z" fill="url(#gGold)" ${THIN}/>`
              : `<path d="M${xx - 8} 52 c4 -6 12 -6 16 0 c-4 6 -12 6 -16 0 Z M${xx - 8} 52 l-5 -4 v8 Z" fill="url(#gOrange)" ${THIN}/>`;
          return `<path d="M${xx} 40 V44" ${THIN}/>` + shape;
        }).join('')
      : '',
  lamp: (d) =>
    d
      ? `<rect x="292" y="176" width="40" height="40" rx="4" fill="url(#gWood)" ${O}/>` + glow(312, 158, 40, 0.8) +
        `<path d="M318 168 a13 13 0 1 1 -2 -26 a10 10 0 1 0 2 26 Z" fill="url(#gYellow)" ${O}/>` + geranium(338, 236, 0.6)
      : darkness(0.32),
};

// ------------------------------------------------------------------ جشن نام‌گذاری

const NAMING: Record<string, Layer> = {
  tables: (d) =>
    d
      ? [[40, 160], [250, 160]].map(([x, y]) => `<rect x="${x}" y="${y}" width="80" height="10" rx="2" fill="#fffdf6" ${O}/><path d="M${x} ${y + 10} L${x + 4} ${y + 26} M${x + 80} ${y + 10} L${x + 76} ${y + 26}" fill="#fffdf6" ${THIN}/>` +
        `<path d="M${x + 6} ${y + 10} V${y + 50} M${x + 74} ${y + 10} V${y + 50}" ${O} stroke-width="3"/>`).join('')
      : [60, 80, 100].map((y, i) => `<rect x="${40 + i * 6}" y="${150 + i * 12}" width="40" height="8" rx="2" fill="#a99aa0" ${THIN} transform="rotate(${i * 6 - 6} 60 ${y + 100})"/>`).join(''),
  sofreh: (d) =>
    d
      ? [[48, 152], [258, 152]].map(([x, y], k) =>
        `<ellipse cx="${x + 14}" cy="${y}" rx="12" ry="4" fill="url(#gCream)" ${THIN}/>` + [0, 1, 2].map((i) => `<circle cx="${x + 8 + i * 6}" cy="${y - 4}" r="3" fill="${['#f6c945', '#ff9ec4', '#fffdf6'][i]}" ${THIN} stroke-width=".8"/>`).join('') +
        `<path d="M${x + 40} ${y + 6} L${x + 44} ${y - 18} L${x + 56} ${y - 18} L${x + 60} ${y + 6} Z" fill="url(#gGlass)" ${THIN}/><rect x="${x + 43}" y="${y - 8}" width="14" height="12" fill="${k ? '#ff9ec4' : '#9be36b'}" opacity=".8"/>`).join('')
      : '',
  lights: (d) => (d ? stringLights(20) + lantern(30, 30) + lantern(330, 30) + sparkle(180, 30, 6) : darkness(0.35)),
  esfand: (d) =>
    d
      ? `<path d="M164 216 Q180 226 196 216 L192 206 L168 206 Z" fill="url(#gBrass)" ${O}/><path d="M172 206 L172 196 M188 206 L188 196" ${THIN}/>` +
        `<path d="M170 196 Q160 180 172 168 Q184 156 174 140 M184 194 Q194 180 186 166 Q178 152 190 138" fill="none" stroke="#e8e8e8" stroke-width="4" stroke-linecap="round" opacity=".8" class="steam"/>` +
        `<circle cx="174" cy="204" r="2" fill="#e0303f"/><circle cx="182" cy="203" r="2" fill="#ff9f43"/>`
      : '',
  cradle: (d) =>
    d
      ? glow(180, 140, 60, 0.6) + cradle(180, 156, 0.8, 'url(#gGold)') +
        `<path d="M136 120 Q180 96 224 120" fill="none" stroke="url(#gLeaf)" stroke-width="4"/>` + [148, 166, 194, 212].map((x) => `<circle cx="${x}" cy="${110 - Math.sin(((x - 136) / 88) * Math.PI) * 12}" r="5" fill="url(#gRose)" ${THIN} stroke-width="1"/>`).join('') +
        sparkle(130, 100, 6) + sparkle(232, 96, 6)
      : '',
};

export const SCENES4: Record<string, SceneDef> = {
  grocery: { base: wall('#f2e8d0') + floor('#9a8a72'), order: ['shelves', 'fridge', 'scale', 'sacks', 'sign'], layers: GROCERY },
  sismooni: { base: pastel(), order: ['clothes', 'window', 'toys', 'cradle', 'sign'], layers: SISMOONI },
  library: { base: orosiBase(), order: ['shelves', 'rug', 'lamp', 'globe', 'hafez'], layers: LIBRARY },
  nursery: { base: `<rect width="360" height="240" fill="#b8b0a4"/>` + floor('#c9a882'), order: ['walls', 'curtain', 'cradle', 'mobile', 'lamp'], layers: NURSERY },
  naming: { base: courtyard(), order: ['tables', 'sofreh', 'lights', 'esfand', 'cradle'], layers: NAMING },
};
