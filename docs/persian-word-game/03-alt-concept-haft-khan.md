# Alternative Core Concept: «هفت‌خوان» (Haft Khan): A Persian Word Roguelite

> A different core from «ربطش چیه؟» (doc 02). Pitch in one line:
> **"Balatro meets Shahnameh, played with Persian letters."** You are Rostam crossing the Seven Labours. Your weapon is words.

---

## 1. Why this could be even better

| | «ربطش چیه؟» (association) | «هفت‌خوان» (word roguelite) |
|---|---|---|
| Where the content comes from | **Hand-made puzzles**. Every level needs AI generation **plus your review**. | **Systemic**. The Persian dictionary *is* the content. Every run is new. No puzzle review queue. |
| Your weekly review load | About 2–3 h, forever | About 0 after the word list is validated once |
| Replayability | Finite levels | Effectively endless ("one more run") |
| Novelty in Iran | High | **Very high**. A genre no Iranian game has. |
| Novelty globally | Medium (Connections clones exist) | **High**. Word Balatro-likes are a 2025–26 PC trend (Word Play, OMG Words, Wordatro, Spellatro, Beyond Words). I found **no strong mobile one**. |
| Can a competitor copy it by translating? | Yes | **No**. Core rules use Persian script itself (dots, joining letters) and Persian myth. |
| Cultural hook | Trivia and culture categories | **Shahnameh**: national epic, public domain, national pride, parents approve |
| Audience | Broadest (Amirza players) | Casual-plus. Needs very good onboarding (§7). |
| Balancing | Puzzle difficulty | Systems balancing, which AI can do by **simulating thousands of bot runs** |

**The killer advantage for you:** Rabt's biggest risk is AI-written Persian puzzles needing your review every week. Haft Khan removes that bottleneck. Code (which AI agents write) does the heavy lifting, and code can be tested automatically.

---

## 2. Core loop (one fight)

1. You have a **bag (کیسه)** of about 40 Persian letter tiles. You draw a **hand of 8**.
2. Form a valid Persian word from your hand and play it as an **attack (حمله)**:
   `Damage = (sum of letter values) × multiplier`
3. You get **4 attacks** and **3 swaps (تعویض)** per fight. Swaps throw away tiles and draw new ones.
4. Reduce the enemy's HP to 0 before you run out of attacks. Otherwise the run ends.
5. **Letter values follow rarity in Persian:** common letters (ا ی ر ن د م ه و) are worth 1. Rare ones (ژ ظ ض ط ث ذ غ ص) are worth 8–10. Longer words get a length multiplier.

**A worked example.** Hand: `ب ا ر ا ن د ش ی`
- Play «باران»: chips 2+1+1+1+1 = 6. Length-5 multiplier is ×3. The talisman «ابر بهاری» (+4 mult if the word contains ب) brings it to ×7. **6 × 7 = 42 damage.**
- **Boss «ارژنگ دیو»: dotted letters are banned!** Now «باران» is illegal (ب and ن have dots). You must think differently, e.g. «دار». The Persian script itself becomes the puzzle.

---

## 3. Run structure: the Seven Labours

One run = **7 khans**. Each khan = 2 normal fights + **1 boss** with a rule-bending curse. Mobile target: a full run in about 20–25 min, with auto-save between fights (good for short sessions).

| Khan | Boss | Curse (rule twist) |
|---|---|---|
| ۱ | **شیر** (The Lion) | Words shorter than 4 letters do nothing |
| ۲ | **بیابان بی‌آب** (Waterless Desert) | Your hand doesn't refill; plan every letter |
| ۳ | **اژدها** (The Dragon) | Night: 3 tiles in your hand are face-down |
| ۴ | **زن جادو** (The Sorceress) | Illusion: letter values shuffle every turn |
| ۵ | **اولاد** (Olad) | Each word must contain a letter he names |
| ۶ | **ارژنگ دیو** (Div Arzhang) | Dotted letters (ب ت ن ش …) are banned |
| ۷ | **دیو سپید** (The White Div) | Huge HP, and only non-joining letters (ا د ذ ر ز ژ و) score double. Beat him to free Kay Kavus |

