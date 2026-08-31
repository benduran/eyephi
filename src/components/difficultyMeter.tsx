'use client';

import { ProgressMeter } from './progressMeter';

export type DifficultyMeterProps = {
  breakdown: string;
  pct: number;
  value: string;
};

export function DifficultyMeter({
  breakdown,
  pct,
  value,
}: DifficultyMeterProps) {
  return (
    <div className="rounded-lg border border-surface-200 p-4 dark:border-surface-700">
      <div className="mb-2.5 flex items-baseline justify-between">
        <span className="text-xs text-surface-500 dark:text-surface-400">
          Difficulty score
        </span>
        <span className="flex items-baseline gap-2">
          <span className="font-mono text-xl font-medium">{value}</span>
          <span className="text-[10px] uppercase tracking-[0.06em] text-surface-400 dark:text-surface-500">
            / 10
          </span>
        </span>
      </div>
      <ProgressMeter ariaLabel="Difficulty score" thickness={5} value={pct} />
      <p className="mt-2.5 mb-0 font-mono text-[11px] leading-relaxed text-surface-400 dark:text-surface-500">
        {breakdown}
      </p>
    </div>
  );
}
