import { Button } from '@primereact/ui/button';
import { formatDifficultyScore, formatDuration } from '../lib/format';
import { toDifficultyBandLabel } from '../lib/labels';
import type { DifficultyBand } from '../schema/types';
import { ProgressMeter } from './ProgressMeter';

export type ProgramSummaryProps = {
  band: DifficultyBand;
  difficulty: number;
  onSubmit: () => void;
  totalSeconds: number;
};

export function ProgramSummary({
  band,
  difficulty,
  onSubmit,
  totalSeconds,
}: ProgramSummaryProps) {
  return (
    <div className="flex flex-col gap-2.5 border-t border-surface-200 bg-surface-50 px-4.5 py-4 dark:border-surface-700 dark:bg-surface-900">
      <div className="flex items-baseline justify-between">
        <span className="text-tight text-muted-color">Total length</span>
        <span className="font-mono text-base font-medium">
          {formatDuration(totalSeconds)}
        </span>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-tight text-muted-color">Overall difficulty</span>
        <span className="flex items-baseline gap-2">
          <span className="font-mono text-base font-medium">
            {formatDifficultyScore(difficulty)}
          </span>
          <span className="text-meta uppercase tracking-wider text-muted-color">
            {toDifficultyBandLabel(band)}
          </span>
        </span>
      </div>

      <ProgressMeter
        ariaLabel="Overall program difficulty"
        thickness={5}
        value={difficulty * 10}
      />

      <Button className="mt-2" fluid onClick={onSubmit}>
        Submit program
      </Button>
    </div>
  );
}
