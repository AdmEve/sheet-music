// Pop-up windows: shop, energy, bag, item chain, level up, daily gift, settings.

import { itemArt } from '../art/index';
import { ICONS } from '../art/icons';
import { portrait } from '../art/portraits';
import {
  CHAIN_BONUS_GEMS, CODEX_CHAINS, Reward, chainComplete, chainKey, claimAllCodex, claimCodex, codexClaimable, codexReward, isFound,
} from '../game/codex';
import {
  OFFER_SKU, OfferId, PIGGY_CAP, PIGGY_MIN, PIGGY_PER_ORDER, SeasonReward, WelcomeGift, activeOffers, breakPiggy, endOffer, firstBonusOpen, openGift, piggyReady,
  skipGift,
} from '../game/offers';
import { monthEnd } from '../game/calendar';
import {
  EVENT_COLLECT, EVENT_LEVEL, EVENT_ORDER, MILESTONES, THEMES, claimMilestone, eventClaimable, eventEnd, eventProgress, eventTitle,
  milestonesReached,
} from '../game/events';
import {
  ENDLESS_COST, ENDLESS_REWARD, FREE, PASS_STEPS, PREMIUM, PassReward, QUEST_BONUS_POINTS, QUEST_POINTS, Track, canClaim, claimEndless,
  claimPass, endlessReady, grantPremium, passClaimable, passName, passProgress,
} from '../game/pass';
import {
  RACE_GOAL, RACE_MS, RACE_REWARDS, botScore, claimRace, playerScore, raceOver, raceRank, racesLeft, startRace,
} from '../game/race';
import { CHAINS, ChainId, GENERATOR_CHAINS, Item, PRODUCT_CHAINS, itemKey, itemName, maxLevel } from '../game/items';
import {
  BAG_MAX, COIN_CHEST_PRICE, COIN_ENERGY_AMOUNT, DAILY_REWARDS, ENERGY_CAP, addEnergy, adsLeft, bagSlotCost, buyBagSlot,
  buyChestWithCoins, buyEnergyWithCoins, buyRefill, claimQuest, claimQuestBonus, coinEnergyLeft, coinEnergyPrice, countAd, fromBag, unshelve,
  Order, allQuestsClaimed, loadState, needsMet, newGame, questDone, questProgress, refillPrice, rushPrice, xpForLevel,
} from '../game/model';
import { CAST } from '../story/story';
import { adsAvailable, showRewarded } from '../platform/ads';
import { PRODUCTS, billingAvailable, buy, consume, fetchPrices } from '../platform/billing';
import { MAX_ADS_PER_DAY } from '../platform/config';
import { setHaptics } from '../platform/haptics';
import { askNotifications } from '../platform/notify';
import { copyText, rateOnStore, shareGame, shareText } from '../platform/social';
import { decodeSave, encodeSave } from '../game/transfer';
import { writeSetting } from '../platform/storage';
import type { App } from './app';
import { add, clear, dateKey, fa, faClock, faLeft, faNum, faTime, h, svgIcon } from './dom';
import { confetti, rays } from './celebrate';
import { musicEnabled, setMusic, setSound, sfx, soundOn } from './sound';
import { EVENT_LEVEL as EV_LEVEL } from '../game/events';
import { GIFT_LEVEL, PIGGY_LEVEL } from '../game/offers';
import { PASS_LEVEL } from '../game/pass';
import { RACE_LEVEL } from '../game/race';

/** What opens at each level (shown in the level-up window). */
const UNLOCKS: Record<number, string> = {
  [PASS_LEVEL]: 'مسیر ماه: نشان جمع کن و جایزه بگیر',
  [GIFT_LEVEL]: 'هدیه‌ی همسایه‌ها',
  [PIGGY_LEVEL]: 'قلک الماس',
  [EV_LEVEL]: 'رویدادهای محله',
  [RACE_LEVEL]: 'مسابقه‌ی محله',
};

const today = () => dateKey();

/** "یلدای ۱۴۰۵", "نوروز ۱۴۰۶", "بادبادک‌بازی (آبان ۱۴۰۵)" for a finished event id. */
export function trophyName(id: string): string {
  const t = eventTitle(id);
  return t.date ? `${t.title} (${fa(t.date.d)}/${fa(t.date.m)}/${fa(t.date.y)})` : `${t.title} ${fa(t.year ?? '')}`;
}

/** Picture for each paid bundle: starter = golden chest, episode party = box of sweets. */
export function bundleArt(sku: string): string {
  if (sku === 'offer_energy') return itemArt({ chain: 'energy', level: 3 });
  if (sku === 'offer_chapter') return itemArt({ chain: 'sweets', level: 8 });
  if (sku === 'piggy_bank') return ICONS.piggy;
  return itemArt({ chain: 'chest', level: 3 });
}

let hapticsOn = true;
export const initToggles = (sound: boolean, haptics: boolean, music: boolean) => {
  setSound(sound);
  setMusic(music);
  setHaptics(haptics);
  hapticsOn = haptics;
};

export class Modals {
  private prices: Record<string, string> = {};

  constructor(private app: App) {}

  /** Opens a modal; resolves when it closes. */
  open(title: string, build: (body: HTMLElement, close: () => void) => void, closable = true): Promise<void> {
    return new Promise((resolve) => {
      const body = h('div');
      const modal = h('div', { class: 'modal' }, h('h2', {}, title), body);
      const overlay = h('div', { class: 'overlay' }, modal);
      const close = () => {
        overlay.remove();
        resolve();
      };
      if (closable) {
        modal.prepend(h('button', { class: 'close', onclick: close, 'aria-label': 'بستن' }, '×'));
        overlay.addEventListener('click', (e) => e.target === overlay && close());
      }
      build(body, close);
      document.body.append(overlay);
    });
  }

  /** Plays a rewarded video if today's cap allows; true only when it was fully watched. */
  async rewarded(): Promise<boolean> {
    const s = this.app.s;
    if (!adsAvailable() || adsLeft(s, today(), MAX_ADS_PER_DAY) <= 0) {
      this.app.toast('امروز دیگه ویدیوی جایزه‌دار نداریم. فردا دوباره!');
      return false;
    }
    if (!(await showRewarded())) {
      this.app.toast('ویدیو در دسترس نیست. کمی بعد دوباره امتحان کن.');
      return false;
    }
    countAd(s, today());
    this.app.dirty();
    return true;
  }

  energy(): Promise<void> {
    const s = this.app.s;
    if (billingAvailable()) fetchPrices().then((p) => (this.prices = { ...this.prices, ...p }));
    return this.open('انرژی', (body, close) => {
      const left = adsLeft(s, today(), MAX_ADS_PER_DAY);
      add(body,
        h('div', { style: 'width:90px;height:90px;margin:0 auto', html: svgIcon(itemArt({ chain: 'energy', level: 3 })) }),
        h('p', {}, `انرژی: ${fa(s.energy)} از ${fa(ENERGY_CAP)}`),
        s.energy < ENERGY_CAP ? h('p', { style: 'font-size:13px' }, `هر ۲ دقیقه یک انرژی پر می‌شه. انرژی بعدی: ${faTime(Math.max(0, 120000 - (Date.now() - s.energyAt)))}`) : null,
        h('button', { class: 'btn gold', onclick: () => {
          if (!buyRefill(s, today())) { close(); return this.shop(); }
          sfx.levelUp();
          this.app.renderHud();
          this.app.dirty();
          close();
        } }, `+${fa(ENERGY_CAP)} انرژی با ${fa(refillPrice(s, today()))}`, h('span', { html: svgIcon(ICONS.gem) })),
        s.energy < 20 ? this.offerCard('offer_energy', close) : null,
        adsAvailable()
          ? h('button', { class: 'btn pink', disabled: left <= 0, onclick: async () => {
              close();
              if (await this.rewarded()) {
                addEnergy(s, 30);
                sfx.levelUp();
                this.app.renderHud();
                this.app.dirty();
              }
            } }, h('span', { html: svgIcon(ICONS.video) }), `+${fa(30)} انرژی با دیدن ویدیو (${fa(left)} بار مونده)`)
          : null,
      );
    });
  }

