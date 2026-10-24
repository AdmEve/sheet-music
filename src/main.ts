// Boot: load the save (or start a new game), show the splash, then the board.

import './ui/style.css';
import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { DEFS } from './art/defs';
import { itemArt } from './art/index';
import { ENERGY_CAP, ENERGY_REGEN_MS, claimDaily, loadState, newGame, tickEnergy } from './game/model';
import { clearReminders, scheduleReminders } from './platform/notify';
import { initAds } from './platform/ads';
import { connectBilling, recoverPending } from './platform/billing';
import { loadSave, loadSetting } from './platform/storage';
import { App } from './ui/app';
import { h, svgIcon } from './ui/dom';
import { initToggles } from './ui/modals';
import { setMusic, startMusic, stopMusic } from './ui/sound';

const dateKey = (d: Date) => d.toLocaleDateString('en-CA');

async function boot(): Promise<void> {
  document.body.insertAdjacentHTML('afterbegin', DEFS);
  const [save, sound, haptics, music] = await Promise.all([loadSave(), loadSetting('sound'), loadSetting('haptics'), loadSetting('music')]);
  // Music starts only after the splash tap (browsers/WebViews need a user gesture).
  initToggles(sound !== '0', haptics !== '0', false);
  const fresh = !save;
  const state = loadState(save) ?? newGame((Math.random() * 2 ** 32) >>> 0, Date.now());
  tickEnergy(state, Date.now());

  const root = document.getElementById('app')!;
  const app = new App(root, state);
  app.mount();

  await splash();
  setMusic(music !== '0');

  // Store connections happen in the background; the game never waits on them.
  connectBilling().then(async (ok) => {
    if (!ok) return;
    for (const p of await recoverPending()) app.modals.grant(p.sku);
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
      const close = document.querySelector('.overlay:last-of-type .close') as HTMLElement | null;
      if (close) return close.click();
      if (document.querySelector('.overlay')) return; // non-closable (level up etc.): use its button
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
      el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250 }).finished.then(() => el.remove());
      resolve();
    });
  });
}

boot();
