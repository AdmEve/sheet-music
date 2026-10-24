// The whole game state and every rule that changes it. No DOM here: the UI calls these
// functions and animates the events they return. Everything is plain JSON so it can be
// saved as-is.

import {
  CHAINS, ChainId, GENERATOR_CHAINS, Item, PRODUCT_CHAINS, canMerge, collectAmount, isGenerator,
  itemValue, maxLevel, sameItem, spawnWeights,
} from './items';

export const COLS = 7;
export const ROWS = 9;
export const CELLS = COLS * ROWS;
export const ENERGY_CAP = 100;
export const ENERGY_REGEN_MS = 120_000;
export const MAX_ORDERS = 3;

/** box: closed crate, contents hidden; opens (becomes `sheet`) when a merge happens next to it.
 *  sheet: item visible under a dust sheet; merge an identical item onto it to free it. */
export type Lock = 'box' | 'sheet' | 'bubble';

export interface Cell {
  item: Item | null;
  lock?: Lock;
  /** For bubbles: time (ms) when it floats away. */
  until?: number;
}

export const BUBBLE_MS = 60_000;
export const BUBBLE_CHANCE = 0.08;
export const BUBBLE_MIN_LEVEL = 4;

export interface Need extends Item {}

export interface Order {
  id: number;
  who: string;
  needs: Need[];
  coins: number;
  stars: number;
}

export interface GameState {
  v: 1;
  board: Cell[];
  energy: number;
  /** Time (ms) from which the next energy point is counting. */
  energyAt: number;
  coins: number;
  gems: number;
  stars: number;
  xp: number;
  level: number;
  orders: Order[];
  nextOrderId: number;
  /** Index into the scripted opening orders; after that orders are generated. */
  scriptStep: number;
  rng: number;
  /** Items parked off the board. */
  bag: (Item | null)[];
  tasksDone: string[];
  storySeen: string[];
  lastDaily: string | null;
  dailyStreak: number;
  stats: { merges: number; orders: number; taps: number };
  /** Rewarded videos watched today (capped). */
  ads: { day: string; count: number };
  /** One-time shop offers already bought. */
  bought: string[];
  /** Today's daily quests. */
  quests: QuestDay;
  /** Last time (ms) the UI told the model; used for bubble expiry. */
  clock: number;
  /** Coin-shop energy purchases today (price rises with each). */
  coinEnergy: { day: string; count: number };
}

export type GameEvent =
  | { type: 'spawn'; from: number; to: number; item: Item }
  | { type: 'merge'; at: number; item: Item; from: number }
  | { type: 'move'; from: number; to: number }
  | { type: 'swap'; a: number; b: number }
  | { type: 'unlock'; at: number }
  | { type: 'bubble'; at: number; item: Item }
  | { type: 'bubblePop'; at: number }
  | { type: 'boxOpen'; at: number }
  | { type: 'collect'; at: number; kind: 'coins' | 'energy'; amount: number }
  | { type: 'chest'; at: number; spawned: { to: number; item: Item }[] }
  | { type: 'sell'; at: number; coins: number }
  | { type: 'deliver'; order: Order; cells: number[] }
  | { type: 'levelUp'; level: number; gems: number; gift: Item | null }
  | { type: 'newOrder'; order: Order }
  | { type: 'fail'; reason: FailReason };

export type FailReason = 'noEnergy' | 'boardFull' | 'locked' | 'missing' | 'notEnoughStars' | 'notEnoughGems' | 'bagFull';

// ---------------------------------------------------------------------------- helpers

const idx = (r: number, c: number) => r * COLS + c;
export const rowOf = (i: number) => Math.floor(i / COLS);
export const colOf = (i: number) => i % COLS;

