# «تخته‌کلمه» (Takhte-Kalame): Game Design Document v1.0

> Game B of the three-game plan ([05](05-three-game-plan.md)). **Bot-first** Persian board word game.
> Pitch: **"Words With Friends, rebuilt for Persian, and fun even with no internet."**

---

## 1. Vision

**Fantasy:** *"I'm the best wordsmith in my neighborhood, and I can prove it."*

The classic crossword-tile duel (place letter tiles on a board, build crossing words, score points) is a 15-year proven money-maker (Words With Friends about $43M in 2025; NYT Crossplay 1M downloads in about 2 weeks in 2026). **It doesn't exist in Persian.** We build it Persian-native, and we make the **single-player experience strong enough to stand alone**, because Iranian connectivity can't be trusted.

### Design pillars
1. **Persian-native:** tiles visually **join into correctly shaped words** as you play. The dictionary feels "right" to Persian speakers.
2. **Great offline:** characterful AI opponents and a single-player campaign are the core, not a fallback.
3. **Fast and modern:** invalid words are blocked before submitting, the score previews live, and a blitz match takes 5–8 minutes.
4. **Fair competition:** no pay-to-win in ranked play.
5. **Social later, built in from the start:** the architecture is ready for friend duels (phase 2) without a rewrite.

### Not in scope
Open chat, real-money anything, a cloned Scrabble name or board layout (trade dress).

---

## 2. Core rules

