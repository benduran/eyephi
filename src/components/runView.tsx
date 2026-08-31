'use client';

import type { Ref } from 'react';
import type { RunStepView } from '../schema/types';
import { ExerciseCanvas } from './exerciseCanvas';
import type { RunControlsProps } from './runControls';
import { RunControls } from './runControls';
import { RunStepList } from './runStepList';

export type RunViewProps = RunControlsProps & {
  currentName: string;
  difficultyValue: string;
  stageRef?: Ref<HTMLCanvasElement> | undefined;
  stepPositionLabel: string;
  stepRemainingLabel: string;
  steps: RunStepView[];
};

export function RunView({
  currentName,
  difficultyValue,
  stageRef,
  stepPositionLabel,
  stepRemainingLabel,
  steps,
  ...controls
}: RunViewProps) {
  return (
    <main className="mx-auto grid max-w-[1320px] grid-cols-1 items-start gap-[22px] px-4 pt-[22px] pb-[108px] wide:gap-8 wide:px-[22px] wide:pt-7 wide:pb-[72px] aside:grid-cols-[minmax(0,1fr)_300px] aside:px-7 aside:pt-9 aside:pb-24">
      <section>
        <div className="mb-3.5 flex items-baseline justify-between gap-4">
          <div>
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.08em] text-surface-400 dark:text-surface-500">
              {stepPositionLabel}
            </div>
            <h2 className="m-0 text-xl font-semibold tracking-tight">
              {currentName}
            </h2>
          </div>
          <div className="font-mono text-[22px] tracking-tight">
            {stepRemainingLabel}
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-surface-200 bg-surface-0 dark:border-surface-700 dark:bg-surface-900">
          <ExerciseCanvas
            ariaLabel={`${currentName} exercise stage`}
            className="block aspect-video w-full"
            ref={stageRef}
          />
        </div>

        <RunControls {...controls} />

        <p className="mt-3 mb-0 font-mono text-[11px] uppercase tracking-wide text-surface-400 wide:hidden dark:text-surface-500">
          Turn your phone sideways for a full-screen view
        </p>
      </section>

      <aside>
        <RunStepList difficultyValue={difficultyValue} steps={steps} />
      </aside>
    </main>
  );
}
