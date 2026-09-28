// Decides which instrument played each note.
//
// Neural transcription finds pitches but not instruments. We use what distinguishes a
// bowed cello from a hammered piano: vibrato, notes that keep (or grow) their strength,
// soft attacks, a single melodic line inside the cello's range. The cello line is chosen
// with dynamic programming (best-scoring non-overlapping, smoothly connected notes).
import type { Instrument, LabeledNote, RawNote } from './types';

export interface AssignOptions {
  /** Lowest/highest cello pitch considered (MIDI). */
  celloLow: number;
  celloHigh: number;
  /** Bias towards (+) or away from (−) giving notes to the cello. */
  celloBias: number;
}

export const DEFAULT_ASSIGN: AssignOptions = {
  celloLow: 36,
  celloHigh: 84,
  celloBias: 0,
};

const dur = (n: RawNote) => n.end - n.start;

/**
 * How much a note sounds like a bowed string (positive) vs. a struck piano key (negative).
 *
 * With the full set of cues (piano-model re-fires, attack time and decay measured from the
 * audio) this is a logistic-regression classifier fitted on the piano+cello benchmark
 * (scripts/bench/fit_classifier.py, three sound sets; ~87% accuracy on a held-out sound set). Its log-odds
 * are scaled to the range the cello-line search expects. Without those cues (older
 * saved pieces) a hand-made rule is used.
 */
export function bowedScore(n: RawNote): number {
  const vib = Math.min(n.vibrato, 0.8);
  const sus = Math.max(-0.5, Math.min(0.8, n.sustain - 0.9));
  const len = Math.max(-1, Math.min(1.5, Math.log2(dur(n) / 0.4)));
  if (n.refire !== undefined && n.attackTime !== undefined && n.decay !== undefined) {
    const logit =
      2.807 * vib +
      1.313 * sus -
      0.703 * (n.attack - 0.6) -
      1.265 * len +
      2.897 * (n.refire >= 1 ? 1 : 0) +
      2.089 * (Math.min(n.refire, 3) / 3) +
      1.704 * (Math.min(n.attackTime, 0.3) / 0.3) +
      0.132 * (Math.max(-60, Math.min(20, n.decay)) / 20) +
      1.77 * (n.hammer ?? 0.5) -
      3.64;
    return logit / 2.5;
  }
  const att = 0.6 - n.attack;
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
      (p.vibrato > 0.2 || n.vibrato > 0.2 || p.sustain > 1.1 || (n.refire ?? 0) >= 1 || (p.refire ?? 0) >= 1)
    ) {
      const dp = dur(p);
      const dn = dur(n);
      p.vibrato = (p.vibrato * dp + n.vibrato * dn) / (dp + dn);
      p.sustain = Math.max(p.sustain, n.sustain);
      p.amp = (p.amp * dp + n.amp * dn) / (dp + dn);
      p.end = Math.max(p.end, n.end);
      // The merged note re-fires where the second part began, plus inside it.
      if (p.refire !== undefined || n.refire !== undefined) p.refire = (p.refire ?? 0) + (n.refire ?? 0) + 1;
      if (p.attackTime !== undefined && n.attackTime !== undefined && dp < 0.3) p.attackTime = Math.max(p.attackTime, dp + n.attackTime);
      if (n.decay !== undefined && dn > dp) p.decay = n.decay;
      continue;
    }
    out.push({ ...n });
  }
  return out.sort((a, b) => a.start - b.start || a.pitch - b.pitch);
}

/** A note from the piano-specialist model. */
export interface PianoModelNote {
  start: number;
  end: number;
  pitch: number;
  conf: number;
}

/**
 * The piano model reacts to real notes of both instruments but almost never to the
 * overtones and blips the general model invents, so notes it did not register at all
 * are dropped (unless they are unmistakably bowed).
 */
function realNotesOnly(notes: RawNote[]): RawNote[] {
  if (!notes.some((n) => n.hammer !== undefined)) return notes;
  return notes.filter((n) => n.hammer === undefined || n.hammer >= 0.06 || (bowedScore(n) > 0.8 && dur(n) > 0.5));
}

export function assignInstruments(
  input: RawNote[],
  opt: AssignOptions = DEFAULT_ASSIGN,
  pianoModel?: PianoModelNote[],
): LabeledNote[] {
  const notes = removeGhosts(joinBowedFragments(realNotesOnly(input)));
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
  if (pianoModel?.length) {
    // Piano part from the piano specialist, minus what is really the cello: the piano
    // model re-fires on a bowed note's vibrato at the cello's own pitch.
    // A re-trigger inside a note that is already sounding at that pitch is never a new
    // piano note (a real re-strike shows up as a fresh note in the general model too).
    const sounding = (o: PianoModelNote) =>
      notes.some((n) => n.pitch === o.pitch && o.start > n.start + 0.08 && o.start < n.end - 0.05);
    // Piano doubling the cello's note: keep it when it is half of a piano octave struck
    // together (a very common left-hand pattern), since the cello cannot explain both.
    const octaveMate = (o: PianoModelNote) =>
      pianoModel.some((q) => Math.abs(q.pitch - o.pitch) === 12 && Math.abs(q.start - o.start) < 0.02 && !celloNotes.some((c) => c.pitch === q.pitch && Math.abs(c.start - q.start) < 0.1));
    const explainedByCello = (o: PianoModelNote) =>
      celloNotes.some((c) => c.pitch === o.pitch && o.start >= c.start - 0.1 && o.start < c.end - 0.02) &&
      !(octaveMate(o) && celloNotes.some((c) => c.pitch === o.pitch && Math.abs(o.start - c.start) < 0.1));
    const fromModel = pianoModel.filter((o) => !explainedByCello(o)).filter((o) => !sounding(o));
    // Chord notes the piano model missed but the general model heard (and the piano model
    // saw at least a hint of a hammer): add them.
    const missed = notes
      .filter((n, i) => !cello.has(i) && (n.hammer ?? 0) >= 0.2 && bowedScore(n) < 0)
      .filter((n) => !fromModel.some((o) => o.pitch === n.pitch && Math.abs(o.start - n.start) < 0.08))
      .filter((n) => !celloNotes.some((c) => c.pitch === n.pitch && n.start >= c.start - 0.1 && n.start < c.end))
      .map((n) => ({ start: n.start, end: n.end, pitch: n.pitch, conf: n.hammer ?? 0.2 }));
    const piano: LabeledNote[] = [...fromModel, ...missed]
      .map((o) => ({
        start: o.start,
        end: Math.max(o.end, o.start + 0.05),
        pitch: o.pitch,
        amp: o.conf,
        vibrato: 0,
        sustain: 0.7,
        attack: o.conf,
        hammer: o.conf,
        instrument: 'piano' as Instrument,
      }));
    return [...celloNotes, ...piano].sort((a, b) => a.start - b.start || a.pitch - b.pitch);
  }

  const rest: LabeledNote[] = [];
  notes.forEach((n, i) => {
    if (cello.has(i)) return;
    // Doubled by the cello line at the same pitch: merged fragment, not a separate piano note.
    if (celloNotes.some((c) => c.pitch === n.pitch && n.start >= c.start - 0.05 && n.end <= c.end + 0.05 && n.attack < 0.7))
      return;
    const instrument: Instrument = 'piano';
    rest.push({ ...n, instrument });
  });
  return [...celloNotes, ...rest].sort((a, b) => a.start - b.start || a.pitch - b.pitch);
}
