// Season 14 («کاروانسرا») place scenes. Same contract as scenes.ts: each task layer is drawn
// "before" until done, then "after".

import { INK, O, THIN, estekan, samovar, sparkle } from './kit';
import { camel } from './chainsP';
import { Layer, SceneDef, boardedDoor, cobweb, dustPile, floor, glow, latticeDoor, plank, sangak, takht } from './scenes';
import { text } from './scenes3';

const stars = (n: number, h: number, seed = 0) =>
  Array.from({ length: n }, (_, i) => `<circle cx="${(i * 67 + 13 + seed) % 352 + 4}" cy="${(i * 29 + 7 + seed) % h + 4}" r="${i % 4 ? 1 : 1.8}" fill="#fff6d0" opacity="${i % 3 ? 0.7 : 1}"/>`).join('');

const bell = (x: number, y: number) =>
  `<path d="M${x} ${y - 6} V${y}" stroke="#c0392b" stroke-width="2"/><path d="M${x - 4} ${y + 8} C${x - 4} ${y + 2} ${x - 2} ${y} ${x} ${y} C${x + 2} ${y} ${x + 4} ${y + 2} ${x + 4} ${y + 8} Z" fill="url(#gBrass)" ${THIN} stroke-width="1"/>`;

/** Brick courses for a wall section. */
const bricks = (x: number, y: number, w: number, h: number, line = '#a8703e') =>
  Array.from({ length: Math.floor(h / 10) }, (_, i) => `<path d="M${x} ${y + 10 + i * 10} H${x + w}" stroke="${line}" stroke-width="1" opacity=".55"/>`).join('');

const pointedArch = (cx: number, base: number, w: number, h: number) =>
  `M${cx - w / 2} ${base} V${base - h + w * 0.45} Q${cx - w / 2} ${base - h + 4} ${cx} ${base - h} Q${cx + w / 2} ${base - h + 4} ${cx + w / 2} ${base - h + w * 0.45} V${base} Z`;

// ------------------------------------------------------------------ قهوه‌خونه‌ی بین‌راهی

const roadBase = () =>
  `<rect width="360" height="150" fill="url(#gSky)"/>` +
  `<path d="M0 120 L40 96 L80 112 L130 88 L180 110 L240 92 L300 112 L360 98 V150 H0 Z" fill="#c9a27a" opacity=".7"/>` +
  `<rect y="140" width="360" height="100" fill="#e3c38c"/>` +
  `<rect x="86" y="70" width="210" height="100" fill="#c99a62" ${O}/><rect x="80" y="64" width="222" height="10" rx="2" fill="#a8783e" ${THIN}/>` +
  bricks(86, 74, 210, 90, '#a8783e') + `<path d="M170 170 V112 Q170 96 186 96 Q202 96 202 112 V170 Z" fill="#5e3418" ${O}/>` +
  `<rect y="212" width="360" height="28" fill="#5a5a60"/>` + Array.from({ length: 8 }, (_, i) => `<rect x="${i * 48 + 6}" y="224" width="26" height="4" fill="#f4f0e6"/>`).join('');

