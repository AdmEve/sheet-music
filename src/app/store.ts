// Library of past transcriptions, kept on the device (IndexedDB). Holds the analysed notes,
// so a saved piece can be re-scored with new settings without re-running the AI.
import type { Settings } from '../engine/pipeline';
import type { Analysis } from '../engine/types';

export interface Project {
  id: string;
  title: string;
  fileName: string;
  created: number;
  duration: number;
  analysis: Omit<Analysis, 'onsetEnv'> & { onsetEnv: number[] };
  settings: Settings;
}

const DB = 'sheet-music';
const STORE = 'projects';

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE, { keyPath: 'id' });
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const req = fn(t.objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function toStored(a: Analysis): Project['analysis'] {
  return { ...a, onsetEnv: Array.from(a.onsetEnv) };
}

export function fromStored(a: Project['analysis']): Analysis {
  return { ...a, onsetEnv: new Float32Array(a.onsetEnv) };
}

export const saveProject = (p: Project) => tx('readwrite', (s) => s.put(p));
export const deleteProject = (id: string) => tx('readwrite', (s) => s.delete(id));
export const getProject = (id: string) => tx<Project | undefined>('readonly', (s) => s.get(id));
export async function listProjects(): Promise<Project[]> {
  const all = await tx<Project[]>('readonly', (s) => s.getAll());
  return all.sort((a, b) => b.created - a.created);
}
