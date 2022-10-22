import { config } from 'dotenv';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    polyfillModulePreload: true,
    target: 'esnext',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  define: {
    process: {
      env: process.env,
    },
  },
});
