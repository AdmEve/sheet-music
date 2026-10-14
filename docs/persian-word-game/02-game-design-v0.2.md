# «ربطش چیه؟» — Game Design v0.2

> Builds on [01-brainstorm.md](01-brainstorm.md).
> Decisions so far: solo owner, **part-time**; **AI agents write all the code**; **AI generates most puzzles**; goal is **revenue**; markets are **Iran + diaspora**; the concept is an **association core + daily puzzle**.

---

## 1. What the AI does vs. what only you can do

Coding can be fully delegated. These tasks **cannot** be, so plan your part-time hours around them:

| Task | Why it needs a human | Your time |
|---|---|---|
| **Persian quality gate:** approve or reject AI puzzles in a review tool | AI Persian is good but not reliable on cultural nuance, ambiguity and taste. One bad puzzle in the *daily* gets screenshotted and mocked. | About 2–3 h/week (≈30 sec per puzzle) |
| **Playtesting on real phones in Iran** | Fonts, performance on cheap Android phones, how it *feels* | 1–2 h/week + 5–10 friends/family |
| **Store accounts:** Cafe Bazaar and Myket developer accounts | They require an Iranian national ID and bank account (Sheba) | One-time |
| **ESRA age rating** and store content review | A legal identity has to submit them | One-time per release |
| **Google Play / App Store for the diaspora** | ⚠️ Iranian residents generally **cannot open these accounts** because of US sanctions. This needs a legitimate partner or entity outside Iran. **Get proper legal advice.** I can't solve this one. | Decision needed |
| **Art direction sign-off** | Taste decision | Occasional |
| **Marketing:** Instagram, Telegram, influencers | Your voice and network | Ongoing after launch |

> Realistic pace: with AI coding, **code is not the bottleneck. Your review time and the art are.** At about 6–8 h/week, a soft launch in about 5–6 months is realistic.

---

## 2. Tone recommendation

You weren't sure, so here is my recommendation: **"elegant visuals, witty words."**
- **Visuals are calm, warm and premium:** Persian garden palette (turquoise, saffron, pomegranate red), tile motifs, soft animations. This attracts Amirza's broad and older audience.
- **The copy is warm, colloquial and lightly funny,** especially the category reveals and failure messages, e.g. «ای بابا! یکی‌ش جا موند 😅» / «نزدیک بودی!». This makes screenshots shareable without alienating anyone.
- **No edgy humor:** no political, ethnic or religious jokes (see 01 §8).

---

## 3. Core mechanic: «ربط» (Rabt)

### 3.1 Base rules
1. The board shows **N word tiles** (8 → 25 as the game progresses). They belong to **G hidden groups** (2 → 5).
2. The player taps tiles to select a group (the group size is shown, normally 4) and presses «ثبت» (submit).
3. **Correct:** tiles merge into a colored bar, and the **category name is revealed** with a satisfying animation.
4. **Wrong:** the player loses one of ❤️×4 lives. If 3 of the 4 tiles were right, they see «یکی مونده!» ("one away").
5. **The level is won when all groups are found.** Stars: ⭐⭐⭐ = 0 mistakes, ⭐⭐ = 1–2, ⭐ = 3.
6. **Losing all lives:** retry the level for free, or continue for coins or a rewarded ad.

### 3.2 Twist mechanics (unlocked over the campaign)
Like obstacles in Royal Match or Candy Crush, each twist keeps the campaign fresh. Introduce one new twist about every 40 levels:

| # | Twist | Rule | Unlock |
|---|---|---|---|
| 1 | **مزاحم** (Intruder) | One extra decoy tile belongs to no group | Lv 25 |
| 2 | **پشت‌ورو** (Face-down) | Some tiles stay hidden until a group next to them is solved | Lv 60 |
| 3 | **اسم‌دار** (Named) | Category names are shown, but tiles fit more than one. Inverse difficulty for variety | Lv 90 |
| 4 | **قفل** (Lock) | A tile is locked inside a chain until a specific group is solved | Lv 130 |
| 5 | **سوپر ربط** (Meta-connection) | After all groups are solved, the *category names themselves* form a final connection to guess | Lv 170 |
| 6 | **ستون‌ها** (Solitaire columns) | Tiles come from a draw deck. Place each into category columns with limited moves (Solitaire Associations style) | Lv 220 |

