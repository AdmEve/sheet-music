// Tempo, beat and bar-line detection.
import type { RawNote } from './types';

export interface BeatInfo {
  /** Beat times in seconds, covering the whole piece. */
  beats: number[];
  /** Median tempo (beats per minute). */
  bpm: number;
}

function gaussian(x: number, s: number) {
  return Math.exp(-0.5 * (x / s) * (x / s));
}

function normalise(env: Float32Array): Float32Array {
  let mean = 0;
  for (const v of env) mean += v;
  mean /= Math.max(1, env.length);
  let sd = 0;
  for (const v of env) sd += (v - mean) * (v - mean);
  sd = Math.sqrt(sd / Math.max(1, env.length)) || 1;
  // Half-wave rectified after subtracting a local (0.5 s) mean, like a spectral-flux novelty curve.
  const out = new Float32Array(env.length);
  const half = 22;
  let acc = 0;
  let cnt = 0;
  for (let i = 0; i < Math.min(env.length, half); i++) {
    acc += env[i];
    cnt++;
  }
  for (let i = 0; i < env.length; i++) {
    if (i + half < env.length) {
      acc += env[i + half];
      cnt++;
    }
    if (i - half - 1 >= 0) {
      acc -= env[i - half - 1];
      cnt--;
    }
    out[i] = Math.max(0, env[i] - acc / cnt) / sd;
  }
  return out;
}

/** Most likely beat period (in envelope frames) via autocorrelation with a tempo prior. */
export function estimatePeriod(env: Float32Array, rate: number, prior = 100): number {
  const minLag = Math.floor((60 / 220) * rate);
  const maxLag = Math.ceil((60 / 40) * rate);
  const ac = new Float64Array(maxLag + 2);
  for (let lag = minLag; lag <= maxLag + 1; lag++) {
    let s = 0;
    for (let i = lag; i < env.length; i++) s += env[i] * env[i - lag];
    ac[lag] = s / (env.length - lag);
  }
  let best = minLag;
  let bestV = -Infinity;
  for (let lag = minLag; lag <= maxLag; lag++) {
    const bpm = (60 * rate) / lag;
    // Harmonic enhancement: a true beat period also correlates at 2x.
    const v = (ac[lag] + 0.5 * (2 * lag <= maxLag ? ac[2 * lag] : 0)) * gaussian(Math.log2(bpm / prior), 1);
    if (v > bestV) {
      bestV = v;
      best = lag;
    }
  }
  // Parabolic refinement.
  const a = ac[best - 1] ?? 0;
  const b = ac[best];
  const c = ac[best + 1] ?? 0;
  const den = a - 2 * b + c;
  return den < 0 ? best + (0.5 * (a - c)) / den : best;
}

/** Dynamic-programming beat tracker (Ellis 2007). */
export function trackBeats(
  env: Float32Array,
  rate: number,
  duration: number,
  opts: { bpm?: number; tightness?: number } = {},
): BeatInfo {
  const novelty = normalise(env);
  const period = opts.bpm ? (60 * rate) / opts.bpm : estimatePeriod(novelty, rate);
  const n = novelty.length;
  const tight = opts.tightness ?? 100;

  // Smooth the novelty with a narrow Gaussian around each frame.
  const w = Math.max(1, Math.round(period / 16));
  const local = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let k = -2 * w; k <= 2 * w; k++) if (i + k >= 0 && i + k < n) s += novelty[i + k] * gaussian(k, w);
    local[i] = s;
  }
  const cum = new Float64Array(n);
  const back = new Int32Array(n).fill(-1);
  const lo = Math.round(period / 2);
  const hi = Math.round(period * 2);
  for (let i = 0; i < n; i++) {
    let best = -Infinity;
    let arg = -1;
    for (let j = i - hi; j <= i - lo; j++) {
      if (j < 0) continue;
      const l = Math.log((i - j) / period);
      const v = cum[j] - tight * l * l;
      if (v > best) {
        best = v;
        arg = j;
      }
    }
    cum[i] = local[i] + (arg >= 0 ? Math.max(0, best) : 0);
    back[i] = arg >= 0 && best > 0 ? arg : -1;
  }
  // Last beat: the best cumulative score in the final period.
  let last = n - 1;
  let bv = -Infinity;
  for (let i = Math.max(0, n - Math.round(period)); i < n; i++)
    if (cum[i] > bv) {
      bv = cum[i];
      last = i;
    }
  const frames: number[] = [];
  for (let i = last; i >= 0; i = back[i]) frames.push(i);
  frames.reverse();
  let beats = frames.map((f) => f / rate);
  if (beats.length < 2) {
    const p = period / rate;
    beats = [];
    for (let t = 0; t <= duration + p; t += p) beats.push(t);
  }
  const bpm = medianBpm(beats);
  return { beats: extendBeats(beats, duration), bpm };
}

