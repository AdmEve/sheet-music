import { botSolve, winRate } from '../src/game/bot';
import { assemble, levelParams, PICTURE_ORDER } from '../src/game/levelgen';
import { loadPicture, simplify } from '../src/game/pictures';

const pics = ['lion', 'rocket', 'owl', 'car', 'cupcake', 'tiger'];
const configs = [
  { name: 'adv1 4c 5s', cols: 4, slots: 5, ammo: [5, 10, 10, 15], colors: 7, adv: 1, noise: 0, cap: 5 },
  { name: 'adv1 3c 5s', cols: 3, slots: 5, ammo: [5, 10, 10, 15], colors: 7, adv: 1, noise: 0, cap: 5 },
  { name: 'adv1 3c 4s', cols: 3, slots: 4, ammo: [5, 10, 10, 15], colors: 7, adv: 1, noise: 0, cap: 5 },
  { name: 'adv1 2c 5s', cols: 2, slots: 5, ammo: [5, 10, 10, 15], colors: 7, adv: 1, noise: 0, cap: 5 },
  { name: 'adv1 3c 5s big', cols: 3, slots: 5, ammo: [20, 30, 40], colors: 7, adv: 1, noise: 0, cap: 5 },
  { name: 'adv1 3c 4s cap3', cols: 3, slots: 4, ammo: [5, 10, 10, 15], colors: 7, adv: 1, noise: 0, cap: 3 },
  { name: 'adv.7n6 3c 4s', cols: 3, slots: 4, ammo: [5, 10, 10, 15], colors: 7, adv: 0.7, noise: 6, cap: 5 },
  { name: 'adv.7n6 3c 3s', cols: 3, slots: 3, ammo: [5, 10, 10, 15], colors: 7, adv: 0.7, noise: 6, cap: 5 },
];
void PICTURE_ORDER;
for (const c of configs) {
  let wr = 0, solv = 0, cats = 0, n = 0;
  for (const id of pics) {
    const p = { ...levelParams(60), columns: c.cols, slots: c.slots, ammo: c.ammo, hidden: 0, ice: 0, links: 0, capacity: c.cap };
    const pic = simplify(loadPicture(id, 20), c.colors);
    for (let seed = 0; seed < 3; seed++) {
      const l = assemble(60, pic, p, c.noise, c.adv, seed * 31 + 7);
      wr += winRate(l, 0.55, 10);
      solv += botSolve(l).won ? 1 : 0;
      cats += l.shooters.length;
      n++;
    }
  }
  console.log(c.name.padEnd(26), 'winrate', (wr / n).toFixed(2), 'greedy-solvable', (solv / n).toFixed(2), 'cats', (cats / n).toFixed(1));
}
