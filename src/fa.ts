const DIGITS = '۰۱۲۳۴۵۶۷۸۹';

/** Number in Persian digits, with thousands separators. */
export function fa(n: number | string): string {
  const s = typeof n === 'number' ? Math.round(n).toLocaleString('en-US') : n;
  return s.replace(/[0-9]/g, (d) => DIGITS[+d]).replace(/,/g, '٬');
}

export function faTime(ms: number): string {
  const t = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(t / 60), s = t % 60;
  if (m >= 60) return fa(`${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
  return fa(`${m}:${String(s).padStart(2, '0')}`);
}

export function toman(n: number): string {
  return `${fa(n)} تومان`;
}
