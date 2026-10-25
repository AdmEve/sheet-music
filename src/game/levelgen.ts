import tuned from '../data/levels.json';
import { botSolve, winRate } from './bot';
import { tuneLevel } from './search';
import { COLOR_INDEX, PALETTE } from './palette';
import { pictureTitle } from './pictures';
import type { LevelDef, ShooterDef } from './engine';
import { BAKED_IDS, HAND_IDS, colorsOf, loadPicture, simplify, type Picture } from './pictures';
import { rng, shuffle } from './rng';

/** Hand-picked order for the first levels: Persian favourites and simple, bold pictures. */
const OPENING = [
  'heart', 'pomegranate', 'watermelon_yalda', 'tea_glass', 'pishi', 'apple', 'goldfish', 'tulip_laleh',
  'strawberry', 'cat', 'sabzeh', 'cherries', 'football', 'frog', 'azadi', 'sun', 'panda', 'tangerine',
  'ladybug', 'trophy', 'mushroom', 'rose', 'pig', 'icecream', 'rainbow', 'gift', 'tropical_fish', 'cupcake',
  'crown', 'bee', 'moon', 'chick', 'lemon', 'balloon', 'penguin', 'grapes', 'fox', 'donut', 'butterfly',
  'house', 'cactus', 'dog', 'rocket', 'snowman', 'gem', 'tiger', 'pizza', 'owl', 'car', 'lion',
];

export const PICTURE_ORDER: string[] = (() => {
  const rest = [...HAND_IDS, ...BAKED_IDS].filter((id) => !OPENING.includes(id));
  shuffle(rest, rng(1404));
  return [...OPENING, ...rest];
})();

export interface LevelParams {
  size: number;
  maxColors: number;
  columns: number;
  noise: number;
  slots: number;
  capacity: number;
  hard: boolean;
  hidden: number;
  ice: number;
  links: number;
  veryHard: boolean;
  /** Share of simulated casual players that should beat the level. */
  target: number;
  /** Ammo sizes the cats are cut into; smaller = more cats = more decisions. */
  ammo?: number[];
}

/**
 * The difficulty curve. `target` is the share of simulated casual players who should win:
 * a gentle start, then a sawtooth where every 5th level is hard and every 10th very hard,
 * each followed by a breather.
 */
export function levelParams(index: number): LevelParams {
  const n = index + 1;
  const veryHard = n >= 20 && n % 10 === 0;
  const hard = veryHard || (n >= 10 && n % 5 === 0);
  const breather = n > 10 && (n - 1) % 5 === 0;
  const size = n <= 5 ? 12 : n <= 12 ? 14 : n <= 25 ? 16 : n <= 45 ? 18 : n <= 80 ? 20 : n <= 130 ? 22 : 24;
  const maxColors = n <= 2 ? 2 : n <= 6 ? 3 : n <= 15 ? 4 : n <= 35 ? 5 : n <= 70 ? 6 : 7;
  const columns = n <= 3 ? 2 : hard && n >= 20 ? 2 : 3;
  const ramp = Math.min(1, n / 120);
  const target =
    n <= 3 ? 1 : n <= 8 ? 0.9 : breather ? 0.85 : veryHard ? 0.3 : hard ? 0.42 : n <= 20 ? 0.72 : 0.62 - ramp * 0.07;
  return {
    size,
    maxColors: maxColors + (hard && n > 10 ? 1 : 0),
    columns,
    noise: n <= 3 ? 0.5 : 3,
    slots: n <= 15 ? 5 : breather ? 5 : 4,
    capacity: 5,
    hard,
    veryHard,
    target,
    hidden: n >= 12 ? Math.min(0.3, 0.1 + ramp * 0.2) : 0,
    ice: n >= 25 ? Math.min(0.15, 0.04 + ramp * 0.1) : 0,
    links: n >= 40 ? Math.min(3, 1 + Math.floor(ramp * 3)) : 0,
    ammo: size <= 12 ? [5, 10, 10] : size <= 16 ? [10, 10, 15, 20] : [10, 15, 20, 25],
  };
}

