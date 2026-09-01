'use client';

import { Button } from '@primereact/ui/button';
import { formatDifficultyScore, scoreExercise } from '../lib/difficulty';
import { formatDuration } from '../lib/format';
import { PALETTES } from '../lib/palettes';
import type { Exercise } from '../schema/types';
import { ProgressMeter } from './progressMeter';

export type ProgramPanelItemProps = {
  exercise: Exercise;
  onEdit: () => void;
  onRemove: () => void;
};

export function ProgramPanelItem({
  exercise,
  onEdit,
  onRemove,
}: ProgramPanelItemProps) {
  const difficulty = scoreExercise(exercise);

  return (
    <div className="flex flex-col gap-2 border-b border-surface-100 px-4.5 py-3.5 dark:border-surface-800">
      <div className="flex items-baseline justify-between gap-2.5">
        <span className="text-[13px] font-medium tracking-tight">
          {exercise.displayName}
        </span>
        <span className="font-mono text-xs">
          {formatDuration(exercise.duration)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <ProgressMeter
          ariaLabel={`${exercise.displayName} difficulty`}
          className="flex-1"
          thickness={3}
          value={difficulty * 10}
        />
        <span className="w-13 text-right font-mono text-[11px] text-muted-color">
          D {formatDifficultyScore(difficulty)}
        </span>
      </div>

      <div className="flex items-center gap-3.5">
        <span className="flex-1 font-mono text-[10px] uppercase tracking-wider text-muted-color">
          {`SPD ${exercise.speed} · INT ${exercise.intensity} · ${PALETTES[exercise.scheme].label}`}
        </span>
        <Button
          onClick={onEdit}
          severity="secondary"
          size="small"
          variant="link"
        >
          Edit
        </Button>
        <Button
          onClick={onRemove}
          severity="secondary"
          size="small"
          variant="link"
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
