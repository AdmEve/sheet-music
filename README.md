# Sheet Music

Turn a recording of a **piano and cello duet** into sheet music on your phone, with no internet needed.

Pick an audio file, wait a few minutes, and you get:

- the **full score** (cello above the piano, as in published cello sonatas),
- the **cello part** for the cellist,
- the **piano part** with the cello line in small notes above it, so the pianist can follow.

You can play it back, change settings, and save it as **PDF**, **MusicXML** (for MuseScore, Sibelius, Dorico, Finale) or **MIDI**.

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

- **Time signature:** automatic (simple or compound time, e.g. 3/4, 4/4, 6/8), or pick 2/4, 3/4, 4/4, 2/2, 3/8, 6/8, 9/8, 12/8
- **Tempo:** automatic, or type the beats per minute
- **Key:** automatic, or pick one
- **Rhythm detail:** Simple (eighths), Normal (16ths), Detailed (16ths + triplets)
- **Follow tempo changes:** on for expressive playing, off for music played to a click
- **Cello vs piano:** move doubtful notes towards one instrument or the other
- **Note sensitivity:** fewer and surer notes, or more notes including quiet ones

The **Full score / Cello part / Piano part** menu above the music chooses what is shown and what the PDF contains. MusicXML and MIDI always hold both instruments.

Changing a setting redraws the score instantly, without listening to the audio again.

## How it works

1. **Decode:** the audio is converted to mono 22 kHz (any format the phone can play).
2. **Listen twice.** Two neural networks run on the phone, in a background thread:
   - [Basic Pitch](https://github.com/spotify/basic-pitch) (Spotify, Apache-2.0) hears every note of both instruments, with fine pitch detail (it shows the cello's vibrato);
   - [Onsets and Frames](https://magenta.tensorflow.org/onsets-frames) (Google Magenta, Apache-2.0), a **piano specialist** trained on hundreds of hours of concert-piano recordings, hears the piano notes very reliably.
3. **Who played what.** Each note is checked for what a cello does and a piano cannot: vibrato, a slow bow start (measured from the audio), a sound that holds or swells instead of fading, and the piano model "re-firing" inside a long bowed note. A small classifier fitted on piano + cello recordings weighs these cues, and dynamic programming picks the most likely single cello line. The piano part comes from the piano specialist, minus anything that is really the cello.
4. **Rhythm.** A beat tracker follows the tempo (including rubato). The app then finds the smallest regular pulse (usually the eighth note) and tests grouping it in twos (simple time) or threes (compound time such as 6/8), keeping the version where long, low and loud notes fall on the beats. Bar lines come from where the bass notes and chord changes land.
5. **Notation.** Key detection (weighted towards the bass and the ending), note spelling, ties, beams, triplets and clefs (the cello switches to tenor or treble clef for high passages). The result is exported as MusicXML and MIDI and drawn with [Verovio](https://www.verovio.org).

### How accurate is it?

The repository contains a benchmark of piano + cello pieces (`scripts/bench/`): six pieces in different styles (4/4 arpeggios, a 3/4 waltz, a slow piece with rubato, a fast running cello line, a 6/8 barcarolle, a walking cello bass line), each rendered with three different instrument sound sets. On those 18 recordings:

| | first version | now |
|---|---|---|
| Piano notes found correctly | 74% | 78% |
| Cello notes found correctly | 70% | 79% |
| Piano notes at exactly the right place in the score | 56% | 73% |
| Cello notes at exactly the right place in the score | 51% | 72% |
| Tempo right | 67% | 94% |
| Time signature right | 72% | 89% |
| Key right | 89% | 94% |

The weakest case is a fast cello line with little vibrato under a busy piano part: those cello notes are often mistaken for piano. The test recordings are synthesised from sampled instruments, not real players, so results on real recordings will differ.

## For developers

```bash
npm install
npm run dev          # web version at http://localhost:5173
npm test             # unit tests
npm run build        # production web build in dist/
npx cap sync android # copy the build into the Android project (then build with Android Studio or ./gradlew)
```

Project layout:

- `src/engine/`: transcription engine (plain TypeScript, no UI). `basicpitch.ts` general model, `pianomodel.ts` piano specialist, `notes.ts` note extraction, `timbre.ts` loudness envelopes, `assign.ts` piano/cello split, `rhythm.ts` beats and metre, `score.ts` notation, `musicxml.ts` and `midi.ts` export
- `models/piano/`: the piano model's weights (float16, converted with `scripts/convert-piano-model.py`)
- `src/app/`: browser/phone parts (audio decoding, worker, rendering, PDF, storage, playback)
- `android/`: Capacitor Android project
- `scripts/bench/`: the benchmark. `make_bench.py` writes the pieces, `render.sh` renders them, `run.ts` scores the engine, `export-features.ts` + `fit_classifier.py` refit the piano/cello classifier
- `scripts/`: other tools for testing on audio in Node (`dump-analysis.ts`, `make-score.ts`, `make_test_audio.py`)
- `.github/workflows/build.yml`: tests, builds the web version and the APK, and publishes the `android-latest` release

The APK is signed with `android/app/sheetmusic.keystore` (a personal-use key kept in the repo so updates install cleanly). If you ever publish to the Play Store, use your own private key instead.
