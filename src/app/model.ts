// Main-thread wrapper around the model worker.
import type { PianoRoll } from '../engine/pianomodel';
import type { Posteriors } from '../engine/types';

export interface ModelOutput {
  post: Posteriors;
  roll: PianoRoll;
}

let worker: Worker | null = null;

function getWorker(): Worker {
  worker ??= new Worker(new URL('./model.worker.ts', import.meta.url), { type: 'module' });
  return worker;
}

export interface RunHandle {
  promise: Promise<ModelOutput>;
  cancel: () => void;
}

export function runInWorker(audio: Float32Array, onProgress: (p: number, backend: string) => void): RunHandle {
  const w = getWorker();
  let cancel = () => {};
  const promise = new Promise<ModelOutput>((resolve, reject) => {
    cancel = () => {
      // Terminating is the only way to stop a running model; a fresh worker is made next time.
      w.terminate();
      worker = null;
      reject(new Error('cancelled'));
    };
    w.onmessage = (e) => {
      const m = e.data;
      if (m.type === 'progress') onProgress(m.p, m.backend);
      else if (m.type === 'done') resolve({ post: m.post, roll: m.roll });
      else if (m.type === 'error') reject(new Error(m.message));
    };
    w.onerror = (e) => reject(new Error(e.message || 'The note detector crashed.'));
    const modelUrl = new URL('model/model.json', document.baseURI).href;
    const pianoUrl = new URL('piano-model', document.baseURI).href;
    // Send a copy: the main thread keeps the audio to measure note envelopes.
    const copy = audio.slice();
    w.postMessage({ type: 'run', audio: copy, modelUrl, pianoUrl }, [copy.buffer]);
  });
  return { promise, cancel };
}
