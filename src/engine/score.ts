// Builds a notated score (measures, note values, ties, triplets, clefs, hands) from
// instrument-labelled notes in seconds.
import { beatPosition, constantGrid, detectMeter, trackBeats } from './rhythm';
import { detectKey, type Key } from './theory';
import type { Analysis, Instrument, LabeledNote } from './types';

/** Ticks per quarter note. 24 allows 32nds (3) and eighth/16th triplets (8/4). */
export const DIV = 24;

export type Detail = 'simple' | 'normal' | 'detailed';

export interface Meter {
  beats: number;
  beatType: number;
}

export interface ScoreOptions {
  title: string;
  /** null = detect automatically. */
  meter: Meter | null;
  /** null = detect automatically. */
  bpm: number | null;
  /** Follow tempo changes (rubato) instead of a strict metronome grid. */
  followTempo: boolean;
  detail: Detail;
  /** null = detect automatically. */
  key: Key | null;
}

export const DEFAULT_SCORE_OPTIONS: ScoreOptions = {
  title: 'Untitled',
  meter: null,
  bpm: null,
  followTempo: true,
  detail: 'normal',
  key: null,
};

export interface NoteValue {
  /** MusicXML type: whole, half, quarter, eighth, 16th, 32nd. */
  type: string;
  dots: number;
  /** Triplet (3 in the time of 2). */
  triplet: boolean;
}

export interface ScoreEvent {
  /** Empty for a rest. */
  pitches: number[];
  start: number; // ticks from measure start
  dur: number; // ticks
  value: NoteValue;
  /** Tie from the previous event (same pitches). */
  tieStop: boolean;
  tieStart: boolean;
  tupletStart?: boolean;
  tupletStop?: boolean;
  /** Whole-measure rest. */
  measureRest?: boolean;
  beams?: string[];
}

export type ClefName = 'treble' | 'bass' | 'tenor';

export interface StaffData {
  /** One entry per measure. */
  measures: ScoreEvent[][];
  clefs: ClefName[];
}

export interface PartData {
  id: string;
  instrument: Instrument;
  name: string;
  abbreviation: string;
  midiProgram: number;
  staves: StaffData[];
}

export interface MeasureInfo {
  start: number; // absolute ticks
  length: number;
  pickup: boolean;
}

export interface Score {
  title: string;
  key: Key;
  meter: Meter;
  bpm: number;
  measures: MeasureInfo[];
  parts: PartData[];
  /** Beat grid used (seconds), for playback alignment. */
  beatTimes: number[];
}

/** Tempo in quarter notes per minute (score.bpm counts the meter's beat). */
export function quarterBpm(score: Pick<Score, 'bpm' | 'meter'>): number {
  const { beats, beatType } = score.meter;
  if (beatType === 8 && beats % 3 === 0 && beats > 3) return score.bpm * 1.5;
  if (beatType === 2) return score.bpm * 2;
  if (beatType === 8) return score.bpm / 2;
  return score.bpm;
}

interface MeterInfo {
  beatTicks: number;
  measureTicks: number;
  beatsPerBar: number;
  compound: boolean;
}

export function meterInfo(m: Meter): MeterInfo {
  const unit = (4 * DIV) / m.beatType;
  const measureTicks = m.beats * unit;
  const compound = m.beatType === 8 && m.beats % 3 === 0 && m.beats > 3;
  const beatTicks = compound ? unit * 3 : unit;
  return { beatTicks, measureTicks, beatsPerBar: measureTicks / beatTicks, compound };
}

interface TickNote {
  pitch: number;
  start: number;
  end: number;
  instrument: Instrument;
  amp: number;
}

// ---------------------------------------------------------------- quantisation

function grids(detail: Detail, mi: MeterInfo): { binary: number; triplet: number } {
  const binary = detail === 'simple' ? DIV / 2 : DIV / 4;
  let triplet = 0;
  if (detail === 'detailed' && mi.beatTicks === DIV) triplet = DIV / 3;
  return { binary: Math.min(binary, mi.beatTicks), triplet };
}

