import { sfx } from '../audio';
import { fa } from '../fa';
import type { Game, LevelDef } from '../game/engine';
import { buildLevel } from '../game/levelgen';
import { loadPicture } from '../game/pictures';
import { blockSprite, catBodySprite, drawCat, iceSprite, setSpriteScale } from '../gfx/sprites';
import { haptic } from '../haptics';
import { maybeInterstitial, rateApp, rewardedAvailable, showRewarded } from '../monetize';
import { PlayView } from '../play';
import {
  LEVELS_PER_CHAPTER, PRICES, canPlay, chapterOf, chapterReward, earn, hasUnlimited, loseLife, persist, save, spend, starsFor,
  winReward,
} from '../save';
import { openLives, openShop, toggles } from './dialogs';
import { btn, coach, flyCoins, h, modal, tickTo, toast } from './dom';
import { coinPill, refreshCoins } from './hud';
import { mascotCanvas } from './home';
import { icon } from './icons';
import { nav, screenEl } from './nav';

let view: PlayView | null = null;
let current: LevelDef | null = null;
let revivesUsed = 0;
let boostersUsed = 0;
let freeReviveUsed = false;
let boostEls: { slot: HTMLElement; bomb: HTMLElement } | null = null;
let removeCoach: (() => void) | null = null;

export const activeView = () => view;

export function startLevel() {
  if (!canPlay()) { openLives(); return; }
  nav.screen = 'game';
  revivesUsed = 0;
  boostersUsed = 0;
  freeReviveUsed = false;
  removeCoach = null;
  view?.destroy();
  const level = buildLevel(save.level);
  current = level;
  const host = screenEl();
  host.innerHTML = '';
  const progress = h('i', {});
  const pct = h('em', {}, '۰٪');
  const belt = h('b', {}, '');
  const beltPill = h('div', { class: 'belt-pill' }, icon('paw'), belt);
  const slotBtn = btn('boost', [], () => useBoost('slot'), false);
  const bombBtn = btn('boost', [], () => useBoost('bomb'), false);
  boostEls = { slot: slotBtn, bomb: bombBtn };
  const stage = h('div', { class: 'stage' });
  const screen = h('div', { class: 'game' + (level.hard ? ' hard' : '') },
    h('div', { class: 'gamebar' },
      btn('round', [icon('pause')], openPause),
      h('div', { class: 'lvl' },
        h('div', { class: 'lvl-title' }, level.hard ? icon('flame') : null, h('span', {}, `مرحله ${fa(save.level + 1)}`)),
        h('div', { class: 'bar' }, progress, pct)),
      beltPill),
    stage,
    h('div', { class: 'boostbar' }, slotBtn, bombBtn));
  host.append(screen);
  refreshBoosts();
  view = new PlayView(stage, level, {
    onWin: (g) => onWin(g),
    onLose: () => onLose(),
    onProgress: (p) => {
      progress.style.width = `${Math.round(p * 100)}%`;
      pct.textContent = `${fa(Math.floor(p * 100))}٪`;
      if (removeCoach && level.index === 0 && p > 0) { /* keep the tutorial bubble until the first launch */ }
    },
    onBelt: (n, cap) => {
      belt.textContent = `${fa(n)}/${fa(cap)}`;
      beltPill.classList.toggle('full', n >= cap);
      if (level.index === 0 && n > 0 && removeCoach) {
        removeCoach();
        removeCoach = coach(stage, 'هر پیشی فقط به بلوک‌های هم‌رنگِ خودش شلیک می‌کنه، اونم بلوکی که جلوی دیدش باشه.', mascotCanvas(54, 1, { cushion: false }));
        setTimeout(() => { removeCoach?.(); removeCoach = null; }, 5000);
      }
    },
    onDanger: (d) => screen.classList.toggle('danger', d > 0),
  }, { hints: save.level < 6, tutorial: save.level < 2 });
  view.canvas.addEventListener('bombused', () => {
    save.boosts.bomb = Math.max(0, save.boosts.bomb - 1);
    boostersUsed++;
    persist();
    refreshBoosts();
  });
  levelBanner(level, stage);
  introFor(level, stage);
}

