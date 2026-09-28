// Decides which instrument played each note.
//
// Neural transcription finds pitches but not instruments. We use what distinguishes a
// bowed cello from a hammered piano: vibrato, notes that keep (or grow) their strength,
// soft attacks, a single melodic line inside the cello's range. The cello line is chosen
// with dynamic programming (best-scoring non-overlapping, smoothly connected notes).
import type { Instrument, LabeledNote, RawNote } from './types';

export type InstrumentMode = 'piano+cello' | 'piano+cello+other' | 'piano' | 'cello';

export interface AssignOptions {
  mode: InstrumentMode;
  /** Lowest/highest cello pitch considered (MIDI). */
  celloLow: number;
  celloHigh: number;
  /** Bias towards (+) or away from (−) giving notes to the cello. */
  celloBias: number;
}

export const DEFAULT_ASSIGN: AssignOptions = {
  mode: 'piano+cello',
  celloLow: 36,
  celloHigh: 84,
  celloBias: 0,
};

const dur = (n: RawNote) => n.end - n.start;

/** How much a note sounds like a bowed string (positive) vs. a struck piano key (negative). */
export function bowedScore(n: RawNote): number {
  const vib = Math.min(n.vibrato, 0.8);
  const sus = Math.max(-0.5, Math.min(0.8, n.sustain - 0.9));
  const att = 0.6 - n.attack;
  const len = Math.max(-1, Math.min(1.5, Math.log2(dur(n) / 0.4)));
  return 1.8 * vib + 1.2 * sus + 0.8 * att + 0.1 * len - 0.15;
}

/**
 * Removes faint "ghost" notes: overtones or sub-octaves that the network reports next
 * to a much louder real note, plus very short, very weak blips.
 */
export function removeGhosts(notes: RawNote[]): RawNote[] {
  const sorted = [...notes].sort((a, b) => a.start - b.start);
  const keep: RawNote[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const n = sorted[i];
    if (dur(n) < 0.12 && n.amp < 0.3 && n.attack < 0.35) continue;
    let ghost = false;
    for (let j = 0; j < sorted.length && !ghost; j++) {
      const m = sorted[j];
      if (m === n || m.start > n.end) continue;
      if (m.end < n.start) continue;
      const iv = Math.abs(n.pitch - m.pitch);
      if (iv !== 12 && iv !== 19 && iv !== 24) continue;
      const overlap = Math.min(n.end, m.end) - Math.max(n.start, m.start);
      if (overlap < 0.6 * dur(n)) continue;
      if (m.amp > n.amp * 1.25 && (n.attack < m.attack * 0.8 || n.amp < 0.32)) ghost = true;
    }
    if (!ghost) keep.push(n);
  }
  return keep;
}

/** Picks the single best-scoring melodic line of bowed-sounding notes (the cello part). */
function celloLine(notes: RawNote[], opt: AssignOptions): Set<number> {
  const idx = notes
    .map((_, i) => i)
    .filter((i) => notes[i].pitch >= opt.celloLow && notes[i].pitch <= opt.celloHigh)
    .sort((a, b) => notes[a].start - notes[b].start);
  const m = idx.length;
  const w = idx.map((i) => {
    const n = notes[i];
    return Math.pow(Math.max(0.05, dur(n)), 0.7) * (bowedScore(n) + opt.celloBias);
  });
  const dp = new Float64Array(m);
  const prev = new Int32Array(m).fill(-1);
  const overlapTol = 0.1;
  // prefixBest[k]: best dp among notes whose index < k and that end long before (no transition term).
  let bestIdx = -1;
  let bestVal = 0;
  let farPtr = 0;
  const byEnd = [...Array(m).keys()].sort((a, b) => notes[idx[a]].end - notes[idx[b]].end);
  for (let k = 0; k < m; k++) {
    const nk = notes[idx[k]];
    // Notes that ended more than 2 s ago connect without transition bonus/penalty.
    while (farPtr < m && notes[idx[byEnd[farPtr]]].end < nk.start - 2) {
      const j = byEnd[farPtr];
      if (j < k && dp[j] > bestVal) {
        bestVal = dp[j];
        bestIdx = j;
      }
      farPtr++;
    }
    let base = bestVal;
    let from = bestIdx;
    for (let j = k - 1; j >= 0 && j >= k - 400; j--) {
      const nj = notes[idx[j]];
      // Legato notes ring into the next one; allow some overlap (trimmed later).
      if (nj.end > nk.start + Math.max(overlapTol, Math.min(0.35, 0.5 * dur(nj)))) continue;
      if (nj.start > nk.start - 0.05) continue;
      if (nj.end < nk.start - 2) continue;
      const gap = nk.start - nj.end;
      const leap = Math.abs(nk.pitch - nj.pitch);
      const trans = (gap < 0.2 ? 0.25 : 0) - 0.04 * Math.max(0, leap - 7);
      const v = dp[j] + trans;
      if (v > base) {
        base = v;
        from = j;
      }
    }
    dp[k] = w[k] + Math.max(0, base);
    prev[k] = base > 0 ? from : -1;
  }
  let end = -1;
  let best = 0;
  for (let k = 0; k < m; k++)
    if (dp[k] > best) {
      best = dp[k];
      end = k;
    }
  const chosen = new Set<number>();
  for (let k = end; k >= 0; k = prev[k]) {
    // Keep only notes that are themselves plausibly bowed.
    if (bowedScore(notes[idx[k]]) + opt.celloBias > -0.1) chosen.add(idx[k]);
  }
  return chosen;
}

