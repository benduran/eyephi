import type { RunProgress } from '../schema/runProgram';
import { IDLE_RUN_PROGRESS } from '../schema/runProgram';
import type { Program } from '../schema/types';

export type RunTick =
  | { kind: 'idle' }
  | { kind: 'running'; progress: RunProgress }
  | { kind: 'finished'; progress: RunProgress };

/** Moves to the next step, or reports the run as finished. */
export function toNextStep(
  progress: RunProgress,
  program: Program,
  totalElapsed: number,
): RunTick {
  const stepIndex = progress.stepIndex + 1;
  if (stepIndex >= program.length) {
    return {
      kind: 'finished',
      progress: { ...IDLE_RUN_PROGRESS, totalElapsed },
    };
  }

  return {
    kind: 'running',
    progress: { stepElapsed: 0, stepIndex, totalElapsed },
  };
}

/**
 * Advances the clock by `delta` seconds, rolling onto the next step when the
 * current one is served. A step shorter than the delta still gets one tick.
 */
export function tickRun(
  progress: RunProgress,
  program: Program,
  delta: number,
): RunTick {
  const step = program[progress.stepIndex];
  if (!step) return { kind: 'idle' };

  const stepElapsed = progress.stepElapsed + delta;
  const totalElapsed = progress.totalElapsed + delta;
  if (stepElapsed < step.duration) {
    return {
      kind: 'running',
      progress: { stepElapsed, stepIndex: progress.stepIndex, totalElapsed },
    };
  }

  return toNextStep(progress, program, totalElapsed);
}

/** Seconds left on the current step */
export function remainingOnStep(
  progress: RunProgress,
  program: Program,
): number {
  const step = program[progress.stepIndex];
  if (!step) return 0;

  return Math.max(0, step.duration - progress.stepElapsed);
}
