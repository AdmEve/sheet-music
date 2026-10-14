# «بازارچه» (Bazaarche): Game Design Document v1.0

> Game C of the three-game plan ([05](05-three-game-plan.md)).
> Pitch: **"A merge game where Persian words combine into new words, customers order in riddles, and you save your grandfather's shop in an old Iranian bazaar."**

---

## 1. Vision

**Fantasy:** *"I'm bringing my family's old bazaar back to life, with my wits and my words."*

Merge-2 (Travel Town, Gossip Harbor) is one of the most lucrative casual genres. Its core audience (women 25–50) **matches Amirza's 7M yearly players**. No Persian merge game uses **the language itself** as the mechanic. We do three things no one else does:
1. **Word ladders:** items are Persian words that evolve («قطره → آب → چشمه → جوی → رود → دریا»).
2. **Compound merges:** different words combine into real Persian compounds («گل + آب → گلاب»). Persian morphology becomes the crafting system.
3. **Riddle orders:** customers don't show what they want. They ask in a riddle, so **you must think in Persian to serve them.**

### Design pillars
1. **The word is the hero.** Every item shows its word in beautiful type. The icon supports the word, not the other way around.
2. **Warm Iranian story:** family, neighbors, humor, nostalgia. Like a good Iranian TV series.
3. **Relaxing, but clever:** no fail state, but riddles give a real "aha!".
4. **Fair energy economy:** generous for free players; paying speeds you up, it doesn't unlock "the real game".
5. **Offline-first:** everything works without internet.

### Not in scope
Romance plots, politics, real brands, gambling mechanics (no loot boxes), open chat.

---

## 2. Story: «دفترچهٔ حاج‌بابا» (Season 1)

**Premise:** **نیلوفر** (28), an architect in Tehran, learns that her grandfather **حاج‌بابا** has passed away. He left her his old **عطاری** (herbal shop) in the fading **بازارچهٔ گلستان** (a fictional bazaar inspired by Tabriz, Isfahan and Kashan), and a **notebook full of riddles**.

**Conflict:**
- A company wants to buy the whole bazaar and build a shopping mall. Its smooth representative **آقای فرهادی** is persuading shop owners to sell.
- Her cousin **کامران** wants the money and pushes her to sell too.
- The neighbors are tired and losing hope.

**Engine of the story:** grandfather's riddles are the customers' orders. Solving them restores the shops, wins the neighbors back, and slowly reveals a family secret: the bazaar's old **endowment deed (وقف‌نامه)**, hidden by Haj-Baba, which proves the bazaar can't legally be sold. That's the Season 1 finale.

| Character | Role | Personality |
|---|---|---|
| نیلوفر | Player character | Smart, a bit stubborn, city-girl learning tradition |
| حاج‌بابا | Grandfather (appears in notebook entries and flashbacks) | Wise, funny, loved riddles |
| کامران | Cousin | Not a villain: in debt, comes around in chapter 5 |
| عمو اکبر | Baker | Grumpy, golden heart |
| خاله مهین | Confectioner | Gossip queen, comic relief |
| میرزا | Old calligrapher and bookseller | Poetic, quotes Hafez constantly |
| اوستا رحیم | Carpet master | Quiet, proud of his craft |
| آقای فرهادی | Company rep | Polite, slick. A rival, not evil. |

**Content safety:** all characters are depicted in modest dress (headscarf for women), family-friendly tone, no romance plotline, the company is fictional and generic.

### Chapter structure (Season 1)
| Ch | Location | New chains (examples) | Ending beat |
|---|---|---|---|
| 1 | **عطاری حاج‌بابا** | آب، دانه/درخت، گل، قند | Niloufar decides to stay "for one season" |
| 2 | **نانوایی سنگکی** (عمو اکبر) | گندم، آتش، خمیر | Akbar refuses to sell |
| 3 | **قنادی** (خاله مهین) | شیر، تخم‌مرغ، شیرینی | Mahin reveals Haj-Baba's past |
| 4 | **فرش‌فروشی** (اوستا رحیم) | نخ، رنگ، نقش | The carpet hides a map |
| 5 | **کتاب‌فروشی** (میرزا) | حرف → کلمه → جمله → بیت → غزل → دیوان | Kamran changes sides |
| 6 | **چایخانه** | چای، سماور، قند | The deed is found; bazaar festival |

Each chapter has about 15 restoration tasks, about 30 story beats, and about 60–90 minutes of play for a free player.

---

## 3. Core mechanics

