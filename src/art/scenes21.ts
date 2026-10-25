// Season 21 («کوچه‌ی بغلی») place scenes. Same contract as scenes.ts: each task layer is drawn
// "before" until done, then "after".

import { INK, O, THIN, estekan, sparkle } from './kit';
import { HERBS } from './chainsW';
import { Layer, SceneDef, boardedDoor, cobweb, dustPile, floor, glow, latticeDoor, plank, stringLights } from './scenes';
import { darkness, text } from './scenes3';

/** A chain drawing (100×100) placed with its bottom centre on (x, base), without its backdrop disc. */
const art = (src: string, x: number, base: number, s: number) =>
  `<g transform="translate(${x - 50 * s} ${base - 90 * s}) scale(${s})">${src.replace(/^<circle cx="50" cy="5\d" r="4\d"[^>]*\/>/, '')}</g>`;

/** An acacia tree; in bloom it carries white hanging blossom. */
const acacia = (x: number, base: number, s: number, bloom: boolean) =>
  `<path d="M${x} ${base} C${x - 3 * s} ${base - 30 * s} ${x + 4 * s} ${base - 50 * s} ${x} ${base - 70 * s}" fill="none" stroke="#6b4a2a" stroke-width="${6 * s}" stroke-linecap="round"/>` +
  (bloom
    ? [[-18, -76, 20], [14, -80, 22], [-2, -96, 20], [20, -60, 14], [-22, -58, 14]].map(([dx, dy, r]) => `<circle cx="${x + dx * s}" cy="${base + dy * s}" r="${r * s}" fill="url(#gLeaf)" ${THIN}/>`).join('') +
      Array.from({ length: 9 }, (_, i) => `<path d="M${x + (-20 + i * 5) * s} ${base + (-70 - (i % 3) * 10) * s} q${-2 * s} ${6 * s} 0 ${12 * s}" fill="none" stroke="#fffdf6" stroke-width="${4 * s}" stroke-linecap="round"/>`).join('')
    : `<path d="M${x} ${base - 70 * s} l${-18 * s} ${-14 * s} M${x} ${base - 60 * s} l${16 * s} ${-16 * s} M${x} ${base - 46 * s} l${-14 * s} ${-8 * s}" stroke="#6b4a2a" stroke-width="${3 * s}" stroke-linecap="round"/>`);

const sideAlley = () =>
  `<rect width="360" height="240" fill="url(#gSky)"/>` +
  `<rect x="120" y="70" width="120" height="124" fill="#d8b48a" ${THIN}/>` +
  `<path d="M0 20 L120 66 V194 L0 240 Z" fill="#e0b07a" ${O}/><path d="M360 20 L240 66 V194 L360 240 Z" fill="#e0b07a" ${O}/>` +
  `<path d="M120 194 H240 L360 240 H0 Z" fill="#c9b89a"/>`;

// ------------------------------------------------------------------ کوچه‌ی اقاقیا

const ACACIA: Record<string, Layer> = {
  stream: (d) =>
    `<path d="M236 194 L250 194 L356 236 L330 240 Z" fill="${d ? 'url(#gWater)' : '#8a7a6a'}" ${THIN}/>` + (d ? `<path d="M262 206 l12 5 M296 220 l14 6" stroke="#fff" stroke-width="1.4"/>` : ''),
  doors: (d) =>
    d ? latticeDoor(30, 110, 40, 90) + latticeDoor(290, 110, 40, 90) + latticeDoor(164, 130, 32, 64)
      : boardedDoor(30, 110, 40, 90) + boardedDoor(290, 110, 40, 90) + boardedDoor(164, 130, 32, 64),
  trees: (d) => acacia(96, 210, 0.9, d) + acacia(266, 212, 0.95, d) + acacia(180, 160, 0.5, d),
  sign: (d) =>
    d ? `<path d="M76 92 L112 100 V118 L76 110 Z" fill="url(#gBlue)" ${O}/>` + text(94, 108, 'اقاقیا', 7, '#fffdf6') + sparkle(116, 92, 4)
      : `<path d="M76 92 L112 100 V118 L76 110 Z" fill="#9aa4b0" ${O}/>`,
  bench: (d) =>
    d ? `<rect x="214" y="214" width="70" height="8" rx="3" fill="url(#gWood)" ${O}/><path d="M222 222 V234 M276 222 V234" ${O} stroke-width="4"/><rect x="214" y="200" width="70" height="6" rx="3" fill="url(#gWoodDark)" ${THIN}/>`
      : plank(214, 226, 70, 8),
};

// ------------------------------------------------------------------ عطاری صبوری

