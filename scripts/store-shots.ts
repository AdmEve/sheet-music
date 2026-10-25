// Store screenshots: stages real game states, captures them at phone size and frames each
// with a caption at 1080×1920. Usage (after `npm run build`): npx tsx scripts/store-shots.ts
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { CELLS, COLS, GameState, ensureGenerators, fillOrders, newGame } from '../src/game/model';
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

interface Shot { name: string; caption: string; sub: string; state: GameState; at?: string; act?: (page: any) => Promise<void> }
const done = (n: number) => PLACES.slice(0, n).flatMap((p) => p.tasks.map((t) => t.id));
const seenUpTo = (n: number) => [...allSeen, ...PLACES.slice(0, n + 1).map((p) => `${p.id}:intro`), ...PLACES.slice(0, n).map((p) => `${p.id}:outro`), 'ask:rate', 'tut:bubble'];
const finishedTeahouse = () => {
  const s = midGame();
  s.tasksDone = PLACES[0].tasks.slice(0, 5).map((t) => t.id);
  s.storySeen = allSeen;
  s.stars = 6;
  return s;
};
const decorState = () => {
  const s = midGame();
  s.tasksDone = PLACES[0].tasks.slice(0, 3).map((t) => t.id);
  s.storySeen = [...allSeen, 'event:week'];
  s.stars = 20;
  return s;
};
const raceState = () => {
  const s = midGame();
  s.level = 6; s.xp = 150;
  s.race = { day: today, count: 1, active: { start: Date.now() - 38 * 60e3, orders0: s.stats.orders - 4, finishedAt: null, claimed: false,
    bots: [{ name: 'مریم از کوچه‌ی یاس', hue: 0, finishMs: 52 * 60e3 }, { name: 'علی از کوچه‌ی بهار', hue: 1, finishMs: 61 * 60e3 }, { name: 'سارا از کوچه‌ی نارنج', hue: 2, finishMs: 95 * 60e3 }, { name: 'حسین از کوچه‌ی اقاقیا', hue: 3, finishMs: 130 * 60e3 }] } };
  return s;
};
const lateState = (placesDone: number, partial: number) => {
  const s = midGame();
  s.tasksDone = done(placesDone).concat(PLACES[placesDone]?.tasks.slice(0, partial).map((t) => t.id) ?? []);
  s.storySeen = seenUpTo(placesDone);
  s.level = 22; s.xp = 3000; s.stars = 60;
  return s;
};
const skipStory = async (page: any) => {
  for (let k = 0; k < 12 && await page.$('.dialogue'); k++) { await page.click('.dialogue', { force: true }); await page.waitForTimeout(80); }
};
const closeAll = async (page: any) => {
  for (let k = 0; k < 4 && await page.$('.overlay .close'); k++) { await page.click('.overlay .close', { force: true }); await page.waitForTimeout(150); }
};
/** Lets on-load scenes (event intro, daily gift) play out and closes them. */
const ready = async (page: any) => {
  await page.waitForTimeout(1300);
  for (let k = 0; k < 2; k++) { await skipStory(page); await closeAll(page); }
};
const shots: Shot[] = [
  { name: '1-board', caption: 'وسایل ایرانی رو ادغام کن!', sub: 'از برگ چای تا سماور طلایی', state: midGame(), act: ready },
  { name: '2-teahouse', caption: 'قهوه‌خانه‌ی حاج‌بابا رو زنده کن', sub: 'هر کار، یه گوشه از کوچه رو نجات می‌ده', state: finishedTeahouse(),
    act: async (page) => { await ready(page); await page.click('#nav-alley', { force: true }); await page.waitForTimeout(500); } },
  { name: '3-gossip', caption: 'یه سریال ایرانی، قسمت به قسمت', sub: 'خاله مهین همه‌چی رو اول از همه می‌دونه!', state: midGame(),
    act: async (page) => {
      await ready(page);
      await page.click('#nav-alley', { force: true }); await page.waitForTimeout(400);
      await page.evaluate(() => (window as any).__showLine?.('mahin'));
      await page.waitForTimeout(900);
    } },
  { name: '4-decor', caption: 'به سلیقه‌ی خودت بچینش', sub: 'سنتی، فیروزه‌ای یا گلبهی؟', state: decorState(),
    act: async (page) => {
      await ready(page);
      await page.click('#nav-alley', { force: true }); await page.waitForTimeout(500);
      await page.click('.place .card .btn', { force: true }); await page.waitForTimeout(1500);
      await page.click('.decor-opt:nth-child(2)', { force: true }); await page.waitForTimeout(300);
    } },
  { name: '5-yalda', caption: 'شب یلدا و نوروز تو محله', sub: 'رویدادهای هفتگی، وسیله‌ها و جام‌های مخصوص', state: midGame(), at: '2026-12-18T11:00:00',
    act: async (page) => { await page.waitForTimeout(1500); await skipStory(page); await page.waitForTimeout(400); } },
  { name: '6-race', caption: 'مسابقه با کوچه‌های بغل!', sub: 'اول کی سفارش‌ها رو تحویل می‌ده؟', state: raceState(),
    act: async (page) => { await ready(page); await page.click('#side-race', { force: true }); await page.waitForTimeout(500); } },
  { name: '7-season5', caption: 'کوچه رو از تخریب نجات بده!', sub: 'یه آب‌انبار قاجاری زیر خیابون پیدا شد…', state: lateState(23, 1),
    act: async (page) => {
      await ready(page);
      await page.click('#nav-alley', { force: true }); await page.waitForTimeout(500); await skipStory(page);
      // Revisit the restored cistern (episode 23) through its chip.
      await page.click('.seasons .sn:nth-child(5)', { force: true }); await page.waitForTimeout(300);
      await page.click('.episodes .ep:nth-child(3)', { force: true }); await page.waitForTimeout(600);
      await page.evaluate(() => (window as any).__showLine?.('kaveh'));
      await page.waitForTimeout(900);
    } },
  { name: '8-map', caption: '۸۵ قسمت، هفده فصل', sub: 'آفلاین، بدون تبلیغ اجباری', state: lateState(20, 2),
    act: async (page) => {
      await ready(page);
      await page.click('#nav-alley', { force: true }); await page.waitForTimeout(500); await skipStory(page);
      await page.click('.place .top button[aria-label="نقشه‌ی محله"]', { force: true }); await page.waitForTimeout(700);
    } },
];

