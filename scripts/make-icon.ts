// Writes public/icon.svg (app icon): the golden samovar on a warm tile background.
import { writeFileSync } from 'node:fs';
import { DEFS } from '../src/art/defs';
import { itemArt } from '../src/art/index';
const defs = DEFS.replace(/^[\s\S]*?<defs>/, '<defs>').replace(/<\/defs>[\s\S]*$/, '</defs>');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${defs}
<rect width="100" height="100" rx="22" fill="#e2507a"/><rect x="4" y="4" width="92" height="92" rx="19" fill="#fff3da"/>
<g transform="translate(8 6) scale(.84)">${itemArt({ chain: 'tea', level: 10 })}</g></svg>`;
writeFileSync('public/icon.svg', svg);
console.log('icon written');
