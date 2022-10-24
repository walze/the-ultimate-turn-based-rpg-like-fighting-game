import { config } from 'dotenv';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

config();

const target = 'chrome100';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      fastRefresh: true,
    }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      target,
    },
  },
  esbuild: {
    target,
  },

  build: {
    polyfillModulePreload: false,
    target,
  },
  define: {
    process: {
      env: process.env,
    },
  },
});
