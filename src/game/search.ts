import { botSolve, playStats } from './bot';
import type { LevelDef } from './engine';
import { rng } from './rng';

/**
 * Hill-climb the cat queue of a level towards a target difficulty. Difficulty is measured by
 * simulated casual players (win rate) and by how close the careful solver comes to running out
 * of slots. Every accepted layout must still be beaten by the careful solver.
 */
export interface SearchResult { level: LevelDef; rate: number; minFree: number; evals: number }

function score(l: LevelDef, target: number, runs: number): { s: number; rate: number; minFree: number; ok: boolean } {
  const solved = botSolve(l);
  if (!solved.won) return { s: Infinity, rate: 0, minFree: 0, ok: false };
  const { rate, danger } = playStats(l, 0.55, runs);
  // Above the target, prefer layouts that bring players closer to filling the slots.
  const s = Math.abs(rate - target) + (rate > target ? (1 - danger) * 0.25 : 0);
  return { s, rate, minFree: solved.minFree, ok: true };
}

function mutate(l: LevelDef, rand: () => number): LevelDef {
  const columns = l.columns.map((c) => c.slice());
  const pick = () => {
    const c = Math.floor(rand() * columns.length);
    if (!columns[c].length) return null;
    // Bias towards the front of the queue, where layout matters most.
    const d = Math.min(columns[c].length - 1, Math.floor(Math.pow(rand(), 1.6) * columns[c].length));
    return [c, d] as const;
  };
  const a = pick(), b = pick();
  if (!a || !b) return l;
  const kind = rand();
  if (kind < 0.6) {
    // swap two cats
    const t = columns[a[0]][a[1]];
    columns[a[0]][a[1]] = columns[b[0]][b[1]];
    columns[b[0]][b[1]] = t;
  } else {
    // move a cat forward/back within its own lane (lane sizes never change)
    const col = columns[a[0]];
    const [id] = col.splice(a[1], 1);
    col.splice(Math.min(col.length, b[1]), 0, id);
  }
  // Links only make sense side by side at the same depth: drop any that broke.
  const shooters = l.shooters.map((s) => ({ ...s }));
  for (const s of shooters) if (s.link !== undefined) {
    const pos = (id: number) => { for (let c = 0; c < columns.length; c++) { const d = columns[c].indexOf(id); if (d >= 0) return [c, d]; } return [-9, -9]; };
    const me = shooters.indexOf(s);
    const [c1, d1] = pos(me), [c2, d2] = pos(s.link);
    if (d1 !== d2 || Math.abs(c1 - c2) !== 1) { shooters[s.link].link = undefined; s.link = undefined; }
  }
  return { ...l, columns, shooters };
}

export function tuneLevel(start: LevelDef, target: number, opts: { iterations?: number; runs?: number; seed?: number } = {}): SearchResult {
  const iterations = opts.iterations ?? 80;
  const runs = opts.runs ?? 10;
  const rand = rng(opts.seed ?? start.index * 31 + 5);
  let best = start;
  let bs = score(best, target, runs);
  let evals = 1;
  for (let i = 0; i < iterations && Math.abs(bs.rate - target) > 0.05; i++) {
    let cand = mutate(best, rand);
    if (rand() < 0.4) cand = mutate(cand, rand);
    const cs = score(cand, target, runs);
    evals++;
    if (cs.ok && cs.s <= bs.s) { best = cand; bs = cs; }
  }
  return { level: best, rate: bs.rate, minFree: bs.minFree, evals };
}
