import { sfx, startMusic, stopMusic } from '../audio';
import { PRODUCTS, type Sku } from '../config';
import { fa, faTime, toman } from '../fa';
import { loadPicture, pictureTitle } from '../game/pictures';
import { PICTURE_ORDER } from '../game/levelgen';
import { blockSprite, setSpriteScale } from '../gfx/sprites';
import { buy, iapAvailable, prices, rateApp, restorePurchases, rewardedAvailable, showRewarded } from '../monetize';
import {
  DAILY_GIFTS, MAX_LIVES, PRICES, addLife, claimDaily, dailyAvailable, earn, hasUnlimited, persist, save, spend, tickLives, today,
} from '../save';
import { btn, flyCoins, h, modal, toast } from './dom';
import { coinPill, refreshCoins, refreshLives } from './hud';
import { icon, type IconName } from './icons';
import { nav } from './nav';

// ───────────────────────── settings ─────────────────────────

export function toggles(): HTMLElement {
  const item = (key: 'sound' | 'music' | 'haptics', ic: IconName, label: string) => {
    const b = h('button', { class: 'toggle' + (save.settings[key] ? ' on' : '') }, icon(ic), h('span', {}, label), h('i', { class: 'switch' }));
    b.addEventListener('click', () => {
      save.settings[key] = !save.settings[key];
      persist();
      b.classList.toggle('on', save.settings[key]);
      if (key === 'music') { if (save.settings.music) startMusic(); else stopMusic(); }
      sfx.tap();
    });
    return b;
  };
  return h('div', { class: 'toggles' }, item('sound', 'sound', 'صدا'), item('music', 'music', 'موسیقی'), item('haptics', 'vibrate', 'لرزش'));
}

declare const __APP_VERSION__: string;

export function openSettings() {
  modal('تنظیمات', h('div', { class: 'settings' },
    toggles(),
    btn('ghost', [icon('restore'), h('span', {}, 'بازیابی خریدها')], async () => { await restorePurchases(); toast('خریدها بازیابی شد', 'check'); }),
    btn('ghost', [icon('rate'), h('span', {}, 'امتیاز به بازی')], () => rateApp()),
    h('p', { class: 'muted' }, `پیشی پیکسل · نسخه ${fa(__APP_VERSION__)}`),
    h('p', { class: 'muted' }, `مرحله ${fa(save.level + 1)} · ${fa(save.stars)} ستاره · ${fa(save.gallery.length)} تصویر`),
  ));
}

// ───────────────────────── gallery ─────────────────────────

function thumb(id: string, size: number, locked: boolean): HTMLCanvasElement {
  const p = loadPicture(id, 16);
  const c = h('canvas', {});
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  c.width = c.height = size * dpr;
  c.style.width = c.style.height = size + 'px';
  const ctx = c.getContext('2d')!;
  ctx.scale(dpr, dpr);
  setSpriteScale(dpr);
  const s = size / Math.max(p.w, p.h);
  for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) {
    const v = p.cells[y * p.w + x];
    if (v < 0) continue;
    if (locked) { ctx.fillStyle = 'rgba(80,60,120,0.25)'; ctx.fillRect(x * s, y * s, s, s); }
    else ctx.drawImage(blockSprite(v, s), x * s, y * s, s, s);
  }
  return c;
}

export function openGallery() {
  const total = PICTURE_ORDER.length;
  const grid = h('div', { class: 'gallery' });
  const have = new Set(save.gallery);
  for (const id of save.gallery) grid.append(h('div', { class: 'gitem' }, thumb(id, 70, false), h('span', {}, pictureTitle(id))));
  // a few locked teasers of what is coming
  let teasers = 0;
  for (const id of PICTURE_ORDER) {
    if (have.has(id)) continue;
    if (teasers++ >= 6) break;
    grid.append(h('div', { class: 'gitem locked' }, thumb(id, 70, true), icon('lock', 'lock'), h('span', {}, '؟؟؟')));
  }
  modal('گالری', h('div', {},
    h('div', { class: 'gallery-head' }, h('b', {}, `${fa(save.gallery.length)} از ${fa(total)}`), h('small', {}, 'تصویرهای کامل‌شده')),
    h('div', { class: 'gallery-bar' }, h('i', { style: `width:${(save.gallery.length / total) * 100}%` })),
    grid));
}

