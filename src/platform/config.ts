// Store / ad network keys. Filled at build time from environment variables (see README);
// empty values switch the feature off gracefully.

export const BAZAAR_RSA_KEY: string = import.meta.env.VITE_BAZAAR_RSA_KEY ?? '';
export const TAPSELL_APP_KEY: string = import.meta.env.VITE_TAPSELL_APP_KEY ?? '';
export const TAPSELL_REWARDED_ZONE: string = import.meta.env.VITE_TAPSELL_REWARDED_ZONE ?? '';
/** Daily cap on rewarded videos, so ads stay a bonus and not the game. */
export const MAX_ADS_PER_DAY = 6;
