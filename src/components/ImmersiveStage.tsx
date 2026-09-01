'use client';

import { useBasketBuilder } from '../context/BasketBuilder';
import { useRunProgram } from '../context/RunProgram';
import { totalDuration } from '../lib/difficulty';
import { formatDuration } from '../lib/format';
import { ExerciseCanvas } from './ExerciseCanvas';
import { EyePhiLogo } from './eyePhiLogo';
import { ProgramProgressBar } from './ProgramProgressBar';
import { RunControls } from './RunControls';

export function ImmersiveStage() {
  /** context */
  const { exercises } = useBasketBuilder();
  const {
    current,
    paused,
    progress,
    remaining,
    setImmersive,
    skipStep,
    exitRun,
    togglePaused,
  } = useRunProgram();

  if (!current) return null;

  const total = totalDuration(exercises);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <ExerciseCanvas
        className="absolute inset-0 h-full w-full"
        exercise={current}
        paused={paused}
      />

      <div className="absolute inset-x-0 top-0 flex items-center gap-3 bg-linear-to-b from-black/55 to-transparent px-4 py-3 text-surface-200">
        <EyePhiLogo />
        <ProgramProgressBar
          className="flex-1"
          progress={{ elapsed: progress.totalElapsed, total }}
          tone="inverted"
          trailing={`${progress.stepIndex + 1} / ${exercises.length}`}
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-3 bg-linear-to-t from-black/55 to-transparent px-4 py-3 text-surface-200">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">
            {`${current.displayName} · ${formatDuration(remaining)}`}
          </span>
          <span className="text-xs text-surface-400">{current.cue}</span>
        </div>
        <RunControls
          immersive
          onExit={exitRun}
          onSkip={skipStep}
          onToggleImmersive={() => setImmersive(false)}
          onTogglePaused={togglePaused}
          paused={paused}
        />
      </div>
    </div>
  );
}
