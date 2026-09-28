// Piano-specialist transcription: Google Magenta's "Onsets and Frames" (Apache-2.0),
// trained on hundreds of hours of real concert-piano recordings (MAESTRO).
// Ported from magenta-js to our TF.js version, without the velocity branch.
import * as tf from '@tensorflow/tfjs';
import { resample } from './resample';

export const PIANO_SR = 16000;
export const PIANO_HOP = 512;
export const PIANO_FPS = PIANO_SR / PIANO_HOP; // 31.25 frames per second
const MEL_BINS = 229;
const N_FFT = 2048;
const PITCHES = 88;
const RF_PAD = 3;
const CHUNK = 250;

// ------------------------------------------------------------------ features

function fftInPlace(re: Float64Array, im: Float64Array) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wr = Math.cos(ang);
    const wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1;
      let ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const a = i + k;
        const b = a + len / 2;
        const tr = re[b] * cr - im[b] * ci;
        const ti = re[b] * ci + im[b] * cr;
        re[b] = re[a] - tr;
        im[b] = im[a] - ti;
        re[a] += tr;
        im[a] += ti;
        const ncr = cr * wr - ci * wi;
        ci = cr * wi + ci * wr;
        cr = ncr;
      }
    }
  }
}

let melBank: { lo: number; weights: Float32Array }[] | null = null;
function melFilterbank() {
  if (melBank) return melBank;
  const hzToMel = (hz: number) => 1125 * Math.log(1 + hz / 700);
  const melToHz = (m: number) => 700 * (Math.exp(m / 1125) - 1);
  const nBins = N_FFT / 2 + 1;
  const fftFreqs = Array.from({ length: nBins }, (_, i) => (i * PIANO_SR) / 2 / (nBins - 1));
  const mMin = hzToMel(30);
  const mMax = hzToMel(PIANO_SR / 2);
  const melFreqs = Array.from({ length: MEL_BINS + 2 }, (_, i) => melToHz(mMin + ((mMax - mMin) * i) / (MEL_BINS + 1)));
  melBank = [];
  for (let m = 0; m < MEL_BINS; m++) {
    const w = new Float32Array(nBins);
    const enorm = 2 / (melFreqs[m + 2] - melFreqs[m]);
    let lo = -1;
    for (let j = 0; j < nBins; j++) {
      const lower = (fftFreqs[j] - melFreqs[m]) / (melFreqs[m + 1] - melFreqs[m]);
      const upper = (melFreqs[m + 2] - fftFreqs[j]) / (melFreqs[m + 2] - melFreqs[m + 1]);
      w[j] = Math.max(0, Math.min(lower, upper)) * enorm;
      if (w[j] > 0 && lo < 0) lo = j;
    }
    melBank.push({ lo: Math.max(0, lo), weights: w });
  }
  return melBank;
}

/** Log-mel spectrogram exactly as the model was trained on (frames x 229, dB). */
export function melSpectrogram(audio16k: Float32Array): { data: Float32Array; nFrames: number } {
  const pad = N_FFT / 2;
  const y = new Float32Array(audio16k.length + 2 * pad);
  y.set(audio16k, pad);
  for (let i = 0; i < pad; i++) {
    y[i] = y[2 * pad - i];
    y[y.length - i - 1] = y[y.length - 2 * pad + i - 1];
  }
  const nFrames = Math.floor((y.length - N_FFT) / PIANO_HOP) + 1;
  const win = new Float64Array(N_FFT);
  for (let i = 0; i < N_FFT; i++) win[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (N_FFT - 1)));
  const bank = melFilterbank();
  const out = new Float32Array(nFrames * MEL_BINS);
  const re = new Float64Array(N_FFT);
  const im = new Float64Array(N_FFT);
  const power = new Float64Array(N_FFT / 2 + 1);
  for (let f = 0; f < nFrames; f++) {
    const off = f * PIANO_HOP;
    for (let i = 0; i < N_FFT; i++) {
      re[i] = y[off + i] * win[i];
      im[i] = 0;
    }
    fftInPlace(re, im);
    for (let k = 0; k <= N_FFT / 2; k++) power[k] = re[k] * re[k] + im[k] * im[k];
    let max = -Infinity;
    for (let m = 0; m < MEL_BINS; m++) {
      const { lo, weights } = bank[m];
      let s = 0;
      for (let k = lo; k < weights.length; k++) {
        const w = weights[k];
        if (w === 0 && k > lo) break;
        s += w * power[k];
      }
      const db = 10 * Math.log10(Math.max(1e-10, s));
      out[f * MEL_BINS + m] = db;
      if (db > max) max = db;
    }
    for (let m = 0; m < MEL_BINS; m++) out[f * MEL_BINS + m] = Math.max(out[f * MEL_BINS + m], max - 80);
  }
  return { data: out, nFrames };
}