function quantise(
  notes: LabeledNote[],
  beats: number[],
  origin: number,
  mi: MeterInfo,
  detail: Detail,
): { notes: TickNote[]; tripletBeats: Set<number> } {
  const bt = mi.beatTicks;
  const g = grids(detail, mi);
  const raw = notes.map((n) => ({
    n,
    s: (beatPosition(beats, n.start) - origin) * bt,
    e: (beatPosition(beats, n.end) - origin) * bt,
  }));
  // Decide per beat whether it is written in triplets.
  const tripletBeats = new Set<number>();
  if (g.triplet) {
    const perBeat = new Map<number, number[]>();
    for (const r of raw) {
      const b = Math.floor(r.s / bt + 1e-6);
      if (!perBeat.has(b)) perBeat.set(b, []);
      perBeat.get(b)!.push(r.s - b * bt);
    }
    for (const [b, offs] of perBeat) {
      const inner = offs.filter((o) => o > bt * 0.12 && o < bt * 0.88);
      if (inner.length < 1) continue;
      const err = (step: number) => inner.reduce((a, o) => a + Math.abs(o - Math.round(o / step) * step), 0);
      if (err(g.triplet) < 0.5 * err(g.binary)) tripletBeats.add(b);
    }
  }
  // Hierarchical snapping: prefer the beat, then the half beat, then the fine grid.
  // Human timing wobbles, and simpler positions are far more likely in real music.
  const snap = (t: number) => {
    const b = Math.floor(t / bt);
    const step = tripletBeats.has(b) ? g.triplet : g.binary;
    const levels = [bt];
    if (!tripletBeats.has(b) && bt / 2 >= step && (bt / 2) % step === 0) levels.push(bt / 2);
    if (mi.compound) levels.push(bt / 3);
    levels.push(step);
    const tol = [0.16, 0.09, 0.06];
    for (let i = 0; i < levels.length; i++) {
      const L = levels[i];
      const q = Math.round(t / L) * L;
      if (i === levels.length - 1 || Math.abs(t - q) < (tol[i] ?? 0) * bt) return q;
    }
    return Math.round(t / step) * step;
  };
  const out: TickNote[] = [];
  for (const r of raw) {
    // Bowed notes are detected a little late (the bow needs time to speak).
    const s = snap(r.n.instrument === 'piano' ? r.s : r.s - 0.05 * bt);
    let e = snap(r.e);
    if (e <= s) e = s + (tripletBeats.has(Math.floor(s / bt)) ? g.triplet : g.binary);
    out.push({ pitch: r.n.pitch, start: s, end: e, instrument: r.n.instrument, amp: r.n.amp });
  }
  return { notes: out, tripletBeats };
}

/**
 * Readability: extends notes up to the next onset in the same staff when the gap is short
 * (pianists hold notes with the pedal, detected releases are unreliable anyway).
 */
function fillGaps(notes: TickNote[], maxGap: number): TickNote[] {
  const starts = [...new Set(notes.map((n) => n.start))].sort((a, b) => a - b);
  const nextStart = (t: number) => {
    let lo = 0;
    let hi = starts.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (starts[mid] <= t) lo = mid + 1;
      else hi = mid;
    }
    return lo < starts.length ? starts[lo] : Infinity;
  };
  return notes.map((n) => {
    const nx = nextStart(n.start);
    if (nx !== Infinity && n.end < nx && nx - n.end <= Math.max(maxGap, (n.end - n.start) * 0.5)) return { ...n, end: nx };
    return n;
  });
}

// ---------------------------------------------------------------- piano hands