function rand(s: GameState): number {
  // mulberry32 step stored in the state so a save reproduces exactly.
  s.rng = (s.rng + 0x6d2b79f5) >>> 0;
  let t = s.rng;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function pick<T>(s: GameState, items: T[]): T {
  return items[Math.floor(rand(s) * items.length)];
}

function weighted(s: GameState, weights: number[]): number {
  let x = rand(s);
  for (let i = 0; i < weights.length; i++) {
    x -= weights[i];
    if (x <= 0) return i;
  }
  return weights.length - 1;
}

export function neighbours(i: number): number[] {
  const r = rowOf(i), c = colOf(i);
  const out: number[] = [];
  if (r > 0) out.push(idx(r - 1, c));
  if (r < ROWS - 1) out.push(idx(r + 1, c));
  if (c > 0) out.push(idx(r, c - 1));
  if (c < COLS - 1) out.push(idx(r, c + 1));
  return out;
}

/** Empty cells ordered by distance from `from` (ties broken by board order). */
export function nearestEmpty(s: GameState, from: number): number | null {
  let best: number | null = null;
  let bestD = Infinity;
  for (let i = 0; i < CELLS; i++) {
    const cell = s.board[i];
    if (cell.item || cell.lock) continue;
    const d = Math.hypot(rowOf(i) - rowOf(from), colOf(i) - colOf(from));
    if (d < bestD) { bestD = d; best = i; }
  }
  return best;
}

export const XP_LEVELS = [0, 6, 18, 36, 62, 96, 140, 195, 260, 340, 430, 540, 660, 800, 960];
export function xpForLevel(level: number): number {
  return level - 1 < XP_LEVELS.length ? XP_LEVELS[level - 1] : XP_LEVELS[XP_LEVELS.length - 1] + (level - XP_LEVELS.length) * 180;
}

// ---------------------------------------------------------------------------- new game

/** Starting board: generators near the bottom, a few starter items, the top rows hidden
 *  under crates and dust sheets that open up as the player merges. */
export function newGame(seed: number, now: number): GameState {
  const s: GameState = {
    v: 1,
    board: Array.from({ length: CELLS }, () => ({ item: null })),
    energy: ENERGY_CAP,
    energyAt: now,
    coins: 50,
    gems: 15,
    stars: 0,
    xp: 0,
    level: 1,
    orders: [],
    nextOrderId: 1,
    scriptStep: 0,
    rng: seed >>> 0,
    bag: [null, null, null, null],
    tasksDone: [],
    storySeen: [],
    lastDaily: null,
    dailyStreak: 0,
    stats: { merges: 0, orders: 0, taps: 0 },
    ads: { day: '', count: 0 },
    bought: [],
    coinEnergy: { day: '', count: 0 },
    clock: now,
    quests: { day: '', list: [], bonusClaimed: false },
  };
  const put = (r: number, c: number, item: Item, lock?: Lock) => {
    s.board[idx(r, c)] = lock ? { item, lock } : { item };
  };
  // Generators.
  put(7, 3, { chain: 'genTea', level: 1 });
  put(7, 1, { chain: 'genBread', level: 1 });
  // A few loose starter items so the first merge is one drag away.
  put(6, 3, { chain: 'tea', level: 1 });
  put(6, 4, { chain: 'tea', level: 1 });
  put(8, 5, { chain: 'coins', level: 1 });
  // Upper part of the board: dust sheets near the open area, crates further up. Merging next
  // to a crate opens it into a sheet, so the board reveals itself as the player plays.
  const sheetRows: Item[][] = [
    [{ chain: 'bread', level: 1 }, { chain: 'tea', level: 3 }, { chain: 'coins', level: 1 }, { chain: 'tea', level: 2 }, { chain: 'energy', level: 1 }, { chain: 'bread', level: 3 }, { chain: 'tea', level: 1 }],
    [{ chain: 'tea', level: 2 }, { chain: 'bread', level: 1 }, { chain: 'tea', level: 1 }, { chain: 'bread', level: 2 }, { chain: 'tea', level: 3 }, { chain: 'bread', level: 1 }, { chain: 'tea', level: 2 }],
  ];
  sheetRows.forEach((row, k) => row.forEach((item, c) => put(3 + k, c, item, 'sheet')));
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < COLS; c++) {
      const roll = rand(s);
      const item: Item =
        roll < 0.1 ? { chain: 'chest', level: 1 } :
        roll < 0.17 ? { chain: 'energy', level: 1 } :
        roll < 0.24 ? { chain: 'coins', level: r === 0 ? 2 : 1 } :
        { chain: pick(s, ['tea', 'bread', 'tea', 'bread', 'garden'] as ChainId[]), level: 1 + Math.floor(rand(s) * (r === 0 ? 4 : 3)) };
      put(r, c, item, 'box');
    }
  }
  // Garden generator waits in a crate near the top for level 2.
  put(0, 3, { chain: 'genGarden', level: 1 }, 'box');
  fillOrders(s);
  return s;
}

