// Season 8 («رادیو محله») place scenes. Same contract as scenes.ts: each task layer is drawn
// "before" until done, then "after".

import { INK, O, THIN, sparkle } from './kit';
import { Layer, SceneDef, brickWall, cobweb, dustPile, floor, geranium, glow, lantern, plank, stringLights } from './scenes';
import { darkness, text, wall } from './scenes3';

const ball = (x: number, y: number, r: number) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#fffdf6" ${O}/>` +
  `<path d="M${x} ${y - r * 0.35} l${r * 0.33} ${r * 0.24} l${-r * 0.13} ${r * 0.4} h${-r * 0.4} l${-r * 0.13} ${-r * 0.4} Z" fill="${INK}"/>` +
  `<path d="M${x} ${y - r * 0.35} V${y - r} M${x + r * 0.33} ${y - r * 0.11} l${r * 0.6} ${-r * 0.2} M${x - r * 0.33} ${y - r * 0.11} l${-r * 0.6} ${-r * 0.2}" stroke="${INK}" stroke-width="1.2"/>`;

const trophy = (x: number, y: number, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})">` +
  `<path d="M-16 -40 H16 C16 -18 8 -10 0 -8 C-8 -10 -16 -18 -16 -40 Z" fill="url(#gGold)" ${O}/>` +
  `<path d="M-16 -36 C-28 -36 -28 -20 -14 -18 M16 -36 C28 -36 28 -20 14 -18" fill="none" ${O} stroke="url(#gGold)" stroke-width="4"/>` +
  `<path d="M-4 -8 H4 V2 H-4 Z" fill="url(#gGold)" ${THIN}/><rect x="-12" y="2" width="24" height="8" rx="2" fill="url(#gWoodDark)" ${THIN}/>` +
  `<path d="M-8 -34 Q-6 -20 0 -14" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/></g>`;

/** Floodlight mast at x (lit or dark). */
const mast = (x: number, lit: boolean) =>
  `<path d="M${x} 236 V40" ${O} stroke="url(#gSteel)" stroke-width="5"/>` +
  `<rect x="${x - 18}" y="22" width="36" height="20" rx="3" fill="${lit ? '#fff6c8' : '#6a6a70'}" ${O}/>` +
  [0, 1, 2].map((k) => `<circle cx="${x - 10 + k * 10}" cy="32" r="4" fill="${lit ? '#ffe08a' : '#4a4a50'}" ${THIN} stroke-width="1"/>`).join('') +
  (lit ? `<path d="M${x - 16} 42 L${x - 70} 236 L${x + 70} 236 L${x + 16} 42 Z" fill="#fff6c8" opacity=".14"/>` : '');

// ------------------------------------------------------------------ استودیوی رادیو

