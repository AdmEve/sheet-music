import { drawCat } from '../gfx/sprites';
import { fa } from '../fa';
import { buildLevel } from '../game/levelgen';
import { PALETTE } from '../game/palette';
import { LEVELS_PER_CHAPTER, chapterOf, dailyAvailable, save } from '../save';
import { openDaily, openGallery, openLives, openSettings, openShop } from './dialogs';
import { btn, h } from './dom';
import { coinPill, livesPill, refreshLives, starPill } from './hud';
import { icon } from './icons';
import { nav, screenEl } from './nav';

let timer = 0;

/** The animated mascot: sits on a cushion, breathes, blinks, looks around and waves its ears. */
export function mascotCanvas(size: number, color = 1, opts: { cushion?: boolean; mood?: 'normal' | 'happy' | 'sad' } = {}): HTMLCanvasElement {
  const c = h('canvas', { class: 'mascot' });
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  c.width = size * dpr;
  c.height = size * dpr;
  c.style.width = c.style.height = size + 'px';
  const ctx = c.getContext('2d')!;
  let t = Math.random() * 3;
  let last = performance.now();
  let started = false;
  const draw = (now: number) => {
    if (started && !c.isConnected) return;
    started = true;
    t += Math.min(0.05, (now - last) / 1000);
    last = now;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    const r = size * 0.3;
    const cy = size * 0.5;
    if (opts.cushion !== false) {
      const g = ctx.createLinearGradient(0, cy + r * 0.7, 0, cy + r * 1.3);
      g.addColorStop(0, '#e2513f');
      g.addColorStop(1, '#8f2219');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(size / 2, cy + r * 1.02, r * 1.35, r * 0.32, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffcf5a';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(size / 2, cy + r * 1.0, r * 1.15, r * 0.2, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    const breathe = 1 + Math.sin(t * 2.2) * 0.025;
    const look = Math.sin(t * 0.7) * 0.8;
    const mood = opts.mood ?? 'normal';
    const blink = t % 4.2 < 0.13;
    drawCat(ctx, size / 2, cy, r, color, {
      expr: mood === 'happy' ? 'happy' : mood === 'sad' ? 'sad' : blink ? 'blink' : (t % 9) > 7.6 ? 'happy' : 'normal',
      lookX: look, lookY: 0.2, squash: breathe, shadow: opts.cushion === false,
    });
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
  return c;
}

/** The next picture as a mystery silhouette inside a Persian arch. */
function nextPicture(levelIndex: number): HTMLElement {
  const level = buildLevel(levelIndex);
  const size = 104;
  const c = h('canvas', { class: 'silhouette' });
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  c.width = c.height = size * dpr;
  c.style.width = c.style.height = size + 'px';
  const ctx = c.getContext('2d')!;
  ctx.scale(dpr, dpr);
  const s = size / Math.max(level.w, level.h);
  // a hint of the palette: tiny dots in the picture's colours
  const colors = [...new Set(level.cells.filter((v) => v >= 0))];
  for (let y = 0; y < level.h; y++) for (let x = 0; x < level.w; x++) {
    const v = level.cells[y * level.w + x];
    if (v < 0) continue;
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.fillRect(x * s + 0.4, y * s + 0.4, s - 0.8, s - 0.8);
  }
  return h('div', { class: 'arch' + (level.hard ? ' hard' : '') },
    c,
    h('div', { class: 'qmark' }, '؟'),
    h('div', { class: 'swatches' }, ...colors.slice(0, 7).map((v) => h('i', { style: `background:${PALETTE[v].hex}` }))));
}

function chapterCard(): HTMLElement {
  const ch = chapterOf(save.level);
  const segs = h('div', { class: 'segs' });
  for (let i = 0; i < LEVELS_PER_CHAPTER; i++) {
    const lv = ch.first + i;
    const hard = buildLevel(lv).hard;
    segs.append(h('i', { class: (i < ch.done ? 'done' : i === ch.done ? 'now' : '') + (hard ? ' hard' : '') }));
  }
  return h('div', { class: 'chapter' },
    h('div', { class: 'chapter-top' },
      h('span', { class: 'chapter-no' }, `فصل ${fa(ch.index + 1)}`),
      h('b', {}, ch.name),
      h('span', { class: 'chapter-count' }, `${fa(ch.done)}/${fa(LEVELS_PER_CHAPTER)}`)),
    h('div', { class: 'chapter-bar' }, segs, icon('chest', 'chest')));
}

export function showHome() {
  nav.screen = 'home';
  const host = screenEl();
  host.innerHTML = '';
  const n = save.level + 1;
  const level = buildLevel(save.level);
  const ch = chapterOf(save.level);
  document.documentElement.style.setProperty('--sky-a', ch.sky[0]);
  document.documentElement.style.setProperty('--sky-b', ch.sky[1]);
  const play = btn('play' + (level.hard ? ' hard' : ''), [
    level.hard ? icon('flame', 'flame') : null,
    h('span', { class: 'play-main' }, `مرحله ${fa(n)}`),
    h('small', {}, level.veryHard ? 'خیلی سخت!' : level.hard ? 'مرحله سخت' : 'بزن بریم!'),
  ], () => {
    const r = play.getBoundingClientRect();
    nav.play({ from: { x: r.x + r.width / 2, y: r.y + r.height / 2 } });
  });
  const navBtn = (name: Parameters<typeof icon>[0], label: string, fn: () => void, dot = false) =>
    btn('nav-btn' + (dot ? ' dot' : ''), [icon(name), h('span', {}, label)], fn);
  host.append(h('div', { class: 'home' },
    h('div', { class: 'sparkles' }, ...Array.from({ length: 14 }, (_, i) => h('i', { style: `--i:${i};left:${(i * 37) % 100}%;animation-delay:${-i * 0.9}s` }))),
    h('div', { class: 'topbar' }, livesPill(openLives), starPill(), coinPill(() => openShop())),
    h('div', { class: 'logo' },
      h('h1', {}, h('span', { class: 'l1' }, 'پیشی'), h('span', { class: 'l2' }, 'پیکسل')),
    ),
    h('div', { class: 'hero' }, mascotCanvas(168, 1), nextPicture(save.level)),
    chapterCard(),
    h('div', { class: 'play-wrap' }, play),
    h('div', { class: 'navbar' },
      navBtn('shop', 'فروشگاه', () => openShop()),
      navBtn('gallery', 'گالری', openGallery),
      navBtn('gift', 'جایزه', openDaily, dailyAvailable()),
      navBtn('gear', 'تنظیمات', openSettings)),
    !save.starterBought && save.level >= 4
      ? btn('starter-banner', [icon('crown'), h('span', {}, 'بسته طلایی: ۲٬۵۰۰ سکه + بوستر + بدون تبلیغ'), h('b', {}, 'ببین')], () => openShop('starter'))
      : null,
  ));
  void ch;
  refreshLives();
  clearInterval(timer);
  timer = window.setInterval(() => { if (nav.screen === 'home') refreshLives(); else clearInterval(timer); }, 1000);
  if (dailyAvailable() && save.level >= 1) setTimeout(() => { if (nav.screen === 'home') openDaily(); }, 700);
}
