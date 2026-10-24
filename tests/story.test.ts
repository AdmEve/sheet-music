import { describe, expect, it } from 'vitest';
import { newGame } from '../src/game/model';
import { completeNextTask, progress } from '../src/game/progress';
import { CAST, PLACES } from '../src/story/story';

describe('story data', () => {
  it('only uses known characters', () => {
    for (const p of PLACES) {
      for (const l of [...p.intro, ...p.outro, ...p.tasks.flatMap((t) => t.after)]) {
        expect(CAST[l.who], `${p.id}: ${l.who}`).toBeDefined();
        expect(l.text.length).toBeGreaterThan(0);
      }
    }
  });

  it('has unique task ids and rising costs per place', () => {
    const ids = PLACES.flatMap((p) => p.tasks.map((t) => t.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of PLACES) {
      for (let i = 1; i < p.tasks.length; i++) expect(p.tasks[i].cost).toBeGreaterThanOrEqual(p.tasks[i - 1].cost);
    }
  });
});

describe('progression', () => {
  it('walks through places in order, spending stars', () => {
    const s = newGame(1, 0);
    expect(progress(s).place?.id).toBe('teahouse');
    expect(completeNextTask(s)).toEqual({ ok: false, reason: 'notEnoughStars' });
    s.stars = 100_000;
    let finished = 0;
    let guard = 0;
    while (progress(s).next && guard++ < 500) {
      const r = completeNextTask(s);
      expect(r.ok).toBe(true);
      if (r.ok && r.placeFinished) finished++;
    }
    expect(finished).toBe(PLACES.length);
    expect(completeNextTask(s)).toEqual({ ok: false, reason: 'allDone' });
    const total = PLACES.flatMap((p) => p.tasks).reduce((a, t) => a + t.cost, 0);
    expect(s.stars).toBe(100_000 - total);
  });
});

describe('thank-you lines', () => {
  it('exist for every character', async () => {
    const { THANKS } = await import('../src/story/story');
    for (const id of Object.keys(CAST)) expect(THANKS[id]?.length, id).toBeGreaterThan(0);
  });
});
