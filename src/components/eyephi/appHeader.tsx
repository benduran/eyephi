'use client';

import { Button } from '@primereact/ui/button';
import type { Theme } from '../../hooks/useTheme';
import { EyePhiLogo } from './eyePhiLogo';
import { ProgressMeter } from './progressMeter';
import { ThemeToggle } from './themeToggle';
import type { ProgramProgressView } from './types';

export type AppHeaderProps = {
  onNewProgram: () => void;
  onPrimaryAction: () => void;
  onShare: () => void;
  onThemeChange: (theme: Theme) => void;
  primaryDisabled: boolean;
  primaryLabel: string;
  /** Non-null only while a program is running. */
  progress: ProgramProgressView | null;
  shareDisabled: boolean;
  theme: Theme;
};

export function AppHeader({
  onNewProgram,
  onPrimaryAction,
  onShare,
  onThemeChange,
  primaryDisabled,
  primaryLabel,
  progress,
  shareDisabled,
  theme,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-surface-200 bg-surface-50/95 backdrop-blur-md dark:border-surface-700 dark:bg-surface-950/95">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-3 px-4 wide:gap-6 wide:px-7">
        <div className="flex flex-none items-center gap-2.5">
          <EyePhiLogo />
          <span className="text-[17px] font-semibold tracking-tight">
            EyePhi
          </span>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-center">
          {progress ? (
            <div className="hidden w-full max-w-[520px] items-center gap-3 wide:flex">
              <span className="font-mono text-xs tracking-wide text-surface-600 dark:text-surface-400">
                {progress.elapsedLabel}
              </span>
              <ProgressMeter
                ariaLabel="Program progress"
                className="flex-1"
                value={progress.progressPct}
              />
              <span className="font-mono text-xs tracking-wide text-surface-400 dark:text-surface-500">
                {progress.totalTimeLabel}
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex flex-none items-center gap-2">
          <Button disabled={primaryDisabled} onClick={onPrimaryAction}>
            {primaryLabel}
          </Button>
          <Button
            onClick={onNewProgram}
            severity="secondary"
            variant="outlined"
          >
            New
          </Button>
          <Button
            disabled={shareDisabled}
            onClick={onShare}
            severity="secondary"
            variant="outlined"
          >
            Share
          </Button>
          <ThemeToggle onThemeChange={onThemeChange} theme={theme} />
        </div>
      </div>

      {progress ? (
        <div className="flex items-center gap-2.5 px-4 pb-2.5 wide:hidden">
          <span className="font-mono text-[11px] text-surface-600 dark:text-surface-400">
            {progress.elapsedLabel}
          </span>
          <ProgressMeter
            ariaLabel="Program progress"
            className="flex-1"
            value={progress.progressPct}
          />
          <span className="font-mono text-[11px] text-surface-400 dark:text-surface-500">
            {progress.totalTimeLabel}
          </span>
        </div>
      ) : null}
    </header>
  );
}
