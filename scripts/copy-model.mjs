// Copies the Basic Pitch model shipped inside the npm package into public/,
// so it is bundled with the app and works offline.
import { cpSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'node_modules/@spotify/basic-pitch/model');
const dest = join(root, 'public/model');
mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });
console.log('Copied Basic Pitch model to public/model');
