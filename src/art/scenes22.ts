// Season 22 («تابستون بچه‌ها») place scenes. Same contract as scenes.ts: each task layer is drawn
// "before" until done, then "after".

import { INK, O, THIN, estekan, sparkle } from './kit';
import { TOYS } from './chainsX';
import { Layer, SceneDef, dustPile, glow, plank, sangak } from './scenes';
import { darkness, text } from './scenes3';

/** A chain drawing (100×100) placed with its bottom centre on (x, base), without its backdrop disc. */
const art = (src: string, x: number, base: number, s: number) =>
  `<g transform="translate(${x - 50 * s} ${base - 90 * s}) scale(${s})">${src.replace(/^<circle cx="50" cy="5\d" r="4\d"[^>]*\/>/, '')}</g>`;

const brickBand = (y0: number, y1: number, fill = '#d9a873', line = '#b5804d') => {
  let out = `<rect x="0" y="${y0}" width="360" height="${y1 - y0}" fill="${fill}"/>`;
  for (let y = y0 + 14, row = 0; y <= y1; y += 14, row++) {
    out += `<path d="M0 ${y} H360" stroke="${line}" stroke-width="1.2" opacity=".6"/>`;
    for (let x = row % 2 ? 14 : 0; x < 360; x += 28) out += `<path d="M${x} ${y - 14} V${y}" stroke="${line}" stroke-width="1.2" opacity=".5"/>`;
  }
  return out;
};

const PICKETS = ['#e0303f', '#f6c945', '#3a76c4', '#3f8a2a', '#ff7a9c'];

/** A row of painted pickets standing on `base`. */
const fence = (base: number, h: number, x0 = 0, x1 = 360) =>
  `<path d="M${x0} ${base - h * 0.3} H${x1} M${x0} ${base - h * 0.75} H${x1}" stroke="#8b5328" stroke-width="4"/>` +
  Array.from({ length: Math.floor((x1 - x0) / 14) + 1 }, (_, i) => {
    const x = x0 + i * 14;
    return `<path d="M${x} ${base} V${base - h + 5} L${x + 5} ${base - h} L${x + 10} ${base - h + 5} V${base} Z" fill="${PICKETS[i % PICKETS.length]}" ${THIN} stroke-width="1.2"/>`;
  }).join('');

/** A young plane tree tied to a stake; `grown` gives it a fuller crown. */
const sapling = (x: number, base: number, grown = false) =>
  `<path d="M${x + 6} ${base} V${base - 44}" stroke="#a77a4f" stroke-width="2.4"/>` +
  `<path d="M${x} ${base} C${x - 1} ${base - 20} ${x + 1} ${base - 30} ${x} ${base - (grown ? 52 : 40)}" fill="none" stroke="#6b4a2a" stroke-width="${grown ? 5 : 3}" stroke-linecap="round"/>` +
  `<path d="M${x} ${base - 26} h6" stroke="#e8dcc6" stroke-width="2"/>` +
  (grown
    ? [[-14, -56, 15], [12, -58, 15], [0, -72, 15]].map(([dx, dy, r]) => `<circle cx="${x + dx}" cy="${base + dy}" r="${r}" fill="url(#gLeaf)" ${THIN}/>`).join('')
    : [[-7, -42], [7, -44], [0, -50], [-4, -34], [6, -36]].map(([dx, dy], i) => `<ellipse cx="${x + dx}" cy="${base + dy}" rx="4" ry="6" transform="rotate(${i * 40 - 60} ${x + dx} ${base + dy})" fill="${i % 2 ? 'url(#gLeaf)' : '#7fc85a'}" ${THIN} stroke-width=".8"/>`).join(''));

/** A child's bicycle standing on `base`. */
const bike = (x: number, base: number, c: string) =>
  [x - 15, x + 15].map((wx) => `<circle cx="${wx}" cy="${base - 9}" r="9" fill="none" stroke="#2a2a2a" stroke-width="3"/><circle cx="${wx}" cy="${base - 9}" r="1.6" fill="#888"/>`).join('') +
  `<path d="M${x - 15} ${base - 9} L${x - 2} ${base - 9} L${x + 7} ${base - 24} H${x - 8} Z M${x - 2} ${base - 9} L${x - 8} ${base - 24} M${x + 15} ${base - 9} L${x + 8} ${base - 28}" fill="none" stroke="${c}" stroke-width="3" stroke-linejoin="round"/>` +
  `<path d="M${x + 4} ${base - 29} H${x + 13}" stroke="#2a2a2a" stroke-width="3" stroke-linecap="round"/><path d="M${x - 13} ${base - 27} H${x - 4}" stroke="#2a2a2a" stroke-width="4" stroke-linecap="round"/>`;

