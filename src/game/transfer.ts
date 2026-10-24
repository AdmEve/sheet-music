// Save transfer codes. The game is offline and has no accounts, so a player changing
// phones copies a code (or shares it to themselves in a messenger) and pastes it on the new
// phone. The save JSON is LZW-compressed over its own small alphabet with growing code
// widths, packed into URL-safe base64, and carries a checksum so a truncated or mistyped
// code is refused instead of loading garbage.

const PREFIX = 'MHL2.';
const DIGITS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

const bitsFor = (n: number) => Math.max(1, Math.ceil(Math.log2(n + 1)));

class BitWriter {
  private out = '';
  private acc = 0;
  private n = 0;
  write(value: number, bits: number): void {
    for (let b = bits - 1; b >= 0; b--) {
      this.acc = (this.acc << 1) | (Math.floor(value / 2 ** b) & 1);
      if (++this.n === 6) {
        this.out += DIGITS[this.acc];
        this.acc = 0;
        this.n = 0;
      }
    }
  }
  done(): string {
    return this.n ? this.out + DIGITS[this.acc << (6 - this.n)] : this.out;
  }
}

class BitReader {
  private pos = 0;
  constructor(private s: string) {}
  /** Next `bits` bits as a number, or -1 past the end / on a bad digit. */
  read(bits: number): number {
    let v = 0;
    for (let b = 0; b < bits; b++) {
      const i = Math.floor(this.pos / 6);
      if (i >= this.s.length) return -1;
      const d = DIGITS.indexOf(this.s[i]);
      if (d < 0) return -1;
      v = v * 2 + ((d >> (5 - (this.pos % 6))) & 1);
      this.pos++;
    }
    return v;
  }
}

/**
 * Layout: alphabet size (16 bits), each alphabet code unit (16 bits), code count (24 bits),
 * then LZW codes; the k-th code uses bitsFor(alphabet + k) bits, which both sides know.
 */
function compress(text: string): string {
  const alphabet = [...new Set(text.split(''))].sort();
  const w = new BitWriter();
  w.write(alphabet.length, 16);
  for (const c of alphabet) w.write(c.charCodeAt(0), 16);
  const dict = new Map<string, number>(alphabet.map((c, i) => [c, i]));
  const codes: number[] = [];
  let cur = '';
  for (let i = 0; i < text.length; i++) {
    const wc = cur + text[i];
    if (dict.has(wc)) {
      cur = wc;
      continue;
    }
    codes.push(dict.get(cur)!);
    dict.set(wc, dict.size);
    cur = text[i];
  }
  if (cur) codes.push(dict.get(cur)!);
  w.write(codes.length, 24);
  codes.forEach((c, k) => w.write(c, bitsFor(alphabet.length + k)));
  return w.done();
}

function decompress(s: string): string | null {
  const r = new BitReader(s);
  const size = r.read(16);
  if (size <= 0) return null;
  const dict: string[] = [];
  for (let i = 0; i < size; i++) {
    const c = r.read(16);
    if (c < 0) return null;
    dict.push(String.fromCharCode(c));
  }
  const count = r.read(24);
  if (count < 0) return null;
  const out: string[] = [];
  let prev = '';
  for (let k = 0; k < count; k++) {
    const code = r.read(bitsFor(size + k));
    if (code < 0) return null;
    let entry = dict[code];
    if (entry === undefined) {
      if (code !== dict.length || !prev) return null;
      entry = prev + prev[0];
    }
    if (prev) dict.push(prev + entry[0]);
    out.push(entry);
    prev = entry;
  }
  return out.join('');
}

function checksum(s: string): string {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
  return DIGITS[h & 63] + DIGITS[(h >>> 6) & 63] + DIGITS[(h >>> 12) & 63] + DIGITS[(h >>> 18) & 63];
}

export function encodeSave(json: string): string {
  const body = compress(json);
  return `${PREFIX}${checksum(body)}.${body}`;
}

/** The save JSON inside a code, or null if the code is not a valid, complete one. */
export function decodeSave(code: string): string | null {
  const clean = code.replace(/\s+/g, '');
  if (!clean.startsWith(PREFIX)) return null;
  const [sum, body] = clean.slice(PREFIX.length).split('.');
  if (!body || checksum(body) !== sum) return null;
  return decompress(body);
}
