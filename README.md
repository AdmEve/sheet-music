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
| `src/game/levelgen.ts` | Difficulty curve, level assembly, and the packed format of shipped levels. |
| `src/game/plan.ts` | Exact abstract model + beam-search planner: slots/moves a level needs, winning lines. |
| `src/game/trap.ts` | Hill-climbs the cat queue so shallow thinkers overspend the move budget. |
| `src/game/bot.ts` | Real-time expert bot (difficulty check, tutorial hints) and a casual-player model. |
| `src/data/levels.json` | The 300 pre-tuned levels the game ships with (`scripts/tune-all.sh`). |
| `src/gfx/` | Cached sprites (blocks, cats), particles, easing. |
| `src/ui/` | Screens and dialogs, SVG icon set, transitions, flying coins. |
| `src/data/pictures.json` | Pixel art baked from Twemoji (`npm run bake-pictures`, needs Playwright). |
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

## Difficulty

The game is a planning puzzle, so difficulty means *how far ahead you must think*. Levels are
tuned at build time (`scripts/tune-all.sh`), against thinkers of different depth:

1. `src/game/plan.ts` is an exact, fast model of the game with a beam-search planner. A beam
   of width 1 is the player who always sends "the cat that shoots most right now"; wider beams
   keep more options in mind (2, 4, 8 ≈ looking a few sends ahead).
2. Each level has a **move budget**: the fewest sends the deep search (beam 96) can win with,
   plus a little slack, and a **slot count**: the fewest the deep search needs, plus slack.
3. `src/game/trap.ts` hill-climbs the order of the cat queue so that the shallow thinkers
   *overspend* that budget. Normal levels (from 6) fool the width-1 and width-2 thinkers; hard
   levels (every 5th) also width 4 and have 1 spare move and no spare slot; very hard levels
   (every 10th) fool width 8 as well and have no spare move.
4. Levels 1-2 teach, 3-4 are easy (slack of 4+ moves), 5 is the first trap.
5. The deep search's line is stored with each level and the tests replay it in the real engine,
   so every level is provably beatable.

```sh
TUNE_LOG=/tmp/tune.log scripts/tune-all.sh 300   # ~10 min on 4 cores; rewrites src/data/levels.json
npx vite-node scripts/depth-report.ts 0 150      # how wide a search each shipped level needs
```

Difficulty knobs live in `levelParams` (`trap`, `slackMoves`, `slackSlots`).

Pictures are pixel art baked from Twemoji (`npm run bake-pictures`), curated by hand
(`src/data/emoji-list.json`). Twemoji graphics © Twitter, Inc. and contributors, CC-BY 4.0.

```sh
TUNE_LOG=/tmp/tune.log scripts/tune-all.sh 300   # ~15 min on 4 cores; rewrites src/data/levels.json
```

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
