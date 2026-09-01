'use client';

import type { PropsWithChildren } from 'react';
import { useBasketBuilder } from '../context/BasketBuilder';
import { RunProgramProvider } from '../context/RunProgram';

export function RunProgramGate({ children }: PropsWithChildren) {
  /** context */
  const { exercises } = useBasketBuilder();

  return (
    <RunProgramProvider exercises={exercises}>{children}</RunProgramProvider>
  );
}