  shop(): Promise<void> {
    const s = this.app.s;
    if (billingAvailable()) fetchPrices().then((p) => (this.prices = { ...this.prices, ...p }));
    return this.open('فروشگاه', (body, close) => {
      const grid = h('div', { class: 'grid2' });
      // Timed bundles first, then the one-time starter pack, then the gem shelf.
      for (const o of activeOffers(s, Date.now())) {
        if (o.id !== 'starter') grid.append(this.offerCard(OFFER_SKU[o.id], close, o.until));
      }
      const first = firstBonusOpen(s);
      for (const p of PRODUCTS) {
        if (p.hidden || (p.once && s.bought.includes(p.sku))) continue;
        if (p.once) {
          const timed = activeOffers(s, Date.now()).find((o) => OFFER_SKU[o.id] === p.sku);
          grid.append(this.offerCard(p.sku, close, timed?.until));
          continue;
        }
        grid.append(h('div', { class: 'offer' },
          first ? h('span', { class: 'ribbon' }, '×۲ اولین خرید') : null,
          h('div', { class: 'art', html: svgIcon(ICONS.gem) }),
          first ? h('s', { class: 'was' }, faNum(p.gems)) : null,
          h('div', { class: 'amount' }, faNum(first ? p.gems * 2 : p.gems)),
          h('div', { style: 'font-size:12px' }, p.title),
          h('button', { class: 'btn', onclick: () => this.purchase(p.sku, close) }, this.price(p.sku))));
      }
      body.append(grid);
      // Coin shop: gives coins a purpose and a daily energy top-up for non-payers.
      const coinRow = h('div', { class: 'grid2', style: 'margin-top:10px' },
        h('div', { class: 'offer' },
          h('div', { class: 'art', html: svgIcon(itemArt({ chain: 'chest', level: 1 })) }),
          h('div', { style: 'font-size:12px' }, 'صندوقچه‌ی چوبی'),
          h('button', { class: 'btn gold', onclick: () => {
            if (!buyChestWithCoins(s)) return this.app.toast('سکه کافی نداری.');
            this.app.giveItem({ chain: 'chest', level: 1 });
            sfx.coin();
            this.app.renderHud();
            this.app.dirty();
            close();
          } }, faNum(COIN_CHEST_PRICE), h('span', { html: svgIcon(ICONS.coin) }))),
        h('div', { class: 'offer' },
          h('div', { class: 'art', html: svgIcon(itemArt({ chain: 'energy', level: 1 })) }),
          h('div', { style: 'font-size:12px' }, `${fa(COIN_ENERGY_AMOUNT)} انرژی (${fa(coinEnergyLeft(s, today()))} بار دیگه امروز)`),
          h('button', { class: 'btn gold', disabled: coinEnergyLeft(s, today()) <= 0, onclick: () => {
            if (!buyEnergyWithCoins(s, today())) return this.app.toast('سکه کافی نداری.');
            sfx.levelUp();
            this.app.renderHud();
            this.app.dirty();
            close();
          } }, faNum(coinEnergyPrice(s, today())), h('span', { html: svgIcon(ICONS.coin) }))));
      body.append(h('p', { style: 'font-weight:900;margin-top:12px' }, 'خرید با سکه'), coinRow);
      if (adsAvailable()) {
        const left = adsLeft(s, today(), MAX_ADS_PER_DAY);
        body.append(h('button', { class: 'btn pink', disabled: left <= 0, onclick: async () => {
          close();
          if (await this.rewarded()) {
            s.gems += 3;
            sfx.coin();
            this.app.renderHud();
            this.app.dirty();
            this.app.toast('۳ الماس هدیه گرفتی!');
          }
        } }, h('span', { html: svgIcon(ICONS.video) }), `۳ الماس رایگان با دیدن ویدیو (${fa(left)})`));
      }
      body.append(h('p', { style: 'font-size:11px;color:#7a5a44' }, 'پرداخت امن از طریق فروشگاه (بازار / مایکت). خریدها روی همین گوشی ذخیره می‌شن.'));
    });
  }

  private price(sku: string): string {
    return this.prices[sku] ?? PRODUCTS.find((p) => p.sku === sku)?.fallbackPrice ?? '';
  }

  /** Runs a store purchase; on success closes the window and grants the product. */
  async purchase(sku: string, close?: () => void): Promise<boolean> {
    const r = await buy(sku);
    if (!r.ok) {
      if (r.reason === 'unavailable') this.app.toast('خرید فقط در نسخه‌ی نصب‌شده از بازار یا مایکت فعاله.');
      else if (r.reason === 'error') this.app.toast('خرید انجام نشد. دوباره امتحان کن.');
      return false;
    }
    close?.();
    await this.grant(sku, r.token);
    return true;
  }

  /** What a bundle contains, as icon + amount chips. */
  private contents(sku: string): HTMLElement {
    const p = PRODUCTS.find((x) => x.sku === sku)!;
    const chip = (icon: string, text: string) => h('span', { class: 'got' }, h('span', { html: svgIcon(icon) }), text);
    return h('div', { class: 'contents' },
      p.gems ? chip(ICONS.gem, faNum(p.gems)) : null,
      p.energy ? chip(ICONS.energy, faNum(p.energy)) : null,
      p.chest ? chip(itemArt({ chain: 'chest', level: p.chest }), 'صندوقچه') : null);
  }

  /** A wide bundle card (shop, energy window, offer pop-up). */
  private offerCard(sku: string, close: () => void, until?: number): HTMLElement {
    const p = PRODUCTS.find((x) => x.sku === sku)!;
    return h('div', { class: 'offer special' },
      h('div', { class: 'art', html: svgIcon(bundleArt(sku)) }),
      h('div', { style: 'flex:1;min-width:0' },
        h('span', { class: 'tag' }, until ? `⏳ ${faClock(until - Date.now())}` : p.once ? 'فقط یک بار' : 'پیشنهاد ویژه'),
        h('div', { class: 'amount' }, p.title),
        this.contents(sku),
        h('button', { class: 'btn', onclick: () => this.purchase(sku, close) }, this.price(sku))));
  }

