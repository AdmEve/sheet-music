import { PALETTE, shade } from '../game/palette';

/**
 * Pre-rendered sprites. Everything expensive (gradients, outlines, soft shadows) is drawn once
 * per colour and size into an offscreen canvas, so a frame is mostly cheap drawImage calls —
 * that is what keeps the game at 60 fps on low-end phones.
 */
const cache = new Map<string, HTMLCanvasElement>();
let DPR = 1;

export function setSpriteScale(dpr: number) {
  if (dpr !== DPR) cache.clear();
  DPR = dpr;
}

function sprite(key: string, w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void): HTMLCanvasElement {
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.ceil(w * DPR));
  c.height = Math.max(1, Math.ceil(h * DPR));
  const ctx = c.getContext('2d')!;
  ctx.scale(DPR, DPR);
  draw(ctx);
  if (cache.size > 900) cache.clear();
  cache.set(key, c);
  return c;
}

export function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const q = (v: number) => Math.round(v * 4) / 4;

// ───────────────────────────── blocks ─────────────────────────────

/** A glossy candy block, `s` CSS px square. */
export function blockSprite(color: number, s: number): HTMLCanvasElement {
  s = q(s);
  return sprite(`b${color}:${s}`, s, s, (ctx) => {
    const hex = PALETTE[color].hex;
    const g = Math.max(0.6, s * 0.05);
    const r = s * 0.24;
    // body
    const body = ctx.createLinearGradient(0, 0, 0, s);
    body.addColorStop(0, shade(hex, 0.28));
    body.addColorStop(0.45, hex);
    body.addColorStop(1, shade(hex, -0.22));
    ctx.fillStyle = body;
    rr(ctx, g, g, s - 2 * g, s - 2 * g, r);
    ctx.fill();
    // bottom lip
    ctx.save();
    rr(ctx, g, g, s - 2 * g, s - 2 * g, r);
    ctx.clip();
    ctx.fillStyle = shade(hex, -0.3);
    ctx.fillRect(0, s - g - s * 0.13, s, s * 0.2);
    // gloss band
    const gl = ctx.createLinearGradient(0, g, 0, s * 0.5);
    gl.addColorStop(0, 'rgba(255,255,255,0.55)');
    gl.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gl;
    rr(ctx, s * 0.14, s * 0.1, s * 0.72, s * 0.34, s * 0.14);
    ctx.fill();
    ctx.restore();
    // outline
    ctx.strokeStyle = shade(hex, -0.42);
    ctx.lineWidth = Math.max(0.75, s * 0.045);
    rr(ctx, g, g, s - 2 * g, s - 2 * g, r);
    ctx.stroke();
    // sparkle
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.arc(s * 0.27, s * 0.25, Math.max(0.6, s * 0.06), 0, Math.PI * 2);
    ctx.fill();
  });
}

/** Frost over an ice block: stage 2 = intact, 1 = cracked. */
export function iceSprite(s: number, stage: 1 | 2): HTMLCanvasElement {
  s = q(s);
  return sprite(`ice${stage}:${s}`, s, s, (ctx) => {
    const g = Math.max(0.6, s * 0.05);
    const fr = ctx.createLinearGradient(0, 0, s, s);
    fr.addColorStop(0, stage === 2 ? 'rgba(235,250,255,0.85)' : 'rgba(235,250,255,0.45)');
    fr.addColorStop(1, stage === 2 ? 'rgba(170,220,250,0.6)' : 'rgba(170,220,250,0.25)');
    ctx.fillStyle = fr;
    rr(ctx, g, g, s - 2 * g, s - 2 * g, s * 0.24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.95)';
    ctx.lineWidth = Math.max(0.8, s * 0.06);
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (stage === 2) {
      ctx.moveTo(s * 0.22, s * 0.62); ctx.lineTo(s * 0.4, s * 0.44);
      ctx.moveTo(s * 0.56, s * 0.3); ctx.lineTo(s * 0.74, s * 0.2);
    } else {
      ctx.moveTo(s * 0.15, s * 0.22); ctx.lineTo(s * 0.48, s * 0.52); ctx.lineTo(s * 0.84, s * 0.38);
      ctx.moveTo(s * 0.48, s * 0.52); ctx.lineTo(s * 0.42, s * 0.88);
      ctx.moveTo(s * 0.48, s * 0.52); ctx.lineTo(s * 0.7, s * 0.8);
    }
    ctx.stroke();
    ctx.strokeStyle = 'rgba(120,190,235,0.9)';
    ctx.lineWidth = Math.max(0.6, s * 0.035);
    rr(ctx, g, g, s - 2 * g, s - 2 * g, s * 0.24);
    ctx.stroke();
  });
}

