'use client';

import type { CategoryView, ExerciseView } from '../schema/types';
import { CategoryFilter } from './categoryFilter';
import { ExerciseCatalog } from './exerciseCatalog';
import type { ProgramPanelProps } from './programPanel';
import { ProgramPanel } from './programPanel';

export type BuildViewProps = {
  categories: CategoryView[];
  exercises: ExerciseView[];
  onCategoryChange: (id: string) => void;
  onConfigure: (id: string) => void;
  program: ProgramPanelProps;
  selectedCategoryId: string;
};

export function BuildView({
  categories,
  exercises,
  onCategoryChange,
  onConfigure,
  program,
  selectedCategoryId,
}: BuildViewProps) {
  return (
    <main className="mx-auto grid max-w-[1320px] grid-cols-1 items-start gap-[22px] px-4 pt-[22px] pb-[108px] wide:gap-8 wide:px-[22px] wide:pt-7 wide:pb-[72px] aside:grid-cols-[minmax(0,1fr)_372px] aside:px-7 aside:pt-9 aside:pb-24">
      <section>
        <div className="mb-[22px]">
          <h1 className="m-0 mb-1.5 text-[21px] font-semibold tracking-tight wide:text-2xl">
            Build your program
          </h1>
          <p className="m-0 max-w-[56ch] text-sm leading-relaxed text-surface-500 dark:text-surface-400">
            Choose exercises, tune each one to your tolerance, then add it to
            your program. Difficulty is scored from speed, amplitude, duration
            and visual contrast.
          </p>
        </div>

        <div className="mb-3.5">
          <CategoryFilter
            categories={categories}
            onCategoryChange={onCategoryChange}
            selectedId={selectedCategoryId}
          />
        </div>

        <ExerciseCatalog exercises={exercises} onConfigure={onConfigure} />
      </section>

      <aside>
        <ProgramPanel {...program} />
      </aside>
    </main>
  );
}
