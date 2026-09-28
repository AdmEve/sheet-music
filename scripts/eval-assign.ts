// Scores instrument-labelled notes against ground truth JSON (from make_test_audio.py).
// Usage: npx vite-node scripts/eval-assign.ts analysis.json truth.json
import { readFileSync } from 'node:fs';
import { assignInstruments, bowedScore, DEFAULT_ASSIGN } from '../src/engine/assign';
import type { LabeledNote } from '../src/engine/types';

const [an, truth] = process.argv.slice(2);
const a = JSON.parse(readFileSync(an, 'utf8'));
const gt: { instrument: string; pitch: number; start: number; end: number }[] = JSON.parse(readFileSync(truth, 'utf8')).notes;
const out: LabeledNote[] = assignInstruments(a.notes, DEFAULT_ASSIGN, a.pianoNotes);
for (const ins of ['piano', 'cello']) {
  const g = gt.filter((x) => x.instrument === ins);
  const d = out.filter((x) => x.instrument === ins);
  const tol = ins === 'piano' ? 0.08 : 0.2;
  const used = new Set<number>();
  let tp = 0;
  const fp: string[] = [];
  for (const n of d) {
    const k = g.findIndex((x, i) => !used.has(i) && x.pitch === n.pitch && Math.abs(x.start - n.start) < tol);
    if (k >= 0) {
      used.add(k);
      tp++;
    } else fp.push(`${n.pitch}@${n.start.toFixed(2)}(${bowedScore(n).toFixed(2)})`);
  }
  const P = tp / Math.max(1, d.length);
  const R = tp / Math.max(1, g.length);
  console.log(`${ins}: truth ${g.length} detected ${d.length} correct ${tp}  precision ${(P * 100).toFixed(0)}% recall ${(R * 100).toFixed(0)}% F1 ${((200 * P * R) / Math.max(1e-9, P + R)).toFixed(0)}%`);
  console.log('   wrong:', fp.join(' '));
  console.log('   missed:', g.filter((_, i) => !used.has(i)).map((x) => `${x.pitch}@${x.start.toFixed(2)}`).join(' '));
}
