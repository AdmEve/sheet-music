import { describe, expect, it } from 'vitest';
import { CELLS, GameState, deliver, loadState, newGame } from '../src/game/model';
import {
  RACE_GOAL, RACE_LEVEL, RACE_MS, RACE_REWARDS, RACES_PER_DAY, botScore, claimRace, raceOver, raceRank, racesLeft, startRace,
} from '../src/game/race';

const T0 = 1_700_000_000_000;
const MIN = 60_000;

function game(): GameState {
  const s = newGame(13, T0);
  s.board = Array.from({ length: CELLS }, () => ({ item: null }));
  s.orders = [];
  s.level = RACE_LEVEL;
  return s;
}

let seq = 0;
const roll = () => ((seq = (seq * 9301 + 49297) % 233280) / 233280);

function deliverOne(s: GameState, at: number): void {
  s.clock = at;
  s.orders = [{ id: 999, who: 'reza', needs: [{ chain: 'tea', level: 1 }], coins: 1, stars: 1 }];
  s.board[0] = { item: { chain: 'tea', level: 1 } };
  deliver(s, 999);
}

describe('alley race', () => {
  it('needs the race level and allows a few races a day', () => {
    const s = game();
    s.level = RACE_LEVEL - 1;
    expect(startRace(s, T0, 'd', roll)).toBeNull();
    s.level = RACE_LEVEL;
    for (let k = 0; k < RACES_PER_DAY; k++) {
      expect(startRace(s, T0, 'd', roll)).not.toBeNull();
      expect(startRace(s, T0, 'd', roll)).toBeNull(); // one at a time
      s.race.active = null;
    }
    expect(racesLeft(s, 'd')).toBe(0);
    expect(startRace(s, T0, 'd', roll)).toBeNull();
    expect(racesLeft(s, 'd2')).toBe(RACES_PER_DAY);
  });

  it('bots climb smoothly and finish at their time', () => {
    const s = game();
    const r = startRace(s, T0, 'd', roll)!;
    const b = r.bots[0];
    expect(botScore(b, r, T0)).toBe(0);
    expect(botScore(b, r, T0 + b.finishMs / 2)).toBeGreaterThan(0);
    expect(botScore(b, r, T0 + b.finishMs - 1)).toBeLessThan(RACE_GOAL);
    expect(botScore(b, r, T0 + b.finishMs)).toBe(RACE_GOAL);
    const fastest = Math.min(...r.bots.map((x) => x.finishMs));
    expect(fastest).toBeGreaterThanOrEqual(30 * MIN);
  });

  it('a quick player wins first place and the reward', () => {
    const s = game();
    startRace(s, T0, 'd', roll);
    for (let k = 0; k < RACE_GOAL; k++) deliverOne(s, T0 + (k + 1) * 3 * MIN);
    const r = s.race.active!;
    expect(r.finishedAt).toBe(T0 + RACE_GOAL * 3 * MIN);
    expect(raceOver(r, T0 + 20 * MIN)).toBe(true);
    expect(raceRank(s, T0 + 20 * MIN)).toBe(1);
    const gems = s.gems;
    expect(claimRace(s, T0 + 20 * MIN)).toEqual(RACE_REWARDS[0]);
    expect(s.gems).toBe(gems + (RACE_REWARDS[0].gems ?? 0));
    expect(s.race.active).toBeNull();
  });

  it('a player who stops early is ranked by orders when time runs out', () => {
    const s = game();
    startRace(s, T0, 'd', roll);
    deliverOne(s, T0 + MIN);
    expect(raceRank(s, T0 + RACE_MS - 1)).toBeNull();
    expect(raceRank(s, T0 + RACE_MS)).toBe(5);
    expect(claimRace(s, T0 + RACE_MS)).toEqual(RACE_REWARDS[4]);
  });

  it('old saves start with no race', () => {
    const old = newGame(1, T0) as Partial<GameState>;
    delete old.race;
    expect(loadState(JSON.stringify(old))!.race.active).toBeNull();
  });
});
