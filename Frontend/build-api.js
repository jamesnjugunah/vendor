import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read package.json to get all dependencies
const packageJson = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf-8'));
const dependencies = Object.keys(packageJson.dependencies || {});

build({
  entryPoints: [join(__dirname, 'server/server.ts')],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outfile: join(__dirname, 'api/server-bundle.js'),
  external: dependencies, // Automatically exclude all dependencies
  banner: {
    js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);"
  }
}).catch(() => process.exit(1));