import { winRate } from '../src/game/bot';
import { buildLevel, levelParams } from '../src/game/levelgen';
const N = Number(process.argv[2] ?? 60);
const rows: string[] = [];
let sum = 0;
for (let i = 0; i < N; i++) {
  const l = buildLevel(i);
  const lo = winRate(l, 0.3), mid = winRate(l, 0.55), hi = winRate(l, 0.85);
  sum += mid;
  rows.push(`${i + 1}\t${l.pictureId}\t${l.w}\tslots=${l.slots}\tcols=${l.columns.length}\tcolors=${new Set(l.shooters.map((s) => s.color)).size}\tn=${l.shooters.length}\thard=${levelParams(i).hard ? 'H' : ''}\tlow=${lo.toFixed(2)}\tmid=${mid.toFixed(2)}\thigh=${hi.toFixed(2)}`);
}
console.log(rows.join('\n'));
console.log('avg mid', (sum / N).toFixed(2));
