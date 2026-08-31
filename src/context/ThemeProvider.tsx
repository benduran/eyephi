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
import type { Nullish, Theme } from '../schema/types';
import { ThemeSchema } from '../schema/types';

type ThemeContextVal = {
  setTheme: (newTheme: Theme) => void;
  theme: Theme;
};
const context = createContext<Nullish<ThemeContextVal>>(null);

const STORAGE_KEY = 'eyephi-theme' as const;

/** An explicit override, if the user ever picked one. Null means "follow the OS". */
function readStoredTheme(): Nullish<Theme> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = ThemeSchema.safeParse(raw);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

/**
 * What the browser is actually rendering at this very moment
 */
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
  /** hooks */
  const [theme, setThemeState] = useState<Theme>('light');

  /** callbacks */
  const setTheme = useCallback((newTheme: Theme) => {
    applyThemeToDocument(newTheme);
    setThemeState(newTheme);

    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // Storage blocked -- the theme still applies, it just won't survive a reload.
    }
  }, []);

  /** effects */
  useEffect(() => {
    const stored = readStoredTheme();
    if (stored) {
      applyThemeToDocument(stored);
    }
    // setting theme is a synchronous op (the DOM will have fully painted by now)
    // so we can read what theme the browser actually has live and use it as state
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

  /** provider val */
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