Between fights you rest at the **caravanserai (کاروانسرا)**, a shop:
- **Talismans (طلسم):** passive power-ups ("jokers"), up to 5 slots.
- **Letter crafting:** gild a letter (turquoise tile = ×2), or add or remove letters from your bag. This is deck-building: thinning your bag is strategy.
- **Scrolls (طومار):** one-use consumables (draw 3, copy a tile, double the next word).

---

## 4. Talismans: the Persian magic (examples)

Most of these hook into **things that only exist in Persian**:

| Talisman | Effect | Persian hook |
|---|---|---|
| **سرمه‌دان** (Kohl case) | +2 mult per *dot* in the word | Persian dots |
| **قلم بی‌نقطه** (Dotless pen) | ×3 if the word has **no dots** (e.g. «سلام»، «مداد») | A real Persian literary game (dotless poetry, صنعت مهمله) |
| **زنجیر گسسته** (Broken chain) | +3 mult per non-joining letter | Letter joining |
| **مشاعره** (Poetry duel) | If a word starts with the last letter of the previous word, +mult that grows with the chain | The national poetry game |
| **آینه** (Mirror) | ×4 for palindromes (داد، کک، شوش، نان) | Wordplay |
| **چشم نظر** (Evil-eye bead) | Once per fight, cancel the boss curse | Folk culture |
| **اسپند** (Esfand) | Reroll the shop for free | Folk culture |
| **فال حافظ** (Hafez's fortune) | Random big buff each fight, shown with a real Hafez verse | Yalda / Hafez |
| **پر سیمرغ** (Simorgh's feather) | Revive once per run | Shahnameh |
| **رخش** (Rakhsh) | +1 attack per fight | Shahnameh |
| **سفره هفت‌سین** | ×7 for words starting with «س» (Nowruz event) | Seasonal LiveOps |

Target at launch: **about 60 talismans**, with 10–15 added each season.

**Letter edge cases are defined in data, not hard-coded.** Example: final «ی» has no dots in Persian, but medial «ی» does. A letter-property table settles these once.

---

## 5. Heroes and meta progression

- **Heroes** = starting bag + one special ability:
  - **رستم** (balanced, +mult for long words)
  - **زال** (sees the next 3 tiles)
  - **گردآفرید** (bonus for short, fast words)
  - **سیاوش** (no swaps, but every word gets ×2)
  - **اسفندیار** (hard mode, with **his own Haft Khan**)
- **Difficulty tiers** («ستاره‌های آسمان», like Balatro stakes) make each win unlock a harder variant. This gives long-term mastery.
- **Codex «شاهنامه‌نامه»:** every boss and talisman unlocks an illustrated miniature card with a short story plus a Ferdowsi verse. It's a collection players love, and a reason parents approve.
- **Future expansions are free content from the Shahnameh:** Rostam & Sohrab, Kaveh vs. Zahhak, Siavash's fire trial, Bijan & Manijeh. Each is a new "campaign" with its own bosses and curses.

---

## 6. Daily seed: «خوان امروز» (the viral loop)

- Every day, everyone plays the **same seeded run** (same letters, shop and bosses).
- Shareable result card:
  ```
  هفت‌خوان | خوان امروز ۲۲ مهر
  🦁✅ 🏜️✅ 🐉✅ 🧙‍♀️✅ 👤✅ 👹❌
  بهترین کلمه: «شهریار» — ۳۱۲ ضربه ⚔️
  ```
- "Best word of the day" is the bragging-rights hook. It works offline (the seed is computed from the date, so no server is needed). An online leaderboard comes later.

---

## 7. Onboarding: making a "roguelite" feel casual

The main risk is that Amirza-style casual players find it too complex. Mitigations:
- **The first 3 fights are just "make words to fill the bar"**. No shop or talismans until fight 4.
- A **«قصه» (Story) mode** with low HP targets, unlimited retries, and an AI-voiced narrator **[later]** telling the Haft Khan story between fights.
- **"Best word" helper:** a hint button shows the highest-scoring word in your hand (for coins or an ad). This also teaches players new words.
- **Sessions are short and saved:** each fight takes about 2–3 minutes.

---

## 8. Monetization (fair, revenue-focused)

- **Free:** Rostam, the full Haft Khan, and the daily seed.
- **Rewarded ads (Tapsell):** revive (Simorgh), extra swap, shop reroll. All optional.
- **IAP:**
  - Hero packs.
  - **Expansion campaigns** (Sohrab, Zahhak …), which are high value and fit Iranian taste for story.
  - Cosmetic tile skins (turquoise kashi, khatam-kari, gold manuscript).
  - Remove ads.
  - A "Complete Shahnameh" bundle.
- **Season pass (later):** monthly themed talismans and cosmetics.
- **Never sold:** raw power in the daily seed. The leaderboard stays fair.

---

## 9. Feasibility for a solo owner with AI coding

- **The engine is small:** a letter bag, hands, the word check (a trie of the Persian word list), the scoring pipeline, talisman effects as data-driven rules, and a shop. That's well within what AI agents build and **unit-test** reliably.
- **AI balancing:** a headless simulator runs about 100k bot runs to tune letter distribution, HP curves and talisman power. It also checks that a hand of 8 can almost always form a valid word. All automatic, no human needed.
- **The word list** (the one human-reviewed asset):
  - build it from frequency corpora plus dictionaries, with a blocklist
  - normalize ی/ک and remove half-space words
  - you skim the top about 20k words once
  - players can report "this should count as a word" in-game, and you approve reports in batches
- **Art:** **Persian miniature (نگارگری) style**, generated with AI and curated by you, with a locked style guide. Few assets are needed: 7 bosses, about 5 heroes, about 60 talisman icons, tiles and backgrounds.
- **Offline-first by nature:** no server is needed to play.

---

## 10. Honest risks

| Risk | Mitigation |
|---|---|
| Too complex for the broadest casual audience | Story mode, slow unlocks, best-word helper (§7). Test early with the web prototype. |
| Iranian players' appetite for "roguelite" is unproven | Validate with a **web prototype in week 2–3** (no art) and 30 testers. Measure "one more run". |
| Balance bugs (broken talisman combos) | Simulator + telemetry. Broken combos are also *fun*, and players share them. |
| Word list errors anger players | Report button + fast fixes through content updates |
| Combat theme in store review | Bloodless: words become light and strikes. Classical, family-friendly miniature style. |

---

## 11. Runner-up idea (not chosen, kept for later)

**«مشاعره»: a poetry puzzle built on Ganjoor** (the open dataset of classical Persian poetry). Players rebuild famous lines and play poetry duels. The answers are real verses, so no AI-written content is needed. It's a strong niche, but its audience is older and narrower. **It could live inside Haft Khan** as the «فال حافظ» / «طومار فردوسی» flavor and as a future side mode.

---

## 12. Recommendation

If the goal is **revenue with a solo, part-time owner and AI coding**, **Haft Khan is the stronger bet**. It turns the biggest weakness of the association plan (endless human content review) into a strength (systemic, endless, code-tested content). It is also unique in a way no competitor can copy by translating.

Keep **Rabt** as an option if you decide the absolute broadest casual audience matters more than depth, novelty and replayability.

### Sources
- Word Balatro-likes: [Word Play](https://thinkygames.com/games/word-play/) · [OMG Words](https://steamcommunity.com/app/2884080/reviews/?browsefilter=toprated) · [Wordlike](https://store.steampowered.com/app/3142780/Wordlike/) · [Spellatro](https://store.steampowered.com/app/3785350/Spellatro/) · [Beyond Words](https://store.steampowered.com/app/3823370/Beyond_Words/) · [Next Fest Balatro-likes roundup](https://nosmallgames.com/2025/06/i-tried-every-balatro-like-game-i-could-find-in-steam-next-fest-again/)
- Balatro mobile performance: [Shacknews](https://shacknews.com/article/142371/balatro-mobile-4-million) · [PocketGamer.biz](https://www.pocketgamer.biz/balatro-nears-44m-on-mobile-amid-a-sudden-spending-surge)
- Existing "Haft Khan" app on Bazaar (a reference app, not a game): [cafebazaar.ir/app/com.cocoa.haftkhan](https://cafebazaar.ir/app/com.cocoa.haftkhan)
