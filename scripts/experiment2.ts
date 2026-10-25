import { tuneLevel } from '../src/game/search';
import { assemble, levelParams } from '../src/game/levelgen';
import { loadPicture, simplify } from '../src/game/pictures';
const pics = ['lion', 'rocket', 'owl', 'car', 'cupcake', 'tiger'];
for (const [cols, slots] of [[4, 5], [3, 5], [3, 4]]) {
  for (const target of [0.6, 0.35]) {
    const t0 = Date.now();
    let sum = 0, mf = 0;
    for (const id of pics) {
      const p = { ...levelParams(60), columns: cols, slots, ammo: [5, 10, 10, 15], hidden: 0, ice: 0, links: 0, capacity: 5 };
      const l = assemble(60, simplify(loadPicture(id, 20), 6), p, 2, 0.3, 11);
      const r = tuneLevel(l, target, { iterations: 120 });
      sum += r.rate; mf += r.minFree;
    }
    console.log(`cols=${cols} slots=${slots} target=${target} -> rate ${(sum / pics.length).toFixed(2)} greedyMinFree ${(mf / pics.length).toFixed(1)}  ${(Date.now() - t0) / pics.length | 0}ms/level`);
  }
}
