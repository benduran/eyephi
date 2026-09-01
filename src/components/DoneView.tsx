'use client';

import { Button } from '@primereact/ui/button';
import { useMemo } from 'react';
import { useBasketBuilder } from '../context/BasketBuilder';
import { useRunProgram } from '../context/RunProgram';
import { formatProgramSummary } from '../lib/format';
import { Centering } from './Centering';

export function DoneView() {
  const { exercises } = useBasketBuilder();
  const { restartRun, exitRun } = useRunProgram();

  const summary = useMemo(
    () => formatProgramSummary(exercises, 'overall difficulty'),
    [exercises],
  );

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
              Back to program editor
            </Button>
          </div>
        </div>
      </Centering>
    </section>
  );
}
