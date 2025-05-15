import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Force pure JavaScript implementation
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      // Force JS-only implementation without native modules
      treeshake: true,
      external: [
        '@rollup/rollup-linux-x64-gnu',
        '@rollup/rollup-linux-arm64-gnu',
        '@rollup/rollup-darwin-x64',
        '@rollup/rollup-win32-x64-msvc'
      ]
    }
  }
})