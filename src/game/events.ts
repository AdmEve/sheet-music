// Live events, scheduled offline from the device date. One event is always running:
// a weekly theme (Saturday to Friday, rotating lavashak / kites / ash / ice cream), replaced by
// the calendar ones when they come round: back to school (25 Shahrivar – 3 Mehr), Yalda
// (25 Azar – 1 Dey), Chaharshanbe Suri (the week ending on the year's last Wednesday) and
// Nowruz (from the day after Suri to 13 Farvardin).
//
// While an event runs, its generator sits on the board. Tapping it (1 energy) drops event
// items; merging them earns points (the new level), tapping a top-level item collects it
// for EVENT_COLLECT points, and every delivered order adds EVENT_ORDER points. Points fill
// a 12-step milestone track; finishing it earns the event's trophy. When the event ends,
// leftover event items turn into coins and unclaimed milestones are paid out.

import { DAY_MS, toJalali } from './calendar';
import { CHAINS, ChainId, Item, maxLevel } from './items';
import type { GameState } from './model';
import type { PassReward } from './pass';

export type ThemeId = 'yalda' | 'nowruz' | 'kite' | 'lavashak' | 'ash' | 'icecream' | 'suri' | 'school';

export interface Theme {
  id: ThemeId;
  title: string;
  chain: ChainId;
  gen: ChainId;
  /** One line under the title in the event window. */
  blurb: string;
  /** Short scene the first time the event opens. */
  intro: { who: string; text: string }[];
}

