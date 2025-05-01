import { build } from 'esbuild';
import { resolve, join } from 'path';
import { readdir } from 'fs/promises'

const findMigrations = async (folderName) => {
  const dir = resolve(`src/${folderName}`);
  const files = await readdir(dir);
  return files.map((file) => join(dir, file));
}

const bundle = async () => {
  await build({
    entryPoints: await findMigrations('entrypoints'),
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
  entryPoints: await findMigrations('migrations'),
  outdir: 'dist/migrations',
  platform: 'node',
  format: 'cjs',
  target: ['node22'],
  bundle: false,
  sourcemap: false,
  minify: true,
  treeShaking: false,
});

void bundle().catch((error) => {
  console.error(error);
  process.exit(1);
});