/** Peeling layer per cell: 0 = visible from the belt now, 1 = once layer 0 is gone, … */
export function peelLayers(w: number, h: number, cells: number[]): number[] {
  const layer: number[] = cells.map((c) => (c >= 0 ? -1 : -2));
  let left = cells.filter((c) => c >= 0).length;
  for (let L = 0; left > 0; L++) {
    const front: number[] = [];
    const firstLive = (idxs: number[]) => { for (const i of idxs) if (layer[i] === -1) { front.push(i); return; } };
    for (let x = 0; x < w; x++) {
      const col = Array.from({ length: h }, (_, y) => y * w + x);
      firstLive(col);
      firstLive(col.slice().reverse());
    }
    for (let y = 0; y < h; y++) {
      const row = Array.from({ length: w }, (_, x) => y * w + x);
      firstLive(row);
      firstLive(row.slice().reverse());
    }
    for (const i of front) if (layer[i] === -1) { layer[i] = L; left--; }
  }
  return layer;
}

function chunkSizes(total: number, size: number, rand: () => number, ammo?: number[]): number[] {
  const options = ammo ?? (size <= 12 ? [5, 10, 10] : size <= 16 ? [10, 15, 20, 25] : size <= 20 ? [10, 20, 30, 40] : [20, 30, 40, 50]);
  const out: number[] = [];
  let left = total;
  while (left > 0) {
    const fit = options.filter((o) => o <= left);
    const c = fit.length ? fit[Math.floor(rand() * fit.length)] : left;
    out.push(c);
    left -= c;
  }
  // Fold a tiny leftover into the previous chunk.
  if (out.length > 1 && out[out.length - 1] < 5) out[out.length - 2] += out.pop()!;
  return out;
}

export function acceptable(id: string, p: LevelParams, index: number): Picture | null {
  const pic = simplify(loadPicture(id, p.size), p.maxColors);
  const filled = pic.cells.filter((c) => c >= 0).length;
  const minColors = index < 6 ? 2 : Math.min(p.maxColors, 3);
  return colorsOf(pic).length >= minColors && filled >= pic.w * pic.h * 0.25 ? pic : null;
}

/**
 * Which picture each level shows: walk the order without repeats. When no unused picture
 * suits the level (too few colours to be interesting), start a fresh cycle instead.
 */
const assigned: string[] = [];
let cycleStart = 0;
function pictureFor(index: number, p: LevelParams): Picture {
  while (assigned.length <= index) {
    const i = assigned.length;
    const used = new Set(assigned.slice(cycleStart));
    const q = levelParams(i);
    let pick = PICTURE_ORDER.find((id) => !used.has(id) && acceptable(id, q, i));
    if (!pick) {
      cycleStart = i;
      pick = PICTURE_ORDER.find((id) => acceptable(id, q, i)) ?? PICTURE_ORDER[i % PICTURE_ORDER.length];
    }
    assigned.push(pick);
  }
  return acceptable(assigned[index], p, index) ?? simplify(loadPicture(assigned[index], p.size), p.maxColors);
}

/**
 * `adv` bends the shooter order: 0 = in peeling order (easy), 1 = reversed, so the shooters
 * at the front are the ones needed last and must be parked (hard).
 */
