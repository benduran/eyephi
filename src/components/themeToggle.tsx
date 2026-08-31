'use client';

import { MoonIcon, SunIcon } from '@phosphor-icons/react';
import { Button } from '@primereact/ui/button';
import { useTheme } from '../context/ThemeProvider';
import type { Theme } from '../schema/types';

export function ThemeToggle() {
  /** context */
  const { theme, setTheme } = useTheme();

  const next: Theme = theme === 'dark' ? 'light' : 'dark';
  const label = `Switch to ${next} theme`;

  return (
    <Button
      aria-label={label}
      iconOnly
      onClick={() => setTheme(next)}
      severity="secondary"
      title={label}
      variant="outlined"
    >
      {theme === 'dark' ? <SunIcon aria-hidden /> : <MoonIcon aria-hidden />}
    </Button>
  );
}