  /** Pop-up for a timed bundle (starter pack after level 3, celebration after episodes). */
  offer(id: OfferId): Promise<void> {
    const s = this.app.s;
    const sku = OFFER_SKU[id];
    const o = activeOffers(s, Date.now()).find((x) => x.id === id);
    if (!o) return Promise.resolve();
    if (billingAvailable()) fetchPrices().then((pr) => (this.prices = { ...this.prices, ...pr }));
    const p = PRODUCTS.find((x) => x.sku === sku)!;
    return this.open(p.title, (body, close) => {
      const timer = h('div', { class: 'timer' }, `⏳ ${faClock(o.until - Date.now())} مونده`);
      const t = window.setInterval(() => {
        if (!timer.isConnected) return clearInterval(t);
        timer.textContent = `⏳ ${faClock(o.until - Date.now())} مونده`;
      }, 1000);
      add(body,
        h('div', { class: 'offer-hero', html: svgIcon(bundleArt(sku)) }),
        h('p', {}, id === 'starter'
          ? 'یه هدیه‌ی خوش‌آمد از طرف همسایه‌ها! فقط یک بار و فقط تا آخر این زمان.'
          : 'یه قسمت دیگه تموم شد! به افتخارش، این بسته فقط تا فردا همین موقع.'),
        this.contents(sku),
        timer,
        h('button', { class: 'btn gold big', onclick: () => this.purchase(sku, close) }, this.price(sku)),
        h('button', { class: 'btn plain', onclick: close }, 'بعداً'));
    });
  }

  piggy(): Promise<void> {
    const s = this.app.s;
    if (billingAvailable()) fetchPrices().then((pr) => (this.prices = { ...this.prices, ...pr }));
    return this.open('قلک', (body, close) => {
      add(body,
        h('div', { class: `offer-hero${s.piggy >= PIGGY_CAP ? ' shake-slow' : ''}`, html: svgIcon(ICONS.piggy) }),
        h('div', { class: 'piggy-count' }, h('span', { html: svgIcon(ICONS.gem) }), `${fa(s.piggy)} / ${fa(PIGGY_CAP)}`),
        h('div', { class: 'bar' }, h('div', { style: `width:${(s.piggy / PIGGY_CAP) * 100}%` })),
        h('p', { style: 'font-size:13px' }, s.piggy >= PIGGY_CAP
          ? 'قلک پر شد! تا نشکنیش، دیگه الماسی توش نمی‌ره.'
          : `هر سفارشی که تحویل بدی، ${fa(PIGGY_PER_ORDER)} الماس می‌ره تو قلک. هر وقت خواستی بشکنش و همه رو بردار.`),
        h('button', { class: 'btn gold big', disabled: !piggyReady(s), onclick: () => this.purchase('piggy_bank', close) },
          piggyReady(s) ? `شکستن قلک · ${this.price('piggy_bank')}` : `از ${fa(PIGGY_MIN)} الماس به بعد می‌شه شکستش`));
    });
  }

  /** The occasional free gift: one video opens it. */
  /** An unfinished order: what is missing, where to find it, and finishing it for gems. */
  order(o: Order): Promise<void> {
    const s = this.app.s;
    const met = needsMet(s, o);
    const price = rushPrice(s, o);
    return this.open(`سفارش ${CAST[o.who]?.name ?? ''}`, (body, close) => {
      add(body,
        h('div', { class: 'order-sheet' },
          h('div', { class: 'who', html: svgIcon(portrait(o.who)) }),
          h('div', { class: 'order-needs' }, ...o.needs.map((n, k) =>
            h('div', { class: `order-need${met[k] ? ' met' : ''}` },
              h('div', { class: 'art', html: svgIcon(itemArt(n)) }),
              h('b', {}, itemName(n)),
              h('span', { class: 'state' }, met[k] ? '✓ آماده‌ست' : 'هنوز نداری')))),
        ),
        h('p', { class: 'muted' }, `جایزه: ${fa(o.stars)} ستاره و ${fa(o.coins)} سکه`),
        h('button', { class: 'btn pink big', onclick: () => { close(); void this.app.deliverOrder(o.id, true); } },
          `تحویل فوری با ${fa(price)}`, h('span', { html: svgIcon(ICONS.gem) })),
        h('button', { class: 'btn plain', onclick: () => { close(); this.app.highlightNeeds(o); } }, 'خودم درستش می‌کنم'));
    });
  }

  gift(): Promise<void> {
    const s = this.app.s;
    return this.open('هدیه‌ی همسایه‌ها', (body, close) => {
      add(body,
        h('div', { class: 'offer-hero', html: svgIcon(ICONS.gift) }),
        h('p', {}, 'همسایه‌ها برات یه هدیه گذاشتن دم در! یه ویدیوی کوتاه ببین و بازش کن.'),
        h('button', { class: 'btn pink big', onclick: async () => {
          close();
          if (!(await this.rewarded())) return;
          const r = openGift(s, Date.now(), Math.random());
          const from = document.getElementById('side-gift')?.getBoundingClientRect() ?? new DOMRect(innerWidth / 2, innerHeight / 2, 0, 0);
          if ('energy' in r) { addEnergy(s, r.energy); this.app.flyReward(ICONS.energy, from, 'hud-energy', 4); this.app.toast(`${fa(r.energy)} انرژی هدیه گرفتی!`); }
          if ('gems' in r) { s.gems += r.gems; this.app.flyReward(ICONS.gem, from, 'hud-gems', 3); this.app.toast(`${fa(r.gems)} الماس هدیه گرفتی!`); }
          if ('chest' in r) { this.app.giveItem({ chain: 'chest', level: r.chest }); this.app.toast('یه صندوقچه هدیه گرفتی!'); }
          sfx.levelUp();
          this.app.renderAll();
          this.app.dirty();
        } }, h('span', { html: svgIcon(ICONS.video) }), 'باز کن'),
        h('button', { class: 'btn plain', onclick: () => { skipGift(s, Date.now()); this.app.dirty(); close(); } }, 'نه، ممنون'));
    });
  }

  /**
   * Delivers a paid product, saves, and only then consumes it in the store. The token is kept
   * until consumption succeeds so startup recovery never grants the same purchase twice.
   */
  async grant(sku: string, token: string): Promise<void> {
    const s = this.app.s;
    const p = PRODUCTS.find((x) => x.sku === sku);
    if (!p || s.grantedTokens.includes(token)) return;
    s.grantedTokens.push(token);
    let gems = p.gems;
    if (p.sku.startsWith('gems_') && firstBonusOpen(s)) {
      gems *= 2;
      s.bought.push('first');
    }
    s.gems += gems;
    if (p.piggy) gems = breakPiggy(s);
    if (p.pass) grantPremium(s);
    if (p.energy) addEnergy(s, p.energy);
    if (p.chest) this.app.giveItem({ chain: 'chest', level: p.chest });
    if (p.once && !s.bought.includes(p.sku)) s.bought.push(p.sku);
    for (const id of Object.keys(OFFER_SKU) as OfferId[]) if (OFFER_SKU[id] === p.sku) endOffer(s, id);
    await this.app.saveNow();
    sfx.levelUp();
    this.app.renderAll();
    this.app.toast(p.piggy ? `${fa(gems)} الماس از قلک! ممنون از حمایتت!` : p.pass ? 'مسیر طلایی باز شد! جایزه‌هات منتظرتن.' : `${p.title} اضافه شد. ممنون از حمایتت!`);
    await this.finishPurchase(token);
  }

  /** Consumes a granted purchase and forgets its token (retried on next start if it fails). */
  async finishPurchase(token: string): Promise<void> {
    if (await consume(token)) {
      this.app.s.grantedTokens = this.app.s.grantedTokens.filter((t) => t !== token);
      await this.app.saveNow();
    }
  }

  /** Small "+5 💎" style label for a reward. */
  private rewardBits(r: Reward): (HTMLElement | string)[] {
    const out: (HTMLElement | string)[] = [];
    if (r.gems) out.push(fa(r.gems), h('span', { html: svgIcon(ICONS.gem) }));
    if (r.coins) out.push(fa(r.coins), h('span', { html: svgIcon(ICONS.coin) }));
    return out;
  }

