import { VitePWAOptions } from 'vite-plugin-pwa'

export const PwaOptions: Partial<VitePWAOptions> = {
  base: '/',
  registerType: 'autoUpdate',
  pwaAssets: {
    disabled: false,
    config: 'pwa/pwa-assets.config.ts'
  },
  manifest: {
    name: 'Tariff Management',
    short_name: 'Tariffs',
    description: 'PWA приложение для управления тарифами',
    theme_color: 'rgb(18, 18, 18)',
    screenshots: [
      {
        src: 'pwa-screenshots/pwa-desk1.png',
        sizes: '600x320',
        type: 'image/png',
        form_factor: 'wide'
      },
      {
        src: 'pwa-screenshots/pwa-desk2.png',
        sizes: '600x320',
        type: 'image/png',
        form_factor: 'wide'
      },
      {
        src: 'pwa-screenshots/pwa-mobile1.png',
        sizes: '993x1290',
        type: 'image/png',
        form_factor: 'narrow'
      },
      {
        src: 'pwa-screenshots/pwa-mobile2.png',
        sizes: '993x1290',
        type: 'image/png',
        form_factor: 'narrow'
      }
    ]
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
