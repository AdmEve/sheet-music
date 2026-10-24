// Main game screen: HUD, orders, board (drag & merge), info bar and bottom navigation.
// Rules live in game/model.ts; this file turns their events into animation and sound.

import { itemArt } from '../art/index';
import { ICONS } from '../art/icons';
import { O, THIN } from '../art/kit';
import { portrait } from '../art/portraits';
import { codexClaimable, discover } from '../game/codex';
import { OFFER_SKU, OfferId, PIGGY_CAP, activeOffers, giftReady, offerOnLevel, piggyFull, piggyUnlocked } from '../game/offers';
import { CHAINS, Item, canMerge, isGenerator, itemName, maxLevel, sameItem } from '../game/items';
import {
  CELLS, ENERGY_CAP, GameEvent, GameState, Order, adsLeft, bubbleGemCost, buySheet, deliver, drop, findHint, msToNextEnergy, needsMet,
  placeItem, popBubble, questsClaimable, refreshQuests, sellValue, sell, sheetGemCost, tap, tickBubbles, tickEnergy, toBag,
  xpForLevel,
} from '../game/model';
import { adsAvailable } from '../platform/ads';
import { MAX_ADS_PER_DAY } from '../platform/config';
import { introKey, markSeen, progress } from '../game/progress';
import { buzz } from '../platform/haptics';
import { writeSave } from '../platform/storage';
import { CAST, THANKS } from '../story/story';
import { add, animDone, clear, dateKey, fa, faClock, faNum, faTime, h, svgIcon, wait } from './dom';
import { Modals, bundleArt } from './modals';
import { PlaceScreen } from './place';
import { sfx } from './sound';

const SHEET_COVER = svgIcon(
  `<path d="M6 18 C20 4 80 4 94 18 C98 40 96 70 92 92 C70 98 30 98 8 92 C4 70 2 40 6 18 Z" fill="#fbf7ee" fill-opacity=".55" stroke="#c9b9a0" stroke-width="2"/>` +
    `<path d="M22 14 C30 40 26 70 30 94 M70 12 C64 40 72 66 66 94" fill="none" stroke="#d8cbb4" stroke-width="2"/>`,
  'sheet-cover',
);
const BOX_COVER = svgIcon(
  `<rect x="8" y="10" width="84" height="82" rx="8" fill="url(#gWood)" ${O}/>` +
    `<path d="M8 36 H92 M8 64 H92" ${THIN}/><path d="M14 16 L86 86 M86 16 L14 86" stroke="#8b5328" stroke-width="5" opacity=".55"/>` +
    `<rect x="38" y="40" width="24" height="20" rx="3" fill="#c98a52" ${THIN}/><text x="50" y="56" text-anchor="middle" font-size="16" font-weight="900" fill="#5e3418">؟</text>`,
  'box-cover',
);

export class App {
  s: GameState;
  root: HTMLElement;
  private hud!: HTMLElement;
  private ordersEl!: HTMLElement;
  private boardEl!: HTMLElement;
  private cells: HTMLElement[] = [];
  private info!: HTMLElement;
  private navEl!: HTMLElement;
  private sideEl!: HTMLElement;
  private playEl!: HTMLElement;
  selected: number | null = null;
  private drag: { from: number; x: number; y: number; id: number; ghost: HTMLElement | null } | null = null;
  private saveTimer = 0;
  modals: Modals;
  place: PlaceScreen;
  private busy = false;

  constructor(root: HTMLElement, state: GameState) {
    this.root = root;
    this.s = state;
    this.modals = new Modals(this);
    this.place = new PlaceScreen(this);
  }

  // ------------------------------------------------------------------ layout

  mount(): void {
    clear(this.root);
    this.hud = h('header', { class: 'hud' });
    this.ordersEl = h('section', { class: 'orders' });
    this.boardEl = h('div', { class: 'board' });
    this.info = h('div', { class: 'infobar' });
    this.navEl = h('nav', { class: 'nav' });
    this.sideEl = h('div', { class: 'side' });
    this.cells = Array.from({ length: CELLS }, (_, i) => h('div', { class: 'cell', 'data-i': i }));
    this.boardEl.append(...this.cells);
    this.playEl = h('div', { class: 'play' }, this.sideEl, h('div', { class: 'board-wrap' }, this.boardEl));
    this.root.append(this.hud, this.ordersEl, this.playEl, this.info, this.navEl);
    this.fit();
    window.addEventListener('resize', () => this.fit());
    this.boardEl.addEventListener('pointerdown', (e) => this.onDown(e));
    this.boardEl.addEventListener('pointermove', (e) => this.onMove(e));
    this.boardEl.addEventListener('pointerup', (e) => this.onUp(e));
    this.boardEl.addEventListener('pointercancel', () => this.cancelDrag());
    this.renderAll();
    setInterval(() => this.tick(), 1000);
  }

