import type { Metadata } from 'next'
import { Providers } from '@/components/providers'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mousamarsh.com'

const siteDescription =
  'Accountant specializing in financial operations, reporting, retail accounting, and ERP systems (Mutakamil Plus · Onyx Pro).'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Mousa Marsh | Accountant & Financial Operations',
    template: '%s | Mousa Marsh',
  },
  description: siteDescription,
  applicationName: 'Mousa Marsh Portfolio',
  keywords: [
    'Mousa Marsh',
    'موسى مارش',
    'accountant',
    'محاسب',
    'financial accounting',
    'Mutakamil Plus',
    'Onyx Pro',
    'financial reporting',
    'internal audit',
    'Yemen',
  ],
  authors: [{ name: 'Mousa Marsh', url: siteUrl }],
  creator: 'Mousa Marsh',
  publisher: 'Mousa Marsh',
  category: 'finance',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'ar_YE',
    alternateLocale: ['en_US'],
    url: '/',
    siteName: 'Mousa Marsh',
    title: 'Mousa Marsh | Accountant & Financial Operations',
    description: siteDescription,
    images: [
      {
        url: '/images/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Mousa Marsh — Accountant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mousa Marsh | Accountant & Financial Operations',
    description: siteDescription,
    images: ['/images/og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  other: {
    'theme-color': '#0c0f0e',
  },
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Mousa Abdulhafiz Qaid Marsh',
  alternateName: 'موسى عبدالحافظ قائد مارش',
  url: siteUrl,
  image: `${siteUrl}/images/avatar.jpg`,
  jobTitle: 'Accountant',
  description: siteDescription,
  email: 'mousamarsh111@gmail.com',
  telephone: '+966594136051',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ibb',
    addressCountry: 'YE',
  },
  knowsAbout: [
    'Financial accounting',
    'Financial reporting',
    'Internal auditing',
    'Mutakamil Plus',
    'Onyx Pro ERP',
    'Branch operations',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('mousa-theme');var theme=(t==='light'||t==='dark')?t:'dark';document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;}catch(e){document.documentElement.dataset.theme='dark';}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
