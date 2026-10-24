// Season 5 («طرح تعریض خیابان») place scenes. Same contract as scenes.ts: each task layer is
// drawn "before" until done, then "after".

import { INK, O, THIN, estekan, samovar, sparkle } from './kit';
import { Layer, SceneDef, brickWall, cobweb, dustPile, floor, geranium, glow, plank, stringLights } from './scenes';
import { darkness, text } from './scenes3';

/** A pointed (Persian) arch path from x0 to x1, springing at y and peaking at top. */
const pointed = (x0: number, x1: number, y: number, top: number, bottom: number) => {
  const m = (x0 + x1) / 2;
  return `M${x0} ${bottom} V${y} Q${x0} ${top + (y - top) * 0.25} ${m} ${top} Q${x1} ${top + (y - top) * 0.25} ${x1} ${y} V${bottom} Z`;
};

const stars = (n: number, h: number) =>
  Array.from({ length: n }, (_, i) => {
    const x = (i * 83) % 356 + 2, y = (i * 47) % h + 4;
    return i % 4 ? `<circle cx="${x}" cy="${y}" r="${1 + (i % 3) * 0.5}" fill="#fff6c8" opacity=".9"/>` : sparkle(x, y, 3, '#fff6c8');
  }).join('');

// ------------------------------------------------------------------ سردر کوچه

const GATE: Record<string, Layer> = {
  arch: (d) =>
    (d
      ? `<path d="${pointed(110, 250, 60, 18, 200)}" fill="url(#gTerracotta)" ${O}/>` +
        Array.from({ length: 9 }, (_, i) => `<path d="M112 ${76 + i * 14} H138 M222 ${76 + i * 14} H248" stroke="#8a4a22" stroke-width="1.4" opacity=".6"/>`).join('') +
        [0, 1, 2, 3].map((k) => `<path d="M${118 + k * 4} ${200} V${66 - k * 2}" stroke="#f2c38a" stroke-width="1.2" opacity=".5"/><path d="M${242 - k * 4} ${200} V${66 - k * 2}" stroke="#f2c38a" stroke-width="1.2" opacity=".5"/>`).join('')
      : `<path d="${pointed(110, 250, 60, 18, 200)}" fill="#a9a196" ${O}/>` +
        `<path d="M124 90 l10 18 l-6 14 l12 22 M236 70 l-12 20 l8 12" fill="none" stroke="${INK}" stroke-width="2" opacity=".6"/>` +
        `<path d="M104 120 H256 M104 160 H256" stroke="#8b5e34" stroke-width="5"/><path d="M110 112 V200 M250 112 V200" stroke="#8b5e34" stroke-width="4"/>`) +
    `<path d="${pointed(140, 220, 104, 70, 200)}" fill="#3b2a20" ${O}/>`,
  katibeh: (d) =>
    d
      ? `<rect x="122" y="42" width="116" height="22" rx="3" fill="url(#gBlue)" ${O}/><rect x="126" y="46" width="108" height="14" rx="2" fill="none" stroke="#f6c945" stroke-width="1.2"/>` +
        text(180, 58, 'بنا شد ۱۲۸۵', 11, '#fffdf6')
      : `<rect x="122" y="42" width="116" height="22" rx="3" fill="#c9c0b4" ${O}/>` + `<path d="M150 46 l8 12 M200 48 l-6 10" stroke="${INK}" stroke-width="1.4" opacity=".5"/>`,
  door: (d) =>
    d
      ? `<path d="${pointed(146, 214, 110, 80, 200)}" fill="url(#gWoodDark)" ${O}/><path d="M180 84 V200" ${THIN}/>` +
        [124, 150, 176].map((y) => `<path d="M150 ${y} H210" stroke="#3b2216" stroke-width="1.4" opacity=".6"/>`).join('') +
        Array.from({ length: 10 }, (_, i) => `<circle cx="${154 + (i % 5) * 13}" cy="${i < 5 ? 132 : 168}" r="1.8" fill="url(#gBrass)"/>`).join('') +
        // Knockers: a heavy bar for men, a light ring for women.
        `<rect x="164" y="138" width="6" height="18" rx="2" fill="url(#gBrass)" ${THIN}/><circle cx="196" cy="146" r="7" fill="none" stroke="url(#gBrass)" stroke-width="3"/><circle cx="196" cy="146" r="7" fill="none" ${THIN} stroke-width=".8"/>`
      : `<path d="${pointed(146, 214, 110, 80, 200)}" fill="#6a6a70" ${O}/>` + [130, 160, 186].map((y) => `<path d="M146 ${y} H214" stroke="#8a4a22" stroke-width="3" opacity=".6"/>`).join('') +
        `<path d="M156 100 l10 20 M196 150 l8 14" stroke="#8a4a22" stroke-width="4" opacity=".5"/>`,
  plate: (d) =>
    d
      ? `<rect x="268" y="92" width="80" height="26" rx="4" fill="url(#gBlue)" ${O}/><rect x="271" y="95" width="74" height="20" rx="3" fill="none" stroke="#fff" stroke-width="1.4"/>` +
        text(308, 110, 'کوچه‌ی حاج‌بابا', 10, '#fff')
      : `<g transform="rotate(-10 308 105)"><rect x="268" y="92" width="80" height="26" rx="4" fill="#6a7a8a" ${O}/>${text(308, 110, 'کوچه‌ی …', 10, '#9aa8b4')}</g>`,
  lamp: (d) =>
    `<path d="M92 92 H74 V100" ${O} stroke-width="3"/>` +
    (d
      ? glow(74, 116, 46, 0.7) + `<path d="M64 100 H84 L80 126 H68 Z" fill="#ffe7a0" ${THIN}/><path d="M62 100 Q74 88 86 100 Z" fill="url(#gBrass)" ${THIN}/>` + sparkle(300, 40, 6) + sparkle(40, 50, 5)
      : `<path d="M64 100 H84 L80 126 H68 Z" fill="#5a5a60" ${THIN}/>` + darkness(0.32)),
};

