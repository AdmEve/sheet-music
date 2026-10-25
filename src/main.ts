import './style.css';
import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { sfx, startMusic, stopMusic } from './audio';
import { botPick } from './game/bot';
import { initMonetization } from './monetize';
import { save } from './save';
import { closeTopModal, modalStack, transition } from './ui/dom';
import { activeView, leaveGame, openPause, startLevel } from './ui/game';
import { showHome } from './ui/home';
import { refreshCoins } from './ui/hud';
import { GIRIH_TILE, installIconDefs } from './ui/icons';
import { nav } from './ui/nav';

nav.home = (opts) => transition(() => { leaveGame(); showHome(); }, opts?.from);
nav.play = (opts) => transition(() => {
  startLevel();
  if (new URLSearchParams(location.search).has('debug')) {
    (window as unknown as { __pishi: unknown }).__pishi = { get view() { return activeView(); }, botPick };
  }
}, opts?.from);

function onBack() {
  if (modalStack.length) { closeTopModal(); return; }
  if (nav.screen === 'game') { openPause(); return; }
  CapApp.exitApp().catch(() => {});
}

async function boot() {
  installIconDefs();
  document.documentElement.style.setProperty('--girih', `url("${GIRIH_TILE}")`);
  const app = document.getElementById('app')!;
  app.append(Object.assign(document.createElement('div'), { id: 'screen' }));
  if (Capacitor.isNativePlatform()) {
    StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    CapApp.addListener('backButton', onBack);
    CapApp.addListener('pause', () => { const v = activeView(); if (v) v.paused = true; stopMusic(); });
    CapApp.addListener('resume', () => {
      if (save.settings.music) startMusic();
      if (nav.screen === 'game' && !modalStack.length) openPause();
    });
  }
  await document.fonts?.load('900 20px Vazirmatn').catch(() => {});
  showHome();
  SplashScreen.hide({ fadeOutDuration: 300 }).catch(() => {});
  const startAudio = () => {
    sfx.unlock();
    if (save.settings.music) startMusic();
    window.removeEventListener('pointerdown', startAudio);
  };
  window.addEventListener('pointerdown', startAudio);
  initMonetization().then(() => refreshCoins()).catch(() => {});
  if (new URLSearchParams(location.search).has('debug')) {
    (window as unknown as { __pishi: unknown }).__pishi = { get view() { return activeView(); }, botPick };
  }
}

void boot();
