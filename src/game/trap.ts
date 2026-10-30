import type { LevelDef } from './engine';
import { Planner } from './plan';
import { rng } from './rng';

/**
 * "Trap" search. A level is hard in the way that matters when the obvious plays waste moves:
 * a player who looks one or two steps ahead needs more sends than the budget, and only
 * someone who plans deep enough fits. This measures that and hill-climbs the cat queue to
 * widen the gap, keeping the level solvable by the deep search.
 */
export const SHALLOW_BEAMS = [1, 2, 4, 8];

export function fewestMoves(l: LevelDef, slots: number, beam: number): number {
  const p = new Planner(l);
  const rs = [p.solve(slots, beam, true), p.solve(slots, beam, false)].filter((r) => r.won).map((r) => r.moves.length);
  return rs.length ? Math.min(...rs) : Infinity;
}

export interface Measure {
  deep: number; // fewest sends the deep search found
  shallow: number[]; // fewest sends per shallow beam (Infinity = no win)
}

export function measure(l: LevelDef, slots: number, deepBeam = 32): Measure {
  return { deep: fewestMoves(l, slots, deepBeam), shallow: SHALLOW_BEAMS.map((b) => fewestMoves(l, slots, b)) };
}

/** How many extra sends each shallow thinker needs, capped; unsolved counts as `cap`. */
export function gaps(m: Measure, cap = 8): number[] {
  return m.shallow.map((s) => (Number.isFinite(s) ? Math.min(cap, s - m.deep) : cap));
}

/**
 * Fitness for a level that must fool the first `depth` shallow thinkers: each one counts by how
 * far it overspends the budget (capped at 3 sends); unsolved counts as the cap. Wider thinkers
 * beyond `depth` add a little, so the climb keeps pushing past the goal.
 */
export function fitness(m: Measure, slack: number, depth: number): number {
  if (!Number.isFinite(m.deep)) return -Infinity;
  const over = gaps(m).map((g) => Math.min(3, Math.max(0, g - slack)));
  return over.reduce((acc, o, i) => acc + (i < depth ? o : 0.25 * o), 0);
}

function mutate(l: LevelDef, rand: () => number): LevelDef {
  const columns = l.columns.map((c) => c.slice());
  const pick = () => {
    const c = Math.floor(rand() * columns.length);
    if (!columns[c].length) return null;
    // front of the queue matters most for the opening, but traps live all along the queue
    const d = Math.floor(Math.pow(rand(), 1.2) * columns[c].length);
    return [c, d] as const;
  };
  const a = pick(), b = pick();
  if (!a || !b) return l;
  if (rand() < 0.7) {
    const t = columns[a[0]][a[1]];
    columns[a[0]][a[1]] = columns[b[0]][b[1]];
    columns[b[0]][b[1]] = t;
  } else {
    const col = columns[a[0]];
    const [id] = col.splice(a[1], 1);
    col.splice(Math.min(col.length, b[1]), 0, id);
  }
  // linked cats only work side by side at the same depth: drop links that no longer do
  const shooters = l.shooters.map((s) => ({ ...s }));
  const pos = (id: number): [number, number] => {
    for (let c = 0; c < columns.length; c++) { const d = columns[c].indexOf(id); if (d >= 0) return [c, d]; }
    return [-9, -9];
  };
  shooters.forEach((s, id) => {
    if (s.link === undefined) return;
    const [c1, d1] = pos(id), [c2, d2] = pos(s.link);
    if (d1 !== d2 || Math.abs(c1 - c2) !== 1) { shooters[s.link].link = undefined; s.link = undefined; }
  });
  return { ...l, columns, shooters };
}

export interface ClimbResult { level: LevelDef; measure: Measure; fit: number; evals: number }

export function climb(start: LevelDef, slots: number, slack: number, depth: number, opts: { iterations?: number; seed?: number; deepBeam?: number } = {}): ClimbResult {
  const rand = rng(opts.seed ?? start.index * 97 + 3);
  const deepBeam = opts.deepBeam ?? 32;
  let best = start;
  let bm = measure(best, slots, deepBeam);
  let bf = fitness(bm, slack, depth);
  let evals = 1;
  const goal = depth * 2.5;
  for (let i = 0; i < (opts.iterations ?? 60) && bf < goal; i++) {
    let cand = mutate(best, rand);
    if (rand() < 0.35) cand = mutate(cand, rand);
    if (cand === best) continue;
    const m = measure(cand, slots, deepBeam);
    evals++;
    const f = fitness(m, slack, depth);
    if (f >= bf) { best = cand; bm = m; bf = f; }
  }
  return { level: best, measure: bm, fit: bf, evals };
}
