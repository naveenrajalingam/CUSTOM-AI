import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Two entry pages, one app: the homepage and the original /design-a/ URL.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        designA: resolve(import.meta.dirname, 'design-a/index.html'),
      },
    },
  },
  server: { port: 3000 },
})
