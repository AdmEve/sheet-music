import { save } from './save';

/** All sounds are synthesised with WebAudio: no audio files to ship. */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicGain: GainNode | null = null;
let musicTimer = 0;

function ac(): AudioContext | null {
  if (!ctx) {
    try {
      ctx = new AudioContext();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
      musicGain = ctx.createGain();
      musicGain.gain.value = 0.16;
      musicGain.connect(master);
    } catch { return null; }
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, dur: number, type: OscillatorType, vol: number, slide = 0, delay = 0, dest?: AudioNode) {
  const c = ac();
  if (!c || !master) return;
  const t = c.currentTime + delay;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq * slide), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(dest ?? master);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function noise(dur: number, vol: number, freq = 2000) {
  const c = ac();
  if (!c || !master) return;
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = 'bandpass';
  f.frequency.value = freq;
  const g = c.createGain();
  g.gain.value = vol;
  src.connect(f);
  f.connect(g);
  g.connect(master);
  src.start();
}

let lastShot = 0;
export const sfx = {
  unlock() { ac(); },
  tap() { if (save.settings.sound) tone(660, 0.07, 'triangle', 0.25, 1.4); },
  launch() { if (save.settings.sound) { tone(320, 0.16, 'sine', 0.25, 2.2); noise(0.12, 0.08, 1500); } },
  shot(pitch: number) {
    if (!save.settings.sound) return;
    const now = performance.now();
    if (now - lastShot < 28) return;
    lastShot = now;
    tone(520 + pitch * 40 + Math.random() * 30, 0.06, 'square', 0.06, 0.6);
  },
  pop() { if (save.settings.sound) tone(900 + Math.random() * 200, 0.05, 'sine', 0.12, 0.5); },
  empty() { if (save.settings.sound) { tone(880, 0.09, 'sine', 0.2, 1.5); tone(1320, 0.12, 'sine', 0.15, 1.2, 0.06); } },
  park() { if (save.settings.sound) tone(180, 0.12, 'triangle', 0.3, 0.7); },
  reject() { if (save.settings.sound) tone(140, 0.15, 'sawtooth', 0.12, 0.8); },
  blast() { if (save.settings.sound) { noise(0.4, 0.4, 400); tone(90, 0.35, 'sine', 0.5, 0.4); } },
  coin() { if (save.settings.sound) { tone(1200, 0.08, 'square', 0.08); tone(1600, 0.12, 'square', 0.08, 1, 0.07); } },
  win() {
    if (!save.settings.sound) return;
    // A little Shur-flavoured fanfare.
    [523, 587, 622, 698, 784, 1047].forEach((f, i) => tone(f, 0.22, 'triangle', 0.22, 1, i * 0.09));
    tone(1047, 0.6, 'sine', 0.2, 1, 0.6);
  },
  lose() { if (save.settings.sound) [392, 349, 311, 262].forEach((f, i) => tone(f, 0.25, 'triangle', 0.2, 0.98, i * 0.16)); },
};

// Gentle background loop on a Persian Shur-like scale (with the koron second, ~quarter-flat).
const SHUR = [0, 1.5, 3, 5, 7, 8, 10, 12];
const PHRASES = [
  [0, 1, 2, 1, 0, -1, 0, 0], [2, 3, 4, 3, 2, 1, 2, 0], [4, 5, 4, 3, 2, 3, 1, 0], [0, 2, 4, 5, 4, 2, 1, 0],
];

function noteFreq(step: number): number {
  const oct = Math.floor(step / 7);
  const deg = ((step % 7) + 7) % 7;
  return 293.66 * Math.pow(2, (SHUR[deg] + oct * 12) / 12);
}

export function startMusic() {
  stopMusic();
  if (!save.settings.music) return;
  const c = ac();
  if (!c || !musicGain) return;
  let bar = 0;
  const playBar = () => {
    if (!save.settings.music || !musicGain) return;
    const phrase = PHRASES[bar % PHRASES.length];
    phrase.forEach((st, i) => {
      if (st < -0.5 && i % 2) return;
      tone(noteFreq(st), 0.5, 'sine', 0.5, 1, i * 0.3, musicGain!);
      if (i % 4 === 0) tone(noteFreq(st - 7), 1.1, 'triangle', 0.35, 1, i * 0.3, musicGain!);
    });
    bar++;
  };
  playBar();
  musicTimer = window.setInterval(playBar, 2400);
}

export function stopMusic() {
  if (musicTimer) clearInterval(musicTimer);
  musicTimer = 0;
}
