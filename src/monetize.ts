import { Capacitor, registerPlugin } from '@capacitor/core';
import { CONFIG, PRODUCTS, type Sku } from './config';
import { addLife, earn, persist, save } from './save';

interface BazaarPlugin {
  connect(o: { rsaKey: string }): Promise<{ connected: boolean }>;
  getPrices(o: { skus: string[] }): Promise<{ prices: Record<string, string> }>;
  purchase(o: { sku: string }): Promise<{ purchased: boolean; token?: string }>;
  consume(o: { token: string }): Promise<void>;
  owned(): Promise<{ skus: string[]; tokens: Record<string, string> }>;
  rate(o: { packageName: string }): Promise<void>;
}

interface AdsPlugin {
  init(o: { appId: string }): Promise<void>;
  rewarded(o: { zoneId: string }): Promise<{ rewarded: boolean }>;
  interstitial(o: { zoneId: string }): Promise<{ shown: boolean }>;
}

const native = Capacitor.isNativePlatform();
const Bazaar = registerPlugin<BazaarPlugin>('Bazaar');
const Ads = registerPlugin<AdsPlugin>('Ads');

let bazaarReady = false;
export const prices: Partial<Record<Sku, string>> = {};

export async function initMonetization() {
  if (!native) return;
  if (CONFIG.TAPSELL_APP_ID) Ads.init({ appId: CONFIG.TAPSELL_APP_ID }).catch(() => {});
  if (CONFIG.BAZAAR_RSA_KEY) {
    try {
      bazaarReady = (await Bazaar.connect({ rsaKey: CONFIG.BAZAAR_RSA_KEY })).connected;
      if (!bazaarReady) return;
      const p = await Bazaar.getPrices({ skus: PRODUCTS.map((x) => x.sku) });
      Object.assign(prices, p.prices);
      await restorePurchases();
    } catch { bazaarReady = false; }
  }
}

export function iapAvailable(): boolean {
  return !native || bazaarReady;
}

export async function restorePurchases() {
  if (!bazaarReady) return;
  const { skus, tokens } = await Bazaar.owned();
  if (skus.includes('no_ads')) save.noAds = true;
  if (skus.includes('starter_pack')) { save.noAds = true; save.starterBought = true; }
  // Consumables that were paid for but never delivered (app closed mid-purchase).
  for (const sku of skus) {
    const p = PRODUCTS.find((x) => x.sku === sku);
    if (p?.consumable && tokens[sku]) {
      await Bazaar.consume({ token: tokens[sku] });
      deliver(sku as Sku);
    }
  }
  persist();
}

function deliver(sku: Sku) {
  const p = PRODUCTS.find((x) => x.sku === sku)!;
  if (p.coins) earn(p.coins);
  if (sku === 'lives_24h') { save.unlimitedUntil = Math.max(Date.now(), save.unlimitedUntil) + 24 * 3600 * 1000; addLife(5); }
  if (sku === 'no_ads') save.noAds = true;
  if (sku === 'starter_pack') {
    save.noAds = true;
    save.starterBought = true;
    save.boosts.slot += 3;
    save.boosts.bomb += 3;
    save.unlimitedUntil = Math.max(Date.now(), save.unlimitedUntil) + 6 * 3600 * 1000;
  }
  persist();
}

/** Buy a product. In the browser build purchases are simulated so the flow can be tested. */
export async function buy(sku: Sku): Promise<boolean> {
  if (!native) {
    if (!confirm('نسخه آزمایشی: خرید شبیه‌سازی شود؟')) return false;
    deliver(sku);
    return true;
  }
  if (!bazaarReady) return false;
  try {
    const r = await Bazaar.purchase({ sku });
    if (!r.purchased) return false;
    const p = PRODUCTS.find((x) => x.sku === sku)!;
    if (p.consumable && r.token) await Bazaar.consume({ token: r.token });
    deliver(sku);
    return true;
  } catch { return false; }
}

export function adsEnabled(): boolean {
  return native && !!CONFIG.TAPSELL_APP_ID;
}

export function rewardedAvailable(): boolean {
  return !native || (!!CONFIG.TAPSELL_APP_ID && !!CONFIG.TAPSELL_REWARDED_ZONE);
}

/** Show a rewarded video; resolves true if the player earned the reward. */
export async function showRewarded(): Promise<boolean> {
  if (!native) {
    await new Promise((r) => setTimeout(r, 600));
    return true;
  }
  if (!rewardedAvailable()) return false;
  try { return (await Ads.rewarded({ zoneId: CONFIG.TAPSELL_REWARDED_ZONE })).rewarded; } catch { return false; }
}

export async function maybeInterstitial(): Promise<void> {
  if (save.noAds || !adsEnabled() || !CONFIG.TAPSELL_INTERSTITIAL_ZONE) return;
  try { await Ads.interstitial({ zoneId: CONFIG.TAPSELL_INTERSTITIAL_ZONE }); } catch { /* no fill */ }
}

export function rateApp() {
  if (native) Bazaar.rate({ packageName: CONFIG.BAZAAR_PACKAGE }).catch(() => {});
  else window.open(`https://cafebazaar.ir/app/${CONFIG.BAZAAR_PACKAGE}`, '_blank');
}
