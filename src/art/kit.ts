// Small drawing helpers shared by all item art (100×100 viewBox).

export const INK = '#4b2e1e';
export const O = `stroke="${INK}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"`;
export const THIN = `stroke="${INK}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"`;

export const shadow = (cx = 50, cy = 89, rx = 30, ry = 5) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="rgba(60,30,10,.18)"/>`;

/** White gloss highlight. */
export const shine = (cx: number, cy: number, rx: number, ry: number, rot = -25, op = 0.6) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${cy})" fill="#fff" opacity="${op}"/>`;

export const sparkle = (x: number, y: number, s = 6, fill = '#fff') =>
  `<path d="M${x} ${y - s} L${x + s * 0.28} ${y - s * 0.28} L${x + s} ${y} L${x + s * 0.28} ${y + s * 0.28} L${x} ${y + s} L${x - s * 0.28} ${y + s * 0.28} L${x - s} ${y} L${x - s * 0.28} ${y - s * 0.28} Z" fill="${fill}" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/>`;

export const g = (inner: string, t = '') => `<g${t ? ` transform="${t}"` : ''}>${inner}</g>`;

export const svg = (inner: string) =>
  `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

// ---------------------------------------------------------------- reusable objects

/** Tulip-shaped Persian tea glass (estekan). */
export function estekan(x: number, y: number, s = 1, withTea = false, saucer = true): string {
  const t = `translate(${x} ${y}) scale(${s})`;
  const body = 'M-18 -26 C-18 -12 -10 -8 -9 0 C-9 8 -15 14 -13 22 L13 22 C15 14 9 8 9 0 C10 -8 18 -12 18 -26 Z';
  const tea = 'M-16 -17 C-15 -9 -9 -6 -8 0 C-8 7 -13 13 -12 20 L12 20 C13 13 8 7 8 0 C9 -6 15 -9 16 -17 Z';
  return g(
    (saucer
      ? `<ellipse cx="0" cy="25" rx="25" ry="6.5" fill="url(#gCream)" ${O}/><ellipse cx="0" cy="24" rx="17" ry="3.2" fill="none" stroke="#3a76c4" stroke-width="1.6"/>`
      : '') +
      (withTea ? `<path d="${tea}" fill="url(#gTea)"/>` : '') +
      `<path d="${body}" fill="url(#gGlass)" fill-opacity="${withTea ? 0.35 : 0.9}" ${O}/>` +
      // Solid colour: a gradient stroke on a perfectly straight line has a zero-size box and draws nothing.
      `<path d="M-18 -26 L18 -26" stroke="#e9b949" stroke-width="4" stroke-linecap="round"/>` +
      `<path d="M-18 -26 L18 -26" stroke="${INK}" stroke-width="1" opacity=".5"/>` +
      shine(-10, -14, 2.2, 7, 10, 0.85),
    t,
  );
}

export function sugarCube(x: number, y: number, s = 1): string {
  return g(
    `<path d="M-9 -4 L0 -9 L9 -4 L9 6 L0 11 L-9 6 Z" fill="url(#rSugar)" ${O}/>` +
      `<path d="M-9 -4 L0 1 L9 -4 M0 1 L0 11" fill="none" ${THIN} opacity=".55"/>` +
      `<circle cx="-4" cy="3" r=".9" fill="#cdd6de"/><circle cx="4" cy="5" r=".9" fill="#cdd6de"/><circle cx="2" cy="-4" r=".9" fill="#cdd6de"/>`,
    `translate(${x} ${y}) scale(${s})`,
  );
}

/** Round-bellied teapot, `deco` draws on the belly. */
export function teapot(x: number, y: number, s = 1, fill = 'url(#gCream)', deco = ''): string {
  return g(
    `<path d="M20 -2 C30 -4 32 8 22 12" fill="none" ${O} stroke-width="5"/>` +
      `<path d="M20 -2 C30 -4 32 8 22 12" fill="none" stroke="#fff" stroke-width="2"/>` +
      `<path d="M-20 4 C-30 2 -34 -8 -38 -14 L-33 -16 C-29 -10 -26 -6 -19 -4 Z" fill="${fill}" ${O}/>` +
      `<ellipse cx="0" cy="4" rx="24" ry="18" fill="${fill}" ${O}/>` +
      deco +
      `<path d="M-13 -12 Q0 -24 13 -12 Z" fill="${fill}" ${O}/>` +
      `<circle cx="0" cy="-20" r="3.6" fill="url(#gGold)" ${THIN}/>` +
      `<path d="M-20 14 Q0 26 20 14" fill="none" stroke="#3a76c4" stroke-width="2"/>` +
      shine(-12, -2, 4, 8, 30, 0.7),
    `translate(${x} ${y}) scale(${s})`,
  );
}

export const roseMotif = (x: number, y: number, r = 5) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gRoseDeep)" ${THIN}/><path d="M${x - r * 0.5} ${y} q${r * 0.5} -${r * 0.6} ${r} 0" fill="none" stroke="#fff" stroke-width="1" opacity=".8"/>` +
  `<path d="M${x + r} ${y + 1} q${r} -1 ${r * 1.6} ${r * 0.6} q-${r} ${r * 0.4} -${r * 1.6} -${r * 0.6} Z" fill="url(#gLeaf)" ${THIN}/>` +
  `<path d="M${x - r} ${y + 1} q-${r} -1 -${r * 1.6} ${r * 0.6} q${r} ${r * 0.4} ${r * 1.6} -${r * 0.6} Z" fill="url(#gLeaf)" ${THIN}/>`;

