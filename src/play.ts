import { sfx } from './audio';
import { botPick } from './game/bot';
import { BELT_MARGIN, Game, beltPoint, type LevelDef } from './game/engine';
import { PALETTE, shade } from './game/palette';
import { clamp01, ease, spring } from './gfx/ease';
import { Fx } from './gfx/fx';
import { blockSprite, drawCat, iceSprite, rr, setSpriteScale, starPath, type Expr } from './gfx/sprites';
import { haptic } from './haptics';

/** Per-cat visual state, layered on top of the simulation. */
interface Vis {
  x: number; y: number;
  scale: number;
  sq: number; sqv: number; // squash spring
  hop: { fx: number; fy: number; t: number; dur: number; h: number } | null;
  shake: number;
  shootT: number;
  lookX: number; lookY: number;
  revealT: number;
  blink: number;
}
interface Shot { x0: number; y0: number; x1: number; y1: number; t: number; dur: number; color: number; cell: number; trail: number[] }
interface Dying { cell: number; t: number }
interface Ghost { x: number; y: number; color: number; t: number; r: number }

export interface PlayCallbacks {
  onWin(game: Game): void;
  onLose(game: Game): void;
  onProgress(p: number): void;
  onBelt(count: number, capacity: number, movesLeft: number): void;
  onDanger(level: number): void;
}

const STEP = 1 / 60;
const PRAISE = ['عالی!', 'آفرین!', 'ایول!', 'دمت گرم!', 'محشره!', 'بی‌نظیر!'];
const CONFETTI = ['#ff4d6d', '#ffd23f', '#3ec9e6', '#7ae05a', '#b26bff', '#ff8a1f', '#ffffff'];

export class PlayView {
  readonly game: Game;
  readonly canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private staticLayer: HTMLCanvasElement;
  /** Blocks are drawn into their own layer and only repainted where something changed. */
  private blockLayer: HTMLCanvasElement;
  private blocksDirty = true;
  private dirtyCells: number[] = [];
  private cb: PlayCallbacks;
  private raf = 0;
  private last = 0;
  private acc = 0;
  private t = 0;
  private vis: Vis[];
  private shownHp: number[];
  private shots: Shot[] = [];
  private dying: Dying[] = [];
  private ghosts: Ghost[] = [];
  private fx = new Fx();
  private shakeT = 0;
  private shakeAmp = 0;
  private hintId = -1;
  private hintClock = 0;
  private idle = 0;
  private winT = -1;
  private loseT = -1;
  private comboN = 0;
  private comboT = 0;
  private dangerT = 0;
  private heartbeat = 0;
  private flashT = 0;
  private slotPop: number[] = [];
  private lastSlots = 0;
  private frameMs = 16;
  private praiseT = 0;
  bombMode = false;
  hints: boolean;
  tutorial: boolean;
  paused = false;
  // layout
  private dpr = 1;
  private cw = 0;
  private ch = 0;
  private cell = 0;
  private ox = 0;
  private oy = 0;
  private B = 0;
  private bx = 0;
  private by = 0;
  private slotS = 0;
  private slotY = 0;
  private queueY = 0;
  private colW = 0;
  private rowH = 0;
  private qR = 0;
  private beltR = 0;
  private trackW = 0;

  constructor(host: HTMLElement, level: LevelDef, cb: PlayCallbacks, opts: { hints: boolean; tutorial: boolean }) {
    this.game = new Game(level);
    this.cb = cb;
    this.hints = opts.hints;
    this.tutorial = opts.tutorial;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'play-canvas';
    host.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;
    this.staticLayer = document.createElement('canvas');
    this.blockLayer = document.createElement('canvas');
    this.shownHp = this.game.hp.slice();
    this.vis = this.game.shooters.map(() => ({
      x: 0, y: 0, scale: 1, sq: 1, sqv: 0, hop: null, shake: 0, shootT: 0, lookX: 0, lookY: 0, revealT: 0, blink: 1 + Math.random() * 4,
    }));
    this.lastSlots = this.game.slots.length;
    this.layout();
    // Cats drop into their lanes at the start.
    this.game.shooters.forEach((s, i) => {
      const p = this.target(s.id);
      Object.assign(this.vis[s.id], { x: p.x, y: p.y - 40 - i * 4, scale: p.scale });
    });
    this.canvas.addEventListener('pointerdown', this.onPointer);
    window.addEventListener('resize', this.onResize);
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
    cb.onProgress(0);
    cb.onBelt(0, this.game.capacity, this.game.movesLeft);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.canvas.removeEventListener('pointerdown', this.onPointer);
    window.removeEventListener('resize', this.onResize);
    this.canvas.remove();
  }

  private onResize = () => this.layout();

  // ───────────────────────── layout ─────────────────────────

  private layout() {
    const r = this.canvas.parentElement!.getBoundingClientRect();
    // Cap the backing store: sharp enough, and cheap on 1080p+ phones.
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    setSpriteScale(this.dpr);
    this.cw = r.width;
    this.ch = r.height;
    this.blocksDirty = true;
    for (const c of [this.canvas, this.staticLayer, this.blockLayer]) {
      c.width = Math.round(r.width * this.dpr);
      c.height = Math.round(r.height * this.dpr);
    }
    this.canvas.style.width = r.width + 'px';
    this.canvas.style.height = r.height + 'px';
    const g = this.game;
    const slots = Math.max(5, g.slots.length);
    this.slotS = Math.max(40, Math.min(60, (this.cw - 28) / slots - 8));
    this.qR = Math.min(26, this.slotS * 0.42);
    this.rowH = this.qR * 2.35;
    const queueH = this.rowH * 2.7 + this.qR;
    const slotsH = this.slotS + 18;
    const boardMax = this.ch - queueH - slotsH - 14;
    const B = Math.max(140, Math.min(this.cw - 12, boardMax));
    this.B = B;
    const units = g.w + 2 * (BELT_MARGIN + 0.85);
    this.cell = B / units;
    const pad = (BELT_MARGIN + 0.85) * this.cell;
    this.bx = (this.cw - B) / 2;
    this.by = 4;
    this.ox = this.bx + pad;
    this.oy = this.by + pad;
    this.beltR = Math.max(11, Math.min(21, this.cell * 0.95));
    this.trackW = Math.max(18, this.beltR * 1.9);
    this.slotY = this.by + B + 12;
    this.queueY = this.slotY + slotsH + this.qR * 1.25;
    this.colW = Math.min(this.cw / g.columns.length, 108);
    this.drawStatic();
  }

