import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    https: false, // Set to true in production with proper certificates
  },
  define: {
    global: 'globalThis',
  },
})
