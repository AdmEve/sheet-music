// Season 17 («مسابقه‌ی آشپزی») place scenes. Same contract as scenes.ts: each task layer is drawn
// "before" until done, then "after".

import { INK, O, THIN, estekan, sparkle, teapot } from './kit';
import { KITCHEN } from './chainsS';
import { Layer, SceneDef, brickWall, cobweb, dustPile, floor, glow, plank, sangak, stringLights } from './scenes';
import { darkness, text } from './scenes3';

/** One of the kitchen chain's drawings (100×100), its bottom centre on (x, base). */
const item = (level: number, x: number, base: number, s: number) =>
  `<g transform="translate(${x - 50 * s} ${base - 90 * s}) scale(${s})">${KITCHEN[level - 1]}</g>`;

const counter = (x: number, base: number, w: number, lit: boolean) =>
  `<rect x="${x - w / 2}" y="${base - 34}" width="${w}" height="34" rx="2" fill="#fffdf6" ${O}/><rect x="${x - w / 2 - 3}" y="${base - 40}" width="${w + 6}" height="7" rx="2" fill="url(#gWoodDark)" ${THIN}/>` +
  [-1, 1].map((k) => `<ellipse cx="${x + k * w / 5}" cy="${base - 40}" rx="${w / 7}" ry="2.4" fill="#2a2a2a" ${THIN} stroke-width="1"/>` +
    (lit ? `<path d="M${x + k * w / 5 - 6} ${base - 41} q6 -8 12 0" fill="none" stroke="#5aa7ff" stroke-width="2"/>` : '')).join('');

const tripod = (x: number, base: number, h: number) =>
  `<path d="M${x - 12} ${base} L${x} ${base - h} L${x + 12} ${base} M${x} ${base - h} V${base}" fill="none" stroke="#3a3a44" stroke-width="2.4" stroke-linecap="round"/>`;

const camera = (x: number, base: number) =>
  tripod(x, base, 42) + `<rect x="${x - 18}" y="${base - 62}" width="32" height="22" rx="3" fill="#2a2a2a" ${O}/><circle cx="${x + 18}" cy="${base - 51}" r="7" fill="#5a5a64" ${THIN}/><circle cx="${x + 18}" cy="${base - 51}" r="3" fill="#9ec4e8"/>` +
  `<circle cx="${x - 12}" cy="${base - 58}" r="2" fill="#e0303f"/>`;

const stageLight = (x: number, base: number, lit: boolean) =>
  tripod(x, base, 60) + `<path d="M${x - 10} ${base - 76} L${x + 10} ${base - 76} L${x + 14} ${base - 60} L${x - 14} ${base - 60} Z" fill="#3a3a44" ${THIN}/>` +
  (lit ? `<path d="M${x - 12} ${base - 60} L${x - 40} ${base} H${x + 40} L${x + 12} ${base - 60} Z" fill="#fff6a8" opacity=".18"/>` + glow(x, base - 62, 22, 0.7) : '');

// ------------------------------------------------------------------ استودیوی کوچه

const alleyBase = () => brickWall('#d9a873', '#b5804d', 160) + `<rect y="160" width="360" height="80" fill="#b9b2a4"/><path d="M0 160 H360" stroke="${INK}" stroke-width="2" opacity=".35"/>`;

