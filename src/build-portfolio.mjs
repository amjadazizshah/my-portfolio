import { cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const source = fileURLToPath(new URL('../creative-portfolio/', import.meta.url));
const output = fileURLToPath(new URL('./build/', import.meta.url));
await rm(output, { recursive: true, force: true });
await cp(source, output, { recursive: true });
console.log('Built portfolio with updated service pricing, case studies and interactive workflow demo.');