### 3.3 Category types (the content taxonomy)
Varying the category type is what makes it feel clever rather than like a vocabulary quiz:

| Type | Example | Difficulty |
|---|---|---|
| **Semantic** | میوه‌ها، پرندگان، رنگ‌ها | 🟨 easy |
| **Cultural** | در سفره هفت‌سین، شاعران، غذاهای شمالی | 🟩 medium |
| **Hidden property** | رنگ‌هایی که اسم خوراکی‌اند (زرشکی، پسته‌ای) | 🟦 medium-hard |
| **Wordplay / compound** | «… + خانه» (کتاب، آشپز، گل، کار) | 🟪 hard |
| **Double meaning** | شهرهایی که معنای دیگری هم دارند (بم، خوی، نور، ساری) | 🟪 hard |
| **Proverb completion** | words that complete famous proverbs | 🟪 hard (events) |

### 3.4 Sample puzzles (hand-made, as quality targets for the AI)

**Level 3 (tutorial, 2 groups):**
- 🍎 میوه: سیب، انار، هلو، گیلاس
- 🎨 رنگ: قرمز، آبی، سبز، زرد

**Level ~40 (4×4, medium):**
- 🟨 میوه: **سیب**، انار، هلو، گیلاس
- 🟩 در سفره هفت‌سین: سبزه، سمنو، سیر، سرکه ← *red herring: سیب looks like it belongs here*
- 🟦 «… + خانه»: کتاب، آشپز، گل، کار
- 🟪 شاعران: حافظ، سعدی، **عطار**، خیام ← *عطار also means "perfumer"*

**Level ~150 (4×4, hard):**
- 🟨 پرندگان: هما، کبک، جغد، **باز** ← *باز also means "open"*
- 🟩 رنگ‌هایی که اسم خوراکی‌اند: زرشکی، پسته‌ای، لیمویی، نخودی
- 🟦 «… + ستان» = مکان: بیمار، دبیر، نخل، کوه
- 🟪 شهرهایی با معنای دیگر: بم، خوی، نور، ساری

> ⚠️ **Why automated validation matters:** my first draft of the medium puzzle used **سنجد** in the haft-sin group. But سنجد is also a fruit, so a *second valid solution* existed (سیب ↔ سنجد swap). The pipeline in §6 must catch exactly this kind of error automatically.

### 3.5 Daily puzzle «ربط امروز»
- One 4×4 per day, the same for everyone, with difficulty ordered 🟨🟩🟦🟪.
- A **streak counter** («۱۲ روز پشت سر هم 🔥»), with a coin reward on day 7 and day 30.
- **Share card** (copy text plus a story-sized image):
  ```
  ربطش چیه؟ #۴۲  |  ۲۲ مهر ۱۴۰۵
  🟨🟨🟨🟨
  🟩🟦🟩🟩
  🟦🟦🟦🟦
  🟩🟩🟩🟩
  🟪🟪🟪🟪
  ```
- **Offline-proof:** the app ships with **60+ days of dailies pre-bundled**, and downloads more when online. The daily still works during a shutdown.

---

## 4. Level and difficulty design

**Difficulty score** (computed per puzzle, then tuned with real data):
```
D = Σ_groups typeWeight(category)        // semantic 1 … wordplay 4
  + 1.5 × redHerringCount                // tiles that plausibly fit 2 groups
  + 0.5 × rareWordCount                  // below frequency threshold
  + twistWeight
```

