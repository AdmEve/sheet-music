// The monthly season pass «مسیر <month>». Each Persian month is a season: points
// («نشان») come from delivered orders (one per order star) and daily quests, and fill a
// 30-step track. Every step has a free reward and a premium one; the premium track is
// unlocked for the month with one purchase (pass_premium). Past step 30 the track goes
// on forever, one chest per ENDLESS_COST points. Rewards reached but never taken are paid
// out automatically when the month ends.

import { MONTHS, monthKey, toJalali } from './calendar';
import type { GameState } from './model';

export const PASS_LEVEL = 2;
export const PASS_STEPS = 30;
export const ENDLESS_COST = 250;
export const QUEST_POINTS = 20;
export const QUEST_BONUS_POINTS = 40;

/** Points needed to go from step k to k+1 (k is 0-based): 60 rising to 176. */
export const stepCost = (k: number) => 60 + 4 * k;
export const PASS_TOTAL = Array.from({ length: PASS_STEPS }, (_, k) => stepCost(k)).reduce((a, b) => a + b, 0);

export interface PassReward {
  coins?: number;
  gems?: number;
  energy?: number;
  /** Chest level to place on the board. */
  chest?: number;
}

export interface PassState {
  /** Month key ("1405-8") this progress belongs to; '' before the first season. */
  id: string;
  points: number;
  premium: boolean;
  /** 1-based steps whose reward was taken, per track. */
  free: number[];
  prem: number[];
  /** Endless chests taken. */
  endless: number;
}

export const emptyPass = (): PassState => ({ id: '', points: 0, premium: false, free: [], prem: [], endless: 0 });

export const FREE: PassReward[] = Array.from({ length: PASS_STEPS }, (_, k) => {
  const n = k + 1;
  if (n === PASS_STEPS) return { chest: 3, gems: 20 };
  if (n % 10 === 0) return { chest: 2 };
  if (n % 5 === 0) return { chest: 1 };
  return n % 2 ? { coins: 40 + n * 5 } : { energy: 20 };
});

export const PREMIUM: PassReward[] = Array.from({ length: PASS_STEPS }, (_, k) => {
  const n = k + 1;
  if (n === PASS_STEPS) return { chest: 3, gems: 100 };
  if (n % 10 === 0) return { chest: 3, gems: 30 };
  if (n % 5 === 0) return { chest: 2 };
  if (n % 3 === 0) return { energy: 50 };
  return { gems: 10 };
});

export const passUnlocked = (s: GameState) => s.level >= PASS_LEVEL;
export const passName = (now: Date) => `مسیر ${MONTHS[toJalali(now).m - 1]}`;

/** Completed steps (0…30), points into the next one, and its cost. */
export function passProgress(s: GameState): { step: number; into: number; need: number } {
  let left = s.pass.points;
  for (let k = 0; k < PASS_STEPS; k++) {
    if (left < stepCost(k)) return { step: k, into: left, need: stepCost(k) };
    left -= stepCost(k);
  }
  return { step: PASS_STEPS, into: left % ENDLESS_COST, need: ENDLESS_COST };
}

export const endlessReady = (s: GameState) => Math.max(0, Math.floor((s.pass.points - PASS_TOTAL) / ENDLESS_COST) - s.pass.endless);
export const ENDLESS_REWARD: PassReward = { chest: 2 };

export function addPassPoints(s: GameState, n: number): number {
  if (!passUnlocked(s) || n <= 0) return 0;
  s.pass.points += n;
  return n;
}

function pay(s: GameState, r: PassReward): void {
  s.coins += r.coins ?? 0;
  s.gems += r.gems ?? 0;
  s.energy += r.energy ?? 0;
}

export type Track = 'free' | 'prem';

export function canClaim(s: GameState, track: Track, n: number): boolean {
  if (n < 1 || n > PASS_STEPS || passProgress(s).step < n) return false;
  if (track === 'prem' && !s.pass.premium) return false;
  return !s.pass[track].includes(n);
}

/** Takes one step's reward. Coins/gems/energy are paid here; a chest is returned to place. */
export function claimPass(s: GameState, track: Track, n: number): PassReward | null {
  if (!canClaim(s, track, n)) return null;
  s.pass[track].push(n);
  const r = (track === 'free' ? FREE : PREMIUM)[n - 1];
  pay(s, r);
  return r;
}

export function claimEndless(s: GameState): PassReward | null {
  if (endlessReady(s) <= 0) return null;
  s.pass.endless++;
  return ENDLESS_REWARD;
}

export function passClaimable(s: GameState): number {
  const { step } = passProgress(s);
  let n = endlessReady(s);
  for (let k = 1; k <= step; k++) {
    if (!s.pass.free.includes(k)) n++;
    if (s.pass.premium && !s.pass.prem.includes(k)) n++;
  }
  return n;
}

/** Every reward reached but not taken (used when a season ends). */
function leftovers(s: GameState): PassReward[] {
  const out: PassReward[] = [];
  const { step } = passProgress(s);
  for (let k = 1; k <= step; k++) {
    if (!s.pass.free.includes(k)) out.push(FREE[k - 1]);
    if (s.pass.premium && !s.pass.prem.includes(k)) out.push(PREMIUM[k - 1]);
  }
  for (let k = endlessReady(s); k > 0; k--) out.push(ENDLESS_REWARD);
  return out;
}

/**
 * Starts the current month's season if the saved one is older. Pays out what was left on
 * the old track; returns the chest levels the UI must place (empty when nothing changed).
 */
export function ensurePass(s: GameState, now: Date): { rolled: boolean; chests: number[]; paid: PassReward } {
  const id = monthKey(toJalali(now));
  const paid = { coins: 0, gems: 0, energy: 0 };
  if (s.pass.id === id) return { rolled: false, chests: [], paid };
  const chests: number[] = [];
  if (s.pass.id) {
    for (const r of leftovers(s)) {
      pay(s, r);
      paid.coins += r.coins ?? 0;
      paid.gems += r.gems ?? 0;
      paid.energy += r.energy ?? 0;
      if (r.chest) chests.push(r.chest);
    }
  }
  const rolled = s.pass.id !== '';
  s.pass = { ...emptyPass(), id };
  return { rolled, chests, paid };
}

export const grantPremium = (s: GameState) => {
  s.pass.premium = true;
};
