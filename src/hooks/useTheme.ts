'use client';

import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'eyephi-theme' as const;

function getCurrentOsTheme(): Theme {
  if (typeof window !== 'undefined') {
    const m = window.matchMedia('(prefers-color-scheme: dark)');
    return m.matches ? 'dark' : 'light';
  }
  return 'dark';
}

/**
 * attempts to apply the desired theme to the document root.
 * if successful, returns true. else, returns false
 */
function applyThemeToDocument(theme: Theme) {
  if (typeof window !== 'undefined') {
    window.document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
    return true;
  }
  return false;
}

/** Reads the theme the inline layout script already applied, and persists changes to it. */
export function useTheme() {
  /** hooks */
  const [theme, setTheme] = useLocalStorage<Theme>(STORAGE_KEY, () =>
    getCurrentOsTheme(),
  );

  /** effects */
  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  return [theme, setTheme] as const;
}
