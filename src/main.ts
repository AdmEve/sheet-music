import './style.css';
import { decodeFile } from './app/audio';
import { isNative, safeName, saveFile, shareFile } from './app/files';
import { isPlaying, play, stop } from './app/player';
import { renderPages } from './app/render';
import { deleteProject, fromStored, getProject, listProjects, saveProject, toStored, type Project } from './app/store';
import { runInWorker, type RunHandle } from './app/model';
import { analyseAll, DEFAULT_SETTINGS, makeScore, type Result, type Settings } from './engine/pipeline';
import type { PianoRoll } from './engine/pianomodel';
import type { Detail, Meter } from './engine/score';
import { toMusicXML, type ScoreView } from './engine/musicxml';
import type { Analysis, Posteriors } from './engine/types';

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

// ------------------------------------------------------------------ state

interface Current {
  id: string;
  title: string;
  fileName: string;
  created: number;
  analysis: Analysis;
  settings: Settings;
  /** Raw network output + audio, kept in memory so "sensitivity" can be changed without re-running the AI. */
  posteriors?: Posteriors;
  roll?: PianoRoll;
  audio?: Float32Array;
}

let current: Current | null = null;
let result: Result | null = null;
let zoom = Number(localStorageGet('zoom') ?? 40);
let view: ScoreView = (['score', 'cello', 'piano'] as const).find((v) => v === localStorageGet('view')) ?? 'score';
let pickedFile: File | null = null;
let cancelled = false;
let running: RunHandle | null = null;

function localStorageGet(k: string): string | null {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}
function localStorageSet(k: string, v: string) {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* private mode */
  }
}

// ------------------------------------------------------------------ tabs

function showTab(name: 'new' | 'library') {
  document.querySelectorAll<HTMLButtonElement>('.tabs button').forEach((b) => b.classList.toggle('active', b.dataset.tab === name));
  $('tab-new').classList.toggle('hidden', name !== 'new');
  $('tab-library').classList.toggle('hidden', name !== 'library');
  $('result').classList.add('hidden');
  stopPlayback();
  if (name === 'library') void refreshLibrary();
}
document.querySelectorAll<HTMLButtonElement>('.tabs button').forEach((b) =>
  b.addEventListener('click', () => showTab(b.dataset.tab as 'new' | 'library')),
);

// ------------------------------------------------------------------ picking a file

function pick(file: File | undefined | null) {
  if (!file) return;
  pickedFile = file;
  $('file-label').textContent = file.name;
  $<HTMLButtonElement>('go').disabled = false;
}
$<HTMLInputElement>('file').addEventListener('change', (e) => pick((e.target as HTMLInputElement).files?.[0]));
const drop = $('drop');
drop.addEventListener('dragover', (e) => {
  e.preventDefault();
  drop.classList.add('over');
});
drop.addEventListener('dragleave', () => drop.classList.remove('over'));
drop.addEventListener('drop', (e) => {
  e.preventDefault();
  drop.classList.remove('over');
  pick(e.dataTransfer?.files?.[0]);
});

// ------------------------------------------------------------------ transcription

function setProgress(stage: string, fraction: number, hint = '') {
  $('stage').textContent = stage;
  $('bar-fill').style.width = `${Math.round(fraction * 100)}%`;
  $('stage-hint').textContent = hint;
}

class Cancelled extends Error {}

$('cancel').addEventListener('click', () => {
  cancelled = true;
  running?.cancel();
});