export function assemble(index: number, pic: Picture, p: LevelParams, noise: number, adv: number, seed: number): LevelDef {
  const rand = rng(seed);
  const { w, h } = pic;
  const hp: number[] = pic.cells.map((c) => (c >= 0 ? 1 : 0));
  if (p.ice > 0) {
    // Ice blocks sit inside the picture (never on the outer layer, so the start stays readable).
    const layers = peelLayers(w, h, pic.cells);
    for (let i = 0; i < hp.length; i++) if (hp[i] && layers[i] >= 1 && rand() < p.ice) hp[i] = 2;
  }
  const layers = peelLayers(w, h, pic.cells);
  const shooters: (ShooterDef & { key: number })[] = [];
  for (const color of colorsOf(pic)) {
    const idx = pic.cells.map((c, i) => (c === color ? i : -1)).filter((i) => i >= 0);
    idx.sort((a, b) => layers[a] - layers[b]);
    // Expand ice cells into two hits each, in peel order.
    const hits: number[] = [];
    for (const i of idx) for (let k = 0; k < hp[i]; k++) hits.push(layers[i] + k * 1.5);
    hits.sort((a, b) => a - b);
    let pos = 0;
    for (const ammo of chunkSizes(hits.length, p.size, rand, p.ammo)) {
      shooters.push({ color, ammo, key: hits[pos] * (1 - 2 * adv) + rand() * noise });
      pos += ammo;
    }
  }
  shooters.sort((a, b) => a.key - b.key);
  const columns: number[][] = Array.from({ length: p.columns }, () => []);
  shooters.forEach((_, i) => columns[i % p.columns].push(i));
  const defs: ShooterDef[] = shooters.map(({ color, ammo }) => ({ color, ammo }));
  if (p.hidden > 0) defs.forEach((d, i) => { if (i >= p.columns && rand() < p.hidden) d.hidden = true; });
  for (let k = 0; k < p.links; k++) {
    const depth = 1 + Math.floor(rand() * Math.max(1, Math.floor(defs.length / p.columns) - 2));
    const col = Math.floor(rand() * (p.columns - 1));
    const a = columns[col][depth], b = columns[col + 1][depth];
    if (a === undefined || b === undefined || defs[a].link !== undefined || defs[b].link !== undefined) continue;
    defs[a].link = b;
    defs[b].link = a;
  }
  return {
    index, pictureId: pic.id, title: pic.title, w, h, cells: pic.cells, hp, columns, shooters: defs,
    slots: p.slots, capacity: p.capacity, hard: p.hard, veryHard: p.veryHard,
  };
}

const cache = new Map<number, LevelDef>();

/** Quick build: a gentle-ish order the careful solver can beat (no difficulty search). */
export function baseLevel(index: number): LevelDef {
  const p = levelParams(index);
  const pic = pictureFor(index, p);
  const tries: [number, number][] = [[0.4, 1], [0.3, 1], [0.2, 1], [0.1, 1], [0, 1], [0, 0.5], [0, 0]];
  for (let t = 0; t < tries.length; t++) {
    const [adv, ns] = tries[t];
    const candidate = assemble(index, pic, p, p.noise * ns, adv, index * 7919 + t * 104729 + 17);
    if (botSolve(candidate).won) return candidate;
  }
  // Last resort: ideal order and plain shooters, one extra slot.
  return assemble(index, pic, { ...p, hidden: 0, links: 0, ice: 0, slots: p.slots + 1 }, 0, 0, index + 1);
}

/** Build-time only: search the queue layout until simulated players win about `target` of the time. */
export function tunedLevel(index: number, iterations = levelParams(index).hard ? 220 : 120): { level: LevelDef; rate: number; minFree: number } {
  const p = levelParams(index);
  const base = baseLevel(index);
  if (p.target >= 1) return { level: base, rate: winRate(base, 0.55, 12), minFree: botSolve(base).minFree };
  let best = tuneLevel(base, p.target, { iterations });
  // Not hard enough? Tighten the structure step by step and search again.
  const pic = pictureFor(index, p);
  const steps: Partial<LevelParams>[] = [
    { ammo: smaller(p.ammo) },
    { ammo: smaller(p.ammo), slots: Math.max(3, p.slots - 1) },
    { ammo: smaller(p.ammo), slots: Math.max(3, p.slots - 1), columns: Math.max(2, p.columns - 1) },
    { ammo: smaller(p.ammo), slots: 3, columns: 2 },
  ];
  for (let k = 0; k < steps.length && best.rate > p.target + 0.15; k++) {
    const q = { ...p, ...steps[k] };
    const start = assemble(index, pic, q, q.noise, 0.3, index * 131 + k);
    if (!botSolve(start).won) continue;
    const r = tuneLevel(start, p.target, { iterations, seed: index * 7 + k });
    if (Math.abs(r.rate - p.target) < Math.abs(best.rate - p.target)) best = r;
  }
  return { level: best.level, rate: best.rate, minFree: best.minFree };
}

