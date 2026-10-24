// Season 6 («خواستگار تبریزی») place scenes. Same contract as scenes.ts: each task layer is
// drawn "before" until done, then "after".

import { INK, O, THIN, estekan, samovar, sparkle } from './kit';
import { Layer, SceneDef, cobweb, dustPile, floor, geranium, glow, lantern, plank, stringLights } from './scenes';
import { courtyard, darkness, text, wall } from './scenes3';

/** A Persian carpet: field, border, medallion and fringe (w × h box at x, y). */
const carpet = (x: number, y: number, w: number, h: number, field: string, border: string, rot = 0) =>
  `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})">` +
  `<path d="M${x + 3} ${y} v-4 M${x + w / 2} ${y} v-4 M${x + w - 3} ${y} v-4 M${x + 3} ${y + h} v4 M${x + w / 2} ${y + h} v4 M${x + w - 3} ${y + h} v4" stroke="#f6e3b0" stroke-width="1.4"/>` +
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${border}" ${O}/>` +
  `<rect x="${x + w * 0.12}" y="${y + h * 0.1}" width="${w * 0.76}" height="${h * 0.8}" fill="${field}" ${THIN} stroke-width="1"/>` +
  `<path d="M${x + w / 2} ${y + h * 0.24} L${x + w * 0.74} ${y + h / 2} L${x + w / 2} ${y + h * 0.76} L${x + w * 0.26} ${y + h / 2} Z" fill="${border}" ${THIN} stroke-width="1"/>` +
  `<circle cx="${x + w / 2}" cy="${y + h / 2}" r="${Math.min(w, h) * 0.08}" fill="#f6e3b0"/>` +
  [0.18, 0.82].map((fx) => [0.18, 0.82].map((fy) => `<circle cx="${x + w * fx}" cy="${y + h * fy}" r="${Math.min(w, h) * 0.05}" fill="#f6e3b0" opacity=".8"/>`).join('')).join('') +
  `</g>`;

/** A brick vault (pointed arch) spanning x0…x1, springing at y. */
const vault = (x0: number, x1: number, y: number, rise: number, fill: string) => {
  const m = (x0 + x1) / 2;
  return `<path d="M${x0} ${y} Q${x0} ${y - rise * 0.8} ${m} ${y - rise} Q${x1} ${y - rise * 0.8} ${x1} ${y}" fill="none" stroke="${fill}" stroke-width="10"/>` +
    `<path d="M${x0} ${y} Q${x0} ${y - rise * 0.8} ${m} ${y - rise} Q${x1} ${y - rise * 0.8} ${x1} ${y}" fill="none" ${THIN}/>`;
};

// ------------------------------------------------------------------ حجره‌ی فرش

const CARPETSHOP: Record<string, Layer> = {
  hang: (d) =>
    d
      ? carpet(20, 24, 70, 100, 'url(#gCarpet)', 'url(#gNavy)') + carpet(112, 34, 60, 84, 'url(#gNavy)', 'url(#gCarpet)') + carpet(270, 24, 70, 100, '#2f7d6d', 'url(#gCarpet)') +
        `<path d="M14 22 H96 M106 32 H178 M264 22 H346" ${O} stroke="url(#gWoodDark)" stroke-width="4"/>`
      : `<path d="M14 22 H96 M264 22 H346" ${O} stroke="#8a7a6a" stroke-width="4"/>` + cobweb(0, 0, 1) + cobweb(360, 0, 1, true),
  stack: (d) =>
    d
      ? Array.from({ length: 7 }, (_, i) => {
        const c = ['url(#gCarpet)', 'url(#gNavy)', '#2f7d6d', 'url(#gCarpet)', '#c0782e', 'url(#gNavy)', 'url(#gCarpet)'][i];
        return `<rect x="${196 + (i % 2) * 4}" y="${212 - i * 12}" width="66" height="12" rx="3" fill="${c}" ${THIN}/><path d="M${202 + (i % 2) * 4} ${218 - i * 12} h54" stroke="#f6e3b0" stroke-width="1.4" stroke-dasharray="3 3"/>`;
      }).join('')
      : dustPile(228, 220) + `<rect x="200" y="206" width="60" height="12" rx="3" fill="#8a7a6a" ${THIN}/>`,
  loom: (d) =>
    `<path d="M36 236 V140 M120 236 V140" ${O} stroke="url(#gWood)" stroke-width="6"/><path d="M30 146 H126 M30 228 H126" ${O} stroke="url(#gWoodDark)" stroke-width="5"/>` +
    (d
      ? Array.from({ length: 16 }, (_, i) => `<path d="M${40 + i * 5} 148 V226" stroke="#f6e3b0" stroke-width="1"/>`).join('') +
        `<rect x="40" y="190" width="76" height="36" fill="url(#gCarpet)" ${THIN} stroke-width="1"/><path d="M78 196 l12 12 l-12 12 l-12 -12 Z" fill="url(#gNavy)" stroke="${INK}" stroke-width=".8"/>` +
        [44, 58, 72, 86, 100].map((x, i) => `<circle cx="${x}" cy="152" r="3" fill="${['#e0303f', '#f6c945', '#3a76c4', '#2f7d6d', '#fffdf6'][i]}" ${THIN} stroke-width=".8"/>`).join('')
      : `<path d="M40 150 L110 220 M110 150 L60 200" stroke="#8a7a6a" stroke-width="1.4"/>`),
  lamp: (d) => (d ? lantern(222, 96) + glow(222, 130, 90, 0.25) + sparkle(300, 150, 5) : darkness(0.3)),
  sign: (d) =>
    d
      ? `<rect x="120" y="-4" width="120" height="26" rx="6" fill="url(#gNavy)" ${O}/>` + text(180, 15, 'فرش آیدین', 14, '#ffe08a')
      : `<g transform="rotate(-5 180 9)"><rect x="120" y="-4" width="120" height="26" rx="6" fill="#5a5a6a" ${O}/>${text(180, 14, '…اجاره', 12, '#9a9aaa')}</g>`,
};