const TVSET: Record<string, Layer> = {
  banner: (d) =>
    d
      ? `<path d="M90 20 H270 V48 H90 Z" fill="url(#gRed)" ${O}/><path d="M90 48 l-10 8 v-36 l10 0 M270 48 l10 8 v-36 l-10 0" fill="url(#gRoseDeep)" ${THIN}/>` + text(180, 41, 'آشپزی محله', 17, '#fff6d0') + sparkle(280, 14, 6)
      : `<rect x="110" y="24" width="140" height="24" rx="3" fill="#9a8a76" ${THIN} transform="rotate(4 180 36)"/>`,
  lights: (d) => stageLight(36, 162, d) + stageLight(324, 162, d),
  stations: (d) =>
    d ? [100, 180, 260].map((x) => counter(x, 178, 64, false)).join('')
      : plank(70, 168, 70, 6) + plank(160, 176, 80, -4) + plank(240, 170, 60, 8) + dustPile(180, 186),
  judges: (d) =>
    d
      ? `<rect x="120" y="196" width="120" height="10" rx="2" fill="#fffdf6" ${O}/><path d="M128 206 V230 M232 206 V230" ${O} stroke-width="3"/>` +
        [148, 180, 212].map((x) => `<ellipse cx="${x}" cy="196" rx="11" ry="3" fill="url(#gSilver)" ${THIN} stroke-width="1"/>`).join('') +
        [148, 180, 212].map((x) => `<rect x="${x - 9}" y="208" width="18" height="6" rx="2" fill="url(#gNavy)" ${THIN} stroke-width="1"/>`).join('')
      : `<rect x="130" y="206" width="100" height="12" rx="3" fill="#8a7a6a" ${THIN} transform="rotate(-5 180 212)"/>`,
  cameras: (d) => (d ? camera(40, 236) + `<g transform="translate(360 0) scale(-1 1)">${camera(40, 236)}</g>` : `<rect x="24" y="214" width="34" height="20" rx="3" fill="#6a6a70" ${THIN}/><rect x="302" y="214" width="34" height="20" rx="3" fill="#6a6a70" ${THIN}/>`),
};

// ------------------------------------------------------------------ آشپزخونه‌ی ننه‌گلاب

const kitchenBase = () =>
  `<rect width="360" height="168" fill="#f4f0e6"/>` +
  Array.from({ length: 11 }, (_, i) => `<path d="M${i * 34 + 10} 0 V168" stroke="#d8d0c0" stroke-width="1"/>`).join('') +
  Array.from({ length: 6 }, (_, i) => `<path d="M0 ${i * 30 + 14} H360" stroke="#d8d0c0" stroke-width="1"/>`).join('') +
  `<rect y="96" width="360" height="72" fill="#cfe6e8" opacity=".6"/>` + floor('#a8784a', 168) +
  `<rect x="8" y="128" width="344" height="12" rx="2" fill="url(#gWoodDark)" ${O}/><rect x="10" y="140" width="340" height="28" fill="#c9a27a" ${THIN}/>`;

const GOLABKITCHEN: Record<string, Layer> = {
  window: (d) =>
    d
      ? `<rect x="250" y="22" width="80" height="62" rx="3" fill="url(#gSky)" ${O}/><path d="M290 22 V84 M250 52 H330" stroke="#8b5328" stroke-width="4"/>` +
        `<path d="M242 18 C248 46 240 70 248 92 L256 92 C252 70 258 46 252 18 Z M338 18 C332 46 340 70 332 92 L324 92 C328 70 322 46 328 18 Z" fill="url(#gRose)" ${THIN}/>` +
        `<path d="M300 60 q-6 -10 0 -18 q6 -8 0 -16" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/>`
      : `<rect x="250" y="22" width="80" height="62" rx="3" fill="#9a9a90" ${O}/><path d="M290 22 V84 M250 52 H330" stroke="#6a5a4a" stroke-width="4"/>` + cobweb(330, 22, 0.6, true),
  shelf: (d) =>
    `<rect x="20" y="58" width="110" height="6" rx="2" fill="url(#gWood)" ${O}/>` +
    (d ? [32, 50, 68, 86, 104, 120].map((x, i) => `<rect x="${x - 7}" y="38" width="14" height="20" rx="2" fill="url(#gGlass)" ${THIN} stroke-width="1"/><rect x="${x - 6}" y="45" width="12" height="12" fill="${['#f6c945', '#c0281a', '#e07b1d', '#7a5a2a', '#3f8a2a', '#c9a24a'][i]}" opacity=".85"/><rect x="${x - 7}" y="34" width="14" height="5" rx="1" fill="url(#gCopper)" ${THIN} stroke-width=".8"/>`).join('')
      : cobweb(20, 20, 0.7) + dustPile(74, 58)),
  stove: (d) =>
    `<rect x="140" y="96" width="90" height="32" rx="3" fill="${d ? '#fffdf6' : '#8a8a80'}" ${O}/><rect x="148" y="104" width="74" height="20" rx="2" fill="#3b3b44" ${THIN}/>` +
    `<rect x="136" y="90" width="98" height="8" rx="2" fill="${d ? 'url(#gSteel)' : '#6a6a6a'}" ${THIN}/>` +
    (d ? [162, 208].map((x) => `<path d="M${x - 8} 90 q8 -10 16 0" fill="none" stroke="#5aa7ff" stroke-width="2.4"/>`).join('') + glow(185, 86, 30, 0.35) : ''),
  pots: (d) => (d ? item(4, 162, 92, 0.42) + item(4, 208, 92, 0.38) : `<ellipse cx="170" cy="200" rx="16" ry="6" fill="#8a6a4a" ${THIN}/><ellipse cx="206" cy="210" rx="12" ry="5" fill="#7a5a3a" ${THIN}/>`),
  herbs: (d) =>
    `<rect x="24" y="116" width="96" height="12" rx="3" fill="url(#gWood)" ${O}/>` +
    (d ? item(2, 48, 120, 0.4) + item(2, 72, 122, 0.36) + item(1, 100, 126, 0.3) + `<path d="M108 116 l14 -10" stroke="#9aa4b0" stroke-width="3" stroke-linecap="round"/>` : ''),
};

