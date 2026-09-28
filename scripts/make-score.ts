// Usage: npx vite-node scripts/make-score.ts analysis.json out-prefix [detail]
// Builds MusicXML + MIDI from a saved analysis (see dump-analysis.ts).
import { readFileSync, writeFileSync } from 'node:fs';
import { DEFAULT_SETTINGS, makeScore } from '../src/engine/pipeline';
import type { Detail } from '../src/engine/score';

const [an, out, detail] = process.argv.slice(2);
const a = JSON.parse(readFileSync(an, 'utf8'));
a.onsetEnv = new Float32Array(a.onsetEnv);
const r = makeScore(a, {
  ...DEFAULT_SETTINGS,
  score: { ...DEFAULT_SETTINGS.score, title: 'Test Duet', detail: (detail as Detail) ?? 'normal' },
});
writeFileSync(out + '.musicxml', r.musicxml);
writeFileSync(out + '.mid', r.midi);
console.log(
  `key ${r.score.key.fifths} ${r.score.key.mode}, ${r.score.meter.beats}/${r.score.meter.beatType}, ${r.score.bpm} bpm, ${r.score.measures.length} measures, parts ${r.score.parts.map((p) => p.name).join(', ')}`,
);
