# Three-Game Plan: هفت‌خوان · تخته‌کلمه · بازارچه

> Decision: build all three finalists from [04-concept-deep-dive.md](04-concept-deep-dive.md), each in its own repository.
> B (تخته‌کلمه) is designed **bot-first**: offline matches against AI opponents are the core, and online duels are a layer added on top.

---

## 1. The one rule that makes this work

**Code can be built in parallel. Your time can't.**
AI agents can develop all three codebases at once, but each game also needs your playtesting, store submission, ESRA rating and marketing. Doing those for three games at once would split your part-time hours three ways and slow every game down.

So:
- **Parallel:** development, tests, prototypes.
- **Staggered:** polish, launch and LiveOps, in this order:

| Order | Game | Why this position |
|---|---|---|
| 1st launch | **A. هفت‌خوان** | Fastest to MVP, no server, nearly zero weekly review |
| 2nd launch | **B. تخته‌کلمه** (bot-first) | Reuses A's Persian dictionary and tile rendering. The online layer comes after offline launch. |
| 3rd launch | **C. بازارچه** | Largest scope and art load. Benefits from A and B's audience through cross-promotion. |

---

## 2. Shared foundation (build once, use three times)

All three games need the same Persian building blocks. Building them once saves months and keeps quality consistent:

| Shared module | Used by |
|---|---|
| **Persian lexicon + tools:** word list, frequency, normalization (ی/ک/ZWNJ), letter properties (dots, joining), blocklist | A, B, C |
| **Tile rendering:** letter tiles that join into correctly shaped Persian words, Vazirmatn font, Persian digits, RTL layout | A, B, (C) |
| **Store and money:** Bazaar (Poolakey) and Myket billing wrappers, Tapsell rewarded ads, price tables | A, B, C |
| **Offline-first plumbing:** local saves, content pack downloads, batched analytics events | A, B, C |
| **Daily seed + share card generator** | A, B |
| **Cross-promotion:** "our other games" banner and rewards | A, B, C |

**Where it lives:** I recommend a **4th small repository** (e.g. `persian-game-kit`) that the three games import as a Flutter package. The alternative is keeping the kit inside the هفت‌خوان repo and importing it from there. That's workable, but messier.

---

## 3. Per-game status

| | A. هفت‌خوان | B. تخته‌کلمه | C. بازارچه |
|---|---|---|---|
| Design doc | ✅ [03](03-alt-concept-haft-khan.md) | ⏳ needs a full bot-first doc | ⏳ needs a full doc (economy, story, item chains) |
| First milestone | Playable web prototype of one fight | Playable board vs. one bot | Board with tier merge + compound merge + 5 riddle orders |
| Main human input | Word list skim, playtests | Bot difficulty feel, playtests | Story outline, art direction, riddle review |
| Server | None | None for MVP; Iran-hosted for online duels (phase 2) | None |

---

## 4. Suggested repository names

| Game | Repo |
|---|---|
| Shared kit | `persian-game-kit` |
| هفت‌خوان | `haft-khan` |
| تخته‌کلمه | `takhte-kalame` |
| بازارچه | `bazaarche` |

Each repo will get a `CLAUDE.md` (the design summary and rules for AI agents), its design doc, CI with tests, and the same Flutter setup.

---

## 5. Advantages of running three games

- **Your own cross-promotion network:** each game sends players to the others. On Iranian stores, where user acquisition is expensive, this is valuable.
- **Spread risk:** if one concept underperforms, the shared kit and the audience carry over to the others.
- **Studio identity:** three high-quality Persian word games under one name builds a brand that Bazaar editors notice.
