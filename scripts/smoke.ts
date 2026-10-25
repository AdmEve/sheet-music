// End-to-end smoke test (CI): plays the opening in headless Chromium, then opens every
// live-ops window on a staged mid-game save. Fails on any page error, console error or
// broken step. Usage (after `npm run build`): npx tsx scripts/smoke.ts
import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { chromium, type Page } from 'playwright';
import { CELLS, COLS, GameState, fillOrders, newGame } from '../src/game/model';
import { discover } from '../src/game/codex';
import { PLACES } from '../src/story/story';

const PORT = 4190;
const types: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png' };
const server = createServer((req, res) => {
  let p = join('dist', decodeURIComponent((req.url ?? '/').split('?')[0]));
  if (p.endsWith('/')) p += 'index.html';
  if (!existsSync(p)) { res.statusCode = 404; return res.end(); }
  res.setHeader('content-type', types[extname(p)] ?? 'application/octet-stream');
  res.end(readFileSync(p));
}).listen(PORT);

const problems: string[] = [];
let step = '';
function check(ok: unknown, what: string): void {
  if (!ok) problems.push(`${step}: ${what}`);
}

const browser = await chromium.launch();

async function openPage(save?: string): Promise<Page> {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on('pageerror', (e) => problems.push(`${step}: page error: ${e.message}`));
  page.on('console', (m) => m.type() === 'error' && problems.push(`${step}: console error: ${m.text()}`));
  await page.addInitScript((s) => {
    localStorage.setItem('mahalle.fakeAds', '1');
    localStorage.setItem('mahalle.fakeStore', '1');
    if (s && !sessionStorage.getItem('staged')) {
      localStorage.setItem('mahalle.save.v1', s);
      sessionStorage.setItem('staged', '1');
    }
  }, save ?? '');
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.splash');
  await page.click('.splash');
  await page.waitForTimeout(300);
  return page;
}

const click = (page: Page, sel: string) => page.click(sel, { force: true, timeout: 5000 });
const skipDialogue = async (page: Page) => {
  for (let k = 0; k < 40 && await page.$('.dialogue'); k++) {
    await click(page, '.dialogue');
    await page.waitForTimeout(50);
  }
};
const closeOverlays = async (page: Page) => {
  for (let k = 0; k < 5 && await page.$('.overlay .close'); k++) {
    await click(page, '.overlay .close');
    await page.waitForTimeout(80);
  }
};
const saved = async (page: Page): Promise<GameState> => {
  await page.waitForTimeout(600); // saves are debounced
  return page.evaluate(() => JSON.parse(localStorage.getItem('mahalle.save.v1') ?? 'null'));
};
async function drag(page: Page, a: number, b: number): Promise<void> {
  const box = async (i: number) => (await page.locator(`.cell[data-i="${i}"]`).boundingBox())!;
  const p = await box(a), q = await box(b);
  await page.mouse.move(p.x + p.width / 2, p.y + p.height / 2);
  await page.mouse.down();
  for (let k = 1; k <= 6; k++) await page.mouse.move(p.x + p.width / 2 + ((q.x - p.x) * k) / 6, p.y + p.height / 2 + ((q.y - p.y) * k) / 6);
  await page.mouse.up();
}

// ------------------------------------------------------------------ 1. a new player
{
  step = 'new game';
  const page = await openPage();
  check(await page.$('.dialogue'), 'intro dialogue shows');
  await skipDialogue(page);

  step = 'first merge';
  await drag(page, 6 * COLS + 3, 6 * COLS + 4);
  let s = await saved(page);
  check(s.board[6 * COLS + 4].item?.level === 2 && s.stats.merges === 1, 'two tea leaves merge');

  step = 'first delivery';
  await click(page, '.order.ready .deliver');
  await page.waitForTimeout(1200); // items fly to the customer before the board unlocks
  s = await saved(page);
  check(s.stats.orders === 1 && s.stars >= 1, `order delivered for a star (orders ${s.stats.orders}, stars ${s.stars})`);

  step = 'generator';
  const gen = s.board.findIndex((c) => c.item?.chain === 'genTea' && !c.lock);
  for (let k = 0; k < 3; k++) {
    await page.locator(`.cell[data-i="${gen}"]`).click({ force: true });
    await page.waitForTimeout(150);
  }
  s = await saved(page);
  check(s.stats.taps === 3 && s.energy === 97, `generator taps spend energy (taps ${s.stats.taps}, energy ${s.energy})`);

  step = 'first restoration';
  await closeOverlays(page);
  await click(page, '#nav-alley');
  await page.waitForSelector('.place');
  await click(page, '.place .card .btn');
  await page.waitForTimeout(1200);
  if (await page.$('.decor-opt')) {
    await click(page, '.decor-opt:nth-child(2)');
    await click(page, '.overlay .btn');
  }
  await skipDialogue(page);
  s = await saved(page);
  check(s.tasksDone.includes('teahouse.dust'), 'first task bought with stars');
  check(Object.keys(s.decor).length <= 1, 'decor choice saved at most once');

  step = 'album, quests, shop, profile';
  await click(page, '.place .top .chip');
  for (const sel of ['#nav-album', '.navbtn:nth-child(2)', '#hud-gems', '#hud-level', '#hud-energy']) {
    await click(page, sel);
    await page.waitForTimeout(250);
    check(await page.$('.overlay'), `${sel} opens a window`);
    await closeOverlays(page);
  }

  step = 'reload keeps progress';
  await page.reload();
  await page.click('.splash');
  s = await saved(page);
  check(s.stats.orders === 1 && s.tasksDone.length === 1, 'save survives a reload');
  await page.close();
}

