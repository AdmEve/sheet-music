// All place scenes, by place id.

import { hasStyles, restyle } from './decor';
import { SCENES1, SceneDef } from './scenes';
import { SCENES2 } from './scenes2';
import { SCENES3 } from './scenes3';

const SCENES: Record<string, SceneDef> = { ...SCENES1, ...SCENES2, ...SCENES3 };

/** `style` picks the decoration style of each restored layer (0 = traditional). */
export function sceneSvg(placeId: string, done: (layer: string) => boolean, style: (layer: string) => number = () => 0): string {
  const def = SCENES[placeId];
  if (!def) return '';
  const body = def.order.map((k) => (done(k) ? restyle(def.layers[k](true), style(k)) : def.layers[k](false))).join('');
  return `<svg viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">${def.base}${body}</svg>`;
}

/** Whether a place's layer has decoration choices worth offering. */
export function layerHasStyles(placeId: string, layer: string): boolean {
  const def = SCENES[placeId];
  return !!def?.layers[layer] && hasStyles(def.layers[layer](true));
}