const RADIO: Record<string, Layer> = {
  foam: (d) =>
    d
      ? Array.from({ length: 40 }, (_, i) => {
        const x = (i % 10) * 36, y = Math.floor(i / 10) * 36;
        return `<rect x="${x}" y="${y}" width="36" height="36" fill="${(i + Math.floor(i / 10)) % 2 ? '#3a4f9a' : '#2c3c78'}"/>` +
          `<path d="M${x} ${y} L${x + 18} ${y + 18} L${x + 36} ${y} M${x} ${y + 36} L${x + 18} ${y + 18} L${x + 36} ${y + 36}" stroke="#1f2a55" stroke-width="1.2"/>`;
      }).join('')
      : cobweb(0, 0, 1.2) + cobweb(360, 0, 1, true) + `<path d="M40 40 l30 50 M300 30 l-20 40" stroke="${INK}" stroke-width="1.6" opacity=".4"/>`,
  records: (d) =>
    `<rect x="16" y="40" width="96" height="100" fill="url(#gWoodDark)" ${O}/><path d="M16 74 H112 M16 108 H112" ${THIN}/>` +
    (d
      ? [46, 80, 114].map((y) => Array.from({ length: 9 }, (_, i) => `<rect x="${20 + i * 10}" y="${y - 30}" width="8" height="28" rx="1" fill="${['#e0303f', '#f6c945', '#14879a', '#fffdf6', '#3fae5a', '#c58bff'][(i + y) % 6]}" ${THIN} stroke-width=".8"/>`).join('')).join('') +
        `<circle cx="140" cy="60" r="18" fill="#1b1b1b" ${O}/><circle cx="140" cy="60" r="6" fill="#e0303f"/><circle cx="140" cy="60" r="12" fill="none" stroke="#3a3a3a" stroke-width="1"/>`
      : dustPile(64, 132) + plank(20, 90, 80, 10)),
  desk: (d) =>
    `<rect x="120" y="160" width="200" height="60" rx="4" fill="url(#gWood)" ${O}/>` +
    (d
      ? `<path d="M140 160 L150 132 L300 132 L310 160 Z" fill="#3b3b44" ${O}/>` +
        Array.from({ length: 10 }, (_, i) => `<path d="M${160 + i * 14} 138 V156" stroke="#9aa4ae" stroke-width="2"/><rect x="${156 + i * 14}" y="${142 + (i * 7) % 10}" width="8" height="4" rx="1" fill="${['#e0303f', '#f6c945', '#3fae5a'][i % 3]}"/>`).join('')
      : `<rect x="150" y="140" width="80" height="20" fill="#7a7a7a" ${THIN}/>`),
  mic: (d) =>
    d
      ? `<path d="M230 132 L250 90 L222 70" fill="none" ${O} stroke="url(#gSteel)" stroke-width="4"/>` +
        `<rect x="208" y="50" width="22" height="34" rx="11" fill="url(#gSteel)" ${O}/><path d="M212 60 H226 M212 66 H226 M212 72 H226" stroke="#4a4a50" stroke-width="1.4"/>` +
        `<path d="M270 156 C270 136 300 136 300 156" fill="none" ${O} stroke="#1b1b1b" stroke-width="4"/><rect x="264" y="150" width="10" height="14" rx="4" fill="#1b1b1b" ${THIN}/><rect x="296" y="150" width="10" height="14" rx="4" fill="#1b1b1b" ${THIN}/>`
      : '',
  onair: (d) =>
    `<rect x="250" y="20" width="96" height="30" rx="6" fill="${d ? '#e0303f' : '#5a3a3a'}" ${O}/>` +
    text(298, 41, 'روی آنتن', 14, d ? '#fff' : '#8a6a6a') +
    (d ? glow(298, 35, 50, 0.6) + sparkle(240, 70, 5) : darkness(0.3)),
};

// ------------------------------------------------------------------ زمین خاکی

const PITCH: Record<string, Layer> = {
  lines: (d) =>
    d
      ? `<path d="M20 230 L60 150 H300 L340 230 Z" fill="none" stroke="#fff" stroke-width="2.4"/><path d="M180 150 V230" stroke="#fff" stroke-width="2"/>` +
        `<ellipse cx="180" cy="188" rx="30" ry="12" fill="none" stroke="#fff" stroke-width="2"/><circle cx="180" cy="188" r="2.4" fill="#fff"/>`
      : dustPile(120, 200) + dustPile(240, 214) + Array.from({ length: 10 }, (_, i) => `<path d="M${40 + i * 30} ${170 + (i * 13) % 50} l-4 -12 m4 12 l6 -10" stroke="#5d7a2c" stroke-width="2.2" stroke-linecap="round"/>`).join(''),
  goals: (d) =>
    [[34, 1], [326, -1]].map(([x, dir]) =>
      d
        ? `<path d="M${x} 196 V150 H${Number(x) + Number(dir) * 26} V196" fill="none" ${O} stroke="#fffdf6" stroke-width="4"/>`
        : `<path d="M${x} 196 V160" stroke="#8a7a6a" stroke-width="4"/>`).join(''),
  nets: (d) =>
    d
      ? [[34, 1], [326, -1]].map(([x, dir]) => Array.from({ length: 5 }, (_, i) => `<path d="M${Number(x) + Number(dir) * (4 + i * 5)} 152 V196" stroke="#fff" stroke-width=".8" opacity=".8"/>`).join('') +
          [160, 170, 180, 190].map((y) => `<path d="M${x} ${y} H${Number(x) + Number(dir) * 26}" stroke="#fff" stroke-width=".8" opacity=".8"/>`).join('')).join('')
      : '',
  bench: (d) =>
    d
      ? `<rect x="130" y="128" width="100" height="8" rx="2" fill="url(#gWood)" ${O}/><path d="M136 136 V148 M224 136 V148" ${O} stroke-width="3"/>` +
        `<path d="M126 104 H234 V128 H126 Z" fill="url(#gGlass)" fill-opacity=".5" ${THIN}/>` + ball(250, 140, 7)
      : plank(140, 140, 80, 6),
  light: (d) => mast(16, d) + mast(344, d) + (d ? '' : darkness(0.32)),
};