**Campaign curve: a "sawtooth" ramp,** with a breather after each spike:
- Lv 1–10: tutorial, 2→3 groups, semantic only, category names hinted.
- Then blocks of 10: levels 1–7 rise gently, **level 8 is a "hard level"** (gold frame, double reward), levels 9–10 relax.
- About 20 levels per chapter. Each chapter unlocks a new garden area (§5).
- **Data tuning after launch:** if a level's win rate is below 70% or its quit rate is in the top 5%, it gets auto-flagged for easing or reordering.

---

## 5. Meta layer: «باغ من» (My Garden)

- Stars from levels → **flowers (گل)**, the meta currency.
- Each chapter = one garden area with 5–6 tasks (fountain, cypress row, pool, pavilion, lanterns), each costing 1–3 flowers.
- Completing a garden → a postcard-like "restored" scene to share, then the next garden. MVP: **one garden** with 3 areas, inspired by Fin (Kashan). Later: Eram (Shiraz), Dolat-Abad (Yazd), plus an events garden.
- **Art plan for a solo budget:** one consistent 2D style. Options in the chat (AI-generated vs. commission vs. asset pack).

---

## 6. AI puzzle pipeline (the most important system)

```
[1 Generate] → [2 Lint] → [3 Blind solve] → [4 Score] → [5 You review] → [6 Ship] → [7 Telemetry tune]
```

1. **Generate:** an LLM receives a category-type mix, target difficulty, banned topics, and recent puzzles (to avoid repeats). It outputs JSON with groups, a reason for each group, and the red herrings it intended.
2. **Lint (code, not AI):**
   - every word exists in our **Persian lexicon** (built from frequency corpora plus dictionaries)
   - text is normalized (ی/ك/ZWNJ)
   - no word appears on the blocklist
   - word length is 2–8 letters for tile fit
   - no duplicates across groups
   - frequency is above the threshold, except for allowed "hard" words
3. **Blind solve:** a *separate* LLM call (no answers given) solves the board. It must find the intended solution, and it is asked explicitly: "is there any other valid grouping?" **Any alternative grouping → reject.** A word-embedding check also flags tiles that sit close to two groups.
4. **Score:** compute D (§4) and assign the puzzle to a slot in the curve.
5. **Human review:** a simple web page, one card per puzzle, with ✅ / ❌ / ✏️ edit. Target about 30 sec per puzzle. **Nothing ships without ✅.** Dailies get a second look.
6. **Ship:** packs of 50 levels as signed JSON. New packs arrive over the network with no app update.
7. **Telemetry:** win rate, mistakes, hint use and time per level feed back into reordering and the generator's prompts.

**Content targets:** 300 campaign levels + 90 dailies at launch. After launch: +50 levels and +30 dailies per month (about 2 h/week of your review).

**Puzzle JSON (draft):**
```json
{
  "id": "c01-040",
  "groups": [
    {"name": "میوه", "words": ["سیب","انار","هلو","گیلاس"], "type": "semantic", "color": 1},
    {"name": "در سفره هفت‌سین", "words": ["سبزه","سمنو","سیر","سرکه"], "type": "cultural", "color": 2}
  ],
  "decoys": [],
  "twist": null,
  "redHerrings": [{"word": "سیب", "alsoFits": "در سفره هفت‌سین"}],
  "difficulty": 6.5,
  "reviewedBy": "owner",
  "version": 1
}
```

---

## 7. Economy (v1 numbers, to be tuned)

| Item | Coins |
|---|---|
| Starting balance | 200 |
| Level win | +10 (+5 per star) |
| Hard level win | ×2 |
| Daily win | +30, streak bonuses on day 7 and day 30 |
| Rewarded ad | +25 (max 6/day) |
| **Hint: reveal one tile's group** | −60 |
| **Hint: reveal a category name** | −90 |
| Shuffle | free |
| Continue (+2 lives) | −100 or 1 rewarded ad |