// ---------------------------------------------------------------------------- energy / daily

export function tickEnergy(s: GameState, now: number): void {
  if (s.energy >= ENERGY_CAP) {
    s.energyAt = now;
    return;
  }
  const gained = Math.floor((now - s.energyAt) / ENERGY_REGEN_MS);
  if (gained <= 0) return;
  s.energy = Math.min(ENERGY_CAP, s.energy + gained);
  s.energyAt = s.energy >= ENERGY_CAP ? now : s.energyAt + gained * ENERGY_REGEN_MS;
}

export function msToNextEnergy(s: GameState, now: number): number {
  if (s.energy >= ENERGY_CAP) return 0;
  return Math.max(0, ENERGY_REGEN_MS - (now - s.energyAt));
}

export function addEnergy(s: GameState, amount: number): void {
  // Energy from rewards may go over the cap, like in most merge games.
  s.energy += amount;
}

export const DAILY_REWARDS = [
  { coins: 25, energy: 0, gems: 0 },
  { coins: 0, energy: 20, gems: 0 },
  { coins: 50, energy: 0, gems: 0 },
  { coins: 0, energy: 30, gems: 0 },
  { coins: 75, energy: 0, gems: 0 },
  { coins: 0, energy: 40, gems: 0 },
  { coins: 100, energy: 50, gems: 10 },
];

/** `today` is a local date string (YYYY-MM-DD). Returns the reward index claimed, or null. */
export function claimDaily(s: GameState, today: string, yesterday: string): number | null {
  if (s.lastDaily === today) return null;
  s.dailyStreak = s.lastDaily === yesterday ? (s.dailyStreak % DAILY_REWARDS.length) + 1 : 1;
  s.lastDaily = today;
  const r = DAILY_REWARDS[s.dailyStreak - 1];
  s.coins += r.coins;
  s.gems += r.gems;
  addEnergy(s, r.energy);
  return s.dailyStreak - 1;
}

// ---------------------------------------------------------------------------- board actions

/** Tap on a board cell: generators produce, collectibles pay out, chests open. */
export function tap(s: GameState, at: number, now: number): GameEvent[] {
  const cell = s.board[at];
  if (!cell.item) return [];
  if (cell.lock) return [{ type: 'fail', reason: 'locked' }];
  const it = cell.item;
  const def = CHAINS[it.chain];

  if (def.collectible) {
    const amount = collectAmount(it);
    if (def.collectible === 'coins') s.coins += amount;
    else addEnergy(s, amount);
    cell.item = null;
    return [{ type: 'collect', at, kind: def.collectible, amount }];
  }

  if (it.chain === 'chest') {
    const count = [3, 5, 7][it.level - 1];
    cell.item = null;
    const spawned: { to: number; item: Item }[] = [];
    for (let k = 0; k < count; k++) {
      const to = k === 0 ? at : nearestEmpty(s, at);
      if (to === null) break;
      const item = chestDrop(s, it.level);
      s.board[to] = { item };
      spawned.push({ to, item });
    }
    return [{ type: 'chest', at, spawned }];
  }

  if (def.produces) {
    tickEnergy(s, now);
    if (s.energy <= 0) return [{ type: 'fail', reason: 'noEnergy' }];
    const to = nearestEmpty(s, at);
    if (to === null) return [{ type: 'fail', reason: 'boardFull' }];
    if (s.energy === ENERGY_CAP) s.energyAt = now;
    s.energy--;
    s.stats.taps++;
    const level = 1 + weighted(s, spawnWeights(it.level));
    const item: Item = { chain: def.produces, level: Math.min(level, maxLevel(def.produces)) };
    s.board[to] = { item };
    return [{ type: 'spawn', from: at, to, item }];
  }
  return [];
}

