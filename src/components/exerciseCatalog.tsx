'use client';

import type { ExerciseView } from '../schema/types';
import { ExerciseCard } from './exerciseCard';

export type ExerciseCatalogProps = {
  exercises: ExerciseView[];
  onConfigure: (id: string) => void;
};

export function ExerciseCatalog({
  exercises,
  onConfigure,
}: ExerciseCatalogProps) {
  return (
    <div className="grid grid-cols-1 gap-3.5 cards:grid-cols-2">
      {exercises.map((exercise) => (
        <ExerciseCard
          exercise={exercise}
          key={exercise.id}
          onConfigure={onConfigure}
        />
      ))}
    </div>
  );
}
