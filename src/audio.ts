import { save } from './save';

/**
 * All sound is synthesised with WebAudio — no audio files to ship. The music is a small
 * generative piece in the Persian Shur mode: a soft drone, santur-like plucks and a daf rhythm.
 */
let ctx: AudioContext | null = null;
let master: GainNode;
let sfxBus: GainNode;
let musicBus: GainNode;
let noiseBuf: AudioBuffer | null = null;

function ac(): AudioContext | null {
  if (!ctx) {
    try {
      ctx = new AudioContext();
      master = ctx.createGain();
      master.gain.value = 0.9;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 4;
      master.connect(comp);
      comp.connect(ctx.destination);
      sfxBus = ctx.createGain();
      sfxBus.gain.value = 0.55;
      sfxBus.connect(master);
      musicBus = ctx.createGain();
      musicBus.gain.value = 0.0;
      musicBus.connect(master);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    } catch { return null; }
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

interface ToneOpts { type?: OscillatorType; vol?: number; attack?: number; slide?: number; delay?: number; dest?: AudioNode; detune?: number; filter?: number }

function tone(freq: number, dur: number, o: ToneOpts = {}) {
  const c = ac();
  if (!c) return;
  const t = c.currentTime + (o.delay ?? 0);
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = o.type ?? 'sine';
  osc.frequency.setValueAtTime(freq, t);
  if (o.detune) osc.detune.value = o.detune;
  if (o.slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq * o.slide), t + dur);
  const vol = o.vol ?? 0.2;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + (o.attack ?? 0.006));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  let node: AudioNode = osc;
  if (o.filter) {
    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = o.filter;
    osc.connect(f);
    node = f;
  }
  node.connect(g);
  g.connect(o.dest ?? sfxBus);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

function noise(dur: number, vol: number, o: { freq?: number; type?: BiquadFilterType; q?: number; delay?: number; sweep?: number; dest?: AudioNode } = {}) {
  const c = ac();
  if (!c || !noiseBuf) return;
  const t = c.currentTime + (o.delay ?? 0);
  const src = c.createBufferSource();
  src.buffer = noiseBuf;
  src.playbackRate.value = 0.8 + Math.random() * 0.4;
  const f = c.createBiquadFilter();
  f.type = o.type ?? 'bandpass';
  f.frequency.setValueAtTime(o.freq ?? 2000, t);
  if (o.sweep) f.frequency.exponentialRampToValueAtTime(o.sweep, t + dur);
  f.Q.value = o.q ?? 1;
  const g = c.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f);
  f.connect(g);
  g.connect(o.dest ?? sfxBus);
  src.start(t, Math.random() * 0.5);
  src.stop(t + dur + 0.05);
}

// Shur scale (D): D, E-koron, F, G, A, Bb, C — the second degree a quarter-tone flat.
const SHUR = [0, 1.5, 3, 5, 7, 8, 10];
function scaleFreq(step: number, base = 293.66): number {
  const oct = Math.floor(step / 7);
  const deg = ((step % 7) + 7) % 7;
  return base * Math.pow(2, (SHUR[deg] + oct * 12) / 12);
}

/** Santur-ish pluck: two quick strikes, bright then mellow. */
function pluck(freq: number, vol: number, delay = 0, dest?: AudioNode) {
  tone(freq, 0.9, { type: 'triangle', vol, delay, dest, filter: 3200 });
  tone(freq * 2, 0.25, { type: 'sine', vol: vol * 0.35, delay, dest });
  tone(freq, 0.6, { type: 'triangle', vol: vol * 0.45, delay: delay + 0.045, dest, detune: 6, filter: 2400 });
}

let lastShot = 0;
let launches = 0;
const on = () => save.settings.sound;

