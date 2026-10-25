import { glowSprite, starPath } from './sprites';

/** Pooled particles: shards, glows, stars, confetti, rings and floating text. */
export type Kind = 'shard' | 'glow' | 'star' | 'confetti' | 'ring' | 'text' | 'spark';

export interface P {
  kind: Kind;
  x: number; y: number; vx: number; vy: number;
  life: number; max: number;
  size: number; rot: number; vr: number;
  color: string;
  gravity: number;
  drag: number;
  text?: string;
  /** confetti flutter phase */
  ph: number;
}

export class Fx {
  items: P[] = [];
  private pool: P[] = [];
  /** Lower the particle budget on slow devices. */
  quality = 1;

  spawn(kind: Kind, x: number, y: number, o: Partial<P> = {}): P {
    const p = this.pool.pop() ?? ({} as P);
    p.kind = kind; p.x = x; p.y = y;
    p.vx = o.vx ?? 0; p.vy = o.vy ?? 0;
    p.life = p.max = o.max ?? o.life ?? 0.6;
    p.size = o.size ?? 4; p.rot = o.rot ?? Math.random() * Math.PI * 2; p.vr = o.vr ?? 0;
    p.color = o.color ?? '#fff';
    p.gravity = o.gravity ?? 0; p.drag = o.drag ?? 0;
    p.text = o.text; p.ph = Math.random() * 6.28;
    this.items.push(p);
    return p;
  }

  /** Block destroyed: chunky shards + a glow puff. */
  shatter(x: number, y: number, color: string, size: number) {
    const n = Math.round(5 * this.quality);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = 60 + Math.random() * 160;
      this.spawn('shard', x, y, {
        vx: Math.cos(a) * v, vy: Math.sin(a) * v - 90, max: 0.45 + Math.random() * 0.3,
        size: size * (0.18 + Math.random() * 0.22), vr: (Math.random() - 0.5) * 18, color, gravity: 700, drag: 1.5,
      });
    }
    this.spawn('glow', x, y, { max: 0.25, size: size * 0.9, color });
  }

  ring(x: number, y: number, color: string, size: number, max = 0.35) {
    this.spawn('ring', x, y, { size, max, color });
  }

  stars(x: number, y: number, n: number, spread = 140, color = '#ffd84a') {
    for (let i = 0; i < n * this.quality; i++) {
      const a = Math.random() * Math.PI * 2, v = spread * (0.4 + Math.random() * 0.8);
      this.spawn('star', x, y, { vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, max: 0.6 + Math.random() * 0.4, size: 4 + Math.random() * 5, vr: (Math.random() - 0.5) * 10, color, gravity: 300, drag: 2 });
    }
  }

  confetti(x: number, y: number, n: number, dirX: number, colors: string[]) {
    for (let i = 0; i < n * this.quality; i++) {
      const a = -Math.PI / 2 + dirX * (0.25 + Math.random() * 0.5) + (Math.random() - 0.5) * 0.4;
      const v = 450 + Math.random() * 500;
      this.spawn('confetti', x, y, {
        vx: Math.cos(a) * v, vy: Math.sin(a) * v, max: 2.2 + Math.random() * 1.2, size: 5 + Math.random() * 5,
        vr: (Math.random() - 0.5) * 14, color: colors[i % colors.length], gravity: 520, drag: 1.6,
      });
    }
  }

  text(x: number, y: number, text: string, color = '#ffd84a', size = 22) {
    this.spawn('text', x, y, { text, color, size, vy: -70, max: 1.0, drag: 1.2 });
  }

  update(dt: number) {
    const items = this.items;
    for (let i = items.length - 1; i >= 0; i--) {
      const p = items[i];
      p.life -= dt;
      if (p.life <= 0) {
        items[i] = items[items.length - 1];
        items.pop();
        this.pool.push(p);
        continue;
      }
      const d = Math.max(0, 1 - p.drag * dt);
      p.vx *= d;
      p.vy = p.vy * d + p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const p of this.items) {
      const t = p.life / p.max; // 1 → 0
      switch (p.kind) {
        case 'shard': {
          ctx.globalAlpha = Math.min(1, t * 2);
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          const s = p.size;
          ctx.fillRect(-s / 2, -s / 2, s, s);
          ctx.fillStyle = 'rgba(255,255,255,0.45)';
          ctx.fillRect(-s / 2, -s / 2, s, s * 0.3);
          ctx.restore();
          break;
        }
        case 'glow':
        case 'spark': {
          const s = p.size * (p.kind === 'glow' ? 1 + (1 - t) * 1.4 : t);
          ctx.globalAlpha = t * (p.kind === 'glow' ? 0.8 : 1);
          ctx.globalCompositeOperation = 'lighter';
          const g = glowSprite(p.color, 16);
          ctx.drawImage(g, p.x - s, p.y - s, s * 2, s * 2);
          ctx.globalCompositeOperation = 'source-over';
          break;
        }
        case 'star': {
          ctx.globalAlpha = Math.min(1, t * 2.5);
          ctx.fillStyle = p.color;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          starPath(ctx, 0, 0, p.size * (0.6 + t * 0.4));
          ctx.fill();
          ctx.restore();
          break;
        }
        case 'confetti': {
          ctx.globalAlpha = Math.min(1, t * 3);
          ctx.save();
          ctx.translate(p.x + Math.sin(p.ph + p.life * 9) * 6, p.y);
          ctx.rotate(p.rot);
          ctx.scale(1, Math.abs(Math.cos(p.ph + p.life * 11)) + 0.15);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size * 0.35, p.size, p.size * 0.7);
          ctx.restore();
          break;
        }
        case 'ring': {
          const k = 1 - t;
          ctx.globalAlpha = t;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = Math.max(1, 3 * t);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (0.3 + k * 1.2), 0, Math.PI * 2);
          ctx.stroke();
          break;
        }
        case 'text': {
          const k = 1 - t;
          const pop = k < 0.15 ? 0.6 + (k / 0.15) * 0.55 : k < 0.25 ? 1.15 - ((k - 0.15) / 0.1) * 0.15 : 1;
          ctx.globalAlpha = Math.min(1, t * 2.5);
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.scale(pop, pop);
          ctx.font = `900 ${p.size}px Vazirmatn, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.lineJoin = 'round';
          ctx.lineWidth = p.size * 0.28;
          ctx.strokeStyle = '#3b1d5c';
          ctx.strokeText(p.text!, 0, 0);
          ctx.fillStyle = p.color;
          ctx.fillText(p.text!, 0, 0);
          ctx.restore();
          break;
        }
      }
    }
    ctx.globalAlpha = 1;
  }
}
