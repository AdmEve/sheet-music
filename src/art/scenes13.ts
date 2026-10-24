// Season 13 («عروسی شیرین و آیدین») place scenes. Same contract as scenes.ts: each task layer is
// drawn "before" until done, then "after".

import { INK, O, THIN, estekan, g, samovar, shine, sparkle, teapot } from './kit';
import { WEDDING } from './chainsO';
import { Layer, SceneDef, cobweb, dustPile, floor, geranium, glow, lantern, plank, sangak, stringLights } from './scenes';
import { darkness, text, wall } from './scenes3';

/** One of the chain's item drawings (100×100), placed so its bottom centre lands on (x, base). */
const item = (level: number, x: number, base: number, s: number) =>
  `<g transform="translate(${x - 50 * s} ${base - 90 * s}) scale(${s})">${WEDDING[level - 1]}</g>`;

const rose = (x: number, y: number, r: number, fill: string) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${THIN} stroke-width=".8"/><path d="M${x - r * 0.4} ${y} q${r * 0.4} ${-r * 0.6} ${r * 0.8} 0" fill="none" stroke="${INK}" stroke-width=".7" opacity=".55"/>`;

const ROSES = ['#e0303f', '#fffdf6', '#ff9ec4', '#e0303f', '#ffd0dc'];

const stars = (n: number, h: number) =>
  Array.from({ length: n }, (_, i) => `<circle cx="${(i * 67 + 13) % 350 + 5}" cy="${(i * 23 + 7) % h + 4}" r="${i % 3 ? 1.1 : 1.8}" fill="#fff6d0" opacity="${i % 2 ? 0.7 : 1}"/>`).join('');

/** A small photo frame standing on (x, base). */
const photo = (x: number, base: number, w: number, h: number, inner: string) =>
  `<rect x="${x - w / 2}" y="${base - h}" width="${w}" height="${h}" rx="1.5" fill="url(#gGold)" ${THIN}/><rect x="${x - w / 2 + 3}" y="${base - h + 3}" width="${w - 6}" height="${h - 6}" fill="#e8f4ff"/>` +
  g(inner, `translate(${x} ${base - h / 2})`);

const PIC_HOUSE = `<path d="M-6 6 V-1 L0 -6 L6 -1 V6 Z" fill="#e0b07a" stroke="${INK}" stroke-width=".6"/><rect x="-1.5" y="1" width="3" height="5" fill="#8b5328"/>`;
const PIC_POND = `<rect x="-8" y="2" width="16" height="5" fill="#6cc0ea"/><path d="M-5 2 V-3 H5 V2 Z M-6 -3 L0 -7 L6 -3 Z" fill="#fffdf6" stroke="${INK}" stroke-width=".6"/>`;
const PIC_HEART = `<path d="M0 5 C-8 -1 -6 -7 0 -3 C6 -7 8 -1 0 5 Z" fill="#e0303f" stroke="${INK}" stroke-width=".6"/>`;
const PIC_CAR = `<path d="M-9 3 V0 L-5 -1 L-2 -5 H3 L6 -1 L9 0 V3 Z" fill="#fffdf6" stroke="${INK}" stroke-width=".6"/><circle cx="-5" cy="4" r="2" fill="#2a2a2a"/><circle cx="5" cy="4" r="2" fill="#2a2a2a"/><circle cx="6" cy="-2" r="1.6" fill="#e0303f"/>`;
const PIC_ARCH = `<path d="M-7 7 V-1 A7 7 0 0 1 7 -1 V7" fill="none" stroke="#3f8a2a" stroke-width="2"/><circle cx="-6" cy="-2" r="1.6" fill="#e0303f"/><circle cx="0" cy="-7" r="1.6" fill="#ff9ec4"/><circle cx="6" cy="-2" r="1.6" fill="#e0303f"/>`;

// ------------------------------------------------------------------ خونه‌ی بخت

const sack = (x: number, base: number, s = 1) =>
  g(`<path d="M-22 0 C-26 -30 -16 -46 -6 -48 L6 -48 C16 -46 26 -30 22 0 Z" fill="#b8945a" ${O}/><path d="M-8 -48 q8 -8 16 0" fill="none" stroke="#8a6a3a" stroke-width="3"/>` +
    `<path d="M-14 -20 q14 6 28 0 M-16 -8 q16 6 32 0" fill="none" stroke="#8a6a3a" stroke-width="1.2" opacity=".7"/>`, `translate(${x} ${base}) scale(${s})`);

const walnut = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="3.4" fill="#a8783e" ${THIN} stroke-width=".8"/><path d="M${x} ${y - 3} V${y + 3}" stroke="${INK}" stroke-width=".6"/>`;

