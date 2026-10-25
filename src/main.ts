import './style.css';
import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { drawCat, drawPicture } from './art';
import { sfx, startMusic, stopMusic } from './audio';
import { PRODUCTS, type Sku } from './config';
import { fa, faTime, toman } from './fa';
import { botPick } from './game/bot';
import { buildLevel } from './game/levelgen';
import { loadPicture, pictureTitle } from './game/pictures';
import type { LevelDef } from './game/engine';
import {
  buy, iapAvailable, initMonetization, maybeInterstitial, prices, rateApp, restorePurchases, rewardedAvailable, showRewarded,
} from './monetize';
import { PlayView } from './play';
import {
  DAILY_GIFTS, MAX_LIVES, PRICES, addLife, canPlay, claimDaily, dailyAvailable, earn, hasUnlimited, loseLife, persist, save,
  spend, tickLives, today, winReward,
} from './save';

type Child = Node | string | null | undefined | false;
function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, unknown> = {}, ...kids: Child[]): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), (e) => { sfx.unlock(); (v as (e: Event) => void)(e); });
    else if (k === 'class') el.className = String(v);
    else if (k === 'style') el.setAttribute('style', String(v));
    else el.setAttribute(k, String(v));
  }
  for (const c of kids) if (c !== null && c !== undefined && c !== false) el.append(c);
  return el;
}

const root = document.getElementById('app')!;
let screen: 'home' | 'game' = 'home';
let view: PlayView | null = null;
let modalStack: HTMLElement[] = [];
let hud: { progress: HTMLElement; belt: HTMLElement; slotBtn: HTMLElement; bombBtn: HTMLElement } | null = null;
let currentLevel: LevelDef | null = null;
let revivesUsed = 0;
let freeReviveUsed = false;
let homeTimer = 0;

// ───────────────────────── modals ─────────────────────────

function modal(content: HTMLElement, opts: { closable?: boolean; onClose?: () => void } = {}): () => void {
  const close = () => {
    back.classList.add('out');
    setTimeout(() => back.remove(), 180);
    modalStack = modalStack.filter((m) => m !== back);
    opts.onClose?.();
  };
  const back = h('div', { class: 'modal-back' }, h('div', { class: 'modal' },
    opts.closable !== false ? h('button', { class: 'modal-x', onclick: () => { sfx.tap(); close(); } }, '✕') : null,
    content));
  (back as HTMLElement & { close?: () => void }).close = opts.closable !== false ? close : undefined;
  root.append(back);
  modalStack.push(back);
  return close;
}

function toast(text: string) {
  const t = h('div', { class: 'toast' }, text);
  root.append(t);
  setTimeout(() => t.classList.add('out'), 1600);
  setTimeout(() => t.remove(), 2000);
}

function coinPill() {
  return h('button', { class: 'pill coins', onclick: () => { sfx.tap(); openShop(); } }, h('span', { class: 'ico' }, '🪙'), h('b', { id: 'coin-count' }, fa(save.coins)), h('span', { class: 'plus' }, '+'));
}

function refreshCoins() {
  document.querySelectorAll('#coin-count').forEach((el) => (el.textContent = fa(save.coins)));
}

function livesText(): string {
  if (hasUnlimited()) return '∞';
  return fa(save.lives);
}

function livesPill() {
  const sub = h('small', { id: 'life-timer' });
  const pill = h('button', { class: 'pill lives', onclick: () => { sfx.tap(); openLives(); } }, h('span', { class: 'ico' }, '❤️'), h('b', { id: 'life-count' }, livesText()), sub);
  return pill;
}

function refreshLives() {
  const ms = tickLives();
  document.querySelectorAll('#life-count').forEach((el) => (el.textContent = livesText()));
  document.querySelectorAll('#life-timer').forEach((el) => {
    el.textContent = hasUnlimited() ? faTime(save.unlimitedUntil - Date.now()) : save.lives < MAX_LIVES ? faTime(ms) : 'پر';
  });
}

