import { Suspense } from 'react';
import { ExerciseBasket } from '../../components/ExerciseBasket';
import { PageLoader } from '../../components/PageLoader';
import { BasketBuilderProvider } from '../../context/BasketBuilder';
import { fetchAllExerciseDefaults } from '../../lib/exercisesList';

export default async function HomePage() {
  const defaultExercises = await fetchAllExerciseDefaults();
  return (
    <Suspense fallback={<PageLoader>Loading exercises...</PageLoader>}>
      <BasketBuilderProvider defaultExercises={defaultExercises}>
        <ExerciseBasket />
      </BasketBuilderProvider>
    </Suspense>
  );
}
