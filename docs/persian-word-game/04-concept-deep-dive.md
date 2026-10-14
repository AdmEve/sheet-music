# Concept Deep Dive: Choosing the Core Game

> Purpose: pick **one** core gameplay for the project, based on evidence rather than ideas alone.
> Constraints: solo owner, part-time; AI agents write all code; AI generates most content; goal is **revenue**; Iran first (Bazaar/Myket); must **not** overlap with a friend's association/grouping game. The daily share loop and garden meta are free to use.

---

## 1. What the market tells us (new facts from this round)

| Finding | Source | So what |
|---|---|---|
| **Amirza:** 15M active installs, **7M yearly actives, 3M+ MAU, mostly women**, 41M cumulative downloads (1402 report, prepared with Tapsell) | Zoomit, Digiato | The core Persian word audience is huge, female-skewed and ad-monetized. That audience is reachable, but not with another wheel game. |
| Iran's active gamers **fell from 34M (1400) to 29M (1403)**. 94.5% play on mobile. Average age is 29. **More than half of devices are budget phones.** | Zoomit / NFCG | Build light. Our game competes for attention with foreign games, not only Persian ones. |
| **Domestic games' share of spending fell from about 40% to about 6%.** Most successful Iranian titles were made **before 1400**. | Zoomit / NFCG | The domestic top charts are **old and stagnant**. A genuinely new, high-quality game has room. |
| Bazaar: **50M MAU** (1403). Front-page games estimated at **15–20B toman/month** (an unofficial estimate) | Digiato, Manataz | Front-page placement on Bazaar is where the money is. Editorial featuring matters a lot. |
| **Quiz of Kings:** about 8.3M Bazaar installs, built on async 1v1 | Bazaar | Iranians pay for and stay with **social competition**. |
| Persian party word games already exist: «جاسوس» (260K+ installs), many Esm-Famil apps | Bazaar | That space is crowded. Not a target. |
| Globally, classic word subgenres are **flat or declining**. Growth comes from **hybrids and new niches** (Sort, Screw, Block; Solitaire Associations) | Naavik, AppMagic | **Hybridize.** Don't clone a classic. |
| **Words With Friends:** about **$43M gross in 2025**, still. **NYT Crossplay** (Jan 2026, F2P Scrabble-like duel) reached **1M downloads in about 2 weeks** | PocketGamer.biz | Async board word duels are a durable, proven money genre, and one with a new wave right now. |
| **No Persian Scrabble-style duel** found on any store | Search | An open, proven mechanic in Persian. |
| Word Balatro-likes are a **2025–26 PC trend** (Word Play, OMG Words, Wordatro, Spellatro, Beyond Words). **No strong mobile one** found | Steam | A new genre with a mobile gap globally, and an empty space in Iran. |
| **Merge-2** (Travel Town, Gossip Harbor) is one of the most lucrative casual models, with a female 25–50 audience | Industry common knowledge **[verify specific numbers]** | Matches Amirza's demographic exactly. |

---

## 2. Scoring method

| Criterion | Weight | What a 5 means |
|---|---|---|
| **Revenue potential** | 25% | The mechanic monetizes well globally *and* its model fits Iranian payment behavior |
| **Differentiation & defensibility** | 20% | Nothing like it in Persian, and it can't be copied by simple translation |
| **Feasibility (solo + AI)** | 20% | Content is systemic or cheap, art is modest, no heavy server |
| **Retention depth** | 15% | Months of play, LiveOps-ready |
| **Reach** | 10% | Appeals to the broad casual Persian audience |
| **Resilience** | 10% | Works offline. Safe in review and regulation. |

Hard filters: word-based, no association/grouping core, playable offline (at least partly).

---

## 3. The long list: 16 mechanics, with the reason each was cut or kept

