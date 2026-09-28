// Key detection and pitch spelling.

// Krumhansl–Kessler key profiles (C major / C minor).
const MAJOR = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
const MINOR = [6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];

export interface Key {
  /** Number of sharps (+) or flats (−) in the key signature. */
  fifths: number;
  mode: 'major' | 'minor';
}

const MAJOR_FIFTHS_BY_TONIC = [0, -5, 2, -3, 4, -1, 6, 1, -4, 3, -2, 5]; // C, Db, D, Eb, E, F, F#, G, Ab, A, Bb, B

function corr(a: number[], b: number[]): number {
  const ma = a.reduce((x, y) => x + y, 0) / a.length;
  const mb = b.reduce((x, y) => x + y, 0) / b.length;
  let n = 0;
  let da = 0;
  let db = 0;
  for (let i = 0; i < a.length; i++) {
    n += (a[i] - ma) * (b[i] - mb);
    da += (a[i] - ma) ** 2;
    db += (b[i] - mb) ** 2;
  }
  return n / Math.sqrt(da * db || 1);
}

export function detectKey(notes: { pitch: number; start: number; end: number; amp?: number }[]): Key {
  const hist = new Array(12).fill(0);
  // The bass line and the last notes carry most of the tonal weight.
  const last = notes.reduce((m, n) => Math.max(m, n.end), 0);
  const lowest = notes.reduce((m, n) => Math.min(m, n.pitch), 127);
  for (const n of notes) {
    const bass = n.pitch < Math.max(48, lowest + 12) ? 1.6 : 1;
    const ending = n.end > last - 2 ? 1.5 : 1;
    hist[n.pitch % 12] += Math.min(2, n.end - n.start) * (n.amp ?? 1) * bass * ending;
  }
  if (hist.every((v) => v === 0)) return { fifths: 0, mode: 'major' };
  let best: Key = { fifths: 0, mode: 'major' };
  let bestR = -Infinity;
  for (let tonic = 0; tonic < 12; tonic++) {
    const rot = (p: number[]) => p.map((_, i) => p[(i - tonic + 12) % 12]);
    const rMaj = corr(hist, rot(MAJOR));
    const rMin = corr(hist, rot(MINOR));
    let f = MAJOR_FIFTHS_BY_TONIC[tonic];
    if (f === 6) f = -6; // prefer Gb over F# only when it wins below
    if (rMaj > bestR) {
      bestR = rMaj;
      best = { fifths: MAJOR_FIFTHS_BY_TONIC[tonic] === 6 ? 6 : f, mode: 'major' };
    }
    if (rMin > bestR) {
      bestR = rMin;
      // Relative major is 3 semitones up.
      let mf = MAJOR_FIFTHS_BY_TONIC[(tonic + 3) % 12];
      if (mf === 6) mf = -6;
      best = { fifths: mf, mode: 'minor' };
    }
  }
  // Keep signatures within ±6 and prefer fewer accidentals for enharmonic twins.
  if (best.fifths === 6) best.fifths = -6;
  return best;
}

export interface Spelled {
  step: 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
  alter: number;
  octave: number;
}

const STEPS_BY_FIFTH = ['F', 'C', 'G', 'D', 'A', 'E', 'B'] as const;

/** Spells a MIDI pitch in a key, choosing the enharmonic closest to the key on the line of fifths. */
export function spell(pitch: number, key: Key): Spelled {
  const pc = ((pitch % 12) + 12) % 12;
  const center = key.fifths + (key.mode === 'minor' ? 3 : 1.5);
  let bestQ = 0;
  let bestD = Infinity;
  for (let q = -15; q <= 19; q++) {
    if ((((q * 7) % 12) + 12) % 12 !== pc) continue;
    const d = Math.abs(q - center);
    if (d < bestD) {
      bestD = d;
      bestQ = q;
    }
  }
  const idx = ((((bestQ + 1) % 7) + 7) % 7) as number;
  const step = STEPS_BY_FIFTH[idx];
  const alter = Math.floor((bestQ + 1) / 7);
  const naturalPc = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[step];
  // Octave of the written note (B#3 sounds as C4, Cb4 as B3).
  const octave = Math.floor((pitch - alter - naturalPc) / 12) - 1;
  return { step, alter, octave };
}

/** Alteration each step carries in the key signature. */
export function keyAlterations(fifths: number): Record<string, number> {
  const out: Record<string, number> = { C: 0, D: 0, E: 0, F: 0, G: 0, A: 0, B: 0 };
  const sharps = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];
  const flats = ['B', 'E', 'A', 'D', 'G', 'C', 'F'];
  for (let i = 0; i < Math.abs(fifths); i++) {
    if (fifths > 0) out[sharps[i]] = 1;
    else out[flats[i]] = -1;
  }
  return out;
}
