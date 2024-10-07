import { VitePWAOptions } from 'vite-plugin-pwa'

export const PwaOptions: Partial<VitePWAOptions> = {
  base: '/',
  registerType: 'autoUpdate',
  manifest: {
    name: 'Tariff Management',
    short_name: 'Tariffs',
    description: 'PWA приложение для управления тарифами',
    theme_color: 'rgb(18, 18, 18)'
  },
  workbox: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/your-api-url\/.*$/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24 * 30
          }
        }
      }
    ]
  }
}