  /**
   * Cell size: fill the width, but leave room for HUD, orders, info and nav. The icon strip
   * (offers, piggy bank…) sits above the board, or beside it when the screen is short and
   * a row of icons would cost the board more than a column does.
   */
  private fit(): void {
    const w = Math.min(window.innerWidth, 560);
    const hgt = window.innerHeight;
    const strip = this.sideEl.childElementCount ? 50 : 0;
    let cell = Math.min((w - 28) / 7, (hgt - 300 - strip) / 9);
    let beside = false;
    if (strip) {
      const besideCell = Math.min((w - 28 - 54) / 7, (hgt - 300) / 9);
      if (besideCell > cell) {
        cell = besideCell;
        beside = true;
      }
    }
    this.playEl.classList.toggle('beside', beside);
    document.documentElement.style.setProperty('--cell', `${Math.floor(Math.max(34, cell))}px`);
  }

  renderAll(): void {
    this.renderHud();
    this.renderOrders();
    for (let i = 0; i < CELLS; i++) this.renderCell(i);
    this.renderInfo();
    this.renderNav();
    this.renderSide();
  }

  // ------------------------------------------------------------------ icon strip

  private sideKey = '';

  /**
   * Round buttons for whatever is running: timed offers, the piggy bank, the free gift.
   * Rebuilt only when the set of buttons changes; countdowns and counts are updated in
   * place so a tap that lands during a refresh is never lost.
   */
  renderSide(): void {
    const s = this.s;
    const now = Date.now();
    const offers = activeOffers(s, now);
    const gift = giftReady(s, now) && adsAvailable() && adsLeft(s, dateKey(), MAX_ADS_PER_DAY) > 0;
    const labels: [string, string, string][] = [
      ...offers.map((o): [string, string, string] => [`side-${o.id}`, faClock(o.until - now, true), 'offer']),
      ...(piggyUnlocked(s) ? [['side-piggy', piggyFull(s) ? 'پر شد!' : `${fa(s.piggy)}/${fa(PIGGY_CAP)}`, piggyFull(s) ? 'full' : ''] as [string, string, string]] : []),
      ...(gift ? [['side-gift', 'هدیه', 'gift'] as [string, string, string]] : []),
    ];
    const key = labels.map(([id, , cls]) => `${id}:${cls}`).join('|');
    if (key === this.sideKey) {
      for (const [id, text] of labels) {
        const lbl = document.getElementById(id)?.querySelector('.lbl');
        if (lbl && lbl.textContent !== text) lbl.textContent = text;
      }
      return;
    }
    const countBefore = this.sideEl.childElementCount;
    this.sideKey = key;
    clear(this.sideEl);
    const open: Record<string, () => Promise<void>> = {
      'side-piggy': () => this.modals.piggy(),
      'side-gift': () => this.modals.gift(),
      ...Object.fromEntries(offers.map((o) => [`side-${o.id}`, () => this.modals.offer(o.id)])),
    };
    const icon = (id: string) => id === 'side-gift' ? ICONS.gift : bundleArt(id === 'side-piggy' ? 'piggy_bank' : OFFER_SKU[id.slice(5) as OfferId]);
    for (const [id, text, cls] of labels) {
      this.sideEl.append(h('button', { class: `sidebtn ${cls}`, id, onclick: () => open[id]().then(() => this.renderAll()) },
        h('span', { html: svgIcon(icon(id)) }), h('span', { class: 'lbl' }, text)));
    }
    if ((countBefore === 0) !== (this.sideEl.childElementCount === 0)) this.fit();
  }

  // ------------------------------------------------------------------ HUD

  renderHud(): void {
    const s = this.s;
    tickEnergy(s, Date.now());
    const cur = xpForLevel(s.level), next = xpForLevel(s.level + 1);
    const pct = Math.round(((s.xp - cur) / Math.max(1, next - cur)) * 100);
    const toNext = msToNextEnergy(s, Date.now());
    const key = `${s.level}|${pct}|${s.energy}|${s.energy < ENERGY_CAP ? faTime(toNext) : ''}|${s.coins}|${s.gems}`;
    if (key === this.hudKey) return;
    this.hudKey = key;
    clear(this.hud);
    const level = h('button', { class: 'level-badge', id: 'hud-level', style: `--xp:${pct}%`, onclick: () => this.modals.settings(), 'aria-label': 'پروفایل و تنظیمات' },
      h('span', {}, fa(s.level)), h('i', { class: 'gear', html: svgIcon(ICONS.gear) }));
    const energy = h('button', { class: 'pill', id: 'hud-energy', onclick: () => this.modals.energy() },
      h('span', { class: 'ico', html: svgIcon(ICONS.energy) }), fa(s.energy),
      s.energy < ENERGY_CAP ? h('span', { class: 'sub' }, faTime(toNext)) : null,
      h('span', { class: 'plus' }, '+'));
    const coins = h('div', { class: 'pill', id: 'hud-coins' }, h('span', { class: 'ico', html: svgIcon(ICONS.coin) }), faNum(s.coins));
    const gems = h('button', { class: 'pill', id: 'hud-gems', onclick: () => this.modals.shop() },
      h('span', { class: 'ico', html: svgIcon(ICONS.gem) }), faNum(s.gems), h('span', { class: 'plus' }, '+'));
    this.hud.append(level, energy, coins, gems);
  }

