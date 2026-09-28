// Loudness envelope of each note, measured straight from the audio at the note's own
// harmonics. A struck piano string can only fade after the hammer blow; a bowed string
// can hold, swell or fade as the player wishes, and takes a moment to speak.

const HARMONICS = [1, 2, 3, 4];
const WEIGHTS = [1, 0.8, 0.6, 0.5];
const WIN = 1024;
const HOP = 128;

let hann: Float32Array | null = null;
function window(): Float32Array {
  if (!hann) {
    hann = new Float32Array(WIN);
    for (let i = 0; i < WIN; i++) hann[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (WIN - 1));
  }
  return hann;
}

/** Magnitude of one frequency in one window (Goertzel). */
function goertzel(x: Float32Array, start: number, freq: number, sr: number): number {
  const w = window();
  const k = (2 * Math.PI * freq) / sr;
  const c = 2 * Math.cos(k);
  let s1 = 0;
  let s2 = 0;
  for (let i = 0; i < WIN; i++) {
    const j = start + i;
    const v = j >= 0 && j < x.length ? x[j] * w[i] : 0;
    const s = v + c * s1 - s2;
    s2 = s1;
    s1 = s;
  }
  return Math.sqrt(Math.max(0, s1 * s1 + s2 * s2 - c * s1 * s2));
}

export interface Envelope {
  /** Seconds from the note start to its loudest point. */
  attackTime: number;
  /** Loudness change from the peak to near the end, in dB per second (piano: clearly negative). */
  decay: number;
}

export function noteEnvelope(audio: Float32Array, sr: number, start: number, end: number, pitch: number): Envelope {
  const f0 = 440 * 2 ** ((pitch - 69) / 12);
  const dur = Math.max(0.05, end - start);
  const t0 = start - 0.02;
  const t1 = start + Math.min(dur, 1.5) * 0.9;
  const db: number[] = [];
  const times: number[] = [];
  for (let t = t0; t <= t1; t += HOP / sr) {
    const c = Math.round(t * sr) - WIN / 2;
    let e = 0;
    HARMONICS.forEach((h, i) => {
      if (h * f0 < sr / 2 - 200) e += WEIGHTS[i] * goertzel(audio, c, h * f0, sr);
    });
    db.push(20 * Math.log10(e + 1e-9));
    times.push(t);
  }
  if (db.length < 3) return { attackTime: 0, decay: 0 };
  const searchEnd = Math.max(1, Math.min(db.length - 1, Math.round(Math.min(0.25, dur / 2) / (HOP / sr)) + 2));
  let peak = 0;
  for (let i = 1; i <= searchEnd; i++) if (db[i] > db[peak]) peak = i;
  // Robust slope (median of pairwise slopes) from the peak onwards: ignores the odd
  // frame where the other instrument happens to hit a shared harmonic.
  const slopes: number[] = [];
  const last = db.length - 1;
  const step = Math.max(1, Math.floor((last - peak) / 12));
  for (let i = peak; i <= last; i += step)
    for (let j = i + step; j <= last; j += step) slopes.push((db[j] - db[i]) / (times[j] - times[i]));
  slopes.sort((a, b) => a - b);
  const decay = slopes.length ? slopes[Math.floor(slopes.length / 2)] : 0;
  return { attackTime: Math.max(0, times[peak] - start), decay };
}

/** Adds audio envelope features (attack time, decay) to every note. */
export function withEnvelopes<A extends { notes: { start: number; end: number; pitch: number }[] }>(
  analysis: A,
  audio: Float32Array,
  sampleRate: number,
): A {
  return {
    ...analysis,
    notes: analysis.notes.map((n) => {
      const e = noteEnvelope(audio, sampleRate, n.start, n.end, n.pitch);
      return { ...n, attackTime: e.attackTime, decay: e.decay };
    }),
  };
}
