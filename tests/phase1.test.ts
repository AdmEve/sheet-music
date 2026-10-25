import { describe, expect, it } from 'vitest';
import {
  CHAIN_BONUS_GEMS, chainKey, claimAllCodex, claimCodex, codexClaimable, codexReward, discover,
} from '../src/game/codex';
import { CELLS, ENERGY_CAP, GameState, REFILL_PRICES, buyRefill, findHint, loadState, newGame, refillPrice } from '../src/game/model';
import { maxLevel } from '../src/game/items';

const T0 = 1_700_000_000_000;

function emptyGame(): GameState {
  const s = newGame(7, T0);
  s.board = Array.from({ length: CELLS }, () => ({ item: null }));
  s.orders = [];
  s.found = [];
  s.codexClaimed = [];
  return s;
}

describe('collection album', () => {
  it('a new game already knows its starting items', () => {
    const s = newGame(1, T0);
    expect(s.found).toContain('tea:1');
    expect(s.found).toContain('genTea:1');
    // Hidden crate contents are not discovered yet.
    expect(s.found).not.toContain('genGarden:1');
  });

  it('discovers owned items once, ignoring locked cells', () => {
    const s = emptyGame();
    s.board[0] = { item: { chain: 'tea', level: 4 } };
    s.board[1] = { item: { chain: 'tea', level: 4 } };
    s.board[2] = { item: { chain: 'bread', level: 2 }, lock: 'sheet' };
    s.bag[0] = { chain: 'garden', level: 1 };
    expect(discover(s).map((i) => `${i.chain}:${i.level}`)).toEqual(['tea:4', 'garden:1']);
    expect(discover(s)).toEqual([]);
  });

  it('pays each card once and the chain bonus when a chain is complete', () => {
    const s = emptyGame();
    s.found = ['tea:1', 'tea:5'];
    const gems = s.gems, coins = s.coins;
    expect(claimCodex(s, 'tea:1')).toEqual({ coins: 5 });
    expect(claimCodex(s, 'tea:1')).toBeNull();
    expect(claimCodex(s, 'tea:2')).toBeNull(); // not found
    expect(claimCodex(s, 'tea:5')).toEqual(codexReward({ chain: 'tea', level: 5 }));
    expect(s.coins).toBe(coins + 5);
    expect(s.gems).toBe(gems + 1);
    expect(claimCodex(s, chainKey('tea'))).toBeNull();
    for (let l = 1; l <= maxLevel('tea'); l++) if (!s.found.includes(`tea:${l}`)) s.found.push(`tea:${l}`);
    expect(codexClaimable(s)).toBe(maxLevel('tea') - 2 + 1);
    const total = claimAllCodex(s);
    expect(total.gems).toBeGreaterThanOrEqual(CHAIN_BONUS_GEMS);
    expect(codexClaimable(s)).toBe(0);
  });

  it('old saves get the album from what they hold, with rewards waiting', () => {
    const old = newGame(3, T0) as Partial<GameState>;
    delete old.found;
    delete old.codexClaimed;
    delete old.refills;
    const s = loadState(JSON.stringify(old))!;
    expect(s.found).toContain('tea:1');
    expect(s.codexClaimed).toEqual([]);
    expect(s.refills).toEqual({ day: '', count: 0 });
  });
});

describe('gem energy refill', () => {
  it('starts cheap and gets dearer each time the same day', () => {
    const s = emptyGame();
    s.gems = 1000;
    s.energy = 0;
    expect(refillPrice(s, 'd1')).toBe(REFILL_PRICES[0]);
    expect(buyRefill(s, 'd1')).toBe(true);
    expect(s.energy).toBe(ENERGY_CAP);
    expect(refillPrice(s, 'd1')).toBe(REFILL_PRICES[1]);
    for (let k = 0; k < 10; k++) buyRefill(s, 'd1');
    expect(refillPrice(s, 'd1')).toBe(REFILL_PRICES[REFILL_PRICES.length - 1]);
    expect(refillPrice(s, 'd2')).toBe(REFILL_PRICES[0]);
    s.gems = 0;
    expect(buyRefill(s, 'd2')).toBe(false);
  });
});

