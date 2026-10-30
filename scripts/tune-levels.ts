// Build-time difficulty tuning. Usage: vite-node scripts/tune-levels.ts <from> <to> <out.json>
// (scripts/tune-all.sh runs this in parallel and writes src/data/levels.json).
import { writeFileSync } from 'node:fs';
import { encodeLevel, levelParams, tunedLevel } from '../src/game/levelgen';

const [from, to, out] = [Number(process.argv[2]), Number(process.argv[3]), process.argv[4]];
const res: unknown[] = [];
for (let i = from; i < to; i++) {
  const t0 = Date.now();
  const r = tunedLevel(i);
  res.push(encodeLevel(r.level, r.solution));
  const p = levelParams(i);
  console.log(`${i + 1}	${r.level.pictureId}	${p.veryHard ? 'VHARD' : p.hard ? 'HARD' : 'norm'}	required=${r.required}	slots=${r.level.slots}	moves=${r.level.moves}	cats=${r.level.shooters.length}	fits=${r.shallowFits.map((f) => (f ? 1 : 0)).join('')}	expert=${r.expertWins ? 1 : 0}	casual=${r.rate.toFixed(2)}	${Date.now() - t0}ms`);
}
writeFileSync(out, JSON.stringify(res));