// ───────────────────────── daily gift ─────────────────────────

export function openDaily() {
  const available = dailyAvailable();
  const y = new Date(Date.now() - 86400000);
  const yesterday = `${y.getFullYear()}-${y.getMonth() + 1}-${y.getDate()}`;
  const nextDay = available ? (save.daily.last === yesterday ? (save.daily.streak % 7) + 1 : 1) : save.daily.streak;
  const days = h('div', { class: 'days' }, ...DAILY_GIFTS.map((g, i) => h('div', {
    class: 'day' + (i + 1 < nextDay || (!available && i + 1 === nextDay) ? ' got' : '') + (available && i + 1 === nextDay ? ' now' : '') + (i === 6 ? ' big' : ''),
  }, h('small', {}, `روز ${fa(i + 1)}`), icon(i === 6 ? 'chest' : 'coin'), h('b', {}, fa(g)), i + 1 < nextDay || (!available && i + 1 === nextDay) ? icon('check', 'tick') : null)));
  const m = modal('جایزه روزانه', h('div', { class: 'daily' },
    h('p', { class: 'muted' }, 'هر روز سر بزن، جایزه‌ها بزرگ‌تر میشن! روز هفتم: صندوقچه با بمب هدیه'),
    days,
    available
      ? btn('gold big', [icon('gift'), h('span', {}, 'دریافت جایزه')], () => {
        const from = (m.el.querySelector('.day.now') as HTMLElement).getBoundingClientRect();
        const before = save.coins;
        const g = claimDaily();
        m.close();
        flyCoins(from, g, () => refreshCoins());
        void before;
        document.querySelectorAll('.nav-btn.dot').forEach((el) => { if (el.textContent?.includes('جایزه')) el.classList.remove('dot'); });
      })
      : h('p', { class: 'come-back' }, 'جایزه امروز رو گرفتی. فردا برگرد!'),
  ));
}

// ───────────────────────── lives ─────────────────────────

export function openLives() {
  const ms = tickLives();
  const full = save.lives >= MAX_LIVES || hasUnlimited();
  const hearts = h('div', { class: 'hearts' }, ...Array.from({ length: MAX_LIVES }, (_, i) => icon('heart', i < save.lives || hasUnlimited() ? '' : 'empty')));
  const m = modal(full ? 'جان‌هات پره!' : 'جان بیشتر', h('div', { class: 'lives-m' },
    hearts,
    hasUnlimited() ? h('p', {}, `جان بی‌نهایت: ${faTime(save.unlimitedUntil - Date.now())}`)
      : !full ? h('p', { class: 'muted' }, `جان بعدی تا ${faTime(ms)} دیگه`) : h('p', { class: 'muted' }, 'برو بازی کن!'),
    !full ? btn('gold big', [icon('heart'), h('span', {}, 'پر کردن جان‌ها'), h('em', { class: 'price' }, icon('coin'), fa(PRICES.refillLives))], () => {
      if (!spend(PRICES.refillLives)) { toast('سکه کافی نداری', 'coin'); openShop(); return; }
      addLife(MAX_LIVES); m.close(); refreshCoins(); refreshLives(); toast('جان‌ها پر شد!', 'heart');
    }) : null,
    !full && rewardedAvailable() ? btn('ad', [icon('film'), h('span', {}, 'یک جان رایگان')], async () => {
      if (await showRewarded()) { addLife(1); m.close(); refreshLives(); toast('یک جان گرفتی', 'heart'); }
    }) : null,
    btn('ghost', [icon('infinity'), h('span', {}, 'جان بی‌نهایت ۲۴ ساعته')], () => { m.close(); openShop('lives_24h'); }),
  ));
}

// ───────────────────────── shop ─────────────────────────

