/** Screen router, kept separate so screens can link to each other without import cycles. */
export const nav = {
  home: (() => {}) as (opts?: { from?: { x: number; y: number } }) => void,
  play: (() => {}) as (opts?: { from?: { x: number; y: number } }) => void,
  screen: 'home' as 'home' | 'game',
};

export const screenEl = (): HTMLElement => document.getElementById('screen')!;