describe('merge hint', () => {
  it('prefers a merge an order needs, then a dust sheet, then the lowest level', () => {
    const s = emptyGame();
    expect(findHint(s)).toBeNull();
    s.board[0] = { item: { chain: 'tea', level: 1 } };
    s.board[1] = { item: { chain: 'tea', level: 1 } };
    s.board[2] = { item: { chain: 'bread', level: 3 } };
    s.board[3] = { item: { chain: 'bread', level: 3 } };
    expect(findHint(s)).toEqual([0, 1]);
    s.board[10] = { item: { chain: 'bread', level: 3 }, lock: 'sheet' };
    expect(findHint(s)?.[1]).toBe(10);
    s.orders = [{ id: 1, who: 'mahin', needs: [{ chain: 'tea', level: 2 }], coins: 1, stars: 1 }];
    expect(findHint(s)).toEqual([0, 1]);
  });

  it('never suggests crates, bubbles or max-level items', () => {
    const s = emptyGame();
    s.board[0] = { item: { chain: 'tea', level: 1 } };
    s.board[1] = { item: { chain: 'tea', level: 1 }, lock: 'box' };
    s.board[2] = { item: { chain: 'tea', level: 1 }, lock: 'bubble', until: T0 + 1000 };
    s.board[3] = { item: { chain: 'tea', level: maxLevel('tea') } };
    s.board[4] = { item: { chain: 'tea', level: maxLevel('tea') } };
    expect(findHint(s)).toBeNull();
  });
});

describe('generator catch-up', () => {
  it('hands early generators by level and season ones when the story reaches their season', async () => {
    const { ensureGenerators } = await import('../src/game/model');
    const { PLACES } = await import('../src/story/story');
    const s = newGame(2, 0);
    s.level = 21;
    const given = ensureGenerators(s).map((i) => i.chain);
    expect(given).toContain('genSweets');
    expect(given).not.toContain('genPost'); // its season has not started yet
    expect(given).not.toContain('genGarden'); // still in its crate on the board
    expect(ensureGenerators(s)).toEqual([]);
    const finish = (n: number) => { s.tasksDone = PLACES.slice(0, n).flatMap((p) => p.tasks.map((t) => t.id)); };
    finish(10);
    expect(ensureGenerators(s).map((i) => i.chain)).toEqual(['genPost']);
    s.level = 99; // level alone never brings a season's generator
    expect(ensureGenerators(s)).toEqual([]);
    finish(20);
    expect(ensureGenerators(s).map((i) => i.chain)).toEqual(['genBaby', 'genLamp']);
    finish(50);
    expect(ensureGenerators(s).map((i) => i.chain)).toEqual(['genSaz', 'genTile', 'genFootball', 'genSea', 'genCraft', 'genCallig']);
    finish(55);
    expect(ensureGenerators(s).map((i) => i.chain)).toEqual(['genParty']);
    finish(60);
    expect(ensureGenerators(s).map((i) => i.chain)).toEqual(['genWed']);
    finish(65);
    expect(ensureGenerators(s).map((i) => i.chain)).toEqual(['genDesert']);
    finish(70);
    expect(ensureGenerators(s).map((i) => i.chain)).toEqual(['genYazd']);
    finish(75);
    expect(ensureGenerators(s).map((i) => i.chain)).toEqual(['genNight']);
    finish(80);
    expect(ensureGenerators(s).map((i) => i.chain)).toEqual(['genKitchen']);
    finish(85);
    expect(ensureGenerators(s).map((i) => i.chain)).toEqual(['genWinter']);
    finish(90);
    expect(ensureGenerators(s).map((i) => i.chain)).toEqual(['genQamsar']);
    finish(95);
    expect(ensureGenerators(s).map((i) => i.chain)).toEqual(['genDig']);
    finish(100);
    expect(ensureGenerators(s).map((i) => i.chain)).toEqual(['genHerbs']);
    finish(105);
    expect(ensureGenerators(s).map((i) => i.chain)).toEqual(['genToys']);
    finish(110);
    expect(ensureGenerators(s).map((i) => i.chain)).toEqual(['genMill']);
    finish(115);
    expect(ensureGenerators(s).map((i) => i.chain)).toEqual(['genScience']);
  });
});

describe('customers', () => {
  it('adds later neighbours to the order queue as the story brings them to the alley', async () => {
    const { customers } = await import('../src/game/model');
    const { PLACES } = await import('../src/story/story');
    const s = newGame(3, 0);
    const finish = (id: string) => { const k = PLACES.findIndex((p) => p.id === id); s.tasksDone = PLACES.slice(0, k).flatMap((p) => p.tasks.map((t) => t.id)); };
    expect(customers(s)).toHaveLength(7);
    expect(customers(s)).not.toContain('farokhi'); // still the developer with the bulldozers
    finish('khastegari');
    expect(customers(s)).toEqual(expect.arrayContaining(['fakhri', 'farokhi']));
    expect(customers(s)).not.toContain('aydin');
    finish('henna');
    expect(customers(s)).toEqual(expect.arrayContaining(['bahman', 'aydin', 'sona']));
    expect(customers(s)).not.toContain('yadollah');
    finish('caravan');
    expect(customers(s)).toContain('yadollah');
  });
});

