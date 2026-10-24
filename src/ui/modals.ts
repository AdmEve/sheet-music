// Pop-up windows: shop, energy, bag, item chain, level up, daily gift, settings.

import { itemArt } from '../art/index';
import { ICONS } from '../art/icons';
import { CHAINS, Item, itemName } from '../game/items';
import {
  BAG_MAX, COIN_CHEST_PRICE, COIN_ENERGY_AMOUNT, DAILY_REWARDS, ENERGY_CAP, addEnergy, adsLeft, bagSlotCost, buyBagSlot,
  buyChestWithCoins, buyEnergyWithCoins, claimQuest, claimQuestBonus, coinEnergyLeft, coinEnergyPrice, countAd, fromBag,
  newGame, questDone, questProgress,
} from '../game/model';
import { adsAvailable, showRewarded } from '../platform/ads';
import { PRODUCTS, billingAvailable, buy, fetchPrices } from '../platform/billing';
import { MAX_ADS_PER_DAY } from '../platform/config';
import { setHaptics } from '../platform/haptics';
import { askNotifications } from '../platform/notify';
import { rateOnBazaar, shareGame } from '../platform/social';
import { writeSetting } from '../platform/storage';
import type { App } from './app';
import { add, clear, fa, faNum, faTime, h, svgIcon } from './dom';
import { musicEnabled, setMusic, setSound, sfx, soundOn } from './sound';