function priceLabel(sku: Sku, fallback: number): string {
  return prices[sku] ?? toman(fallback);
}

const PRODUCT_ART: Record<Sku, { ic: IconName; stack: number; desc: string }> = {
  coins_1000: { ic: 'coin', stack: 1, desc: 'برای جای اضافه، بمب و ادامه دادن' },
  coins_3000: { ic: 'coin', stack: 2, desc: 'سه برابر سکه، برای مرحله‌های سخت' },
  coins_8000: { ic: 'coin', stack: 3, desc: 'یک گنج کامل!' },
  lives_24h: { ic: 'infinity', stack: 1, desc: 'یک روز کامل بدون نگرانی از جان' },
  no_ads: { ic: 'noAds', stack: 1, desc: 'دیگه هیچ تبلیغی بین مرحله‌ها نمی‌بینی' },
  starter_pack: { ic: 'crown', stack: 1, desc: '۲٬۵۰۰ سکه + ۳ بمب + ۳ جای اضافه + بدون تبلیغ + ۶ ساعت جان بی‌نهایت' },
};

export function openShop(focus?: Sku | 'starter') {
  const balance = coinPill(() => {});
  const list = h('div', { class: 'shop' });
  const order: Sku[] = ['starter_pack', 'coins_1000', 'coins_3000', 'coins_8000', 'lives_24h', 'no_ads'];
  for (const sku of order) {
    const p = PRODUCTS.find((x) => x.sku === sku)!;
    if (sku === 'starter_pack' && save.starterBought) continue;
    if (sku === 'no_ads' && save.noAds) continue;
    const art = PRODUCT_ART[sku];
    const iconBox = h('div', { class: `pic-box stack${art.stack}` }, ...Array.from({ length: art.stack }, () => icon(art.ic)));
    const card = h('div', { class: 'item' + (sku === 'starter_pack' ? ' starter-item' : '') + (focus === sku || (focus === 'starter' && sku === 'starter_pack') ? ' focus' : '') },
      'badge' in p ? h('span', { class: 'tag' }, p.badge) : null,
      iconBox,
      h('div', { class: 'txt' }, h('b', {}, p.title), h('small', {}, art.desc)),
      btn('buy', [priceLabel(sku, p.fallbackPrice)], async () => {
        if (!iapAvailable()) { toast('برای خرید، بازار باید روی گوشی نصب باشه'); return; }
        const before = save.coins;
        if (await buy(sku)) {
          const gained = save.coins - before;
          toast('خرید موفق! ممنون که حمایت کردی', 'check');
          if (gained > 0) flyCoins(card.getBoundingClientRect(), gained, () => refreshCoins());
          refreshLives();
          if (sku === 'starter_pack' || sku === 'no_ads') { m.close(); if (nav.screen === 'home') nav.home(); }
        }
      }));
    list.append(card);
  }
  if (rewardedAvailable()) {
    const d = today();
    if (save.freeCoinAds.day !== d) save.freeCoinAds = { day: d, count: 0 };
    const left = 3 - save.freeCoinAds.count;
    if (left > 0) {
      const card = h('div', { class: 'item free' },
        h('div', { class: 'pic-box stack1' }, icon('film')),
        h('div', { class: 'txt' }, h('b', {}, '۴۰ سکه رایگان'), h('small', {}, `با دیدن یک تبلیغ — ${fa(left)} بار دیگه امروز`)),
        btn('buy ad', ['رایگان'], async () => {
          if (await showRewarded()) {
            save.freeCoinAds.count++;
            earn(40);
            flyCoins(card.getBoundingClientRect(), 40, () => refreshCoins());
            if (save.freeCoinAds.count >= 3) card.remove();
          }
        }));
      list.insertBefore(card, list.children[save.starterBought ? 0 : 1] ?? null);
    }
  }
  const m = modal('فروشگاه', h('div', {}, h('div', { class: 'shop-balance' }, balance), list), { cls: 'shop-modal' });
  const f = m.el.querySelector('.focus');
  if (f) setTimeout(() => f.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250);
}
