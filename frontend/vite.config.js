import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
<<<<<<< HEAD
  // GitHub Pages 部署在子路径下，需要配置 base
  base: '/image-border-tool/',
=======
  // GitHub Pages 部署路径（GitHub Actions 部署到根目录）
  base: '/',
>>>>>>> 193424122d7bf12782dd99bf49a0fc43b4a0ed02
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
