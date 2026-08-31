'use client';

import { ProgressBar } from '@primereact/ui/progressbar';

export type ProgressMeterProps = {
  ariaLabel: string;
  className?: string | undefined;
  /** Track thickness in pixels; the design uses 3-5px depending on context. */
  thickness?: number | undefined;
  /** `inverted` renders light-on-dark for the immersive stage, which ignores the theme. */
  tone?: 'default' | 'inverted' | undefined;
  value: number;
};

const TRACK_TONE = {
  default: 'bg-surface-200 dark:bg-surface-700',
  inverted: 'bg-surface-200/25',
} as const;

const INDICATOR_TONE = {
  default: 'bg-primary',
  inverted: 'bg-surface-200',
} as const;

export function ProgressMeter({
  ariaLabel,
  className,
  thickness = 4,
  tone = 'default',
  value,
}: ProgressMeterProps) {
  return (
    <ProgressBar.Root className={className} value={value}>
      <ProgressBar.Track
        aria-label={ariaLabel}
        className={`w-full overflow-hidden rounded-full ${TRACK_TONE[tone]}`}
        style={{ height: `${thickness}px` }}
      >
        <ProgressBar.Indicator
          className={`h-full rounded-full transition-[width] duration-200 ${INDICATOR_TONE[tone]}`}
        />
      </ProgressBar.Track>
    </ProgressBar.Root>
  );
}
