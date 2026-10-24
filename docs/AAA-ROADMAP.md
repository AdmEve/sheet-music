# Mahalle → AAA: gap analysis and roadmap

Written 2026-10-24 after a teardown of the merge-2 leaders (Gossip Harbor, Travel Town,
Merge Mansion) and the Iranian story-puzzle leaders (Golmorad, Bagh Negar, Golshifteh).
Sources: Deconstructor of Fun, Naavik, Mobidictum/AppMagic, FriendlyGameDev, Udonis
(Gossip Harbor pieces, 2025–2026), plus `docs/market-research.md`.

## What the leaders do (and what it earns)

| Finding | Number / source | What it means for us |
|---|---|---|
| Gossip Harbor revenue split | Offers & temporary bundles ~62%, gems ~18%, season pass ~10%, rewarded ads +15–20% on top (Mobidictum, Naavik) | **Offers are the money**, not the gem shelf. We sell gems only. |
| 79% women, avg age 32; story = drama + mystery + romance, served like a TV serial | Sensor Tower via Naavik | Matches our audience and our serial. Keep leaning on drama. |
| Decoration choice: pick 1 of 3 styles per item, can change later | Naavik, Udonis | Self-expression is a core motivator for this audience. We have fixed art. |
| Simple, intuitive chains (no "merge unrelated items") | Naavik | We already do this. Keep it. |
| 4–10 concurrent events; ~20 → ~100 events/month; short (hourly/daily) + weekly + weekend + long (album, pass, decoration shop) | Mobidictum, FriendlyGameDev | We have **zero** events. Biggest retention gap. |
| "Race" (5 players, first to N) is one of the best performers since 2023 | Mobidictum | Can be done offline with bots. |
| Albums (collection psychology), Lava Quest / win streaks | Mobidictum | Collection codex + streak are cheap and offline. |
| Level 10 reachable in ~2 sessions, so players join the pass early; first offer after ~10 minutes | Deconstructor of Fun | Our early XP curve is close; we have no pass and no timed first offer. |
| Energy refills cheap at first, then escalate; free ad energy is tightly controlled; ads appear when needed and not always | Deconstructor, Naavik | Our refill is a flat 20 gems; ads are always on offer. |
| Orders: returning sessions get easier orders; long-term order "quests" with caps | Deconstructor | Add a "welcome back" easy order. |
| Generator 2x/4x boost (unlock at levels 15/40) | Deconstructor | A gem sink for payers. |
| Iranian rivals (Golmorad, Bagh Negar, Golshifteh) run Nowruz/Yalda/winter events and tournaments | search snippets | Calendar events are expected by Iranian players. |

## Gap analysis (what we have vs. a top merge game)

| Area | We have | Missing for AAA |
|---|---|---|
| Core loop | Board, 7 chains, generators, crates/sheets, bubbles, chests, bag | Merge hint on idle, "new item!" discovery moment, generator boost |
| Meta | 10 episodes, 54 tasks, before/after scene layers | Decoration choice (3 styles), alley overview map, character expressions |
| Economy | Coins (coin shop), gems, energy, stars | Escalating refills, coin purpose beyond the shop, piggy bank |
| Monetization | 1 starter pack + 4 gem packs, rewarded ads (6/day) | Offers stack (energy rescue, chapter bundle, first-purchase double), season pass, piggy bank |
| Live ops | Daily gift, 3 daily quests | Season pass, weekly rotating event with milestone track, bot race, Yalda/Nowruz events, collection album |
| Presentation | Clean flat UI, sparkles, fly-to-HUD | Themed board frame, side event icons, confetti and level-up rays, chest-opening, richer celebrations |
| Retention | Local reminders for energy/daily | Event reminders, streak, welcome-back gift |
| Safety | Purchase recovery, save backup | Save-transfer code (phones change, no cloud in Iran) |
| Quality | 28 unit tests, sim bot, screenshots | E2E smoke test in CI |

## Plan (in build order)

Each step ships on its own: tests pass, playthrough screenshots look right, then commit and push.

### Phase 1: core feel (cheap, felt every minute)
1. **Merge hint**: after 6 s idle, the best available pair gently wiggles.
2. **Collection codex** «کلکسیون»: every item has a card; discovering a new item shows a
   "new item!" pop-up and its first claim pays gems (1–5 by level). Silhouettes for
   undiscovered items. Gives a long-term goal and a gem drip.
3. **Escalating energy refill**: 10 → 20 → 40 → 60 gems per day (first refill is a bargain
   that teaches spending).

### Phase 2: offers stack (the 62%)
4. **Energy rescue offer**: when energy runs out and no ad is left, a one-tap bundle
   (energy + gems) at a low price point. New SKU `offer_energy`.
5. **First purchase bonus**: the first gem pack ever bought gives double gems (flag in save).
6. **Chapter bundle**: after each episode finale, a 24 h bundle (chest + gems + energy).
   SKU `offer_chapter`.
7. **Piggy bank** «قلک»: every delivered order drops gems into a jar (capped); breaking it
   costs one purchase. SKU `piggy_bank`.

### Phase 3: season pass «مسیر فصل»
8. 30-day season with 30 reward steps. Points ("کلید") come from orders and daily
   objectives. Free track for everyone; premium track (SKU `pass_premium`) doubles rewards
   and adds a golden frame and exclusive chest. Endless bonus chest after the last step.

### Phase 4: events (offline, schedule computed from the date)
9. **Event framework**: an event has a window, an event item that drops from orders and
   a milestone track. One weekly rotating event is always running; calendar events
   override it.
10. **Yalda** (night of 30 Azar ≈ 21 Dec): pomegranates and watermelon, a Hafez-reading
    scene with Naneh Golab, an exclusive decoration.
11. **Nowruz** (1 Farvardin): haft-sin collection, a «خونه‌تکونی» theme.
12. **Alley race** «مسابقه‌ی محله»: 4 bot neighbours from other alleys, first to 15
    orders in 2 h wins a chest; bots progress on a curve seeded per race.

### Phase 5: presentation
13. Decoration choice: 3 palette styles per restoration task, changeable later.
14. Themed board frame (tile border, wooden counter), side column of event icons.
15. Celebrations: confetti + rays on level up, chest-opening sequence, place-finished
    before/after wipe.
16. Character expressions in dialogue (happy / worried / angry / surprised).
17. Alley overview map: all places as one street; tap a building to visit.

### Phase 6: content and safety
18. Save-transfer code (copy/paste, checksummed).
19. Season 3 «نامه‌ای از اون ور دنیا» (5 episodes).
20. Playwright smoke test in CI (boot, merge, deliver, open alley).

## Store items to create (owner)

Existing: `starter_pack`, `gems_small`, `gems_medium`, `gems_large`, `gems_huge`.
New (consumable): `offer_energy`, `offer_chapter`, `piggy_bank`, `pass_premium`.
Suggested prices are in `src/platform/billing.ts` (`fallbackPrice`). `docs/LAUNCH-fa.md`
lists them for the Bazaar and Myket panels.
