// Renders every place before and after restoration. Usage: npx tsx scripts/scenes.ts <out.png>
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { DEFS } from '../src/art/defs';
import { sceneSvg } from '../src/art/scenes';
import { PLACES } from '../src/story/story';
const { chromium } = createRequire(import.meta.url)('playwright');
const out = process.argv[2] ?? 'scenes.png';
const cells = PLACES.map((p) => `<h3>${p.name}</h3><div style="display:flex;gap:8px"><div style="width:400px;height:267px">${sceneSvg(p.id, () => false)}</div><div style="width:400px;height:267px">${sceneSvg(p.id, () => true)}</div></div>`).join('');
const html = `<!doctype html><meta charset="utf-8"><body dir="rtl" style="background:#f6ead2;font-family:sans-serif;padding:8px">${DEFS}<style>svg{width:100%;height:100%}h3{margin:6px 0}</style>${cells}</body>`;
const htmlPath = out.replace(/\.png$/, '.html');
writeFileSync(htmlPath, html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 830, height: 600 } });
await p.goto('file://' + htmlPath); await p.screenshot({ path: out, fullPage: true }); await b.close();