const parkGround = (y = 150) => `<rect y="${y}" width="360" height="${240 - y}" fill="#d2b48a"/><path d="M0 ${y} H360" stroke="${INK}" stroke-width="1.6" opacity=".25"/>`;

// ------------------------------------------------------------------ زمین خاکی

const lotBase = () =>
  `<rect width="360" height="130" fill="url(#gSky)"/>` + brickBand(70, 150) +
  `<path d="M24 150 V104 Q24 84 54 84 Q84 84 84 104 V150 Z" fill="#4a3022" ${O}/><path d="M24 150 V104 Q24 84 54 84 Q84 84 84 104 V150" fill="none" stroke="#c98a52" stroke-width="5"/>` +
  `<rect x="262" y="30" width="98" height="120" fill="#e0b07a" ${O}/><rect x="288" y="56" width="30" height="34" rx="3" fill="url(#gSky)" ${O}/><path d="M303 56 V90 M288 73 H318" stroke="#3a76c4" stroke-width="3"/>` +
  `<rect y="146" width="360" height="94" fill="#b89a72"/>`;

const DIRTLOT: Record<string, Layer> = {
  level: (d) =>
    d ? parkGround(146) + Array.from({ length: 6 }, (_, i) => `<path d="M${20 + i * 60} ${176 + (i % 3) * 18} h22" stroke="#bf9f74" stroke-width="2" stroke-linecap="round"/>`).join('')
      : [[70, 190, 30], [200, 210, 40], [300, 182, 26], [130, 226, 34]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r / 4}" fill="#8a7050" opacity=".7"/>`).join('') +
        `<path d="M0 200 Q60 190 120 204 T240 198 T360 210" fill="none" stroke="#9a7e58" stroke-width="3"/>`,
  rubble: (d) =>
    d ? `<path d="M36 222 L76 222 L82 208 H30 Z" fill="url(#gSilver)" ${O}/><circle cx="40" cy="228" r="6" fill="#2a2a2a" ${THIN}/><path d="M82 208 L96 196" ${O} stroke-width="3"/>` + sparkle(104, 204, 5)
      : [[60, 222, 46], [190, 214, 56], [300, 228, 44]].map(([x, y, w]) =>
          `<path d="M${x - w / 2} ${y} Q${x - w / 4} ${y - w / 2.2} ${x} ${y - w / 2} Q${x + w / 4} ${y - w / 2.4} ${x + w / 2} ${y} Z" fill="#8f8a80" ${O}/>` +
          `<rect x="${x - 10}" y="${y - w / 4}" width="12" height="7" fill="#b5804d" ${THIN} stroke-width="1" transform="rotate(20 ${x} ${y})"/><rect x="${x + 6}" y="${y - 10}" width="10" height="6" fill="#c98a52" ${THIN} stroke-width="1"/>`).join('') +
        `<ellipse cx="128" cy="230" rx="14" ry="6" fill="none" stroke="#2a2a2a" stroke-width="5"/>`,
  fence: (d) =>
    d ? fence(176, 26, 96, 360)
      : plank(110, 160, 46, -14) + plank(160, 168, 40, 22) + plank(214, 166, 36, -6) + `<path d="M104 176 V150 M246 176 V156" stroke="#7a5a3a" stroke-width="4"/>`,
  trees: (d) => (d ? sapling(112, 186) + sapling(156, 190) + sapling(200, 190) + sapling(244, 186) : ''),
  tap: (d) =>
    d ? `<rect x="314" y="176" width="18" height="34" fill="#c98a52" ${O}/><path d="M323 182 H338 V188" fill="none" stroke="url(#gBrass)" stroke-width="5"/><path d="M323 182 H338 V188" fill="none" stroke="#c9952e" stroke-width="4"/>` +
        `<rect x="320" y="176" width="8" height="5" rx="2" fill="#c0392b" ${THIN} stroke-width="1"/><path d="M338 192 q-2 4 0 6 q2 -2 0 -6 Z" fill="#7cc8f0"/><ellipse cx="338" cy="214" rx="14" ry="3.6" fill="url(#gWater)" opacity=".85"/>`
      : `<path d="M322 212 V188 Q322 180 330 182 L336 190" fill="none" stroke="#8a5a3a" stroke-width="5" stroke-linecap="round"/><path d="M334 188 l6 6 M330 196 l4 -2" stroke="#6a4a2a" stroke-width="1.4"/>`,
};

