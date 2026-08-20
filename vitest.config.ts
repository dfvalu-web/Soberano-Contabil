import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@soberano/core': path.resolve(__dirname, './packages/core/src/index.ts')
    }
  },
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 30000
  }
});