const shopBase = () => `<rect width="360" height="172" fill="#efe3cc"/>` + floor('#a5703e', 172);

const ATTARI: Record<string, Layer> = {
  jars: (d) => (d ? art(HERBS[6], 120, 166, 1.45) + art(HERBS[6], 250, 166, 1.45) : `<rect x="70" y="30" width="230" height="136" fill="#7a5a3a" ${O}/>` + cobweb(70, 30, 0.8) + dustPile(180, 164)),
  sacks: (d) => (d ? art(HERBS[3], 60, 230, 0.6) + art(HERBS[3], 100, 236, 0.55) + art(HERBS[3], 320, 232, 0.58) : `<path d="M40 232 C36 210 60 206 70 232 Z" fill="#9a8a76" ${THIN}/>`),
  scale: (d) =>
    `<rect x="130" y="178" width="140" height="12" rx="2" fill="url(#gWood)" ${O}/><path d="M140 190 V230 M260 190 V230" ${O} stroke-width="4"/>` +
    (d ? `<path d="M200 178 V146" ${O} stroke-width="3"/><path d="M176 148 H224" ${O} stroke-width="2.4"/>` +
        [176, 224].map((x) => `<path d="M${x} 148 L${x - 10} 164 M${x} 148 L${x + 10} 164" stroke="${INK}" stroke-width="1"/><path d="M${x - 12} 164 Q${x} 172 ${x + 12} 164 Z" fill="url(#gBrass)" ${THIN}/>`).join('')
      : ''),
  mortar: (d) => (d ? art(HERBS[4], 156, 178, 0.32) + art(HERBS[5], 250, 178, 0.3) : ''),
  sign: (d) =>
    d ? `<rect x="120" y="4" width="120" height="24" rx="4" fill="url(#gLeafDark)" ${O}/>` + text(180, 21, 'عطاری صبوری', 11, '#fff6d0') + glow(180, 16, 30, 0.3)
      : `<rect x="128" y="8" width="104" height="20" rx="4" fill="#8a8a80" ${THIN} transform="rotate(5 180 18)"/>`,
};

// ------------------------------------------------------------------ خونه‌ی شماره‌ی هفت

const houseBase = () =>
  `<rect width="360" height="120" fill="url(#gSky)"/><rect x="40" y="60" width="280" height="110" fill="#e0b07a" ${O}/>` +
  `<rect y="166" width="360" height="74" fill="#c9a27a"/><path d="M0 166 H360" stroke="${INK}" stroke-width="2" opacity=".3"/>`;

