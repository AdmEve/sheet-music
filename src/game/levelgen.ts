import { botSolve } from './bot';
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
}

export function levelParams(index: number): LevelParams {
  const n = index + 1;
  const hard = n >= 5 && n % 5 === 0;
  const size = n <= 5 ? 12 : n <= 12 ? 14 : n <= 25 ? 16 : n <= 45 ? 18 : n <= 80 ? 20 : n <= 130 ? 22 : 24;
  const maxColors = n <= 2 ? 2 : n <= 6 ? 3 : n <= 15 ? 4 : n <= 35 ? 5 : n <= 70 ? 6 : 7;
  const columns = n <= 3 ? 2 : n <= 20 ? 3 : 4;
  // How far the shooter order strays from the ideal peeling order (in layers).
  const ramp = Math.min(1, n / 120);
  const noise = (n <= 3 ? 0.5 : 2 + ramp * 10) * (hard ? 1.6 : 1);
  return {
    size, maxColors: maxColors + (hard && n > 10 ? 1 : 0), columns, noise,
    slots: hard && n > 20 ? 3 : n > 60 ? 4 : 5,
    capacity: hard && n > 30 ? 4 : 5,
    hard,
    hidden: n >= 12 ? Math.min(0.35, 0.1 + ramp * 0.25) : 0,
    ice: n >= 25 ? Math.min(0.15, 0.04 + ramp * 0.1) : 0,
    links: n >= 40 ? Math.min(4, 1 + Math.floor(ramp * 4)) : 0,
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

function chunkSizes(total: number, size: number, rand: () => number): number[] {
  const options = size <= 12 ? [5, 10, 10] : size <= 16 ? [10, 15, 20, 25] : size <= 20 ? [10, 20, 30, 40] : [20, 30, 40, 50];
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

function acceptable(id: string, p: LevelParams, index: number): Picture | null {
  const pic = simplify(loadPicture(id, p.size), p.maxColors);
  const filled = pic.cells.filter((c) => c >= 0).length;
  const minColors = index < 6 ? 2 : Math.min(p.maxColors, 3);
  return colorsOf(pic).length >= minColors && filled >= pic.w * pic.h * 0.25 ? pic : null;
}

/** Which picture each level shows: walk the order, never repeating within a cycle. */
const assigned: string[] = [];
function pictureFor(index: number, p: LevelParams): Picture {
  while (assigned.length <= index) {
    const i = assigned.length;
    const cycle = Math.floor(i / PICTURE_ORDER.length);
    const used = new Set(assigned.slice(cycle * PICTURE_ORDER.length));
    const q = levelParams(i);
    let pick = PICTURE_ORDER.find((id) => !used.has(id) && acceptable(id, q, i));
    if (!pick) pick = PICTURE_ORDER.find((id) => !used.has(id)) ?? PICTURE_ORDER[i % PICTURE_ORDER.length];
    assigned.push(pick);
  }
  return acceptable(assigned[index], p, index) ?? simplify(loadPicture(assigned[index], p.size), p.maxColors);
}

/**
 * `adv` bends the shooter order: 0 = in peeling order (easy), 1 = reversed, so the shooters
 * at the front are the ones needed last and must be parked (hard).
 */
function assemble(index: number, pic: Picture, p: LevelParams, noise: number, adv: number, seed: number): LevelDef {
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
    for (const ammo of chunkSizes(hits.length, p.size, rand)) {
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
    slots: p.slots, capacity: p.capacity, hard: p.hard,
  };
}

const cache = new Map<number, LevelDef>();

/**
 * Build level `index` (0-based). Each try is checked by the solver bot; if the bot cannot
 * win with some slack, the shooter order is made gentler until it can.
 */
export function buildLevel(index: number): LevelDef {
  const hit = cache.get(index);
  if (hit) return hit;
  const p = levelParams(index);
  const pic = pictureFor(index, p);
  let level: LevelDef | null = null;
  // Hardest first: keep the first order the bot still beats with the slack this level allows.
  const n = index + 1;
  // [order bend, noise scale] from cruel to gentle.
  const tries: [number, number][] = [[0.9, 1], [0.75, 1], [0.6, 1], [0.5, 1], [0.4, 1], [0.3, 1], [0.2, 1], [0.1, 1], [0, 1], [0, 0.5], [0, 0]];
  const start = Math.max(0, Math.round((1 - Math.min(1, n / 60)) * 6) - (p.hard ? 2 : 0));
  const slack = p.hard ? (n < 30 ? 1 : 0) : n < 10 ? 3 : n < 40 ? 2 : 1;
  for (let t = start; t < tries.length; t++) {
    const [adv, ns] = tries[t];
    const candidate = assemble(index, pic, p, p.noise * ns, adv, index * 7919 + t * 104729 + 17);
    const r = botSolve(candidate);
    if (r.won && (r.minFree >= slack || t === tries.length - 1)) { level = candidate; break; }
  }
  if (!level) {
    // Last resort: ideal order and plain shooters, one extra slot.
    level = assemble(index, pic, { ...p, hidden: 0, links: 0, ice: 0, slots: p.slots + 1 }, 0, 0, index + 1);
  }
  cache.set(index, level);
  return level;
}
