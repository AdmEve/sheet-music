import { BELT_MARGIN, beltSpeed, type LevelDef } from './engine';

/**
 * A fast abstract model of the game for planning: one cat at a time does a full lap, shoots the
 * first block of its colour in every lane it passes, then parks if it still has ammo. Anything a
 * planner wins here a patient player can win in the real game by sending one cat at a time.
 */
interface PState {
  hp: Uint8Array;
  remaining: number;
  colPos: number[];
  slots: number[]; // cat ids, -1 = free
  ammo: Int16Array;
}

export interface PlanResult { won: boolean; minFree: number; moves: number[] }

function laneOrder(w: number, h: number): [number, number][] {
  // [edge, lane] in the order the belt visits them (bottom → right → top → left).
  const out: [number, number][] = [];
  for (let x = 0; x < w; x++) out.push([0, x]);
  for (let y = h - 1; y >= 0; y--) out.push([1, y]);
  for (let x = w - 1; x >= 0; x--) out.push([2, x]);
  for (let y = 0; y < h; y++) out.push([3, y]);
  return out;
}

export class Planner {
  private readonly l: LevelDef;
  private readonly lanes: [number, number][];
  private readonly color: Int8Array;
  private readonly link: Int16Array;
  /** Belt distance at which each lane (in visiting order) is reached. */
  private readonly laneS: number[];
  /** How far behind the first cat its linked partner rides. */
  private readonly pairGap: number;

  constructor(level: LevelDef) {
    this.l = level;
    this.lanes = laneOrder(level.w, level.h);
    const { w, h } = level;
    const m = BELT_MARGIN, bw = w + 2 * m, bh = h + 2 * m;
    this.laneS = this.lanes.map(([edge, lane]) =>
      edge === 0 ? m + lane : edge === 1 ? bw + h + m - lane - 1 : edge === 2 ? bw + bh + w + m - lane - 1 : 2 * bw + bh + m + lane);
    // the partner enters once the first cat is 1.5 cells along (checked once per 1/60 s step)
    this.pairGap = 1.5 + beltSpeed(w, h) / 120;
    this.color = Int8Array.from(level.shooters.map((s) => s.color));
    this.link = Int16Array.from(level.shooters.map((s) => s.link ?? -1));
  }

  start(slots: number): PState {
    const l = this.l;
    return {
      hp: Uint8Array.from(l.hp),
      remaining: l.hp.filter((v) => v > 0).length,
      colPos: l.columns.map(() => 0),
      slots: new Array(slots).fill(-1),
      ammo: Int16Array.from(l.shooters.map((s) => s.ammo)),
    };
  }

  private clone(s: PState): PState {
    return { hp: s.hp.slice(), remaining: s.remaining, colPos: s.colPos.slice(), slots: s.slots.slice(), ammo: s.ammo.slice() };
  }

  private first(s: PState, edge: number, lane: number): number {
    const { w, h } = this.l;
    const hp = s.hp;
    if (edge === 0) { for (let y = h - 1; y >= 0; y--) if (hp[y * w + lane]) return y * w + lane; }
    else if (edge === 1) { for (let x = w - 1; x >= 0; x--) if (hp[lane * w + x]) return lane * w + x; }
    else if (edge === 2) { for (let y = 0; y < h; y++) if (hp[y * w + lane]) return y * w + lane; }
    else { for (let x = 0; x < w; x++) if (hp[lane * w + x]) return lane * w + x; }
    return -1;
  }

  private shoot(s: PState, id: number, laneIdx: number): boolean {
    if (s.ammo[id] <= 0) return false;
    const [edge, lane] = this.lanes[laneIdx];
    const c = this.first(s, edge, lane);
    if (c < 0 || this.l.cells[c] !== this.color[id]) return false;
    s.hp[c]--;
    if (s.hp[c] === 0) s.remaining--;
    s.ammo[id]--;
    return true;
  }

  /** One lap for cat `id`; returns shots fired. */
  private lap(s: PState, id: number): number {
    let shots = 0;
    for (let i = 0; i < this.lanes.length && s.ammo[id] > 0; i++) if (this.shoot(s, id, i)) shots++;
    return shots;
  }

  /** A linked pair rides together, the second a little behind: their shots interleave. */
  private lapPair(s: PState, a: number, b: number) {
    const ev: [number, number, number][] = [];
    for (let i = 0; i < this.lanes.length; i++) {
      ev.push([this.laneS[i], 0, i]);
      ev.push([this.laneS[i] + this.pairGap, 1, i]);
    }
    ev.sort((x, y) => x[0] - y[0] || x[1] - y[1]);
    for (const [, who, i] of ev) this.shoot(s, who ? b : a, i);
  }