// ------------------------------------------------------------------ بازار تبریز

const BAZAAR: Record<string, Layer> = {
  vaults: (d) => {
    const c = d ? '#c98a52' : '#8a7a6a';
    return [[0, 360, 110, 100], [40, 320, 120, 70], [80, 280, 128, 48], [116, 244, 134, 30]].map(([a, b, y, r]) => vault(a, b, y, r, c)).join('') +
      (d ? [180].map((x) => `<ellipse cx="${x}" cy="12" rx="10" ry="4" fill="#fff6c8" ${THIN}/><path d="M172 14 L188 14 L214 236 L146 236 Z" fill="#fff6c8" opacity=".2"/>`).join('') : '');
  },
  spices: (d) =>
    `<rect x="0" y="120" width="100" height="70" fill="url(#gWoodDark)" ${O}/>` +
    (d
      ? [[14, '#e05a1d'], [36, '#f6c945'], [58, '#9b2335'], [80, '#7a8a3a']].map(([x, c]) => `<path d="M${Number(x) - 9} 186 L${x} 160 L${Number(x) + 9} 186 Z" fill="${c}" ${THIN}/><ellipse cx="${x}" cy="186" rx="10" ry="3" fill="#c9a26b" ${THIN}/>`).join('') +
        [[18, 136], [46, 132], [74, 136]].map(([x, y]) => `<rect x="${x - 7}" y="${y - 8}" width="14" height="14" rx="3" fill="url(#gGlass)" ${THIN} stroke-width="1"/><rect x="${x - 6}" y="${y - 2}" width="12" height="7" fill="${['#e05a1d', '#9b2335', '#f6c945'][(x / 28) | 0]}"/>`).join('')
      : `<rect x="6" y="128" width="88" height="56" fill="#5a4a3e" ${THIN}/>` + cobweb(0, 120, 0.8)),
  carpets: (d) =>
    d
      ? carpet(272, 118, 40, 64, 'url(#gCarpet)', 'url(#gNavy)') + carpet(318, 112, 40, 70, 'url(#gNavy)', '#c0782e') + carpet(240, 196, 70, 36, '#2f7d6d', 'url(#gCarpet)', -4)
      : `<rect x="272" y="118" width="86" height="70" fill="#5a4a3e" ${O}/>` + plank(270, 150, 90, 8),
  lanterns: (d) =>
    d
      ? [70, 130, 230, 290].map((x, i) => `<path d="M${x} 0 V${30 + (i % 2) * 14}" stroke="${INK}" stroke-width="1.4"/>` +
          `<path d="M${x - 7} ${32 + (i % 2) * 14} h14 l-3 18 h-8 Z" fill="${['#e0303f', '#14879a', '#f6c945', '#2f7d6d'][i]}" ${THIN}/>` + glow(x, 42 + (i % 2) * 14, 22, 0.65)).join('')
      : darkness(0.3),
  shop: (d) =>
    `<rect x="140" y="140" width="80" height="60" fill="${d ? 'url(#gWood)' : '#6b5a4a'}" ${O}/>` +
    (d
      ? `<rect x="146" y="146" width="68" height="40" fill="#3b2a20" ${THIN}/>` + carpet(150, 150, 28, 32, 'url(#gCarpet)', 'url(#gNavy)') + carpet(182, 150, 28, 32, 'url(#gNavy)', 'url(#gCarpet)') +
        `<rect x="152" y="128" width="56" height="14" rx="3" fill="url(#gNavy)" ${THIN}/>` + text(180, 139, 'حجره‌ی ۱۳۲۰', 8, '#ffe08a') + sparkle(224, 128, 5)
      : plank(136, 158, 88, 10) + plank(136, 182, 88, -8)),
};

