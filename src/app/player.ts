// Plays the transcribed score with simple built-in synth voices, so you can hear
// whether the notes are right.
import { scoreNotes } from '../engine/midi';
import { DIV, quarterBpm, type Score } from '../engine/score';

let ctx: AudioContext | null = null;
let stopAt: (() => void) | null = null;

const hz = (p: number) => 440 * 2 ** ((p - 69) / 12);

export function isPlaying() {
  return stopAt !== null;
}

export function stop() {
  stopAt?.();
  stopAt = null;
}

export function play(score: Score, onEnd: () => void) {
  stop();
  ctx ??= new AudioContext();
  const c = ctx;
  void c.resume();
  const quarterSec = 60 / quarterBpm(score);
  const t0 = c.currentTime + 0.15;
  const master = c.createGain();
  master.gain.value = 0.25;
  master.connect(c.destination);
  const nodes: AudioScheduledSourceNode[] = [];
  let last = 0;
  for (const n of scoreNotes(score)) {
    const part = score.parts[n.part];
    const start = t0 + (n.start / DIV) * quarterSec;
    const end = t0 + (n.end / DIV) * quarterSec;
    last = Math.max(last, end);
    const g = c.createGain();
    g.connect(master);
    const o = c.createOscillator();
    o.frequency.value = hz(n.pitch);
    if (part.instrument === 'piano') {
      o.type = 'triangle';
      o.connect(g);
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(0.5, start + 0.005);
      g.gain.exponentialRampToValueAtTime(0.05, start + 2.5);
      g.gain.setTargetAtTime(0, end, 0.08);
    } else {
      o.type = 'sawtooth';
      const f = c.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = 1800;
      o.connect(f);
      f.connect(g);
      const lfo = c.createOscillator();
      const depth = c.createGain();
      lfo.frequency.value = 5.5;
      depth.gain.value = hz(n.pitch) * 0.004;
      lfo.connect(depth);
      depth.connect(o.frequency);
      lfo.start(start);
      lfo.stop(end + 0.3);
      nodes.push(lfo);
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(0.28, start + 0.08);
      g.gain.setTargetAtTime(0, end, 0.06);
    }
    o.start(start);
    o.stop(end + 0.5);
    nodes.push(o);
  }
  const timer = window.setTimeout(() => {
    stopAt = null;
    onEnd();
  }, (last - c.currentTime + 0.6) * 1000);
  stopAt = () => {
    window.clearTimeout(timer);
    for (const n of nodes) {
      try {
        n.stop();
      } catch {
        /* already stopped */
      }
    }
    master.disconnect();
  };
}