  private slotX(i: number): number {
    const n = this.game.slots.length;
    const gap = this.slotS + 8;
    return this.cw / 2 + (i - (n - 1) / 2) * gap;
  }

  private colX(i: number): number {
    const n = this.game.columns.length;
    // Right-to-left: the first column sits on the right, like reading Persian.
    return this.cw / 2 + ((n - 1) / 2 - i) * this.colW;
  }

  private beltXY(s: number) {
    const p = beltPoint(this.game.w, this.game.h, s);
    return { x: this.ox + p.x * this.cell, y: this.oy + p.y * this.cell, edge: p.edge };
  }

  /** Board, conveyor, slot wells and lanes: drawn once per layout into an offscreen layer. */
  private drawStatic() {
    const ctx = this.staticLayer.getContext('2d')!;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.cw, this.ch);
    const g = this.game;
    const c = this.cell;
    const { bx, by, B } = this;
    // panel shadow + gold frame
    ctx.fillStyle = 'rgba(20,10,50,0.28)';
    rr(ctx, bx + 2, by + 8, B - 4, B, c * 1.3);
    ctx.fill();
    const frame = ctx.createLinearGradient(0, by, 0, by + B);
    frame.addColorStop(0, '#ffe7a3');
    frame.addColorStop(0.5, '#e7b14a');
    frame.addColorStop(1, '#b97a1f');
    ctx.fillStyle = frame;
    rr(ctx, bx, by, B, B, c * 1.3);
    ctx.fill();
    const panel = ctx.createLinearGradient(0, by, 0, by + B);
    panel.addColorStop(0, '#f3e7d2');
    panel.addColorStop(1, '#e6d5b8');
    ctx.fillStyle = panel;
    rr(ctx, bx + 4, by + 4, B - 8, B - 8, c * 1.1);
    ctx.fill();
    // conveyor track
    const m = BELT_MARGIN * c;
    const x0 = this.ox - m, y0 = this.oy - m, w = g.w * c + 2 * m, h = g.h * c + 2 * m;
    const rad = Math.min(c * 1.1, this.trackW);
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#c99434';
    ctx.lineWidth = this.trackW + 6;
    rr(ctx, x0, y0, w, h, rad);
    ctx.stroke();
    ctx.strokeStyle = '#33244f';
    ctx.lineWidth = this.trackW;
    ctx.stroke();
    ctx.strokeStyle = '#4a3672';
    ctx.lineWidth = this.trackW - 6;
    ctx.stroke();
    // rollers at the corners
    for (const [px, py] of [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]]) {
      const gr = ctx.createRadialGradient(px - 2, py - 2, 1, px, py, this.trackW * 0.45);
      gr.addColorStop(0, '#fff1c2');
      gr.addColorStop(1, '#b8862a');
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(px, py, this.trackW * 0.36, 0, Math.PI * 2);
      ctx.fill();
    }
    // picture well
    ctx.fillStyle = 'rgba(110,70,30,0.12)';
    rr(ctx, this.ox - 3, this.oy - 3, g.w * c + 6, g.h * c + 6, 8);
    ctx.fill();
    ctx.fillStyle = 'rgba(120,80,40,0.10)';
    for (let yy = 0; yy < g.h; yy++) for (let xx = 0; xx < g.w; xx++) {
      ctx.fillRect(this.ox + (xx + 0.5) * c - 0.75, this.oy + (yy + 0.5) * c - 0.75, 1.5, 1.5);
    }
    // entry arch (Persian gate) at the start of the loop
    const e = this.beltXY(0);
    this.drawArch(ctx, e.x, e.y + this.trackW * 0.1, this.trackW * 0.95);
    // slot wells
    for (let i = 0; i < g.slots.length; i++) {
      const x = this.slotX(i) - this.slotS / 2, y = this.slotY;
      const wg = ctx.createLinearGradient(0, y, 0, y + this.slotS);
      wg.addColorStop(0, 'rgba(25,12,60,0.38)');
      wg.addColorStop(1, 'rgba(25,12,60,0.18)');
      ctx.fillStyle = wg;
      rr(ctx, x, y, this.slotS, this.slotS, this.slotS * 0.3);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 1.5;
      rr(ctx, x + 0.75, y + 0.75, this.slotS - 1.5, this.slotS - 1.5, this.slotS * 0.3);
      ctx.stroke();
      this.drawPaw(ctx, x + this.slotS / 2, y + this.slotS / 2, this.slotS * 0.16, 'rgba(255,255,255,0.18)');
    }
    // queue lanes with cushions for the front cats
    for (let i = 0; i < g.columns.length; i++) {
      const x = this.colX(i);
      const lg = ctx.createLinearGradient(0, this.queueY - this.qR, 0, this.ch);
      lg.addColorStop(0, 'rgba(25,12,60,0.22)');
      lg.addColorStop(1, 'rgba(25,12,60,0)');
      ctx.fillStyle = lg;
      rr(ctx, x - this.colW * 0.42, this.queueY - this.qR * 1.45, this.colW * 0.84, this.ch, 22);
      ctx.fill();
      // cushion (پشتی) under the front cat
      const cy = this.queueY + this.qR * 0.95;
      const cg = ctx.createLinearGradient(0, cy - 6, 0, cy + 8);
      cg.addColorStop(0, '#e2513f');
      cg.addColorStop(1, '#9c2a22');
      ctx.fillStyle = cg;
      rr(ctx, x - this.qR * 1.15, cy - this.qR * 0.22, this.qR * 2.3, this.qR * 0.5, this.qR * 0.25);
      ctx.fill();
      ctx.strokeStyle = '#ffcf5a';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      rr(ctx, x - this.qR * 1.05, cy - this.qR * 0.14, this.qR * 2.1, this.qR * 0.34, this.qR * 0.18);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  private drawArch(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
    ctx.save();
    ctx.translate(x, y);
    const gold = ctx.createLinearGradient(0, -s, 0, s * 0.4);
    gold.addColorStop(0, '#fff0b8');
    gold.addColorStop(1, '#c4881f');
    ctx.fillStyle = gold;
    ctx.beginPath();
    ctx.moveTo(-s * 0.55, s * 0.45);
    ctx.lineTo(-s * 0.55, -s * 0.2);
    ctx.quadraticCurveTo(-s * 0.55, -s * 0.7, 0, -s * 0.95);
    ctx.quadraticCurveTo(s * 0.55, -s * 0.7, s * 0.55, -s * 0.2);
    ctx.lineTo(s * 0.55, s * 0.45);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#1f6f8b';
    ctx.beginPath();
    ctx.moveTo(-s * 0.36, s * 0.45);
    ctx.lineTo(-s * 0.36, -s * 0.15);
    ctx.quadraticCurveTo(-s * 0.36, -s * 0.5, 0, -s * 0.7);
    ctx.quadraticCurveTo(s * 0.36, -s * 0.5, s * 0.36, -s * 0.15);
    ctx.lineTo(s * 0.36, s * 0.45);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffd86a';
    starPath(ctx, 0, -s * 0.28, s * 0.14, 0.5, 8);
    ctx.fill();
    ctx.restore();
  }

  private drawPaw(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y + r * 0.35, r * 0.8, r * 0.65, 0, 0, Math.PI * 2);
    ctx.fill();
    for (const [dx, dy] of [[-0.85, -0.45], [-0.3, -0.95], [0.3, -0.95], [0.85, -0.45]]) {
      ctx.beginPath();
      ctx.arc(x + dx * r, y + dy * r, r * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ───────────────────────── where cats live ─────────────────────────

  private target(id: number): { x: number; y: number; scale: number } {
    const g = this.game;
    const s = g.shooters[id];
    const beltScale = this.beltR / this.qR;
    if (s.place === 'belt') return { ...this.beltXY(s.s), scale: beltScale };
    if (s.place === 'pending') {
      const k = g.pending.indexOf(id);
      const e = this.beltXY(0);
      return { x: e.x + this.beltR * 0.3 + k * this.beltR * 0.7, y: e.y + this.trackW * 0.9 + k * 3, scale: beltScale * 0.92 };
    }
    if (s.place === 'slot') return { x: this.slotX(s.slot), y: this.slotY + this.slotS * 0.53, scale: (this.slotS * 0.37) / this.qR };
    if (s.place === 'queue') {
      for (let c = 0; c < g.columns.length; c++) {
        const d = g.columns[c].indexOf(id);
        if (d >= 0) return { x: this.colX(c), y: this.queueY + (d === 0 ? 0 : this.rowH * 0.25 + d * this.rowH * 0.78), scale: d === 0 ? 1 : Math.max(0.7, 0.86 - d * 0.04) };
      }
    }
    const v = this.vis[id];
    return { x: v.x, y: v.y, scale: 0 };
  }

  private startHop(id: number, h: number, dur: number) {
    const v = this.vis[id];
    v.hop = { fx: v.x, fy: v.y, t: 0, dur, h };
  }

  // ───────────────────────── input ─────────────────────────

  private onPointer = (ev: PointerEvent) => {
    if (this.paused || this.winT >= 0 || this.loseT >= 0) return;
    sfx.unlock();
    const r = this.canvas.getBoundingClientRect();
    const x = ev.clientX - r.left, y = ev.clientY - r.top;
    const g = this.game;
    this.idle = 0;
    if (this.bombMode) {
      const cx = Math.floor((x - this.ox) / this.cell), cy = Math.floor((y - this.oy) / this.cell);
      if (cx >= -1 && cy >= -1 && cx <= g.w && cy <= g.h) {
        const i = Math.max(0, Math.min(g.h - 1, cy)) * g.w + Math.max(0, Math.min(g.w - 1, cx));
        g.blast(i);
        this.bombMode = false;
        this.canvas.dispatchEvent(new CustomEvent('bombused'));
      }
      return;
    }
    let best = -1, bd = Infinity;
    const consider = (id: number, rad: number) => {
      const v = this.vis[id];
      const d = Math.hypot(v.x - x, v.y - y);
      if (d < rad && d < bd) { bd = d; best = id; }
    };
    for (const id of g.slots) if (id >= 0) consider(id, this.slotS * 0.62);
    for (const c of g.columns) if (c.length) consider(c[0], this.qR * 1.6);
    if (best < 0) return;
    if (g.tap(best)) {
      haptic('light');
      this.hintClock = 0;
      this.hintId = -1;
    } else haptic('warn');
  };

  // ───────────────────────── loop ─────────────────────────

  private frame = (now: number) => {
    this.raf = requestAnimationFrame(this.frame);
    const raw = (now - this.last) / 1000;
    const dt = Math.min(0.05, raw);
    this.last = now;
    // Adaptive quality: fewer particles if the device struggles.
    this.frameMs = this.frameMs * 0.95 + raw * 1000 * 0.05;
    this.fx.quality = this.frameMs > 26 ? 0.5 : 1;
    if (!this.paused) {
      this.t += dt;
      if (this.winT < 0 && this.loseT < 0) {
        this.acc += dt;
        while (this.acc >= STEP) {
          this.acc -= STEP;
          this.game.step(STEP);
          this.drainEvents();
        }
      }
      this.drainEvents();
      this.animate(dt);
    }
    this.draw();
  };

  private drainEvents() {
    const g = this.game;
    if (!g.events.length) return;
    for (const e of g.events) {
      switch (e.type) {
        case 'shot': {
          const v = this.vis[e.shooter];
          const cx = e.cell % g.w, cy = Math.floor(e.cell / g.w);
          const toX = this.ox + (cx + 0.5) * this.cell, toY = this.oy + (cy + 0.5) * this.cell;
          const dist = Math.hypot(toX - v.x, toY - v.y);
          this.shots.push({ x0: v.x, y0: v.y - this.beltR * 0.2, x1: toX, y1: toY, t: 0, dur: Math.min(0.2, 0.06 + dist / 2400), color: e.color, cell: e.cell, trail: [] });
          v.sq = 0.78;
          v.shootT = 0.14;
          const d = Math.max(1, dist);
          v.lookX = (toX - v.x) / d;
          v.lookY = (toY - v.y) / d;
          this.comboN = this.comboT > 0 ? this.comboN + 1 : 1;
          this.comboT = 0.45;
          sfx.shot(this.comboN);
          break;
        }
        case 'empty': {
          const v = this.vis[e.shooter];
          this.ghosts.push({ x: v.x, y: v.y, color: e.color, t: 0, r: this.beltR });
          this.fx.stars(v.x, v.y, 8, 150);
          this.fx.ring(v.x, v.y, '#fff', this.beltR * 2);
          if (this.praiseT <= 0 && Math.random() < 0.6) {
            this.praiseT = 1.1;
            const x = Math.max(60, Math.min(this.cw - 60, v.x));
            this.fx.text(x, v.y - this.beltR * 2, PRAISE[Math.floor(Math.random() * PRAISE.length)], '#ffd84a', 20);
          }
          sfx.empty();
          break;
        }
        case 'launch': {
          const id = e.shooter;
          this.startHop(id, 60 + Math.random() * 20, 0.34);
          this.vis[id].sq = 1.25;
          this.revealIfHidden(id);
          sfx.launch();
          break;
        }
        case 'park': {
          this.startHop(e.shooter, 50, 0.38);
          sfx.park();
          break;
        }
        case 'reject': this.vis[e.shooter].shake = 0.4; sfx.reject(); break;
        case 'blast':
          for (const c of e.cells) {
            this.shownHp[c] = 0;
            this.dirtyCells.push(c);
            const x = this.ox + ((c % g.w) + 0.5) * this.cell, y = this.oy + (Math.floor(c / g.w) + 0.5) * this.cell;
            this.fx.shatter(x, y, PALETTE[g.cells[c]].hex, this.cell);
          }
          {
            const c0 = e.cells[Math.floor(e.cells.length / 2)];
            const x = this.ox + ((c0 % g.w) + 0.5) * this.cell, y = this.oy + (Math.floor(c0 / g.w) + 0.5) * this.cell;
            this.fx.ring(x, y, '#ffb347', this.cell * 4, 0.5);
            this.fx.spawn('glow', x, y, { max: 0.4, size: this.cell * 3, color: '#ff9a3c' });
          }
          this.shake(0.4, 7);
          sfx.blast();
          haptic('heavy');
          break;
        case 'won':
          this.winT = 0;
          for (const s of this.shots) this.landShot(s);
          this.shots.length = 0;
          break;
        case 'lost': {
          this.loseT = 0;
          if (e.shooter >= 0) {
            const v = this.vis[e.shooter];
            this.ghosts.push({ x: v.x, y: v.y, color: g.shooters[e.shooter].color, t: -1, r: this.beltR });
          }
          this.shake(0.5, 6);
          haptic('error');
          sfx.lose();
          break;
        }
      }
    }
    g.events.length = 0;
    this.cb.onProgress(g.progress());
    this.cb.onBelt(g.belt.length + g.pending.length, g.capacity, g.movesLeft);
  }

  private revealIfHidden(id: number) {
    const s = this.game.shooters[id];
    if (this.vis[id].revealT === 0 && s.hidden) this.vis[id].revealT = 0.001;
  }

  private shake(t: number, amp: number) {
    this.shakeT = Math.max(this.shakeT, t);
    this.shakeAmp = Math.max(this.shakeAmp, amp);
  }

  private landShot(s: Shot) {
    const g = this.game;
    this.shownHp[s.cell] = Math.max(0, this.shownHp[s.cell] - 1);
    this.dirtyCells.push(s.cell);
    const hex = PALETTE[s.color].hex;
    if (this.shownHp[s.cell] === 0) {
      this.dying.push({ cell: s.cell, t: 0 });
      this.fx.shatter(s.x1, s.y1, hex, this.cell);
      sfx.pop();
    } else {
      // ice cracked
      this.fx.shatter(s.x1, s.y1, '#dff4ff', this.cell * 0.8);
      sfx.ice();
    }
    void g;
  }

  /** Continue after a revive. */
  resume() {
    this.loseT = -1;
    this.paused = false;
    this.last = performance.now();
  }

  private animate(dt: number) {
    const g = this.game;
    const k = 1 - Math.exp(-dt * 14);
    // queue advance & per-cat animation
    for (const s of g.shooters) {
      const v = this.vis[s.id];
      if (s.place === 'gone') continue;
      const p = this.target(s.id);
      if (v.hop) {
        v.hop.t += dt / v.hop.dur;
        const t = clamp01(v.hop.t);
        const e = ease.inOutCubic(t);
        v.x = v.hop.fx + (p.x - v.hop.fx) * e;
        v.y = v.hop.fy + (p.y - v.hop.fy) * e - Math.sin(t * Math.PI) * v.hop.h;
        v.scale += (p.scale * (1 + Math.sin(t * Math.PI) * 0.25) - v.scale) * Math.min(1, dt * 18);
        if (v.hop.t >= 1) { v.hop = null; v.sq = 0.72; }
      } else {
        const kk = s.place === 'belt' ? 1 : k;
        v.x += (p.x - v.x) * kk;
        v.y += (p.y - v.y) * kk;
        v.scale += (p.scale - v.scale) * k;
      }
      [v.sq, v.sqv] = spring(v.sq, v.sqv, 1, dt, 420, 16);
      if (v.shake > 0) v.shake -= dt;
      if (v.shootT > 0) v.shootT -= dt;
      else if (s.place === 'belt') {
        // look at the picture's centre while riding
        const cx = this.ox + g.w * this.cell / 2, cy = this.oy + g.h * this.cell / 2;
        const d = Math.hypot(cx - v.x, cy - v.y) || 1;
        v.lookX += ((cx - v.x) / d - v.lookX) * k;
        v.lookY += ((cy - v.y) / d - v.lookY) * k;
      } else {
        v.lookX *= 1 - k;
        v.lookY += (0.3 - v.lookY) * k;
      }
      v.blink -= dt;
      if (v.blink < -0.12) v.blink = 2 + Math.random() * 4;
      if (v.revealT > 0 && v.revealT < 1) v.revealT = Math.min(1, v.revealT + dt * 3);
    }
    // front hidden cats get revealed
    for (const col of g.columns) if (col.length) this.revealIfHidden(col[0]);
    // projectiles
    for (let i = this.shots.length - 1; i >= 0; i--) {
      const s = this.shots[i];
      s.t += dt;
      const f = clamp01(s.t / s.dur);
      s.trail.push(s.x0 + (s.x1 - s.x0) * f, s.y0 + (s.y1 - s.y0) * f);
      if (s.trail.length > 12) s.trail.splice(0, 2);
      if (s.t >= s.dur) {
        this.landShot(s);
        this.shots.splice(i, 1);
      }
    }
    for (let i = this.dying.length - 1; i >= 0; i--) {
      this.dying[i].t += dt;
      if (this.dying[i].t > 0.16) this.dying.splice(i, 1);
    }
    for (let i = this.ghosts.length - 1; i >= 0; i--) {
      const gh = this.ghosts[i];
      gh.t += dt;
      if (gh.t > 0.45) this.ghosts.splice(i, 1);
    }
    this.fx.update(dt);
    if (this.comboT > 0) this.comboT -= dt;
    if (this.praiseT > 0) this.praiseT -= dt;
    if (this.shakeT > 0) this.shakeT -= dt; else this.shakeAmp = 0;
    if (this.flashT > 0) this.flashT -= dt;
    // new slot (booster / revive): pop it in
    if (g.slots.length !== this.lastSlots) {
      this.lastSlots = g.slots.length;
      this.layout();
      this.slotPop[g.slots.length - 1] = 0.001;
      this.fx.stars(this.slotX(g.slots.length - 1), this.slotY + this.slotS / 2, 10, 120);
    }
    for (let i = 0; i < this.slotPop.length; i++) if (this.slotPop[i] > 0 && this.slotPop[i] < 1) this.slotPop[i] = Math.min(1, this.slotPop[i] + dt * 3);
    // danger
    const free = g.slots.filter((s) => s < 0).length;
    const danger = g.status === 'playing' && this.winT < 0 ? (free === 0 ? 2 : free === 1 ? 1 : 0) : 0;
    this.dangerT += ((danger ? 1 : 0) - this.dangerT) * Math.min(1, dt * 4);
    if (danger) {
      this.heartbeat -= dt;
      if (this.heartbeat <= 0) { sfx.heartbeat(); this.heartbeat = danger === 2 ? 0.55 : 0.85; }
    }
    this.cb.onDanger(danger);
    // hints: tutorial always, early levels after a pause
    this.idle += dt;
    if ((this.hints && (this.tutorial || this.idle > 5)) && this.winT < 0 && this.loseT < 0) {
      this.hintClock -= dt;
      if (this.hintClock <= 0) { this.hintId = botPick(g); this.hintClock = 0.5; }
    } else this.hintId = -1;
    // end sequences
    if (this.winT >= 0) {
      const before = this.winT;
      this.winT += dt;
      if (before < 0.25 && this.winT >= 0.25) {
        this.fx.confetti(this.bx + 10, this.by + this.B, 60, 1, CONFETTI);
        this.fx.confetti(this.bx + this.B - 10, this.by + this.B, 60, -1, CONFETTI);
        sfx.win();
        haptic('success');
      }
      if (before < 1.9 && this.winT >= 1.9) this.cb.onWin(g);
    }
    if (this.loseT >= 0) {
      const before = this.loseT;
      this.loseT += dt;
      if (before < 1.0 && this.loseT >= 1.0) this.cb.onLose(g);
    }
  }

  // ───────────────────────── drawing ─────────────────────────

  private draw() {
    const ctx = this.ctx;
    const g = this.game;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.cw, this.ch);
    ctx.save();
    if (this.shakeT > 0) {
      const a = this.shakeAmp * Math.min(1, this.shakeT * 3);
      ctx.translate((Math.random() - 0.5) * a, (Math.random() - 0.5) * a);
    }
    const c = this.cell;
    // board + blocks in one blit; the moving treads go on top
    this.updateBlockLayer();
    ctx.drawImage(this.blockLayer, 0, 0, this.cw, this.ch);
    this.drawTreads(ctx);
    // win: the finished picture assembles itself in a wave from the centre
    const winK = this.winT >= 0 ? clamp01((this.winT - 0.15) / 1.1) : 0;
    if (winK > 0) {
      for (let y = 0; y < g.h; y++) for (let x = 0; x < g.w; x++) {
        const col = g.level.cells[y * g.w + x];
        if (col < 0) continue;
        const cx = x - g.w / 2, cy = y - g.h / 2;
        const delay = Math.hypot(cx, cy) / (Math.max(g.w, g.h) * 0.7) * 0.6;
        const t = clamp01((winK - delay) / 0.4);
        if (t <= 0) continue;
        const sz = c * ease.outBack(t);
        ctx.drawImage(blockSprite(col, c), this.ox + x * c + (c - sz) / 2, this.oy + y * c + (c - sz) / 2, sz, sz);
      }
    }
    // blocks popping out
    for (const d of this.dying) {
      const k = d.t / 0.16;
      const s = c * (1 + 0.25 * Math.sin(k * Math.PI)) * (1 - k * 0.9);
      const x = this.ox + (d.cell % g.w + 0.5) * c, y = this.oy + (Math.floor(d.cell / g.w) + 0.5) * c;
      ctx.drawImage(blockSprite(g.cells[d.cell], c), x - s / 2, y - s / 2, s, s);
      ctx.globalAlpha = 1 - k;
      ctx.fillStyle = '#fff';
      rr(ctx, x - s / 2, y - s / 2, s, s, s * 0.24);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    // shine sweep over the finished picture
    if (this.winT > 1.2 && this.winT < 1.9) {
      const k = (this.winT - 1.2) / 0.7;
      ctx.save();
      ctx.beginPath();
      ctx.rect(this.ox, this.oy, g.w * c, g.h * c);
      ctx.clip();
      const sx = this.ox - g.w * c * 0.5 + k * g.w * c * 2;
      const gr = ctx.createLinearGradient(sx - 40, this.oy, sx + 40, this.oy + g.h * c);
      gr.addColorStop(0, 'rgba(255,255,255,0)');
      gr.addColorStop(0.5, 'rgba(255,255,255,0.6)');
      gr.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gr;
      ctx.fillRect(this.ox, this.oy, g.w * c, g.h * c);
      ctx.restore();
    }
    // projectiles: glowing orbs with trails
    ctx.globalCompositeOperation = 'lighter';
    for (const s of this.shots) {
      const hex = PALETTE[s.color].hex;
      const tr = s.trail;
      for (let i = 0; i < tr.length; i += 2) {
        const a = (i + 2) / tr.length;
        ctx.globalAlpha = a * 0.5;
        ctx.fillStyle = hex;
        ctx.beginPath();
        ctx.arc(tr[i], tr[i + 1], Math.max(1.5, c * 0.22 * a), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    ctx.globalCompositeOperation = 'source-over';
    for (const s of this.shots) {
      const f = clamp01(s.t / s.dur);
      const x = s.x0 + (s.x1 - s.x0) * f, y = s.y0 + (s.y1 - s.y0) * f;
      const r = Math.max(3.2, c * 0.3);
      ctx.fillStyle = PALETTE[s.color].hex;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    this.drawSlots(ctx);
    this.drawCats(ctx);
    this.fx.draw(ctx);
    this.drawOverlays(ctx);
    ctx.restore();
  }

  /** Repaint the whole block layer after a layout change, otherwise only the cells that changed. */
  private updateBlockLayer() {
    const g = this.game;
    const c = this.cell;
    const ctx = this.blockLayer.getContext('2d')!;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const paint = (i: number) => {
      const col = g.level.cells[i];
      if (col < 0) return;
      const x = i % g.w, y = Math.floor(i / g.w);
      const px = this.ox + x * c, py = this.oy + y * c;
      const hp = this.shownHp[i];
      if (hp > 0) {
        ctx.drawImage(blockSprite(g.cells[i], c), px, py, c, c);
        if (g.level.hp[i] === 2) ctx.drawImage(iceSprite(c, hp === 2 ? 2 : 1), px, py, c, c);
      } else {
        // a faint trace of the picture where blocks are gone, so the shape stays readable
        ctx.globalAlpha = 0.13;
        ctx.fillStyle = PALETTE[col].hex;
        ctx.fillRect(px + c * 0.18, py + c * 0.18, c * 0.64, c * 0.64);
        ctx.globalAlpha = 1;
      }
    };
    if (this.blocksDirty) {
      this.blocksDirty = false;
      this.dirtyCells.length = 0;
      ctx.clearRect(0, 0, this.cw, this.ch);
      ctx.drawImage(this.staticLayer, 0, 0, this.cw, this.ch);
      for (let i = 0; i < g.cells.length; i++) paint(i);
      return;
    }
    const d = this.dpr;
    for (const i of this.dirtyCells) {
      // restore the board under the cell from the static layer, then repaint it
      const x0 = Math.floor((this.ox + (i % g.w) * c) * d) - 1, y0 = Math.floor((this.oy + Math.floor(i / g.w) * c) * d) - 1;
      const sz = Math.ceil(c * d) + 2;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(x0, y0, sz, sz);
      ctx.drawImage(this.staticLayer, x0, y0, sz, sz, x0, y0, sz, sz);
      ctx.setTransform(d, 0, 0, d, 0, 0);
      paint(i);
    }
    this.dirtyCells.length = 0;
  }

  private drawTreads(ctx: CanvasRenderingContext2D) {
    const g = this.game;
    const c = this.cell;
    const m = BELT_MARGIN * c;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = this.trackW * 0.55;
    ctx.setLineDash([3, 9]);
    ctx.lineDashOffset = -this.t * g.speed * c;
    ctx.lineJoin = 'round';
    rr(ctx, this.ox - m, this.oy - m, g.w * c + 2 * m, g.h * c + 2 * m, Math.min(c * 1.1, this.trackW));
    ctx.stroke();
    ctx.restore();
  }

  private drawSlots(ctx: CanvasRenderingContext2D) {
    const g = this.game;
    // danger glow on the free wells
    if (this.dangerT > 0.02) {
      const pulse = 0.5 + 0.5 * Math.sin(this.t * 9);
      for (let i = 0; i < g.slots.length; i++) {
        const x = this.slotX(i) - this.slotS / 2;
        ctx.strokeStyle = `rgba(255,70,90,${(0.35 + 0.5 * pulse) * this.dangerT})`;
        ctx.lineWidth = 3;
        rr(ctx, x - 1.5, this.slotY - 1.5, this.slotS + 3, this.slotS + 3, this.slotS * 0.32);
        ctx.stroke();
      }
    }
    // newly added slots pop in
    for (let i = 0; i < this.slotPop.length; i++) {
      const p = this.slotPop[i];
      if (!(p > 0 && p < 1)) continue;
      const x = this.slotX(i);
      ctx.globalAlpha = 1 - p;
      ctx.strokeStyle = '#ffd84a';
      ctx.lineWidth = 4;
      const s = this.slotS * (1 + p * 0.5);
      rr(ctx, x - s / 2, this.slotY + this.slotS / 2 - s / 2, s, s, s * 0.3);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  private drawCats(ctx: CanvasRenderingContext2D) {
    const g = this.game;
    const fronts = new Set<number>();
    for (const col of g.columns) if (col.length) fronts.add(col[0]);
    const lost = this.loseT >= 0;
    const won = this.winT >= 0;
    // queue (back to front), lanes' "+N" counters
    // Full-size cats for as many rows as fit; the rest of each lane is shown as a strip of
    // little cats (colour + ammo) so the whole queue can be planned around.
    const room = this.ch - this.queueY - this.qR * 0.8;
    const rows = Math.max(2, Math.min(4, Math.floor((room - 34) / (this.rowH * 0.78)) + 1));
    for (let ci = 0; ci < g.columns.length; ci++) {
      const col = g.columns[ci];
      const shown = Math.min(col.length, rows);
      for (let d = shown - 1; d >= 0; d--) this.drawOne(ctx, col[d], d, fronts, lost, won);
      if (col.length > rows) this.drawQueueStrip(ctx, ci, col.slice(rows), rows);
    }
    // links between paired cats in the queue
    for (const s of g.shooters) {
      if (s.link > s.id && s.place === 'queue' && g.shooters[s.link].place === 'queue') {
        const a = this.vis[s.id], b = this.vis[s.link];
        this.drawChain(ctx, a.x, a.y, b.x, b.y);
      }
    }
    for (const id of g.slots) if (id >= 0) this.drawOne(ctx, id, 0, fronts, lost, won);
    for (const id of g.pending) this.drawOne(ctx, id, 0, fronts, lost, won);
    for (const id of g.belt) this.drawOne(ctx, id, 0, fronts, lost, won);
    // cats that just emptied: a happy jump and poof
    for (const gh of this.ghosts) {
      if (gh.t < 0) continue;
      const k = gh.t / 0.45;
      drawCat(ctx, gh.x, gh.y - Math.sin(Math.min(1, k * 1.4) * Math.PI) * 22, gh.r * (1 + k * 0.3), gh.color, {
        expr: 'happy', alpha: 1 - ease.inCubic(k), squash: 1 + Math.sin(k * Math.PI * 2) * 0.1, shadow: false,
      });
    }
    // hint finger
    if (this.hintId >= 0 && g.shooters[this.hintId].place !== 'gone') {
      const v = this.vis[this.hintId];
      this.drawHand(ctx, v.x + this.qR * 0.5, v.y + this.qR * 0.7, this.qR * 1.1);
    }
  }

  private drawOne(ctx: CanvasRenderingContext2D, id: number, depth: number, fronts: Set<number>, lost: boolean, won: boolean) {
    const g = this.game;
    const s = g.shooters[id];
    const v = this.vis[id];
    const inQueue = s.place === 'queue';
    const hidden = s.hidden && inQueue && !fronts.has(id) && v.revealT === 0;
    let expr: Expr = v.blink < 0 ? 'blink' : v.shootT > 0 ? 'shoot' : 'normal';
    if (won) expr = 'happy';
    if (lost) expr = 'sad';
    if (s.place === 'slot' && this.dangerT > 0.5 && !won) expr = 'sad';
    const shake = v.shake > 0 ? Math.sin(v.shake * 70) * 5 * (v.shake / 0.4) : 0;
    const bob = won ? -Math.abs(Math.sin(this.t * 9 + id)) * 10
      : s.place === 'belt' ? Math.sin(this.t * 16 + id) * 1.2
      : inQueue && depth === 0 ? Math.sin(this.t * 2.6 + id) * 1.6 : 0;
    // hidden → revealed: a quick flip
    const flip = v.revealT > 0 && v.revealT < 1 ? Math.abs(Math.cos(v.revealT * Math.PI)) : 1;
    const r = this.qR * v.scale;
    ctx.save();
    if (flip !== 1) {
      ctx.translate(v.x, 0);
      ctx.scale(Math.max(0.05, flip), 1);
      ctx.translate(-v.x, 0);
    }
    // front cats glow softly to show they can be tapped
    if (inQueue && depth === 0 && !won && !lost && g.canLaunch(id)) {
      ctx.globalAlpha = 0.35 + 0.15 * Math.sin(this.t * 4 + id);
      ctx.fillStyle = '#fff6c8';
      ctx.beginPath();
      ctx.ellipse(v.x, v.y + r * 0.2, r * 1.35, r * 1.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    drawCat(ctx, v.x + shake, v.y + bob, r, s.color, {
      hidden: hidden || (s.hidden && v.revealT > 0 && v.revealT < 0.5),
      expr,
      lookX: v.lookX, lookY: v.lookY,
      squash: v.sq,
      alpha: inQueue && depth > 0 ? Math.max(0.55, 0.9 - depth * 0.12) : 1,
      ammo: s.ammo,
    });
    ctx.restore();
    if (v.revealT > 0.45 && v.revealT < 0.55) this.fx.stars(v.x, v.y, 3, 70);
  }

  /** The part of a lane beyond the full-size rows, as tiny cats in reading order. */
  private drawQueueStrip(ctx: CanvasRenderingContext2D, lane: number, ids: number[], rows: number) {
    const g = this.game;
    const laneW = this.colW * 0.84;
    const cell = Math.max(15, Math.min(22, laneW / 5.2));
    const perRow = Math.max(3, Math.floor(laneW / cell));
    const x0 = this.colX(lane) - (Math.min(ids.length, perRow) * cell) / 2 + cell / 2;
    const y0 = this.queueY + this.rowH * 0.25 + (rows - 1) * this.rowH * 0.78 + this.qR * 1.35 + cell * 0.45;
    const maxRows = Math.max(1, Math.floor((this.ch - y0 - 2) / cell) + 1);
    const cap = perRow * maxRows;
    ids.slice(0, cap).forEach((id, k) => {
      const col = k % perRow, row = Math.floor(k / perRow);
      const inRow = Math.min(perRow, ids.length - row * perRow);
      const rx = this.colX(lane) - (inRow * cell) / 2 + cell / 2 + col * cell;
      const ry = y0 + row * cell;
      const sh = g.shooters[id];
      drawCat(ctx, rx, ry, cell * 0.44, sh.color, { hidden: sh.hidden, shadow: false, alpha: 0.95 });
      // ammo as small outlined digits (the full badge would be wider than the cat)
      ctx.font = `900 ${Math.round(cell * 0.46)}px Vazirmatn`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(30,12,50,0.9)';
      const label = sh.hidden ? '؟' : String(sh.ammo).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d]);
      ctx.strokeText(label, rx, ry + cell * 0.2);
      ctx.fillStyle = '#fff';
      ctx.fillText(label, rx, ry + cell * 0.2);
    });
    if (ids.length > cap) {
      ctx.font = `800 ${Math.round(this.qR * 0.5)}px Vazirmatn`;
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillText(`+${String(ids.length - cap).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d])}`, this.colX(lane), this.ch - 4);
    }
    void x0;
  }

  private drawChain(ctx: CanvasRenderingContext2D, ax: number, ay: number, bx: number, by: number) {
    const n = Math.max(3, Math.round(Math.hypot(bx - ax, by - ay) / 10));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const x = ax + (bx - ax) * t, y = ay + (by - ay) * t + Math.sin(t * Math.PI) * 6;
      ctx.strokeStyle = i % 2 ? '#c9952f' : '#f2cf6b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(x, y, 5, 3, i % 2 ? 0 : Math.PI / 2, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  private drawHand(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
    const k = (this.t * 1.6) % 1;
    const press = k < 0.3 ? Math.sin((k / 0.3) * Math.PI) : 0;
    if (k < 0.3 && press > 0.95) this.fx.ring(x - s * 0.45, y - s * 0.65, '#ffffff', s);
    ctx.save();
    ctx.translate(x + press * -3, y + press * -5);
    ctx.rotate(-0.45);
    ctx.scale(s / 40, s / 40);
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#3b1d5c';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(-6, -38);
    ctx.quadraticCurveTo(0, -44, 6, -38);
    ctx.lineTo(6, -12);
    ctx.quadraticCurveTo(12, -16, 16, -10);
    ctx.quadraticCurveTo(22, -12, 24, -5);
    ctx.quadraticCurveTo(30, -6, 30, 2);
    ctx.lineTo(28, 22);
    ctx.quadraticCurveTo(24, 34, 10, 34);
    ctx.lineTo(-6, 34);
    ctx.quadraticCurveTo(-16, 32, -20, 20);
    ctx.lineTo(-26, 0);
    ctx.quadraticCurveTo(-26, -8, -18, -6);
    ctx.lineTo(-6, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  private drawOverlays(ctx: CanvasRenderingContext2D) {
    const g = this.game;
    if (this.dangerT > 0.02) {
      const pulse = 0.6 + 0.4 * Math.sin(this.t * 9);
      const vg = ctx.createRadialGradient(this.cw / 2, this.ch / 2, Math.min(this.cw, this.ch) * 0.35, this.cw / 2, this.ch / 2, Math.max(this.cw, this.ch) * 0.75);
      vg.addColorStop(0, 'rgba(255,40,70,0)');
      vg.addColorStop(1, `rgba(255,40,70,${0.32 * pulse * this.dangerT})`);
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, this.cw, this.ch);
    }
    if (this.loseT >= 0) {
      ctx.globalAlpha = Math.min(0.85, this.loseT * 1.2);
      ctx.globalCompositeOperation = 'saturation';
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, this.cw, this.slotY - 4);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      // the cat with nowhere to go bounces off the full slots
      for (const gh of this.ghosts) if (gh.t < 0) {
        const k = Math.min(1, this.loseT / 0.6);
        const y = this.slotY - this.slotS * 0.4 - Math.abs(Math.sin(k * Math.PI * 2.5)) * 30 * (1 - k);
        drawCat(ctx, this.cw / 2, y, this.beltR * 1.2, gh.color, { expr: 'sad' });
        ctx.font = `900 ${Math.round(this.beltR * 1.4)}px Vazirmatn`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ff4d6d';
        ctx.fillText('!', this.cw / 2 + this.beltR * 1.6, y - this.beltR);
      }
    }
    if (this.bombMode) {
      ctx.fillStyle = 'rgba(30,12,60,0.35)';
      ctx.fillRect(0, 0, this.cw, this.slotY - 4);
      const c = this.cell;
      ctx.font = '900 19px Vazirmatn';
      ctx.textAlign = 'center';
      ctx.lineWidth = 5;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#3b1d5c';
      const y = this.oy + g.h * c * 0.5 + Math.sin(this.t * 4) * 4;
      ctx.strokeText('یک جای تصویر رو بزن تا بترکه!', this.cw / 2, y);
      ctx.fillStyle = '#ffd84a';
      ctx.fillText('یک جای تصویر رو بزن تا بترکه!', this.cw / 2, y);
    }
  }

  /** Coordinates of a shooter / the board for the tutorial overlay. */
  frontCatPoint(): { x: number; y: number } | null {
    const id = botPick(this.game);
    if (id < 0) return null;
    return { x: this.vis[id].x, y: this.vis[id].y };
  }
}

export { shade };