export const sfx = {
  unlock() { ac(); },
  tap() { if (on()) { tone(880, 0.06, { type: 'triangle', vol: 0.14, slide: 1.3 }); noise(0.03, 0.05, { freq: 5000 }); } },
  open() { if (on()) noise(0.22, 0.08, { freq: 600, sweep: 3500, q: 0.8 }); },
  /** Each hit in a quick run climbs the scale. */
  shot(combo: number) {
    if (!on()) return;
    const now = performance.now();
    if (now - lastShot < 26) return;
    lastShot = now;
    const step = Math.min(14, combo - 1);
    tone(scaleFreq(step, 587.3), 0.12, { type: 'square', vol: 0.045, filter: 3500 });
    tone(scaleFreq(step, 587.3), 0.18, { type: 'sine', vol: 0.09 });
  },
  pop() { if (on()) { noise(0.07, 0.12, { freq: 1800, q: 1.5 }); tone(700 + Math.random() * 300, 0.07, { vol: 0.08, slide: 0.5 }); } },
  ice() { if (on()) { tone(2400, 0.12, { type: 'triangle', vol: 0.08, slide: 1.2 }); noise(0.12, 0.12, { freq: 6000, type: 'highpass' }); } },
  launch() {
    if (!on()) return;
    noise(0.22, 0.09, { freq: 500, sweep: 2500, q: 0.7 });
    if (launches++ % 3 === 0) {
      // a tiny "mew": rising then falling, through a vowel-ish filter
      const f0 = 620 + Math.random() * 180;
      tone(f0, 0.22, { type: 'sawtooth', vol: 0.05, slide: 1.35, filter: 1800 });
      tone(f0 * 1.3, 0.16, { type: 'sine', vol: 0.06, slide: 0.75, delay: 0.1 });
    }
  },
  park() { if (on()) { tone(160, 0.14, { type: 'sine', vol: 0.3, slide: 0.6 }); noise(0.05, 0.08, { freq: 900 }); } },
  empty() { if (on()) [0, 2, 4, 7].forEach((s, i) => tone(scaleFreq(s, 880), 0.25, { type: 'triangle', vol: 0.09, delay: i * 0.05 })); },
  reject() { if (on()) { tone(196, 0.1, { type: 'square', vol: 0.06, filter: 900 }); tone(147, 0.14, { type: 'square', vol: 0.06, filter: 900, delay: 0.08 }); } },
  blast() { if (on()) { noise(0.6, 0.5, { freq: 900, type: 'lowpass', sweep: 120 }); tone(110, 0.5, { vol: 0.5, slide: 0.35 }); } },
  heartbeat() { if (on()) { tone(70, 0.13, { vol: 0.45, slide: 0.7 }); tone(62, 0.15, { vol: 0.32, slide: 0.7, delay: 0.17 }); } },
  coin() { if (on()) { tone(1568, 0.09, { type: 'square', vol: 0.05, filter: 5000 }); tone(2093, 0.16, { type: 'square', vol: 0.05, filter: 5000, delay: 0.07 }); } },
  tick() { if (on()) tone(1800 + Math.random() * 200, 0.03, { type: 'square', vol: 0.03, filter: 4000 }); },
  star(i: number) { if (on()) { pluck(scaleFreq(i * 2 + 7), 0.22); noise(0.3, 0.05, { freq: 8000, type: 'highpass' }); } },
  whoosh() { if (on()) noise(0.35, 0.1, { freq: 300, sweep: 4000, q: 0.6 }); },
  win() {
    if (!on()) return;
    const seq = [0, 2, 4, 7, 9, 11, 14];
    seq.forEach((s, i) => pluck(scaleFreq(s), 0.2, i * 0.07));
    [0, 4, 7].forEach((s) => tone(scaleFreq(s + 7), 1.4, { type: 'triangle', vol: 0.09, delay: 0.55, attack: 0.05 }));
    noise(0.8, 0.06, { freq: 9000, type: 'highpass', delay: 0.5 });
  },
  lose() {
    if (!on()) return;
    [7, 6, 5, 3].forEach((s, i) => tone(scaleFreq(s, 196), 0.34, { type: 'sawtooth', vol: 0.07, filter: 1100, delay: i * 0.2, slide: 0.97 }));
  },
};

