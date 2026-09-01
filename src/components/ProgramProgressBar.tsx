import type { ReactNode } from 'react';
import { formatDuration, toPercentage } from '../lib/format';
import type { ProgramProgressView } from '../schema/types';
import type { ProgressMeterTone } from './ProgressMeter';
import { ProgressMeter } from './ProgressMeter';

export type ProgramProgressBarProps = {
  className?: string | undefined;
  progress: ProgramProgressView;
  thickness?: number | undefined;
  /** Shown after the meter, where the design puts the step position. */
  trailing?: ReactNode;
  tone?: ProgressMeterTone | undefined;
};

export function ProgramProgressBar({
  className,
  progress,
  thickness = 3,
  trailing,
  tone = 'default',
}: ProgramProgressBarProps) {
  const muted = tone === 'inverted' ? '' : 'text-muted-color';
  // The view is whole seconds, so callers may hand over a live fractional clock.
  const elapsed = Math.round(progress.elapsed);
  const total = Math.round(progress.total);

  return (
    <div className={`flex items-center gap-3 ${className ?? ''}`}>
      <span className={`font-mono text-xs whitespace-nowrap ${muted}`}>
        {`${formatDuration(elapsed)} / ${formatDuration(total)}`}
      </span>
      <ProgressMeter
        ariaLabel="Program progress"
        className="flex-1"
        thickness={thickness}
        tone={tone}
        value={toPercentage(elapsed, total)}
      />
      {trailing && (
        <span className={`font-mono text-xs whitespace-nowrap ${muted}`}>
          {trailing}
        </span>
      )}
    </div>
  );
}
