// Balance check: a greedy bot plays the real rules and reports, per place, how many
// generator taps (energy) and orders it took. Usage: npx tsx scripts/simulate.ts [games]

import { CHAINS, GENERATOR_CHAINS, Item, canMerge, isGenerator, maxLevel, sameItem } from '../src/game/items';
import { CELLS, GameState, deliver, drop, ensureGenerators, findForOrder, needsMet, newGame, sell, tap, tickBubbles } from '../src/game/model';
import { completeNextTask, progress } from '../src/game/progress';
import { PLACES } from '../src/story/story';

const GAMES = Number(process.argv[2] ?? 20);

function neededFor(s: GameState): Item[] {
  return s.orders.flatMap((o) => o.needs);
}

/** One bot action; returns false when stuck. */
function step(s: GameState, now: number): boolean {
  // 1. deliver anything ready
  for (const o of s.orders) if (findForOrder(s, o)) { deliver(s, o.id); return true; }
  // 2. collect coins/energy/chests
  for (let i = 0; i < CELLS; i++) {
    const c = s.board[i];
    if (c.item && !c.lock && (CHAINS[c.item.chain].collectible || c.item.chain === 'chest')) { tap(s, i, now); return true; }
  }
  // 3. merge: prefer pairs that progress toward a needed item; never merge needed items away
  const needs = neededFor(s);
  const isNeeded = (it: Item) => needs.some((n) => sameItem(n, it));
  // Top-level items are never ordered: sell them like a player clearing the board would.
  for (let i = 0; i < CELLS; i++) {
    const c = s.board[i];
    if (c.item && !c.lock && !isGenerator(c.item) && !CHAINS[c.item.chain].collectible && c.item.chain !== 'chest' && c.item.level === maxLevel(c.item.chain)) { sell(s, i); return true; }
  }
  const free: number[] = [];
  for (let i = 0; i < CELLS; i++) if (s.board[i].item && s.board[i].lock !== 'box' && s.board[i].lock !== 'bubble') free.push(i);
  let best: [number, number, number] | null = null;
  for (const a of free) for (const b of free) {
    if (a === b) continue;
    const A = s.board[a], B = s.board[b];
    if (A.lock) continue;
    if (!canMerge(A.item!, B.item!)) continue;
    if (isNeeded(A.item!) && !B.lock) {
      const it0 = A.item!;
      const have = s.board.filter((c) => !c.lock && c.item && sameItem(c.item, it0)).length;
      const want = needs.filter((n) => sameItem(n, it0)).length;
      if (have - 2 < want) continue;
    }
    const it = A.item!;
    const useful = needs.some((n) => n.chain === it.chain && n.level > it.level) ? 10 : 0;
    const score = useful + (B.lock ? 5 : 0) + (isGenerator(it) ? 3 : 0) - it.level * 0.1;
    if (!best || score > best[2]) best = [a, b, score];
  }
  const empty = s.board.filter((c) => !c.item && !c.lock).length;
  if (best && (best[2] >= 3 || empty < 8)) { const ev = drop(s, best[0], best[1]); if (process.env.SIMDEBUG) console.log('merge', best, JSON.stringify(ev)); return true; }
  // 4. tap the generator for a chain whose needed item is still missing from the board
  // What the board still lacks, counting each need (two of an item need two on the board).
  const missing = s.orders.flatMap((o) => { const met = needsMet(s, o); return o.needs.filter((_, k) => !met[k]); });
  const wanted = new Map<string, number>();
  for (const n of missing) wanted.set(n.chain, (wanted.get(n.chain) ?? 0) + 1);
  const gens = free.filter((i) => !s.board[i].lock && s.board[i].item && GENERATOR_CHAINS.includes(s.board[i].item!.chain));
  const want = (i: number) => wanted.get(CHAINS[s.board[i].item!.chain].produces!) ?? 0;
  gens.sort((x, y) => want(y) - want(x) || s.board[y].item!.level - s.board[x].item!.level);
  if (gens.length && s.energy > 0) {
    const ev = tap(s, gens[0], now);
    if (ev[0]?.type === 'spawn') return true;
    if (ev[0]?.type === 'fail' && ev[0].reason === 'boardFull') {
      // sell the lowest unneeded item
      let cand = -1;
      for (const i of free) {
        const it = s.board[i].item!;
        if (s.board[i].lock || isGenerator(it) || isNeeded(it)) continue;
        if (cand < 0 || it.level < s.board[cand].item!.level) cand = i;
      }
      if (cand >= 0) { if (process.env.SIMDEBUG) console.log('sell', JSON.stringify(s.board[cand].item)); sell(s, cand); return true; }
    }
  }
  if (best) { drop(s, best[0], best[1]); return true; }
  return false;
}

const perPlace: { energy: number; orders: number; hours: number }[][] = PLACES.map(() => []);
for (let g = 0; g < GAMES; g++) {
  let now = 0;
  const s = newGame(1000 + g, now);
  let energyUsed = 0, placeStart = { taps: 0, orders: 0, time: 0 };
  let idx = 0;
  for (let it = 0; it < 800000 && idx < PLACES.length; it++) {
    tickBubbles(s, now);
    const before = s.energy;
    const acted = step(s, now);
    now += 4_000; // a few seconds per action, so bubbles expire like in real play
    if (s.energy < before) energyUsed += before - s.energy;
    // buy tasks as soon as affordable
    let r = completeNextTask(s);
    while (r.ok) {
      if (r.placeFinished) {
        perPlace[idx].push({ energy: s.stats.taps - placeStart.taps, orders: s.stats.orders - placeStart.orders, hours: (now - placeStart.time) / 3.6e6 });
        placeStart = { taps: s.stats.taps, orders: s.stats.orders, time: now };
        idx++;
        ensureGenerators(s); // a new season brings its generator, as in the game
      }
      r = completeNextTask(s);
    }
    if (!acted || s.energy <= 0) {
      // wait for energy (simulated clock); regen 1 per 2 minutes
      now += 120_000;
      s.energy = Math.min(100, s.energy + 1);
    }
  }
  if (g === 0 && process.env.SIMDEBUG) { for (let r = 0; r < 9; r++) console.log(s.board.slice(r * 7, r * 7 + 7).map((c) => c.item ? (c.lock ? c.lock[0] : '') + c.item.chain.slice(0, 5) + c.item.level : '.').join(' ')); console.log('orders', JSON.stringify(s.orders.map((o) => o.needs)), 'bag', JSON.stringify(s.bag), 'energy', s.energy, 'level', s.level); }
  if (g === 0) console.log(`game 0: level ${s.level}, coins ${s.coins}, gems ${s.gems}, progress ${progress(s).placeIndex}/${PLACES.length}`);
}
console.log('note: energy = generator taps; hours = waiting for regen when the bot runs dry (no purchases)');
const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length);
PLACES.forEach((p, k) => {
  const rows = perPlace[k];
  console.log(`${p.id.padEnd(9)} stars ${String(p.tasks.reduce((a, t) => a + t.cost, 0)).padStart(3)} | energy ${avg(rows.map((r) => r.energy)).toFixed(0).padStart(5)} | orders ${avg(rows.map((r) => r.orders)).toFixed(1).padStart(5)} | hours(no-pay, start full) ${avg(rows.map((r) => r.hours)).toFixed(1)} | finished ${rows.length}/${GAMES}`);
});
