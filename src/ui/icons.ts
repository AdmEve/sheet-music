/**
 * The game's icon set as inline SVG, so icons look identical on every phone (emoji differ per
 * brand). Shared gradients live once in a hidden <defs> block (installIconDefs).
 */
const DEFS = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <linearGradient id="ig-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2a8"/><stop offset=".45" stop-color="#ffcc33"/><stop offset="1" stop-color="#d98a00"/></linearGradient>
    <linearGradient id="ig-gold-d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9a400"/><stop offset="1" stop-color="#a65d00"/></linearGradient>
    <linearGradient id="ig-red" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8a9b"/><stop offset=".5" stop-color="#ff3b5c"/><stop offset="1" stop-color="#c4143a"/></linearGradient>
    <linearGradient id="ig-green" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b6f28a"/><stop offset="1" stop-color="#3fae2a"/></linearGradient>
    <linearGradient id="ig-blue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fe3ff"/><stop offset="1" stop-color="#1f86d6"/></linearGradient>
    <linearGradient id="ig-violet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c79bff"/><stop offset="1" stop-color="#6b31c9"/></linearGradient>
    <linearGradient id="ig-steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6f6a86"/><stop offset="1" stop-color="#2e2a3f"/></linearGradient>
    <linearGradient id="ig-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9773a"/><stop offset="1" stop-color="#7a3d16"/></linearGradient>
  </defs>