  /** Coins/gems fly from `from` to the HUD after an album claim. */
  private paid(r: Reward, from: DOMRect): void {
    if (r.gems) this.app.flyReward(ICONS.gem, from, 'hud-gems', Math.min(5, 1 + r.gems));
    if (r.coins) this.app.flyReward(ICONS.coin, from, 'hud-coins', Math.min(5, 1 + Math.floor(r.coins / 10)));
    sfx.coin();
    this.app.renderHud();
    this.app.renderNav();
    this.app.dirty();
  }

  codex(): Promise<void> {
    const s = this.app.s;
    const total = CODEX_CHAINS.reduce((n, c) => n + maxLevel(c), 0);
    const sections: { title: string; chains: ChainId[]; bonus: ChainId | null }[] = [
      ...PRODUCT_CHAINS.map((c) => ({ title: CHAINS[c].name, chains: [c], bonus: c })),
      { title: 'مولدها', chains: GENERATOR_CHAINS, bonus: null },
      { title: 'صندوقچه و جایزه', chains: ['chest', 'coins', 'energy'] as ChainId[], bonus: null },
    ];
    return this.open('کلکسیون', (body) => {
      const render = () => {
        clear(body);
        const claimable = codexClaimable(s);
        add(body,
          h('p', { style: 'font-size:13px;margin:0' }, `${fa(s.found.length)} از ${fa(total)} وسیله پیدا شده. هر وسیله‌ی تازه جایزه داره!`),
          h('div', { class: 'bar' }, h('div', { style: `width:${(s.found.length / total) * 100}%` })),
          claimable ? h('button', { class: 'btn gold', onclick: (e: Event) => {
            const r = claimAllCodex(s);
            this.paid(r, (e.currentTarget as HTMLElement).getBoundingClientRect());
            render();
          } }, `همه‌ی جایزه‌ها رو بگیر (${fa(claimable)})`) : null);
        for (const sec of sections) {
          const items: Item[] = sec.chains.flatMap((c) => CHAINS[c].levels.map((_, k) => ({ chain: c, level: k + 1 })));
          const foundN = items.filter((it) => isFound(s, it)).length;
          const head = h('div', { class: 'codex-head' }, h('b', {}, sec.title), h('span', { class: 'muted' }, `${fa(foundN)}/${fa(items.length)}`));
          if (sec.bonus) {
            const key = chainKey(sec.bonus);
            const done = s.codexClaimed.includes(key);
            const ready = !done && chainComplete(s, sec.bonus);
            head.append(h('button', { class: `chip${ready ? ' green' : ''}`, disabled: !ready && !done, onclick: (e: Event) => {
              const r = ready ? claimCodex(s, key) : null;
              if (r) { this.paid(r, (e.currentTarget as HTMLElement).getBoundingClientRect()); render(); }
            } }, ...(done ? ['✓'] : ['🎁 ', ...this.rewardBits({ gems: CHAIN_BONUS_GEMS })])));
          }
          const grid = h('div', { class: 'codex-grid' });
          for (const it of items) {
            const key = itemKey(it);
            const found = isFound(s, it);
            const waiting = found && !s.codexClaimed.includes(key);
            const card = h('button', { class: `codex-card${found ? '' : ' unknown'}${waiting ? ' waiting' : ''}`, 'aria-label': found ? itemName(it) : '؟', html: svgIcon(itemArt(it)) });
            if (waiting) card.append(h('span', { class: 'codex-reward' }, ...this.rewardBits(codexReward(it))));
            card.addEventListener('click', () => {
              if (!found) return this.app.toast('هنوز پیداش نکردی!');
              const r = s.codexClaimed.includes(key) ? null : claimCodex(s, key);
              if (!r) return this.app.toast(itemName(it));
              this.paid(r, card.getBoundingClientRect());
              // Update in place: re-rendering ~90 drawings per tap is slow on old phones.
              card.classList.remove('waiting');
              card.querySelector('.codex-reward')?.remove();
              if (codexClaimable(s) === 0 || (sec.bonus && chainComplete(s, sec.bonus))) render();
            });
            grid.append(card);
          }
          body.append(head, grid);
        }
      };
      render();
    });
  }

  /** Icon + amount for a season-pass reward. */
  private passRewardEl(r: PassReward): HTMLElement {
    const el = h('div', { class: 'preward' });
    const bit = (icon: string, text: string) => el.append(h('span', { class: 'pr' }, h('span', { html: svgIcon(icon) }), text));
    if (r.chest) bit(itemArt({ chain: 'chest', level: r.chest }), '');
    if (r.gems) bit(ICONS.gem, faNum(r.gems));
    if (r.coins) bit(ICONS.coin, faNum(r.coins));
    if (r.energy) bit(ICONS.energy, faNum(r.energy));
    return el;
  }

  /** Pays a claimed pass reward on screen (chests go to the board). */
  private passPaid(r: PassReward, from: DOMRect): void {
    if (r.chest) this.app.giveItem({ chain: 'chest', level: r.chest });
    if (r.gems) this.app.flyReward(ICONS.gem, from, 'hud-gems', 3);
    if (r.coins) this.app.flyReward(ICONS.coin, from, 'hud-coins', 3);
    if (r.energy) this.app.flyReward(ICONS.energy, from, 'hud-energy', 3);
    sfx.coin();
    this.app.renderHud();
    this.app.dirty();
  }

