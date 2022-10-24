import { config } from 'dotenv';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://host.docker.internal:7575',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/ws': {
        target: 'ws://host.docker.internal:6865',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/ws/, ''),
      },
    },
  },
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
