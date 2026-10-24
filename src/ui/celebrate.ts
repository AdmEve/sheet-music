// Celebration effects: confetti showers and light bursts for level-ups, finished episodes
// and other big moments. Pieces are plain DOM with Web Animations (kept few enough for
// low-end phones) and remove themselves when done.

import { animDone, h } from './dom';

const COLORS = ['#ffd36b', '#ff7a9c', '#5fe0e0', '#9be36b', '#c58bff', '#ff9f43', '#ffffff'];

/** A shower of paper confetti from the top of the screen (or bursting from a point). */
export function confetti(count = 46, from?: { x: number; y: number }): void {
  const w = window.innerWidth;
  const hgt = window.innerHeight;
  for (let k = 0; k < count; k++) {
    const size = 6 + Math.random() * 6;
    const el = h('div', {
      class: 'confetti',
      style: `width:${size}px;height:${size * (0.4 + Math.random() * 0.5)}px;background:${COLORS[k % COLORS.length]};` +
        `left:${from ? from.x : Math.random() * w}px;top:${from ? from.y : -20}px`,
    });
    document.body.append(el);
    const dx = from ? (Math.random() - 0.5) * w * 0.9 : (Math.random() - 0.5) * 120;
    const dy = from ? hgt * (0.35 + Math.random() * 0.5) : hgt + 40;
    const lift = from ? -120 - Math.random() * 160 : 0;
    const spin = (Math.random() - 0.5) * 1440;
    const ms = 1400 + Math.random() * 1200;
    const anim = el.animate(
      [
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${dx * 0.5}px, ${lift}px) rotate(${spin * 0.4}deg)`, opacity: 1, offset: from ? 0.3 : 0.5 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${spin}deg)`, opacity: 0.2 },
      ],
      { duration: ms, delay: Math.random() * (from ? 120 : 500), easing: 'cubic-bezier(.25,.6,.4,1)', fill: 'backwards' },
    );
    animDone(anim, ms + 600).then(() => el.remove());
  }
}

/** Slowly turning sun rays, placed behind a hero picture. */
export const rays = () => h('div', { class: 'rays' });

/** A bright flash centred on a rectangle (chest opening, big merges). */
export function flash(at: DOMRect, size = 1): void {
  const el = h('div', {
    class: 'flash-burst',
    style: `left:${at.left + at.width / 2}px;top:${at.top + at.height / 2}px;width:${120 * size}px;height:${120 * size}px`,
  });
  document.body.append(el);
  setTimeout(() => el.remove(), 700);
}
