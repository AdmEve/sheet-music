// The alley map: the whole street in one picture (viewBox 360 × MAP_H). The places of the
// story stand along a winding cobbled alley, episode 1 at the bottom, the latest at the
// top. Restored places are in colour, the one being worked on has scaffolding and a pin,
// the rest wait in grey.

import { WEDDING } from './chainsO';
import { INK, O, THIN, sparkle } from './kit';

export const MAP_H = 7050;
const STEP = 106;
const faDigits = (n: number) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d]);

export type MapState = 'done' | 'current' | 'locked';

/** Centre-bottom of each place's plot, by episode index (0-based). */
export function plot(k: number): { x: number; y: number; right: boolean } {
  const right = k % 2 === 0;
  return { x: right ? 262 : 98, y: MAP_H - 40 - k * STEP, right };
}

interface Facade {
  wall: string;
  roof?: 'flat' | 'dome' | 'gable' | 'awning';
  roofFill?: string;
  door?: 'arch' | 'shop' | 'gate';
  sign?: string;
  /** Extra drawing in the facade's local coordinates (origin = bottom centre). */
  deco?: string;
  w?: number;
  h?: number;
}

const win = (x: number, y: number, lit: boolean) =>
  `<rect x="${x - 8}" y="${y - 10}" width="16" height="20" rx="8" fill="${lit ? '#ffe08a' : '#6b6b6b'}" ${THIN}/><path d="M${x} ${y - 10} V${y + 10} M${x - 8} ${y + 1} H${x + 8}" stroke="${INK}" stroke-width="1.2"/>`;

function facade(f: Facade): string {
  const w = f.w ?? 128, h = f.h ?? 74;
  const l = -w / 2;
  let s = `<ellipse cx="0" cy="2" rx="${w / 2 + 8}" ry="6" fill="rgba(60,30,10,.18)"/>`;
  s += `<rect x="${l}" y="${-h}" width="${w}" height="${h}" rx="3" fill="${f.wall}" ${O}/>`;
  if (f.roof === 'dome') s += `<path d="M-34 ${-h} C-34 ${-h - 44} 34 ${-h - 44} 34 ${-h} Z" fill="${f.roofFill ?? 'url(#gTurq)'}" ${O}/><path d="M0 ${-h - 33} V${-h - 46}" ${O}/><circle cx="0" cy="${-h - 48}" r="3" fill="url(#gGold)" ${THIN}/>`;
  else if (f.roof === 'gable') s += `<path d="M${l - 6} ${-h} L0 ${-h - 30} L${-l + 6} ${-h} Z" fill="${f.roofFill ?? 'url(#gTerracotta)'}" ${O}/>`;
  else if (f.roof === 'awning') s += `<path d="M${l - 4} ${-h + 22} L${l + 6} ${-h + 6} L${-l - 6} ${-h + 6} L${-l + 4} ${-h + 22} Z" fill="${f.roofFill ?? 'url(#gRed)'}" ${O}/>` +
    Array.from({ length: 6 }, (_, i) => `<path d="M${l + 10 + i * (w - 20) / 5} ${-h + 6} L${l + 4 + i * (w - 8) / 5} ${-h + 22}" stroke="#fff" stroke-width="5" opacity=".8"/>`).join('');
  else s += `<rect x="${l - 4}" y="${-h - 6}" width="${w + 8}" height="8" rx="2" fill="url(#gWoodDark)" ${O}/>`;
  if (f.door === 'shop') s += `<rect x="-26" y="-36" width="52" height="36" rx="3" fill="url(#gGlass)" ${O}/><path d="M0 -36 V0" ${THIN}/>`;
  else if (f.door === 'gate') s += `<path d="M-20 0 V-30 C-20 -48 20 -48 20 -30 V0 Z" fill="url(#gWoodDark)" ${O}/><path d="M0 -44 V0" ${THIN}/>`;
  else s += `<path d="M-14 0 V-28 C-14 -40 14 -40 14 -28 V0 Z" fill="url(#gWoodDark)" ${O}/><circle cx="6" cy="-14" r="1.8" fill="url(#gGold)"/>`;
  s += win(l + 22, -h / 2 - 4, true) + win(-l - 22, -h / 2 - 4, true);
  if (f.sign) s += `<rect x="-40" y="${-h - 2}" width="80" height="16" rx="4" fill="url(#gNavy)" ${THIN}/><text x="0" y="${-h + 10}" text-anchor="middle" font-family="Vazirmatn, sans-serif" font-weight="800" font-size="9" fill="#ffe08a">${f.sign}</text>`;
  return s + (f.deco ?? '');
}

