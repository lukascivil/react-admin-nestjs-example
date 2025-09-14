import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [viteTsconfigPaths(), react()],
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
