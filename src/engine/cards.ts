// A card is a number 0..51: suit = floor(c / 13), rank = c % 13 (0 = "2" … 12 = Ace).

export type Card = number;
export type Suit = 0 | 1 | 2 | 3;
export type Seat = 0 | 1 | 2 | 3;

export const SUITS: readonly Suit[] = [0, 1, 2, 3];
export const SEATS: readonly Seat[] = [0, 1, 2, 3];

/** Persian suit names as players say them at the table. */
export const SUIT_NAME_FA = ['پیک', 'دل', 'گشنیز', 'خشت'] as const;
export const SUIT_SYMBOL = ['♠', '♥', '♣', '♦'] as const;
export const SUIT_IS_RED = [false, true, false, true] as const;
export const RANK_LABEL = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const;
export const RANK_NAME_FA = ['دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه', 'ده', 'سرباز', 'بی‌بی', 'شاه', 'آس'] as const;

export const suitOf = (c: Card): Suit => Math.floor(c / 13) as Suit;
export const rankOf = (c: Card): number => c % 13;
export const card = (suit: Suit, rank: number): Card => suit * 13 + rank;
export const ACE = 12;

export const teamOf = (seat: Seat): 0 | 1 => (seat % 2) as 0 | 1;
/** Play goes counter-clockwise; with seat 0 at the bottom, the next seat is on the right. */
export const nextSeat = (seat: Seat): Seat => ((seat + 1) % 4) as Seat;
export const partnerOf = (seat: Seat): Seat => ((seat + 2) % 4) as Seat;

export function cardName(c: Card): string {
  return `${RANK_NAME_FA[rankOf(c)]} ${SUIT_NAME_FA[suitOf(c)]}`;
}

export function fullDeck(): Card[] {
  return Array.from({ length: 52 }, (_, i) => i);
}

/** Sort for display: suits grouped (alternating colours), high to low within a suit. */
export function sortHand(hand: Card[], trump: Suit | null = null): Card[] {
  const order: Suit[] = [0, 1, 2, 3];
  if (trump !== null) {
    order.splice(order.indexOf(trump), 1);
    order.unshift(trump);
  }
  // Keep colours alternating where possible so suits are easy to tell apart.
  const arranged: Suit[] = [];
  const pool = [...order];
  while (pool.length) {
    const lastRed = arranged.length ? SUIT_IS_RED[arranged[arranged.length - 1]] : null;
    const idx = lastRed === null ? 0 : pool.findIndex((s) => SUIT_IS_RED[s] !== lastRed);
    arranged.push(pool.splice(idx < 0 ? 0 : idx, 1)[0]);
  }
  const pos = (s: Suit) => arranged.indexOf(s);
  return [...hand].sort((a, b) => pos(suitOf(a)) - pos(suitOf(b)) || rankOf(b) - rankOf(a));
}
