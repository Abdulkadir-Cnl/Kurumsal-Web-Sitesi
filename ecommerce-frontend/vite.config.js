import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/cms': {
        target: 'https://localhost:7137',
        changeOrigin: true,
        secure: false
      },
      '/api': {
        target: 'https://localhost:7137',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
