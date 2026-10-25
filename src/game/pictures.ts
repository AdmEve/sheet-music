import baked from '../data/pictures.json';
import emojiList from '../data/emoji-list.json';
import { COLOR_INDEX, PALETTE, colorDistance } from './palette';

/**
 * Pictures are pixel art baked from Twemoji artwork (scripts/bake-pictures.mjs).
 * Twemoji graphics © Twitter, Inc. and other contributors, CC-BY 4.0.
 */

/** A picture is a grid of palette indices, -1 for an empty cell. */
export interface Picture { id: string; title: string; w: number; h: number; cells: number[] }

const TITLES: Record<string, string> = Object.fromEntries((emojiList as { id: string; fa: string }[]).map((e) => [e.id, e.fa]));

function parseRows(rows: string[]): { w: number; h: number; cells: number[] } {
  const h = rows.length;
  const w = Math.max(...rows.map((r) => r.length));
  const cells: number[] = [];
  for (const r of rows) for (let x = 0; x < w; x++) {
    const ch = r[x] ?? '.';
    cells.push(ch === '.' ? -1 : COLOR_INDEX[ch]);
  }
  return { w, h, cells };
}

export const PICTURE_IDS = Object.keys(baked);

export function pictureTitle(id: string): string {
  return TITLES[id] ?? id;
}

/** Load a picture at the smallest baked size ≥ `size` (16–24). */
export function loadPicture(id: string, size: number): Picture {
  const sizes = (baked as Record<string, Record<string, string>>)[id];
  const avail = Object.keys(sizes).map(Number).sort((a, b) => a - b);
  const pick = avail.find((s) => s >= size) ?? avail[avail.length - 1];
  return { id, title: pictureTitle(id), ...parseRows(sizes[pick].split('/')) };
}

/**
 * Reduce a picture to at most `maxColors` colours: first fix lone noisy cells, then fold the
 * rarest colours into their nearest surviving colour. Fewer colours = easier level.
 */
export function simplify(pic: Picture, maxColors: number): Picture {
  const { w, h } = pic;
  let cells = pic.cells.slice();
  // Lone cells whose neighbours all share another colour become that colour.
  const next = cells.slice();
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const c = cells[y * w + x];
    if (c < 0) continue;
    const nb: number[] = [];
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < w && ny < h && cells[ny * w + nx] >= 0) nb.push(cells[ny * w + nx]);
    }
    if (nb.length >= 3 && !nb.includes(c)) {
      const counts = new Map<number, number>();
      for (const n of nb) counts.set(n, (counts.get(n) ?? 0) + 1);
      const [best, n] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
      if (n >= 2) next[y * w + x] = best;
    }
  }
  cells = next;
  // Drop specks (1–2 cells) into their nearest colour, then, while there are too many colours,
  // merge the two most similar ones (weighted by size), so small but distinct features such as
  // black eyes survive and near-duplicate shades go first.
  const count = () => {
    const m = new Map<number, number>();
    for (const c of cells) if (c >= 0) m.set(c, (m.get(c) ?? 0) + 1);
    return m;
  };
  const mergeInto = (from: number, to: number) => { cells = cells.map((c) => (c === from ? to : c)); };
  for (;;) {
    const counts = count();
    if (counts.size <= 1) break;
    const tiny = [...counts.entries()].find(([, n]) => n < 3);
    if (tiny) {
      let target = -1, bd = Infinity;
      for (const [c] of counts) if (c !== tiny[0] && colorDistance(tiny[0], c) < bd) { bd = colorDistance(tiny[0], c); target = c; }
      mergeInto(tiny[0], target);
      continue;
    }
    if (counts.size <= maxColors) break;
    let best: [number, number] = [-1, -1], bs = Infinity;
    const entries = [...counts.entries()];
    for (let i = 0; i < entries.length; i++) for (let j = i + 1; j < entries.length; j++) {
      const [a, na] = entries[i], [b, nb] = entries[j];
      const sc = colorDistance(a, b) * Math.sqrt(Math.min(na, nb));
      if (sc < bs) { bs = sc; best = na < nb ? [a, b] : [b, a]; }
    }
    mergeInto(best[0], best[1]);
  }
  return { ...pic, cells };
}

export function colorsOf(pic: Picture): number[] {
  return [...new Set(pic.cells.filter((c) => c >= 0))];
}

export { PALETTE };
