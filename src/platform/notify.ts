// Offline local notifications: energy full, tomorrow's daily gift, an event about to end,
// a race that has finished, and the welcome-back gift after two days away. Scheduled when the app goes to the background, cleared
// when it comes back.

import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const ENERGY_ID = 1;
const DAILY_ID = 2;
const EVENT_ID = 3;
const RACE_ID = 4;
const AWAY_ID = 5;
let permitted: boolean | null = null;

/** Checks permission; only prompts the player when `ask` is true. */
async function allowed(ask: boolean): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  if (permitted === true) return true;
  try {
    let p = await LocalNotifications.checkPermissions();
    if (ask && (p.display === 'prompt' || p.display === 'prompt-with-rationale')) p = await LocalNotifications.requestPermissions();
    permitted = p.display === 'granted';
  } catch {
    permitted = false;
  }
  return permitted;
}

/** Asks for permission at a friendly moment (after the first episode), not at launch. */
export async function askNotifications(): Promise<void> {
  await allowed(true);
}

export interface Reminders {
  energyFullAt: number | null;
  /** The live event, if the player still has milestones to win. */
  event?: { title: string; endsAt: number } | null;
  /** When the running race closes (only if the player has not finished it). */
  raceEndsAt?: number | null;
  /** The player is old enough for the welcome-back gift (offers.welcomeBack). */
  awayGift?: boolean;
}

const HOUR = 3_600_000;

export async function scheduleReminders(r: Reminders): Promise<void> {
  if (!(await allowed(false))) return;
  const now = Date.now();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(19, 30, 0, 0);
  const list = [];
  if (r.energyFullAt && r.energyFullAt - now > 10 * 60_000) {
    list.push({ id: ENERGY_ID, title: 'انرژی پر شد! ⚡', body: 'سماور قهوه‌خانه جوش اومده… همسایه‌ها منتظرتن!', schedule: { at: new Date(r.energyFullAt) } });
  }
  list.push({ id: DAILY_ID, title: 'هدیه‌ی امروزت آماده‌ست 🎁', body: 'خاله مهین یه خبر داغ داره… سر بزن!', schedule: { at: tomorrow } });
  if (r.event && r.event.endsAt - 6 * HOUR > now + HOUR) {
    list.push({ id: EVENT_ID, title: `«${r.event.title}» داره تموم می‌شه ⏳`, body: 'فقط ۶ ساعت وقت داری جایزه‌ها و جامش رو ببری!', schedule: { at: new Date(r.event.endsAt - 6 * HOUR) } });
  }
  if (r.raceEndsAt && r.raceEndsAt > now + 5 * 60_000) {
    list.push({ id: RACE_ID, title: 'مسابقه‌ی محله تموم شد 🏁', body: 'ببین نفر چندم شدی و جایزه‌ت رو بگیر!', schedule: { at: new Date(r.raceEndsAt) } });
  }
  if (r.awayGift) {
    // Two days away is when the welcome-back gift is ready; evening is when people play.
    const at = new Date(now + 2 * 24 * HOUR);
    if (at.getHours() < 18) at.setHours(18, 30, 0, 0);
    list.push({ id: AWAY_ID, title: 'کوچه دلش برات تنگ شده 💌', body: 'خاله مهین: کجایی؟ همسایه‌ها برات یه هدیه کنار گذاشتن!', schedule: { at } });
  }
  try {
    await LocalNotifications.cancel({ notifications: [{ id: ENERGY_ID }, { id: DAILY_ID }, { id: EVENT_ID }, { id: RACE_ID }, { id: AWAY_ID }] });
    await LocalNotifications.schedule({ notifications: list });
  } catch {
    /* notifications are a bonus; never break the game */
  }
}

export async function clearReminders(): Promise<void> {
  if (!permitted) return;
  try {
    await LocalNotifications.cancel({ notifications: [{ id: ENERGY_ID }, { id: EVENT_ID }, { id: RACE_ID }, { id: AWAY_ID }] });
  } catch {
    /* ignore */
  }
}