const bazaarBase = () =>
  `<rect width="360" height="240" fill="#a8764a"/>` +
  // Perspective walls and the corridor floor receding to a bright end.
  `<path d="M0 0 L140 80 L140 190 L0 240 Z" fill="#b98652"/><path d="M360 0 L220 80 L220 190 L360 240 Z" fill="#b98652"/>` +
  `<rect x="140" y="80" width="80" height="110" fill="#f2d3a0"/>` +
  `<path d="M0 240 L140 190 L220 190 L360 240 Z" fill="#9a7a56"/>` +
  Array.from({ length: 6 }, (_, i) => `<path d="M${180 - 20 - i * 30} ${190 + i * 9} H${180 + 20 + i * 30}" stroke="${INK}" stroke-width="1" opacity=".2"/>`).join('');

// ------------------------------------------------------------------ ائل‌گلی (night)

const ELGOLI: Record<string, Layer> = {
  lake: (d) =>
    `<rect y="140" width="360" height="100" fill="${d ? '#1d4e7a' : '#4a5a4a'}"/>` +
    (d
      ? `<ellipse cx="300" cy="170" rx="14" ry="4" fill="#fff6c8" opacity=".6"/>` + [160, 190, 220].map((y, i) => `<path d="M${20 + i * 40} ${y} q20 -4 40 0 M${220 - i * 30} ${y + 8} q20 -4 40 0" fill="none" stroke="#7fd6e6" stroke-width="1.6" opacity=".6"/>`).join('')
      : dustPile(80, 200) + dustPile(260, 216)),
  pavilion: (d) =>
    `<rect x="174" y="128" width="12" height="30" fill="${d ? 'url(#gCream)' : '#8a7a6a'}" ${THIN}/>` +
    `<rect x="130" y="70" width="100" height="62" fill="${d ? 'url(#gCream)' : '#8a7a6a'}" ${O}/><path d="M124 70 L180 40 L236 70 Z" fill="${d ? 'url(#gTerracotta)' : '#6a5a4a'}" ${O}/>` +
    `<rect x="124" y="98" width="112" height="6" fill="${d ? 'url(#gWood)' : '#6a5a4a'}" ${THIN}/>` +
    [140, 160, 180, 200, 220].map((x) => `<path d="M${x - 6} 132 V112 Q${x} 104 ${x + 6} 112 V132 Z M${x - 6} 96 V80 Q${x} 72 ${x + 6} 80 V96 Z" fill="${d ? '#3b2a20' : '#4a4a4a'}" ${THIN} stroke-width="1"/>`).join(''),
  boats: (d) =>
    d
      ? [[70, 196, '#e0303f'], [270, 210, '#f6c945']].map(([x, y, c]) => `<path d="M${Number(x) - 22} ${y} Q${x} ${Number(y) + 12} ${Number(x) + 22} ${y} Z" fill="${c}" ${O}/><path d="M${Number(x) - 4} ${Number(y) - 2} l-14 -12 M${Number(x) + 4} ${Number(y) - 2} l14 -12" ${THIN} stroke-width="2"/>`).join('')
      : `<path d="M40 226 L80 220 L84 232 L44 236 Z" fill="#6a5a4a" ${O}/>`,
  fountains: (d) =>
    d
      ? [100, 260].map((x) => `<path class="steam" d="M${x} 160 V138 M${x} 142 q-10 0 -14 14 M${x} 142 q10 0 14 14" fill="none" stroke="#bfe9ff" stroke-width="2.6" stroke-linecap="round"/>`).join('')
      : '',
  lights: (d) =>
    d
      ? glow(180, 100, 80, 0.45) + [140, 160, 180, 200, 220].map((x) => `<rect x="${x - 4}" y="${x === 180 ? 112 : 116}" width="8" height="12" rx="4" fill="#ffe08a"/><rect x="${x - 4}" y="82" width="8" height="10" rx="4" fill="#ffe08a"/>`).join('') +
        [140, 160, 180, 200, 220].map((x) => `<path d="M${x} 160 V196" stroke="#ffe08a" stroke-width="6" opacity=".25"/>`).join('') + sparkle(120, 40, 5, '#fff6c8') + sparkle(250, 36, 5, '#fff6c8')
      : darkness(0.35),
};