const gateBase = () =>
  `<rect width="360" height="200" fill="url(#gSky)"/>` +
  `<g>${brickWall('#cf9e6c', '#a8774a', 200).replace('<rect x="0" y="0" width="360" height="200"', '<rect x="0" y="40" width="360" height="160"')}</g>` +
  `<rect x="0" y="0" width="360" height="40" fill="url(#gSky)"/>` +
  `<path d="M0 40 H110 M250 40 H360" ${O} stroke-width="3"/>` + floor('#9a8a76', 200);

// ------------------------------------------------------------------ پشت‌بوم

const ROOFTOP: Record<string, Layer> = {
  rail: (d) =>
    d
      ? `<path d="M0 132 H360" ${O} stroke="url(#gBlue)" stroke-width="5"/>` + Array.from({ length: 19 }, (_, i) => `<path d="M${i * 20 + 4} 132 V168" stroke="${INK}" stroke-width="3"/><path d="M${i * 20 + 4} 132 V168" stroke="#5b8fd6" stroke-width="1.6"/>`).join('') +
        `<path d="M0 132 H360" stroke="#7fb0f0" stroke-width="1.4"/>`
      : `<path d="M0 140 L90 136" ${O} stroke="#6a6a70" stroke-width="4"/>` + [10, 30, 50, 70].map((x, i) => `<path d="M${x} 138 L${x + (i % 2 ? 6 : -4)} 168" stroke="#6a6a70" stroke-width="3"/>`).join('') +
        plank(240, 180, 70, 10) + plank(120, 206, 60, -14),
  kilim: (d) =>
    d
      ? `<path d="M70 186 L290 186 L320 236 L40 236 Z" fill="url(#gCarpet)" ${O}/>` +
        [110, 150, 190, 230, 270].map((x, i) => `<path d="M${x - 6 + i * 2} 196 l10 12 l-10 12 l-10 -12 Z" fill="#f6c945" stroke="${INK}" stroke-width="1"/>`).join('') +
        `<path d="M76 192 H284" stroke="#f6e3b0" stroke-width="2" stroke-dasharray="6 4"/>` +
        `<rect x="56" y="164" width="40" height="26" rx="10" fill="url(#gNavy)" ${O}/><rect x="264" y="164" width="40" height="26" rx="10" fill="url(#gCarpet)" ${O}/>`
      : dustPile(180, 220) + dustPile(80, 230),
  samovar: (d) =>
    d
      ? glow(142, 192, 34, 0.5) + `<g transform="translate(112 146) scale(.6)">${samovar('url(#gCopper)', true)}</g>` +
        `<path class="steam" d="M142 148 q-6 -8 0 -16 q6 -8 0 -14" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".7"/>` +
        [184, 202, 220].map((x) => `<g transform="translate(${x} 210) scale(.3)">${estekan(0, 0, 1, true)}</g>`).join('')
      : '',
  pots: (d) =>
    d
      ? [20, 60, 300, 340].map((x) => geranium(x, 168, 0.9)).join('')
      : [30, 320].map((x) => `<path d="M${x - 10} 168 L${x + 10} 168 L${x + 7} 154 L${x - 7} 154 Z" fill="#8a7a6a" ${THIN}/>`).join(''),
  scroll: (d) =>
    d
      ? `<path d="M242 220 L326 204 L330 220 L246 238 Z" fill="#fffdf6" ${O}/>` +
        Array.from({ length: 9 }, (_, i) => `<path d="M${252 + i * 8.5} ${228 - i * 1.6} q2 -4 5 0 t4 -1" fill="none" stroke="#3a76c4" stroke-width="1.2"/>`).join('') +
        `<ellipse cx="242" cy="228" rx="5" ry="10" fill="url(#gCream)" ${THIN} transform="rotate(-12 242 228)"/><ellipse cx="328" cy="212" rx="5" ry="10" fill="url(#gCream)" ${THIN} transform="rotate(-12 328 212)"/>` +
        stringLights(118, ['#ffd36b', '#ff7a9c', '#5fe0e0'])
      : darkness(0.25),
};

