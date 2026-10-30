import tuned from '../data/levels.json';
import { botSolve, winRate } from './bot';
import { Planner } from './plan';
import { SHALLOW_BEAMS, climb, fewestMoves, fitness, measure } from './trap';
import { COLOR_INDEX, PALETTE } from './palette';
import { pictureTitle } from './pictures';
import type { LevelDef, ShooterDef } from './engine';
import { PICTURE_IDS, colorsOf, loadPicture, simplify, type Picture } from './pictures';
import { rng, shuffle } from './rng';

/** Hand-picked opening: bold, instantly recognisable pictures; the rest follow in a fixed shuffle. */
const OPENING = [
  'apple', 'strawberry', 'cherries', 'watermelon', 'mushroom', 'tangerine', 'frog', 'pig_face', 'carrot', 'panda',
  'cat_face', 'burger', 'fox', 'tomato', 'penguin', 'ladybug', 'donut', 'grapes', 'car', 'smile',
  'pizza', 'lion', 'sunflower', 'heart_eyes_cat', 'rocket', 'octopus', 'trophy', 'avocado', 'tiger_face', 'house',
];

export const PICTURE_ORDER: string[] = (() => {
  const rest = PICTURE_IDS.filter((id) => !OPENING.includes(id));
  shuffle(rest, rng(1404));
  return [...OPENING.filter((id) => PICTURE_IDS.includes(id)), ...rest];
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
  /** How many of the shallow thinkers (search widths 1, 2, 4, 8) the level must beat: its "trap depth". */
  trap: number;
  /** Spare sends on top of the fewest the deep search needs. */
  slackMoves: number;
  /** Spare waiting slots on top of what the deep search needs. */
  slackSlots: number;
  /** Ammo sizes the cats are cut into; smaller = more cats = more decisions. */
  ammo?: number[];
}

/**
 * The difficulty curve. Difficulty here means "how far ahead must you think": `trap` is how many
 * of the shallow thinkers (search widths 1, 2, 4, 8) must overspend the move budget. The first
 * two levels teach, the next two are easy, then it gets serious: normal levels fool anyone who
 * just sends the cat that shoots most; every 5th level (hard) also fools a two-step lookahead and
 * has no spare moves; every 10th (very hard) fools even a wide lookahead.
 */
export function levelParams(index: number): LevelParams {
  const n = index + 1;
  const veryHard = n >= 20 && n % 10 === 0;
  const hard = veryHard || (n >= 5 && n % 5 === 0);
  const breather = n > 5 && (n - 1) % 5 === 0;
  const size = n <= 12 ? 16 : n <= 40 ? 18 : n <= 90 ? 20 : n <= 150 ? 22 : 24;
  const maxColors = n <= 2 ? 2 : n <= 5 ? 3 : n <= 12 ? 4 : n <= 30 ? 5 : n <= 60 ? 6 : 7;
  const columns = n <= 2 ? 2 : 3;
  const ramp = Math.min(1, n / 120);
  let trap: number, slackMoves: number, slackSlots: number;
  if (n <= 2) { trap = 0; slackMoves = 8; slackSlots = 3; } // learn the controls
  else if (n <= 4) { trap = 0; slackMoves = 4; slackSlots = 2; } // easy
  else if (veryHard) { trap = 4; slackMoves = 0; slackSlots = 0; } // fools even a wide lookahead
  else if (hard) { trap = n === 5 ? 1 : 3; slackMoves = n === 5 ? 2 : 1; slackSlots = n === 5 ? 1 : 0; }
  else if (breather) { trap = 1; slackMoves = 3; slackSlots = 1; }
  else { trap = n <= 9 ? 1 : 2; slackMoves = 2; slackSlots = 1; } // "send the best shooter" overspends
  return {
    size,
    maxColors: maxColors + (hard && n > 10 ? 1 : 0),
    columns,
    noise: n <= 2 ? 0.5 : 3,
    slots: 5,
    capacity: 5,
    hard,
    veryHard,
    trap,
    slackMoves,
    slackSlots,
    hidden: n >= 12 ? Math.min(0.3, 0.1 + ramp * 0.2) : 0,
    ice: n >= 25 ? Math.min(0.15, 0.04 + ramp * 0.1) : 0,
    links: n >= 40 ? Math.min(3, 1 + Math.floor(ramp * 3)) : 0,
    // smaller cats = more cats = a longer queue to plan through
    ammo: size <= 18 ? [5, 10, 10, 15] : size <= 20 ? [10, 10, 15, 20] : [10, 15, 20, 25],
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
export function pictureFor(index: number, p: LevelParams): Picture {
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

/** Quick build for levels past the shipped set: a few hill-climb steps, slots and moves from the planner. */
export function baseLevel(index: number): LevelDef {
  const p = levelParams(index);
  const pic = pictureFor(index, p);
  for (const adv of [0.6, 0.3, 0]) {
    const l = assemble(index, pic, p, p.noise, adv, index * 7919 + Math.round(adv * 1000) + 17);
    const pl = new Planner(l);
    const R = pl.requiredSlots(5, 24);
    if (R < 0) continue;
    const slots = Math.max(minSlotsFor(index), R + p.slackSlots);
    let best = l;
    if (p.trap > 0) best = climb(l, slots, p.slackMoves, p.trap, { iterations: 12, deepBeam: 16 }).level;
    const sol = new Planner(best).solve(slots, 24, true);
    if (!sol.won) continue;
    return { ...best, slots, moves: sol.moves.length + p.slackMoves };
  }
  // Last resort: ideal order, plain cats, generous slots.
  return assemble(index, pic, { ...p, hidden: 0, links: 0, ice: 0, slots: 5 }, 0, 0, index + 1);
}

export function minSlotsFor(index: number): number {
  const p = levelParams(index);
  const n = index + 1;
  return n <= 4 ? 3 : p.hard ? 1 : 2;
}

export interface TunedLevel {
  level: LevelDef;
  required: number;
  /** For search widths 1, 2, 4, 8: does that thinker fit the move budget? */
  shallowFits: boolean[];
  expertWins: boolean;
  rate: number;
  solution: number[];
}

/**
 * Build-time tuning: pick starting layouts, hill-climb the cat queue until the shallow thinkers
 * overspend the move budget (see trap.ts), then fix slots and moves from the deep search.
 */
export function tunedLevel(index: number): TunedLevel {
  const p = levelParams(index);
  const pic = pictureFor(index, p);
  const n = index + 1;
  interface Start { l: LevelDef; R: number; slots: number; fit: number }
  const starts: Start[] = [];
  const advs = n <= 2 ? [0] : [0.9, 0.6, 0.3, 0];
  const variants = p.hard ? [[p.columns, 0], [2, 1], [3, 2]] : [[p.columns, 0], [p.columns, 1]];
  for (const adv of advs) for (const [columns, k] of variants) {
    const l = assemble(index, pic, { ...p, columns }, p.noise, adv, index * 7919 + Math.round(adv * 1000) + k * 104729 + 17);
    const R = new Planner(l).requiredSlots(5, 32);
    if (R < 0) continue;
    const slots = Math.max(minSlotsFor(index), R + p.slackSlots);
    const fit = p.trap ? fitness(measure(l, slots), p.slackMoves, p.trap) : 0;
    starts.push({ l, R, slots, fit });
  }
  if (!starts.length) {
    const l = baseLevel(index);
    return { level: l, required: -1, shallowFits: [true, true, true, true], expertWins: true, rate: winRate(l, 0.55, 12), solution: [] };
  }
  starts.sort((a, b) => b.fit - a.fit);
  let best: { l: LevelDef; slots: number; R: number; fit: number } = { ...starts[0] };
  if (p.trap > 0) {
    const goal = p.trap * 2;
    // Round 1 climbs the best starts; if a level still is not fooling its thinkers (e.g. a
    // picture with one dominant colour), round 2 retries from fresh random layouts.
    for (let round = 0; round < 2 && best.fit < goal; round++) {
      const pool = round === 0 ? starts.slice(0, p.hard ? 3 : 2) : starts.slice(0, 3);
      for (const st of pool) {
        const l0 = round === 0 ? st.l : assemble(index, pic, p, p.noise * 2, 0.5, index * 5003 + st.R * 17 + 99991);
        const r = climb(l0, st.slots, p.slackMoves, p.trap, { iterations: (p.hard ? 140 : 90) * (round + 1), seed: index * 131 + st.R + round * 7 });
        if (r.fit > best.fit || best.l === starts[0].l) best = { l: r.level, slots: st.slots, R: st.R, fit: r.fit };
        if (best.fit >= goal) break;
      }
    }
  }
  // Budget: the fewest sends the deep search can find, plus the level's slack.
  const pl = new Planner(best.l);
  const lines = [pl.solve(best.slots, 96, true), pl.solve(best.slots, 96, false)].filter((r) => r.won).sort((a, b) => a.moves.length - b.moves.length);
  const solution = lines[0].moves;
  const level: LevelDef = { ...best.l, slots: best.slots, moves: solution.length + p.slackMoves };
  const fits = SHALLOW_BEAMS.map((b) => fewestMoves(level, level.slots, b) <= level.moves!);
  const expert = botSolve(level);
  return { level, required: best.R, shallowFits: fits, expertWins: expert.won, rate: winRate(level, 0.55, 12), solution };
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

interface PackedLevel { p: string; w: number; h: number; c: string; i?: string; q: string; s: number; k: number; f: number; m?: string; v?: number }
const TUNED = tuned as PackedLevel[];
export const TUNED_COUNT = TUNED.length;

/** cells as palette keys ('.' empty), ice as a 0/1 string, queue as "color,ammo,flags[,link] …|…". */
export function encodeLevel(l: LevelDef, solution?: number[]): PackedLevel {
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
  const packed: PackedLevel = { p: l.pictureId, w: l.w, h: l.h, c, i: ice, q: q2, s: l.slots, k: l.capacity, f: (l.hard ? 1 : 0) | (l.veryHard ? 2 : 0) };
  if (l.moves !== undefined) packed.v = l.moves;
  // a winning line (cat ids in decode order), used by tests and a future hint booster
  if (solution?.length) packed.m = solution.map((id) => remap.get(id)).join(',');
  return packed;
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
    ...(t.v !== undefined ? { moves: t.v } : {}),
  };
}

/** The stored winning line for a shipped level (cat ids as decoded), if any. */
export function solutionFor(index: number): number[] {
  const m = TUNED[index]?.m;
  return m ? m.split(',').map(Number) : [];
}
