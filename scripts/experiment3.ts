import { botSolve, winRate } from '../src/game/bot';
import { assemble, levelParams } from '../src/game/levelgen';
import { loadPicture, simplify } from '../src/game/pictures';
import { tuneLevel } from '../src/game/search';
const pics = ['lion', 'rocket', 'owl', 'car', 'cupcake', 'tiger', 'parrot', 'house'];
const cfgs = [
  { name: '4c5s col6 small', cols: 4, slots: 5, colors: 6, ammo: [5, 10, 10, 15] },
  { name: '3c5s col8 small', cols: 3, slots: 5, colors: 8, ammo: [5, 10, 10, 15] },
  { name: '3c5s col8 mid', cols: 3, slots: 5, colors: 8, ammo: [10, 15, 20, 25] },
  { name: '3c4s col8 mid', cols: 3, slots: 4, colors: 8, ammo: [10, 15, 20, 25] },
  { name: '2c5s col8 mid', cols: 2, slots: 5, colors: 8, ammo: [10, 15, 20, 25] },
  { name: '2c4s col8 mid', cols: 2, slots: 4, colors: 8, ammo: [10, 15, 20, 25] },
];
const doSearch = process.argv[2] === 'search';
for (const c of cfgs) {
  let rate = 0, mf = 0, solv = 0, cats = 0, colors = 0;
  for (const id of pics) {
    const p = { ...levelParams(60), columns: c.cols, slots: c.slots, ammo: c.ammo, hidden: 0, ice: 0, links: 0, capacity: 5 };
    const pic = simplify(loadPicture(id, 20), c.colors);
    let l = assemble(60, pic, p, 3, 0.4, 11);
    if (doSearch) l = tuneLevel(l, 0.3, { iterations: 60 }).level;
    const b = botSolve(l);
    solv += b.won ? 1 : 0; mf += b.minFree; rate += winRate(l, 0.55, 12); cats += l.shooters.length;
    colors += new Set(l.shooters.map((s) => s.color)).size;
  }
  const n = pics.length;
  console.log(c.name.padEnd(18), 'rate', (rate / n).toFixed(2), 'solvable', (solv / n).toFixed(2), 'greedyMinFree', (mf / n).toFixed(1), 'cats', (cats / n).toFixed(1), 'colors', (colors / n).toFixed(1));
}
