# Persian Word Puzzle Game: Market Research & Design Brainstorm (v0.1)

> Status: first draft for discussion. The numbers come from public sources found in October 2026. Some are old or self-reported; those are flagged **[verify]**.

---

## 1. Executive summary

- **The Persian word-game market is big, but nearly every title in it is the same game.** Amirza has about **24M installs on Cafe Bazaar, rated 4.8 from about 1.9M ratings**. It is a *Wordscapes* clone: a letter wheel that fills a crossword. Most rivals (Baghlava, Fandogh, Kalamatik, Pashmak, Samovar, Kalamchin) use the same loop. Competing head-on with Amirza on that loop means fighting a 24M-install incumbent with your own copy of its product.
- **The proven foreign hits of 2022–2025 have no strong Persian version yet.** These are *NYT Connections*, *Strands*, *Spelling Bee*, *Contexto/Semantle* (meaning-based guessing), and *Solitaire Associations Journey* (the #1 free US game in late 2025, built on word association rather than spelling). The only Persian Wordle I found, *Vajeh*, is a small iOS app. **[verify on Bazaar/Myket before committing]**
- **Iranian players have shown they want social competition.** Quiz of Kings has about 8.3M Bazaar installs and was a cultural phenomenon. No word game has taken over that space yet. The multiplayer word apps that exist (Mollanoghti, Kalemix, Loghatchin, Esm-Famil clones) are small or poorly maintained.
- **Platform reality matters as much as design.** The January 2026 blackout was the longest national shutdown on record (53+ days), and for the first time it also disrupted the *domestic* network. The game must be **offline-first**, host its servers **inside Iran**, and avoid Google and Firebase dependencies.

**Recommended direction (detail in §6):** an **association-first** word game. Players group and sort Persian words by hidden connections rather than spelling them. It wraps the core in a **Persian-culture meta layer** (restoring a Persian garden or historic sites) and adds two things no Persian game combines yet:
1. A **daily puzzle with shareable results** (the Wordle/Connections viral loop, adapted to Telegram, WhatsApp and Instagram stories).
2. **Async 1v1 duels and leagues** (the Quiz of Kings social loop, applied to word puzzles), in phase 2.

Working name idea: **«ربطش چیه؟»** ("What's the connection?"). It's colloquial, memorable, and says what the game is.

---

## 2. Market research

### 2.1 Iranian platform landscape

| Factor | What we know | Implication |
|---|---|---|
| Android stores | Cafe Bazaar is dominant (about 40–50M MAU estimated at its 2025 sale to **Tapsell**). Myket is second. Plazza and Iranapps are smaller. | Launch on **Bazaar + Myket** with separate builds (each store has its own IAP SDK). |
| iOS | Small share (about 11% in an old figure **[verify]**). No App Store payments for Iranians. Sideload stores (Sibapp, Anardoni) are unstable. | Android first. Serve iOS through a **PWA/web build** and later through the App Store for the diaspora. |
| Payments | Bazaar IAP (Poolakey SDK) and Myket IAB work with Shetab cards. Bazaar reportedly pays developers 70%. | IAP is viable. Price in tomans and **re-price regularly because of inflation**. |
| Ads | Tapsell (now Bazaar's owner), Adivery, and others. 77% of Iranian publishers use ads; eCPMs are low. | Rewarded ads are a *supplement*. IAP and subscription should carry revenue. |
| Rating/regulation | ESRA age rating (National Foundation of Computer Games). Bazaar content review. | Plan for ESRA early. Keep content culturally safe (see §8). |
| Sanctions | Unity officially blocks Iran. Google and Firebase services are unreliable. GitHub restrictions have happened before. | Use **Flutter (+Flame) or Godot 4**. Self-host the backend, analytics and crash reporting. |
| Connectivity | 2026 blackout lasted 53+ days and disrupted the domestic network too. VPNs are criminalized. | **Offline-first core.** Servers on Iranian clouds (e.g., ArvanCloud). Sync whenever possible. |

### 2.2 Competitors in Iran

| Game | Type | Scale | Notes |
|---|---|---|---|
| **Amirza** (BrainLadder) | Letter wheel → crossword (Wordscapes-like) | About 24M installs on Bazaar, 4.8★ | The incumbent. Broad audience, family-friendly, strong brand. Weakness: one mechanic, and it's 7+ years old. |
| **Baghlava** | Wheel/crossword | 1M+ active installs (older figure) | Long-time #2. |
| Fandogh, Kalamatik (Ordibehesht Studio), Pashmak, Samovar, Kalamchin, Vajechin | Wheel/word-cookies clones | 100K–500K+ | A crowded, interchangeable tier. |
| **Quiz of Kings** | Social trivia, 1v1 async | About 8.3M installs on Bazaar, 20M+ users claimed (around 2020) | Not a word game, but proves Iranians love **social duels** with friends. |
| Kalemix, Mollanoghti, Loghatchin, Esm-Famil apps | Online word duels / Esm-Famil | Small | They prove demand exists, but execution is weak. Mollanoghti was last updated in 2023. |
| Vajeh (iOS) | Persian Wordle | Very small | Wordle-style is basically unclaimed on Android **[verify]**. |
| Cortex, GolGavZabun, Persian Poetry Crossword | Crossword/trivia | Niche | Poetry is a recognized niche. |

**Takeaway:** spelling-and-wheel games are a red ocean. Association, semantic and daily-shareable mechanics are open water. Social word play is a weakly served segment that clearly has demand.

### 2.3 Global word-game trends worth stealing

| Game | Mechanic | Why it matters for Iran |
|---|---|---|
| **Wordscapes / Words of Wonders** | Wheel → crossword | Already copied (Amirza). One lesson to keep: an analysis by Naavik argues that **LiveOps events, not the core loop, created about a 10× monetization gap** between Wordscapes and Words of Wonders (same core loop). |
| **NYT Connections** | Sort 16 words into 4 hidden groups | Has no Persian equivalent. Persian culture is ideal for it: poets, proverbs, foods, cities, TV shows, wordplay. |
| **Solitaire Associations Journey** (Hitapps, Sept 2025) | Solitaire-style card stacks, sorted by word category | #1 free game in the US within weeks. About 4M active users by Dec 2025. A fresh *hybrid* (cards + words). |
| **NYT Strands** | Theme word search plus a "spangram" | Easy to adapt to Persian letter grids. Good for daily puzzles. |
| **Contexto / Semantle** | Guess a secret word; each guess shows how close it is in *meaning* | Viral and novel. Needs a Persian word embedding model, which is feasible (fastText-fa, ParsBERT). Big wow factor. |
| **Wordle** | 5-letter guess, colored feedback, shareable grid | Created the "share your result" culture. Persian has no written short vowels, which makes it a different and interesting game. |
| **Spelling Bee** | 7-letter honeycomb, required center letter, pangram | Works well with Persian roots and derived words. |
| **Waffle, Letter Boxed** | Swap or route-based letter puzzles | Good secondary modes. |
| **Bookworm Adventures, Letter Quest, Spellspire** | Word-making fuels RPG combat | Could be a Shahnameh-themed spinoff. Higher art cost. |
| **Codenames, Taboo-style party games** | Social word association | Iranian *dorehami* (gathering) culture: Pantomime and Esm-Famil are national pastimes. |

---

## 3. Persian language: design constraints and opportunities

Many competitors get these details wrong. Getting them right is a quality signal Persian players notice immediately.

1. **Letter forms and joining:** Persian letters change shape by position. Some (ا د ذ ر ز ژ و) never join forward. Tiles show isolated forms, but words *in the grid* must render as a properly joined word (proper shaping) after they're solved. Test this on low-end Android fonts.
2. **No short vowels:** «کرم» can be kerm, karam or korom. In a Wordle-style game this creates rich ambiguity, which is a feature. In meaning-based modes it's a risk: always show **a vocalized form or a short definition** after a word is solved.
3. **Normalization:** ی/ي and ک/ك (Persian vs. Arabic code points) must be normalized. Decide whether آ counts as ا; I recommend treating them as separate tiles but accepting either in input. Handle the ZWNJ half-space (نیم‌فاصله) in words like «می‌روم» or «کتاب‌ها». The simplest rule is to **exclude multi-part words from spelling modes** and allow them in association modes.
4. **Word list curation:** blend dictionaries (Dehkhoda, Moein, Amid; check licensing) with **frequency corpora** (e.g., Bijankhan, Hamshahri) so players get *familiar* words. Maintain a blocklist (vulgar, political, insulting). Mark formal vs. colloquial (e.g., «خوشگل») and allow colloquial words in some modes.
5. **Dari and the diaspora:** about 10M+ Dari speakers (Afghanistan) and several million Persian speakers abroad. Diaspora players pay in USD (via Google Play/App Store), which means far higher ARPU. Keep the content mostly pan-Persian, and use region tags later.
6. **Typography:** use the **Vazirmatn** font (OFL license, free). Use Persian digits (۰–۹) in the UI. Build the layout fully RTL from day one.
7. **Cultural content:** Hafez, Saadi, Molavi, Ferdowsi; proverbs (ضرب‌المثل); Persian cuisine; cities and provinces; Iranian films and TV shows (licensing-safe references only); Nowruz traditions. This content is a **moat** a foreign studio can't copy.

---

## 4. Target players (hypotheses to validate)

| Persona | Description | What they want |
|---|---|---|
| **«مریم» — the relaxer (core)** | 25–55, often a woman, current Amirza player, plays 10–20 min at night or on her commute | Calm progression, a feeling of being clever, no stress, something beautiful |
| **«آرش» — the competitor** | 16–35, played Quiz of Kings | Beating friends, leaderboards, bragging rights |
| **«بابا/مامان» — the family player** | Parents and grandparents playing with kids | Educational value, clean content, large fonts |
| **«سارا» — the diaspora player** | Persian speaker in Germany, Canada or the US | Connection to the language and culture; will pay in USD |

---

## 5. Design pillars

1. **"Feel smart in Persian."** Every solve should create a small *aha*, and celebrate the richness of the language.
2. **Fresh, not another Amirza.** The core mechanic must be visibly different in a 15-second store video.
3. **Iranian to the bone.** Culture and humor as content, not just translation.
4. **Works on bad days.** Fully offline, small download (<60MB), smooth on a 2GB-RAM phone.
5. **Fair monetization.** No pay-to-win in competitive modes. Generous for players who don't pay.

---

## 6. Concept options

### Concept A — «ربطش چیه؟» Association Saga ⭐ recommended core
- **Core loop:** each level shows 8–20 word cards. The player sorts them into hidden categories in solitaire-style stacks, with limited moves (Solitaire Associations, simplified). Or they pick groups of four (Connections). Category names reveal when complete: «چیزهایی که در سفره هفت‌سین هست», «شاعران شیرازی», «… + خانه» (کتابخانه، آشپزخانه).
- **Red herrings** create the fun: «سیب» could be a haft-sin item, a fruit, or part of «سیب‌زمینی».
- **Why it wins:** novel in Iran, ties into culture, mostly language-independent (no spelling issues), and writers can produce content cheaply.
- **Risk:** puzzles depend on content quality, so it needs an editorial pipeline (§9).

### Concept B — Daily puzzle hub (the NYT Games model)
- Every day: **Vajeh** (Wordle), **Rabt** (Connections), **Kandoo** (Spelling Bee), **Garm-o-Sard** (Contexto), **Rishe** (Strands).
- **Shareable emoji result cards** sized for Telegram, WhatsApp and Instagram stories, with Persian date and number: «ربطش چیه؟ #۲۱۴ 🟩🟨🟪🟦».
- Monetization: a subscription for the archive and extra puzzles. Few ads.
- **Risk:** sessions are short. Best as a *feature* inside A, not a standalone app (unless you want a cheap first project to test virality).

### Concept C — Social word duels (Quiz of Kings for words)
- Async 1v1: three rounds of short mixed word mini-games (Wordle race, Boggle grid, association speed round), plus friends, leagues and clans.
- **Risk:** needs servers and moderation, and depends on connectivity. Best as **phase 2**, once there's an audience.

### Concept D — Shahnameh word RPG (spinoff idea)
- Build words to attack *divs* (demons) in a journey with Rostam (Bookworm Adventures style).
- **Risk:** high art cost, niche. Keep as a future title.

### Recommendation: A as the core, B's daily puzzle inside A from launch, C in phase 2
```
+--------------------------------------------------------------+
|  Main progression: Association Saga levels (Concept A)        |
|    -> earn «گل» (flowers) -> restore a Persian garden / sites |
|  Daily tab: Rabt + Vajeh of the day, shareable cards (B)      |
|  Events: Nowruz, Yalda (Hafez), Sizdah-bedar, school season   |
|  Phase 2: Duels & leagues with friends (C)                    |
+--------------------------------------------------------------+
```

---

## 7. Meta layer and progression ideas

- **Persian garden restoration (باغ ایرانی):** solving levels earns stars or flowers. Spend them to rebuild a garden step by step (fountain, cypress trees, pavilion). Players can choose styles: Fin garden in Kashan, Eram garden in Shiraz. This is the proven Homescapes-style "renovation" meta, but rooted in Iranian culture and beautiful in screenshots.
- **Alternative meta: a journey across Iran** (Words of Wonders style). Each chapter is a city with its own word themes (Yazd → desert, qanat, badgir). This doubles as subtle tourism and cultural content.
- **Collections:** collect "proverb cards" or "poet cards" for completing themed groups.
- **Mastery:** the dictionary of words you've solved (with meanings) as a personal "Ganjine" (treasure chest). Parents love seeing it.

---

## 8. Content, culture and regulatory safety

- Avoid politics, religious satire, ethnic jokes (e.g., Turk or Lor jokes), and sexual content. Be careful with music and imagery of women (Bazaar/ESRA review). Keep emotional sensitivity during Muharram and Ramadan: tone down celebratory events, offer optional Ramadan-themed puzzles.
- No open chat in multiplayer. Use preset stickers and phrases instead. This avoids moderation and regulatory problems entirely.
- Avoid loot-box or gambling mechanics (store review risk).
- Include the regional diversity of Iran (Azeri, Kurdish, Gilaki, Baluchi foods and places) so players across the country see themselves in the game.

---

## 9. Content pipeline (the real moat)

1. **Category database:** words × categories × difficulty × tags (culture, food, poetry …).
2. **AI-assisted drafting:** an LLM proposes groups and red herrings. **Persian human editors** review everything, because quality and cultural correctness are non-negotiable.
3. **Auto-tuning:** track solve rate, mistakes, hint use and quit rate per level. Rebalance difficulty and reorder levels with data.
4. **Writer community (later):** players submit their own Rabt puzzles, and the best are featured. This is free content plus community engagement.

---

## 10. Monetization (Iran-specific)

| Lever | Detail |
|---|---|
| Soft currency (سکه) | Hints: reveal a card, reveal a category name, shuffle, undo, extra moves |
| IAP packs | Low toman price points. **Re-price quarterly** for inflation. Offer a starter pack. |
| Remove ads | One-time purchase. Very popular in Iran. |
| VIP subscription (monthly) | No ads, daily archive, weekly free hints, exclusive garden decorations |
| Season pass | Event-themed (Nowruz pass) with cosmetic rewards |
| Rewarded ads (Tapsell/Adivery) | Optional only: "watch for a hint" or "double your reward". Never forced interstitials during early levels. |
| Diaspora (Google Play/App Store) | USD pricing. Potentially 10–20× the ARPU of the Iranian market. |

---

## 11. Technical recommendations

- **Engine:** **Flutter + Flame** (strong RTL/Persian text, one codebase for Android, iOS and Web/PWA, small builds, no sanctions issues). Godot 4 is an alternative. Avoid Unity (it officially blocks Iran).
- **Offline-first:** levels are bundled or downloaded in packs. Progress syncs when the network is available.
- **Backend:** hosted in Iran (ArvanCloud or similar). Simple stack: Go/Node + Postgres + Redis. A mirror abroad for diaspora users.
- **Login:** guest by default. Optional phone OTP (Iranian SMS provider) or Bazaar login. **No Google sign-in or Firebase dependency.**
- **Analytics and crash reporting:** self-hosted (PostHog/Matomo, Sentry/GlitchTip).
- **Builds:** separate flavors for Bazaar (Poolakey), Myket (IAB) and Google Play.
- **Performance target:** smooth at 60fps on 2GB-RAM Android, APK under 60MB.

---

## 12. Go-to-market

- **Pre-launch:** a free **web version of the daily Rabt puzzle** to test virality cheaply and build a Telegram/Instagram following before the app exists.
- **Soft launch on Myket** (smaller audience, so mistakes cost less), then a full launch on Bazaar with an ask for **editorial featuring**.
- **Launch timing:** **Nowruz** or **Yalda** (Hafez night) is the ideal launch window, with a themed event.
- **Channels:** Bazaar search ads, Instagram micro-influencers (language teachers, book pages, comedians), Telegram channels, domestic platforms (Rubika, Eitaa) to be visible during shutdowns.
- **Viral loop:** daily shareable result cards, and invite-a-friend for a duel in phase 2.

---

## 13. KPIs (targets for soft launch)

| Metric | Target |
|---|---|
| D1 / D7 / D30 retention | ≥ 40% / ≥ 18% / ≥ 8% |
| Average sessions per day | ≥ 2.5 |
| Share rate on daily puzzle | ≥ 10% of completers |
| Store rating | ≥ 4.6 |
| Payer conversion | ≥ 2% (Iran), ≥ 4% (diaspora) |

---

## 14. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Amirza (or others) clones the mechanic | Move fast. Build the **content moat** and community. Lead with brand and quality. |
| Internet shutdowns | Offline-first design and domestic hosting |
| Regulatory or store rejection | Plan ESRA early. Use a content safety checklist. Consider a local publisher. |
| Inflation erodes revenue | Regular re-pricing, subscriptions, diaspora revenue |
| Content quality is inconsistent | Editorial review, data-driven tuning |
| Small team overreach | Strict MVP scope (below) |

---

## 15. Proposed roadmap

| Phase | Duration | Scope |
|---|---|---|
| 0. Validation | 3–4 weeks | Paper/web prototypes of 3 core mechanics (Connections-style, Solitaire-associations, Persian Wordle), each tested with 30–50 Persian players. Pick the winner. Start the word and category database. |
| 1. MVP | about 3 months | 300 levels, garden meta (1 garden), daily puzzle + share card, hints/coins, rewarded ads, remove-ads IAP, offline mode, Bazaar + Myket builds |
| 2. Soft launch | 1–2 months | Myket only. Tune difficulty and retention. Then launch on Bazaar at Nowruz or Yalda. |
| 3. Growth | ongoing | LiveOps events calendar, VIP subscription, async duels and leagues, diaspora release (Play/App Store), PWA for iOS users in Iran |

---

## 16. Open questions for you

See the chat. Answers will shape v0.2 of this document (detailed mechanics spec, level design rules, economy model, art direction).

---

### Sources
- Amirza on Cafe Bazaar: https://cafebazaar.ir/app/com.BrainLadder.Amirza?l=en
- Amirza 10M installs (IDEA agency): https://ideaagency.net/amirza-a-game-with-more-than-10-million-installs/
- Persian word game lists (Digikala Mag, Digiato, Gamotionart): https://www.digikala.com/mag/free-mobile-single-player-word-games/ · https://gamotionart.com/best-word-games/
- Quiz of Kings on Bazaar: https://cafebazaar.ir/app/co.palang.QuizOfKings · Mizan: https://www.mizanonline.ir/fa/news/614200/
- Multiplayer word apps: https://cafebazaar.ir/app/com.kelemix.maa · https://cafebazaar.ir/app/com.greendevelopers.wordsonlinegame
- Vajeh (Persian Wordle, iOS): https://apps.apple.com/app/id6759496832
- Iran game market overview: https://allcorrectgames.com/insights/iran/ · https://42matters.com/iran-mobile-gaming-statistics
- Tapsell acquires Cafe Bazaar: https://www.intellinews.com/iran-s-hezardastan-sells-android-app-store-caf-bazaar-to-local-tapsell-362903/
- Bazaar 70% developer share: https://www.azernews.az/region/118470.html
- 2026 internet blackout: https://en.wikipedia.org/wiki/2026_Internet_blackout_in_Iran · https://www.chathamhouse.org/2026/01/irans-internet-shutdown-signals-new-stage-digital-isolation · https://filter.watch/english/2026/01/16/investigative-report-technical-breakdown-of-the-january-2026-shutdown/
- Unity sanctions: https://support.unity.com/hc/en-us/articles/205144693
- ESRA: https://www.gamedeveloper.com/game-platforms/iran-sets-up-esra-game-ratings-esrb-denies-link · https://www.wamda.com/2016/05/iran-gaming-market-an-overview
- Solitaire Associations Journey: https://sensortower.com/blog/2025-q4-unified-top-5-solitaire-games-revenue-us-600abc3f241bc16eb850508a · https://foxdata.com/en/blogs/when-word-meets-cards-word-solitaire-associations-climbs-to-us-app-store-top-1/
- Wordscapes LiveOps analysis (Naavik): https://naavik.co/f2p-mobile/worldscapes-peoplefun/
- Word game ad/IAP mix: https://felixbraberg.substack.com/p/the-mobile-ad-monetization-newsletter-d5a
- Puzzle market 2026: https://respawn.outlookindia.com/gaming/gaming-news/top-mobile-puzzle-games-ruling-the-global-grossing-charts-in-2026
