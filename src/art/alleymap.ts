// The alley map: the whole street in one picture (viewBox 360 × MAP_H). The places of the
// story stand along a winding cobbled alley, episode 1 at the bottom, the latest at the
// top. Restored places are in colour, the one being worked on has scaffolding and a pin,
// the rest wait in grey.

import { WEDDING } from './chainsO';
import { camel } from './chainsP';
import { INK, O, THIN, sparkle } from './kit';

export const MAP_H = 12880;
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
  roadhouse: {
    wall: '#c99a62', h: 60, door: 'arch', sign: 'چای داغ',
    deco: `<path d="M56 0 V-50 H44" fill="none" stroke="#5a5a60" stroke-width="3"/><circle cx="44" cy="-46" r="4" fill="#fff6a8" ${THIN} stroke-width="1"/>`,
  },
  caravan: {
    wall: '#e0b07a', w: 136, h: 66, door: 'gate',
    deco: `<rect x="-24" y="-92" width="48" height="30" fill="#e0b07a" ${O}/><rect x="-20" y="-88" width="40" height="9" fill="url(#gTurq)" ${THIN} stroke-width="1"/>` +
      [-50, -34, 34, 50].map((x) => `<path d="M${x - 6} -30 V-40 Q${x} -50 ${x + 6} -40 V-30 Z" fill="#7a4a2a" ${THIN} stroke-width="1"/>`).join(''),
  },
  hojreh: {
    wall: '#d8a86a', roof: 'dome', roofFill: 'url(#gTerracotta)', door: 'arch', w: 120,
    deco: [-34, 34].map((x) => `<path d="M${x - 7} -8 V-22 Q${x} -32 ${x + 7} -22 V-8 Z" fill="#5e3418" ${THIN} stroke-width="1"/>`).join(''),
  },
  desertnight: {
    wall: '#4a3a5a', w: 116, h: 46, door: 'gate',
    deco: Array.from({ length: 7 }, (_, i) => `<circle cx="${-50 + i * 16}" cy="${-62 - (i % 3) * 8}" r="${i % 2 ? 1.6 : 2.4}" fill="#fff6d0"/>`).join('') + camel(40, -46, 0.4),
  },
  ecolodge: {
    wall: '#e0b07a', w: 132, h: 70, door: 'gate', sign: 'بوم‌گردی',
    deco: camel(-58, 0, 0.42, `<path d="M-8 -38 C-4 -48 10 -48 12 -38 L14 -28 H-10 Z" fill="url(#gTurq)" ${THIN}/>`),
  },
  yazdlanes: {
    wall: '#c99a62', h: 62, door: 'arch',
    deco: `<path d="M-64 -62 H64 V-50 Q0 -74 -64 -50 Z" fill="#a8783e" ${THIN}/>` + `<rect x="32.0" y="-96" width="16" height="34" fill="#c99a62" ${THIN}/><rect x="35.0" y="-92" width="10" height="13.600000000000001" fill="#5e3418"/>`,
  },
  qanat: {
    wall: '#d8b48a', w: 110, h: 44, door: 'arch',
    deco: [-30, 30].map((x) => `<ellipse cx="${x}" cy="-52" rx="16" ry="5" fill="#c9a27a" ${THIN}/><ellipse cx="${x}" cy="-52" rx="6" ry="2" fill="#3b2216"/>`).join('') +
      `<path d="M22 -52 V-70 M38 -52 V-70" stroke="#8b5328" stroke-width="2.4"/><path d="M18 -70 H42" stroke="#8b5328" stroke-width="3.4"/>`,
  },
  windhouse: {
    wall: '#c99a62', door: 'gate',
    deco: `<rect x="-43.0" y="-118" width="26" height="44" fill="#c99a62" ${THIN}/><rect x="-40.0" y="-114" width="20" height="17.6" fill="#5e3418"/>` + `<rect x="-46" y="-122" width="32" height="6" fill="#a8783e" ${THIN}/>`,
  },
  yazdsweets: { wall: '#f6ead2', roof: 'awning', roofFill: 'url(#gTurq)', door: 'shop', sign: 'قنادی رفاقت' },
  reunion: {
    wall: '#d9a873', door: 'arch', sign: 'مهمون یزدی',
    deco: `<rect x="39.0" y="-104" width="14" height="30" fill="#c99a62" ${THIN}/><rect x="42.0" y="-100" width="8" height="12.0" fill="#5e3418"/>`,
  },
  oldschool: {
    wall: '#ece4cc', roof: 'gable', roofFill: 'url(#gLeafDark)', door: 'gate', sign: 'دبستان امید',
    deco: `<path d="M50 -74 V-90" ${O} stroke-width="2"/><path d="M44 -84 C44 -94 56 -94 56 -84 Z" fill="url(#gBrass)" ${THIN}/>`,
  },
  firstclass: {
    wall: '#7fae8e', door: 'arch',
    deco: [-42, 42].map((x) => `<rect x="${x - 9}" y="-50" width="18" height="22" rx="8" fill="#ffe08a" ${THIN}/>`).join('') +
      `<rect x="-20" y="-70" width="40" height="18" rx="2" fill="#2f4a3a" ${THIN}/><text x="0" y="-57" text-anchor="middle" font-family="Vazirmatn, sans-serif" font-weight="900" font-size="11" fill="#f4f0e6">آب</text>`,
  },
  bookvan: {
    wall: '#d9a873', w: 120, h: 54, door: 'shop',
    deco: `<rect x="-44" y="-80" width="88" height="16" rx="3" fill="url(#gBlue)" ${THIN}/>` + Array.from({ length: 8 }, (_, i) => `<rect x="${-38 + i * 10}" y="-60" width="7" height="${12 + (i % 3) * 2}" fill="${['#e0303f', '#3a76c4', '#3f8a2a', '#f6c945'][i % 4]}" ${THIN} stroke-width=".6"/>`).join(''),
  },
  poetry: {
    wall: '#4a4a6a', w: 116, h: 50, door: 'gate',
    deco: `<path d="M-58 -62 Q0 -46 58 -62" fill="none" stroke="${INK}" stroke-width="1"/>` + Array.from({ length: 6 }, (_, i) => `<circle cx="${-50 + i * 20}" cy="${-58 + Math.sin(i / 5 * Math.PI) * 6}" r="3" fill="#ffd36b" ${THIN} stroke-width=".8"/>`).join(''),
  },
  graduation: {
    wall: '#ece4cc', roof: 'gable', roofFill: 'url(#gRed)', door: 'gate',
    deco: `<rect x="34" y="-34" width="22" height="16" fill="#f6e3b0" ${THIN}/><circle cx="50" cy="-20" r="5" fill="url(#gGold)" ${THIN} stroke-width="1"/>`,
  },
  tvset: {
    wall: '#d9a873', w: 124, h: 60, door: 'gate', sign: 'آشپزی محله',
    deco: [-56, 56].map((x) => `<path d="M${x} 0 V-40" stroke="#3a3a44" stroke-width="2"/><path d="M${x - 7} -48 H${x + 7} L${x + 9} -38 H${x - 9} Z" fill="#3a3a44" ${THIN} stroke-width="1"/><circle cx="${x}" cy="-36" r="4" fill="#fff6a8"/>`).join(''),
  },
  golabkitchen: {
    wall: '#f4f0e6', roof: 'gable', roofFill: 'url(#gTerracotta)', door: 'arch',
    deco: `<path d="M40 -84 V-100" stroke="#8a8a90" stroke-width="5"/><path d="M40 -104 q-6 -8 0 -14 q6 -6 0 -12" fill="none" stroke="#fff" stroke-width="2.4" opacity=".9"/>`,
  },
  market: {
    wall: '#cfd8dc', roof: 'awning', roofFill: 'url(#gGreenTile)', door: 'shop', w: 136,
    deco: [[-50, 'url(#gRed)'], [-38, 'url(#gOrange)'], [38, 'url(#gYellow)'], [50, 'url(#gPom)']].map(([x, c]) => `<circle cx="${x}" cy="-6" r="5" fill="${c}" ${THIN} stroke-width=".8"/>`).join(''),
  },
  finalcook: {
    wall: '#4a3a3a', w: 120, h: 58, door: 'gate', sign: 'فینال',
    deco: `<circle cx="50" cy="-72" r="10" fill="#fffdf6" ${THIN}/><path d="M50 -72 V-79 M50 -72 L55 -69" stroke="${INK}" stroke-width="1.4"/>`,
  },
  bigsofreh: {
    wall: '#c98a52', w: 128, h: 56, door: 'gate',
    deco: `<path d="M-30 0 H30 L44 14 H-44 Z" fill="#fffdf6" ${THIN}/>` + [-60, -40, -20, 0, 20, 40, 60].map((x, i) => `<circle cx="${x}" cy="${-64 + Math.abs(x) / 10}" r="3" fill="${['#ffd36b', '#ff7a9c', '#5fe0e0'][i % 3]}" ${THIN} stroke-width=".8"/>`).join(''),
  },
  roofs: {
    wall: '#c99a62', h: 60, door: 'arch',
    deco: [-36, 36].map((x) => `<rect x="${x - 6}" y="-80" width="12" height="20" fill="#a8784a" ${THIN}/><path d="M${x} -82 q-5 -7 0 -14" fill="none" stroke="#fff" stroke-width="2"/>`).join(''),
  },
  firstsnow: { wall: '#c98a52', h: 66, door: 'gate', deco: `<path d="M-66 -66 Q-30 -74 0 -70 T66 -66 V-62 H-66 Z" fill="#fafdff" ${THIN} stroke-width="1"/>` },
  korsi: {
    wall: '#efe3cc', roof: 'gable', roofFill: '#fafdff', door: 'arch',
    deco: `<path d="M24 -28 H48 L52 -12 H20 Z" fill="url(#gRed)" ${THIN}/>`,
  },
  furnace: {
    wall: '#a8603a', roof: 'dome', roofFill: '#fafdff', door: 'arch', w: 118,
    deco: `<path d="M48 -74 V-96" stroke="#5a3a2a" stroke-width="6"/><path d="M48 -100 q-6 -8 0 -16" fill="none" stroke="#fff" stroke-width="2.4"/>`,
  },
  snownight: {
    wall: '#4a4a6a', w: 124, h: 56, door: 'gate',
    deco: `<path d="M-66 -56 Q-30 -64 0 -60 T66 -56 V-52 H-66 Z" fill="#fafdff" ${THIN} stroke-width="1"/>` + `<circle cx="48" cy="-84" r="8" fill="#fff6d0"/><circle cx="51" cy="-86" r="7" fill="#e9d9b8"/>`,
  },
  rosegarden: {
    wall: '#a8904a', w: 116, h: 44, door: 'gate',
    deco: [-40, -20, 20, 40].map((x) => `<ellipse cx="${x}" cy="-52" rx="11" ry="8" fill="url(#gLeafDark)" ${THIN}/><circle cx="${x - 3}" cy="-54" r="3" fill="url(#gRoseDeep)"/><circle cx="${x + 4}" cy="-50" r="3" fill="url(#gRoseDeep)"/>`).join(''),
  },
  distillery: {
    wall: '#b8804a', roof: 'dome', roofFill: 'url(#gTerracotta)', door: 'arch', w: 120,
    deco: `<path d="M44 -12 V-26 H58" fill="none" stroke="#b05a2a" stroke-width="3"/><path d="M50 -14 C50 -24 64 -24 64 -14 Z" fill="url(#gCopper)" ${THIN} stroke-width="1"/>`,
  },
  guesthouse: {
    wall: '#d8b48a', door: 'arch', sign: 'مسافرخونه',
    deco: `<rect x="30" y="-48" width="26" height="22" fill="url(#gWoodDark)" ${THIN}/>` + [0, 1, 2, 3].map((i) => `<rect x="${32 + (i % 2) * 12}" y="${-46 + Math.floor(i / 2) * 10}" width="10" height="8" fill="${['#e0303f', '#3a76c4', '#f6c945', '#3f8a2a'][i]}" opacity=".8"/>`).join(''),
  },
  rosefest: {
    wall: '#d8b48a', w: 124, h: 56, door: 'gate',
    deco: Array.from({ length: 9 }, (_, i) => { const a = Math.PI + (i / 8) * Math.PI; return `<circle cx="${Math.cos(a) * 26}" cy="${-34 + Math.sin(a) * 26}" r="3.6" fill="url(#gRoseDeep)" ${THIN} stroke-width=".8"/>`; }).join(''),
  },
  rosealley: {
    wall: '#d9a873', door: 'arch', sign: 'باغ گلاب',
    deco: [-54, -44, 44, 54].map((x) => `<circle cx="${x}" cy="-6" r="4" fill="url(#gRoseDeep)" ${THIN} stroke-width=".8"/>`).join(''),
  },
  siteoffice: {
    wall: '#3a76c4', w: 116, h: 50, door: 'shop',
    deco: `<circle cx="46" cy="-64" r="8" fill="#e0303f" ${THIN}/><text x="46" y="-60.4" text-anchor="middle" font-family="Vazirmatn, sans-serif" font-weight="900" font-size="10" fill="#fffdf6">M</text>` + `<path d="M46 -56 V-50" stroke="#5a5a60" stroke-width="2"/>`,
  },
  testdig: {
    wall: '#b8a888', w: 118, h: 46, door: 'gate',
    deco: `<path d="M-60 -50 H60 M-60 -40 H60" stroke="#f6c945" stroke-width="3"/>` + [-56, -28, 0, 28, 56].map((x) => `<path d="M${x} -50 V-34" stroke="#f6c945" stroke-width="3"/>`).join(''),
  },
  excavation: {
    wall: '#e8dcc6', w: 110, h: 44, door: 'arch',
    deco: `<path d="M-56 -44 L-36 -82 L-16 -44 Z" fill="#e8dcc6" ${THIN}/><path d="M30 -44 Q46 -66 62 -44 Z" fill="#b8784a" ${THIN}/>`,
  },
  metrostation: {
    wall: '#c98a52', door: 'gate', sign: 'ایستگاه حاج‌بابا',
    deco: `<circle cx="-50" cy="-84" r="8" fill="#e0303f" ${THIN}/><text x="-50" y="-80.4" text-anchor="middle" font-family="Vazirmatn, sans-serif" font-weight="900" font-size="10" fill="#fffdf6">M</text>` + `<path d="M-20 -50 Q0 -62 20 -50" fill="none" stroke="url(#gTurq)" stroke-width="4"/>`,
  },
  centennial: {
    wall: '#d9a873', w: 132, h: 66, door: 'gate', sign: 'صدسالگی',
    deco: Array.from({ length: 9 }, (_, i) => `<circle cx="${-60 + i * 15}" cy="${-82 + Math.abs(i - 4) * 2}" r="3.2" fill="${['#ffd36b', '#ff7a9c', '#5fe0e0', '#9be36b', '#c58bff'][i % 5]}" ${THIN} stroke-width=".8"/>`).join('') +
      [[-40, -112, '#ffd36b'], [36, -118, '#ff7a9c']].map(([x, y, c]) => Array.from({ length: 8 }, (_, k) => { const a = (k / 8) * Math.PI * 2; return `<path d="M${Number(x) + Math.cos(a) * 3} ${Number(y) + Math.sin(a) * 3} L${Number(x) + Math.cos(a) * 9} ${Number(y) + Math.sin(a) * 9}" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`; }).join('')).join(''),
  },
  acacia: {
    wall: '#e0b07a', w: 120, h: 54, door: 'gate',
    deco: [-48, 48].map((x) => `<circle cx="${x}" cy="-70" r="16" fill="url(#gLeaf)" ${THIN}/>` + [-6, 0, 6].map((d) => `<path d="M${x + d} -70 q-1 4 0 8" stroke="#fffdf6" stroke-width="2.4" stroke-linecap="round"/>`).join('')).join(''),
  },
  attari: { wall: '#efe3cc', roof: 'awning', roofFill: 'url(#gLeafDark)', door: 'shop', sign: 'عطاری صبوری' },
  house7: {
    wall: '#e0b07a', roof: 'flat', door: 'arch',
    deco: `<text x="0" y="-48" text-anchor="middle" font-family="Vazirmatn, sans-serif" font-weight="900" font-size="12" fill="#3a76c4">۷</text>`,
  },
  passage: {
    wall: '#8a5a32', w: 110, h: 64, door: 'gate',
    deco: `<path d="M-30 -2 V-34 Q0 -56 30 -34 V-2" fill="none" stroke="#c98a52" stroke-width="4"/>`,
  },
  twofest: {
    wall: '#d8b48a', w: 132, h: 60, door: 'gate',
    deco: Array.from({ length: 9 }, (_, i) => `<circle cx="${-60 + i * 15}" cy="${-70 + Math.abs(i - 4) * 2}" r="3.2" fill="${['#ffd36b', '#ff7a9c', '#5fe0e0'][i % 3]}" ${THIN} stroke-width=".8"/>`).join('') + `<circle cx="-54" cy="-30" r="12" fill="url(#gLeafDark)" ${THIN}/>`,
  },
  dirtlot: {
    wall: '#c9b89a', w: 116, h: 50, door: 'gate',
    deco: Array.from({ length: 8 }, (_, i) => `<path d="M${-56 + i * 14} -50 V-62 l5 -5 l5 5 V-50 Z" fill="${['#e0303f', '#f6c945', '#3a76c4', '#3f8a2a'][i % 4]}" ${THIN} stroke-width="1"/>`).join('') +
      [-40, 40].map((x) => `<path d="M${x} -62 V-80" stroke="#6b4a2a" stroke-width="2.4"/><circle cx="${x}" cy="-84" r="7" fill="#7fc85a" ${THIN}/>`).join(''),
  },
  minipark: {
    wall: '#d8b48a', w: 124, h: 52, door: 'gate',
    deco: `<path d="M-56 -52 L-46 -90 M-24 -52 L-34 -90 M-48 -90 H-32" stroke="#3a76c4" stroke-width="3" stroke-linecap="round"/><path d="M-42 -90 V-66 M-38 -90 V-66" stroke="#8b8b8b" stroke-width="1"/><rect x="-45" y="-66" width="10" height="3" fill="#e0303f"/>` +
      `<path d="M50 -52 V-90 M26 -52 C36 -60 38 -84 50 -88" fill="none" stroke="#f6c945" stroke-width="4" stroke-linecap="round"/>`,
  },
  muralwall: {
    wall: '#fbf7ee', w: 128, h: 66, door: 'arch',
    deco: `<circle cx="0" cy="-53" r="10" fill="#c0501a" ${THIN}/><circle cx="0" cy="-53" r="6.4" fill="#f6c945" ${THIN} stroke-width="1"/><circle cx="52" cy="-58" r="5" fill="#f6c945"/>` +
      [['#e0303f', -54], ['#3a76c4', -20], ['#3f8a2a', 22], ['#ff7a9c', 54]].map(([c, x]) => `<circle cx="${x}" cy="-12" r="4" fill="${c}" opacity=".85"/>`).join(''),
  },
  puppets: {
    wall: '#c0281a', w: 108, h: 70, roof: 'gable', roofFill: 'url(#gGold)', door: 'shop', sign: 'خیمه‌شب‌بازی',
    deco: `<path d="M-6 -46 L0 -60 L6 -46 Z" fill="#e0303f" ${THIN} stroke-width="1"/><circle cx="0" cy="-42" r="5" fill="#f0c49a" ${THIN} stroke-width="1"/>`,
  },
  summerfest: {
    wall: '#d2b48a', w: 132, h: 54, door: 'gate',
    deco: [[-46, -96, '#e0303f'], [0, -110, '#f6c945'], [46, -98, '#3a76c4']].map(([x, y, c]) => `<path d="M${x} ${y} l9 12 l-9 14 l-9 -14 Z" fill="${c}" ${THIN} stroke-width="1"/><path d="M${x} ${Number(y) + 26} q4 6 0 12" fill="none" stroke="${INK}" stroke-width=".8"/>`).join(''),
  },
  apprentice: {
    wall: '#b88a62', w: 116, h: 60, door: 'arch',
    deco: `<path d="M30 -60 V-82 H42 V-60" fill="#8a6a4a" ${THIN}/><path d="M36 -86 q-4 -8 2 -14 M36 -92 q4 -6 0 -12" fill="none" stroke="#d8d8d8" stroke-width="2"/>` +
      `<rect x="-52" y="-80" width="22" height="12" rx="2" fill="url(#gCrust)" ${THIN} stroke-width="1"/>`,
  },
  watermill: {
    wall: '#c9b89a', roof: 'gable', roofFill: 'url(#gWoodDark)', w: 104, h: 62, door: 'arch',
    deco: `<circle cx="-64" cy="-26" r="20" fill="none" stroke="#5e3418" stroke-width="4"/>` + Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2; return `<path d="M-64 -26 L${-64 + Math.cos(a) * 20} ${-26 + Math.sin(a) * 20}" stroke="#8b5328" stroke-width="2.4"/>`; }).join('') +
      `<path d="M-90 2 Q-64 -6 -40 2" fill="none" stroke="#7cc4ef" stroke-width="4"/>`,
  },
  wheatfield: {
    wall: '#e8c060', w: 128, h: 50, door: 'gate',
    deco: Array.from({ length: 9 }, (_, i) => `<path d="M${-56 + i * 14} -50 V-66" stroke="#c9952e" stroke-width="2"/><ellipse cx="${-56 + i * 14}" cy="-70" rx="2.6" ry="5" fill="#f0c050" stroke="#a5621f" stroke-width=".6"/>`).join(''),
  },
  newbakery: {
    wall: '#e8c99a', roof: 'awning', roofFill: 'url(#gNavy)', door: 'shop', sign: 'نونوایی سنگکی',
    deco: `<path d="M-60 -4 H-30 V-26 Q-45 -40 -60 -26 Z" fill="#c98a52" ${THIN}/><path d="M-52 -4 V-16 Q-45 -24 -38 -16 V-4 Z" fill="url(#gFire)"/>`,
  },
  firstbread: {
    wall: '#e0b07a', w: 132, h: 60, door: 'gate',
    deco: `<path d="M-60 -66 H60" stroke="#fffdf6" stroke-width="6"/><path d="M-60 -66 H60" stroke="#e0303f" stroke-width="1.4" stroke-dasharray="5 4"/>` +
      `<path d="M-14 -72 Q0 -78 14 -72 L12 -66 H-12 Z" fill="url(#gCrust)" ${THIN} stroke-width="1"/><path d="M-4 -80 q-3 -6 1 -10 M4 -80 q-3 -6 1 -10" fill="none" stroke="#fff" stroke-width="1.4"/>`,
  },
  acaciaschool: {
    wall: '#e6ecef', roof: 'gable', roofFill: '#9aa4b0', w: 128, h: 62, door: 'arch', sign: 'دبستان اقاقیا',
  },
  schoolyard: {
    wall: '#e6ecef', w: 120, h: 54, door: 'gate',
    deco: `<path d="M44 -54 H56 V-48" fill="none" stroke="${INK}" stroke-width="2"/><path d="M52 -48 Q46 -46 46 -40 H58 Q58 -46 52 -48 Z" fill="url(#gBrass)" ${THIN} stroke-width="1"/>`,
  },
  sciencelab: {
    wall: '#dbe8ee', w: 116, h: 60, door: 'shop',
    deco: `<path d="M-6 -52 V-44 L-12 -34 H12 L6 -44 V-52 Z" fill="url(#gGlass)" ${THIN} stroke-width="1"/><path d="M-10 -37 H10 L12 -34 H-12 Z" fill="#4aa86a"/>`,
  },
  stargazing: {
    wall: '#2a2850', w: 120, h: 58, door: 'gate',
    deco: Array.from({ length: 6 }, (_, i) => `<circle cx="${-50 + i * 20}" cy="${-70 - (i % 2) * 10}" r="1.6" fill="#fff6d0"/>`).join('') + `<path d="M30 -58 L50 -78" stroke="url(#gBrass)" stroke-width="5"/><path d="M30 -58 L50 -78" stroke="#c9952e" stroke-width="4"/>`,
  },
  firstday: {
    wall: '#e6ecef', w: 132, h: 60, door: 'gate',
    deco: [[-54, -78, '#e0303f'], [-40, -84, '#3a76c4'], [48, -80, '#f6c945']].map(([x, y, c]) => `<path d="M${x} ${Number(y) + 8} q2 10 -1 18" fill="none" stroke="${INK}" stroke-width=".8"/><ellipse cx="${x}" cy="${y}" rx="6" ry="8" fill="${c}" ${THIN} stroke-width="1"/>`).join(''),
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