const rooftopBase = () =>
  `<rect width="360" height="170" fill="#1f2a55"/><rect width="360" height="80" fill="#162045"/>` + stars(30, 100) +
  `<path d="M318 30 a16 16 0 1 1 -10 -26 a12 12 0 1 0 10 26 Z" fill="#fff6c8"/>` +
  // Neighbouring roofs: a dome, a windcatcher and flat roofs in silhouette.
  `<path d="M0 132 V110 H70 V122 H120 V104 H170 V132 Z" fill="#2c3666"/><path d="M190 132 V112 Q220 78 250 112 V132 Z" fill="#2c3666"/>` +
  `<rect x="276" y="84" width="22" height="48" fill="#2c3666"/><path d="M276 84 H298" stroke="#3a4680" stroke-width="3"/>` + [281, 289].map((x) => `<rect x="${x}" y="90" width="4" height="14" fill="#1f2a55"/>`).join('') +
  `<path d="M298 132 V116 H360 V132 Z" fill="#2c3666"/>` +
  floor('#b49a76', 168).replace('fill="#b49a76"', 'fill="#b49a76"') + `<rect y="132" width="360" height="36" fill="#a88c66"/>`;

// ------------------------------------------------------------------ آب‌انبار (cutaway: dome above, reservoir below)

