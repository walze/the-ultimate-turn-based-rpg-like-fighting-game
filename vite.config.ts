import { config } from 'dotenv';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

config();

console.log(path.join(__dirname, './src/'));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      target: 'chrome100',
    },
  },
  esbuild: {
    target: 'chrome100',
  },

  build: {
    polyfillModulePreload: false,
    target: 'chrome100',
  },
  define: {
    process: {
      env: process.env,
    },
  },
});
