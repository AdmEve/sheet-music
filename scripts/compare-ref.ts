import { loadNodeModel, loadWav22k } from '../tests/node-helpers';
import { runModel, N_PITCH_BINS } from '../src/engine/basicpitch';
import { extractFrameNotes } from '../src/engine/notes';
import { outputToNotesPoly } from '@spotify/basic-pitch';
import { writeFileSync } from 'node:fs';

const audio = loadWav22k('test-audio/duet.wav');
const post = await runModel(audio, loadNodeModel());
writeFileSync('test-audio/duet.post.bin', Buffer.from(concat(post).buffer));
const toRows = (a: Float32Array) => Array.from({ length: post.nFrames }, (_, t) => Array.from(a.subarray(t * N_PITCH_BINS, (t + 1) * N_PITCH_BINS)));
const ref = outputToNotesPoly(toRows(post.frames), toRows(post.onsets), 0.5, 0.3, 11, true, null, null, true, 11);
const mine = extractFrameNotes(post);
const key = (s: number, e: number, p: number) => `${s}-${e}-${p}`;
const a = new Set(ref.map((n) => key(n.startFrame, n.startFrame + n.durationFrames, n.pitchMidi - 21)));
const b = new Set(mine.map((n) => key(n.start, n.end, n.bin)));
console.log('ref', a.size, 'mine', b.size, 'common', [...a].filter((x) => b.has(x)).length);
// Where are piano RH notes at 0.71s (frame ~61) pitch 74?
for (let t = 55; t < 75; t += 2) console.log(t, 'frame', post.frames[t * 88 + 53].toFixed(2), 'onset', post.onsets[t * 88 + 53].toFixed(2));
function concat(p: typeof post) {
  const o = new Float32Array(1 + p.frames.length * 2 + p.contours.length);
  o[0] = p.nFrames;
  o.set(p.frames, 1);
  o.set(p.onsets, 1 + p.frames.length);
  o.set(p.contours, 1 + 2 * p.frames.length);
  return o;
}
