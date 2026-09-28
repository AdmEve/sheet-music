// Writes one row per detected note (features + true instrument) for fitting the
// piano/cello classifier: npx vite-node scripts/bench/export-features.ts out.json
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { analyse, noteOptionsForSensitivity } from '../../src/engine/notes';
import { withPianoEvidence } from '../../src/engine/pianomodel';
import { withEnvelopes } from '../../src/engine/timbre';
import { loadWav22k } from '../../tests/node-helpers';

const DIR = 'test-audio/bench';
const rows: unknown[] = [];
for (const wav of readdirSync(DIR).filter((f) => f.endsWith('.wav')).sort()) {
  if (!existsSync(join(DIR, wav + '.piano.bin')) || !existsSync(join(DIR, wav + '.bp.bin'))) continue;
  const raw = new Float32Array(readFileSync(join(DIR, wav + '.bp.bin')).buffer.slice(0));
  const n = raw[0];
  let a = analyse({ nFrames: n, frames: raw.slice(1, 1 + n * 88), onsets: raw.slice(1 + n * 88, 1 + 2 * n * 88), contours: raw.slice(1 + 2 * n * 88) }, noteOptionsForSensitivity(0.6));
  const pr = new Float32Array(readFileSync(join(DIR, wav + '.piano.bin')).buffer.slice(0));
  const m = pr[0];
  a = withPianoEvidence(a, { nFrames: m, onsets: pr.slice(1, 1 + m * 88), frames: pr.slice(1 + m * 88) });
  a = withEnvelopes(a, loadWav22k(join(DIR, wav)), 22050);
  const truth = JSON.parse(readFileSync(join(DIR, wav.replace(/-(fluid|musescore|timgm)\.wav$/, '.json')), 'utf8')).notes;
  for (const x of a.notes) {
    const g = truth.find((t: { pitch: number; start: number; instrument: string }) => t.pitch === x.pitch && Math.abs(t.start - x.start) < (t.instrument === 'piano' ? 0.06 : 0.12));
    rows.push({ file: wav, label: g ? g.instrument : 'false', ...x });
  }
}
writeFileSync(process.argv[2], JSON.stringify(rows));
console.log(rows.length, 'rows');
