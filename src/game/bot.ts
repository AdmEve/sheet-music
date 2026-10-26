import { Game, type LevelDef } from './engine';

/**
 * A simple greedy player used to prove every generated level can be beaten. It only uses
 * what a player can see: the shooters at the front of each column and in the slots.
 */
export function botPick(g: Game): number {
  const free = g.slots.filter((s) => s < 0).length;
  const inFlight = g.belt.length + g.pending.length;
  if (inFlight >= g.capacity) return -1;
  // Shots the shooters already on the belt will take, per colour.
  const claimed = new Map<number, number>();
  for (const id of [...g.belt, ...g.pending]) {
    const s = g.shooters[id];
    claimed.set(s.color, (claimed.get(s.color) ?? 0) + s.ammo);
  }
  const candidates: number[] = [];
  for (const id of g.slots) if (id >= 0) candidates.push(id);
  for (const c of g.columns) if (c.length && g.canLaunch(c[0])) candidates.push(c[0]);
  let best = -1, bestScore = 0;
  for (const id of candidates) {
    if (!g.canLaunch(id)) continue;
    const s = g.shooters[id];
    const useful = g.exposure(s.color) - (claimed.get(s.color) ?? 0);
    if (useful <= 0) continue;
    // Prefer freeing a slot, then shooters that would empty themselves this lap.
    const score = useful + (s.place === 'slot' ? 4 : 0) + (s.ammo <= useful ? 3 : 0);
    if (score > bestScore) { bestScore = score; best = id; }
  }
  if (best >= 0) return best;
  // Nothing useful: send a queue shooter only if it is safe for it to come back and park.
  if (free > inFlight) {
    for (const c of g.columns) if (c.length && g.canLaunch(c[0])) return c[0];
  }
  return -1;
}

export function botSolve(level: LevelDef, maxTime = 900): { won: boolean; time: number; minFree: number; taps: number } {
  const g = new Game(level);
  const dt = 1 / 30;
  let cooldown = 0;
  let minFree = level.slots;
  let taps = 0;
  while (g.status === 'playing' && g.time < maxTime) {
    cooldown -= dt;
    if (cooldown <= 0) {
      const pick = botPick(g);
      if (pick >= 0) { if (g.tap(pick)) taps++; cooldown = 0.25; }
      else if (!g.belt.length && !g.pending.length) {
        // Stuck with an empty belt: force a move, as a human would.
        const any = [...g.slots.filter((s) => s >= 0), ...g.columns.filter((c) => c.length).map((c) => c[0])].find((id) => g.canLaunch(id));
        if (any === undefined) break;
        if (g.tap(any)) taps++;
      }
    }
    g.step(dt);
    g.events.length = 0;
    minFree = Math.min(minFree, g.slots.filter((s) => s < 0).length);
  }
  return { won: g.status === 'won', time: g.time, minFree, taps };
}

/**
 * A rough model of a casual human: slower, only sees *whether* a colour is on the outside of
 * the picture (not how many blocks), often forgets what the cats already on the belt will take,
 * and sometimes just taps a cat. `skill` 0..1.
 */
export function humanPick(g: Game, rand: () => number, skill: number): number {
  const inFlight = g.belt.length + g.pending.length;
  if (inFlight >= g.capacity) return -1;
  const candidates: number[] = [];
  for (const id of g.slots) if (id >= 0 && g.canLaunch(id)) candidates.push(id);
  for (const c of g.columns) if (c.length && g.canLaunch(c[0])) candidates.push(c[0]);
  if (!candidates.length) return -1;
  // A careless tap.
  if (rand() < (1 - skill) * 0.3) return candidates[Math.floor(rand() * candidates.length)];
  const careful = rand() < skill;
  const claimed = new Map<number, number>();
  if (careful) for (const id of [...g.belt, ...g.pending]) {
    const s = g.shooters[id];
    claimed.set(s.color, (claimed.get(s.color) ?? 0) + s.ammo);
  }
  // Careful players check the colour is really reachable; hasty ones only that it is on the board.
  const looksUseful = (color: number) => careful
    ? g.exposure(color) - (claimed.get(color) ?? 0) > 0
    : g.exposure(color) > 0 || (rand() < 0.5 && g.cells.some((c, i) => c === color && g.hp[i] > 0));
  const useful = candidates.filter((id) => looksUseful(g.shooters[id].color));
  if (useful.length) {
    // Skilled players pick the best one; others pick any cat whose colour is visible.
    if (rand() < skill) return botPick(g) >= 0 ? botPick(g) : useful[0];
    return useful[Math.floor(rand() * useful.length)];
  }
  // Nothing useful: an impatient player still sends something when the belt is empty.
  if (!inFlight && rand() < 1 - skill * 0.6) {
    const q = candidates.filter((id) => g.shooters[id].place === 'queue');
    const pool = q.length ? q : candidates;
    return pool[Math.floor(rand() * pool.length)];
  }
  return -1;
}

export function humanPlay(level: LevelDef, skill: number, seed: number, maxTime = 900): { won: boolean; minFree: number } {
  const g = new Game(level);
  let minFree = level.slots;
  const rand = mulberry(seed);
  const dt = 1 / 30;
  let wait = 0.6;
  let stuck = 0;
  while (g.status === 'playing' && g.time < maxTime) {
    wait -= dt;
    if (wait <= 0) {
      const pick = humanPick(g, rand, skill);
      if (pick >= 0) { g.tap(pick); wait = 0.35 + rand() * 0.5; stuck = 0; }
      else {
        wait = 0.2;
        if (!g.belt.length && !g.pending.length && ++stuck > 3) {
          const any = [...g.slots.filter((s) => s >= 0), ...g.columns.filter((c) => c.length).map((c) => c[0])].find((id) => g.canLaunch(id));
          if (any === undefined) break;
          g.tap(any);
        }
      }
    }
    g.step(dt);
    g.events.length = 0;
    let free = 0;
    for (const v of g.slots) if (v < 0) free++;
    if (free < minFree) minFree = free;
  }
  return { won: g.status === 'won', minFree: g.status === 'won' ? minFree : -1 };
}

/** Share of `runs` simulated casual players who beat the level. */
export function winRate(level: LevelDef, skill = 0.5, runs = 12): number {
  return playStats(level, skill, runs).rate;
}

/**
 * Win rate plus `danger`: 0 = players never came close to filling the slots, 1 = every player
 * lost or used the last slot. Gives the difficulty search a slope even when everyone wins.
 */
export function playStats(level: LevelDef, skill = 0.55, runs = 12): { rate: number; danger: number } {
  let wins = 0, danger = 0;
  for (let r = 0; r < runs; r++) {
    const res = humanPlay(level, skill, level.index * 1000 + r * 7 + 1);
    if (res.won) wins++;
    danger += res.won ? 1 - res.minFree / level.slots : 1;
  }
  return { rate: wins / runs, danger: danger / runs };
}

function mulberry(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
