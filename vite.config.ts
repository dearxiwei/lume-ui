import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const r = (p: string) => new URL(p, import.meta.url).pathname

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': r('./src') }
  },
  server: { host: true, port: 5180 },
  build: {
    target: 'es2019',
    lib: {
      entry: r('./src/index.ts'),
      name: 'Lume',
      fileName: (format) => (format === 'es' ? 'lume.js' : 'lume.umd.cjs'),
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['vue'],
      output: { globals: { vue: 'Vue' }, assetFileNames: 'lume.[ext]' }
    }
  }
})