// ------------------------------------------------------------------ پارک کوچه

const parkBase = () =>
  `<rect width="360" height="130" fill="url(#gSky)"/>` + brickBand(84, 150) + parkGround(146) + fence(160, 22) +
  sapling(30, 168, true) + sapling(190, 166, true) + sapling(336, 168, true);

const MINIPARK: Record<string, Layer> = {
  sandbox: (d) =>
    `<path d="M140 190 L152 170 H220 L232 190 Z" fill="${d ? '#f2d89a' : '#a88a64'}" ${THIN}/><path d="M140 190 L152 170 H220 L232 190 Z" fill="none" stroke="url(#gWood)" stroke-width="5"/><path d="M140 190 L152 170 H220 L232 190 Z" fill="none" stroke="#a77a4f" stroke-width="4"/>` +
    (d ? `<path d="M166 184 V176 H172 V172 H176 V176 H182 V184 Z" fill="#e8c878" ${THIN} stroke-width="1"/><path d="M196 186 L202 176 H212 L216 186 Z" fill="#e0303f" ${THIN} stroke-width="1"/><path d="M200 176 Q207 168 214 176" fill="none" stroke="#2a2a2a" stroke-width="1.2"/>` : dustPile(186, 184)),
  swing: (d) =>
    d ? `<path d="M30 220 L52 118 M110 220 L88 118 M44 220 L56 118 M96 220 L84 118" stroke="#3a76c4" stroke-width="4" stroke-linecap="round"/><path d="M46 118 H94" ${O} stroke-width="5"/>` +
        [[60, 190], [80, 182]].map(([x, y]) => `<path d="M${x - 6} 118 V${y} M${x + 6} 118 V${y}" stroke="#8b8b8b" stroke-width="1.6"/><rect x="${x - 9}" y="${y}" width="18" height="5" rx="2" fill="#e0303f" ${THIN}/>`).join('')
      : `<path d="M22 222 L104 214 M28 230 L112 224" stroke="#6a7a90" stroke-width="5" stroke-linecap="round"/><path d="M60 228 q6 -6 12 0 q6 6 12 0" fill="none" stroke="#8b8b8b" stroke-width="2"/>`,
  slide: (d) =>
    d ? `<g transform="translate(4 -14)"><path d="M298 212 V122 M318 212 V122" stroke="#3a76c4" stroke-width="4"/>` + Array.from({ length: 6 }, (_, i) => `<path d="M298 ${200 - i * 14} H318" stroke="#2a5aa8" stroke-width="3"/>`).join('') +
        `<path d="M294 124 H322 V130 H294 Z" fill="#f6c945" ${THIN}/><path d="M296 128 C266 140 268 196 232 206 L236 214 C276 204 276 148 300 136 Z" fill="url(#gYellow)" ${O}/></g>`
      : `<path d="M250 222 L330 214 L334 222 L254 230 Z" fill="#c9c0b0" ${THIN}/><path d="M256 216 L332 206 L336 213 L260 222 Z" fill="#b8b0a0" ${THIN}/>`,
  seesaw: (d) =>
    d ? `<path d="M178 226 L188 206 L198 226 Z" fill="#3a76c4" ${O}/><path d="M128 214 L248 198" stroke="url(#gRed)" stroke-width="8" stroke-linecap="round"/><path d="M128 214 L248 198" stroke="#e0303f" stroke-width="7" stroke-linecap="round"/>` +
        `<path d="M138 212 V204 M238 199 V191" stroke="#2a2a2a" stroke-width="3"/><path d="M133 204 H143 M233 191 H243" stroke="#2a2a2a" stroke-width="3" stroke-linecap="round"/>`
      : plank(140, 222, 96, 2),
  bench: (d) =>
    d ? `<rect x="262" y="222" width="76" height="8" rx="3" fill="url(#gWood)" ${O}/><path d="M270 230 V240 M330 230 V240" ${O} stroke-width="4"/><rect x="262" y="208" width="76" height="6" rx="3" fill="url(#gWoodDark)" ${THIN}/>` + estekan(318, 220, 0.18, true, false)
      : plank(266, 232, 60, -4),
};

