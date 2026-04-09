import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  build: {
    rollupOptions: {
      input: {
        main:   resolve(__dirname, 'index.html'),
        second: resolve(__dirname, 'second/index.html'),
      },
    },
  },
  server: {
    proxy: {
      '/api/espn': {
        target: 'https://site.api.espn.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/espn/, ''),
        secure: true,
      },
    },
  },
})