### 3.1 Board
- **7×9 grid** (portrait). Some cells start **locked under dust (خاک)** and unlock by merging next to them. Board space is the classic merge tension.
- **Inventory shelf «طاقچه»:** 4 slots (expandable).

### 3.2 Generators
Tap a generator → it costs **1 energy (⚡)** and spawns a level-1 item of its chain. Generators also merge to level up (higher-level generators drop better items).

| Generator | Spawns | Chapter |
|---|---|---|
| «چاه» (Well) | قطره | 1 |
| «کیسهٔ بذر» (Seed sack) | دانه | 1 |
| «سبد گل» (Flower basket) | غنچه | 1 |
| «کیسهٔ شکر» (Sugar sack) | شکر | 1 |
| **«جعبهٔ پسوند»** (Affix box) | ـدان، ـخانه، ـبان، ـچه، ـستان | 1 (unlocked mid-chapter) |
| «تنور» (Oven) | جرقه → … | 2 |

### 3.3 Tier merge (word ladders)
Drag two identical items together → the next word in the ladder.

| Chain | Ladder |
|---|---|
| آب | قطره → آب → چشمه → جوی → رود → دریا |
| درخت | دانه → جوانه → نهال → درخت → باغ |
| گل | غنچه → گل → دسته‌گل → گلستان |
| قند | شکر → قند → نبات → کله‌قند |
| سخن (Ch5) | حرف → کلمه → جمله → بیت → غزل → دیوان |

The ladders themselves are mini language lessons: the meaning of a word grows as it merges.

### 3.4 Compound merge (the signature mechanic)
Drag **two different** items together. If they form a real Persian compound, they fuse into a **compound item** (higher value, needed for many orders).

