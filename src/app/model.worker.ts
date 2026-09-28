// Runs both neural networks off the main thread so the app stays responsive:
// 1. Basic Pitch (all notes, with pitch detail used to recognise the cello),
// 2. Onsets and Frames (piano specialist).
import * as tf from '@tensorflow/tfjs';
import { initBackend, loadModel, runModel, SAMPLE_RATE } from '../engine/basicpitch';
import { PianoModel } from '../engine/pianomodel';

type Req = { type: 'run'; audio: Float32Array; modelUrl: string; pianoUrl: string };

let general: ReturnType<typeof loadModel> | null = null;
let piano: Promise<PianoModel> | null = null;

async function loadPiano(url: string): Promise<PianoModel> {
  const manifest = await (await fetch(`${url}/weights_manifest.json`)).json();
  const vars = await tf.io.loadWeights(manifest, url);
  const m = new PianoModel(vars);
  Object.values(vars).forEach((t) => t.dispose());
  return m;
}

self.onmessage = async (e: MessageEvent<Req>) => {
  const { audio, modelUrl, pianoUrl } = e.data;
  try {
    const backend = await initBackend();
    general ??= loadModel(modelUrl);
    piano ??= loadPiano(pianoUrl);
    const post = await runModel(audio, general, (p) => self.postMessage({ type: 'progress', p: 0.4 * p, backend }));
    const roll = await (await piano).transcribe(audio, SAMPLE_RATE, (p) =>
      self.postMessage({ type: 'progress', p: 0.4 + 0.6 * p, backend }),
    );
    self.postMessage({ type: 'done', post, roll, backend }, {
      transfer: [post.frames.buffer, post.onsets.buffer, post.contours.buffer, roll.onsets.buffer, roll.frames.buffer],
    });
  } catch (err) {
    general = null;
    piano = null;
    self.postMessage({ type: 'error', message: err instanceof Error ? err.message : String(err) });
  }
};
