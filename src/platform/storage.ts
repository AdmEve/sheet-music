// Save game persistence. On Android the Preferences plugin stores to SharedPreferences
// (survives WebView storage clears); in the browser localStorage is used.

import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const KEY = 'mahalle.save.v1';
const native = Capacitor.isNativePlatform();

export async function loadSave(): Promise<string | null> {
  try {
    if (native) return (await Preferences.get({ key: KEY })).value;
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export async function writeSave(json: string): Promise<void> {
  try {
    if (native) await Preferences.set({ key: KEY, value: json });
    else localStorage.setItem(KEY, json);
  } catch {
    // Storage full or unavailable: the game keeps running; next save will retry.
  }
}

export async function loadSetting(key: string): Promise<string | null> {
  try {
    if (native) return (await Preferences.get({ key: `mahalle.${key}` })).value;
    return localStorage.getItem(`mahalle.${key}`);
  } catch {
    return null;
  }
}

export async function writeSetting(key: string, value: string): Promise<void> {
  try {
    if (native) await Preferences.set({ key: `mahalle.${key}`, value });
    else localStorage.setItem(`mahalle.${key}`, value);
  } catch {
    /* ignore */
  }
}

/** Keeps an unreadable save under a separate key (never overwritten) before starting fresh. */
export async function backupBrokenSave(json: string): Promise<void> {
  await writeSetting(`broken-save-${Date.now()}`, json);
}