describe('generator boost', () => {
  it('unlocks ×2 at level 15 and ×4 at level 40, cycling back to off', async () => {
    const { boostChoices, cycleBoost } = await import('../src/game/model');
    const s = emptyGame();
    s.level = 14;
    expect(boostChoices(s)).toEqual([1]);
    expect(cycleBoost(s)).toBe(1);
    s.level = 15;
    expect(cycleBoost(s)).toBe(2);
    expect(cycleBoost(s)).toBe(1);
    s.level = 40;
    expect([cycleBoost(s), cycleBoost(s), cycleBoost(s)]).toEqual([2, 4, 1]);
  });

  it('spends the boost in energy and lifts the item, never into the collection levels', async () => {
    const { tap } = await import('../src/game/model');
    const s = emptyGame();
    s.level = 40;
    s.energy = 50;
    s.board[0] = { item: { chain: 'genTea', level: 1 } };
    s.boost = 2;
    const [e] = tap(s, 0, T0);
    expect(e).toMatchObject({ type: 'spawn', boost: 2 });
    expect(e.type === 'spawn' && e.item.level).toBe(2);
    expect(s.energy).toBe(48);
    expect(s.stats.taps).toBe(2);
    s.boost = 4;
    s.energy = 100;
    for (let k = 0; k < 20; k++) {
      const [f] = tap(s, 0, T0);
      if (f.type !== 'spawn') throw new Error(f.type);
      expect(f.item.level).toBeGreaterThanOrEqual(3);
      expect(f.item.level).toBeLessThanOrEqual(maxLevel('tea') - 2);
      s.board[f.to] = { item: null };
    }
    expect(s.energy).toBe(20);
  });

  it('falls back to what the energy affords, and leaves event generators alone', async () => {
    const { tap, tapBoost } = await import('../src/game/model');
    const s = emptyGame();
    s.level = 40;
    s.boost = 4;
    s.energy = 3;
    expect(tapBoost(s)).toBe(2);
    s.energy = 1;
    expect(tapBoost(s)).toBe(1);
    s.energy = 10;
    s.board[0] = { item: { chain: 'genSchool', level: 1 } };
    const [e] = tap(s, 0, T0);
    expect(e).toMatchObject({ type: 'spawn' });
    expect(e.type === 'spawn' && e.boost).toBeFalsy();
    expect(s.energy).toBe(9);
  });

  it('old saves load with the boost off', () => {
    const s = emptyGame();
    const raw = JSON.parse(JSON.stringify(s));
    delete raw.boost;
    expect(loadState(JSON.stringify(raw))?.boost).toBe(1);
  });
});

describe('clock set back', () => {
  it('keeps the energy, gift and bubble timers to their normal length', async () => {
    const { ENERGY_REGEN_MS, msToNextEnergy, tickBubbles, tickEnergy } = await import('../src/game/model');
    const { GIFT_EVERY_MS } = await import('../src/game/offers');
    const s = emptyGame();
    s.energy = 10;
    s.energyAt = T0 + 30 * 86_400_000;
    s.giftAt = T0 + 30 * 86_400_000;
    s.board[0] = { item: { chain: 'tea', level: 2 }, lock: 'bubble', until: T0 + 30 * 86_400_000 };
    tickEnergy(s, T0);
    tickBubbles(s, T0);
    expect(msToNextEnergy(s, T0)).toBe(ENERGY_REGEN_MS);
    expect(s.giftAt).toBe(T0 + GIFT_EVERY_MS);
    expect(s.board[0].until! - T0).toBeLessThanOrEqual(5 * 60_000);
  });
});

describe('late-game orders and level-ups', () => {
  it('never asks for the two top levels of a chain', async () => {
    const { fillOrders } = await import('../src/game/model');
    const s = emptyGame();
    s.scriptStep = 99;
    s.level = 40;
    for (let k = 0; k < 200; k++) {
      s.orders = [];
      fillOrders(s);
      for (const n of s.orders.flatMap((o) => o.needs)) {
        expect(n.level).toBeGreaterThanOrEqual(2);
        expect(n.level).toBeLessThanOrEqual(maxLevel(n.chain) - 2);
      }
    }
  });

  it('caps the gems a level-up gives', async () => {
    const { LEVEL_GEMS_MAX, deliver, xpForLevel } = await import('../src/game/model');
    const s = emptyGame();
    s.level = 40;
    s.xp = xpForLevel(41) - 1;
    s.board[0] = { item: { chain: 'tea', level: 2 } };
    s.orders = [{ id: 1, who: 'mahin', needs: [{ chain: 'tea', level: 2 }], coins: 1, stars: 5 }];
    const ev = deliver(s, 1);
    const up = ev.find((e) => e.type === 'levelUp') as { gems: number } | undefined;
    expect(up?.gems).toBe(LEVEL_GEMS_MAX);
  });
});