### 2.1 Board
- **13×13 standard board** (fits phones better than 15×15; games are about 25% shorter). Center square ★ starts the game.
- **Bonus squares** (Persian names, original layout, not Scrabble's):

| Square | Persian name | Effect | Count (v0) |
|---|---|---|---|
| Double letter | «حرف ۲×» | Letter value ×2 | 16 |
| Triple letter | «حرف ۳×» | Letter value ×3 | 8 |
| Double word | «کلمه ۲×» | Word ×2 | 12 |
| Triple word | «کلمه ۳×» | Word ×3 | 4 |
| ★ Start | «ستاره» | Word ×2 | 1 |

Layout is generated, then tuned by simulation (target: average winning score about 300–380 in a full game). It must be symmetrical and visibly *different* from Scrabble's.

### 2.2 Direction (Persian-specific)
- **Horizontal words read right → left.** **Vertical words read top → bottom.**
- The first word must cover ★. Every later word must connect to existing tiles.
- **All** words formed by a move (main + crosswords) must be valid. Score = the main word + every crossword created.

### 2.3 Tile set v0 (90 tiles; to be tuned by corpus analysis and simulation)
Values reflect rarity in Persian text. **Two blanks («جوکر»)** can be any letter (value 0).

| Letter | Count | Value | | Letter | Count | Value |
|---|---|---|---|---|---|---|
| ا | 9 | 1 | | خ | 2 | 4 |
| ی | 7 | 1 | | ف | 2 | 4 |
| ه | 5 | 1 | | آ | 1 | 4 |
| ر | 5 | 1 | | ق | 1 | 5 |
| د | 5 | 1 | | ج | 1 | 5 |
| ن | 5 | 1 | | پ | 1 | 5 |
| م | 5 | 1 | | ح | 1 | 5 |
| و | 5 | 1 | | ع | 1 | 5 |
| ت | 4 | 2 | | چ | 1 | 6 |
| ب | 4 | 2 | | ص | 1 | 6 |
| س | 3 | 2 | | ط | 1 | 8 |
| ک | 3 | 2 | | غ | 1 | 8 |
| ل | 3 | 2 | | ض | 1 | 10 |
| ش | 2 | 3 | | ذ | 1 | 10 |
| ز | 2 | 3 | | ث | 1 | 10 |
| گ | 2 | 3 | | ظ | 1 | 10 |
| جوکر | 2 | 0 | | ژ | 1 | 10 |

**Validation target:** in simulation, a random 7-tile rack should allow at least one legal opening word more than 98% of the time, and the average number of legal moves mid-game should stay above 30.

### 2.4 Rack and turn
- 7 tiles per rack. Each turn: **play** a word, **swap** any tiles (lose the turn), or **pass**.
- **Bingo «هفت‌تیر»:** using all 7 tiles in one move = **+40**.
- The game ends when the bag is empty and one player empties their rack, or after 4 consecutive scoreless turns. Remaining tile values are subtracted.

### 2.5 Live validation (modern UX)
- As tiles are placed, the word gets a **live green or red outline** and a **live score preview**. The submit button only enables for a fully valid move. (No "challenge" mechanic. Same approach as modern WWF and Crossplay.)
- **"Is this a word?" report button:** players can request a missing word. Reports are batched for your review (see §8).

### 2.6 Persian rendering (the signature feature)
- Tiles on the board are separate squares. **Within a horizontal word, adjacent tiles render in their contextual joined forms**, with a subtle connecting stroke across the cell border. The board reads as *real Persian writing*. A foreign game can't easily match this.
- Vertical words show isolated forms (as in Persian newspaper crosswords).
- The rack shows isolated forms, large and readable.

---

## 3. The dictionary (lexicon)

**This is the product's quality foundation.** The rules are in data, shared via `persian-game-kit`.

| Decision | v1 rule |
|---|---|
| Sources | Frequency corpora (e.g. Bijankhan, Hamshahri, Persian Wikipedia) cross-checked with dictionaries (license check required) |
| Normalization | ي→ی, ك→ک; remove diacritics; آ is its own letter (but «آ» can't be typed as «ا») |
| Nouns, adjectives | ✅ |
| Plurals | ✅ solid-written «ها» / «ان» / «ات» forms commonly written joined (کتابها, درختان) |
| Comparatives | ✅ «تر» / «ترین» when commonly written solid |
| Verbs | ✅ infinitives (رفتن), past stems (رفت), simple past conjugations (رفتم، رفتی…); ❌ «می‌…» forms (half-space) |
| Half-space (ZWNJ) words | ❌ excluded in v1 |
| Proper names | ❌ (except event packs) |
| Offensive, political | ❌ blocklist |
| Length | 2–13 letters |
| Size target | About 80–120k valid forms (full list) + a **"common" list** of about 20k used by beginner bots and hints |

**Word definitions:** tap any word on the board to see a short meaning. This drives the "I learned a new word" feeling and parents' approval. AI drafts definitions, the most common 5k get human-spot-checked, and the rest get a "suggest a fix" button.

---

## 4. The opponents: «اهالی محله» (bot-first core)

Bots are **characters**, not difficulty sliders. Each has a portrait, personality lines and a play style.

| Level | Character | Style (how the AI plays) |
|---|---|---|
| 1 | «نوه» (Grandkid) | Common words only (top 5k), picks a random mid-scoring move, misses bonus squares |
| 2 | «همسایه» (The Neighbor) | Top 15k words, sometimes greedy, decent |
| 3 | «معلم ادبیات» (Literature Teacher) | Large vocabulary, loves long words, ignores rack balance |
| 4 | «حاج‌آقای کتاب‌فروش» (Old Bookseller) | Full vocabulary, maximizes score each turn |
| 5 | «استاد» (The Master) | Full vocabulary + rack-leave strategy + defensive play (blocks triple-word squares) |
| Boss | «پهلوان محله» (Neighborhood Champion) | Master-level + a personal rule twist (see campaign) |

**Engine:** move generation with a **GADDAG/DAWG** over the lexicon (a standard, fast, fully offline algorithm). Bot strength = (vocabulary limit) × (move-selection percentile) × (strategy features). **No LLM at runtime.**
**Personality lines** (pre-written, AI-drafted, you approve): «ای بابا، این کلمه رو از کجا آوردی؟!», «یادم باشه دیگه با تو بازی نکنم 😅».
**Fairness:** bots never see your rack or the bag order. A "fair play" note in the bot profile builds trust.

---

## 5. Game modes

| Mode | Phase | Description |
|---|---|---|
| **بازی سریع** (Quick game) | MVP | vs. any unlocked bot, full or blitz length |
| **لیگ محله** (Neighborhood League) | MVP | Single-player campaign (§6) |
| **حرکت روز** (Move of the Day) | MVP | Daily puzzle: a board position + rack; find the highest-scoring move. **Generated and verified by the engine**, so no human review is needed. Shareable result. |
| **چالش‌ها** (Challenges) | MVP+ | Puzzle packs: "score 60 in one move", "make a bingo", "use the ژ". All engine-verified. |
| **با دوست** (With a friend) | Phase 2 | Async duel via invite link (Telegram/WhatsApp/Eitaa). Iran-hosted server. |
| **رتبه‌ای** (Ranked) | Phase 2 | Async matchmaking by skill (Elo/Glicko), weekly leagues |
| **هم‌خانه** (Pass & play) | MVP | Two players on one phone. Fully offline, great for family gatherings. |
| **رویدادها** (Events) | Phase 2 | Rule variants: «بی‌نقطه» (dotless letters ×2), «شب یلدا» (Hafez words bonus), «نوروز» (ع/س tiles ×3) |

### 5.1 Blitz vs. full length
- **Full:** the whole bag, untimed.
- **Blitz «تند»:** a 45-tile bag, or 8 turns each, with an optional 30-second turn timer. A match takes 5–8 minutes. **Default for new players.**

---

## 6. Single-player campaign: «لیگ محله»

- A stylized **map of an old Iranian neighborhood** (alley, bakery, school, bookshop, teahouse, zurkhaneh…). Each location is a **stage** with 3–5 matches against bots, ending with a **boss match**.
- **Stars** per match: win = ⭐; plus ⭐ for reaching a score threshold; plus ⭐ for completing a side objective ("play a word with ژ", "get a bingo").
- **Boss rules** make boss matches memorable:

| Boss | Location | Twist |
|---|---|---|
| «نانوای محل» | Bakery | Every word with «ن» scores +5 |
| «ناظم مدرسه» | School | Words of 3 letters or fewer score 0 |
| «کتاب‌فروش پیر» | Bookshop | He starts with a 40-point lead |
| «قهوه‌چی» | Teahouse | Your swaps cost 5 points |
| «میرزای خوش‌نویس» | Calligrapher's shop | Dotless words ×2 (for both players) |
| «پهلوان زورخانه» | Zurkhaneh | Master-level bot. Beat him to become «پهلوان محله» |

- 8 locations × about 5 matches = **about 40 campaign matches at launch**, plus new neighborhoods (other cities) as updates: Isfahan, Tabriz, Shiraz, Yazd.
- **Profile title** grows with progress: «تازه‌وارد» → «کلمه‌باز» → «ادیب» → «استاد سخن».

---

## 7. Progression, retention and social

- **Player level (XP)** from every match. Levels unlock bots, board themes and titles.
- **Daily goals:** 3 small goals per day (play 2 matches, score 50+ in one move, solve Move of the Day) → coins.
- **Streak** for Move of the Day, with milestone rewards (7, 30, 100 days).
- **Stats screen:** best move, best word, bingo count, average score, longest word. Players love stats, and VIP extends them.
- **Share cards:** "Best move of the game" image with the word joined beautifully on the board, plus Move of the Day results.
- **Phase 2 social:** friends list via invite codes/links, async duels, weekly leagues (bronze → diamond), **preset Persian reactions** only («دمت گرم»، «عجب حرکتی!»، «شانسی بود 😏»، «بازم بازی؟») — **no open chat** (moderation and regulatory safety).

---

## 8. Content pipeline (low human load)

| Content | Who makes it | Your role |
|---|---|---|
| Lexicon v1 | Script from corpora + dictionaries | Skim the top 20k once (several sessions) |
| Missing-word reports | Players | Approve batches monthly (~30 min) |
| Definitions | AI | Spot-check the most common 5k |
| Bot personality lines | AI | Approve once (~200 lines) |
| Move of the Day, Challenges | **Engine-generated and verified** | None |
| Campaign stages | Data files (bots + rules) | Fun check during playtests |

---

## 9. Monetization

**Principle:** pay for convenience, cosmetics and content, **never for winning in ranked play.**

| Lever | Detail |
|---|---|
| **Coins (سکه)** | Earned from matches, daily goals, streaks and rewarded ads. Spent on helpers in **unranked** games. |
| **Helpers** | «ذره‌بین» (highlights where the best move is: −40 coins); «تعویض رایگان» (swap without losing the turn: −30); «پیشنهاد» (shows the best move outright: −80, disabled in ranked) |
| **Rewarded ads (Tapsell)** | Free helper, double match coins, retry a campaign boss. Optional, capped. |
| **Interstitials** | Only *after* a finished match, never before the player's 5th match, max 1 per 2 matches. Removed by "remove ads". |
| **Cosmetics** | Board themes («قالی»، «کاشی فیروزه»، «خاتم»، «کاغذ کاهی»), tile skins, avatars, reaction packs |
| **Content** | New neighborhoods (city campaigns) beyond the free ones, a bot pack, challenge packs |
| **VIP (monthly)** | No ads, advanced stats, Move of the Day archive, unlimited replays of boss matches, exclusive theme |
| **Phase 2 season pass** | League rewards and cosmetics |

**Economy v1 (to be tuned):** start 150 coins; win vs. bot +15–40 (by level); daily goals +20 each; Move of the Day +25; rewarded ad +30 (max 6/day).

---

## 10. UX flow (MVP)

```
Splash → (first run) tutorial match vs «نوه» with guided placement
Home:
  [▶ بازی سریع]   [🗺 لیگ محله]   [🧩 حرکت روز]
  [👨‍👩‍👧 هم‌خانه]  [🛒 فروشگاه]   [👤 پروفایل/آمار]
Match screen:
  top: opponent portrait + score | my score
  center: board (pinch to zoom, double-tap to center)
  bottom: rack (drag/tap to place) + [بُر زدن] [تعویض] [پاس] [ثبت ✓ +۲۴]
  live: word outlines green/red, score preview bubble
End screen: winner, best word card [اشتراک‌گذاری], rewards, [دوباره] [بعدی]
```

**Tutorial (≤90 seconds):**
1. Place a word through ★.
2. See that the score previews live.
3. Use a bonus square.
4. Swap tiles.

After that, players learn by doing.

---

## 11. Technical design

- **Flutter**; board rendering with CustomPainter (or Flame). Flavors for `bazaar` and `myket` (`play`/`ios` dormant).
- **Engine package** (pure Dart, heavily unit-tested):
  - lexicon as a compressed **DAWG** asset (target under 3MB)
  - move generator (GADDAG)
  - scorer
  - bot policies
  - board/bag/rack state
  - deterministic RNG (seeds enable replays and daily puzzles)
- **Persian shaping:** use joining rules from `persian-game-kit` to choose each tile's glyph form from its neighbors.
- **Saves:** SQLite. Every match is an append-only move log, which allows replays, stats and future cloud sync.
- **Phase 2 backend (Iran-hosted):** Go or Node + Postgres + Redis. Endpoints: auth (phone OTP via an Iranian SMS provider), matches, moves (server validates every move using the same engine logic), matchmaking, leagues. Push via an Iranian push service (e.g. Pushe) with in-app polling as a fallback. **Server-side move validation** prevents most cheating. Anagram-helper cheating is limited by fast-move detection and ranked timers.
- **Performance budget:** the hard bot (level 5) finishes move generation in under 300ms on a 2GB-RAM phone. APK under 40MB.

---

## 12. Analytics and KPIs

Events: tutorial steps, match start/end (mode, bot, score, duration), moves (score, bingo, helper use), ads, purchases, Move of the Day (solve rate, attempts, shares), word reports.

| KPI | Soft-launch target |
|---|---|
| Tutorial completion | ≥ 85% |
| D1 / D7 / D30 | ≥ 40% / ≥ 18% / ≥ 8% |
| Matches per DAU | ≥ 3 |
| Move of the Day participation | ≥ 30% of DAU |
| Share rate | ≥ 5% of Move of the Day solvers |
| Payer conversion | ≥ 2% |

---

## 13. MVP scope and milestones

**MVP (offline):**
- engine + lexicon v1
- 5 bots + boss
- Quick game (full and blitz)
- Neighborhood League (8 locations)
- Move of the Day
- pass & play
- coins, helpers, ads, IAP (coins, remove ads, starter pack, 2 board themes)
- definitions for the common words
- Bazaar + Myket builds

| # | Milestone | Output |
|---|---|---|
| B0 | Lexicon v1 + engine (move gen, scoring) + unit tests | CLI simulator: bot vs. bot, 10k games |
| B1 | Tile set and board tuning by simulation | Balanced v1 numbers |
| B2 | Web prototype: you vs. bot, Persian joined rendering | **Playable link for you** |
| B3 | Full MVP UI, campaign, Move of the Day, economy | Test APK |
| B4 | Art pass (characters, themes), sounds, polish | Beta APK |
| B5 | Store builds, ESRA, soft launch on Myket | Data |
| Phase 2 | Server, friend duels, ranked, leagues, events | Online version |

---

## 14. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Lexicon disputes ("that IS a word!") | Large lexicon, report button, fast monthly updates, clear rules page |
| Persian morphology makes rules feel inconsistent | Explicit, simple v1 rules (§3) shown in the help screen |
| Bots feel robotic or unfair | Character design, transparent fairness note, tuned mistakes at low levels |
| Too slow for casual players | Blitz is the default, live score preview, 13×13 board |
| Online phase cold start | Bots fill gaps. Launch online with friend invites first, then ranked. |
| Shutdowns (phase 2) | The offline core stays fully playable. Async turns queue locally and sync later. |
| Trade dress | Original name, board layout, bonus names and visual identity |

---

## 15. Open questions for you

1. **Board size:** 13×13 (recommended), or 15×15 for "serious" players as an option?
2. **Which dictionaries** can we license or use (Dehkhoda/Moein/Amid licensing), or should we rely on corpora + an open lexicon?
3. **Character art:** do the neighborhood characters work for you, or do you prefer a different setting (e.g., a school/university, or a coffeehouse)?
