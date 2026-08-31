'use client';

import { Card } from '@primereact/ui/card';
import type { RunStepView } from '../schema/types';

export type RunStepListProps = {
  difficultyValue: string;
  steps: RunStepView[];
};

const NAME_TONE = {
  complete: 'text-surface-400 dark:text-surface-500',
  current: 'text-surface-900 dark:text-surface-0',
  upcoming: 'text-surface-600 dark:text-surface-400',
} as const;

const META_TONE = {
  complete: 'text-surface-300 dark:text-surface-600',
  current: 'text-surface-600 dark:text-surface-400',
  upcoming: 'text-surface-300 dark:text-surface-600',
} as const;

export function RunStepList({ difficultyValue, steps }: RunStepListProps) {
  return (
    <Card.Root className="overflow-hidden p-0 aside:sticky aside:top-[88px]">
      <div className="border-b border-surface-100 px-4 py-3.5 text-[13px] font-semibold dark:border-surface-800">
        Steps
      </div>

      <ol className="m-0 flex list-none flex-col p-0">
        {steps.map((step) => (
          <li
            aria-current={step.state === 'current' ? 'step' : undefined}
            className={`flex items-center gap-2.5 border-b border-surface-100 px-4 py-3 dark:border-surface-800 ${
              step.state === 'current'
                ? 'bg-surface-100 dark:bg-surface-800'
                : ''
            }`}
            key={step.id}
          >
            <span
              className={`w-[18px] font-mono text-[11px] ${META_TONE[step.state]}`}
            >
              {step.num}
            </span>
            <span className={`flex-1 text-[13px] ${NAME_TONE[step.state]}`}>
              {step.name}
            </span>
            <span className={`font-mono text-[11px] ${META_TONE[step.state]}`}>
              {step.durationLabel}
            </span>
          </li>
        ))}
      </ol>

      <div className="flex items-baseline justify-between bg-surface-50 px-4 py-3.5 dark:bg-surface-900">
        <span className="text-xs text-surface-500 dark:text-surface-400">
          Difficulty
        </span>
        <span className="font-mono text-[13px]">{difficultyValue}</span>
      </div>
    </Card.Root>
  );
}
