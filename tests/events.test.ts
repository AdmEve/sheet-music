import { describe, expect, it } from 'vitest';
import { discover } from '../src/game/codex';
import {
  EVENT_COLLECT, EVENT_LEVEL, EVENT_ORDER, EVENT_TOTAL, MILESTONES, claimMilestone, ensureEvent, eventClaimable, eventEnd,
  eventForDay, eventProgress, milestonesReached,
} from '../src/game/events';
import { toJalali } from '../src/game/calendar';
import { CELLS, GameState, deliver, drop, fillOrders, loadState, newGame, placeItem, tap, unlockedProducts } from '../src/game/model';

const T0 = 1_700_000_000_000;

function game(level = EVENT_LEVEL): GameState {
  const s = newGame(11, T0);
  s.board = Array.from({ length: CELLS }, () => ({ item: null }));
  s.orders = [];
  s.level = level;
  return s;
}
const place = (s: GameState) => (it: Parameters<typeof placeItem>[1]) => placeItem(s, it);

describe('event schedule', () => {
  it('runs Yalda and Nowruz on their dates and a weekly theme otherwise', () => {
    expect(eventForDay(new Date(2026, 11, 21))).toEqual({ id: 'yalda-1405', theme: 'yalda' }); // 30 Azar
    expect(eventForDay(new Date(2026, 11, 22)).theme).toBe('yalda'); // 1 Dey
    expect(eventForDay(new Date(2026, 11, 23)).theme).not.toBe('yalda');
    expect(eventForDay(new Date(2027, 2, 18))).toEqual({ id: 'nowruz-1406', theme: 'nowruz' }); // 27 Esfand 1405
    expect(eventForDay(new Date(2027, 3, 2))).toEqual({ id: 'nowruz-1406', theme: 'nowruz' }); // 13 Farvardin 1406
    expect(eventForDay(new Date(2027, 3, 3)).theme).not.toBe('nowruz');
    const sat = eventForDay(new Date(2026, 9, 24)); // a Saturday
    expect(sat.id).toBe('week-2026-10-24');
    expect(eventForDay(new Date(2026, 9, 30)).id).toBe(sat.id); // Friday, same week
    const next = eventForDay(new Date(2026, 9, 31));
    expect(next.id).toBe('week-2026-10-31');
    expect(next.theme).not.toBe(sat.theme); // themes rotate
    const four = [0, 7, 14, 21].map((d) => eventForDay(new Date(2026, 9, 24 + d)).theme);
    expect(new Set(four).size).toBe(4);
  });

  it('runs Chaharshanbe Suri the week ending on the last Wednesday, then Nowruz', () => {
    // 1406 starts on Sunday 21 March 2027, so Suri night is Tuesday 16 March.
    expect(eventForDay(new Date(2027, 2, 10)).theme).not.toBe('suri'); // Wednesday before
    expect(eventForDay(new Date(2027, 2, 11))).toEqual({ id: 'suri-1405', theme: 'suri' }); // Thursday
    expect(eventForDay(new Date(2027, 2, 17))).toEqual({ id: 'suri-1405', theme: 'suri' }); // Wednesday
    expect(eventForDay(new Date(2027, 2, 18)).theme).toBe('nowruz');
    // When Nowruz is the day after a Wednesday (Thursday 21 March 2030), Suri ends the day before.
    expect(eventForDay(new Date(2030, 2, 20)).theme).toBe('suri');
    expect(eventForDay(new Date(2030, 2, 21)).theme).toBe('nowruz');
  });

  it('runs back to school from 25 Shahrivar to 3 Mehr', () => {
    expect(eventForDay(new Date(2026, 8, 15)).theme).not.toBe('school'); // 24 Shahrivar
    expect(eventForDay(new Date(2026, 8, 16))).toEqual({ id: 'school-1405', theme: 'school' });
    expect(eventForDay(new Date(2026, 8, 25)).theme).toBe('school'); // 3 Mehr
    expect(eventForDay(new Date(2026, 8, 26)).theme).not.toBe('school');
  });

  it('folds a one- or two-day leftover week into the next full week', () => {
    // Nowruz 1410 ends on Wednesday 2 April 2031; Thursday and Friday join the week after.
    const thu = eventForDay(new Date(2031, 3, 3));
    expect(thu.id).toBe('week-2031-04-05');
    expect(eventForDay(new Date(2031, 3, 5))).toEqual(thu);
    expect(eventEnd(new Date(2031, 3, 3))).toEqual(new Date(2031, 3, 12));
  });

  it('finds the end of the running event', () => {
    expect(eventEnd(new Date(2026, 9, 27, 13))).toEqual(new Date(2026, 9, 31));
    expect(toJalali(eventEnd(new Date(2026, 11, 18)))).toEqual({ y: 1405, m: 10, d: 2 });
  });
});