$('go').addEventListener('click', async () => {
  if (!pickedFile) return;
  const file = pickedFile;
  cancelled = false;
  $('picker').classList.add('hidden');
  $('progress').classList.remove('hidden');
  try {
    setProgress('Reading audio…', 0.02);
    const from = Number($<HTMLInputElement>('from').value) || 0;
    const toVal = Number($<HTMLInputElement>('to').value);
    const to = toVal > from ? toVal : Infinity;
    const audio = await decodeFile(file, from, to);
    if (cancelled) throw new Cancelled();
    const started = performance.now();
    setProgress('Listening for notes…', 0.05, `Piece length: ${formatDuration(audio.duration)}`);
    running = runInWorker(audio.samples, (p) => {
      const el = (performance.now() - started) / 1000;
      const left = p > 0.03 ? Math.max(0, (el / p) * (1 - p)) : NaN;
      setProgress(
        'Listening for notes…',
        0.05 + 0.9 * p,
        Number.isFinite(left) ? `About ${formatDuration(left)} left` : `Piece length: ${formatDuration(audio.duration)}`,
      );
    });
    const { post, roll } = await running.promise.catch((e) => {
      throw cancelled ? new Cancelled() : e;
    });
    running = null;
    if (cancelled) throw new Cancelled();
    setProgress('Writing the score…', 0.97);
    const sensitivity = Number($<HTMLInputElement>('sensitivity').value);
    const analysis = analyseAll(post, roll, audio.samples, sensitivity);
    const title = file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');
    const settings: Settings = structuredClone({
      ...DEFAULT_SETTINGS,
      sensitivity,
      score: { ...DEFAULT_SETTINGS.score, title },
    });
    current = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title,
      fileName: file.name,
      created: Date.now(),
      analysis,
      settings,
      posteriors: post,
      roll,
      audio: audio.samples,
    };
    await persist();
    await openResult();
  } catch (e) {
    if (!(e instanceof Cancelled)) alert(e instanceof Error ? e.message : String(e));
  } finally {
    running = null;
    $('progress').classList.add('hidden');
    $('picker').classList.remove('hidden');
  }
});

function formatDuration(s: number): string {
  if (s < 60) return `${Math.round(s)} s`;
  return `${Math.floor(s / 60)} min ${Math.round(s % 60)} s`;
}

async function persist() {
  if (!current) return;
  const p: Project = {
    id: current.id,
    title: current.settings.score.title,
    fileName: current.fileName,
    created: current.created,
    duration: current.analysis.duration,
    analysis: toStored(current.analysis),
    settings: current.settings,
  };
  try {
    await saveProject(p);
  } catch {
    /* storage full or unavailable: the score still works for this session */
  }
}

// ------------------------------------------------------------------ result view

const KEY_NAMES: Record<string, string> = {
  '-7': 'C♭', '-6': 'G♭', '-5': 'D♭', '-4': 'A♭', '-3': 'E♭', '-2': 'B♭', '-1': 'F', '0': 'C', '1': 'G', '2': 'D', '3': 'A', '4': 'E', '5': 'B', '6': 'F♯', '7': 'C♯',
};
const MINOR_NAMES: Record<string, string> = {
  '-7': 'A♭', '-6': 'E♭', '-5': 'B♭', '-4': 'F', '-3': 'C', '-2': 'G', '-1': 'D', '0': 'A', '1': 'E', '2': 'B', '3': 'F♯', '4': 'C♯', '5': 'G♯', '6': 'D♯', '7': 'A♯',
};
function keyLabel(fifths: number, mode: string) {
  return mode === 'minor' ? `${MINOR_NAMES[fifths]} minor` : `${KEY_NAMES[fifths]} major`;
}
{
  const sel = $<HTMLSelectElement>('s-key');
  sel.add(new Option('Automatic', 'auto'));
  for (let f = -6; f <= 6; f++) sel.add(new Option(keyLabel(f, 'major'), `${f},major`));
  for (let f = -6; f <= 6; f++) sel.add(new Option(keyLabel(f, 'minor'), `${f},minor`));
}

function settingsToForm(s: Settings) {
  $<HTMLSelectElement>('s-meter').value = s.score.meter ? `${s.score.meter.beats}/${s.score.meter.beatType}` : 'auto';
  $<HTMLInputElement>('s-bpm').value = s.score.bpm ? String(s.score.bpm) : '';
  $<HTMLSelectElement>('s-key').value = s.score.key ? `${s.score.key.fifths},${s.score.key.mode}` : 'auto';
  $<HTMLSelectElement>('s-detail').value = s.score.detail;
  $<HTMLInputElement>('s-follow').checked = s.score.followTempo;
  $<HTMLInputElement>('s-bias').value = String(s.instruments.celloBias);
  $<HTMLInputElement>('s-sens').value = String(s.sensitivity);
  $('s-sens-wrap').classList.toggle('hidden', !current?.posteriors);
  $<HTMLInputElement>('title').value = s.score.title;
}

