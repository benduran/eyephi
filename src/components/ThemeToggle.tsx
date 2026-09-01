'use client';

import { MoonIcon, SunIcon } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@primereact/ui/button';
import { useCallback } from 'react';
import { useTheme } from '../context/ThemeProvider';
import type { Theme } from '../schema/types';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const next: Theme = theme === 'dark' ? 'light' : 'dark';
  const label = `Switch to ${next} theme`;

  const onClick = useCallback(() => setTheme(next), [next, setTheme]);

  return (
    <Button
      aria-label={label}
      iconOnly
      onClick={onClick}
      severity="secondary"
      title={label}
      variant="outlined"
    >
      {theme === 'dark' ? <SunIcon aria-hidden /> : <MoonIcon aria-hidden />}
    </Button>
  );
}
