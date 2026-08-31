import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  description:
    'Get your brain and your eyeballs in-sync again by crafting your own vestibular rehabilitation program and completing exercises.',
  title: 'EyePhi',
};

// Runs before first paint so the stored theme never flashes. Must stay in sync
// with the storage key and class/color-scheme pair in hooks/useTheme.ts.
const themeScript = `(() => {
  let stored = null;
  try {
    stored = localStorage.getItem('eyephi-theme');
  } catch {}
  const theme =
    stored === 'light' || stored === 'dark'
      ? stored
      : window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.style.colorScheme = theme;
})();`;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html className="h-full" lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
