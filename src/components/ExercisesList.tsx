import type { Exercise } from '../schema/types';
import { ExerciseCard } from './ExerciseCard';

export type ExercisesListProps = {
  exercises: Exercise[];
};

export function ExercisesList({ exercises }: ExercisesListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 catalog:grid-cols-2">
      {exercises.map((ex) => (
        <ExerciseCard exercise={ex} key={ex.type} />
      ))}
    </div>
  );
}
