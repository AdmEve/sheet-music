import { readFileSync } from 'node:fs';
import { trackBeats, detectMeter } from '../src/engine/rhythm';
const a = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const r = trackBeats(new Float32Array(a.onsetEnv), a.envRate, a.duration);
console.log('bpm', r.bpm.toFixed(1));
console.log('beats', r.beats.slice(0, 16).map((b: number) => b.toFixed(2)).join(' '));
const m = detectMeter(r.beats, a.notes);
console.log(m, 'first beats', r.beats.slice(0, 3));