// ------------------------------------------------------------------ بازار تره‌بار

const marketBase = () =>
  `<rect width="360" height="240" fill="url(#gSky)"/><rect y="40" width="360" height="12" fill="#5a6a7a" ${THIN}/>` +
  [20, 120, 240, 340].map((x) => `<path d="M${x} 52 V200" stroke="#5a6a7a" stroke-width="5"/>`).join('') +
  `<path d="M0 40 L30 10 H330 L360 40 Z" fill="url(#gGreenTile)" ${O}/>` + `<rect y="196" width="360" height="44" fill="#9a948a"/>` +
  Array.from({ length: 8 }, (_, i) => `<path d="M${i * 48} 196 L${i * 48 - 20} 240" stroke="${INK}" stroke-width="1" opacity=".15"/>`).join('');

const crate = (x: number, base: number, w: number, fruit: string, n = 5) =>
  `<rect x="${x - w / 2}" y="${base - 18}" width="${w}" height="18" fill="url(#gWood)" ${O}/><path d="M${x - w / 2} ${base - 9} H${x + w / 2}" stroke="#8b5328" stroke-width="1.4"/>` +
  Array.from({ length: n }, (_, i) => `<circle cx="${x - w / 2 + 6 + i * (w - 12) / (n - 1)}" cy="${base - 21 - (i % 2) * 4}" r="6" fill="${fruit}" ${THIN} stroke-width="1"/>`).join('');

