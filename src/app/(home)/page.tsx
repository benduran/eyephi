import { ExerciseBasket } from '../../components/ExerciseBasket';
import { BasketBuilderProvider } from '../../context/BasketBuilder';
import { fetchAllExerciseDefaults } from '../../lib/exercisesList';

export default async function HomePage() {
  const defaultExercises = await fetchAllExerciseDefaults();
  return (
    <BasketBuilderProvider defaultExercises={defaultExercises}>
      <ExerciseBasket />
    </BasketBuilderProvider>
  );
}
