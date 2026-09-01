'use client';

import { useRouter } from 'next/navigation';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';
import { useBasketBuilder } from '../context/BasketBuilder';
import { scoreProgram, toDifficultyBand } from '../lib/difficulty';
import { totalDuration } from '../lib/program';
import { QUERY_KEYS, uiRoutes } from '../routing/uiRoutes';
import type { Exercise } from '../schema/types';
import { isNumber } from '../util/isNumber';
import { Centering } from './Centering';
import { ConfigDialog } from './ConfigDialog';
import { ExerciseCatalog } from './ExerciseCatalog';
import { MobileSubmitBar } from './MobileSubmitBar';
import { ProgramPanel } from './ProgramPanel';
import { ReadyDialog } from './ReadyDialog';

export function ExerciseBasket() {
  const {
    addExercise,
    adding,
    closeDraft,
    editing,
    editingIndex,
    exercises,
    updateExercise,
  } = useBasketBuilder();

  const difficulty = useMemo(() => scoreProgram(exercises), [exercises]);
  const draft = adding ?? editing;

  const router = useRouter();
  const [ready, setReady] = useQueryState(
    QUERY_KEYS.ready,
    parseAsBoolean.withDefault(false).withOptions({ shallow: true }),
  );

  const onSubmit = useCallback(() => setReady(true), [setReady]);
  const onCloseReady = useCallback(() => setReady(false), [setReady]);
  const onStartNow = useCallback(
    () => router.push(uiRoutes.runProgram(exercises)),
    [exercises, router],
  );
  const onAddExerciseToProgram = useCallback(
    (tuned: Exercise) => {
      if (adding) {
        addExercise(tuned);
      } else if (isNumber(editingIndex)) {
        updateExercise(editingIndex, tuned);
      }
      closeDraft();
    },
    [adding, addExercise, closeDraft, editingIndex, updateExercise],
  );

  return (
    <section id="home">
      <Centering>
        <div className="grid grid-cols-1 items-start gap-8 pb-28 sidebyside:grid-cols-[minmax(0,1fr)_372px] sidebyside:pb-18">
          <div className="flex flex-col gap-4">
            <div className="max-w-[56ch]">
              <h1 className="font-semibold text-xl tracking-tight">
                Build your program
              </h1>
              <p className="text-sm text-muted-color">
                Choose exercises, tune each one to your current tolerance, then
                add it to your program.
              </p>
              <p className="text-sm text-muted-color">
                Difficulty is scored from speed, intensity, duration and visual
                contrast.
              </p>
            </div>
            <ExerciseCatalog />
          </div>
          <ProgramPanel onSubmit={onSubmit} />
        </div>
      </Centering>

      {ready && (
        <ReadyDialog
          exercises={exercises}
          onClose={onCloseReady}
          onStartNow={onStartNow}
        />
      )}

      {draft && (
        <ConfigDialog
          exercise={draft}
          key={adding ? `adding:${draft.type}` : `editing:${editingIndex}`}
          onAddExerciseToProgram={onAddExerciseToProgram}
          onClose={closeDraft}
          submitLabel={adding ? 'Add to program' : 'Save changes'}
        />
      )}

      {exercises.length > 0 && (
        <MobileSubmitBar
          band={toDifficultyBand(difficulty)}
          difficulty={difficulty}
          exerciseCount={exercises.length}
          onSubmit={onSubmit}
          totalSeconds={totalDuration(exercises)}
        />
      )}
    </section>
  );
}