function medianBpm(beats: number[]): number {
  const d = beats.slice(1).map((b, i) => b - beats[i]).sort((a, b) => a - b);
  return d.length ? 60 / d[Math.floor(d.length / 2)] : 100;
}

/** Pads a beat list with evenly spaced beats so it covers [-1 beat, duration + 2 beats]. */
export function extendBeats(beats: number[], duration: number): number[] {
  const out = [...beats];
  const step = (k: number) => (k >= 1 ? out[k] - out[k - 1] : 0.6);
  const p0 = out.length > 1 ? Math.min(...out.slice(1, 5).map((b, i) => b - out[i])) || 0.6 : 0.6;
  while (out[0] > -p0) out.unshift(out[0] - (out.length > 1 ? out[1] - out[0] : p0));
  while (out[out.length - 1] < duration + 2 * step(out.length - 1)) out.push(out[out.length - 1] + step(out.length - 1));
  return out;
}

/** Straight, constant-tempo beat grid fitted to tracked beats (for music without rubato). */
export function constantGrid(beats: number[], duration: number, bpm?: number): number[] {
  const n = beats.length;
  let slope: number;
  let icpt: number;
  if (bpm) {
    slope = 60 / bpm;
    // Best phase: median residual.
    const res = beats.map((b, i) => b - i * slope).sort((a, b) => a - b);
    icpt = res[Math.floor(n / 2)];
  } else {
    let sx = 0;
    let sy = 0;
    let sxx = 0;
    let sxy = 0;
    beats.forEach((b, i) => {
      sx += i;
      sy += b;
      sxx += i * i;
      sxy += i * b;
    });
    slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
    icpt = (sy - slope * sx) / n;
  }
  const out: number[] = [];
  let k = Math.floor(-icpt / slope) - 1;
  for (; icpt + k * slope < duration + 2 * slope; k++) out.push(icpt + k * slope);
  return out;
}

/** Fractional beat index of time t (piecewise-linear between beats). */
export function beatPosition(beats: number[], t: number): number {
  if (t <= beats[0]) return (t - beats[0]) / (beats[1] - beats[0]);
  let lo = 0;
  let hi = beats.length - 1;
  if (t >= beats[hi]) return hi + (t - beats[hi]) / (beats[hi] - beats[hi - 1]);
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (beats[mid] <= t) lo = mid;
    else hi = mid;
  }
  return lo + (t - beats[lo]) / (beats[lo + 1] - beats[lo]);
}

/**
 * Guesses how many beats per bar (2, 3 or 4) and which beat is the downbeat, from where
 * the bass notes, long notes and loud chords fall.
 */
export function detectMeter(
  beats: number[],
  notes: RawNote[],
  candidates: number[] = [3, 4],
): { beatsPerBar: number; phase: number } {
  const accent = new Float64Array(beats.length);
  for (const n of notes) {
    const pos = beatPosition(beats, n.start);
    const k = Math.round(pos);
    if (k < 0 || k >= beats.length || Math.abs(pos - k) > 0.2) continue;
    const low = n.pitch < 55 ? 1.5 : n.pitch < 60 ? 1 : 0.4;
    const long = Math.min(2, Math.max(0.3, beatPosition(beats, n.end) - pos));
    accent[k] += n.amp * low * long;
  }
  let best = { beatsPerBar: 4, phase: 0 };
  let bestScore = -Infinity;
  for (const m of candidates) {
    for (let ph = 0; ph < m; ph++) {
      let on = 0;
      let nOn = 0;
      let off = 0;
      let nOff = 0;
      for (let k = 0; k < beats.length; k++) {
        if ((((k - ph) % m) + m) % m === 0) {
          on += accent[k];
          nOn++;
        } else {
          off += accent[k];
          nOff++;
        }
      }
      // Contrast between downbeats and other beats; slight preference for 4/4 (and for
      // 6/8 over 12/8, which is the same music written with bars twice as long).
      const score = on / Math.max(1, nOn) - off / Math.max(1, nOff) + (m === 4 && candidates.includes(3) ? 0.02 : 0) + (m === 2 && candidates.includes(4) && !candidates.includes(3) ? 0.05 : 0);
      if (score > bestScore) {
        bestScore = score;
        best = { beatsPerBar: m, phase: ph };
      }
    }
  }
  return best;
}

