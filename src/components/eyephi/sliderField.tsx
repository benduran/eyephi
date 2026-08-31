'use client';

import type { SliderRootChangeEvent } from '@primereact/ui/slider';
import { Slider } from '@primereact/ui/slider';

export type SliderFieldProps = {
  hint?: string | undefined;
  label: string;
  max: number;
  min: number;
  onValueChange: (value: number) => void;
  step: number;
  value: number;
  valueLabel: string;
};

export function SliderField({
  hint,
  label,
  max,
  min,
  onValueChange,
  step,
  value,
  valueLabel,
}: SliderFieldProps) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2.5">
        <span className="text-[13px] font-medium">
          {label}
          {hint ? (
            <span className="font-normal text-surface-400 dark:text-surface-500">
              {' '}
              — {hint}
            </span>
          ) : null}
        </span>
        <span className="font-mono text-xs text-surface-600 dark:text-surface-400">
          {valueLabel}
        </span>
      </div>

      <Slider.Root
        aria-label={label}
        max={max}
        min={min}
        onValueChange={(event: SliderRootChangeEvent) =>
          onValueChange(Number(event.value))
        }
        step={step}
        value={value}
      >
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Handle />
      </Slider.Root>
    </div>
  );
}
