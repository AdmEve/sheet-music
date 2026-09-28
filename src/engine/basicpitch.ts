// Runs Spotify's Basic Pitch model (Apache-2.0, bundled offline) over mono 22050 Hz audio.
import * as tf from '@tensorflow/tfjs';
import { BasicPitch } from '@spotify/basic-pitch';
import type { Posteriors } from './types';

export const SAMPLE_RATE = 22050;
export const FFT_HOP = 256;
export const N_PITCH_BINS = 88;
export const N_CONTOUR_BINS = 264;
export const MIDI_OFFSET = 21;
export const FPS = SAMPLE_RATE / FFT_HOP;

const ANNOTATIONS_FPS = Math.floor(SAMPLE_RATE / FFT_HOP);
const ANNOT_N_FRAMES = ANNOTATIONS_FPS * 2;
const AUDIO_N_SAMPLES = SAMPLE_RATE * 2 - FFT_HOP;
const WINDOW_OFFSET = (FFT_HOP / SAMPLE_RATE) * (ANNOT_N_FRAMES - AUDIO_N_SAMPLES / FFT_HOP) + 0.0018;

/** Model frame index to seconds (same correction as Basic Pitch's own converter). */
export function frameToTime(frame: number): number {
  return (frame * FFT_HOP) / SAMPLE_RATE - WINDOW_OFFSET * Math.floor(frame / ANNOT_N_FRAMES);
}

/** Seconds to the nearest model frame (inverse of frameToTime). */
export function timeToFrame(t: number): number {
  let f = Math.round((t * SAMPLE_RATE) / FFT_HOP);
  for (let it = 0; it < 3; it++) f = Math.round(((t + WINDOW_OFFSET * Math.floor(f / ANNOT_N_FRAMES)) * SAMPLE_RATE) / FFT_HOP);
  return Math.max(0, f);
}

let backendReady: Promise<string> | null = null;

/** Picks the fastest available TF.js backend (WebGL on phones/browsers, CPU otherwise). */
export function initBackend(): Promise<string> {
  if (!backendReady) {
    backendReady = (async () => {
      for (const name of ['webgl', 'cpu']) {
        try {
          if (await tf.setBackend(name)) {
            await tf.ready();
            return name;
          }
        } catch {
          /* try next backend */
        }
      }
      await tf.ready();
      return tf.getBackend();
    })();
  }
  return backendReady;
}

export function loadModel(source: string | tf.io.IOHandler): Promise<tf.GraphModel> {
  return tf.loadGraphModel(source);
}

/**
 * Runs the model over the whole signal. Heavy: ~1 model call per 1.5 s of audio.
 * `onProgress` receives 0..1.
 */
export async function runModel(
  audio: Float32Array,
  model: Promise<tf.GraphModel> | tf.GraphModel,
  onProgress: (p: number) => void = () => {},
): Promise<Posteriors> {
  const bp = new BasicPitch(Promise.resolve(model));
  const chunks: { frames: number[][]; onsets: number[][]; contours: number[][] }[] = [];
  await bp.evaluateModel(
    audio,
    (frames, onsets, contours) => {
      chunks.push({ frames, onsets, contours });
    },
    (p) => onProgress(p),
  );
  let nFrames = 0;
  for (const c of chunks) nFrames += c.frames.length;
  const out: Posteriors = {
    nFrames,
    frames: new Float32Array(nFrames * N_PITCH_BINS),
    onsets: new Float32Array(nFrames * N_PITCH_BINS),
    contours: new Float32Array(nFrames * N_CONTOUR_BINS),
  };
  let row = 0;
  for (const c of chunks) {
    for (let i = 0; i < c.frames.length; i++, row++) {
      out.frames.set(c.frames[i], row * N_PITCH_BINS);
      out.onsets.set(c.onsets[i], row * N_PITCH_BINS);
      out.contours.set(c.contours[i], row * N_CONTOUR_BINS);
    }
  }
  return out;
}
