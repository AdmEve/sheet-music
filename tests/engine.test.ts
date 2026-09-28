import { describe, expect, it } from 'vitest';
import { assignInstruments } from '../src/engine/assign';
import { toMidi } from '../src/engine/midi';
import { toMusicXML } from '../src/engine/musicxml';
import { resample } from '../src/engine/resample';
import { beatPosition, detectMeter, trackBeats } from '../src/engine/rhythm';
import { buildScore, DEFAULT_SCORE_OPTIONS, DIV } from '../src/engine/score';
import { detectKey, spell } from '../src/engine/theory';
import type { Analysis, LabeledNote, RawNote } from '../src/engine/types';

const name = (p: number, key = { fifths: 0, mode: 'major' as const }) => {
  const s = spell(p, key);
  return s.step + (s.alter > 0 ? '#' : s.alter < 0 ? 'b' : '') + s.octave;
};

/** Piano-like and cello-like notes at a steady tempo, plus an onset envelope with a pulse on every beat. */
function synthetic(bpm = 90, bars = 8, beatsPerBar = 4) {
  const beat = 60 / bpm;
  const notes: RawNote[] = [];
  for (let b = 0; b < bars; b++) {
    const t = 0.5 + b * beatsPerBar * beat;
    notes.push({ start: t, end: t + beatsPerBar * beat * 0.95, pitch: 43, amp: 0.7, vibrato: 0, sustain: 0.6, attack: 0.9 });
    for (let k = 0; k < beatsPerBar * 2; k++) {
      const s = t + k * beat * 0.5;
      notes.push({ start: s, end: s + beat * 0.45, pitch: [67, 71, 74, 71][k % 4], amp: 0.5, vibrato: 0, sustain: 0.7, attack: 0.8 });
    }
    notes.push({ start: t + 0.03, end: t + beatsPerBar * beat - 0.02, pitch: 55 + (b % 3) * 2, amp: 0.6, vibrato: 0.5, sustain: 1.2, attack: 0.5 });
  }
  const envRate = 86;
  const duration = 0.5 + bars * beatsPerBar * beat + 1;
  const env = new Float32Array(Math.ceil(duration * envRate));
  for (let k = 0; k < bars * beatsPerBar; k++) {
    const i = Math.round((0.5 + k * beat) * envRate);
    env[i] = k % beatsPerBar === 0 ? 3 : 1.5;
    const h = Math.round((0.5 + (k + 0.5) * beat) * envRate);
    env[h] = 0.8;
  }
  const analysis: Analysis = { duration, notes, onsetEnv: env, envRate };
  return { analysis, beat };
}

describe('theory', () => {
  it('spells notes sensibly in C major and D minor', () => {
    expect([60, 61, 63, 66, 68, 70].map((p) => name(p))).toEqual(['C4', 'C#4', 'Eb4', 'F#4', 'Ab4', 'Bb4']);
    expect(name(61, { fifths: -1, mode: 'minor' } as never)).toBe('C#4');
    expect(name(70, { fifths: -1, mode: 'minor' } as never)).toBe('Bb4');
  });
  it('detects G major from a G major scale', () => {
    const notes = [55, 57, 59, 60, 62, 64, 66, 67, 67, 62, 59].map((p, i) => ({ pitch: p, start: i, end: i + 1 }));
    expect(detectKey(notes)).toEqual({ fifths: 1, mode: 'major' });
  });
});

describe('resample', () => {
  it('keeps a low sine wave intact when halving the rate', () => {
    const x = new Float32Array(44100).map((_, i) => Math.sin((2 * Math.PI * 440 * i) / 44100));
    const y = resample(x, 44100, 22050);
    expect(y.length).toBe(22050);
    const expected = (i: number) => Math.sin((2 * Math.PI * 440 * i) / 22050);
    let err = 0;
    for (let i = 100; i < 22000; i++) err = Math.max(err, Math.abs(y[i] - expected(i)));
    expect(err).toBeLessThan(0.05);
  });
});

