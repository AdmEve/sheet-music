import { sfx } from './audio';
import { drawBlock, drawCat, rr } from './art';
import { fa } from './fa';
import { botPick } from './game/bot';
import { BELT_MARGIN, Game, beltPoint, type LevelDef } from './game/engine';
import { PALETTE } from './game/palette';
import { haptic } from './haptics';

interface Vis { x: number; y: number; scale: number; shake: number; seen: boolean }
interface Projectile { x0: number; y0: number; x1: number; y1: number; t: number; dur: number; color: number; cell: number }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string; size: number }
interface Floater { x: number; y: number; text: string; life: number }
interface Ghost { x: number; y: number; color: number; life: number }

export interface PlayCallbacks {
  onWin(game: Game): void;
  onLose(game: Game): void;
  onProgress(p: number): void;
  onBelt(count: number, capacity: number): void;
}

const STEP = 1 / 60;

export class PlayView {
  readonly game: Game;
  readonly canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cb: PlayCallbacks;
  private raf = 0;
  private last = 0;
  private acc = 0;
  private t = 0;
  private vis: Vis[];
  private shownHp: number[];
  private projectiles: Projectile[] = [];
  private particles: Particle[] = [];
  private floaters: Floater[] = [];
  private ghosts: Ghost[] = [];
  private shakeT = 0;
  private ended = false;
  private hintId = -1;
  private hintClock = 0;
  bombMode = false;
  hints: boolean;
  paused = false;
  // layout
  private cw = 0;
  private ch = 0;
  private cell = 0;
  private ox = 0;
  private oy = 0;
  private slotS = 0;
  private slotY = 0;
  private queueY = 0;
  private colW = 0;
  private rowH = 0;
  private qR = 0;
  private beltR = 0;

  constructor(host: HTMLElement, level: LevelDef, cb: PlayCallbacks, hints: boolean) {
    this.game = new Game(level);
    this.cb = cb;
    this.hints = hints;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'play-canvas';
    host.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;
    this.shownHp = this.game.hp.slice();
    this.vis = this.game.shooters.map(() => ({ x: 0, y: 0, scale: 1, shake: 0, seen: false }));
    this.layout();
    for (const s of this.game.shooters) {
      const p = this.target(s.id);
      Object.assign(this.vis[s.id], { x: p.x, y: p.y, scale: p.scale });
    }
    this.canvas.addEventListener('pointerdown', this.onPointer);
    window.addEventListener('resize', this.onResize);
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
    cb.onProgress(0);
    cb.onBelt(0, this.game.capacity);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.canvas.removeEventListener('pointerdown', this.onPointer);
    window.removeEventListener('resize', this.onResize);
    this.canvas.remove();
  }

  private onResize = () => this.layout();

  private layout() {
    const r = this.canvas.parentElement!.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    this.cw = r.width;
    this.ch = r.height;
    this.canvas.width = Math.round(r.width * dpr);
    this.canvas.height = Math.round(r.height * dpr);
    this.canvas.style.width = r.width + 'px';
    this.canvas.style.height = r.height + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const g = this.game;
    const slots = Math.max(5, g.slots.length);
    this.slotS = Math.max(40, Math.min(64, (this.cw - 28) / slots - 6));
    this.qR = this.slotS * 0.4;
    this.rowH = this.qR * 2.55;
    const queueH = this.rowH * 3 + 4;
    const slotsH = this.slotS + 22;
    const boardMax = this.ch - queueH - slotsH - 10;
    const B = Math.max(120, Math.min(this.cw - 10, boardMax));
    const units = g.w + 2 * (BELT_MARGIN + 0.8);
    this.cell = B / units;
    const pad = (BELT_MARGIN + 0.8) * this.cell;
    this.ox = (this.cw - B) / 2 + pad;
    this.oy = 6 + pad;
    this.beltR = Math.max(11, Math.min(22, this.cell * 0.85));
    this.slotY = 6 + B + 12;
    this.queueY = this.slotY + slotsH + this.qR * 1.1;
    this.colW = Math.min(this.cw / g.columns.length, 104);
  }

