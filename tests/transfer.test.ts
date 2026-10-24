import { describe, expect, it } from 'vitest';
import { decodeSave, encodeSave } from '../src/game/transfer';
import { loadState, newGame } from '../src/game/model';

describe('save transfer code', () => {
  it('round-trips a real save and is much shorter than the JSON', () => {
    const s = newGame(5, 1_700_000_000_000);
    s.race.active = { start: 1, orders0: 0, bots: [{ name: 'مریم از کوچه‌ی یاس 🌸', hue: 1, finishMs: 5 }], finishedAt: null, claimed: false };
    const json = JSON.stringify(s);
    const code = encodeSave(json);
    expect(code.startsWith('MHL2.')).toBe(true);
    expect(code.length).toBeLessThan(json.length * 0.6);
    expect(decodeSave(code)).toBe(json);
    expect(loadState(decodeSave(code))?.level).toBe(1);
  });

  it('survives line breaks and spaces added by messengers', () => {
    const json = JSON.stringify(newGame(9, 0));
    const code = encodeSave(json);
    const mangled = code.slice(0, 40) + '\n ' + code.slice(40, 90) + '  ' + code.slice(90);
    expect(decodeSave(mangled)).toBe(json);
  });

  it('refuses truncated, edited or foreign codes', () => {
    const code = encodeSave(JSON.stringify(newGame(3, 0)));
    expect(decodeSave(code.slice(0, -5))).toBeNull();
    const flipped = code.slice(0, 30) + (code[30] === 'A' ? 'B' : 'A') + code.slice(31);
    expect(decodeSave(flipped)).toBeNull();
    expect(decodeSave('hello')).toBeNull();
    expect(decodeSave('')).toBeNull();
  });
});