// ───────────────────────────── cats ─────────────────────────────

export const HIDDEN_HEX = '#a69cc0';

/** Cat body (no face): ears, chubby head, cheeks, belly, paws, outline. Centre at sprite middle. */
export function catBodySprite(color: number, r: number, hidden = false): HTMLCanvasElement {
  r = q(r);
  const W = r * 2.6, H = r * 2.7;
  return sprite(`c${hidden ? 'h' : color}:${r}`, W, H, (ctx) => {
    const hex = hidden ? HIDDEN_HEX : PALETTE[color].hex;
    const light = PALETTE[color]?.key === 'w' && !hidden;
    const line = shade(hex, light ? -0.45 : -0.5);
    const lw = Math.max(1.2, r * 0.085);
    ctx.translate(W / 2, H * 0.53);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    // ears
    for (const sgn of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(sgn * r * 0.98, -r * 0.18);
      ctx.quadraticCurveTo(sgn * r * 1.0, -r * 0.95, sgn * r * 0.78, -r * 1.13);
      ctx.quadraticCurveTo(sgn * r * 0.5, -r * 1.0, sgn * r * 0.18, -r * 0.8);
      ctx.closePath();
      ctx.fillStyle = shade(hex, -0.08);
      ctx.fill();
      ctx.strokeStyle = line;
      ctx.lineWidth = lw;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(sgn * r * 0.8, -r * 0.42);
      ctx.quadraticCurveTo(sgn * r * 0.82, -r * 0.88, sgn * r * 0.72, -r * 0.95);
      ctx.quadraticCurveTo(sgn * r * 0.52, -r * 0.86, sgn * r * 0.36, -r * 0.72);
      ctx.closePath();
      ctx.fillStyle = '#ffadc9';
      ctx.fill();
    }
    // head / body
    const body = () => {
      ctx.beginPath();
      ctx.ellipse(0, 0, r, r * 0.9, 0, 0, Math.PI * 2);
      // cheek fluff
      ctx.moveTo(-r * 0.86 + r * 0.24, r * 0.26);
      ctx.arc(-r * 0.86, r * 0.26, r * 0.24, 0, Math.PI * 2);
      ctx.moveTo(r * 0.86 + r * 0.24, r * 0.26);
      ctx.arc(r * 0.86, r * 0.26, r * 0.24, 0, Math.PI * 2);
    };
    const grad = ctx.createRadialGradient(-r * 0.35, -r * 0.45, r * 0.1, 0, 0, r * 1.15);
    grad.addColorStop(0, shade(hex, 0.38));
    grad.addColorStop(0.55, hex);
    grad.addColorStop(1, shade(hex, -0.25));
    body();
    ctx.strokeStyle = line;
    ctx.lineWidth = lw * 2;
    ctx.stroke();
    ctx.fillStyle = grad;
    ctx.fill();
    // tabby stripes on the forehead
    ctx.strokeStyle = shade(hex, -0.2);
    ctx.lineWidth = Math.max(1, r * 0.08);
    for (const dx of [-0.2, 0, 0.2]) {
      ctx.beginPath();
      ctx.moveTo(r * dx, -r * 0.84);
      ctx.lineTo(r * dx * 0.8, -r * (dx === 0 ? 0.6 : 0.66));
      ctx.stroke();
    }
    // belly patch
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.5, r * 0.56, r * 0.34, 0, 0, Math.PI * 2);
    ctx.fill();
    // paws
    for (const sgn of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(sgn * r * 0.34, r * 0.84, r * 0.22, r * 0.14, 0, 0, Math.PI * 2);
      ctx.fillStyle = shade(hex, 0.45);
      ctx.fill();
      ctx.strokeStyle = line;
      ctx.lineWidth = lw * 0.8;
      ctx.stroke();
    }
    // gloss
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.ellipse(-r * 0.42, -r * 0.48, r * 0.22, r * 0.12, -0.6, 0, Math.PI * 2);
    ctx.fill();
  });
}