// ------------------------------------------------------------------ network

function acousticCnn(finalActivation?: 'sigmoid'): tf.Sequential {
  const nn = tf.sequential();
  const conv = (filters: number, first = false) =>
    tf.layers.conv2d({
      filters,
      kernelSize: [3, 3],
      activation: 'linear',
      useBias: false,
      padding: 'same',
      ...(first ? { inputShape: [null, MEL_BINS, 1] } : {}),
      trainable: false,
    });
  const bn = () => tf.layers.batchNormalization({ scale: false, trainable: false });
  const relu = () => tf.layers.activation({ activation: 'relu' });
  nn.add(conv(48, true));
  nn.add(bn());
  nn.add(relu());
  nn.add(conv(48));
  nn.add(bn());
  nn.add(relu());
  nn.add(tf.layers.maxPooling2d({ poolSize: [1, 2], strides: [1, 2] }));
  nn.add(conv(96));
  nn.add(bn());
  nn.add(relu());
  nn.add(tf.layers.maxPooling2d({ poolSize: [1, 2], strides: [1, 2] }));
  const dims = nn.outputShape as number[];
  nn.add(tf.layers.reshape({ targetShape: [dims[1] ?? -1, dims[2] * dims[3]] }));
  nn.add(tf.layers.dense({ units: 768, activation: 'relu', trainable: false }));
  if (finalActivation) nn.add(tf.layers.dense({ units: PITCHES, activation: finalActivation, trainable: false }));
  return nn;
}

function setCnnWeights(nn: tf.Sequential, vars: tf.NamedTensorMap, scope: string, dense?: string) {
  const w: tf.Tensor[] = [];
  for (const c of ['conv0', 'conv1', 'conv2'])
    w.push(vars[`${scope}/${c}/weights`], vars[`${scope}/${c}/BatchNorm/beta`], vars[`${scope}/${c}/BatchNorm/moving_mean`], vars[`${scope}/${c}/BatchNorm/moving_variance`]);
  w.push(vars[`${scope}/fc_end/weights`], vars[`${scope}/fc_end/biases`]);
  if (dense) w.push(vars[`${scope}/${dense}/weights`], vars[`${scope}/${dense}/biases`]);
  if (w.some((t) => !t)) throw new Error(`Piano model weights missing for ${scope}`);
  nn.setWeights(w);
}

class Lstm {
  readonly lstm: tf.LayersModel;
  readonly dense = tf.sequential();
  constructor(inputDim: number, readonly units = 384) {
    const layer = tf.layers.lstm({
      units,
      returnSequences: true,
      returnState: true,
      recurrentActivation: 'sigmoid',
      kernelInitializer: 'zeros',
      recurrentInitializer: 'zeros',
      biasInitializer: 'zeros',
      trainable: false,
    });
    const inputs = [tf.input({ shape: [null, inputDim] }), tf.input({ shape: [units] }), tf.input({ shape: [units] })];
    this.lstm = tf.model({ inputs, outputs: layer.apply(inputs) as tf.SymbolicTensor[] });
    this.dense.add(tf.layers.dense({ inputShape: [null, units], units: PITCHES, activation: 'sigmoid', trainable: false }));
  }
  setWeights(vars: tf.NamedTensorMap, scope: string, dense: string) {
    const P = 'cudnn_lstm/rnn/multi_rnn_cell/cell_0/cudnn_compatible_lstm_cell';
    const reorder = (t: tf.Tensor, forgetBias = 0) => {
      const [i, c, f, o] = tf.split(t, 4, -1);
      return tf.concat([i, f.add(forgetBias), c, o], -1);
    };
    const kernel = vars[`${scope}/${P}/kernel`] as tf.Tensor2D;
    const [k, r] = tf.split(reorder(kernel) as tf.Tensor2D, [kernel.shape[0] - this.units, this.units]);
    this.lstm.setWeights([k, r, reorder(vars[`${scope}/${P}/bias`], 1)]);
    this.dense.setWeights([vars[`${scope}/${dense}/weights`], vars[`${scope}/${dense}/biases`]]);
  }
  /** Runs over the whole sequence in chunks, carrying the state. */
  predict(x: tf.Tensor3D): tf.Tensor3D {
    return tf.tidy(() => {
      let h: tf.Tensor = tf.zeros([1, this.units]);
      let c: tf.Tensor = tf.zeros([1, this.units]);
      const outs: tf.Tensor3D[] = [];
      const n = x.shape[1];
      for (let i = 0; i < n; i += CHUNK) {
        const chunk = x.slice([0, i], [-1, Math.min(CHUNK, n - i)]);
        const [seq, h2, c2] = this.lstm.predict([chunk, h, c]) as tf.Tensor[];
        outs.push(this.dense.predict(seq) as tf.Tensor3D);
        h = h2;
        c = c2;
      }
      return outs.length === 1 ? outs[0] : tf.concat3d(outs, 1);
    });
  }
  dispose() {
    this.lstm.dispose();
    this.dense.dispose();
  }
}

