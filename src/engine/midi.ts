// Writes a Standard MIDI File (type 1) from the notated score, so it matches the sheet music.
import { DIV, quarterBpm, type Score } from './score';

const PPQ = 480;
const SCALE = PPQ / DIV;

function vlq(n: number): number[] {
  const bytes = [n & 0x7f];
  while ((n >>= 7)) bytes.unshift((n & 0x7f) | 0x80);
  return bytes;
}

function track(events: { t: number; data: number[] }[]): number[] {
  events.sort((a, b) => a.t - b.t || (a.data[0] & 0xf0) - (b.data[0] & 0xf0));
  const body: number[] = [];
  let last = 0;
  for (const e of events) {
    body.push(...vlq(e.t - last), ...e.data);
    last = e.t;
  }
  body.push(0, 0xff, 0x2f, 0);
  const len = body.length;
  return [0x4d, 0x54, 0x72, 0x6b, (len >>> 24) & 255, (len >>> 16) & 255, (len >>> 8) & 255, len & 255, ...body];
}

function text(type: number, s: string): number[] {
  const b = Array.from(new TextEncoder().encode(s));
  return [0xff, type, ...vlq(b.length), ...b];
}

/** Collects sounding notes (ties merged) per part in absolute ticks. */
export function scoreNotes(score: Score): { part: number; pitch: number; start: number; end: number }[] {
  const out: { part: number; pitch: number; start: number; end: number }[] = [];
  score.parts.forEach((part, pi) => {
    for (const staff of part.staves) {
      const open = new Map<number, { start: number; end: number }>();
      staff.measures.forEach((evs, mi) => {
        const m = score.measures[mi];
        for (const ev of evs) {
          const s = m.start + ev.start;
          const e = s + ev.dur;
          for (const p of ev.pitches) {
            const cur = open.get(p);
            if (ev.tieStop && cur) cur.end = e;
            else {
              if (cur) out.push({ part: pi, pitch: p, ...cur });
              open.set(p, { start: s, end: e });
            }
            if (!ev.tieStart) {
              out.push({ part: pi, pitch: p, ...open.get(p)! });
              open.delete(p);
            }
          }
        }
      });
      for (const [p, v] of open) out.push({ part: pi, pitch: p, ...v });
    }
  });
  return out;
}

export function toMidi(score: Score): Uint8Array {
  const usPerQ = Math.round(60000000 / quarterBpm(score));
  const den = Math.log2(score.meter.beatType);
  const conductor = track([
    { t: 0, data: text(0x03, score.title) },
    { t: 0, data: [0xff, 0x51, 3, (usPerQ >> 16) & 255, (usPerQ >> 8) & 255, usPerQ & 255] },
    { t: 0, data: [0xff, 0x58, 4, score.meter.beats, den, 24, 8] },
    { t: 0, data: [0xff, 0x59, 2, score.key.fifths & 255, score.key.mode === 'minor' ? 1 : 0] },
  ]);
  const notes = scoreNotes(score);
  const tracks = score.parts.map((part, pi) => {
    const ch = pi >= 9 ? pi + 1 : pi;
    const evs: { t: number; data: number[] }[] = [
      { t: 0, data: text(0x03, part.name) },
      { t: 0, data: [0xc0 | ch, part.midiProgram] },
    ];
    for (const n of notes.filter((x) => x.part === pi)) {
      evs.push({ t: Math.round(n.start * SCALE), data: [0x90 | ch, n.pitch, part.instrument === 'piano' ? 72 : 84] });
      evs.push({ t: Math.round(n.end * SCALE), data: [0x80 | ch, n.pitch, 0] });
    }
    return track(evs);
  });
  const header = [0x4d, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 1, 0, tracks.length + 1, (PPQ >> 8) & 255, PPQ & 255];
  return new Uint8Array([...header, ...conductor, ...tracks.flat()]);
}