const ROADHOUSE: Record<string, Layer> = {
  sign: (d) =>
    d
      ? `<rect x="130" y="34" width="112" height="28" rx="4" fill="url(#gNavy)" ${O}/><rect x="134" y="38" width="104" height="20" rx="3" fill="none" stroke="#f6c945" stroke-width="1.4"/>` +
        text(194, 53, 'چای داغ', 13, '#ffe08a') + estekan(150, 50, 0.24, true, false)
      : `<g transform="rotate(12 186 48)"><rect x="130" y="36" width="112" height="26" rx="4" fill="#7a7a80" ${O}/></g><path d="M134 34 V28 M238 54 V28" stroke="${INK}" stroke-width="1.4"/>`,
  lights: (d) =>
    `<path d="M330 212 V120" stroke="#5a5a60" stroke-width="4"/><path d="M330 120 H312" stroke="#5a5a60" stroke-width="3"/>` +
    (d ? `<circle cx="312" cy="126" r="6" fill="#fff6a8" ${THIN}/>` + glow(312, 130, 32, 0.6) +
        `<path d="M86 66 Q140 80 192 66 T296 66" fill="none" stroke="${INK}" stroke-width="1.2"/>` +
        Array.from({ length: 9 }, (_, i) => { const x = 94 + i * 25; return `<circle cx="${x}" cy="${70 + Math.abs(Math.sin(i * 0.8)) * 4}" r="3" fill="${['#ffd36b', '#ff7a9c', '#9be36b'][i % 3]}" ${THIN} stroke-width=".7"/>`; }).join('')
      : `<circle cx="312" cy="126" r="6" fill="#6a6a6a" ${THIN}/><path d="M308 122 l8 8" stroke="${INK}" stroke-width="1.2"/>`),
  benches: (d) => (d ? takht(20, 168, 120) + takht(232, 172, 100) : plank(26, 186, 100, 8) + plank(236, 192, 90, -6) + dustPile(80, 206)),
  samovar: (d) =>
    d
      ? glow(110, 150, 30, 0.5) + `<g transform="translate(86 116) scale(.5)">${samovar('url(#gBrass)')}</g>` +
        `<path d="M110 116 q-6 -10 2 -18 q6 -8 0 -16" fill="none" stroke="#f4f0e6" stroke-width="2" opacity=".8"/>`
      : `<g transform="translate(140 148) rotate(70) scale(.42)" opacity=".75" style="filter:grayscale(1)">${samovar('url(#gSteel)')}</g>`,
  dizi: (d) =>
    d
      ? `<ellipse cx="80" cy="160" rx="34" ry="6" fill="url(#gBrass)" ${O}/>` +
        [62, 96].map((x) => `<path d="M${x - 11} 146 H${x + 11} L${x + 9} 160 H${x - 9} Z" fill="#4a4a52" ${THIN}/><ellipse cx="${x}" cy="146" rx="11" ry="3" fill="#8a5a2a" ${THIN} stroke-width="1"/>`).join('') +
        sangak(260, 160, 44, 12) + `<path d="M62 140 q-3 -6 0 -10 M96 140 q3 -6 0 -10" fill="none" stroke="#f4f0e6" stroke-width="1.6" opacity=".8"/>`
      : `<ellipse cx="80" cy="200" rx="30" ry="5" fill="#9a8a76" ${THIN}/>`,
};

// ------------------------------------------------------------------ کاروانسرای صفوی

const courtyardBase = () =>
  `<rect width="360" height="60" fill="url(#gSky)"/><rect y="44" width="360" height="128" fill="#d8a86a"/>` + bricks(0, 44, 360, 120) +
  `<rect y="40" width="360" height="8" fill="#b8844a" ${THIN}/>` + floor('#c9945a', 168);

const ARCHES = [34, 92, 268, 326];