export interface PianoRoll {
  nFrames: number;
  /** Onset probability, frames x 88 (A0..C8). */
  onsets: Float32Array;
  /** Note-active probability, frames x 88. */
  frames: Float32Array;
}

export class PianoModel {
  private onsetsCnn = acousticCnn();
  private onsetsRnn: Lstm;
  private activationCnn = acousticCnn('sigmoid');
  private frameRnn = new Lstm(PITCHES * 2);

  constructor(vars: tf.NamedTensorMap) {
    const shape = this.onsetsCnn.outputShape as number[];
    this.onsetsRnn = new Lstm(shape[2]);
    tf.tidy(() => {
      setCnnWeights(this.onsetsCnn, vars, 'onsets');
      this.onsetsRnn.setWeights(vars, 'onsets', 'onset_probs');
      setCnnWeights(this.activationCnn, vars, 'frame', 'activation_probs');
      this.frameRnn.setWeights(vars, 'frame', 'frame_probs');
    });
  }

  /** Runs on mono audio at any sample rate. Progress 0..1. */
  async transcribe(audio: Float32Array, sampleRate: number, onProgress: (p: number) => void = () => {}): Promise<PianoRoll> {
    const a16 = resample(audio, sampleRate, PIANO_SR);
    const mel = melSpectrogram(a16);
    onProgress(0.05);
    const n = mel.nFrames;
    // Convolutions run on overlapping chunks (keeps memory small on phones).
    const cnnOnsets: tf.Tensor3D[] = [];
    const cnnFrames: tf.Tensor3D[] = [];
    const nChunks = Math.ceil(n / CHUNK);
    for (let ci = 0; ci < nChunks; ci++) {
      const s = ci * CHUNK;
      const e = Math.min(n, s + CHUNK);
      const ps = Math.max(0, s - RF_PAD);
      const pe = Math.min(n, e + RF_PAD);
      const [o, f] = tf.tidy(() => {
        const x = tf.tensor4d(mel.data.subarray(ps * MEL_BINS, pe * MEL_BINS), [1, pe - ps, MEL_BINS, 1]);
        const o = (this.onsetsCnn.predict(x) as tf.Tensor3D).slice([0, s - ps], [-1, e - s]);
        const f = (this.activationCnn.predict(x) as tf.Tensor3D).slice([0, s - ps], [-1, e - s]);
        return [o, f];
      });
      cnnOnsets.push(o);
      cnnFrames.push(f);
      await tf.nextFrame?.();
      onProgress(0.05 + 0.6 * ((ci + 1) / nChunks));
    }
    const onsetFeat = tf.concat3d(cnnOnsets, 1);
    cnnOnsets.forEach((t) => t.dispose());
    const actProbs = tf.concat3d(cnnFrames, 1);
    cnnFrames.forEach((t) => t.dispose());
    const onsetProbs = this.onsetsRnn.predict(onsetFeat);
    onsetFeat.dispose();
    onProgress(0.85);
    const frameIn = tf.concat3d([onsetProbs, actProbs], -1);
    actProbs.dispose();
    const frameProbs = this.frameRnn.predict(frameIn);
    frameIn.dispose();
    const onsets = (await onsetProbs.data()) as Float32Array;
    const frames = (await frameProbs.data()) as Float32Array;
    onsetProbs.dispose();
    frameProbs.dispose();
    onProgress(1);
    return { nFrames: n, onsets: Float32Array.from(onsets), frames: Float32Array.from(frames) };
  }