const NEST: Record<string, Layer> = {
  window: (d) =>
    d
      ? `<rect x="118" y="36" width="88" height="92" rx="4" fill="url(#gSky)"/>` +
        `<path d="M122 112 V94 L138 84 L154 94 V112 Z M156 112 V88 H184 V112 Z" fill="#e0b07a" ${THIN}/><path d="M186 112 V98 Q194 90 202 98 V112 Z" fill="url(#gTurq)" ${THIN}/>` +
        `<rect x="120" y="112" width="84" height="14" fill="#c69260"/>` + glow(162, 70, 44, 0.35) +
        `<path d="M162 36 V128 M118 82 H206" stroke="#8b5328" stroke-width="5"/><rect x="118" y="36" width="88" height="92" rx="4" fill="none" stroke="#8b5328" stroke-width="6"/>` +
        `<path d="M104 30 C112 70 102 110 112 138 L124 138 C118 100 126 64 120 30 Z M220 30 C212 70 222 110 212 138 L200 138 C206 100 198 64 204 30 Z" fill="url(#gRose)" ${THIN}/>` +
        `<path d="M98 30 H226" stroke="#8b5328" stroke-width="4" stroke-linecap="round"/>` +
        `<rect x="112" y="128" width="100" height="8" rx="2" fill="url(#gWood)" ${THIN}/>` + geranium(140, 130, 0.7) + geranium(186, 130, 0.7)
      : `<rect x="118" y="36" width="88" height="92" rx="4" fill="#8a8478" ${O}/><path d="M162 36 V128 M118 82 H206" stroke="#5a4a3a" stroke-width="5"/>` +
        `<path d="M128 48 l20 26 M176 92 l18 24" stroke="#f4f0e6" stroke-width="1.4" opacity=".7"/>` + plank(110, 58, 104, 10) + cobweb(206, 36, 0.8, true),
  shelf: (d) =>
    `<path d="M242 120 V66 Q242 42 270 42 H312 Q340 42 340 66 V120 Z" fill="${d ? '#e8d6b8' : '#b8aa94'}" ${O}/><rect x="236" y="120" width="110" height="8" rx="2" fill="${d ? 'url(#gWood)' : '#8a7a6a'}" ${THIN}/>` +
    (d
      ? photo(262, 120, 24, 20, PIC_HOUSE) + photo(291, 120, 26, 32, PIC_POND) + photo(320, 120, 20, 18, PIC_HEART) +
        `<path d="M330 92 q-6 -8 0 -14" fill="none" stroke="#3f8a2a" stroke-width="1.6"/>` + sparkle(336, 56, 5)
      : dustPile(290, 120) + cobweb(340, 42, 0.6, true)),
  kitchen: (d) =>
    d
      ? `<rect x="14" y="58" width="84" height="6" rx="2" fill="url(#gWood)" ${THIN}/>` +
        [['#f6c945', 26], ['#9a2c0b', 44], ['#e07b1d', 62], ['#3f8a2a', 80]].map(([c, x]) => `<rect x="${Number(x) - 6}" y="40" width="12" height="18" rx="2" fill="url(#gGlass)" ${THIN} stroke-width="1"/><rect x="${Number(x) - 5}" y="46" width="10" height="11" fill="${c}" opacity=".8"/><rect x="${Number(x) - 6}" y="37" width="12" height="4" rx="1" fill="url(#gWood)" ${THIN} stroke-width=".8"/>`).join('') +
        `<path d="M82 70 V80" stroke="${INK}" stroke-width="1.4"/><path d="M72 80 H92 C92 92 72 92 72 80 Z" fill="url(#gCopper)" ${THIN}/>` +
        `<rect x="10" y="118" width="94" height="52" fill="url(#gCream)" ${O}/><rect x="8" y="112" width="98" height="8" rx="2" fill="url(#gWoodDark)" ${THIN}/>` +
        `<path d="M57 120 V170" stroke="${INK}" stroke-width="1.6"/><circle cx="51" cy="146" r="2" fill="${INK}"/><circle cx="63" cy="146" r="2" fill="${INK}"/>` +
        `<rect x="16" y="104" width="36" height="8" rx="2" fill="url(#gSteel)" ${THIN}/>` + teapot(34, 92, 0.42, 'url(#gTurq)') + estekan(80, 104, 0.32, true)
      : `<rect x="10" y="118" width="94" height="52" fill="#8a7a6a" ${O}/><rect x="8" y="112" width="98" height="8" rx="2" fill="#6a5a4a" ${THIN}/>` +
        `<rect x="12" y="122" width="40" height="44" fill="#7a6a5a" ${THIN} transform="rotate(-14 12 122)"/>` + plank(14, 60, 80, 16) + cobweb(0, 0, 1),
  carpet: (d) =>
    d
      ? `<path d="M96 184 H272 L292 226 H76 Z" fill="url(#gCarpet)" ${O}/><path d="M103 189 H265 L281 221 H87 Z" fill="none" stroke="#f6c945" stroke-width="2"/>` +
        `<ellipse cx="184" cy="205" rx="36" ry="10" fill="url(#gNavy)" ${THIN}/><ellipse cx="184" cy="205" rx="16" ry="5" fill="#e0303f" ${THIN} stroke-width="1"/>` +
        Array.from({ length: 22 }, (_, i) => `<path d="M${80 + i * 10} 226 v5" stroke="#f4f0e6" stroke-width="1.6"/>`).join('')
      : dustPile(150, 212) + dustPile(244, 206),
  sacks: (d) =>
    d
      ? `<rect x="290" y="146" width="50" height="38" rx="12" fill="url(#gRed)" ${O}/><path d="M296 165 H334" stroke="#f6c945" stroke-width="2" stroke-dasharray="4 3"/>` +
        `<rect x="196" y="174" width="72" height="10" rx="3" fill="url(#gWood)" ${O}/><path d="M204 184 V196 M260 184 V196" ${O} stroke-width="4"/>` +
        `<path d="M216 174 H248 C246 164 218 164 216 174 Z" fill="url(#gTurq)" ${THIN}/>` + [[224, 166], [232, 163], [240, 166]].map(([x, y]) => walnut(x, y)).join('')
      : sack(170, 222, 1.1) + sack(214, 216) + sack(256, 222, 1.2) + sack(300, 214, 0.9) + sack(332, 224) +
        [[150, 226], [190, 230], [236, 228], [280, 232]].map(([x, y]) => walnut(x, y)).join(''),
};

