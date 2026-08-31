import { Centering } from './centering';
import { ExercisesList } from './ExercisesList';

export function ExerciseBasket() {
  return (
    <section id="home">
      <Centering>
        <div className="grid grid-cols-[2.5fr_1fr] gap-4">
          <div className="flex flex-col gap-4">
            <div className="w-100">
              <h1 className="font-semibold text-xl">Build your program</h1>
              <p className="text-sm text-muted-color">
                Choose exericses, tune each one to your current tolerance, then
                add it to your program.
              </p>
              <p className="text-sm text-muted-color">
                Each exercise will have a difficulty rating applied to it, which
                is based on the exercise's speed, duration, visual noise and
                intensity.
              </p>
            </div>
            <div>
              <ExercisesList />
            </div>
          </div>
          <div>other stuff</div>
        </div>
      </Centering>
    </section>
  );
}
