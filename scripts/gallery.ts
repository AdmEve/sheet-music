// Renders every item drawing into an HTML sheet and screenshots it (art review tool).
// Usage: npx tsx scripts/gallery.ts <out.png>
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { DEFS } from '../src/art/defs';
import { ART_ROWS } from '../src/art/index';
import { svg } from '../src/art/kit';

const out = process.argv[2] ?? 'gallery.png';
const rows = ART_ROWS.map(({ title, items, names }) =>
  `<h3>${title}</h3><div class="row">${items.map((it, i) => `<figure><div class="cell">${svg(it)}</div><figcaption>${names[i] ?? i + 1}</figcaption></figure>`).join('')}</div>`,
).join('');
const html = `<!doctype html><meta charset="utf-8"><body dir="rtl" style="margin:12px;font-family:sans-serif;background:#f6ead2">${DEFS}
<style>.row{display:flex;flex-wrap:wrap;gap:8px}figure{margin:0;width:112px;text-align:center}.cell{width:104px;height:104px;background:#fff7e6;border-radius:16px;box-shadow:inset 0 0 0 2px #e6cfa3}.cell svg{width:100%;height:100%}figcaption{font-size:12px}h3{margin:10px 0 4px}</style>${rows}</body>`;
const htmlPath = out.replace(/\.png$/, '.html');
writeFileSync(htmlPath, html);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1300, height: 800 } });
await page.goto('file://' + htmlPath);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log('wrote', out);
