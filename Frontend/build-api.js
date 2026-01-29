import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

build({
  entryPoints: [join(__dirname, 'server/server.ts')],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outfile: join(__dirname, 'api/server-bundle.js'),
  external: ['express', 'cors', 'dotenv', 'bcryptjs', 'jsonwebtoken', '@supabase/supabase-js'],
  banner: {
    js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);"
  }
}).catch(() => process.exit(1));