'use client';

import { Button } from '@primereact/ui/button';
import { formatDifficultyScore } from '../lib/difficulty';
import { formatDuration } from '../lib/format';
import { toDifficultyBandLabel } from '../lib/labels';
import type { DifficultyBand } from '../schema/types';

export type MobileSubmitBarProps = {
  band: DifficultyBand;
  difficulty: number;
  exerciseCount: number;
  onSubmit: () => void;
  totalSeconds: number;
};

// PrimeReact has no fixed action bar, so this one is hand-built. The bottom
// padding clears the home indicator on phones.
export function MobileSubmitBar({
  band,
  difficulty,
  exerciseCount,
  onSubmit,
  totalSeconds,
}: MobileSubmitBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-45 flex items-center gap-3 border-t border-surface-200 bg-surface-0/95 px-4 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur-md sidebyside:hidden dark:border-surface-700 dark:bg-surface-950/95">
      <div className="min-w-0 flex-1">
        <div className="font-mono text-sm font-medium">
          {`${formatDuration(totalSeconds)} · D ${formatDifficultyScore(difficulty)}`}
        </div>
        <div className="text-[11px] uppercase tracking-wide text-muted-color">
          {`${exerciseCount} ${exerciseCount === 1 ? 'exercise' : 'exercises'} · ${toDifficultyBandLabel(band)}`}
        </div>
      </div>
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
}
