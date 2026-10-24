// Rewarded video through the native Tapsell plugin (domestic ad network, works during
// international internet cuts). Opt-in only: the game never shows forced ads.

import { Capacitor, registerPlugin } from '@capacitor/core';
import { TAPSELL_APP_KEY, TAPSELL_REWARDED_ZONE } from './config';

interface TapsellPlugin {
  init(opts: { appKey: string }): Promise<void>;
  showRewarded(opts: { zoneId: string }): Promise<{ rewarded: boolean }>;
}

const Tapsell = registerPlugin<TapsellPlugin>('Tapsell');
let ready = false;

/** Browser testing only: localStorage `mahalle.fakeAds = 1` pretends every video was watched. */
const fake = !Capacitor.isNativePlatform() && (() => {
  try {
    return localStorage.getItem('mahalle.fakeAds') === '1';
  } catch {
    return false;
  }
})();

export function adsAvailable(): boolean {
  return fake || (Capacitor.isNativePlatform() && TAPSELL_APP_KEY.length > 0 && TAPSELL_REWARDED_ZONE.length > 0);
}

export async function initAds(): Promise<void> {
  if (fake) {
    ready = true;
    return;
  }
  if (!adsAvailable()) return;
  try {
    await Tapsell.init({ appKey: TAPSELL_APP_KEY });
    ready = true;
  } catch {
    ready = false;
  }
}

/** Resolves true only if the viewer watched to the end. */
export async function showRewarded(): Promise<boolean> {
  if (!ready) return false;
  if (fake) return new Promise((r) => setTimeout(() => r(true), 300));
  try {
    return (await Tapsell.showRewarded({ zoneId: TAPSELL_REWARDED_ZONE })).rewarded;
  } catch {
    return false;
  }
}
