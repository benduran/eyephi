'use client';

import { ToggleButton } from '@primereact/ui/togglebutton';
import type { ToggleButtonGroupValueChangeEvent } from '@primereact/ui/togglebuttongroup';
import { ToggleButtonGroup } from '@primereact/ui/togglebuttongroup';
import type { PaletteView } from '../schema/types';

export type PaletteChooserProps = {
  onPaletteChange: (id: string) => void;
  palettes: PaletteView[];
  selectedId: string;
};

export function PaletteChooser({
  onPaletteChange,
  palettes,
  selectedId,
}: PaletteChooserProps) {
  return (
    <div>
      <span className="mb-2.5 block text-[13px] font-medium">
        Colour scheme
      </span>
      <ToggleButtonGroup
        allowEmpty={false}
        className="grid grid-cols-4 gap-2.5"
        onValueChange={(event: ToggleButtonGroupValueChangeEvent) =>
          onPaletteChange(String(event.value))
        }
        value={selectedId}
      >
        {palettes.map((palette) => (
          <ToggleButton.Root
            className="overflow-hidden rounded-md border-[1.5px] border-surface-200 p-0 dark:border-surface-700 p-checked:border-primary"
            key={palette.id}
            value={palette.id}
          >
            <ToggleButton.Indicator className="block p-0">
              <span
                className="relative block h-11"
                style={{ background: palette.background }}
              >
                <span
                  className="absolute left-1/2 top-1/2 block h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ background: palette.foreground }}
                />
              </span>
              <span className="block px-2 py-[7px] text-[11px] text-surface-600 dark:text-surface-400">
                {palette.label}
              </span>
            </ToggleButton.Indicator>
          </ToggleButton.Root>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}
