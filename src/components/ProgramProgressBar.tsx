'use client';

import type { ReactNode } from 'react';
import { formatDuration, toPercentage } from '../lib/format';
import type { ProgramProgressView } from '../schema/types';
import { ProgressMeter } from './progressMeter';

export type ProgramProgressBarProps = {
  className?: string | undefined;
  progress: ProgramProgressView;
  thickness?: number | undefined;
  /** Shown after the meter, where the design puts the step position. */
  trailing?: ReactNode;
  /** `inverted` reads light-on-dark for the immersive stage. */
  tone?: 'default' | 'inverted' | undefined;
};

export function ProgramProgressBar({
  className,
  progress,
  thickness = 3,
  trailing,
  tone = 'default',
}: ProgramProgressBarProps) {
  const muted = tone === 'inverted' ? '' : 'text-muted-color';

  return (
    <div className={`flex items-center gap-3 ${className ?? ''}`}>
      <span className={`font-mono text-xs whitespace-nowrap ${muted}`}>
        {`${formatDuration(progress.elapsed)} / ${formatDuration(progress.total)}`}
      </span>
      <ProgressMeter
        ariaLabel="Program progress"
        className="flex-1"
        thickness={thickness}
        tone={tone}
        value={toPercentage(progress.elapsed, progress.total)}
      />
      {trailing && (
        <span className={`font-mono text-xs whitespace-nowrap ${muted}`}>
          {trailing}
        </span>
      )}
    </div>
  );
}