  private tick(): void {
    const before = this.s.energy;
    tickEnergy(this.s, Date.now());
    if (this.s.energy !== before) this.dirty();
    this.renderHud();
    const gone = tickBubbles(this.s, Date.now());
    for (const i of gone) {
      this.renderCell(i);
      if (this.selected === i) this.select(null);
    }
    if (gone.length) this.dirty();
    this.s.board.forEach((c, i) => {
      if (c.lock === 'bubble') {
        const t = this.cells[i].querySelector('.bubble-time');
        if (t) t.textContent = fa(Math.max(0, Math.ceil(((c.until ?? 0) - Date.now()) / 1000)));
      }
    });
    if (this.selected !== null && this.s.board[this.selected].lock === 'bubble') this.renderInfo();
    if (refreshQuests(this.s, dateKey())) {
      this.renderNav();
      this.dirty();
    }
    this.maybeHint();
    this.renderSide();
  }

  // ------------------------------------------------------------------ idle merge hint

  private idleSince = Date.now();
  private hinted: number[] = [];

  /** Any touch on the board resets the idle timer and stops the hint wiggle. */
  private poke(): void {
    this.idleSince = Date.now();
    for (const i of this.hinted) this.cells[i].classList.remove('hint');
    this.hinted = [];
  }

  private maybeHint(): void {
    if (this.hinted.length || this.busy || this.drag || this.hand || Date.now() - this.idleSince < 6000) return;
    if (document.querySelector('.overlay, .dialogue, .place')) return;
    const pair = findHint(this.s);
    if (!pair) return;
    this.hinted = pair;
    for (const i of pair) this.cells[i].classList.add('hint');
  }

  // ------------------------------------------------------------------ orders

  private ordersKey = '';
  private navKey = '';
  private hudKey = '';

  /** Rebuilds the order cards only when an order or its ready-state actually changed. */
  renderOrders(entering: number[] = []): void {
    const key = this.s.orders.map((o) => `${o.id}:${needsMet(this.s, o).map(Number).join('')}`).join('|');
    if (key === this.ordersKey && !entering.length) return;
    this.ordersKey = key;
    clear(this.ordersEl);
    for (const o of this.s.orders) this.ordersEl.append(this.orderCard(o, entering.includes(o.id)));
  }

  private orderCard(o: Order, entering: boolean): HTMLElement {
    const met = needsMet(this.s, o);
    const ready = met.every(Boolean);
    const card = h('div', { class: `order${ready ? ' ready' : ''}${entering ? ' entering' : ''}`, 'data-order': o.id },
      h('div', { class: 'who', html: svgIcon(portrait(o.who)), title: CAST[o.who]?.name ?? '' }),
      h('div', { class: 'body' },
        h('div', { class: 'needs' }, ...o.needs.map((n, k) => h('div', { class: `need${met[k] ? ' met' : ''}`, html: svgIcon(itemArt(n)) }))),
        ready
          ? h('button', { class: 'deliver', onclick: (e: Event) => { e.stopPropagation(); this.doDeliver(o.id); } }, 'تحویل')
          : h('div', { class: 'reward' },
              h('span', {}, fa(o.stars), h('span', { html: svgIcon(ICONS.star) })),
              h('span', {}, fa(o.coins), h('span', { html: svgIcon(ICONS.coin) }))),
      ),
    );
    card.addEventListener('click', () => {
      if (ready) return this.doDeliver(o.id);
      this.toast(`${CAST[o.who]?.name ?? ''}: ${o.needs.map((n) => itemName(n)).join(' و ')} می‌خواد`);
      this.highlightNeeds(o);
    });
    return card;
  }

  private highlightNeeds(o: Order): void {
    this.cells.forEach((c, i) => {
      const it = this.s.board[i].item;
      if (it && !this.s.board[i].lock && o.needs.some((n) => sameItem(n, it))) {
        c.classList.add('target');
        setTimeout(() => c.classList.remove('target'), 1200);
      }
    });
  }

