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

export function adsAvailable(): boolean {
  return Capacitor.isNativePlatform() && TAPSELL_APP_KEY.length > 0 && TAPSELL_REWARDED_ZONE.length > 0;
}

export async function initAds(): Promise<void> {
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
  try {
    return (await Tapsell.showRewarded({ zoneId: TAPSELL_REWARDED_ZONE })).rewarded;
  } catch {
    return false;
  }
}
