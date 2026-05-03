#!/usr/bin/env node
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const names = process.argv.slice(2);
if (names.length === 0) {
  console.error('Usage: npm run get-svg <name> [<name>...]');
  console.error('Example: npm run get-svg linkedin github');
  console.error('Browse logos: https://svgl.app');
  process.exit(1);
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src', 'assets', 'logos');
await mkdir(outDir, { recursive: true });

const toPascal = (s) =>
  s.split(/[-_]/).map((p) => p[0].toUpperCase() + p.slice(1)).join('');

let failed = 0;
for (const name of names) {
  const url = `https://api.svgl.app/svg/${name}.svg`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`✗ ${name}: ${res.status} ${res.statusText} — not on svgl.app`);
    failed++;
    continue;
  }
  const svg = await res.text();
  await writeFile(join(outDir, `${name}.svg`), svg);
  console.log(`✓ saved src/assets/logos/${name}.svg`);
  console.log(`    import ${toPascal(name)} from '../assets/logos/${name}.svg';`);
  console.log(`    <${toPascal(name)} class="w-8 h-8" />`);
}

process.exit(failed ? 1 : 0);
