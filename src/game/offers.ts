// Paid offers and their triggers: the piggy bank («قلک»), timed bundles (starter after the
// first level-ups, a celebration bundle after each episode), the first-purchase bonus, and
// the occasional free gift for watching a video. Prices and contents live in
// platform/billing.ts; this file only decides when something is on offer.

import type { GameState } from './model';

// ---------------------------------------------------------------------------- piggy bank

export const PIGGY_LEVEL = 4;
export const PIGGY_CAP = 150;
/** Breaking a jar with less than this is not offered (it would feel like a bad deal). */
export const PIGGY_MIN = 60;
export const PIGGY_PER_ORDER = 2;

export const piggyUnlocked = (s: GameState) => s.level >= PIGGY_LEVEL;
export const piggyFull = (s: GameState) => s.piggy >= PIGGY_CAP;
export const piggyReady = (s: GameState) => s.piggy >= PIGGY_MIN;

/** Called on every delivered order. */
export function fillPiggy(s: GameState): number {
  if (!piggyUnlocked(s)) return 0;
  const add = Math.min(PIGGY_PER_ORDER, PIGGY_CAP - s.piggy);
  s.piggy += add;
  return add;
}

/** Pays out the jar (after a purchase). Returns the gems granted. */
export function breakPiggy(s: GameState): number {
  const gems = s.piggy;
  s.gems += gems;
  s.piggy = 0;
  return gems;
}

// ---------------------------------------------------------------------------- timed offers

export type OfferId = 'starter' | 'chapter';

export interface TimedOffer {
  id: OfferId;
  /** Time (ms) the offer disappears. */
  until: number;
}

export const OFFER_SKU: Record<OfferId, string> = { starter: 'starter_pack', chapter: 'offer_chapter' };
const OFFER_HOURS: Record<OfferId, number> = { starter: 48, chapter: 24 };
export const STARTER_LEVEL = 3;

export const activeOffers = (s: GameState, now: number) => s.offers.filter((o) => o.until > now);

/** Starts an offer (replacing an older copy of the same one). */
export function startOffer(s: GameState, id: OfferId, now: number): TimedOffer {
  const o = { id, until: now + OFFER_HOURS[id] * 3_600_000 };
  s.offers = [...s.offers.filter((x) => x.id !== id), o];
  return o;
}

/** Called when a level is reached: the starter pack pops up once, if never bought. */
export function offerOnLevel(s: GameState, level: number, now: number): TimedOffer | null {
  if (level < STARTER_LEVEL || s.bought.includes('starter_pack') || s.storySeen.includes('offer:starter')) return null;
  s.storySeen.push('offer:starter');
  return startOffer(s, 'starter', now);
}

/** Called when an episode is finished: a 24 h celebration bundle. */
export function offerOnEpisode(s: GameState, now: number): TimedOffer {
  return startOffer(s, 'chapter', now);
}

export function endOffer(s: GameState, id: OfferId): void {
  s.offers = s.offers.filter((o) => o.id !== id);
}

// ---------------------------------------------------------------------------- first purchase

/** The first gem pack ever bought gives double gems. */
export const firstBonusOpen = (s: GameState) => !s.bought.includes('first');

// ---------------------------------------------------------------------------- free gift

export const GIFT_LEVEL = 3;
export const GIFT_EVERY_MS = 25 * 60_000;

export type GiftReward = { energy: number } | { gems: number } | { chest: number };

/** A gift box shows up from time to time; opening it costs one rewarded video. */
export const giftReady = (s: GameState, now: number) => s.level >= GIFT_LEVEL && now >= s.giftAt;

export function openGift(s: GameState, now: number, roll: number): GiftReward {
  s.giftAt = now + GIFT_EVERY_MS;
  if (roll < 0.5) return { energy: 25 };
  if (roll < 0.8) return { gems: 3 };
  return { chest: 1 };
}

export const skipGift = (s: GameState, now: number) => {
  s.giftAt = now + GIFT_EVERY_MS;
};

// ---------------------------------------------------------------- welcome back

export const AWAY_DAYS = 2;
const DAY = 86_400_000;

export interface WelcomeGift {
  days: number;
  energy: number;
  gems: number;
  /** Chest level. */
  chest: number;
}

/** A gift for a player who comes back after AWAY_DAYS or more; `last` is when they left. */
export function welcomeBack(s: GameState, last: number, now: number): WelcomeGift | null {
  if (!last || s.level < GIFT_LEVEL) return null;
  const days = Math.floor((now - last) / DAY);
  if (days < AWAY_DAYS) return null;
  return { days, energy: 100, gems: Math.min(30, 5 * days), chest: Math.min(3, 1 + Math.floor(days / 5)) };
}
