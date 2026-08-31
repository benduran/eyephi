'use client';

import { Button } from '@primereact/ui/button';

export type RunControlsProps = {
  cueText: string;
  onEnterImmersive: () => void;
  onExitRun: () => void;
  onSkipStep: () => void;
  onTogglePause: () => void;
  pauseLabel: string;
};

export function RunControls({
  cueText,
  onEnterImmersive,
  onExitRun,
  onSkipStep,
  onTogglePause,
  pauseLabel,
}: RunControlsProps) {
  return (
    <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
      <Button onClick={onTogglePause}>{pauseLabel}</Button>
      <Button onClick={onSkipStep} severity="secondary" variant="outlined">
        Skip step
      </Button>
      <Button
        onClick={onEnterImmersive}
        severity="secondary"
        variant="outlined"
      >
        Full screen
      </Button>
      <Button onClick={onExitRun} severity="secondary" variant="link">
        Exit to editor
      </Button>
      <span className="ml-auto text-[13px] text-surface-500 dark:text-surface-400">
        {cueText}
      </span>
    </div>
  );
}
