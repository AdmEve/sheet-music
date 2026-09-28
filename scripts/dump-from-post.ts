// Re-analyse cached posteriors (test-audio/*.post.bin written by compare-ref) without rerunning the model.
import { readFileSync, writeFileSync } from 'node:fs';
import { analyse, noteOptionsForSensitivity } from '../src/engine/notes';
import { runModel } from '../src/engine/basicpitch';
void runModel;
const [bin, out, sens] = process.argv.slice(2);
const raw = new Float32Array(readFileSync(bin).buffer.slice(0));
const n = raw[0];
const frames = raw.slice(1, 1 + n * 88);
const onsets = raw.slice(1 + n * 88, 1 + 2 * n * 88);
const contours = raw.length > 1 + 2 * n * 88 ? raw.slice(1 + 2 * n * 88) : new Float32Array(n * 264);
const a = analyse({ nFrames: n, frames, onsets, contours }, noteOptionsForSensitivity(Number(sens ?? 0.5)));
writeFileSync(out, JSON.stringify({ ...a, onsetEnv: Array.from(a.onsetEnv) }));
console.log('notes', a.notes.length);
