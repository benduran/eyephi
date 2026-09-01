'use client';

import { ToggleButton } from '@primereact/ui/togglebutton';
import type { ToggleButtonGroupValueChangeEvent } from '@primereact/ui/togglebuttongroup';
import { ToggleButtonGroup } from '@primereact/ui/togglebuttongroup';
import { useCallback } from 'react';
import { PALETTES } from '../lib/palettes';
import type { ColorScheme } from '../schema/types';
import { ColorSchemeSchema } from '../schema/types';

export type PaletteChooserProps = {
  onSelect: (scheme: ColorScheme) => void;
  selected: ColorScheme;
};

export function PaletteChooser({ onSelect, selected }: PaletteChooserProps) {
  const onValueChange = useCallback(
    (event: ToggleButtonGroupValueChangeEvent) => {
      const next = ColorSchemeSchema.safeParse(event.value);
      if (next.success) onSelect(next.data);
    },
    [onSelect],
  );

  return (
    <ToggleButtonGroup
      className="grid! grid-cols-2 gap-2.5 catalog:grid-cols-4"
      onValueChange={onValueChange}
      value={selected}
    >
      {ColorSchemeSchema.options.map((scheme) => {
        const palette = PALETTES[scheme];

        return (
          <ToggleButton.Root
            className="flex flex-col overflow-hidden p-0"
            key={scheme}
            value={scheme}
          >
            <ToggleButton.Indicator className="flex flex-col">
              <span
                className="flex h-11 w-full items-center justify-center"
                style={{ background: palette.background }}
              >
                <span
                  className="size-3.5 rounded-full"
                  style={{ background: palette.foreground }}
                />
              </span>
              <span className="p-1 text-xs">{palette.label}</span>
            </ToggleButton.Indicator>
          </ToggleButton.Root>
        );
      })}
    </ToggleButtonGroup>
  );
}
