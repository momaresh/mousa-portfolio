import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mousa Marsh',
    short_name: 'Marsh',
    description:
      'Accountant specializing in financial operations, reporting, and ERP systems.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0c0f0e',
    theme_color: '#0c0f0e',
    icons: [
      {
        src: '/favicon-32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
