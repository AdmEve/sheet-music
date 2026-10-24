// Tiny DOM helpers (no framework: the game is small and animation-heavy).

type Child = Node | string | number | null | undefined | false;
type Attrs = Record<string, string | number | boolean | EventListener | undefined>;

export function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Attrs = {}, ...children: Child[]): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v as EventListener);
    else if (k === 'html') el.innerHTML = String(v);
    else el.setAttribute(k, v === true ? '' : String(v));
  }
  for (const c of children) {
    if (c === null || c === undefined || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
export const fa = (n: number | string) => String(n).replace(/\d/g, (d) => FA_DIGITS[+d]);

/** 1234 → ۱٬۲۳۴ */
export const faNum = (n: number) => fa(Math.round(n).toLocaleString('en-US').replace(/,/g, '٬'));

export function faTime(ms: number): string {
  const s = Math.ceil(ms / 1000);
  const m = Math.floor(s / 60);
  return fa(`${m}:${String(s % 60).padStart(2, '0')}`);
}

export const svgIcon = (inner: string, cls = '') =>
  `<svg class="${cls}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

/** Like Element.append but skips null/false children. */
export function add(parent: Element, ...children: Child[]): void {
  for (const c of children) if (c !== null && c !== undefined && c !== false) parent.append(c instanceof Node ? c : String(c));
}

export function clear(el: Element): void {
  while (el.firstChild) el.removeChild(el.firstChild);
}

export const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Local calendar day as YYYY-MM-DD: the one key used for daily gifts, quests and caps. */
export const dateKey = (d: Date = new Date()) => d.toLocaleDateString('en-CA');

/**
 * Resolves when a Web Animation ends. Older Android WebViews (common in Iran, where Google
 * Play updates are unavailable) lack Animation.finished, so fall back to a timer.
 */
export function animDone(a: Animation, ms: number): Promise<void> {
  return a.finished ? a.finished.then(() => undefined, () => undefined) : wait(ms + 30);
}
