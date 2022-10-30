import {config} from 'dotenv';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

import pkg from './package.json';

const dependencies = [...Object.keys(pkg.dependencies)];

config();

const target = 'chrome100';

const isContainer = typeof process.env['DOCKER'] !== 'undefined';
const host = isContainer ? 'host.docker.internal' : '0.0.0.0';

const plugins = [
  react({
    jsxRuntime: 'automatic',
    fastRefresh: true,
  }),
];

const server = {
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
};

const optimizeDeps = {
  esbuildOptions: {
    target,
  },
  include: ['@daml.js/daml-project'],
};

const esbuild = {
  target,
};

const build = {
  commonjsOptions: {
    include: [/\@daml\.js\/daml\-project/, /node_modules/],
    transformMixedEsModules: true,
  },
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
};

export default defineConfig({
  plugins,
  server,
  optimizeDeps,
  esbuild,
  build,
});