/** Splits piano notes between right hand (true) and left hand (false). */
function splitHands(notes: TickNote[]): Map<TickNote, boolean> {
  const res = new Map<TickNote, boolean>();
  const byStart = new Map<number, TickNote[]>();
  for (const n of notes) {
    if (!byStart.has(n.start)) byStart.set(n.start, []);
    byStart.get(n.start)!.push(n);
  }
  let rhCenter = 70;
  let lhCenter = 48;
  for (const s of [...byStart.keys()].sort((a, b) => a - b)) {
    const group = byStart.get(s)!.sort((a, b) => a.pitch - b.pitch);
    let bestK = 0;
    let bestCost = Infinity;
    // k = number of notes given to the left hand.
    for (let k = 0; k <= group.length; k++) {
      const lh = group.slice(0, k);
      const rh = group.slice(k);
      let cost = 0;
      const span = (h: TickNote[]) => (h.length ? h[h.length - 1].pitch - h[0].pitch : 0);
      cost += Math.max(0, span(lh) - 12) * 3 + Math.max(0, span(rh) - 12) * 3;
      for (const n of lh) cost += Math.max(0, n.pitch - 62) * 0.8 + Math.abs(n.pitch - lhCenter) * 0.05;
      for (const n of rh) cost += Math.max(0, 57 - n.pitch) * 0.8 + Math.abs(n.pitch - rhCenter) * 0.05;
      if (lh.length > 5 || rh.length > 5) cost += 20;
      if (cost < bestCost) {
        bestCost = cost;
        bestK = k;
      }
    }
    group.forEach((n, i) => res.set(n, i >= bestK));
    const avg = (h: TickNote[]) => h.reduce((a, n) => a + n.pitch, 0) / h.length;
    const lh = group.slice(0, bestK);
    const rh = group.slice(bestK);
    if (lh.length) lhCenter = 0.7 * lhCenter + 0.3 * avg(lh);
    if (rh.length) rhCenter = 0.7 * rhCenter + 0.3 * avg(rh);
  }
  return res;
}

// ---------------------------------------------------------------- note values

const PLAIN: [number, string, number][] = [
  [96, 'whole', 0],
  [72, 'half', 1],
  [48, 'half', 0],
  [36, 'quarter', 1],
  [24, 'quarter', 0],
  [18, 'eighth', 1],
  [12, 'eighth', 0],
  [9, '16th', 1],
  [6, '16th', 0],
  [3, '32nd', 0],
];
const TRIPLET: [number, string][] = [
  [16, 'quarter'],
  [8, 'eighth'],
  [4, '16th'],
];

function valueOf(d: number, triplet: boolean): NoteValue | null {
  if (triplet) {
    const t = TRIPLET.find(([x]) => x === d);
    if (t) return { type: t[1], dots: 0, triplet: true };
  }
  const p = PLAIN.find(([x]) => x === d);
  return p ? { type: p[1], dots: p[2], triplet: false } : null;
}

/** Splits a span inside one measure into readable note values (at most crossing beats when on a beat). */
function splitSpan(start: number, len: number, mi: MeterInfo, meter: Meter, tripletBeat: (b: number) => boolean) {
  const out: { start: number; dur: number; value: NoteValue }[] = [];
  const bt = mi.beatTicks;
  let p = start;
  let r = len;
  let guard = 0;
  while (r > 0 && guard++ < 200) {
    const beat = Math.floor(p / bt);
    const nextBeat = (beat + 1) * bt;
    const trip = tripletBeat(beat);
    let limit = r;
    if (p % bt !== 0 || trip) limit = Math.min(r, nextBeat - p);
    // In 4/4 don't hide the middle of the bar unless starting on beat 1.
    if (meter.beats === 4 && meter.beatType === 4 && p < 48 && p + limit > 48 && p !== 0) limit = 48 - p;
    let chosen: { d: number; v: NoteValue } | null = null;
    if (trip) {
      const off = p - beat * bt;
      if (off === 0 && limit >= bt) chosen = { d: bt, v: valueOf(bt, false)! };
      else if (off % 8 === 0 && limit >= 8) {
        const d = limit >= 16 ? 16 : 8;
        chosen = { d, v: valueOf(d, true)! };
      }
    }
    if (!chosen) {
      for (const [d] of PLAIN) {
        if (d > limit) continue;
        // Keep dotted values on a grid that makes sense (dotted quarter only at 8th positions etc.).
        const unit = d === 72 || d === 36 || d === 18 || d === 9 ? d / 3 : d;
        if (p % Math.min(unit, bt) !== 0 && d >= bt) continue;
        chosen = { d, v: valueOf(d, false)! };
        break;
      }
    }
    if (!chosen) {
      // Remaining odd length (should not happen with our grids): fall back to 32nds.
      chosen = { d: Math.min(r, 3), v: { type: '32nd', dots: 0, triplet: false } };
    }
    out.push({ start: p, dur: chosen.d, value: chosen.v });
    p += chosen.d;
    r -= chosen.d;
  }
  return out;
}