function levelBanner(level: LevelDef, host: HTMLElement) {
  const el = h('div', { class: 'level-banner' + (level.hard ? ' hard' : '') },
    level.hard ? icon('flame') : null,
    h('b', {}, level.veryHard ? 'خیلی سخت!' : level.hard ? 'مرحله سخت!' : `مرحله ${fa(level.index + 1)}`),
    level.hard ? h('small', {}, 'جایزه بیشتر') : null);
  host.append(el);
  setTimeout(() => el.remove(), 1900);
  if (level.hard) haptic('heavy');
}

export function refreshBoosts() {
  if (!boostEls) return;
  const fill = (el: HTMLElement, name: 'slot' | 'bomb', label: string, n: number, price: number) => {
    el.replaceChildren(
      icon(name),
      h('span', {}, label),
      n > 0 ? h('em', { class: 'count' }, fa(n)) : h('em', { class: 'price' }, icon('coin'), fa(price)));
  };
  fill(boostEls.slot, 'slot', 'جای اضافه', save.boosts.slot, PRICES.boostSlot);
  fill(boostEls.bomb, 'bomb', 'بمب', save.boosts.bomb, PRICES.boostBomb);
  boostEls.bomb.classList.toggle('active', !!view?.bombMode);
}

function useBoost(kind: 'slot' | 'bomb') {
  if (!view || view.game.status !== 'playing') return;
  sfx.tap();
  if (kind === 'bomb' && view.bombMode) { view.bombMode = false; refreshBoosts(); return; }
  if (kind === 'slot' && view.game.slots.length >= 7) { toast('جایگاه‌ها به حداکثر رسید'); return; }
  const have = kind === 'slot' ? save.boosts.slot : save.boosts.bomb;
  const price = kind === 'slot' ? PRICES.boostSlot : PRICES.boostBomb;
  if (have <= 0) {
    if (!spend(price)) { toast('سکه کافی نداری', 'coin'); openShop(); return; }
    if (kind === 'slot') save.boosts.slot++; else save.boosts.bomb++;
    refreshCoins();
  }
  if (kind === 'slot') {
    save.boosts.slot--;
    boostersUsed++;
    view.game.addSlot();
    sfx.coin();
  } else {
    view.bombMode = true;
  }
  persist();
  refreshBoosts();
}

// ───────────────────────── tutorial & mechanic intros ─────────────────────────

const INTRO_KEY = 'pishi-intro-seen';