const CARAVAN: Record<string, Layer> = {
  iwans: (d) =>
    ARCHES.map((x, i) => d || i % 2
      ? `<path d="${pointedArch(x, 160, 46, 84)}" fill="#7a4a2a" ${O}/><path d="${pointedArch(x, 160, 34, 70)}" fill="#4a2a18"/>`
      : `<path d="M${x - 23} 160 V110 L${x - 10} 96 M${x + 23} 160 V118" fill="none" ${O}/>` + `<path d="M${x - 24} 160 Q${x} 140 ${x + 26} 160 Z" fill="#b8844a" ${THIN}/>`).join(''),
  gate: (d) =>
    d
      ? `<rect x="134" y="16" width="92" height="152" fill="#e0b07a" ${O}/>` + bricks(134, 16, 92, 150, '#b8844a') +
        `<path d="${pointedArch(180, 168, 56, 116)}" fill="#5e3418" ${O}/>` +
        `<rect x="140" y="22" width="80" height="20" fill="url(#gTurq)" ${THIN}/>` + text(180, 37, 'بنا شد', 10, '#fffdf6') +
        Array.from({ length: 6 }, (_, i) => `<path d="M${142 + i * 13} 52 l6 -6 l6 6" fill="none" stroke="#9a6a3a" stroke-width="1.6"/>`).join('') + sparkle(226, 18, 5)
      : `<path d="M134 168 V40 L150 30 L170 44 L196 26 L226 46 V168 Z" fill="#c09060" ${O}/><path d="${pointedArch(180, 168, 56, 100)}" fill="#5e3418" ${O}/>` +
        `<path d="M150 60 l14 22 M206 70 l-10 26" stroke="${INK}" stroke-width="1.4"/>`,
  platforms: (d) =>
    [[60, 168], [300, 168]].map(([x, y]) => d
      ? `<rect x="${x - 50}" y="${y - 14}" width="100" height="18" fill="#c99a62" ${O}/>` +
        `<rect x="${x - 40}" y="${y - 30}" width="22" height="16" rx="4" fill="url(#gWicker)" ${THIN}/><rect x="${x - 14}" y="${y - 34}" width="26" height="20" rx="5" fill="url(#gCarpet)" ${THIN}/><rect x="${x + 16}" y="${y - 28}" width="20" height="14" rx="4" fill="#b8945a" ${THIN}/>`
      : `<path d="M${x - 50} ${y + 4} V${y - 6} L${x - 20} ${y - 14} L${x + 10} ${y - 4} L${x + 50} ${y - 10} V${y + 4} Z" fill="#a8784a" ${O}/>` + dustPile(x, y + 6)).join(''),
  tree: (d) =>
    `<path d="M322 230 C318 200 324 180 318 160" fill="none" stroke="#6b4a2a" stroke-width="7" stroke-linecap="round"/>` +
    (d
      ? [[300, 150, 20], [330, 140, 22], [316, 124, 20], [344, 160, 14]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gLeaf)" ${THIN}/>`).join('') +
        [[298, 146], [326, 134], [340, 156], [312, 118], [306, 160]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#e0303f" ${THIN} stroke-width=".8"/>`).join('')
      : `<path d="M318 160 l-18 -20 M318 166 l16 -26 M310 150 l-6 -18" stroke="#6b4a2a" stroke-width="3" stroke-linecap="round"/>`),
  pool: (d) =>
    `<path d="M120 206 L140 192 H220 L240 206 L220 220 H140 Z" fill="#b8844a" ${O}/>` +
    (d ? `<path d="M130 206 L144 196 H216 L230 206 L216 216 H144 Z" fill="url(#gWater)" ${THIN}/>` + glow(180, 206, 30, 0.3)
      : `<path d="M130 206 L144 196 H216 L230 206 L216 216 H144 Z" fill="#a89070" ${THIN}/><path d="M150 202 l20 8 l14 -6 M196 212 l12 -8" fill="none" stroke="${INK}" stroke-width="1" opacity=".6"/>`),
};

// ------------------------------------------------------------------ حجره‌های کاروانسرا

const chamberBase = () =>
  `<rect width="360" height="240" fill="#b8804a"/><path d="M0 0 H360 V40 Q180 -10 0 40 Z" fill="#8a5a32"/>` + bricks(0, 30, 360, 140, '#9a6a3a') +
  `<path d="M0 40 Q180 -10 360 40" fill="none" stroke="#6b4a2a" stroke-width="3"/>` + floor('#a8703e', 172);

const kilim = (x: number, y: number, w: number, h: number) =>
  `<path d="M${x} ${y} H${x + w} L${x + w + 16} ${y + h} H${x - 16} Z" fill="#c0392b" ${O}/>` +
  [0.25, 0.5, 0.75].map((f, i) => `<path d="M${x - 16 * f} ${y + h * f} H${x + w + 16 * f}" stroke="${['#1d4fa8', '#f6e3b0', '#1d4fa8'][i]}" stroke-width="5"/>`).join('') +
  Array.from({ length: 5 }, (_, i) => `<path d="M${x + 14 + i * (w - 28) / 4} ${y + h * 0.5} l6 -6 l6 6 l-6 6 Z" fill="#f6c945" stroke="${INK}" stroke-width=".6"/>`).join('');

const HOJREH: Record<string, Layer> = {
  door: (d) => (d ? latticeDoor(258, 66, 72, 106) : boardedDoor(258, 66, 72, 106)),
  niche: (d) =>
    `<path d="${pointedArch(60, 120, 56, 64)}" fill="${d ? '#6b4a2a' : '#7a5a3a'}" ${O}/><rect x="28" y="118" width="64" height="6" fill="#8a5a32" ${THIN}/>` +
    (d ? `<path d="M50 118 Q50 108 60 108 L72 110 Q66 118 50 118 Z" fill="url(#gClay)" ${THIN}/><path d="M71 110 q4 -6 0 -12 q-4 6 0 12 Z" fill="url(#gFire)"/>` + glow(70, 100, 34, 0.7)
      : cobweb(32, 60, 0.6) + dustPile(60, 118)),
  curtain: (d) =>
    `<path d="${pointedArch(170, 110, 60, 72)}" fill="#3a2a5a" ${O}/>` +
    (d ? `<path d="M140 66 Q170 40 200 66 L196 110 Q190 92 172 86 Q150 92 144 110 Z" fill="#f2e8d0" ${THIN}/><path d="M146 80 Q170 62 194 80" fill="none" stroke="#3a76c4" stroke-width="2"/>` +
        `<circle cx="158" cy="56" r="1.6" fill="#fff6d0"/><circle cx="182" cy="52" r="1.2" fill="#fff6d0"/>`
      : `<path d="M144 60 L152 104 L160 70 L168 108 L176 66" fill="none" stroke="#9a8a76" stroke-width="3"/>`),
  rugs: (d) => (d ? kilim(80, 184, 200, 40) : dustPile(130, 210) + dustPile(230, 200)),
  cushions: (d) =>
    d
      ? [[24, 'url(#gCarpet)'], [80, 'url(#gRed)'], [136, 'url(#gNavy)']].map(([x, c]) => `<rect x="${x}" y="146" width="50" height="34" rx="12" fill="${c}" ${O}/><path d="M${Number(x) + 6} 163 H${Number(x) + 44}" stroke="#f6c945" stroke-width="2" stroke-dasharray="4 3"/>`).join('') +
        `<ellipse cx="206" cy="182" rx="18" ry="9" fill="url(#gCream)" ${O}/>`
      : `<rect x="40" y="170" width="70" height="12" rx="5" fill="#7a6a5a" ${THIN}/>`,
};

// ------------------------------------------------------------------ شب کویر

const desertNightBase = () =>
  `<rect width="360" height="240" fill="#1c1c40"/>` +
  `<path d="M0 120 C80 70 200 60 360 0 V40 C220 90 110 110 0 160 Z" fill="#e6e0ff" opacity=".10"/>` + stars(46, 150) + stars(20, 150, 31) +
  `<path d="M0 168 Q60 140 130 156 T260 150 T360 160 V240 H0 Z" fill="#4a3a5a"/><path d="M0 190 Q90 170 180 186 T360 182 V240 H0 Z" fill="#5e4a62"/>`;

const DESERTNIGHT: Record<string, Layer> = {
  telescope: (d) =>
    d
      ? `<path d="M290 206 L300 170 L310 206 M300 170 V206" fill="none" stroke="#c9d1dc" stroke-width="2.4" stroke-linecap="round"/>` +
        `<g transform="rotate(-36 300 168)"><rect x="276" y="162" width="52" height="12" rx="4" fill="url(#gSilver)" ${O}/><rect x="326" y="160" width="8" height="16" rx="2" fill="#3a3a44" ${THIN}/></g>` +
        `<circle cx="336" cy="40" r="6" fill="#f6d28a" ${THIN} stroke-width=".8"/><ellipse cx="336" cy="40" rx="11" ry="3" fill="none" stroke="#f6d28a" stroke-width="1.4" transform="rotate(-18 336 40)"/>`
      : `<rect x="282" y="196" width="46" height="16" rx="3" fill="#6a5a4a" ${O}/><path d="M282 202 H328" stroke="#4a3a2a" stroke-width="1.4"/>`,
  camel: (d) =>
    d
      ? camel(72, 178, 1.15, `<path d="M-8 -38 C-4 -48 10 -48 12 -38 L14 -28 H-10 Z" fill="url(#gRed)" ${THIN}/>` + bell(-24, -34))
      : Array.from({ length: 7 }, (_, i) => `<ellipse cx="${30 + i * 16}" cy="${182 + (i % 2) * 6}" rx="3" ry="1.6" fill="#3a2a4a"/>`).join(''),
  rug: (d) => (d ? kilim(54, 200, 100, 26) : `<rect x="40" y="208" width="60" height="12" rx="6" fill="#7a4a3a" ${THIN}/><circle cx="40" cy="214" r="6" fill="#9a5a4a" ${THIN}/>`),
  fire: (d) =>
    `<path d="M162 222 L198 210 M164 210 L200 222" stroke="#6b4a2a" stroke-width="6" stroke-linecap="round"/>` +
    (d ? glow(180, 196, 80, 0.75) + `<path d="M166 212 C160 196 172 186 170 172 C180 180 182 164 186 156 C192 172 202 182 194 212 Z" fill="url(#gFire)" ${THIN}/>` +
        `<path d="M176 212 C174 202 180 196 180 188 C186 196 188 204 186 212 Z" fill="#fff6a8"/>`
      : `<ellipse cx="180" cy="214" rx="22" ry="5" fill="#6a6a70"/>`),
  tea: (d) =>
    d
      ? `<path d="M206 206 C204 194 228 194 226 206 Z" fill="#2a2a2a" ${THIN}/><path d="M226 200 l8 -6" stroke="#2a2a2a" stroke-width="3"/><path d="M210 196 q6 -6 12 0" fill="none" stroke="#2a2a2a" stroke-width="2"/>` +
        `<ellipse cx="246" cy="222" rx="22" ry="5" fill="url(#gBrass)" ${THIN}/>` + estekan(238, 218, 0.24, true, false) + estekan(254, 218, 0.24, true, false)
      : `<ellipse cx="246" cy="222" rx="22" ry="5" fill="#7a6a5a" ${THIN}/>`,
};

// ------------------------------------------------------------------ اقامتگاه بوم‌گردی

const lodgeBase = () => courtyardBase() + CARAVAN.iwans(true) + CARAVAN.gate(true) + CARAVAN.tree(true);

const ECOLODGE: Record<string, Layer> = {
  sign: (d) =>
    d
      ? `<path d="M154 44 L150 58 M206 44 L210 58" stroke="${INK}" stroke-width="1.4"/><rect x="140" y="56" width="80" height="30" rx="4" fill="url(#gWood)" ${O}/>` +
        text(180, 69, 'کاروانسرای', 8, '#fff6d0') + text(180, 81, 'قندی', 10, '#ffe08a')
      : `<rect x="16" y="140" width="80" height="26" rx="4" fill="#9a8a76" ${O} transform="rotate(-10 56 153)"/>`,
  ride: (d) =>
    d
      ? camel(78, 204, 1.05, `<path d="M-8 -38 C-4 -48 10 -48 12 -38 L14 -28 H-10 Z" fill="url(#gTurq)" ${THIN}/><path d="M-10 -28 H14" stroke="#f6c945" stroke-width="2"/>` + bell(-24, -34) +
          [-8, -2, 4, 10].map((x) => `<path d="M${x} -28 v6" stroke="#e0303f" stroke-width="2"/>`).join(''))
      : `<path d="M96 204 V180" stroke="#6b4a2a" stroke-width="4"/><path d="M96 184 q14 6 10 18" fill="none" stroke="#b8945a" stroke-width="2"/>`,
  sofreh: (d) =>
    d
      ? `<path d="M140 196 H236 L248 222 H128 Z" fill="#fffdf6" ${O}/>` +
        `<ellipse cx="160" cy="206" rx="12" ry="4" fill="url(#gTurq)" ${THIN}/><ellipse cx="160" cy="204" rx="8" ry="2.4" fill="#9a6a3a"/>` +
        `<ellipse cx="190" cy="210" rx="13" ry="4" fill="url(#gBlue)" ${THIN}/><ellipse cx="190" cy="208" rx="9" ry="2.6" fill="#c9a24a"/><path d="M184 208 q6 -3 12 0" fill="none" stroke="#fffdf6" stroke-width="1.2"/>` +
        `<ellipse cx="222" cy="206" rx="12" ry="4" fill="url(#gSilver)" ${THIN}/>` + [[216, 203], [222, 201], [228, 203]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#ff9ec4" ${THIN} stroke-width=".7"/>`).join('')
      : `<rect x="210" y="204" width="36" height="12" rx="3" fill="#e8dcc6" ${THIN}/>`,
  crafts: (d) =>
    `<rect x="252" y="176" width="96" height="10" rx="2" fill="url(#gWood)" ${O}/><path d="M258 186 V222 M342 186 V222" ${O} stroke-width="4"/>` +
    (d ? `<path d="M264 176 H286 L284 150 Q275 140 266 150 Z" fill="url(#gClay)" ${THIN}/>` +
        [298, 310].map((x) => `<path d="M${x - 4} 176 V160 Q${x - 4} 154 ${x} 152 Q${x + 4} 154 ${x + 4} 160 V176 Z" fill="url(#gGlass)" ${THIN} stroke-width="1"/><rect x="${x - 3.4}" y="164" width="6.8" height="11" fill="#ff9ec4" opacity=".8"/>`).join('') +
        `<rect x="322" y="150" width="22" height="26" fill="#c0392b" ${THIN}/><path d="M322 158 H344 M322 166 H344" stroke="#1d4fa8" stroke-width="2.4"/>`
      : dustPile(300, 176)),
  book: (d) =>
    `<path d="M186 168 L180 196 M198 168 L204 196" stroke="#6b4a2a" stroke-width="3"/>` +
    (d ? `<path d="M176 170 L192 164 L208 170 L208 160 L192 154 L176 160 Z" fill="#fffdf6" ${O}/><path d="M192 154 V164" stroke="${INK}" stroke-width="1"/>` +
        `<path d="M180 160 h8 M196 160 h8 M180 164 h7" stroke="#9b8a76" stroke-width="1"/><path d="M206 150 l-8 10" stroke="#3a76c4" stroke-width="1.8"/>` + sparkle(214, 148, 5)
      : `<rect x="178" y="160" width="28" height="10" rx="2" fill="#7a5a4a" ${O}/>`),
};

export const SCENES14: Record<string, SceneDef> = {
  roadhouse: { base: roadBase(), order: ['sign', 'lights', 'benches', 'samovar', 'dizi'], layers: ROADHOUSE },
  caravan: { base: courtyardBase(), order: ['iwans', 'gate', 'platforms', 'tree', 'pool'], layers: CARAVAN },
  hojreh: { base: chamberBase(), order: ['door', 'niche', 'curtain', 'rugs', 'cushions'], layers: HOJREH },
  desertnight: { base: desertNightBase(), order: ['telescope', 'camel', 'rug', 'fire', 'tea'], layers: DESERTNIGHT },
  ecolodge: { base: lodgeBase(), order: ['sign', 'ride', 'sofreh', 'crafts', 'book'], layers: ECOLODGE },
};
