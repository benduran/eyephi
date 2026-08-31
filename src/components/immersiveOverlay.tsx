'use client';

import { Button } from '@primereact/ui/button';
import type { Ref } from 'react';
import { ExerciseCanvas } from './exerciseCanvas';
import { EyePhiLogo } from './eyePhiLogo';
import { ProgressMeter } from './progressMeter';

export type ImmersiveOverlayProps = {
  cueText: string;
  currentName: string;
  elapsedLabel: string;
  exitLabel: string;
  onLeaveImmersive: () => void;
  onSkipStep: () => void;
  onTogglePause: () => void;
  pauseLabel: string;
  progressPct: number;
  stageRef?: Ref<HTMLCanvasElement> | undefined;
  stepPositionLabel: string;
  stepRemainingLabel: string;
  totalTimeLabel: string;
};

/** Full-bleed exercise stage. Stays dark in both themes -- the canvas supplies its own palette. */
export function ImmersiveOverlay({
  cueText,
  currentName,
  elapsedLabel,
  exitLabel,
  onLeaveImmersive,
  onSkipStep,
  onTogglePause,
  pauseLabel,
  progressPct,
  stageRef,
  stepPositionLabel,
  stepRemainingLabel,
  totalTimeLabel,
}: ImmersiveOverlayProps) {
  return (
    <div className="fixed inset-0 z-80 overflow-hidden bg-[#111111]">
      <ExerciseCanvas
        ariaLabel={`${currentName} exercise stage`}
        className="block h-full w-full"
        ref={stageRef}
      />

      <div className="absolute inset-x-0 top-0 flex items-center gap-3.5 bg-gradient-to-b from-[#111111]/70 to-transparent px-[18px] py-2.5">
        <EyePhiLogo className="text-surface-200" size={20} />
        <span className="whitespace-nowrap font-mono text-xs text-surface-200">
          {elapsedLabel} / {totalTimeLabel}
        </span>
        <ProgressMeter
          ariaLabel="Program progress"
          className="flex-1"
          thickness={3}
          tone="inverted"
          value={progressPct}
        />
        <span className="whitespace-nowrap font-mono text-[11px] text-surface-400">
          {stepPositionLabel}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2.5 bg-gradient-to-t from-[#111111]/70 to-transparent px-[18px] pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-medium text-surface-100">
            {currentName} · {stepRemainingLabel}
          </div>
          <div className="truncate text-[11px] text-surface-400">{cueText}</div>
        </div>
        <Button
          className="!bg-surface-100 !text-[#111111]"
          onClick={onTogglePause}
        >
          {pauseLabel}
        </Button>
        <Button
          className="!border-surface-200/50 !text-surface-200"
          onClick={onSkipStep}
          severity="secondary"
          variant="outlined"
        >
          Skip
        </Button>
        <Button
          className="!border-surface-200/50 !text-surface-200"
          onClick={onLeaveImmersive}
          severity="secondary"
          variant="outlined"
        >
          {exitLabel}
        </Button>
      </div>
    </div>
  );
}