const CISTERN: Record<string, Layer> = {
  dome: (d) =>
    d
      ? `<path d="M120 112 Q120 46 180 40 Q240 46 240 112 Z" fill="url(#gClay)" ${O}/>` +
        [140, 160, 200, 220].map((x) => `<path d="M${x} 112 Q${x} ${70 - Math.abs(180 - x) * 0.2} 180 44" fill="none" stroke="#a5621f" stroke-width="1.2" opacity=".5"/>`).join('') +
        `<rect x="172" y="30" width="16" height="12" rx="3" fill="url(#gClay)" ${O}/><path d="M168 30 Q180 22 192 30" fill="url(#gClay)" ${THIN}/>` +
        // Light from the skylight falls down onto the water.
        `<path d="M176 112 L184 112 L214 214 L146 214 Z" fill="#fff6c8" opacity=".22"/>`
      : `<path d="M120 112 Q120 46 180 40 Q240 46 240 112 Z" fill="#8a7a6a" ${O}/><path d="M150 60 l12 18 l-4 14 M210 70 l-10 16" fill="none" stroke="${INK}" stroke-width="2" opacity=".6"/>`,
  badgir: (d) =>
    [60, 300].map((x) =>
      d
        ? `<rect x="${x - 14}" y="26" width="28" height="86" fill="url(#gClay)" ${O}/><rect x="${x - 18}" y="20" width="36" height="8" rx="2" fill="url(#gClay)" ${O}/>` +
          [0, 1, 2].map((k) => `<rect x="${x - 10 + k * 7}" y="32" width="5" height="26" rx="2" fill="#3b2a20"/>`).join('') +
          `<path d="M${x - 14} 70 H${x + 14}" stroke="#a5621f" stroke-width="1.4"/>`
        : `<path d="M${x - 14} 112 V70 L${x - 4} 60 L${x + 6} 74 L${x + 14} 66 V112 Z" fill="#8a7a6a" ${O}/>`).join(''),
  stairs: (d) =>
    Array.from({ length: 8 }, (_, i) =>
      `<rect x="${30 + i * 12}" y="${116 + i * 12}" width="${d ? 26 : 22}" height="12" fill="${d ? 'url(#gCream)' : '#7a6a5a'}" ${THIN}/>`).join('') +
    (d ? '' : dustPile(70, 150) + dustPile(110, 190) + cobweb(30, 116, 0.8)),
  tap: (d) =>
    d
      ? `<rect x="118" y="196" width="20" height="10" rx="3" fill="url(#gBrass)" ${O}/><path d="M138 200 H148 V206" fill="none" ${O} stroke="url(#gBrass)" stroke-width="4"/>` +
        `<path d="M148 208 V226" stroke="#7fd6e6" stroke-width="3" stroke-linecap="round" class="steam"/><circle cx="126" cy="194" r="4" fill="url(#gBrass)" ${THIN}/>`
      : `<rect x="118" y="196" width="20" height="10" rx="3" fill="#6a5a4a" ${O}/>`,
  lights: (d) =>
    d
      ? [150, 210, 270].map((x) => `<path d="M${x} 120 V130" stroke="${INK}" stroke-width="1.4"/><circle cx="${x}" cy="135" r="5" fill="#ffd36b" ${THIN} stroke-width="1"/>` + glow(x, 135, 22, 0.6)).join('') +
        `<path d="M150 222 q10 -4 20 0 M220 218 q10 -4 20 0 M260 226 q10 -4 20 0" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/>` + sparkle(250, 210, 5)
      : `<rect y="112" width="360" height="128" fill="#0e0a1e" opacity=".55"/>`,
};

const cisternBase = () =>
  `<rect width="360" height="112" fill="url(#gSky)"/>` +
  `<rect y="112" width="360" height="128" fill="#8a6a48"/>` + Array.from({ length: 14 }, (_, i) => `<circle cx="${(i * 71) % 350 + 5}" cy="${120 + ((i * 37) % 110)}" r="${2 + (i % 3)}" fill="#7a5a3a"/>`).join('') +
  // The reservoir chamber, a brick vault under the street, half full of water.
  `<path d="M130 236 V150 Q130 118 210 116 Q290 118 290 150 V236 Z" fill="#5a4a3e" ${O}/>` +
  `<path d="M132 206 H288 V234 H132 Z" fill="url(#gWater)" opacity=".9"/>` +
  `<path d="M0 112 H360" ${O} stroke-width="3"/>` + `<rect y="104" width="360" height="8" fill="#b9a68a"/>`;

// ------------------------------------------------------------------ موزه‌ی محله

const frame = (x: number, y: number, w: number, h: number, inner: string) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="url(#gGold)" ${O}/><rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" fill="#e8d3a8" ${THIN}/>` + inner;

