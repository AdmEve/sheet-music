// Screenshots the built game at phone size. Usage: npx tsx scripts/shot.ts <outdir> [actions]
// Requires `npm run build` first; serves dist/ itself.
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const out = process.argv[2] ?? 'shots';
mkdirSync(out, { recursive: true });
const types: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png' };
const server = createServer((req, res) => {
  let p = join('dist', decodeURIComponent((req.url ?? '/').split('?')[0]));
  if (p.endsWith('/')) p += 'index.html';
  if (!existsSync(p)) { res.statusCode = 404; return res.end(); }
  res.setHeader('content-type', types[extname(p)] ?? 'application/octet-stream');
  res.end(readFileSync(p));
}).listen(4173);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true });
const logs: string[] = [];
page.on('console', (m: any) => logs.push(`${m.type()}: ${m.text()}`));
page.on('pageerror', (e: any) => logs.push(`pageerror: ${e.message}`));
await page.goto('http://localhost:4173/');
await page.waitForTimeout(600);
await page.screenshot({ path: `${out}/0-splash.png` });
await page.click('.splash');
await page.waitForTimeout(500);
await page.screenshot({ path: `${out}/1-intro.png` });
for (let k = 0; k < 8 && await page.$('.dialogue'); k++) { await page.click('.dialogue'); await page.click('.dialogue').catch(() => {}); await page.waitForTimeout(150); }
await page.waitForTimeout(400);
await page.screenshot({ path: `${out}/2-board.png` });
console.log(logs.join('\n'));
await browser.close();
server.close();
