// Renders launcher icons (legacy, round, adaptive foreground) and splash screens into the
// Android res/ folders from the game's SVG art. Usage: npx tsx scripts/android-assets.ts
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { DEFS } from '../src/art/defs';
import { itemArt } from '../src/art/index';
const { chromium } = createRequire(import.meta.url)('playwright');
const res = 'android/app/src/main/res';
const samovar = itemArt({ chain: 'tea', level: 10 });
const page = await (await chromium.launch()).newPage();
async function render(svg: string, w: number, h: number, path: string, transparent = false) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<html><body style="margin:0;background:${transparent ? 'transparent' : '#f6ead2'}">${DEFS}${svg}</body></html>`);
  await page.screenshot({ path, omitBackground: transparent });
}
const legacy = (s: number, round: boolean) =>
  `<svg width="${s}" height="${s}" viewBox="0 0 100 100">${round ? '<circle cx="50" cy="50" r="50" fill="#e2507a"/><circle cx="50" cy="50" r="46" fill="#fff3da"/>' : '<rect width="100" height="100" rx="22" fill="#e2507a"/><rect x="4" y="4" width="92" height="92" rx="19" fill="#fff3da"/>'}<g transform="translate(10 8) scale(.8)">${samovar}</g></svg>`;
// Adaptive foreground: 108dp canvas, art inside the central 66dp safe zone.
const fg = (s: number) => `<svg width="${s}" height="${s}" viewBox="0 0 108 108"><g transform="translate(23 21) scale(.62)">${samovar}</g></svg>`;
const dens: Record<string, number> = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
for (const [d, k] of Object.entries(dens)) {
  const dir = join(res, `mipmap-${d}`);
  await render(legacy(48 * k, false), 48 * k, 48 * k, join(dir, 'ic_launcher.png'), true);
  await render(legacy(48 * k, true), 48 * k, 48 * k, join(dir, 'ic_launcher_round.png'), true);
  await render(fg(108 * k), 108 * k, 108 * k, join(dir, 'ic_launcher_foreground.png'), true);
}
// Splash images: keep each file's size, draw logo + title centred.
const { execSync } = await import('node:child_process');
for (const dir of readdirSync(res).filter((x) => x.startsWith('drawable'))) {
  const f = join(res, dir, 'splash.png');
  if (!existsSync(f)) continue;
  const [w, h] = execSync(`python3 -c "import struct;d=open('${f}','rb').read(24);print(*struct.unpack('>II',d[16:24]))"`).toString().trim().split(' ').map(Number);
  const m = Math.min(w, h);
  await render(`<div style="width:${w}px;height:${h}px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 40%,#fff3da,#f0d7a8)"><svg width="${m * 0.35}" height="${m * 0.35}" viewBox="0 0 100 100">${samovar}</svg></div>`, w, h, f);
}
console.log('android assets written');
process.exit(0);
