/// <reference types="vite/client" />
declare const __APP_VERSION__: string;
interface ImportMetaEnv {
  readonly VITE_BAZAAR_RSA_KEY?: string;
  readonly VITE_TAPSELL_APP_KEY?: string;
  readonly VITE_TAPSELL_REWARDED_ZONE?: string;
}
