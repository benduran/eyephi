import { formatDuration } from '../lib/format';
import { PALETTES } from '../lib/palettes';
import type { Exercise } from '../schema/types';

type ExerciseConfigBreakdownProps = {
  exercise: Exercise;
};

export function ExerciseConfigBreakdown({
  exercise,
}: ExerciseConfigBreakdownProps) {
  return (
    <span className="inline-flex items-center">
      <span>SPD {exercise.speed}</span>
      <span>&nbsp;INT {exercise.intensity}</span>
      <span>&nbsp;DUR {formatDuration(exercise.duration)}</span>
      <span>&nbsp;COLOR {PALETTES[exercise.scheme].label.toUpperCase()}</span>
      {exercise.backgroundNoise && <span>&nbsp;TEXTURED</span>}
    </span>
  );
}
