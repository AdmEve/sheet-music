// Season 7 («ارثیه‌ی آقا مرتضی») place scenes. Same contract as scenes.ts: each task layer is
// drawn "before" until done, then "after".

import { INK, O, THIN, sparkle } from './kit';
import { Layer, SceneDef, cobweb, dustPile, floor, glow, lantern, plank, stringLights } from './scenes';
import { darkness, text, wall } from './scenes3';

const leafy = (x: number, y: number, r: number) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gLeaf)" ${O}/><circle cx="${x - r * 0.4}" cy="${y + r * 0.2}" r="${r * 0.55}" fill="url(#gLeafDark)" opacity=".6"/>`;

/** A plane tree (chenar): pale mottled trunk and a wide crown. */
const chenar = (x: number, base: number, h: number, alive: boolean) =>
  `<path d="M${x - 5} ${base} C${x - 4} ${base - h * 0.5} ${x - 8} ${base - h * 0.7} ${x} ${base - h}" fill="none" stroke="${INK}" stroke-width="11"/>` +
  `<path d="M${x - 5} ${base} C${x - 4} ${base - h * 0.5} ${x - 8} ${base - h * 0.7} ${x} ${base - h}" fill="none" stroke="#d8cbb4" stroke-width="8"/>` +
  `<circle cx="${x - 3}" cy="${base - h * 0.4}" r="2" fill="#a89a80"/><circle cx="${x - 2}" cy="${base - h * 0.62}" r="2.4" fill="#a89a80"/>` +
  (alive
    ? leafy(x - 16, base - h - 4, h * 0.24) + leafy(x + 16, base - h - 2, h * 0.24) + leafy(x, base - h - 18, h * 0.28)
    : `<path d="M${x} ${base - h} l-16 -18 M${x} ${base - h} l14 -20 M${x - 6} ${base - h * 0.8} l-14 -6" ${O} stroke="#8a7a6a" stroke-width="3"/>`);

// ------------------------------------------------------------------ خونه‌باغ شمیرون

const GARDENHOUSE: Record<string, Layer> = {
  facade: (d) =>
    `<rect x="120" y="52" width="120" height="66" fill="${d ? 'url(#gTerracotta)' : '#8a7a6a'}" ${O}/>` +
    `<path d="M114 52 L180 30 L246 52 Z" fill="${d ? 'url(#gTurq)' : '#6a6a6a'}" ${O}/>` +
    [136, 158, 180, 202, 224].map((x) => `<path d="M${x - 7} 110 V82 Q${x} 72 ${x + 7} 82 V110 Z" fill="${d ? '#fff6c8' : '#4a4a4a'}" ${THIN} stroke-width="1.2"/>`).join('') +
    (d ? `<rect x="130" y="58" width="100" height="8" fill="url(#gBlue)" ${THIN}/>` : `<path d="M140 64 l20 30 M210 60 l-12 24" stroke="${INK}" stroke-width="1.6" opacity=".5"/>`),
  path: (d) =>
    `<path d="M150 118 L210 118 L290 240 L70 240 Z" fill="${d ? '#d6c3a0' : '#9a8a72'}"/>` +
    (d ? Array.from({ length: 6 }, (_, i) => `<path d="M${150 - i * 14} ${130 + i * 20} H${210 + i * 14}" stroke="#b8a07c" stroke-width="1.6"/>`).join('')
      : Array.from({ length: 14 }, (_, i) => `<path d="M${90 + (i * 37) % 180} ${150 + (i * 23) % 80} l-4 -14 m4 14 l6 -12" stroke="#5d7a2c" stroke-width="2.4" stroke-linecap="round"/>`).join('')),
  stream: (d) =>
    `<path d="M176 118 L184 118 L196 240 L164 240 Z" fill="${d ? 'url(#gWater)' : '#6a5a3a'}" ${THIN}/>` +
    (d ? `<path d="M178 150 q4 -3 6 0 M174 190 q6 -4 10 0 M172 226 q6 -4 12 0" fill="none" stroke="#fff" stroke-width="1.6" opacity=".8"/>` : ''),
  chenar: (d) =>
    [[104, 150, 62], [256, 150, 62], [96, 238, 150], [62, 240, 170], [264, 238, 150], [298, 240, 170]].map(([x, b, h]) => chenar(x, b, h, d)).join(''),
  gate: (d) =>
    `<rect x="0" y="40" width="26" height="200" fill="url(#gTerracotta)" ${O}/><rect x="334" y="40" width="26" height="200" fill="url(#gTerracotta)" ${O}/>` +
    `<rect x="-4" y="34" width="34" height="10" fill="url(#gClay)" ${O}/><rect x="330" y="34" width="34" height="10" fill="url(#gClay)" ${O}/>` +
    (d
      ? [[26, 1], [334, -1]].map(([x, dir]) => `<path d="M${x} 60 L${Number(x) + Number(dir) * 34} 70 L${Number(x) + Number(dir) * 34} 236 L${x} 236 Z" fill="none" stroke="${INK}" stroke-width="3"/>` +
          Array.from({ length: 5 }, (_, i) => `<path d="M${Number(x) + Number(dir) * (6 + i * 6)} 62 V236" stroke="#3b3b44" stroke-width="2"/>`).join('')).join('')
      : `<rect x="26" y="60" width="308" height="178" fill="#3b3b44" opacity=".85"/>` + Array.from({ length: 26 }, (_, i) => `<path d="M${32 + i * 12} 60 V238" stroke="#22222a" stroke-width="3"/>`).join('') +
        `<path d="M26 120 H334 M26 180 H334" stroke="#22222a" stroke-width="4"/><path d="M170 140 h20 v18 h-20 Z" fill="#6a5a4a" ${THIN}/>`),
};

// ------------------------------------------------------------------ حوضخانه

const POOLHOUSE: Record<string, Layer> = {
  tiles: (d) =>
    Array.from({ length: 36 }, (_, i) => {
      const x = (i % 12) * 30, y = 30 + Math.floor(i / 12) * 30;
      return `<rect x="${x}" y="${y}" width="30" height="30" fill="${d ? ['url(#gTurq)', 'url(#gBlue)', '#f6e3b0'][(i + Math.floor(i / 12)) % 3] : '#8a8070'}" ${THIN} stroke-width="1"/>` +
        (d ? `<path d="M${x + 15} ${y + 5} L${x + 25} ${y + 15} L${x + 15} ${y + 25} L${x + 5} ${y + 15} Z" fill="#fffdf6" opacity=".7"/><circle cx="${x + 15}" cy="${y + 15}" r="3" fill="#e0303f"/>` : '');
    }).join(''),
  niche: (d) =>
    [40, 320].map((x) => `<path d="M${x - 22} 170 V128 Q${x - 22} 104 ${x} 98 Q${x + 22} 104 ${x + 22} 128 V170 Z" fill="${d ? '#3b2a20' : '#5a4a3e'}" ${O}/>` +
      (d ? `<path d="M${x - 10} 170 L${x - 8} 150 L${x + 8} 150 L${x + 10} 170 Z" fill="url(#gTerracotta)" ${THIN}/><rect x="${x - 10}" y="132" width="20" height="10" rx="2" fill="url(#gWood)" ${THIN}/>` : cobweb(x - 22, 100, 0.6))).join(''),
  pool: (d) =>
    `<path d="M110 196 L140 178 L220 178 L250 196 L250 214 L220 232 L140 232 L110 214 Z" fill="url(#gTurq)" ${O}/>` +
    `<path d="M122 198 L146 184 L214 184 L238 198 L238 212 L214 226 L146 226 L122 212 Z" fill="${d ? '#7fd6e6' : '#5a4a3a'}" ${THIN}/>` +
    (d ? `<path d="M150 210 q10 -4 20 0 M196 200 q10 -4 20 0" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/>` : dustPile(180, 206)),
  fountain: (d) =>
    d
      ? `<rect x="174" y="196" width="12" height="10" rx="3" fill="url(#gCream)" ${THIN}/><path class="steam" d="M180 196 V168 M180 172 q-12 0 -18 18 M180 172 q12 0 18 18" fill="none" stroke="#e8f8ff" stroke-width="3" stroke-linecap="round"/>`
      : `<rect x="174" y="196" width="12" height="10" rx="3" fill="#8a8070" ${THIN}/>`,
  light: (d) =>
    d
      ? `<ellipse cx="180" cy="8" rx="20" ry="6" fill="#fff6c8" ${THIN}/><path d="M162 10 L198 10 L240 236 L120 236 Z" fill="#fff6c8" opacity=".2"/>` + sparkle(120, 60, 5) + sparkle(250, 70, 5)
      : darkness(0.4),
};

// ------------------------------------------------------------------ باغ میوه

const tree = (x: number, base: number, alive: boolean) =>
  `<path d="M${x} ${base} V${base - 50} M${x} ${base - 34} l-18 -16 M${x} ${base - 40} l16 -18" ${O} stroke="#6a4a2a" stroke-width="6"/>` +
  (alive ? leafy(x - 16, base - 60, 20) + leafy(x + 16, base - 62, 20) + leafy(x, base - 76, 22)
    : `<path d="M${x - 18} ${base - 50} l-8 -10 M${x + 16} ${base - 58} l8 -10" ${O} stroke="#8a7a6a" stroke-width="3"/>`);

const ORCHARD: Record<string, Layer> = {
  water: (d) =>
    [150, 190, 230].map((y, i) => `<path d="M0 ${y} H360" stroke="${d ? '#6cc0ea' : '#8a6a48'}" stroke-width="${6 + i}"/>` + `<path d="M0 ${y - 4} H360 M0 ${y + 4 + i} H360" stroke="#7a5a3a" stroke-width="1.6"/>`).join(''),
  prune: (d) => [50, 140, 230, 320].map((x, i) => tree(x, 150 + (i % 2) * 6, d)).join(''),
  cherries: (d) =>
    d
      ? [50, 140, 230, 320].map((x, i) => [[-18, -58], [-6, -70], [8, -62], [20, -54], [-2, -84], [14, -78]].map(([dx, dy]) =>
          `<path d="M${x + dx} ${150 + (i % 2) * 6 + dy - 6} l-2 6 M${x + dx} ${150 + (i % 2) * 6 + dy - 6} l3 7" stroke="#3f8a2a" stroke-width="1"/><circle cx="${x + dx - 2}" cy="${150 + (i % 2) * 6 + dy}" r="3" fill="url(#gRed)" ${THIN} stroke-width=".8"/><circle cx="${x + dx + 3}" cy="${150 + (i % 2) * 6 + dy + 1}" r="3" fill="url(#gRed)" ${THIN} stroke-width=".8"/>`).join('')).join('')
      : '',
  ladder: (d) =>
    d
      ? `<path d="M118 236 L150 120 M138 236 L166 124" ${O} stroke="url(#gWood)" stroke-width="4"/>` + Array.from({ length: 6 }, (_, i) => `<path d="M${122 + i * 5.6} ${220 - i * 19} H${141 + i * 4.8}" stroke="#8b5328" stroke-width="3"/>`).join('') +
        [[190, 226], [222, 230]].map(([x, y]) => `<path d="M${x - 16} ${y - 18} L${x + 16} ${y - 18} L${x + 12} ${y} L${x - 12} ${y} Z" fill="url(#gWicker)" ${O}/>` + [0, 1, 2, 3].map((k) => `<circle cx="${x - 9 + k * 6}" cy="${y - 20}" r="3" fill="url(#gRed)" ${THIN} stroke-width=".8"/>`).join('')).join('')
      : plank(150, 220, 70, -12),
  swing: (d) =>
    d
      ? `<path d="M300 92 V170 M330 90 V170" stroke="${INK}" stroke-width="1.6"/><rect x="294" y="168" width="42" height="7" rx="2" fill="url(#gWood)" ${O}/>` + sparkle(280, 120, 5)
      : '',
};

// ------------------------------------------------------------------ تالار آینه

const MIRRORHALL: Record<string, Layer> = {
  mirrors: (d) =>
    Array.from({ length: 60 }, (_, i) => {
      const x = (i % 15) * 24 + (Math.floor(i / 15) % 2) * 12, y = 6 + Math.floor(i / 15) * 14;
      return `<path d="M${x} ${y} l10 6 l-10 6 l-10 -6 Z" fill="${d ? (i % 3 ? '#d6ecff' : '#fffdf6') : '#6a6a70'}" stroke="${d ? '#9ab' : '#4a4a50'}" stroke-width=".8"/>`;
    }).join('') + (d ? sparkle(60, 20, 5) + sparkle(220, 30, 6) + sparkle(320, 16, 4) : ''),
  orosi: (d) =>
    `<rect x="110" y="70" width="140" height="96" rx="4" fill="url(#gWoodDark)" ${O}/>` +
    Array.from({ length: 3 }, (_, i) => {
      const x = 118 + i * 44;
      return `<path d="M${x} 160 V96 A20 20 0 0 1 ${x + 40} 96 V160 Z" fill="${d ? '#fffdf6' : '#5a4a3a'}" ${THIN}/>` +
        (d ? [['#e0303f', 0], ['#14879a', 1], ['#f6c945', 2], ['#3fae5a', 3]].map(([c, k]) => `<rect x="${x + 4 + (Number(k) % 2) * 17}" y="${98 + Math.floor(Number(k) / 2) * 30}" width="15" height="26" fill="${c}" opacity=".75"/>`).join('') : '');
    }).join('') + (d ? glow(180, 116, 70, 0.3) : ''),
  carpet: (d) =>
    d
      ? `<path d="M60 236 L100 184 L260 184 L300 236 Z" fill="url(#gCarpet)" ${O}/><path d="M80 230 L108 190 H252 L280 230 Z" fill="url(#gNavy)" ${THIN}/>` +
        `<path d="M180 196 L210 210 L180 224 L150 210 Z" fill="#f6c945" stroke="${INK}" stroke-width="1"/>`
      : dustPile(180, 220) + dustPile(100, 228),
  chandelier: (d) =>
    d
      ? `<path d="M180 0 V30" ${THIN}/>` + glow(180, 50, 60, 0.6) +
        `<path d="M150 46 Q180 66 210 46" fill="none" ${O} stroke="url(#gGold)" stroke-width="3"/><path d="M180 30 V60" ${O} stroke="url(#gGold)" stroke-width="3"/>` +
        [150, 165, 180, 195, 210].map((x, i) => `<path d="M${x} ${50 + Math.sin((i / 4) * Math.PI) * 8} l-3 8 l3 6 l3 -6 Z" fill="#d6ecff" ${THIN} stroke-width=".8"/><circle cx="${x}" cy="${44 + Math.sin((i / 4) * Math.PI) * 8}" r="2.6" fill="#ffe08a"/>`).join('')
      : `<path d="M180 0 V30" ${THIN}/><path d="M160 46 Q180 60 200 46" fill="none" stroke="#6a6a6a" stroke-width="3"/>`,
  portrait: (d) =>
    d
      ? `<rect x="292" y="96" width="50" height="62" rx="2" fill="url(#gGold)" ${O}/><rect x="297" y="101" width="40" height="52" fill="#e8d3a8" ${THIN}/>` +
        // The aunt, painted in sepia, her hair in a bun.
        `<path d="M305 148 C305 128 329 128 329 148 Z" fill="#8a6a48"/><circle cx="317" cy="113" r="4.6" fill="#6a4a30"/><path d="M308 130 C306 112 328 112 326 130 C327 136 325 138 322 138 H312 C309 138 307 136 308 130 Z" fill="#6a4a30"/>` +
        `<circle cx="317" cy="126" r="7" fill="#e8c8a0"/>` + glow(317, 126, 30, 0.3)
      : `<rect x="292" y="96" width="50" height="62" fill="none" stroke="#9b8a76" stroke-width="2" stroke-dasharray="4 4"/>`,
};

// ------------------------------------------------------------------ افتتاح باغ عمومی

const PARKOPENING: Record<string, Layer> = {
  flowers: (d) =>
    [[30, 200], [250, 200]].map(([x, y]) => `<ellipse cx="${x + 40}" cy="${y + 14}" rx="44" ry="14" fill="url(#gSoil)" ${O}/>` +
      (d ? Array.from({ length: 9 }, (_, i) => `<circle cx="${x + 6 + i * 9}" cy="${y + 8 + (i % 2) * 6}" r="4.4" fill="${['#e0303f', '#f6c945', '#c58bff', '#ff7a9c'][i % 4]}" ${THIN} stroke-width=".8"/>`).join('') : dustPile(x + 40, y + 12))).join(''),
  benches: (d) =>
    d
      ? [[40, 168], [270, 168]].map(([x, y]) => `<rect x="${x}" y="${y}" width="50" height="6" rx="2" fill="url(#gWood)" ${O}/><rect x="${x}" y="${y - 14}" width="50" height="6" rx="2" fill="url(#gWood)" ${O}/><path d="M${x + 4} ${y + 6} V${y + 20} M${x + 46} ${y + 6} V${y + 20}" ${O} stroke-width="3"/>`).join('')
      : plank(40, 176, 50, 14) + plank(270, 180, 50, -10),
  kiosk: (d) =>
    d
      ? `<rect x="300" y="110" width="56" height="60" fill="url(#gTurq)" ${O}/><path d="M294 110 L362 110 L354 94 L302 94 Z" fill="url(#gRed)" ${O}/>` +
        [306, 318, 330, 342].map((x) => `<path d="M${x} 94 L${x - 2} 110" stroke="#fff" stroke-width="4"/>`).join('') +
        `<rect x="306" y="120" width="44" height="22" fill="#fffdf6" ${THIN}/>` + text(328, 135, 'بستنی', 9, '#e0303f')
      : `<rect x="300" y="120" width="56" height="50" fill="#8a7a6a" ${O}/>`,
  lights: (d) => (d ? stringLights(20) + lantern(120, 40) + lantern(240, 40) + sparkle(180, 26, 6) : darkness(0.32)),
  ribbon: (d) =>
    `<rect x="140" y="60" width="16" height="110" fill="url(#gTerracotta)" ${O}/><rect x="204" y="60" width="16" height="110" fill="url(#gTerracotta)" ${O}/>` +
    `<rect x="132" y="48" width="96" height="16" rx="3" fill="url(#gNavy)" ${O}/>` + text(180, 60, 'باغ عمه‌خانم', 10, '#ffe08a') +
    (d
      ? `<path d="M156 120 Q180 132 204 120" fill="none" stroke="#e0303f" stroke-width="5"/><path d="M180 126 l-10 -7 v14 Z M180 126 l10 -7 v14 Z" fill="url(#gRed)" ${THIN}/>` + sparkle(130, 40, 6) + sparkle(232, 40, 6)
      : `<path d="M156 70 V170 M204 70 V170" stroke="#3b3b44" stroke-width="2"/>` + Array.from({ length: 8 }, (_, i) => `<path d="M${158 + i * 6} 70 V170" stroke="#3b3b44" stroke-width="2"/>`).join('')),
};

const parkBase = () =>
  `<rect width="360" height="170" fill="url(#gSky)"/>` + leafy(30, 70, 34) + leafy(330, 64, 30) + leafy(80, 90, 22) + leafy(280, 92, 22) +
  `<rect y="150" width="360" height="90" fill="#8fbf4a"/><path d="M150 150 L210 150 L250 240 L110 240 Z" fill="#d6c3a0"/>`;

export const SCENES7: Record<string, SceneDef> = {
  gardenhouse: { base: `<rect width="360" height="130" fill="url(#gSky)"/><rect y="118" width="360" height="122" fill="#7fae4a"/>`, order: ['facade', 'path', 'stream', 'chenar', 'gate'], layers: GARDENHOUSE },
  poolhouse: { base: wall('#e8dcc6', 196) + `<path d="M0 0 H360 V24 Q180 -4 0 24 Z" fill="#d8c8aa"/>` + floor('#c9b48f', 170), order: ['tiles', 'niche', 'pool', 'fountain', 'light'], layers: POOLHOUSE },
  orchard: { base: `<rect width="360" height="140" fill="url(#gSky)"/><rect y="132" width="360" height="108" fill="#a88c5a"/>`, order: ['water', 'prune', 'cherries', 'ladder', 'swing'], layers: ORCHARD },
  mirrorhall: { base: wall('#efe3cc') + floor('#a5703e'), order: ['mirrors', 'orosi', 'carpet', 'chandelier', 'portrait'], layers: MIRRORHALL },
  parkopening: { base: parkBase(), order: ['flowers', 'benches', 'kiosk', 'lights', 'ribbon'], layers: PARKOPENING },
};