describe('rush an order with gems', () => {
  it('prices only the missing items and keeps the ones on the board', async () => {
    const { RUSH_MIN, rushOrder, rushPrice } = await import('../src/game/model');
    const s = emptyGame();
    s.gems = 100;
    s.board[0] = { item: { chain: 'tea', level: 3 } };
    s.board[1] = { item: { chain: 'bread', level: 2 } };
    s.orders = [{ id: 7, who: 'reza', needs: [{ chain: 'tea', level: 3 }, { chain: 'bread', level: 6 }], coins: 10, stars: 4 }];
    const price = rushPrice(s, s.orders[0]);
    expect(price).toBe(Math.max(RUSH_MIN, Math.ceil(32 / 3)));
    const stars = s.stars;
    const ev = rushOrder(s, 7);
    expect(ev[0]).toMatchObject({ type: 'deliver', cells: [0] });
    expect(s.gems).toBe(100 - price);
    expect(s.stars).toBe(stars + 4);
    expect(s.board[0].item).toBeNull();
    expect(s.board[1].item).toEqual({ chain: 'bread', level: 2 }); // not part of the order
  });

  it('refuses when gems are short and changes nothing', async () => {
    const { rushOrder } = await import('../src/game/model');
    const s = emptyGame();
    s.gems = 2;
    s.orders = [{ id: 3, who: 'reza', needs: [{ chain: 'tea', level: 5 }], coins: 10, stars: 4 }];
    expect(rushOrder(s, 3)).toEqual([{ type: 'fail', reason: 'notEnoughGems' }]);
    expect(s.gems).toBe(2);
    expect(s.orders).toHaveLength(1);
  });
});

describe('generator storeroom', () => {
  it('holds any number of generators, pauses their chains and never gets them handed out again', async () => {
    const { ensureGenerators, fillOrders, shelve, unshelve } = await import('../src/game/model');
    const { PLACES } = await import('../src/story/story');
    const s = emptyGame();
    s.scriptStep = 99;
    s.level = 40;
    s.tasksDone = PLACES.slice(0, 30).flatMap((p) => p.tasks.map((t) => t.id));
    s.board[0] = { item: { chain: 'genTea', level: 1 } };
    ensureGenerators(s);
    const gens = s.board.flatMap((c, i) => (c.item && c.item.chain !== 'genTea' && c.item.chain.startsWith('gen') ? [i] : []));
    expect(gens.length).toBeGreaterThan(8);
    for (const i of gens) shelve(s, i);
    expect(s.shelf).toHaveLength(gens.length);
    expect(s.bag.every((b) => b === null)).toBe(true); // no bag slots used
    expect(ensureGenerators(s)).toEqual([]); // stored ones still count as owned
    for (let k = 0; k < 30; k++) {
      s.orders = [];
      fillOrders(s);
      expect(s.orders.flatMap((o) => o.needs).every((n) => n.chain === 'tea')).toBe(true);
    }
    const back = s.shelf[0].chain;
    const [e] = unshelve(s, 0);
    expect(e).toMatchObject({ type: 'spawn' });
    expect(s.board.some((c) => c.item?.chain === back)).toBe(true);
    expect(s.shelf).toHaveLength(gens.length - 1);
  });

  it('refuses event generators and products, and old saves load with it empty', async () => {
    const { shelve } = await import('../src/game/model');
    const s = emptyGame();
    s.board[0] = { item: { chain: 'genSchool', level: 1 } };
    s.board[1] = { item: { chain: 'tea', level: 3 } };
    shelve(s, 0);
    shelve(s, 1);
    expect(s.shelf).toEqual([]);
    const raw = JSON.parse(JSON.stringify(s));
    delete raw.shelf;
    expect(loadState(JSON.stringify(raw))?.shelf).toEqual([]);
  });
});

describe('bagged generators', () => {
  it('pause their chain: new orders only ask for chains with a generator on the board', async () => {
    const { fillOrders, toBag } = await import('../src/game/model');
    const s = emptyGame();
    s.scriptStep = 99;
    s.level = 12;
    s.board[0] = { item: { chain: 'genTea', level: 1 } };
    s.board[1] = { item: { chain: 'genBread', level: 1 } };
    toBag(s, 1);
    for (let k = 0; k < 50; k++) {
      s.orders = [];
      fillOrders(s);
      expect(s.orders.flatMap((o) => o.needs).every((n) => n.chain === 'tea')).toBe(true);
    }
  });
});
