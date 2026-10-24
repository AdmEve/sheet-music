// Renders the cast portraits in every mood for review. Usage: npx tsx scripts/portraits.ts <out.png>
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { DEFS } from '../src/art/defs';
import { CAST_IDS, MOOD_LIST, portrait } from '../src/art/portraits';
import { CAST } from '../src/story/story';
const { chromium } = createRequire(import.meta.url)('playwright');
const out = process.argv[2] ?? 'portraits.png';
const rows = CAST_IDS.map((id) =>
  `<div class="row"><b>${CAST[id]?.name}</b>${MOOD_LIST.map((m) => `<figure><svg viewBox="0 0 100 100" width="110" height="110">${portrait(id, m)}</svg><figcaption>${m}</figcaption></figure>`).join('')}</div>`).join('');
const html = `<!doctype html><meta charset="utf-8"><body dir="rtl" style="background:#f6ead2;font-family:sans-serif;padding:12px">${DEFS}<style>.row{display:flex;gap:10px;align-items:center}.row b{width:90px}figure{margin:0;text-align:center;font-size:11px}</style>${rows}</body>`;
const htmlPath = out.replace(/\.png$/, '.html');
writeFileSync(htmlPath, html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 760, height: 500 } });
await p.goto('file://' + htmlPath); await p.screenshot({ path: out, fullPage: true }); await b.close();
