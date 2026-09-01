'use client';

import { Button } from '@primereact/ui/button';
import { useCallback, useMemo } from 'react';
import { scoreExercise } from '../lib/difficulty';
import { formatDifficultyScore, formatDuration } from '../lib/format';
import { PALETTES } from '../lib/palettes';
import type { Exercise } from '../schema/types';
import { ProgressMeter } from './ProgressMeter';

export type ProgramPanelItemProps = {
  exercise: Exercise;
  /** Position in the program, which is an entry's only identity. */
  index: number;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
};

export function ProgramPanelItem({
  exercise,
  index,
  onEdit,
  onRemove,
}: ProgramPanelItemProps) {
  const difficulty = useMemo(() => scoreExercise(exercise), [exercise]);

  // Bound here rather than in the parent's map, where a hook cannot be called.
  const edit = useCallback(() => onEdit(index), [index, onEdit]);
  const remove = useCallback(() => onRemove(index), [index, onRemove]);

  return (
    <div className="flex flex-col gap-2 border-b border-surface-100 px-4.5 py-3.5 dark:border-surface-800">
      <div className="flex items-baseline justify-between gap-2.5">
        <span className="text-tight font-medium tracking-tight">
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
        <span className="w-13 text-right font-mono text-meta text-muted-color">
          D {formatDifficultyScore(difficulty)}
        </span>
      </div>

      <div className="flex items-center gap-3.5">
        <span className="flex-1 font-mono text-tag uppercase tracking-wider text-muted-color">
          {`SPD ${exercise.speed} · INT ${exercise.intensity} · ${PALETTES[exercise.scheme].label}`}
        </span>
        <Button onClick={edit} severity="secondary" size="small" variant="link">
          Edit
        </Button>
        <Button
          onClick={remove}
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
