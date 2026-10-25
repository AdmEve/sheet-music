import { PALETTE, shade } from './game/palette';
import { fa } from './fa';

/** Rounded rectangle path helper. */
export function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** A glossy pixel block. */
export function drawBlock(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: number, ice: 0 | 1 | 2) {
  const hex = PALETTE[color].hex;
  const g = s * 0.06;
  ctx.fillStyle = shade(hex, -0.22);
  rr(ctx, x + g, y + g, s - 2 * g, s - 2 * g, s * 0.22);
  ctx.fill();
  ctx.fillStyle = hex;
  rr(ctx, x + g, y + g, s - 2 * g, s - 2 * g - s * 0.12, s * 0.22);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  rr(ctx, x + s * 0.2, y + s * 0.16, s * 0.32, s * 0.14, s * 0.07);
  ctx.fill();
  if (ice) {
    ctx.fillStyle = ice === 2 ? 'rgba(220,245,255,0.62)' : 'rgba(220,245,255,0.3)';
    rr(ctx, x + g, y + g, s - 2 * g, s - 2 * g, s * 0.22);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = Math.max(1, s * 0.07);
    ctx.beginPath();
    if (ice === 2) {
      ctx.moveTo(x + s * 0.25, y + s * 0.7); ctx.lineTo(x + s * 0.45, y + s * 0.5);
      ctx.moveTo(x + s * 0.55, y + s * 0.32); ctx.lineTo(x + s * 0.72, y + s * 0.22);
    } else {
      ctx.moveTo(x + s * 0.2, y + s * 0.25); ctx.lineTo(x + s * 0.5, y + s * 0.55); ctx.lineTo(x + s * 0.8, y + s * 0.4);
      ctx.moveTo(x + s * 0.5, y + s * 0.55); ctx.lineTo(x + s * 0.45, y + s * 0.85);
    }
    ctx.stroke();
  }
}

export interface CatOpts {
  hidden?: boolean;
  dim?: boolean;
  blink?: boolean;
  happy?: boolean;
  ring?: string | null;
}

/** The "pishi" shooter: a round cat head in its colour, with its ammo on its belly. */
export function drawCat(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: number, ammo: number, o: CatOpts = {}) {
  const hex = o.hidden ? '#8d8a99' : PALETTE[color].hex;
  const dark = shade(hex, -0.3);
  ctx.save();
  if (o.dim) ctx.globalAlpha *= 0.55;
  // shadow
  ctx.fillStyle = 'rgba(40,20,60,0.18)';
  ctx.beginPath();
  ctx.ellipse(x, y + r * 0.92, r * 0.8, r * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();
  // ears
  ctx.fillStyle = dark;
  for (const sgn of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(x + sgn * r * 0.95, y - r * 0.15);
    ctx.lineTo(x + sgn * r * 0.78, y - r * 1.12);
    ctx.lineTo(x + sgn * r * 0.2, y - r * 0.78);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = '#ffb3cf';
  for (const sgn of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(x + sgn * r * 0.8, y - r * 0.35);
    ctx.lineTo(x + sgn * r * 0.72, y - r * 0.9);
    ctx.lineTo(x + sgn * r * 0.38, y - r * 0.7);
    ctx.closePath();
    ctx.fill();
  }
  // head
  const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.4, r * 0.1, x, y, r * 1.05);
  grad.addColorStop(0, shade(hex, 0.35));
  grad.addColorStop(0.6, hex);
  grad.addColorStop(1, dark);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 0.9, 0, 0, Math.PI * 2);
  ctx.fill();
  // eyes
  const ey = y - r * 0.18;
  if (o.blink || o.happy) {
    ctx.strokeStyle = '#2b2333';
    ctx.lineWidth = Math.max(1.2, r * 0.1);
    ctx.lineCap = 'round';
    for (const sgn of [-1, 1]) {
      ctx.beginPath();
      if (o.happy) ctx.arc(x + sgn * r * 0.36, ey + r * 0.05, r * 0.14, Math.PI * 1.1, Math.PI * 1.9);
      else { ctx.moveTo(x + sgn * r * 0.36 - r * 0.13, ey); ctx.lineTo(x + sgn * r * 0.36 + r * 0.13, ey); }
      ctx.stroke();
    }
  } else {
    for (const sgn of [-1, 1]) {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.ellipse(x + sgn * r * 0.36, ey, r * 0.2, r * 0.23, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2b2333';
      ctx.beginPath();
      ctx.ellipse(x + sgn * r * 0.33, ey + r * 0.03, r * 0.12, r * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x + sgn * r * 0.3, ey - r * 0.05, r * 0.045, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // nose + whiskers
  ctx.fillStyle = '#ff7aa8';
  ctx.beginPath();
  ctx.moveTo(x - r * 0.08, y + r * 0.08);
  ctx.lineTo(x + r * 0.08, y + r * 0.08);
  ctx.lineTo(x, y + r * 0.17);
  ctx.closePath();
  ctx.fill();
  // ammo (mascots pass a negative value to show none)
  if (ammo < 0 && !o.hidden) { ctx.restore(); return; }
  const label = o.hidden ? '؟' : fa(ammo);
  ctx.font = `900 ${Math.round(r * (label.length > 2 ? 0.66 : 0.8))}px Vazirmatn, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = Math.max(2, r * 0.18);
  ctx.strokeStyle = 'rgba(40,20,50,0.75)';
  ctx.lineJoin = 'round';
  ctx.strokeText(label, x, y + r * 0.48);
  ctx.fillStyle = '#fff';
  ctx.fillText(label, x, y + r * 0.48);
  if (o.ring) {
    ctx.strokeStyle = o.ring;
    ctx.lineWidth = Math.max(2, r * 0.12);
    ctx.beginPath();
    ctx.arc(x, y, r * 1.25, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

/** Small preview of a picture (for the gallery and win screen). */
export function drawPicture(ctx: CanvasRenderingContext2D, cells: number[], w: number, h: number, x: number, y: number, size: number) {
  const s = size / Math.max(w, h);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const c = cells[j * w + i];
    if (c < 0) continue;
    ctx.fillStyle = PALETTE[c].hex;
    ctx.fillRect(Math.floor(x + i * s), Math.floor(y + j * s), Math.ceil(s), Math.ceil(s));
  }
}
