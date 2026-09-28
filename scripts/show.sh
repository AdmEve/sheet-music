#!/bin/sh
# Usage: scripts/show.sh analysis.json outprefix [mode] [detail]  -> outprefix-1.png
set -e
npx vite-node scripts/make-score.ts "$1" "$2" $3 $4
node scripts/render-svg.mjs "$2.musicxml" "$2"
NODE_PATH=/opt/node22/lib/node_modules node -e "
const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
await p.setContent('<body style=\"margin:0;background:#fff\">' + fs.readFileSync('$2-1.svg','utf8') + '</body>');
await p.screenshot({ path: '$2-1.png', fullPage: true }); await b.close(); })();"
