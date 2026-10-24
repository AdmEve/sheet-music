import { describe, expect, it } from 'vitest';
import {
  CELLS, COLS, ENERGY_CAP, ENERGY_REGEN_MS, GameState, buySheet, claimDaily, deliver, drop,
  fillOrders, findForOrder, newGame, sell, tap, tickEnergy, xpForLevel,
} from '../src/game/model';
import { CHAINS, Item, maxLevel } from '../src/game/items';

const T0 = 1_700_000_000_000;

function emptyGame(): GameState {
  const s = newGame(42, T0);
  s.board = Array.from({ length: CELLS }, () => ({ item: null }));
  s.orders = [];
  return s;
}

const at = (r: number, c: number) => r * COLS + c;

describe('merging', () => {
  it('merges two identical items into the next level', () => {
    const s = emptyGame();
    s.board[0] = { item: { chain: 'tea', level: 1 } };
    s.board[1] = { item: { chain: 'tea', level: 1 } };
    const ev = drop(s, 0, 1);
    expect(ev[0]).toMatchObject({ type: 'merge', at: 1 });
    expect(s.board[1].item).toEqual({ chain: 'tea', level: 2 });
    expect(s.board[0].item).toBeNull();
  });

  it('does not merge max-level items; swaps instead', () => {
    const s = emptyGame();
    const top: Item = { chain: 'tea', level: maxLevel('tea') };
    s.board[0] = { item: { ...top } };
    s.board[1] = { item: { ...top } };
    expect(drop(s, 0, 1)[0].type).toBe('swap');
  });

  it('moves into empty cells and swaps different items', () => {
    const s = emptyGame();
    s.board[0] = { item: { chain: 'tea', level: 1 } };
    s.board[1] = { item: { chain: 'bread', level: 1 } };
    expect(drop(s, 0, 5)[0].type).toBe('move');
    expect(drop(s, 5, 1)[0].type).toBe('swap');
    expect(s.board[5].item?.chain).toBe('bread');
  });

  it('frees a dust-sheet item by merging onto it, and opens neighbouring crates', () => {
    const s = emptyGame();
    s.board[at(2, 2)] = { item: { chain: 'bread', level: 2 }, lock: 'sheet' };
    s.board[at(1, 2)] = { item: { chain: 'tea', level: 1 }, lock: 'box' };
    s.board[at(3, 2)] = { item: { chain: 'bread', level: 2 } };
    const ev = drop(s, at(3, 2), at(2, 2)).map((e) => e.type);
    expect(ev).toEqual(['unlock', 'merge', 'boxOpen']);
    expect(s.board[at(2, 2)]).toEqual({ item: { chain: 'bread', level: 3 } });
    expect(s.board[at(1, 2)].lock).toBe('sheet');
  });

  it('refuses to drop onto crates or mismatched sheets', () => {
    const s = emptyGame();
    s.board[0] = { item: { chain: 'tea', level: 1 }, lock: 'box' };
    s.board[1] = { item: { chain: 'tea', level: 2 }, lock: 'sheet' };
    s.board[2] = { item: { chain: 'tea', level: 1 } };
    expect(drop(s, 2, 0)).toEqual([{ type: 'fail', reason: 'locked' }]);
    expect(drop(s, 2, 1)).toEqual([{ type: 'fail', reason: 'locked' }]);
    expect(s.board[2].item).not.toBeNull();
  });

  it('can buy a sheet open with gems', () => {
    const s = emptyGame();
    s.board[0] = { item: { chain: 'tea', level: 1 }, lock: 'sheet' };
    s.gems = 100;
    expect(buySheet(s, 0)[0].type).toBe('unlock');
    expect(s.board[0].lock).toBeUndefined();
    expect(s.gems).toBeLessThan(100);
  });
});

