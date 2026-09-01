'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { uiRoutes } from '../routing/uiRoutes';
import { Centering } from './centering';
import { EyePhiLogo } from './eyePhiLogo';
import { HeaderProgramActions } from './HeaderProgramActions';
import { HeaderProgramActionsFromUrl } from './HeaderProgramActionsFromUrl';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-surface-200 bg-surface-50/95 backdrop-blur-md dark:border-surface-700 dark:bg-surface-950/95">
      <Centering>
        <div className="flex h-16 items-center gap-3">
          <Link
            className="flex flex-none items-center gap-2.5"
            href={uiRoutes.home()}
          >
            <EyePhiLogo />
            <span className="text-base font-semibold tracking-tight">
              EyePhi
            </span>
          </Link>

          <div className="min-w-0 flex-1" />

          <Suspense fallback={<HeaderProgramActions encodedProgram={null} />}>
            <HeaderProgramActionsFromUrl />
          </Suspense>
        </div>
      </Centering>
    </header>
  );
}
