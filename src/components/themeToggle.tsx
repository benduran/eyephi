'use client';

import { MoonIcon, SunIcon } from '@phosphor-icons/react';
import { Button } from '@primereact/ui/button';
import type { Theme } from '../hooks/useTheme';

export type ThemeToggleProps = {
  onThemeChange: (theme: Theme) => void;
  theme: Theme;
};

export function ThemeToggle({ onThemeChange, theme }: ThemeToggleProps) {
  const next: Theme = theme === 'dark' ? 'light' : 'dark';
  const label = `Switch to ${next} theme`;

  return (
    <Button
      aria-label={label}
      iconOnly
      onClick={() => onThemeChange(next)}
      severity="secondary"
      title={label}
      variant="outlined"
    >
      {theme === 'dark' ? <SunIcon aria-hidden /> : <MoonIcon aria-hidden />}
    </Button>
  );
}
