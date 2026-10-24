// Rating on the store this build came from (Bazaar or Myket) and sharing the game.

import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Store, getStoreInfo } from './billing';


export async function rateOnStore(): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    try {
      await Store.rate();
      return;
    } catch {
      /* store app not installed: fall through to the web page */
    }
  }
  window.open((await getStoreInfo()).url, '_blank');
}

export async function shareGame(): Promise<void> {
  const text = 'دارم «محله‌ی ما» رو بازی می‌کنم؛ یه بازی ادغام ایرانی با داستان یه کوچه‌ی قدیمی تهرون. تو هم بیا! ';
  try {
    await Share.share({ title: 'محله‌ی ما', text, url: (await getStoreInfo()).url, dialogTitle: 'دعوت از دوستان' });
  } catch {
    try {
      await navigator.clipboard.writeText(text + (await getStoreInfo()).url);
    } catch {
      /* ignore */
    }
  }
}

/** Copies text; falls back to a hidden textarea where the async clipboard is missing. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.append(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

/** Sends the save code to a messenger (Telegram, Bale, Eitaa…) so the player keeps it. */
export async function shareText(title: string, text: string): Promise<boolean> {
  try {
    await Share.share({ title, text, dialogTitle: title });
    return true;
  } catch {
    return copyText(text);
  }
}
