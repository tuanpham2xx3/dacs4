import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import taildwindcss from 'tailwindcss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  css: {
    postcss: {
      plugins: [taildwindcss]
    }
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      '@': path.resolve(__dirname, './src'),
    }
  }
})
