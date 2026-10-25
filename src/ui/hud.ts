import { fa, faTime } from '../fa';
import { MAX_LIVES, hasUnlimited, save, tickLives } from '../save';
import { h } from './dom';
import { icon } from './icons';

/** Currency / lives pills shared by every screen. */
export function coinPill(onClick: () => void): HTMLElement {
  const b = h('button', { class: 'pill coins' }, icon('coin'), h('b', { class: 'coin-count' }, fa(save.coins)), h('i', { class: 'plus' }, '+'));
  b.addEventListener('click', onClick);
  return b;
}

export function livesPill(onClick: () => void): HTMLElement {
  const b = h('button', { class: 'pill lives' }, icon('heart'), h('b', { class: 'life-count' }), h('small', { class: 'life-timer' }));
  b.addEventListener('click', onClick);
  return b;
}

export function starPill(): HTMLElement {
  return h('div', { class: 'pill stars' }, icon('star'), h('b', {}, fa(save.stars)));
}

export function refreshCoins(value = save.coins) {
  document.querySelectorAll('.coin-count').forEach((el) => (el.textContent = fa(value)));
}

export function refreshLives() {
  const ms = tickLives();
  const unlimited = hasUnlimited();
  document.querySelectorAll('.life-count').forEach((el) => (el.textContent = unlimited ? '' : fa(save.lives)));
  document.querySelectorAll('.pill.lives').forEach((el) => el.classList.toggle('unlimited', unlimited));
  document.querySelectorAll('.life-timer').forEach((el) => {
    el.textContent = unlimited ? faTime(save.unlimitedUntil - Date.now()) : save.lives < MAX_LIVES ? faTime(ms) : 'پر';
  });
  if (unlimited) document.querySelectorAll('.pill.lives .ic').forEach((el) => el.setAttribute('data-inf', '∞'));
}

export { icon };
