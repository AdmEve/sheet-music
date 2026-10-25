// Season 16 («مدرسه‌ی شبونه») place scenes. Same contract as scenes.ts: each task layer is drawn
// "before" until done, then "after".

import { INK, O, THIN, estekan, samovar, sparkle } from './kit';
import { Layer, SceneDef, brickWall, cobweb, dustPile, floor, glow, lantern, plank, stringLights } from './scenes';
import { SCENES13 } from './scenes13';
import { darkness, text } from './scenes3';

const classroomWall = () =>
  `<rect width="360" height="172" fill="#ece4cc"/><rect y="112" width="360" height="60" fill="#7fae8e"/><path d="M0 112 H360" stroke="#5e8a6c" stroke-width="3"/>` + floor('#a8784a', 172);

const blackboard = (inner: string, done = true) =>
  `<rect x="96" y="48" width="168" height="84" rx="3" fill="url(#gWood)" ${O}/><rect x="102" y="54" width="156" height="72" fill="${done ? '#2f4a3a' : '#5a6a62'}" ${THIN}/>` +
  `<rect x="110" y="130" width="140" height="5" rx="2" fill="url(#gWoodDark)" ${THIN} stroke-width="1"/>` + inner;

const chalk = (x: number, y: number, t: string, size: number) =>
  text(x, y, t, size, '#f4f0e6', ' opacity=".92"');

const schoolDesk = (x: number, base: number, broken = false) =>
  broken ? plank(x - 26, base - 10, 54, 12) + plank(x - 20, base - 2, 40, -8)
    : `<path d="M${x - 30} ${base - 30} H${x + 30} L${x + 26} ${base - 22} H${x - 26} Z" fill="url(#gWood)" ${O}/><path d="M${x - 24} ${base - 22} V${base} M${x + 24} ${base - 22} V${base}" ${O} stroke-width="3.4"/>` +
      `<rect x="${x - 26}" y="${base - 14}" width="52" height="5" fill="url(#gWoodDark)" ${THIN} stroke-width="1"/>`;

// ------------------------------------------------------------------ مدرسه‌ی قدیمی محله

const OLDSCHOOL: Record<string, Layer> = {
  board: (d) => (d ? blackboard(chalk(150, 102, 'آ ب پ', 24) + `<path d="M196 112 q12 -26 24 0 q-12 -8 -24 0 Z" fill="none" stroke="#f4f0e6" stroke-width="1.6"/><circle cx="234" cy="72" r="7" fill="none" stroke="#f6e3b0" stroke-width="1.6"/>`)
    : blackboard(`<path d="M120 60 l40 60 M220 58 l-20 50" stroke="#2a2a2a" stroke-width="1.4"/>`, false) + cobweb(264, 48, 0.6, true)),
  sign: (d) =>
    d
      ? `<rect x="134" y="14" width="92" height="26" rx="4" fill="url(#gNavy)" ${O}/><rect x="138" y="18" width="84" height="18" rx="3" fill="none" stroke="#f6c945" stroke-width="1.2"/>` + text(180, 32, 'دبستان امید', 11, '#ffe08a')
      : `<rect x="134" y="16" width="92" height="24" rx="4" fill="#8a8a90" ${O} transform="rotate(-6 180 28)"/>`,
  heater: (d) =>
    `<path d="M36 196 V144 Q36 136 52 136 Q68 136 68 144 V196 Z" fill="${d ? 'url(#gSteel)' : '#7a6a5a'}" ${O}/><path d="M52 136 V96 H62" fill="none" stroke="#5a5a60" stroke-width="4"/>` +
    `<rect x="44" y="160" width="16" height="12" rx="2" fill="${d ? '#ffb347' : '#3a3a40'}" ${THIN}/>` + (d ? glow(52, 166, 30, 0.7) : dustPile(52, 198)),
  benches: (d) => [100, 180, 260].map((x) => schoolDesk(x, 226, !d)).join('') + (d ? '' : dustPile(180, 214)),
  bell: (d) =>
    `<rect x="300" y="168" width="34" height="6" rx="2" fill="url(#gWood)" ${O}/><path d="M306 174 V200 M328 174 V200" ${O} stroke-width="3"/>` +
    (d ? `<path d="M308 166 C308 152 312 146 317 146 C322 146 326 152 326 166 Z" fill="url(#gBrass)" ${O}/><path d="M317 146 V136" stroke="#5e3418" stroke-width="4" stroke-linecap="round"/>` + sparkle(334, 142, 5)
      : `<path d="M300 204 C296 196 300 188 306 188 L318 196 Z" fill="#8a7a5a" ${THIN}/>`),
};

