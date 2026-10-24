import { describe, expect, it } from 'vitest';
import { monthEnd, monthKey, toJalali } from '../src/game/calendar';
import { CELLS, GameState, claimQuest, deliver, loadState, newGame, refreshQuests } from '../src/game/model';
import {
  ENDLESS_COST, FREE, PASS_LEVEL, PASS_STEPS, PASS_TOTAL, PREMIUM, QUEST_POINTS, claimEndless, claimPass, endlessReady,
  ensurePass, grantPremium, passClaimable, passName, passProgress, stepCost,
} from '../src/game/pass';

const T0 = 1_700_000_000_000;

function game(): GameState {
  const s = newGame(9, T0);
  s.board = Array.from({ length: CELLS }, () => ({ item: null }));
  s.level = PASS_LEVEL;
  return s;
}

describe('jalali calendar', () => {
  it('converts known dates', () => {
    expect(toJalali(new Date(2026, 2, 21))).toEqual({ y: 1405, m: 1, d: 1 }); // Nowruz 1405
    expect(toJalali(new Date(2026, 9, 24))).toEqual({ y: 1405, m: 8, d: 2 }); // 2 Aban
    expect(toJalali(new Date(2026, 11, 21))).toEqual({ y: 1405, m: 9, d: 30 }); // Yalda night
    expect(toJalali(new Date(2025, 2, 20))).toEqual({ y: 1403, m: 12, d: 30 }); // leap Esfand
    expect(toJalali(new Date(2027, 2, 20))).toEqual({ y: 1405, m: 12, d: 29 });
  });

  it('finds where the month ends', () => {
    const end = monthEnd(new Date(2026, 9, 24, 15));
    expect(toJalali(end)).toEqual({ y: 1405, m: 9, d: 1 });
    expect(end.getHours()).toBe(0);
    expect(monthKey(toJalali(new Date(2026, 9, 24)))).toBe('1405-8');
  });
});

describe('season pass', () => {
  it('has 30 steps on both tracks with rising costs', () => {
    expect(FREE.length).toBe(PASS_STEPS);
    expect(PREMIUM.length).toBe(PASS_STEPS);
    expect(stepCost(29)).toBeGreaterThan(stepCost(0));
    expect(passName(new Date(2026, 9, 24))).toBe('مسیر آبان');
  });

  it('earns points from orders and quests once unlocked', () => {
    const s = game();
    s.level = 1;
    s.orders = [{ id: 1, who: 'reza', needs: [{ chain: 'tea', level: 1 }], coins: 1, stars: 3 }];
    s.board[0] = { item: { chain: 'tea', level: 1 } };
    deliver(s, 1);
    expect(s.pass.points).toBe(0);
    s.level = PASS_LEVEL;
    s.orders = [{ id: 2, who: 'reza', needs: [{ chain: 'tea', level: 1 }], coins: 1, stars: 3 }];
    s.board[0] = { item: { chain: 'tea', level: 1 } };
    const ev = deliver(s, 2);
    expect(ev[0]).toMatchObject({ type: 'deliver', pass: 3 });
    refreshQuests(s, 'd1');
    s.stats.merges += 1000;
    claimQuest(s, 0);
    expect(s.pass.points).toBe(3 + QUEST_POINTS);
  });

  it('pays free steps to everyone and premium steps only after the purchase', () => {
    const s = game();
    s.pass.points = stepCost(0) + stepCost(1);
    expect(passProgress(s).step).toBe(2);
    expect(passClaimable(s)).toBe(2);
    const coins = s.coins;
    expect(claimPass(s, 'free', 1)).toEqual(FREE[0]);
    expect(s.coins).toBe(coins + (FREE[0].coins ?? 0));
    expect(claimPass(s, 'free', 1)).toBeNull();
    expect(claimPass(s, 'free', 3)).toBeNull(); // not reached
    expect(claimPass(s, 'prem', 1)).toBeNull();
    grantPremium(s);
    expect(passClaimable(s)).toBe(3);
    expect(claimPass(s, 'prem', 1)).toEqual(PREMIUM[0]);
  });

  it('goes on forever after the last step', () => {
    const s = game();
    s.pass.points = PASS_TOTAL + 2 * ENDLESS_COST + 5;
    expect(passProgress(s)).toEqual({ step: PASS_STEPS, into: 5, need: ENDLESS_COST });
    expect(endlessReady(s)).toBe(2);
    expect(claimEndless(s)).not.toBeNull();
    expect(claimEndless(s)).not.toBeNull();
    expect(claimEndless(s)).toBeNull();
  });

  it('starts a new season each Persian month and pays out what was left', () => {
    const s = game();
    const aban = new Date(2026, 9, 24);
    expect(ensurePass(s, aban)).toEqual({ rolled: false, chests: [], paid: { coins: 0, gems: 0, energy: 0 } });
    expect(s.pass.id).toBe('1405-8');
    expect(ensurePass(s, aban).rolled).toBe(false);
    s.pass.points = Array.from({ length: 5 }, (_, k) => stepCost(k)).reduce((a, b) => a + b, 0);
    grantPremium(s);
    claimPass(s, 'free', 1);
    const gems = s.gems;
    const r = ensurePass(s, new Date(2026, 10, 25)); // 4 Azar
    expect(r.rolled).toBe(true);
    expect(r.chests).toEqual([1, 2]); // free step 5 + premium step 5
    expect(s.gems).toBe(gems + 3 * 10); // premium steps 1, 2, 4 give gems; 3 is energy, 5 a chest
    expect(s.pass).toMatchObject({ id: '1405-9', points: 0, premium: false, free: [], prem: [] });
  });

  it('old saves start with an empty pass', () => {
    const old = newGame(1, T0) as Partial<GameState>;
    delete old.pass;
    expect(loadState(JSON.stringify(old))!.pass.points).toBe(0);
  });
});