  private async doDeliver(id: number): Promise<void> {
    if (this.busy) return;
    const card = this.ordersEl.querySelector(`[data-order="${id}"]`) as HTMLElement | null;
    const order = this.s.orders.find((o) => o.id === id);
    if (!order || !card) return;
    const prevLevel = this.s.level;
    const events = deliver(this.s, id);
    const ev = events.find((e) => e.type === 'deliver') as Extract<GameEvent, { type: 'deliver' }> | undefined;
    if (!ev) return this.fail(events);
    this.busy = true;
    sfx.deliver();
    buzz('medium');
    // Items fly from the board into the customer's card.
    const target = card.getBoundingClientRect();
    if (this.selected !== null && ev.cells.includes(this.selected)) this.select(null);
    await Promise.all(ev.cells.map((ci, k) => {
      const art = itemArt(order.needs[k] ?? order.needs[0]);
      const from = this.cells[ci].getBoundingClientRect();
      this.renderCell(ci);
      return this.fly(art, from, target, 380 + k * 60);
    }));
    card.classList.add('leaving');
    this.flyReward(ICONS.coin, target, 'hud-coins', Math.min(6, 2 + Math.floor(order.coins / 20)));
    this.flyReward(ICONS.star, target, 'nav-alley', Math.min(5, order.stars + 1));
    if (ev.piggy) this.flyReward(ICONS.gem, target, 'side-piggy', 1);
    this.floatText(`+${fa(order.stars)} ⭐`, target);
    const lines = THANKS[order.who] ?? THANKS.narges;
    this.speech(lines[Math.floor(Math.random() * lines.length)], target);
    await wait(420);
    const added = events.filter((e) => e.type === 'newOrder').map((e) => (e as Extract<GameEvent, { type: 'newOrder' }>).order.id);
    this.renderOrders(added);
    this.renderHud();
    this.renderNav();
    this.renderInfo();
    this.busy = false;
    this.dirty();
    for (const e of events) if (e.type === 'levelUp') await this.modals.levelUp(e.level, e.gems, e.gift);
    if (this.s.level !== prevLevel) {
      const offer = offerOnLevel(this.s, this.s.level, Date.now());
      this.renderAll();
      if (offer) await this.modals.offer(offer.id);
      this.renderAll();
    }
    this.discoverNew();
    this.tutorial();
  }

  // ------------------------------------------------------------------ board

  renderCell(i: number): void {
    const el = this.cells[i];
    const cell = this.s.board[i];
    clear(el);
    el.classList.toggle('sel', this.selected === i);
    if (!cell.item) return;
    if (cell.lock === 'box') {
      el.append(h('div', { class: 'item', html: BOX_COVER }));
      return;
    }
    const it = cell.item;
    const cls = ['item'];
    if (isGenerator(it)) cls.push('gen');
    if (it.level === maxLevel(it.chain) && !CHAINS[it.chain].collectible && !isGenerator(it)) cls.push('max');
    if (cell.lock === 'sheet') cls.push('sheet');
    const node = h('div', { class: cls.join(' '), html: svgIcon(itemArt(it)) });
    el.append(node);
    if (cell.lock === 'sheet') el.insertAdjacentHTML('beforeend', SHEET_COVER);
    if (cell.lock === 'bubble') {
      el.append(h('div', { class: 'bubble' }), h('div', { class: 'bubble-time' }, fa(Math.max(0, Math.ceil(((cell.until ?? 0) - Date.now()) / 1000)))));
    }
  }

  private cellAt(x: number, y: number): number | null {
    const el = document.elementFromPoint(x, y)?.closest('.cell') as HTMLElement | null;
    return el && this.boardEl.contains(el) ? Number(el.dataset.i) : null;
  }

  private onDown(e: PointerEvent): void {
    this.poke();
    if (this.busy) return;
    const i = this.cellAt(e.clientX, e.clientY);
    if (i === null) return;
    const cell = this.s.board[i];
    if (cell.item && !cell.lock) {
      this.drag = { from: i, x: e.clientX, y: e.clientY, id: e.pointerId, ghost: null };
      this.boardEl.setPointerCapture(e.pointerId);
    } else {
      this.onTap(i);
    }
  }

