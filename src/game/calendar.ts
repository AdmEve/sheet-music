// Persian (Jalali) calendar helpers. Seasons and events follow the Persian months, and the
// game is offline, so the schedule is computed from the device date. The conversion is the
// standard arithmetic one (valid for 1979–2100 and well beyond); no Intl calendar support
// is assumed, because old Android WebViews in Iran often lack it.

export interface JDate {
  y: number;
  /** 1 = Farvardin … 12 = Esfand */
  m: number;
  d: number;
}

export const MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

const G_DAYS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

/** Gregorian (local date of `date`) → Jalali. */
export function toJalali(date: Date): JDate {
  let gy = date.getFullYear();
  const gm = date.getMonth() + 1;
  const gd = date.getDate();
  let jy = gy <= 1600 ? 0 : 979;
  gy -= gy <= 1600 ? 621 : 1600;
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days = 365 * gy + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) - 80 + gd + G_DAYS[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const m = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const d = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return { y: jy, m, d };
}

const DAY = 86_400_000;

/** Local midnight that starts the next Jalali month after `now`. */
export function monthEnd(now: Date): Date {
  const start = toJalali(now);
  const t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  for (let k = 1; k <= 32; k++) {
    const next = new Date(t.getTime() + k * DAY);
    if (toJalali(next).m !== start.m) return new Date(next.getFullYear(), next.getMonth(), next.getDate());
  }
  return new Date(t.getTime() + 31 * DAY);
}

/** "1405-8": one key per Persian month. */
export const monthKey = (j: JDate) => `${j.y}-${j.m}`;
