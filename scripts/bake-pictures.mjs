// Renders emoji with Chromium's Noto Color Emoji and turns each into pixel art on
// the game palette, at every grid size the levels use. Output: src/data/pictures.json.
// Baking at build time keeps every level identical on every phone (no device fonts).
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const palette = JSON.parse(readFileSync(root + 'src/data/palette.json', 'utf8'));
const emoji = JSON.parse(readFileSync(root + 'src/data/emoji-list.json', 'utf8'));
// Playwright is a dev-machine tool here (not an app dependency): use the global install.
const require = createRequire(import.meta.url);
const { chromium } = require(execSync('npm root -g').toString().trim() + '/playwright');
const SIZES = [10, 12, 14, 16, 18, 20, 22, 24];

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent('<canvas id="c" width="480" height="480"></canvas>');
const out = await page.evaluate(({ emoji, palette, SIZES }) => {
  const S = 480;
  const c = document.getElementById('c');
  const ctx = c.getContext('2d', { willReadFrequently: true });
  const pal = palette.map((p) => [parseInt(p.hex.slice(1, 3), 16), parseInt(p.hex.slice(3, 5), 16), parseInt(p.hex.slice(5, 7), 16)]);
  const nearest = (r, g, b) => {
    let best = 0, bd = Infinity;
    for (let i = 0; i < pal.length; i++) {
      const [pr, pg, pb] = pal[i];
      const rm = (r + pr) / 2;
      const d = (2 + rm / 256) * (r - pr) ** 2 + 4 * (g - pg) ** 2 + (2 + (255 - rm) / 256) * (b - pb) ** 2;
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  };
  const result = {};
  for (const { id, ch } of emoji) {
    ctx.clearRect(0, 0, S, S);
    ctx.font = '400px "Noto Color Emoji"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ch, S / 2, S / 2 + 20);
    const img = ctx.getImageData(0, 0, S, S).data;
    // Tight bounding box of the drawn glyph, made square.
    let x0 = S, y0 = S, x1 = 0, y1 = 0;
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (img[(y * S + x) * 4 + 3] > 40) {
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
    if (x1 <= x0) continue;
    const side = Math.max(x1 - x0, y1 - y0) + 1;
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const bx = cx - side / 2, by = cy - side / 2;
    const sizes = {};
    for (const n of SIZES) {
      const rows = [];
      const cell = side / n;
      for (let gy = 0; gy < n; gy++) {
        let row = '';
        for (let gx = 0; gx < n; gx++) {
          const votes = new Array(pal.length).fill(0);
          let alpha = 0, count = 0;
          for (let sy = 0; sy < 6; sy++) for (let sx = 0; sx < 6; sx++) {
            const px = Math.floor(bx + (gx + (sx + 0.5) / 6) * cell);
            const py = Math.floor(by + (gy + (sy + 0.5) / 6) * cell);
            count++;
            if (px < 0 || py < 0 || px >= S || py >= S) continue;
            const o = (py * S + px) * 4;
            const a = img[o + 3];
            alpha += a / 255;
            if (a > 100) votes[nearest(img[o], img[o + 1], img[o + 2])] += a;
          }
          if (alpha / count < 0.5) { row += '.'; continue; }
          let best = 0;
          for (let i = 1; i < votes.length; i++) if (votes[i] > votes[best]) best = i;
          row += palette[best].key;
        }
        rows.push(row);
      }
      sizes[n] = rows.join('/');
    }
    result[id] = sizes;
  }
  return result;
}, { emoji, palette, SIZES });
await browser.close();
writeFileSync(root + 'src/data/pictures.json', JSON.stringify(out));
console.log('baked', Object.keys(out).length, 'pictures');
