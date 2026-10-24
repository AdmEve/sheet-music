// Shared SVG gradients/filters. Injected once into the page; every item SVG references them
// by id so each drawing stays small.

const lin = (id: string, stops: [number, string][], x2 = 0, y2 = 1) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops
    .map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`)
    .join('')}</linearGradient>`;

const rad = (id: string, stops: [number, string][], cx = 0.35, cy = 0.3, r = 0.8) =>
  `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops
    .map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`)
    .join('')}</radialGradient>`;

export const DEFS = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
${lin('gPom', [[0, '#ff6d7a'], [0.5, '#d9283f'], [1, '#8e1230']], 1, 1)}
${lin('gSeed', [[0, '#ffb3bd'], [1, '#e0284a']])}
${lin('gRind', [[0, '#6fcf62'], [1, '#2d7a33']])}
${lin('gMelon', [[0, '#ff8a8a'], [1, '#e0303f']])}
${lin('gWater', [[0, '#bfe9ff'], [1, '#6cc0ea']])}
${lin('gOrange', [[0, '#ffc266'], [1, '#f07b1d']])}
${lin('gPlum', [[0, '#b26ad0'], [1, '#5a2178']])}
${lin('gGreenPlum', [[0, '#d5f28a'], [1, '#7fb32e']])}
${lin('gLavashak', [[0, '#c0394f'], [1, '#6e1426']])}
${lin('gWicker', [[0, '#e8b46a'], [1, '#a8702d']])}
${lin('gCopper', [[0, '#f3a26b'], [0.5, '#c8642f'], [1, '#8d3d1a']], 1, 0)}
${lin('gBrass', [[0, '#ffe08a'], [0.45, '#d9a63a'], [1, '#93661a']], 1, 0)}
${lin('gGold', [[0, '#fff2a8'], [0.4, '#f6c945'], [1, '#b7801c']], 1, 0)}
${lin('gSilver', [[0, '#ffffff'], [0.45, '#c9d1dc'], [1, '#7f8a99']], 1, 0)}
${lin('gWood', [[0, '#c98a52'], [1, '#8b5328']])}
${lin('gWoodDark', [[0, '#9a6036'], [1, '#5e3418']])}
${lin('gGlass', [[0, 'rgba(255,255,255,.85)'], [1, 'rgba(206,232,240,.55)']], 1, 0)}
${lin('gTea', [[0, '#e0661c'], [1, '#9a2c0b']])}
${lin('gClay', [[0, '#e7a070'], [1, '#b0603a']])}
${lin('gTerracotta', [[0, '#d9774a'], [1, '#9c4325']])}
${lin('gTurq', [[0, '#5fe0e0'], [1, '#14879a']])}
${lin('gBlue', [[0, '#5aa7ff'], [1, '#1d4fa8']])}
${lin('gRose', [[0, '#ffb3c6'], [1, '#e2507a']])}
${lin('gRoseDeep', [[0, '#ff7a9c'], [1, '#b8204e']])}
${lin('gLeaf', [[0, '#9be36b'], [1, '#3f9a32']])}
${lin('gLeafDark', [[0, '#6cc04a'], [1, '#2a7426']])}
${lin('gBread', [[0, '#f8cf7f'], [1, '#c98a35']])}
${lin('gCrust', [[0, '#e8a64c'], [1, '#a5621f']])}
${lin('gDough', [[0, '#fff8e8'], [1, '#efd9b0']])}
${lin('gCream', [[0, '#fffdf6'], [1, '#efe4cc']])}
${lin('gRed', [[0, '#ff6b5e'], [1, '#c02a2a']])}
${lin('gCarpet', [[0, '#c63a3a'], [1, '#7d1622']])}
${lin('gNavy', [[0, '#3a4f9a'], [1, '#1b275a']])}
${lin('gPaper', [[0, '#fff7e3'], [1, '#e8d6ad']])}
${lin('gSoil', [[0, '#8a5a3b'], [1, '#553420']])}
${lin('gSteel', [[0, '#eef2f6'], [1, '#8e99a6']], 1, 0)}
${lin('gPurple', [[0, '#c58bff'], [1, '#6c33c2']])}
${lin('gGreenTile', [[0, '#7fd6a0'], [1, '#2c8a5b']])}
${lin('gYellow', [[0, '#ffe36e'], [1, '#e7a512']])}
${lin('gFire', [[0, '#fff27a'], [0.5, '#ff9c2b'], [1, '#e2421b']])}
${lin('gSky', [[0, '#bfe9ff'], [1, '#7cc4ef']])}
${rad('rWool', [[0, '#ffffff'], [1, '#e6ddd0']])}
${rad('rSugar', [[0, '#ffffff'], [1, '#e8eef2']])}
${rad('rGlow', [[0, 'rgba(255,240,150,.95)'], [1, 'rgba(255,200,60,0)']], 0.5, 0.5, 0.5)}
${rad('rCoin', [[0, '#fff6b8'], [0.6, '#f4c43a'], [1, '#b98118']])}
<filter id="fGray"><feColorMatrix type="saturate" values="0.12"/></filter>
</defs></svg>`;
