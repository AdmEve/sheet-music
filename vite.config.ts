import { defineConfig } from 'vite';

export default defineConfig({
  // Relative paths so the same build works inside the Android app and on any web host.
  base: './',
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 12000,
  },
  worker: {
    format: 'es',
  },
  optimizeDeps: {
    exclude: ['verovio'],
  },
});
