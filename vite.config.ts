import { config } from 'dotenv';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  build: {
    polyfillModulePreload: false,
    target: 'esnext',
  },
  define: {
    process: {
      env: process.env,
    },
  },
});
