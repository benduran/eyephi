'use client';

import { useBasketBuilder } from '../context/BasketBuilder';
import { useRunProgram } from '../context/RunProgram';
import { totalDuration } from '../lib/difficulty';
import { formatDuration } from '../lib/format';
import { Centering } from './centering';
import { ExerciseCanvas } from './ExerciseCanvas';
import { ProgramProgressBar } from './ProgramProgressBar';
import { RunControls } from './RunControls';
import { RunStepList } from './RunStepList';

export function RunView() {
  /** context */
  const { exercises } = useBasketBuilder();
  const {
    current,
    immersive,
    paused,
    previousStep,
    progress,
    remaining,
    setImmersive,
    skipStep,
    exitRun,
    togglePaused,
  } = useRunProgram();

  if (!current) return null;

  return (
    <section id="run">
      <Centering>
        <div className="grid grid-cols-1 items-start gap-8 py-6 sidebyside:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-color">
                  Step {progress.stepIndex + 1} of {exercises.length}
                </span>
                <h2 className="text-lg font-semibold tracking-tight">
                  {current.displayName}
                </h2>
              </div>
              <span className="font-mono text-base">
                {formatDuration(remaining)}
              </span>
            </div>

            <ProgramProgressBar
              progress={{
                elapsed: Math.round(progress.totalElapsed),
                total: totalDuration(exercises),
              }}
              trailing={`${progress.stepIndex + 1} / ${exercises.length}`}
            />

            <div className="overflow-hidden rounded-lg border border-surface-200 dark:border-surface-700">
              <ExerciseCanvas
                className="block aspect-video w-full"
                exercise={current}
                paused={paused}
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <RunControls
                immersive={immersive}
                onBack={previousStep}
                onExit={exitRun}
                onSkip={skipStep}
                onToggleImmersive={() => setImmersive(true)}
                onTogglePaused={togglePaused}
                paused={paused}
              />
              <p className="text-sm text-muted-color">{current.cue}</p>
            </div>

            {/* Only a handheld held upright can act on this, so a narrow
                desktop window must not see it. */}
            <p className="hidden font-mono text-xs uppercase tracking-wider text-muted-color portrait:pointer-coarse:max-sidebyside:block">
              Turn your phone sideways for a full-screen view
            </p>
          </div>

          <RunStepList
            currentIndex={progress.stepIndex}
            exercises={exercises}
          />
        </div>
      </Centering>
    </section>
  );
}