  private onMove(e: PointerEvent): void {
    const d = this.drag;
    if (!d || d.id !== e.pointerId) return;
    if (!d.ghost) {
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) < 8) return;
      const it = this.s.board[d.from].item!;
      d.ghost = h('div', { class: 'ghost', html: svgIcon(itemArt(it)) });
      document.body.append(d.ghost);
      this.cells[d.from].querySelector('.item')?.classList.add('dragging');
      this.select(d.from);
      this.cells.forEach((c, i) => {
        const other = this.s.board[i];
        if (i !== d.from && other.item && other.lock !== 'box' && other.lock !== 'bubble' && canMerge(it, other.item)) c.classList.add('target');
      });
    }
    d.ghost.style.left = `${e.clientX}px`;
    d.ghost.style.top = `${e.clientY}px`;
  }

  private onUp(e: PointerEvent): void {
    const d = this.drag;
    if (!d || d.id !== e.pointerId) return;
    this.drag = null;
    if (!d.ghost) return this.onTap(d.from);
    d.ghost.remove();
    this.cells.forEach((c) => c.classList.remove('target'));
    const to = this.cellAt(e.clientX, e.clientY);
    if (to === null || to === d.from) {
      this.renderCell(d.from);
      return;
    }
    const events = drop(this.s, d.from, to);
    if (!events.length) return this.renderCell(d.from);
    this.handle(events, to);
  }

  private cancelDrag(): void {
    if (!this.drag) return;
    this.drag.ghost?.remove();
    const from = this.drag.from;
    this.drag = null;
    this.cells.forEach((c) => c.classList.remove('target'));
    this.renderCell(from);
  }

  select(i: number | null): void {
    const prev = this.selected;
    this.selected = i;
    if (prev !== null) this.cells[prev].classList.remove('sel');
    if (i !== null) this.cells[i].classList.add('sel');
    this.renderInfo();
  }

  private onTap(i: number): void {
    const cell = this.s.board[i];
    if (!cell.item) return this.select(null);
    const it = cell.item;
    const wasSelected = this.selected === i;
    this.select(i);
    sfx.tap();
    if (cell.lock) return;
    const def = CHAINS[it.chain];
    if (def.produces || ((def.collectible || it.chain === 'chest') && wasSelected)) {
      this.handle(tap(this.s, i, Date.now()), i);
    }
  }

  /** Applies model events to the screen. */
  handle(events: GameEvent[], focus: number | null = null): void {
    let ordersChanged = false;
    for (const e of events) {
      switch (e.type) {
        case 'spawn': {
          this.renderCell(e.to);
          this.animateFrom(e.to, e.from);
          sfx.spawn();
          buzz('light');
          ordersChanged = true;
          break;
        }
        case 'merge': {
          this.renderCell(e.from);
          this.renderCell(e.at);
          const node = this.cells[e.at].querySelector('.item');
          node?.classList.add('pop');
          this.cells[e.at].append(h('div', { class: 'merge-burst' }));
          setTimeout(() => this.cells[e.at].querySelector('.merge-burst')?.remove(), 500);
          this.sparkles(this.cells[e.at].getBoundingClientRect(), e.item.level >= 6 ? 12 : 6);
          if (e.item.level === maxLevel(e.item.chain)) sfx.bigMerge();
          else sfx.merge(e.item.level);
          buzz(e.item.level >= 6 ? 'medium' : 'light');
          this.select(e.at);
          ordersChanged = true;
          break;
        }
        case 'move':
          this.renderCell(e.from);
          this.renderCell(e.to);
          this.select(e.to);
          break;
        case 'swap':
          this.renderCell(e.a);
          this.renderCell(e.b);
          this.select(e.b);
          break;
        case 'unlock':
          this.renderCell(e.at);
          sfx.unlock();
          ordersChanged = true;
          break;
        case 'bubble':
          this.renderCell(e.at);
          this.cells[e.at].querySelector('.bubble')?.classList.add('pop');
          if (markSeen(this.s, 'tut:bubble')) this.toast('یه حباب! تا یه دقیقه وقت داری آزادش کنی.');
          break;
        case 'bubblePop':
          this.renderCell(e.at);
          this.cells[e.at].querySelector('.item')?.classList.add('pop');
          this.sparkles(this.cells[e.at].getBoundingClientRect(), 10);
          sfx.unlock();
          ordersChanged = true;
          break;
        case 'boxOpen':
          this.renderCell(e.at);
          this.cells[e.at].querySelector('.item')?.classList.add('pop');
          break;
        case 'collect': {
          const r = this.cells[e.at].getBoundingClientRect();
          this.renderCell(e.at);
          if (e.kind === 'coins') {
            sfx.coin();
            this.flyReward(ICONS.coin, r, 'hud-coins', 4);
          } else {
            sfx.spawn();
            this.flyReward(ICONS.energy, r, 'hud-energy', 4);
          }
          this.floatText(`+${fa(e.amount)}`, r);
          this.select(null);
          break;
        }
        case 'chest':
          for (const sp of e.spawned) {
            this.renderCell(sp.to);
            this.animateFrom(sp.to, e.at);
          }
          sfx.unlock();
          buzz('medium');
          ordersChanged = true;
          break;
        case 'sell': {
          const r = this.cells[e.at].getBoundingClientRect();
          this.renderCell(e.at);
          sfx.coin();
          this.flyReward(ICONS.coin, r, 'hud-coins', 2);
          this.select(null);
          ordersChanged = true;
          break;
        }
        case 'fail':
          this.fail([e]);
          if (focus !== null) this.cells[focus].classList.add('shake');
          if (focus !== null) setTimeout(() => this.cells[focus].classList.remove('shake'), 320);
          break;
        default:
          break;
      }
    }
    if (ordersChanged) this.renderOrders();
    this.discoverNew();
    this.renderHud();
    this.renderInfo();
    this.renderNav();
    this.dirty();
    this.tutorial();
  }

  // ------------------------------------------------------------------ discoveries

  private discoverQueue: Item[] = [];
  private discoverShowing = false;

  /** Adds newly owned items to the album and announces each with a small banner. */
  discoverNew(): void {
    const fresh = discover(this.s);
    if (!fresh.length) return;
    this.discoverQueue.push(...fresh);
    this.renderNav();
    this.dirty();
    if (!this.discoverShowing) void this.showDiscoveries();
  }

  private async showDiscoveries(): Promise<void> {
    this.discoverShowing = true;
    while (this.discoverQueue.length) {
      const it = this.discoverQueue.shift()!;
      const el = h('button', { class: 'discover', onclick: () => { el.remove(); this.modals.codex().then(() => this.renderAll()); } },
        h('span', { class: 'art', html: svgIcon(itemArt(it)) }),
        h('span', {}, h('b', {}, 'وسیله‌ی جدید!'), h('br'), itemName(it)));
      document.body.append(el);
      sfx.discover();
      await wait(this.discoverQueue.length > 2 ? 900 : 1500);
      el.classList.add('out');
      await wait(250);
      el.remove();
    }
    this.discoverShowing = false;
  }

  fail(events: GameEvent[]): void {
    const f = events.find((e) => e.type === 'fail') as Extract<GameEvent, { type: 'fail' }> | undefined;
    if (!f) return;
    sfx.error();
    switch (f.reason) {
      case 'noEnergy': return void this.modals.energy();
      case 'boardFull': return this.toast('صفحه پره! چند تا وسیله رو ادغام کن، بفروش یا بذار تو کیف.');
      case 'locked': return this.toast('این خونه قفله. یه وسیله‌ی مشابه روش بکش.');
      case 'missing': return this.toast('هنوز همه‌ی وسایل سفارش آماده نیست.');
      case 'notEnoughGems': return void this.modals.shop();
      case 'bagFull': return this.toast('کیف پره!');
      default: return this.toast('نمی‌شه!');
    }
  }

  // ------------------------------------------------------------------ info bar

  renderInfo(): void {
    clear(this.info);
    const i = this.selected;
    const cell = i === null ? null : this.s.board[i];
    if (i === null || !cell?.item) {
      this.info.append(h('div', { class: 'text' },
        h('div', { class: 'name' }, 'محله‌ی ما'),
        h('div', { class: 'hint' }, 'مولدها رو بزن تا وسیله بسازن. دو وسیله‌ی یکسان رو روی هم بکش تا بهتر بشن.')));
      return;
    }
    const it = cell.item;
    const thumb = h('div', { class: 'thumb', html: svgIcon(cell.lock === 'box' ? '' : itemArt(it)) });
    if (cell.lock === 'box') {
      this.info.append(h('div', { class: 'text' }, h('div', { class: 'name' }, 'جعبه‌ی دربسته'), h('div', { class: 'hint' }, 'کنار این جعبه ادغام کن تا باز بشه.')));
      return;
    }
    const def = CHAINS[it.chain];
    const levelText = `سطح ${fa(it.level)} از ${fa(maxLevel(it.chain))}`;
    let hint = levelText;
    const actions: HTMLElement[] = [];
    if (cell.lock === 'bubble') {
      const secs = Math.max(0, Math.ceil(((cell.until ?? 0) - Date.now()) / 1000));
      add(this.info, thumb, h('div', { class: 'text' }, h('div', { class: 'name' }, `حباب: ${itemName(it)}`), h('div', { class: 'hint' }, `${fa(secs)} ثانیه دیگه می‌پره!`)),
        h('button', { class: 'chip pink', onclick: () => this.handle(popBubble(this.s, i), i) }, fa(bubbleGemCost(it)), h('span', { html: svgIcon(ICONS.gem) })),
        adsAvailable() ? h('button', { class: 'chip green', onclick: async () => {
          const bubbled = { ...it };
          if (!(await this.modals.rewarded())) return;
          // The bubble may have floated away while the video played: still give the item.
          const c = this.s.board[i];
          if (c.lock === 'bubble' && c.item) this.handle(popBubble(this.s, i, true), i);
          else this.giveItem(bubbled);
        } }, h('span', { html: svgIcon(ICONS.video) })) : null);
      return;
    }
    if (cell.lock === 'sheet') {
      hint = `زیر پارچه. یه «${itemName(it)}» دیگه روش بکش تا آزاد بشه.`;
      const cost = sheetGemCost(it);
      actions.push(h('button', { class: 'chip pink', onclick: () => this.handle(buySheet(this.s, i), i) }, fa(cost), h('span', { html: svgIcon(ICONS.gem) })));
    } else if (def.produces) {
      hint = `${levelText} · بزن تا «${CHAINS[def.produces].name}» بسازه (۱ ⚡)`;
    } else if (def.collectible) {
      hint = 'دوباره بزن تا جمعش کنی';
    } else if (it.chain === 'chest') {
      hint = 'دوباره بزن تا باز بشه';
    } else if (it.level === maxLevel(it.chain)) {
      hint = 'بالاترین سطح! برای سفارش‌های بزرگ نگهش دار.';
    }
    actions.unshift(h('button', { class: 'chip', onclick: () => this.modals.chain(it) }, 'ⓘ'));
    if (!cell.lock && !isGenerator(it) && !def.collectible) {
      actions.push(h('button', { class: 'chip', onclick: () => this.handle(sell(this.s, i), i) }, 'فروش ', fa(sellValue(it)), h('span', { html: svgIcon(ICONS.coin) })));
    }
    if (!cell.lock) {
      actions.push(h('button', { class: 'chip', onclick: () => {
        const ev = toBag(this.s, i);
        if (ev.length) return this.fail(ev);
        this.renderCell(i);
        this.select(null);
        this.renderNav();
        this.dirty();
      } }, h('span', { html: svgIcon(ICONS.bag) })));
    }
    this.info.append(thumb, h('div', { class: 'text' }, h('div', { class: 'name' }, itemName(it)), h('div', { class: 'hint' }, hint)), ...actions);
  }

  // ------------------------------------------------------------------ nav

  renderNav(): void {
    const p = progress(this.s);
    const ready = !!p.next && this.s.stars >= p.next.cost;
    const bagCount = this.s.bag.filter(Boolean).length;
    const album = codexClaimable(this.s);
    const key = `${this.s.stars}|${p.next?.id}|${bagCount}|${questsClaimable(this.s)}|${album}`;
    if (key === this.navKey) return;
    this.navKey = key;
    clear(this.navEl);
    const claimable = questsClaimable(this.s);
    this.navEl.append(
      h('button', { class: 'navbtn', id: 'nav-album', onclick: () => this.modals.codex().then(() => this.renderNav()) }, h('span', { html: svgIcon(ICONS.album) }), 'کلکسیون',
        album ? h('span', { class: 'badge' }, fa(album)) : null),
      h('button', { class: `navbtn${claimable ? ' ready' : ''}`, onclick: () => this.modals.quests().then(() => this.renderNav()) }, h('span', { html: svgIcon(ICONS.quest) }), 'روزانه',
        claimable ? h('span', { class: 'badge' }, fa(claimable)) : null),
      h('button', { class: 'navbtn', onclick: () => this.modals.bag() }, h('span', { html: svgIcon(ICONS.bag) }), 'کیف',
        bagCount ? h('span', { class: 'badge' }, fa(bagCount)) : null),
      h('button', { class: `navbtn main${ready ? ' ready' : ''}`, id: 'nav-alley', onclick: () => this.openPlace() },
        h('span', { html: svgIcon(ICONS.alley) }), 'محله', h('span', { class: 'badge' }, p.next ? `${fa(this.s.stars)}/${fa(p.next.cost)}` : fa(this.s.stars), ' ⭐')),
      h('button', { class: 'navbtn', onclick: () => this.modals.shop() }, h('span', { html: svgIcon(ICONS.shop) }), 'فروشگاه'),
    );
  }

  async openPlace(): Promise<void> {
    this.hideHand();
    await this.place.open();
    this.renderAll();
    this.tutorial();
  }

  // ------------------------------------------------------------------ effects

  private animateFrom(to: number, from: number): void {
    const node = this.cells[to].querySelector('.item') as HTMLElement | null;
    if (!node || to === from) return node?.classList.add('pop');
    const a = this.cells[from].getBoundingClientRect();
    const b = this.cells[to].getBoundingClientRect();
    node.animate(
      [
        { transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(.35)`, opacity: 0.6 },
        { transform: `translate(${(a.left - b.left) / 2}px, ${(a.top - b.top) / 2 - 24}px) scale(.9)`, opacity: 1, offset: 0.55 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 340, easing: 'cubic-bezier(.3,.7,.4,1)' },
    );
  }

  fly(art: string, from: DOMRect, to: DOMRect, ms = 450): Promise<void> {
    const el = h('div', { class: 'flyer', html: svgIcon(art) });
    document.body.append(el);
    const x0 = from.left + from.width / 2 - 20, y0 = from.top + from.height / 2 - 20;
    const x1 = to.left + to.width / 2 - 20, y1 = to.top + to.height / 2 - 20;
    const anim = el.animate(
      [
        { transform: `translate(${x0}px, ${y0}px) scale(1)` },
        { transform: `translate(${(x0 + x1) / 2}px, ${Math.min(y0, y1) - 40}px) scale(1.15)`, offset: 0.5 },
        { transform: `translate(${x1}px, ${y1}px) scale(.6)` },
      ],
      { duration: ms, easing: 'ease-in-out' },
    );
    return animDone(anim, ms).then(() => el.remove());
  }

  flyReward(art: string, from: DOMRect, targetId: string, count: number): void {
    const target = document.getElementById(targetId);
    if (!target) return;
    const to = target.getBoundingClientRect();
    for (let k = 0; k < count; k++) {
      const jitter = new DOMRect(from.left + (Math.random() - 0.5) * 30, from.top + (Math.random() - 0.5) * 30, from.width, from.height);
      setTimeout(() => this.fly(art, jitter, to, 520).then(() => {
        target.classList.remove('bump');
        void target.offsetWidth;
        target.classList.add('bump');
      }), k * 70);
    }
  }

  /** Little stars bursting out of a merge. */
  sparkles(at: DOMRect, count: number): void {
    const colors = ['#ffd36b', '#ff7a9c', '#5fe0e0', '#fff'];
    for (let k = 0; k < count; k++) {
      const a = (k / count) * Math.PI * 2 + Math.random() * 0.5;
      const d = 30 + Math.random() * 26;
      const el = h('div', { class: 'spark', style: `left:${at.left + at.width / 2}px;top:${at.top + at.height / 2}px;background:${colors[k % colors.length]}` });
      document.body.append(el);
      const ms = 520 + Math.random() * 200;
      const anim = el.animate(
        [{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d}px)) scale(.2)`, opacity: 0 }],
        { duration: ms, easing: 'cubic-bezier(.2,.8,.3,1)' },
      );
      animDone(anim, ms).then(() => el.remove());
    }
  }

  /** A neighbour's short line in a speech bubble under their order card. */
  speech(text: string, at: DOMRect): void {
    const el = h('div', { class: 'speech', style: `top:${at.bottom + 4}px;left:${Math.max(6, Math.min(window.innerWidth - 186, at.left + at.width / 2 - 90))}px` }, text);
    document.body.append(el);
    setTimeout(() => el.remove(), 2200);
  }

  floatText(text: string, at: DOMRect): void {
    const el = h('div', { class: 'float-text', style: `left:${at.left + at.width / 2 - 20}px;top:${at.top}px` }, text);
    document.body.append(el);
    setTimeout(() => el.remove(), 950);
  }

  toast(msg: string): void {
    document.querySelectorAll('.toast').forEach((t) => t.remove());
    const el = h('div', { class: 'toast' }, msg);
    document.body.append(el);
    setTimeout(() => el.remove(), 2300);
  }

  // ------------------------------------------------------------------ saving

  dirty(): void {
    clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => this.saveNow(), 400);
  }

  saveNow(): Promise<void> {
    clearTimeout(this.saveTimer);
    return writeSave(JSON.stringify(this.s));
  }

  // ------------------------------------------------------------------ tutorial

  private hand: HTMLElement | null = null;

  /** Animated pointing hand for the tutorial: taps at `a`, or drags from `a` to `b`. */
  private showHand(a: DOMRect, b?: DOMRect): void {
    this.hideHand();
    const hand = h('div', { class: 'tut-hand' }, '👆');
    document.body.append(hand);
    const at = (r: DOMRect) => `translate(${r.left + r.width / 2 - 14}px, ${r.top + r.height / 2 - 4}px)`;
    hand.animate(
      b
        ? [{ transform: at(a), opacity: 0 }, { transform: at(a), opacity: 1, offset: 0.15 }, { transform: at(b), opacity: 1, offset: 0.75 }, { transform: at(b), opacity: 0 }]
        : [{ transform: `${at(a)} scale(1)` }, { transform: `${at(a)} scale(.82)`, offset: 0.5 }, { transform: `${at(a)} scale(1)` }],
      { duration: b ? 1600 : 900, iterations: Infinity },
    );
    this.hand = hand;
  }

  private hideHand(): void {
    this.hand?.remove();
    this.hand = null;
  }

  /** Light-touch first-session guidance, driven by what the player has done so far. */
  tutorial(): void {
    const s = this.s;
    const step = (key: string) => markSeen(s, `tut:${key}`);
    this.hideHand();
    if (document.querySelector('.overlay, .dialogue, .place')) return;
    if (s.stats.merges === 0) {
      if (step('merge')) this.toast('دو تا «برگ چای» رو روی هم بکش!');
      const pair = s.board.map((c, i) => (c.item && !c.lock && sameItem(c.item, { chain: 'tea', level: 1 }) ? i : -1)).filter((i) => i >= 0);
      if (pair.length >= 2) this.showHand(this.cells[pair[0]].getBoundingClientRect(), this.cells[pair[1]].getBoundingClientRect());
      return;
    }
    if (s.stats.orders === 0) {
      const btn = this.ordersEl.querySelector('.deliver');
      if (btn) {
        if (step('deliver')) this.toast('سفارش آماده‌ست! دکمه‌ی «تحویل» رو بزن.');
        this.showHand(btn.getBoundingClientRect());
      }
      return;
    }
    if (s.stats.taps === 0) {
      const gen = s.board.findIndex((c) => c.item?.chain === 'genTea' && !c.lock);
      if (gen >= 0) {
        if (step('generator')) this.toast('قوطی چای رو بزن تا برگ چای بسازه.');
        this.showHand(this.cells[gen].getBoundingClientRect());
      }
      return;
    }
    const p = progress(s);
    if (p.next && s.stars >= p.next.cost && s.tasksDone.length === 0) {
      if (step('alley')) this.toast('ستاره داری! دکمه‌ی «محله» رو بزن و قهوه‌خانه رو تعمیر کن.');
      const nav = document.getElementById('nav-alley');
      if (nav) this.showHand(nav.getBoundingClientRect());
    }
  }

  /** Story intro for the first place, shown once on a new game. */
  async firstRun(): Promise<void> {
    if (markSeen(this.s, introKey('teahouse'))) {
      await this.place.dialogue(this.place.places[0].intro);
      this.dirty();
    }
    this.tutorial();
  }

  /** Grants a reward item next to the generators (or into the bag when the board is full). */
  giveItem(it: Item): void {
    const at = placeItem(this.s, it);
    if (at !== null) {
      this.renderCell(at);
      this.cells[at].querySelector('.item')?.classList.add('pop');
    }
    this.discoverNew();
    this.renderNav();
    this.dirty();
  }
}
