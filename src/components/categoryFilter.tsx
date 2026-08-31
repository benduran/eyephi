'use client';

import { ToggleButton } from '@primereact/ui/togglebutton';
import type { ToggleButtonGroupValueChangeEvent } from '@primereact/ui/togglebuttongroup';
import { ToggleButtonGroup } from '@primereact/ui/togglebuttongroup';
import type { CategoryView } from '../schema/types';

export type CategoryFilterProps = {
  categories: CategoryView[];
  onCategoryChange: (id: string) => void;
  selectedId: string;
};

export function CategoryFilter({
  categories,
  onCategoryChange,
  selectedId,
}: CategoryFilterProps) {
  return (
    <ToggleButtonGroup
      allowEmpty={false}
      className="flex flex-wrap items-center gap-2.5"
      onValueChange={(event: ToggleButtonGroupValueChangeEvent) =>
        onCategoryChange(String(event.value))
      }
      size="small"
      value={selectedId}
    >
      {categories.map((category) => (
        <ToggleButton.Root
          className="rounded-full"
          key={category.id}
          value={category.id}
        >
          <ToggleButton.Indicator>{category.label}</ToggleButton.Indicator>
        </ToggleButton.Root>
      ))}
    </ToggleButtonGroup>
  );
}
