"""Generates a varied set of piano + cello test pieces with exact ground truth.

For every piece: <name>.mid (to render with a soundfont) and <name>.json (notes in seconds
and in quarter notes, plus meter/key/tempo). Render with scripts/bench/render.sh.

    python3 scripts/bench/make_bench.py test-audio/bench
"""
import json
import math
import os
import random
import sys

import mido

TPQ = 480
OUT = sys.argv[1] if len(sys.argv) > 1 else "test-audio/bench"
os.makedirs(OUT, exist_ok=True)


class Piece:
    def __init__(self, name, bpm, beats, beat_type, key_fifths, mode, rubato=0.0, beat_q=1.0):
        self.name = name
        self.bpm = bpm  # beats per minute of the meter's beat
        self.beats = beats
        self.beat_type = beat_type
        self.key = {"fifths": key_fifths, "mode": mode}
        self.rubato = rubato
        self.beat_q = beat_q  # beat length in quarter notes (1.5 for 6/8)
        self.notes = []  # (instrument, pitch, start_q, dur_q, velocity)

    def add(self, ins, pitch, start_q, dur_q, vel=None):
        if vel is None:
            vel = 88 if ins == "cello" else 70
        self.notes.append((ins, pitch, start_q, dur_q, max(30, min(120, vel + random.randint(-8, 8)))))

    def bar_q(self):
        return self.beats * 4 / self.beat_type

    # Tempo map: seconds per quarter note for the quarter starting at q.
    def spq(self, q):
        beat = q / self.beat_q
        bpm = self.bpm * (1 + self.rubato * math.sin(2 * math.pi * beat / 16))
        return 60.0 / bpm / self.beat_q

    def q_to_sec(self, q):
        # Tempo changes once per beat.
        t = 0.0
        b = 0.0
        while b + self.beat_q <= q + 1e-9:
            t += self.spq(b) * self.beat_q
            b += self.beat_q
        return t + (q - b) * self.spq(b)

    def write(self):
        mid = mido.MidiFile(ticks_per_beat=TPQ)
        meta = mido.MidiTrack()
        meta.append(mido.MetaMessage("time_signature", numerator=self.beats, denominator=self.beat_type))
        end_q = max(s + d for _, _, s, d, _ in self.notes) + 2
        b = 0.0
        last = 0
        while b < end_q:
            tick = int(round(b * TPQ))
            meta.append(mido.MetaMessage("set_tempo", tempo=int(self.spq(b) * 1e6), time=tick - last))
            last = tick
            b += self.beat_q
        mid.tracks.append(meta)
        for ch, (ins, prog) in enumerate([("piano", 0), ("cello", 42)]):
            tr = mido.MidiTrack()
            tr.append(mido.Message("program_change", program=prog, channel=ch))
            if ins == "cello":
                tr.append(mido.Message("control_change", control=1, value=55, channel=ch))
            evs = []
            for i, p, s, d, v in self.notes:
                if i != ins:
                    continue
                gap = 0.92 if ins == "piano" else 0.97
                evs.append((int(s * TPQ), 1, mido.Message("note_on", note=p, velocity=v, channel=ch)))
                evs.append((int((s + d * gap) * TPQ), 0, mido.Message("note_off", note=p, velocity=0, channel=ch)))
            evs.sort(key=lambda e: (e[0], e[1]))
            last = 0
            for tick, _, msg in evs:
                tr.append(msg.copy(time=tick - last))
                last = tick
            mid.tracks.append(tr)
        mid.save(os.path.join(OUT, self.name + ".mid"))
        truth = {
            "name": self.name,
            "bpm": self.bpm,
            "meter": {"beats": self.beats, "beatType": self.beat_type},
            "key": self.key,
            "notes": [
                {
                    "instrument": i,
                    "pitch": p,
                    "start": self.q_to_sec(s),
                    "end": self.q_to_sec(s + d),
                    "startQ": s,
                    "durQ": d,
                }
                for i, p, s, d, v in sorted(self.notes, key=lambda n: (n[2], n[1]))
            ],
        }
        json.dump(truth, open(os.path.join(OUT, self.name + ".json"), "w"), indent=0)
        print(f"{self.name}: {len(self.notes)} notes, {self.q_to_sec(end_q - 2):.1f}s")


