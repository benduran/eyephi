'use client';

import { useMemo } from 'react';
import { useBasketBuilder } from '../context/BasketBuilder';
import {
  scoreProgram,
  toDifficultyBand,
  totalDuration,
} from '../lib/difficulty';
import { ProgramPanelItem } from './ProgramPanelItem';
import { ProgramSummary } from './ProgramSummary';

export type ProgramPanelProps = {
  onSubmit: () => void;
};

export function ProgramPanel({ onSubmit }: ProgramPanelProps) {
  /** context */
  const { exercises, removeExercise, setEditing } = useBasketBuilder();

  /** memos */
  const difficulty = useMemo(() => scoreProgram(exercises), [exercises]);

  return (
    <aside className="overflow-hidden rounded-lg border border-surface-200 bg-surface-0 sidebyside:sticky sidebyside:top-22 dark:border-surface-700 dark:bg-surface-900">
      <div className="flex items-center justify-between border-b border-surface-100 px-4.5 py-4 dark:border-surface-800">
        <span className="text-sm font-semibold">Your program</span>
        <span className="rounded-xl border border-surface-200 px-2 py-0.5 font-mono text-[11px] text-muted-color dark:border-surface-700">
          {`${exercises.length} ${exercises.length === 1 ? 'Exercise' : 'Exercises'}`}
        </span>
      </div>

      {exercises.length === 0 ? (
        <div className="m-4.5 rounded-md border border-dashed border-surface-300 px-4.5 py-7 text-center dark:border-surface-600">
          <p className="font-mono text-[11px] leading-relaxed uppercase tracking-wide text-muted-color">
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
                // Basket entries only unique identifier IS their position in the program, so it's okay to use it as a react key in this case
                key={`${exercise.type}-${index}`}
                onEdit={() => setEditing(index)}
                onRemove={() => removeExercise(index)}
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
