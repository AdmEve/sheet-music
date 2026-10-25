import { describe, expect, it } from 'vitest';
import { botSolve, winRate } from '../src/game/bot';
import { Game } from '../src/game/engine';
import { TUNED_COUNT, baseLevel, buildLevel, encodeLevel, solutionFor } from '../src/game/levelgen';
import type { LevelDef } from '../src/game/engine';
import { PICTURE_IDS, loadPicture } from '../src/game/pictures';
import tuned from '../src/data/levels.json';

describe('pictures', () => {
  it('every picture is baked at 16–24 and has a title', () => {
    expect(PICTURE_IDS.length).toBeGreaterThan(150);
    for (const id of PICTURE_IDS) for (const size of [16, 20, 24]) {
      const p = loadPicture(id, size);
      expect([id, p.w, p.h, p.title !== id]).toEqual([id, size, size, true]);
    }
  });
});

describe('shipped levels (src/data/levels.json)', () => {
  it('there are at least 300 tuned levels', () => {
    expect(TUNED_COUNT).toBeGreaterThanOrEqual(300);
  });

  it('decode → encode round-trips', () => {
    for (let i = 0; i < TUNED_COUNT; i++) expect(encodeLevel(buildLevel(i), solutionFor(i))).toEqual(tuned[i]);
  });

  it('ammo per colour equals the hits that colour needs', () => {
    for (let i = 0; i < TUNED_COUNT; i++) {
      const l = buildLevel(i);
      const need = new Map<number, number>();
      l.cells.forEach((c, k) => { if (c >= 0) need.set(c, (need.get(c) ?? 0) + l.hp[k]); });
      const have = new Map<number, number>();
      for (const s of l.shooters) have.set(s.color, (have.get(s.color) ?? 0) + s.ammo);
      expect([i, have]).toEqual([i, need]);
    }
  });

  it('every lane has cats and lanes are balanced', () => {
    for (let i = 0; i < TUNED_COUNT; i++) {
      const lens = buildLevel(i).columns.map((c) => c.length);
      expect([i, Math.min(...lens) > 0, Math.max(...lens) - Math.min(...lens) <= 1]).toEqual([i, true, true]);
    }
  });

  it('every level is beatable: its stored winning line wins in the real engine', () => {
    const failed: number[] = [];
    for (let i = 0; i < TUNED_COUNT; i++) if (!replay(buildLevel(i), solutionFor(i))) failed.push(i + 1);
    expect(failed).toEqual([]);
  }, 300_000);

  it('hard levels beat the obvious strategies; normal levels leave little slack', () => {
    let hard = 0, hardBeaten = 0, normal = 0, normalTight = 0;
    for (let i = 10; i < TUNED_COUNT; i++) {
      const l = buildLevel(i);
      const expert = botSolve(l);
      if (l.hard) { hard++; if (!expert.won) hardBeaten++; }
      else { normal++; if (!expert.won || expert.minFree <= 1) normalTight++; }
    }
    expect(hardBeaten / hard).toBeGreaterThan(0.6);
    expect(normalTight / normal).toBeGreaterThan(0.6);
  }, 300_000);

  it('the first levels are gentle', () => {
    for (let i = 0; i < 3; i++) {
      expect(botSolve(buildLevel(i)).won).toBe(true);
      expect(winRate(buildLevel(i), 0.55, 8)).toBe(1);
    }
  });

  it('levels past the tuned set are still generated and beatable', () => {
    const l = baseLevel(TUNED_COUNT + 3);
    expect(botSolve(l).won).toBe(true);
  });
});

/** Play a winning line one cat at a time (each cat finishes its lap before the next is sent). */
function replay(level: LevelDef, moves: number[]): boolean {
  const g = new Game(level);
  for (const id of moves) {
    if (g.status !== 'playing') break;
    if (!g.tap(id)) return false;
    for (let t = 0; t < 3000 && (g.belt.length || g.pending.length) && g.status === 'playing'; t++) g.step(1 / 60);
    g.events.length = 0;
  }
  return g.status === 'won';
}

describe('engine', () => {
  it('a revive slot parks the stranded cat and play continues', () => {
    const l = buildLevel(5);
    const g = new Game({ ...l, slots: 0 });
    // keep sending whatever is at the front until a cat has nowhere to park
    for (let t = 0; t < 20000 && g.status === 'playing'; t++) {
      if (t % 30 === 0) for (const c of g.columns) if (c.length && g.canLaunch(c[0])) g.tap(c[0]);
      g.step(1 / 60);
    }
    expect(g.status).not.toBe('playing');
    if (g.status === 'lost') {
      g.addSlot();
      expect(g.status).toBe('playing');
      expect(g.slots.filter((s) => s >= 0).length).toBe(1);
    }
  });

  it('a bomb clears a 3×3 area', () => {
    const g = new Game(buildLevel(0));
    const before = g.remaining;
    const center = g.cells.findIndex((c, i) => c >= 0 && i % g.w > 0 && i % g.w < g.w - 1 && i > g.w && i < g.cells.length - g.w);
    g.blast(center);
    expect(g.remaining).toBeLessThan(before);
  });
});
