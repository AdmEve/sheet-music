// Decodes any audio/video file the browser/phone can play (mp3, m4a, wav, ogg, flac, mp4...)
// into mono 22050 Hz samples for the model.
import { SAMPLE_RATE } from '../engine/basicpitch';

export interface DecodedAudio {
  samples: Float32Array;
  duration: number;
}

export async function decodeFile(file: Blob, from = 0, to = Infinity): Promise<DecodedAudio> {
  const data = await file.arrayBuffer();
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new Ctx();
  let buf: AudioBuffer;
  try {
    buf = await ctx.decodeAudioData(data);
  } catch {
    throw new Error('This file could not be read as audio. Try an MP3, M4A, WAV, OGG or FLAC file.');
  } finally {
    void ctx.close();
  }
  const start = Math.max(0, Math.min(from, buf.duration));
  const end = Math.max(start, Math.min(to, buf.duration));
  const length = Math.max(1, Math.ceil((end - start) * SAMPLE_RATE));
  // OfflineAudioContext resamples and mixes down to mono for us.
  const off = new OfflineAudioContext(1, length, SAMPLE_RATE);
  const src = off.createBufferSource();
  src.buffer = buf;
  src.connect(off.destination);
  src.start(0, start, end - start);
  const rendered = await off.startRendering();
  const samples = rendered.getChannelData(0).slice();
  // Normalise loudness so quiet recordings are treated like loud ones.
  let peak = 0;
  for (let i = 0; i < samples.length; i++) peak = Math.max(peak, Math.abs(samples[i]));
  if (peak > 0 && peak < 0.9) for (let i = 0; i < samples.length; i++) samples[i] /= peak * 1.05;
  return { samples, duration: end - start };
}
