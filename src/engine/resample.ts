/** Band-limited (windowed-sinc) resampling of a mono signal. */
export function resample(input: Float32Array, fromRate: number, toRate: number): Float32Array {
  if (fromRate === toRate) return input;
  const ratio = toRate / fromRate;
  const outLen = Math.floor(input.length * ratio);
  const out = new Float32Array(outLen);
  const cutoff = Math.min(1, ratio) * 0.95; // relative to the input Nyquist
  const half = 16; // taps on each side, in output-rate-scaled input samples
  const width = Math.ceil(half / Math.min(1, ratio));
  for (let i = 0; i < outLen; i++) {
    const x = i / ratio;
    const c = Math.floor(x);
    let acc = 0;
    let norm = 0;
    for (let j = c - width + 1; j <= c + width; j++) {
      if (j < 0 || j >= input.length) continue;
      const d = x - j;
      const u = d * cutoff;
      const sinc = u === 0 ? 1 : Math.sin(Math.PI * u) / (Math.PI * u);
      const w = 0.5 + 0.5 * Math.cos((Math.PI * d) / width); // Hann window
      const k = sinc * w;
      acc += input[j] * k;
      norm += k;
    }
    out[i] = norm ? acc / norm : 0;
  }
  return out;
}