const elgoliBase = () =>
  `<rect width="360" height="140" fill="#1f2a55"/>` +
  Array.from({ length: 24 }, (_, i) => `<circle cx="${(i * 83) % 356 + 2}" cy="${(i * 41) % 70 + 4}" r="${1 + (i % 3) * 0.5}" fill="#fff6c8" opacity=".9"/>`).join('') +
  `<path d="M318 30 a14 14 0 1 1 -9 -23 a11 11 0 1 0 9 23 Z" fill="#fff6c8"/>` +
  // Hills of Eynali behind the lake, and the poplars on the shore.
  `<path d="M0 140 L0 104 Q60 80 120 100 Q190 70 250 98 Q310 78 360 100 L360 140 Z" fill="#2c3666"/>` +
  [20, 44, 320, 344].map((x) => `<path d="M${x} 140 V120" stroke="#1a2040" stroke-width="3"/><ellipse cx="${x}" cy="110" rx="7" ry="18" fill="#1a3a2a"/>`).join('');

// ------------------------------------------------------------------ خونه‌ی ننه‌ی آیدین

const TABRIZHOME: Record<string, Layer> = {
  window: (d) =>
    `<rect x="120" y="24" width="120" height="96" rx="4" fill="url(#gWoodDark)" ${O}/>` +
    (d
      ? `<rect x="128" y="32" width="104" height="80" fill="#8fb6d8" ${THIN}/>` +
        `<path d="M128 96 Q160 84 190 94 T232 90 V112 H128 Z" fill="#fffdf6"/>` +
        Array.from({ length: 16 }, (_, i) => `<circle cx="${132 + (i * 29) % 98}" cy="${36 + (i * 17) % 56}" r="${1.4 + (i % 2)}" fill="#fff"/>`).join('') +
        `<path d="M180 32 V112 M128 72 H232" stroke="${INK}" stroke-width="2.4"/>`
      : `<rect x="128" y="32" width="104" height="80" fill="#5a5a60" ${THIN}/><path d="M140 40 L220 104 M216 40 L150 90" stroke="#2a2a30" stroke-width="2"/>`),
  rug: (d) =>
    d
      ? `<path d="M50 200 L310 200 L340 236 L20 236 Z" fill="#9b2335" ${O}/>` +
        Array.from({ length: 6 }, (_, i) => `<path d="M${70 + i * 42} 206 l10 12 l-10 12 l-10 -12 Z" fill="#f6c945" stroke="${INK}" stroke-width="1"/><path d="M${91 + i * 42} 212 l6 6 l-6 6 l-6 -6 Z" fill="#2f7d6d"/>`).join('')
      : dustPile(180, 220) + dustPile(80, 228),
  samovar: (d) =>
    d
      ? glow(64, 150, 40, 0.5) + `<g transform="translate(30 112) scale(.68)">${samovar('url(#gBrass)', true)}</g>` +
        `<path class="steam" d="M64 112 q-6 -8 0 -16 q6 -8 0 -14" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".7"/>` +
        `<rect x="290" y="150" width="44" height="40" rx="4" fill="url(#gSteel)" ${O}/><rect x="298" y="160" width="28" height="18" rx="3" fill="url(#gFire)" ${THIN}/>` + glow(312, 168, 30, 0.6)
      : `<g transform="translate(30 112) scale(.68)" opacity=".7" style="filter:grayscale(1)">${samovar('url(#gSteel)')}</g><rect x="290" y="150" width="44" height="40" rx="4" fill="#5a5a60" ${O}/>`,
  saz: (d) =>
    d
      ? `<g transform="translate(270 70) rotate(-24)"><path d="M0 -14 C12 -14 18 -4 18 6 C18 20 8 28 0 28 C-8 28 -18 20 -18 6 C-18 -4 -12 -14 0 -14 Z" fill="url(#gWood)" ${O}/>` +
        `<circle cx="0" cy="6" r="4" fill="#3b2216"/><rect x="-3" y="-64" width="6" height="52" rx="2" fill="url(#gWoodDark)" ${THIN}/><path d="M-1 -60 V20 M1 -60 V20" stroke="#f6e3b0" stroke-width=".6"/></g>`
      : '',
  sofreh: (d) =>
    d
      ? `<rect x="110" y="182" width="140" height="22" rx="4" fill="#fffdf6" ${O}/>` +
        [134, 180, 226].map((x) => `<ellipse cx="${x}" cy="190" rx="16" ry="6" fill="url(#gCream)" ${THIN}/><circle cx="${x}" cy="186" r="8" fill="#9b5a2a" ${THIN}/>`).join('') +
        [156, 204].map((x) => `<g transform="translate(${x} 196) scale(.28)">${estekan(0, 0, 1, true)}</g>`).join('') + sparkle(250, 170, 5)
      : '',
};

