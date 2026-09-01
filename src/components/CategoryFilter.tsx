'use client';

import { ToggleButtonRoot } from '@primereact/ui/togglebutton';
import type { ToggleButtonGroupValueChangeEvent } from '@primereact/ui/togglebuttongroup';
import { ToggleButtonGroup } from '@primereact/ui/togglebuttongroup';
import { toCategoryLabel } from '../lib/labels';
import type { ExerciseCategory, Nullish } from '../schema/types';
import { ExerciseCategorySchema } from '../schema/types';

export type CategoryFilterProps = {
  onSelect: (category: Nullish<ExerciseCategory>) => void;
  /** Null means every category, which the design labels "All". */
  selected: Nullish<ExerciseCategory>;
};

const ALL = 'all' as const;

export function CategoryFilter({ onSelect, selected }: CategoryFilterProps) {
  return (
    <ToggleButtonGroup
      onValueChange={(event: ToggleButtonGroupValueChangeEvent) =>
        onSelect(ExerciseCategorySchema.safeParse(event.value).data ?? null)
      }
      value={selected ?? ALL}
    >
      <ToggleButtonRoot value={ALL}>All</ToggleButtonRoot>
      {ExerciseCategorySchema.options.map((category) => (
        <ToggleButtonRoot key={category} value={category}>
          {toCategoryLabel(category)}
        </ToggleButtonRoot>
      ))}
    </ToggleButtonGroup>
  );
}
