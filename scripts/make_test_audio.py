"""Generate a small piano + cello duet (MIDI + JSON ground truth) for testing.

Render to audio with:  fluidsynth -ni -F out.wav -r 44100 /usr/share/sounds/sf2/FluidR3_GM.sf2 duet.mid
"""
import json
import sys

import mido

BPM = 84
TPQ = 480
OUT = sys.argv[1] if len(sys.argv) > 1 else "duet"

# One chord per bar (G major): root, and triad pitches for the RH arpeggio.
chords = [
    (43, [67, 71, 74]),  # G
    (40, [67, 71, 76]),  # Em
    (36, [67, 72, 76]),  # C
    (38, [66, 69, 74]),  # D
    (43, [67, 71, 74]),  # G
    (36, [64, 67, 72]),  # C
    (38, [66, 69, 72]),  # D7
    (43, [67, 71, 74]),  # G
]
# Cello melody: (midi pitch, length in quarters), 4 quarters per bar.
cello = [
    (55, 2), (59, 2),
    (57, 3), (55, 1),
    (52, 2), (55, 1), (57, 1),
    (54, 4),
    (59, 2), (62, 2),
    (60, 1.5), (59, 0.5), (57, 2),
    (54, 2), (57, 2),
    (55, 4),
]

notes = []  # (track, pitch, start_q, dur_q, velocity)
for bar, (root, triad) in enumerate(chords):
    t0 = bar * 4
    notes.append(("piano", root, t0, 4, 70))           # LH whole-note bass
    notes.append(("piano", root + 7, t0 + 2, 2, 58))    # LH fifth on beat 3
    pattern = [triad[0], triad[1], triad[2], triad[1]] * 2
    for i, p in enumerate(pattern):                     # RH eighth-note arpeggio
        notes.append(("piano", p, t0 + i * 0.5, 0.5, 60))
t = 0.0
for p, d in cello:
    notes.append(("cello", p, t, d, 88))
    t += d


def build(program_by_track):
    mid = mido.MidiFile(ticks_per_beat=TPQ)
    meta = mido.MidiTrack()
    meta.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(BPM)))
    meta.append(mido.MetaMessage("time_signature", numerator=4, denominator=4))
    mid.tracks.append(meta)
    for ch, (name, prog) in enumerate(program_by_track.items()):
        tr = mido.MidiTrack()
        tr.append(mido.Message("program_change", program=prog, channel=ch))
        if name == "cello":
            tr.append(mido.Message("control_change", control=1, value=60, channel=ch))  # vibrato
        evs = []
        for trk, p, s, d, v in notes:
            if trk != name:
                continue
            gap = 0.95 if name == "piano" else 0.98
            evs.append((int(s * TPQ), 1, mido.Message("note_on", note=p, velocity=v, channel=ch)))
            evs.append((int((s + d * gap) * TPQ), 0, mido.Message("note_off", note=p, velocity=0, channel=ch)))
        evs.sort(key=lambda e: (e[0], e[1]))
        last = 0
        for tick, _, msg in evs:
            tr.append(msg.copy(time=tick - last))
            last = tick
        mid.tracks.append(tr)
    return mid


build({"piano": 0, "cello": 42}).save(OUT + ".mid")
sec = 60.0 / BPM
json.dump(
    {
        "bpm": BPM,
        "notes": [
            {"instrument": trk, "pitch": p, "start": s * sec, "end": (s + d) * sec, "startQ": s, "durQ": d}
            for trk, p, s, d, v in notes
        ],
    },
    open(OUT + ".json", "w"),
    indent=1,
)
print("wrote", OUT + ".mid", len(notes), "notes")