const pitchBase = () =>
  `<rect width="360" height="110" fill="#1f2a55"/>` + Array.from({ length: 14 }, (_, i) => `<circle cx="${(i * 83) % 356 + 2}" cy="${(i * 37) % 60 + 4}" r="1.2" fill="#fff6c8"/>`).join('') +
  `<g transform="translate(0 60)">${brickWall('#b98652', '#9a6a3a', 90)}</g>` + `<rect y="146" width="360" height="94" fill="#c9a26b"/>`;

// ------------------------------------------------------------------ سکوی تماشاگرها

const STANDS: Record<string, Layer> = {
  seats: (d) =>
    Array.from({ length: 5 }, (_, r) => `<rect x="0" y="${70 + r * 26}" width="360" height="26" fill="${d ? ['#e0303f', '#f6c945', '#14879a', '#3fae5a', '#3a76c4'][r] : '#8a8a8a'}" ${THIN}/>` +
      (d ? Array.from({ length: 18 }, (_, i) => `<rect x="${6 + i * 20}" y="${74 + r * 26}" width="14" height="10" rx="2" fill="#fffdf6" opacity=".35"/>`).join('') : `<path d="M${40 + r * 60} ${74 + r * 26} l20 18" stroke="${INK}" stroke-width="1.4" opacity=".4"/>`)).join(''),
  banner: (d) =>
    d
      ? `<path d="M40 30 H320 L314 62 H46 Z" fill="#fffdf6" ${O}/>` + text(180, 54, 'کوچه‌ی حاج‌بابا', 18, '#e0303f') +
        `<path d="M40 30 L30 62 M320 30 L330 62" ${O} stroke-width="3"/>`
      : `<path d="M60 40 L140 46 L136 58 L58 52 Z" fill="#c9c0b4" ${O}/>`,
  drums: (d) =>
    d
      ? [[70, 214], [290, 214]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="22" ry="8" fill="url(#gCream)" ${O}/><path d="M${x - 22} ${y} V${y + 20} Q${x} ${y + 30} ${x + 22} ${y + 20} V${y}" fill="url(#gRed)" ${O}/>` +
          `<path d="M${x - 18} ${y + 4} L${x + 18} ${y + 22} M${x + 18} ${y + 4} L${x - 18} ${y + 22}" stroke="#f6c945" stroke-width="1.6"/>`).join('') +
        `<path d="M110 196 L150 184 L150 204 Z" fill="url(#gBrass)" ${O}/><rect x="96" y="194" width="16" height="6" rx="2" fill="url(#gBrass)" ${THIN}/>`
      : '',
  score: (d) =>
    `<rect x="140" y="196" width="80" height="40" rx="4" fill="#1b1b1b" ${O}/>` +
    (d ? text(160, 224, '۰', 20, '#ffe08a') + text(180, 222, ':', 18, '#fff') + text(200, 224, '۰', 20, '#ffe08a') : ''),
  flags: (d) =>
    d
      ? [24, 120, 240, 336].map((x, i) => `<path d="M${x} 70 V20" ${O} stroke-width="2.4"/><path d="M${x} 20 L${x + 26} 28 L${x} 38 Z" fill="${['#2a9d4a', '#e0303f', '#f6c945', '#14879a'][i]}" ${THIN}/>`).join('') + sparkle(180, 16, 5)
      : '',
};

// ------------------------------------------------------------------ فینال

const FINAL: Record<string, Layer> = {
  booth: (d) =>
    d
      ? `<rect x="250" y="62" width="104" height="60" rx="4" fill="url(#gWood)" ${O}/><rect x="258" y="70" width="88" height="34" fill="url(#gGlass)" ${THIN}/>` +
        `<rect x="296" y="88" width="8" height="14" rx="4" fill="url(#gSteel)" ${THIN}/>` + text(302, 116, 'رادیو محله', 9, '#ffe08a')
      : `<rect x="250" y="62" width="104" height="60" rx="4" fill="#6a5a4a" ${O}/>`,
  ball: (d) => (d ? ball(180, 196, 12) + `<path d="M162 210 q18 6 36 0" fill="none" stroke="#000" stroke-width="2" opacity=".2"/>` : ''),
  lights: (d) => mast(20, d) + mast(340, d) + (d ? '' : darkness(0.4)),
  save: (d) =>
    d
      ? `<g transform="translate(70 168) rotate(-20)"><path d="M-12 14 V-6 Q-12 -14 -6 -14 V-4 M-6 -14 Q-4 -20 0 -20 V-4 M0 -20 Q4 -22 6 -18 V-4 M6 -18 Q10 -18 10 -12 V-2 Q16 -6 18 0 L10 14 Z" fill="url(#gYellow)" ${O}/></g>` + sparkle(96, 150, 6)
      : '',
  trophy: (d) =>
    d
      ? glow(180, 130, 60, 0.7) + `<rect x="150" y="140" width="60" height="10" rx="2" fill="url(#gWood)" ${O}/>` + trophy(180, 138, 1.1) +
        Array.from({ length: 24 }, (_, i) => `<rect x="${(i * 47) % 350 + 4}" y="${(i * 29) % 140 + 6}" width="5" height="3" rx="1" fill="${['#ff7a9c', '#ffd36b', '#5fe0e0', '#c58bff'][i % 4]}" transform="rotate(${(i * 53) % 180} ${(i * 47) % 350 + 6} ${(i * 29) % 140 + 7})"/>`).join('')
      : `<rect x="150" y="140" width="60" height="10" rx="2" fill="#6a5a4a" ${O}/>`,
};

const finalBase = () =>
  `<rect width="360" height="150" fill="#1a2148"/>` + Array.from({ length: 20 }, (_, i) => `<circle cx="${(i * 83) % 356 + 2}" cy="${(i * 37) % 60 + 4}" r="1.2" fill="#fff6c8"/>`).join('') +
  // Packed stands in the dark, then the pitch.
  Array.from({ length: 3 }, (_, r) => `<rect x="0" y="${86 + r * 18}" width="360" height="18" fill="${['#3a2a5a', '#2c3666', '#3a2a5a'][r]}"/>` +
    Array.from({ length: 30 }, (_, i) => `<circle cx="${6 + i * 12}" cy="${92 + r * 18}" r="3" fill="${['#e0303f', '#f6c945', '#fffdf6', '#14879a'][(i + r) % 4]}" opacity=".7"/>`).join('')).join('') +
  `<rect y="140" width="360" height="100" fill="#3f8a3a"/>` + Array.from({ length: 6 }, (_, i) => `<rect x="${i * 60}" y="140" width="30" height="100" fill="#469844"/>`).join('') +
  `<path d="M20 232 L60 152 H300 L340 232 Z M180 152 V232" fill="none" stroke="#fff" stroke-width="2"/><ellipse cx="180" cy="192" rx="30" ry="12" fill="none" stroke="#fff" stroke-width="2"/>`;

// ------------------------------------------------------------------ جشن قهرمانی (alley at night)

const VICTORY: Record<string, Layer> = {
  truck: (d) =>
    `<path d="M70 212 V160 H190 V212 Z" fill="${d ? 'url(#gSky)' : '#7a7a80'}" ${O}/><path d="M190 212 V176 L214 160 H250 L270 186 V212 Z" fill="${d ? 'url(#gSky)' : '#7a7a80'}" ${O}/>` +
    `<path d="M214 166 H246 L262 184 H214 Z" fill="url(#gGlass)" ${THIN}/>` +
    [100, 160, 240].map((x) => `<circle cx="${x}" cy="214" r="14" fill="#2a2a30" ${O}/><circle cx="${x}" cy="214" r="5" fill="url(#gSteel)"/>`).join('') +
    (d ? Array.from({ length: 9 }, (_, i) => `<circle cx="${78 + i * 13}" cy="${160 - (i % 2) * 4}" r="6" fill="${['#e0303f', '#f6c945', '#ff7a9c'][i % 3]}" ${THIN} stroke-width=".8"/>`).join('') +
        trophy(130, 156, 0.9) + [96, 168].map((x) => `<path d="M${x} 158 V112" stroke="${INK}" stroke-width="1"/><ellipse cx="${x}" cy="104" rx="10" ry="12" fill="${x < 130 ? '#e0303f' : '#14879a'}" ${O}/>`).join('')
      : plank(80, 150, 90, -6)),
  dohol: (d) =>
    d
      ? // A dohol seen side-on: wooden shell, rope zigzag, skin heads at both ends.
        `<g transform="translate(300 192)"><rect x="-26" y="-20" width="52" height="34" fill="url(#gWood)" ${O}/>` +
        `<path d="M-22 -18 L-14 12 L-6 -18 L2 12 L10 -18 L18 12 L22 -6" fill="none" stroke="#f6e3b0" stroke-width="1.6"/>` +
        `<ellipse cx="-26" cy="-3" rx="6" ry="17" fill="url(#gCream)" ${O}/><ellipse cx="26" cy="-3" rx="6" ry="17" fill="url(#gCream)" ${O}/>` +
        `<path d="M-20 -24 Q0 -40 20 -24" fill="none" stroke="#e0303f" stroke-width="2.4"/></g>` +
        `<path d="M330 150 L346 214 L338 216 Z" fill="url(#gWood)" ${O}/><ellipse cx="344" cy="214" rx="8" ry="4" fill="url(#gBrass)" ${THIN}/>`
      : '',
  sweets: (d) =>
    d
      ? `<rect x="10" y="190" width="56" height="8" rx="2" fill="#fffdf6" ${O}/><path d="M14 198 V230 M62 198 V230" ${THIN} stroke-width="3"/>` +
        `<ellipse cx="28" cy="186" rx="14" ry="5" fill="url(#gSilver)" ${THIN}/>` + [22, 28, 34].map((x) => `<circle cx="${x}" cy="182" r="3" fill="#f2d3a0" ${THIN} stroke-width=".8"/>`).join('') +
        `<path d="M46 190 L48 170 L60 170 L62 190 Z" fill="url(#gGlass)" ${THIN}/><rect x="48" y="178" width="12" height="10" fill="#c0392b" opacity=".8"/>`
      : '',
  lights: (d) => (d ? stringLights(14) + lantern(40, 26) + lantern(320, 26) : darkness(0.35)),
  photo: (d) =>
    d
      ? `<rect x="150" y="70" width="60" height="44" rx="3" fill="url(#gGold)" ${O}/><rect x="155" y="75" width="50" height="34" fill="#e8d3a8" ${THIN}/>` +
        Array.from({ length: 6 }, (_, i) => `<circle cx="${160 + i * 8}" cy="${90 + (i % 2) * 2}" r="3" fill="#8a6a48"/><path d="M${157 + i * 8} 106 v-8 q3 -3 6 0 v8" fill="#8a6a48"/>`).join('') + trophy(180, 104, 0.25) +
        sparkle(140, 64, 5) + sparkle(220, 64, 5) + geranium(16, 236, 0.6) + geranium(344, 236, 0.6)
      : `<rect x="150" y="70" width="60" height="44" fill="none" stroke="#9b8a76" stroke-width="2" stroke-dasharray="4 4"/>`,
};

const victoryBase = () =>
  `<rect width="360" height="160" fill="#22305e"/>` + Array.from({ length: 16 }, (_, i) => `<circle cx="${(i * 83) % 356 + 2}" cy="${(i * 37) % 50 + 4}" r="1.2" fill="#fff6c8"/>`).join('') +
  `<rect x="0" y="40" width="110" height="140" fill="#d9a873" ${O}/><rect x="250" y="50" width="110" height="130" fill="#e0b07a" ${O}/>` +
  [[24, 70], [74, 70], [276, 80], [326, 80]].map(([x, y]) => `<rect x="${x - 8}" y="${y}" width="16" height="22" rx="8" fill="#ffe08a" ${THIN}/>`).join('') +
  floor('#8a7a66', 176) + wall('rgba(0,0,0,0)', 0);

export const SCENES8: Record<string, SceneDef> = {
  radio: { base: wall('#5a6a7a') + floor('#6b5a4a'), order: ['foam', 'records', 'desk', 'mic', 'onair'], layers: RADIO },
  pitch: { base: pitchBase(), order: ['lines', 'goals', 'nets', 'bench', 'light'], layers: PITCH },
  stands: { base: `<rect width="360" height="240" fill="url(#gSky)"/><rect y="200" width="360" height="40" fill="#3f8a3a"/>`, order: ['seats', 'banner', 'flags', 'score', 'drums'], layers: STANDS },
  final: { base: finalBase(), order: ['booth', 'lights', 'ball', 'save', 'trophy'], layers: FINAL },
  victory: { base: victoryBase(), order: ['lights', 'truck', 'dohol', 'sweets', 'photo'], layers: VICTORY },
};
