import {config} from 'dotenv';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

import pkg from './package.json';

const dependencies = [...Object.keys(pkg.dependencies)];

config();

const target = 'chrome100';

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
  },
};

const optimizeDeps = {
  esbuildOptions: {
    target,
  },
};

const esbuild = {
  target,
};

const build = {
  commonjsOptions: {
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
