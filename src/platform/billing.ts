// Cafe Bazaar in-app billing through the native Bazaar plugin (Poolakey). In the browser
// (and before the plugin is configured) purchases are unavailable and the shop says so.

import { Capacitor, registerPlugin } from '@capacitor/core';
import { BAZAAR_RSA_KEY } from './config';

export interface Product {
  sku: string;
  gems: number;
  energy?: number;
  chest?: number;
  /** Shown until Bazaar returns the real localized price. */
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

interface BazaarPlugin {
  connect(opts: { rsaKey: string }): Promise<{ connected: boolean }>;
  getPrices(opts: { skus: string[] }): Promise<{ prices: Record<string, string> }>;
  purchase(opts: { sku: string; payload: string }): Promise<{ purchaseToken: string; orderId: string }>;
  consume(opts: { purchaseToken: string }): Promise<void>;
  /** Purchases made but not yet consumed (e.g. app killed mid-purchase). */
  pending(): Promise<{ purchases: { sku: string; purchaseToken: string }[] }>;
  /** Opens Bazaar's rating screen for this app. */
  rate(): Promise<void>;
}

/** The one registration of the native Bazaar plugin (registering twice breaks it). */
export const Bazaar = registerPlugin<BazaarPlugin>('Bazaar');
let connected = false;

export function billingAvailable(): boolean {
  return Capacitor.isNativePlatform() && BAZAAR_RSA_KEY.length > 0;
}

export async function connectBilling(): Promise<boolean> {
  if (!billingAvailable()) return false;
  try {
    connected = (await Bazaar.connect({ rsaKey: BAZAAR_RSA_KEY })).connected;
  } catch {
    connected = false;
  }
  return connected;
}

export async function fetchPrices(): Promise<Record<string, string>> {
  if (!connected) return {};
  try {
    return (await Bazaar.getPrices({ skus: PRODUCTS.map((p) => p.sku) })).prices;
  } catch {
    return {};
  }
}

export type PurchaseResult =
  | { ok: true; product: Product; token: string }
  | { ok: false; reason: 'unavailable' | 'cancelled' | 'error' };

/**
 * Starts a Bazaar purchase. Does NOT consume: the caller must grant the reward and save it
 * first, then call consume(token). That way a crash can never lose a paid purchase.
 */
export async function buy(sku: string): Promise<PurchaseResult> {
  const product = PRODUCTS.find((p) => p.sku === sku);
  if (!product) return { ok: false, reason: 'error' };
  if (!connected && !(await connectBilling())) return { ok: false, reason: 'unavailable' };
  try {
    const r = await Bazaar.purchase({ sku, payload: `${sku}:${Date.now()}` });
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
    await Bazaar.consume({ purchaseToken: token });
    return true;
  } catch {
    return false;
  }
}

/** Purchases that Bazaar still holds unconsumed (paid, then app killed / consume failed). */
export async function pendingPurchases(): Promise<{ product: Product; token: string }[]> {
  if (!connected) return [];
  try {
    const { purchases } = await Bazaar.pending();
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

/** Keeps the JS view of the connection in sync when Bazaar drops it. */
export function watchBillingConnection(): void {
  if (!Capacitor.isNativePlatform()) return;
  (Bazaar as unknown as { addListener(e: string, cb: () => void): void }).addListener('disconnected', () => {
    connected = false;
  });
}
