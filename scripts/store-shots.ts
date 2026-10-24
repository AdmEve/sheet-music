// Store screenshots: stages real game states, captures them at phone size and frames each
// with a caption at 1080×1920. Usage (after `npm run build`): npx tsx scripts/store-shots.ts
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { CELLS, COLS, GameState, fillOrders, newGame } from '../src/game/model';
import { Item } from '../src/game/items';
import { PLACES } from '../src/story/story';
const { chromium } = createRequire(import.meta.url)('playwright');

const OUT = 'docs/screenshots';
mkdirSync(OUT, { recursive: true });
const types: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png' };
const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
  let p = url.startsWith('/__shots/') ? join(OUT, url.slice(9)) : join('dist', url);
  if (p.endsWith('/')) p += 'index.html';
  if (!existsSync(p)) { res.statusCode = 404; return res.end(); }
  res.setHeader('content-type', types[extname(p)] ?? 'application/octet-stream');
  res.end(readFileSync(p));
}).listen(4175);

const allSeen = ['teahouse:intro', 'tut:merge', 'tut:deliver', 'tut:generator', 'tut:alley'];
const today = new Date().toLocaleDateString('en-CA');

function midGame(): GameState {
  const s = newGame(77, Date.now());
  s.board = Array.from({ length: CELLS }, () => ({ item: null }));
  const put = (r: number, c: number, item: Item, lock?: 'box' | 'sheet') => (s.board[r * COLS + c] = lock ? { item, lock } : { item });
  for (let c = 0; c < COLS; c++) put(0, c, { chain: 'tea', level: 2 }, 'box');
  const row1: Item[] = [{ chain: 'textile', level: 3 }, { chain: 'tea', level: 6 }, { chain: 'garden', level: 4 }, { chain: 'pottery', level: 4 }, { chain: 'bread', level: 5 }, { chain: 'garden', level: 3 }, { chain: 'tea', level: 5 }];
  row1.forEach((it, c) => put(1, c, it, 'sheet'));
  const items: [number, number, Item][] = [
    [2, 0, { chain: 'tea', level: 7 }], [2, 1, { chain: 'garden', level: 6 }], [2, 2, { chain: 'chest', level: 2 }], [2, 3, { chain: 'bread', level: 6 }], [2, 4, { chain: 'tea', level: 4 }], [2, 5, { chain: 'tea', level: 4 }], [2, 6, { chain: 'coins', level: 2 }],
    [3, 0, { chain: 'garden', level: 5 }], [3, 1, { chain: 'bread', level: 4 }], [3, 2, { chain: 'tea', level: 8 }], [3, 3, { chain: 'garden', level: 7 }], [3, 4, { chain: 'tools', level: 4 }], [3, 5, { chain: 'bread', level: 7 }], [3, 6, { chain: 'tea', level: 3 }],
    [4, 0, { chain: 'tools', level: 3 }], [4, 2, { chain: 'garden', level: 8 }], [4, 3, { chain: 'tea', level: 5 }], [4, 4, { chain: 'tea', level: 5 }], [4, 6, { chain: 'energy', level: 2 }],
    [5, 1, { chain: 'bread', level: 3 }], [5, 2, { chain: 'tea', level: 6 }], [5, 4, { chain: 'garden', level: 2 }], [5, 5, { chain: 'tools', level: 5 }],
    [6, 0, { chain: 'tea', level: 2 }], [6, 3, { chain: 'bread', level: 5 }], [6, 5, { chain: 'garden', level: 4 }], [6, 6, { chain: 'tea', level: 1 }],
    [7, 1, { chain: 'genBread', level: 2 }], [7, 3, { chain: 'genTea', level: 2 }], [7, 5, { chain: 'genGarden', level: 1 }],
    [8, 0, { chain: 'tea', level: 1 }], [8, 2, { chain: 'genTools', level: 1 }], [8, 4, { chain: 'bread', level: 2 }], [8, 6, { chain: 'chest', level: 1 }],
  ];
  for (const [r, c, it] of items) put(r, c, it);
  s.level = 5; s.xp = 80; s.coins = 1240; s.gems = 85; s.energy = 87; s.stars = 4;
  s.stats = { merges: 50, orders: 12, taps: 60 };
  s.storySeen = [...allSeen, 'bakery:intro'];
  s.tasksDone = PLACES[0].tasks.map((t) => t.id).concat(['bakery.flour']);
  s.scriptStep = 99;
  s.orders = [];
  fillOrders(s);
  s.orders[0].who = 'mahin'; s.orders[0].needs = [{ chain: 'tea', level: 7 }];
  s.orders[1].who = 'golab'; s.orders[1].needs = [{ chain: 'garden', level: 6 }, { chain: 'bread', level: 4 }];
  s.orders[2].who = 'kaveh'; s.orders[2].needs = [{ chain: 'tools', level: 5 }];
  s.lastDaily = today;
  return s;
}