describe('generators and energy', () => {
  it('spawns an item next to the generator and spends energy', () => {
    const s = emptyGame();
    s.board[at(4, 3)] = { item: { chain: 'genTea', level: 1 } };
    const ev = tap(s, at(4, 3), T0);
    expect(ev[0].type).toBe('spawn');
    const spawn = ev[0] as Extract<typeof ev[0], { type: 'spawn' }>;
    expect(spawn.item.chain).toBe('tea');
    expect([at(3, 3), at(5, 3), at(4, 2), at(4, 4)]).toContain(spawn.to);
    expect(s.energy).toBe(ENERGY_CAP - 1);
  });

  it('fails without energy or space', () => {
    const s = emptyGame();
    s.board[0] = { item: { chain: 'genTea', level: 1 } };
    s.energy = 0;
    s.energyAt = T0;
    expect(tap(s, 0, T0)).toEqual([{ type: 'fail', reason: 'noEnergy' }]);
    s.energy = 10;
    for (let i = 1; i < CELLS; i++) s.board[i] = { item: { chain: 'bread', level: 1 } };
    expect(tap(s, 0, T0)).toEqual([{ type: 'fail', reason: 'boardFull' }]);
  });

  it('regenerates one energy per interval up to the cap', () => {
    const s = emptyGame();
    s.energy = 10;
    s.energyAt = T0;
    tickEnergy(s, T0 + ENERGY_REGEN_MS * 3 + 500);
    expect(s.energy).toBe(13);
    tickEnergy(s, T0 + ENERGY_REGEN_MS * 10_000);
    expect(s.energy).toBe(ENERGY_CAP);
  });

  it('spawn levels stay inside the chain for every generator', () => {
    const s = emptyGame();
    s.energy = 100_000;
    for (const g of ['genTea', 'genBread', 'genGarden', 'genTools', 'genTextile', 'genPottery'] as const) {
      for (let lvl = 1; lvl <= 3; lvl++) {
        for (let k = 0; k < 50; k++) {
          s.board = Array.from({ length: CELLS }, () => ({ item: null }));
          s.board[0] = { item: { chain: g, level: lvl } };
          const ev = tap(s, 0, T0)[0] as { type: string; item?: Item };
          expect(ev.type).toBe('spawn');
          expect(ev.item!.chain).toBe(CHAINS[g].produces);
          expect(ev.item!.level).toBeLessThanOrEqual(3);
        }
      }
    }
  });
});

describe('collectibles, chests, selling', () => {
  it('collects coins and energy', () => {
    const s = emptyGame();
    s.board[0] = { item: { chain: 'coins', level: 2 } };
    s.board[1] = { item: { chain: 'energy', level: 1 } };
    const c0 = s.coins, e0 = s.energy;
    tap(s, 0, T0);
    tap(s, 1, T0);
    expect(s.coins).toBeGreaterThan(c0);
    expect(s.energy).toBeGreaterThan(e0);
    expect(s.board[0].item).toBeNull();
  });

  it('opens a chest into several items', () => {
    const s = emptyGame();
    s.board[at(4, 3)] = { item: { chain: 'chest', level: 2 } };
    const ev = tap(s, at(4, 3), T0)[0] as { type: string; spawned: unknown[] };
    expect(ev.type).toBe('chest');
    expect(ev.spawned.length).toBe(5);
  });

  it('sells items but never generators', () => {
    const s = emptyGame();
    s.board[0] = { item: { chain: 'tea', level: 4 } };
    s.board[1] = { item: { chain: 'genTea', level: 1 } };
    expect(sell(s, 0)[0]).toMatchObject({ type: 'sell' });
    expect(sell(s, 1)).toEqual([]);
  });
});