// ------------------------------------------------------------------ اولین شب کلاس

const firstclassBase = () => classroomWall() + OLDSCHOOL.sign(true) + OLDSCHOOL.heater(true);

const FIRSTCLASS: Record<string, Layer> = {
  alphabet: (d) =>
    d
      ? ['آ', 'ب', 'پ', 'ت', 'ث', 'ج'].map((l, i) => { const x = i < 3 ? 18 + i * 24 : 276 + (i - 3) * 24; return `<rect x="${x}" y="52" width="20" height="24" rx="2" fill="${['#ffd0dc', '#c8e6c9', '#fff6a8'][i % 3]}" ${THIN} stroke-width="1"/>` + text(x + 10, 70, l, 14, '#e0303f'); }).join('')
      : `<path d="M18 64 h70 M276 64 h70" stroke="#c9b89a" stroke-width="2" stroke-dasharray="4 4"/>`,
  word: (d) => blackboard(d ? chalk(180, 106, 'آب', 40) + sparkle(250, 62, 6, '#f6e3b0') : ''),
  notebooks: (d) =>
    [100, 180, 260].map((x) => schoolDesk(x, 226) + (d ? `<path d="M${x - 16} 196 L${x} 192 L${x + 16} 196 L${x} 200 Z" fill="#fffdf6" ${THIN} stroke-width="1"/><path d="M${x + 8} 186 l8 10" stroke="#f6c945" stroke-width="2.4"/>` : '')).join(''),
  samovar: (d) =>
    `<rect x="290" y="160" width="56" height="8" rx="2" fill="url(#gWoodDark)" ${O}/><path d="M296 168 V200 M340 168 V200" ${O} stroke-width="3"/>` +
    (d ? glow(318, 138, 34, 0.5) + `<g transform="translate(296 122) scale(.44)">${samovar('url(#gBrass)')}</g>` + estekan(340, 158, 0.24, true, false)
      : `<g transform="translate(296 122) scale(.44)" opacity=".7" style="filter:grayscale(1)">${samovar('url(#gSteel)')}</g>`),
  lights: (d) =>
    d
      ? [120, 240].map((x) => `<path d="M${x} 0 V16" stroke="${INK}" stroke-width="1.4"/><path d="M${x - 14} 26 Q${x} 10 ${x + 14} 26 Z" fill="url(#gSteel)" ${THIN}/>` + glow(x, 40, 60, 0.45)).join('') + darkness(0.08)
      : darkness(0.45),
};

// ------------------------------------------------------------------ کتابخونه‌ی سیار

const PAYKAN = SCENES13.paykan.layers;
const vanBase = () => brickWall('#d9a873', '#b5804d', 160) + `<rect y="160" width="360" height="80" fill="#b9b2a4"/><path d="M0 160 H360" stroke="${INK}" stroke-width="2" opacity=".35"/>` +
  PAYKAN.paint(true) + PAYKAN.tires(true);

