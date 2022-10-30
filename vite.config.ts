import {config} from 'dotenv';
import {defineConfig} from 'vite';
import {svelte} from '@sveltejs/vite-plugin-svelte';

import pkg from './package.json';

const dependencies = [...Object.keys(pkg.dependencies)];

config();

const target = 'chrome100';

const isContainer = typeof process.env['DOCKER'] !== 'undefined';
const host = isContainer ? 'host.docker.internal' : '0.0.0.0';

const plugins = [svelte({})];

const server = {
  host: true,
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
