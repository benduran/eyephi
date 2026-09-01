'use client';

import { useMemo, useState } from 'react';
import { useBasketBuilder } from '../context/BasketBuilder';
import type { ExerciseCategory } from '../schema/types';
import type { Nullish } from '../util/nullish';
import { CategoryFilter } from './CategoryFilter';
import { ExercisesList } from './ExercisesList';

export function ExerciseCatalog() {
  const { defaultExercises } = useBasketBuilder();

  const [category, setCategory] = useState<Nullish<ExerciseCategory>>(null);

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
