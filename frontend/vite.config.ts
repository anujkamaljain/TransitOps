import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('recharts') || id.includes('d3-')) return 'charts'
          if (id.includes('socket.io') || id.includes('@tanstack') || id.includes('axios'))
            return 'data-vendor'
          if (
            id.includes('react-router') ||
            id.includes('react-dom') ||
            id.includes('radix')
          )
            return 'react-vendor'
          return undefined
        },
      },
    },
  },
})
