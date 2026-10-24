// The collection album («کلکسیون»): every item the player has ever owned gets a card.
// A new card pays a small reward once; finishing a whole product chain pays a bonus.

import { CHAINS, ChainId, GENERATOR_CHAINS, Item, PRODUCT_CHAINS, isGenerator, itemKey, maxLevel } from './items';
import type { GameState } from './model';

/** Album pages in display order. */
export const CODEX_CHAINS: ChainId[] = [...PRODUCT_CHAINS, ...GENERATOR_CHAINS, 'chest', 'coins', 'energy'];

export const chainKey = (chain: ChainId) => `all:${chain}`;
export const CHAIN_BONUS_GEMS = 10;

export interface Reward {
  coins?: number;
  gems?: number;
}

/** First-discovery reward: coins for the early levels, gems for the rare ones. */
export function codexReward(it: Item): Reward {
  if (isGenerator(it)) return { gems: 3 };
  if (CHAINS[it.chain].collectible || it.chain === 'chest') return { coins: 10 * it.level };
  if (it.level <= 3) return { coins: 5 * it.level };
  if (it.level === maxLevel(it.chain)) return { gems: 5 };
  return { gems: it.level <= 6 ? 1 : 3 };
}

/**
 * Records items the player now owns (unlocked on the board, or in the bag) that were never
 * seen before. Returns them in board order so the UI can celebrate each one.
 */
export function discover(s: GameState): Item[] {
  const known = new Set(s.found);
  const out: Item[] = [];
  const see = (it: Item | null | undefined) => {
    if (!it || CHAINS[it.chain].event) return;
    const k = itemKey(it);
    if (known.has(k)) return;
    known.add(k);
    s.found.push(k);
    out.push(it);
  };
  for (const c of s.board) if (!c.lock) see(c.item);
  for (const b of s.bag) see(b);
  return out;
}

export const isFound = (s: GameState, it: Item) => s.found.includes(itemKey(it));

export function chainComplete(s: GameState, chain: ChainId): boolean {
  for (let l = 1; l <= maxLevel(chain); l++) if (!s.found.includes(`${chain}:${l}`)) return false;
  return true;
}

/** Keys with a reward waiting: found-but-unclaimed items and finished product chains. */
export function codexClaimableKeys(s: GameState): string[] {
  const claimed = new Set(s.codexClaimed);
  const out = s.found.filter((k) => !claimed.has(k));
  for (const c of PRODUCT_CHAINS) if (!claimed.has(chainKey(c)) && chainComplete(s, c)) out.push(chainKey(c));
  return out;
}

export const codexClaimable = (s: GameState) => codexClaimableKeys(s).length;

/** Pays the reward for one album card (item key or chain bonus key). */
export function claimCodex(s: GameState, key: string): Reward | null {
  if (s.codexClaimed.includes(key)) return null;
  let reward: Reward;
  if (key.startsWith('all:')) {
    if (!chainComplete(s, key.slice(4) as ChainId)) return null;
    reward = { gems: CHAIN_BONUS_GEMS };
  } else {
    if (!s.found.includes(key)) return null;
    const [chain, level] = key.split(':');
    reward = codexReward({ chain: chain as ChainId, level: Number(level) });
  }
  s.codexClaimed.push(key);
  s.coins += reward.coins ?? 0;
  s.gems += reward.gems ?? 0;
  return reward;
}

/** Claims every waiting card at once; returns the summed reward. */
export function claimAllCodex(s: GameState): Reward {
  const total = { coins: 0, gems: 0 };
  for (const k of codexClaimableKeys(s)) {
    const r = claimCodex(s, k);
    total.coins += r?.coins ?? 0;
    total.gems += r?.gems ?? 0;
  }
  return total;
}