// ------------------------------------------------------------------ حنابندان

const hennaBase = () =>
  `<rect width="360" height="70" fill="#2a2350"/>` + stars(14, 52) + `<circle cx="306" cy="28" r="12" fill="#fff6d0"/><circle cx="312" cy="24" r="11" fill="#2a2350"/>` +
  `<rect y="60" width="360" height="90" fill="#9a7452"/>` + Array.from({ length: 6 }, (_, i) => `<path d="M0 ${74 + i * 14} H360" stroke="#7a5638" stroke-width="1.2" opacity=".6"/>`).join('') +
  `<rect y="56" width="360" height="6" fill="#7a5638"/>` + floor('#a8805a', 150);

const HENNA: Record<string, Layer> = {
  daf: (d) =>
    d
      ? [[284, 98, 26], [330, 112, 18]].map(([x, y, r]) => `<path d="M${x} ${y - r} L${x} ${y - r - 10}" stroke="${INK}" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="${r}" fill="#f2e2b8" ${O}/>` +
          `<circle cx="${x}" cy="${y}" r="${r - 4}" fill="none" stroke="#c9a26b" stroke-width="1.6"/>` +
          Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `<circle cx="${x + Math.cos(a) * (r - 7)}" cy="${y + Math.sin(a) * (r - 7)}" r="1.8" fill="none" stroke="#b7801c" stroke-width="1"/>`; }).join('')).join('')
      : `<circle cx="284" cy="98" r="26" fill="#7a6a5a" ${O}/><path d="M266 84 L292 112 M296 80 L282 108" stroke="${INK}" stroke-width="1.4"/>`,
  khoncha: (d) =>
    `<rect x="12" y="150" width="134" height="10" rx="2" fill="url(#gWood)" ${O}/><path d="M18 160 V196 M140 160 V196" ${O} stroke-width="4"/>` +
    (d ? `<rect x="14" y="146" width="130" height="6" fill="#c0392b" ${THIN}/>` + item(6, 38, 150, 0.4) + item(6, 79, 150, 0.46) + item(6, 120, 150, 0.4) : dustPile(78, 150) + plank(26, 140, 70, -8)),
  sweets: (d) =>
    `<rect x="250" y="150" width="100" height="10" rx="2" fill="url(#gWood)" ${O}/><path d="M258 160 V196 M342 160 V196" ${O} stroke-width="4"/>` +
    [274, 326].map((x) => `<ellipse cx="${x}" cy="148" rx="20" ry="5" fill="url(#gSilver)" ${THIN}/>`).join('') +
    (d
      ? [[266, 142], [276, 142], [286, 142], [270, 136], [281, 136], [276, 131]].map(([x, y]) => `<ellipse cx="${x - 2}" cy="${y}" rx="5" ry="3.4" fill="#f2d9a0" ${THIN} stroke-width=".8"/>`).join('') +
        [[316, 142], [326, 142], [336, 142], [321, 136], [331, 136]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.6" fill="#fff6e0" ${THIN} stroke-width=".8"/><circle cx="${x}" cy="${y}" r="1" fill="#e2507a"/>`).join('') +
        teapot(300, 128, 0.36, 'url(#gCream)')
      : ''),
  henna: (d) =>
    `<ellipse cx="192" cy="202" rx="54" ry="15" fill="${d ? 'url(#gRed)' : '#7a5a4a'}" ${O}/>` +
    (d ? `<path d="M142 202 q50 20 100 0" fill="none" stroke="#f6c945" stroke-width="2"/>` + item(3, 192, 206, 0.72) + glow(192, 176, 40, 0.5)
      : `<path d="M178 190 H206 C204 200 199 202 192 202 C185 202 180 200 178 190 Z" fill="#9a8a7a" ${THIN}/>`),
  candles: (d) =>
    d
      ? stringLights(62, ['#ffd36b', '#ff7a9c', '#ffd36b', '#9be36b']) + lantern(60, 70) + lantern(220, 70) +
        [[130, 216], [152, 226], [232, 226], [254, 216]].map(([x, y]) => `<rect x="${x - 3}" y="${y - 14}" width="6" height="14" rx="1.5" fill="#fffdf6" ${THIN} stroke-width="1"/><path d="M${x} ${y - 24} q4 6 0 10 q-4 -4 0 -10 Z" fill="url(#gFire)"/>` + glow(x, y - 18, 14, 0.7)).join('')
      : darkness(0.4),
};

