'use client';

import { Button } from '@primereact/ui/button';
import type { CheckboxRootChangeEvent } from '@primereact/ui/checkbox';
import { Checkbox } from '@primereact/ui/checkbox';
import type { DialogRootChangeEvent } from '@primereact/ui/dialog';
import { Dialog } from '@primereact/ui/dialog';
import type { Ref } from 'react';
import type { PaletteView } from '../schema/types';
import { DifficultyMeter } from './difficultyMeter';
import { ExerciseCanvas } from './exerciseCanvas';
import { PaletteChooser } from './paletteChooser';
import { SliderField } from './sliderField';

export type ConfigDialogProps = {
  addButtonLabel: string;
  blurb: string;
  category: string;
  difficultyBreakdown: string;
  difficultyPct: number;
  difficultyValue: string;
  duration: number;
  durationLabel: string;
  intensity: number;
  intensityLabel: string;
  name: string;
  onAdd: () => void;
  onDurationChange: (value: number) => void;
  onIntensityChange: (value: number) => void;
  onOpenChange: (open: boolean) => void;
  onPaletteChange: (id: string) => void;
  onSpeedChange: (value: number) => void;
  onTextureChange: (checked: boolean) => void;
  open: boolean;
  paletteId: string;
  palettes: PaletteView[];
  previewRef?: Ref<HTMLCanvasElement> | undefined;
  speed: number;
  speedLabel: string;
  texture: boolean;
};

const TEXTURE_INPUT_ID = 'eyephi-config-texture';

export function ConfigDialog({
  addButtonLabel,
  blurb,
  category,
  difficultyBreakdown,
  difficultyPct,
  difficultyValue,
  duration,
  durationLabel,
  intensity,
  intensityLabel,
  name,
  onAdd,
  onDurationChange,
  onIntensityChange,
  onOpenChange,
  onPaletteChange,
  onSpeedChange,
  onTextureChange,
  open,
  paletteId,
  palettes,
  previewRef,
  speed,
  speedLabel,
  texture,
}: ConfigDialogProps) {
  return (
    <Dialog.Root
      modal
      onOpenChange={(event: DialogRootChangeEvent) =>
        onOpenChange(Boolean(event.value))
      }
      open={open}
    >
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Popup className="max-h-[94vh] w-full max-w-[860px] overflow-auto wide:max-h-[88vh]">
            <Dialog.Header className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-[5px] font-mono text-[10px] uppercase tracking-[0.08em] text-surface-400 dark:text-surface-500">
                  {category}
                </div>
                <Dialog.Title className="m-0 mb-1 text-lg font-semibold tracking-tight">
                  {name}
                </Dialog.Title>
                <p className="m-0 max-w-[60ch] text-[13px] leading-relaxed text-surface-500 dark:text-surface-400">
                  {blurb}
                </p>
              </div>
              <Dialog.Close />
            </Dialog.Header>

            <Dialog.Content className="grid grid-cols-1 gap-6 dlg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="flex flex-col gap-[22px]">
                <SliderField
                  label="Duration"
                  max={180}
                  min={30}
                  onValueChange={onDurationChange}
                  step={15}
                  value={duration}
                  valueLabel={durationLabel}
                />
                <SliderField
                  label="Speed"
                  max={10}
                  min={1}
                  onValueChange={onSpeedChange}
                  step={1}
                  value={speed}
                  valueLabel={speedLabel}
                />
                <SliderField
                  hint="range of motion"
                  label="Intensity"
                  max={10}
                  min={1}
                  onValueChange={onIntensityChange}
                  step={1}
                  value={intensity}
                  valueLabel={intensityLabel}
                />

                <PaletteChooser
                  onPaletteChange={onPaletteChange}
                  palettes={palettes}
                  selectedId={paletteId}
                />

                <div className="flex min-h-9 items-center gap-2.5">
                  <Checkbox.Root
                    checked={texture}
                    inputId={TEXTURE_INPUT_ID}
                    onCheckedChange={(event: CheckboxRootChangeEvent) =>
                      onTextureChange(event.checked)
                    }
                  >
                    <Checkbox.Box>
                      <Checkbox.Indicator />
                    </Checkbox.Box>
                  </Checkbox.Root>
                  <label className="text-[13px]" htmlFor={TEXTURE_INPUT_ID}>
                    Add background texture{' '}
                    <span className="text-surface-400 dark:text-surface-500">
                      — raises visual load
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="overflow-hidden rounded-lg border border-surface-200 dark:border-surface-700">
                  <ExerciseCanvas
                    ariaLabel={`${name} preview`}
                    className="block aspect-video w-full"
                    ref={previewRef}
                  />
                </div>

                <DifficultyMeter
                  breakdown={difficultyBreakdown}
                  pct={difficultyPct}
                  value={difficultyValue}
                />

                <Button fluid onClick={onAdd}>
                  {addButtonLabel}
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Popup>
        </Dialog.Positioner>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
