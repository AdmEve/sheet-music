/** Player progress and economy, kept in localStorage (the Android WebView keeps it). */

export const MAX_LIVES = 5;
export const LIFE_REGEN_MS = 20 * 60 * 1000;

export const PRICES = {
  revive: [150, 300, 500],
  boostSlot: 120,
  boostBomb: 180,
  refillLives: 250,
};

export interface Save {
  level: number; // next level to play (0-based)
  coins: number;
  lives: number;
  lifeClock: number; // when the next life was due to start regenerating
  unlimitedUntil: number;
  boosts: { slot: number; bomb: number };
  noAds: boolean;
  starterBought: boolean;
  gallery: string[]; // picture ids finished, in order
  daily: { last: string; streak: number };
  freeCoinAds: { day: string; count: number };
  settings: { sound: boolean; music: boolean; haptics: boolean };
  stats: { wins: number; losses: number; winsSinceAd: number; sessionStart: number };
  tutorialDone: boolean;
}

const KEY = 'pishi-pixel-save-v1';

function fresh(): Save {
  return {
    level: 0, coins: 200, lives: MAX_LIVES, lifeClock: Date.now(), unlimitedUntil: 0,
    boosts: { slot: 1, bomb: 1 }, noAds: false, starterBought: false, gallery: [],
    daily: { last: '', streak: 0 }, freeCoinAds: { day: '', count: 0 },
    settings: { sound: true, music: true, haptics: true },
    stats: { wins: 0, losses: 0, winsSinceAd: 0, sessionStart: Date.now() },
    tutorialDone: false,
  };
}

function load(): Save {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const base = fresh();
      const s = JSON.parse(raw);
      return { ...base, ...s, boosts: { ...base.boosts, ...s.boosts }, settings: { ...base.settings, ...s.settings }, stats: { ...base.stats, ...s.stats } };
    }
  } catch { /* storage unavailable: play without saving */ }
  return fresh();
}

export const save: Save = load();

export function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(save)); } catch { /* ignore */ }
}

export function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function hasUnlimited(): boolean {
  return save.unlimitedUntil > Date.now();
}

/** Bring lives up to date with the regeneration clock. Returns ms until the next life. */
export function tickLives(): number {
  const now = Date.now();
  if (save.lives >= MAX_LIVES) { save.lifeClock = now; return 0; }
  const gained = Math.floor((now - save.lifeClock) / LIFE_REGEN_MS);
  if (gained > 0) {
    save.lives = Math.min(MAX_LIVES, save.lives + gained);
    save.lifeClock += gained * LIFE_REGEN_MS;
    if (save.lives >= MAX_LIVES) save.lifeClock = now;
    persist();
  }
  return save.lives >= MAX_LIVES ? 0 : LIFE_REGEN_MS - (now - save.lifeClock);
}

export function canPlay(): boolean {
  tickLives();
  return hasUnlimited() || save.lives > 0;
}

export function loseLife() {
  if (hasUnlimited()) return;
  tickLives();
  if (save.lives >= MAX_LIVES) save.lifeClock = Date.now();
  save.lives = Math.max(0, save.lives - 1);
  persist();
}

export function addLife(n = 1) {
  save.lives = Math.min(MAX_LIVES, save.lives + n);
  if (save.lives >= MAX_LIVES) save.lifeClock = Date.now();
  persist();
}

export function spend(coins: number): boolean {
  if (save.coins < coins) return false;
  save.coins -= coins;
  persist();
  return true;
}

export function earn(coins: number) {
  save.coins += coins;
  persist();
}

export function winReward(levelIndex: number, hard: boolean): number {
  return (hard ? 40 : 15) + Math.min(25, Math.floor(levelIndex / 8));
}

/** Daily gift for a 7-day streak; the 7th day is the big one. */
export const DAILY_GIFTS = [50, 80, 120, 150, 200, 250, 500];

export function dailyAvailable(): boolean {
  return save.daily.last !== today();
}

export function claimDaily(): number {
  const t = today();
  const y = new Date(Date.now() - 86400000);
  const yesterday = `${y.getFullYear()}-${y.getMonth() + 1}-${y.getDate()}`;
  save.daily.streak = save.daily.last === yesterday ? (save.daily.streak % 7) + 1 : 1;
  save.daily.last = t;
  const gift = DAILY_GIFTS[save.daily.streak - 1];
  save.coins += gift;
  if (save.daily.streak === 7) save.boosts.bomb++;
  persist();
  return gift;
}