// ---------------------------------------------------------------- staff building

function buildStaff(
  notes: TickNote[],
  measures: MeasureInfo[],
  mi: MeterInfo,
  meter: Meter,
  tripletBeats: Set<number>,
  monophonic: boolean,
): ScoreEvent[][] {
  // Chords: group by onset, duration = until the next onset or the longest note.
  const byStart = new Map<number, TickNote[]>();
  for (const n of notes) {
    if (!byStart.has(n.start)) byStart.set(n.start, []);
    byStart.get(n.start)!.push(n);
  }
  const starts = [...byStart.keys()].sort((a, b) => a - b);
  const chords: { start: number; end: number; pitches: number[] }[] = [];
  starts.forEach((s, i) => {
    let group = byStart.get(s)!;
    if (monophonic) group = [group.reduce((a, b) => (b.amp > a.amp ? b : a))];
    const pitches = [...new Set(group.map((n) => n.pitch))].sort((a, b) => a - b);
    const longest = Math.max(...group.map((n) => n.end));
    const next = i + 1 < starts.length ? starts[i + 1] : Infinity;
    chords.push({ start: s, end: Math.min(longest, next), pitches });
  });

  const tripletBeat = (absBeat: number) => tripletBeats.has(absBeat);
  const out: ScoreEvent[][] = measures.map(() => []);
  const measureIndexAt = (t: number) => {
    let lo = 0;
    let hi = measures.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (measures[mid].start <= t) lo = mid;
      else hi = mid - 1;
    }
    return lo;
  };
  const push = (pitches: number[], s: number, e: number) => {
    let first = true;
    let t = s;
    while (t < e) {
      const mIdx = measureIndexAt(t);
      const m = measures[mIdx];
      const segEnd = Math.min(e, m.start + m.length);
      // Beat numbering is absolute so triplet decisions line up with quantisation.
      const beatOffset = m.start / mi.beatTicks;
      const localStart = t - m.start;
      const pieces = m.pickup
        ? splitSpan(localStart + (mi.measureTicks - m.length), segEnd - t, mi, meter, (b) =>
            tripletBeat(b - mi.beatsPerBar + m.length / mi.beatTicks + beatOffset),
          ).map((p) => ({ ...p, start: p.start - (mi.measureTicks - m.length) }))
        : splitSpan(localStart, segEnd - t, mi, meter, (b) => tripletBeat(b + beatOffset));
      for (const pc of pieces) {
        out[mIdx].push({
          pitches,
          start: pc.start,
          dur: pc.dur,
          value: pc.value,
          tieStop: pitches.length > 0 && !first,
          tieStart: false,
        });
        first = false;
      }
      t = segEnd;
    }
    // Mark tie starts: every piece except the last of this span.
    if (pitches.length) {
      const all: ScoreEvent[] = [];
      for (let i = measureIndexAt(s); i <= measureIndexAt(e - 1); i++)
        for (const ev of out[i]) if (ev.pitches === pitches) all.push(ev);
      for (let i = 0; i + 1 < all.length; i++) all[i].tieStart = true;
    }
  };

  let cursor = measures[0].start;
  for (const c of chords) {
    if (c.start > cursor) push([], cursor, c.start);
    if (c.end > c.start) push(c.pitches, c.start, c.end);
    cursor = Math.max(cursor, c.end);
  }
  const last = measures[measures.length - 1];
  if (cursor < last.start + last.length) push([], cursor, last.start + last.length);

  // Tidy measures: whole-measure rests, merge consecutive rests on beats, triplet brackets, beams.
  out.forEach((evs, i) => {
    const m = measures[i];
    if (evs.every((e) => e.pitches.length === 0)) {
      out[i] = [{ pitches: [], start: 0, dur: m.length, value: { type: 'whole', dots: 0, triplet: false }, tieStop: false, tieStart: false, measureRest: true }];
      return;
    }
    markTuplets(evs, mi, m);
    markBeams(evs, mi, m);
  });
  return out;
}