export const THEMES: Record<ThemeId, Theme> = {
  yalda: {
    id: 'yalda', title: 'شب یلدا', chain: 'yalda', gen: 'genYalda',
    blurb: 'بلندترین شب سال، دور هم، با انار و هندونه و فال حافظ.',
    intro: [
      { who: 'golab', text: 'بچه‌ها، امسال شب یلدا همه بیاید خونه‌ی من. مثل قدیما، دور کرسی!' },
      { who: 'mahin', text: 'آجیلش با من! البته یه کم‌شو از مغازه‌ی آقا مرتضی قرض می‌گیرم.' },
      { who: 'morteza', text: 'شنیدم‌ها خانم!' },
      { who: 'narges', text: 'سبد یلدا رو گذاشتم کنار مولدها. انارها رو ادغام کنیم تا سفره‌ی یلدا کامل شه!' },
    ],
  },
  nowruz: {
    id: 'nowruz', title: 'نوروز', chain: 'nowruz', gen: 'genNowruz',
    blurb: 'سال نو، سفره‌ی هفت‌سین کوچه رو با هم بچینیم.',
    intro: [
      { who: 'narges', text: 'بوی عید میاد! امسال سفره‌ی هفت‌سین کوچه رو با هم می‌چینیم.' },
      { who: 'shirin', text: 'ماهی قرمزش با من! اسمشم می‌ذارم… فرخی!' },
      { who: 'farokhi', text: '…خیلی بامزه بود.' },
      { who: 'golab', text: 'خونه‌تکونی یادتون نره مادر. سال نو، دل نو.' },
    ],
  },
  kite: {
    id: 'kite', title: 'بادبادک‌بازی', chain: 'kite', gen: 'genKite',
    blurb: 'بچه‌های کوچه جمعه بادبادک‌بازی دارن، کمکشون کن!',
    intro: [
      { who: 'reza', text: 'جمعه بچه‌های کوچه می‌خوان بادبادک هوا کنن. دست تنهان!' },
      { who: 'kaveh', text: 'من یه طرح بادبادک طاووسی دارم. فقط کاغذ رنگی و نخ لازمه.' },
      { who: 'narges', text: 'جعبه‌ی کاردستی رو آوردم. بزن بریم!' },
    ],
  },
  lavashak: {
    id: 'lavashak', title: 'لواشک‌پزون', chain: 'lavashak', gen: 'genLavashak',
    blurb: 'آلوچه‌ها رسیدن! لواشک کاشونی ننه‌گلاب رو درست کن.',
    intro: [
      { who: 'golab', text: 'آلوچه‌ها رسیدن! بیاید لواشک کاشونی درست کنیم، مثل جوونیای من.' },
      { who: 'morteza', text: 'بعدش تو مغازه می‌فروشیمشون… یعنی، برای کوچه نگهشون می‌داریم دیگه!' },
      { who: 'narges', text: 'زنبیل میوه آماده‌ست. آلوچه‌ها رو ادغام کن تا سبد سوغاتی درست شه!' },
    ],
  },
  ash: {
    id: 'ash', title: 'آش‌پزون محله', chain: 'ash', gen: 'genAsh',
    blurb: 'یه دیگ آش رشته برای کل کوچه، با کشک و پیازداغ و نعناداغ.',
    intro: [
      { who: 'golab', text: 'هوا سرد شده. بیاید یه دیگ آش رشته بار بذاریم، برای کل محله!' },
      { who: 'reza', text: 'رشته‌ش با من. نون سنگک داغ هم کنارش!' },
      { who: 'mahin', text: 'کشکش رو من میارم. پیازداغش هم با آقا مرتضی… مجانی!' },
      { who: 'morteza', text: 'مجانی؟! … باشه، برای محله. ولی فقط همین یه بار!' },
    ],
  },
  icecream: {
    id: 'icecream', title: 'بستنی سنتی', chain: 'icecream', gen: 'genIcecream',
    blurb: 'بستنی زعفرونی با پسته و فالوده‌ی شیرازی، برای همه‌ی بچه‌های کوچه.',
    intro: [
      { who: 'shirin', text: 'کی پایه‌ست بستنی سنتی درست کنیم؟ زعفرونی، با پسته!' },
      { who: 'kaveh', text: 'بستنی‌ساز دستی پدربزرگم رو دارم. فقط باید بچرخونیمش… خیلی!' },
      { who: 'narges', text: 'بستنی‌ساز رو گذاشتم کنار مولدها. شیر و زعفرون رو ادغام کن تا گاری بستنی راه بیفته!' },
    ],
  },
  suri: {
    id: 'suri', title: 'چهارشنبه‌سوری', chain: 'suri', gen: 'genSuri',
    blurb: 'آخرین سه‌شنبه‌شب سال: آتیش، قاشق‌زنی و آجیل مشکل‌گشا. ترقه ممنوع!',
    intro: [
      { who: 'mahin', text: 'چهارشنبه‌سوریه! امسال کی از رو آتیش می‌پره؟ آقا مرتضی، شما که سبک‌بالی!' },
      { who: 'morteza', text: 'زردی من از تو، سرخی تو از من! … فقط یه بوته‌ی کوچیک لطفاً.' },
      { who: 'golab', text: 'قاشق‌زنی یادتون نره. هر کی در زد، آجیل مشکل‌گشا داره!' },
      { who: 'narges', text: 'سبد چهارشنبه‌سوری رو گذاشتم کنار مولدها. فقط ترقه نه‌ها! با فانوس و آتیش کوچیک جشن می‌گیریم.' },
    ],
  },
  school: {
    id: 'school', title: 'بوی ماه مهر', chain: 'school', gen: 'genSchool',
    blurb: 'مدرسه‌ها دارن باز می‌شن. برای بچه‌های کوچه کیف و دفتر جور کن!',
    intro: [
      { who: 'reza', text: 'بوی ماه مهر میاد! پسرم امسال کلاس اوله، از الان دلش شور می‌زنه.' },
      { who: 'mahin', text: 'من روز اول مدرسه گریه کردم… تا کلاس پنجم!' },
      { who: 'shirin', text: 'یادته نرگس؟ «بابا آب داد»! هنوز بوی کتاب نو رو یادمه.' },
      { who: 'narges', text: 'جعبه‌ی لوازم‌التحریر رو گذاشتم کنار مولدها. ادغام کن تا بچه‌های کوچه کیف نو داشته باشن!' },
    ],
  },
};

/** Weekly themes in turn (week counted from the Unix epoch, Saturday-based). */
const WEEKLY: ThemeId[] = ['lavashak', 'kite', 'ash', 'icecream'];

export const EVENT_LEVEL = 5;
export const EVENT_ORDER = 3;
export const EVENT_COLLECT = 25;