const browser = await chromium.launch();
for (const shot of shots) {
  const page = await browser.newPage({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 3 });
  // Hand out every generator the staged level has earned, so no catch-up toast shows.
  ensureGenerators(shot.state);
  await page.addInitScript((json: string) => {
    if (!sessionStorage.getItem('seeded')) { localStorage.setItem('mahalle.save.v1', json); sessionStorage.setItem('seeded', '1'); }
  }, JSON.stringify(shot.state));
  await page.addInitScript(() => {
    // Screenshot helper: shows one story line over the current screen.
    const LINES: Record<string, string> = {
      mahin: 'خبر داغ! زن فرخی دیروز با یه ماشین به این گندگی اومده بود سنگک بخره!',
      farokhi: 'همه‌چی فروشیه خانم. حتی این کوچه.',
      bahman: 'چهل سال… درخت توت حیاط هنوز هست. ولی خونه‌ی پدری…',
      kaveh: 'نور از نورگیر می‌افته رو آب. این‌ها رو دویست سال پیش حساب کردن.',
    };
    (window as any).__showLine = (who = 'mahin') => document.dispatchEvent(new CustomEvent('debug-line', { detail: { who, text: LINES[who] } }));
  });
  if (shot.at) await page.clock.setFixedTime(new Date(shot.at));
  await page.goto('http://localhost:4175/');
  await page.waitForTimeout(500);
  await page.click('.splash');
  await page.waitForTimeout(600);
  // Daily gift / level-up windows that open on load.
  for (let k = 0; k < 3 && await page.$('.overlay .btn:not(.close)') && !await page.$('.overlay .close'); k++) { await page.click('.overlay .btn', { force: true }); await page.waitForTimeout(200); }
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
for (const shot of shots) rmSync(join(OUT, `raw-${shot.name}.png`), { force: true });

async function fontUrl(): Promise<string> {
  const { readdirSync } = await import('node:fs');
  const f = readdirSync('dist/assets').find((x) => x.includes('vazirmatn-arabic-900') && x.endsWith('.woff2'));
  return `http://localhost:4175/assets/${f}`;
}
void resolve;