  private slotX(i: number): number {
    const n = this.game.slots.length;
    const gap = this.slotS + 6;
    return this.cw / 2 + (i - (n - 1) / 2) * gap;
  }

  private colX(i: number): number {
    const n = this.game.columns.length;
    return this.cw / 2 + (i - (n - 1) / 2) * this.colW;
  }

  private beltXY(s: number) {
    const p = beltPoint(this.game.w, this.game.h, s);
    return { x: this.ox + p.x * this.cell, y: this.oy + p.y * this.cell };
  }

  /** Where a shooter should be drawn right now. */
  private target(id: number): { x: number; y: number; scale: number } {
    const g = this.game;
    const s = g.shooters[id];
    if (s.place === 'belt') return { ...this.beltXY(s.s), scale: this.beltR / this.qR };
    if (s.place === 'pending') {
      const k = g.pending.indexOf(id);
      const e = this.beltXY(0);
      return { x: e.x - this.cell * 0.2 - k * 6, y: e.y + this.beltR * 0.6 + k * 8, scale: this.beltR / this.qR };
    }
    if (s.place === 'slot') return { x: this.slotX(s.slot), y: this.slotY + this.slotS / 2, scale: (this.slotS * 0.36) / this.qR };
    if (s.place === 'queue') {
      for (let c = 0; c < g.columns.length; c++) {
        const d = g.columns[c].indexOf(id);
        if (d >= 0) return { x: this.colX(c), y: this.queueY + d * this.rowH, scale: d === 0 ? 1 : 0.9 };
      }
    }
    return { x: this.vis[id].x, y: this.vis[id].y, scale: 0 };
  }

  private onPointer = (ev: PointerEvent) => {
    if (this.paused || this.ended) return;
    sfx.unlock();
    const r = this.canvas.getBoundingClientRect();
    const x = ev.clientX - r.left, y = ev.clientY - r.top;
    const g = this.game;
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
    // Tappable: shooters in slots and at the front of each column.
    let best = -1, bd = Infinity;
    const consider = (id: number, rad: number) => {
      const v = this.vis[id];
      const d = Math.hypot(v.x - x, v.y - y);
      if (d < rad && d < bd) { bd = d; best = id; }
    };
    for (const id of g.slots) if (id >= 0) consider(id, this.slotS * 0.6);
    for (const c of g.columns) if (c.length) consider(c[0], this.qR * 1.5);
    if (best < 0) return;
    if (g.tap(best)) {
      haptic('light');
      this.hintClock = 0;
    } else {
      haptic('warn');
    }
  };

  private frame = (now: number) => {
    this.raf = requestAnimationFrame(this.frame);
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    if (!this.paused) {
      this.t += dt;
      this.acc += dt;
      while (this.acc >= STEP) {
        this.acc -= STEP;
        this.game.step(STEP);
        this.drainEvents();
      }
      this.drainEvents();
      this.animate(dt);
    }
    this.draw();
  };