function chestDrop(s: GameState, chestLevel: number): Item {
  const roll = rand(s);
  if (roll < 0.15) return { chain: 'energy', level: chestLevel >= 3 ? 2 : 1 };
  if (roll < 0.3) return { chain: 'coins', level: Math.min(3, chestLevel) };
  const chains = unlockedProducts(s);
  return { chain: pick(s, chains), level: 1 + Math.floor(rand(s) * (1 + chestLevel)) };
}

/** Product chains the player can currently produce (has a generator for, on board or bag). */
export function unlockedProducts(s: GameState): ChainId[] {
  const out = new Set<ChainId>();
  const consider = (it: Item | null | undefined) => {
    if (it && CHAINS[it.chain].produces) out.add(CHAINS[it.chain].produces!);
  };
  for (const c of s.board) if (!c.lock) consider(c.item);
  for (const b of s.bag) consider(b);
  if (out.size === 0) out.add('tea');
  return [...out];
}

/** Drag the item at `from` onto cell `to`. */
export function drop(s: GameState, from: number, to: number): GameEvent[] {
  if (from === to) return [];
  const a = s.board[from];
  const b = s.board[to];
  if (!a.item || a.lock) return [];
  if (b.lock === 'box' || b.lock === 'bubble') return [{ type: 'fail', reason: 'locked' }];

  if (b.item && canMerge(a.item, b.item)) {
    const wasSheet = b.lock === 'sheet';
    const item: Item = { chain: a.item.chain, level: a.item.level + 1 };
    s.board[to] = { item };
    s.board[from] = { item: null };
    s.stats.merges++;
    const events: GameEvent[] = [];
    if (wasSheet) events.push({ type: 'unlock', at: to });
    events.push({ type: 'merge', at: to, item, from });
    events.push(...openBoxesAround(s, to));
    if (item.level >= BUBBLE_MIN_LEVEL && !CHAINS[item.chain].collectible && rand(s) < BUBBLE_CHANCE) {
      const at = nearestEmpty(s, to);
      if (at !== null) {
        s.board[at] = { item: { ...item }, lock: 'bubble', until: s.clock + BUBBLE_MS };
        events.push({ type: 'bubble', at, item: { ...item } });
      }
    }
    return events;
  }
  if (b.lock === 'sheet') return [{ type: 'fail', reason: 'locked' }];
  if (!b.item) {
    s.board[to] = a;
    s.board[from] = { item: null };
    return [{ type: 'move', from, to }];
  }
  s.board[to] = a;
  s.board[from] = b;
  return [{ type: 'swap', a: from, b: to }];
}

function openBoxesAround(s: GameState, at: number): GameEvent[] {
  const out: GameEvent[] = [];
  for (const n of neighbours(at)) {
    if (s.board[n].lock === 'box') {
      s.board[n].lock = 'sheet';
      out.push({ type: 'boxOpen', at: n });
    }
  }
  return out;
}

export function sellValue(it: Item): number {
  return isGenerator(it) ? 0 : Math.max(1, Math.round(itemValue(it) / 2));
}

export function sell(s: GameState, at: number): GameEvent[] {
  const cell = s.board[at];
  if (!cell.item || cell.lock || isGenerator(cell.item)) return [];
  const coins = sellValue(cell.item);
  s.coins += coins;
  cell.item = null;
  return [{ type: 'sell', at, coins }];
}

/** Pop a dust sheet with gems (cost grows with the hidden item's value). */
export function sheetGemCost(it: Item): number {
  return Math.max(2, Math.ceil(itemValue(it) / 3));
}

export function buySheet(s: GameState, at: number): GameEvent[] {
  const cell = s.board[at];
  if (cell.lock !== 'sheet' || !cell.item) return [];
  const cost = sheetGemCost(cell.item);
  if (s.gems < cost) return [{ type: 'fail', reason: 'notEnoughGems' }];
  s.gems -= cost;
  delete cell.lock;
  return [{ type: 'unlock', at }];
}

// ---------------------------------------------------------------------------- bag

