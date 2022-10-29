import {config} from 'dotenv';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

import pkg from './package.json';

const dependencies = [...Object.keys(pkg.dependencies)];

config();

const target = 'chrome100';

const isContainer = typeof process.env['DOCKER'] !== 'undefined';
const host = isContainer ? 'host.docker.internal' : '0.0.0.0';

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
      '/name': {
        target: 'https://names.drycodes.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/name/, ''),
      },
      '/api': {
        target: `http://${host}:7575`,
        changeOrigin: true,
        headers: {
          'reverse-proxy': 'vite',
        },
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/ws': {
        target: `ws://${host}:6865`,
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
  resolve: {
    alias: [
      {
        find: '@daml.js/daml-project',
        replacement: './daml.js/daml-project-1.0.0/lib/index.js',
      },
    ],
  },
  build: {
    modulePreload: {
      polyfill: false,
    },
    target,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const name = dependencies.find((dep) =>
            id.includes(dep),
          );

          if (name) {
            return name;
          }
        },
      },
    },
  },
});