// ------------------------------------------------------------------ پیکان عروس

const garage = () =>
  wall('#cfc6b4') + floor('#8f897d') +
  `<rect x="16" y="40" width="74" height="56" fill="#b39a74" ${THIN}/>` + Array.from({ length: 18 }, (_, i) => `<circle cx="${24 + (i % 6) * 12}" cy="${48 + Math.floor(i / 6) * 18}" r="1.4" fill="#6a5440"/>`).join('') +
  `<path d="M30 52 V80 M26 52 h8" stroke="#7f8a99" stroke-width="3" stroke-linecap="round"/><path d="M52 50 V84" stroke="#8b5328" stroke-width="4" stroke-linecap="round"/><rect x="46" y="48" width="12" height="7" rx="1" fill="#7f8a99" ${THIN} stroke-width="1"/>` +
  `<path d="M72 54 l8 26" stroke="#e0303f" stroke-width="4" stroke-linecap="round"/>` +
  `<rect x="298" y="28" width="46" height="26" fill="#bfe9ff" ${THIN}/><path d="M321 28 V54" stroke="${INK}" stroke-width="1.5"/>`;

const CAR_BODY = 'M70 168 Q70 150 86 148 L120 146 L146 112 H222 L248 146 L290 150 Q304 154 302 172 V190 H70 Z';

