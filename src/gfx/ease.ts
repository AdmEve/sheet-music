/** Easing curves and small animation helpers (t in 0..1). */
export const ease = {
  linear: (t: number) => t,
  outCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  inCubic: (t: number) => t * t * t,
  inOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outBack: (t: number) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  outElastic: (t: number) => {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
  },
  outQuad: (t: number) => 1 - (1 - t) * (1 - t),
};

export const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Critically-damped-ish spring step for a scalar (returns new value and velocity). */
export function spring(x: number, v: number, target: number, dt: number, stiffness = 260, damping = 18): [number, number] {
  const a = stiffness * (target - x) - damping * v;
  v += a * dt;
  x += v * dt;
  return [x, v];
}
