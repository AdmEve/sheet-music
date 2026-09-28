// Node-only helpers for running the engine on WAV files in tests and scripts.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as tf from '@tensorflow/tfjs';
import { resample } from '../src/engine/resample';

export function readWav(path: string): { sampleRate: number; mono: Float32Array } {
  const buf = readFileSync(path);
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  let off = 12;
  let channels = 1;
  let sampleRate = 44100;
  let bits = 16;
  let format = 1;
  while (off + 8 <= buf.length) {
    const id = buf.toString('ascii', off, off + 4);
    const size = dv.getUint32(off + 4, true);
    const body = off + 8;
    if (id === 'fmt ') {
      format = dv.getUint16(body, true);
      channels = dv.getUint16(body + 2, true);
      sampleRate = dv.getUint32(body + 4, true);
      bits = dv.getUint16(body + 14, true);
    } else if (id === 'data') {
      const bytes = bits / 8;
      const n = Math.floor(size / (bytes * channels));
      const mono = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        let s = 0;
        for (let c = 0; c < channels; c++) {
          const p = body + (i * channels + c) * bytes;
          if (format === 3) s += dv.getFloat32(p, true);
          else if (bits === 16) s += dv.getInt16(p, true) / 32768;
          else if (bits === 24) s += ((dv.getUint8(p) | (dv.getUint8(p + 1) << 8) | (dv.getInt8(p + 2) << 16)) / 8388608);
          else if (bits === 32) s += dv.getInt32(p, true) / 2147483648;
        }
        mono[i] = s / channels;
      }
      return { sampleRate, mono };
    }
    off = body + size + (size % 2);
  }
  throw new Error('No data chunk in ' + path);
}

export function loadWav22k(path: string): Float32Array {
  const { sampleRate, mono } = readWav(path);
  return resample(mono, sampleRate, 22050);
}

export async function loadNodeModel(): Promise<tf.GraphModel> {
  await tf.setBackend('cpu');
  const dir = join(__dirname, '../node_modules/@spotify/basic-pitch/model');
  const json = JSON.parse(readFileSync(join(dir, 'model.json'), 'utf8'));
  const weights = readFileSync(join(dir, json.weightsManifest[0].paths[0]));
  return tf.loadGraphModel({
    load: async () => ({
      modelTopology: json.modelTopology,
      format: json.format,
      generatedBy: json.generatedBy,
      convertedBy: json.convertedBy,
      weightSpecs: json.weightsManifest[0].weights,
      weightData: weights.buffer.slice(weights.byteOffset, weights.byteOffset + weights.byteLength),
    }),
  });
}
