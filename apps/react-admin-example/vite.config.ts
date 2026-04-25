import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../build/apps/react-admin-example',
    cssMinify: 'esbuild'
  },
  server: {
    open: true,
    port: 3001,
    strictPort: true
  }
})