const PAYKAN: Record<string, Layer> = {
  paint: (d) =>
    `<ellipse cx="186" cy="212" rx="132" ry="8" fill="rgba(0,0,0,.18)"/>` +
    `<path d="${CAR_BODY}" fill="${d ? '#fbfbf6' : '#9a7656'}" ${O}/>` +
    `<path d="M152 118 H184 V146 H130 Z M190 118 H218 L240 146 H190 Z" fill="${d ? 'url(#gGlass)' : '#6f6a60'}" ${THIN}/>` +
    `<path d="M188 148 V188" stroke="${INK}" stroke-width="1.6"/><path d="M74 166 H298" stroke="${d ? '#c9d1dc' : '#6a5440'}" stroke-width="3"/>` +
    `<rect x="198" y="154" width="14" height="4" rx="2" fill="${d ? 'url(#gSilver)' : '#5a4a3a'}" ${THIN} stroke-width="1"/>` +
    `<rect x="56" y="178" width="24" height="10" rx="3" fill="${d ? 'url(#gSilver)' : '#6a6a6a'}" ${THIN}/><rect x="292" y="178" width="22" height="10" rx="3" fill="${d ? 'url(#gSilver)' : '#6a6a6a'}" ${THIN}/>` +
    `<rect x="72" y="154" width="8" height="10" rx="2" fill="#e0303f" ${THIN} stroke-width="1"/>` +
    (d ? shine(170, 158, 34, 4, 0, 0.6) + sparkle(132, 104, 6) + sparkle(300, 134, 5)
      : [[100, 160, 5], [160, 176, 4], [230, 170, 6], [276, 160, 4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#7a4a2a" opacity=".8"/>`).join('') + cobweb(146, 112, 0.7, true) +
        `<path d="M150 112 H220" stroke="#b8aa94" stroke-width="3" opacity=".8"/>`),
  tires: (d) =>
    [120, 250].map((x) => d
      ? `<circle cx="${x}" cy="190" r="22" fill="#2a2a2a" ${O}/><circle cx="${x}" cy="190" r="10" fill="url(#gSilver)" ${THIN}/><circle cx="${x}" cy="190" r="3" fill="${INK}"/>`
      : `<ellipse cx="${x}" cy="198" rx="25" ry="14" fill="#3a3a3a" ${O}/><ellipse cx="${x}" cy="197" rx="9" ry="6" fill="#7a7a7a" ${THIN}/>`).join(''),
  engine: (d) =>
    d
      ? `<path d="M302 154 L360 134 V188 L302 168 Z" fill="#fff6a8" opacity=".35"/>` + glow(300, 160, 26, 0.8) + `<circle cx="298" cy="160" r="6" fill="#fff6a8" ${THIN}/>` +
        `<path d="M54 182 q-10 -4 -16 -12 M52 188 q-14 0 -22 -6" fill="none" stroke="#9aa4b0" stroke-width="2" stroke-linecap="round"/>`
      : `<path d="M248 146 L264 100 L312 112 L302 150 Z" fill="#7a5e44" ${O}/><circle cx="298" cy="160" r="6" fill="#5a5a50" ${THIN}/>` +
        [[284, 92, 10], [298, 80, 8], [272, 82, 7]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#a8a8a0" opacity=".7"/>`).join(''),
  flowers: (d) =>
    d
      ? `<path d="M254 147 Q276 126 298 151 Z" fill="url(#gLeaf)" ${THIN}/>` +
        [[262, 142], [272, 136], [283, 137], [291, 144], [268, 145], [279, 144], [287, 149]].map(([x, y], i) => rose(x, y, 4.4, ROSES[i % 5])).join('') +
        [[258, 132], [276, 126], [294, 136]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2" ry="4.5" fill="#fffdf6" ${THIN} stroke-width=".7"/>`).join('')
      : `<path d="M322 186 H350 L346 214 H326 Z" fill="url(#gSteel)" ${O}/><path d="M330 186 q-6 -14 -14 -12 M338 186 q2 -18 12 -18 M334 186 q-2 -10 -10 -4" fill="none" stroke="#8a6a3a" stroke-width="2"/>`,
  ribbons: (d) =>
    d
      ? `<path d="M150 112 Q108 122 78 150 M220 112 Q262 116 290 152" fill="none" stroke="#ff7a9c" stroke-width="3"/>` +
        `<path d="M184 110 q-16 -14 -22 0 q10 4 22 0 q16 -14 22 0 q-10 4 -22 0" fill="url(#gRose)" ${THIN}/><circle cx="184" cy="110" r="4" fill="url(#gRoseDeep)" ${THIN}/>` +
        `<path d="M0 14 Q180 34 360 14" fill="none" stroke="${INK}" stroke-width="1.2"/>` +
        Array.from({ length: 12 }, (_, i) => { const x = 14 + i * 30; const y = 14 + Math.sin((x / 360) * Math.PI) * 15; return `<path d="M${x - 7} ${y} L${x + 7} ${y} L${x} ${y + 14} Z" fill="${['#ff7a9c', '#fffdf6', '#f6c945'][i % 3]}" ${THIN} stroke-width=".8"/>`; }).join('')
      : `<circle cx="34" cy="214" r="10" fill="url(#gRose)" ${THIN}/><circle cx="34" cy="214" r="3" fill="#fffdf6" ${THIN} stroke-width=".8"/><path d="M44 216 q14 -8 10 6 q-6 10 8 6" fill="none" stroke="#ff7a9c" stroke-width="2.4"/>`,
};

// ------------------------------------------------------------------ عروسی در باغ

const nightGarden = () =>
  `<rect width="360" height="160" fill="#2a2f5a"/>` + stars(18, 70) + `<circle cx="300" cy="34" r="13" fill="#fff6d0"/><circle cx="306" cy="30" r="12" fill="#2a2f5a"/>` +
  [[24, 120, 36], [74, 130, 30], [292, 128, 32], [342, 118, 38]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.9}" fill="#1f4a2a"/>`).join('') +
  [112, 250].map((x) => `<path d="M${x} 160 C${x - 14} 130 ${x - 8} 90 ${x} 56 C${x + 8} 90 ${x + 14} 130 ${x} 160 Z" fill="#183d22"/>`).join('') +
  `<rect y="158" width="360" height="82" fill="#3f6a34"/><path d="M150 240 L168 160 H192 L210 240 Z" fill="#c9b89a" opacity=".85"/>`;

const ARCH_PTS = Array.from({ length: 13 }, (_, i) => { const a = Math.PI + (i / 12) * Math.PI; return [180 + Math.cos(a) * 36, 96 + Math.sin(a) * 36]; });

const GARDENWED: Record<string, Layer> = {
  arch: (d) =>
    d
      ? stringLights(30, ['#ffd36b', '#fff6d0', '#ff9ec4', '#ffd36b']) + glow(180, 100, 60, 0.4) +
        `<path d="M144 166 V96 A36 36 0 0 1 216 96 V166" fill="none" stroke="#f4f0e6" stroke-width="6"/>` +
        ARCH_PTS.map(([x, y], i) => `<ellipse cx="${x + 4}" cy="${y + 2}" rx="4" ry="2.4" fill="url(#gLeaf)"/>` + rose(x, y, 5, ROSES[i % 5])).join('') +
        [118, 136, 154].map((y, i) => rose(144, y, 4, ROSES[(i + 2) % 5]) + rose(216, y + 6, 4, ROSES[(i + 3) % 5])).join('')
      : `<path d="M146 166 L140 100" stroke="#8a7a6a" stroke-width="5"/><path d="M214 166 L222 110" stroke="#8a7a6a" stroke-width="5"/><path d="M140 100 Q150 70 178 64" fill="none" stroke="#8a7a6a" stroke-width="5"/>` +
        `<path d="M142 140 q8 -6 4 -16 M218 136 q-8 -4 -2 -14" fill="none" stroke="#6b4a2a" stroke-width="1.6"/>`,
  seats: (d) =>
    d
      ? `<ellipse cx="180" cy="168" rx="40" ry="7" fill="url(#gGold)" ${THIN}/>` +
        `<path d="M156 162 V136 Q156 122 172 124 Q180 116 188 124 Q204 122 204 136 V162 Z" fill="#fffdf6" ${O}/><path d="M162 132 Q180 124 198 132" fill="none" stroke="#f6c945" stroke-width="2"/>` +
        `<rect x="152" y="148" width="56" height="12" rx="5" fill="url(#gRose)" ${O}/>` + sparkle(214, 128, 5)
      : `<path d="M154 166 C152 140 162 126 180 126 C198 126 208 140 206 166 Z" fill="#9a9aa8" ${O}/><path d="M164 150 q16 6 32 0" fill="none" stroke="#7a7a88" stroke-width="1.4"/>`,
  dinner: (d) =>
    `<rect x="12" y="160" width="112" height="10" rx="2" fill="${d ? '#fffdf6' : '#8a7a6a'}" ${O}/><path d="M20 170 V206 M116 170 V206" ${O} stroke-width="4"/>` +
    (d
      ? `<path d="M12 170 q14 10 28 0 q14 10 28 0 q14 10 28 0 q14 10 28 0" fill="#fffdf6" ${THIN}/>` +
        `<ellipse cx="38" cy="158" rx="16" ry="4" fill="url(#gSilver)" ${THIN}/><path d="M26 158 Q38 140 50 158 Z" fill="#fffdf6" ${THIN}/><path d="M32 148 Q38 142 44 148 Z" fill="#f6c945"/>` +
        `<ellipse cx="74" cy="158" rx="16" ry="4" fill="url(#gSilver)" ${THIN}/>` + [152, 156].map((y) => `<rect x="62" y="${y - 2}" width="24" height="4" rx="2" fill="#8f4f17" ${THIN} stroke-width=".8"/>`).join('') +
        `<path d="M92 158 H120 L116 150 H96 Z" fill="url(#gBlue)" ${THIN}/>` + [100, 106, 112].map((x) => `<circle cx="${x}" cy="148" r="3.4" fill="#8a5a2a" ${THIN} stroke-width=".8"/>`).join('') +
        `<path d="M40 206 H86 L82 224 H44 Z" fill="url(#gWicker)" ${O}/>` + sangak(43, 196, 40, 13) + glow(68, 150, 40, 0.3)
      : `<rect x="40" y="186" width="30" height="20" fill="#7a6a5a" ${THIN}/><rect x="74" y="190" width="26" height="16" fill="#6a5a4a" ${THIN}/>`),
  music: (d) =>
    `<rect x="242" y="168" width="108" height="12" fill="${d ? 'url(#gWoodDark)' : '#6a5a4a'}" ${O}/>` +
    (d
      ? g(`<path d="M-8 0 C-14 -6 -12 -14 -4 -15 C-1 -12 1 -12 4 -15 C12 -14 14 -6 8 0 C14 6 10 16 0 16 C-10 16 -14 6 -8 0 Z" fill="url(#gWood)" ${THIN}/><path d="M0 -14 V-50" ${O} stroke-width="3"/><path d="M-3 -50 h6" ${THIN}/>`, 'translate(270 150) rotate(-8)') +
        g(`<path d="M0 16 C-14 16 -14 -4 0 -10 C14 -4 14 16 0 16 Z" fill="url(#gWood)" ${THIN}/><path d="M0 -10 V-50" ${O} stroke-width="3"/><circle cx="0" cy="4" r="3" fill="#3b2216"/>`, 'translate(320 150) rotate(8)') +
        `<path d="M292 116 v-12 l8 -3 v12" fill="none" stroke="#fff6d0" stroke-width="1.8"/><circle cx="290" cy="116" r="2.6" fill="#fff6d0"/><circle cx="298" cy="113" r="2.6" fill="#fff6d0"/>`
      : `<path d="M256 168 q10 -12 22 -2 t24 -4 t20 6" fill="none" stroke="#2a2a2a" stroke-width="2"/>`),
  pool: (d) =>
    `<ellipse cx="180" cy="210" rx="76" ry="18" fill="url(#gTurq)" ${O}/>` +
    (d
      ? `<ellipse cx="180" cy="210" rx="66" ry="13" fill="url(#gWater)" ${THIN}/>` +
        Array.from({ length: 16 }, (_, i) => `<ellipse cx="${128 + (i * 37) % 104}" cy="${204 + (i * 7) % 12}" rx="2.6" ry="1.6" fill="${ROSES[i % 5]}" transform="rotate(${i * 40} ${128 + (i * 37) % 104} ${204 + (i * 7) % 12})"/>`).join('') +
        `<path d="M180 208 V184 M180 186 q-14 -6 -22 14 M180 186 q14 -6 22 14" fill="none" stroke="#e6f7ff" stroke-width="2" opacity=".85"/>` + glow(180, 196, 30, 0.4)
      : `<ellipse cx="180" cy="210" rx="66" ry="13" fill="#9a8a70" ${THIN}/>` +
        Array.from({ length: 8 }, (_, i) => `<ellipse cx="${134 + i * 12}" cy="${206 + (i % 3) * 3}" rx="3.4" ry="1.8" fill="#8a5a2a" transform="rotate(${i * 50} ${134 + i * 12} ${206 + (i % 3) * 3})"/>`).join('')),
};

// ------------------------------------------------------------------ پاتختی

const gift = (x: number, base: number, w: number, h: number, box: string) =>
  `<rect x="${x - w / 2}" y="${base - h}" width="${w}" height="${h}" fill="${box}" ${THIN}/><path d="M${x} ${base - h} V${base}" stroke="#fffdf6" stroke-width="3"/>` +
  `<path d="M${x} ${base - h} q-8 -8 -11 -1 q5 3 11 1 q8 -8 11 -1 q-5 3 -11 1" fill="#fffdf6" ${THIN} stroke-width=".8"/>`;

const PATAKHTI: Record<string, Layer> = {
  album: (d) =>
    d
      ? photo(262, 74, 34, 28, PIC_CAR) + photo(306, 82, 30, 36, PIC_ARCH) + photo(270, 112, 26, 22, PIC_HOUSE) + photo(312, 116, 28, 24, PIC_HEART) + sparkle(338, 44, 5)
      : [[262, 74, 34, 28], [306, 82, 30, 36], [270, 112, 26, 22], [312, 116, 28, 24]].map(([x, b, w, h]) => `<rect x="${x - w / 2}" y="${b - h}" width="${w}" height="${h}" fill="none" stroke="#b8aa94" stroke-width="1.6" stroke-dasharray="3 3"/>`).join(''),
  gifts: (d) =>
    d
      ? gift(30, 196, 30, 26, 'url(#gRed)') + gift(64, 196, 34, 34, 'url(#gBlue)') + gift(46, 170, 24, 20, 'url(#gYellow)') + gift(96, 196, 22, 18, 'url(#gRose)') +
        `<path d="M74 162 C70 146 76 134 84 132 H92 C100 134 106 146 102 162 Z" fill="#b8945a" ${THIN}/><path d="M80 134 q8 -6 16 0" fill="none" stroke="#8a6a3a" stroke-width="2"/>` + walnut(110, 194) + walnut(116, 190) +
        [140, 134, 128].map((y) => `<ellipse cx="22" cy="${y}" rx="14" ry="3.4" fill="#fffdf6" ${THIN} stroke-width="1"/><path d="M12 ${y} h20" stroke="#3a76c4" stroke-width="1" opacity=".7"/>`).join('')
      : `<rect x="36" y="168" width="40" height="28" fill="#9a8a76" ${THIN}/>` + dustPile(60, 198),
  tea: (d) =>
    `<ellipse cx="312" cy="200" rx="40" ry="9" fill="${d ? 'url(#gBrass)' : '#8a7a6a'}" ${O}/>` +
    (d
      ? glow(312, 150, 40, 0.4) + `<g transform="translate(280 128) scale(.64)">${samovar('url(#gBrass)', true)}</g>` + estekan(286, 196, 0.3, true) + estekan(342, 196, 0.3, true)
      : `<g transform="translate(280 128) scale(.64)" opacity=".75" style="filter:grayscale(1)">${samovar('url(#gSteel)')}</g>`),
  sofreh: (d) =>
    d
      ? `<path d="M118 190 H250 L262 214 H106 Z" fill="#fffdf6" ${O}/><path d="M118 190 H250 L262 214 H106 Z" fill="none" stroke="url(#gGold)" stroke-width="1.6" transform="translate(0 -1)"/>` +
        item(1, 140, 206, 0.24) + `<ellipse cx="184" cy="200" rx="18" ry="5" fill="url(#gSilver)" ${THIN}/>` +
        [[176, 194, '#e0303f'], [184, 191, '#f07b1d'], [192, 194, '#9be36b'], [184, 197, '#e0303f']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="4.6" fill="${c}" ${THIN} stroke-width=".8"/>`).join('') +
        `<ellipse cx="226" cy="204" rx="16" ry="4" fill="url(#gSilver)" ${THIN}/>` + [[218, 200], [226, 198], [234, 200]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="3" fill="#f2d9a0" ${THIN} stroke-width=".8"/>`).join('')
      : `<rect x="236" y="196" width="40" height="14" rx="3" fill="#e8dcc6" ${THIN}/><path d="M236 203 h40" stroke="#c9b89a" stroke-width="1.4"/>`,
  suitcase: (d) =>
    d
      ? `<path d="M14 210 L24 186 H80 L72 210 Z" fill="#5e3418" ${O}/>` +
        `<rect x="14" y="208" width="70" height="28" rx="4" fill="url(#gRed)" ${O}/><rect x="20" y="204" width="58" height="8" rx="2" fill="#fffdf6" ${THIN} stroke-width="1"/>` +
        `<rect x="30" y="195" width="20" height="10" rx="2" fill="url(#gTurq)" ${THIN} stroke-width="1"/>` +
        `<circle cx="70" cy="223" r="9" fill="#f6c945" ${THIN}/>` + text(70, 226, 'کاشان', 5, '#8e1230') + sparkle(92, 196, 5)
      : `<rect x="14" y="208" width="70" height="28" rx="4" fill="#7a5a4a" ${O}/><path d="M40 208 v-6 h18 v6" fill="none" ${THIN}/>` + dustPile(50, 236),
};

const flatBase = () => wall('#f3e6d0') + floor('#9a6a44') + NEST.window(true) + NEST.carpet(true);

export const SCENES13: Record<string, SceneDef> = {
  nest: { base: wall('#f3e6d0') + floor('#9a6a44'), order: ['window', 'shelf', 'kitchen', 'carpet', 'sacks'], layers: NEST },
  henna: { base: hennaBase(), order: ['daf', 'khoncha', 'sweets', 'henna', 'candles'], layers: HENNA },
  paykan: { base: garage(), order: ['paint', 'tires', 'engine', 'flowers', 'ribbons'], layers: PAYKAN },
  gardenwed: { base: nightGarden(), order: ['arch', 'seats', 'dinner', 'music', 'pool'], layers: GARDENWED },
  patakhti: { base: flatBase(), order: ['album', 'gifts', 'tea', 'sofreh', 'suitcase'], layers: PATAKHTI },
};
