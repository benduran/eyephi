'use client';

import { ToggleButton } from '@primereact/ui/togglebutton';
import type { ToggleButtonGroupValueChangeEvent } from '@primereact/ui/togglebuttongroup';
import { ToggleButtonGroup } from '@primereact/ui/togglebuttongroup';
import { useCallback } from 'react';
import { toTargetPathLabel } from '../lib/labels';
import type { TargetPath } from '../schema/types';
import { TargetPathSchema } from '../schema/types';

export type TargetPathChooserProps = {
  onSelect: (path: TargetPath) => void;
  selected: TargetPath;
};

export function TargetPathChooser({
  onSelect,
  selected,
}: TargetPathChooserProps) {
  const onValueChange = useCallback(
    (event: ToggleButtonGroupValueChangeEvent) => {
      const next = TargetPathSchema.safeParse(event.value);
      if (next.success) onSelect(next.data);
    },
    [onSelect],
  );

  return (
    <ToggleButtonGroup
      className="grid! grid-cols-2 gap-2.5 catalog:grid-cols-3"
      onValueChange={onValueChange}
      value={selected}
    >
      {TargetPathSchema.options.map((path) => (
        <ToggleButton.Root key={path} value={path}>
          <ToggleButton.Indicator>
            {toTargetPathLabel(path)}
          </ToggleButton.Indicator>
        </ToggleButton.Root>
      ))}
    </ToggleButtonGroup>
  );
}