function beatOf(ev: ScoreEvent, mi: MeterInfo, m: MeasureInfo) {
  const off = m.pickup ? mi.measureTicks - m.length : 0;
  return Math.floor((ev.start + off) / mi.beatTicks);
}

function markTuplets(evs: ScoreEvent[], mi: MeterInfo, m: MeasureInfo) {
  let i = 0;
  while (i < evs.length) {
    if (!evs[i].value.triplet) {
      i++;
      continue;
    }
    const b = beatOf(evs[i], mi, m);
    let j = i;
    while (j < evs.length && beatOf(evs[j], mi, m) === b && evs[j].value.triplet) j++;
    evs[i].tupletStart = true;
    evs[j - 1].tupletStop = true;
    i = j;
  }
}

const FLAGS: Record<string, number> = { eighth: 1, '16th': 2, '32nd': 3 };

function markBeams(evs: ScoreEvent[], mi: MeterInfo, m: MeasureInfo) {
  // Group beamable notes (eighth or shorter) that fall in the same beat.
  let i = 0;
  while (i < evs.length) {
    const f = FLAGS[evs[i].value.type] ?? 0;
    if (!f || !evs[i].pitches.length) {
      i++;
      continue;
    }
    const b = beatOf(evs[i], mi, m);
    let j = i;
    while (j < evs.length && evs[j].pitches.length && (FLAGS[evs[j].value.type] ?? 0) > 0 && beatOf(evs[j], mi, m) === b) j++;
    const group = evs.slice(i, j);
    if (group.length >= 2) {
      for (let level = 1; level <= 3; level++) {
        const has = group.map((e) => (FLAGS[e.value.type] ?? 0) >= level);
        for (let k = 0; k < group.length; k++) {
          if (!has[k]) continue;
          const prev = k > 0 && has[k - 1];
          const next = k + 1 < group.length && has[k + 1];
          let v: string;
          if (level === 1) v = !prev ? 'begin' : !next ? 'end' : 'continue';
          else if (!prev && !next) v = k === 0 ? 'forward hook' : 'backward hook';
          else v = !prev ? 'begin' : !next ? 'end' : 'continue';
          (group[k].beams ??= []).push(v);
        }
      }
    }
    i = Math.max(j, i + 1);
  }
}

function chooseClefs(staff: ScoreEvent[][], instrument: Instrument, hand?: 'rh' | 'lh'): ClefName[] {
  if (hand === 'rh') return staff.map(() => 'treble');
  if (hand === 'lh') return staff.map(() => 'bass');
  const avg = staff.map((evs) => {
    const ps = evs.flatMap((e) => e.pitches);
    return ps.length ? ps.reduce((a, b) => a + b, 0) / ps.length : null;
  });
  if (instrument === 'other') {
    const all = avg.filter((a): a is number => a !== null);
    const med = all.length ? all.sort((a, b) => a - b)[Math.floor(all.length / 2)] : 65;
    return staff.map(() => (med < 57 ? 'bass' : 'treble'));
  }
  // Cello: bass clef, tenor for high passages, treble for very high ones (with hysteresis).
  let cur: ClefName = 'bass';
  return avg.map((a) => {
    if (a === null) return cur;
    if (cur === 'bass' && a > 64) cur = a > 72 ? 'treble' : 'tenor';
    else if (cur === 'tenor' && (a < 59 || a > 74)) cur = a < 59 ? 'bass' : 'treble';
    else if (cur === 'treble' && a < 67) cur = a < 59 ? 'bass' : 'tenor';
    return cur;
  });
}

// ---------------------------------------------------------------- main entry

export interface RhythmResult {
  beats: number[];
  bpm: number;
  meter: Meter;
  phase: number;
}