export function toBag(s: GameState, at: number): GameEvent[] {
  const cell = s.board[at];
  if (!cell.item || cell.lock) return [];
  const slot = s.bag.indexOf(null);
  if (slot < 0) return [{ type: 'fail', reason: 'bagFull' }];
  s.bag[slot] = cell.item;
  cell.item = null;
  return [];
}

export function fromBag(s: GameState, slot: number): GameEvent[] {
  const it = s.bag[slot];
  if (!it) return [];
  const to = nearestEmpty(s, idx(ROWS - 1, Math.floor(COLS / 2)));
  if (to === null) return [{ type: 'fail', reason: 'boardFull' }];
  s.board[to] = { item: it };
  s.bag[slot] = null;
  return [{ type: 'spawn', from: to, to, item: it }];
}

export const BAG_MAX = 10;
export const bagSlotCost = (s: GameState) => 10 + (s.bag.length - 4) * 10;

export function buyBagSlot(s: GameState): boolean {
  if (s.bag.length >= BAG_MAX) return false;
  const cost = bagSlotCost(s);
  if (s.gems < cost) return false;
  s.gems -= cost;
  s.bag.push(null);
  return true;
}

// ---------------------------------------------------------------------------- orders

/** Cells holding free (unlocked, non-generator) items matching each need, or null. */
export function findForOrder(s: GameState, order: Order): number[] | null {
  const used = new Set<number>();
  for (const need of order.needs) {
    let found = -1;
    for (let i = 0; i < CELLS; i++) {
      const c = s.board[i];
      if (used.has(i) || c.lock || !c.item) continue;
      if (sameItem(c.item, need)) { found = i; break; }
    }
    if (found < 0) return null;
    used.add(found);
  }
  return [...used];
}

export function needsMet(s: GameState, order: Order): boolean[] {
  const used = new Set<number>();
  return order.needs.map((need) => {
    for (let i = 0; i < CELLS; i++) {
      const c = s.board[i];
      if (used.has(i) || c.lock || !c.item) continue;
      if (sameItem(c.item, need)) { used.add(i); return true; }
    }
    return false;
  });
}

export function deliver(s: GameState, orderId: number): GameEvent[] {
  const order = s.orders.find((o) => o.id === orderId);
  if (!order) return [];
  const cells = findForOrder(s, order);
  if (!cells) return [{ type: 'fail', reason: 'missing' }];
  for (const i of cells) s.board[i] = { item: null };
  s.coins += order.coins;
  s.stars += order.stars;
  s.stats.orders++;
  s.orders = s.orders.filter((o) => o.id !== orderId);
  const events: GameEvent[] = [{ type: 'deliver', order, cells }];
  events.push(...gainXp(s, order.stars));
  for (const o of fillOrders(s)) events.push({ type: 'newOrder', order: o });
  return events;
}

function gainXp(s: GameState, xp: number): GameEvent[] {
  s.xp += xp;
  const events: GameEvent[] = [];
  while (s.xp >= xpForLevel(s.level + 1)) {
    s.level++;
    const gems = 5 + s.level;
    s.gems += gems;
    addEnergy(s, 20);
    const gift = levelGift(s.level);
    if (gift) {
      const to = nearestEmpty(s, idx(ROWS - 1, Math.floor(COLS / 2)));
      if (to !== null) s.board[to] = { item: gift };
      else {
        const slot = s.bag.indexOf(null);
        if (slot >= 0) s.bag[slot] = gift;
        else s.bag.push(gift);
      }
    }
    events.push({ type: 'levelUp', level: s.level, gems, gift });
  }
  return events;
}

/** New generators arrive as level-up gifts; every few levels a chest. */
function levelGift(level: number): Item | null {
  for (const g of GENERATOR_CHAINS) if (CHAINS[g].unlockLevel === level && level > 1) return { chain: g, level: 1 };
  return level % 3 === 0 ? { chain: 'chest', level: level >= 9 ? 2 : 1 } : null;
}