function mascot(size: number, color = 1): HTMLCanvasElement {
  const c = h('canvas', { class: 'mascot' });
  const dpr = Math.min(3, window.devicePixelRatio || 1);
  c.width = size * dpr;
  c.height = size * dpr;
  c.style.width = c.style.height = size + 'px';
  const ctx = c.getContext('2d')!;
  ctx.scale(dpr, dpr);
  let t = 0;
  const draw = () => {
    if (!c.isConnected && t > 0) return;
    t += 1 / 60;
    ctx.clearRect(0, 0, size, size);
    drawCat(ctx, size / 2, size * 0.56 + Math.sin(t * 2.5) * 3, size * 0.34, color, -1, { blink: t % 3.5 < 0.15, happy: t % 7 > 5.5 });
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
  return c;
}

function pictureCanvas(def: { cells: number[]; w: number; h: number }, size: number, cls = 'pic'): HTMLCanvasElement {
  const c = h('canvas', { class: cls });
  const dpr = Math.min(3, window.devicePixelRatio || 1);
  c.width = c.height = size * dpr;
  c.style.width = c.style.height = size + 'px';
  const ctx = c.getContext('2d')!;
  ctx.scale(dpr, dpr);
  drawPicture(ctx, def.cells, def.w, def.h, 0, 0, size);
  return c;
}

// ───────────────────────── home ─────────────────────────

function showHome() {
  screen = 'home';
  view?.destroy();
  view = null;
  hud = null;
  root.innerHTML = '';
  const n = save.level + 1;
  const level = buildLevel(save.level);
  const playBtn = h('button', { class: 'btn big play', onclick: () => { sfx.tap(); startLevel(); } },
    h('span', {}, 'بزن بریم!'), h('small', {}, `مرحله ${fa(n)}`));
  const dailyBtn = h('button', { class: 'tile' + (dailyAvailable() ? ' dot' : ''), onclick: () => { sfx.tap(); openDaily(); } }, h('i', {}, '🎁'), 'جایزه روزانه');
  root.append(h('div', { class: 'screen home' },
    h('div', { class: 'topbar' }, livesPill(), coinPill()),
    h('div', { class: 'logo' }, mascot(132), h('h1', {}, 'پیشی پیکسل'), h('p', {}, 'پیشی‌ها رو بفرست، تصویر رو رنگ‌به‌رنگ بترکون!')),
    h('div', { class: 'next' },
      h('div', { class: 'next-pic' + (level.hard ? ' hard' : '') }, silhouette(level)),
      level.hard ? h('div', { class: 'badge hard' }, '🔥 مرحله سخت — جایزه بیشتر') : null,
      playBtn),
    h('div', { class: 'tiles' },
      dailyBtn,
      h('button', { class: 'tile', onclick: () => { sfx.tap(); openGallery(); } }, h('i', {}, '🖼️'), 'گالری'),
      h('button', { class: 'tile', onclick: () => { sfx.tap(); openShop(); } }, h('i', {}, '🛒'), 'فروشگاه'),
      h('button', { class: 'tile', onclick: () => { sfx.tap(); openSettings(); } }, h('i', {}, '⚙️'), 'تنظیمات')),
    !save.starterBought && save.level >= 4
      ? h('button', { class: 'starter', onclick: () => { sfx.tap(); openShop(); } }, '⭐ بسته شروع طلایی: ۲٬۵۰۰ سکه + بوسترها + بدون تبلیغ')
      : null,
  ));
  refreshLives();
  clearInterval(homeTimer);
  homeTimer = window.setInterval(refreshLives, 1000);
  if (dailyAvailable() && save.level >= 1) setTimeout(openDaily, 400);
}

/** The next picture, shown as a mystery silhouette. */
function silhouette(level: LevelDef): HTMLCanvasElement {
  const cells = level.cells.map((c) => (c >= 0 ? 12 : -1));
  return pictureCanvas({ cells, w: level.w, h: level.h }, 96);
}

// ───────────────────────── game ─────────────────────────

function startLevel() {
  if (!canPlay()) { openLives(); return; }
  clearInterval(homeTimer);
  screen = 'game';
  revivesUsed = 0;
  freeReviveUsed = false;
  const level = buildLevel(save.level);
  currentLevel = level;
  root.innerHTML = '';
  const progress = h('i', {});
  const belt = h('b', {}, '');
  const slotBtn = h('button', { class: 'boost', onclick: () => useBoost('slot') });
  const bombBtn = h('button', { class: 'boost', onclick: () => useBoost('bomb') });
  hud = { progress, belt, slotBtn, bombBtn };
  const stage = h('div', { class: 'stage' });
  root.append(h('div', { class: 'screen game' },
    h('div', { class: 'gamebar' },
      h('button', { class: 'round', onclick: () => { sfx.tap(); openPause(); } }, '❚❚'),
      h('div', { class: 'lvl' }, h('span', {}, `مرحله ${fa(save.level + 1)}`, level.hard ? ' 🔥' : ''), h('div', { class: 'bar' }, progress)),
      h('div', { class: 'beltcount', title: 'ظرفیت ریل' }, '🐾 ', belt)),
    stage,
    h('div', { class: 'boostbar' }, slotBtn, bombBtn)));
  refreshBoosts();
  const hints = save.level < 3;
  view = new PlayView(stage, level, {
    onWin: () => onWin(),
    onLose: () => onLose(),
    onProgress: (p) => { progress.style.width = `${Math.round(p * 100)}%`; },
    onBelt: (n, cap) => { belt.textContent = `${fa(n)}/${fa(cap)}`; belt.parentElement!.classList.toggle('full', n >= cap); },
  }, hints);
  view.canvas.addEventListener('bombused', () => {
    save.boosts.bomb = Math.max(0, save.boosts.bomb - 1);
    persist();
    refreshBoosts();
  });
  introFor(level);
  if (new URLSearchParams(location.search).has('debug')) (window as unknown as { __pishi: unknown }).__pishi = { view, botPick };
}

function refreshBoosts() {
  if (!hud) return;
  const label = (n: number, price: number) => (n > 0 ? h('em', {}, fa(n)) : h('em', { class: 'price' }, `🪙${fa(price)}`));
  hud.slotBtn.replaceChildren(h('i', {}, '➕'), h('span', {}, 'جای اضافه'), label(save.boosts.slot, PRICES.boostSlot));
  hud.bombBtn.replaceChildren(h('i', {}, '💣'), h('span', {}, 'بمب'), label(save.boosts.bomb, PRICES.boostBomb));
  if (view?.bombMode) hud.bombBtn.classList.add('active'); else hud.bombBtn.classList.remove('active');
}

function useBoost(kind: 'slot' | 'bomb') {
  if (!view || view.game.status !== 'playing') return;
  sfx.tap();
  if (kind === 'bomb' && view.bombMode) { view.bombMode = false; refreshBoosts(); return; }
  if (kind === 'slot' && view.game.slots.length >= 8) { toast('جایگاه‌ها به حداکثر رسید'); return; }
  const have = kind === 'slot' ? save.boosts.slot : save.boosts.bomb;
  const price = kind === 'slot' ? PRICES.boostSlot : PRICES.boostBomb;
  if (have <= 0) {
    if (!spend(price)) { toast('سکه کافی نداری'); openShop(); return; }
    if (kind === 'slot') save.boosts.slot++; else save.boosts.bomb++;
    refreshCoins();
  }
  if (kind === 'slot') {
    save.boosts.slot--;
    view.game.addSlot();
    sfx.coin();
    toast('یک جایگاه اضافه شد!');
  } else {
    view.bombMode = true;
  }
  persist();
  refreshBoosts();
}

const INTRO_KEY = 'pishi-intro-seen';
function introFor(level: LevelDef) {
  let seen: string[] = [];
  try { seen = JSON.parse(localStorage.getItem(INTRO_KEY) ?? '[]'); } catch { /* none */ }
  const show = (key: string, emoji: string, title: string, text: string) => {
    if (seen.includes(key)) return false;
    seen.push(key);
    try { localStorage.setItem(INTRO_KEY, JSON.stringify(seen)); } catch { /* ignore */ }
    if (view) view.paused = true;
    modal(h('div', { class: 'intro' }, h('div', { class: 'big-emoji' }, emoji), h('h2', {}, title), h('p', {}, text),
      h('button', { class: 'btn', onclick: (e: Event) => { sfx.tap(); ((e.target as HTMLElement).closest('.modal-back') as HTMLElement & { close?: () => void }).close?.(); } }, 'فهمیدم!')),
    { onClose: () => view?.resume() });
    return true;
  };
  if (level.index === 0) {
    show('basics', '🐱', 'پیشی‌ها رو بفرست!',
      'روی پیشی جلوی هر ستون بزن تا بره روی ریل. هر پیشی فقط به بلوک‌های هم‌رنگ خودش که جلوش باشه شلیک می‌کنه. عدد روی پیشی یعنی چندتا تیر داره.');
    return;
  }
  if (level.index === 1) {
    show('slots', '📥', 'مواظب جایگاه‌ها باش!',
      'اگه پیشی دور ریل رو تموم کنه و هنوز تیر داشته باشه، میره توی جایگاه‌های پایین. هر وقت خواستی دوباره بفرستش. اگه همه جایگاه‌ها پر بشه، می‌بازی!');
    return;
  }
  if (level.hard && show('hard', '🔥', 'مرحله سخت!', 'مرحله‌های سخت جایزه بیشتری دارن. با دقت انتخاب کن کدوم پیشی اول بره.')) return;
  if (level.shooters.some((s) => s.hidden) && show('hidden', '❓', 'پیشی مرموز', 'رنگ بعضی پیشی‌ها معلوم نیست تا وقتی که بیان جلوی صف.')) return;
  if (level.hp.some((v) => v === 2) && show('ice', '🧊', 'بلوک یخی', 'بلوک‌های یخی دو تا تیر لازم دارن: اولی یخ رو می‌شکنه، دومی بلوک رو.')) return;
  if (level.shooters.some((s) => s.link !== undefined) && show('link', '🔗', 'پیشی‌های زنجیری', 'دو پیشی زنجیری فقط با هم میرن روی ریل، پس هر دوتا باید جلوی صف باشن.')) return;
}

function onWin() {
  const level = currentLevel!;
  const reward = winReward(level.index, level.hard);
  earn(reward);
  if (!save.gallery.includes(level.pictureId)) save.gallery.push(level.pictureId);
  save.level = level.index + 1;
  save.stats.wins++;
  save.stats.winsSinceAd++;
  persist();
  const pic = loadPicture(level.pictureId, level.w);
  const coinsLine = h('div', { class: 'reward' }, '🪙 ', h('b', {}, `+${fa(reward)}`));
  let doubled = false;
  const doubleBtn = rewardedAvailable()
    ? h('button', { class: 'btn ad', onclick: async () => {
      if (doubled) return;
      if (await showRewarded()) {
        doubled = true;
        earn(reward);
        sfx.coin();
        coinsLine.replaceChildren('🪙 ', h('b', {}, `+${fa(reward * 2)}`));
        doubleBtn!.remove();
      }
    } }, '🎬 دوبرابر کن!')
    : null;
  const close = modal(h('div', { class: 'win' },
    h('div', { class: 'stars' }, '✨'),
    h('h2', {}, 'آفرین! 🎉'),
    pictureCanvas({ cells: level.cells, w: level.w, h: level.h }, 150, 'pic framed'),
    h('p', { class: 'pic-title' }, `«${pic.title}» به گالری اضافه شد`),
    coinsLine,
    doubleBtn,
    h('button', { class: 'btn big', onclick: () => { sfx.tap(); close(); afterWin(); } }, 'مرحله بعد ⟵'),
  ), { closable: false });
}

async function afterWin() {
  const n = save.level;
  if (n >= 12 && save.stats.winsSinceAd >= 3) {
    save.stats.winsSinceAd = 0;
    persist();
    await maybeInterstitial();
  }
  if (n === 8 || n === 30) { askRating(); showHome(); return; }
  if (canPlay()) startLevel(); else showHome();
}

function askRating() {
  setTimeout(() => {
    const close = modal(h('div', { class: 'intro' }, mascot(90, 8), h('h2', {}, 'از پیشی پیکسل خوشت اومده؟'),
      h('p', {}, 'با ۵ ستاره توی بازار به ما انرژی بده تا مرحله‌های بیشتری بسازیم! ⭐⭐⭐⭐⭐'),
      h('button', { class: 'btn big', onclick: () => { rateApp(); earn(100); refreshCoins(); close(); toast('مرسی! ۱۰۰ سکه هدیه گرفتی 🪙'); } }, 'امتیاز می‌دم ⭐'),
      h('button', { class: 'btn ghost', onclick: () => close() }, 'بعداً')));
  }, 300);
}

function onLose() {
  save.stats.losses++;
  persist();
  const price = PRICES.revive[Math.min(revivesUsed, PRICES.revive.length - 1)];
  const revive = (how: 'coins' | 'ad') => async () => {
    if (how === 'coins') {
      if (!spend(price)) { toast('سکه کافی نداری'); openShop(); return; }
      refreshCoins();
    } else {
      if (!(await showRewarded())) { toast('تبلیغ در دسترس نیست'); return; }
      freeReviveUsed = true;
    }
    revivesUsed++;
    close();
    view?.game.addSlot();
    view?.resume();
    sfx.coin();
  };
  const close = modal(h('div', { class: 'lose' },
    mascot(100, 5),
    h('h2', {}, 'ای وای! جا نشد 😿'),
    h('p', {}, `فقط ${fa(Math.round((view?.game.remaining ?? 0)))} بلوک مونده! با یک جایگاه اضافه ادامه بده.`),
    h('button', { class: 'btn big gold', onclick: revive('coins') }, `➕ جای اضافه — 🪙${fa(price)}`),
    !freeReviveUsed && rewardedAvailable() ? h('button', { class: 'btn ad', onclick: revive('ad') }, '🎬 جای اضافه رایگان') : null,
    h('div', { class: 'row' },
      h('button', { class: 'btn ghost', onclick: async () => { close(); loseLife(); await lossAd(); if (canPlay()) startLevel(); else showHome(); } }, '↻ از اول'),
      h('button', { class: 'btn ghost', onclick: async () => { close(); loseLife(); await lossAd(); showHome(); } }, '🏠 خانه')),
    h('small', { class: 'muted' }, hasUnlimited() ? 'جان بی‌نهایت داری 😎' : 'شروع دوباره یک ❤️ کم می‌کنه'),
  ), { closable: false });
}

async function lossAd() {
  if (save.level >= 7) await maybeInterstitial();
}

function openPause() {
  if (!view) return;
  view.paused = true;
  const close = modal(h('div', { class: 'pause' },
    h('h2', {}, 'مکث'),
    toggles(),
    h('button', { class: 'btn big', onclick: () => { close(); } }, '▶ ادامه'),
    h('div', { class: 'row' },
      h('button', { class: 'btn ghost', onclick: () => { close(); if (view && view.game.progress() > 0) loseLife(); if (canPlay()) startLevel(); else showHome(); } }, '↻ از اول'),
      h('button', { class: 'btn ghost', onclick: () => { close(); if (view && view.game.progress() > 0) loseLife(); showHome(); } }, '🏠 خانه')),
    h('small', { class: 'muted' }, 'خروج از مرحله‌ی شروع‌شده یک ❤️ کم می‌کنه'),
  ), { onClose: () => view?.resume() });
}

// ───────────────────────── menus ─────────────────────────

function toggles(): HTMLElement {
  const item = (key: 'sound' | 'music' | 'haptics', label: string) => {
    const b = h('button', { class: 'toggle' + (save.settings[key] ? ' on' : '') }, label);
    b.addEventListener('click', () => {
      save.settings[key] = !save.settings[key];
      persist();
      b.classList.toggle('on', save.settings[key]);
      if (key === 'music') { if (save.settings.music) startMusic(); else stopMusic(); }
      sfx.tap();
    });
    return b;
  };
  return h('div', { class: 'toggles' }, item('sound', '🔊 صدا'), item('music', '🎵 موسیقی'), item('haptics', '📳 لرزش'));
}

function openSettings() {
  modal(h('div', { class: 'settings' },
    h('h2', {}, 'تنظیمات'),
    toggles(),
    h('button', { class: 'btn ghost', onclick: async () => { await restorePurchases(); toast('خریدها بازیابی شد'); showHome(); } }, 'بازیابی خریدها'),
    h('button', { class: 'btn ghost', onclick: () => rateApp() }, '⭐ امتیاز به بازی'),
    h('p', { class: 'muted' }, `پیشی پیکسل — نسخه ${fa(__APP_VERSION__)}`),
    h('p', { class: 'muted' }, `مرحله ${fa(save.level + 1)} · ${fa(save.gallery.length)} تصویر کامل‌شده`),
  ));
}

function openGallery() {
  const grid = h('div', { class: 'gallery' });
  if (!save.gallery.length) grid.append(h('p', { class: 'muted' }, 'هنوز تصویری کامل نکردی. بزن بریم!'));
  for (const id of save.gallery) {
    const p = loadPicture(id, 16);
    grid.append(h('div', { class: 'gitem' }, pictureCanvas(p, 72), h('span', {}, pictureTitle(id))));
  }
  modal(h('div', {}, h('h2', {}, `گالری (${fa(save.gallery.length)})`), grid));
}

function openDaily() {
  const available = dailyAvailable();
  const y = new Date(Date.now() - 86400000);
  const yesterday = `${y.getFullYear()}-${y.getMonth() + 1}-${y.getDate()}`;
  const nextDay = available ? (save.daily.last === yesterday ? (save.daily.streak % 7) + 1 : 1) : save.daily.streak;
  const days = h('div', { class: 'days' }, ...DAILY_GIFTS.map((g, i) => h('div', {
    class: 'day' + (i + 1 < nextDay || (!available && i + 1 === nextDay) ? ' got' : '') + (available && i + 1 === nextDay ? ' now' : '') + (i === 6 ? ' big' : ''),
  }, h('small', {}, `روز ${fa(i + 1)}`), h('b', {}, i === 6 ? '🎁' : '🪙'), h('span', {}, fa(g)))));
  const close = modal(h('div', { class: 'daily' },
    h('h2', {}, 'جایزه روزانه'),
    h('p', { class: 'muted' }, 'هر روز سر بزن، جایزه‌ها بزرگ‌تر میشن! روز هفتم: بمب هدیه 💣'),
    days,
    available
      ? h('button', { class: 'btn big gold', onclick: () => {
        const g = claimDaily();
        sfx.coin();
        close();
        toast(`🪙 ${fa(g)} سکه گرفتی!`);
        refreshCoins();
        const tile = document.querySelector('.tile.dot');
        tile?.classList.remove('dot');
      } }, 'دریافت جایزه')
      : h('p', {}, 'جایزه امروز رو گرفتی. فردا برگرد! 😺'),
  ));
}

function openLives() {
  const ms = tickLives();
  const full = save.lives >= MAX_LIVES || hasUnlimited();
  const close = modal(h('div', { class: 'lives-m' },
    h('div', { class: 'big-emoji' }, '❤️'),
    h('h2', {}, full ? 'جان‌هات پره!' : `${fa(save.lives)} از ${fa(MAX_LIVES)} جان`),
    !full ? h('p', { class: 'muted' }, `جان بعدی تا ${faTime(ms)} دیگه`) : null,
    !full ? h('button', { class: 'btn big gold', onclick: () => {
      if (!spend(PRICES.refillLives)) { toast('سکه کافی نداری'); openShop(); return; }
      addLife(MAX_LIVES); close(); refreshCoins(); refreshLives(); toast('جان‌ها پر شد!');
    } }, `پر کردن جان‌ها — 🪙${fa(PRICES.refillLives)}`) : null,
    !full && rewardedAvailable() ? h('button', { class: 'btn ad', onclick: async () => {
      if (await showRewarded()) { addLife(1); close(); refreshLives(); toast('یک جان گرفتی ❤️'); }
    } }, '🎬 یک جان رایگان') : null,
    h('button', { class: 'btn ghost', onclick: () => { close(); openShop(); } }, '♾️ جان بی‌نهایت ۲۴ ساعته'),
  ));
}

function priceLabel(sku: Sku, fallback: number): string {
  return prices[sku] ?? toman(fallback);
}

function openShop() {
  const list = h('div', { class: 'shop' });
  for (const p of PRODUCTS) {
    if (p.sku === 'starter_pack' && save.starterBought) continue;
    if (p.sku === 'no_ads' && save.noAds) continue;
    const desc =
      p.sku === 'starter_pack' ? '۲٬۵۰۰ سکه + ۳ بمب + ۳ جای اضافه + بدون تبلیغ + ۶ ساعت جان بی‌نهایت'
      : p.sku === 'no_ads' ? 'دیگه هیچ تبلیغی بین مرحله‌ها نمی‌بینی'
      : p.sku === 'lives_24h' ? 'یک روز کامل بدون نگرانی از جان'
      : 'برای جای اضافه، بمب و ادامه دادن';
    const icon = p.sku.startsWith('coins') ? (p.coins >= 8000 ? '💰' : p.coins >= 3000 ? '🪙🪙' : '🪙') : p.sku === 'no_ads' ? '🚫' : p.sku === 'lives_24h' ? '♾️' : '⭐';
    list.append(h('div', { class: 'item' + (p.sku === 'starter_pack' ? ' starter-item' : '') },
      'badge' in p ? h('span', { class: 'tag' }, p.badge) : null,
      h('div', { class: 'icon' }, icon),
      h('div', { class: 'txt' }, h('b', {}, p.title), h('small', {}, desc)),
      h('button', { class: 'btn buy', onclick: async () => {
        if (!iapAvailable()) { toast('برای خرید، بازار باید روی گوشی نصب باشه'); return; }
        if (await buy(p.sku)) { sfx.coin(); toast('خرید موفق! ممنون که از ما حمایت کردی 💜'); refreshCoins(); refreshLives(); close(); if (screen === 'home') showHome(); }
      } }, priceLabel(p.sku, p.fallbackPrice))));
  }
  if (rewardedAvailable()) {
    const d = today();
    if (save.freeCoinAds.day !== d) save.freeCoinAds = { day: d, count: 0 };
    const left = 3 - save.freeCoinAds.count;
    if (left > 0) list.prepend(h('div', { class: 'item free' },
      h('div', { class: 'icon' }, '🎬'),
      h('div', { class: 'txt' }, h('b', {}, '۴۰ سکه رایگان'), h('small', {}, `با دیدن یک تبلیغ — ${fa(left)} بار دیگه امروز`)),
      h('button', { class: 'btn buy ad', onclick: async () => {
        if (await showRewarded()) { save.freeCoinAds.count++; earn(40); sfx.coin(); refreshCoins(); close(); openShop(); }
      } }, 'رایگان')));
  }
  const close = modal(h('div', {}, h('h2', {}, 'فروشگاه'), h('div', { class: 'balance' }, '🪙 ', h('b', { id: 'coin-count' }, fa(save.coins))), list));
}

// ───────────────────────── boot ─────────────────────────

declare const __APP_VERSION__: string;

function onBack() {
  const top = modalStack[modalStack.length - 1] as (HTMLElement & { close?: () => void }) | undefined;
  if (top) { top.close?.(); return; }
  if (screen === 'game') { openPause(); return; }
  CapApp.exitApp().catch(() => {});
}

async function boot() {
  if (Capacitor.isNativePlatform()) {
    StatusBar.setStyle({ style: Style.Light }).catch(() => {});
    StatusBar.setBackgroundColor({ color: '#ffd9e4' }).catch(() => {});
    CapApp.addListener('backButton', onBack);
    CapApp.addListener('pause', () => { if (view) view.paused = true; stopMusic(); });
    CapApp.addListener('resume', () => { if (save.settings.music) startMusic(); if (screen === 'game' && !modalStack.length) openPause(); });
  }
  await document.fonts?.load('900 20px Vazirmatn').catch(() => {});
  showHome();
  SplashScreen.hide().catch(() => {});
  const startAudio = () => {
    sfx.unlock();
    if (save.settings.music) startMusic();
    window.removeEventListener('pointerdown', startAudio);
  };
  window.addEventListener('pointerdown', startAudio);
  initMonetization().then(() => { if (screen === 'home') { refreshCoins(); } }).catch(() => {});
}

void boot();