function smaller(ammo: number[] | undefined): number[] {
  return (ammo ?? [10, 20]).map((a) => Math.max(5, Math.round(a / 2 / 5) * 5));
}

/** Level `index` (0-based): the pre-tuned one shipped with the game, or a quick build past those. */
export function buildLevel(index: number): LevelDef {
  const hit = cache.get(index);
  if (hit) return hit;
  const level = index < TUNED_COUNT ? decodeLevel(index) : baseLevel(index);
  cache.set(index, level);
  return level;
}

// ── compact storage of the pre-tuned levels (src/data/levels.json) ──

interface PackedLevel { p: string; w: number; h: number; c: string; i?: string; q: string; s: number; k: number; f: number }
const TUNED = tuned as PackedLevel[];
export const TUNED_COUNT = TUNED.length;

/** cells as palette keys ('.' empty), ice as a 0/1 string, queue as "color,ammo,flags[,link] …|…". */
export function encodeLevel(l: LevelDef): PackedLevel {
  const c = l.cells.map((v) => (v < 0 ? '.' : PALETTE[v].key)).join('');
  const ice = l.hp.some((v) => v === 2) ? l.hp.map((v) => (v === 2 ? '1' : '0')).join('') : undefined;
  const q = l.columns.map((col) => col.map((id) => {
    const s = l.shooters[id];
    const parts = [PALETTE[s.color].key, s.ammo, s.hidden ? 1 : 0];
    if (s.link !== undefined) parts.push(s.link);
    return parts.join(',');
  }).join(' ')).join('|');
  // Shooter ids are renumbered column by column on decode, so links are stored as new ids.
  const order: number[] = l.columns.flat();
  const remap = new Map(order.map((id, i) => [id, i]));
  const q2 = q.split('|').map((col) => col.split(' ').map((tok) => {
    const t = tok.split(',');
    if (t.length > 3) t[3] = String(remap.get(Number(t[3])));
    return t.join(',');
  }).join(' ')).join('|');
  return { p: l.pictureId, w: l.w, h: l.h, c, i: ice, q: q2, s: l.slots, k: l.capacity, f: (l.hard ? 1 : 0) | (l.veryHard ? 2 : 0) };
}

function decodeLevel(index: number): LevelDef {
  const t = TUNED[index];
  const cells = [...t.c].map((ch) => (ch === '.' ? -1 : COLOR_INDEX[ch]));
  const hp = cells.map((v, i) => (v < 0 ? 0 : t.i && t.i[i] === '1' ? 2 : 1));
  const shooters: ShooterDef[] = [];
  const columns = t.q.split('|').map((col) => (col ? col.split(' ') : []).map((tok) => {
    const [k, ammo, hidden, link] = tok.split(',');
    const d: ShooterDef = { color: COLOR_INDEX[k], ammo: Number(ammo) };
    if (hidden === '1') d.hidden = true;
    if (link !== undefined) d.link = Number(link);
    shooters.push(d);
    return shooters.length - 1;
  }));
  return {
    index, pictureId: t.p, title: pictureTitle(t.p), w: t.w, h: t.h, cells, hp, columns, shooters,
    slots: t.s, capacity: t.k, hard: (t.f & 1) === 1, veryHard: (t.f & 2) === 2,
  };
}