const books = (x: number, base: number, w: number, n: number) =>
  Array.from({ length: n }, (_, i) => `<rect x="${x + i * (w / n)}" y="${base - 14 - (i % 3) * 2}" width="${w / n - 1.4}" height="${14 + (i % 3) * 2}" fill="${['#e0303f', '#3a76c4', '#3f8a2a', '#f6c945', '#14879a', '#b8204e'][i % 6]}" ${THIN} stroke-width=".8"/>`).join('');

const BOOKVAN: Record<string, Layer> = {
  shelves: (d) =>
    d
      ? `<rect x="8" y="104" width="56" height="106" rx="2" fill="url(#gWoodDark)" ${O}/>` + [132, 162, 192].map((y) => `<rect x="12" y="${y - 24}" width="48" height="24" fill="#3b2216"/><path d="M10 ${y} H62" stroke="#8b5328" stroke-width="2.4"/>`).join('')
      : plank(10, 196, 60, -6) + plank(14, 206, 50, 4),
  books: (d) =>
    d ? [132, 162, 192].map((y) => books(13, y, 46, 7)).join('') + `<rect x="250" y="196" width="34" height="18" fill="url(#gWicker)" ${THIN}/>` + books(252, 198, 30, 5)
      : `<rect x="250" y="200" width="34" height="14" fill="#9a8a76" ${THIN}/>`,
  sign: (d) =>
    d
      ? `<path d="M156 112 V102 M214 112 V102" stroke="${INK}" stroke-width="2"/><rect x="130" y="80" width="110" height="24" rx="4" fill="url(#gBlue)" ${O}/>` + text(185, 97, 'کتابخونه‌ی سیار محله', 9, '#fffdf6')
      : `<rect x="300" y="170" width="54" height="16" rx="3" fill="#9aa4b0" ${THIN} transform="rotate(-10 327 178)"/>`,
  rug: (d) =>
    d
      ? `<path d="M96 216 H290 L302 236 H84 Z" fill="#c0392b" ${O}/><path d="M92 224 H296 M88 230 H300" stroke="#1d4fa8" stroke-width="3"/>` +
        [[120, 'url(#gNavy)'], [262, 'url(#gCarpet)']].map(([x, c]) => `<rect x="${Number(x) - 16}" y="200" width="32" height="20" rx="8" fill="${c}" ${THIN}/>`).join('')
      : dustPile(190, 226),
  lamp: (d) =>
    d
      ? stringLights(12, ['#ffd36b', '#fff6d0', '#ffd36b', '#9be36b']) + lantern(330, 20) + `<path d="M336 160 V60" stroke="#5a5a60" stroke-width="4"/>` +
        `<rect x="140" y="194" width="20" height="14" fill="#fffdf6" ${THIN} stroke-width="1"/><path d="M150 194 V208" stroke="${INK}" stroke-width=".8"/>`
      : `<path d="M336 160 V60" stroke="#5a5a60" stroke-width="4"/><path d="M336 60 l-10 8" stroke="#5a5a60" stroke-width="3"/>`,
};

// ------------------------------------------------------------------ شب شعر و جشن تقدیرنامه

const courtyard = (night: boolean) =>
  `<rect width="360" height="90" fill="${night ? '#1f2350' : 'url(#gSky)'}"/>` +
  (night ? Array.from({ length: 16 }, (_, i) => `<circle cx="${(i * 71 + 9) % 352 + 4}" cy="${(i * 17 + 5) % 50 + 4}" r="${i % 3 ? 1 : 1.6}" fill="#fff6d0"/>`).join('') : '') +
  `<rect x="0" y="40" width="360" height="110" fill="#d9a873"/><rect x="0" y="36" width="360" height="6" fill="#b5804d"/>` +
  Array.from({ length: 7 }, (_, i) => `<path d="M0 ${54 + i * 14} H360" stroke="#b5804d" stroke-width="1.2" opacity=".6"/>`).join('') +
  [60, 150, 240, 300].map((x) => `<rect x="${x}" y="64" width="26" height="34" rx="12" fill="${night ? '#ffe08a' : '#bfe9ff'}" ${THIN}/>`).join('') +
  `<rect y="146" width="360" height="94" fill="#c9a27a"/>` + Array.from({ length: 8 }, (_, i) => `<path d="M${i * 48} 146 L${i * 48 - 24} 240" stroke="${INK}" stroke-width="1" opacity=".15"/>`).join('');

