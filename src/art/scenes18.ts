// Season 18 («زمستون برفی») place scenes. Same contract as scenes.ts: each task layer is drawn
// "before" until done, then "after".

import { INK, O, THIN, estekan, sparkle } from './kit';
import { WINTER } from './chainsT';
import { Layer, SceneDef, dustPile, floor, glow, lantern, plank, stringLights } from './scenes';
import { darkness } from './scenes3';

/** One of the winter chain's drawings (100×100), its bottom centre on (x, base). */
const item = (level: number, x: number, base: number, s: number) =>
  `<g transform="translate(${x - 50 * s} ${base - 90 * s}) scale(${s})">${WINTER[level - 1].replace(/^<circle cx="50" cy="5\d" r="4\d"[^>]*\/>/, '')}</g>`;

const MUD = '#c99a62';
const SNOW = '#fafdff';

const flakes = (n: number, h: number, seed = 0) =>
  Array.from({ length: n }, (_, i) => `<circle cx="${(i * 53 + 11 + seed) % 352 + 4}" cy="${(i * 37 + 9 + seed) % h + 4}" r="${i % 3 ? 1.4 : 2.2}" fill="#fff" opacity=".9"/>`).join('');

const snowCap = (x: number, y: number, w: number) =>
  `<path d="M${x - 2} ${y} Q${x + w * 0.25} ${y - 7} ${x + w * 0.5} ${y - 3} T${x + w + 2} ${y} V${y + 4} H${x - 2} Z" fill="${SNOW}" ${THIN} stroke-width="1"/>`;

// ------------------------------------------------------------------ پشت‌بوم‌های کاهگلی