describe('rhythm', () => {
  it('finds tempo, beats and a 4/4 downbeat', () => {
    const { analysis, beat } = synthetic(90, 8, 4);
    const r = trackBeats(analysis.onsetEnv, analysis.envRate, analysis.duration);
    expect(r.bpm).toBeGreaterThan(86);
    expect(r.bpm).toBeLessThan(94);
    const first = r.beats.find((b) => b > 0.3)!;
    expect(Math.abs(first - 0.5)).toBeLessThan(0.05);
    const m = detectMeter(r.beats, analysis.notes);
    expect(m.beatsPerBar).toBe(4);
    expect(Math.abs(beatPosition(r.beats, 0.5 + 4 * beat) - beatPosition(r.beats, 0.5) - 4)).toBeLessThan(0.1);
  });
  it('recognises 3/4', () => {
    const { analysis } = synthetic(100, 8, 3);
    const r = trackBeats(analysis.onsetEnv, analysis.envRate, analysis.duration);
    expect(detectMeter(r.beats, analysis.notes).beatsPerBar).toBe(3);
  });
});

describe('instrument assignment', () => {
  it('gives the bowed line to the cello and the rest to the piano', () => {
    const { analysis } = synthetic();
    const out = assignInstruments(analysis.notes);
    const cello = out.filter((n) => n.instrument === 'cello');
    expect(cello.length).toBe(8);
    expect(cello.every((n) => n.vibrato > 0.3)).toBe(true);
    expect(out.filter((n) => n.instrument === 'piano').length).toBe(8 * 9);
  });
});

describe('score', () => {
  const { analysis } = synthetic();
  const labeled: LabeledNote[] = assignInstruments(analysis.notes);
  const score = buildScore(analysis, labeled, { ...DEFAULT_SCORE_OPTIONS, title: 'Test & <Title>' });

  it('has cello and a two-staff piano with 8 full bars', () => {
    expect(score.parts.map((p) => p.name)).toEqual(['Cello', 'Piano']);
    expect(score.parts[1].staves.length).toBe(2);
    expect(score.meter).toEqual({ beats: 4, beatType: 4 });
    expect(score.key.fifths).toBe(1);
    const full = score.measures.filter((m) => !m.pickup);
    expect(full.length).toBeGreaterThanOrEqual(8);
  });

  it('fills every measure of every staff exactly', () => {
    for (const part of score.parts)
      for (const st of part.staves)
        st.measures.forEach((evs, i) => {
          const len = evs.reduce((a, e) => a + e.dur, 0);
          expect(len, `${part.name} bar ${i}`).toBe(score.measures[i].length);
        });
  });

  it('writes the cello whole notes and the piano eighths', () => {
    const cello = score.parts[0].staves[0].measures[0];
    expect(cello.filter((e) => e.pitches.length).map((e) => e.value.type)).toContain('whole');
    const rh = score.parts[1].staves[0].measures[0];
    expect(rh.filter((e) => e.pitches.length).every((e) => e.value.type === 'eighth')).toBe(true);
    expect(rh.filter((e) => e.pitches.length).length).toBe(8);
  });

  it('produces well-formed MusicXML and a valid MIDI file', () => {
    const xml = toMusicXML(score);
    expect(xml).toContain('<score-partwise version="4.0">');
    expect(xml).toContain('Test &amp; &lt;Title&gt;');
    expect(xml).toContain(`<divisions>${DIV}</divisions>`);
    expect(xml.match(/<measure /g)!.length).toBe(score.measures.length * score.parts.length);
    expect(xml.split('<note>').length - 1).toBeGreaterThan(80);
    const midi = toMidi(score);
    expect(String.fromCharCode(...midi.slice(0, 4))).toBe('MThd');
    expect(midi[11]).toBe(score.parts.length + 1);
  });

  it('supports 6/8 and triplet detail without breaking bar lengths', () => {
    for (const opt of [
      { meter: { beats: 6, beatType: 8 } },
      { meter: { beats: 3, beatType: 4 } },
      { detail: 'detailed' as const },
      { detail: 'simple' as const, followTempo: false },
    ]) {
      const s = buildScore(analysis, labeled, { ...DEFAULT_SCORE_OPTIONS, ...opt });
      for (const part of s.parts)
        for (const st of part.staves)
          st.measures.forEach((evs, i) => expect(evs.reduce((a, e) => a + e.dur, 0)).toBe(s.measures[i].length));
      expect(() => toMusicXML(s)).not.toThrow();
    }
  });
});