const MARKET: Record<string, Layer> = {
  stalls: (d) =>
    `<rect x="26" y="150" width="90" height="10" rx="2" fill="url(#gWood)" ${O}/><path d="M34 160 V196 M108 160 V196" ${O} stroke-width="3"/>` +
    (d ? [42, 70, 98].map((x, i) => `<path d="M${x - 14} 150 Q${x} 124 ${x + 14} 150 Z" fill="${['url(#gLeaf)', 'url(#gLeafDark)', '#7fc85a'][i]}" ${THIN}/>`).join('') + `<rect x="54" y="112" width="34" height="12" rx="2" fill="#fffdf6" ${THIN}/>` + text(71, 121, 'سبزی تازه', 6, '#3f8a2a')
      : dustPile(70, 150)),
  fruit: (d) =>
    d ? crate(150, 196, 44, 'url(#gRed)') + crate(198, 196, 44, 'url(#gOrange)') + crate(174, 176, 44, 'url(#gPom)') + crate(222, 176, 40, 'url(#gYellow)', 4)
      : `<rect x="128" y="178" width="44" height="18" fill="#8a7a6a" ${THIN}/><rect x="176" y="184" width="44" height="12" fill="#7a6a5a" ${THIN} transform="rotate(8 198 190)"/>`,
  spices: (d) =>
    d
      ? [[262, '#f6c945'], [292, '#c0281a'], [322, '#a8783e']].map(([x, c]) => `<path d="M${Number(x) - 13} 196 V176 Q${x} 168 ${Number(x) + 13} 176 V196 Z" fill="#c9a27a" ${O}/><path d="M${Number(x) - 11} 176 Q${x} 156 ${Number(x) + 11} 176 Z" fill="${c}" ${THIN}/>`).join('')
      : `<path d="M250 196 V182 L276 178 L278 196 Z" fill="#9a8a76" ${THIN}/>`,
  scale: (d) =>
    `<rect x="254" y="134" width="80" height="8" rx="2" fill="url(#gWood)" ${O}/>` +
    (d ? `<path d="M294 134 V104" ${O} stroke-width="3"/><path d="M270 106 H318" ${O} stroke-width="2.4"/>` +
        [270, 318].map((x) => `<path d="M${x} 106 L${x - 10} 122 M${x} 106 L${x + 10} 122" stroke="${INK}" stroke-width="1"/><path d="M${x - 12} 122 Q${x} 130 ${x + 12} 122 Z" fill="url(#gBrass)" ${THIN}/>`).join('') +
        `<circle cx="318" cy="118" r="4" fill="url(#gRed)" ${THIN} stroke-width=".8"/><rect x="264" y="116" width="10" height="6" fill="url(#gSteel)" ${THIN} stroke-width=".8"/>`
      : `<path d="M282 134 l24 -14" stroke="#7a6a5a" stroke-width="3"/>`),
  cart: (d) =>
    d
      ? `<path d="M120 204 H208 L200 228 H128 Z" fill="url(#gWicker)" ${O}/><circle cx="136" cy="232" r="6" fill="#2a2a2a" ${THIN}/><circle cx="192" cy="232" r="6" fill="#2a2a2a" ${THIN}/>` +
        `<path d="M208 204 L224 192" ${O} stroke-width="3"/>` + item(2, 142, 206, 0.3) + item(1, 196, 206, 0.26) + `<circle cx="168" cy="198" r="7" fill="url(#gRed)" ${THIN}/><circle cx="178" cy="200" r="6" fill="url(#gOrange)" ${THIN}/>`
      : `<path d="M120 214 L196 226" stroke="#7a6a5a" stroke-width="4"/><circle cx="130" cy="230" r="6" fill="#4a4a4a"/>`,
};

// ------------------------------------------------------------------ فینال آشپزی

const finalBase = () => alleyBase() + TVSET.banner(true) + TVSET.lights(true) + TVSET.cameras(true) + darkness(0.18);

const FINALCOOK: Record<string, Layer> = {
  stations: (d) => [100, 180, 260].map((x, i) => counter(x, 178, 64, d) + (d && i === 0 ? glow(x, 136, 26, 0.6) : '')).join(''),
  pots: (d) => (d ? item(6, 100, 140, 0.4) + item(6, 180, 140, 0.4) + item(6, 260, 140, 0.4) : ''),
  tahdig: (d) => (d ? glow(180, 200, 46, 0.7) + item(5, 180, 222, 0.7) + sparkle(220, 176, 7) + sparkle(140, 184, 5) : `<ellipse cx="180" cy="214" rx="26" ry="8" fill="url(#gSilver)" ${THIN}/>`),
  table: (d) =>
    d
      ? `<rect x="96" y="226" width="40" height="8" rx="2" fill="#fffdf6" ${THIN}/><rect x="224" y="226" width="40" height="8" rx="2" fill="#fffdf6" ${THIN}/>` + item(7, 116, 230, 0.26) + item(7, 244, 230, 0.26)
      : '',
  clock: (d) =>
    `<path d="M320 96 V150" stroke="#3a3a44" stroke-width="3"/><circle cx="320" cy="78" r="20" fill="${d ? '#fffdf6' : '#9a9aa0'}" ${O}/>` +
    (d ? `<path d="M320 78 V64 M320 78 L330 84" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><path d="M320 58 A20 20 0 0 1 338 70 L320 78 Z" fill="#e0303f" opacity=".35"/>` : `<path d="M308 70 l24 18" stroke="${INK}" stroke-width="1.4"/>`),
};

