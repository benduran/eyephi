'use client';

import { CheckIcon, XIcon } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@primereact/ui/button';
import type { CheckboxRootChangeEvent } from '@primereact/ui/checkbox';
import { Checkbox } from '@primereact/ui/checkbox';
import type { DialogRootChangeEvent } from '@primereact/ui/dialog';
import { Dialog } from '@primereact/ui/dialog';
import { useCallback, useMemo, useState } from 'react';
import { formatDifficultyScore, scoreExercise } from '../lib/difficulty';
import { formatDuration } from '../lib/format';
import { toCategoryLabel } from '../lib/labels';
import { numericBounds } from '../lib/schemaBounds';
import type { Exercise } from '../schema/types';
import {
  ExerciseDurationSchema,
  ExerciseIntensitySchema,
  ExerciseSchema,
  ExerciseSpeedSchema,
} from '../schema/types';
import { ExerciseCanvas } from './ExerciseCanvas';
import { ExerciseConfigBreakdown } from './ExerciseConfigBreakdown';
import { PaletteChooser } from './PaletteChooser';
import { ProgressMeter } from './progressMeter';
import { SliderField } from './SliderField';
import { TargetPathChooser } from './TargetPathChooser';

export type ConfigDialogProps = {
  /** The exercise being tuned. Mount with a key so a new one resets the draft. */
  exercise: Exercise;
  onAddExerciseToProgram: (tuned: Exercise) => void;
  onClose: () => void;
  submitLabel: string;
};

const DURATION = numericBounds(ExerciseDurationSchema);
const INTENSITY = numericBounds(ExerciseIntensitySchema);
const SPEED = numericBounds(ExerciseSpeedSchema);

/** The design steps duration in quarter minutes rather than single seconds. */
const DURATION_STEP = 15;

export function ConfigDialog({
  exercise,
  onAddExerciseToProgram,
  onClose,
  submitLabel,
}: ConfigDialogProps) {
  /** state */
  const [draft, setDraft] = useState(exercise);

  /** memos */
  const difficulty = useMemo(() => scoreExercise(draft), [draft]);

  /** callbacks */
  const updateDraft = useCallback(
    (update: Partial<Exercise>) =>
      setDraft((prev) => {
        const validated = ExerciseSchema.safeParse({ ...prev, ...update });
        if (validated.success) return validated.data;
        return prev;
      }),
    [],
  );

  return (
    <Dialog.Root
      modal
      onOpenChange={(event: DialogRootChangeEvent) => {
        if (!event.value) onClose();
      }}
      open
    >
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Popup className="w-full max-w-215">
            <Dialog.Header className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-color">
                  {toCategoryLabel(draft.category)}
                </span>
                <Dialog.Title className="text-lg font-semibold tracking-tight">
                  {draft.displayName}
                </Dialog.Title>
                <p className="max-w-[60ch] text-sm leading-relaxed text-muted-color">
                  {draft.blurb}
                </p>
              </div>
              <Dialog.HeaderActions>
                <Dialog.Close
                  aria-label="Close"
                  as={Button}
                  iconOnly
                  rounded
                  variant="text"
                >
                  <XIcon />
                </Dialog.Close>
              </Dialog.HeaderActions>
            </Dialog.Header>

            <Dialog.Content className="grid grid-cols-1 gap-6 wide:grid-cols-[minmax(0,1fr)_320px]">
              <div className="flex flex-col gap-5.5">
                <SliderField
                  label="Duration"
                  max={DURATION.max}
                  min={DURATION.min}
                  onChange={(duration) => updateDraft({ duration })}
                  step={DURATION_STEP}
                  value={draft.duration}
                  valueLabel={formatDuration(draft.duration)}
                />
                <SliderField
                  label="Speed"
                  max={SPEED.max}
                  min={SPEED.min}
                  onChange={(speed) => updateDraft({ speed })}
                  value={draft.speed}
                  valueLabel={`${draft.speed} / ${SPEED.max}`}
                />
                <SliderField
                  hint="range of motion"
                  label="Intensity"
                  max={INTENSITY.max}
                  min={INTENSITY.min}
                  onChange={(intensity) => updateDraft({ intensity })}
                  value={draft.intensity}
                  valueLabel={`${draft.intensity} / ${INTENSITY.max}`}
                />

                {'path' in draft && (
                  <div className="flex flex-col gap-2.5">
                    <span className="text-sm font-medium">
                      Path
                      <span className="font-normal text-muted-color">
                        {' '}
                        the shape the target traces
                      </span>
                    </span>
                    <TargetPathChooser
                      onSelect={(path) => updateDraft({ path })}
                      selected={draft.path}
                    />
                  </div>
                )}

                <div className="flex flex-col gap-2.5">
                  <span className="text-sm font-medium">Color scheme</span>
                  <PaletteChooser
                    onSelect={(scheme) => updateDraft({ scheme })}
                    selected={draft.scheme}
                  />
                </div>

                <div className="flex items-center gap-2.5">
                  <Checkbox.Root
                    checked={draft.backgroundNoise}
                    inputId="background-noise"
                    onCheckedChange={(event: CheckboxRootChangeEvent) =>
                      updateDraft({ backgroundNoise: event.checked })
                    }
                  >
                    <Checkbox.Box>
                      <Checkbox.Indicator match="checked">
                        <CheckIcon />
                      </Checkbox.Indicator>
                    </Checkbox.Box>
                  </Checkbox.Root>
                  <label className="text-sm" htmlFor="background-noise">
                    Add background texture
                    <span className="text-muted-color">
                      {' '}
                      raises visual load
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="overflow-hidden rounded-lg border border-surface-200 dark:border-surface-700">
                  <ExerciseCanvas
                    className="block aspect-video w-full"
                    exercise={draft}
                  />
                </div>

                <div className="flex flex-col gap-2.5 rounded-lg border border-surface-200 p-4 dark:border-surface-700">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-muted-color">
                      Difficulty score
                    </span>
                    <span className="flex items-baseline gap-2">
                      <span className="font-mono text-xl font-medium">
                        {formatDifficultyScore(difficulty)}
                      </span>
                      <span className="text-xs uppercase tracking-wider text-muted-color">
                        {`/ ${SPEED.max}`}
                      </span>
                    </span>
                  </div>
                  <ProgressMeter
                    ariaLabel={`${draft.displayName} difficulty`}
                    thickness={5}
                    value={difficulty * 10}
                  />
                  <p className="font-mono text-xs leading-relaxed text-muted-color">
                    <ExerciseConfigBreakdown exercise={draft} />
                  </p>
                </div>

                <Button onClick={() => onAddExerciseToProgram(draft)}>
                  {submitLabel}
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Popup>
        </Dialog.Positioner>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
