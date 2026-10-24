// Synthesised sound effects (no audio files to ship). Notes come from the Dastgah-e Shur
// flavoured scale so merges sound Persian rather than generic arcade.

let ctx: AudioContext | null = null;
let enabled = true;
export const setSound = (on: boolean) => {
  enabled = on;
  if (on) startMusic();
  else stopMusic();
};
export const soundOn = () => enabled;

function ac(): AudioContext | null {
  if (!enabled) return null;
  if (!ctx) {
    try {
      ctx = new AudioContext();
    } catch {
      return null;
    }
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

/** Shur-like scale (in semitones, the 2nd is a quarter-tone flat ≈ 1.5). */
const SHUR = [0, 1.5, 3, 5, 7, 8, 10, 12, 13.5, 15, 17, 19];
const BASE = 392; // G4
const freq = (step: number) => BASE * 2 ** (SHUR[Math.min(step, SHUR.length - 1)] / 12);

function tone(f: number, start: number, dur: number, type: OscillatorType = 'triangle', vol = 0.18, glideTo?: number): void {
  const a = ac();
  if (!a) return;
  const t = a.currentTime + start;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

/** A plucked, santur-ish note: bright attack, quick decay, a little shimmer. */
function pluck(f: number, start = 0, vol = 0.16): void {
  tone(f, start, 0.35, 'triangle', vol);
  tone(f * 2, start, 0.18, 'sine', vol * 0.35);
  tone(f * 1.003, start, 0.3, 'sine', vol * 0.25);
}

export const sfx = {
  tap: () => tone(660, 0, 0.06, 'sine', 0.08),
  spawn: () => tone(520, 0, 0.12, 'sine', 0.12, 780),
  merge: (level: number) => {
    const s = Math.min(level, 9);
    pluck(freq(s), 0);
    pluck(freq(s + 2), 0.07, 0.13);
  },
  bigMerge: () => [0, 2, 4, 7].forEach((s, i) => pluck(freq(s + 3), i * 0.07, 0.15)),
  coin: () => {
    tone(1318, 0, 0.08, 'square', 0.05);
    tone(1760, 0.06, 0.14, 'square', 0.05);
  },
  deliver: () => [0, 2, 4, 7, 9].forEach((s, i) => pluck(freq(s), i * 0.08, 0.14)),
  error: () => tone(180, 0, 0.18, 'sawtooth', 0.06, 120),
  unlock: () => [4, 7].forEach((s, i) => pluck(freq(s), i * 0.09)),
  levelUp: () => [0, 2, 4, 5, 7, 9, 11].forEach((s, i) => pluck(freq(s), i * 0.07, 0.15)),
  task: () => [7, 4, 2, 4, 7, 11].forEach((s, i) => pluck(freq(s), i * 0.11, 0.15)),
  page: () => tone(880, 0, 0.05, 'sine', 0.06),
  discover: () => [7, 9, 11].forEach((s, i) => pluck(freq(s), i * 0.06, 0.11)),
};

// ---------------------------------------------------------------- background music
// A slow santur-like phrase in Shur over a soft drone, generated live and varied each loop.

let musicOn = false; // switched on after the first user gesture (see main.ts)
let musicTimer = 0;
let droneNodes: { osc: OscillatorNode; gain: GainNode }[] = [];
export const musicEnabled = () => musicOn;

const PHRASES = [
  [0, 2, 3, 2, 0, -1, 0, null, 3, 4, 3, 2, 3, null, 0, null],
  [4, 3, 2, 3, 4, 5, 4, null, 3, 2, 0, 2, 0, null, null, null],
  [0, 3, 2, 3, 0, 2, 3, 4, 5, 4, 3, 2, 3, 2, 0, null],
];

function musicNote(step: number, at: number, vol: number): void {
  const a = ac();
  if (!a) return;
  const f = (BASE / 2) * 2 ** (SHUR[Math.max(0, step + 1)] / 12);
  const t = a.currentTime + at;
  for (const [mul, v, d] of [[1, vol, 1.1], [2, vol * 0.25, 0.5], [1.004, vol * 0.4, 0.9]] as const) {
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = mul === 1 ? 'triangle' : 'sine';
    o.frequency.value = f * mul;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(a.destination);
    o.start(t);
    o.stop(t + d + 0.05);
  }
}

function startDrone(): void {
  const a = ac();
  if (!a || droneNodes.length) return;
  for (const [f, v] of [[BASE / 4, 0.018], [(BASE / 4) * 1.5, 0.01]] as const) {
    const osc = a.createOscillator();
    const gain = a.createGain();
    osc.type = 'sine';
    osc.frequency.value = f;
    gain.gain.setValueAtTime(0.0001, a.currentTime);
    gain.gain.exponentialRampToValueAtTime(v, a.currentTime + 3);
    osc.connect(gain).connect(a.destination);
    osc.start();
    droneNodes.push({ osc, gain });
  }
}

function stopDrone(): void {
  for (const { osc, gain } of droneNodes) {
    try {
      gain.gain.cancelScheduledValues(0);
      gain.gain.value = 0;
      osc.stop();
    } catch {
      /* already stopped */
    }
  }
  droneNodes = [];
}

export function startMusic(): void {
  if (!musicOn || !enabled || musicTimer) return;
  startDrone();
  const beat = 0.46;
  let k = 0;
  const loop = () => {
    const phrase = PHRASES[k++ % PHRASES.length];
    phrase.forEach((n, i) => {
      if (n !== null) musicNote(n + (Math.random() < 0.12 ? 1 : 0), i * beat, 0.05);
    });
  };
  loop();
  musicTimer = window.setInterval(loop, PHRASES[0].length * beat * 1000 + 1400);
}

export function stopMusic(): void {
  clearInterval(musicTimer);
  musicTimer = 0;
  stopDrone();
}

export function setMusic(on: boolean): void {
  musicOn = on;
  if (on) startMusic();
  else stopMusic();
}
