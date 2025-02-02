import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { buffer } from 'stream/consumers';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/demo-blockchain-integrations/',
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        404: resolve(__dirname, 'public/404.html'),
      },
    },
  },
  resolve: {
    alias: {
      buffer: 'vite-plugin-node-polyfills/shims/buffer',
    },
  },
  plugins: [nodePolyfills({ buffer: true }), react()],
});