/** Hand-written first orders so the opening teaches the loop. */
const SCRIPTED: { who: string; needs: Need[]; stars?: number }[] = [
  { who: 'narges', needs: [{ chain: 'tea', level: 2 }], stars: 1 },
  { who: 'mahin', needs: [{ chain: 'tea', level: 3 }], stars: 2 },
  { who: 'reza', needs: [{ chain: 'bread', level: 2 }], stars: 2 },
  { who: 'mahin', needs: [{ chain: 'tea', level: 4 }], stars: 3 },
  { who: 'reza', needs: [{ chain: 'bread', level: 3 }, { chain: 'tea', level: 2 }], stars: 3 },
  { who: 'shirin', needs: [{ chain: 'tea', level: 4 }, { chain: 'bread', level: 3 }], stars: 4 },
];

const CUSTOMERS = ['mahin', 'reza', 'shirin', 'morteza', 'golab', 'kaveh', 'narges'];

function makeOrder(s: GameState, who: string, needs: Need[], stars?: number): Order {
  const value = needs.reduce((sum, n) => sum + itemValue(n), 0);
  return {
    id: s.nextOrderId++,
    who,
    needs,
    coins: Math.round(value * 1.6 + 4),
    stars: stars ?? Math.max(1, Math.round(value / 5)),
  };
}

function generateOrder(s: GameState): Order {
  const chains = unlockedProducts(s);
  const busy = new Set(s.orders.map((o) => o.who));
  const free = CUSTOMERS.filter((c) => !busy.has(c));
  const who = pick(s, free.length ? free : CUSTOMERS);
  const count = s.level < 3 ? 1 : rand(s) < 0.45 ? 2 : 1;
  const needs: Need[] = [];
  for (let k = 0; k < count; k++) {
    const chain = pick(s, chains);
    // Target level grows slowly with player level and stays inside the chain.
    const top = Math.min(maxLevel(chain), 3 + Math.floor(s.level / 2));
    const low = Math.max(2, top - 3);
    needs.push({ chain, level: low + Math.floor(rand(s) * (top - low + 1)) });
  }
  return makeOrder(s, who, needs);
}

export function fillOrders(s: GameState): Order[] {
  const added: Order[] = [];
  while (s.orders.length < MAX_ORDERS) {
    let o: Order;
    if (s.scriptStep < SCRIPTED.length) {
      const step = SCRIPTED[s.scriptStep++];
      o = makeOrder(s, step.who, step.needs, step.stars);
    } else {
      o = generateOrder(s);
    }
    s.orders.push(o);
    added.push(o);
  }
  return added;
}

export function allProductChains(): ChainId[] {
  return PRODUCT_CHAINS;
}

/** Parses a save, filling fields added in later versions. Returns null if unusable. */
export function loadState(json: string | null): GameState | null {
  if (!json) return null;
  try {
    const raw = JSON.parse(json) as Partial<GameState>;
    if (raw.v !== 1 || !Array.isArray(raw.board) || raw.board.length !== CELLS) return null;
    const base = newGame(raw.rng ?? 1, raw.energyAt ?? Date.now());
    return { ...base, ...raw, stats: { ...base.stats, ...raw.stats }, ads: raw.ads ?? base.ads, bought: raw.bought ?? [], coinEnergy: raw.coinEnergy ?? base.coinEnergy, clock: raw.clock ?? base.clock, quests: raw.quests ?? base.quests } as GameState;
  } catch {
    return null;
  }
}

export function adsLeft(s: GameState, today: string, max: number): number {
  if (s.ads.day !== today) return max;
  return Math.max(0, max - s.ads.count);
}

export function countAd(s: GameState, today: string): void {
  if (s.ads.day !== today) s.ads = { day: today, count: 0 };
  s.ads.count++;
}

// ---------------------------------------------------------------------------- coin shop

export const COIN_CHEST_PRICE = 150;
export const COIN_ENERGY_AMOUNT = 25;
export const COIN_ENERGY_MAX_PER_DAY = 4;

export function coinEnergyPrice(s: GameState, today: string): number {
  const n = s.coinEnergy.day === today ? s.coinEnergy.count : 0;
  return 100 * 2 ** n;
}

export function coinEnergyLeft(s: GameState, today: string): number {
  return COIN_ENERGY_MAX_PER_DAY - (s.coinEnergy.day === today ? s.coinEnergy.count : 0);
}