**Price tiers** (Iranian toman prices are set at launch against current Bazaar comparables, then re-checked every quarter for inflation):

| Product | Iran (relative) | Diaspora (USD) |
|---|---|---|
| Small coin pack | lowest tier | $1.99 |
| Medium pack (best value tag) | ~3× small | $4.99 |
| Large pack | ~7× small | $9.99 |
| Remove ads (keeps rewarded ads optional) | ~2× small | $3.99 |
| Starter pack (one-time, day 1–3) | ~1.5× small | $2.99 |
| VIP monthly (no ads, daily archive, weekly hints) | ~1.5× small | $2.99/mo |

**Ad rules:** no interstitials before level 20. Never during a level. At most one interstitial per 3 levels. Rewarded ads are always optional.

---

## 8. Technical architecture (MVP)

- **Flutter** app, with flavors for `bazaar` (Poolakey IAP), `myket` (Myket IAB), `play`/`ios` (later), and `web` (for testing and as a future PWA).
- **Offline-only MVP:** progress lives on the device (SQLite). **No backend required for launch**, which removes server cost and shutdown risk.
- **Content delivery:** signed JSON packs on static hosting inside Iran (e.g., ArvanCloud object storage) with a fallback mirror abroad. The app checks for new packs when online.
- **Ads:** Tapsell (Bazaar/Myket builds). Diaspora builds use a separate ad network, decided later.
- **Analytics:** a tiny event logger that batches events to a small endpoint (self-hosted) and works offline-first.
- **Tooling repo parts:** `app/` (Flutter), `content/` (puzzle packs + lexicon), `tools/` (generator, linter, blind solver, review web page).
- **Testing:** AI agents write unit tests for game logic and the puzzle linter, and golden screenshot tests for RTL/Persian rendering. You do on-device checks.

---

## 9. MVP scope (strict)

**IN:** Rabt core + twists 1–2, 300 levels, the daily with streaks and a share card, one garden, coins and hints, rewarded + interstitial ads, IAP (coin packs, remove ads, starter pack), offline mode, Persian RTL UI, sound + haptics, Bazaar + Myket builds.

**OUT (later):** online duels and leagues, VIP subscription, twists 3–6, a second garden, player accounts and cloud sync, iOS/Play diaspora builds (pending the account question), Persian Wordle mode, user-submitted puzzles.

## 10. Milestones (part-time owner, AI coding)

| # | Milestone | Owner effort | Output |
|---|---|---|---|
| M0 | Setup: new repo, Flutter skeleton, lexicon v1, pipeline v1 | 2 h | Repo + first 50 AI puzzles for you to review |
| M1 | **Playable web prototype** of the core (no art) | 2 h testing | A link you play on your phone and share with 5 friends |
| M2 | Campaign + daily + economy + local saves | 3 h/week | Android APK (no store) for testing |
| M3 | Art + garden + sound + polish | Art decision & sign-off | Beta APK |
| M4 | IAP, ads, store builds, ESRA, store listing | Accounts + submission | Release candidate |
| M5 | **Soft launch on Myket**, tune with data | Weekly review | Data-driven fixes |
| M6 | Bazaar launch with a Nowruz 1406 event (if ready), else the next good window | Marketing | 🚀 |

---

## 11. Decisions log (round 3)

| Question | Decision | Consequence |
|---|---|---|
| Code location | **New dedicated repo** | Development moves there once it exists. These docs move with it. |
| Art | **AI art + owner curation** | Lock one style early (style guide + a reference sheet of about 10 images), and draw UI/tiles in code/vector. Generate the garden pieces as layered PNGs from the same prompt template. |
| Tone | **Elegant visuals, warm & lightly funny copy** | As in §2. |
| Diaspora stores | **Not yet** | Launch **Iran-only (Bazaar + Myket)**. Keep the codebase Play/iOS-ready. Diaspora players can be reached later once a legal publishing path exists. |
