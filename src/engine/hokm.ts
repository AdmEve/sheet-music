// Hokm rules as a pure state machine. The same code runs offline on the phone and on the
// online server, so every rule lives here and nowhere else.
//
// Rules implemented (the common Iranian table rules):
// - 4 players, partners sit opposite (seats 0+2 vs 1+3); play goes counter-clockwise.
// - First hand: cards are dealt face up one by one; whoever gets the first Ace is Hakem.
// - Hakem receives 5 cards and names the trump (hokm); then everyone is dealt up to 13.
// - Hakem leads the first trick. Players must follow suit if they can; otherwise any card.
// - Highest trump wins the trick, else the highest card of the led suit.
// - First team to 7 tricks wins the hand: 1 point, or 2 for a Kot (7–0), or 3 if the
//   Hakem's own team is shut out (Hakem-Kot).
// - If the Hakem's team wins the hand Hakem stays; otherwise Hakem passes to the next seat.
// - First team to `targetScore` points wins the game.

import { Card, Seat, Suit, SEATS, fullDeck, nextSeat, rankOf, suitOf, teamOf } from './cards';
import { mulberry32, shuffle } from './rng';

export type Phase = 'trump' | 'play' | 'handOver' | 'gameOver';

export interface TrickPlay {
  seat: Seat;
  card: Card;
}

export interface HandResult {
  winnerTeam: 0 | 1;
  points: number;
  kot: boolean;
  hakemKot: boolean;
  tricks: [number, number];
}

export interface GameOptions {
  targetScore: number;
}

export interface GameState {
  seed: number;
  /** Advances on every shuffle so each hand gets a fresh deck from the same seed. */
  dealNo: number;
  options: GameOptions;
  phase: Phase;
  scores: [number, number];
  handNo: number;
  hakem: Seat;
  /** Cards dealt face up to choose the first Hakem (for the opening animation). */
  hakemDraw: TrickPlay[];
  trump: Suit | null;
  hands: Card[][];
  /** Cards still to be dealt after the trump is chosen. */
  stock: Card[];
  trick: TrickPlay[];
  turn: Seat;
  tricksWon: [number, number];
  lastTrick: { plays: TrickPlay[]; winner: Seat } | null;
  played: boolean[];
  /** voids[seat][suit] — seat has shown it cannot follow suit. Public knowledge. */
  voids: boolean[][];
  handResult: HandResult | null;
  winner: 0 | 1 | null;
}

export type Action =
  | { type: 'trump'; seat: Seat; suit: Suit }
  | { type: 'play'; seat: Seat; card: Card }
  | { type: 'nextHand' };

export const TRICKS_TO_WIN = 7;

function deal(state: GameState): void {
  const rand = mulberry32((state.seed ^ Math.imul(state.dealNo + 1, 0x9e3779b1)) >>> 0);
  state.dealNo++;
  const deck = shuffle(fullDeck(), rand);
  state.hands = [[], [], [], []];
  state.hands[state.hakem] = deck.slice(0, 5);
  state.stock = deck.slice(5);
  state.trump = null;
  state.trick = [];
  state.tricksWon = [0, 0];
  state.lastTrick = null;
  state.played = new Array(52).fill(false);
  state.voids = SEATS.map(() => [false, false, false, false]);
  state.handResult = null;
  state.turn = state.hakem;
  state.phase = 'trump';
}

export function newGame(seed: number, options: Partial<GameOptions> = {}, firstDealer: Seat = 0): GameState {
  const rand = mulberry32(seed);
  const deck = shuffle(fullDeck(), rand);
  const hakemDraw: TrickPlay[] = [];
  let seat = firstDealer;
  for (const c of deck) {
    hakemDraw.push({ seat, card: c });
    if (rankOf(c) === 12) break;
    seat = nextSeat(seat);
  }
  const state: GameState = {
    seed,
    dealNo: 0,
    options: { targetScore: 7, ...options },
    phase: 'trump',
    scores: [0, 0],
    handNo: 1,
    hakem: hakemDraw[hakemDraw.length - 1].seat,
    hakemDraw,
    trump: null,
    hands: [[], [], [], []],
    stock: [],
    trick: [],
    turn: 0,
    tricksWon: [0, 0],
    lastTrick: null,
    played: new Array(52).fill(false),
    voids: SEATS.map(() => [false, false, false, false]),
    handResult: null,
    winner: null,
  };
  deal(state);
  return state;
}

