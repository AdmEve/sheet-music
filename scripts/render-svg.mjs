// Usage: node scripts/render-svg.mjs in.musicxml out-prefix  -> out-prefix-1.svg ...
import { readFileSync, writeFileSync } from 'node:fs';
import createVerovioModule from 'verovio/wasm';
import { VerovioToolkit } from 'verovio/esm';
const [inp, out] = process.argv.slice(2);
const tk = new VerovioToolkit(await createVerovioModule());
tk.setOptions({ pageWidth: 2100, pageHeight: 2970, scale: 40, adjustPageHeight: true, footer: 'none' });
tk.loadData(readFileSync(inp, 'utf8'));
const log = tk.getLog();
if (log) console.log(log.slice(0, 2000));
for (let i = 1; i <= tk.getPageCount(); i++) writeFileSync(`${out}-${i}.svg`, tk.renderToSVG(i));
console.log('pages', tk.getPageCount());
