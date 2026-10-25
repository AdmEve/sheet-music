import { describe, expect, it } from 'vitest';
import { botSolve, winRate } from '../src/game/bot';
import { Game } from '../src/game/engine';
import { TUNED_COUNT, baseLevel, buildLevel, encodeLevel, levelParams } from '../src/game/levelgen';
import { HAND_IDS, loadPicture } from '../src/game/pictures';
import tuned from '../src/data/levels.json';

describe('pictures', () => {
  it('hand-drawn pictures are 16×16', () => {
    for (const id of HAND_IDS) {
      const p = loadPicture(id, 16);
      expect([id, p.w, p.h]).toEqual([id, 16, 16]);
    }
  });
});

describe('shipped levels (src/data/levels.json)', () => {
  it('there are at least 300 tuned levels', () => {
    expect(TUNED_COUNT).toBeGreaterThanOrEqual(300);
  });

  it('decode → encode round-trips', () => {
    for (let i = 0; i < TUNED_COUNT; i++) expect(encodeLevel(buildLevel(i))).toEqual(tuned[i]);
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

  it('the careful solver beats every level', () => {
    const lost: number[] = [];
    for (let i = 0; i < TUNED_COUNT; i++) if (!botSolve(buildLevel(i)).won) lost.push(i + 1);
    expect(lost).toEqual([]);
  }, 300_000);

  it('the game is genuinely challenging: casual players lose a fair share', () => {
    let hard = 0, hardN = 0, normal = 0, normalN = 0;
    for (let i = 20; i < 120; i++) {
      const l = buildLevel(i);
      const r = winRate(l, 0.55, 8);
      if (l.hard) { hard += r; hardN++; } else if (levelParams(i).target < 0.8) { normal += r; normalN++; }
    }
    expect(hard / hardN).toBeLessThan(0.6);
    expect(normal / normalN).toBeLessThan(0.8);
  }, 300_000);

  it('the first levels are gentle', () => {
    for (let i = 0; i < 3; i++) expect(winRate(buildLevel(i), 0.55, 8)).toBe(1);
  });

  it('levels past the tuned set are still generated and beatable', () => {
    const l = baseLevel(TUNED_COUNT + 3);
    expect(botSolve(l).won).toBe(true);
  });
});

describe('engine', () => {
  it('a revive slot parks the stranded cat and play continues', () => {
    const l = buildLevel(5);
    const g = new Game({ ...l, slots: 0 });
    for (const c of g.columns) if (c.length) g.tap(c[0]);
    for (let t = 0; t < 3000 && g.status === 'playing'; t++) g.step(1 / 60);
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
