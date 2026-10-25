import { botSolve } from '../src/game/bot';
import { buildLevel, levelParams } from '../src/game/levelgen';
const N = Number(process.argv[2] ?? 60);
const t0 = Date.now();
for (let i = 0; i < N; i++) {
  const a = Date.now();
  const l = buildLevel(i);
  const r = botSolve(l);
  const p = levelParams(i);
  console.log(`${i + 1}\t${l.pictureId}\t${l.w}x${l.h}\tcolors=${new Set(l.shooters.map((s) => s.color)).size}\tshooters=${l.shooters.length}\twon=${r.won}\tt=${r.time.toFixed(0)}s\tminFree=${r.minFree}\thard=${p.hard}\tbuild=${Date.now() - a}ms`);
}
console.log('total', Date.now() - t0, 'ms');
