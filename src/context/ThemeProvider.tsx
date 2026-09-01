'use client';

import type { PropsWithChildren } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { THEME_STORAGE_KEY } from '../lib/theme';
import type { Theme } from '../schema/types';
import { ThemeSchema } from '../schema/types';
import type { Nullish } from '../util/nullish';

type ThemeContextVal = {
  setTheme: (newTheme: Theme) => void;
  theme: Theme;
};
const context = createContext<Nullish<ThemeContextVal>>(null);

/** An explicit override, if the user ever picked one. Null means "follow the OS". */
function readStoredTheme(): Nullish<Theme> {
  try {
    const parsed = ThemeSchema.safeParse(
      localStorage.getItem(THEME_STORAGE_KEY),
    );
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

/** What the browser is actually rendering at this very moment. */
function readEffectiveTheme(): Theme {
  return getComputedStyle(document.documentElement).colorScheme === 'dark'
    ? 'dark'
    : 'light';
}

function applyThemeToDocument(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.classList.toggle('light', theme === 'light');
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setThemeState] = useState<Theme>('light');

  const setTheme = useCallback((newTheme: Theme) => {
    applyThemeToDocument(newTheme);
    setThemeState(newTheme);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // Storage blocked -- the theme still applies, it just won't survive a reload.
    }
  }, []);

  useEffect(() => {
    setThemeState(readEffectiveTheme());
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => {
      if (!readStoredTheme()) {
        setThemeState(readEffectiveTheme());
      }
    };

    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const providerVal = useMemo<ThemeContextVal>(
    () => ({
      setTheme,
      theme,
    }),
    [setTheme, theme],
  );

  return <context.Provider value={providerVal}>{children}</context.Provider>;
}

export function useTheme() {
  const ctx = useContext(context);
  if (!ctx) {
    throw new Error(
      'unable to useTheme() because no <ThemeProvider /> was found in the parent tree',
    );
  }

  return ctx;
}
