// The alley race «مسابقه‌ی محله»: the player and four neighbours from other alleys race to
// deliver RACE_GOAL orders. The game is offline, so the rivals are bots whose progress is
// a function of time: each has a finish time drawn when the race starts (one quick, one
// steady, two slow), and their order count rises smoothly towards it. The race ends when
// the player finishes or the window closes; rank decides a chest.

import type { GameState } from './model';
import type { PassReward } from './pass';

export const RACE_LEVEL = 6;
export const RACE_GOAL = 6;
export const RACE_MS = 2 * 3_600_000;
export const RACES_PER_DAY = 3;

export const RACE_REWARDS: PassReward[] = [
  { chest: 3, gems: 15 },
  { chest: 2, gems: 5 },
  { chest: 1 },
  { coins: 60 },
  { coins: 40 },
];

const NAMES = [
  'مریم از کوچه‌ی یاس', 'علی از کوچه‌ی بهار', 'سارا از کوچه‌ی نارنج', 'حسین از کوچه‌ی اقاقیا', 'زهره از کوچه‌ی گلستان',
  'امیر از کوچه‌ی سرو', 'نازنین از کوچه‌ی شمشاد', 'رضا از کوچه‌ی چنار', 'الهام از کوچه‌ی ارغوان', 'مهدی از کوچه‌ی پاییز',
  'فاطمه از کوچه‌ی نسترن', 'بهروز از کوچه‌ی سپیدار',
];

export interface Bot {
  name: string;
  /** Avatar colour index. */
  hue: number;
  /** Time (ms after the start) the bot delivers its last order. */
  finishMs: number;
}

export interface Race {
  start: number;
  /** Delivered-orders counter when the race began. */
  orders0: number;
  bots: Bot[];
  /** When the player delivered the last order (ms), if they did. */
  finishedAt: number | null;
  /** Reward taken. */
  claimed: boolean;
}

export interface RaceState {
  day: string;
  /** Races started today. */
  count: number;
  active: Race | null;
}

export const emptyRace = (): RaceState => ({ day: '', count: 0, active: null });

export const raceUnlocked = (s: GameState) => s.level >= RACE_LEVEL;
export const racesLeft = (s: GameState, today: string) => RACES_PER_DAY - (s.race.day === today ? s.race.count : 0);

const MIN = 60_000;

/** Starts a race. `roll` gives random numbers in [0, 1) (seeded by the caller). */
export function startRace(s: GameState, now: number, today: string, roll: () => number): Race | null {
  if (!raceUnlocked(s) || s.race.active || racesLeft(s, today) <= 0) return null;
  const pickNames = [...NAMES].sort(() => roll() - 0.5).slice(0, 4);
  const spans: [number, number][] = [[30, 50], [45, 80], [70, 120], [90, 150]];
  const race: Race = {
    start: now,
    orders0: s.stats.orders,
    bots: pickNames.map((name, k) => ({
      name,
      hue: Math.floor(roll() * 6),
      finishMs: Math.round((spans[k][0] + roll() * (spans[k][1] - spans[k][0])) * MIN),
    })),
    finishedAt: null,
    claimed: false,
  };
  if (s.race.day !== today) s.race = { day: today, count: 0, active: null };
  s.race.count++;
  s.race.active = race;
  return race;
}

/** Orders a bot has delivered by time `t`: a smooth climb that eases off near the end. */
export function botScore(b: Bot, race: Race, t: number): number {
  if (t - race.start >= b.finishMs) return RACE_GOAL;
  const x = Math.max(0, (t - race.start) / b.finishMs);
  return Math.min(RACE_GOAL - 1, Math.floor(RACE_GOAL * Math.pow(x, 0.85)));
}

export const playerScore = (s: GameState, race: Race) => Math.min(RACE_GOAL, s.stats.orders - race.orders0);

/** Called after each delivery: records the moment the player reached the goal. */
export function notePlayerFinish(s: GameState, now: number): void {
  const r = s.race.active;
  if (r && r.finishedAt === null && now - r.start <= RACE_MS && playerScore(s, r) >= RACE_GOAL) r.finishedAt = now;
}

export const raceOver = (r: Race, now: number) => r.finishedAt !== null || now - r.start >= RACE_MS;

/**
 * 1-based rank once the race is over (null while it runs). A bot that finished before the
 * player beats them; if the player never finished, bots ahead on orders at the close do.
 */
export function raceRank(s: GameState, now: number): number | null {
  const r = s.race.active;
  if (!r || !raceOver(r, now)) return null;
  if (r.finishedAt !== null) return 1 + r.bots.filter((b) => b.finishMs < r.finishedAt! - r.start).length;
  const end = r.start + RACE_MS;
  const mine = playerScore(s, r);
  return 1 + r.bots.filter((b) => botScore(b, r, end) > mine).length;
}

/** Takes the reward of a finished race and clears it. */
export function claimRace(s: GameState, now: number): PassReward | null {
  const rank = raceRank(s, now);
  if (rank === null || !s.race.active) return null;
  const reward = RACE_REWARDS[rank - 1];
  s.coins += reward.coins ?? 0;
  s.gems += reward.gems ?? 0;
  s.race.active = null;
  return reward;
}
