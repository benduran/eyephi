import './globals.css';

import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { AppHeader } from '../components/appHeader';
import { Providers } from '../context/providers';

export const metadata: Metadata = {
  description:
    'Get your brain and your eyeballs in-sync again by crafting your own vestibular rehabilitation program and completing exercises.',
  title: 'EyePhi',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html className="h-full" lang="en" suppressHydrationWarning>
      <body className="min-h-full">
        <Providers>
          <AppHeader />
          <div className="pt-3">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
