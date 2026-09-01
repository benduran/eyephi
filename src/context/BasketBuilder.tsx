'use client';

import {
  createParser,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from 'nuqs';
import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo } from 'react';
import { decodeProgram, encodeExerciseProgram } from '../lib/programCodec';
import { QUERY_KEYS } from '../routing/uiRoutes';
import type { Exercise } from '../schema/types';
import type { Nullish } from '../util/nullish';

type BasketBuilderContextVal = {
  adding: Nullish<Exercise>;
  addExercise: (exerciseToAdd: Exercise) => void;
  /** Drops both draft keys, which is what closes the config dialog. */
  closeDraft: () => void;
  defaultExercises: Exercise[];
  editing: Nullish<Exercise>;
  editingIndex: Nullish<number>;
  exercises: Exercise[];
  removeExercise: (exerciseIndex: number) => void;
  setAdding: (exerciseType: Exercise['type']) => void;
  setEditing: (exerciseIndex: number) => void;
  updateExercise: (exerciseIndex: number, tuned: Exercise) => void;
};

const context = createContext<Nullish<BasketBuilderContextVal>>(null);

type BasketBuilderProviderProps = PropsWithChildren & {
  defaultExercises: Exercise[];
};

function addingIsValidExerciseType(
  exerciseTypeBeingAdded: string,
  defaultExercises: Exercise[],
): exerciseTypeBeingAdded is Exercise['type'] {
  return defaultExercises.some((ex) => ex.type === exerciseTypeBeingAdded);
}

export function BasketBuilderProvider({
  children,
  defaultExercises,
}: BasketBuilderProviderProps) {
  const programParser = useMemo(
    () =>
      createParser<Exercise[]>({
        // Serialising both sides is how nuqs knows the program is back to empty
        // and can drop the key from the URL entirely.
        eq: (a, b) => encodeExerciseProgram(a) === encodeExerciseProgram(b),
        parse: (queryValue) => decodeProgram(queryValue, defaultExercises),
        serialize: encodeExerciseProgram,
      })
        .withDefault([])
        .withOptions({ shallow: true }),
    [defaultExercises],
  );

  const [adding, setAdding] = useQueryState(
    QUERY_KEYS.adding,
    parseAsString.withOptions({ shallow: true }),
  );
  const [editing, setEditing] = useQueryState(
    QUERY_KEYS.editing,
    parseAsInteger.withOptions({ shallow: true }),
  );
  const [exercises, setExercises] = useQueryState(
    QUERY_KEYS.program,
    programParser,
  );

  const providerVal = useMemo<BasketBuilderContextVal>(
    () => ({
      addExercise: (exerciseToAdd) =>
        setExercises((prev) => [...prev, exerciseToAdd]),
      adding: defaultExercises.find((ex) => ex.type === adding),
      closeDraft: () => {
        setAdding(null);
        setEditing(null);
      },
      defaultExercises,
      editing: exercises.find((_, i) => i === editing),
      editingIndex: editing,
      exercises,
      removeExercise: (exerciseIndex) =>
        setExercises((prev) => prev.toSpliced(exerciseIndex, 1)),
      setAdding: (exerciseType) => {
        if (!addingIsValidExerciseType(exerciseType, defaultExercises)) return;
        setAdding(exerciseType);
      },
      setEditing,
      updateExercise: (exerciseIndex, tuned) =>
        setExercises((prev) => prev.with(exerciseIndex, tuned)),
    }),
    [
      adding,
      editing,
      exercises,
      defaultExercises,
      setAdding,
      setEditing,
      setExercises,
    ],
  );

  return <context.Provider value={providerVal}>{children}</context.Provider>;
}

export function useBasketBuilder() {
  const ctx = useContext(context);
  if (!ctx) {
    throw new Error(
      'unable to useBasketBuilder() because no <BasketBuilderProvider /> was found in the parent tree',
    );
  }

  return ctx;
}
