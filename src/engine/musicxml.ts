// Writes a Score as MusicXML 4.0 (opens in MuseScore, Sibelius, Finale, Dorico, ...).
import { DIV, quarterBpm, type ClefName, type Score, type ScoreEvent } from './score';
import { keyAlterations, spell } from './theory';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const CLEF: Record<ClefName, string> = {
  treble: '<sign>G</sign><line>2</line>',
  bass: '<sign>F</sign><line>4</line>',
  tenor: '<sign>C</sign><line>4</line>',
};

const ACCIDENTAL: Record<number, string> = { [-2]: 'flat-flat', [-1]: 'flat', 0: 'natural', 1: 'sharp', 2: 'double-sharp' };

export function toMusicXML(score: Score): string {
  const { key } = score;
  const keySig = keyAlterations(key.fifths);
  const o: string[] = [];
  o.push('<?xml version="1.0" encoding="UTF-8" standalone="no"?>');
  o.push(
    '<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">',
  );
  o.push('<score-partwise version="4.0">');
  o.push(`<work><work-title>${esc(score.title)}</work-title></work>`);
  o.push('<identification><creator type="arranger">Transcribed with Sheet Music</creator>');
  o.push('<encoding><software>Sheet Music (offline transcriber)</software></encoding></identification>');
  o.push('<part-list>');
  score.parts.forEach((p, i) => {
    o.push(`<score-part id="${p.id}"><part-name>${esc(p.name)}</part-name><part-abbreviation>${esc(p.abbreviation)}</part-abbreviation>`);
    o.push(`<score-instrument id="${p.id}-I1"><instrument-name>${esc(p.name)}</instrument-name></score-instrument>`);
    o.push(
      `<midi-instrument id="${p.id}-I1"><midi-channel>${i + 1}</midi-channel><midi-program>${p.midiProgram + 1}</midi-program></midi-instrument></score-part>`,
    );
  });
  o.push('</part-list>');

  for (const part of score.parts) {
    o.push(`<part id="${part.id}">`);
    const nStaves = part.staves.length;
    const prevClef: (ClefName | null)[] = part.staves.map(() => null);
    score.measures.forEach((m, mi) => {
      const number = score.measures[0].pickup ? mi : mi + 1;
      o.push(`<measure number="${number}"${m.pickup ? ' implicit="yes"' : ''}>`);
      const attrs: string[] = [];
      if (mi === 0) {
        attrs.push(`<divisions>${DIV}</divisions>`);
        attrs.push(`<key><fifths>${key.fifths}</fifths><mode>${key.mode}</mode></key>`);
        attrs.push(`<time><beats>${score.meter.beats}</beats><beat-type>${score.meter.beatType}</beat-type></time>`);
        if (nStaves > 1) attrs.push(`<staves>${nStaves}</staves>`);
      }
      part.staves.forEach((st, si) => {
        const c = st.clefs[mi];
        if (c !== prevClef[si]) {
          attrs.push(`<clef${nStaves > 1 ? ` number="${si + 1}"` : ''}>${CLEF[c]}</clef>`);
          prevClef[si] = c;
        }
      });
      if (attrs.length) o.push(`<attributes>${attrs.join('')}</attributes>`);
      if (mi === 0 && part === score.parts[0]) o.push(tempoDirection(score));
      part.staves.forEach((st, si) => {
        if (si > 0) o.push(`<backup><duration>${m.length}</duration></backup>`);
        const voice = si === 0 ? 1 : 5;
        const staffTag = nStaves > 1 ? `<staff>${si + 1}</staff>` : '';
        // Accidental memory for this measure: "step+octave" -> alteration.
        const memory = new Map<string, number>();
        for (const ev of st.measures[mi]) o.push(eventXML(ev, voice, staffTag, key, keySig, memory, m.length));
      });
      o.push('</measure>');
    });
    o.push('</part>');
  }
  o.push('</score-partwise>');
  return o.join('\n');
}

/** Metronome mark in the meter's beat unit; <sound tempo> is always in quarter notes per minute. */
function tempoDirection(score: Score): string {
  const { beats, beatType } = score.meter;
  const compound = beatType === 8 && beats % 3 === 0 && beats > 3;
  let unit = '<beat-unit>quarter</beat-unit>';
  if (compound) unit = '<beat-unit>quarter</beat-unit><beat-unit-dot/>';
  else if (beatType === 2) unit = '<beat-unit>half</beat-unit>';
  else if (beatType === 8) unit = '<beat-unit>eighth</beat-unit>';
  const quarters = quarterBpm(score);
  return (
    `<direction placement="above"><direction-type><metronome>${unit}<per-minute>${score.bpm}</per-minute></metronome>` +
    `</direction-type><sound tempo="${Math.round(quarters)}"/></direction>`
  );
}

function eventXML(
  ev: ScoreEvent,
  voice: number,
  staffTag: string,
  key: Score['key'],
  keySig: Record<string, number>,
  memory: Map<string, number>,
  measureLen: number,
): string {
  const v = ev.value;
  const timeMod = v.triplet ? '<time-modification><actual-notes>3</actual-notes><normal-notes>2</normal-notes></time-modification>' : '';
  const typeDots = ev.measureRest ? '' : `<type>${v.type}</type>${'<dot/>'.repeat(v.dots)}`;
  const tupletNotations = [
    ev.tupletStart ? '<tuplet type="start" bracket="yes"/>' : '',
    ev.tupletStop ? '<tuplet type="stop"/>' : '',
  ].join('');
  const beams = (ev.beams ?? []).map((b, i) => `<beam number="${i + 1}">${b}</beam>`).join('');

  if (!ev.pitches.length) {
    const rest = ev.measureRest ? '<rest measure="yes"/>' : '<rest/>';
    const notations = tupletNotations ? `<notations>${tupletNotations}</notations>` : '';
    return `<note>${rest}<duration>${ev.measureRest ? measureLen : ev.dur}</duration><voice>${voice}</voice>${typeDots}${timeMod}${staffTag}${notations}</note>`;
  }
  return ev.pitches
    .map((p, i) => {
      const s = spell(p, key);
      const id = s.step + s.octave;
      const expected = memory.has(id) ? memory.get(id)! : keySig[s.step];
      let acc = '';
      if (s.alter !== expected && !ev.tieStop) acc = `<accidental>${ACCIDENTAL[s.alter]}</accidental>`;
      memory.set(id, s.alter);
      const alter = s.alter ? `<alter>${s.alter}</alter>` : '';
      const tie = (ev.tieStop ? '<tie type="stop"/>' : '') + (ev.tieStart ? '<tie type="start"/>' : '');
      const tied = (ev.tieStop ? '<tied type="stop"/>' : '') + (ev.tieStart ? '<tied type="start"/>' : '');
      const nots = tied + (i === 0 ? tupletNotations : '');
      return (
        `<note>${i > 0 ? '<chord/>' : ''}<pitch><step>${s.step}</step>${alter}<octave>${s.octave}</octave></pitch>` +
        `<duration>${ev.dur}</duration>${tie}<voice>${voice}</voice>${typeDots}${acc}${timeMod}${staffTag}` +
        `${i === 0 ? beams : ''}${nots ? `<notations>${nots}</notations>` : ''}</note>`
      );
    })
    .join('');
}