// ------------------------------------------------------------------ 2. mid-game live ops
{
  step = 'mid game';
  const s = newGame(77, Date.now());
  s.board = Array.from({ length: CELLS }, () => ({ item: null }));
  const put = (r: number, c: number, chain: GameState['board'][0]['item'] extends infer T ? T : never) => (s.board[r * COLS + c] = { item: chain });
  put(7, 3, { chain: 'genTea', level: 2 });
  put(7, 1, { chain: 'genBread', level: 1 });
  put(6, 2, { chain: 'tea', level: 3 });
  put(6, 4, { chain: 'tea', level: 3 });
  put(5, 5, { chain: 'chest', level: 2 });
  s.level = 6; s.xp = 150; s.gems = 200; s.coins = 900; s.energy = 80;
  s.stats = { merges: 60, orders: 20, taps: 90 };
  s.tasksDone = PLACES[0].tasks.map((t) => t.id);
  s.storySeen = ['teahouse:intro', 'teahouse:outro', 'bakery:intro', 'tut:merge', 'tut:deliver', 'tut:generator', 'tut:alley', 'ask:rate'];
  s.scriptStep = 99;
  s.piggy = 70;
  s.offers = [{ id: 'chapter', until: Date.now() + 3_600_000 }];
  s.lastDaily = new Date().toLocaleDateString('en-CA');
  fillOrders(s);
  discover(s);
  const page = await openPage(JSON.stringify(s));
  await page.waitForTimeout(1500);

  step = 'event starts';
  await skipDialogue(page);
  check(await page.$('.overlay'), 'event window opens after its intro');
  await closeOverlays(page);
  let st = await saved(page);
  check(st.event.joined && st.board.some((c) => c.item && c.item.chain.startsWith('gen') && c.item.chain !== 'genTea' && c.item.chain !== 'genBread'), 'event generator placed');

  step = 'icon strip';
  for (const id of ['side-event', 'side-chapter', 'side-pass', 'side-piggy', 'side-race', 'side-gift']) {
    const ok = await page.$(`#${id}`);
    check(ok, `${id} button present`);
    if (!ok) continue;
    await click(page, `#${id}`);
    await page.waitForTimeout(250);
    check(await page.$('.overlay'), `${id} opens a window`);
    await closeOverlays(page);
  }

  step = 'race';
  await click(page, '#side-race');
  await click(page, '.overlay .btn.big');
  await page.waitForTimeout(300);
  check(await page.$('.lanes .lane'), 'race lanes show after starting');
  await closeOverlays(page);

  step = 'piggy purchase (fake store)';
  await click(page, '#side-piggy');
  await click(page, '.overlay .btn.gold');
  st = await saved(page);
  check(st.piggy === 0 && st.gems >= 270, 'piggy bank pays out');

  step = 'chest';
  const chest = st.board.findIndex((c) => c.item?.chain === 'chest');
  await page.locator(`.cell[data-i="${chest}"]`).click({ force: true });
  await page.locator(`.cell[data-i="${chest}"]`).click({ force: true });
  st = await saved(page);
  check(!st.board.some((c) => c.item?.chain === 'chest' && c.item.level === 2), 'chest opens');

  step = 'alley map';
  await click(page, '#nav-alley');
  await page.waitForSelector('.place');
  await click(page, '.place .top button[aria-label="نقشه‌ی محله"]');
  check(await page.$('.mapview svg'), 'map renders');
  await click(page, '.map-place[data-k="0"]');
  check((await page.textContent('.place .top h2'))?.includes('قهوه‌خانه'), 'finished place can be visited');
  await page.close();
}

