'use client';

import { useRouter } from 'next/navigation';
import { parseAsBoolean, parseAsStringEnum, useQueryState } from 'nuqs';
import type { PropsWithChildren } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useInterval } from 'usehooks-ts';
import type { RunTick } from '../lib/runProgram';
import {
  remainingOnStep,
  tickRun,
  toNextStep,
  toPreviousStep,
} from '../lib/runProgram';
import { QUERY_KEYS, uiRoutes } from '../routing/uiRoutes';
import type { ProgramView, RunProgress } from '../schema/runProgram';
import {
  DEFAULT_PROGRAM_VIEW,
  IDLE_RUN_PROGRESS,
  ProgramViewSchema,
} from '../schema/runProgram';
import type { Exercise } from '../schema/types';
import type { Nullish } from '../util/nullish';

type RunProgramContextVal = {
  current: Nullish<Exercise>;
  /** Leaves the run and returns to the editor with the program intact. */
  exitRun: () => void;
  previousStep: () => void;
  /** Fills the whole viewport, for phones held sideways. */
  immersive: boolean;
  paused: boolean;
  progress: RunProgress;
  /** Seconds left on the current step, floored at zero. */
  remaining: number;
  restartRun: () => void;
  setImmersive: (immersive: boolean) => void;
  skipStep: () => void;
  togglePaused: () => void;
  view: ProgramView;
};

const context = createContext<Nullish<RunProgramContextVal>>(null);

/**
 * A tenth of a second. The readout only shows whole seconds, and the canvas
 * runs its own animation loop, so a faster tick would buy nothing.
 */
const TICK_MS = 100;

type RunProgramProviderProps = PropsWithChildren & {
  exercises: Exercise[];
};

export function RunProgramProvider({
  children,
  exercises,
}: RunProgramProviderProps) {
  const router = useRouter();
  const [view, setView] = useQueryState(
    QUERY_KEYS.view,
    parseAsStringEnum(ProgramViewSchema.options)
      .withDefault(DEFAULT_PROGRAM_VIEW)
      .withOptions({ shallow: true }),
  );
  const [immersive, setImmersive] = useQueryState(
    QUERY_KEYS.immersive,
    parseAsBoolean.withDefault(true).withOptions({ shallow: true }),
  );

  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState<RunProgress>(IDLE_RUN_PROGRESS);

  const current = exercises.at(progress.stepIndex);
  const running = view === 'run' && !paused && Boolean(current);
  const remaining = remainingOnStep(progress, exercises);

  const applyTick = useCallback(
    (tick: RunTick) => {
      if (tick.kind === 'idle') return;

      setProgress(tick.progress);
      if (tick.kind === 'finished') setView('done');
    },
    [setView],
  );

  useInterval(
    () => applyTick(tickRun(progress, exercises, TICK_MS / 1000)),
    running ? TICK_MS : null,
  );

  const providerVal = useMemo<RunProgramContextVal>(
    () => ({
      current,
      exitRun: () => router.push(uiRoutes.home(exercises)),
      immersive,
      paused,
      previousStep: () =>
        applyTick(toPreviousStep(progress, exercises, progress.totalElapsed)),
      progress,
      remaining,
      restartRun: () => {
        setProgress(IDLE_RUN_PROGRESS);
        setPaused(false);
        setView('run');
      },
      setImmersive,
      skipStep: () =>
        applyTick(toNextStep(progress, exercises, progress.totalElapsed)),
      togglePaused: () => setPaused((prev) => !prev),
      view,
    }),
    [
      applyTick,
      current,
      exercises,
      router,
      immersive,
      paused,
      progress,
      remaining,
      setImmersive,
      setView,
      view,
    ],
  );

  return <context.Provider value={providerVal}>{children}</context.Provider>;
}

export function useRunProgram() {
  const ctx = useContext(context);
  if (!ctx) {
    throw new Error(
      'unable to useRunProgram() because no <RunProgramProvider /> was found in the parent tree',
    );
  }

  return ctx;
}
