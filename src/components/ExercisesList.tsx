'use client';

import { useBasketBuilder } from '../context/BasketBuilder';
import { ExerciseCard } from './ExerciseCard';

export function ExercisesList() {
  /** context */
  const { defaultExercises } = useBasketBuilder();

  return (
    <div className="grid grid-cols-2 gap-4">
      {defaultExercises.map((ex) => (
        <ExerciseCard exercise={ex} key={ex.type} />
      ))}
    </div>
  );
}
