import { Suspense } from 'react';
import { PageLoader } from '../../components/PageLoader';
import { RunProgramGate } from '../../components/RunProgramGate';
import { RunWorkspace } from '../../components/RunWorkspace';
import { BasketBuilderProvider } from '../../context/BasketBuilder';
import { fetchAllExerciseDefaults } from '../../lib/exercisesList';

export default async function ProgramPage() {
  const defaultExercises = await fetchAllExerciseDefaults();

  return (
    <Suspense fallback={<PageLoader>Loading your program...</PageLoader>}>
      <BasketBuilderProvider defaultExercises={defaultExercises}>
        <RunProgramGate>
          <RunWorkspace />
        </RunProgramGate>
      </BasketBuilderProvider>
    </Suspense>
  );
}
