// Story progression: which place the player is restoring, the next task, and buying it.

import { PLACES, Place, Task } from '../story/story';
import { GameState } from './model';

export interface Progress {
  placeIndex: number;
  place: Place | null;
  next: Task | null;
  doneInPlace: number;
}

export function progress(s: GameState): Progress {
  for (let i = 0; i < PLACES.length; i++) {
    const place = PLACES[i];
    const remaining = place.tasks.filter((t) => !s.tasksDone.includes(t.id));
    if (remaining.length) {
      return { placeIndex: i, place, next: remaining[0], doneInPlace: place.tasks.length - remaining.length };
    }
  }
  return { placeIndex: PLACES.length, place: null, next: null, doneInPlace: 0 };
}

export type TaskResult =
  | { ok: true; task: Task; place: Place; placeFinished: boolean; nextPlace: Place | null }
  | { ok: false; reason: 'notEnoughStars' | 'allDone' };

export function completeNextTask(s: GameState): TaskResult {
  const p = progress(s);
  if (!p.next || !p.place) return { ok: false, reason: 'allDone' };
  if (s.stars < p.next.cost) return { ok: false, reason: 'notEnoughStars' };
  s.stars -= p.next.cost;
  s.tasksDone.push(p.next.id);
  const placeFinished = p.place.tasks.every((t) => s.tasksDone.includes(t.id));
  return {
    ok: true,
    task: p.next,
    place: p.place,
    placeFinished,
    nextPlace: placeFinished ? PLACES[p.placeIndex + 1] ?? null : null,
  };
}

/** Story scenes the player has not seen yet are tracked by key in `storySeen`. */
export const introKey = (placeId: string) => `${placeId}:intro`;
export const outroKey = (placeId: string) => `${placeId}:outro`;
export function markSeen(s: GameState, key: string): boolean {
  if (s.storySeen.includes(key)) return false;
  s.storySeen.push(key);
  return true;
}