  /** The season pass: a 30-step track, free rewards on one side, golden on the other. */
  pass(): Promise<void> {
    const s = this.app.s;
    if (billingAvailable()) fetchPrices().then((pr) => (this.prices = { ...this.prices, ...pr }));
    const now = new Date();
    const days = Math.max(1, Math.ceil((monthEnd(now).getTime() - now.getTime()) / 86_400_000));
    const premGems = PREMIUM.reduce((a, r) => a + (r.gems ?? 0), 0);
    return this.open(passName(now), (body, close) => {
      const render = () => {
        clear(body);
        const pr = passProgress(s);
        add(body,
          h('div', { class: 'pass-top' },
            h('div', { class: 'medal', html: svgIcon(ICONS.medal) }, h('b', {}, fa(Math.min(pr.step + 1, PASS_STEPS)))),
            h('div', { style: 'flex:1' },
              h('div', { style: 'font-weight:900' }, pr.step >= PASS_STEPS ? 'مسیر کامل شد! حالا هر ۲۵۰ نشان یه صندوقچه' : `مرحله‌ی ${fa(pr.step + 1)} از ${fa(PASS_STEPS)}`),
              h('div', { class: 'bar' }, h('div', { style: `width:${(pr.into / pr.need) * 100}%` })),
              h('div', { class: 'muted', style: 'font-size:12px' }, `${fa(pr.into)}/${fa(pr.need)} نشان · ${fa(days)} روز تا آخر ماه`))),
          h('p', { class: 'muted', style: 'font-size:12px;margin:2px 0 8px' }, 'هر ستاره‌ی سفارش یه نشانه. کارهای روزانه هم نشان می‌دن.'),
          s.pass.premium ? null : h('div', { class: 'pass-buy' },
            h('span', { html: svgIcon(ICONS.crown) }),
            h('div', { style: 'flex:1' }, h('b', {}, 'مسیر طلایی'), h('div', { style: 'font-size:12px' }, `${fa(premGems)} الماس و ۸ صندوقچه‌ی ویژه، تا آخر همین ماه`)),
            h('button', { class: 'btn gold', onclick: async () => { if (await this.purchase('pass_premium')) render(); } }, this.price('pass_premium'))),
          passClaimable(s) > 1 ? h('button', { class: 'btn', onclick: (e: Event) => {
            const from = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const total: PassReward = { coins: 0, gems: 0, energy: 0 };
            for (let n = 1; n <= PASS_STEPS; n++) {
              for (const track of ['free', 'prem'] as Track[]) {
                const got = claimPass(s, track, n);
                if (!got) continue;
                total.coins! += got.coins ?? 0;
                total.gems! += got.gems ?? 0;
                total.energy! += got.energy ?? 0;
                if (got.chest) this.app.giveItem({ chain: 'chest', level: got.chest });
              }
            }
            for (let got = claimEndless(s); got; got = claimEndless(s)) if (got.chest) this.app.giveItem({ chain: 'chest', level: got.chest });
            this.passPaid(total, from);
            this.app.renderSide();
            render();
          } }, `همه‌ی جایزه‌ها رو بگیر (${fa(passClaimable(s))})`) : null,
          h('div', { class: 'pass-head' }, h('span', {}, 'رایگان'), h('span', {}), h('span', {}, '👑 طلایی')));
        const list = h('div', { class: 'pass-list' });
        let current: HTMLElement | null = null;
        for (let n = 1; n <= PASS_STEPS; n++) {
          const cell = (track: Track) => {
            const r = (track === 'free' ? FREE : PREMIUM)[n - 1];
            const taken = s.pass[track].includes(n);
            const ready = canClaim(s, track, n);
            const locked = track === 'prem' && !s.pass.premium;
            const el = h('button', { class: `pcell ${track}${taken ? ' taken' : ''}${ready ? ' ready' : ''}${locked ? ' locked' : ''}` }, this.passRewardEl(r));
            if (taken) el.append(h('span', { class: 'tick' }, '✓'));
            if (locked) el.append(h('span', { class: 'lock' }, '🔒'));
            el.addEventListener('click', () => {
              const got = claimPass(s, track, n);
              if (!got) return this.app.toast(locked ? 'این جایزه مال مسیر طلاییه.' : taken ? 'اینو گرفتی!' : 'هنوز به این مرحله نرسیدی.');
              this.passPaid(got, el.getBoundingClientRect());
              el.classList.remove('ready');
              el.classList.add('taken');
              el.append(h('span', { class: 'tick' }, '✓'));
              this.app.renderSide();
            });
            return el;
          };
          const row = h('div', { class: `prow${n <= pr.step ? ' done' : ''}${n === pr.step + 1 ? ' cur' : ''}` }, cell('free'), h('div', { class: 'pnum' }, fa(n)), cell('prem'));
          if (n === Math.min(pr.step + 1, PASS_STEPS)) current = row;
          list.append(row);
        }
        const endless = endlessReady(s);
        list.append(h('div', { class: 'prow endless' },
          h('div', { class: 'pcell free' }, this.passRewardEl(ENDLESS_REWARD)),
          h('div', { class: 'pnum' }, '∞'),
          h('div', { style: 'font-size:12px;flex:1.4' }, `بعد از مرحله‌ی ${fa(PASS_STEPS)}: هر ${fa(ENDLESS_COST)} نشان یه صندوقچه`,
            endless ? h('button', { class: 'chip green', onclick: (e: Event) => {
              const got = claimEndless(s);
              if (got) this.passPaid(got, (e.currentTarget as HTMLElement).getBoundingClientRect());
              render();
            } }, `بگیر (${fa(endless)})`) : null)));
        body.append(list);
        // Open at the step being worked on.
        requestAnimationFrame(() => current?.scrollIntoView({ block: 'center' }));
      };
      render();
      void close;
    });
  }

  /** The live event: how it works, the milestone track, the countdown. */
  event(): Promise<void> {
    const s = this.app.s;
    const theme = s.event.theme ? THEMES[s.event.theme] : null;
    if (!theme) return Promise.resolve();
    const genName = CHAINS[theme.gen].levels[0];
    const topName = CHAINS[theme.chain].levels[maxLevel(theme.chain) - 1];
    return this.open(theme.title, (body) => {
      const render = () => {
        clear(body);
        const left = eventEnd(new Date()).getTime() - Date.now();
        add(body,
          h('div', { class: 'event-hero' },
            h('span', { html: svgIcon(itemArt({ chain: theme.gen, level: 1 })) }),
            h('b', {}, '←'),
            h('span', { html: svgIcon(itemArt({ chain: theme.chain, level: 1 })) }),
            h('b', {}, '…'),
            h('span', { html: svgIcon(itemArt({ chain: theme.chain, level: maxLevel(theme.chain) })) })),
          h('p', { style: 'font-size:13px;margin:0' }, theme.blurb),
          h('div', { class: 'timer' }, `⏳ ${faLeft(left)} مونده`));
        if (!s.event.joined) {
          body.append(h('p', {}, `از سطح ${fa(EVENT_LEVEL)} می‌تونی تو رویدادهای محله شرکت کنی. سفارش‌ها رو تحویل بده تا سطحت بالا بره!`));
          return;
        }
        const reached = milestonesReached(s);
        const pr = eventProgress(s);
        add(body,
          h('div', { class: 'ev-points' }, h('span', { html: svgIcon(itemArt({ chain: theme.gen, level: 1 })) }), `${faNum(s.event.points)} امتیاز`),
          pr.need ? h('div', { class: 'bar' }, h('div', { style: `width:${(pr.into / pr.need) * 100}%` })) : h('p', { style: 'font-weight:900' }, 'همه‌ی جایزه‌ها رو بردی! 🏆'),
          pr.need ? h('div', { class: 'muted', style: 'font-size:12px;text-align:center' }, `${fa(pr.into)}/${fa(pr.need)} تا جایزه‌ی بعدی`) : null,
          eventClaimable(s) ? h('button', { class: 'btn gold', onclick: (e: Event) => {
            const from = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const total: PassReward = { coins: 0, gems: 0, energy: 0 };
            const trophyBefore = s.trophies.length;
            for (let r = claimMilestone(s); r; r = claimMilestone(s)) {
              total.coins! += r.coins ?? 0;
              total.gems! += r.gems ?? 0;
              total.energy! += r.energy ?? 0;
              if (r.chest) this.app.giveItem({ chain: 'chest', level: r.chest });
            }
            this.passPaid(total, from);
            if (s.trophies.length > trophyBefore) this.app.toast(`جام «${trophyName(s.event.id)}» مال تو شد! 🏆`);
            this.app.renderSide();
            render();
          } }, `جایزه‌ها رو بگیر (${fa(eventClaimable(s))})`) : null);
        const track = h('div', { class: 'ev-track' });
        MILESTONES.forEach((m, k) => {
          const state = k < s.event.claimed ? 'taken' : k < reached ? 'ready' : k === reached ? 'next' : '';
          track.append(h('div', { class: `ev-node ${state}` },
            h('span', { class: 'n' }, fa(k + 1)),
            this.passRewardEl(m.reward),
            k === MILESTONES.length - 1 ? h('span', { class: 'cup', html: svgIcon(ICONS.trophy) }) : null,
            state === 'taken' ? h('span', { class: 'tick' }, '✓') : null));
        });
        add(body, track,
          h('div', { class: 'howto' },
            h('div', {}, `۱. «${genName}» رو بزن (۱ ⚡) تا وسیله‌ی رویداد بده.`),
            h('div', {}, `۲. هر ادغام امتیاز داره. «${topName}» رو دو بار بزن: +${fa(EVENT_COLLECT)} امتیاز.`),
            h('div', {}, `۳. هر سفارش هم ${fa(EVENT_ORDER)} امتیاز می‌ده. آخر رویداد جام می‌گیری!`)));
      };
      render();
    });
  }