// ------------------------------------------------------------------ دیوار نقاشی

const muralBase = () =>
  `<rect width="360" height="40" fill="url(#gSky)"/><rect x="6" y="30" width="348" height="140" fill="#c9bfae" ${O}/>` + parkGround(166) + fence(186, 18, 0, 60) + fence(186, 18, 300, 360);

const lion = (x: number, y: number, sketch: boolean) => {
  const fill = (c: string) => (sketch ? 'none' : c);
  const st = sketch ? `stroke="#8a8a8a" stroke-width="1.4" stroke-dasharray="3 3"` : THIN;
  return `<ellipse cx="${x + 26}" cy="${y + 20}" rx="32" ry="16" fill="${fill('#f0a030')}" ${st}/>` +
    `<path d="M${x + 4} ${y + 30} V${y + 46} M${x + 16} ${y + 32} V${y + 46} M${x + 36} ${y + 32} V${y + 46} M${x + 48} ${y + 30} V${y + 46}" stroke="${sketch ? '#8a8a8a' : '#c97a1a'}" stroke-width="${sketch ? 1.4 : 6}" stroke-linecap="round"/>` +
    `<path d="M${x + 58} ${y + 16} q16 -6 14 -20" fill="none" stroke="${sketch ? '#8a8a8a' : '#c97a1a'}" stroke-width="${sketch ? 1.4 : 4}" stroke-linecap="round"/>` +
    Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<circle cx="${x - 6 + Math.cos(a) * 18}" cy="${y + 6 + Math.sin(a) * 18}" r="8" fill="${fill('#c0501a')}" ${st}/>`; }).join('') +
    `<circle cx="${x - 6}" cy="${y + 6}" r="15" fill="${fill('#f6c945')}" ${st}/>` +
    (sketch ? '' : `<circle cx="${x - 11}" cy="${y + 3}" r="2" fill="${INK}"/><circle cx="${x - 1}" cy="${y + 3}" r="2" fill="${INK}"/><path d="M${x - 9} ${y + 11} q3 3 6 0" fill="none" stroke="${INK}" stroke-width="1.6"/><path d="M${x - 8} ${y + 7} h4 l-2 2 Z" fill="${INK}"/>`);
};

const MURAL: Record<string, Layer> = {
  white: (d) =>
    d ? `<rect x="10" y="34" width="340" height="132" fill="#fbf7ee"/>`
      : [[60, 70, 30], [250, 120, 40], [320, 60, 22]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.7}" fill="#a89e8a" opacity=".7"/>`).join('') +
        `<path d="M150 50 l20 14 l-6 18 l14 10 M100 130 l30 -8" fill="none" stroke="#8a8070" stroke-width="1.6"/><path d="M200 60 h40 v22 h-40 Z" fill="#e3dccb" ${THIN} stroke-width="1"/>`,
  mural: (d) =>
    d ? lion(70, 96, false) +
        `<path d="M200 160 C196 130 204 116 200 96" fill="none" stroke="#6b4a2a" stroke-width="7" stroke-linecap="round"/>` + [[184, 96, 18], [216, 92, 18], [200, 76, 18]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gLeafDark)" ${THIN}/>`).join('') +
        Array.from({ length: 8 }, (_, i) => `<ellipse cx="${186 + (i * 11) % 30}" cy="${80 + (i * 7) % 26}" rx="2" ry="3" fill="#5a1a4a"/>`).join('') +
        sangak(250, 120, 62, 26) + `<circle cx="310" cy="66" r="18" fill="#f6c945" ${THIN}/>` + Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `<path d="M${310 + Math.cos(a) * 22} ${66 + Math.sin(a) * 22} L${310 + Math.cos(a) * 30} ${66 + Math.sin(a) * 30}" stroke="#f0a030" stroke-width="3" stroke-linecap="round"/>`; }).join('') +
        [[24, '#e0303f'], [40, '#3a76c4'], [56, '#3f8a2a'], [234, '#ff7a9c'], [250, '#f0a030'], [266, '#7a6ad0']].map(([x, c]) => `<path d="M${x} 162 v-8 q0 -4 3 -4 v6 v-8 q0 -2 2 -2 q2 0 2 2 v8 v-7 q0 -2 2 -2 q2 0 2 2 v9 q2 -3 4 -1 q-2 6 -6 9 Z" fill="${c}" opacity=".85"/>`).join('')
      : lion(70, 96, true),
  paint: (d) =>
    d ? [[30, '#e0303f'], [62, '#f6c945'], [94, '#3a76c4'], [126, '#3f8a2a']].map(([x, c]) => `<path d="M${Number(x) - 12} 206 H${Number(x) + 12} L${Number(x) + 10} 230 H${Number(x) - 10} Z" fill="url(#gSilver)" ${O}/><ellipse cx="${x}" cy="206" rx="12" ry="3.4" fill="${c}" ${THIN} stroke-width="1"/><path d="M${Number(x) + 10} 210 q8 2 12 -4" fill="none" stroke="${c}" stroke-width="2" opacity=".8"/>`).join('') +
        `<path d="M146 228 L170 200" stroke="url(#gWood)" stroke-width="4"/><path d="M146 228 L170 200" stroke="#a77a4f" stroke-width="3"/><path d="M168 198 l6 -6 l4 4 l-6 6 Z" fill="#e0303f" ${THIN} stroke-width="1"/>`
      : `<g transform="rotate(80 60 222)"><path d="M48 210 H72 L70 232 H50 Z" fill="#8a8a80" ${O}/></g>` + dustPile(110, 228),
  tables: (d) =>
    d ? [200, 280].map((x) => `<rect x="${x}" y="200" width="66" height="6" rx="2" fill="url(#gWood)" ${O}/><path d="M${x + 6} 206 V228 M${x + 60} 206 V228" ${O} stroke-width="3"/>` +
          `<rect x="${x + 8}" y="194" width="22" height="7" fill="#fffdf6" ${THIN} stroke-width="1" transform="rotate(-6 ${x + 19} 197)"/><rect x="${x + 36}" y="195" width="20" height="6" fill="#ffe0ef" ${THIN} stroke-width="1"/>` +
          `<path d="M${x + 14} 230 h14 M${x + 40} 230 h14" stroke="#3a76c4" stroke-width="5" stroke-linecap="round"/>`).join('')
      : plank(210, 222, 80, -6),
  show: (d) =>
    d ? `<path d="M0 12 Q180 34 360 12" fill="none" stroke="${INK}" stroke-width="1.4"/>` +
        [[30, '#fff6d0'], [80, '#ffe0ef'], [130, '#d6ecff'], [230, '#e3f3d6'], [280, '#fff6d0'], [330, '#ffe0ef']].map(([x, c], i) => {
          const y = 14 + Math.sin((Number(x) / 360) * Math.PI) * 18;
          return `<rect x="${Number(x) - 12}" y="${y}" width="24" height="18" fill="${c}" ${THIN} stroke-width="1"/><circle cx="${Number(x) - 3}" cy="${y + 7}" r="4" fill="${PICKETS[i % 5]}"/><path d="M${Number(x) - 8} ${y + 15} q8 -6 16 0" fill="none" stroke="#3f8a2a" stroke-width="1.4"/>`;
        }).join('') + `<rect x="146" y="10" width="68" height="20" rx="4" fill="url(#gRed)" ${O}/>` + text(180, 25, 'نمایشگاه', 11, '#fffdf6') + sparkle(222, 12, 4)
      : '',
};

