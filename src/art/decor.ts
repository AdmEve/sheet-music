// Decoration styles: every restored piece of a place can be shown in one of three looks.
// A style is a palette swap applied to the restored layer's drawing, so each of the ~50
// restoration tasks gets three variants without drawing them by hand.

export interface Style {
  name: string;
  /** Paint (gradient url or hex colour) → replacement. */
  swap: Record<string, string>;
}

export const STYLES: Style[] = [
  { name: 'سنتی', swap: {} },
  {
    name: 'فیروزه‌ای',
    swap: {
      'url(#gRoseDeep)': 'url(#gBlue)', 'url(#gRose)': 'url(#gSky)', 'url(#gCarpet)': 'url(#gGreenTile)', 'url(#gRed)': 'url(#gTurq)',
      'url(#gNavy)': 'url(#gTurq)', 'url(#gWood)': 'url(#gTurq)', 'url(#gWoodDark)': 'url(#gNavy)', 'url(#gPurple)': 'url(#gBlue)', '#c0392b': '#14879a', '#1d4fa8': '#0f6b7a',
      'url(#gBrass)': 'url(#gSilver)', 'url(#gCopper)': 'url(#gSilver)', 'url(#gClay)': 'url(#gGreenTile)',
    },
  },
  {
    name: 'گلبهی',
    swap: {
      'url(#gTurq)': 'url(#gRose)', 'url(#gBlue)': 'url(#gPurple)', 'url(#gCarpet)': 'url(#gPurple)', 'url(#gNavy)': 'url(#gRoseDeep)',
      'url(#gRed)': 'url(#gRoseDeep)', 'url(#gGreenTile)': 'url(#gRose)', 'url(#gWood)': 'url(#gRose)', 'url(#gWoodDark)': 'url(#gRoseDeep)', 'url(#gSky)': 'url(#gRose)',
      '#c0392b': '#7b4bb8', '#1d4fa8': '#b8204e', 'url(#gBrass)': 'url(#gCopper)', 'url(#gCopper)': 'url(#gGold)', 'url(#gClay)': 'url(#gTerracotta)',
    },
  },
];

const PATTERNS = STYLES.map((st) => {
  const keys = Object.keys(st.swap);
  return keys.length ? new RegExp(keys.map((k) => k.replace(/[()#]/g, (c) => `\\${c}`)).join('|'), 'g') : null;
});

/** The drawing with style `k` applied (one pass, so swaps never chain). */
export function restyle(svg: string, k: number): string {
  const re = PATTERNS[k];
  return re ? svg.replace(re, (m) => STYLES[k].swap[m] ?? m) : svg;
}

/** True when the styles actually look different for this drawing. */
export const hasStyles = (svg: string) => STYLES.some((_, k) => k > 0 && restyle(svg, k) !== svg);