</svg>`;

export function installIconDefs() {
  if (document.getElementById('icon-defs')) return;
  const d = document.createElement('div');
  d.id = 'icon-defs';
  d.innerHTML = DEFS;
  document.body.prepend(d);
}

const ICONS: Record<string, string> = {
  coin: `<circle cx="12" cy="12" r="10.5" fill="url(#ig-gold-d)"/><circle cx="12" cy="11" r="10" fill="url(#ig-gold)"/><circle cx="12" cy="11" r="7" fill="none" stroke="#d48a00" stroke-width="1.4"/><path d="M12 6.6l1.35 2.75 3.05.45-2.2 2.15.52 3.03L12 13.55 9.28 14.98l.52-3.03-2.2-2.15 3.05-.45z" fill="#fff6c4" stroke="#c98100" stroke-width=".7"/>`,
  heart: `<path d="M12 21.2s-8.6-5.3-9.8-11C1.4 6.3 4 3.4 7.2 3.6c2 .1 3.5 1.3 4.8 3 1.3-1.7 2.8-2.9 4.8-3 3.2-.2 5.8 2.7 5 6.6-1.2 5.7-9.8 11-9.8 11z" fill="url(#ig-red)" stroke="#9e0f2e" stroke-width="1"/><path d="M6.2 6.3c1.2-.9 2.8-.6 3.6.5" stroke="#fff" stroke-opacity=".75" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
  star: `<path d="M12 1.8l3.05 6.2 6.85 1-4.95 4.8 1.17 6.8L12 17.4l-6.12 3.2 1.17-6.8L2.1 9l6.85-1z" fill="url(#ig-gold)" stroke="#c07800" stroke-width="1.1" stroke-linejoin="round"/><path d="M8.6 9.4l2-.3" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>`,
  starEmpty: `<path d="M12 1.8l3.05 6.2 6.85 1-4.95 4.8 1.17 6.8L12 17.4l-6.12 3.2 1.17-6.8L2.1 9l6.85-1z" fill="#3b2a5c" fill-opacity=".35" stroke="#3b2a5c" stroke-opacity=".35" stroke-width="1.1" stroke-linejoin="round"/>`,
  gear: `<path d="M10.3 2h3.4l.5 2.6 1.7.8 2.2-1.5 2.4 2.4-1.5 2.2.8 1.7 2.6.5v3.4l-2.6.5-.8 1.7 1.5 2.2-2.4 2.4-2.2-1.5-1.7.8-.5 2.6h-3.4l-.5-2.6-1.7-.8-2.2 1.5-2.4-2.4 1.5-2.2-.8-1.7L2 13.7v-3.4l2.6-.5.8-1.7-1.5-2.2 2.4-2.4 2.2 1.5 1.7-.8z" fill="url(#ig-steel)"/><circle cx="12" cy="12" r="3.6" fill="#e9e3ff"/>`,
  shop: `<path d="M4 8h16l-1.3 12.2a1.6 1.6 0 01-1.6 1.4H6.9a1.6 1.6 0 01-1.6-1.4z" fill="url(#ig-violet)"/><path d="M8 9V6.5a4 4 0 018 0V9" fill="none" stroke="#6b31c9" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="14.5" r="3" fill="url(#ig-gold)"/>`,
  gift: `<rect x="3" y="9" width="18" height="12.5" rx="2" fill="url(#ig-red)"/><rect x="2" y="7" width="20" height="4.2" rx="1.4" fill="#ff5c78"/><rect x="10.4" y="7" width="3.2" height="14.5" fill="url(#ig-gold)"/><path d="M12 7c-1.5-3.4-5.6-4.3-5.6-1.6C6.4 7 9.6 7 12 7c2.4 0 5.6 0 5.6-1.6 0-2.7-4.1-1.8-5.6 1.6z" fill="url(#ig-gold)" stroke="#c07800" stroke-width=".8"/>`,
  gallery: `<rect x="2.5" y="3.5" width="19" height="17" rx="2.4" fill="url(#ig-gold)"/><rect x="5" y="6" width="14" height="12" rx="1" fill="#7fd6ff"/><path d="M5 16l4-4.5 3 3 2.5-2.5L19 16.5V18H5z" fill="#43b04a"/><circle cx="15.5" cy="9" r="1.6" fill="#fff6b0"/>`,
  home: `<path d="M3 11.2L12 3.5l9 7.7V20a1.5 1.5 0 01-1.5 1.5H15v-6H9v6H4.5A1.5 1.5 0 013 20z" fill="url(#ig-blue)"/><path d="M12 2.5L1.8 11.3l1.4 1.5L12 5.3l8.8 7.5 1.4-1.5z" fill="#ff5c78"/>`,
  pause: `<rect x="6" y="4.5" width="4.2" height="15" rx="1.4" fill="currentColor"/><rect x="13.8" y="4.5" width="4.2" height="15" rx="1.4" fill="currentColor"/>`,
  play: `<path d="M8 4.8v14.4a1 1 0 001.5.86l11.6-7.2a1 1 0 000-1.72L9.5 3.94A1 1 0 008 4.8z" fill="currentColor"/>`,
  retry: `<path d="M12 4a8 8 0 107.4 5" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><path d="M14 2.5l5.8 1.4-2.4 5.3z" fill="currentColor"/>`,
  close: `<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/>`,
  sound: `<path d="M3 9.5h4l5-4.5v14l-5-4.5H3z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 010 7M18 6a8.5 8.5 0 010 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  music: `<path d="M9 17.5V5.5l11-2.5v12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="6.5" cy="17.5" r="3" fill="currentColor"/><circle cx="17.5" cy="15" r="3" fill="currentColor"/>`,
  vibrate: `<rect x="7.5" y="3" width="9" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M3.5 8v8M20.5 8v8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  film: `<rect x="3" y="7" width="18" height="13" rx="2" fill="currentColor"/><path d="M3 7l3-4h3L6 7zm6 0l3-4h3l-3 4zm6 0l3-4h3l-3 4z" fill="currentColor"/><path d="M10 11v6l5-3z" fill="#3fae2a"/>`,
  slot: `<rect x="3" y="7" width="18" height="12" rx="3.5" fill="url(#ig-blue)" stroke="#155f9e" stroke-width="1"/><circle cx="12" cy="13" r="4.6" fill="#fff"/><path d="M12 10.6v4.8M9.6 13h4.8" stroke="#1f86d6" stroke-width="2.2" stroke-linecap="round"/><path d="M6 4.5h12" stroke="#ffd84a" stroke-width="2" stroke-linecap="round"/>`,
  bomb: `<circle cx="11" cy="14" r="7.5" fill="url(#ig-steel)"/><rect x="11.5" y="4.6" width="4" height="3.4" rx=".8" transform="rotate(35 13.5 6.3)" fill="#6f6a86"/><path d="M15.5 4.5c1-2 3-2.2 4.2-1" stroke="#c99434" stroke-width="1.5" fill="none" stroke-linecap="round"/><circle cx="20" cy="3.2" r="1.8" fill="#ffcf3f"/><circle cx="20" cy="3.2" r=".9" fill="#fff"/><ellipse cx="8.4" cy="11.6" rx="2" ry="1.3" fill="#fff" opacity=".45" transform="rotate(-35 8.4 11.6)"/>`,
  lock: `<rect x="4.5" y="10" width="15" height="11" rx="2.5" fill="url(#ig-gold)"/><path d="M8 10V7.5a4 4 0 018 0V10" fill="none" stroke="#c07800" stroke-width="2.4"/><circle cx="12" cy="15" r="1.8" fill="#8a5300"/>`,
  check: `<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`,
  chest: `<path d="M3 10h18v9.5a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 19.5z" fill="url(#ig-wood)"/><path d="M3 10a9 5.5 0 0118 0z" fill="#b5652c"/><rect x="2.5" y="9.3" width="19" height="2.4" fill="url(#ig-gold)"/><rect x="10" y="11" width="4" height="5" rx="1" fill="url(#ig-gold)"/><path d="M6 12v8M18 12v8" stroke="url(#ig-gold)" stroke-width="1.6"/>`,
  infinity: `<path d="M6.5 8.5C3 8.5 3 15.5 6.5 15.5S11 12 12 12s2.5 3.5 5.5 3.5 3.5-7 0-7S13 12 12 12 10 8.5 6.5 8.5z" fill="none" stroke="currentColor" stroke-width="2.6"/>`,
  flame: `<path d="M12 22c-4.4 0-7-2.9-7-6.6 0-3.4 2.4-5.4 3.6-7.6.4 1.6 1.4 2.6 2.4 3.1C11 7.4 12.6 4 15.6 2c-.6 3.2.6 5.4 2 7.4 1 1.4 1.4 3 1.4 4.8C19 18.6 16.4 22 12 22z" fill="#ff7a1a"/><path d="M12 22c-2.2 0-3.6-1.5-3.6-3.5 0-2 1.6-3.2 2.4-4.6.4 1 1 1.6 1.6 1.8.2-1.8 1-3.2 2.2-4 .2 1.6.8 2.6 1.4 3.6.4.7.6 1.6.6 2.4 0 2.6-2 4.3-4.6 4.3z" fill="#ffd23f"/>`,
  paw: `<ellipse cx="12" cy="15.5" rx="5" ry="4.2" fill="currentColor"/><circle cx="6" cy="10" r="2.1" fill="currentColor"/><circle cx="9.6" cy="6.5" r="2.1" fill="currentColor"/><circle cx="14.4" cy="6.5" r="2.1" fill="currentColor"/><circle cx="18" cy="10" r="2.1" fill="currentColor"/>`,
  noAds: `<circle cx="12" cy="12" r="9.5" fill="#fff" stroke="#e8384f" stroke-width="2.6"/><path d="M5.3 5.3l13.4 13.4" stroke="#e8384f" stroke-width="2.6"/><path d="M9 9.2v5.6l4.6-2.8z" fill="#3b2a5c"/>`,
  crown: `<path d="M3 8l4.5 4L12 4.5 16.5 12 21 8l-2 11H5z" fill="url(#ig-gold)" stroke="#c07800" stroke-width="1" stroke-linejoin="round"/><circle cx="12" cy="14.5" r="1.6" fill="#ff3b5c"/><circle cx="7.5" cy="15.5" r="1.1" fill="#3ec9e6"/><circle cx="16.5" cy="15.5" r="1.1" fill="#3ec9e6"/>`,
  rate: `<path d="M12 1.8l3.05 6.2 6.85 1-4.95 4.8 1.17 6.8L12 17.4l-6.12 3.2 1.17-6.8L2.1 9l6.85-1z" fill="currentColor"/>`,
  restore: `<path d="M4 12a8 8 0 1 0 2.4-5.7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M3 3.5v5h5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,
};

export type IconName = keyof typeof ICONS;

export function icon(name: IconName, cls = ''): HTMLElement {
  const span = document.createElement('span');
  span.className = `ic ic-${name} ${cls}`.trim();
  span.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;
  return span;
}

/** Girih-style eight-point star tile, used as a background pattern. */
export const GIRIH_TILE = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><g fill="none" stroke="white" stroke-opacity="0.13" stroke-width="1.5"><path d="M32 8l7 17 17 7-17 7-7 17-7-17-17-7 17-7z"/><rect x="20" y="20" width="24" height="24" transform="rotate(45 32 32)"/><rect x="20" y="20" width="24" height="24"/><path d="M0 0l8 8M64 0l-8 8M0 64l8-8M64 64l-8-8"/></g></svg>`,
)}`;