  private drainEvents() {
    const g = this.game;
    for (const e of g.events) {
      switch (e.type) {
        case 'shot': {
          const fromX = this.ox + e.x * this.cell, fromY = this.oy + e.y * this.cell;
          const cx = e.cell % g.w, cy = Math.floor(e.cell / g.w);
          const toX = this.ox + (cx + 0.5) * this.cell, toY = this.oy + (cy + 0.5) * this.cell;
          const dist = Math.hypot(toX - fromX, toY - fromY);
          this.projectiles.push({ x0: fromX, y0: fromY, x1: toX, y1: toY, t: 0, dur: Math.min(0.22, 0.05 + dist / 2600), color: e.color, cell: e.cell });
          this.vis[e.shooter].scale *= 1.08;
          sfx.shot(e.color % 7);
          break;
        }
        case 'empty': {
          const x = this.ox + e.x * this.cell, y = this.oy + e.y * this.cell;
          this.ghosts.push({ x, y, color: e.color, life: 0.35 });
          this.burst(x, y, PALETTE[e.color].hex, 10, 1.4);
          if (Math.random() < 0.5) this.floaters.push({ x, y: y - 16, text: ['عالی!', 'آفرین!', 'ایول!', 'دمت گرم!'][Math.floor(Math.random() * 4)], life: 0.9 });
          sfx.empty();
          break;
        }
        case 'launch': sfx.launch(); break;
        case 'park': sfx.park(); break;
        case 'reject': this.vis[e.shooter].shake = 0.35; sfx.reject(); break;
        case 'blast':
          for (const c of e.cells) {
            this.shownHp[c] = 0;
            const x = this.ox + ((c % g.w) + 0.5) * this.cell, y = this.oy + (Math.floor(c / g.w) + 0.5) * this.cell;
            this.burst(x, y, PALETTE[g.cells[c]].hex, 4, 2);
          }
          this.shakeT = 0.4;
          sfx.blast();
          haptic('heavy');
          break;
        case 'won':
          this.ended = true;
          setTimeout(() => this.finishWin(), 450);
          break;
        case 'lost':
          this.shakeT = 0.5;
          haptic('error');
          setTimeout(() => this.cb.onLose(g), 650);
          break;
      }
    }
    if (g.events.length) {
      this.cb.onProgress(g.progress());
      this.cb.onBelt(g.belt.length + g.pending.length, g.capacity);
    }
    g.events.length = 0;
  }

  private finishWin() {
    // Let the last projectiles land, then celebrate.
    for (const p of this.projectiles) this.shownHp[p.cell] = 0;
    this.projectiles.length = 0;
    const g = this.game;
    for (let i = 0; i < 40; i++) {
      const x = this.ox + Math.random() * g.w * this.cell, y = this.oy + Math.random() * g.h * this.cell;
      this.burst(x, y, PALETTE[Math.floor(Math.random() * 9)].hex, 1, 1.5);
    }
    sfx.win();
    haptic('success');
    setTimeout(() => this.cb.onWin(g), 700);
  }

  /** Continue after a revive. */
  resume() {
    this.ended = false;
    this.paused = false;
    this.last = performance.now();
  }

