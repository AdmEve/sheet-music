// Rating on Cafe Bazaar and sharing the game.

import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Bazaar } from './billing';

export const STORE_URL = 'https://cafebazaar.ir/app/com.admeve.mahalle';

export async function rateOnBazaar(): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    try {
      await Bazaar.rate();
      return;
    } catch {
      /* Bazaar not installed: fall through to the web page */
    }
  }
  window.open(STORE_URL, '_blank');
}

export async function shareGame(): Promise<void> {
  const text = 'دارم «محله‌ی ما» رو بازی می‌کنم؛ یه بازی ادغام ایرانی با داستان یه کوچه‌ی قدیمی تهرون. تو هم بیا! ';
  try {
    await Share.share({ title: 'محله‌ی ما', text, url: STORE_URL, dialogTitle: 'دعوت از دوستان' });
  } catch {
    try {
      await navigator.clipboard.writeText(text + STORE_URL);
    } catch {
      /* ignore */
    }
  }
}
