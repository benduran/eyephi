'use client';

import { formatDifficultyScore, scoreProgram } from '../lib/difficulty';
import { formatDuration } from '../lib/format';
import type { Exercise } from '../schema/types';

export type RunStepListProps = {
  currentIndex: number;
  exercises: Exercise[];
};

export function RunStepList({ currentIndex, exercises }: RunStepListProps) {
  return (
    <aside className="overflow-hidden rounded-lg border border-surface-200 dark:border-surface-700">
      <div className="border-b border-surface-100 px-4.5 py-3.5 text-sm font-semibold dark:border-surface-800">
        Steps
      </div>

      <ol className="flex flex-col">
        {exercises.map((exercise, index) => (
          <li
            aria-current={index === currentIndex ? 'step' : undefined}
            className={`flex items-baseline gap-3 border-b border-surface-100 px-4.5 py-2.5 text-sm dark:border-surface-800 ${
              index === currentIndex
                ? 'bg-surface-100 font-medium dark:bg-surface-800'
                : 'text-muted-color'
            }`}
            // Position in the program is a step's only identity, so it is the key.
            key={`${exercise.type}-${index}`}
          >
            <span className="font-mono text-xs">{index + 1}</span>
            <span className="flex-1">{exercise.displayName}</span>
            <span className="font-mono text-xs">
              {formatDuration(exercise.duration)}
            </span>
          </li>
        ))}
      </ol>

      <div className="flex items-baseline justify-between px-4.5 py-3.5">
        <span className="text-sm text-muted-color">Difficulty</span>
        <span className="font-mono text-sm font-medium">
          {formatDifficultyScore(scoreProgram(exercises))}
        </span>
      </div>
    </aside>
  );
}
