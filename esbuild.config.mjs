import { build } from 'esbuild';
import { resolve, join } from 'path';
import { readdir } from 'fs/promises'

const findFiles = async (folderName) => {
  const dir = resolve(`src/${folderName}`);
  const files = await readdir(dir);
  return files
    .filter((file) => file.endsWith('.ts'))
    .map((file) => join(dir, file));
}

const bundle = async () => {
  await build({
    entryPoints: await findFiles('entrypoints'),
    outdir: 'dist',
    platform: 'node',
    format: 'cjs',
    target: ['node22'],
    bundle: true,
    sourcemap: true,
    minify: true,
    treeShaking: true,
  });
}

await build({
  entryPoints: await findFiles('migrations/tasks'),
  outdir: 'dist/tasks',
  platform: 'node',
  format: 'cjs',
  target: ['node22'],
  bundle: true,
  sourcemap: false,
  minify: true,
  treeShaking: false,
});

void bundle().catch((error) => {
  console.error(error);
  process.exit(1);
});