export const REFILL_GEMS = 20;
const today = () => new Date().toLocaleDateString('en-CA');

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

  energy(): Promise<void> {
    const s = this.app.s;
    return this.open('انرژی', (body, close) => {
      const left = adsLeft(s, today(), MAX_ADS_PER_DAY);
      add(body,
        h('div', { style: 'width:90px;height:90px;margin:0 auto', html: svgIcon(itemArt({ chain: 'energy', level: 3 })) }),
        h('p', {}, `انرژی: ${fa(s.energy)} از ${fa(ENERGY_CAP)}`),
        s.energy < ENERGY_CAP ? h('p', { style: 'font-size:13px' }, `هر ۲ دقیقه یک انرژی پر می‌شه. انرژی بعدی: ${faTime(Math.max(0, 120000 - (Date.now() - s.energyAt)))}`) : null,
        h('button', { class: 'btn gold', onclick: () => {
          if (s.gems < REFILL_GEMS) { close(); return this.shop(); }
          s.gems -= REFILL_GEMS;
          addEnergy(s, ENERGY_CAP);
          sfx.levelUp();
          this.app.renderHud();
          this.app.dirty();
          close();
        } }, `+${fa(ENERGY_CAP)} انرژی با ${fa(REFILL_GEMS)}`, h('span', { html: svgIcon(ICONS.gem) })),
        adsAvailable()
          ? h('button', { class: 'btn pink', disabled: left <= 0, onclick: async () => {
              if (await showRewarded()) {
                countAd(s, today());
                addEnergy(s, 30);
                sfx.levelUp();
                this.app.renderHud();
                this.app.dirty();
              } else this.app.toast('ویدیو در دسترس نیست. کمی بعد دوباره امتحان کن.');
              close();
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
      for (const p of PRODUCTS) {
        if (p.once && s.bought.includes(p.sku)) continue;
        const price = this.prices[p.sku] ?? p.fallbackPrice;
        const art = p.once ? itemArt({ chain: 'chest', level: 3 }) : ICONS.gem;
        const parts = [`${fa(p.gems)} الماس`, p.energy ? `${fa(p.energy)} انرژی` : '', p.chest ? 'صندوقچه‌ی طلایی' : ''].filter(Boolean).join(' + ');
        const buyBtn = h('button', { class: 'btn', onclick: async () => {
          const r = await buy(p.sku);
          if (!r.ok) {
            if (r.reason === 'unavailable') this.app.toast('خرید فقط در نسخه‌ی نصب‌شده از بازار فعاله.');
            else if (r.reason === 'error') this.app.toast('خرید انجام نشد. دوباره امتحان کن.');
            return;
          }
          this.grant(p.sku);
          close();
        } }, price);
        grid.append(
          p.once
            ? h('div', { class: 'offer special' },
                h('div', { class: 'art', html: svgIcon(art) }),
                h('div', { style: 'flex:1' }, h('span', { class: 'tag' }, 'فقط یک بار'), h('div', { class: 'amount' }, p.title), h('div', { style: 'font-size:12px' }, parts), buyBtn))
            : h('div', { class: 'offer' }, h('div', { class: 'art', html: svgIcon(art) }), h('div', { class: 'amount' }, faNum(p.gems)), h('div', { style: 'font-size:12px' }, p.title), buyBtn),
        );
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
          if (await showRewarded()) {
            countAd(s, today());
            s.gems += 3;
            sfx.coin();
            this.app.renderHud();
            this.app.dirty();
            this.app.toast('۳ الماس هدیه گرفتی!');
          }
          close();
        } }, h('span', { html: svgIcon(ICONS.video) }), `۳ الماس رایگان با دیدن ویدیو (${fa(left)})`));
      }
      body.append(h('p', { style: 'font-size:11px;color:#7a5a44' }, 'پرداخت امن از طریق کافه‌بازار. خریدها روی همین گوشی ذخیره می‌شن.'));
    });
  }

  /** Delivers a paid product (also used to recover unconsumed purchases on start). */
  grant(sku: string): void {
    const s = this.app.s;
    const p = PRODUCTS.find((x) => x.sku === sku);
    if (!p) return;
    s.gems += p.gems;
    if (p.energy) addEnergy(s, p.energy);
    if (p.chest) this.app.giveItem({ chain: 'chest', level: p.chest });
    if (p.once && !s.bought.includes(p.sku)) s.bought.push(p.sku);
    sfx.levelUp();
    this.app.renderHud();
    this.app.saveNow();
    this.app.toast(`${p.title} اضافه شد. ممنون از حمایتت!`);
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
    return this.open(`سطح ${fa(level)}!`, (body, close) => {
      add(body,
        h('div', { style: 'width:80px;height:80px;margin:0 auto', html: svgIcon(ICONS.star) }),
        h('p', {}, `جایزه: ${fa(gems)} الماس و ۲۰ انرژی`),
        gift ? h('div', { style: 'width:80px;height:80px;margin:0 auto', html: svgIcon(itemArt(gift)) }) : null,
        gift ? h('p', {}, `«${itemName(gift)}» به صفحه اضافه شد!`) : null,
        h('button', { class: 'btn', onclick: close }, 'عالیه!'),
      );
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
          const reward = [q.reward.coins ? `${fa(q.reward.coins)} سکه` : '', q.reward.energy ? `${fa(q.reward.energy)} انرژی` : '', q.reward.gems ? `${fa(q.reward.gems)} الماس` : ''].filter(Boolean).join(' ');
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
        if (s.quests.list.every((q) => q.claimed) && !s.quests.bonusClaimed) {
          body.append(h('button', { class: 'btn gold', onclick: () => {
            const chest = claimQuestBonus(s);
            if (!chest) return;
            this.app.giveItem(chest);
            sfx.levelUp();
            this.app.renderAll();
            this.app.dirty();
            render();
          } }, 'جایزه‌ی ویژه: صندوقچه‌ی مسی 🎁'));
        }
      };
      render();
    });
  }

  /** After the first episode: rating, sharing and the notification permission. */
  async rateAsk(): Promise<void> {
    await this.open('قسمت اول تموم شد! 🎉', (body, close) => {
      body.append(
        h('p', {}, 'اگه از «محله‌ی ما» خوشت اومده، با یه امتیاز ۵ ستاره تو بازار کمک کن کوچه بیشتر دیده بشه!'),
        h('button', { class: 'btn gold', onclick: () => { rateOnBazaar(); this.app.s.gems += 5; this.app.renderHud(); this.app.dirty(); close(); } }, '⭐ امتیاز بده (۵ الماس هدیه)'),
        h('button', { class: 'btn pink', onclick: () => { shareGame(); close(); } }, 'دوستاتو دعوت کن'),
        h('button', { class: 'btn plain', onclick: close }, 'بعداً'),
      );
    });
    await askNotifications();
  }

  settings(): Promise<void> {
    return this.open('تنظیمات', (body, close) => {
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
        h('button', { class: 'btn gold', onclick: () => rateOnBazaar() }, '⭐ امتیاز در بازار'),
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
