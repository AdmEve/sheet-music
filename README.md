# Sheet Music

Turn a recording of **piano and cello** into sheet music on your phone, with no internet needed.

Pick an audio file, wait a minute, and you get a score with a cello part and a piano part (both hands). You can play it back, change settings, and save it as **PDF**, **MusicXML** (for MuseScore, Sibelius, Dorico, Finale) or **MIDI**.

Everything runs on the device. Your recordings are never uploaded.

## Install on Android

1. On your phone, open **https://github.com/AdmEve/sheet-music/releases/tag/android-latest**
2. Tap **SheetMusic.apk** to download it.
3. Open the downloaded file. Android will ask to allow installing apps from your browser; allow it, then tap **Install**.

Every change pushed to this repository builds a new APK automatically (see the *Actions* tab). A new version installs over the old one and keeps your library.

## Use it in a web browser

- **Download:** `SheetMusic-web.zip` on the same release page contains the web version. Serve the folder with any static web server.
- **GitHub Pages (optional):** in the repository go to *Settings → Pages → Source: GitHub Actions*. The site is then published on every build from the default branch, and once opened it keeps working offline.

## How to get the best results

| Do | Why |
|---|---|
| Use a clean recording of just piano and cello | Every extra sound (reverb, audience, other instruments) is a chance for mistakes |
| Tell the app the **time signature** and **tempo** if you know them (⚙ Adjust) | Rhythm is the hardest thing to guess from audio |
| Use **Start at / Stop at** for long files | Faster, and you can work section by section |
| Press **▶ Play** to hear the transcription | The quickest way to spot wrong notes |
| Try the **Cello vs piano** slider | Moves notes between the two parts if the split is off |
| Open the MusicXML in MuseScore (free) to finish | For final fixes and printing |

No app can transcribe music perfectly yet. When both instruments play the same note, or the player uses a lot of rubato, some guesses will be wrong. This app gives you a strong draft that you correct, rather than a finished publication.

## Settings (⚙ Adjust)

- **Instruments:** Piano + Cello, Piano + Cello + Other (an extra staff for other bowed or sustained sounds), Piano only, Cello only
- **Time signature:** automatic (3/4 or 4/4), or pick 2/4, 3/4, 4/4, 2/2, 3/8, 6/8, 9/8, 12/8
- **Tempo:** automatic, or type the beats per minute
- **Key:** automatic, or pick one
- **Rhythm detail:** Simple (eighths), Normal (16ths), Detailed (16ths + triplets)
- **Follow tempo changes:** on for expressive playing, off for music played to a click
- **Note sensitivity:** fewer and surer notes, or more notes including quiet ones

Changing a setting redraws the score instantly, without listening to the audio again.

## How it works

1. **Decode:** the audio is converted to mono 22 kHz (any format the phone can play).
2. **Hear the notes:** [Basic Pitch](https://github.com/spotify/basic-pitch) (Spotify, Apache-2.0), a small neural network bundled inside the app, finds every note. It runs in a background thread on the phone's GPU.
3. **Who played what:** each note is measured for vibrato, sustain and attack. A bowed cello wobbles in pitch and holds its sound; a piano note strikes and fades. Dynamic programming then picks the most likely single cello line; the rest goes to the piano, split between the hands.
4. **Rhythm:** a beat tracker finds the tempo and beats (following rubato), and bar lines are placed from where bass notes and long notes land. Notes are snapped to beats, preferring simple rhythms.
5. **Notation:** key detection, note spelling, ties, beams, triplets and clefs (the cello switches to tenor or treble clef for high passages). The result is exported as MusicXML and MIDI and drawn with [Verovio](https://www.verovio.org).

## For developers

```bash
npm install
npm run dev          # web version at http://localhost:5173
npm test             # unit tests
npm run build        # production web build in dist/
npx cap sync android # copy the build into the Android project (then build with Android Studio or ./gradlew)
```

Project layout:

- `src/engine/`: transcription engine (plain TypeScript, no UI). `basicpitch.ts` model runner, `notes.ts` note extraction, `assign.ts` instrument split, `rhythm.ts` beats and meter, `score.ts` notation, `musicxml.ts` and `midi.ts` export
- `src/app/`: browser/phone parts (audio decoding, worker, rendering, PDF, storage, playback)
- `android/`: Capacitor Android project
- `scripts/`: tools for testing on real audio in Node (`dump-analysis.ts`, `eval-assign.ts`, `make-score.ts`, `make_test_audio.py`)
- `.github/workflows/build.yml`: tests, builds the web version and the APK, and publishes the `android-latest` release

The APK is signed with `android/app/sheetmusic.keystore` (a personal-use key kept in the repo so updates install cleanly). If you ever publish to the Play Store, use your own private key instead.
