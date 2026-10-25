// Season 24 («اول مهر») place scenes. Same contract as scenes.ts: each task layer is drawn
// "before" until done, then "after".

import { INK, O, THIN, estekan, sparkle } from './kit';
import { SCIENCE } from './chainsZ';
import { Layer, SceneDef, cobweb, dustPile, floor, glow, plank, sangak } from './scenes';
import { text } from './scenes3';

/** A chain drawing (100×100) placed with its bottom centre on (x, base), without its backdrop disc. */
const art = (src: string, x: number, base: number, s: number) =>
  `<g transform="translate(${x - 50 * s} ${base - 90 * s}) scale(${s})">${src.replace(/^<circle cx="50" cy="5\d" r="4\d"[^>]*\/>/, '')}</g>`;

/** A two-seat school bench (desk and seat in one), side view, standing on `base`. */
const bench = (x: number, base: number, w: number) =>
  `<rect x="${x}" y="${base - 34}" width="${w}" height="7" rx="2" fill="url(#gWood)" ${O}/><rect x="${x + 6}" y="${base - 18}" width="${w - 12}" height="6" rx="2" fill="url(#gWoodDark)" ${THIN}/>` +
  `<path d="M${x + 4} ${base - 27} V${base} M${x + w - 4} ${base - 27} V${base}" stroke="#3a3a3a" stroke-width="3"/>`;

const SCHOOL_WALL = '#e6ecef';

// ------------------------------------------------------------------ دبستان اقاقیا

const classBase = () => `<rect width="360" height="180" fill="#cfd4d6"/><rect width="360" height="20" fill="#bfc4c6"/>` + floor('#9a7a5a', 180);

const CLASSROOM: Record<string, Layer> = {
  paint: (d) =>
    d ? `<rect y="20" width="360" height="160" fill="#fbecb8"/><path d="M0 130 H360" stroke="#c9a26b" stroke-width="4"/><rect y="132" width="360" height="48" fill="#e8d6a0"/>`
      : [[60, 110, 26], [300, 60, 22]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.6}" fill="#b0b4b2" opacity=".8"/>`).join(''),
  roof: (d) =>
    d ? `<rect width="360" height="20" fill="#f4f0e6"/><path d="M0 20 H360" ${THIN}/>` + [90, 270].map((x) => `<path d="M${x} 20 V30" stroke="${INK}" stroke-width="1.4"/><rect x="${x - 26}" y="30" width="52" height="6" rx="3" fill="#fffdf6" ${THIN}/>` + glow(x, 40, 30, 0.35)).join('')
      : `<ellipse cx="120" cy="14" rx="40" ry="10" fill="#a08a60" opacity=".7"/><ellipse cx="260" cy="12" rx="30" ry="8" fill="#a08a60" opacity=".6"/>` +
        `<path d="M120 22 v6 M126 24 v10 M260 20 v8" stroke="#7cc8f0" stroke-width="2" stroke-dasharray="3 6"/><path d="M110 230 L114 210 H136 L140 230 Z" fill="url(#gSilver)" ${O}/><ellipse cx="125" cy="210" rx="11" ry="3" fill="url(#gWater)"/>`,
  windows: (d) =>
    [16, 290].map((x) => `<rect x="${x}" y="40" width="54" height="74" rx="3" fill="${d ? 'url(#gSky)' : '#9aa4a8'}" ${O}/>` +
      (d ? `<path d="M${x + 4} 60 q14 -10 26 0 q-12 8 -26 0 Z" fill="url(#gLeaf)" ${THIN} stroke-width=".8"/><path d="M${x + 12} 64 q-1 4 0 8 M${x + 20} 62 q-1 4 0 8" stroke="#fffdf6" stroke-width="2"/>`
        : `<path d="M${x + 8} 50 l18 22 M${x + 30} 46 l-6 30" stroke="${INK}" stroke-width="1.2"/><path d="M${x + 10} 96 l30 -10" stroke="#e8dcc6" stroke-width="6" opacity=".9"/>`) +
      `<path d="M${x + 27} 40 V114 M${x} 77 H${x + 54}" stroke="${d ? '#3a76c4' : '#6a6a6a'}" stroke-width="3"/>`).join(''),
  board: (d) =>
    `<rect x="92" y="40" width="176" height="82" rx="3" fill="url(#gWoodDark)" ${O}/>` +
    (d ? `<rect x="98" y="46" width="164" height="70" fill="#2f6a4a"/>` + text(180, 74, 'به کلاس سوم', 13, '#fffdf6') + text(180, 96, 'خوش اومدید!', 13, '#fff6d0') +
        `<path d="M104 122 H256" stroke="#8b5328" stroke-width="5"/><rect x="200" y="117" width="12" height="4" rx="1" fill="#fffdf6"/><rect x="216" y="117" width="10" height="4" rx="1" fill="#f6c945"/>` + sparkle(250, 52, 4)
      : `<rect x="98" y="46" width="164" height="70" fill="#5a6a60"/><path d="M110 60 q30 20 60 -4 M180 90 q30 -14 70 6" fill="none" stroke="#8a9a90" stroke-width="6" opacity=".7"/>`),
  benches: (d) =>
    d ? bench(30, 222, 80) + bench(140, 222, 80) + bench(250, 222, 80) + `<rect x="160" y="182" width="20" height="6" fill="#fffdf6" ${THIN} stroke-width="1"/>`
      : plank(40, 220, 70, -12) + plank(150, 226, 60, 8) + plank(250, 214, 80, -4) + dustPile(300, 232),
};

