'use client';

import { ToggleButton } from '@primereact/ui/togglebutton';
import type { ToggleButtonGroupValueChangeEvent } from '@primereact/ui/togglebuttongroup';
import { ToggleButtonGroup } from '@primereact/ui/togglebuttongroup';
import { useCallback } from 'react';
import { toCategoryLabel } from '../lib/labels';
import type { ExerciseCategory } from '../schema/types';
import { ExerciseCategorySchema } from '../schema/types';
import type { Nullish } from '../util/nullish';

export type CategoryFilterProps = {
  onSelect: (category: Nullish<ExerciseCategory>) => void;
  /** Null means every category, which the design labels "All". */
  selected: Nullish<ExerciseCategory>;
};

const ALL = 'all' as const;

export function CategoryFilter({ onSelect, selected }: CategoryFilterProps) {
  const onValueChange = useCallback(
    (event: ToggleButtonGroupValueChangeEvent) =>
      onSelect(ExerciseCategorySchema.safeParse(event.value).data),
    [onSelect],
  );

  return (
    <div className="overflow-x-auto whitespace-nowrap touch-auto">
      <ToggleButtonGroup
        onValueChange={onValueChange}
        size="small"
        value={selected ?? ALL}
      >
        <ToggleButton.Root value={ALL}>
          <ToggleButton.Indicator>All</ToggleButton.Indicator>
        </ToggleButton.Root>
        {ExerciseCategorySchema.options.map((category) => (
          <ToggleButton.Root key={category} value={category}>
            <ToggleButton.Indicator>
              {toCategoryLabel(category)}
            </ToggleButton.Indicator>
          </ToggleButton.Root>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}