| # | Mechanic | Verdict | Reason |
|---|---|---|---|
| 1 | Letter wheel → crossword | ❌ | Amirza (7M yearly actives) owns it |
| 2 | Association / Connections / word sort | ❌ | Overlaps the friend's game |
| 3 | Persian Wordle (daily) | ➖ feature | Weak monetization on its own. Keep as a daily side mode. |
| 4 | Contexto (semantic hot/cold) | ➖ feature | Novel but thin. Good as a daily/event mode. |
| 5 | Themed word search (Strands) | ❌ | Low differentiation, low ARPU |
| 6 | Classic crossword (جدول) | ❌ | Older audience, low ARPU, content-heavy |
| 7 | Imposter / spy party game | ❌ | Already exists in Persian, very low ARPU |
| 8 | Esm-Famil online | ❌ | Saturated |
| 9 | Word + block-blast hybrid | ❌ | Ad-dependent, and Iranian eCPMs are low |
| 10 | Word alchemy (Infinite Craft / Little Alchemy) | ➖ | Viral but weak monetization. **Its "compound merge" idea is reused in C.** |
| 11 | Narrative detective word puzzles | ❌ | Huge writing and review load for a solo owner |
| 12 | Poetry (Mosha'ere, Ganjoor) | ❌ | Narrow, older audience. Kept as flavor content. |
| 13 | Kids' Persian alphabet game | ❌ | A different business (parents, education) |
| 14 | **Word roguelite (Haft Khan)** | ✅ finalist A | |
| 15 | **Async board word duel (Persian Crossplay)** | ✅ finalist B | |
| 16 | **Word-riddle merge-2 with a story (Bazaarche)** | ✅ finalist C | |

---

## 4. Scorecard

| | Revenue (25) | Differentiation (20) | Feasibility (20) | Retention (15) | Reach (10) | Resilience (10) | **Weighted** |
|---|---|---|---|---|---|---|---|
| **A. هفت‌خوان** word roguelite | 4 | **5** | **5** | **5** | 3 | **5** | **4.55** |
| **C. بازارچه** riddle-merge | **5** | 4 | 2.5 | 4 | **5** | **5** | **4.15** |
| **B. تخته‌کلمه** async duel | 4 | 4 | 3 | **5** | 4 | 2 | **3.75** |
| Contexto/Wordle daily hub | 2 | 4 | 4 | 3 | 4 | 4 | 3.35 |
| Word block-blast | 2.5 | 3 | 4 | 3 | 4 | 5 | 3.38 |
| Mosha'ere | 2 | 4 | 4 | 3 | 2 | 5 | 3.25 |

The three finalists represent **three different bets**:
- **A** is the *novelty + feasibility* bet.
- **B** is the *proven social revenue* bet.
- **C** is the *biggest casual market* bet.

---

## 5. Finalist A: «هفت‌خوان» (Persian Word Roguelite)

*Full design: [03-alt-concept-haft-khan.md](03-alt-concept-haft-khan.md). This is the summary and the case for it.*

**One line:** spell Persian words from a letter bag to defeat the 7 bosses of Rostam's Seven Labours. Boss curses bend the rules (e.g., dotted letters banned), and talismans create combos.

**A moment of play:** Div Arzhang bans dotted letters. You hold «ب ا ر ا ن د س ل». «باران» is now illegal. You find «سالار» (no dots) with the «قلم بی‌نقطه» talisman (×3 for dotless words), and the hit lands for 3× damage. *That feeling of outsmarting the rules in your own alphabet is the hook.*

**Why it's fun:**
- Every run is different.
- Combos feel powerful.
- Persian script is the puzzle.
- Sessions are short (2–3 min per fight) but chain into "one more run".

**Why it makes money:**
- Deep engagement (Balatro made about $4M on mobile in two months as a *premium* game; the Steam wave proves the appetite).
- Expansion campaigns from the Shahnameh are high-value IAP that fit Iranian taste for story.
- Hero packs, cosmetics, rewarded revives.
- Expansions also keep players returning.

**Moat:** rules built on Persian orthography plus Shahnameh IP. A translated foreign game can't replicate it.

**Solo feasibility: the best of the three.**
- The dictionary is the content, so there's no weekly puzzle review.
- AI agents can balance it with a headless simulator running 100k bot runs.
- Art: about 80 miniature-style assets.
- No server needed.

**Key risks:**
1. Complexity for casual players (mitigated by story mode, slow unlocks and a best-word helper).
2. Roguelite appetite in Iran is unproven, so test it with the prototype.

**Prototype kill criteria (web, no art, 30 testers):**
- **kill** if fewer than 40% voluntarily start a second run,
- or median session is under 8 min,
- or more than 30% say "confusing" after fight 4.

---

## 6. Finalist B: «تخته‌کلمه» (Persian Async Board Word Duel)

**One line:** Words With Friends / NYT Crossplay, rebuilt for Persian. Play turn-based word duels on a board with friends, Quiz-of-Kings-style.

**Core loop:**
- An 11×11 board (phone-friendly). Words read right-to-left and top-to-bottom.
- 7-tile rack with a Persian letter distribution, and bonus squares.
- **Persian magic:** tiles **visually join** into properly shaped words as you place them (no foreign game can do this). Bonus squares are designed around Persian patterns.
- Async turns (24h), up to 20 parallel games, plus a 5-minute **blitz** mode.
- **Strong AI bots** at 5 levels for offline play, cold start and practice. Bot moves come from dictionary search, so no LLM is needed.
- Social without chat: invite links for Telegram/WhatsApp, weekly leagues, and preset Persian reactions («دمت گرم»، «شانسی بود! 😏»).

**Why it makes money:**
- The model is proven over 15 years (WWF: still about $43M per year).
- Revenue comes from ads between turns (high frequency), boosts (tile swap, "best move" radar), board themes (carpet, kashi, khatam), and a no-ads VIP.
- The social obligation of "your turn!" drives daily returns. Quiz of Kings shows Iranians respond to exactly this.

**Moat:**
- Medium. The mechanic is well known and translatable.
- The defense is being first, the network effect (friends play where friends are), and quality (the Persian letter shaping, a well-curated dictionary).

**Solo feasibility: medium.**
- Needs an **Iran-hosted backend** (accounts, matchmaking, turn sync, push notifications without Firebase, anti-cheat).
- The client is simple. The art is light.
- It runs as a live service from day one: server costs plus on-call duty for a part-timer.

**Key risks:**
1. **Online dependency**: the Jan 2026 blackout disrupted even the domestic network. Bots soften this, but the core value is social.
2. **Cold start**: a duel game with few players feels dead.
3. Cheaters using anagram helpers.
4. Iranian ad eCPMs are low, so the ad-heavy WWF model earns less here.
5. Trade dress: avoid the "Scrabble" name and its board layout.

**Prototype kill criteria:**
- **kill** if testers playing with friends average fewer than 3 games/day,
- or D7 is under 25% among invited pairs.

---

## 7. Finalist C: «بازارچه» (Word-Riddle Merge-2 with a Family Story)

**One line:** a merge-2 game where Persian words combine into new words, customers order with riddles, and you restore your grandfather's shop in an old Iranian bazaar.

**Core loop:**
1. **Generators** (چاه، کیسه بذر، تنور) spawn base word tiles.
2. **Tier merge:** two of the same word combine into the next step on a word ladder. «آب + آب → چشمه → جوی → رود → دریا». «دانه → جوانه → نهال → درخت → باغ».
3. **Compound merge** (the new twist, from word alchemy): drag *different* words together to form Persian compounds. «گل + آب → گلاب», «کتاب + خانه → کتابخانه». Players discover these, and a "recipe book" fills up.
4. **Riddle orders:** customers don't show the item. They give a clue. *«چیزی که از گل می‌گیرن و روی شله‌زرد می‌ریزن»* → you must work out «گلاب» and craft it. **This is the real word puzzle.**
5. Filling orders earns coins and stars. Stars renovate the shop, then the bazaar, and advance an **Iranian family-drama story**. Story-driven merge games (Gossip Harbor) are top earners, and Iranian TV-series culture fits perfectly.

**Why it makes money:**
- **Energy-based merge-2** is the most lucrative casual model.
- Players buy energy, generator boosts, event passes and decorations.
- Its audience (women 25–50) **is exactly Amirza's audience**, who are proven Persian word players.
- It isn't ad-dependent.

**Moat:** strong. Persian compounds, riddles in colloquial Persian, the bazaar setting and the drama make a translated copy impossible.

**Solo feasibility: the weakest.**
- Merge-2 is a complex genre: board management, generators, energy economy, orders, storyline, decoration, events.
- It needs **many art assets** (300–500 item icons plus scenes), even with AI art.
- Riddles are AI-written content that needs your review (but they are small, and errors are low-stakes).
- Economy tuning is hard, though simulators help.
- Realistically 2× the build time of A.

**Key risks:**
1. Scope and art burden for a part-time solo owner.
2. Players may treat it as "a merge game with words on it" if the riddles aren't central. The design must keep word thinking necessary.
3. The energy economy can feel greedy if badly tuned.

**Prototype kill criteria:**
- **kill** if testers can't explain the compound merge after 5 minutes,
- or riddle-solve satisfaction is under 4/5.

---

## 8. Head-to-head summary

| | A. هفت‌خوان | B. تخته‌کلمه | C. بازارچه |
|---|---|---|---|
| Player fantasy | "I outsmart demons with my Persian" | "I beat my friends" | "I save my family's shop" |
| Proof abroad | Balatro + 2025–26 Steam wave | WWF, Crossplay | Gossip Harbor, Travel Town |
| Exists in Persian? | No | No | No |
| Audience | Casual-plus, 16–40 | Broad, social | **Broadest**: women 25–50 (Amirza's audience) |
| Monetization model | IAP expansions + cosmetics + rewarded ads | Ads + boosts + VIP | **Energy IAP** + passes |
| Weekly human workload | ~0 | Ops/on-call | Riddle review + art curation |
| Server needed | No | **Yes, from day 1** | No |
| Shutdown-proof | ✅ | ⚠️ | ✅ |
| Build time to MVP (AI coding, part-time owner) | **~4–5 months** | ~5–6 months + ops | ~8–10 months |
| Biggest risk | Complexity for casual players | Cold start + online dependency | Scope and art |

---

## 9. Recommendation

**First choice: A, «هفت‌خوان».** It has the best overall score and suits *this team* best:
- The content is generated systemically, so you never become a puzzle-review bottleneck.
- No server, and shutdown-proof.
- A genre nobody has in Persian, and few have on mobile anywhere, protected by a moat built from Persian script.
- **Future upside:** B's social layer can be added later as **async daily-seed duels** («با دوستت خوان امروز رو برو»). That captures some of the Quiz of Kings effect without making the whole game depend on servers.

**When to choose C instead:** if you can raise a small art budget and accept about 8–10 months. C has the highest revenue ceiling and reaches Amirza's exact audience. A reasonable studio path: **ship A first, use its revenue and audience to build C as game #2.**

**B is the weakest fit** for a part-time solo owner in Iran's connectivity situation, despite its proven model.

### Optional: a prototype bake-off before committing (about 3 weeks)
AI agents build rough, art-free **web prototypes of A and B's core** (C is too expensive to prototype well). You send them to 30 Persian players and decide with the kill criteria above. This turns the most important decision of the project into a measured one.

---

### Sources
- Amirza 1402 report: [Zoomit](https://www.zoomit.ir/tech-iran/426916-amirza-mobile-game-annual-report/) · [Digiato](https://digiato.com/iran-technology-news/amirza-game-1402-report)
- Iran gamers and domestic share: [Zoomit: 70K billion toman market, 6% domestic](https://www.zoomit.ir/tech-iran/452199-gamers-in-iran-report-1402/) · [Zoomit: 29M active gamers](https://www.zoomit.ir/iran-news/467247-iran-video-game-market-1403-report/) · [Zoomit: share drop 40%→6%](https://www.zoomit.ir/iran-news/457034-iran-video-games-market-share-drop/)
- Bazaar 1403: [Zoomg](https://www.zoomg.ir/game-articles/409458-bazaar-report-1403/) · [Digiato](https://digiato.com/articles/bazaar-report-for-1403)
- Iranian top-grossing estimate (unofficial): [Manataz](https://iranianmanataz.com/top-grossing-iranian-mobile-games/)
- Persian party/word apps: [جاسوس بازی دورهمی](https://cafebazaar.ir/app/ir.asaresoft.jasos) · [اسم فامیل آنلاین](https://cafebazaar.ir/app/mbm.esmfamilonline)
- Crossplay & Words With Friends: [PocketGamer.biz](https://www.pocketgamer.biz/nyt-games-multiplayer-word-game-crossplay-surpasses-one-million-downloads) · [ABC News](https://abcnews.go.com/Business/wireStory/new-york-times-2-player-game-evolving-business-129417985)
- Puzzle subgenre trends: [Naavik](https://naavik.co/digest/how-niche-subgenres-are-reshaping-the-mobile-puzzle-market/) · [AppMagic monthly](https://gamedevreports.substack.com/p/appmagic-top-mobile-games-by-revenue-8ae)
- Balatro mobile: [Shacknews](https://shacknews.com/article/142371/balatro-mobile-4-million) · word Balatro-likes: [Next Fest roundup](https://nosmallgames.com/2025/06/i-tried-every-balatro-like-game-i-could-find-in-steam-next-fest-again/)
- Earlier sources: see [01-brainstorm.md](01-brainstorm.md) and [03-alt-concept-haft-khan.md](03-alt-concept-haft-khan.md).
