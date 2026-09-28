// Scores the piano model alone on the benchmark (every note it finds counts as piano).
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import * as tf from '@tensorflow/tfjs';
import { loadPianoWeightsNode, readWav } from '../../tests/node-helpers';
import { PianoModel, pianoNotes, type PianoRoll } from '../../src/engine/pianomodel';

const DIR = 'test-audio/bench';
await tf.setBackend('cpu');
let model: PianoModel | null = null;
for (const wav of readdirSync(DIR).filter((f) => f.endsWith('.wav') && f.includes(process.argv[2] ?? '')).sort()) {
  const cache = join(DIR, wav + '.piano.bin');
  let roll: PianoRoll;
  if (existsSync(cache)) {
    const raw = new Float32Array(readFileSync(cache).buffer.slice(0));
    const n = raw[0];
    roll = { nFrames: n, onsets: raw.slice(1, 1 + n * 88), frames: raw.slice(1 + n * 88) };
  } else {
    model ??= new PianoModel(loadPianoWeightsNode());
    const { sampleRate, mono } = readWav(join(DIR, wav));
    const t0 = Date.now();
    roll = await model.transcribe(mono, sampleRate);
    console.error(`${wav}: ${(Date.now() - t0) / 1000}s`);
    const o = new Float32Array(1 + roll.onsets.length * 2);
    o[0] = roll.nFrames;
    o.set(roll.onsets, 1);
    o.set(roll.frames, 1 + roll.onsets.length);
    writeFileSync(cache, Buffer.from(o.buffer));
  }
  const truth = JSON.parse(readFileSync(join(DIR, wav.replace(/-(fluid|musescore|timgm)\.wav$/, '.json')), 'utf8')).notes;
  const notes = pianoNotes(roll);
  const score = (ins: string) => {
    const g = truth.filter((n: { instrument: string }) => n.instrument === ins);
    const used = new Set<number>();
    let tp = 0;
    for (const n of notes) {
      const k = g.findIndex((x: { pitch: number; start: number }, i: number) => !used.has(i) && x.pitch === n.pitch && Math.abs(x.start - n.start) < 0.05);
      if (k >= 0) {
        used.add(k);
        tp++;
      }
    }
    return { tp, g: g.length };
  };
  const p = score('piano');
  const c = score('cello');
  const P = p.tp / notes.length;
  const R = p.tp / p.g;
  console.log(`${wav.padEnd(26)} piano notes found ${p.tp}/${p.g} (recall ${Math.round(R * 100)}%), precision ${Math.round(P * 100)}%, F1 ${Math.round((200 * P * R) / (P + R))}  | cello notes it also fired on: ${c.tp}/${c.g}`);
}