const HOUSE7: Record<string, Layer> = {
  roof: (d) =>
    d ? `<rect x="32" y="52" width="296" height="12" rx="2" fill="#c99a62" ${O}/>` + Array.from({ length: 18 }, (_, i) => `<path d="M${40 + i * 16} 58 l5 1" stroke="#f2d48a" stroke-width="1.2"/>`).join('')
      : `<path d="M32 60 L90 52 L120 62 L200 50 L260 64 L328 56 V64 H32 Z" fill="#a8906a" ${THIN}/>`,
  windows: (d) =>
    [80, 248].map((x) => d
      ? `<rect x="${x}" y="84" width="40" height="46" rx="4" fill="url(#gSky)" ${O}/><path d="M${x + 20} 84 V130 M${x} 106 H${x + 40}" stroke="#3a76c4" stroke-width="4"/><rect x="${x}" y="84" width="40" height="46" rx="4" fill="none" stroke="#3a76c4" stroke-width="5"/>`
      : `<rect x="${x}" y="84" width="40" height="46" rx="4" fill="#7a6a5a" ${O}/>` + plank(x - 4, 100, 48, 12)).join('') +
    `<path d="M162 168 V104 Q162 88 180 88 Q198 88 198 104 V168 Z" fill="url(#gWoodDark)" ${O}/>`,
  yard: (d) =>
    `<path d="M300 236 C298 214 304 200 300 184" fill="none" stroke="#6b4a2a" stroke-width="5" stroke-linecap="round"/>` +
    (d ? [[288, 182, 16], [312, 176, 16], [300, 164, 14]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gLeaf)" ${THIN}/>`).join('') + [[286, 178], [310, 172], [302, 162]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.4" fill="#e0303f" ${THIN} stroke-width=".8"/>`).join('')
      : dustPile(300, 236)),
  pool: (d) =>
    `<path d="M110 206 L128 194 H232 L250 206 L232 218 H128 Z" fill="url(#gTurq)" ${O}/>` +
    (d ? `<path d="M120 206 L134 198 H226 L240 206 L226 214 H134 Z" fill="url(#gWater)" ${THIN}/>` + [[160, 204], [196, 208]].map(([x, y]) => `<path d="M${x - 5} ${y} q5 -4 10 0 l4 -3 v6 l-4 -3 q-5 4 -10 0 Z" fill="#f07b1d" ${THIN} stroke-width=".6"/>`).join('')
      : `<path d="M120 206 L134 198 H226 L240 206 L226 214 H134 Z" fill="#a89070" ${THIN}/>`),
  key: (d) =>
    d ? `<circle cx="188" cy="136" r="5" fill="none" stroke="url(#gGold)" stroke-width="3"/><path d="M188 141 V154 M188 148 h4 M188 152 h4" stroke="#d9a63a" stroke-width="2.4"/><path d="M184 132 q-12 -12 -20 -4" fill="none" stroke="#e0303f" stroke-width="2"/>` + sparkle(204, 124, 6) + glow(188, 140, 20, 0.6)
      : '',
};

// ------------------------------------------------------------------ دالون دو کوچه

const dalanBase = () =>
  `<rect width="360" height="240" fill="#4a3022"/>` + `<path d="M0 0 H360 V60 Q180 -10 0 60 Z" fill="#3a2418"/>` +
  `<path d="M0 60 L120 92 V190 L0 240 Z M360 60 L240 92 V190 L360 240 Z" fill="#8a5a32" ${O}/>` + `<path d="M120 190 H240 L360 240 H0 Z" fill="#6a4a3a"/>`;

const DALAN_END = 'M126 190 V116 Q126 92 180 92 Q234 92 234 116 V190 Z';

const PASSAGE: Record<string, Layer> = {
  wall: (d) =>
    d ? `<path d="${DALAN_END}" fill="url(#gSky)"/><path d="M126 190 V166 H234 V190 Z" fill="#c9b89a"/>` + acacia(206, 170, 0.5, true) + `<path d="M150 170 C148 150 156 140 152 124" fill="none" stroke="#5a3a22" stroke-width="5"/><circle cx="152" cy="120" r="16" fill="url(#gLeafDark)" ${THIN}/>`
      : `<path d="${DALAN_END}" fill="#b5804d" ${O}/>` + Array.from({ length: 7 }, (_, i) => `<path d="M126 ${104 + i * 12} H234" stroke="#8a5a32" stroke-width="1.4"/>`).join(''),
  vault: (d) =>
    [60, 92].map((y, i) => `<path d="M${i ? 120 : 40} ${i ? 190 : 216} V${y + 40} Q${i ? 120 : 40} ${y} 180 ${y - (i ? 6 : 20)} Q${i ? 240 : 320} ${y} ${i ? 240 : 320} ${y + 40} V${i ? 190 : 216}" fill="none" stroke="${d ? '#c98a52' : '#7a5a3a'}" stroke-width="${i ? 6 : 10}"/>`).join('') +
    (d ? '' : `<path d="M90 80 l20 30 M270 90 l-14 24" stroke="${INK}" stroke-width="1.6"/>`),
  lamps: (d) => [[64, 110], [296, 110], [140, 120], [220, 120]].map(([x, y], i) => `<path d="M${x} ${y - 14} V${y}" stroke="${INK}" stroke-width="1.2"/><path d="M${x - 5} ${y} H${x + 5} L${x + 4} ${y + 10} H${x - 4} Z" fill="${d ? '#ffe7a0' : '#6a6a6a'}" ${THIN} stroke-width="1"/>` + (d ? glow(x, y + 6, i < 2 ? 26 : 16, 0.6) : '')).join('') + (d ? '' : darkness(0.3)),
  tiles: (d) =>
    d ? [[20, 140, 'url(#gTurq)'], [300, 140, 'url(#gTurq)']].map(([x, y, c]) => `<rect x="${x}" y="${y}" width="40" height="34" fill="${c}" ${O}/>` + `<path d="M${Number(x) + 6} ${Number(y) + 28} q14 -20 28 0" fill="#fffdf6" opacity=".8"/><circle cx="${Number(x) + 20}" cy="${Number(y) + 12}" r="4" fill="#fffdf6"/>`).join('')
      : `<rect x="20" y="140" width="40" height="34" fill="#c9c0b0" ${THIN}/><rect x="300" y="140" width="40" height="34" fill="#c9c0b0" ${THIN}/>`,
  benches: (d) =>
    d ? [[44, 210], [262, 210]].map(([x, y]) => `<rect x="${x}" y="${y}" width="54" height="8" rx="3" fill="url(#gWood)" ${O}/><path d="M${x + 6} ${y + 8} V${y + 22} M${x + 48} ${y + 8} V${y + 22}" ${O} stroke-width="3"/>`).join('')
      : plank(50, 220, 60, 6) + dustPile(180, 220),
};

// ------------------------------------------------------------------ جشن دو کوچه

const festBase = () => sideAlley() + `<path d="${DALAN_END}" fill="#8a5a32" ${O}/><path d="M138 190 V120 Q138 104 180 104 Q222 104 222 120 V190 Z" fill="url(#gSky)"/>` + latticeDoor(30, 110, 40, 90) + latticeDoor(290, 110, 40, 90);

const TWOFEST: Record<string, Layer> = {
  lights: (d) => (d ? stringLights(40, ['#ffd36b', '#ff7a9c', '#5fe0e0', '#9be36b']) + stringLights(70, ['#fff6d0', '#ffd36b', '#ff7a9c', '#5fe0e0']) : ''),
  mulberry: (d) =>
    `<path d="M80 226 C76 190 84 170 78 140" fill="none" stroke="#5a3a22" stroke-width="7" stroke-linecap="round"/>` +
    [[60, 136, 26], [96, 128, 28], [78, 110, 24]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gLeafDark)" ${THIN}/>`).join('') +
    (d ? Array.from({ length: 10 }, (_, i) => `<ellipse cx="${56 + (i * 13) % 50}" cy="${116 + (i * 17) % 36}" rx="2" ry="3" fill="#5a1a4a"/>`).join('') + `<path d="M24 212 H150 L162 234 H12 Z" fill="#fffdf6" ${O}/>` +
        [[44, 220], [74, 224], [104, 220], [130, 226]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="10" ry="3" fill="${['url(#gSilver)', 'url(#gBrass)'][i % 2]}" ${THIN} stroke-width="1"/>`).join('') + estekan(60, 222, 0.18, true, false) + estekan(118, 224, 0.18, true, false) : ''),
  sherbet: (d) =>
    `<rect x="236" y="196" width="90" height="8" rx="2" fill="url(#gWood)" ${O}/><path d="M242 204 V230 M320 204 V230" ${O} stroke-width="3"/>` +
    (d ? [[252, '#ff9ec4'], [276, '#c8e6c9'], [300, '#f6e0a0']].map(([x, c]) => `<path d="M${Number(x) - 7} 196 V178 Q${x} 172 ${Number(x) + 7} 178 V196 Z" fill="url(#gGlass)" ${THIN}/><rect x="${Number(x) - 6}" y="182" width="12" height="13" fill="${c}" opacity=".8"/>`).join('') + estekan(318, 194, 0.2, true, false) : ''),
  music: (d) =>
    d ? `<g transform="translate(196 222) rotate(-24)"><path d="M-6 0 C-10 -4 -10 -10 -4 -12 C-1 -9 1 -9 4 -12 C10 -10 10 -4 6 0 C10 4 8 12 0 12 C-8 12 -10 4 -6 0 Z" fill="url(#gWood)" ${THIN}/><path d="M0 -10 V-34" ${O} stroke-width="2"/></g>` +
        `<path d="M214 180 v-10 l7 -3 v10" fill="none" stroke="#5e3418" stroke-width="1.6"/><circle cx="212" cy="180" r="2.4" fill="#5e3418"/><circle cx="219" cy="177" r="2.4" fill="#5e3418"/>`
      : '',
  photo: (d) =>
    d ? `<path d="M170 238 L180 204 L190 238 M180 204 V238" fill="none" stroke="#3a3a44" stroke-width="2"/><rect x="168" y="190" width="24" height="16" rx="3" fill="#2a2a2a" ${THIN}/><circle cx="176" cy="198" r="4" fill="#7f8a99"/>` + sparkle(198, 184, 5) : '',
};

export const SCENES21: Record<string, SceneDef> = {
  acacia: { base: sideAlley(), order: ['stream', 'doors', 'trees', 'sign', 'bench'], layers: ACACIA },
  attari: { base: shopBase(), order: ['jars', 'scale', 'mortar', 'sacks', 'sign'], layers: ATTARI },
  house7: { base: houseBase(), order: ['roof', 'windows', 'yard', 'pool', 'key'], layers: HOUSE7 },
  passage: { base: dalanBase(), order: ['wall', 'vault', 'tiles', 'benches', 'lamps'], layers: PASSAGE },
  twofest: { base: festBase(), order: ['mulberry', 'sherbet', 'music', 'photo', 'lights'], layers: TWOFEST },
};