export const MILESTONES: { cost: number; reward: PassReward }[] = [
  { cost: 20, reward: { coins: 50 } },
  { cost: 30, reward: { energy: 20 } },
  { cost: 40, reward: { gems: 5 } },
  { cost: 50, reward: { chest: 1 } },
  { cost: 60, reward: { energy: 40 } },
  { cost: 80, reward: { coins: 150 } },
  { cost: 100, reward: { gems: 10 } },
  { cost: 120, reward: { chest: 2 } },
  { cost: 140, reward: { energy: 60 } },
  { cost: 160, reward: { gems: 15 } },
  { cost: 180, reward: { chest: 2, coins: 200 } },
  { cost: 220, reward: { chest: 3, gems: 30 } },
];
export const EVENT_TOTAL = MILESTONES.reduce((a, m) => a + m.cost, 0);

export interface EventState {
  /** Event instance ("week-2026-10-24", "yalda-1405"); '' before the first. */
  id: string;
  theme: ThemeId | '';
  points: number;
  /** Milestones taken (they are taken in order). */
  claimed: number;
  /** The generator was handed out (the player joined). */
  joined: boolean;
}

export const emptyEvent = (): EventState => ({ id: '', theme: '', points: 0, claimed: 0, joined: false });

const dayNum = (d: Date) => Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY_MS);

/** The last Wednesday of the Persian year that `d` (a day in Esfand) belongs to, as a day number. */
function suriDay(d: Date): number {
  let k = 1;
  while (k < 32 && toJalali(new Date(d.getFullYear(), d.getMonth(), d.getDate() + k)).m !== 1) k++;
  const nowruz = new Date(d.getFullYear(), d.getMonth(), d.getDate() + k);
  // Wednesday is getDay() 3; if Nowruz itself is a Wednesday, Suri is the week before.
  return dayNum(nowruz) - ((nowruz.getDay() + 4) % 7 || 7);
}

const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** The calendar event (not a weekly theme) on the local day of `d`, if any. */
function calendarEvent(d: Date): { id: string; theme: ThemeId } | null {
  const j = toJalali(d);
  if ((j.m === 9 && j.d >= 25) || (j.m === 10 && j.d === 1)) return { id: `yalda-${j.y}`, theme: 'yalda' };
  if ((j.m === 6 && j.d >= 25) || (j.m === 7 && j.d <= 3)) return { id: `school-${j.y}`, theme: 'school' };
  if (j.m === 12 && j.d >= 15) {
    const suri = suriDay(d);
    if (dayNum(d) > suri) return { id: `nowruz-${j.y + 1}`, theme: 'nowruz' };
    if (dayNum(d) > suri - 7) return { id: `suri-${j.y}`, theme: 'suri' };
  }
  if (j.m === 1 && j.d <= 13) return { id: `nowruz-${j.y}`, theme: 'nowruz' };
  return null;
}

const plus = (d: Date, k: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + k);

/** Which event runs on the local day of `d`. */
export function eventForDay(d: Date): { id: string; theme: ThemeId } {
  const cal = calendarEvent(d);
  if (cal) return cal;
  // Persian week: Saturday (getDay 6) to Friday.
  let sat = plus(d, -((d.getDay() + 1) % 7));
  // A week cut down to one or two days by a calendar event joins the neighbouring full
  // week, so a weekly event never lasts just a day.
  const off = dayNum(d) - dayNum(sat);
  let a = off, b = off;
  while (a > 0 && !calendarEvent(plus(sat, a - 1))) a--;
  while (b < 6 && !calendarEvent(plus(sat, b + 1))) b++;
  if (b - a < 2) sat = plus(sat, a > 0 ? 7 : -7);
  const week = Math.floor(dayNum(sat) / 7);
  return { id: `week-${dayKey(sat)}`, theme: WEEKLY[week % WEEKLY.length] };
}

/** Local midnight when the event running at `now` gives way to the next one. */
export function eventEnd(now: Date): Date {
  const id = eventForDay(now).id;
  for (let k = 1; k <= 30; k++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + k);
    if (eventForDay(d).id !== id) return d;
  }
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 30);
}

