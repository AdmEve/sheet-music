// Turns the network's posteriorgrams into notes (a fast port of Basic Pitch's
// output_to_notes_polyphonic) and measures timbre features for each note.
import { FPS, MIDI_OFFSET, N_CONTOUR_BINS, N_PITCH_BINS, frameToTime } from './basicpitch';
import type { Analysis, Posteriors, RawNote } from './types';

export interface NoteOptions {
  onsetThresh: number;
  frameThresh: number;
  /** Minimum note length in frames (1 frame ≈ 11.6 ms). */
  minNoteLen: number;
  energyTolerance: number;
  /** Also pick up notes that have no clear onset (e.g. softly bowed notes). */
  melodiaTrick: boolean;
}

export const DEFAULT_NOTE_OPTIONS: NoteOptions = noteOptionsForSensitivity(0.5);

/** Sensitivity 0 (only confident notes) .. 1 (catch quiet notes, more false notes). */
export function noteOptionsForSensitivity(s: number): NoteOptions {
  return {
    onsetThresh: 0.6 - 0.25 * s,
    frameThresh: 0.32 - 0.16 * s,
    minNoteLen: Math.round(10 - 6 * s),
    energyTolerance: 11,
    melodiaTrick: true,
  };
}

/**
 * Bowed notes with vibrato make the onset detector fire several times inside one long
 * note. A real re-played note shows a jump in note activity; a vibrato wobble does not.
 * Joins same-pitch neighbours when there is no such jump.
 */
export function mergeFragments(post: Posteriors, notes: FrameNote[]): FrameNote[] {
  const byBin = new Map<number, FrameNote[]>();
  for (const n of notes) {
    if (!byBin.has(n.bin)) byBin.set(n.bin, []);
    byBin.get(n.bin)!.push({ ...n });
  }
  const act = (t: number, f: number) => post.frames[Math.max(0, Math.min(post.nFrames - 1, t)) * P + f];
  const out: FrameNote[] = [];
  for (const [f, list] of byBin) {
    list.sort((a, b) => a.start - b.start);
    let cur = list[0];
    for (let i = 1; i < list.length; i++) {
      const nx = list[i];
      let merge = false;
      if (nx.start - cur.end <= 3) {
        let before = 0;
        let after = 0;
        let minBefore = 1;
        for (let k = 1; k <= 5; k++) {
          before += act(nx.start - k, f);
          minBefore = Math.min(minBefore, act(nx.start - k, f));
        }
        for (let k = 0; k < 5; k++) after += act(nx.start + k, f);
        const rise = (after - before) / 5;
        let attack = 0;
        for (let t = nx.start - 1; t <= nx.start + 2; t++) attack = Math.max(attack, post.onsets[Math.max(0, t) * P + f]);
        merge = rise < 0.1 && minBefore > 0.3 && attack < 0.85;
      }
      if (merge) cur.end = Math.max(cur.end, nx.end);
      else {
        out.push(cur);
        cur = nx;
      }
    }
    out.push(cur);
  }
  return out;
}

const P = N_PITCH_BINS;

/** Onsets reinforced by sudden rises in note activity (Basic Pitch's get_infered_onsets). */
function inferredOnsets(post: Posteriors): Float32Array {
  const { nFrames, frames, onsets } = post;
  const diff = new Float32Array(nFrames * P);
  let maxDiff = 0;
  let maxOnset = 0;
  for (let t = 0; t < nFrames; t++) {
    for (let f = 0; f < P; f++) {
      const i = t * P + f;
      if (onsets[i] > maxOnset) maxOnset = onsets[i];
      if (t < 2) continue;
      const cur = frames[i];
      const d1 = cur - frames[i - P];
      const d2 = cur - frames[i - 2 * P];
      const d = Math.max(0, Math.min(d1, d2));
      diff[i] = d;
      if (d > maxDiff) maxDiff = d;
    }
  }
  const scale = maxDiff > 0 ? maxOnset / maxDiff : 0;
  const out = new Float32Array(nFrames * P);
  for (let i = 0; i < out.length; i++) out[i] = Math.max(onsets[i], diff[i] * scale);
  return out;
}

interface FrameNote {
  start: number;
  end: number; // exclusive
  bin: number;
}

