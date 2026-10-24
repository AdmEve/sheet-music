// In-app billing through the native `Store` plugin: Poolakey in the Cafe Bazaar build,
// Myket billing in the Myket build (see android/app/src/{bazaar,myket}). In the browser,
// or when the build has no store key, purchases are unavailable and the shop says so.

import { Capacitor, registerPlugin } from '@capacitor/core';

export interface Product {
  sku: string;
  gems: number;
  energy?: number;
  chest?: number;
  /** Shown until the store returns the real localized price. */
  fallbackPrice: string;
  title: string;
  /** One-time offer. */
  once?: boolean;
  /** Consumable unless false. */
  consumable?: boolean;
}

export const PRODUCTS: Product[] = [
  { sku: 'starter_pack', title: 'بسته‌ی شروع', gems: 120, energy: 150, chest: 3, fallbackPrice: '۴۹٬۰۰۰ تومان', once: true },
  { sku: 'gems_small', title: 'مشت الماس', gems: 60, fallbackPrice: '۲۹٬۰۰۰ تومان' },
  { sku: 'gems_medium', title: 'کیسه الماس', gems: 160, fallbackPrice: '۶۹٬۰۰۰ تومان' },
  { sku: 'gems_large', title: 'صندوق الماس', gems: 420, fallbackPrice: '۱۴۹٬۰۰۰ تومان' },
  { sku: 'gems_huge', title: 'گنج الماس', gems: 1000, fallbackPrice: '۲۹۹٬۰۰۰ تومان' },
];

interface StorePlugin {
  info(): Promise<{ store: 'bazaar' | 'myket'; url: string; billing: boolean }>;
  connect(): Promise<{ connected: boolean }>;
  getPrices(opts: { skus: string[] }): Promise<{ prices: Record<string, string> }>;
  purchase(opts: { sku: string; payload: string }): Promise<{ purchaseToken: string; orderId: string }>;
  consume(opts: { purchaseToken: string }): Promise<void>;
  /** Purchases made but not yet consumed (e.g. app killed mid-purchase). */
  pending(): Promise<{ purchases: { sku: string; purchaseToken: string }[] }>;
  /** Opens the store's rating screen for this app. */
  rate(): Promise<void>;
}

/** The one registration of the native store plugin (registering twice breaks it). */
export const Store = registerPlugin<StorePlugin>('Store');
let connected = false;
let storeInfo: { store: 'bazaar' | 'myket'; url: string; billing: boolean } | null = null;

/** Which store this build is for, and whether billing is configured. */
export async function getStoreInfo(): Promise<{ store: 'bazaar' | 'myket' | 'web'; url: string; billing: boolean }> {
  if (!Capacitor.isNativePlatform()) return { store: 'web', url: 'https://cafebazaar.ir/app/com.admeve.mahalle', billing: false };
  if (!storeInfo) {
    try {
      storeInfo = await Store.info();
    } catch {
      return { store: 'bazaar', url: 'https://cafebazaar.ir/app/com.admeve.mahalle', billing: false };
    }
  }
  return storeInfo;
}

export function billingAvailable(): boolean {
  return Capacitor.isNativePlatform() && (storeInfo?.billing ?? true);
}

export async function connectBilling(): Promise<boolean> {
  if (!Capacitor.isNativePlatform() || !(await getStoreInfo()).billing) return false;
  try {
    connected = (await Store.connect()).connected;
  } catch {
    connected = false;
  }
  return connected;
}

export async function fetchPrices(): Promise<Record<string, string>> {
  if (!connected) return {};
  try {
    return (await Store.getPrices({ skus: PRODUCTS.map((p) => p.sku) })).prices;
  } catch {
    return {};
  }
}

export type PurchaseResult =
  | { ok: true; product: Product; token: string }
  | { ok: false; reason: 'unavailable' | 'cancelled' | 'error' };

/**
 * Starts a store purchase. Does NOT consume: the caller must grant the reward and save it
 * first, then call consume(token). That way a crash can never lose a paid purchase.
 */
export async function buy(sku: string): Promise<PurchaseResult> {
  const product = PRODUCTS.find((p) => p.sku === sku);
  if (!product) return { ok: false, reason: 'error' };
  if (!connected && !(await connectBilling())) return { ok: false, reason: 'unavailable' };
  try {
    const r = await Store.purchase({ sku, payload: `${sku}:${Date.now()}` });
    return { ok: true, product, token: r.purchaseToken };
  } catch (e) {
    const msg = String((e as Error)?.message ?? e);
    if (/not connected/i.test(msg)) connected = false;
    return { ok: false, reason: /cancel/i.test(msg) ? 'cancelled' : 'error' };
  }
}

/** Consumes a purchase whose reward is already granted and saved. Safe to retry later. */
export async function consume(token: string): Promise<boolean> {
  if (!connected) return false;
  try {
    await Store.consume({ purchaseToken: token });
    return true;
  } catch {
    return false;
  }
}

/** Purchases that the store still holds unconsumed (paid, then app killed / consume failed). */
export async function pendingPurchases(): Promise<{ product: Product; token: string }[]> {
  if (!connected) return [];
  try {
    const { purchases } = await Store.pending();
    const out: { product: Product; token: string }[] = [];
    for (const p of purchases) {
      const product = PRODUCTS.find((x) => x.sku === p.sku);
      if (product) out.push({ product, token: p.purchaseToken });
    }
    return out;
  } catch {
    return [];
  }
}

/** Keeps the JS view of the connection in sync when the store drops it. */
export function watchBillingConnection(): void {
  if (!Capacitor.isNativePlatform()) return;
  (Store as unknown as { addListener(e: string, cb: () => void): void }).addListener('disconnected', () => {
    connected = false;
  });
}