describe('orders and progression', () => {
  it('starts with three scripted orders that the starting board can begin', () => {
    const s = newGame(7, T0);
    expect(s.orders).toHaveLength(3);
    expect(s.orders[0].needs).toEqual([{ chain: 'tea', level: 2 }]);
  });

  it('delivers an order, pays out, and refills', () => {
    const s = emptyGame();
    fillOrders(s);
    const o = s.orders[0];
    o.needs.forEach((n, k) => (s.board[k] = { item: { ...n } }));
    expect(findForOrder(s, o)).not.toBeNull();
    const coins = s.coins, stars = s.stars;
    const ev = deliver(s, o.id);
    expect(ev[0].type).toBe('deliver');
    expect(s.coins).toBe(coins + o.coins);
    expect(s.stars).toBe(stars + o.stars);
    expect(s.orders).toHaveLength(3);
    expect(s.orders.find((x) => x.id === o.id)).toBeUndefined();
  });

  it('does not count locked items toward orders', () => {
    const s = emptyGame();
    fillOrders(s);
    const o = s.orders[0];
    o.needs.forEach((n, k) => (s.board[k] = { item: { ...n }, lock: 'sheet' }));
    expect(deliver(s, o.id)).toEqual([{ type: 'fail', reason: 'missing' }]);
  });

  it('levels up and hands out the next generator', () => {
    const s = emptyGame();
    s.xp = xpForLevel(2) - 1;
    fillOrders(s);
    const o = s.orders[0];
    o.needs.forEach((n, k) => (s.board[k] = { item: { ...n } }));
    const ev = deliver(s, o.id);
    const up = ev.find((e) => e.type === 'levelUp') as { gift: Item | null } | undefined;
    expect(up).toBeDefined();
    expect(s.level).toBe(2);
    expect(up!.gift).toEqual({ chain: 'genGarden', level: 1 });
  });

  it('generated orders are always reachable with owned generators', () => {
    const s = emptyGame();
    s.board[0] = { item: { chain: 'genTea', level: 1 } };
    s.scriptStep = 999;
    for (let lvl = 1; lvl < 15; lvl++) {
      s.level = lvl;
      s.orders = [];
      fillOrders(s);
      for (const o of s.orders) for (const n of o.needs) {
        expect(n.chain).toBe('tea');
        expect(n.level).toBeGreaterThanOrEqual(2);
        expect(n.level).toBeLessThanOrEqual(maxLevel('tea'));
      }
    }
  });
});

describe('daily gift', () => {
  it('builds a streak on consecutive days and resets after a gap', () => {
    const s = emptyGame();
    expect(claimDaily(s, '2026-10-01', '2026-09-30')).toBe(0);
    expect(claimDaily(s, '2026-10-01', '2026-09-30')).toBeNull();
    expect(claimDaily(s, '2026-10-02', '2026-10-01')).toBe(1);
    expect(claimDaily(s, '2026-10-05', '2026-10-04')).toBe(0);
  });
});

describe('coin shop', () => {
  it('sells energy at a doubling price, capped per day', async () => {
    const { buyEnergyWithCoins, coinEnergyPrice, COIN_ENERGY_MAX_PER_DAY } = await import('../src/game/model');
    const s = emptyGame();
    s.coins = 100_000;
    const prices: number[] = [];
    let bought = 0;
    while (buyEnergyWithCoins(s, '2026-10-01')) { bought++; prices.push(coinEnergyPrice(s, '2026-10-01')); }
    expect(bought).toBe(COIN_ENERGY_MAX_PER_DAY);
    expect(prices[1]).toBe(prices[0] * 2);
    expect(buyEnergyWithCoins(s, '2026-10-02')).toBe(true);
  });

  it('old saves without new fields still load', async () => {
    const { loadState } = await import('../src/game/model');
    const s = emptyGame();
    const raw = JSON.parse(JSON.stringify(s));
    delete raw.ads; delete raw.bought; delete raw.coinEnergy;
    const loaded = loadState(JSON.stringify(raw))!;
    expect(loaded.ads).toBeDefined();
    expect(loaded.coinEnergy).toBeDefined();
    expect(loadState('not json')).toBeNull();
  });
});

