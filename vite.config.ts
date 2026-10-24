import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));

export default defineConfig({
  base: './',
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  // Old targets on purpose: many Iranian phones run outdated Android System WebView
  // (no Google Play updates). esbuild lowers newer JS syntax and CSS such as `inset`.
  build: { target: 'chrome69', cssTarget: 'chrome61', assetsInlineLimit: 0, chunkSizeWarningLimit: 800 },
});
