# خونه‌ی مادرجون (Madarjoon's House) — progress log

Persian merge-2 + story + house-renovation game for Android (Cafe Bazaar / Myket).
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

Rejected after research: Amirza-style word game (dominant incumbent), Hokm card game
(fragmented but small: leader ~330k–600k installs; needs servers), strategy MMO (needs a
studio + servers), card battler (Pesarkhande owns the theme; PvP needs servers).

## Game design (v1)

- **Story:** Narges (Tehran, late 20s) returns to her late grandmother's (مادرجون) old house
  in Kashan. Aunt Mahin wants to sell it to tower developer Mr. Farokhi. Neighbour's son
  Kaveh, a restoration architect, helps. Madarjoon's hidden letters reveal a family secret
  chapter by chapter. Tone: warm, funny, Iranian-TV-family-drama.
- **Core loop:** tap generators (costs ⚡ energy) → items drop on a 7×9 board → merge two
  identical items into the next level → fill characters' **orders** → earn coins + ⭐ stars →
  spend stars on **renovation tasks** in the house → story dialogue → next room/chapter.
- **Chains (Persian items):** tea (برگ چای→…→سماور طلایی), bread (آرد→…→سفره), garden
  (دانه→…→گل محمدی), tools, textile/carpet, pottery/tile, sweets, fruit (انار…).
- **Economy:** energy (100 cap, +1 / 2 min), coins (soft), gems (hard, Bazaar IAP),
  rewarded ads for energy / bubble items / doubled rewards. Daily login gift.
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