  dispose() {
    this.onsetsCnn.dispose();
    this.onsetsRnn.dispose();
    this.activationCnn.dispose();
    this.frameRnn.dispose();
  }
}

export interface PianoNote {
  start: number;
  end: number;
  pitch: number;
  /** Peak onset probability (confidence that a piano hammer struck here). */
  conf: number;
}

/** Decodes the piano roll into notes (Magenta's pianorollToNoteSequence). */
export function pianoNotes(roll: PianoRoll, onsetThresh = 0.5, frameThresh = 0.5): PianoNote[] {
  const { nFrames, onsets, frames } = roll;
  const start = new Int32Array(PITCHES).fill(-1);
  const conf = new Float32Array(PITCHES);
  const prevOnset = new Uint8Array(PITCHES);
  const out: PianoNote[] = [];
  const end = (p: number, f: number) => {
    out.push({ start: start[p] / PIANO_FPS, end: f / PIANO_FPS, pitch: p + 21, conf: conf[p] });
    start[p] = -1;
  };
  for (let f = 0; f <= nFrames; f++) {
    for (let p = 0; p < PITCHES; p++) {
      const i = f * PITCHES + p;
      const on = f < nFrames && onsets[i] > onsetThresh;
      const fr = f < nFrames && (frames[i] > frameThresh || on);
      if (on) {
        if (start[p] >= 0) {
          if (!prevOnset[p]) {
            end(p, f);
            start[p] = f;
            conf[p] = onsets[i];
          } else conf[p] = Math.max(conf[p], onsets[i]);
        } else {
          start[p] = f;
          conf[p] = onsets[i];
        }
      } else if (!fr && start[p] >= 0) end(p, f);
      prevOnset[p] = on ? 1 : 0;
    }
  }
  return out.sort((a, b) => a.start - b.start || a.pitch - b.pitch);
}

/** Piano-model onset confidence at a given time and pitch (max over ±2 frames). */
export function hammerAt(roll: PianoRoll, time: number, pitch: number): number {
  const p = pitch - 21;
  if (p < 0 || p >= PITCHES) return 0;
  const f = Math.round(time * PIANO_FPS);
  let m = 0;
  for (let i = Math.max(0, f - 2); i <= Math.min(roll.nFrames - 1, f + 2); i++) m = Math.max(m, roll.onsets[i * PITCHES + p]);
  return m;
}

/** Peaks of piano-onset probability strictly inside a note (after its first 0.1 s). */
export function refiresIn(roll: PianoRoll, start: number, end: number, pitch: number): number {
  const p = pitch - 21;
  if (p < 0 || p >= PITCHES) return 0;
  const on = roll.onsets;
  let peaks = 0;
  const f0 = Math.max(1, Math.ceil((start + 0.1) * PIANO_FPS));
  const f1 = Math.min(roll.nFrames - 2, Math.floor((end - 0.03) * PIANO_FPS));
  for (let f = f0; f <= f1; f++) {
    const v = on[f * PITCHES + p];
    if (v > 0.4 && v >= on[(f - 1) * PITCHES + p] && v >= on[(f + 1) * PITCHES + p]) peaks++;
  }
  return peaks;
}

/** Adds the piano model's view to an analysis: its notes, plus hammer/re-fire cues per note. */
export function withPianoEvidence<
  A extends { notes: { start: number; end: number; pitch: number; hammer?: number; refire?: number }[] },
>(analysis: A, roll: PianoRoll): A & { pianoNotes: PianoNote[] } {
  return {
    ...analysis,
    notes: analysis.notes.map((n) => ({
      ...n,
      hammer: hammerAt(roll, n.start, n.pitch),
      refire: refiresIn(roll, n.start, n.end, n.pitch),
    })),
    pianoNotes: pianoNotes(roll),
  };
}
