/**
 * The puzzle simulation, free of any rendering so it can be tested and played by the
 * solver bot. Shooters ride a conveyor around the picture and fire at the first block
 * in each row/column they pass, but only if that block has their colour. A shooter that
 * finishes a lap with ammo left parks in a waiting slot; when no slot is free, you lose.
 */

export interface ShooterDef { color: number; ammo: number; hidden?: boolean; link?: number }

export interface LevelDef {
  index: number;
  pictureId: string;
  title: string;
  w: number;
  h: number;
  /** Palette index per cell, -1 = empty. */
  cells: number[];
  /** Hits needed per cell (0 empty, 1 normal, 2 ice). */
  hp: number[];
  /** Shooter queue, one array per column, front first. Shooter ids are their index in `shooters`. */
  columns: number[][];
  shooters: ShooterDef[];
  slots: number;
  capacity: number;
  hard: boolean;
  veryHard?: boolean;
}

export type Place = 'queue' | 'pending' | 'belt' | 'slot' | 'gone';

export interface Shooter {
  id: number;
  color: number;
  ammo: number;
  hidden: boolean;
  link: number;
  place: Place;
  /** Distance travelled along the belt this lap. */
  s: number;
  lastLane: number;
  slot: number;
}

export type GameEvent =
  | { type: 'shot'; shooter: number; cell: number; x: number; y: number; color: number; cleared: boolean }
  | { type: 'empty'; shooter: number; x: number; y: number; color: number }
  | { type: 'launch'; shooter: number }
  | { type: 'park'; shooter: number; slot: number }
  | { type: 'reject'; shooter: number }
  | { type: 'blast'; cells: number[] }
  | { type: 'won' }
  | { type: 'lost'; shooter: number };

export const BELT_MARGIN = 1.1;
const SPACING = 1.5;

export function beltLength(w: number, h: number): number {
  return 2 * (w + 2 * BELT_MARGIN) + 2 * (h + 2 * BELT_MARGIN);
}

/** Conveyor speed in cells per second: a lap takes a few seconds whatever the grid size. */
export function beltSpeed(w: number, h: number): number {
  const L = beltLength(w, h);
  return L / (3.6 + L * 0.018);
}

/** Point on the belt: the loop starts bottom-left and runs right, up, left, down. */
export function beltPoint(w: number, h: number, s: number): { x: number; y: number; edge: number } {
  const m = BELT_MARGIN;
  const bw = w + 2 * m, bh = h + 2 * m;
  if (s < bw) return { x: -m + s, y: h + m, edge: 0 };
  s -= bw;
  if (s < bh) return { x: w + m, y: h + m - s, edge: 1 };
  s -= bh;
  if (s < bw) return { x: w + m - s, y: -m, edge: 2 };
  s -= bw;
  return { x: -m, y: -m + Math.min(s, bh), edge: 3 };
}

export class Game {
  readonly level: LevelDef;
  readonly w: number;
  readonly h: number;
  cells: number[];
  hp: number[];
  shooters: Shooter[];
  columns: number[][];
  slots: number[];
  capacity: number;
  belt: number[] = [];
  pending: number[] = [];
  status: 'playing' | 'won' | 'lost' = 'playing';
  /** The shooter that had nowhere to park (kept so a revive can place it). */
  overflow = -1;
  events: GameEvent[] = [];
  time = 0;
  remaining: number;
  readonly total: number;
  readonly length: number;
  readonly speed: number;

  constructor(level: LevelDef) {
    this.level = level;
    this.w = level.w;
    this.h = level.h;
    this.cells = level.cells.slice();
    this.hp = level.hp.slice();
    this.columns = level.columns.map((c) => c.slice());
    this.shooters = level.shooters.map((d, id) => ({
      id, color: d.color, ammo: d.ammo, hidden: !!d.hidden, link: d.link ?? -1,
      place: 'queue', s: 0, lastLane: -1, slot: -1,
    }));
    this.slots = new Array(level.slots).fill(-1);
    this.capacity = level.capacity;
    this.remaining = this.hp.filter((v) => v > 0).length;
    this.total = this.remaining;
    this.length = beltLength(this.w, this.h);
    this.speed = beltSpeed(this.w, this.h);
  }

  isFront(id: number): boolean {
    return this.columns.some((c) => c[0] === id);
  }

  /** Shooters that would leave together if `id` were tapped (itself plus a linked partner). */
  group(id: number): number[] {
    const s = this.shooters[id];
    return s.link >= 0 && this.shooters[s.link].place === 'queue' ? [id, s.link] : [id];
  }

  canLaunch(id: number): boolean {
    if (this.status !== 'playing') return false;
    const s = this.shooters[id];
    if (s.place === 'slot') return this.belt.length + this.pending.length + 1 <= this.capacity;
    if (s.place !== 'queue') return false;
    const g = this.group(id);
    if (!g.every((m) => this.isFront(m))) return false;
    return this.belt.length + this.pending.length + g.length <= this.capacity;
  }

  /** Player taps a shooter at the front of a column or in a waiting slot. */
  tap(id: number): boolean {
    if (!this.canLaunch(id)) {
      this.events.push({ type: 'reject', shooter: id });
      return false;
    }
    const s = this.shooters[id];
    if (s.place === 'slot') {
      this.slots[s.slot] = -1;
      s.slot = -1;
      this.toPending(s);
    } else {
      for (const m of this.group(id)) {
        for (const c of this.columns) if (c[0] === m) c.shift();
        this.toPending(this.shooters[m]);
      }
    }
    return true;
  }

