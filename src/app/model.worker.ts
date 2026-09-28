// Runs the neural network off the main thread so the app stays responsive.
import { initBackend, loadModel, runModel } from '../engine/basicpitch';

type Req = { type: 'run'; audio: Float32Array; modelUrl: string };

let model: ReturnType<typeof loadModel> | null = null;

self.onmessage = async (e: MessageEvent<Req>) => {
  const { audio, modelUrl } = e.data;
  try {
    const backend = await initBackend();
    model ??= loadModel(modelUrl);
    const post = await runModel(audio, model, (p) => self.postMessage({ type: 'progress', p, backend }));
    self.postMessage({ type: 'done', post, backend }, {
      transfer: [post.frames.buffer, post.onsets.buffer, post.contours.buffer],
    });
  } catch (err) {
    model = null;
    self.postMessage({ type: 'error', message: err instanceof Error ? err.message : String(err) });
  }
};