// ------------------------------------------------------------------ حیاط مدرسه

const yardBase = () =>
  `<rect width="360" height="110" fill="url(#gSky)"/>` +
  `<rect x="40" y="40" width="280" height="96" fill="${SCHOOL_WALL}" ${O}/><path d="M30 44 L180 18 L330 44 Z" fill="#9aa4b0" ${O}/>` +
  [70, 130, 230, 290].map((x) => `<rect x="${x - 14}" y="62" width="28" height="34" rx="2" fill="url(#gSky)" ${THIN}/><path d="M${x} 62 V96 M${x - 14} 79 H${x + 14}" stroke="#3a76c4" stroke-width="2"/>`).join('') +
  `<path d="M164 136 V104 Q164 92 180 92 Q196 92 196 104 V136 Z" fill="url(#gWoodDark)" ${O}/>` +
  `<rect y="134" width="360" height="106" fill="#c9b89a"/>`;

/** The mulberry tree in the yard (drawn over the paving). */
const yardTree = () =>
  `<path d="M28 214 C24 180 32 160 28 130" fill="none" stroke="#5a3a22" stroke-width="8" stroke-linecap="round"/>` + [[10, 124, 24], [44, 118, 26], [26, 98, 22]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gLeafDark)" ${THIN}/>`).join('');