const papers = (n: number) =>
  Array.from({ length: n }, (_, i) => { const x = 14 + (i % 4) * 22 + (i > 3 ? 256 : 0) - (i > 3 ? 88 : 0), y = 104 + Math.floor((i % 8) / 4) * 22; return `<rect x="${x}" y="${y}" width="18" height="18" fill="#fffdf6" ${THIN} stroke-width=".8" transform="rotate(${(i % 3) * 5 - 5} ${x + 9} ${y + 9})"/><path d="M${x + 3} ${y + 6} q4 -2 8 0 M${x + 3} ${y + 11} q5 -2 10 0" fill="none" stroke="#3a76c4" stroke-width=".8"/>`; }).join('');

const brickStage = (fill = '#b8844a') =>
  `<rect x="110" y="164" width="140" height="26" fill="${fill}" ${O}/>` + [172, 180].map((y) => `<path d="M110 ${y} H250" stroke="#8a5a32" stroke-width="1" opacity=".6"/>`).join('');

const POETRY: Record<string, Layer> = {
  wall: (d) => (d ? papers(8) : `<path d="M16 110 l40 20 M300 112 l30 16" stroke="#8a6a4a" stroke-width="1.4"/>`),
  stage: (d) => (d ? brickStage() : plank(120, 176, 70, 6) + plank(180, 182, 60, -8) + dustPile(180, 192)),
  tea: (d) =>
    `<rect x="276" y="176" width="70" height="8" rx="2" fill="url(#gWood)" ${O}/><path d="M282 184 V214 M340 184 V214" ${O} stroke-width="3"/>` +
    (d ? estekan(292, 174, 0.26, true, false) + estekan(306, 174, 0.26, true, false) + `<ellipse cx="330" cy="172" rx="12" ry="3.4" fill="url(#gSilver)" ${THIN} stroke-width="1"/>` +
        [324, 330, 336].map((x) => `<ellipse cx="${x}" cy="169" rx="3" ry="4.4" fill="#7a3a1a" ${THIN} stroke-width=".7"/>`).join('') : ''),
  mic: (d) =>
    d
      ? `<path d="M180 164 V128" stroke="#5a5a60" stroke-width="3"/><path d="M170 166 H190" stroke="#5a5a60" stroke-width="4"/><rect x="172" y="108" width="16" height="22" rx="7" fill="url(#gSteel)" ${O}/>` +
        [114, 120, 126].map((y) => `<path d="M174 ${y} H186" stroke="#7f8a99" stroke-width="1.2"/>`).join('') +
        `<path d="M190 164 Q230 170 260 192" fill="none" stroke="#2a2a2a" stroke-width="2"/><rect x="250" y="188" width="24" height="16" rx="3" fill="url(#gWood)" ${THIN}/><circle cx="257" cy="196" r="3" fill="#2a2a2a"/>`
      : `<rect x="250" y="196" width="24" height="12" rx="3" fill="#7a6a5a" ${THIN}/>`,
  lanterns: (d) => (d ? stringLights(30, ['#ffd36b', '#ff7a9c', '#ffd36b', '#9be36b']) + lantern(100, 40) + lantern(260, 40) + glow(180, 150, 90, 0.35) : darkness(0.4)),
};