  /** The alley race: start one, watch the lanes, collect the prize. */
  race(): Promise<void> {
    const s = this.app.s;
    const HUES = ['#e2507a', '#14879a', '#e7a512', '#7b4bb8', '#3fae5a', '#d9774a'];
    return this.open('مسابقه‌ی محله', (body) => {
      let timer = 0;
      const render = () => {
        clear(body);
        const now = Date.now();
        const r = s.race.active;
        if (!r) {
          const left = racesLeft(s, today());
          add(body,
            h('div', { class: 'offer-hero', html: svgIcon(ICONS.flag) }),
            h('p', {}, `اولین نفری باش که ${fa(RACE_GOAL)} سفارش تحویل می‌ده! چهار نفر از کوچه‌های بغل هم توی مسابقه‌ان. ۲ ساعت وقت داری.`),
            h('div', { class: 'race-prizes' }, ...RACE_REWARDS.slice(0, 3).map((rw, k) => h('div', {}, h('b', {}, ['🥇', '🥈', '🥉'][k]), this.passRewardEl(rw)))),
            h('button', { class: 'btn big', disabled: left <= 0, onclick: () => {
              if (!startRace(s, Date.now(), today(), Math.random)) return;
              sfx.zarb();
              this.app.renderSide();
              this.app.dirty();
              render();
            } }, left > 0 ? `شروع مسابقه (${fa(left)} بار دیگه امروز)` : 'امروز دیگه مسابقه نداریم. فردا!'));
          return;
        }
        const lanes = [
          { name: 'تو (نرگس)', me: true, score: playerScore(s, r), hue: '', fin: r.finishedAt ?? Infinity },
          ...r.bots.map((b) => ({ name: b.name, me: false, score: botScore(b, r, now), hue: HUES[b.hue], fin: r.start + b.finishMs })),
        ].sort((a, b) => b.score - a.score || a.fin - b.fin);
        const over = raceOver(r, now);
        const rank = raceRank(s, now);
        add(body,
          over
            ? h('div', { class: 'race-result' }, h('b', {}, rank === 1 ? 'نفر اول شدی! 🏆' : `نفر ${['', 'اول', 'دوم', 'سوم', 'چهارم', 'پنجم'][rank ?? 5]} شدی!`))
            : h('div', { class: 'timer' }, `⏳ ${faClock(r.start + RACE_MS - now)} مونده · ${fa(RACE_GOAL)} سفارش`));
        const list = h('div', { class: 'lanes' });
        for (const l of lanes) {
          list.append(h('div', { class: `lane${l.me ? ' me' : ''}` },
            l.me ? h('span', { class: 'av', html: svgIcon(portrait('narges')) }) : h('span', { class: 'av txt', style: `background:${l.hue}` }, l.name[0]),
            h('div', { class: 'lane-body' },
              h('div', { class: 'lane-name' }, l.name, h('span', {}, `${fa(l.score)}/${fa(RACE_GOAL)}`)),
              h('div', { class: 'bar' }, h('div', { style: `width:${(l.score / RACE_GOAL) * 100}%` }))),
            l.score >= RACE_GOAL ? h('span', { class: 'fin', html: svgIcon(ICONS.flag) }) : null));
        }
        body.append(list);
        if (over && rank) {
          add(body, h('div', { class: 'race-prizes' }, h('div', {}, h('b', {}, 'جایزه'), this.passRewardEl(RACE_REWARDS[rank - 1]))),
            h('button', { class: 'btn gold big', onclick: (e: Event) => {
              const got = claimRace(s, Date.now());
              if (got) this.passPaid(got, (e.currentTarget as HTMLElement).getBoundingClientRect());
              this.app.renderSide();
              render();
            } }, 'جایزه‌ام رو بده!'));
        } else {
          body.append(h('p', { class: 'muted', style: 'font-size:12px' }, 'سفارش‌ها رو تحویل بده تا جلو بیفتی. همسایه‌ها هم بیکار نمی‌شینن!'));
        }
        clearInterval(timer);
        if (!over) timer = window.setInterval(() => (body.isConnected ? render() : clearInterval(timer)), 2000);
      };
      render();
    });
  }

  bag(): Promise<void> {
    const s = this.app.s;
    return this.open('کیف', (body, close) => {
      const render = () => {
        clear(body);
        const grid = h('div', { class: 'chainrow' });
        s.bag.forEach((it, k) => {
          grid.append(h('button', { class: 'lv', onclick: () => {
            if (!it) return;
            const ev = fromBag(s, k);
            if (ev.length && ev[0].type === 'fail') return this.app.fail(ev);
            this.app.handle(ev);
            close();
          } }, h('span', { html: svgIcon(it ? itemArt(it) : '') }), it ? itemName(it) : 'خالی'));
        });
        body.append(h('p', { style: 'font-size:13px' }, 'وسیله‌ها رو برای بعد نگه دار. روی هر کدوم بزن تا برگرده تو صفحه.'), grid);
        if (s.bag.length < BAG_MAX) {
          body.append(h('button', { class: 'btn gold', onclick: () => {
            if (!buyBagSlot(s)) { close(); return this.shop(); }
            sfx.unlock();
            this.app.renderHud();
            this.app.dirty();
            render();
          } }, `یک خونه‌ی بیشتر با ${fa(bagSlotCost(s))}`, h('span', { html: svgIcon(ICONS.gem) })));
        }
        if (s.shelf.length) {
          const shelf = h('div', { class: 'chainrow', id: 'shelf' });
          s.shelf.forEach((it, k) => shelf.append(h('button', { class: 'lv', onclick: () => {
            const ev = unshelve(s, k);
            if (ev.length && ev[0].type === 'fail') return this.app.fail(ev);
            this.app.handle(ev);
            this.app.dirty();
            close();
          } }, h('span', { html: svgIcon(itemArt(it)) }), itemName(it))));
          body.append(h('h3', { style: 'margin:14px 0 4px;font-size:15px' }, `انبار مولدها (${fa(s.shelf.length)})`),
            h('p', { style: 'font-size:13px' }, 'تا وقتی یه مولد این‌جاست، کسی ازش سفارش نمی‌ده. بزن تا برگرده.'), shelf);
        }
      };
      render();
    });
  }

  chain(it: Item): Promise<void> {
    const def = CHAINS[it.chain];
    return this.open(def.name, (body) => {
      const row = h('div', { class: 'chainrow' });
      def.levels.forEach((name, k) =>
        row.append(h('div', { class: `lv${k + 1 === it.level ? ' cur' : ''}` }, h('span', { html: svgIcon(itemArt({ chain: it.chain, level: k + 1 })) }), `${fa(k + 1)}. ${name}`)));
      body.append(row);
      if (def.produces) {
        const prod = CHAINS[def.produces];
        body.append(h('p', {}, `این مولد «${prod.name}» می‌سازه:`));
        const r2 = h('div', { class: 'chainrow' });
        prod.levels.forEach((name, k) => r2.append(h('div', { class: 'lv' }, h('span', { html: svgIcon(itemArt({ chain: def.produces!, level: k + 1 })) }), name)));
        body.append(r2);
      }
    });
  }

