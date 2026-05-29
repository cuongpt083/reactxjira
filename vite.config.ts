import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const rawUrl = env['VITE_JIRA_URL'] ?? 'http://localhost:8080'
  const jiraUrl = new URL(rawUrl.endsWith('/') ? rawUrl : rawUrl + '/')
  const jiraOrigin = jiraUrl.origin
  const jiraContext = jiraUrl.pathname.replace(/\/$/, '')

  return {
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'ReactxJira',
        short_name: 'RxJira',
        description: 'Modern Jira UI',
        theme_color: '#5E6AD2',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^\/jira-api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'jira-api-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 300 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: {
    proxy: {
      '/jira-api': {
        target: jiraOrigin,
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/jira-api/, jiraContext),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      thresholds: { lines: 95, functions: 95, branches: 95, statements: 95 },
      exclude: [
        'src/main.tsx',
        'src/vite-env.d.ts',
        '**/*.d.ts',
        'src/theme/**',
        'src/types/**',
        'src/mocks/**',
        'src/App.tsx',
        'src/resources/**',
        'src/pages/**',
        'src/authProvider/LoginPage.tsx',
        'eslint.config.js',
        'vite.config.ts',
      ],
    },
  },
  }
})
