import { Button } from '@primereact/ui/button';
import {
  formatDifficultyScore,
  formatDuration,
  formatExerciseCount,
} from '../lib/format';
import { toDifficultyBandLabel } from '../lib/labels';
import type { DifficultyBand } from '../schema/types';

export type MobileSubmitBarProps = {
  band: DifficultyBand;
  difficulty: number;
  exerciseCount: number;
  onSubmit: () => void;
  totalSeconds: number;
};

// PrimeReact has no fixed action bar; the bottom padding clears the phone home indicator.
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
        <div className="text-meta uppercase tracking-wide text-muted-color">
          {`${formatExerciseCount(exerciseCount)} · ${toDifficultyBandLabel(band)}`}
        </div>
      </div>
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
}