// ---------------------------------------------------------------- metre inference

export interface MetreResult {
  /** Beat times (seconds) at the chosen beat level. */
  beats: number[];
  beatsPerBar: number;
  /** Beats divide into three (6/8, 9/8, 12/8) rather than two. */
  compound: boolean;
  /** Index (in `beats`) of a downbeat. */
  phase: number;
}

interface Cluster {
  t: number;
  w: number;
}

/** Onset clusters with a metrical weight: long, low and loud notes mark strong beats. */
function onsetClusters(notes: RawNote[]): Cluster[] {
  const sorted = [...notes].sort((a, b) => a.start - b.start);
  const out: Cluster[] = [];
  for (const n of sorted) {
    const dur = Math.min(2, n.end - n.start);
    const w = (0.3 + n.amp) * (1 + Math.log2(1 + dur / 0.25)) * (n.pitch < 55 ? 1.5 : 1);
    const last = out[out.length - 1];
    if (last && n.start - last.t < 0.04) last.w += w;
    else out.push({ t: n.start, w });
  }
  return out;
}

/** Splits every interval of a pulse into k equal parts. */
function subdivide(pulse: number[], k: number): number[] {
  if (k === 1) return pulse;
  const out: number[] = [];
  for (let i = 0; i + 1 < pulse.length; i++) for (let j = 0; j < k; j++) out.push(pulse[i] + ((pulse[i + 1] - pulse[i]) * j) / k);
  out.push(pulse[pulse.length - 1]);
  return out;
}

function nearestIndex(grid: number[], t: number): number {
  let lo = 0;
  let hi = grid.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (grid[mid] <= t) lo = mid;
    else hi = mid;
  }
  return Math.abs(grid[hi] - t) < Math.abs(grid[lo] - t) ? hi : lo;
}

/**
 * Moves each tracked beat onto the strongest nearby (struck) onset, so the grid sits
 * exactly on the notes and follows rubato. Beats with no onset nearby stay put.
 */
function alignPulse(pulse: number[], clusters: Cluster[]): number[] {
  const p = medianStep(pulse);
  const out = [...pulse];
  let j = 0;
  for (let i = 0; i < out.length; i++) {
    while (j < clusters.length && clusters[j].t < out[i] - 0.2 * p) j++;
    let best = -1;
    let bestV = 0;
    for (let q = j; q < clusters.length && clusters[q].t <= out[i] + 0.2 * p; q++) {
      const d = (clusters[q].t - out[i]) / (0.1 * p);
      const v = clusters[q].w * Math.exp(-0.5 * d * d);
      if (v > bestV) {
        bestV = v;
        best = q;
      }
    }
    if (best >= 0) {
      const t = clusters[best].t;
      const prev = i > 0 ? out[i - 1] : -Infinity;
      if (t - prev > 0.6 * p) out[i] = t;
    }
  }
  return out;
}

function medianStep(grid: number[]): number {
  const d = grid.slice(1).map((b, i) => b - grid[i]).sort((a, b) => a - b);
  return d.length ? d[Math.floor(d.length / 2)] : 0.5;
}

/**
 * Works out the beat level, whether beats divide in two or three, and the bar length.
 * It finds the finest regular pulse the notes sit on (the "tatum", usually the eighth
 * note), then tries grouping it in 1, 2, 3, 4 or 6 and keeps the grouping where the
 * accented notes (long, low, loud) fall on the beats at a plausible tempo.
 */
