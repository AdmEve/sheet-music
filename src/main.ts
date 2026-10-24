// Boot: load the save (or start a new game), show the splash, then the board.

import './ui/style.css';
import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { DEFS } from './art/defs';
import { itemArt } from './art/index';
import { ENERGY_CAP, ENERGY_REGEN_MS, claimDaily, loadState, newGame, refreshQuests, tickEnergy } from './game/model';
import { clearReminders, scheduleReminders } from './platform/notify';
import { initAds } from './platform/ads';
import { connectBilling, pendingPurchases, watchBillingConnection } from './platform/billing';
import { backupBrokenSave, loadSave, loadSetting } from './platform/storage';
import { App } from './ui/app';
import { animDone, dateKey, h, svgIcon } from './ui/dom';
import { initToggles } from './ui/modals';
import { setMusic, startMusic, stopMusic } from './ui/sound';


async function boot(): Promise<void> {
  document.body.insertAdjacentHTML('afterbegin', DEFS);
  const [save, sound, haptics, music] = await Promise.all([loadSave(), loadSetting('sound'), loadSetting('haptics'), loadSetting('music')]);
  // Music starts only after the splash tap (browsers/WebViews need a user gesture).
  initToggles(sound !== '0', haptics !== '0', false);
  const loaded = loadState(save);
  // A save that exists but cannot be read is kept aside, never silently overwritten.
  if (save && !loaded) await backupBrokenSave(save);
  const fresh = !loaded;
  const state = loaded ?? newGame((Math.random() * 2 ** 32) >>> 0, Date.now());
  tickEnergy(state, Date.now());
  refreshQuests(state, dateKey(new Date()));

  const root = document.getElementById('app')!;
  const app = new App(root, state);
  app.mount();

  await splash();
  setMusic(music !== '0');

  // Store connections happen in the background; the game never waits on them.
  connectBilling().then(async (ok) => {
    if (!ok) return;
    watchBillingConnection();
    // Paid but unconsumed purchases: grant the ones we never granted, then consume all.
    for (const { product, token } of await pendingPurchases()) {
      if (app.s.grantedTokens.includes(token)) await app.modals.finishPurchase(token);
      else await app.modals.grant(product.sku, token);
    }
  });
  initAds();

  if (fresh) await app.firstRun();
  const now = new Date();
  const yesterday = new Date(now.getTime() - 86_400_000);
  const daily = claimDaily(app.s, dateKey(now), dateKey(yesterday));
  if (daily !== null && !fresh) {
    await app.modals.daily(daily);
    app.renderHud();
  }
  app.dirty();
  app.tutorial();

  // Android back: close the top-most window; on the board, send the app to the background.
  if (Capacitor.isNativePlatform()) {
    CapApp.addListener('backButton', () => {
      const dialogue = document.querySelector('.dialogue') as HTMLElement | null;
      if (dialogue) return dialogue.click();
      const map = document.querySelector('.mapview .top .chip') as HTMLElement | null;
      if (map && !document.querySelector('.overlay')) return map.click();
      const overlays = document.querySelectorAll('.overlay');
      const top = overlays[overlays.length - 1];
      if (top) {
        (top.querySelector('.close') as HTMLElement | null)?.click();
        return; // non-closable windows (level up etc.) close with their own button
      }
      const back = document.querySelector('.place .top .chip') as HTMLElement | null;
      if (back) return back.click();
      app.saveNow().then(() => CapApp.minimizeApp());
    });
  }

  // Lets the store-screenshot script stage a story line (nothing in the game fires this).
  document.addEventListener('debug-line', (e) => app.place.dialogue([(e as CustomEvent).detail]));

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      app.saveNow();
      stopMusic();
      const s = app.s;
      scheduleReminders(s.energy >= ENERGY_CAP ? null : s.energyAt + (ENERGY_CAP - s.energy) * ENERGY_REGEN_MS);
    } else {
      clearReminders();
      startMusic();
      tickEnergy(app.s, Date.now());
      app.renderHud();
    }
  });
}

function splash(): Promise<void> {
  return new Promise((resolve) => {
    const el = h('div', { class: 'splash' },
      h('div', { class: 'logo' },
        h('div', { html: svgIcon(itemArt({ chain: 'tea', level: 10 })) }),
        h('h1', {}, 'محله‌ی ما'),
        h('div', { class: 'sub' }, 'ادغام کن، کوچه رو نجات بده!'),
        h('div', { class: 'tap' }, 'برای شروع بزن')));
    document.body.append(el);
    el.addEventListener('click', () => {
      animDone(el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250 }), 250).then(() => el.remove());
      resolve();
    });
  });
}

// Last-resort guards: log and keep playing rather than freezing on an unexpected error.
window.addEventListener('error', (e) => console.error('game error', e.error ?? e.message));
window.addEventListener('unhandledrejection', (e) => console.error('game rejection', e.reason));

boot().catch((e) => {
  console.error('boot failed', e);
  document.body.insertAdjacentHTML('beforeend', '<div style="padding:24px;text-align:center;font-family:sans-serif">مشکلی پیش اومد. لطفاً بازی رو ببند و دوباره باز کن.</div>');
});