export function extractFrameNotes(post: Posteriors, opt: NoteOptions = DEFAULT_NOTE_OPTIONS): FrameNote[] {
  const { nFrames, frames } = post;
  const on = inferredOnsets(post);
  const remaining = frames.slice();
  const thr = opt.frameThresh;
  const tol = opt.energyTolerance;

  // Onset peaks (local maxima in time) above threshold.
  const starts: [number, number][] = [];
  for (let t = 1; t < nFrames - 1; t++) {
    for (let f = 0; f < P; f++) {
      const v = on[t * P + f];
      if (v >= opt.onsetThresh && v > on[(t - 1) * P + f] && v > on[(t + 1) * P + f]) starts.push([t, f]);
    }
  }
  // Latest first, as in the reference implementation.
  starts.sort((a, b) => b[0] - a[0] || b[1] - a[1]);

  const notes: FrameNote[] = [];
  const clear = (t: number, f: number) => {
    remaining[t * P + f] = 0;
    if (f < P - 1) remaining[t * P + f + 1] = 0;
    if (f > 0) remaining[t * P + f - 1] = 0;
  };

  for (const [s, f] of starts) {
    if (s >= nFrames - 1) continue;
    let i = s + 1;
    let k = 0;
    while (i < nFrames - 1 && k < tol) {
      if (remaining[i * P + f] < thr) k++;
      else k = 0;
      i++;
    }
    i -= k;
    if (i - s <= opt.minNoteLen) continue;
    for (let j = s; j < i; j++) clear(j, f);
    notes.push({ start: s, end: i, bin: f });
  }

  if (opt.melodiaTrick) {
    // Repeatedly take the strongest remaining cell and grow a note around it. Cells only
    // ever drop to zero, so visiting them in descending order equals repeated argmax.
    const cand: number[] = [];
    for (let i = 0; i < remaining.length; i++) if (remaining[i] > thr) cand.push(i);
    const orig = remaining.slice();
    cand.sort((a, b) => orig[b] - orig[a]);
    for (const idx of cand) {
      if (remaining[idx] <= thr) continue;
      const mid = Math.floor(idx / P);
      const f = idx % P;
      remaining[idx] = 0;
      let i = mid + 1;
      let k = 0;
      while (i < nFrames - 1 && k < tol) {
        if (remaining[i * P + f] < thr) k++;
        else k = 0;
        clear(i, f);
        i++;
      }
      const iEnd = i - 1 - k;
      i = mid - 1;
      k = 0;
      while (i > 0 && k < tol) {
        if (remaining[i * P + f] < thr) k++;
        else k = 0;
        clear(i, f);
        i--;
      }
      const iStart = i + 1 + k;
      if (iEnd - iStart <= opt.minNoteLen) continue;
      notes.push({ start: iStart, end: iEnd, bin: f });
    }
  }
  return notes;
}

function median(a: number[]): number {
  if (!a.length) return 0;
  const s = [...a].sort((x, y) => x - y);
  return s[Math.floor(s.length / 2)];
}

/** Fine pitch track (1/3 semitone bins) of a note, like Basic Pitch's pitch bends. */
function pitchTrack(post: Posteriors, n: FrameNote): number[] {
  const C = N_CONTOUR_BINS;
  const center = n.bin * 3;
  const tolBins = 6; // ±2 semitones
  const out: number[] = [];
  for (let t = n.start; t < n.end; t++) {
    let best = -1;
    let bestV = -1;
    for (let b = Math.max(0, center - tolBins); b <= Math.min(C - 1, center + tolBins); b++) {
      const d = b - center;
      const v = post.contours[t * C + b] * Math.exp(-(d * d) / (2 * 25));
      if (v > bestV) {
        bestV = v;
        best = b;
      }
    }
    out.push(best - center);
  }
  return out;
}

function noteFeatures(post: Posteriors, n: FrameNote): Omit<RawNote, 'start' | 'end' | 'pitch'> {
  const len = n.end - n.start;
  const act: number[] = [];
  const sal: number[] = [];
  for (let t = n.start; t < n.end; t++) {
    act.push(post.frames[t * P + n.bin]);
    sal.push(post.contours[t * N_CONTOUR_BINS + n.bin * 3]);
  }
  const amp = act.reduce((a, b) => a + b, 0) / Math.max(1, len);

  // Vibrato: mean absolute deviation of the fine pitch track around its median,
  // ignoring the attack and release.
  const track = pitchTrack(post, n);
  const trim = Math.min(4, Math.floor(track.length / 4));
  const core = track.slice(trim, track.length - trim);
  const med = median(core);
  let dev = 0;
  let changes = 0;
  for (let i = 0; i < core.length; i++) {
    dev += Math.abs(core[i] - med);
    if (i > 0 && core[i] !== core[i - 1]) changes++;
  }
  const vibrato = core.length ? dev / core.length + changes / core.length : 0;

  // Sustain: salience near the end relative to the strongest part of the attack.
  const head = Math.max(1, Math.min(8, Math.floor(len / 3)));
  const headMax = Math.max(...sal.slice(0, head), 1e-6);
  const tail = sal.slice(Math.floor(len * 0.6));
  const tailMean = tail.reduce((a, b) => a + b, 0) / Math.max(1, tail.length);
  const sustain = Math.min(2, tailMean / headMax);

  let attack = 0;
  for (let t = Math.max(0, n.start - 2); t <= Math.min(post.nFrames - 1, n.start + 3); t++) {
    attack = Math.max(attack, post.onsets[t * P + n.bin]);
  }
  return { amp, vibrato, sustain, attack };
}

/** Onset strength per frame: summed positive change in note activity plus onset probabilities. */
export function onsetEnvelope(post: Posteriors): Float32Array {
  const { nFrames, frames, onsets } = post;
  const env = new Float32Array(nFrames);
  for (let t = 1; t < nFrames; t++) {
    let s = 0;
    let m = 0;
    for (let f = 0; f < P; f++) {
      const d = frames[t * P + f] - frames[(t - 1) * P + f];
      if (d > 0) s += d;
      m += onsets[t * P + f];
    }
    env[t] = s + m;
  }
  return env;
}

export function analyse(post: Posteriors, opt: NoteOptions = DEFAULT_NOTE_OPTIONS): Analysis {
  const notes: RawNote[] = mergeFragments(post, extractFrameNotes(post, opt))
    .map((n) => ({
      start: frameToTime(n.start),
      end: frameToTime(n.end),
      pitch: n.bin + MIDI_OFFSET,
      ...noteFeatures(post, n),
    }))
    .sort((a, b) => a.start - b.start || a.pitch - b.pitch);
  return {
    duration: frameToTime(post.nFrames),
    notes,
    onsetEnv: onsetEnvelope(post),
    envRate: FPS,
  };
}
