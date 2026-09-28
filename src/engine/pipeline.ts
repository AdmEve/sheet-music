// High-level API: audio -> analysis (slow, neural network) -> score (fast, re-run on every settings change).
import { assignInstruments, DEFAULT_ASSIGN, type AssignOptions } from './assign';
import { SAMPLE_RATE } from './basicpitch';
import { withPianoEvidence, type PianoRoll } from './pianomodel';
import { withEnvelopes } from './timbre';
import { toMidi } from './midi';
import { toMusicXML } from './musicxml';
import { analyse, noteOptionsForSensitivity } from './notes';
import { buildScore, DEFAULT_SCORE_OPTIONS, type Score, type ScoreOptions } from './score';
import type { Analysis, Posteriors } from './types';

export interface Settings {
  score: ScoreOptions;
  instruments: AssignOptions;
  /** 0..1, how eagerly quiet notes are picked up. */
  sensitivity: number;
}

export const DEFAULT_SETTINGS: Settings = {
  score: DEFAULT_SCORE_OPTIONS,
  instruments: DEFAULT_ASSIGN,
  sensitivity: 0.6,
};

/**
 * Everything that comes from listening: notes from the general model, the piano
 * specialist's view of them, and loudness envelopes measured from the audio.
 */
export function analyseAll(post: Posteriors, roll: PianoRoll | null, audio22k: Float32Array | null, sensitivity: number): Analysis {
  let a = analyse(post, noteOptionsForSensitivity(sensitivity));
  if (roll) a = withPianoEvidence(a, roll);
  if (audio22k) a = withEnvelopes(a, audio22k, SAMPLE_RATE);
  return a;
}

export interface Result {
  score: Score;
  musicxml: string;
  midi: Uint8Array;
}

export function makeScore(analysis: Analysis, settings: Settings): Result {
  const labeled = assignInstruments(analysis.notes, settings.instruments, analysis.pianoNotes);
  const score = buildScore(analysis, labeled, settings.score);
  return { score, musicxml: toMusicXML(score), midi: toMidi(score) };
}