const MUSEUM: Record<string, Layer> = {
  photos: (d) =>
    d
      ? frame(30, 30, 50, 40, `<circle cx="55" cy="46" r="7" fill="#8a6a48"/><path d="M42 66 Q55 52 68 66" fill="#8a6a48"/>`) +
        frame(96, 24, 70, 48, `<path d="M102 66 V44 L116 36 L130 44 V66 M136 66 V48 H158 V66" fill="none" stroke="#8a6a48" stroke-width="2.4"/>`) +
        frame(194, 24, 70, 48, Array.from({ length: 5 }, (_, i) => `<circle cx="${206 + i * 11}" cy="${44 + (i % 2) * 2}" r="4" fill="#8a6a48"/><path d="M${201 + i * 11} 66 v-12 q5 -4 10 0 v12" fill="#8a6a48"/>`).join('')) +
        frame(280, 30, 50, 40, `<path d="M290 64 Q305 40 320 64" fill="#8a6a48"/><circle cx="305" cy="46" r="5" fill="#8a6a48"/>`)
      : [[30, 30, 50, 40], [194, 24, 70, 48]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#9b8a76" stroke-width="2" stroke-dasharray="4 4"/>`).join('') + cobweb(360, 0, 1, true),
  cases: (d) =>
    [[30, 'scale'], [270, 'radio']].map(([x, kind]) => {
      const xx = Number(x);
      return `<rect x="${xx + 10}" y="150" width="40" height="64" fill="url(#gWoodDark)" ${O}/>` +
        (d
          ? `<rect x="${xx}" y="100" width="60" height="50" rx="3" fill="url(#gGlass)" fill-opacity=".55" ${O}/>` +
            (kind === 'scale'
              ? `<path d="M${xx + 30} 140 V114 M${xx + 14} 114 H${xx + 46}" ${THIN} stroke-width="2.4"/><path d="M${xx + 8} 124 Q${xx + 14} 132 ${xx + 20} 124 Z M${xx + 40} 124 Q${xx + 46} 132 ${xx + 52} 124 Z" fill="url(#gBrass)" ${THIN}/>`
              : `<rect x="${xx + 12}" y="118" width="36" height="24" rx="5" fill="url(#gWood)" ${THIN}/><circle cx="${xx + 22}" cy="130" r="6" fill="#e8d3a8" ${THIN}/><circle cx="${xx + 40}" cy="126" r="2.4" fill="url(#gBrass)"/><circle cx="${xx + 40}" cy="135" r="2.4" fill="url(#gBrass)"/>`) +
            `<path d="M${xx + 8} 106 l12 -0 M${xx + 6} 112 l8 0" stroke="#fff" stroke-width="2" opacity=".7"/>`
          : `<rect x="${xx}" y="140" width="60" height="10" fill="#7a6a5a" ${THIN}/>`);
    }).join(''),
  samovar: (d) =>
    `<rect x="156" y="150" width="48" height="64" fill="${d ? 'url(#gCream)' : '#9a8a7a'}" ${O}/><rect x="150" y="144" width="60" height="8" rx="2" fill="${d ? 'url(#gGold)' : '#8a7a6a'}" ${THIN}/>` +
    (d
      ? glow(180, 110, 54, 0.55) + `<g transform="translate(144 70) scale(.72)">${samovar('url(#gBrass)', true)}</g>` +
        `<path d="M150 0 L210 0 L230 150 L130 150 Z" fill="#fff6c8" opacity=".14"/>` + text(180, 188, 'سماور حاج‌بابا', 7, '#6a4a2a')
      : ''),
  model: (d) =>
    d
      ? `<rect x="88" y="196" width="184" height="12" rx="2" fill="url(#gWood)" ${O}/><path d="M96 208 V236 M264 208 V236" ${O} stroke-width="4"/>` +
        `<path d="M96 196 L112 176 L248 176 L264 196 Z" fill="#c69260" ${THIN}/><path d="M150 196 L162 176 H198 L210 196 Z" fill="#d6c3a0" ${THIN}/>` +
        [[104, '#e0b07a'], [124, '#d8e4d4'], [214, '#f2e8d0'], [236, '#fde8ef']].map(([x, c]) => `<rect x="${x}" y="170" width="16" height="16" fill="${c}" ${THIN} stroke-width="1"/><path d="M${Number(x) - 2} 170 L${Number(x) + 8} 162 L${Number(x) + 18} 170 Z" fill="url(#gTerracotta)" ${THIN} stroke-width="1"/>`).join('') +
        `<circle cx="146" cy="174" r="7" fill="url(#gLeaf)" ${THIN} stroke-width="1"/><path d="M174 176 V164 Q180 156 186 164 V176" fill="url(#gTerracotta)" ${THIN} stroke-width="1"/>`
      : `<rect x="110" y="200" width="60" height="30" fill="#c9a26b" ${O}/><path d="M110 210 h60" ${THIN}/><rect x="186" y="208" width="50" height="24" fill="#c9a26b" ${O}/>`,
  ribbon: (d) =>
    d
      ? `<path d="M0 132 Q90 146 180 132 T360 132" fill="none" stroke="#e0303f" stroke-width="5"/><path d="M0 132 Q90 146 180 132 T360 132" fill="none" ${THIN} stroke-width=".8"/>` +
        `<path d="M180 132 l-16 -10 v20 Z M180 132 l16 -10 v20 Z" fill="url(#gRed)" ${THIN}/><path d="M180 132 l-8 22 M180 132 l8 22" stroke="#e0303f" stroke-width="4"/>` +
        sparkle(60, 100, 6) + sparkle(300, 96, 6) + sparkle(220, 30, 5)
      : darkness(0.28),
};

const museumBase = () =>
  `<rect width="360" height="170" fill="#f2e6cc"/><rect y="120" width="360" height="50" fill="#7a2a2a"/><path d="M0 120 H360" stroke="#e9b949" stroke-width="4"/>` +
  floor('#a5703e');

// ------------------------------------------------------------------ جشن ثبت ملی (night street party)

const house = (x: number, w: number, h: number, c: string, lit: boolean) =>
  `<rect x="${x}" y="${170 - h}" width="${w}" height="${h}" fill="${c}" ${O}/>` +
  [0.25, 0.65].map((f) => `<rect x="${x + w * f - 7}" y="${180 - h}" width="14" height="20" rx="7" fill="${lit ? '#ffe08a' : '#4a4a5a'}" ${THIN}/>`).join('');

const HERITAGE: Record<string, Layer> = {
  flags: (d) =>
    d
      ? [24, 54].map((y, k) => `<path d="M0 ${y} Q180 ${y + 30} 360 ${y}" fill="none" stroke="${INK}" stroke-width="1.2"/>` +
          Array.from({ length: 14 }, (_, i) => {
            const x = 12 + i * 26, yy = y + Math.sin((x / 360) * Math.PI) * 15 + 1;
            return `<path d="M${x - 7} ${yy} L${x + 7} ${yy} L${x} ${yy + 14} Z" fill="${['#2a9d4a', '#fffdf6', '#e0303f'][(i + k) % 3]}" ${THIN} stroke-width=".8"/>`;
          }).join('')).join('')
      : '',
  table: (d) =>
    d
      ? `<path d="M120 236 L162 150 L198 150 L240 236 Z" fill="#fffdf6" ${O}/>` +
        Array.from({ length: 6 }, (_, i) => {
          const t = i / 5, y = 160 + t * 64, half = 20 + t * 38;
          return `<ellipse cx="${180 - half + 10}" cy="${y}" rx="${3 + t * 4}" ry="${2 + t * 2}" fill="url(#gCrust)"/><ellipse cx="${180 + half - 10}" cy="${y + 4}" rx="${3 + t * 4}" ry="${2 + t * 2}" fill="url(#gPom)"/>`;
        }).join('') +
        `<path d="M120 236 L162 150 M240 236 L198 150" stroke="#e0303f" stroke-width="2" stroke-dasharray="4 4"/>`
      : [130, 210].map((x) => `<rect x="${x}" y="200" width="30" height="8" rx="2" fill="#8a7a7a" ${THIN} transform="rotate(${x > 180 ? 14 : -10} ${x + 15} 204)"/>`).join(''),
  stage: (d) =>
    d
      ? `<rect x="262" y="176" width="92" height="18" fill="url(#gWoodDark)" ${O}/><path d="M268 194 V236 M348 194 V236" ${O} stroke-width="4"/>` +
        // Bahman's tar: a figure-eight body and a long neck.
        `<g transform="translate(306 156) rotate(-30)"><path d="M-8 0 C-14 -6 -14 -14 -6 -16 C-2 -12 2 -12 6 -16 C14 -14 14 -6 8 0 C14 6 12 16 0 16 C-12 16 -14 6 -8 0 Z" fill="url(#gWood)" ${THIN}/><path d="M0 -14 V-46" ${O} stroke-width="3"/></g>` +
        `<path d="M284 176 V140 M278 140 h12" ${THIN} stroke-width="2"/><circle cx="284" cy="138" r="4" fill="${INK}"/>` + sparkle(330, 140, 5)
      : '',
  plaque: (d) =>
    d
      ? glow(180, 92, 30, 0.5) + `<rect x="150" y="76" width="60" height="34" rx="4" fill="url(#gBrass)" ${O}/><rect x="154" y="80" width="52" height="26" rx="3" fill="none" ${THIN} stroke-width="1"/>` +
        text(180, 92, 'ثبت ملی', 9, '#4b2e1e') + text(180, 103, '۱۴۰۵', 8, '#4b2e1e')
      : `<rect x="150" y="76" width="60" height="34" rx="4" fill="none" stroke="#9b8a76" stroke-width="2" stroke-dasharray="4 4"/>`,
  photo: (d) =>
    d
      ? `<path d="M60 236 L72 196 L84 236 M72 196 V236" ${O} stroke-width="2.4"/><rect x="58" y="180" width="30" height="18" rx="3" fill="#333" ${O}/><circle cx="73" cy="189" r="5" fill="url(#gSky)" ${THIN}/>` +
        `<rect x="62" y="174" width="8" height="6" fill="#555" ${THIN}/>` + glow(66, 172, 30, 0.9) + sparkle(66, 168, 8, '#fff') +
        stringLights(4) + sparkle(20, 120, 6) + sparkle(340, 110, 6)
      : darkness(0.3),
};

const heritageBase = () =>
  `<rect width="360" height="170" fill="#22305e"/>` + stars(22, 60) +
  house(0, 96, 120, '#d9a873', true) + house(264, 96, 110, '#e0b07a', true) +
  // The restored gate at the end of the alley.
  `<path d="${pointed(126, 234, 90, 50, 170)}" fill="url(#gTerracotta)" ${O}/><path d="${pointed(150, 210, 116, 90, 170)}" fill="#3b2a20" ${O}/>` +
  `<rect x="140" y="64" width="80" height="12" rx="2" fill="url(#gBlue)" ${THIN}/>` +
  `<rect x="96" y="80" width="30" height="90" fill="#c69260" ${O}/><rect x="234" y="74" width="30" height="96" fill="#c69260" ${O}/>` +
  floor('#8a7a66');

export const SCENES5: Record<string, SceneDef> = {
  gate: { base: gateBase(), order: ['arch', 'katibeh', 'door', 'plate', 'lamp'], layers: GATE },
  rooftop: { base: rooftopBase(), order: ['rail', 'pots', 'kilim', 'samovar', 'scroll'], layers: ROOFTOP },
  cistern: { base: cisternBase(), order: ['dome', 'badgir', 'stairs', 'tap', 'lights'], layers: CISTERN },
  museum: { base: museumBase(), order: ['photos', 'cases', 'samovar', 'model', 'ribbon'], layers: MUSEUM },
  heritage: { base: heritageBase(), order: ['plaque', 'flags', 'table', 'stage', 'photo'], layers: HERITAGE },
};
