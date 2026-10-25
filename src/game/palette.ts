import paletteJson from '../data/palette.json';

export interface PaletteColor { key: string; hex: string; name: string; rgb: [number, number, number] }

export const PALETTE: PaletteColor[] = paletteJson.map((p) => ({
  ...p,
  rgb: [parseInt(p.hex.slice(1, 3), 16), parseInt(p.hex.slice(3, 5), 16), parseInt(p.hex.slice(5, 7), 16)],
}));

export const COLOR_INDEX: Record<string, number> = Object.fromEntries(PALETTE.map((p, i) => [p.key, i]));

export function colorDistance(a: number, b: number): number {
  const [r1, g1, b1] = PALETTE[a].rgb;
  const [r2, g2, b2] = PALETTE[b].rgb;
  const rm = (r1 + r2) / 2;
  return (2 + rm / 256) * (r1 - r2) ** 2 + 4 * (g1 - g2) ** 2 + (2 + (255 - rm) / 256) * (b1 - b2) ** 2;
}

/** Slightly lighter / darker shades for the 3D-ish blocks and shooters. */
export function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(amount > 0 ? v + (255 - v) * amount : v * (1 + amount))));
  const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}
