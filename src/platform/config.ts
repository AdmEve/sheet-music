// Ad network keys, filled at build time from environment variables (see README); empty
// values switch ads off gracefully. Store billing keys live in the Android build (flavors).

export const TAPSELL_APP_KEY: string = import.meta.env.VITE_TAPSELL_APP_KEY ?? '';
export const TAPSELL_REWARDED_ZONE: string = import.meta.env.VITE_TAPSELL_REWARDED_ZONE ?? '';
/** Daily cap on rewarded videos, so ads stay a bonus and not the game. */
export const MAX_ADS_PER_DAY = 6;