export function ledSuit(trick: TrickPlay[]): Suit | null {
  return trick.length ? suitOf(trick[0].card) : null;
}

export function legalCards(hand: Card[], trick: TrickPlay[]): Card[] {
  const led = ledSuit(trick);
  if (led === null) return [...hand];
  const follow = hand.filter((c) => suitOf(c) === led);
  return follow.length ? follow : [...hand];
}

/** Does `a` beat `b` given the led suit and trump? */
export function beats(a: Card, b: Card, led: Suit, trump: Suit | null): boolean {
  const sa = suitOf(a);
  const sb = suitOf(b);
  if (sa === sb) return rankOf(a) > rankOf(b);
  if (trump !== null && sa === trump) return true;
  if (trump !== null && sb === trump) return false;
  return sa === led && sb !== led;
}

export function trickWinner(trick: TrickPlay[], trump: Suit | null): TrickPlay {
  const led = suitOf(trick[0].card);
  let best = trick[0];
  for (const p of trick.slice(1)) if (beats(p.card, best.card, led, trump)) best = p;
  return best;
}

function check(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

/** Returns a new state; throws on illegal actions (the server relies on that). */
export function apply(prev: GameState, action: Action): GameState {
  const s: GameState = structuredClone(prev);
  switch (action.type) {
    case 'trump': {
      check(s.phase === 'trump', 'not choosing trump');
      check(action.seat === s.hakem, 'only hakem chooses trump');
      check([0, 1, 2, 3].includes(action.suit), 'bad suit');
      s.trump = action.suit;
      // Deal the rest: hakem gets 8 more, everyone else 13.
      let i = 0;
      for (const seat of SEATS) {
        const need = 13 - s.hands[seat].length;
        s.hands[seat] = s.hands[seat].concat(s.stock.slice(i, i + need));
        i += need;
      }
      s.stock = [];
      s.phase = 'play';
      s.turn = s.hakem;
      return s;
    }
    case 'play': {
      check(s.phase === 'play', 'not playing');
      check(action.seat === s.turn, 'not your turn');
      const hand = s.hands[action.seat];
      check(hand.includes(action.card), 'card not in hand');
      check(legalCards(hand, s.trick).includes(action.card), 'must follow suit');
      const led = ledSuit(s.trick);
      if (led !== null && suitOf(action.card) !== led) s.voids[action.seat][led] = true;
      s.hands[action.seat] = hand.filter((c) => c !== action.card);
      s.played[action.card] = true;
      s.trick.push({ seat: action.seat, card: action.card });
      if (s.trick.length < 4) {
        s.turn = nextSeat(action.seat);
        return s;
      }
      const win = trickWinner(s.trick, s.trump);
      const team = teamOf(win.seat);
      s.tricksWon[team]++;
      s.lastTrick = { plays: s.trick, winner: win.seat };
      s.trick = [];
      s.turn = win.seat;
      if (s.tricksWon[team] >= TRICKS_TO_WIN) finishHand(s, team);
      return s;
    }
    case 'nextHand': {
      check(s.phase === 'handOver', 'hand not over');
      const r = s.handResult!;
      if (teamOf(s.hakem) !== r.winnerTeam) s.hakem = nextSeat(s.hakem);
      s.handNo++;
      deal(s);
      return s;
    }
  }
}

function finishHand(s: GameState, winnerTeam: 0 | 1): void {
  const loser = (1 - winnerTeam) as 0 | 1;
  const kot = s.tricksWon[loser] === 0;
  const hakemKot = kot && teamOf(s.hakem) === loser;
  const points = hakemKot ? 3 : kot ? 2 : 1;
  s.scores[winnerTeam] += points;
  s.handResult = { winnerTeam, points, kot, hakemKot, tricks: [s.tricksWon[0], s.tricksWon[1]] };
  if (s.scores[winnerTeam] >= s.options.targetScore) {
    s.phase = 'gameOver';
    s.winner = winnerTeam;
  } else {
    s.phase = 'handOver';
  }
}

/** What one seat is allowed to see: other hands become counts only. */
export interface SeatView extends Omit<GameState, 'hands' | 'stock' | 'seed'> {
  me: Seat;
  myHand: Card[];
  handCounts: number[];
}

export function viewFor(s: GameState, me: Seat): SeatView {
  const { hands, stock: _stock, seed: _seed, ...rest } = s;
  return { ...structuredClone(rest), me, myHand: [...hands[me]], handCounts: hands.map((h) => h.length) };
}
