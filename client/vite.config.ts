import path from 'path'
import { defineConfig, loadEnv } from 'vite'

import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const port = env.VITE_APP_BACKEND_PORT
  const domain = env.VITE_APP_BACKEND_DOMAIN
  const protocol = JSON.parse(env.VITE_APP_BACKEND_ISSSL) ? 'https' : 'http'
  const proxyTarget = `${protocol}://${domain}:${port}`
  const globalPrefix = env.VITE_APP_GLOBAL_PREFIX
  return {
    plugins: [react()],
    base: globalPrefix,
    build: {
      outDir: '../server/public',
      chunkSizeWarningLimit: 6000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules')[1].split('/')[0].toString()
            }
          },
        },
      },
    },
    server: {
      port: 4000,
      host: '0.0.0.0',
      open: true,
      proxy: {
        [globalPrefix + env.VITE_APP_SUFFIX]: {
          target: proxyTarget,
          changeOrigin: true,
        },
        [globalPrefix + '/api']: {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '~': path.resolve(__dirname, '../src'),
      },
    },
  }
})
