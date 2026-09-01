import './globals.css';

import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { AppHeader } from '../components/AppHeader';
import { Providers } from '../context/providers';
import { THEME_BOOTSTRAP_SCRIPT } from '../lib/theme';

export const metadata: Metadata = {
  description:
    'Get your brain and your eyeballs in-sync again by crafting your own vestibular rehabilitation program and completing exercises.',
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
