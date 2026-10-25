// Turns Twemoji artwork (flat colours, crisp shapes: it pixelates cleanly) into pixel art on
// the game palette, at every grid size the levels use. Output: src/data/pictures.json.
// Twemoji graphics: Copyright Twitter Inc. and other contributors, CC-BY 4.0 (credited in-game).
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { existsSync, writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const palette = JSON.parse(readFileSync(root + 'src/data/palette.json', 'utf8'));
const emoji = JSON.parse(readFileSync(root + 'src/data/emoji-list.json', 'utf8'));
// Playwright is a dev-machine tool here (not an app dependency): use the global install.
const require = createRequire(import.meta.url);
const { chromium } = require(execSync('npm root -g').toString().trim() + '/playwright');
const SIZES = [16, 18, 20, 22, 24];

/** Twemoji file for an emoji: code points in hex, without the FE0F variation selector. */
function svgFor(ch) {
  const cps = [...ch].map((c) => c.codePointAt(0).toString(16));
  const dir = root + 'node_modules/@twemoji/svg/';
  for (const name of [cps.filter((c) => c !== 'fe0f').join('-'), cps.join('-')]) {
    if (existsSync(dir + name + '.svg')) return readFileSync(dir + name + '.svg', 'utf8');
  }
  return null;
}
const sources = emoji.map(({ id, ch }) => ({ id, svg: svgFor(ch) })).filter((e) => e.svg);
console.log('twemoji found for', sources.length, 'of', emoji.length);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent('<canvas id="c" width="480" height="480"></canvas>');
const out = await page.evaluate(async ({ sources, palette, SIZES }) => {
  const S = 480;
  const c = document.getElementById('c');
  const ctx = c.getContext('2d', { willReadFrequently: true });
  // Match colours in CIELAB so shades (e.g. red vs maroon) land where the eye expects.
  const lab = (r, g, b) => {
    const f = (v) => { v /= 255; return v > 0.04045 ? Math.pow((v + 0.055) / 1.055, 2.4) : v / 12.92; };
    const R = f(r), G = f(g), B = f(b);
    const X = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047, Y = R * 0.2126 + G * 0.7152 + B * 0.0722, Z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;
    const t = (v) => (v > 0.008856 ? Math.cbrt(v) : 7.787 * v + 16 / 116);
    return [116 * t(Y) - 16, 500 * (t(X) - t(Y)), 200 * (t(Y) - t(Z))];
  };
  const pal = palette.map((p) => lab(parseInt(p.hex.slice(1, 3), 16), parseInt(p.hex.slice(3, 5), 16), parseInt(p.hex.slice(5, 7), 16)));
  const memo = new Map();
  const nearest = (r, g, b) => {
    const key = (r >> 2) * 4096 + (g >> 2) * 64 + (b >> 2);
    const hit = memo.get(key);
    if (hit !== undefined) return hit;
    const [L, A, Bv] = lab(r, g, b);
    let best = 0, bd = Infinity;
    for (let i = 0; i < pal.length; i++) {
      const d = (L - pal[i][0]) ** 2 + (A - pal[i][1]) ** 2 + (Bv - pal[i][2]) ** 2;
      if (d < bd) { bd = d; best = i; }
    }
    memo.set(key, best);
    return best;
  };
  const result = {};
  for (const { id, svg } of sources) {
    ctx.clearRect(0, 0, S, S);
    const art = new Image();
    art.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg.replace('<svg ', '<svg width="440" height="440" '))));
    await art.decode();
    ctx.drawImage(art, 20, 20, 440, 440);
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
}, { sources, palette, SIZES });
await browser.close();
writeFileSync(root + 'src/data/pictures.json', JSON.stringify(out));
console.log('baked', Object.keys(out).length, 'pictures');
