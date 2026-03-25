import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');
const templatesSrc = join(process.cwd(), 'templates');
const stylesSrc = join(process.cwd(), 'styles');

if (!existsSync(dist)) {
  mkdirSync(dist, { recursive: true });
}

cpSync(templatesSrc, join(dist, 'templates'), { recursive: true });
cpSync(stylesSrc, join(dist, 'styles'), { recursive: true });