const SCHOOLYARD: Record<string, Layer> = {
  paving: (d) =>
    (d ? `<rect y="134" width="360" height="106" fill="#c98a52"/>` + Array.from({ length: 8 }, (_, r) => `<path d="M0 ${146 + r * 13} H360" stroke="#a8683a" stroke-width="1.2"/>` + Array.from({ length: 13 }, (_, c) => `<path d="M${(c * 30 + (r % 2) * 15)} ${134 + r * 13} v13" stroke="#a8683a" stroke-width="1.2"/>`).join('')).join('')
      : [[80, 170], [140, 200], [230, 180], [300, 214], [190, 226], [110, 228]].map(([x, y], i) => `<rect x="${x}" y="${y}" width="14" height="8" fill="#b5804d" ${THIN} stroke-width="1" transform="rotate(${i * 25} ${x} ${y})"/>`).join('') + dustPile(260, 200)) + yardTree(),
  court: (d) =>
    d ? `<path d="M110 160 H250 L280 226 H80 Z" fill="none" stroke="#fffdf6" stroke-width="3"/><path d="M95 193 H265" stroke="#fffdf6" stroke-width="3"/><circle cx="210" cy="206" r="8" fill="url(#gRed)" ${THIN}/><path d="M204 202 q6 4 12 0" fill="none" stroke="#fff" stroke-width="1.4"/>`
      : '',
  hopscotch: (d) =>
    d ? [[300, 226], [300, 210], [292, 194], [308, 194], [300, 178], [300, 162]].map(([x, y], i) => `<rect x="${x - 8}" y="${y - 14}" width="16" height="14" fill="none" stroke="${['#ff7a9c', '#f6c945', '#5fe0e0', '#9be36b', '#c58bff', '#ff7a9c'][i]}" stroke-width="2.4"/>` + text(x, y - 3, '۱۲۳۴۵۶'[i], 8, '#fffdf6')).join('')
      : '',
  fountain: (d) =>
    d ? `<rect x="62" y="176" width="56" height="30" fill="url(#gTurq)" ${O}/><rect x="58" y="172" width="64" height="6" rx="2" fill="#e6ecef" ${THIN}/>` + [74, 90, 106].map((x) => `<path d="M${x} 172 V164 h5" fill="none" stroke="url(#gSilver)" stroke-width="3"/><path d="M${x} 172 V164 h5" fill="none" stroke="#9aa4b0" stroke-width="2.4"/><path d="M${x + 5} 166 q2 4 0 6" stroke="#7cc8f0" stroke-width="1.6" fill="none"/>`).join('')
      : `<path d="M86 206 V184 q0 -6 6 -6 h6" fill="none" stroke="#8a5a3a" stroke-width="4"/><ellipse cx="92" cy="208" rx="16" ry="4" fill="#9a8a76" opacity=".6"/>`,
  bell: (d) =>
    `<path d="M210 100 H226 V108" fill="none" stroke="${INK}" stroke-width="3"/>` +
    (d ? `<path d="M218 108 Q208 110 208 124 L206 130 H230 L228 124 Q228 110 218 108 Z" fill="url(#gBrass)" ${O}/><circle cx="218" cy="133" r="3" fill="url(#gBrass)" ${THIN} stroke-width="1"/><path d="M228 124 Q236 140 232 156" fill="none" stroke="#c0392b" stroke-width="1.6"/>` +
        `<path d="M236 112 q6 6 0 12 M242 108 q8 10 0 20" fill="none" stroke="${INK}" stroke-width="1.2" opacity=".6"/>`
      : ''),
};

// ------------------------------------------------------------------ آزمایشگاه مدرسه

const labBase = () => `<rect width="360" height="170" fill="#dbe8ee"/>` + floor('#b8c0c4', 170) + `<rect x="150" y="20" width="60" height="80" rx="3" fill="url(#gSky)" ${O}/><path d="M180 20 V100 M150 60 H210" stroke="#6a7a8a" stroke-width="3"/>`;

const labTable = (x: number, w: number) =>
  `<rect x="${x}" y="176" width="${w}" height="8" rx="2" fill="#2a2a2a" ${O}/><rect x="${x + 6}" y="184" width="${w - 12}" height="40" fill="url(#gWood)" ${O}/><path d="M${x + w / 2} 184 V224" stroke="#8b5328" stroke-width="1.6"/>` +
  [x + 14, x + w - 14].map((sx) => `<path d="M${sx} 240 V228" stroke="#3a3a3a" stroke-width="3"/><ellipse cx="${sx}" cy="228" rx="9" ry="3" fill="#3a76c4" ${THIN} stroke-width="1"/>`).join('');

