import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Qunoot App',
        short_name: 'Qunoot',
        description: 'Track your daily prayers and maintain accountability',
        theme_color: '#1F4B3F',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: './',
        start_url: './',
        icons: [
          {
            src: '/icon.svg',
            type: 'image/svg+xml',
            sizes: '512x512'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg}']
      },
      devOptions: {
        enabled: true
      }
    })
  ]
})
