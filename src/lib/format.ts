import type { Program } from '../schema/types';
import { scoreProgram } from './difficulty';
import { totalDuration } from './program';

/** Seconds as `M:SS`. Negative and fractional inputs are clamped and rounded. */
export function formatDuration(seconds: number): string {
  const whole = Math.max(0, Math.round(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

/** Elapsed against total as a 0-100 percentage, saturating when total is 0. */
export function toPercentage(elapsed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

/** One decimal place, which is the precision the design displays. */
export function formatDifficultyScore(score: number): string {
  return score.toFixed(1);
}

export function formatExerciseCount(count: number): string {
  return `${count} ${count === 1 ? 'exercise' : 'exercises'}`;
}

/** `3 exercises · 2:30 · difficulty 5.2`, with the wording each caller uses. */
export function formatProgramSummary(
  program: Program,
  difficultyWord = 'difficulty',
): string {
  return [
    formatExerciseCount(program.length),
    formatDuration(totalDuration(program)),
    `${difficultyWord} ${formatDifficultyScore(scoreProgram(program))}`,
  ].join(' · ');
}
