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
  (Tapsell). Both behind interfaces with offline-safe fallbacks.

## Tech

- Vite + TypeScript, DOM/SVG rendering (crisp vector art, no external assets), wrapped as
  Android app with Capacitor. Fully offline.
- `src/game/` pure model (tested with vitest), `src/ui/` rendering, `src/art/` SVG item art,
  `src/story/` chapters + dialogue, `src/platform/` billing/ads/storage bridges.
- CI (`.github/workflows/build.yml`) builds the APK and publishes a release.

## State

- [x] Market research + decision
- [x] Old sheet-music app removed
- [ ] Merge engine (model + tests)
- [ ] Item art (SVG) for all chains, reviewed via screenshots
- [ ] Board UI (drag/merge, generators, orders, energy)
- [ ] House scenes + renovation tasks + story chapters
- [ ] Shop, Bazaar billing plugin, rewarded ads plugin
- [ ] Android project, icon, CI APK build, store listing text

## Needs from the owner (Amirhossein)

- Cafe Bazaar developer account (needed to publish and to get the billing RSA key).
- Tapsell account (rewarded video zone id) — optional at launch.
- Release signing key kept secret (CI reads it from GitHub secrets; see README).
