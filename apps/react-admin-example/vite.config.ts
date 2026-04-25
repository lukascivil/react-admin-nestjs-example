import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  build: {
    outDir: '../../build/apps/react-admin-example'
  },
  server: {
    open: true,
    port: 3001,
    strictPort: true
  }
})
