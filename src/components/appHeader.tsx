'use client';

import { Button } from '@primereact/ui/button';
import { formatDuration, toPercentage } from '../lib/format';
import type { Nullish, ProgramProgressView } from '../schema/types';
import { Centering } from './centering';
import { EyePhiLogo } from './eyePhiLogo';
import { ProgressMeter } from './progressMeter';
import { ThemeToggle } from './themeToggle';

export type AppHeaderProps = {
  onNewProgram: Nullish<() => void>;
  onPrimaryAction: Nullish<() => void>;
  onShare: Nullish<() => void>;
  primaryDisabled: boolean;
  primaryLabel: string;
  /** Non-null only while a program is running. */
  progress: Nullish<ProgramProgressView>;
  shareDisabled: boolean;
};

export function AppHeader({
  onNewProgram,
  onPrimaryAction,
  onShare,
  primaryDisabled,
  primaryLabel,
  progress,
  shareDisabled,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-surface-200 bg-surface-50/95 backdrop-blur-md dark:border-surface-700 dark:bg-surface-950/95">
      <Centering>
        <div className="flex h-16 items-center gap-3">
          <div className="flex flex-none items-center gap-2.5">
            <EyePhiLogo />
            <span className="text-base font-semibold tracking-tight">
              EyePhi
            </span>
          </div>

          <div className="flex min-w-0 flex-1 items-center justify-center">
            {progress && (
              <div className="hidden w-full max-w-130 items-center gap-3 wide:flex">
                <span className="font-mono text-xs tracking-wide text-surface-600 dark:text-surface-400">
                  {formatDuration(progress.elapsed)}
                </span>
                <ProgressMeter
                  ariaLabel="Program progress"
                  className="flex-1"
                  value={toPercentage(progress.elapsed, progress.total)}
                />
                <span className="font-mono text-xs tracking-wide text-surface-400 dark:text-surface-500">
                  {formatDuration(progress.total)}
                </span>
              </div>
            )}
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
            <ThemeToggle />
          </div>
        </div>
      </Centering>

      {progress && (
        <div className="flex items-center gap-2.5 px-4 pb-2.5 wide:hidden">
          <span className="font-mono text-[11px] text-surface-600 dark:text-surface-400">
            {formatDuration(progress.elapsed)}
          </span>
          <ProgressMeter
            ariaLabel="Program progress"
            className="flex-1"
            value={toPercentage(progress.elapsed, progress.total)}
          />
          <span className="font-mono text-[11px] text-surface-400 dark:text-surface-500">
            {formatDuration(progress.total)}
          </span>
        </div>
      )}
    </header>
  );
}
