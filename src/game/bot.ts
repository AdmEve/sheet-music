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

export function botSolve(level: LevelDef, maxTime = 900): { won: boolean; time: number; minFree: number } {
  const g = new Game(level);
  const dt = 1 / 30;
  let cooldown = 0;
  let minFree = level.slots;
  while (g.status === 'playing' && g.time < maxTime) {
    cooldown -= dt;
    if (cooldown <= 0) {
      const pick = botPick(g);
      if (pick >= 0) { g.tap(pick); cooldown = 0.25; }
      else if (!g.belt.length && !g.pending.length) {
        // Stuck with an empty belt: force a move, as a human would.
        const any = [...g.slots.filter((s) => s >= 0), ...g.columns.filter((c) => c.length).map((c) => c[0])].find((id) => g.canLaunch(id));
        if (any === undefined) break;
        g.tap(any);
      }
    }
    g.step(dt);
    g.events.length = 0;
    minFree = Math.min(minFree, g.slots.filter((s) => s < 0).length);
  }
  return { won: g.status === 'won', time: g.time, minFree };
}
