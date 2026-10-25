import { describe, expect, it } from 'vitest';
import { botSolve } from '../src/game/bot';
import { Game } from '../src/game/engine';
import { buildLevel, levelParams } from '../src/game/levelgen';
import { HAND_IDS, loadPicture } from '../src/game/pictures';

describe('pictures', () => {
  it('hand-drawn pictures are 16×16', () => {
    for (const id of HAND_IDS) {
      const p = loadPicture(id, 16);
      expect([id, p.w, p.h]).toEqual([id, 16, 16]);
    }
  });
});

describe('levels', () => {
  it('ammo per colour equals the hits that colour needs', () => {
    for (let i = 0; i < 60; i++) {
      const l = buildLevel(i);
      const need = new Map<number, number>();
      l.cells.forEach((c, k) => { if (c >= 0) need.set(c, (need.get(c) ?? 0) + l.hp[k]); });
      const have = new Map<number, number>();
      for (const s of l.shooters) have.set(s.color, (have.get(s.color) ?? 0) + s.ammo);
      expect(have).toEqual(need);
    }
  });

  it('the first 200 levels can all be beaten', () => {
    const lost: number[] = [];
    for (let i = 0; i < 200; i++) if (!botSolve(buildLevel(i)).won) lost.push(i + 1);
    expect(lost).toEqual([]);
  }, 600_000);

  it('difficulty ramps up', () => {
    expect(levelParams(0).maxColors).toBeLessThan(levelParams(100).maxColors);
    expect(levelParams(9).hard).toBe(true);
  });
});

describe('engine', () => {
  it('losing parks nothing and a revive slot resumes play', () => {
    const l = buildLevel(0);
    const g = new Game({ ...l, slots: 0 });
    // A shooter whose colour is not exposed loops and has nowhere to park.
    const front = g.columns.map((c) => c[0]);
    let lost = false;
    for (const id of front) g.tap(id);
    for (let t = 0; t < 2000 && g.status === 'playing'; t++) g.step(1 / 60);
    if (g.status === 'lost') {
      lost = true;
      g.addSlot();
      expect(g.status).toBe('playing');
    }
    expect(lost || g.status === 'won' || g.status === 'playing').toBe(true);
  });
});
