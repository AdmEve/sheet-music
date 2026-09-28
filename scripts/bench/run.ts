// Benchmark: runs the engine on every test-audio/bench/*.wav and scores it against the
// ground truth written by make_bench.py.
//
//   npx vite-node scripts/bench/run.ts [filter]
//
// Network outputs are cached next to the audio, so re-running after engine changes is fast.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadNodeModel, loadWav22k } from '../../tests/node-helpers';
import { runModel } from '../../src/engine/basicpitch';
import { assignInstruments, DEFAULT_ASSIGN } from '../../src/engine/assign';
import { analyse, noteOptionsForSensitivity } from '../../src/engine/notes';
import { buildScore, DEFAULT_SCORE_OPTIONS, DIV, type Score, type ScoreOptions } from '../../src/engine/score';
import { scoreNotes } from '../../src/engine/midi';
import type { Analysis, LabeledNote, Posteriors } from '../../src/engine/types';
import { withPianoEvidence, type PianoRoll } from '../../src/engine/pianomodel';
import { withEnvelopes } from '../../src/engine/timbre';
import { loadWav22k as loadAudio } from '../../tests/node-helpers';

const usePiano = !process.argv.includes('--no-piano');

const DIR = 'test-audio/bench';
const filter = process.argv.slice(2).find((a) => !a.startsWith('--')) ?? '';

interface Truth {
  name: string;
  bpm: number;
  meter: { beats: number; beatType: number };
  key: { fifths: number; mode: string };
  notes: { instrument: string; pitch: number; start: number; end: number; startQ: number; durQ: number }[];
}

function savePost(path: string, p: Posteriors) {
  const o = new Float32Array(1 + p.frames.length * 2 + p.contours.length);
  o[0] = p.nFrames;
  o.set(p.frames, 1);
  o.set(p.onsets, 1 + p.frames.length);
  o.set(p.contours, 1 + 2 * p.frames.length);
  writeFileSync(path, Buffer.from(o.buffer));
}
function loadPost(path: string): Posteriors {
  const raw = new Float32Array(readFileSync(path).buffer.slice(0));
  const n = raw[0];
  return {
    nFrames: n,
    frames: raw.slice(1, 1 + n * 88),
    onsets: raw.slice(1 + n * 88, 1 + 2 * n * 88),
    contours: raw.slice(1 + 2 * n * 88),
  };
}

/** Onset F1 for one instrument (pitch exact, onset within tol seconds). */
function f1(det: LabeledNote[], truth: Truth['notes'], ins: string, tol: number) {
  const g = truth.filter((n) => n.instrument === ins);
  const d = det.filter((n) => n.instrument === ins);
  const used = new Set<number>();
  let tp = 0;
  for (const n of d) {
    let best = -1;
    let bestErr = tol;
    g.forEach((x, i) => {
      const e = Math.abs(x.start - n.start);
      if (!used.has(i) && x.pitch === n.pitch && e <= bestErr) {
        best = i;
        bestErr = e;
      }
    });
    if (best >= 0) {
      used.add(best);
      tp++;
    }
  }
  const P = d.length ? tp / d.length : 0;
  const R = g.length ? tp / g.length : 0;
  return { P, R, F: P + R ? (2 * P * R) / (P + R) : 0 };
}

/**
 * Notation accuracy: share of true notes that appear in the score with the right pitch,
 * the right instrument and exactly the right rhythmic position (after aligning bar 1).
 */
function notation(score: Score, truth: Truth, ins: string) {
  const out = scoreNotes(score)
    .map((n) => ({ ...n, instrument: score.parts[n.part].instrument }))
    .filter((n) => n.instrument === ins);
  const g = truth.notes.filter((n) => n.instrument === ins);
  // Best global offset between truth (quarters) and output (ticks).
  const diffs = new Map<number, number>();
  for (const x of g)
    for (const o of out) if (o.pitch === x.pitch) diffs.set(o.start - Math.round(x.startQ * DIV), (diffs.get(o.start - Math.round(x.startQ * DIV)) ?? 0) + 1);
  let off = 0;
  let bestC = -1;
  for (const [d, c] of diffs)
    if (c > bestC) {
      bestC = c;
      off = d;
    }
  const used = new Set<number>();
  let exact = 0;
  for (const x of g) {
    const want = Math.round(x.startQ * DIV) + off;
    const k = out.findIndex((o, i) => !used.has(i) && o.pitch === x.pitch && o.start === want);
    if (k >= 0) {
      used.add(k);
      exact++;
    }
  }
  const P = out.length ? exact / out.length : 0;
  const R = g.length ? exact / g.length : 0;
  return P + R ? (2 * P * R) / (P + R) : 0;
}

