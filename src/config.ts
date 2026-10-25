/**
 * Store and ad-network keys. Fill these in from your dashboards before publishing:
 *  - BAZAAR_RSA_KEY: Cafe Bazaar developer panel → your app → «پرداخت درون‌برنامه‌ای» → RSA key.
 *  - TAPSELL_APP_ID and zone ids: tapsell.ir dashboard → your app (Tapsell Plus).
 * With empty values the game still runs: purchases and ads are simply unavailable.
 */
export const CONFIG = {
  BAZAAR_RSA_KEY: '',
  TAPSELL_APP_ID: '',
  TAPSELL_REWARDED_ZONE: '',
  TAPSELL_INTERSTITIAL_ZONE: '',
  /** Bazaar developer page, used for the "more games" / rate links. */
  BAZAAR_PACKAGE: 'com.admeve.pishipixel',
};

/** In-app products. Create the same SKUs in the Bazaar panel (prices are set there). */
export const PRODUCTS = [
  { sku: 'coins_1000', coins: 1000, fallbackPrice: 29000, title: '۱٬۰۰۰ سکه', consumable: true },
  { sku: 'coins_3000', coins: 3000, fallbackPrice: 69000, title: '۳٬۰۰۰ سکه', consumable: true, badge: 'محبوب' },
  { sku: 'coins_8000', coins: 8000, fallbackPrice: 149000, title: '۸٬۰۰۰ سکه', consumable: true, badge: 'به‌صرفه‌ترین' },
  { sku: 'lives_24h', coins: 0, fallbackPrice: 35000, title: 'جان بی‌نهایت ۲۴ ساعته', consumable: true },
  { sku: 'no_ads', coins: 0, fallbackPrice: 59000, title: 'حذف تبلیغات برای همیشه', consumable: false },
  { sku: 'starter_pack', coins: 2500, fallbackPrice: 99000, title: 'بسته شروع طلایی', consumable: false, badge: 'فقط یک‌بار' },
] as const;

export type Sku = (typeof PRODUCTS)[number]['sku'];