  private toPending(s: Shooter) {
    s.place = 'pending';
    s.hidden = false;
    s.s = 0;
    s.lastLane = -1;
    this.pending.push(s.id);
    this.events.push({ type: 'launch', shooter: s.id });
  }

  step(dt: number) {
    if (this.status !== 'playing') return;
    this.time += dt;
    // Let a waiting shooter onto the belt once the entry is clear.
    if (this.pending.length) {
      const blocked = this.belt.some((b) => this.shooters[b].s < SPACING);
      if (!blocked) {
        const id = this.pending.shift()!;
        const s = this.shooters[id];
        s.place = 'belt';
        s.s = 0;
        this.belt.push(id);
      }
    }
    const move = this.speed * dt;
    for (const id of this.belt.slice()) {
      const s = this.shooters[id];
      s.s += move;
      if (s.s >= this.length) {
        this.finishLap(s);
        if (this.status !== 'playing') return;
        continue;
      }
      this.tryFire(s);
      if (this.status !== 'playing') return;
    }
  }

  /** The first live cell seen from the belt at this lane, or -1. */
  private firstInLane(edge: number, lane: number): number {
    const { w, h } = this;
    if (edge === 0) { for (let y = h - 1; y >= 0; y--) if (this.hp[y * w + lane] > 0) return y * w + lane; }
    else if (edge === 1) { for (let x = w - 1; x >= 0; x--) if (this.hp[lane * w + x] > 0) return lane * w + x; }
    else if (edge === 2) { for (let y = 0; y < h; y++) if (this.hp[y * w + lane] > 0) return y * w + lane; }
    else { for (let x = 0; x < w; x++) if (this.hp[lane * w + x] > 0) return lane * w + x; }
    return -1;
  }

  private tryFire(s: Shooter) {
    const p = beltPoint(this.w, this.h, s.s);
    const along = p.edge === 0 || p.edge === 2 ? p.x : p.y;
    const span = p.edge === 0 || p.edge === 2 ? this.w : this.h;
    if (along < 0 || along >= span) return;
    const lane = Math.floor(along);
    const key = p.edge * 1000 + lane;
    if (key === s.lastLane) return;
    s.lastLane = key;
    const cell = this.firstInLane(p.edge, lane);
    if (cell < 0 || this.cells[cell] !== s.color) return;
    this.hp[cell]--;
    s.ammo--;
    const cleared = this.hp[cell] === 0;
    if (cleared) this.remaining--;
    this.events.push({ type: 'shot', shooter: s.id, cell, x: p.x, y: p.y, color: s.color, cleared });
    if (s.ammo <= 0) {
      s.place = 'gone';
      this.belt.splice(this.belt.indexOf(s.id), 1);
      this.events.push({ type: 'empty', shooter: s.id, x: p.x, y: p.y, color: s.color });
    }
    if (this.remaining === 0) {
      this.status = 'won';
      this.events.push({ type: 'won' });
    }
  }

  private finishLap(s: Shooter) {
    this.belt.splice(this.belt.indexOf(s.id), 1);
    const free = this.slots.indexOf(-1);
    if (free < 0) {
      s.place = 'gone';
      this.overflow = s.id;
      this.status = 'lost';
      this.events.push({ type: 'lost', shooter: s.id });
      return;
    }
    this.park(s, free);
  }

  private park(s: Shooter, slot: number) {
    s.place = 'slot';
    s.slot = slot;
    s.s = 0;
    s.lastLane = -1;
    this.slots[slot] = s.id;
    this.events.push({ type: 'park', shooter: s.id, slot });
  }

  /** Booster / revive: one more waiting slot. After a loss it also parks the stranded shooter. */
  addSlot() {
    this.slots.push(-1);
    if (this.status === 'lost' && this.overflow >= 0) {
      const s = this.shooters[this.overflow];
      this.overflow = -1;
      this.status = 'playing';
      this.park(s, this.slots.length - 1);
    }
  }

  /** Booster: destroy the blocks in a 3×3 square around a cell. */
  blast(cell: number) {
    if (this.status !== 'playing') return;
    const cx = cell % this.w, cy = Math.floor(cell / this.w);
    const hit: number[] = [];
    for (let y = cy - 1; y <= cy + 1; y++) for (let x = cx - 1; x <= cx + 1; x++) {
      if (x < 0 || y < 0 || x >= this.w || y >= this.h) continue;
      const i = y * this.w + x;
      if (this.hp[i] > 0) { this.hp[i] = 0; this.remaining--; hit.push(i); }
    }
    if (!hit.length) return;
    this.events.push({ type: 'blast', cells: hit });
    if (this.remaining === 0) {
      this.status = 'won';
      this.events.push({ type: 'won' });
    }
  }

  /** How many lanes currently show a block of this colour at their front (shots one lap could take). */
  exposure(color: number): number {
    let n = 0;
    for (let e = 0; e < 4; e++) {
      const span = e % 2 === 0 ? this.w : this.h;
      for (let l = 0; l < span; l++) {
        const c = this.firstInLane(e, l);
        if (c >= 0 && this.cells[c] === color) n++;
      }
    }
    return n;
  }

  progress(): number {
    return 1 - this.remaining / this.total;
  }
}
