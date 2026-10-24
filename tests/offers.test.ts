import { describe, expect, it } from 'vitest';
import { CELLS, GameState, deliver, loadState, newGame } from '../src/game/model';
import {
  GIFT_EVERY_MS, PIGGY_CAP, PIGGY_LEVEL, PIGGY_PER_ORDER, activeOffers, breakPiggy, endOffer, fillPiggy, giftReady,
  offerOnEpisode, offerOnLevel, openGift, piggyReady,
} from '../src/game/offers';

const T0 = 1_700_000_000_000;
const H = 3_600_000;

function game(): GameState {
  const s = newGame(5, T0);
  s.board = Array.from({ length: CELLS }, () => ({ item: null }));
  return s;
}

describe('piggy bank', () => {
  it('stays closed before its level, then fills per order up to the cap', () => {
    const s = game();
    expect(fillPiggy(s)).toBe(0);
    s.level = PIGGY_LEVEL;
    expect(fillPiggy(s)).toBe(PIGGY_PER_ORDER);
    s.piggy = PIGGY_CAP - 1;
    expect(fillPiggy(s)).toBe(1);
    expect(fillPiggy(s)).toBe(0);
    expect(piggyReady(s)).toBe(true);
    const gems = s.gems;
    expect(breakPiggy(s)).toBe(PIGGY_CAP);
    expect(s.gems).toBe(gems + PIGGY_CAP);
    expect(s.piggy).toBe(0);
    expect(piggyReady(s)).toBe(false);
  });

  it('delivering an order drops gems in the jar', () => {
    const s = game();
    s.level = PIGGY_LEVEL;
    s.orders = [{ id: 1, who: 'reza', needs: [{ chain: 'tea', level: 1 }], coins: 1, stars: 1 }];
    s.board[0] = { item: { chain: 'tea', level: 1 } };
    const ev = deliver(s, 1);
    expect(ev[0]).toMatchObject({ type: 'deliver', piggy: PIGGY_PER_ORDER });
    expect(s.piggy).toBe(PIGGY_PER_ORDER);
  });
});

describe('timed offers', () => {
  it('starter pack pops once at level 3 and expires after 48 h', () => {
    const s = game();
    expect(offerOnLevel(s, 2, T0)).toBeNull();
    expect(offerOnLevel(s, 3, T0)?.id).toBe('starter');
    expect(offerOnLevel(s, 4, T0)).toBeNull();
    expect(activeOffers(s, T0 + 47 * H).length).toBe(1);
    expect(activeOffers(s, T0 + 49 * H).length).toBe(0);
  });

  it('never offers the starter pack to someone who bought it', () => {
    const s = game();
    s.bought.push('starter_pack');
    expect(offerOnLevel(s, 3, T0)).toBeNull();
  });

  it('episode bundles restart instead of stacking, and end when bought', () => {
    const s = game();
    offerOnEpisode(s, T0);
    offerOnEpisode(s, T0 + H);
    expect(s.offers.length).toBe(1);
    expect(s.offers[0].until).toBe(T0 + 25 * H);
    endOffer(s, 'chapter');
    expect(activeOffers(s, T0)).toEqual([]);
  });
});

describe('free gift', () => {
  it('appears from level 3 and comes back after a cool-down', () => {
    const s = game();
    expect(giftReady(s, T0)).toBe(false);
    s.level = 3;
    expect(giftReady(s, T0)).toBe(true);
    expect(openGift(s, T0, 0.1)).toEqual({ energy: 25 });
    expect(giftReady(s, T0 + GIFT_EVERY_MS - 1)).toBe(false);
    expect(giftReady(s, T0 + GIFT_EVERY_MS)).toBe(true);
    expect(openGift(s, T0, 0.6)).toEqual({ gems: 3 });
    expect(openGift(s, T0, 0.9)).toEqual({ chest: 1 });
  });
});

describe('save migration', () => {
  it('old saves get an empty piggy, no offers and a gift timer', () => {
    const old = newGame(1, T0) as Partial<GameState>;
    delete old.piggy;
    delete old.offers;
    delete old.giftAt;
    const s = loadState(JSON.stringify(old))!;
    expect(s.piggy).toBe(0);
    expect(s.offers).toEqual([]);
    expect(s.giftAt).toBe(0);
  });
});

describe('welcome back', () => {
  it('gives a gift after two days away, growing with the absence', async () => {
    const { welcomeBack, AWAY_DAYS } = await import('../src/game/offers');
    const { newGame } = await import('../src/game/model');
    const s = newGame(1, 0);
    s.level = 5;
    const day = 86_400_000;
    expect(welcomeBack(s, day, day + (AWAY_DAYS * day - 1))).toBeNull();
    expect(welcomeBack(s, day, day + 2 * day)).toEqual({ days: 2, energy: 100, gems: 10, chest: 1 });
    expect(welcomeBack(s, day, day + 30 * day)).toEqual({ days: 30, energy: 100, gems: 30, chest: 3 });
    s.level = 1;
    expect(welcomeBack(s, day, day + 5 * day)).toBeNull();
  });
});
