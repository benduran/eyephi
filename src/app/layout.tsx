import './globals.css';

import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { AppHeader } from '../components/AppHeader';
import { Providers } from '../context/providers';
import { THEME_BOOTSTRAP_SCRIPT } from '../lib/theme';

export const metadata: Metadata = {
  description:
    'Get your brain and your eyeballs in-sync again by crafting your own vestibular rehabilitation program and completing exercises.',
  icons: {
    apple: [
      { sizes: '180x180', type: 'image/png', url: '/apple-touch-icon.png' },
    ],
    icon: [
      { type: 'image/svg+xml', url: '/favicon.svg' },
      { sizes: '16x16', type: 'image/png', url: '/favicon-16x16.png' },
      { sizes: '32x32', type: 'image/png', url: '/favicon-32x32.png' },
      { sizes: '48x48', type: 'image/png', url: '/favicon-48x48.png' },
    ],
  },
  manifest: '/site.webmanifest',
  title: 'EyePhi',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html className="h-full" lang="en" suppressHydrationWarning>
      <head>
        {/* Inline and blocking: a stored theme has to land before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
      </head>
      <body className="min-h-full">
        <Providers>
          <AppHeader />
          <div className="pt-3">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
