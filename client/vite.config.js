import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
  },
  // 👇 Ye line sabse important hai — frontend routes ke liye fallback enable karta hai
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // 👇 Ye Vercel ke liye fix hai
  preview: {
    port: 4173,
  },
  // 👇 Most important — this ensures all routes fallback to index.html
  optimizeDeps: {},
  base: '/',
})
