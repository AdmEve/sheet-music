#!/bin/sh
# Renders every benchmark MIDI with two different soundfonts (with the synth's reverb on).
# Usage: scripts/bench/render.sh test-audio/bench
set -e
DIR=${1:-test-audio/bench}
for mid in "$DIR"/*.mid; do
  base=${mid%.mid}
  fluidsynth -ni -R 1 -F "$base-fluid.wav" -r 44100 -g 0.7 /usr/share/sounds/sf2/FluidR3_GM.sf2 "$mid" >/dev/null 2>&1
  fluidsynth -ni -R 1 -F "$base-musescore.wav" -r 44100 -g 0.7 /usr/share/sounds/sf2/MuseScore_General_Full.sf2 "$mid" >/dev/null 2>&1
done
ls "$DIR"/*.wav | wc -l