  levelUp(level: number, gems: number, gift: Item | null): Promise<void> {
    sfx.levelUp();
    confetti(40);
    const chip = (icon: string, text: string) => h('span', { class: 'got' }, h('span', { html: svgIcon(icon) }), text);
    return this.open(`سطح ${fa(level)}!`, (body, close) => {
      add(body,
        h('div', { class: 'hero-wrap' }, rays(), h('div', { class: 'hero bounce', html: svgIcon(ICONS.star) }, h('b', {}, fa(level)))),
        h('div', { class: 'contents' }, chip(ICONS.gem, faNum(gems)), chip(ICONS.energy, '۲۰'), gift ? chip(itemArt(gift), itemName(gift)) : null),
        gift ? h('p', { style: 'font-size:13px' }, `«${itemName(gift)}» به صفحه اضافه شد!`) : null,
        UNLOCKS[level] ? h('div', { class: 'unlock' }, '🔓 تازه باز شد: ', h('b', {}, UNLOCKS[level])) : null,
        h('button', { class: 'btn big', onclick: close }, 'عالیه!'),
      );
    }, false);
  }

  /** Back after a few days away: the neighbours kept something for you. */
  welcome(g: WelcomeGift): Promise<void> {
    const s = this.app.s;
    sfx.levelUp();
    const chip = (icon: string, text: string) => h('span', { class: 'got' }, h('span', { html: svgIcon(icon) }), text);
    const chest = { chain: 'chest' as const, level: g.chest };
    return this.open('خوش برگشتی!', (body, close) => {
      add(body,
        h('div', { class: 'order-sheet' },
          h('div', { class: 'who', html: svgIcon(portrait('mahin', 'happy')) }),
          h('p', { style: 'flex:1;text-align:right;margin:0' }, `${fa(g.days)} روزه نبودی! کوچه بدون تو سوت و کور بود. همسایه‌ها برات یه چیزی کنار گذاشتن…`)),
        h('div', { class: 'contents' }, chip(ICONS.energy, faNum(g.energy)), chip(ICONS.gem, faNum(g.gems)), chip(itemArt(chest), itemName(chest))),
        h('button', { class: 'btn big', onclick: () => {
          addEnergy(s, g.energy);
          s.gems += g.gems;
          this.app.giveItem(chest);
          this.app.renderAll();
          this.app.dirty();
          close();
        } }, 'ممنون!'),
      );
    }, false);
  }

  /** The prize for finishing a season; the hundredth episode gets a golden one. */
  seasonReward(r: SeasonReward): Promise<void> {
    const s = this.app.s;
    sfx.levelUp();
    const chip = (icon: string, text: string) => h('span', { class: 'got' }, h('span', { html: svgIcon(icon) }), text);
    const chest = { chain: 'chest' as const, level: r.chest };
    const big = r.season % 20 === 0;
    return this.open(big ? 'صدمین قسمت!' : `فصل ${fa(r.season)} تموم شد!`, (body, close) => {
      add(body,
        h('div', { class: 'hero-wrap small' }, rays(), h('b', { class: 'ep-name' }, big ? 'صد قسمت قصه‌ی کوچه' : 'جایزه‌ی پایان فصل')),
        h('div', { class: 'order-sheet' },
          h('div', { class: 'who', html: svgIcon(portrait('narges', 'happy')) }),
          h('p', { style: 'flex:1;text-align:right;margin:0' }, big
            ? 'صد قسمت کنار همسایه‌ها! هیچ‌کدوم از این‌ها بدون تو نمی‌شد. این جایزه‌ی ویژه‌ی صدمین قسمته.'
            : 'یه فصل دیگه از قصه‌ی کوچه تموم شد. همسایه‌ها برات یه جایزه کنار گذاشتن!')),
        h('div', { class: 'contents' }, chip(ICONS.energy, faNum(r.energy)), chip(ICONS.gem, faNum(r.gems)), chip(itemArt(chest), itemName(chest))),
        h('button', { class: 'btn big', onclick: () => {
          addEnergy(s, r.energy);
          s.gems += r.gems;
          this.app.giveItem(chest);
          this.app.renderAll();
          this.app.dirty();
          close();
        } }, 'ممنون!'),
      );
      if (big) setTimeout(() => confetti(80), 300);
    }, false);
  }

  daily(index: number): Promise<void> {
    const r = DAILY_REWARDS[index];
    sfx.coin();
    return this.open('هدیه‌ی روزانه', (body, close) => {
      const row = h('div', { class: 'chainrow' });
      DAILY_REWARDS.forEach((d, k) => {
        const label = [d.coins ? `${fa(d.coins)} سکه` : '', d.energy ? `${fa(d.energy)} ⚡` : '', d.gems ? `${fa(d.gems)} 💎` : ''].filter(Boolean).join(' ');
        row.append(h('div', { class: `lv${k === index ? ' cur' : ''}`, style: k < index ? 'opacity:.5' : '' },
          h('span', { html: svgIcon(d.gems ? ICONS.gem : d.energy ? ICONS.energy : ICONS.coin) }), `روز ${fa(k + 1)}`, h('br'), label));
      });
      body.append(row, h('p', {}, 'هر روز سر بزن تا هدیه‌ها بزرگ‌تر بشن!'));
      body.append(h('button', { class: 'btn', onclick: close }, `گرفتم! ${[r.coins ? `${fa(r.coins)} سکه` : '', r.energy ? `${fa(r.energy)} انرژی` : '', r.gems ? `${fa(r.gems)} الماس` : ''].filter(Boolean).join(' + ')}`));
    }, false);
  }

  quests(): Promise<void> {
    const s = this.app.s;
    const label = { merges: 'ادغام کن', orders: 'سفارش تحویل بده', taps: 'مولدها رو بزن' } as const;
    return this.open('کارهای روزانه', (body) => {
      const render = () => {
        clear(body);
        body.append(h('p', { style: 'font-size:13px' }, 'هر روز سه کار تازه. همه رو انجام بدی، یه صندوقچه‌ی مسی هم جایزه داری!'));
        s.quests.list.forEach((q, k) => {
          const prog = questProgress(s, q);
          const reward = [q.reward.coins ? `${fa(q.reward.coins)} سکه` : '', q.reward.energy ? `${fa(q.reward.energy)} انرژی` : '', q.reward.gems ? `${fa(q.reward.gems)} الماس` : '', s.level >= 2 ? `${fa(QUEST_POINTS)} نشان` : ''].filter(Boolean).join(' · ');
          body.append(h('div', { class: 'quest' },
            h('div', { class: 'qtext' }, `${fa(q.target)} بار ${label[q.kind]}`, h('div', { class: 'qbar' }, h('div', { style: `width:${(prog / q.target) * 100}%` })), h('div', { class: 'qsub' }, `${fa(prog)} / ${fa(q.target)} · جایزه: ${reward}`)),
            q.claimed
              ? h('span', { class: 'chip' }, '✓')
              : h('button', { class: `chip ${questDone(s, q) ? 'green' : ''}`, disabled: !questDone(s, q), onclick: () => {
                  if (!claimQuest(s, k)) return;
                  sfx.coin();
                  this.app.renderAll();
                  this.app.dirty();
                  render();
                } }, 'بگیر')));
        });
        if (allQuestsClaimed(s) && !s.quests.bonusClaimed) {
          body.append(h('button', { class: 'btn gold', onclick: () => {
            const chest = claimQuestBonus(s);
            if (!chest) return;
            this.app.giveItem(chest);
            sfx.levelUp();
            this.app.renderAll();
            this.app.dirty();
            render();
          } }, `جایزه‌ی ویژه: صندوقچه‌ی مسی 🎁${s.level >= 2 ? ` + ${fa(QUEST_BONUS_POINTS)} نشان` : ''}`));
        }
      };
      render();
    });
  }