const roofsBase = () =>
  `<rect width="360" height="240" fill="#cfd8e2"/><rect width="360" height="70" fill="#b8c4d0"/>` +
  [[0, 96, 80], [70, 84, 70], [130, 100, 90], [214, 88, 70], [276, 98, 84]].map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="${150 - y}" fill="#b5a48c" ${THIN}/>`).join('') +
  `<path d="M150 100 Q170 70 190 100 Z" fill="#9aa8b4" ${THIN}/>` +
  `<path d="M0 150 H360 V240 H0 Z" fill="#b8925e"/><path d="M0 150 H360" stroke="${INK}" stroke-width="2" opacity=".4"/>` +
  `<rect x="0" y="140" width="360" height="12" fill="#a8784a" ${THIN}/>`;

const ROOFS: Record<string, Layer> = {
  mud: (d) =>
    d
      ? `<path d="M0 152 H360 V240 H0 Z" fill="${MUD}"/>` + Array.from({ length: 22 }, (_, i) => `<path d="M${(i * 41) % 350 + 4} ${160 + (i * 29) % 70} l6 ${i % 2 ? -2 : 2}" stroke="#f2d48a" stroke-width="1.4" stroke-linecap="round"/>`).join('')
      : [[60, 190], [170, 210], [280, 180], [120, 228]].map(([x, y]) => `<path d="M${x - 24} ${y} l14 -8 l12 10 l16 -6 l10 8" fill="none" stroke="#6e4a2e" stroke-width="2"/>`).join('') + dustPile(220, 220),
  chimney: (d) =>
    [70, 250].map((x) => `<rect x="${x - 10}" y="104" width="20" height="40" fill="#a8784a" ${O}/><rect x="${x - 13}" y="98" width="26" height="8" fill="#8a5a32" ${THIN}/>` +
      (d ? `<path d="M${x} 96 q-8 -12 0 -24 q8 -12 0 -24" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>` : `<path d="M${x - 10} 104 l20 12" stroke="#5e3418" stroke-width="2"/>`)).join(''),
  tarp: (d) =>
    `<rect x="286" y="160" width="60" height="40" fill="#8a6a4a" ${O}/>` +
    (d ? `<path d="M280 160 Q316 146 352 160 L356 196 Q316 190 282 196 Z" fill="#3a76c4" ${O}/><path d="M290 164 L294 190 M342 164 L340 190" stroke="#1d4fa8" stroke-width="1.6"/>`
      : `<path d="M290 160 l22 -10 l10 12" fill="none" stroke="#3a76c4" stroke-width="3"/>`),
  gutter: (d) =>
    d
      ? `<path d="M0 154 H360" stroke="#9aa4b0" stroke-width="6"/><path d="M0 154 H360" stroke="#d8dee6" stroke-width="2"/>` +
        [40, 200, 330].map((x) => `<path d="M${x} 154 V172" stroke="#9aa4b0" stroke-width="6"/>`).join('')
      : `<path d="M20 156 l60 6 M220 154 l50 10" stroke="#7a6a5a" stroke-width="5"/>`,
  shovels: (d) =>
    d
      ? [110, 140, 170].map((x, i) => `<path d="M${x} 196 L${x + 8} 128" stroke="#8b5328" stroke-width="4" stroke-linecap="round"/><path d="M${x - 12} 196 H${x + 10} L${x + 6} 218 H${x - 8} Z" fill="url(#gWood)" ${THIN} transform="rotate(${i * 4 - 4} ${x} 206)"/>`).join('')
      : plank(110, 212, 60, -10),
};

// ------------------------------------------------------------------ برف اول

const snowyAlley = (night: boolean) =>
  `<rect width="360" height="240" fill="${night ? '#1f2350' : '#c8d6e4'}"/>` +
  `<rect x="120" y="70" width="120" height="124" fill="#b5804d" ${THIN}/>` + snowCap(120, 70, 120) +
  `<path d="M0 20 L120 66 V194 L0 240 Z" fill="#c98a52" ${O}/><path d="M360 20 L240 66 V194 L360 240 Z" fill="#c98a52" ${O}/>` +
  `<path d="M0 14 L120 62 V68 L0 22 Z M360 14 L240 62 V68 L360 22 Z" fill="${SNOW}" ${THIN} stroke-width="1"/>` +
  [[40, 90], [80, 110], [320, 90], [280, 110], [160, 100], [200, 100]].map(([x, y]) => `<rect x="${x - 7}" y="${y}" width="14" height="22" rx="6" fill="${night ? '#ffe08a' : '#8fb3c8'}" ${THIN} stroke-width="1"/>`).join('') +
  `<path d="M120 194 H240 L360 240 H0 Z" fill="${SNOW}"/><path d="M120 194 H240" stroke="#cfe2f2" stroke-width="2"/>`;

const FIRSTSNOW: Record<string, Layer> = {
  path: (d) => (d ? `<path d="M160 194 H200 L232 240 H128 Z" fill="#9a948a"/><path d="M160 194 L128 240 M200 194 L232 240" stroke="#e6ecf2" stroke-width="4"/>` : flakes(30, 230)),
  lights: (d) =>
    d ? stringLights(80, ['#ffd36b', '#ff7a9c', '#5fe0e0', '#fff6d0']) + [[46, 100], [314, 100]].map(([x, y]) => glow(x, y + 10, 26, 0.6)).join('')
      : `<path d="M0 80 Q90 102 180 80 T360 80" fill="none" stroke="${INK}" stroke-width="1.2" opacity=".5"/>`,
  snowman: (d) => (d ? item(8, 80, 222, 0.62) : `<ellipse cx="80" cy="214" rx="20" ry="8" fill="#e6ecf2" ${THIN}/>`),
  beet: (d) =>
    d
      ? `<rect x="252" y="176" width="70" height="30" rx="3" fill="url(#gWood)" ${O}/><circle cx="264" cy="214" r="9" fill="#3a3a44" ${THIN}/><circle cx="310" cy="214" r="9" fill="#3a3a44" ${THIN}/>` +
        `<path d="M262 176 H312 L306 156 H268 Z" fill="url(#gSteel)" ${O}/><ellipse cx="287" cy="156" rx="19" ry="4" fill="#6a0e30" ${THIN}/>` +
        `<path d="M280 150 q-5 -8 0 -16 M294 150 q5 -8 0 -16" fill="none" stroke="#fff" stroke-width="2.4" opacity=".85"/>` + glow(287, 160, 24, 0.5)
      : `<rect x="256" y="196" width="60" height="18" rx="3" fill="#8a7a6a" ${THIN}/>`,
  sled: (d) =>
    d
      ? `<path d="M150 230 H220 Q232 230 230 220" fill="none" stroke="#8b5328" stroke-width="3" stroke-linecap="round"/><rect x="154" y="214" width="62" height="10" rx="3" fill="url(#gRed)" ${O}/>` +
        `<path d="M162 224 V230 M206 224 V230" stroke="#8b5328" stroke-width="3"/><path d="M216 216 Q240 200 250 190" fill="none" stroke="#c9a26b" stroke-width="2"/>`
      : '',
};

// ------------------------------------------------------------------ کرسی ننه‌گلاب

const roomBase = () =>
  `<rect width="360" height="172" fill="#efe3cc"/>` +
  `<rect x="140" y="30" width="80" height="64" rx="4" fill="#9fb0c8" ${O}/><path d="M180 30 V94 M140 62 H220" stroke="#8b5328" stroke-width="4"/>` + flakes(8, 56, 140).replace(/cx="(\d+)/g, (_, x) => `cx="${140 + (+x % 76)}`).replace(/cy="(\d+)/g, (_, y) => `cy="${34 + (+y % 56)}`) +
  floor('#a5703e', 172) + `<path d="M40 180 H320 L340 236 H20 Z" fill="url(#gCarpet)" ${O}/>`;