/** One facade per place, in story order. */
const FACADES: Record<string, Facade> = {
  teahouse: { wall: '#d9a873', door: 'arch', sign: 'قهوه‌خانه', deco: `<g transform="translate(46 -4) scale(.35)"><rect x="-14" y="-40" width="28" height="40" rx="6" fill="url(#gBrass)" ${O}/></g>` },
  bakery: { wall: '#e8c99a', roof: 'awning', door: 'shop', deco: `<ellipse cx="0" cy="-18" rx="14" ry="8" fill="url(#gFire)" opacity=".7"/>` },
  garden: {
    wall: '#c69260', h: 54, door: 'gate',
    deco: [-44, 44].map((x) => `<circle cx="${x}" cy="-66" r="16" fill="url(#gLeaf)" ${O}/><circle cx="${x - 6}" cy="-70" r="3" fill="url(#gRose)"/><circle cx="${x + 5}" cy="-62" r="3" fill="url(#gRose)"/>`).join(''),
  },
  salon: { wall: '#ffd0e2', door: 'shop', sign: 'آرایشگاه', roofFill: 'url(#gRose)' },
  hammam: { wall: '#e8dcc6', roof: 'dome', door: 'arch', w: 120 },
  khastegari: { wall: '#f6ead2', roof: 'gable', door: 'arch', h: 70 },
  sweetshop: { wall: '#fff3c4', roof: 'awning', roofFill: 'url(#gRose)', door: 'shop' },
  tailor: { wall: '#d8e4ec', door: 'shop', sign: 'خیاطی', deco: `<path d="M-8 -30 C-12 -20 -10 -10 -12 -4 L12 -4 C10 -10 12 -20 8 -30 Z" fill="url(#gRose)" ${THIN}/>` },
  aghd: { wall: '#fdfaf3', roof: 'dome', roofFill: 'url(#gGold)', door: 'arch', w: 120 },
  postoffice: { wall: '#d8e4d4', door: 'shop', sign: 'پُست', deco: `<rect x="44" y="-40" width="14" height="22" rx="3" fill="url(#gYellow)" ${THIN}/>` },
  photo: { wall: '#efe0d0', door: 'shop', sign: 'آتلیه رز', roof: 'awning', roofFill: 'url(#gRose)' },
  zurkhaneh: { wall: '#c98a52', roof: 'dome', roofFill: 'url(#gTerracotta)', door: 'arch', w: 120 },
  cinema: {
    wall: '#4a1a24', door: 'shop', sign: 'سینما', h: 80,
    deco: Array.from({ length: 10 }, (_, i) => `<circle cx="${-45 + i * 10}" cy="-90" r="2.2" fill="#ffd36b"/>`).join(''),
  },
  home: {
    wall: '#e0b07a', roof: 'gable', door: 'gate',
    deco: `<circle cx="-56" cy="-70" r="16" fill="url(#gLeaf)" ${O}/><ellipse cx="-60" cy="-72" rx="2" ry="3" fill="url(#gPlum)"/><ellipse cx="-50" cy="-66" rx="2" ry="3" fill="url(#gPlum)"/>`,
  },
  grocery: { wall: '#f2e8d0', door: 'shop', roof: 'awning', roofFill: 'url(#gLeaf)', deco: `<rect x="-60" y="-26" width="18" height="22" rx="2" fill="#c9a26b" ${THIN}/>` },
  sismooni: { wall: '#fde8ef', door: 'shop', sign: 'سیسمونی', roofFill: 'url(#gRose)' },
  library: { wall: '#efe3cc', roof: 'gable', roofFill: 'url(#gTurq)', door: 'arch', sign: 'کتابخونه' },
  nursery: { wall: '#cfe8c4', roof: 'gable', door: 'arch', deco: `<path d="M44 -58 a9 9 0 1 1 -1 -16 a7 7 0 1 0 1 16 Z" fill="url(#gYellow)" ${THIN}/>` },
  naming: {
    wall: '#e0b07a', w: 124, h: 60, door: 'gate',
    deco: `<path d="M-60 -66 Q0 -84 60 -66" fill="none" stroke="url(#gLeaf)" stroke-width="4"/>` + Array.from({ length: 7 }, (_, i) => `<circle cx="${-48 + i * 16}" cy="${-70 - Math.sin((i / 6) * Math.PI) * 8}" r="4" fill="url(#gRose)" ${THIN} stroke-width=".8"/>`).join(''),
  },
  gate: {
    wall: '#cf9e6c', w: 104, h: 86, door: 'gate',
    deco: `<rect x="-34" y="-74" width="68" height="12" rx="2" fill="url(#gBlue)" ${THIN}/><path d="M-26 -68 H26" stroke="#f6c945" stroke-width="1.4" stroke-dasharray="3 2"/>` +
      `<rect x="34" y="-50" width="20" height="9" rx="2" fill="url(#gBlue)" ${THIN} stroke-width="1"/>`,
  },
  rooftop: {
    wall: '#d9a873', h: 66, door: 'arch',
    deco: `<path d="M-64 -86 H64" ${O} stroke="url(#gBlue)" stroke-width="3"/>` + Array.from({ length: 9 }, (_, i) => `<path d="M${-64 + i * 16} -86 V-72" stroke="${INK}" stroke-width="2"/>`).join('') +
      [-40, 40].map((x) => `<circle cx="${x}" cy="-80" r="4" fill="#e0303f" ${THIN} stroke-width="1"/>`).join(''),
  },
  cistern: {
    wall: '#c9a26b', roof: 'dome', roofFill: 'url(#gClay)', door: 'gate',
    deco: [-52, 52].map((x) => `<rect x="${x - 9}" y="-118" width="18" height="44" fill="url(#gClay)" ${O}/>` + [0, 1].map((k) => `<rect x="${x - 5 + k * 6}" y="-112" width="4" height="16" rx="1" fill="#3b2a20"/>`).join('')).join(''),
  },
  museum: { wall: '#f2e6cc', roof: 'gable', roofFill: 'url(#gNavy)', door: 'arch', sign: 'موزه‌ی محله' },
  heritage: {
    wall: 'url(#gTerracotta)', w: 120, h: 76, door: 'gate',
    deco: `<path d="M-60 -82 Q0 -64 60 -82" fill="none" stroke="${INK}" stroke-width="1.2"/>` +
      Array.from({ length: 8 }, (_, i) => `<path d="M${-54 + i * 15} ${-80 + Math.sin((i / 7) * Math.PI) * 9} l5 0 l-2.5 8 Z" fill="${['#2a9d4a', '#fffdf6', '#e0303f'][i % 3]}" stroke="${INK}" stroke-width=".8"/>`).join('') +
      `<rect x="-14" y="-62" width="28" height="12" rx="2" fill="url(#gBrass)" ${THIN}/>`,
  },
  carpetshop: {
    wall: '#efe0c6', door: 'shop', sign: 'فرش آیدین',
    deco: `<rect x="-58" y="-60" width="18" height="28" rx="1" fill="url(#gCarpet)" ${THIN}/><rect x="40" y="-60" width="18" height="28" rx="1" fill="url(#gNavy)" ${THIN}/>`,
  },
  bazaar: {
    wall: '#c98a52', roof: 'dome', roofFill: 'url(#gClay)', door: 'gate', w: 136,
    deco: [-46, 46].map((x) => `<path d="M${x - 14} -74 Q${x} -92 ${x + 14} -74 Z" fill="url(#gClay)" ${O}/>`).join(''),
  },
  elgoli: {
    wall: '#f6e3b0', roof: 'gable', door: 'arch', w: 112, h: 70,
    deco: `<path d="M-70 0 Q0 12 70 0 L70 6 L-70 6 Z" fill="url(#gWater)" ${THIN}/>` + [-34, 0, 34].map((x) => `<rect x="${x - 5}" y="-62" width="10" height="14" rx="5" fill="#ffe08a" ${THIN} stroke-width="1"/>`).join(''),
  },
  tabrizhome: {
    wall: '#e8d8bc', roof: 'gable', roofFill: 'url(#gSteel)', door: 'arch',
    deco: `<path d="M-70 -76 Q0 -84 70 -76" fill="none" stroke="#fffdf6" stroke-width="5" stroke-linecap="round"/>`,
  },
  balehboron: {
    wall: '#e0b07a', w: 124, h: 60, door: 'gate',
    deco: `<path d="M-60 -66 Q0 -84 60 -66" fill="none" stroke="${INK}" stroke-width="1.2"/>` + Array.from({ length: 7 }, (_, i) => `<circle cx="${-48 + i * 16}" cy="${-70 - Math.sin((i / 6) * Math.PI) * 8}" r="4" fill="${['#ffd36b', '#e0303f', '#5fe0e0'][i % 3]}" ${THIN} stroke-width=".8"/>`).join(''),
  },
  gardenhouse: {
    wall: 'url(#gTerracotta)', roof: 'gable', roofFill: 'url(#gTurq)', door: 'gate', w: 120,
    deco: [-62, 62].map((x) => `<path d="M${x} 0 V-50" stroke="#d8cbb4" stroke-width="5"/><circle cx="${x}" cy="-60" r="16" fill="url(#gLeaf)" ${O}/>`).join(''),
  },
  poolhouse: {
    wall: '#e8dcc6', roof: 'dome', roofFill: 'url(#gClay)', door: 'arch',
    deco: [-44, -28, 28, 44].map((x) => `<rect x="${x - 6}" y="-30" width="12" height="12" fill="${x < 0 ? 'url(#gTurq)' : 'url(#gBlue)'}" ${THIN} stroke-width="1"/>`).join(''),
  },
  orchard: {
    wall: '#c69260', h: 54, door: 'gate',
    deco: [-44, 44].map((x) => `<circle cx="${x}" cy="-66" r="16" fill="url(#gLeaf)" ${O}/>` + [[-6, -70], [5, -62], [0, -74]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${dy}" r="2.6" fill="url(#gRed)"/>`).join('')).join(''),
  },
  mirrorhall: {
    wall: '#efe3cc', roof: 'gable', roofFill: 'url(#gGold)', door: 'arch',
    deco: Array.from({ length: 7 }, (_, i) => `<path d="M${-36 + i * 12} -70 l5 4 l-5 4 l-5 -4 Z" fill="#d6ecff" stroke="#9ab" stroke-width=".8"/>`).join(''),
  },
  parkopening: {
    wall: '#8fbf4a', w: 120, h: 50, door: 'gate', sign: 'باغ عمه‌خانم',
    deco: [-62, 62].map((x) => `<circle cx="${x}" cy="-56" r="18" fill="url(#gLeaf)" ${O}/>`).join(''),
  },
  radio: {
    wall: '#d8e4d4', door: 'arch', sign: 'رادیو محله',
    deco: `<path d="M44 -74 V-110 M36 -102 L52 -102 M38 -94 L50 -94" ${O} stroke-width="2"/><circle cx="44" cy="-112" r="3" fill="#e0303f" ${THIN}/>`,
  },
  pitch: {
    wall: '#c9a26b', h: 40, w: 136, door: 'gate',
    deco: `<path d="M-50 -40 V-60 H-30 V-40 M50 -40 V-60 H30 V-40" fill="none" stroke="#fffdf6" stroke-width="3"/><circle cx="0" cy="-50" r="7" fill="#fffdf6" ${THIN}/>`,
  },
  stands: {
    wall: '#9aa4ae', roof: 'flat', door: 'gate', w: 132,
    deco: ['#e0303f', '#f6c945', '#14879a'].map((c, i) => `<rect x="-60" y="${-70 + i * 8}" width="120" height="6" fill="${c}"/>`).join(''),
  },
  final: {
    wall: '#3f8a3a', h: 46, w: 136, door: 'gate',
    deco: [-60, 60].map((x) => `<path d="M${x} -46 V-96" stroke="#8a96a4" stroke-width="3"/><rect x="${x - 10}" y="-104" width="20" height="10" rx="2" fill="#fff6c8" ${THIN}/>`).join(''),
  },
  victory: {
    wall: '#e0b07a', w: 124, h: 60, door: 'gate',
    deco: `<path d="M-14 -62 H14 C14 -46 6 -42 0 -40 C-6 -42 -14 -46 -14 -62 Z" fill="url(#gGold)" ${THIN}/>` +
      Array.from({ length: 7 }, (_, i) => `<circle cx="${-48 + i * 16}" cy="${-70 - Math.sin((i / 6) * Math.PI) * 8}" r="4" fill="${['#2a9d4a', '#fffdf6', '#e0303f'][i % 3]}" ${THIN} stroke-width=".8"/>`).join(''),
  },
  station: {
    wall: '#d8c8aa', roof: 'flat', door: 'arch', w: 136, sign: 'ایستگاه',
    deco: `<circle cx="0" cy="-90" r="8" fill="#fffdf6" ${THIN}/><path d="M0 -90 V-95 M0 -90 L4 -88" stroke="${INK}" stroke-width="1.4"/>`,
  },
  seavilla: {
    wall: '#f6e3b0', roof: 'gable', door: 'arch',
    deco: `<path d="M-74 6 Q0 -4 74 6 V10 H-74 Z" fill="url(#gWater)" ${THIN}/>`,
  },
  paddy: {
    wall: 'url(#gWood)', roof: 'gable', roofFill: '#d8b860', door: 'gate', h: 56,
    deco: `<path d="M-74 0 H74" stroke="#9fd0e8" stroke-width="6"/>` + Array.from({ length: 10 }, (_, i) => `<path d="M${-68 + i * 15} -2 v-8" stroke="#3fae5a" stroke-width="2"/>`).join(''),
  },
  masuleh: {
    wall: '#e8c99a', door: 'arch', w: 118,
    deco: `<rect x="-50" y="-100" width="44" height="22" fill="#e8c99a" ${O}/><rect x="6" y="-100" width="44" height="22" fill="#e8c99a" ${O}/>` +
      [-40, -18, 16, 38].map((x) => `<rect x="${x - 5}" y="-96" width="10" height="12" fill="url(#gYellow)" ${THIN} stroke-width="1"/>`).join(''),
  },
  sizdah: {
    wall: '#f2d8a0', w: 128, h: 40, door: 'gate',
    deco: `<path d="M-30 -80 L-22 -70 L-30 -60 L-38 -70 Z" fill="url(#gRed)" ${THIN}/><path d="M24 -90 L32 -80 L24 -70 L16 -80 Z" fill="url(#gTurq)" ${THIN}/>` +
      `<path d="M-30 -60 q4 8 0 16 M24 -70 q4 8 0 16" fill="none" stroke="${INK}" stroke-width="1"/>`,
  },
  safavid: {
    wall: 'url(#gCream)', door: 'arch', w: 120,
    deco: `<path d="M-26 -44 V-60 Q-26 -74 0 -78 Q26 -74 26 -60 V-44 Z" fill="url(#gTurq)" ${O}/>`,
  },
  siosepol: {
    wall: '#d9a873', h: 50, w: 140, door: 'arch',
    deco: [-48, -24, 24, 48].map((x) => `<path d="M${x - 8} -6 V-26 Q${x} -38 ${x + 8} -26 V-6 Z" fill="#ffd36b" ${THIN}/>`).join('') + `<path d="M-74 4 H74" stroke="#6cc0ea" stroke-width="6"/>`,
  },
  naqshejahan: {
    wall: '#e9c98a', roof: 'dome', roofFill: 'url(#gTurq)', door: 'arch', w: 136,
    deco: `<path d="M58 -74 V-120" stroke="#e9c98a" stroke-width="6"/><path d="M52 -120 H64 L58 -128 Z" fill="url(#gTurq)" ${THIN}/>`,
  },
  workshop: { wall: '#efe3cc', roof: 'gable', roofFill: 'url(#gBlue)', door: 'shop', sign: 'کارگاه هنر' },
  restoschool: {
    wall: '#f2e8d0', roof: 'gable', roofFill: 'url(#gLeaf)', door: 'arch', sign: 'مدرسه‌ی مرمت',
    deco: `<rect x="-62" y="-30" width="18" height="14" fill="#2f5a3a" ${THIN} stroke-width="1"/>`,
  },
  dossier: { wall: '#efe3cc', roof: 'gable', roofFill: 'url(#gTurq)', door: 'arch', sign: 'پرونده‌ی ثبت' },
  inspection: {
    wall: '#cf9e6c', w: 104, h: 86, door: 'gate',
    deco: [-62, 62].map((x) => `<rect x="${x - 10}" y="-60" width="20" height="10" rx="2" fill="url(#gBlue)" ${THIN}/>`).join(''),
  },
  exhibition: {
    wall: '#c9a26b', roof: 'dome', roofFill: 'url(#gClay)', door: 'gate',
    deco: [-36, 36].map((x) => `<rect x="${x - 10}" y="-30" width="20" height="16" fill="url(#gGold)" ${THIN}/>`).join(''),
  },
  culturenight: {
    wall: '#d9a873', h: 56, w: 128, door: 'gate',
    deco: `<path d="M-60 -62 Q0 -80 60 -62" fill="none" stroke="${INK}" stroke-width="1.2"/>` + Array.from({ length: 7 }, (_, i) => `<circle cx="${-48 + i * 16}" cy="${-66 - Math.sin((i / 6) * Math.PI) * 8}" r="4" fill="#ffd36b" ${THIN} stroke-width=".8"/>`).join(''),
  },
  worldparty: {
    wall: 'url(#gTerracotta)', w: 120, h: 80, door: 'gate',
    deco: `<rect x="-20" y="-70" width="40" height="14" rx="2" fill="url(#gSilver)" ${THIN}/>` + Array.from({ length: 8 }, (_, i) => `<rect x="${-56 + i * 15}" y="${-92 + Math.sin((i / 7) * Math.PI) * 6}" width="9" height="6" fill="${['#2a9d4a', '#fffdf6', '#e0303f', '#3a76c4'][i % 4]}" stroke="${INK}" stroke-width=".6"/>`).join(''),
  },
  mahinhome: { wall: '#e8d5ff', roof: 'gable', roofFill: 'url(#gPurple)', door: 'arch', deco: `<path d="M44 -74 V-96 M38 -90 H50" ${O} stroke-width="2"/>` },
  cakeroom: { wall: '#f2e8d0', roof: 'awning', roofFill: 'url(#gRose)', door: 'shop', deco: `<rect x="-60" y="-30" width="16" height="20" rx="2" fill="#fffdf6" ${THIN}/>` },
  hall: { wall: '#fdfaf3', roof: 'gable', roofFill: 'url(#gRed)', door: 'arch', w: 132, sign: 'تالار محله' },
  memories: {
    wall: '#efe3cc', door: 'arch',
    deco: [-46, 46].map((x) => `<rect x="${x - 10}" y="-58" width="20" height="16" fill="url(#gGold)" ${THIN}/>`).join(''),
  },
  birthday: {
    wall: '#ffe0ef', w: 124, h: 60, door: 'gate',
    deco: [[-50, '#e0303f'], [-30, '#f6c945'], [30, '#14879a'], [50, '#ff7a9c']].map(([x, c]) => `<ellipse cx="${x}" cy="-82" rx="7" ry="9" fill="${c}" ${THIN}/><path d="M${x} -73 V-60" stroke="${INK}" stroke-width="1"/>`).join(''),
  },
  nest: {
    wall: '#f3e6d0', h: 84, door: 'shop',
    deco: `<rect x="-14" y="-76" width="28" height="24" rx="3" fill="#ffe08a" ${THIN}/><path d="M-14 -76 q8 12 0 24 Z M14 -76 q-8 12 0 24 Z" fill="url(#gRose)" ${THIN}/>` +
      `<rect x="-17" y="-53" width="34" height="5" rx="2" fill="url(#gTerracotta)" ${THIN}/>` + [-10, -3, 4, 11].map((x) => `<circle cx="${x}" cy="-56" r="2.6" fill="#e0303f" ${THIN} stroke-width=".6"/>`).join(''),
  },
  henna: {
    wall: 'url(#gTerracotta)', h: 58, door: 'gate',
    deco: `<path d="M-60 -64 Q0 -48 60 -64" fill="none" stroke="${INK}" stroke-width="1"/>` +
      Array.from({ length: 7 }, (_, i) => { const x = -54 + i * 18; return `<circle cx="${x}" cy="${-62 + (1 - (x / 60) ** 2) * 8}" r="3" fill="${['#ffd36b', '#ff7a9c'][i % 2]}" ${THIN} stroke-width=".8"/>`; }).join(''),
  },
  paykan: {
    wall: '#cfc6b4', h: 70, door: 'shop',
    deco: [-30, -24, -18, -12, -6].map((y) => `<path d="M-26 ${y} H26" stroke="#9a948a" stroke-width="1.4"/>`).join('') + `<g transform="translate(28 -30) scale(.34)">${WEDDING[7]}</g>`,
  },
  gardenwed: {
    wall: '#e9e0c9', w: 132, h: 56, door: 'gate',
    deco: Array.from({ length: 9 }, (_, i) => { const a = Math.PI + (i / 8) * Math.PI; return `<circle cx="${Math.cos(a) * 26}" cy="${-34 + Math.sin(a) * 26}" r="3.4" fill="${['#e0303f', '#fffdf6', '#ff9ec4'][i % 3]}" ${THIN} stroke-width=".8"/>`; }).join('') +
      [-60, 60].map((x) => `<path d="M${x} -50 C${x - 9} -66 ${x - 5} -90 ${x} -104 C${x + 5} -90 ${x + 9} -66 ${x} -50 Z" fill="url(#gLeafDark)" ${THIN}/>`).join(''),
  },
  patakhti: {
    wall: '#ffe0ef', roof: 'gable', roofFill: 'url(#gRed)', door: 'arch',
    deco: [[24, 14, 'url(#gBlue)'], [38, 10, 'url(#gYellow)']].map(([x, w, c]) => `<rect x="${x}" y="${-Number(w)}" width="${w}" height="${w}" fill="${c}" ${THIN} stroke-width="1"/><path d="M${Number(x) + Number(w) / 2} ${-Number(w)} V0" stroke="#fffdf6" stroke-width="2"/>`).join(''),
  },
  wedding: {
    wall: 'url(#gWood)', w: 120, h: 70, door: 'gate',
    deco: Array.from({ length: 9 }, (_, i) => `<circle cx="${-56 + i * 14}" cy="${-72 + Math.sin(i / 8 * Math.PI) * -8}" r="3.2" fill="${['#ffd36b', '#ff7a9c', '#5fe0e0'][i % 3]}" ${THIN} stroke-width=".8"/>`).join(''),
  },
};

const scaffold = (w: number, h: number) =>
  `<g opacity=".95">` +
  [-w / 2 - 4, 0, w / 2 + 4].map((x) => `<path d="M${x} 0 V${-h - 10}" stroke="#a77a4f" stroke-width="3.4"/>`).join('') +
  [-20, -h / 2 - 8, -h + 4].map((y) => `<path d="M${-w / 2 - 8} ${y} H${w / 2 + 8}" stroke="#a77a4f" stroke-width="3"/>`).join('') +
  `<path d="M${-w / 2 - 4} -20 L0 ${-h / 2 - 8} L${w / 2 + 4} -20" fill="none" stroke="#8b5e34" stroke-width="2"/></g>`;

const pin = (y: number) =>
  `<g class="map-pin" transform="translate(0 ${y})"><path d="M0 0 C-12 -14 -14 -20 -14 -26 C-14 -36 14 -36 14 -26 C14 -20 12 -14 0 0 Z" fill="url(#gRed)" ${O}/><circle cx="0" cy="-26" r="5" fill="#fff" ${THIN}/></g>`;

const lock = (y: number) =>
  `<g transform="translate(0 ${y})"><circle r="13" fill="#fff8ea" ${O}/><rect x="-6" y="-2" width="12" height="9" rx="2" fill="url(#gSteel)" ${THIN}/><path d="M-4 -2 V-5 a4 4 0 0 1 8 0 V-2" fill="none" ${THIN}/></g>`;

/** The cobbled alley winding up through all plots. */
function alley(count: number): string {
  let d = `M180 ${MAP_H}`;
  for (let k = 0; k < count; k++) {
    const p = plot(k);
    const x = p.right ? 150 : 210;
    d += ` Q${x} ${p.y + 40} 180 ${p.y - STEP / 2 + 20}`;
  }
  d += ` L180 0`;
  return `<path d="${d}" fill="none" stroke="#b8a07c" stroke-width="58" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="#d6c3a0" stroke-width="50" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="#c4ad86" stroke-width="46" stroke-dasharray="6 9" stroke-linecap="round" opacity=".7"/>`;
}

const tree = (x: number, y: number, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 V-18" stroke="#7a4a22" stroke-width="5"/><circle cx="0" cy="-30" r="16" fill="url(#gLeaf)" ${O}/><circle cx="-8" cy="-24" r="9" fill="url(#gLeafDark)" opacity=".6"/></g>`;

/** Full map. `states[k]` is the state of episode k; `names[k]` its place name. */
export function mapSvg(ids: string[], names: string[], states: MapState[]): string {
  let s = `<rect width="360" height="${MAP_H}" fill="#e9d9b8"/>`;
  s += Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 97) % 360}" cy="${(i * 211) % MAP_H}" r="${2 + (i % 3)}" fill="#d8c39c" opacity=".7"/>`).join('');
  s += alley(ids.length);
  // The alley goes on past the last episode: a striped barrier and a sign tease what comes next.
  s += `<g transform="translate(180 70)"><path d="M-30 0 V22 M30 0 V22" ${O} stroke-width="4"/>` +
    `<rect x="-40" y="-10" width="80" height="12" rx="3" fill="#fff" ${O}/>` +
    [-32, -16, 0, 16].map((x) => `<path d="M${x} 2 L${x + 8} -10 H${x + 16} L${x + 8} 2 Z" fill="#e0303f"/>`).join('') +
    `<rect x="-40" y="-10" width="80" height="12" rx="3" fill="none" ${O}/>` +
    `<rect x="-36" y="-40" width="72" height="22" rx="5" fill="url(#gWood)" ${O}/><path d="M0 -18 V-10" ${O} stroke-width="3"/>` +
    `<text x="0" y="-25" text-anchor="middle" font-family="Vazirmatn, sans-serif" font-weight="800" font-size="10" fill="#fff8ea">ادامه دارد…</text></g>`;
  s += Array.from({ length: Math.floor(MAP_H / 170) - 1 }, (_, i) => [i % 2 ? 334 : 26, MAP_H - 70 - i * 170]).map(([x, y]) => tree(x, y, 0.9)).join('');
  ids.forEach((id, k) => {
    const p = plot(k);
    const f = FACADES[id] ?? FACADES.teahouse;
    const st = states[k];
    const h = f.h ?? 74;
    const label = `${faDigits(k + 1)}. ${names[k]}`;
    // Long names shrink to stay inside the pill (about 4 units per character at size 10).
    const fs = label.length > 26 ? (260 / label.length).toFixed(1) : '10';
    let g = facade(f);
    if (st === 'current') g += scaffold(f.w ?? 128, h);
    s += `<g class="map-place" data-k="${k}" transform="translate(${p.x} ${p.y})">` +
      `<g${st === 'locked' ? ' filter="url(#fGray)" opacity=".7"' : ''}>${g}</g>` +
      (st === 'done' ? sparkle(52, -h - 8, 5) : '') +
      (st === 'current' ? pin(-h - 18) : '') +
      (st === 'locked' ? lock(-h / 2) : '') +
      `<rect x="-58" y="10" width="116" height="20" rx="10" fill="${st === 'done' ? '#3fae5a' : st === 'current' ? '#e2507a' : '#9b8a76'}" ${THIN}/>` +
      `<text x="0" y="24" text-anchor="middle" font-family="Vazirmatn, sans-serif" font-weight="800" font-size="${fs}" fill="#fff">${label}</text>` +
      `<rect x="-70" y="${-h - 60}" width="140" height="${h + 92}" fill="transparent"/>` +
      `</g>`;
  });
  return `<svg viewBox="0 0 360 ${MAP_H}" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
}
