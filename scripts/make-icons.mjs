// Draws the launcher icons, adaptive-icon foregrounds, splash screens and the 512px store icon
// with the game's own art code. Run with the Vite dev server up: `npx vite --port 5179 &`.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require(execSync('npm root -g').toString().trim() + '/playwright');
const root = fileURLToPath(new URL('..', import.meta.url));
const res = root + 'android/app/src/main/res/';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:5179/scripts/icon.html');
await page.waitForFunction(() => window.ready);
const draw = async (kind, w, h, file) => {
  const url = await page.evaluate(([k, a, b]) => window.render(k, a, b), [kind, w, h]);
  writeFileSync(file, Buffer.from(url.split(',')[1], 'base64'));
};
const dens = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
for (const [d, k] of Object.entries(dens)) {
  const dir = res + `mipmap-${d}/`;
  await draw('icon', 48 * k, 48 * k, dir + 'ic_launcher.png');
  await draw('round', 48 * k, 48 * k, dir + 'ic_launcher_round.png');
  await draw('foreground', 108 * k, 108 * k, dir + 'ic_launcher_foreground.png');
}
// Splash images keep the sizes the Capacitor template shipped with.
const sizeOf = (orient, d) => {
  const base = { mdpi: [320, 480], hdpi: [480, 800], xhdpi: [720, 1280], xxhdpi: [960, 1600], xxxhdpi: [1280, 1920] }[d];
  return orient === 'land' ? [base[1], base[0]] : base;
};
for (const dir of readdirSync(res)) {
  const m = dir.match(/^drawable-(port|land)-(\w+)$/);
  if (!m) continue;
  const [w, h] = sizeOf(m[1], m[2]);
  await draw('splash', w, h, res + dir + '/splash.png');
}
await draw('splash', 480, 800, res + 'drawable/splash.png');
if (!existsSync(root + 'store')) mkdirSync(root + 'store');
await draw('store', 512, 512, root + 'store/icon-512.png');
await browser.close();
console.log('icons written');
