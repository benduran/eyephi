'use client';

import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';
import type { Exercise, Nullish } from '../schema/types';

type BasketBuilderContextVal = {
  adding: Nullish<Exercise>;
  addExercise: (exerciseToAdd: Exercise) => void;
  defaultExercises: Exercise[];
  editing: Nullish<Exercise>;
  exercises: Exercise[];
  removeExercise: (exerciseIndex: number) => void;
  setAdding: (exerciseType: Exercise['type']) => void;
  setEditing: (exerciseIndex: number) => void;
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
  /** hooks */
  const [adding, setAdding] = useQueryState(
    'adding',
    parseAsString.withOptions({ shallow: true }),
  );
  const [editing, setEditing] = useQueryState(
    'editing',
    parseAsInteger.withOptions({ shallow: true }),
  );

  /** state */
  const [exercises, setExercises] = useState<Exercise[]>([]);

  /** provider val */
  const providerVal = useMemo<BasketBuilderContextVal>(
    () => ({
      addExercise: (exerciseToAdd) =>
        setExercises((prev) => [...prev, exerciseToAdd]),
      adding: defaultExercises.find((ex) => ex.type === adding),
      defaultExercises,
      editing: exercises.find((_, i) => i === editing),
      exercises,
      removeExercise: (exerciseIndex) =>
        setExercises((prev) => prev.toSpliced(exerciseIndex, 1)),
      setAdding: (exerciseType) => {
        if (!addingIsValidExerciseType(exerciseType, defaultExercises)) return;
        setAdding(exerciseType);
      },
      setEditing,
    }),
    [adding, editing, exercises, defaultExercises, setAdding, setEditing],
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
