// All place scenes, by place id.

import { hasStyles, restyle } from './decor';
import { SCENES1, SceneDef } from './scenes';
import { SCENES2 } from './scenes2';
import { SCENES3 } from './scenes3';
import { SCENES4 } from './scenes4';
import { SCENES5 } from './scenes5';
import { SCENES6 } from './scenes6';
import { SCENES7 } from './scenes7';
import { SCENES8 } from './scenes8';
import { SCENES9 } from './scenes9';
import { SCENES10 } from './scenes10';
import { SCENES11 } from './scenes11';
import { SCENES12 } from './scenes12';
import { SCENES13 } from './scenes13';
import { SCENES14 } from './scenes14';

const SCENES: Record<string, SceneDef> = { ...SCENES1, ...SCENES2, ...SCENES3, ...SCENES4, ...SCENES5, ...SCENES6, ...SCENES7, ...SCENES8, ...SCENES9, ...SCENES10, ...SCENES11, ...SCENES12, ...SCENES13, ...SCENES14 };

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