// ------------------------------------------------------------------ 3. back after days away, rush an order
{
  step = 'welcome back';
  const s = newGame(91, Date.now());
  s.board = Array.from({ length: CELLS }, () => ({ item: null }));
  s.board[7 * COLS + 3] = { item: { chain: 'genTea', level: 2 } };
  s.board[7 * COLS + 1] = { item: { chain: 'genBread', level: 1 } };
  s.level = 8; s.xp = 200; s.gems = 200; s.coins = 500; s.energy = 40;
  s.tasksDone = PLACES[0].tasks.map((t) => t.id);
  s.storySeen = ['teahouse:intro', 'teahouse:outro', 'bakery:intro', 'tut:merge', 'tut:deliver', 'tut:generator', 'tut:alley', 'ask:rate', 'tut:bubble'];
  s.scriptStep = 99;
  s.lastDaily = new Date().toLocaleDateString('en-CA');
  s.clock = Date.now() - 3 * 86_400_000;
  s.orders = [{ id: 900, who: 'reza', needs: [{ chain: 'bread', level: 3 }], coins: 10, stars: 3 }];
  fillOrders(s);
  discover(s);
  const page = await openPage(JSON.stringify(s));
  await page.waitForTimeout(800);
  check((await page.textContent('.overlay h2').catch(() => ''))?.includes('خوش برگشتی'), 'welcome-back gift shows');
  await click(page, '.overlay .btn.big');
  let st = await saved(page);
  check(st.energy >= 140 && st.gems >= 210, `welcome gift paid (energy ${st.energy}, gems ${st.gems})`);
  await page.waitForTimeout(800);
  await skipDialogue(page);
  await closeOverlays(page);

  step = 'rush an order';
  await click(page, '.order[data-order="900"]');
  await page.waitForTimeout(300);
  check(await page.$('.order-sheet'), 'order sheet opens');
  const gems = (await saved(page)).gems;
  await click(page, '.overlay .btn.pink');
  await page.waitForTimeout(1500);
  for (let k = 0; k < 3 && await page.$('.overlay .btn'); k++) { await click(page, '.overlay .btn'); await page.waitForTimeout(200); }
  st = await saved(page);
  check(!st.orders.some((o) => o.id === 900), 'rushed order delivered');
  check(st.gems < gems, `gems spent on the rush (${gems} → ${st.gems})`);
  await page.close();
}

// ------------------------------------------------------------------ 4. generator boost
{
  step = 'generator boost';
  const s = newGame(92, Date.now());
  s.board = Array.from({ length: CELLS }, () => ({ item: null }));
  s.board[7 * COLS + 3] = { item: { chain: 'genTea', level: 2 } };
  s.level = 16; s.xp = 2600; s.energy = 60;
  s.tasksDone = PLACES[0].tasks.map((t) => t.id);
  s.storySeen = ['teahouse:intro', 'teahouse:outro', 'bakery:intro', 'tut:merge', 'tut:deliver', 'tut:generator', 'tut:alley', 'ask:rate', 'tut:bubble'];
  s.scriptStep = 99;
  s.lastDaily = new Date().toLocaleDateString('en-CA');
  fillOrders(s);
  discover(s);
  const page = await openPage(JSON.stringify(s));
  await page.waitForTimeout(800);
  await skipDialogue(page);
  await closeOverlays(page);
  const gen = `.cell[data-i="${7 * COLS + 3}"]`;
  await click(page, gen);
  await page.waitForTimeout(300);
  check(await page.$('#boost-chip'), 'boost chip shows on a generator at level 16');
  await click(page, '#boost-chip');
  await page.waitForTimeout(200);
  check(await page.$(`${gen} .item.boosted`), 'generator shows its boost badge');
  const before = (await saved(page)).energy;
  await click(page, gen);
  await page.waitForTimeout(600);
  const st = await saved(page);
  check(st.boost === 2 && st.energy === before - 2, `×2 tap spends 2 energy (${before} → ${st.energy})`);
  check(st.board.some((c: { item: { chain: string; level: number } | null }) => c.item?.chain === 'tea' && c.item.level >= 2), 'boosted tap makes a higher item');

  step = 'generator storeroom';
  await click(page, gen);
  await page.waitForTimeout(300);
  await click(page, '#shelve-chip');
  await page.waitForTimeout(300);
  let sv = await saved(page);
  check(sv.shelf?.length === 1 && !sv.board.some((c: { item: { chain: string } | null }) => c.item?.chain === 'genTea'), 'generator goes to the storeroom');
  await click(page, '.navbtn:has-text("کیف")');
  await page.waitForTimeout(300);
  check(await page.$('#shelf .lv'), 'storeroom shows in the bag');
  await click(page, '#shelf .lv');
  await page.waitForTimeout(400);
  sv = await saved(page);
  check(sv.shelf.length === 0 && sv.board.some((c: { item: { chain: string } | null }) => c.item?.chain === 'genTea'), 'generator comes back from the storeroom');
  await page.close();
}

await browser.close();
server.close();
if (problems.length) {
  console.error(`Smoke test FAILED (${problems.length}):\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log('Smoke test passed.');