const KORSI: Record<string, Layer> = {
  cushions: (d) =>
    d ? [[30, 'url(#gNavy)'], [300, 'url(#gRed)']].map(([x, c]) => `<rect x="${x}" y="134" width="34" height="46" rx="12" fill="${c}" ${O}/><path d="M${Number(x) + 6} 156 H${Number(x) + 28}" stroke="#f6c945" stroke-width="2" stroke-dasharray="3 3"/>`).join('')
      : `<rect x="34" y="168" width="40" height="12" rx="5" fill="#7a6a5a" ${THIN}/>`,
  korsi: (d) =>
    d
      ? `<path d="M80 226 Q72 170 110 160 H250 Q288 170 280 226 Z" fill="url(#gRed)" ${O}/><path d="M110 160 H250 L240 148 H120 Z" fill="#fffdf6" ${O}/>` +
        Array.from({ length: 9 }, (_, i) => `<circle cx="${104 + i * 19}" cy="196" r="3" fill="#f6c945"/>`).join('') + `<path d="M90 214 Q180 228 270 214" fill="none" stroke="#f6c945" stroke-width="2"/>`
      : `<rect x="120" y="170" width="120" height="12" rx="2" fill="url(#gWood)" ${O}/><path d="M128 182 V214 M232 182 V214" ${O} stroke-width="4"/>` + dustPile(180, 220),
  brazier: (d) => (d ? glow(180, 222, 60, 0.6) + `<path d="M150 226 Q180 214 210 226" fill="none" stroke="#ff7a2a" stroke-width="3" opacity=".8"/>` : ''),
  snacks: (d) =>
    d
      ? `<ellipse cx="160" cy="150" rx="22" ry="5" fill="url(#gBrass)" ${THIN}/>` + [[150, 146, '#c9a26b'], [158, 144, '#7a4a2a'], [166, 146, '#e8d3a8'], [172, 145, '#3f8a2a']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="3" fill="${c}"/>`).join('') +
        [[206, 142], [218, 144]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="url(#gPom)" ${THIN}/>`).join('')
      : '',
  soup: (d) =>
    d
      ? `<path d="M230 140 H254 C252 152 247 156 242 156 C237 156 232 152 230 140 Z" fill="url(#gCream)" ${THIN}/><ellipse cx="242" cy="140" rx="12" ry="3" fill="#f2d9a0" ${THIN} stroke-width="1"/>` +
        `<path d="M238 134 q-4 -6 0 -12 M246 134 q4 -6 0 -12" fill="none" stroke="#fff" stroke-width="2" opacity=".9"/>` + estekan(128, 148, 0.24, true, false)
      : '',
};

// ------------------------------------------------------------------ گلخن حموم

const furnaceBase = () =>
  `<rect width="360" height="240" fill="#5a3a2a"/>` + Array.from({ length: 12 }, (_, i) => `<path d="M0 ${18 + i * 14} H360" stroke="#4a2a1a" stroke-width="1.4" opacity=".7"/>`).join('') +
  `<path d="M0 0 H360 V36 Q180 -12 0 36 Z" fill="#3a2418"/>` + floor('#6a4a3a', 186);

const FURNACE: Record<string, Layer> = {
  wood: (d) =>
    d
      ? Array.from({ length: 9 }, (_, i) => `<circle cx="${30 + (i % 3) * 18 + (Math.floor(i / 3) % 2) * 9}" cy="${214 - Math.floor(i / 3) * 16}" r="8" fill="#a8784a" ${THIN}/><circle cx="${30 + (i % 3) * 18 + (Math.floor(i / 3) % 2) * 9}" cy="${214 - Math.floor(i / 3) * 16}" r="4" fill="none" stroke="#6b4a2a" stroke-width="1"/>`).join('')
      : plank(20, 214, 60, -6) + dustPile(50, 222),
  furnace: (d) =>
    `<path d="M110 220 V120 Q110 92 180 92 Q250 92 250 120 V220 Z" fill="#a8603a" ${O}/>` + Array.from({ length: 8 }, (_, i) => `<path d="M110 ${130 + i * 12} H250" stroke="#7a3a1a" stroke-width="1" opacity=".5"/>`).join('') +
    `<path d="M150 220 V184 Q150 168 180 168 Q210 168 210 184 V220 Z" fill="#2a1a10" ${THIN}/>` +
    (d ? `<path d="M156 218 C154 200 168 196 166 184 C176 192 176 178 182 172 C188 186 200 192 204 218 Z" fill="url(#gFire)"/>` + glow(180, 196, 50, 0.7) : ''),
  cauldron: (d) =>
    d
      ? `<path d="M140 92 H220 L212 64 Q180 52 148 64 Z" fill="url(#gCopper)" ${O}/><ellipse cx="180" cy="62" rx="32" ry="7" fill="#9ec4e8" ${THIN}/>` +
        `<path d="M166 56 q-6 -10 0 -20 q6 -10 0 -20 M194 54 q6 -10 0 -20 q-6 -10 0 -20" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>`
      : `<path d="M300 220 C296 200 330 196 330 214 Z" fill="#6a5a4a" ${THIN}/>`,
  pipes: (d) =>
    d
      ? `<path d="M250 140 H300 V40 H360" fill="none" stroke="#9aa4b0" stroke-width="10"/><path d="M250 140 H300 V40 H360" fill="none" stroke="#d8dee6" stroke-width="3"/>` +
        [300].map((x) => `<rect x="${x - 8}" y="94" width="16" height="10" fill="#7f8a99" ${THIN}/>`).join('')
      : `<path d="M260 150 l30 -8 M296 100 l8 -30" stroke="#6a5a4a" stroke-width="8"/>`,
  lamp: (d) => (d ? lantern(70, 50) + glow(70, 86, 70, 0.55) + sparkle(96, 70, 5) : darkness(0.5)),
};

