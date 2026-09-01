'use client';

import { Button } from '@primereact/ui/button';
import Link from 'next/link';
import { useBasketBuilder } from '../context/BasketBuilder';
import { useRunProgram } from '../context/RunProgram';
import { uiRoutes } from '../routing/uiRoutes';
import { Centering } from './Centering';
import { DoneView } from './DoneView';
import { ImmersiveStage } from './ImmersiveStage';
import { RunView } from './RunView';

export function RunWorkspace() {
  const { exercises } = useBasketBuilder();
  const { immersive, view } = useRunProgram();

  if (exercises.length === 0) {
    return (
      <section id="run">
        <Centering>
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <h2 className="text-xl font-semibold tracking-tight">
              Nothing to run yet
            </h2>
            <p className="text-sm text-muted-color">
              Build a program to get started.
            </p>
            <Link href={uiRoutes.home()}>
              <Button>Build a program</Button>
            </Link>
          </div>
        </Centering>
      </section>
    );
  }

  if (view === 'done') return <DoneView />;
  if (immersive) return <ImmersiveStage />;
  return <RunView />;
}
