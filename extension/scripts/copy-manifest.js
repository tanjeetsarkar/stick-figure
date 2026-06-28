import { copyFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

mkdirSync(resolve(root, 'dist'), { recursive: true });
copyFileSync(resolve(root, 'manifest.json'), resolve(root, 'dist', 'manifest.json'));
console.log('Copied manifest.json → dist/manifest.json');
