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
  it('hands a missing generator to players already past its level, once', async () => {
    const { ensureGenerators } = await import('../src/game/model');
    const s = newGame(2, 0);
    s.level = 21;
    const given = ensureGenerators(s).map((i) => i.chain);
    expect(given).toContain('genPost');
    expect(given).toContain('genSweets');
    expect(given).not.toContain('genGarden'); // still in its crate on the board
    expect(ensureGenerators(s)).toEqual([]);
    s.level = 31;
    expect(ensureGenerators(s).map((i) => i.chain)).toEqual(['genBaby', 'genLamp']);
    s.level = 35;
    expect(ensureGenerators(s).map((i) => i.chain)).toEqual(['genSaz']);
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