describe('event play', () => {
  it('hands out the generator from the event level and never makes orders for it', () => {
    const s = game(EVENT_LEVEL - 1);
    const now = new Date(2026, 9, 24);
    let ch = ensureEvent(s, now, place(s));
    expect(ch.started).toBe('lavashak');
    expect(ch.joined).toBe(false);
    s.level = EVENT_LEVEL;
    ch = ensureEvent(s, now, place(s));
    expect(ch.joined).toBe(true);
    expect(s.board[ch.genAt!].item).toEqual({ chain: 'genLavashak', level: 1 });
    expect(ensureEvent(s, now, place(s)).joined).toBe(false); // only once
    expect(unlockedProducts(s)).not.toContain('lavashak');
    fillOrders(s);
    expect(s.orders.flatMap((o) => o.needs).some((n) => n.chain === 'lavashak')).toBe(false);
    expect(discover(s).some((i) => i.chain === 'genLavashak')).toBe(false);
  });

  it('earns points from merges, collecting the top item and orders', () => {
    const s = game();
    ensureEvent(s, new Date(2026, 9, 24), place(s));
    s.board[10] = { item: { chain: 'lavashak', level: 2 } };
    s.board[11] = { item: { chain: 'lavashak', level: 2 } };
    expect(drop(s, 10, 11)).toContainEqual({ type: 'eventPts', at: 11, amount: 3 });
    s.board[12] = { item: { chain: 'lavashak', level: 6 } };
    expect(tap(s, 12, T0)).toEqual([{ type: 'collect', at: 12, kind: 'event', amount: EVENT_COLLECT }]);
    expect(s.board[12].item).toBeNull();
    s.orders = [{ id: 1, who: 'reza', needs: [{ chain: 'tea', level: 1 }], coins: 1, stars: 1 }];
    s.board[0] = { item: { chain: 'tea', level: 1 } };
    deliver(s, 1);
    expect(s.event.points).toBe(3 + EVENT_COLLECT + EVENT_ORDER);
  });

  it('pays milestones in order and gives a trophy at the end', () => {
    const s = game();
    ensureEvent(s, new Date(2026, 9, 24), place(s));
    s.event.points = MILESTONES[0].cost + MILESTONES[1].cost + 5;
    expect(milestonesReached(s)).toBe(2);
    expect(eventProgress(s)).toEqual({ into: 5, need: MILESTONES[2].cost });
    expect(claimMilestone(s)).toEqual(MILESTONES[0].reward);
    expect(claimMilestone(s)).toEqual(MILESTONES[1].reward);
    expect(claimMilestone(s)).toBeNull();
    s.event.points = EVENT_TOTAL;
    while (eventClaimable(s)) claimMilestone(s);
    expect(s.trophies).toEqual(['week-2026-10-24']);
    expect(eventProgress(s)).toEqual({ into: 0, need: 0 });
  });

  it('turns leftovers into coins and pays unclaimed milestones when the event ends', () => {
    const s = game();
    ensureEvent(s, new Date(2026, 9, 24), place(s));
    s.board[20] = { item: { chain: 'lavashak', level: 3 } };
    s.bag[0] = { chain: 'lavashak', level: 2 };
    s.event.points = MILESTONES[0].cost + MILESTONES[1].cost + MILESTONES[2].cost + MILESTONES[3].cost;
    const coins = s.coins;
    const ch = ensureEvent(s, new Date(2026, 9, 31), place(s));
    expect(ch.started).toBe('kite');
    expect(ch.coins).toBe(5 * 3 + 5 * 2);
    expect(ch.chests).toEqual([1]);
    expect(s.coins).toBe(coins + 25 + 50); // leftovers + milestone 1
    expect(s.board.some((c) => c.item?.chain === 'lavashak' || c.item?.chain === 'genLavashak')).toBe(false);
    expect(s.bag[0]).toBeNull();
    expect(s.board[ch.genAt!].item?.chain).toBe('genKite');
  });

  it('old saves start without an event', () => {
    const old = newGame(1, T0) as Partial<GameState>;
    delete old.event;
    delete old.trophies;
    const s = loadState(JSON.stringify(old))!;
    expect(s.event.id).toBe('');
    expect(s.trophies).toEqual([]);
  });
});
