'use client';

import type { SliderRootChangeEvent } from '@primereact/ui/slider';
import { Slider } from '@primereact/ui/slider';
import { useCallback } from 'react';
import { isNumber } from '../util/isNumber';

export type SliderFieldProps = {
  /** Secondary wording the design sets beside the label, e.g. "range of motion". */
  hint?: string | undefined;
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step?: number | undefined;
  value: number;
  /** How the current value reads, since seconds and 1-10 scales differ. */
  valueLabel: string;
};

export function SliderField({
  hint,
  label,
  max,
  min,
  onChange,
  step = 1,
  value,
  valueLabel,
}: SliderFieldProps) {
  const onValueChange = useCallback(
    (event: SliderRootChangeEvent) => {
      if (isNumber(event.value)) onChange(event.value);
    },
    [onChange],
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2.5">
        <span className="text-sm font-medium">
          {label}
          {hint && (
            <span className="font-normal text-muted-color"> {hint}</span>
          )}
        </span>
        <span className="font-mono text-xs text-muted-color">{valueLabel}</span>
      </div>

      <Slider.Root
        max={max}
        min={min}
        onValueChange={onValueChange}
        step={step}
        value={value}
      >
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Handle aria-label={label} />
      </Slider.Root>
    </div>
  );
}