describe('bubbles', () => {
  it('sometimes spawns a bubble copy on high merges, which expires or pops', async () => {
    const { BUBBLE_MS, popBubble, tickBubbles } = await import('../src/game/model');
    const s = emptyGame();
    s.clock = T0;
    let bubbleAt = -1;
    for (let k = 0; k < 400 && bubbleAt < 0; k++) {
      s.board = Array.from({ length: CELLS }, () => ({ item: null }));
      s.board[0] = { item: { chain: 'tea', level: 4 } };
      s.board[1] = { item: { chain: 'tea', level: 4 } };
      const ev = drop(s, 0, 1);
      const b = ev.find((e) => e.type === 'bubble') as { at: number } | undefined;
      if (b) bubbleAt = b.at;
    }
    expect(bubbleAt).toBeGreaterThanOrEqual(0);
    expect(s.board[bubbleAt]).toMatchObject({ item: { chain: 'tea', level: 5 }, lock: 'bubble' });
    // locked: cannot be merged onto or dragged
    s.board[30] = { item: { chain: 'tea', level: 5 } };
    expect(drop(s, 30, bubbleAt)).toEqual([{ type: 'fail', reason: 'locked' }]);
    expect(drop(s, bubbleAt, 31)).toEqual([]);
    // pop with gems
    s.gems = 0;
    expect(popBubble(s, bubbleAt)).toEqual([{ type: 'fail', reason: 'notEnoughGems' }]);
    s.gems = 100;
    expect(popBubble(s, bubbleAt)[0].type).toBe('bubblePop');
    expect(s.board[bubbleAt].lock).toBeUndefined();
    // expiry
    s.board[40] = { item: { chain: 'tea', level: 5 }, lock: 'bubble', until: T0 + BUBBLE_MS };
    expect(tickBubbles(s, T0 + 1000)).toEqual([]);
    expect(tickBubbles(s, T0 + BUBBLE_MS + 1)).toEqual([40]);
    expect(s.board[40].item).toBeNull();
  });
});

describe('daily quests', () => {
  it('hands out three quests a day, tracks stats and pays once', async () => {
    const m = await import('../src/game/model');
    const s = emptyGame();
    expect(m.refreshQuests(s, '2026-10-01')).toBe(true);
    expect(m.refreshQuests(s, '2026-10-01')).toBe(false);
    expect(s.quests.list).toHaveLength(3);
    const q = s.quests.list[0];
    expect(m.claimQuest(s, 0)).toBe(false);
    s.stats.merges += q.target;
    expect(m.questDone(s, q)).toBe(true);
    const coins = s.coins;
    expect(m.claimQuest(s, 0)).toBe(true);
    expect(s.coins).toBeGreaterThan(coins);
    expect(m.claimQuest(s, 0)).toBe(false);
    expect(m.claimQuestBonus(s)).toBeNull();
    s.stats.orders += 100; s.stats.taps += 1000;
    m.claimQuest(s, 1); m.claimQuest(s, 2);
    expect(m.claimQuestBonus(s)).toEqual({ chain: 'chest', level: 2 });
    expect(m.claimQuestBonus(s)).toBeNull();
    expect(m.refreshQuests(s, '2026-10-02')).toBe(true);
    expect(s.quests.list.every((x) => !x.claimed)).toBe(true);
  });
});

describe('reward placement', () => {
  it('puts rewards near the generators, then the bag, never dropping them', async () => {
    const { placeItem, fromBag, BAG_MAX, ROWS } = await import('../src/game/model');
    const s = emptyGame();
    const at = placeItem(s, { chain: 'chest', level: 1 })!;
    expect(Math.floor(at / COLS)).toBe(ROWS - 1);
    for (let i = 0; i < CELLS; i++) s.board[i] = { item: { chain: 'tea', level: 1 } };
    s.bag = Array.from({ length: BAG_MAX }, () => ({ chain: 'bread', level: 1 }));
    expect(placeItem(s, { chain: 'chest', level: 2 })).toBeNull();
    expect(s.bag).toHaveLength(BAG_MAX + 1);
    s.board[0] = { item: null };
    fromBag(s, BAG_MAX);
    expect(s.bag).toHaveLength(BAG_MAX);
  });
});