  /** Cats that can be sent now: fronts of lanes (with their linked partner) and parked cats. */
  candidates(s: PState): number[] {
    const out: number[] = [];
    const fronts = new Set<number>();
    this.l.columns.forEach((col, i) => { if (s.colPos[i] < col.length) fronts.add(col[s.colPos[i]]); });
    for (const id of fronts) {
      const p = this.link[id];
      if (p >= 0 && !fronts.has(p) && s.ammo[p] > 0 && !s.slots.includes(p)) continue;
      if (p >= 0 && p < id && fronts.has(p)) continue; // the pair is listed once
      out.push(id);
    }
    for (const id of s.slots) if (id >= 0) out.push(id);
    return out;
  }

  /** Send a cat (and its linked partner). Returns the new state, or null if a cat had nowhere to park. */
  apply(s0: PState, id: number): PState | null {
    const s = this.clone(s0);
    const group = [id];
    const fromQueue = !s.slots.includes(id);
    if (fromQueue && this.link[id] >= 0) group.push(this.link[id]);
    for (const g of group) {
      const si = s.slots.indexOf(g);
      if (si >= 0) s.slots[si] = -1;
      else this.l.columns.forEach((col, i) => { if (col[s.colPos[i]] === g) s.colPos[i]++; });
    }
    if (group.length === 2) this.lapPair(s, group[0], group[1]);
    else this.lap(s, id);
    for (const g of group) {
      if (s.ammo[g] <= 0 || s.remaining === 0) continue;
      const free = s.slots.indexOf(-1);
      if (free < 0) return null;
      s.slots[free] = g;
    }
    return s;
  }

  free(s: PState): number {
    let n = 0;
    for (const v of s.slots) if (v < 0) n++;
    return n;
  }

  /** How many shots a cat would fire if sent now. */
  shotsIf(s: PState, id: number): number {
    const t = this.clone(s);
    return this.lap(t, id);
  }

  private key(s: PState): string {
    const parked = s.slots.filter((v) => v >= 0).map((v) => v * 1000 + s.ammo[v]).sort((a, b) => a - b);
    return s.colPos.join(',') + '|' + parked.join(',') + '|' + s.remaining;
  }

  /**
   * Beam search for a winning sequence using at most `slots` waiting slots. Prefers progress and
   * free slots; returns the best minimum of free slots seen along the winning line.
   */
  solve(slots: number, beam = 48): PlanResult {
    interface Node { s: PState; minFree: number; moves: number[] }
    let layer: Node[] = [{ s: this.start(slots), minFree: slots, moves: [] }];
    let best = null as Node | null;
    const total = layer[0].s.remaining;
    for (let depth = 0; depth < 400 && layer.length; depth++) {
      const next = new Map<string, Node>();
      for (const n of layer) {
        for (const id of this.candidates(n.s)) {
          const s = this.apply(n.s, id);
          if (!s) continue;
          const node = { s, minFree: Math.min(n.minFree, this.free(s)), moves: [...n.moves, id] };
          if (s.remaining === 0) {
            if (!best || node.minFree > best.minFree) best = node;
            continue;
          }
          const k = this.key(s);
          const prev = next.get(k);
          if (!prev || prev.minFree < node.minFree) next.set(k, node);
        }
      }
      if (best && best.minFree >= slots) break;
      const score = (n: Node) => (total - n.s.remaining) * 1 + this.free(n.s) * 4 + n.minFree * 6;
      layer = [...next.values()].sort((a, b) => score(b) - score(a)).slice(0, beam);
    }
    return best ? { won: true, minFree: best.minFree, moves: best.moves } : { won: false, minFree: -1, moves: [] };
  }

  /** Fewest slots the planner needs to win (up to `max`), or -1. */
  requiredSlots(max = 6, beam = 48): number {
    for (let k = 0; k <= max; k++) if (this.solve(k, beam).won) return k;
    return -1;
  }

  /**
   * A careful but short-sighted player: always sends the cat that would shoot the most right now
   * (slot cats first on ties); if nothing can shoot, sends the cat with the least ammo.
   */
  greedy(slots: number): PlanResult {
    let s = this.start(slots);
    let minFree = slots;
    const moves: number[] = [];
    for (let guard = 0; guard < 500 && s.remaining > 0; guard++) {
      const cands = this.candidates(s);
      if (!cands.length) return { won: false, minFree: -1, moves };
      let pick = -1, bestShots = 0;
      for (const id of cands) {
        const shots = this.shotsIf(s, id) + (s.slots.includes(id) ? 0.5 : 0);
        if (shots > bestShots) { bestShots = shots; pick = id; }
      }
      if (pick < 0) pick = cands.reduce((a, b) => (s.ammo[a] <= s.ammo[b] ? a : b));
      const n = this.apply(s, pick);
      moves.push(pick);
      if (!n) return { won: false, minFree: -1, moves };
      s = n;
      minFree = Math.min(minFree, this.free(s));
    }
    return { won: s.remaining === 0, minFree: s.remaining === 0 ? minFree : -1, moves };
  }
}
