// Usage: npx vite-node scripts/dump-analysis.ts test-audio/duet.wav out.json
import { writeFileSync } from 'node:fs';
import { loadNodeModel, loadWav22k } from '../tests/node-helpers';
import { runModel } from '../src/engine/basicpitch';
import { analyse } from '../src/engine/notes';

const [wav, out] = process.argv.slice(2);
const audio = loadWav22k(wav);
const t0 = Date.now();
const post = await runModel(audio, loadNodeModel(), (p) => process.stderr.write(`\r${Math.round(p * 100)}%`));
console.error(`\nmodel: ${(Date.now() - t0) / 1000}s, frames ${post.nFrames}`);
const t1 = Date.now();
const a = analyse(post);
console.error(`notes: ${a.notes.length} in ${(Date.now() - t1) / 1000}s`);
writeFileSync(out, JSON.stringify({ ...a, onsetEnv: Array.from(a.onsetEnv) }));