interface Shot { name: string; caption: string; sub: string; state: GameState; act?: (page: any) => Promise<void> }
const finishedTeahouse = () => {
  const s = midGame();
  s.tasksDone = PLACES[0].tasks.slice(0, 5).map((t) => t.id);
  s.storySeen = allSeen;
  s.stars = 6;
  return s;
};
const weddingState = () => {
  const s = midGame();
  const ids = (n: number) => PLACES[n].tasks.map((t) => t.id);
  s.tasksDone = [0, 1, 2, 3, 4, 5, 6, 7, 8].flatMap(ids).concat(ids(9).slice(0, 4));
  s.storySeen = [...allSeen, ...PLACES.map((p) => `${p.id}:intro`), ...PLACES.map((p) => `${p.id}:outro`), 'ask:rate'];
  s.stars = 120;
  s.level = 11;
  return s;
};
const shots: Shot[] = [
  { name: '1-board', caption: 'وسایل ایرانی رو ادغام کن!', sub: 'از برگ چای تا سماور طلایی', state: midGame() },
  { name: '2-orders', caption: 'سفارش همسایه‌ها رو تحویل بده', sub: 'خاله مهین، اوستا رضا، ننه‌گلاب…', state: midGame(),
    act: async (page) => { await page.click('.order', { force: true }); await page.waitForTimeout(250); } },
  { name: '3-teahouse', caption: 'قهوه‌خانه‌ی حاج‌بابا رو زنده کن', sub: 'هر کار، یه گوشه از کوچه رو نجات می‌ده', state: finishedTeahouse(),
    act: async (page) => {
      await page.click('#nav-alley', { force: true }); await page.waitForTimeout(500);
    } },
  { name: '4-gossip', caption: 'خاله مهین همه‌چی رو می‌دونه!', sub: 'یه سریال ایرانی، قسمت به قسمت', state: midGame(),
    act: async (page) => {
      await page.click('#nav-alley', { force: true }); await page.waitForTimeout(400);
      await page.evaluate(() => (window as any).__showLine?.());
      await page.waitForTimeout(900);
    } },
  { name: '5-chain', caption: 'صدها وسیله‌ی ایرانی', sub: 'سنگک، گل محمدی، گلاب کاشون، فرش کاشان…', state: midGame(),
    act: async (page) => {
      const cell = await page.$('.cell[data-i="23"]'); await cell.click(); await page.waitForTimeout(200);
      await page.click('.infobar .chip', { force: true }); await page.waitForTimeout(400);
    } },
  { name: '7-wedding', caption: 'فصل دوم: عروسی! 💍', sub: 'از خواستگاری تا جشن عروسی تو کوچه', state: weddingState(),
    act: async (page) => { await page.click('#nav-alley', { force: true }); await page.waitForTimeout(500); } },
  { name: '6-farokhi', caption: 'کوچه رو از دست فرخی نجات بده', sub: 'آفلاین، بدون تبلیغ اجباری', state: midGame(),
    act: async (page) => {
      await page.click('#nav-alley', { force: true }); await page.waitForTimeout(400);
      await page.evaluate(() => (window as any).__showLine?.('farokhi'));
      await page.waitForTimeout(900);
    } },
];

const browser = await chromium.launch();
for (const shot of shots) {
  const page = await browser.newPage({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 3 });
  await page.addInitScript((json: string) => {
    if (!sessionStorage.getItem('seeded')) { localStorage.setItem('mahalle.save.v1', json); sessionStorage.setItem('seeded', '1'); }
  }, JSON.stringify(shot.state));
  await page.addInitScript(() => {
    // Screenshot helper: shows one story line over the current screen.
    (window as any).__showLine = (who = 'mahin') => {
      const text = who === 'farokhi' ? 'همه‌چی فروشیه خانم. حتی این کوچه.' : 'خبر داغ! زن فرخی دیروز با یه ماشین به این گندگی اومده بود سنگک بخره!';
      document.dispatchEvent(new CustomEvent('debug-line', { detail: { who, text } }));
    };
  });
  await page.goto('http://localhost:4175/');
  await page.waitForTimeout(500);
  await page.click('.splash');
  await page.waitForTimeout(600);
  while (await page.$('.overlay .btn')) { await page.click('.overlay .btn', { force: true }); await page.waitForTimeout(200); }
  if (shot.act) await shot.act(page);
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(OUT, `raw-${shot.name}.png`) });
  await page.close();
  // Frame with caption.
  const frame = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await frame.goto('http://localhost:4175/index.html');
  await frame.setContent(`<html><head><style>
    @font-face{font-family:V;src:url(${await fontUrl()}) format('woff2');font-weight:900}
    body{margin:0;width:1080px;height:1920px;overflow:hidden;font-family:V,sans-serif;direction:rtl;
      background:radial-gradient(circle at 50% 10%,#ff9ab4 0,#e2507a 45%,#9c2148 100%);display:flex;flex-direction:column;align-items:center}
    h1{margin:70px 40px 10px;color:#fff;font-size:76px;font-weight:900;text-align:center;text-shadow:0 6px 0 #0003}
    h2{margin:0 40px 40px;color:#ffe9f0;font-size:40px;font-weight:900;text-align:center}
    .phone{width:810px;height:1440px;border-radius:70px;border:16px solid #2a1830;overflow:hidden;box-shadow:0 30px 60px #0006;background:#f6ead2}
    .phone img{width:100%;height:100%;display:block}
  </style></head><body><h1>${shot.caption}</h1><h2>${shot.sub}</h2><div class="phone"><img src="http://localhost:4175/__shots/raw-${shot.name}.png"></div></body></html>`);
  await frame.waitForTimeout(500);
  await frame.screenshot({ path: join(OUT, `${shot.name}.png`) });
  await frame.close();
  console.log('shot', shot.name);
}
await browser.close();
server.close();

async function fontUrl(): Promise<string> {
  const { readdirSync } = await import('node:fs');
  const f = readdirSync('dist/assets').find((x) => x.includes('vazirmatn-arabic-900') && x.endsWith('.woff2'));
  return `http://localhost:4175/assets/${f}`;
}
void resolve;