  private burst(x: number, y: number, color: string, n: number, power: number) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = (40 + Math.random() * 120) * power;
      const life = 0.4 + Math.random() * 0.4;
      this.particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, life, max: life, color, size: 2 + Math.random() * 3.5 });
    }
  }

  private animate(dt: number) {
    const g = this.game;
    const k = 1 - Math.exp(-dt * 16);
    for (const s of g.shooters) {
      const v = this.vis[s.id];
      if (s.place === 'gone') continue;
      const p = this.target(s.id);
      const kk = s.place === 'belt' ? 1 - Math.exp(-dt * 30) : k;
      v.x += (p.x - v.x) * kk;
      v.y += (p.y - v.y) * kk;
      v.scale += (p.scale - v.scale) * k;
      if (v.shake > 0) v.shake -= dt;
    }
    for (const p of this.projectiles) p.t += dt;
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      if (p.t >= p.dur) {
        this.shownHp[p.cell] = Math.max(0, this.shownHp[p.cell] - 1);
        const hex = PALETTE[p.color].hex;
        this.burst(p.x1, p.y1, hex, this.shownHp[p.cell] ? 3 : 5, 0.8);
        sfx.pop();
        this.projectiles.splice(i, 1);
      }
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      p.vy += 520 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
    for (let i = this.floaters.length - 1; i >= 0; i--) {
      const f = this.floaters[i];
      f.life -= dt;
      f.y -= 40 * dt;
      if (f.life <= 0) this.floaters.splice(i, 1);
    }
    for (let i = this.ghosts.length - 1; i >= 0; i--) {
      this.ghosts[i].life -= dt;
      if (this.ghosts[i].life <= 0) this.ghosts.splice(i, 1);
    }
    if (this.shakeT > 0) this.shakeT -= dt;
    if (this.hints && !this.ended) {
      this.hintClock -= dt;
      if (this.hintClock <= 0) {
        this.hintId = botPick(g);
        this.hintClock = 0.4;
      }
    } else this.hintId = -1;
  }

  private draw() {
    const ctx = this.ctx;
    const g = this.game;
    ctx.clearRect(0, 0, this.cw, this.ch);
    ctx.save();
    if (this.shakeT > 0) ctx.translate((Math.random() - 0.5) * 8 * this.shakeT, (Math.random() - 0.5) * 8 * this.shakeT);
    const c = this.cell;
    // board panel
    const bx = this.ox - (BELT_MARGIN + 0.75) * c, by = this.oy - (BELT_MARGIN + 0.75) * c;
    const bw = (g.w + 2 * (BELT_MARGIN + 0.75)) * c, bh = (g.h + 2 * (BELT_MARGIN + 0.75)) * c;
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    rr(ctx, bx, by, bw, bh, c * 1.2);
    ctx.fill();
    // conveyor
    const m = BELT_MARGIN * c;
    const tw = Math.max(16, this.beltR * 1.7);
    ctx.lineWidth = tw;
    ctx.strokeStyle = '#4b3d63';
    rr(ctx, this.ox - m, this.oy - m, g.w * c + 2 * m, g.h * c + 2 * m, c * 0.8);
    ctx.stroke();
    ctx.lineWidth = tw - 6;
    ctx.strokeStyle = '#66558a';
    ctx.stroke();
    ctx.setLineDash([4, 10]);
    ctx.lineDashOffset = -this.t * g.speed * c;
    ctx.lineWidth = tw - 12;
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.stroke();
    ctx.setLineDash([]);
    // grid backdrop
    ctx.fillStyle = 'rgba(90,70,120,0.08)';
    rr(ctx, this.ox - 2, this.oy - 2, g.w * c + 4, g.h * c + 4, 6);
    ctx.fill();
    // blocks
    for (let y = 0; y < g.h; y++) for (let x = 0; x < g.w; x++) {
      const i = y * g.w + x;
      const hp = this.shownHp[i];
      if (hp <= 0) {
        if (g.level.cells[i] >= 0) {
          ctx.fillStyle = 'rgba(90,70,120,0.07)';
          ctx.fillRect(this.ox + x * c + c * 0.42, this.oy + y * c + c * 0.42, c * 0.16, c * 0.16);
        }
        continue;
      }
      const ice = g.level.hp[i] === 2 ? (hp === 2 ? 2 : 1) : 0;
      drawBlock(ctx, this.ox + x * c, this.oy + y * c, c, g.cells[i], ice as 0 | 1 | 2);
    }
    // entry marker + capacity
    const e = this.beltXY(0);
    ctx.fillStyle = '#ffcf3f';
    ctx.beginPath();
    ctx.arc(e.x, e.y, tw * 0.32, 0, Math.PI * 2);
    ctx.fill();
    // projectiles
    for (const p of this.projectiles) {
      const f = Math.min(1, p.t / p.dur);
      const x = p.x0 + (p.x1 - p.x0) * f, y = p.y0 + (p.y1 - p.y0) * f;
      ctx.fillStyle = PALETTE[p.color].hex;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(3, c * 0.28), 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    // slots
    for (let i = 0; i < g.slots.length; i++) {
      const x = this.slotX(i) - this.slotS / 2, y = this.slotY;
      ctx.fillStyle = 'rgba(75,61,99,0.16)';
      rr(ctx, x, y, this.slotS, this.slotS, this.slotS * 0.28);
      ctx.fill();
      ctx.strokeStyle = 'rgba(75,61,99,0.25)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    const freeSlots = g.slots.filter((s) => s < 0).length;
    if (freeSlots <= 1 && g.status === 'playing') {
      ctx.fillStyle = `rgba(232,56,79,${0.25 + 0.2 * Math.sin(this.t * 8)})`;
      for (let i = 0; i < g.slots.length; i++) if (g.slots[i] < 0) {
        rr(ctx, this.slotX(i) - this.slotS / 2, this.slotY, this.slotS, this.slotS, this.slotS * 0.28);
        ctx.fill();
      }
    }
    // queue lanes
    for (let i = 0; i < g.columns.length; i++) {
      ctx.fillStyle = 'rgba(75,61,99,0.07)';
      rr(ctx, this.colX(i) - this.colW * 0.42, this.queueY - this.qR * 1.25, this.colW * 0.84, this.rowH * 3 + this.qR * 0.5, 18);
      ctx.fill();
    }
    // links between paired shooters
    ctx.strokeStyle = '#b38b3f';
    ctx.lineWidth = 5;
    ctx.setLineDash([6, 4]);
    for (const s of g.shooters) {
      if (s.link > s.id && s.place === 'queue' && g.shooters[s.link].place === 'queue') {
        const a = this.vis[s.id], b = this.vis[s.link];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
    ctx.setLineDash([]);
    // shooters: queue (back to front), slots, pending, belt
    const order: number[] = [];
    for (const col of g.columns) for (let d = Math.min(col.length, 4) - 1; d >= 0; d--) order.push(col[d]);
    for (const id of g.slots) if (id >= 0) order.push(id);
    order.push(...g.pending, ...g.belt);
    const fronts = new Set(g.columns.map((col) => col[0]));
    for (const id of order) {
      const s = g.shooters[id];
      const v = this.vis[id];
      const sx = v.shake > 0 ? Math.sin(v.shake * 60) * 5 : 0;
      const inQueue = s.place === 'queue';
      const depth = inQueue ? g.columns.find((col) => col.includes(id))!.indexOf(id) : 0;
      if (inQueue && depth >= 3) continue;
      const hidden = s.hidden && !fronts.has(id) && inQueue;
      const bob = s.place === 'belt' ? Math.sin(this.t * 14 + id) * 1.2 : inQueue && depth === 0 ? Math.sin(this.t * 3 + id) * 1.5 : 0;
      const ring = id === this.hintId ? `rgba(255,207,63,${0.6 + 0.4 * Math.sin(this.t * 7)})` : null;
      drawCat(ctx, v.x + sx, v.y + bob, this.qR * v.scale, s.color, s.ammo, {
        hidden, dim: inQueue && depth > 0, blink: (this.t + id * 0.7) % 4 < 0.12, ring,
        happy: g.status === 'won',
      });
      if (s.link >= 0 && inQueue) {
        ctx.fillStyle = '#b38b3f';
        ctx.font = `900 ${Math.round(this.qR * 0.5)}px Vazirmatn`;
        ctx.textAlign = 'center';
        ctx.fillText('🔗', v.x, v.y - this.qR * 1.2);
      }
    }
    // ghosts of emptied shooters
    for (const gh of this.ghosts) {
      const f = gh.life / 0.35;
      ctx.globalAlpha = f;
      drawCat(ctx, gh.x, gh.y - (1 - f) * 20, this.beltR * (1 + (1 - f) * 0.6), gh.color, 0, { happy: true });
      ctx.globalAlpha = 1;
    }
    // particles
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.max);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
    for (const f of this.floaters) {
      ctx.globalAlpha = Math.min(1, f.life * 2);
      ctx.font = '900 18px Vazirmatn';
      ctx.textAlign = 'center';
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#4b3d63';
      ctx.strokeText(f.text, f.x, f.y);
      ctx.fillStyle = '#ffcf3f';
      ctx.fillText(f.text, f.x, f.y);
    }
    ctx.globalAlpha = 1;
    if (this.bombMode) {
      ctx.fillStyle = 'rgba(40,20,60,0.35)';
      ctx.fillRect(0, 0, this.cw, this.slotY - 4);
      ctx.font = '800 18px Vazirmatn';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff';
      ctx.fillText('روی تصویر بزن تا بترکه! 💣', this.cw / 2, this.oy + g.h * c * 0.5);
    }
    ctx.restore();
  }

  /** Coordinates of the hinted shooter (for the tutorial finger). */
  hintPoint(): { x: number; y: number } | null {
    if (this.hintId < 0) return null;
    const v = this.vis[this.hintId];
    return { x: v.x, y: v.y };
  }

  beltCountText(): string {
    return `${fa(this.game.belt.length + this.game.pending.length)}/${fa(this.game.capacity)}`;
  }
}