function formToSettings(prev: Settings): Settings {
  const meterV = $<HTMLSelectElement>('s-meter').value;
  const meter: Meter | null = meterV === 'auto' ? null : { beats: +meterV.split('/')[0], beatType: +meterV.split('/')[1] };
  const bpm = Number($<HTMLInputElement>('s-bpm').value);
  const keyV = $<HTMLSelectElement>('s-key').value;
  return {
    sensitivity: Number($<HTMLInputElement>('s-sens').value),
    instruments: {
      ...prev.instruments,
      celloBias: Number($<HTMLInputElement>('s-bias').value),
    },
    score: {
      ...prev.score,
      title: $<HTMLInputElement>('title').value.trim() || 'Untitled',
      meter,
      bpm: bpm >= 20 && bpm <= 300 ? bpm : null,
      key: keyV === 'auto' ? null : { fifths: +keyV.split(',')[0], mode: keyV.split(',')[1] as 'major' | 'minor' },
      detail: $<HTMLSelectElement>('s-detail').value as Detail,
      followTempo: $<HTMLInputElement>('s-follow').checked,
    },
  };
}

async function openResult() {
  if (!current) return;
  $('tab-new').classList.add('hidden');
  $('tab-library').classList.add('hidden');
  $('result').classList.remove('hidden');
  settingsToForm(current.settings);
  await rescore();
}

let renderToken = 0;
async function rescore() {
  if (!current) return;
  const token = ++renderToken;
  $('status').textContent = 'Updating…';
  // Let the "Updating…" message paint before the (synchronous) work.
  await new Promise((r) => setTimeout(r, 20));
  try {
    result = makeScore(current.analysis, current.settings);
    const s = result.score;
    const counts = s.parts.map((p) => `${p.name}: ${p.staves.reduce((a, st) => a + st.measures.flat().filter((e) => e.pitches.length && !e.tieStop).length, 0)} notes`);
    $('detected').textContent =
      `Detected: ${keyLabel(s.key.fifths, s.key.mode)}, ${s.meter.beats}/${s.meter.beatType}, ♩≈${s.bpm}, ` +
      `${s.measures.length} bars. ${counts.join(' · ')}`;
    const width = $('score').clientWidth || window.innerWidth - 32;
    const pages = await renderPages(viewXml(), { width, zoom });
    if (token !== renderToken) return;
    $('score').innerHTML = pages.join('');
    $('status').textContent = '';
  } catch (e) {
    console.error(e);
    $('status').textContent = 'Could not draw the score: ' + (e instanceof Error ? e.message : String(e));
  }
}

let settingsTimer = 0;
async function onSettingsChanged() {
  if (!current) return;
  const next = formToSettings(current.settings);
  const sensChanged = next.sensitivity !== current.settings.sensitivity;
  current.settings = next;
  if (sensChanged && current.posteriors)
    current.analysis = analyseAll(current.posteriors, current.roll ?? null, current.audio ?? null, next.sensitivity);
  window.clearTimeout(settingsTimer);
  settingsTimer = window.setTimeout(() => {
    stopPlayback();
    void rescore();
    void persist();
  }, 250);
}
/** MusicXML of what is on screen (full score or one player's part). */
function viewXml(): string {
  return view === 'score' ? result!.musicxml : toMusicXML(result!.score, view);
}

$<HTMLSelectElement>('view').value = view;
$('view').addEventListener('change', () => {
  view = $<HTMLSelectElement>('view').value as ScoreView;
  localStorageSet('view', view);
  void rescore();
});

for (const id of ['s-meter', 's-bpm', 's-key', 's-detail', 's-follow', 's-bias', 's-sens', 'title'])
  $(id).addEventListener('change', onSettingsChanged);

$('settings-toggle').addEventListener('click', () => $('settings').classList.toggle('hidden'));
$('back').addEventListener('click', () => showTab('new'));

function setZoom(z: number) {
  zoom = Math.max(20, Math.min(90, z));
  localStorageSet('zoom', String(zoom));
  void rescore();
}
$('zoom-in').addEventListener('click', () => setZoom(zoom + 8));
$('zoom-out').addEventListener('click', () => setZoom(zoom - 8));