| Recipe | Result | Notes |
|---|---|---|
| گل + آب | **گلاب** | |
| گل + قند | **گلقند** | |
| آب + نبات | **آب‌نبات** | |
| گل + ـدان | **گلدان** | affix |
| گل + ـخانه | **گلخانه** | affix |
| باغ + ـبان | **باغبان** | affix |
| باغ + ـچه | **باغچه** | affix |
| چای + ـخانه | **چایخانه** | Ch6 |
| آب + گوشت | **آبگوشت** | Ch2 |
| شیر + برنج | **شیربرنج** | Ch3 |
| شکر + پنیر | **شکرپنیر** | Ch3 |
| گوش + فیل | **گوش‌فیل** | Ch3 (funny favorite) |
| کتاب + ـخانه | **کتابخانه** | Ch5 |
| دفتر + ـچه | **دفترچه** | Ch5 (grandpa's notebook!) |

- **Discovery:** the first time a compound is made → a "new discovery!" celebration, and it's added to the **«دفتر ترکیب‌ها»** (recipe book), where undiscovered recipes show as blurred silhouettes with a hint.
- **Invalid pair:** the items just swap places, with a gentle «این دوتا با هم جور نیستن 🤔». No penalty.
- **Target:** about 15 compounds per chapter, about 90 in Season 1. Recipes are **data** (`recipes.json`), checked against the lexicon.

### 3.5 Riddle orders (the word puzzle)
Customers (neighbors, bazaar visitors) appear at the top with order cards. **The difficulty ramps:**

| Stage | Order shows | Example |
|---|---|---|
| Tutorial (Ch1 start) | The item itself | 🖼️ «گل» ×2 |
| Easy riddle | A plain definition | «جایی که گل‌ها زمستون هم سبز می‌مونن» → **گلخانه** |
| Culture riddle | Iranian life knowledge | «من رو تو شله‌زرد و بستنی سنتی می‌ریزن» → **گلاب** |
| Wordplay riddle | Pun or play on the word | «شیرینی‌ای که اسمش مال گوشِ یه حیوون بزرگه!» → **گوش‌فیل** |
| Poetry riddle (Mirza) | Missing word in a famous line | a verse with a blank whose answer is an item |
| Double order | Two riddles, one bonus | |

- **Answering:** the player produces the item and drags it onto the order. A wrong item → «نه، این نیست!» (no penalty).
- **Hints (coins):**
  1. Reveal the first letter (−20)
  2. Reveal which chain or compound it comes from (−40)
  3. Reveal the answer (−80, or one rewarded ad)
- **No auto-highlighting** of the matching item on the board. Finding it is part of the puzzle. After 3 wrong attempts, a soft glow appears.
- Order rewards: coins, ⭐ stars (story progress), XP; sometimes energy or a generator charge.

### 3.6 Restoration (meta)
Stars complete **restoration tasks** in the current shop («تمیز کردن حجره»، «تعمیر سقف ضربی»، «نصب فانوس»، «رنگ کردن در چوبی»). Each task plays a short **story beat** (2–4 lines of dialogue) and visually transforms the shop scene (before → after). Choosing styles for some tasks (e.g., pick 1 of 3 lantern designs) gives personal touches.

---

## 4. Energy and economy (v1, to be tuned by simulation)

| Resource | Persian | Use |
|---|---|---|
| Energy ⚡ | «انرژی» | Tap generators. **Max 100, +1 every 2 min.** |
| Coins | «سکه» | Hints, shelf slots, buying common items |
| Gems (premium) | «فیروزه» | Energy refills, speeding up timers, special items |
| Stars | «ستاره» | Restoration tasks (story progress) |
| XP / Level | «تجربه» | Level-ups refill energy + give rewards |

**Free-player pacing goal:** about 15–20 minutes of active play per full energy bar. Level-ups and daily rewards make a typical day 2–4 sessions.

**Sinks and sources (initial):**
- Order: +15–80 coins, +1–3 ⭐.
- Daily login calendar: 7-day cycle (energy, coins, a gem on day 7).
- Rewarded ad: +25 ⚡ (max 5/day).
- Energy refill with gems: 100 ⚡ = 20 💎, price rising with repeated refills in a day (standard).

---

## 5. Monetization

| Product | Detail |
|---|---|
| **Gem packs** | 4 tiers, best-value tag on tier 3 |
| **Starter pack** (first 72 h) | Gems + energy + a level-2 generator, the strongest value offer |
| **«قلک»** (Piggy bank) | Fills with gems as you play. Pay once to break it. A proven top performer in merge games. |
| **Event pass «پاس رویداد»** | Free and premium reward tracks per event |
| **Energy bundles** | Time-limited offers when the player runs out (shown at most once per session) |
| **Remove ads** | Removes the (rare) interstitials; rewarded ads stay optional |
| **Rewarded ads (Tapsell)** | Energy, a hint, doubling an order reward |

**Rules:** never block story progress behind payment; no interstitials during the first 3 days; respectful offer frequency.

---

## 6. LiveOps and events

| Event | When | Content |
|---|---|---|
| **خانه‌تکانی نوروز** | Late Esfand → Farvardin | Separate event board, spring chains (سبزه، سمنو، ماهی قرمز), event pass, Haft-Sin riddles |
| **شب یلدا** | Late Azar | Pomegranate/watermelon chains, **Hafez riddles** by Mirza, a Fal-e-Hafez reward wheel (non-gambling: free daily spin, cosmetic rewards) |
| **پاییز / بازگشایی مدارس** | Mehr | Stationery chains (مداد → دفتر → کیف), school riddles |
| **رمضان** | Ramadan | Gentle «سفرهٔ افطار» theme (زولبیا، بامیه، شله‌زرد). No celebratory tone. |
| **محرم** | Muharram | **No event.** Optionally a quiet in-game «نذری» charity theme. Respectful. |
| Weekend mini-events | Bi-weekly | "Complete 20 orders" style races (offline-friendly) |

Season 2 (post-launch): a new city (e.g., Kashan or Yazd) with new chains, recipes, story.

---

## 7. Content pipeline

| Content | Volume (Season 1) | Made by | Your role |
|---|---|---|---|
| Chains (ladders) | ~30 | You + AI propose, lexicon checks | Approve (one sitting per chapter) |
| Compound recipes | ~90 | AI proposes from lexicon compounds; **a script verifies each result is a real word** | Approve list |
| Riddles | ~600 (3–5 per item) | AI drafts in colloquial Persian | **Review** (~20 sec each, ~3–4 h per chapter) |
| Story dialogue | ~180 beats | AI drafts from your outline | Read and edit per chapter |
| Item art | ~350 icons | AI art with a locked style guide | Curate |
| Scenes | 6 shops × before/after, layered | AI art + manual cleanup | Curate |
| Characters | 8 × 4 expressions | AI art | Curate |

**Riddle quality rules (also put in the generator prompt):**
- one clear answer
- colloquial but clean Persian
- no regional insults
- difficulty tag
- at least 1 alternative riddle per item, so repeat orders feel fresh

---

## 8. Art direction

- **Style:** warm, illustrated, soft-shaded 2D with **Persian decorative accents**: tile borders, arabesque frames, turquoise/saffron/pomegranate palette, warm bazaar lighting through skylights.
- **Item design:** a rounded tile with an illustration + **the word in a clear Naskh-style font (Vazirmatn or a licensed display font)**. The word must be readable at small sizes on cheap phones.
- **Style lock:** a reference sheet of about 12 approved images + a prompt template + a fixed palette. Every new asset is generated from the template and compared against the sheet.
- **Animation:** code-driven (scale/bounce/sparkle), so few frame animations are needed. Lottie for celebrations.

---

## 9. UX flow (MVP)

```
First run: short story intro (4 illustrated panels) → tutorial board:
  1) tap the well → «قطره»   2) merge 2× قطره → «آب»
  3) serve the first order (picture order)   4) first compound: گل + آب → گلاب
  5) first riddle order   6) first restoration task (clean the shop sign)
Main screen:
  top: ⚡ energy | 🪙 coins | 💎 gems | ⭐ stars
  orders row (customers with riddle cards)
  board 7×9 + shelf
  bottom: [🏪 حجره (restore)] [📖 دفتر ترکیب‌ها] [🎁 رویداد] [🛒 فروشگاه]
Shop scene: restoration tasks list → story beat → before/after transformation
```

---

## 10. Technical design

- **Flutter + Flame** (board drag/drop, merge animations, particles). Flavors for `bazaar`/`myket`.
- **Fully data-driven:**
  - `items.json` (id, word, chain, tier, art)
  - `chains.json`
  - `recipes.json`
  - `orders.json` (riddles, rewards, difficulty)
  - `story.json` (beats, triggers)
  - `tasks.json`
  - `events/*.json`
- **Validation scripts in CI:**
  - every item word and compound result exists in the lexicon (from `persian-game-kit`)
  - every order is producible with the content available at that point in the chapter
  - no dead ends
- **Economy simulator** (headless): simulates thousands of free-player days to tune energy, drop rates and order flow. Targets: a chapter takes 3–5 days for a free player; no hard stuck states.
- **Saves:** local SQLite with versioned migrations; cloud sync later.
- **Performance:** 60fps on 2GB-RAM phones; sprite atlases; APK under 80MB (art downloads by chapter).

---

## 11. KPIs

| KPI | Soft-launch target |
|---|---|
| Tutorial completion | ≥ 85% |
| D1 / D7 / D30 | ≥ 38% / ≥ 15% / ≥ 6% |
| Sessions/day | ≥ 3 |
| Avg. session length | ≥ 10 min |
| Riddle hint rate | 15–35% (lower = too easy, higher = too hard) |
| Payer conversion | ≥ 2.5% |
| Chapter 1 completion | ≥ 50% of D1 players |

---

## 12. MVP scope and milestones

**MVP:**
- chapters 1–2: about 10 chains, about 30 compounds, about 150 orders/riddles, about 30 restoration tasks, 2 story chapters
- energy, coins, gems
- starter pack, gem packs, piggy bank
- rewarded ads
- daily calendar
- recipe book
- offline mode
- Bazaar + Myket builds

**Phase 2:** chapters 3–6, events (Nowruz first), event pass, cloud saves.

| # | Milestone | Output |
|---|---|---|
| C0 | Content schema + validators + economy simulator | CI-validated data, sim reports |
| C1 | **Web/APK grey-box:** board, generators, tier + compound merge, 10 riddle orders | **Playable link for you**. Test the compound/riddle fun with friends. |
| C2 | Chapter 1 complete (no final art), restoration + story | Test APK |
| C3 | Art pipeline + style lock, chapter 1 art | Beta APK |
| C4 | Chapter 2, monetization, polish | Release candidate |
| C5 | Soft launch on Myket → tune economy | Data |

---

## 13. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Biggest scope of the three games | Data-driven design, simulator, strict MVP (2 chapters), launched third |
| Art volume and consistency | Style lock, word-first item design (icons can be simpler), chapter-based art downloads |
| "Just a merge game with words on it" | Riddles are required for most orders; compounds are the main value source; recipe-book discovery is celebrated |
| Riddle quality (AI Persian) | Every riddle passes your review; alternatives per item; player "this riddle is wrong" report |
| Energy feels greedy | Free-player pacing targets checked in simulation; generous level-up refills |
| Cultural sensitivity | Content rules (§2), event calendar respects religious periods, modest character design |

---

## 14. Open questions for you

1. **Setting:** a fictional bazaar (recommended, avoids real-place issues), or a real one (Tabriz Grand Bazaar is UNESCO-listed and iconic)?
2. **Protagonist:** نیلوفر (female, matching the core audience), or let the player choose a male or female grandchild?
3. **Story tone:** warm family drama with humor (recommended), or more comedy?