// ------------------------------------------------------------------ سفره‌ی محله

const nightAlley = () =>
  `<rect width="360" height="120" fill="#1f2350"/>` + Array.from({ length: 14 }, (_, i) => `<circle cx="${(i * 71 + 9) % 340 + 10}" cy="${(i * 13 + 5) % 50 + 6}" r="${i % 3 ? 1 : 1.6}" fill="#fff6d0"/>`).join('') +
  `<rect x="120" y="70" width="120" height="120" fill="#b5804d" ${THIN}/>` + [150, 200].map((x) => `<rect x="${x}" y="96" width="16" height="22" rx="7" fill="#ffe08a" ${THIN} stroke-width="1"/>`).join('') +
  `<path d="M0 20 L120 66 V194 L0 240 Z" fill="#c98a52" ${O}/><path d="M360 20 L240 66 V194 L360 240 Z" fill="#c98a52" ${O}/>` +
  [[40, 90], [80, 110], [320, 90], [280, 110]].map(([x, y]) => `<rect x="${x - 7}" y="${y}" width="14" height="22" rx="6" fill="#ffe08a" ${THIN} stroke-width="1"/>`).join('') +
  `<path d="M120 194 H240 L360 240 H0 Z" fill="#9a948a"/>`;

const SOFREH_PATH = 'M150 194 H210 L260 240 H100 Z';

const BIGSOFREH: Record<string, Layer> = {
  sofreh: (d) => (d ? `<path d="${SOFREH_PATH}" fill="#fffdf6" ${O}/><path d="M152 198 H208 M140 212 H220 M124 228 H236" stroke="#e0303f" stroke-width="1.4" opacity=".6"/>` : dustPile(180, 220)),
  dishes: (d) =>
    d ? [[166, 200, 0.15, 4], [196, 200, 0.15, 6], [150, 215, 0.21, 7], [210, 215, 0.21, 5], [132, 236, 0.28, 6], [228, 236, 0.28, 4]].map(([x, y, sc, lv]) => item(lv, x, y + 4, sc)).join('') : '',
  bread: (d) => (d ? `<path d="M88 236 H120 L116 222 H92 Z" fill="url(#gWicker)" ${THIN}/>` + sangak(92, 214, 26, 9) + `<path d="M240 236 H272 L268 222 H244 Z" fill="url(#gWicker)" ${THIN}/>` + sangak(244, 214, 26, 9) : ''),
  sweets: (d) =>
    d ? estekan(180, 206, 0.16, true, false) + estekan(172, 226, 0.2, true, false) + estekan(190, 226, 0.2, true, false) + teapot(180, 186, 0.22, 'url(#gCream)') : '',
  lights: (d) =>
    d ? stringLights(60, ['#ffd36b', '#ff7a9c', '#5fe0e0', '#9be36b']) + stringLights(90, ['#ffd36b', '#fff6d0', '#ffd36b', '#ff7a9c']) + glow(180, 200, 90, 0.4) : darkness(0.4),
};

export const SCENES17: Record<string, SceneDef> = {
  tvset: { base: alleyBase(), order: ['banner', 'lights', 'stations', 'judges', 'cameras'], layers: TVSET },
  golabkitchen: { base: kitchenBase(), order: ['window', 'shelf', 'stove', 'pots', 'herbs'], layers: GOLABKITCHEN },
  market: { base: marketBase(), order: ['stalls', 'fruit', 'spices', 'scale', 'cart'], layers: MARKET },
  finalcook: { base: finalBase(), order: ['stations', 'pots', 'tahdig', 'table', 'clock'], layers: FINALCOOK },
  bigsofreh: { base: nightAlley(), order: ['sofreh', 'dishes', 'bread', 'sweets', 'lights'], layers: BIGSOFREH },
};