// ------------------------------------------------------------------ شب برفی

const SNOWNIGHT: Record<string, Layer> = {
  sky: (d) =>
    d ? `<circle cx="290" cy="30" r="14" fill="#fff6d0"/><circle cx="296" cy="26" r="13" fill="#1f2350"/>` + Array.from({ length: 12 }, (_, i) => `<circle cx="${(i * 61 + 20) % 330 + 10}" cy="${(i * 11 + 6) % 40 + 6}" r="1.2" fill="#fff6d0"/>`).join('')
      : `<path d="M0 0 H360 V40 Q300 56 240 40 T120 44 T0 40 Z" fill="#4a4a6a"/>` + flakes(28, 200),
  snowmen: (d) => (d ? item(8, 60, 220, 0.42) + item(8, 304, 222, 0.46) + item(8, 140, 200, 0.26) + item(8, 226, 198, 0.24) : ''),
  fire: (d) =>
    `<path d="M162 226 L198 214 M164 214 L200 226" stroke="#6b4a2a" stroke-width="6" stroke-linecap="round"/>` +
    (d ? glow(180, 200, 90, 0.75) + `<path d="M166 216 C160 200 172 190 170 176 C180 184 182 168 186 160 C192 176 202 186 194 216 Z" fill="url(#gFire)" ${THIN}/>` + `<path d="M176 216 C174 206 180 200 180 192 C186 200 188 208 186 216 Z" fill="#fff6a8"/>`
      : `<ellipse cx="180" cy="220" rx="22" ry="5" fill="#9a9aa8"/>`),
  ash: (d) =>
    d
      ? `<path d="M228 206 H272 L268 224 H232 Z" fill="url(#gCopper)" ${O}/><ellipse cx="250" cy="206" rx="22" ry="5" fill="#c9a24a" ${THIN}/>` +
        `<path d="M240 204 q10 -4 20 0" fill="none" stroke="#3f8a2a" stroke-width="2"/><path d="M244 198 q-4 -6 0 -12 M256 198 q4 -6 0 -12" fill="none" stroke="#fff" stroke-width="2" opacity=".9"/>`
      : '',
  music: (d) =>
    d
      ? `<rect x="96" y="206" width="44" height="8" rx="2" fill="url(#gWood)" ${O}/><path d="M102 214 V228 M134 214 V228" ${O} stroke-width="3"/>` +
        `<g transform="translate(118 196) rotate(-24)"><path d="M-6 0 C-10 -4 -10 -10 -4 -12 C-1 -9 1 -9 4 -12 C10 -10 10 -4 6 0 C10 4 8 12 0 12 C-8 12 -10 4 -6 0 Z" fill="url(#gWood)" ${THIN}/><path d="M0 -10 V-34" ${O} stroke-width="2"/></g>` +
        `<path d="M146 176 v-10 l7 -3 v10" fill="none" stroke="#fff6d0" stroke-width="1.6"/><circle cx="144" cy="176" r="2.4" fill="#fff6d0"/><circle cx="151" cy="173" r="2.4" fill="#fff6d0"/>`
      : '',
};

export const SCENES18: Record<string, SceneDef> = {
  roofs: { base: roofsBase(), order: ['mud', 'chimney', 'tarp', 'gutter', 'shovels'], layers: ROOFS },
  firstsnow: { base: snowyAlley(false), order: ['path', 'lights', 'snowman', 'beet', 'sled'], layers: FIRSTSNOW },
  korsi: { base: roomBase(), order: ['cushions', 'korsi', 'brazier', 'snacks', 'soup'], layers: KORSI },
  furnace: { base: furnaceBase(), order: ['wood', 'furnace', 'cauldron', 'pipes', 'lamp'], layers: FURNACE },
  snownight: { base: snowyAlley(true), order: ['sky', 'snowmen', 'fire', 'ash', 'music'], layers: SNOWNIGHT },
};
