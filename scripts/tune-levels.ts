// Build-time difficulty tuning. Usage: vite-node scripts/tune-levels.ts <from> <to> <out.json>
// (scripts/tune-all.sh runs this in parallel and writes src/data/levels.json).
import { writeFileSync } from 'node:fs';
import { encodeLevel, levelParams, tunedLevel } from '../src/game/levelgen';

const [from, to, out] = [Number(process.argv[2]), Number(process.argv[3]), process.argv[4]];
const res: unknown[] = [];
for (let i = from; i < to; i++) {
  const t0 = Date.now();
  const r = tunedLevel(i);
  res.push(encodeLevel(r.level));
  const p = levelParams(i);
  console.log(`${i + 1}\t${r.level.pictureId}\ttarget=${p.target.toFixed(2)}\trate=${r.rate.toFixed(2)}\tminFree=${r.minFree}\tslots=${r.level.slots}\tcols=${r.level.columns.length}\tcats=${r.level.shooters.length}\t${Date.now() - t0}ms`);
}
writeFileSync(out, JSON.stringify(res));