export type Expr = 'normal' | 'blink' | 'happy' | 'sad' | 'shoot';

/** Live face: eyes follow (lx, ly) in -1..1, plus expression. Drawn every frame (cheap shapes). */
export function drawCatFace(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, expr: Expr, lx = 0, ly = 0) {
  const ey = y - r * 0.2;
  const ex = r * 0.36;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  // blush
  ctx.fillStyle = 'rgba(255,110,150,0.35)';
  for (const sgn of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(x + sgn * r * 0.6, y + r * 0.06, r * 0.15, r * 0.09, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (expr === 'blink' || expr === 'happy') {
    ctx.strokeStyle = '#2a1f33';
    ctx.lineWidth = Math.max(1.3, r * 0.1);
    for (const sgn of [-1, 1]) {
      ctx.beginPath();
      if (expr === 'happy') ctx.arc(x + sgn * ex, ey + r * 0.06, r * 0.14, Math.PI * 1.15, Math.PI * 1.85);
      else { ctx.moveTo(x + sgn * ex - r * 0.13, ey + r * 0.02); ctx.quadraticCurveTo(x + sgn * ex, ey + r * 0.09, x + sgn * ex + r * 0.13, ey + r * 0.02); }
      ctx.stroke();
    }
  } else {
    const px = lx * r * 0.06, py = ly * r * 0.06;
    for (const sgn of [-1, 1]) {
      const cx = x + sgn * ex;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.ellipse(cx, ey, r * 0.21, r * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(42,31,51,0.55)';
      ctx.lineWidth = Math.max(0.8, r * 0.04);
      ctx.stroke();
      const pr = expr === 'sad' ? 0.1 : expr === 'shoot' ? 0.11 : 0.13;
      ctx.fillStyle = '#2a1f33';
      ctx.beginPath();
      ctx.ellipse(cx + px, ey + py + (expr === 'sad' ? r * 0.05 : r * 0.02), r * pr, r * (pr + 0.04), 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(cx + px - r * 0.05, ey + py - r * 0.06, r * 0.05, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + px + r * 0.04, ey + py + r * 0.05, r * 0.025, 0, Math.PI * 2);
      ctx.fill();
      if (expr === 'sad') {
        ctx.strokeStyle = '#2a1f33';
        ctx.lineWidth = Math.max(1, r * 0.07);
        ctx.beginPath();
        ctx.moveTo(cx - sgn * r * 0.16, ey - r * 0.36);
        ctx.lineTo(cx + sgn * r * 0.12, ey - r * 0.28);
        ctx.stroke();
      }
    }
  }
  // nose
  ctx.fillStyle = '#ff6f9f';
  ctx.beginPath();
  ctx.moveTo(x - r * 0.08, y - r * 0.02);
  ctx.lineTo(x + r * 0.08, y - r * 0.02);
  ctx.lineTo(x, y + r * 0.07);
  ctx.closePath();
  ctx.fill();
  // mouth
  ctx.strokeStyle = '#2a1f33';
  ctx.lineWidth = Math.max(0.9, r * 0.055);
  ctx.beginPath();
  if (expr === 'shoot') {
    ctx.fillStyle = '#7a2140';
    ctx.ellipse(x, y + r * 0.17, r * 0.08, r * 0.09, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (expr === 'sad') {
    ctx.arc(x, y + r * 0.22, r * 0.1, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  } else {
    ctx.moveTo(x, y + r * 0.07);
    ctx.arc(x - r * 0.07, y + r * 0.08, r * 0.07, 0, 0.9 * Math.PI);
    ctx.moveTo(x + r * 0.14, y + r * 0.08);
    ctx.arc(x + r * 0.07, y + r * 0.08, r * 0.07, 0, 0.9 * Math.PI);
    ctx.stroke();
  }
}

export interface CatDraw {
  hidden?: boolean;
  expr?: Expr;
  lookX?: number;
  lookY?: number;
  /** vertical squash (1 = none) */
  squash?: number;
  alpha?: number;
  ammo?: number;
  shadow?: boolean;
  rot?: number;
}

/** Ammo badge on the cat's belly (cached per number and size). */
function drawBadge(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, label: string) {
  const fs = q(Math.max(9, r * 0.56));
  const W = fs * 2.6, H = fs * 1.3;
  const spr = sprite(`bd${label}:${fs}`, W, H, (b) => {
    b.font = `900 ${fs}px Vazirmatn, sans-serif`;
    const w = Math.max(fs * 1.25, b.measureText(label).width + fs * 0.55);
    const h = fs * 1.12;
    b.fillStyle = 'rgba(38,20,52,0.72)';
    rr(b, W / 2 - w / 2, H / 2 - h / 2, w, h, h / 2);
    b.fill();
    b.fillStyle = '#fff';
    b.textAlign = 'center';
    b.textBaseline = 'middle';
    b.fillText(label, W / 2, H / 2 + fs * 0.06);
  });
  ctx.drawImage(spr, x - W / 2, y - H / 2, W, H);
}

const FA = '۰۱۲۳۴۵۶۷۸۹';
const faNum = (n: number) => String(n).replace(/[0-9]/g, (d) => FA[+d]);

export function drawCat(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: number, o: CatDraw = {}) {
  if (r < 1) return;
  const body = catBodySprite(color, r, o.hidden);
  const W = r * 2.6, H = r * 2.7;
  const sq = o.squash ?? 1;
  ctx.save();
  if (o.alpha !== undefined) ctx.globalAlpha *= o.alpha;
  if (o.shadow !== false) {
    ctx.fillStyle = 'rgba(30,10,50,0.22)';
    ctx.beginPath();
    ctx.ellipse(x, y + r * 0.98, r * 0.85 * (2 - sq), r * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.translate(x, y + r * 0.9);
  if (o.rot) ctx.rotate(o.rot);
  ctx.scale(2 - sq, sq);
  ctx.translate(0, -r * 0.9);
  ctx.drawImage(body, -W / 2, -H * 0.53, W, H);
  drawCatFace(ctx, 0, 0, r, o.expr ?? 'normal', o.lookX, o.lookY);
  if (o.hidden) drawBadge(ctx, 0, r * 0.56, r, '؟');
  else if (o.ammo !== undefined && o.ammo >= 0) drawBadge(ctx, 0, r * 0.56, r, faNum(o.ammo));
  ctx.restore();
}

// ───────────────────────────── misc ─────────────────────────────

/** Soft round glow used for projectiles and sparkles. */
export function glowSprite(hex: string, r: number): HTMLCanvasElement {
  r = q(r);
  return sprite(`g${hex}:${r}`, r * 2, r * 2, (ctx) => {
    const g = ctx.createRadialGradient(r, r, 0, r, r, r);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, hex);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, r * 2, r * 2);
  });
}

export function starPath(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, inner = 0.45, points = 5, rot = -Math.PI / 2) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const a = rot + (i * Math.PI) / points;
    const rad = i % 2 ? r * inner : r;
    if (i) ctx.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
    else ctx.moveTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
  }
  ctx.closePath();
}