function illustration(kind: 'hidden' | 'ice' | 'link' | 'hard'): HTMLCanvasElement {
  const w = 220, hgt = 110;
  const c = h('canvas', { class: 'illus' });
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  c.width = w * dpr;
  c.height = hgt * dpr;
  c.style.width = w + 'px';
  c.style.height = hgt + 'px';
  const ctx = c.getContext('2d')!;
  ctx.scale(dpr, dpr);
  setSpriteScale(dpr);
  if (kind === 'hidden') {
    drawCat(ctx, 70, 58, 30, 0, { hidden: true });
    ctx.font = '900 30px Vazirmatn';
    ctx.fillStyle = '#7a5cc0';
    ctx.textAlign = 'center';
    ctx.fillText('←', 110, 64);
    drawCat(ctx, 150, 58, 30, 5, { ammo: 10, expr: 'happy' });
  } else if (kind === 'ice') {
    const s = 44;
    ctx.drawImage(blockSprite(6, s), 30, 30, s, s);
    ctx.drawImage(iceSprite(s, 2), 30, 30, s, s);
    ctx.drawImage(blockSprite(6, s), 88, 30, s, s);
    ctx.drawImage(iceSprite(s, 1), 88, 30, s, s);
    ctx.globalAlpha = 0.25;
    ctx.drawImage(blockSprite(6, s), 146, 30, s, s);
    ctx.globalAlpha = 1;
  } else if (kind === 'link') {
    drawCat(ctx, 70, 58, 28, 0, { ammo: 10 });
    drawCat(ctx, 150, 58, 28, 3, { ammo: 15 });
    for (let i = 0; i <= 6; i++) {
      ctx.strokeStyle = i % 2 ? '#c9952f' : '#f2cf6b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(92 + i * 6, 64 + Math.sin((i / 6) * Math.PI) * 6, 5, 3, i % 2 ? 0 : Math.PI / 2, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else {
    drawCat(ctx, 110, 60, 34, 1, { expr: 'shoot' });
    void catBodySprite;
  }
  return c;
}

function introFor(level: LevelDef, stage: HTMLElement) {
  let seen: string[] = [];
  try { seen = JSON.parse(localStorage.getItem(INTRO_KEY) ?? '[]'); } catch { /* none */ }
  const mark = (key: string) => {
    seen.push(key);
    try { localStorage.setItem(INTRO_KEY, JSON.stringify(seen)); } catch { /* ignore */ }
  };
  if (level.index === 0) {
    removeCoach = coach(stage, 'روی پیشیِ جلوی صف بزن تا بپره روی ریل!', mascotCanvas(54, 1, { cushion: false }));
    return;
  }
  if (level.index === 1 && !seen.includes('slots')) {
    mark('slots');
    const rm = coach(stage, 'پیشی‌ای که تیرش تموم نشه، میره توی جایگاه‌های پایین. اگه همه پر بشن، می‌بازی!', mascotCanvas(54, 5, { cushion: false }));
    setTimeout(rm, 6500);
    return;
  }
  const show = (key: string, kind: 'hidden' | 'ice' | 'link' | 'hard', title: string, text: string) => {
    if (seen.includes(key)) return false;
    mark(key);
    if (view) view.paused = true;
    const m = modal(title, h('div', { class: 'intro' }, illustration(kind), h('p', {}, text),
      btn('primary big', ['فهمیدم!'], () => m.close())), { onClose: () => view?.resume() });
    return true;
  };
  setTimeout(() => {
    if (level.hard && show('hard', 'hard', 'مرحله سخت', 'این مرحله‌ها سخت‌ترن ولی جایزه بیشتری دارن. قبل از هر حرکت خوب فکر کن!')) return;
    if (level.shooters.some((s) => s.hidden) && show('hidden', 'hidden', 'پیشی مرموز', 'رنگ بعضی پیشی‌ها تا وقتی به جلوی صف نرسن معلوم نیست.')) return;
    if (level.hp.some((v) => v === 2) && show('ice', 'ice', 'بلوک یخی', 'بلوک یخی دو تا تیر می‌خواد: اولی یخ رو می‌شکنه، دومی خود بلوک رو.')) return;
    if (level.shooters.some((s) => s.link !== undefined) && show('link', 'link', 'پیشی‌های زنجیری', 'دو پیشی زنجیری فقط با هم می‌پرن روی ریل، پس هر دو باید جلوی صف باشن.')) return;
  }, 1500);
}

// ───────────────────────── win ─────────────────────────

function onWin(game: Game) {
  const level = current!;
  const helpers = revivesUsed + boostersUsed;
  const stars = starsFor(helpers);
  const reward = winReward(level.index, level.hard) + (stars === 3 ? 10 : 0);
  const before = save.coins;
  earn(reward);
  if (!save.gallery.includes(level.pictureId)) save.gallery.push(level.pictureId);
  save.level = level.index + 1;
  save.stars += stars;
  save.stats.wins++;
  save.stats.winsSinceAd++;
  persist();
  const pic = loadPicture(level.pictureId, level.w);
  const balance = coinPill(() => {});
  balance.querySelector('.coin-count')!.textContent = fa(before);
  const rewardNum = h('b', {}, '+۰');
  const rewardPill = h('div', { class: 'reward' }, icon('coin'), rewardNum);
  const starRow = h('div', { class: 'star-row' }, ...[0, 1, 2].map((i) => h('div', { class: 'star-slot' + (i === 1 ? ' mid' : '') }, icon('starEmpty'), i < stars ? icon('star', 'earned') : null)));
  let doubled = false;
  const doubleBtn = rewardedAvailable()
    ? btn('ad', [icon('film'), h('span', {}, 'دوبرابر کن!')], async () => {
      if (doubled) return;
      if (await showRewarded()) {
        doubled = true;
        earn(reward);
        tickTo(rewardNum, reward, reward * 2, 600, '+');
        sfx.coin();
        doubleBtn!.classList.add('used');
      }
    })
    : null;
  const next = btn('primary big', [h('span', {}, 'ادامه'), icon('play')], () => {
    next.disabled = true;
    const gained = save.coins - before;
    flyCoins(rewardPill.getBoundingClientRect(), gained, () => {
      tickTo(balance.querySelector('.coin-count') as HTMLElement, before, save.coins, 400);
      setTimeout(() => { m.close(); afterWin(); }, 450);
    });
  });
  const m = modal('عالی بود!', h('div', { class: 'win' },
    h('div', { class: 'win-balance' }, balance),
    starRow,
    h('div', { class: 'frame' }, picCanvas(level.cells, level.w, level.h, 150), h('div', { class: 'frame-shine' })),
    h('p', { class: 'pic-title' }, `«${pic.title}» کامل شد!`),
    rewardPill,
    h('div', { class: 'win-actions' }, doubleBtn, next),
  ), { closable: false, cls: 'win-modal' });
  // stars land one by one, then the reward counts up
  m.el.querySelectorAll('.earned').forEach((el, i) => setTimeout(() => { el.classList.add('in'); sfx.star(i); haptic('light'); }, 350 + i * 330));
  setTimeout(() => tickTo(rewardNum, 0, reward, 600, '+'), 350 + stars * 330);
  void game;
}

function picCanvas(cells: number[], w: number, hgt: number, size: number): HTMLCanvasElement {
  const c = h('canvas', { class: 'pic' });
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  c.width = c.height = size * dpr;
  c.style.width = c.style.height = size + 'px';
  const ctx = c.getContext('2d')!;
  ctx.scale(dpr, dpr);
  setSpriteScale(dpr);
  const s = size / Math.max(w, hgt);
  for (let y = 0; y < hgt; y++) for (let x = 0; x < w; x++) {
    const v = cells[y * w + x];
    if (v >= 0) ctx.drawImage(blockSprite(v, s), x * s, y * s, s, s);
  }
  return c;
}

async function afterWin() {
  const n = save.level;
  // chapter finished → treasure chest
  if (n % LEVELS_PER_CHAPTER === 0 && save.chapterClaimed < n / LEVELS_PER_CHAPTER) {
    await openChest(n / LEVELS_PER_CHAPTER - 1);
  }
  if (n >= 12 && save.stats.winsSinceAd >= 3) {
    save.stats.winsSinceAd = 0;
    persist();
    await maybeInterstitial();
  }
  if (n === 8 || n === 30) { nav.home(); askRating(); return; }
  if (canPlay()) startLevel(); else nav.home();
}

function openChest(chapter: number): Promise<void> {
  return new Promise((resolve) => {
    const r = chapterReward(chapter);
    const next = chapterOf(save.level);
    const chest = h('div', { class: 'big-chest' }, icon('chest'));
    const loot = h('div', { class: 'loot' },
      h('div', {}, icon('coin'), h('b', {}, fa(r.coins))),
      h('div', {}, icon('bomb'), h('b', {}, fa(r.bomb))),
      r.slot ? h('div', {}, icon('slot'), h('b', {}, fa(r.slot))) : null);
    const open = btn('primary big', ['باز کن!'], () => {
      chest.classList.add('open');
      sfx.win();
      haptic('success');
      save.chapterClaimed = chapter + 1;
      earn(r.coins);
      save.boosts.bomb += r.bomb;
      save.boosts.slot += r.slot;
      persist();
      setTimeout(() => loot.classList.add('in'), 350);
      open.replaceWith(btn('primary big', [`سفر به ${next.name}`, icon('play')], () => { m.close(); resolve(); }));
    });
    const m = modal(`فصل ${fa(chapter + 1)} تموم شد!`, h('div', { class: 'chest-modal' },
      h('p', {}, 'آفرین! جایزه‌ی این فصل مال توئه.'), chest, loot, open), { closable: false });
  });
}

function askRating() {
  setTimeout(() => {
    const m = modal('از بازی خوشت اومده؟', h('div', { class: 'intro' }, mascotCanvas(110, 8, { mood: 'happy', cushion: false }),
      h('p', {}, 'با ۵ ستاره توی بازار به ما انرژی بده تا مرحله‌های بیشتری بسازیم!'),
      h('div', { class: 'five-stars' }, ...[0, 1, 2, 3, 4].map(() => icon('star'))),
      btn('primary big', ['امتیاز می‌دم'], () => { rateApp(); earn(100); refreshCoins(); m.close(); toast('مرسی! ۱۰۰ سکه هدیه گرفتی', 'coin'); }),
      btn('ghost', ['بعداً'], () => m.close())));
  }, 500);
}

// ───────────────────────── lose ─────────────────────────

function onLose() {
  save.stats.losses++;
  persist();
  const price = PRICES.revive[Math.min(revivesUsed, PRICES.revive.length - 1)];
  const g = view?.game;
  const done = g ? g.progress() : 0;
  const revive = (how: 'coins' | 'ad') => async () => {
    if (how === 'coins') {
      if (!spend(price)) { toast('سکه کافی نداری', 'coin'); openShop(); return; }
      refreshCoins();
    } else {
      if (!(await showRewarded())) { toast('الان تبلیغی در دسترس نیست'); return; }
      freeReviveUsed = true;
    }
    revivesUsed++;
    m.close();
    view?.game.addSlot();
    view?.resume();
  };
  const giveUp = (to: 'retry' | 'home') => async () => {
    m.close();
    loseLife();
    if (save.level >= 7) await maybeInterstitial();
    if (to === 'retry' && canPlay()) startLevel(); else nav.home();
  };
  const m = modal('ای وای!', h('div', { class: 'lose' },
    mascotCanvas(110, 5, { mood: 'sad', cushion: false }),
    h('p', { class: 'lose-msg' }, 'جایگاه‌ها پر شد!'),
    h('div', { class: 'near' }, h('div', { class: 'near-bar' }, h('i', { style: `width:${Math.round(done * 100)}%` })), h('small', {}, `${fa(Math.floor(done * 100))}٪ از تصویر رو ترکوندی — خیلی نزدیکی!`)),
    btn('gold big', [icon('slot'), h('span', {}, 'یک جای اضافه'), h('em', { class: 'price' }, icon('coin'), fa(price))], revive('coins')),
    !freeReviveUsed && rewardedAvailable() ? btn('ad', [icon('film'), h('span', {}, 'جای اضافه رایگان')], revive('ad')) : null,
    h('div', { class: 'row' },
      btn('ghost', [icon('retry'), h('span', {}, 'از اول')], giveUp('retry')),
      btn('ghost', [icon('home'), h('span', {}, 'خانه')], giveUp('home'))),
    h('small', { class: 'muted' }, hasUnlimited() ? 'جان بی‌نهایت داری!' : 'شروع دوباره یک جان کم می‌کنه'),
  ), { closable: false, cls: 'lose-modal' });
}

// ───────────────────────── pause ─────────────────────────

export function openPause() {
  if (!view || view.game.status !== 'playing') return;
  view.paused = true;
  const quit = (to: 'retry' | 'home') => () => {
    m.close();
    if (view && view.game.progress() > 0) loseLife();
    if (to === 'retry' && canPlay()) startLevel(); else nav.home();
  };
  const m = modal('مکث', h('div', { class: 'pause' },
    toggles(),
    btn('primary big', [icon('play'), h('span', {}, 'ادامه')], () => m.close()),
    h('div', { class: 'row' },
      btn('ghost', [icon('retry'), h('span', {}, 'از اول')], quit('retry')),
      btn('ghost', [icon('home'), h('span', {}, 'خانه')], quit('home'))),
    h('small', { class: 'muted' }, 'خروج از مرحله‌ی شروع‌شده یک جان کم می‌کنه'),
  ), { onClose: () => view?.resume() });
}

export function leaveGame() {
  view?.destroy();
  view = null;
  boostEls = null;
}
