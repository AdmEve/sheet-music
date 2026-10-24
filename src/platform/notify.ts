// Offline local notifications: energy full, and tomorrow's daily gift. Scheduled when the
// app goes to the background, cleared when it comes back.

import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const ENERGY_ID = 1;
const DAILY_ID = 2;
let permitted: boolean | null = null;

async function allowed(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  if (permitted !== null) return permitted;
  try {
    let p = await LocalNotifications.checkPermissions();
    if (p.display === 'prompt' || p.display === 'prompt-with-rationale') p = await LocalNotifications.requestPermissions();
    permitted = p.display === 'granted';
  } catch {
    permitted = false;
  }
  return permitted;
}

/** Asks for permission at a friendly moment (after the first episode), not at launch. */
export async function askNotifications(): Promise<void> {
  await allowed();
}

export async function scheduleReminders(energyFullAt: number | null): Promise<void> {
  if (!(await allowed())) return;
  const now = Date.now();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(19, 30, 0, 0);
  const list = [];
  if (energyFullAt && energyFullAt - now > 10 * 60_000) {
    list.push({ id: ENERGY_ID, title: 'انرژی پر شد! ⚡', body: 'سماور قهوه‌خانه جوش اومده… همسایه‌ها منتظرتن!', schedule: { at: new Date(energyFullAt) } });
  }
  list.push({ id: DAILY_ID, title: 'هدیه‌ی امروزت آماده‌ست 🎁', body: 'خاله مهین یه خبر داغ داره… سر بزن!', schedule: { at: tomorrow } });
  try {
    await LocalNotifications.cancel({ notifications: [{ id: ENERGY_ID }, { id: DAILY_ID }] });
    await LocalNotifications.schedule({ notifications: list });
  } catch {
    /* notifications are a bonus; never break the game */
  }
}

export async function clearReminders(): Promise<void> {
  if (!permitted) return;
  try {
    await LocalNotifications.cancel({ notifications: [{ id: ENERGY_ID }] });
  } catch {
    /* ignore */
  }
}
