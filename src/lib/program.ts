import type { Program } from '../schema/types';

export function totalDuration(program: Program): number {
  return program.reduce((total, exercise) => total + exercise.duration, 0);
}
