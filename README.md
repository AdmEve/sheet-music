# محله‌ی ما — Mahalle-ye Ma

A Persian merge game for Android. Merge Persian items (tea glasses → golden samovar,
wheat → sangak breakfast spread, seeds → rosewater sprinkler…) to fill the neighbours'
orders, earn stars, and restore an old Tehran alley that a developer wants to demolish.
Each restoration plays the next episode of the neighbourhood drama: season 1 saves the
alley (5 episodes), season 2 «عروسی» follows Narges' wedding, season 3 «نامه‌ای از اون ور
دنیا» brings Uncle Bahman home, season 4 «یه نفر تو راهه» waits for the baby and season 5
«طرح تعریض خیابان» saves the alley from the bulldozers for good and season 6 «خواستگار تبریزی»
takes the neighbours to Tabriz for Shirin's engagement; in season 7 «ارثیه‌ی آقا مرتضی» the
stingy grocer inherits a Qajar garden-house and opens it to everyone; season 8 «رادیو محله» puts
Khale Mahin on the radio and the alley in a football final; season 9 «سفر شمال» takes everyone
to the Caspian for Golab's wish; season 10 «اصفهان» follows Kaveh's job offer to Isfahan and
ends with a restoration school in the alley; season 11 «ثبت جهانی» takes the alley to UNESCO
season 12 «تولد ننه‌گلاب» throws Golab a surprise party and season 13 «عروسی شیرین و آیدین» marries
Shirin and Aydin with a Tabrizi henna night and Morteza's old Paykan as the wedding car; season 14
«کاروانسرا» restores a desert caravanserai near Kashan into an eco-lodge; season 15 «رفیق یزدی»
finds Haj-Baba's old friend, a Yazdi qanat-digger (5 episodes each).

- Fully **offline**; progress is saved on the phone.
- Monetization through store in-app billing (two Android flavors: **Cafe Bazaar** via
  Poolakey, **Myket** via Myket billing) and opt-in **Tapsell rewarded videos**. All domestic,
  so they keep working during international internet cuts.
- Why this game: see [`PROGRESS.md`](PROGRESS.md) and the market map in
  [`docs/market-research.md`](docs/market-research.md).

## Play the latest build

Persian step-by-step launch checklist: [`docs/LAUNCH-fa.md`](docs/LAUNCH-fa.md).

Every push builds the game on GitHub Actions. Open the **android-latest** release on your
phone, download `Mahalle.apk` and install it.

## Develop

```bash
npm install
npm run dev          # browser preview (use phone-sized devtools viewport)
npm test             # game rules + story tests
npm run build        # production web build into dist/
npx cap sync android # copy dist/ into the Android project
```

Review tools (need Playwright's Chromium):

```bash
npx tsx scripts/gallery.ts out.png     # every item drawing
npx tsx scripts/portraits.ts out.png   # cast portraits
npx tsx scripts/scenes.ts out.png      # every place before/after
npx tsx scripts/play.ts outdir         # automated playthrough with screenshots (after build)
npx tsx scripts/android-assets.ts      # regenerate launcher icons + splash
```

Code map:

| Path | What |
|---|---|
| `src/game/items.ts` | Item chains, generators, values |
| `src/game/model.ts` | All game rules (board, merge, energy, orders, levels, daily gift, saves) |
| `src/game/progress.ts` | Story progression (places, tasks) |
| `src/story/story.ts` | Cast, places, tasks and all dialogue (Persian) |
| `src/art/` | Hand-built SVG art: items, portraits, place scenes, icons |
| `src/ui/` | Screens, animations, sound, modals |
| `src/platform/` | Save storage, haptics, Bazaar billing, Tapsell ads |
| `android/` | Capacitor Android project. Store billing plugin per flavor: `app/src/bazaar/…/StorePlugin.kt`, `app/src/myket/…/StorePlugin.kt`; Tapsell plugin in `app/src/main/…` |

## Publishing on Cafe Bazaar — one-time setup

1. **Developer account** on [pishkhan.cafebazaar.ir](https://pishkhan.cafebazaar.ir).
2. **Create the app** with package name `com.admeve.mahalle`.
3. **In-app products** (Pishkhan → In-app billing), all *consumable*:

   | SKU | Contents | Suggested price |
   |---|---|---|
   | `starter_pack` | 120 gems + 150 energy + golden chest (one-time offer) | 49,000 T |
   | `gems_small` | 60 gems | 29,000 T |
   | `gems_medium` | 160 gems | 69,000 T |
   | `gems_large` | 420 gems | 149,000 T |
   | `gems_huge` | 1000 gems | 299,000 T |
   | `offer_energy` | 250 energy + 20 gems (shown when energy runs out) | 19,000 T |
   | `offer_chapter` | 80 gems + 100 energy + golden chest (24 h after each episode) | 49,000 T |
   | `piggy_bank` | breaks the piggy bank: all gems saved in it (60–150) | 39,000 T |
   | `pass_premium` | this month's golden season-pass track | 79,000 T |

   The game shows the price Bazaar returns, so you can change prices in Pishkhan any time.
4. Copy the app's **RSA public key** (Pishkhan → In-app billing).
5. **Tapsell** (optional): create an app and a *rewarded video* zone on
   [tapsell.ir](https://tapsell.ir); note the app key and zone id.
6. **Release signing key**: create it once and keep it safe forever. Bazaar only accepts
   updates signed with the same key.

   ```bash
   keytool -genkeypair -v -keystore mahalle-release.jks -alias mahalle -keyalg RSA -keysize 4096 -validity 36500
   base64 -w0 mahalle-release.jks > mahalle-release.jks.b64
   ```
7. In GitHub → repo **Settings → Secrets and variables → Actions**, add:

   | Secret | Value |
   |---|---|
   | `MAHALLE_KEYSTORE_BASE64` | contents of `mahalle-release.jks.b64` |
   | `MAHALLE_KEYSTORE_PASSWORD` | keystore password |
   | `MAHALLE_KEY_ALIAS` | `mahalle` |
   | `MAHALLE_KEY_PASSWORD` | key password |
   | `BAZAAR_RSA_KEY` | Bazaar RSA key from step 4 |
   | `MYKET_RSA_KEY` | Myket RSA key (optional, for the Myket build) |
   | `TAPSELL_APP_KEY` | Tapsell app key (optional) |
   | `TAPSELL_REWARDED_ZONE` | Tapsell rewarded zone id (optional) |

8. Push (or run the workflow manually). Upload `Mahalle.apk` from the release to Pishkhan
   (and `Mahalle-myket.apk` to the Myket developer panel),
   and use the texts and screenshots in [`docs/store-listing.md`](docs/store-listing.md).

Without the signing secrets, CI signs with a debug key. That's fine for trying the game on
a phone, but such a build must not be uploaded to Bazaar.