// ------------------------------------------------------------------ بله‌برون (alley courtyard)

const BALEHBORON: Record<string, Layer> = {
  lights: (d) => (d ? stringLights(18) + lantern(36, 34) + lantern(324, 34) + sparkle(180, 30, 6) : darkness(0.35)),
  sofreh: (d) =>
    d
      ? `<path d="M80 236 L110 172 L250 172 L280 236 Z" fill="url(#gCarpet)" ${O}/><path d="M96 230 L118 180 H242 L264 230 Z" fill="#fffdf6" ${THIN}/>` +
        [[140, 196], [220, 196], [180, 214]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="16" ry="5" fill="url(#gBrass)" ${THIN}/>` + [0, 1, 2].map((i) => `<circle cx="${x - 6 + i * 6}" cy="${y - 3}" r="3" fill="${['#f6c945', '#fffdf6', '#e9b48a'][i]}" ${THIN} stroke-width=".8"/>`).join('')).join('')
      : plank(110, 210, 80, 8) + plank(180, 222, 70, -6),
  rings: (d) =>
    d
      ? glow(180, 186, 24, 0.7) + `<ellipse cx="180" cy="190" rx="16" ry="6" fill="url(#gSilver)" ${THIN}/>` +
        `<circle cx="174" cy="184" r="5" fill="none" stroke="url(#gGold)" stroke-width="2.4"/><circle cx="186" cy="185" r="4" fill="none" stroke="url(#gGold)" stroke-width="2.4"/><circle cx="174" cy="179" r="1.8" fill="#bfe9ff"/>`
      : '',
  ashiq: (d) =>
    d
      ? `<rect x="40" y="186" width="34" height="8" rx="2" fill="url(#gWood)" ${THIN}/><path d="M44 194 V230 M70 194 V230" ${THIN} stroke-width="3"/>` +
        `<g transform="translate(60 166) rotate(-36)"><path d="M0 -10 C9 -10 13 -3 13 4 C13 14 6 20 0 20 C-6 20 -13 14 -13 4 C-13 -3 -9 -10 0 -10 Z" fill="url(#gWood)" ${O}/><rect x="-2" y="-46" width="4" height="38" rx="1" fill="url(#gWoodDark)" ${THIN}/></g>` +
        `<path d="M300 236 L304 196 L312 196 L316 236 Z" fill="#c9a26b" ${O}/><ellipse cx="308" cy="196" rx="10" ry="4" fill="#f6e3b0" ${THIN}/>` + sparkle(90, 150, 5)
      : '',
  sweets: (d) =>
    d
      ? [[100, 160], [260, 160]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="20" ry="6" fill="url(#gSilver)" ${THIN}/>` +
          [0, 1, 2, 3].map((i) => `<ellipse cx="${x - 10 + i * 7}" cy="${y - 4}" rx="4" ry="2.6" fill="${i % 2 ? '#fffdf6' : '#f2d3a0'}" ${THIN} stroke-width=".8"/>`).join('')).join('') +
        geranium(20, 236, 0.7) + geranium(340, 236, 0.7) + sparkle(130, 120, 6) + sparkle(240, 110, 6)
      : '',
};

export const SCENES6: Record<string, SceneDef> = {
  carpetshop: { base: wall('#efe0c6') + floor('#a5703e'), order: ['hang', 'loom', 'stack', 'sign', 'lamp'], layers: CARPETSHOP },
  bazaar: { base: bazaarBase(), order: ['vaults', 'spices', 'carpets', 'shop', 'lanterns'], layers: BAZAAR },
  elgoli: { base: elgoliBase(), order: ['lake', 'pavilion', 'boats', 'fountains', 'lights'], layers: ELGOLI },
  tabrizhome: { base: wall('#e8d8bc') + floor('#8a6a48', 200), order: ['window', 'rug', 'samovar', 'saz', 'sofreh'], layers: TABRIZHOME },
  balehboron: { base: courtyard(), order: ['lights', 'sofreh', 'rings', 'ashiq', 'sweets'], layers: BALEHBORON },
};
