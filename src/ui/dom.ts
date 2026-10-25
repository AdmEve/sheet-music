import { duckMusic, sfx } from '../audio';
import { fa } from '../fa';
import { haptic } from '../haptics';
import { icon, type IconName } from './icons';

export type Child = Node | string | null | undefined | false;

/** Tiny element builder: h('div', { class: 'x', onclick }, ...children). */
export function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, unknown> = {}, ...kids: Child[]): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') {
      el.addEventListener(k.slice(2), (e) => { sfx.unlock(); (v as (e: Event) => void)(e); });
    } else if (k === 'class') el.className = String(v);
    else if (k === 'style') el.setAttribute('style', String(v));
    else el.setAttribute(k, String(v));
  }
  for (const c of kids) if (c !== null && c !== undefined && c !== false) el.append(c);
  return el;
}

/** A button that clicks, buzzes and springs. */
export function btn(cls: string, content: Child[], onClick: () => void, sound = true): HTMLButtonElement {
  const b = h('button', { class: `btn ${cls}` }, ...content);
  b.addEventListener('click', () => {
    sfx.unlock();
    if (sound) sfx.tap();
    haptic('light');
    onClick();
  });
  return b;
}

export const root = (): HTMLElement => document.getElementById('app')!;

// ───────────────────────── modals ─────────────────────────

export interface ModalHandle { close: () => void; el: HTMLElement }
type ModalEl = HTMLElement & { close?: () => void; closable?: boolean };
export const modalStack: ModalEl[] = [];

export function modal(title: string | null, content: HTMLElement, opts: { closable?: boolean; onClose?: () => void; cls?: string } = {}): ModalHandle {
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    back.classList.add('out');
    setTimeout(() => back.remove(), 220);
    modalStack.splice(modalStack.indexOf(back), 1);
    if (!modalStack.length) duckMusic(false);
    opts.onClose?.();
  };
  const panel = h('div', { class: `modal ${opts.cls ?? ''}` },
    title ? h('div', { class: 'ribbon' }, h('span', {}, title)) : null,
    opts.closable !== false ? btn('modal-x', [icon('close')], close) : null,
    content);
  const back = h('div', { class: 'modal-back' }, panel) as ModalEl;
  back.close = close;
  back.closable = opts.closable !== false;
  back.addEventListener('click', (e) => { if (e.target === back && back.closable) close(); });
  root().append(back);
  modalStack.push(back);
  duckMusic(true);
  sfx.open();
  return { close, el: panel };
}

export function closeTopModal(): boolean {
  const top = modalStack[modalStack.length - 1];
  if (!top) return false;
  if (top.closable) top.close?.();
  return true;
}

export function toast(text: string, ic?: IconName) {
  const t = h('div', { class: 'toast' }, ic ? icon(ic) : null, h('span', {}, text));
  root().append(t);
  setTimeout(() => t.classList.add('out'), 1700);
  setTimeout(() => t.remove(), 2100);
}

// ───────────────────────── counters & flying coins ─────────────────────────

/** Count a number up/down in an element with ticks. */
export function tickTo(el: HTMLElement, from: number, to: number, ms = 700, prefix = '') {
  const start = performance.now();
  let lastTick = 0;
  const step = (now: number) => {
    const k = Math.min(1, (now - start) / ms);
    const v = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
    el.textContent = prefix + fa(v);
    if (now - lastTick > 60 && k < 1) { sfx.tick(); lastTick = now; }
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/**
 * Coins burst out of `from` and fly in an arc into the coin counter; the counter bumps and
 * ticks up as they land.
 */
export function flyCoins(from: DOMRect | { x: number; y: number }, amount: number, onDone?: () => void, kind: IconName = 'coin') {
  const target = document.querySelector(kind === 'coin' ? '.pill.coins .ic' : '.pill.lives .ic');
  const sx = 'width' in from ? from.x + from.width / 2 : from.x;
  const sy = 'width' in from ? from.y + from.height / 2 : from.y;
  if (!target) { onDone?.(); return; }
  const tr = target.getBoundingClientRect();
  const tx = tr.x + tr.width / 2, ty = tr.y + tr.height / 2;
  const n = Math.min(12, Math.max(4, Math.round(amount / 10)));
  let landed = 0;
  for (let i = 0; i < n; i++) {
    const c = icon(kind, 'fly');
    root().append(c);
    const ang = Math.random() * Math.PI * 2;
    const r = 30 + Math.random() * 40;
    const mx = sx + Math.cos(ang) * r, my = sy + Math.sin(ang) * r;
    const anim = c.animate([
      { transform: `translate(${sx}px, ${sy}px) scale(0.3)`, opacity: 0 },
      { transform: `translate(${mx}px, ${my}px) scale(1.1)`, opacity: 1, offset: 0.3 },
      { transform: `translate(${(mx + tx) / 2}px, ${Math.min(my, ty) - 60}px) scale(1)`, opacity: 1, offset: 0.65 },
      { transform: `translate(${tx}px, ${ty}px) scale(0.6)`, opacity: 0.9 },
    ], { duration: 750 + i * 45, easing: 'cubic-bezier(.45,.05,.55,.95)', delay: i * 35, fill: 'forwards' });
    anim.onfinish = () => {
      c.remove();
      landed++;
      sfx.coin();
      const pill = target.closest('.pill');
      pill?.classList.remove('bump');
      void (pill as HTMLElement | null)?.offsetWidth;
      pill?.classList.add('bump');
      if (landed === n) onDone?.();
    };
  }
}

// ───────────────────────── screen transitions ─────────────────────────

/** Circle wipe: cover the screen from a point, swap content, uncover. */
export function transition(swap: () => void, at?: { x: number; y: number }) {
  const x = at?.x ?? window.innerWidth / 2, y = at?.y ?? window.innerHeight / 2;
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const cover = h('div', { class: 'wipe' }, h('div', { class: 'wipe-logo' }, icon('paw')));
  root().append(cover);
  sfx.whoosh();
  const a = cover.animate([{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${r}px at ${x}px ${y}px)` }], { duration: 320, easing: 'cubic-bezier(.6,0,.4,1)', fill: 'forwards' });
  a.onfinish = () => {
    swap();
    cover.style.clipPath = 'none';
    root().append(cover);
    setTimeout(() => {
      const b = cover.animate([{ clipPath: `circle(${r}px at 50% 50%)` }, { clipPath: 'circle(0px at 50% 50%)' }], { duration: 380, easing: 'cubic-bezier(.6,0,.4,1)', fill: 'forwards' });
      b.onfinish = () => cover.remove();
    }, 60);
  };
}

/** Speech bubble from the mascot, used by the tutorial. Returns a remover. */
export function coach(host: HTMLElement, text: string, avatar?: HTMLElement): () => void {
  const el = h('div', { class: 'coach' }, h('div', { class: 'coach-cat' }, avatar ?? icon('paw')), h('div', { class: 'coach-text' }, text));
  host.append(el);
  return () => { el.classList.add('out'); setTimeout(() => el.remove(), 250); };
}