const pct = (x: number) => `${Math.round(x * 100)}`.padStart(3);

const wavs = readdirSync(DIR).filter((f) => f.endsWith('.wav') && f.includes(filter)).sort();
const model = wavs.some((w) => !existsSync(join(DIR, w + '.bp.bin'))) ? loadNodeModel() : null;
const totals: Record<string, number[]> = {};
const add = (k: string, v: number) => (totals[k] ??= []).push(v);

console.log('piece                  | piano F1 | cello F1 | score:piano cello | meter key  bpm   | given meter+bpm: piano cello');
for (const wav of wavs) {
  const truth: Truth = JSON.parse(readFileSync(join(DIR, wav.replace(/-(fluid|musescore|timgm)\.wav$/, '.json')), 'utf8'));
  const cache = join(DIR, wav + '.bp.bin');
  let post: Posteriors;
  if (existsSync(cache)) post = loadPost(cache);
  else {
    post = await runModel(loadWav22k(join(DIR, wav)), model!);
    savePost(cache, post);
  }
  let analysis: Analysis = analyse(post, noteOptionsForSensitivity(0.6));
  const pianoCache = join(DIR, wav + '.piano.bin');
  if (usePiano && existsSync(pianoCache)) {
    const raw = new Float32Array(readFileSync(pianoCache).buffer.slice(0));
    const m = raw[0];
    const roll: PianoRoll = { nFrames: m, onsets: raw.slice(1, 1 + m * 88), frames: raw.slice(1 + m * 88) };
    analysis = withEnvelopes(withPianoEvidence(analysis, roll), loadAudio(join(DIR, wav)), 22050);
  } else if (usePiano) console.error('no piano-model cache for', wav);
  const labeled = assignInstruments(analysis.notes, DEFAULT_ASSIGN, analysis.pianoNotes);
  const opts: ScoreOptions = { ...DEFAULT_SCORE_OPTIONS, title: truth.name };
  const auto = buildScore(analysis, labeled, opts);
  const given = buildScore(analysis, labeled, { ...opts, meter: truth.meter, bpm: truth.bpm });
  const fp = f1(labeled, truth.notes, 'piano', 0.05);
  const fc = f1(labeled, truth.notes, 'cello', 0.1);
  const np = notation(auto, truth, 'piano');
  const nc = notation(auto, truth, 'cello');
  const gp = notation(given, truth, 'piano');
  const gc = notation(given, truth, 'cello');
  const meterOk = auto.meter.beats === truth.meter.beats && auto.meter.beatType === truth.meter.beatType;
  const keyOk = auto.key.fifths === truth.key.fifths;
  const bpmOk = Math.abs(auto.bpm / truth.bpm - 1) < 0.08;
  for (const [k, v] of Object.entries({ pianoF1: fp.F, celloF1: fc.F, scorePiano: np, scoreCello: nc, meter: +meterOk, key: +keyOk, bpm: +bpmOk, givenPiano: gp, givenCello: gc }))
    add(k, v);
  console.log(
    `${wav.replace('.wav', '').padEnd(22)} |   ${pct(fp.F)}    |   ${pct(fc.F)}    |       ${pct(np)}   ${pct(nc)}   | ${meterOk ? ' ok ' : `${auto.meter.beats}/${auto.meter.beatType}`.padEnd(4)}  ${keyOk ? 'ok ' : String(auto.key.fifths).padEnd(3)} ${bpmOk ? ' ok ' : String(auto.bpm).padEnd(4)}  |       ${pct(gp)}   ${pct(gc)}`,
  );
}
const avg = (k: string) => totals[k].reduce((a, b) => a + b, 0) / totals[k].length;
console.log(
  `${'AVERAGE'.padEnd(22)} |   ${pct(avg('pianoF1'))}    |   ${pct(avg('celloF1'))}    |       ${pct(avg('scorePiano'))}   ${pct(avg('scoreCello'))}   | ${pct(avg('meter'))}% ${pct(avg('key'))}% ${pct(avg('bpm'))}% |       ${pct(avg('givenPiano'))}   ${pct(avg('givenCello'))}`,
);
