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
- [ ] Phase 3: season pass «مسیر فصل»
- [ ] Phase 4: events (weekly event, Yalda, Nowruz, alley race)
- [ ] Phase 5: presentation (decor choice, board frame, celebrations, expressions, map)
- [ ] Phase 6: save-transfer code, Season 3, e2e smoke test in CI

QA in a browser: localStorage `mahalle.fakeAds=1` / `mahalle.fakeStore=1` fake the video
and store (browser builds only). A QA harness lives in the session scratchpad; staged
saves are written into localStorage `mahalle.save.v1`.

Next (in order):
1. Continue the AAA phases above
2. Owner: Bazaar account, signing key, GitHub secrets, upload (see `docs/LAUNCH-fa.md`)

Known limits: local Gradle builds here can hit Maven Central rate limits (429); CI is the
source of truth for APK builds.

## Needs from the owner (Amirhossein)

- Cafe Bazaar developer account (needed to publish and to get the billing RSA key).
- Tapsell account (rewarded video zone id) — optional at launch.
- Release signing key kept secret (CI reads it from GitHub secrets; see README).