/** Joins cello notes that are one bowed note split in two (same pitch, touching, second not re-attacked). */
function joinCelloFragments(line: LabeledNote[]): LabeledNote[] {
  const out: LabeledNote[] = [];
  for (const n of [...line].sort((a, b) => a.start - b.start)) {
    const p = out[out.length - 1];
    if (p && p.pitch === n.pitch && n.start - p.end < 0.05 && (dur(p) < 0.4 || n.attack < 0.7)) {
      p.end = Math.max(p.end, n.end);
      p.vibrato = Math.max(p.vibrato, n.vibrato);
      continue;
    }
    out.push({ ...n });
  }
  // Monophonic: trim overlaps.
  for (let i = 0; i + 1 < out.length; i++) if (out[i].end > out[i + 1].start) out[i].end = out[i + 1].start;
  return out.filter((n) => dur(n) > 0.03);
}

/** Joins same-pitch touching notes when one of them is clearly bowed (a note split by vibrato). */
function joinBowedFragments(input: RawNote[]): RawNote[] {
  const sorted = [...input].sort((a, b) => a.pitch - b.pitch || a.start - b.start);
  const out: RawNote[] = [];
  for (const n of sorted) {
    const p = out[out.length - 1];
    if (
      p &&
      p.pitch === n.pitch &&
      n.start - p.end < 0.05 &&
      n.attack < 0.75 &&
      (p.vibrato > 0.2 || n.vibrato > 0.2 || p.sustain > 1.1)
    ) {
      const dp = dur(p);
      const dn = dur(n);
      p.vibrato = (p.vibrato * dp + n.vibrato * dn) / (dp + dn);
      p.sustain = Math.max(p.sustain, n.sustain);
      p.amp = (p.amp * dp + n.amp * dn) / (dp + dn);
      p.end = Math.max(p.end, n.end);
      continue;
    }
    out.push({ ...n });
  }
  return out.sort((a, b) => a.start - b.start || a.pitch - b.pitch);
}

export function assignInstruments(input: RawNote[], opt: AssignOptions = DEFAULT_ASSIGN): LabeledNote[] {
  const notes = removeGhosts(joinBowedFragments(input));
  if (opt.mode === 'piano') return notes.map((n) => ({ ...n, instrument: 'piano' as Instrument }));

  const cello = celloLine(notes, opt);
  // The first moment of a bowed note (before vibrato settles) is often detected as a
  // separate short note; pull such lead-ins into the cello note that follows them.
  for (const i of [...cello]) {
    const c = notes[i];
    notes.forEach((n, j) => {
      if (!cello.has(j) && n.pitch === c.pitch && n.start < c.start && Math.abs(n.end - c.start) < 0.05 && dur(n) < 0.5)
        cello.add(j);
    });
  }
  const celloNotes = joinCelloFragments(
    notes.filter((_, i) => cello.has(i)).map((n) => ({ ...n, instrument: 'cello' as Instrument })),
  );
  if (opt.mode === 'cello') return celloNotes;

  const rest: LabeledNote[] = [];
  notes.forEach((n, i) => {
    if (cello.has(i)) return;
    // Doubled by the cello line at the same pitch: merged fragment, not a separate piano note.
    if (celloNotes.some((c) => c.pitch === n.pitch && n.start >= c.start - 0.05 && n.end <= c.end + 0.05 && n.attack < 0.7))
      return;
    let instrument: Instrument = 'piano';
    if (opt.mode === 'piano+cello+other') {
      const s = bowedScore(n) + opt.celloBias;
      const echoesCello = celloNotes.some(
        (c) => [12, 19, 24].includes(Math.abs(n.pitch - c.pitch)) && n.start < c.end && n.end > c.start,
      );
      if (s > 0.45 && !echoesCello && dur(n) > 0.25) instrument = 'other';
    }
    rest.push({ ...n, instrument });
  });
  return [...celloNotes, ...rest].sort((a, b) => a.start - b.start || a.pitch - b.pitch);
}
