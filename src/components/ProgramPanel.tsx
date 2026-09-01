'use client';

import { Button } from '@primereact/ui/button';
import { useCallback, useMemo } from 'react';
import { useBasketBuilder } from '../context/BasketBuilder';
import { scoreProgram, toDifficultyBand } from '../lib/difficulty';
import { formatExerciseCount } from '../lib/format';
import { totalDuration } from '../lib/program';
import { buildRandomProgram } from '../lib/randomProgram';
import { ProgramPanelItem } from './ProgramPanelItem';
import { ProgramSummary } from './ProgramSummary';

export type ProgramPanelProps = {
  onSubmit: () => void;
};

export function ProgramPanel({ onSubmit }: ProgramPanelProps) {
  const {
    defaultExercises,
    exercises,
    removeExercise,
    replaceProgram,
    setEditing,
  } = useBasketBuilder();

  const difficulty = useMemo(() => scoreProgram(exercises), [exercises]);

  const randomize = useCallback(
    () => replaceProgram(buildRandomProgram(defaultExercises)),
    [defaultExercises, replaceProgram],
  );

  return (
    <aside className="overflow-hidden rounded-lg border border-surface-200 bg-surface-0 sidebyside:sticky sidebyside:top-22 dark:border-surface-700 dark:bg-surface-900">
      <div className="flex items-center justify-between border-b border-surface-100 px-4.5 py-4 dark:border-surface-800">
        <span className="text-sm font-semibold">Your program</span>
        <span className="rounded-xl border border-surface-200 px-2 py-0.5 font-mono text-meta text-muted-color dark:border-surface-700">
          {formatExerciseCount(exercises.length)}
        </span>
      </div>

      <div className="border-b border-surface-100 px-4.5 py-3 dark:border-surface-800">
        <Button
          fluid
          onClick={randomize}
          severity="secondary"
          size="small"
          variant="outlined"
        >
          Randomize program
        </Button>
      </div>

      {exercises.length === 0 ? (
        <div className="m-4.5 rounded-md border border-dashed border-surface-300 px-4.5 py-7 text-center dark:border-surface-600">
          <p className="font-mono text-meta leading-relaxed uppercase tracking-wide text-muted-color">
            No exercises yet
            <br />
            Add one to begin
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col">
            {exercises.map((exercise, index) => (
              <ProgramPanelItem
                exercise={exercise}
                // Position in the program is an entry's only identity.
                index={index}
                key={`${exercise.type}-${index}`}
                onEdit={setEditing}
                onRemove={removeExercise}
              />
            ))}
          </div>
          <ProgramSummary
            band={toDifficultyBand(difficulty)}
            difficulty={difficulty}
            onSubmit={onSubmit}
            totalSeconds={totalDuration(exercises)}
          />
        </>
      )}
    </aside>
  );
}
