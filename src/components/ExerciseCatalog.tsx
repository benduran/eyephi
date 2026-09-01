'use client';

import { useMemo, useState } from 'react';
import { useBasketBuilder } from '../context/BasketBuilder';
import type { ExerciseCategory, Nullish } from '../schema/types';
import { CategoryFilter } from './CategoryFilter';
import { ExercisesList } from './ExercisesList';

export function ExerciseCatalog() {
  /** context */
  const { defaultExercises } = useBasketBuilder();

  /** state */
  const [category, setCategory] = useState<Nullish<ExerciseCategory>>(null);

  /** memos */
  const visible = useMemo(
    () =>
      category
        ? defaultExercises.filter((ex) => ex.category === category)
        : defaultExercises,
    [category, defaultExercises],
  );

  return (
    <div className="flex flex-col gap-4">
      <CategoryFilter onSelect={setCategory} selected={category} />
      <ExercisesList exercises={visible} />
    </div>
  );
}
