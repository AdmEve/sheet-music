# محله‌ی ما (Our Neighbourhood) — progress log

Persian merge-2 game with an ongoing neighbourhood drama, for Android (Cafe Bazaar / Myket).
Full market map: `docs/market-research.md`.
This file is the hand-off between work sessions: read it first, update it last.

## Why this game (research, Oct 2026)

| Evidence | Takeaway |
|---|---|
| **Golmorad** (Medrick): Iranian match-3 + story of a couple rebuilding their old house — 6.5M installs, ~212k ratings, 4.6★, in Bazaar's **top-5 grossing** beside strategy MMOs and Filimo/Namava | Iranians pay for casual puzzle + Persian characters + home renovation |
| Bagh Goli, Mozafarkhan Garden (BrainLadder, Amirza's studio, ~270k), Khaneh Sabz | Local studios copy that formula — but only with match-3 / hidden-object |
| Merge-2 revenue +94% YoY (H1 2025); Gossip Harbor > $650M in 2025, #3 puzzle game worldwide | Merge is the fastest-growing casual genre |
| Gossip Harbor is #2–3 top grossing on Google Play **Iran** | Iranians already pay for merge — in English |
| Merge titles on Bazaar/Myket are all foreign, English-only (Merge Mansion, Mergest Kingdom, Mergedom, Merge Food…) | **No Persian merge-story game found** — open gap |
| Amirza: 3M+ MAU, mostly women; Iranian gamers 38% women, avg age 29 | Core audience: women 20–45, story lovers |
| International internet cuts (2025–2026); domestic Bazaar billing + domestic ad networks keep working | Must be 100% offline; monetize only through domestic rails |

Rejected after research: "restore an old house" theme (Bagh Negar 6.2M + Golmorad 6.5M own
it), Amirza-style word game (dominant incumbent), Hokm card game
(fragmented but small: leader ~330k–600k installs; needs servers), strategy MMO (needs a
studio + servers), card battler (Pesarkhande owns the theme; PvP needs servers).

## Game design (v1)

- **Setting:** an old alley in central Tehran. Developer Mr. Farokhi wants to buy the whole
  alley and build a shopping mall. Narges (late 20s) comes back to reopen her late
  grandfather's teahouse and rallies the neighbours to save the alley.
- **Cast:** Narges; Khaleh Mahin (gossip queen, knows everything first); Ousta Reza (sangak
  baker); Shirin (hairdresser, Narges' childhood friend); Kaveh (restoration architect,
  slow-burn romance); Agha Morteza (grocer, stingy, funny); Naneh Golab (old lady from
  Kashan, rosewater); Farokhi (developer, antagonist with a secret).
- **Not** an old-house renovation (Bagh Negar / Golmorad own that); the hook is the
  neighbourhood drama, served as episodes like a TV serial — new episodes ship as updates.
- **Core loop:** tap generators (costs ⚡) → items drop on a 7×9 board → merge two identical
  items into the next level → fill neighbours' **orders** → coins + ⭐ → spend ⭐ on
  **restoration tasks** for alley places (teahouse, bakery, courtyard, hammam, tailor…) →
  story dialogue → next episode.
- **Chains (Persian items):** tea (برگ چای→…→سماور طلایی), bread (خوشه گندم→…→سفره صبحانه),
  garden (دانه→…→گلاب‌پاش), tools, textile (پشم→…→فرش کاشان), pottery/tile (گل رس→…→گلدان مینا).
  Board pieces covered by **dust sheets / crates** are unlocked by merging onto them.
- **Economy:** energy (100 cap, +1 / 2 min), coins (soft), gems (hard, Bazaar IAP),
  rewarded ads for energy / doubled rewards. Daily gift. Later: weekly prize events.
- **Monetization rails:** Cafe Bazaar in-app billing (Poolakey), domestic rewarded video
  (Tapsell). Both behind interfaces with offline-safe fallbacks. Myket billing in the Myket flavor.

## Tech

- Vite + TypeScript, DOM/SVG rendering (crisp vector art, no external assets), wrapped as
  Android app with Capacitor. Fully offline.
- `src/game/` pure model (tested with vitest), `src/ui/` rendering, `src/art/` SVG item art,
  `src/story/` chapters + dialogue, `src/platform/` billing/ads/storage bridges.
- CI (`.github/workflows/build.yml`) builds the APK and publishes a release.

## State (updated 2026-10-24)

Done and pushed (CI green, `android-latest` release has an installable APK + AAB):

- [x] Market research + decision (`docs/market-research.md`)
- [x] Game model + 24 vitest tests (merge, locks, generators, energy, chests, orders, levels,
      daily gift, coin shop, save migration, story data/progression)
- [x] Vector art for every item, 8 portraits, 5 place scenes with before/after layers
- [x] Full UI: HUD, orders, drag-merge board, info bar, alley screen with task list,
      dialogue, shop (Bazaar packs + coin shop + rewarded ads), energy, bag, level-up,
      daily gift, settings, tutorial hand, synth SFX, haptics, Android back button
- [x] Season 1 story: 5 episodes, 27 restoration tasks, all dialogue in Persian
- [x] Balance pass (`scripts/simulate.ts`): ep1 ≈ first session; season ≈ 1,900 energy
      (≈ 10 days for a casual free player)
- [x] Android project, Kotlin plugins (Poolakey 2.3.0 billing, Tapsell Plus 2.3.3 ads),
      icons, splash, CI signing from secrets, README + Persian store listing

Also done since: store screenshots (`docs/screenshots/`), background music, merge
sparkles, bubbles (gem/ad sink), daily quests, offline reminders (energy full / daily
gift), Bazaar rating + share prompt after episode 1, code-review fixes (purchase safety:
grant → save → consume with token tracking; native connection handling; double-tap guard;
ad cap), old-WebView compatibility (Chrome 69 build target, animation fallbacks).

Season 2 «عروسی» is done: 5 episodes (proposal, pastry shop, tailor, sofreh-ye aghd, alley
wedding), Fakhri Khanum, sweets chain + pastry generator (level 7 gift). Balance: both
seasons ≈ 9,700 energy for a free player (≈ 4–6 weeks casual).

Also: performance pass for low-end phones (memoized HUD/orders/nav; ~40–110 ms per tap at
6× CPU throttle), season 2 store screenshot, Persian launch checklist (`docs/LAUNCH-fa.md`).

Robustness: unreadable saves are backed up (never overwritten), global error guards,
privacy page (`docs/privacy-fa.md`). Charm: neighbours' thank-you bubbles on delivery.

Myket: second store flavor done (`android/app/src/myket`, Myket billing 1.19); CI publishes
`Mahalle.apk` (Bazaar) and `Mahalle-myket.apk`.

## AAA upgrade (started 2026-10-24) — plan in `docs/AAA-ROADMAP.md`

The owner asked for a "perfect AAA product" as a long project. The roadmap came from a
teardown of Gossip Harbor / Travel Town / Merge Mansion: offers are ~62% of revenue,
season pass ~10%, events run 4–10 at a time, decoration choice drives self-expression.

- [x] Phase 1: album «کلکسیون» (discovery rewards, chain bonuses), idle merge hint,
      escalating gem refill (10/20/40/60/80), profile screen on the level badge
- [x] Phase 2: piggy bank «قلک», starter pack pop-up (48 h at level 3), episode bundle
      (24 h), first-purchase double gems, energy rescue bundle, free video gift;
      icon strip above/beside the board
- [x] Phase 3: season pass «مسیر <ماه>»: one season per Persian month (Jalali calendar
      in `src/game/calendar.ts`), 30 steps, free + golden track (pass_premium), endless chests
- [x] Phase 4: live events (`src/game/events.ts`: weekly kites/lavashak, Yalda, Nowruz;
      event generator + chain + 12 milestones + trophy) and the alley race vs 4 bots
      (`src/game/race.ts`, time-based so it works offline)
- [x] Phase 5: decoration styles per restored piece (`src/art/decor.ts`), celebrations
      (`src/ui/celebrate.ts`), mood expressions in dialogue, carved board frame + girih
      background, alley map with revisit mode (`src/art/alleymap.ts`)
- [x] Phase 6: save-transfer code (`src/game/transfer.ts`), Season 3 «نامه‌ای از اون ور دنیا»
      (5 episodes, Uncle Bahman, «نامه و پست» chain + writing desk at level 20), browser
      smoke test in CI (`npm run smoke`)

QA in a browser: localStorage `mahalle.fakeAds=1` / `mahalle.fakeStore=1` fake the video
and store (browser builds only). A QA harness lives in the session scratchpad; staged
saves are written into localStorage `mahalle.save.v1`.

- [x] Phase 7: quality — perf at 6× CPU throttle (no idle long tasks; tap→frame 11–97 ms),
      first-session pacing checked, eight new store screenshots (`npm run` script
      `scripts/store-shots.ts`), catch-up toasts after the splash
- [x] Phase 8: engagement — event/race reminders, weekly rotation of four themes (lavashak,
      kites, ash reshteh, ice cream), zarb/chime sounds

- [x] Phase 9: living scenes (glows, bulbs, steam, sparkles animate), richer teahouse and
      bakery, tutorial hand drawn in SVG
- [x] Phase 10: Season 4 «یه نفر تو راهه» (`src/art/scenes4.ts`: grocery, baby shop, library,
      nursery, naming party; «سیسمونی» chain + knitting basket at level 25), map of 20 places
      with a «ادامه دارد…» barrier teasing Season 5 (the street-widening plan)

- [x] Phase 11: Chaharshanbe Suri (week ending on the last Wednesday of the year) and
      «بوی ماه مهر» back-to-school events with their own chains; short leftover weeks fold
      into the next one; timers survive the phone's clock being set back; richer garden
      (rosewater shelf, fountain, goldfish), salon (counters, checkered floor, cake) and
      hammam (inscription band, light shafts, towels, steam) scenes

- [x] Phase 12: Season 5 «طرح تعریض خیابان» (`src/art/scenes5.ts`: the alley gate, the
      teahouse rooftop at night, a Qajar cistern in cutaway, the neighbourhood museum and
      the national-registration street party; «چراغ» lamp chain + coppersmith's anvil at
      level 30); the map holds 25 places; Season 6 teased (Shirin's suitor from Tabriz)
- [x] Late-game balance: orders never ask for a chain's two top levels (and the second item
      of a pair is a level easier) — the sim had 8 of 20 games deadlocked on orders like
      "two tea level 10"; now 18 of 20 finish all 25 episodes at the same energy per
      episode. Level-up gems capped at 20 (were 5 + level, i.e. free refills late on).
      Store shots 7 and 8 now show Season 5 and the 25-place map.

- [x] Phase 13a: order details sheet: from level 6, tapping an unfinished order shows its
      items by name with what is still missing, «خودم درستش می‌کنم» (highlights them on the
      board) and «تحویل فوری» — the missing items paid in gems (their worth / 3, min 3),
      a gem sink that cannot loop with level-up gems
- [x] Phase 13b: «خوش برگشتی!» — back after 2+ days (relaunch or resume from the
      background): 100 energy, 5 gems a day away (max 30) and a chest from Khale Mahin;
      perf re-check at 6× throttle with 25 places (map opens in ~450 ms, no long tasks
      while scrolling)
- [x] Phase 14: Season 6 «خواستگار تبریزی» (`src/art/scenes6.ts`: Aydin's carpet shop in the
      alley, the Tabriz bazaar under its brick vaults, El Goli at night, his grandmother's
      house in the snow and the engagement party; new character Aydin; «ساز» instrument
      chain + luthier's bench at level 35); map of 30 places; Season 7 teased (Morteza's
      inheritance)
- [x] Phase 15: bug sweep of the session's changes; today's event and its end are cached
      (the strip asked every second); the CI smoke test now covers the welcome-back gift
      and rushing an order
- [x] Phase 16: Season 7 «ارثیه‌ی آقا مرتضی» (`src/art/scenes7.ts`: the Shemiran garden-house
      with its plane-tree avenue, the tiled pool house, the cherry orchard, the mirror hall
      and the opening of the public garden; «کاشی» tile chain + glaze box at level 40); map
      of 35 places; Season 8 teased (Khale Mahin gets a radio show)
- [x] Phase 16b: praise for quick merge streaks («آفرین!» … «استاد ادغام!»); a generator put
      in the bag pauses its chain (orders only come from generators on the board), so late
      players with 12 generators can thin the board out — bag slots become worth buying;
      top-level items say they are for the album and can be sold

- [x] Phase 17: Season 8 «رادیو محله» (`src/art/scenes8.ts`: the radio studio, the dirt pitch
      behind the cistern, the stands, the «جام محلات» final under floodlights and the
      victory parade; «فوتبال» chain + sports bag at level 45); map of 40 places; Season 9
      teased (a Nowruz trip north for Golab's wish). Balance bot fixed: it counted a need
      as met when one of two was on the board, and sells top-level items. With it, 20 of 20
      simulated games finish all 40 episodes; energy-regen hours per episode rise smoothly
      from 0 (teahouse) to ~35 (wedding), ~65 (Season 5 end) and ~99 (Season 8 end)

- [x] Phase 18: Season 9 «سفر شمال» (`src/art/scenes9.ts`: the old railway station, a seaside
      villa, Fakhri's family rice paddy, Masuleh in the mist and Sizdah Bedar on the beach;
      «دریا» chain + beach basket at level 50); map of 45 places; Season 10 teased (Kaveh's
      job offer in Isfahan). The place screen lists seasons in one scrolling row and the
      five episodes of the chosen season below it (45 chips no longer push the task off)

- [x] Phase 19: Season 10 «اصفهان» (`src/art/scenes10.ts`: a Safavid house with a muqarnas
      iwan, Si-o-se-pol lit at night, Naqsh-e Jahan square, an arts workshop and the alley's
      own restoration school; «صنایع دستی» chain + easel at level 55); map of 50 places;
      trophy names fixed for the newer calendar events; Season 11 teased (UNESCO)

- [x] Phase 20: stability pass over ten seasons — at 6× CPU throttle the splash shows in
      ~0.8 s and the board in ~1 s (499 KB JS, 146 KB gzipped), the 50-place map opens in
      ~350 ms with no long tasks while scrolling; the balance sim finishes all 45 tested
      episodes in 20 of 20 games (~110 regen hours for the last ones); map store shot
      refreshed

- [x] Phase 21: Season 11 «ثبت جهانی» (`src/art/scenes11.ts`: the dossier office, the
      inspectors' visit, a photo exhibition in the cistern, a night of Persian culture and
      the world-heritage party; «خوشنویسی» chain + calligrapher's desk at level 60); map of
      55 places; Season 12 teased (Golab's birthday)
- [x] Season generators now arrive with their season, not by player level: levels outrun
      the story (~level 37 by the end of Season 3), so the lamp, saz, tile… generators were
      landing seasons early and crowding the board. Each one has an `unlockPlace` (its
      season's first place) and is handed out when the story gets there, with a toast

- [x] Phase 22: Season 12 «تولد ننه‌گلاب» (`src/art/scenes12.ts`: Khale Mahin's home, Reza's
      cake room, the community hall, the memory wall and the party; «جشن» chain + party box
      at the season's start); map of 60 places; Season 13 teased (Shirin and Aydin's
      wedding). Balance sim with story-based unlocks: 20 of 20 games finish all 55 tested
      episodes, regen hours rising smoothly to ~133

- [x] Phase 23: Season 13 «عروسی شیرین و آیدین» (`src/art/scenes13.ts`: the flat above the
      grocery, the henna night, Morteza's Paykan as the wedding car, the Shemiran garden
      wedding and the پاتختی; «عروسی» chain + dowry-bundle generator with the first
      episode); new character Sona-khanum (Aydin's mother, kelaghayi scarf); later neighbours
      (Fakhri, Farokhi, Bahman, Aydin, Sona) now place orders once the story brings them in;
      map of 65 places; Season 14 teased (a caravanserai on the road to Kashan). Balance sim:
      20 of 20 games finish all 64 episodes the bot reaches; no-pay regen hours per episode
      rise smoothly to ~153
- [x] Phase 24: Season 14 «کاروانسرا» (`src/art/scenes14.ts`: a roadside teahouse, the Safavid
      caravanserai courtyard, a guest chamber, a desert night and the eco-lodge opening;
      «کویر» chain + saddlebag generator; new character Uncle Yadollah, the caretaker, and
      his camel Qandi); map of 70 places; sim step cap raised to 800k (20 of 20 games now
      finish all 70 episodes, no-pay regen hours per episode rising smoothly to ~167);
      Season 15 teased (a photo of Haj-Baba with «سفر یزد، به یاد رفیقم…»)

- [x] Phase 25: generator boost «تقویت مولد» (×2 from level 15, ×4 from level 40): each tap
      costs ×N energy and makes an item one or two levels higher, energy-neutral but it
      saves board space and time; never reaches a chain's two collection levels; event
      generators stay at 1 energy; falls back to what the energy affords. Toggle chip in the
      info bar, a «×N» badge on boosted generators, «×N» float on each boosted tap, a
      one-time tip. Long toasts now wrap and stay up longer (they ran off narrow screens).
      Unit tests + smoke section 4

- [x] Phase 26: Season 15 «رفیق یزدی» (`src/art/scenes15.ts`: Yazd's mud-brick lanes, the qanat,
      Jalal's windcatcher house, the «رفاقت» sweet shop, and the reunion in the Season 1
      teahouse; «یزد کهن» chain + brick-mould generator; new character Ostad Jalal, the
      qanat-digger who never answered Haj-Baba's letters because he could not read); map of
      75 places; Season 16 teased (a night school for adults)

- [x] Phase 27: Season 16 «مدرسه‌ی شبونه» (`src/art/scenes16.ts`: the alley's old school, the first
      night of class, Morteza's Paykan as a mobile library, a poetry night on the alley radio
      and the certificate party; «کلاس شبونه» chain + teacher's-desk generator); Fakhri turns
      out to be a retired teacher, Morteza, Jalal and Yadollah are her students; map of 80
      places; Season 17 teased (a TV cooking contest in the alley)

- [x] Phase 28: generator storeroom «انبار مولدها». By Season 16 a full game holds ~22
      generators, a third of the 63 cells, and the 4–10 bag slots cannot hold them. Product
      generators now go to an unlimited storeroom (their «انبار» chip replaces the bag chip);
      a stored generator pauses its chain exactly like a bagged one, still counts as owned
      (never handed out again), and comes back from a section in the bag screen. A full
      board with 10+ generators suggests the storeroom. Unit tests + smoke

Next (in order):
1. Season 17 «مسابقه‌ی آشپزی»
2. Owner: Bazaar account, signing key, GitHub secrets, upload (see `docs/LAUNCH-fa.md`)

## Needs from the owner (Amirhossein)

- Cafe Bazaar developer account (needed to publish and to get the billing RSA key).
- Tapsell account (rewarded video zone id) — optional at launch.
- Release signing key kept secret (CI reads it from GitHub secrets; see README).
