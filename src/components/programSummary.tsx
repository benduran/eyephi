'use client';

import { Button } from '@primereact/ui/button';
import { ProgressMeter } from './progressMeter';

export type ProgramSummaryProps = {
  difficultyLabel: string;
  difficultyPct: number;
  difficultyValue: string;
  onSubmit: () => void;
  totalTimeLabel: string;
};

export function ProgramSummary({
  difficultyLabel,
  difficultyPct,
  difficultyValue,
  onSubmit,
  totalTimeLabel,
}: ProgramSummaryProps) {
  return (
    <div className="flex flex-col gap-2.5 border-t border-surface-200 bg-surface-50 px-[18px] py-4 dark:border-surface-700 dark:bg-surface-900">
      <div className="flex items-baseline justify-between">
        <span className="text-[13px] text-surface-600 dark:text-surface-400">
          Total length
        </span>
        <span className="font-mono text-base font-medium">
          {totalTimeLabel}
        </span>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-[13px] text-surface-600 dark:text-surface-400">
          Overall difficulty
        </span>
        <span className="flex items-baseline gap-2">
          <span className="font-mono text-base font-medium">
            {difficultyValue}
          </span>
          <span className="text-[11px] uppercase tracking-[0.06em] text-surface-500 dark:text-surface-400">
            {difficultyLabel}
          </span>
        </span>
      </div>

      <ProgressMeter
        ariaLabel="Overall difficulty"
        className="mt-0.5"
        thickness={5}
        value={difficultyPct}
      />

      <Button className="mt-2" fluid onClick={onSubmit}>
        Submit program
      </Button>
    </div>
  );
}
