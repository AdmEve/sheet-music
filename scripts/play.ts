// Plays the opening of the game in a phone-sized browser and screenshots each beat.
// Usage: npx tsx scripts/play.ts <outdir>   (after `npm run build`)
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const out = process.argv[2] ?? 'play';
mkdirSync(out, { recursive: true });
const types: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff' };
const server = createServer((req, res) => {
  let p = join('dist', decodeURIComponent((req.url ?? '/').split('?')[0]));
  if (p.endsWith('/')) p += 'index.html';
  if (!existsSync(p)) { res.statusCode = 404; return res.end(); }
  res.setHeader('content-type', types[extname(p)] ?? 'application/octet-stream');
  res.end(readFileSync(p));
}).listen(4174);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const logs: string[] = [];
page.on('console', (m: any) => m.type() !== 'log' && logs.push(`${m.type()}: ${m.text()}`));
page.on('pageerror', (e: any) => logs.push(`pageerror: ${e.message}`));
await page.goto('http://localhost:4174/');
await page.waitForTimeout(400);
await page.click('.splash');
const skipDialogue = async () => {
  for (let k = 0; k < 40 && await page.$('.dialogue'); k++) { await page.click('.dialogue'); await page.waitForTimeout(60); }
};
await page.waitForTimeout(300);
await skipDialogue();
const center = async (i: number) => {
  const b = await page.locator(`.cell[data-i="${i}"]`).boundingBox();
  return { x: b!.x + b!.width / 2, y: b!.y + b!.height / 2 };
};
const dragCells = async (a: number, b: number) => {
  const p = await center(a), q = await center(b);
  await page.mouse.move(p.x, p.y); await page.mouse.down();
  for (let k = 1; k <= 8; k++) await page.mouse.move(p.x + (q.x - p.x) * k / 8, p.y + (q.y - p.y) * k / 8);
  await page.mouse.up();
  await page.waitForTimeout(450);
};
const state = () => page.evaluate(() => JSON.parse(localStorage.getItem('mahalle.save.v1') ?? '{}'));
// 1) merge the two tea leaves (row 6, cols 3 and 4)
await dragCells(6 * 7 + 4, 6 * 7 + 3);
await page.screenshot({ path: `${out}/a-merged.png` });
// 2) deliver Narges' order
await page.waitForTimeout(500);
const btn = await page.$('.order .deliver');
if (btn) { await btn.click({ force: true }); await page.waitForTimeout(1000); }
await page.screenshot({ path: `${out}/b-delivered.png` });
// 3) tap the tea tin a dozen times and merge pairs greedily
const tin = 7 * 7 + 3;
for (let round = 0; round < 3; round++) {
  for (let k = 0; k < 8; k++) { const c = await center(tin); await page.mouse.click(c.x, c.y); await page.waitForTimeout(120); }
  await page.waitForTimeout(400);
  for (let pass = 0; pass < 6; pass++) {
    const s = await state();
    const seen = new Map<string, number>();
    let merged = false;
    for (let i = 0; i < s.board.length; i++) {
      const c = s.board[i];
      if (!c.item || c.lock || c.item.chain.startsWith('gen') || c.item.chain === 'coins' || c.item.chain === 'energy' || c.item.chain === 'chest') continue;
      const key = c.item.chain + c.item.level;
      if (seen.has(key)) { await dragCells(i, seen.get(key)!); merged = true; break; }
      seen.set(key, i);
    }
    if (!merged) break;
  }
  for (const b of await page.$$('.order .deliver')) { await b.click({ force: true }).catch(() => {}); await page.waitForTimeout(1300); }
  while (await page.$('.overlay .btn')) { await page.click('.overlay .btn'); await page.waitForTimeout(200); }
}
await page.screenshot({ path: `${out}/c-played.png` });
// 4) open the alley and try a task
await page.click('#nav-alley', { force: true });
await page.waitForTimeout(500);
await page.screenshot({ path: `${out}/d-alley.png` });
const goldBtn = await page.$('.place .btn.gold');
if (goldBtn) {
  await goldBtn.click({ force: true });
  await page.waitForTimeout(1100);
  await page.screenshot({ path: `${out}/e-task-dialogue.png` });
  await skipDialogue();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${out}/f-after-task.png` });
}
const s = await state();
console.log('stars', s.stars, 'level', s.level, 'tasks', s.tasksDone, 'energy', s.energy, 'orders done', s.stats?.orders);
console.log(logs.join('\n') || 'no errors');
await browser.close();
server.close();