random.seed(7)

# 1. Arpeggiated accompaniment, long cello notes (G major 4/4).
p = Piece("arpeggio", 84, 4, 4, 1, "major")
chords = [(43, [67, 71, 74]), (40, [67, 71, 76]), (36, [67, 72, 76]), (38, [66, 69, 74]),
          (43, [67, 71, 74]), (36, [64, 67, 72]), (38, [66, 69, 72]), (43, [67, 71, 74])]
for bar, (root, tri) in enumerate(chords):
    t = bar * 4
    p.add("piano", root, t, 4)
    p.add("piano", root + 7, t + 2, 2, 58)
    for i, n in enumerate([tri[0], tri[1], tri[2], tri[1]] * 2):
        p.add("piano", n, t + i * 0.5, 0.5, 62)
t = 0
for n, d in [(55, 2), (59, 2), (57, 3), (55, 1), (52, 2), (55, 1), (57, 1), (54, 4),
             (59, 2), (62, 2), (60, 1.5), (59, 0.5), (57, 2), (54, 2), (57, 2), (55, 4)]:
    p.add("cello", n, t, d)
    t += d
p.write()

# 2. Waltz in D minor 3/4: bass on 1, chords on 2 and 3; cello melody reaching the tenor register.
p = Piece("waltz", 104, 3, 4, -1, "minor")
prog = [(38, [62, 65, 69]), (45, [61, 64, 67]), (38, [62, 65, 69]), (43, [62, 67, 70]),
        (41, [60, 65, 69]), (43, [62, 67, 70]), (45, [61, 64, 69]), (38, [62, 65, 69])] * 2
for bar, (root, tri) in enumerate(prog):
    t = bar * 3
    p.add("piano", root, t, 1, 72)
    p.add("piano", root + 12, t, 1, 60)
    for k in (1, 2):
        for n in tri:
            p.add("piano", n, t + k, 1, 55)
mel = [(62, 3), (64, 2), (65, 1), (69, 3), (67, 1.5), (65, 0.5), (64, 1),
       (65, 2), (67, 1), (69, 3), (70, 2), (69, 1), (67, 1), (65, 1), (64, 1), (62, 3),
       (69, 2), (70, 1), (72, 3), (74, 2), (72, 1), (70, 3), (69, 1), (67, 1), (65, 1),
       (64, 2), (65, 1), (67, 1.5), (65, 0.5), (64, 1), (62, 3)]
t = 0
for n, d in mel:
    p.add("cello", n - 12 if t < 24 else n, t, d)  # second half an octave higher (tenor clef)
    t += d
p.write()

# 3. Slow lyrical piece with rubato (E-flat major 4/4): Alberti bass, held RH chords.
p = Piece("rubato", 66, 4, 4, -3, "major", rubato=0.12)
prog = [(39, [58, 63, 67]), (44, [60, 63, 68]), (46, [58, 62, 65]), (39, [58, 63, 67]),
        (36, [60, 63, 67]), (41, [60, 65, 68]), (46, [58, 62, 68]), (39, [58, 63, 67])]
for bar, (root, tri) in enumerate(prog):
    t = bar * 4
    fifth, third = root + 7, root + 4 if bar % 4 != 1 else root + 3
    for i, n in enumerate([root, fifth, third + 12, fifth] * 2):
        p.add("piano", n, t + i * 0.5, 0.5, 58)
    for n in tri:
        p.add("piano", n + 12, t, 2, 55)
        p.add("piano", n + 12, t + 2, 2, 50)
