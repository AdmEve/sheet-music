// Season 2 («عروسی») place scenes. Same contract as scenes.ts: each task layer is drawn
// "before" until done, then "after".

import { GEN_SWEETS, SWEETS } from './chainsD';
import { INK, O, THIN, estekan, g, samovar, sparkle } from './kit';
import { Layer, SceneDef, floor, glow, plank, stringLights, takht } from './scenes';

const plaster = (fill = '#f2e2c4', h = 170) =>
  `<rect width="360" height="${h}" fill="${fill}"/>` +
  `<path d="M0 ${h - 18} H360" stroke="#d9c39a" stroke-width="10"/>`;

const archWindow = (x: number, y: number, w: number, hgt: number, glass = 'url(#gSky)') =>
  `<path d="M${x} ${y + hgt} V${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} V${y + hgt} Z" fill="${glass}" ${O}/>` +
  `<path d="M${x + w / 2} ${y + 4} V${y + hgt} M${x} ${y + hgt * 0.62} H${x + w}" ${THIN}/>`;

const niche = (x: number, y: number, w: number, hgt: number) =>
  `<path d="M${x} ${y + hgt} V${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} V${y + hgt} Z" fill="#d9c39a" ${THIN}/>`;

const carpetRect = (x: number, y: number, w: number, hgt: number) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${hgt}" rx="3" fill="url(#gNavy)" ${O}/>` +
  `<rect x="${x + 6}" y="${y + 5}" width="${w - 12}" height="${hgt - 10}" fill="url(#gCarpet)" stroke="#f6e3b0" stroke-width="1.4"/>` +
  `<path d="M${x + w / 2} ${y + 8} L${x + w - 22} ${y + hgt / 2} L${x + w / 2} ${y + hgt - 8} L${x + 22} ${y + hgt / 2} Z" fill="url(#gNavy)" stroke="#f6e3b0" stroke-width="1.4"/>` +
  `<circle cx="${x + w / 2}" cy="${y + hgt / 2}" r="${hgt / 7}" fill="url(#gGold)" ${THIN}/>`;

const darkness = (op = 0.28) => `<rect width="360" height="240" fill="#1c1430" opacity="${op}"/>`;
const art = (inner: string, x: number, y: number, s: number) => g(inner, `translate(${x} ${y}) scale(${s})`);

// ------------------------------------------------------------------ خواستگاری

const KHASTEGARI: Record<string, Layer> = {
  curtain: (d) =>
    d
      ? [62, 298].map((cx) => `<path d="M${cx - 34} 18 Q${cx - 30} 80 ${cx - 40} 150 L${cx - 18} 150 Q${cx - 14} 80 ${cx - 6} 18 Z M${cx + 34} 18 Q${cx + 30} 80 ${cx + 40} 150 L${cx + 18} 150 Q${cx + 14} 80 ${cx + 6} 18 Z" fill="url(#gCarpet)" ${O}/>`).join('') +
        `<path d="M10 16 H350" ${O} stroke="url(#gGold)" stroke-width="5"/>`
      : `<path d="M30 18 L40 120 L52 18 Z M310 18 L300 90 L292 18 Z" fill="#a9a59c" ${O} opacity=".8"/>`,
  carpet: (d) =>
    d ? carpetRect(60, 176, 240, 56) : `<g transform="rotate(-6 320 200)"><rect x="276" y="184" width="70" height="24" rx="12" fill="url(#gCarpet)" ${O}/><ellipse cx="346" cy="196" rx="6" ry="12" fill="#7d1622" ${THIN}/></g>`,
  fruit: (d) =>
    d
      ? `<rect x="120" y="168" width="120" height="10" rx="3" fill="url(#gWoodDark)" ${O}/><path d="M130 178 V196 M230 178 V196" ${O} stroke-width="4"/>` +
        `<ellipse cx="160" cy="160" rx="24" ry="8" fill="url(#gCream)" ${O}/>` +
        [[150, 150, 'url(#gRed)'], [164, 146, 'url(#gYellow)'], [176, 152, 'url(#gRed)'], [158, 140, 'url(#gLeaf)']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="8" fill="${c}" ${THIN}/>`).join('') +
        art(SWEETS[4], 188, 128, 0.5)
      : [130, 220].map((x) => `<rect x="${x}" y="180" width="34" height="26" fill="#c9a26b" ${O}/><path d="M${x} 186 h34" ${THIN}/>`).join(''),
  tea: (d) =>
    d ? glow(306, 140, 40, 0.5) + art(samovar('url(#gBrass)'), 268, 96, 0.72) + art(estekan(0, 0, 1, true), 222, 160, 0.4) + art(estekan(0, 0, 1, true), 242, 162, 0.4) : '',
  flowers: (d) =>
    d
      ? niche(160, 40, 40, 70) + glow(180, 90, 46, 0.6) + `<path d="M172 108 L188 108 L184 80 L176 80 Z" fill="url(#gTurq)" ${O}/>` +
        [[172, 70], [180, 64], [188, 70], [176, 76], [185, 77]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.5" fill="url(#gRoseDeep)" ${THIN}/>`).join('') + sparkle(210, 50, 6)
      : niche(160, 40, 40, 70) + `<path d="M176 108 L184 108 L182 90 L178 90 Z" fill="#a9a59c" ${THIN}/><path d="M180 90 l-6 -14 M180 90 l5 -16" stroke="#8a7a5a" stroke-width="2"/>`,
};

// ------------------------------------------------------------------ قنادی

const tiles = () => {
  let s = `<rect width="360" height="170" fill="#fdfaf3"/>`;
  for (let x = 0; x < 360; x += 24) s += `<path d="M${x} 0 V170" stroke="#e3dccd" stroke-width="1.2"/>`;
  for (let y = 0; y < 170; y += 24) s += `<path d="M0 ${y} H360" stroke="#e3dccd" stroke-width="1.2"/>`;
  return s + `<rect y="90" width="360" height="8" fill="#14879a" opacity=".6"/>`;
};

const jar = (x: number, y: number, fill: string) =>
  `<rect x="${x - 9}" y="${y - 18}" width="18" height="22" rx="4" fill="url(#gGlass)" ${THIN}/><rect x="${x - 7}" y="${y - 10}" width="14" height="12" rx="2" fill="${fill}"/><rect x="${x - 10}" y="${y - 22}" width="20" height="5" rx="2" fill="url(#gCopper)" ${THIN}/>`;

const SWEETSHOP: Record<string, Layer> = {
  sign: (d) =>
    d
      ? `<rect x="100" y="6" width="160" height="32" rx="8" fill="url(#gRoseDeep)" ${O}/><text x="180" y="28" text-anchor="middle" font-family="Vazirmatn, sans-serif" font-weight="900" font-size="17" fill="#fff">قنادی محله</text>`
      : `<g transform="rotate(-7 180 22)"><rect x="100" y="6" width="160" height="32" rx="8" fill="#8a7a7a" ${O}/><text x="180" y="28" text-anchor="middle" font-family="Vazirmatn, sans-serif" font-weight="900" font-size="15" fill="#c8bcbc">قنـ… محـ…</text></g>`,
  shelves: (d) =>
    `<rect x="16" y="46" width="96" height="6" fill="url(#gWood)" ${THIN}/><rect x="16" y="84" width="96" height="6" fill="url(#gWood)" ${THIN}/>` +
    (d ? jar(30, 46, '#fffdf6') + jar(54, 46, '#ffd36b') + jar(78, 46, '#ff9ec4') + jar(100, 46, '#9be36b') + jar(34, 84, '#e7a512') + jar(62, 84, '#fffdf6') + jar(90, 84, '#c58bff')
      : `<path d="M20 44 q20 -6 40 0 M60 82 q20 -6 40 0" stroke="#f4f0e6" stroke-width="1.2" fill="none"/>`),
  oven: (d) => (d ? glow(300, 90, 46, 0.6) + art(GEN_SWEETS[1], 254, 40, 0.92) : `<g style="filter:grayscale(1)" opacity=".7">${art(GEN_SWEETS[1], 254, 40, 0.92)}</g>`),
  counter: (d) =>
    `<rect x="40" y="150" width="200" height="56" rx="4" fill="url(#gWood)" ${O}/>` +
    (d
      ? `<rect x="48" y="118" width="184" height="36" rx="4" fill="url(#gGlass)" ${O}/>` + art(SWEETS[3], 52, 108, 0.42) + art(SWEETS[4], 100, 108, 0.42) + art(SWEETS[6], 148, 108, 0.42) + art(SWEETS[5], 194, 110, 0.4)
      : `<path d="M48 154 L60 120 L90 150 L110 124 L140 152" fill="none" stroke="#9aa" stroke-width="2"/>`),
  cake: (d) =>
    `<rect x="268" y="170" width="60" height="8" rx="3" fill="url(#gSilver)" ${O}/><path d="M298 178 V204 M286 204 h24" ${O} stroke="url(#gSilver)" stroke-width="5"/>` +
    (d ? glow(298, 140, 44, 0.7) + art(SWEETS[8], 262, 104, 0.72) + sparkle(338, 110, 6) : ''),
};

// ------------------------------------------------------------------ خیاطی

const wallpaper = () =>
  `<rect width="360" height="170" fill="#e8f1ec"/>` +
  Array.from({ length: 40 }, (_, i) => {
    const x = (i % 10) * 38 + ((Math.floor(i / 10) % 2) * 19) + 8, y = Math.floor(i / 10) * 42 + 18;
    return `<path d="M${x} ${y + 6} C${x - 6} ${y + 6} ${x - 6} ${y - 2} ${x - 1} ${y - 4} C${x} ${y - 7} ${x + 4} ${y - 6} ${x + 3} ${y - 10} C${x + 7} ${y - 4} ${x + 6} ${y + 6} ${x} ${y + 6} Z" fill="#b9d8c8"/>`;
  }).join('');

const TAILOR: Record<string, Layer> = {
  fabric: (d) =>
    `<rect x="240" y="30" width="110" height="6" fill="url(#gWood)" ${THIN}/><rect x="240" y="80" width="110" height="6" fill="url(#gWood)" ${THIN}/>` +
    (d
      ? ['url(#gRose)', 'url(#gTurq)', 'url(#gYellow)', 'url(#gCream)', 'url(#gPurple)'].map((c, i) => `<rect x="${246 + i * 20}" y="${i % 2 ? 52 : 56}" width="16" height="${i % 2 ? 28 : 24}" rx="7" fill="${c}" ${THIN}/>`).join('') +
        ['url(#gCarpet)', 'url(#gBlue)', 'url(#gLeaf)', 'url(#gCream)'].map((c, i) => `<rect x="${248 + i * 24}" y="8" width="18" height="22" rx="8" fill="${c}" ${THIN}/>`).join('')
      : ''),
  machine: (d) =>
    `<rect x="20" y="140" width="110" height="10" rx="3" fill="url(#gWoodDark)" ${O}/><path d="M30 150 V200 M120 150 V200" ${O} stroke-width="5"/>` +
    (d
      ? `<path d="M36 140 V108 Q36 98 46 98 H104 Q114 98 114 108 V118 H98 V112 H54 V140 Z" fill="#222" ${O}/><path d="M46 104 H104" stroke="url(#gGold)" stroke-width="3"/><circle cx="108" cy="126" r="9" fill="url(#gSteel)" ${THIN}/>` + sparkle(124, 98, 5)
      : `<path d="M30 140 C30 96 120 96 120 140 Z" fill="#fbf7ee" fill-opacity=".9" stroke="#c9b9a0" stroke-width="2"/>`),
  dress: (d) =>
    `<path d="M180 210 V198 M168 210 h24" ${O} stroke-width="4"/>` +
    (d
      ? glow(180, 120, 60, 0.45) +
        `<path d="M168 60 Q180 52 192 60 L196 92 L216 196 Q180 206 144 196 L164 92 Z" fill="#fffdf6" ${O}/>` +
        `<path d="M168 62 L150 120 L158 122 L172 74 M192 62 L210 120 L202 122 L188 74" fill="#fffdf6" ${THIN}/>` +
        `<path d="M164 92 Q180 100 196 92" fill="none" stroke="#d8c8a8" stroke-width="1.6"/>` +
        Array.from({ length: 7 }, (_, i) => `<circle cx="${156 + i * 8}" cy="${178 + (i % 2) * 6}" r="2" fill="#d8d0e8"/>`).join('') +
        `<path d="M170 46 Q180 30 190 46 L214 180 Q196 150 188 70 Q180 64 172 70 Q164 150 146 180 Z" fill="#ffffff" fill-opacity=".45" stroke="#e8e4f0" stroke-width="1.2"/>` +
        `<circle cx="180" cy="44" r="9" fill="#e9e1d4" ${THIN}/>`
      : `<path d="M170 60 Q180 52 190 60 L194 100 L180 110 L166 100 Z" fill="#c9b9a0" ${O}/><circle cx="180" cy="48" r="9" fill="#c9b9a0" ${THIN}/><path d="M180 110 V198" ${O} stroke-width="4"/>`),
  mirror: (d) =>
    d
      ? `<ellipse cx="290" cy="150" rx="30" ry="50" fill="url(#gSky)" ${O}/><ellipse cx="290" cy="150" rx="34" ry="54" fill="none" stroke="url(#gGold)" stroke-width="6"/><path d="M276 124 l14 -14 M274 140 l24 -24" stroke="#fff" stroke-width="3" opacity=".7"/>`
      : `<ellipse cx="290" cy="150" rx="30" ry="50" fill="#7a8a90" ${O}/><path d="M276 112 L300 190 M300 110 L280 196" stroke="${INK}" stroke-width="1.6"/>`,
  lights: (d) => (d ? stringLights(4, ['#ffd36b', '#ffffff', '#ff9ec4']) + `<rect width="360" height="240" fill="#ffe3a0" opacity=".1"/>` : darkness()),
};

// ------------------------------------------------------------------ سفره‌ی عقد

const candle = (x: number, y: number, lit: boolean) =>
  `<rect x="${x - 3}" y="${y - 22}" width="6" height="22" rx="2" fill="#fffdf6" ${THIN}/>` +
  (lit ? glow(x, y - 28, 14, 0.9) + `<path d="M${x} ${y - 34} C${x + 4} ${y - 28} ${x + 3} ${y - 24} ${x} ${y - 23} C${x - 3} ${y - 24} ${x - 4} ${y - 28} ${x} ${y - 34} Z" fill="url(#gFire)"/>` : '');

const candelabra = (x: number, y: number, lit: boolean) =>
  `<path d="M${x} ${y} V${y - 40} M${x - 18} ${y - 40} Q${x} ${y - 24} ${x + 18} ${y - 40}" fill="none" ${O} stroke="url(#gSilver)" stroke-width="4"/>` +
  `<ellipse cx="${x}" cy="${y}" rx="12" ry="4" fill="url(#gSilver)" ${THIN}/>` +
  candle(x - 18, y - 40, lit) + candle(x, y - 46, lit) + candle(x + 18, y - 40, lit);

const AGHD: Record<string, Layer> = {
  cloth: (d) =>
    d
      ? `<path d="M40 238 L80 176 L280 176 L320 238 Z" fill="url(#gCream)" ${O}/><path d="M52 232 L86 182 L274 182 L308 232 Z" fill="none" stroke="url(#gGold)" stroke-width="3"/>` +
        Array.from({ length: 6 }, (_, i) => `<path d="M${110 + i * 28} 196 C${104 + i * 28} 196 ${104 + i * 28} 188 ${109 + i * 28} 186 C${110 + i * 28} 183 ${114 + i * 28} 184 ${113 + i * 28} 180 C${117 + i * 28} 186 ${116 + i * 28} 196 ${110 + i * 28} 196 Z" fill="#c0392b" opacity=".8"/>`).join('')
      : '',
  mirror: (d) =>
    d
      ? `<path d="M150 150 V70 A30 30 0 0 1 210 70 V150 Z" fill="url(#gSky)" ${O}/><path d="M144 154 V68 A36 36 0 0 1 216 68 V154 Z" fill="none" stroke="url(#gGold)" stroke-width="7"/>` +
        `<path d="M160 90 l14 -14 M160 106 l24 -24" stroke="#fff" stroke-width="3" opacity=".7"/>` + candelabra(110, 170, false) + candelabra(250, 170, false)
      : `<path d="M150 150 V70 A30 30 0 0 1 210 70 V150 Z" fill="#fbf7ee" fill-opacity=".85" stroke="#c9b9a0" stroke-width="2"/>`,
  bread: (d) =>
    d
      ? `<path d="M130 186 C134 178 226 178 230 186 L232 202 C226 208 134 208 128 202 Z" fill="url(#gBread)" ${O}/>` +
        `<text x="180" y="200" text-anchor="middle" font-family="Vazirmatn, sans-serif" font-weight="900" font-size="13" fill="#c0392b">مبارک باد</text>`
      : '',
  sweets: (d) =>
    d
      ? art(SWEETS[1], 64, 172, 0.42) + art(SWEETS[0], 256, 172, 0.42) +
        `<rect x="96" y="210" width="20" height="20" rx="5" fill="url(#gYellow)" ${O}/><rect x="94" y="206" width="24" height="6" rx="2" fill="url(#gGold)" ${THIN}/>` +
        `<path d="M244 214 l4 -24 M250 216 l2 -26 M256 214 l-1 -24" stroke="#e7a512" stroke-width="4" stroke-linecap="round"/>`
      : '',
  candles: (d) =>
    d
      ? candelabra(110, 170, true) + candelabra(250, 170, true) +
        [[60, 150], [300, 150], [40, 200], [320, 200]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="url(#gRoseDeep)" ${THIN}/>`).join('') + sparkle(180, 30, 8)
      : darkness(0.35),
};

// ------------------------------------------------------------------ جشن عروسی

const nightAlley = () =>
  `<rect width="360" height="240" fill="#1b2350"/>` +
  Array.from({ length: 20 }, (_, i) => `<circle cx="${(i * 71) % 360}" cy="${(i * 37) % 70 + 6}" r="1.2" fill="#fff" opacity=".8"/>`).join('') +
  `<path d="M0 240 V80 H70 V60 H120 V90 H170 V70 H190 V90 H240 V56 H300 V84 H360 V240 Z" fill="#3a2f4a" ${O}/>` +
  [[20, 100], [86, 80], [136, 104], [254, 76], [316, 100]].map(([x, y]) => `<rect x="${x}" y="${y}" width="16" height="20" rx="2" fill="#ffd36b" opacity=".85"/>`).join('') +
  `<rect y="180" width="360" height="60" fill="#5a4a5a"/>`;

const WEDDING: Record<string, Layer> = {
  lights: (d) => (d ? stringLights(50, ['#ffd36b', '#ff7a9c', '#5fe0e0', '#fff']) + stringLights(70, ['#c58bff', '#ffd36b']) : ''),
  tables: (d) =>
    d
      ? [50, 300].map((x) => `<rect x="${x - 36}" y="186" width="72" height="12" rx="3" fill="#fffdf6" ${O}/><path d="M${x - 30} 198 V226 M${x + 30} 198 V226" ${O} stroke-width="4"/>` + art(SWEETS[7], x - 26, 158, 0.28) + art(SWEETS[2], x + 2, 160, 0.26)).join('')
      : plank(30, 220, 60, -10) + plank(280, 214, 60, 12),
  music: (d) =>
    d
      ? takht(130, 206, 100) +
        `<g transform="translate(150 150) rotate(-30)"><ellipse cx="0" cy="20" rx="12" ry="16" fill="url(#gWood)" ${O}/><rect x="-2" y="-40" width="4" height="48" fill="url(#gWoodDark)" ${THIN}/><rect x="-5" y="-48" width="10" height="10" rx="2" fill="url(#gWoodDark)" ${THIN}/></g>` +
        `<path d="M196 186 L214 186 L210 160 C220 150 220 140 205 140 C190 140 190 150 200 160 Z" fill="url(#gWood)" ${O}/><ellipse cx="205" cy="140" rx="15" ry="5" fill="url(#gCream)" ${THIN}/>`
      : '',
  arch: (d) =>
    d
      ? `<path d="M150 186 V110 A30 30 0 0 1 210 110 V186" fill="none" ${O} stroke="url(#gGold)" stroke-width="5"/>` +
        Array.from({ length: 14 }, (_, i) => {
          const a = Math.PI + (i / 13) * Math.PI;
          const x = 180 + Math.cos(a) * 32, y = 110 + Math.sin(a) * 32;
          return `<circle cx="${x}" cy="${y}" r="6" fill="${i % 2 ? 'url(#gRose)' : '#fffdf6'}" ${THIN}/>`;
        }).join('') +
        [130, 150, 170].map((y) => `<circle cx="146" cy="${y}" r="5" fill="url(#gRose)" ${THIN}/><circle cx="214" cy="${y}" r="5" fill="#fffdf6" ${THIN}/>`).join('')
      : `<path d="M150 186 V110 A30 30 0 0 1 210 110 V186" fill="none" stroke="#7a6a7a" stroke-width="4"/>`,
  fireworks: (d) =>
    d
      ? [[60, 34, '#ffd36b'], [290, 26, '#ff7a9c'], [180, 18, '#5fe0e0']].map(([x, y, c]) =>
          Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return `<path d="M${x} ${y} L${+x + Math.cos(a) * 22} ${+y + Math.sin(a) * 22}" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/><circle cx="${+x + Math.cos(a) * 25}" cy="${+y + Math.sin(a) * 25}" r="2" fill="${c}"/>`;
          }).join('')).join('')
      : '',
};

export const SCENES2: Record<string, SceneDef> = {
  khastegari: { base: plaster() + archWindow(40, 30, 50, 110) + archWindow(270, 30, 50, 110) + floor('#b98652'), order: ['curtain', 'carpet', 'fruit', 'tea', 'flowers'], layers: KHASTEGARI },
  sweetshop: { base: tiles() + floor('#d8c0a8'), order: ['shelves', 'oven', 'counter', 'cake', 'sign'], layers: SWEETSHOP },
  tailor: { base: wallpaper() + floor('#a98a6a'), order: ['fabric', 'mirror', 'machine', 'dress', 'lights'], layers: TAILOR },
  aghd: { base: plaster('#f6ead2', 176) + archWindow(30, 26, 56, 120, 'url(#gGreenTile)') + archWindow(274, 26, 56, 120, 'url(#gGreenTile)') + `<rect y="176" width="360" height="64" fill="#c9b48f"/>`, order: ['cloth', 'mirror', 'bread', 'sweets', 'candles'], layers: AGHD },
  wedding: { base: nightAlley(), order: ['lights', 'tables', 'arch', 'music', 'fireworks'], layers: WEDDING },
};
