import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        designA: resolve(import.meta.dirname, 'design-a/index.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