const LAB: Record<string, Layer> = {
  tables: (d) =>
    d ? labTable(20, 140) + labTable(200, 140)
      : `<rect x="20" y="180" width="140" height="44" fill="#8a8a80" ${O}/><path d="M20 180 Q60 168 90 182 T160 178" fill="#c9c0b0" ${THIN}/><rect x="200" y="180" width="140" height="44" fill="#8a8a80" ${O}/><path d="M200 180 Q240 170 270 184 T340 178" fill="#c9c0b0" ${THIN}/>`,
  shelf: (d) =>
    `<rect x="236" y="24" width="110" height="110" fill="url(#gWoodDark)" ${O}/>` + [58, 96, 132].map((y) => `<path d="M236 ${y} H346" stroke="#8b5328" stroke-width="3"/>`).join('') +
    (d ? [[252, 56, '#e0303f'], [272, 56, '#4aa86a'], [294, 56, '#3a76c4'], [318, 56, '#f6c945'], [256, 94, '#7a6ad0'], [282, 94, '#2aa8a8'], [310, 94, '#e0703f'], [332, 94, '#4aa86a'], [262, 130, '#3a76c4'], [300, 130, '#e0303f'], [326, 130, '#f6c945']].map(([x, y, c]) =>
          `<rect x="${Number(x) - 7}" y="${Number(y) - 22}" width="14" height="22" rx="2" fill="url(#gGlass)" ${THIN} stroke-width="1"/><rect x="${Number(x) - 6}" y="${Number(y) - 12}" width="12" height="11" fill="${c}" opacity=".8"/>`).join('')
      : cobweb(236, 24, 0.7) + dustPile(290, 130)),
  microscope: (d) => (d ? art(SCIENCE[4], 70, 178, 0.6) : ''),
  planets: (d) =>
    d ? `<path d="M120 0 V14 M60 14 H180" stroke="${INK}" stroke-width="1.4"/>` + [[60, 40, 6, '#3a76c4'], [86, 54, 5, '#e0703f'], [120, 34, 14, '#f6c945'], [150, 50, 8, '#c9a26b'], [176, 38, 4, '#a8a8a0']].map(([x, y, r, c]) => `<path d="M${x} 14 V${Number(y) - Number(r)}" stroke="${INK}" stroke-width=".8"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${THIN} stroke-width="1"/>`).join('') +
        `<ellipse cx="150" cy="50" rx="13" ry="3" fill="none" stroke="#a8784a" stroke-width="1.6"/>`
      : '',
  volcano: (d) =>
    d ? `<path d="M240 176 L262 136 H278 L300 176 Z" fill="#a0603a" ${O}/><path d="M262 136 Q270 120 278 136 Z" fill="#e0303f" ${THIN}/>` +
        `<path d="M262 138 Q252 150 256 162 M278 138 Q290 148 286 160" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` + [[264, 118], [276, 112], [270, 104]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#fff" ${THIN} stroke-width=".8"/>`).join('') + sparkle(296, 112, 5)
      : '',
};

// ------------------------------------------------------------------ شب رصد

const nightBase = () =>
  `<rect width="360" height="200" fill="#1c1a40"/>` + Array.from({ length: 24 }, (_, i) => `<circle cx="${(i * 53) % 356 + 2}" cy="${(i * 37) % 110 + 6}" r="${i % 4 ? 1 : 1.6}" fill="#fff" opacity=".8"/>`).join('') +
  `<circle cx="272" cy="40" r="3" fill="#fff6d0"/>` + glow(272, 40, 10, 0.7) +
  `<path d="M0 150 H40 V120 H80 V140 H120 V110 H160 V150 H200 V128 H250 V146 H300 V116 H340 V150 H360 V200 H0 Z" fill="#2a2850" ${THIN}/>` +
  `<rect y="190" width="360" height="50" fill="#8a7a6a"/><path d="M0 190 H360" ${O}/>`;

const STARGAZING: Record<string, Layer> = {
  lights: (d) =>
    d ? `<path d="M-20 120 Q120 20 380 60" fill="none" stroke="#c8c0ff" stroke-width="26" opacity=".18"/>` + Array.from({ length: 30 }, (_, i) => `<circle cx="${(i * 41) % 356 + 2}" cy="${(i * 29) % 100 + 10}" r=".9" fill="#fff"/>`).join('')
      : `<rect y="60" width="360" height="100" fill="#f6a050" opacity=".25"/>` + [[52, 130], [92, 148], [132, 120], [212, 138], [262, 150], [312, 126]].map(([x, y]) => `<rect x="${x}" y="${y}" width="8" height="8" fill="#ffe08a"/>`).join(''),
  roof: (d) =>
    d ? `<path d="M0 182 H360" stroke="#c9952e" stroke-width="3"/>` + Array.from({ length: 19 }, (_, i) => `<path d="M${4 + i * 20} 182 V200" stroke="#c9952e" stroke-width="2"/>`).join('')
      : `<path d="M10 186 L60 180 M120 192 L170 184 M260 188 L300 182" stroke="#6a5a4a" stroke-width="3"/>`,
  blankets: (d) =>
    d ? `<path d="M30 212 H150 L160 236 H20 Z" fill="url(#gCarpet)" ${O}/><path d="M210 214 H330 L340 236 H200 Z" fill="#7a3a6a" ${O}/>` +
        `<rect x="36" y="200" width="26" height="16" rx="6" fill="url(#gNavy)" ${THIN}/><rect x="300" y="202" width="26" height="16" rx="6" fill="#f6c945" ${THIN}/>` + estekan(130, 222, 0.16, true, false)
      : '',
  telescope: (d) => (d ? art(SCIENCE[7], 180, 240, 0.9) : `<rect x="160" y="210" width="40" height="22" rx="3" fill="#6a6a6a" ${O}/>`),
  chart: (d) =>
    d ? `<path d="M286 240 L296 180 L306 240 M296 180 V240" fill="none" stroke="#8b5328" stroke-width="2.4"/><rect x="262" y="150" width="68" height="50" rx="3" fill="#0f1a3a" ${O}/>` +
        [[272, 162], [282, 170], [294, 166], [304, 176], [318, 170]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#fff6d0"/>`).join('') + `<path d="M272 162 L282 170 L294 166 L304 176 L318 170" fill="none" stroke="#fff6d0" stroke-width=".8"/>` +
        text(296, 194, 'دب اکبر', 7, '#fff6d0')
      : '',
};

// ------------------------------------------------------------------ اول مهر

const gateBase = () =>
  `<rect width="360" height="150" fill="url(#gSky)"/><rect y="40" width="360" height="130" fill="${SCHOOL_WALL}" ${O}/>` + text(180, 62, 'دبستان اقاقیا', 14, '#3a76c4') +
  `<rect y="166" width="360" height="74" fill="#c98a52"/>` + Array.from({ length: 5 }, (_, r) => `<path d="M0 ${180 + r * 14} H360" stroke="#a8683a" stroke-width="1.2"/>`).join('');

const FIRSTDAY: Record<string, Layer> = {
  gate: (d) =>
    `<rect x="120" y="74" width="120" height="96" fill="${d ? '#3a76c4' : '#6a6a6a'}" ${O}/>` + Array.from({ length: 7 }, (_, i) => `<path d="M${134 + i * 16} 74 V170" stroke="${d ? '#2a5aa8' : '#4a4a4a'}" stroke-width="3"/>`).join('') + `<path d="M180 74 V170" ${O}/>` +
    (d ? `<path d="M116 76 Q180 100 244 76" fill="none" stroke="#3f8a2a" stroke-width="5"/>` + [[124, 80], [148, 88], [172, 92], [196, 92], [220, 88], [240, 80]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="5" fill="${['#e0303f', '#f6c945', '#ff7a9c'][i % 3]}" ${THIN} stroke-width="1"/>`).join('') +
        [[106, 70, '#e0303f'], [254, 68, '#3a76c4'], [262, 84, '#f6c945']].map(([x, y, c]) => `<path d="M${x} ${Number(y) + 12} q2 20 -2 40" fill="none" stroke="${INK}" stroke-width=".8"/><ellipse cx="${x}" cy="${y}" rx="9" ry="11" fill="${c}" ${THIN}/>`).join('')
      : `<path d="M140 100 l8 10 M200 130 l10 -6" stroke="#8a5a3a" stroke-width="3"/>`),
  bags: (d) =>
    d ? `<rect x="14" y="196" width="96" height="6" rx="2" fill="url(#gWood)" ${O}/><path d="M20 202 V226 M104 202 V226" ${O} stroke-width="3"/>` +
        [[28, '#e0303f'], [56, '#3a76c4'], [84, '#f6c945']].map(([x, c]) => `<rect x="${Number(x) - 11}" y="172" width="22" height="24" rx="4" fill="${c}" ${O}/><path d="M${Number(x) - 6} 172 Q${x} 162 ${Number(x) + 6} 172" fill="none" ${THIN}/><rect x="${Number(x) - 6}" y="180" width="12" height="7" rx="2" fill="#fffdf6" ${THIN} stroke-width=".8"/>`).join('')
      : '',
  breakfast: (d) =>
    d ? `<rect x="250" y="196" width="100" height="6" rx="2" fill="#fffdf6" ${O}/><path d="M256 202 V230 M344 202 V230" ${O} stroke-width="3"/>` + sangak(256, 184, 40, 12) +
        `<ellipse cx="316" cy="194" rx="14" ry="4" fill="url(#gSilver)" ${THIN}/><rect x="308" y="186" width="12" height="7" fill="#fffdf6" ${THIN} stroke-width="1"/><circle cx="324" cy="190" r="3" fill="#a0724a"/>` + estekan(340, 194, 0.16, true, false)
      : '',
  bell: (d) =>
    d ? `<path d="M196 238 Q186 236 188 222 L184 214 H208 L204 222 Q206 236 196 238 Z" fill="url(#gBrass)" ${O} transform="rotate(180 196 226)"/><rect x="192" y="234" width="8" height="6" fill="url(#gWoodDark)"/>` +
        `<path d="M214 212 q6 4 4 12 M220 206 q10 8 6 20" fill="none" stroke="${INK}" stroke-width="1.2" opacity=".6"/>` + sparkle(176, 206, 4)
      : '',
  photo: (d) =>
    d ? `<path d="M136 240 L146 206 L156 240 M146 206 V240" fill="none" stroke="#3a3a44" stroke-width="2"/><rect x="134" y="192" width="24" height="16" rx="3" fill="#2a2a2a" ${THIN}/><circle cx="148" cy="200" r="4" fill="#7f8a99"/>` +
        `<rect x="128" y="10" width="104" height="22" rx="4" fill="url(#gRed)" ${O}/>` + text(180, 26, 'کلاس سوم', 11, '#fffdf6') + sparkle(130, 188, 6) + glow(140, 192, 16, 0.6)
      : '',
};

export const SCENES24: Record<string, SceneDef> = {
  acaciaschool: { base: classBase(), order: ['paint', 'roof', 'windows', 'board', 'benches'], layers: CLASSROOM },
  schoolyard: { base: yardBase(), order: ['paving', 'court', 'hopscotch', 'fountain', 'bell'], layers: SCHOOLYARD },
  sciencelab: { base: labBase(), order: ['shelf', 'planets', 'tables', 'microscope', 'volcano'], layers: LAB },
  stargazing: { base: nightBase(), order: ['lights', 'roof', 'blankets', 'telescope', 'chart'], layers: STARGAZING },
  firstday: { base: gateBase(), order: ['gate', 'bags', 'breakfast', 'bell', 'photo'], layers: FIRSTDAY },
};