t = 0
for n, d in [(55, 3), (58, 1), (60, 2), (63, 2), (62, 1.5), (60, 0.5), (58, 2), (55, 4),
             (60, 2), (62, 1), (63, 1), (65, 2), (63, 1), (62, 1), (60, 1.5), (58, 0.5), (60, 1), (62, 1), (63, 4)]:
    p.add("cello", n - 12 if n > 60 else n, t, d)
    t += d
p.write()

# 4. Busy: running cello eighths under a piano melody (A minor 4/4).
p = Piece("busy", 108, 4, 4, 0, "minor")
lh = [45, 45, 41, 41, 48, 48, 40, 40, 45, 45, 38, 38, 40, 40, 45, 45]
for k, n in enumerate(lh):
    p.add("piano", n, k * 2, 2, 62)
melody = [(76, 1), (74, 0.5), (72, 0.5), (71, 1), (72, 1), (69, 2), (72, 2), (74, 1), (76, 1), (77, 1), (76, 1),
          (74, 2), (72, 2), (71, 1), (72, 1), (74, 1), (71, 1), (69, 4)]
t = 0
for n, d in melody:
    p.add("piano", n, t, d, 74)
    t += d
line = [45, 47, 48, 50, 52, 50, 48, 47, 41, 45, 48, 45, 41, 45, 48, 52, 48, 52, 55, 52, 48, 47, 45, 44,
        40, 44, 47, 50, 52, 50, 47, 44, 45, 48, 52, 48, 45, 48, 52, 57, 50, 53, 57, 53, 50, 53, 57, 53,
        52, 50, 48, 47, 45, 44, 47, 50, 45, 47, 48, 47, 45, 44, 45, 45]
for k, n in enumerate(line):
    p.add("cello", n, k * 0.5, 0.5 if k < len(line) - 1 else 2, 80)
p.write()

# 5. Barcarolle in 6/8 (F major): rocking piano eighths, cello melody with dotted rhythms.
p = Piece("barcarolle", 56, 6, 8, -1, "major", beat_q=1.5)
prog = [(41, 48, 57), (41, 48, 57), (46, 53, 62), (41, 48, 57), (43, 50, 58), (48, 52, 58), (41, 48, 57), (41, 48, 57)]
for bar, (a, b, c) in enumerate(prog):
    t = bar * 3
    for i, n in enumerate([a, b, c, b + 12, c, b]):
        p.add("piano", n, t + i * 0.5, 0.5, 60)
t = 0
for n, d in [(57, 1.5), (58, 0.5), (57, 0.5), (55, 0.5), (53, 3), (58, 1.5), (60, 1), (62, 0.5), (60, 3),
             (58, 1), (57, 0.5), (55, 1.5), (60, 1.5), (64, 1), (62, 0.5), (60, 1.5), (57, 3), (53, 3)]:
    p.add("cello", n, t, d)
    t += d
p.write()

# 6. Roles swapped: piano sings the melody, low cello walks the bass (C major 4/4).
p = Piece("bassline", 92, 4, 4, 0, "major")
bass = [36, 40, 43, 40, 41, 45, 48, 45, 43, 47, 50, 47, 36, 43, 40, 36, 41, 43, 45, 47, 48, 43, 36, 36]
for k, n in enumerate(bass):
    p.add("cello", n, k, 1 if k < len(bass) - 1 else 2, 82)
chords = [[60, 64], [60, 65], [59, 62], [60, 64], [60, 65], [59, 64]]
for bar, ch in enumerate(chords):
    for beat in (1, 3):
        for n in ch:
            p.add("piano", n - 12 + 12, bar * 4 + beat, 1, 50)
t = 0
for n, d in [(72, 1), (76, 1), (79, 2), (77, 1), (76, 0.5), (74, 0.5), (72, 2), (71, 1), (74, 1), (79, 2),
             (72, 1.5), (74, 0.5), (76, 2), (77, 1), (76, 1), (74, 1), (72, 1), (71, 2), (74, 2), (72, 4)]:
    p.add("piano", n, t, d, 78)
    t += d
p.write()
