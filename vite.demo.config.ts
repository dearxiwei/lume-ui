import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 独立构建 playground 为静态站点（相对路径，便于任意子路径/静态托管）
export default defineConfig({
  plugins: [vue()],
  base: './',
  build: {
    outDir: 'demo-dist',
    emptyOutDir: true,
    target: 'es2019'
  }
})
