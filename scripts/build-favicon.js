#!/usr/bin/env node
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceSvg = join(root, 'public', 'favicon.svg');
const outIco = join(root, 'public', 'favicon.ico');
const sizes = [16, 32, 48, 64];

const which = spawnSync('which', ['convert']);
if (which.status !== 0) {
  console.error('Error: ImageMagick `convert` not found. Install with: sudo apt install imagemagick');
  process.exit(1);
}

const result = spawnSync('convert', [
  '-background', 'none',
  '-density', '384',
  sourceSvg,
  '-define', `icon:auto-resize=${sizes.join(',')}`,
  outIco,
], { stdio: 'inherit' });

if (result.status !== 0) {
  console.error('convert failed');
  process.exit(result.status ?? 1);
}

console.log(`✓ wrote public/favicon.ico (${sizes.join(', ')})`);