export function buyEnergyWithCoins(s: GameState, today: string): boolean {
  if (coinEnergyLeft(s, today) <= 0) return false;
  const price = coinEnergyPrice(s, today);
  if (s.coins < price) return false;
  s.coins -= price;
  if (s.coinEnergy.day !== today) s.coinEnergy = { day: today, count: 0 };
  s.coinEnergy.count++;
  addEnergy(s, COIN_ENERGY_AMOUNT);
  return true;
}

export function buyChestWithCoins(s: GameState): boolean {
  if (s.coins < COIN_CHEST_PRICE) return false;
  s.coins -= COIN_CHEST_PRICE;
  return true;
}

// ---------------------------------------------------------------------------- bubbles

/** Advances the clock; bubbles past their time float away. Returns the cells cleared. */
export function tickBubbles(s: GameState, now: number): number[] {
  s.clock = now;
  const gone: number[] = [];
  s.board.forEach((c, i) => {
    if (c.lock === 'bubble' && (c.until ?? 0) <= now) {
      s.board[i] = { item: null };
      gone.push(i);
    }
  });
  return gone;
}

export const bubbleGemCost = (it: Item) => Math.max(3, Math.ceil(itemValue(it) / 2));

/** Frees a bubble, paid with gems (`free` when a rewarded video was watched). */
export function popBubble(s: GameState, at: number, free = false): GameEvent[] {
  const c = s.board[at];
  if (c.lock !== 'bubble' || !c.item) return [];
  if (!free) {
    const cost = bubbleGemCost(c.item);
    if (s.gems < cost) return [{ type: 'fail', reason: 'notEnoughGems' }];
    s.gems -= cost;
  }
  s.board[at] = { item: c.item };
  return [{ type: 'bubblePop', at }];
}

// ---------------------------------------------------------------------------- daily quests

export type QuestKind = 'merges' | 'orders' | 'taps';

export interface Quest {
  kind: QuestKind;
  target: number;
  /** Stat value when the quest was handed out. */
  start: number;
  reward: { coins?: number; energy?: number; gems?: number };
  claimed: boolean;
}

export interface QuestDay {
  day: string;
  list: Quest[];
  bonusClaimed: boolean;
}

/** Hands out today's quests if the day changed. Returns true when new quests were made. */
export function refreshQuests(s: GameState, today: string): boolean {
  if (s.quests.day === today) return false;
  const L = s.level;
  s.quests = {
    day: today,
    bonusClaimed: false,
    list: [
      { kind: 'merges', target: 15 + L * 3, start: s.stats.merges, reward: { coins: 40 + L * 10 }, claimed: false },
      { kind: 'orders', target: 4 + Math.floor(L / 2), start: s.stats.orders, reward: { energy: 20 }, claimed: false },
      { kind: 'taps', target: 30 + L * 5, start: s.stats.taps, reward: { gems: 5 }, claimed: false },
    ],
  };
  return true;
}

export const questProgress = (s: GameState, q: Quest) => Math.min(q.target, s.stats[q.kind] - q.start);
export const questDone = (s: GameState, q: Quest) => questProgress(s, q) >= q.target;
export const questsClaimable = (s: GameState) =>
  s.quests.list.filter((q) => !q.claimed && questDone(s, q)).length +
  (allQuestsClaimed(s) && !s.quests.bonusClaimed ? 1 : 0);
export const allQuestsClaimed = (s: GameState) => s.quests.list.length > 0 && s.quests.list.every((q) => q.claimed);

export function claimQuest(s: GameState, index: number): boolean {
  const q = s.quests.list[index];
  if (!q || q.claimed || !questDone(s, q)) return false;
  q.claimed = true;
  s.coins += q.reward.coins ?? 0;
  s.gems += q.reward.gems ?? 0;
  addEnergy(s, q.reward.energy ?? 0);
  return true;
}

/** Bonus for finishing all three: a copper chest. Returns the chest item to place. */
export function claimQuestBonus(s: GameState): Item | null {
  if (!allQuestsClaimed(s) || s.quests.bonusClaimed) return null;
  s.quests.bonusClaimed = true;
  return { chain: 'chest', level: 2 };
}
