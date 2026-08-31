'use client';

import { Button } from '@primereact/ui/button';

export type MobileSubmitBarProps = {
  countLabel: string;
  difficultyLabel: string;
  difficultyValue: string;
  onSubmit: () => void;
  totalTimeLabel: string;
};

/** Fixed bottom bar for the build view; hidden once the program panel becomes a sidebar. */
export function MobileSubmitBar({
  countLabel,
  difficultyLabel,
  difficultyValue,
  onSubmit,
  totalTimeLabel,
}: MobileSubmitBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-45 flex items-center gap-3 border-t border-surface-200 bg-surface-0/95 px-4 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur-md aside:hidden dark:border-surface-700 dark:bg-surface-900/95">
      <div className="min-w-0 flex-1">
        <div className="font-mono text-sm font-medium">
          {totalTimeLabel} · D {difficultyValue}
        </div>
        <div className="text-[11px] uppercase tracking-wide text-surface-400 dark:text-surface-500">
          {countLabel} · {difficultyLabel}
        </div>
      </div>
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
}