/** Samovar in the given metal gradient; `top` adds a teapot crown. */
export function samovar(metal: string, ornate = false): string {
  const body = 'M30 30 C26 40 24 54 30 64 L70 64 C76 54 74 40 70 30 Z';
  return (
    shadow(50, 90, 26) +
    `<path d="M36 64 L32 78 L68 78 L64 64 Z" fill="${metal}" ${O}/>` +
    `<path d="M28 78 L72 78 L75 84 L25 84 Z" fill="${metal}" ${O}/>` +
    `<path d="M30 34 C18 34 18 50 28 52" fill="none" ${O} stroke-width="4.5"/><path d="M70 34 C82 34 82 50 72 52" fill="none" ${O} stroke-width="4.5"/>` +
    `<path d="M30 34 C18 34 18 50 28 52" fill="none" stroke="${metal}" stroke-width="2"/><path d="M70 34 C82 34 82 50 72 52" fill="none" stroke="${metal}" stroke-width="2"/>` +
    `<path d="${body}" fill="${metal}" ${O}/>` +
    `<path d="M28 44 L72 44" stroke="${INK}" stroke-width="1.5" opacity=".45"/>` +
    `<path d="M29 54 L71 54" stroke="${INK}" stroke-width="1.5" opacity=".45"/>` +
    (ornate
      ? `<circle cx="50" cy="49" r="5" fill="url(#gTurq)" ${THIN}/><circle cx="38" cy="49" r="2.4" fill="url(#gRoseDeep)" ${THIN}/><circle cx="62" cy="49" r="2.4" fill="url(#gRoseDeep)" ${THIN}/>`
      : '') +
    `<path d="M44 58 L56 58 L56 62 L60 64 L60 69 L54 69 L54 64 L46 64 Z" fill="${metal}" ${THIN}/>` +
    `<path d="M33 30 L67 30 L62 22 L38 22 Z" fill="${metal}" ${O}/>` +
    `<rect x="44" y="12" width="12" height="10" rx="2" fill="${metal}" ${O}/>` +
    shine(36, 42, 3.5, 10, 0, 0.7)
  );
}

export function coin(x: number, y: number, r = 9): string {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#rCoin)" ${O}/><circle cx="${x}" cy="${y}" r="${r * 0.62}" fill="none" stroke="#b07a10" stroke-width="1.6"/>` +
    `<path d="M${x - r * 0.2} ${y - r * 0.35} L${x + r * 0.2} ${y - r * 0.35} M${x} ${y - r * 0.35} L${x} ${y + r * 0.35}" stroke="#a06c0c" stroke-width="1.8" stroke-linecap="round"/>`;
}

export function bolt(x: number, y: number, s = 1): string {
  return g(
    `<path d="M3 -16 L-9 3 L-1 3 L-4 16 L9 -3 L1 -3 Z" fill="url(#gYellow)" ${O}/>`,
    `translate(${x} ${y}) scale(${s})`,
  );
}