const GRADUATION: Record<string, Layer> = {
  stage: (d) =>
    d
      ? brickStage('#c99a62') + `<path d="M110 164 H250 L246 158 H114 Z" fill="url(#gCarpet)" ${THIN}/>` +
        `<path d="M118 110 V156 M242 110 V156" stroke="#8b5328" stroke-width="3"/><rect x="112" y="100" width="136" height="24" rx="3" fill="url(#gRed)" ${O}/>` + text(180, 117, 'جشن تقدیرنامه', 11, '#fff6d0')
      : brickStage('#a8906a'),
  certs: (d) =>
    `<rect x="18" y="172" width="80" height="8" rx="2" fill="url(#gWood)" ${O}/><path d="M24 180 V212 M92 180 V212" ${O} stroke-width="3"/>` +
    (d ? [30, 46, 62, 78].map((x, i) => `<rect x="${x - 6}" y="${160 - (i % 2) * 2}" width="12" height="${12}" rx="5" fill="#f6e3b0" ${THIN} stroke-width="1" transform="rotate(${i * 6 - 8} ${x} ${166})"/><path d="M${x - 6} ${166} h12" stroke="#e0303f" stroke-width="2"/>`).join('') + sparkle(98, 156, 5) : dustPile(58, 172)),
  flowers: (d) =>
    d
      ? [100, 260].map((x) => `<path d="M${x - 8} 190 H${x + 8} L${x + 6} 164 H${x - 6} Z" fill="url(#gTurq)" ${THIN}/>` +
          [[-6, 152], [0, 146], [6, 152], [-2, 158], [4, 158]].map(([dx, y], i) => `<circle cx="${x + dx}" cy="${y}" r="5" fill="${['#e0303f', '#ff9ec4', '#fffdf6', '#e0303f', '#ffd0dc'][i]}" ${THIN} stroke-width=".8"/>`).join('')).join('') +
        `<ellipse cx="180" cy="212" rx="22" ry="5" fill="url(#gSilver)" ${THIN}/>` + [172, 180, 188].map((x) => `<circle cx="${x}" cy="208" r="3.4" fill="#fff6e0" ${THIN} stroke-width=".7"/><circle cx="${x}" cy="208" r="1" fill="#e2507a"/>`).join('')
      : '',
  photo: (d) =>
    d
      ? `<path d="M300 232 L310 190 L320 232 M310 190 V232" fill="none" stroke="#3a3a44" stroke-width="2.4"/><rect x="296" y="174" width="28" height="18" rx="3" fill="#2a2a2a" ${THIN}/><circle cx="304" cy="183" r="5" fill="#7f8a99" ${THIN} stroke-width="1"/>` +
        `<path d="M318 176 l8 -8 l4 4" fill="none" stroke="#fff6a8" stroke-width="2"/>` + glow(324, 170, 20, 0.7)
      : `<rect x="296" y="210" width="30" height="20" rx="3" fill="#7a6a5a" ${THIN}/>`,
  sign: (d) =>
    d
      ? `<rect x="268" y="98" width="86" height="40" rx="4" fill="url(#gWood)" ${O}/>` + text(311, 114, 'بقالی مرتضی', 10, '#fff6d0') + text(311, 130, 'نسیه هم داریم!', 9, '#ffe08a') + sparkle(352, 94, 5)
      : `<rect x="272" y="108" width="80" height="30" rx="4" fill="#9a8a76" ${THIN}/>`,
};

export const SCENES16: Record<string, SceneDef> = {
  oldschool: { base: classroomWall(), order: ['board', 'sign', 'heater', 'benches', 'bell'], layers: OLDSCHOOL },
  firstclass: { base: firstclassBase(), order: ['alphabet', 'word', 'notebooks', 'samovar', 'lights'], layers: FIRSTCLASS },
  bookvan: { base: vanBase(), order: ['shelves', 'books', 'sign', 'rug', 'lamp'], layers: BOOKVAN },
  poetry: { base: courtyard(true), order: ['wall', 'stage', 'tea', 'mic', 'lanterns'], layers: POETRY },
  graduation: { base: courtyard(false), order: ['stage', 'certs', 'flowers', 'photo', 'sign'], layers: GRADUATION },
};
