// All place scenes, by place id.

import { SCENES1, SceneDef } from './scenes';
import { SCENES2 } from './scenes2';

const SCENES: Record<string, SceneDef> = { ...SCENES1, ...SCENES2 };

export function sceneSvg(placeId: string, done: (layer: string) => boolean): string {
  const def = SCENES[placeId];
  if (!def) return '';
  const body = def.order.map((k) => def.layers[k](done(k))).join('');
  return `<svg viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">${def.base}${body}</svg>`;
}
