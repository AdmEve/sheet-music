// High-level API: audio -> analysis (slow, neural network) -> score (fast, re-run on every settings change).
import type * as tf from '@tensorflow/tfjs';
import { assignInstruments, DEFAULT_ASSIGN, type AssignOptions } from './assign';
import { runModel } from './basicpitch';
import { toMidi } from './midi';
import { toMusicXML } from './musicxml';
import { analyse, noteOptionsForSensitivity } from './notes';
import { buildScore, DEFAULT_SCORE_OPTIONS, type Score, type ScoreOptions } from './score';
import type { Analysis } from './types';

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

export async function transcribe(
  audio22k: Float32Array,
  model: Promise<tf.GraphModel> | tf.GraphModel,
  sensitivity: number,
  onProgress: (p: number) => void = () => {},
): Promise<Analysis> {
  const post = await runModel(audio22k, model, onProgress);
  return analyse(post, noteOptionsForSensitivity(sensitivity));
}

export interface Result {
  score: Score;
  musicxml: string;
  midi: Uint8Array;
}

export function makeScore(analysis: Analysis, settings: Settings): Result {
  const labeled = assignInstruments(analysis.notes, settings.instruments);
  const score = buildScore(analysis, labeled, settings.score);
  return { score, musicxml: toMusicXML(score), midi: toMidi(score) };
}
