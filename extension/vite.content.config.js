import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Builds content.js as a single self-contained IIFE — no dynamic imports,
// no ES module syntax at runtime, fully CSP-safe for host pages.
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/content.js'),
      name: 'StickFigurePet',
      formats: ['iife'],
      fileName: () => 'content.js',
    },
    outDir: 'dist',
    emptyOutDir: false,
  },
});