let resizeTimer = 0;
window.addEventListener('resize', () => {
  window.clearTimeout(resizeTimer);
  if (!$('result').classList.contains('hidden')) resizeTimer = window.setTimeout(() => void rescore(), 300);
});

// ------------------------------------------------------------------ playback

function stopPlayback() {
  stop();
  $('play').textContent = '▶ Play';
}
$('play').addEventListener('click', () => {
  if (isPlaying()) return stopPlayback();
  if (!result) return;
  play(result.score, stopPlayback);
  $('play').textContent = '■ Stop';
});

// ------------------------------------------------------------------ export

function baseName(withView = false) {
  const t = safeName(current?.settings.score.title ?? 'Sheet music');
  return withView && view !== 'score' ? `${t} - ${view === 'cello' ? 'Cello' : 'Piano'} part` : t;
}

async function withStatus(label: string, fn: () => Promise<string | void>) {
  $('status').textContent = label;
  try {
    const msg = await fn();
    $('status').textContent = msg || '';
  } catch (e) {
    if (e instanceof Error && /cancel/i.test(e.message)) $('status').textContent = '';
    else $('status').textContent = 'Failed: ' + (e instanceof Error ? e.message : String(e));
  }
}

async function pdfBlob(): Promise<Blob> {
  const { makePdf } = await import('./app/pdf');
  return makePdf(viewXml(), current!.settings.score.title);
}
const xmlBlob = () => new Blob([result!.musicxml], { type: 'application/vnd.recordare.musicxml+xml' });
const midiBlob = () => new Blob([result!.midi as BlobPart], { type: 'audio/midi' });

$('save-pdf').addEventListener('click', () => result && withStatus('Making PDF…', async () => saveFile(`${baseName(true)}.pdf`, await pdfBlob())));
$('save-xml').addEventListener('click', () => result && withStatus('Saving…', () => saveFile(`${baseName()}.musicxml`, xmlBlob())));
$('save-midi').addEventListener('click', () => result && withStatus('Saving…', () => saveFile(`${baseName()}.mid`, midiBlob())));
$('share').addEventListener('click', () =>
  result && withStatus('Preparing…', async () => shareFile(`${baseName(true)}.pdf`, await pdfBlob())),
);

// ------------------------------------------------------------------ library

async function refreshLibrary() {
  let items: Project[] = [];
  try {
    items = await listProjects();
  } catch {
    /* IndexedDB unavailable */
  }
  const ul = $('library');
  ul.innerHTML = '';
  $('library-empty').classList.toggle('hidden', items.length > 0);
  for (const p of items) {
    const li = document.createElement('li');
    const info = document.createElement('div');
    info.className = 'info';
    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = p.title;
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `${new Date(p.created).toLocaleDateString()} · ${formatDuration(p.duration)} · ${p.fileName}`;
    info.append(name, meta);
    info.addEventListener('click', async () => {
      const full = await getProject(p.id);
      if (!full) return;
      current = {
        id: full.id,
        title: full.title,
        fileName: full.fileName,
        created: full.created,
        analysis: fromStored(full.analysis),
        settings: full.settings,
      };
      await openResult();
    });
    const del = document.createElement('button');
    del.className = 'delete';
    del.textContent = 'Delete';
    del.addEventListener('click', async () => {
      if (!confirm(`Delete “${p.title}”?`)) return;
      await deleteProject(p.id);
      void refreshLibrary();
    });
    li.append(info, del);
    ul.append(li);
  }
}

// ------------------------------------------------------------------ offline support (web version)

if (!isNative() && 'serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
    // Warm the cache so the app also works offline before the first transcription.
    setTimeout(() => {
      void fetch('model/model.json');
      void fetch('model/group1-shard1of1.bin');
      void fetch('piano-model/weights_manifest.json')
        .then((r) => r.json())
        .then((m: { paths: string[] }[]) => m.flatMap((g) => g.paths).forEach((f) => void fetch(`piano-model/${f}`)))
        .catch(() => {});
      new Worker(new URL('./app/model.worker.ts', import.meta.url), { type: 'module' }).terminate();
      void import('./app/render');
      void import('verovio/wasm');
      void import('./app/pdf');
    }, 3000);
  });
}
