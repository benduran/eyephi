'use client';

import { Button } from '@primereact/ui/button';

export type RunControlsProps = {
  immersive: boolean;
  onBack: () => void;
  onExit: () => void;
  onSkip: () => void;
  onToggleImmersive: () => void;
  onTogglePaused: () => void;
  paused: boolean;
};

export function RunControls({
  immersive,
  onBack,
  onExit,
  onSkip,
  onToggleImmersive,
  onTogglePaused,
  paused,
}: RunControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        onClick={onBack}
        severity="secondary"
        size="small"
        variant="outlined"
      >
        Previous
      </Button>
      <Button onClick={onTogglePaused} size="small">
        {paused ? 'Resume' : 'Pause'}
      </Button>
      <Button
        onClick={onSkip}
        severity="secondary"
        size="small"
        variant="outlined"
      >
        Skip
      </Button>
      <Button
        onClick={onToggleImmersive}
        severity="secondary"
        size="small"
        variant="outlined"
      >
        {immersive ? 'Windowed' : 'Full screen'}
      </Button>
      {!immersive && (
        <Button
          onClick={onExit}
          severity="secondary"
          size="small"
          variant="link"
        >
          Exit to editor
        </Button>
      )}
    </div>
  );
}
