# پیشی پیکسل · Pishi Pixel

A Persian colour-shooter puzzle game for Android, made for Cafe Bazaar.

Cats ride a conveyor around a pixel picture and shoot the first block in each row/column
they pass, but only blocks of their own colour. A cat that finishes a lap with ammo left
parks in a waiting slot; fill every slot and you lose. It is the mechanic of *Pixel Flow!*
(the biggest casual puzzle hit of 2025–26) with almost no competition on Bazaar yet, wrapped
in Persian pictures (pomegranate, tea glass, goldfish, Azadi tower…), Persian UI and music.

## What is in here

| Path | What |
| --- | --- |
| `src/game/engine.ts` | The simulation (belt, shooters, slots, ice, links, boosters). No rendering. |
| `src/game/levelgen.ts` | Builds level *n* from a picture; every level is checked by the solver bot. |
| `src/game/bot.ts` | Greedy solver used to prove levels are beatable (and for tutorial hints). |
| `src/data/pictures.json` | Pixel art baked from Noto emoji (`npm run bake-pictures`, needs Playwright). |
| `src/play.ts`, `src/art.ts` | Canvas renderer, effects, input. |
| `src/main.ts` | Screens: home, game, win/lose, shop, lives, daily gift, gallery, settings. |
| `src/monetize.ts`, `src/config.ts` | Bazaar in-app billing + Tapsell ads bridge, product list, keys. |
| `android/app/src/main/java/.../BazaarPlugin.kt` | Poolakey (Bazaar billing) plugin. |
| `android/app/src/main/java/.../AdsPlugin.kt` | Tapsell Plus rewarded + interstitial plugin. |
| `store/` | 512px icon, screenshots and the Persian store text for the Bazaar page. |

## Develop

```sh
npm install
npm run dev          # play in the browser (purchases/ads are simulated)
npm test             # engine tests + "first 200 levels are winnable"
npm run android:sync # build web + copy into android/
```

`?debug` in the URL exposes `window.__pishi` for automated playtests.

## Before publishing on Cafe Bazaar

1. **Signing key.** The release keystore is not in this (public) repo. Add two repository
   secrets (Settings → Secrets and variables → Actions): `KEYSTORE_BASE64` and
   `KEYSTORE_PASSWORD`. Without them CI signs with a throwaway test key that Bazaar must
   not receive. Back the keystore up: every future update must be signed with it.
2. **In-app products.** In the Bazaar developer panel create these products (consumable
   unless noted) and set prices: `coins_1000`, `coins_3000`, `coins_8000`, `lives_24h`,
   `no_ads` (non-consumable), `starter_pack` (non-consumable). Copy the RSA key into
   `BAZAAR_RSA_KEY` in `src/config.ts`.
3. **Ads.** Create an app on tapsell.ir (Tapsell Plus) with a rewarded-video zone and an
   interstitial zone; put the app id and zone ids in `src/config.ts`.
4. Push; download `PishiPixel.apk` from the `android-latest` release and upload it to Bazaar
   with the files in `store/`.