// ─────────────────────────── music ───────────────────────────

let musicTimer = 0;
let nextTime = 0;
let beat = 0;
const BPM = 104;
// 6/8: daf pattern per eighth note (D = dum, t = tak, . = rest)
const DAF = 'D.tDt.';
const MELODY = [
  [0, -1, 1, 2, -1, 1], [0, -1, -1, -2, -1, 0], [2, -1, 3, 4, -1, 3], [2, 1, -1, 0, -1, -1],
  [4, -1, 5, 4, -1, 3], [2, -1, 3, 2, 1, -1], [1, -1, 2, 1, 0, -1], [-2, -1, -1, 0, -1, -1],
];

function daf(kind: string, t: number) {
  const c = ctx!;
  if (kind === 'D') {
    const o = c.createOscillator();
    const g = c.createGain();
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(55, t + 0.18);
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    o.connect(g);
    g.connect(musicBus);
    o.start(t);
    o.stop(t + 0.3);
  }
  // the jingles inside the frame drum
  const src = c.createBufferSource();
  src.buffer = noiseBuf;
  const f = c.createBiquadFilter();
  f.type = 'highpass';
  f.frequency.value = kind === 'D' ? 5000 : 3500;
  const g = c.createGain();
  g.gain.setValueAtTime(kind === 'D' ? 0.12 : 0.2, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + (kind === 'D' ? 0.12 : 0.08));
  src.connect(f);
  f.connect(g);
  g.connect(musicBus);
  src.start(t, Math.random() * 0.5);
  src.stop(t + 0.15);
}

function scheduleMusic() {
  const c = ctx;
  if (!c) return;
  const eighth = 60 / BPM / 2;
  while (nextTime < c.currentTime + 0.25) {
    const bar = Math.floor(beat / 6);
    const pos = beat % 6;
    const d = DAF[pos];
    if (d !== '.') daf(d, nextTime);
    const phrase = MELODY[bar % MELODY.length];
    const n = phrase[pos];
    if (n > -1.5 && n !== -1) {
      const delay = nextTime - c.currentTime;
      pluck(scaleFreq(n + 7, 293.66 / 2), 0.16, Math.max(0, delay), musicBus);
    }
    if (pos === 0 && bar % 2 === 0) {
      // drone: tonic and fifth
      const delay = Math.max(0, nextTime - c.currentTime);
      tone(146.83, eighth * 12, { type: 'sawtooth', vol: 0.035, filter: 500, attack: 0.4, delay, dest: musicBus });
      tone(220, eighth * 12, { type: 'sawtooth', vol: 0.02, filter: 450, attack: 0.5, delay, dest: musicBus, detune: 4 });
    }
    nextTime += eighth;
    beat++;
  }
}

export function startMusic() {
  stopMusic();
  if (!save.settings.music) return;
  const c = ac();
  if (!c) return;
  musicBus.gain.cancelScheduledValues(c.currentTime);
  musicBus.gain.setValueAtTime(0.0001, c.currentTime);
  musicBus.gain.exponentialRampToValueAtTime(0.32, c.currentTime + 2);
  nextTime = c.currentTime + 0.1;
  beat = 0;
  scheduleMusic();
  musicTimer = window.setInterval(scheduleMusic, 90);
}

export function stopMusic() {
  if (musicTimer) clearInterval(musicTimer);
  musicTimer = 0;
  if (ctx) {
    musicBus.gain.cancelScheduledValues(ctx.currentTime);
    musicBus.gain.setValueAtTime(0.0001, ctx.currentTime);
  }
}

/** Duck the music under a popup / ad. */
export function duckMusic(down: boolean) {
  if (!ctx || !musicTimer) return;
  musicBus.gain.cancelScheduledValues(ctx.currentTime);
  musicBus.gain.setTargetAtTime(down ? 0.12 : 0.32, ctx.currentTime, 0.25);
}
