// How much planning does a shipped level need? For each level, the narrowest beam search (a
// stand-in for "how many options a player keeps in their head") that still fits the move budget.
import { Planner } from '../src/game/plan';
import { buildLevel, TUNED_COUNT } from '../src/game/levelgen';

const BEAMS = [1, 2, 4, 8, 16, 96];
const from = Number(process.argv[2] ?? 0), to = Math.min(TUNED_COUNT, Number(process.argv[3] ?? 150));
const buckets = new Map<string, number[]>();
for (let i = from; i < to; i++) {
  const l = buildLevel(i);
  const p = new Planner(l);
  let need = '>96';
  for (const b of BEAMS) {
    const rs = [p.solve(l.slots, b, true), p.solve(l.slots, b, false)].filter((r) => r.won);
    if (rs.length && Math.min(...rs.map((r) => r.moves.length)) <= (l.moves ?? Infinity)) { need = String(b); break; }
  }
  const key = i < 9 ? '1-9' : i < 30 ? '10-30' : i < 60 ? '31-60' : '61+';
  const arr = buckets.get(key) ?? [];
  arr.push(need === '>96' ? 999 : Number(need));
  buckets.set(key, arr);
}
for (const [k, v] of buckets) {
  const share = (t: number) => ((v.filter((x) => x <= t).length / v.length) * 100).toFixed(0) + '%';
  console.log(`levels ${k.padEnd(6)} n=${String(v.length).padEnd(3)} solved with beam 1: ${share(1).padStart(4)}  ≤2: ${share(2).padStart(4)}  ≤4: ${share(4).padStart(4)}  ≤8: ${share(8).padStart(4)}  ≤16: ${share(16).padStart(4)}`);
}