  /** After the first episode: rating, sharing and the notification permission. */
  async rateAsk(): Promise<void> {
    await this.open('قسمت اول تموم شد! 🎉', (body, close) => {
      body.append(
        h('p', {}, 'اگه از «محله‌ی ما» خوشت اومده، با یه امتیاز ۵ ستاره کمک کن کوچه بیشتر دیده بشه!'),
        h('button', { class: 'btn gold', onclick: () => { rateOnStore(); this.app.s.gems += 5; this.app.renderHud(); this.app.dirty(); close(); } }, '⭐ امتیاز بده (۵ الماس هدیه)'),
        h('button', { class: 'btn pink', onclick: () => { shareGame(); close(); } }, 'دوستاتو دعوت کن'),
        h('button', { class: 'btn plain', onclick: close }, 'بعداً'),
      );
    });
    await askNotifications();
  }

  /** Moving progress between phones with a code (the game has no accounts or server). */
  transfer(): Promise<void> {
    const s = this.app.s;
    return this.open('انتقال پیشرفت', (body, close) => {
      const code = encodeSave(JSON.stringify(s));
      const mine = h('textarea', { class: 'code', readonly: true, rows: 3 });
      mine.value = code;
      const input = h('textarea', { class: 'code', rows: 3, placeholder: 'کد رو اینجا بچسبون…' });
      add(body,
        h('p', { style: 'font-size:13px' }, 'این کد همه‌ی پیشرفتت رو داره. برای خودت بفرست (مثلاً تو پیام‌رسان) و روی گوشی جدید واردش کن.'),
        mine,
        h('div', { class: 'grid2' },
          h('button', { class: 'btn', onclick: async () => this.app.toast((await copyText(code)) ? 'کد کپی شد!' : 'کپی نشد؛ متن رو نگه دار و کپی کن.') }, 'کپی کد'),
          h('button', { class: 'btn pink', onclick: () => shareText('کد پیشرفت محله‌ی ما', code) }, 'ارسال برای خودم')),
        h('p', { style: 'font-weight:900;margin-top:14px' }, 'کد داری؟ واردش کن:'),
        input,
        h('button', { class: 'btn gold', onclick: async () => {
          const json = decodeSave(input.value);
          const next = json ? loadState(json) : null;
          if (!next) return this.app.toast('این کد درست نیست. کامل کپی‌اش کن و دوباره امتحان کن.');
          await this.open('جایگزین بشه؟', (b2, c2) => {
            add(b2,
              h('p', {}, `پیشرفت این گوشی (سطح ${fa(s.level)}) پاک می‌شه و پیشرفت کد (سطح ${fa(next.level)}، ${fa(next.tasksDone.length)} تعمیر) جاش میاد.`),
              h('button', { class: 'btn pink', onclick: async () => {
                this.app.s = next;
                await this.app.saveNow();
                c2();
                close();
                location.reload();
              } }, 'آره، جایگزین کن'),
              h('button', { class: 'btn plain', onclick: c2 }, 'نه'));
          });
        } }, 'بارگذاری پیشرفت'));
    });
  }

  settings(): Promise<void> {
    const s = this.app.s;
    return this.open('پروفایل و تنظیمات', (body, close) => {
      const cur = xpForLevel(s.level), next = xpForLevel(s.level + 1);
      const total = CODEX_CHAINS.reduce((n, c) => n + maxLevel(c), 0);
      add(body, h('div', { class: 'profile' },
        h('div', { class: 'level-badge big' }, h('span', {}, fa(s.level))),
        h('div', { style: 'flex:1' },
          h('div', { style: 'font-weight:900' }, `سطح ${fa(s.level)}`),
          h('div', { class: 'bar' }, h('div', { style: `width:${((s.xp - cur) / Math.max(1, next - cur)) * 100}%` })),
          h('div', { class: 'muted', style: 'font-size:12px' }, `${fa(Math.max(0, next - s.xp))} ستاره‌ی دیگه تا سطح بعد`))),
        h('div', { class: 'stats' },
          h('div', {}, h('b', {}, faNum(s.stats.merges)), 'ادغام'),
          h('div', {}, h('b', {}, faNum(s.stats.orders)), 'سفارش'),
          h('div', {}, h('b', {}, `${fa(s.found.length)}/${fa(total)}`), 'کلکسیون'),
          h('div', {}, h('b', {}, fa(s.tasksDone.length)), 'تعمیر')),
        s.trophies.length ? h('div', { class: 'trophies' },
          h('b', {}, 'جام‌ها'),
          ...s.trophies.map((id) => h('span', { class: 'got' }, h('span', { html: svgIcon(ICONS.trophy) }), trophyName(id)))) : null);
      const toggle = (label: string, get: () => boolean, set: (v: boolean) => void) => {
        const btn = h('button', { class: `btn ${get() ? '' : 'plain'}` }, `${label}: ${get() ? 'روشن' : 'خاموش'}`);
        btn.addEventListener('click', () => {
          set(!get());
          btn.className = `btn ${get() ? '' : 'plain'}`;
          btn.textContent = `${label}: ${get() ? 'روشن' : 'خاموش'}`;
        });
        return btn;
      };
      body.append(
        toggle('موسیقی', musicEnabled, (v) => { setMusic(v); writeSetting('music', v ? '1' : '0'); }),
        toggle('صدا', soundOn, (v) => { setSound(v); writeSetting('sound', v ? '1' : '0'); }),
        toggle('لرزش', () => hapticsOn, (v) => { hapticsOn = v; setHaptics(v); writeSetting('haptics', v ? '1' : '0'); }),
        h('button', { class: 'btn plain', onclick: () => this.transfer() }, '📲 انتقال به گوشی دیگه'),
        h('button', { class: 'btn gold', onclick: () => rateOnStore() }, '⭐ امتیاز بده'),
        h('button', { class: 'btn pink', onclick: () => shareGame() }, 'دعوت از دوستان'),
        h('p', { style: 'font-size:13px' }, 'محله‌ی ما — نسخه‌ی ', fa(__APP_VERSION__)),
        h('p', { style: 'font-size:12px' }, 'بازی کاملاً آفلاینه و پیشرفتت روی همین گوشی ذخیره می‌شه.'),
        h('button', { class: 'btn plain', onclick: async () => {
          await this.open('شروع دوباره؟', (b2, c2) => {
            b2.append(h('p', {}, 'همه‌ی پیشرفتت پاک می‌شه و بازی از اول شروع می‌شه. مطمئنی؟'),
              h('button', { class: 'btn pink', onclick: async () => {
                this.app.s = newGame((Math.random() * 2 ** 32) >>> 0, Date.now());
                await this.app.saveNow();
                c2();
                close();
                location.reload();
              } }, 'آره، از اول'),
              h('button', { class: 'btn plain', onclick: c2 }, 'نه'));
          });
        } }, 'شروع دوباره‌ی بازی'),
      );
    });
  }
}