export function inferMetre(
  pulse: number[],
  notes: RawNote[],
  fixed: { beatsPerBar?: number; compound?: boolean; pulseIsBeat?: boolean } = {},
): MetreResult {
  const clusters = onsetClusters(notes);
  if (clusters.length < 4) {
    const d = detectMeter(pulse, notes, fixed.beatsPerBar ? [fixed.beatsPerBar] : [3, 4]);
    return { beats: pulse, beatsPerBar: d.beatsPerBar, compound: !!fixed.compound, phase: d.phase };
  }
  // 1. Tatum: the subdivision of the tracked pulse that the onsets fit best, judged by
  //    how many onsets sit on the grid beyond what chance would give. Struck (piano)
  //    notes time far more precisely than bowed ones, so they are used when available.
  const p = medianStep(pulse);
  const labeled = notes as (RawNote & { instrument?: string })[];
  const struck = labeled.filter((n) => n.instrument === 'piano');
  const timing = onsetClusters(struck.length >= 8 ? struck : notes);
  pulse = alignPulse(pulse, timing);
  const tol = 0.035;
  let k = 1;
  let bestFit = -Infinity;
  for (const kk of [1, 2, 3, 4]) {
    const spacing = p / kk;
    // Nothing in this music is written faster than ~16th notes at a brisk tempo.
    if (kk > 1 && spacing < 0.09) break;
    const grid = subdivide(pulse, kk);
    // Tolerance scales with the grid, so coarse and fine grids compete fairly.
    const tolK = Math.min(tol, 0.2 * spacing);
    const chance = (2 * tolK) / spacing;
    let hit = 0;
    let wsum = 0;
    for (const c of timing) {
      if (Math.abs(grid[nearestIndex(grid, c.t)] - c.t) <= tolK) hit += c.w;
      wsum += c.w;
    }
    const excess = (hit / wsum - chance) / (1 - chance);
    // Finer grids must clearly earn their place.
    if (kk === 1 || excess > bestFit + 0.1) {
      bestFit = Math.max(bestFit, excess);
      k = kk;
    }
  }
  const tatum = subdivide(pulse, k);

  // 2. Accent on every tatum.
  const acc = new Float64Array(tatum.length);
  const tStep = medianStep(tatum);
  for (const c of clusters) {
    const i = nearestIndex(tatum, c.t);
    if (Math.abs(tatum[i] - c.t) < 0.45 * tStep) acc[i] += c.w;
  }
  const meanAcc = acc.reduce((a, b) => a + b, 0) / acc.length || 1;

  // 3. Candidate beat levels.
  type Cand = { g: number; phi: number; score: number; beats: number[]; compound: boolean };
  let best: Cand | null = null;
  const groupings = fixed.pulseIsBeat ? [k] : [1, 2, 3, 4, 6, 8, 12];
  for (const g of groupings) {
    const compound = g % 3 === 0;
    if (fixed.compound !== undefined && !fixed.pulseIsBeat && compound !== fixed.compound) continue;
    for (let phi = 0; phi < g; phi++) {
      const beats: number[] = [];
      let sum = 0;
      let n = 0;
      for (let i = phi; i < tatum.length; i += g) {
        beats.push(tatum[i]);
        sum += acc[i];
        n++;
      }
      if (beats.length < 4) continue;
      const bpm = 60 / medianStep(beats);
      if (bpm < 30 || bpm > 220) continue;
      const contrast = sum / n / meanAcc;
      const center = compound ? 60 : 88;
      const prior = Math.log2(bpm / center) / 0.6;
      // Simple metres are more common in this repertoire; compound needs clear evidence.
      const score = Math.log(contrast + 1e-3) - 0.5 * prior * prior - (compound ? 0.15 : 0);
      if (!best || score > best.score) best = { g, phi, score, beats, compound: fixed.compound ?? compound };
    }
  }
  const chosen = best ?? { g: 1, phi: 0, score: 0, beats: pulse, compound: !!fixed.compound };

  // 4. Bar length and downbeat.
  const cands = fixed.beatsPerBar ? [fixed.beatsPerBar] : chosen.compound ? [2, 4] : [3, 4];
  const d = detectMeter(chosen.beats, notes, cands);
  return { beats: chosen.beats, beatsPerBar: d.beatsPerBar, compound: chosen.compound, phase: d.phase };
}
