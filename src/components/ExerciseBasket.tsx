'use client';

import { useBasketBuilder } from '../context/BasketBuilder';
import {
  scoreProgram,
  toDifficultyBand,
  totalDuration,
} from '../lib/difficulty';
import { Centering } from './centering';
import { ExerciseCatalog } from './ExerciseCatalog';
import { MobileSubmitBar } from './MobileSubmitBar';
import { ProgramPanel } from './ProgramPanel';

export function ExerciseBasket() {
  /** context */
  const { exercises } = useBasketBuilder();

  // TODO(slice 7): opens the ready dialog once it exists.
  const onSubmit = () => undefined;

  const difficulty = scoreProgram(exercises);

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
