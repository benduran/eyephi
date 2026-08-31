'use client';

import { Card } from '@primereact/ui/card';
import type { ExerciseView } from '../schema/types';

export type ExerciseCardProps = {
  exercise: ExerciseView;
  onConfigure: (id: string) => void;
};

export function ExerciseCard({ exercise, onConfigure }: ExerciseCardProps) {
  return (
    <Card.Root
      as="button"
      className="flex min-h-[150px] w-full cursor-pointer flex-col gap-2.5 p-[18px] text-left transition-colors hover:border-surface-400 dark:hover:border-surface-500"
      onClick={() => onConfigure(exercise.id)}
      type="button"
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[15px] font-semibold tracking-tight">
          {exercise.name}
        </span>
        <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.08em] text-surface-400 dark:text-surface-500">
          {exercise.category}
        </span>
      </div>

      <p className="m-0 flex-1 text-[13px] leading-relaxed text-surface-500 dark:text-surface-400">
        {exercise.blurb}
      </p>

      <div className="flex items-center justify-between border-t border-surface-100 pt-2.5 dark:border-surface-800">
        <span className="font-mono text-[11px] text-surface-500 dark:text-surface-400">
          {exercise.defaultLabel}
        </span>
        <span className="text-xs font-medium">Configure →</span>
      </div>
    </Card.Root>
  );
}
