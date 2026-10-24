// Renders the cast portraits for review. Usage: npx tsx scripts/portraits.ts <out.png>
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { DEFS } from '../src/art/defs';
import { PORTRAITS } from '../src/art/portraits';
import { CAST } from '../src/story/story';
const { chromium } = createRequire(import.meta.url)('playwright');
const out = process.argv[2] ?? 'portraits.png';
const cells = Object.entries(PORTRAITS).map(([id, s]) =>
  `<figure><svg viewBox="0 0 100 100" width="150" height="150">${s}</svg><svg viewBox="0 0 100 100" width="44" height="44">${s}</svg><figcaption>${CAST[id]?.name}</figcaption></figure>`).join('');
const html = `<!doctype html><meta charset="utf-8"><body dir="rtl" style="background:#f6ead2;font-family:sans-serif;display:flex;flex-wrap:wrap;gap:12px;padding:12px">${DEFS}${cells}</body>`;
const htmlPath = out.replace(/\.png$/, '.html');
writeFileSync(htmlPath, html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 900, height: 500 } });
await p.goto('file://' + htmlPath); await p.screenshot({ path: out, fullPage: true }); await b.close();
