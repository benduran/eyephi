'use client';

import { Button } from '@primereact/ui/button';
import { useBasketBuilder } from '../context/BasketBuilder';
import { useRunProgram } from '../context/RunProgram';
import {
  formatDifficultyScore,
  scoreProgram,
  totalDuration,
} from '../lib/difficulty';
import { formatDuration } from '../lib/format';
import { Centering } from './centering';

export function DoneView() {
  /** context */
  const { exercises } = useBasketBuilder();
  const { restartRun, exitRun } = useRunProgram();

  const summary = [
    `${exercises.length} ${exercises.length === 1 ? 'exercise' : 'exercises'}`,
    formatDuration(totalDuration(exercises)),
    `overall difficulty ${formatDifficultyScore(scoreProgram(exercises))}`,
  ].join(' · ');

  return (
    <section id="done">
      <Centering>
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <h2 className="text-xl font-semibold tracking-tight">
            Program complete
          </h2>
          <p className="font-mono text-sm text-muted-color">{summary}</p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Button onClick={restartRun}>Run again</Button>
            <Button onClick={exitRun} severity="secondary" variant="outlined">
              Create a new program
            </Button>
          </div>
        </div>
      </Centering>
    </section>
  );
}