export function analyseRhythm(analysis: Analysis, notes: LabeledNote[], opt: ScoreOptions): RhythmResult {
  const tracked = trackBeats(analysis.onsetEnv, analysis.envRate, analysis.duration, { bpm: opt.bpm ?? undefined });
  let beats = tracked.beats;
  if (!opt.followTempo) beats = constantGrid(beats, analysis.duration, opt.bpm ?? undefined);
  let meter: Meter;
  let phase: number;
  if (opt.meter) {
    meter = opt.meter;
    const mi = meterInfo(meter);
    const bpb = mi.beatsPerBar;
    phase = detectMeter(beats, notes, [bpb]).phase;
  } else {
    const d = detectMeter(beats, notes, [3, 4]);
    meter = { beats: d.beatsPerBar, beatType: 4 };
    phase = d.phase;
  }
  const d = beats.slice(1).map((b, i) => b - beats[i]).sort((a, b) => a - b);
  const bpm = opt.bpm ?? (d.length ? 60 / d[Math.floor(d.length / 2)] : tracked.bpm);
  return { beats, bpm, meter, phase };
}

const PART_DEFS: Record<Instrument, { name: string; abbreviation: string; program: number }> = {
  cello: { name: 'Cello', abbreviation: 'Vc.', program: 42 },
  piano: { name: 'Piano', abbreviation: 'Pno.', program: 0 },
  other: { name: 'Other', abbreviation: 'Oth.', program: 48 },
};

export function buildScore(analysis: Analysis, labeled: LabeledNote[], opt: ScoreOptions): Score {
  const rhythm = analyseRhythm(analysis, labeled, opt);
  const { beats, meter } = rhythm;
  const mi = meterInfo(meter);
  const key = opt.key ?? detectKey(labeled);

  // Where does bar 1 start? First downbeat at or before the first note, or a pickup bar.
  const firstPos = labeled.length ? Math.min(...labeled.map((n) => beatPosition(beats, n.start))) : 0;
  const fb = Math.floor(firstPos + 0.15);
  const bpb = mi.beatsPerBar;
  const downBefore = rhythm.phase + Math.floor((fb - rhythm.phase) / bpb) * bpb;
  let origin = downBefore;
  let pickupTicks = 0;
  if (fb > downBefore) {
    origin = fb;
    pickupTicks = (downBefore + bpb - fb) * mi.beatTicks;
  }

  const { notes: ticked, tripletBeats } = quantise(labeled, beats, origin, mi, opt.detail);
  const endTick = Math.max(mi.measureTicks, ...ticked.map((n) => n.end));
  const measures: MeasureInfo[] = [];
  let t = 0;
  if (pickupTicks > 0) {
    measures.push({ start: 0, length: pickupTicks, pickup: true });
    t = pickupTicks;
  }
  while (t < endTick) {
    measures.push({ start: t, length: mi.measureTicks, pickup: false });
    t += mi.measureTicks;
  }

  const parts: PartData[] = [];
  const order: Instrument[] = ['other', 'cello', 'piano'];
  for (const ins of order) {
    const ns = ticked.filter((n) => n.instrument === ins && n.start >= 0);
    if (!ns.length) continue;
    const def = PART_DEFS[ins];
    const staves: StaffData[] = [];
    if (ins === 'piano') {
      const hands = splitHands(ns);
      const gap = opt.detail === 'detailed' ? mi.beatTicks / 4 : mi.beatTicks / 2;
      const rh = fillGaps(ns.filter((n) => hands.get(n)), gap);
      const lh = fillGaps(ns.filter((n) => !hands.get(n)), gap);
      const rhM = buildStaff(rh, measures, mi, meter, tripletBeats, false);
      const lhM = buildStaff(lh, measures, mi, meter, tripletBeats, false);
      staves.push({ measures: rhM, clefs: chooseClefs(rhM, ins, 'rh') });
      staves.push({ measures: lhM, clefs: chooseClefs(lhM, ins, 'lh') });
    } else {
      const sm = buildStaff(fillGaps(ns, mi.beatTicks / 4), measures, mi, meter, tripletBeats, ins === 'cello');
      staves.push({ measures: sm, clefs: chooseClefs(sm, ins) });
    }
    parts.push({
      id: `P${parts.length + 1}`,
      instrument: ins,
      name: def.name,
      abbreviation: def.abbreviation,
      midiProgram: def.program,
      staves,
    });
  }

  // Beat times aligned to tick 0, for playback.
  const beatTimes = beats.slice(Math.max(0, origin));
  return {
    title: opt.title,
    key,
    meter,
    bpm: Math.round(rhythm.bpm),
    measures,
    parts,
    beatTimes,
  };
}