export const isEventItem = (it: Item | null | undefined) => !!it && !!CHAINS[it.chain].event;

/** Milestones reached so far (0…12). */
export function milestonesReached(s: GameState): number {
  let left = s.event.points;
  let n = 0;
  for (const m of MILESTONES) {
    if (left < m.cost) break;
    left -= m.cost;
    n++;
  }
  return n;
}

/** Points into the next milestone and its cost (cost 0 once the track is done). */
export function eventProgress(s: GameState): { into: number; need: number } {
  let left = s.event.points;
  for (const m of MILESTONES) {
    if (left < m.cost) return { into: left, need: m.cost };
    left -= m.cost;
  }
  return { into: 0, need: 0 };
}

export const eventClaimable = (s: GameState) => milestonesReached(s) - s.event.claimed;
export const eventActive = (s: GameState) => s.event.joined && s.event.theme !== '';

export function addEventPoints(s: GameState, n: number): number {
  if (!eventActive(s) || n <= 0) return 0;
  s.event.points += n;
  return n;
}

function pay(s: GameState, r: PassReward): void {
  s.coins += r.coins ?? 0;
  s.gems += r.gems ?? 0;
  s.energy += r.energy ?? 0;
}

const trophyOf = (s: GameState) => s.event.id;

/** Takes the next reached milestone. Returns its reward (chest to be placed by the UI). */
export function claimMilestone(s: GameState): PassReward | null {
  if (eventClaimable(s) <= 0) return null;
  const m = MILESTONES[s.event.claimed++];
  pay(s, m.reward);
  if (s.event.claimed === MILESTONES.length && !s.trophies.includes(trophyOf(s))) s.trophies.push(trophyOf(s));
  return m.reward;
}

export interface EventChange {
  /** A new event started (and the player may need to see its intro). */
  started: ThemeId | null;
  /** Board cells whose event items were turned into coins. */
  cleared: number[];
  coins: number;
  /** Chest levels from unclaimed milestones of the old event. */
  chests: number[];
  /** Cell the generator was placed on (null if it went to the bag or was not given). */
  genAt: number | null;
  joined: boolean;
}

/**
 * Keeps the event state in step with the calendar. Ends the old event (event items become
 * 5 coins per level; unclaimed milestones are paid) and starts the current one. The
 * generator is handed out as soon as the player is at EVENT_LEVEL.
 * `place` puts an item on the board or in the bag and returns the cell (model.placeItem).
 */
export function ensureEvent(s: GameState, now: Date, place: (it: Item) => number | null): EventChange {
  const cur = eventForDay(now);
  const out: EventChange = { started: null, cleared: [], coins: 0, chests: [], genAt: null, joined: false };
  if (s.event.id !== cur.id) {
    if (s.event.id) {
      s.board.forEach((c, i) => {
        if (!isEventItem(c.item)) return;
        if (!CHAINS[c.item!.chain].produces) out.coins += 5 * c.item!.level;
        s.board[i] = { item: null };
        out.cleared.push(i);
      });
      s.bag = s.bag.map((b) => {
        if (!isEventItem(b)) return b;
        if (!CHAINS[b!.chain].produces) out.coins += 5 * b!.level;
        return null;
      });
      s.coins += out.coins;
      while (eventClaimable(s) > 0) {
        const r = claimMilestone(s);
        if (r?.chest) out.chests.push(r.chest);
      }
    }
    s.event = { id: cur.id, theme: cur.theme, points: 0, claimed: 0, joined: false };
    out.started = cur.theme;
  }
  if (!s.event.joined && s.level >= EVENT_LEVEL && s.event.theme) {
    s.event.joined = true;
    out.joined = true;
    out.genAt = place({ chain: THEMES[s.event.theme].gen, level: 1 });
  }
  return out;
}

/** Points for a merge that produced `it` (event items only). */
export const mergePoints = (it: Item) => (CHAINS[it.chain].event ? it.level : 0);
export const isTopEventItem = (it: Item) => !!CHAINS[it.chain].event && !CHAINS[it.chain].produces && it.level === maxLevel(it.chain);