// ------------------------------------------------------------------ خیمه‌شب‌بازی

const duskBase = () =>
  `<rect width="360" height="170" fill="#3a3466"/><rect y="100" width="360" height="70" fill="#5a4a7a" opacity=".6"/>` +
  `<circle cx="318" cy="34" r="14" fill="#fff6d0"/><circle cx="324" cy="30" r="12" fill="#3a3466"/>` +
  [[30, 20], [90, 40], [150, 16], [250, 30], [200, 56], [60, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="#fff"/>`).join('') +
  brickBand(96, 160, '#8a6a5a', '#6a4a3a') + `<rect y="156" width="360" height="84" fill="#8a7a62"/>`;

const STAGE = 'M126 84 H234 V150 H126 Z';

const PUPPETS: Record<string, Layer> = {
  seats: (d) =>
    d ? [[30, 214, '#3a76c4'], [190, 214, '#2a5aa8']].map(([x, y, c]) => `<path d="M${x} ${y} H${Number(x) + 140} L${Number(x) + 130} ${Number(y) + 22} H${Number(x) - 10} Z" fill="${c}" ${O}/>` +
          Array.from({ length: 5 }, (_, i) => `<path d="M${Number(x) + 4 + i * 28} ${y} l-4 22" stroke="#fffdf6" stroke-width="4" opacity=".85"/>`).join('')).join('')
      : [[60, 220], [150, 230], [260, 222], [320, 232]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="4" fill="#6a6050" ${THIN} stroke-width="1"/>`).join(''),
  tent: (d) =>
    d ? `<rect x="110" y="150" width="140" height="58" fill="url(#gRed)" ${O}/><path d="M110 162 H250" stroke="#f6c945" stroke-width="3"/>` +
        `<path d="${STAGE}" fill="#1a1030" ${O}/>` + [[140, 100], [214, 96], [180, 120]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2" fill="#fff6d0"/>`).join('') +
        `<path d="M112 72 H248 V86 H112 Z" fill="url(#gRed)" ${O}/>` + Array.from({ length: 8 }, (_, i) => `<path d="M${112 + i * 17} 86 q8.5 8 17 0" fill="#c0281a" ${THIN} stroke-width="1"/>`).join('') +
        `<path d="M126 84 Q142 110 130 150 H112 V84 Z M234 84 Q218 110 230 150 H248 V84 Z" fill="#c0281a" ${O}/><path d="M112 72 L180 56 L248 72 Z" fill="#f6c945" ${O}/>`
      : `<path d="M120 214 Q150 196 190 206 Q220 196 246 214 Z" fill="#a0281a" ${O}/><path d="M100 228 L260 214 M106 234 L250 226" stroke="#7a5a3a" stroke-width="5" stroke-linecap="round"/>`,
  puppets: (d) =>
    d ? `<path d="M158 84 V108 M170 84 V112 M150 84 V118 M178 84 V120 M200 84 V124 M216 84 V122" stroke="#d8d8d8" stroke-width=".8"/>` +
        // Mobarak: red tunic, white collar and a tall red hat.
        `<path d="M152 116 L188 116 L184 146 H156 Z" fill="url(#gRed)" ${THIN}/><path d="M154 116 Q170 124 186 116" fill="#fffdf6" ${THIN} stroke-width="1"/>` +
        `<circle cx="170" cy="106" r="10" fill="#f0c49a" ${THIN}/><circle cx="166" cy="104" r="1.4" fill="${INK}"/><circle cx="174" cy="104" r="1.4" fill="${INK}"/><path d="M165 109 q5 4 10 0" fill="none" stroke="${INK}" stroke-width="1.4"/>` +
        `<path d="M160 98 L170 70 L180 98 Z" fill="#e0303f" ${THIN}/><circle cx="170" cy="70" r="2.4" fill="#f6c945"/><path d="M152 120 L140 112 M188 120 L200 112" stroke="#e0303f" stroke-width="4" stroke-linecap="round"/>` +
        // The wooden lion Arash asked for.
        `<ellipse cx="214" cy="134" rx="14" ry="8" fill="#f0a030" ${THIN}/><circle cx="202" cy="126" r="9" fill="#c0501a" ${THIN}/><circle cx="202" cy="126" r="6" fill="#f6c945" ${THIN} stroke-width="1"/><circle cx="200" cy="125" r="1" fill="${INK}"/><circle cx="204" cy="125" r="1" fill="${INK}"/>` +
        `<path d="M208 142 v6 M220 142 v6" stroke="#c97a1a" stroke-width="3" stroke-linecap="round"/>`
      : `<rect x="290" y="196" width="44" height="26" rx="3" fill="url(#gWood)" ${O}/><rect x="288" y="190" width="48" height="8" rx="3" fill="url(#gWoodDark)" ${O}/><rect x="307" y="200" width="10" height="8" rx="2" fill="url(#gBrass)" ${THIN} stroke-width="1"/>`,
  lamp: (d) =>
    [100, 260].map((x) => `<path d="M${x} 40 V58" stroke="${INK}" stroke-width="1.4"/><path d="M${x - 7} 58 H${x + 7} L${x + 5} 74 H${x - 5} Z" fill="${d ? '#ffe7a0' : '#6a6a6a'}" ${THIN}/><path d="M${x - 8} 58 Q${x} 50 ${x + 8} 58 Z" fill="url(#gBrass)" ${THIN} stroke-width="1"/>` + (d ? glow(x, 66, 30, 0.7) : '')).join('') +
    `<path d="M60 40 Q180 30 300 40" fill="none" stroke="${INK}" stroke-width="1.2"/>` + (d ? glow(180, 120, 70, 0.35) : darkness(0.35)),
  show: (d) =>
    d ? `<path d="M296 214 C290 200 296 190 310 190 C324 190 330 200 324 214 Z" fill="url(#gWood)" ${O}/><ellipse cx="310" cy="190" rx="14" ry="4" fill="#f4f0e6" ${THIN}/>` +
        [[284, 170], [334, 160], [300, 150]].map(([x, y]) => `<path d="M${x} ${y} v-12 l8 -3 v12" fill="none" stroke="#fff6d0" stroke-width="1.6"/><circle cx="${x - 2}" cy="${y}" r="2.6" fill="#fff6d0"/><circle cx="${x + 6}" cy="${y - 3}" r="2.6" fill="#fff6d0"/>`).join('') +
        sparkle(120, 66, 6, '#fff6d0') + sparkle(242, 62, 6, '#fff6d0') + sparkle(60, 120, 5, '#fff6d0')
      : '',
};

// ------------------------------------------------------------------ جشن آخر تابستون

const festBase = () =>
  `<rect width="360" height="140" fill="url(#gSky)"/>` + brickBand(100, 150) + parkGround(146) + fence(164, 22) +
  sapling(24, 170, true) + sapling(118, 168, true) + sapling(236, 168, true) + sapling(340, 170, true);

const KITES: [number, number, string][] = [[70, 30, '#e0303f'], [180, 16, '#f6c945'], [290, 36, '#3a76c4']];

const SUMMERFEST: Record<string, Layer> = {
  water: (d) =>
    d ? `<ellipse cx="204" cy="222" rx="44" ry="12" fill="url(#gBlue)" ${O}/><ellipse cx="204" cy="220" rx="36" ry="8" fill="url(#gWater)"/>` +
        `<path d="M262 170 q-10 20 0 42" fill="none" stroke="#3f8a2a" stroke-width="4" stroke-linecap="round"/><rect x="256" y="162" width="12" height="8" rx="2" fill="url(#gBrass)" ${THIN} stroke-width="1"/>` +
        `<path d="M262 212 C252 160 222 160 214 210" fill="none" stroke="#9ec4e8" stroke-width="3" stroke-dasharray="2 5" stroke-linecap="round"/>` +
        `<path d="M220 182 a30 30 0 0 1 36 0" fill="none" stroke="#e0303f" stroke-width="2" opacity=".6"/><path d="M223 186 a26 26 0 0 1 30 0" fill="none" stroke="#f6c945" stroke-width="2" opacity=".6"/><path d="M226 190 a22 22 0 0 1 24 0" fill="none" stroke="#3a76c4" stroke-width="2" opacity=".6"/>`
      : `<path d="M170 222 l10 -6 l8 8 l12 -4 M210 228 l10 -8 l14 4" fill="none" stroke="#a88a64" stroke-width="1.4"/>`,
  bikes: (d) =>
    d ? `<path d="M14 214 V96 M134 214 V96" stroke="#6a6a6a" stroke-width="3"/><rect x="14" y="96" width="120" height="16" fill="#fffdf6" ${THIN}/>` +
        Array.from({ length: 12 }, (_, i) => `<rect x="${14 + i * 10}" y="${96 + (i % 2) * 8}" width="10" height="8" fill="#2a2a2a"/>`).join('') +
        bike(46, 232, '#e0303f') + bike(102, 226, '#3a76c4')
      : bike(70, 232, '#9a8a7a') + `<ellipse cx="85" cy="230" rx="10" ry="3" fill="#2a2a2a" opacity=".5"/>`,
  icecream: (d) =>
    d ? `<rect x="278" y="180" width="68" height="34" rx="4" fill="#fffdf6" ${O}/><path d="M278 194 H346" stroke="#ff7a9c" stroke-width="5"/>` +
        [286, 338].map((x) => `<circle cx="${x}" cy="222" r="8" fill="#2a2a2a" ${THIN}/><circle cx="${x}" cy="222" r="3" fill="url(#gSilver)"/>`).join('') +
        `<path d="M312 180 V120" stroke="#6a6a6a" stroke-width="2.4"/><path d="M276 128 Q312 100 348 128 Z" fill="url(#gRed)" ${O}/>` +
        Array.from({ length: 4 }, (_, i) => `<path d="M${276 + i * 18} 128 q9 6 18 0" fill="${i % 2 ? '#fffdf6' : 'url(#gRed)'}" ${THIN} stroke-width="1"/>`).join('') +
        [[294, '#f6c945'], [310, '#fffdf6'], [326, '#ff9ec4']].map(([x, c]) => `<path d="M${Number(x) - 5} 172 L${x} 180 L${Number(x) + 5} 172 Z" fill="#e8b878" ${THIN} stroke-width="1"/><circle cx="${x}" cy="168" r="6" fill="${c}" ${THIN} stroke-width="1"/>`).join('') +
        text(312, 208, 'بستنی', 10, '#c0392b')
      : '',
  photo: (d) =>
    d ? `<path d="M136 240 L146 206 L156 240 M146 206 V240" fill="none" stroke="#3a3a44" stroke-width="2"/><rect x="134" y="192" width="24" height="16" rx="3" fill="#2a2a2a" ${THIN}/><circle cx="150" cy="200" r="4" fill="#7f8a99"/><rect x="136" y="188" width="6" height="4" fill="#d8d8d8"/>` + sparkle(132, 184, 6) + glow(140, 190, 16, 0.6)
      : '',
  kites: (d) =>
    d ? KITES.map(([x, y, c]) => `<path d="M${x} ${y} L${x + 14} ${y + 18} L${x} ${y + 40} L${x - 14} ${y + 18} Z" fill="${c}" ${O}/><path d="M${x} ${y} V${y + 40} M${x - 14} ${y + 18} H${x + 14}" stroke="${INK}" stroke-width="1"/>` +
          `<path d="M${x} ${y + 40} q6 8 0 14 q-6 8 0 14" fill="none" stroke="${INK}" stroke-width="1"/>` + [0, 1, 2].map((i) => `<path d="M${x - 3} ${y + 46 + i * 8} l6 2" stroke="${PICKETS[(i + 1) % 5]}" stroke-width="3"/>`).join('') +
          `<path d="M${x} ${y + 18} L${x < 180 ? 150 : 210} 146" fill="none" stroke="${INK}" stroke-width=".7" opacity=".6"/>`).join('') + art(TOYS[1], 180, 146, 0.4)
      : `<path d="M118 112 L128 124 L118 138 L108 124 Z" fill="#c9b8a0" ${THIN} stroke-width="1" transform="rotate(30 118 124)"/><path d="M118 138 q-6 8 2 16" fill="none" stroke="${INK}" stroke-width=".8"/>`,
};

export const SCENES22: Record<string, SceneDef> = {
  dirtlot: { base: lotBase(), order: ['level', 'rubble', 'fence', 'trees', 'tap'], layers: DIRTLOT },
  minipark: { base: parkBase(), order: ['sandbox', 'swing', 'slide', 'seesaw', 'bench'], layers: MINIPARK },
  muralwall: { base: muralBase(), order: ['white', 'mural', 'paint', 'tables', 'show'], layers: MURAL },
  puppets: { base: duskBase(), order: ['seats', 'tent', 'puppets', 'lamp', 'show'], layers: PUPPETS },
  summerfest: { base: festBase(), order: ['water', 'bikes', 'icecream', 'photo', 'kites'], layers: SUMMERFEST },
};
