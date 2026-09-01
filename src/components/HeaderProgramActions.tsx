'use client';

import { Button } from '@primereact/ui/button';
import Link from 'next/link';
import { uiRoutes } from '../routing/uiRoutes';
import type { Nullish } from '../util/nullish';
import { ThemeToggle } from './ThemeToggle';

export type HeaderProgramActionsProps = {
  /**
   * Straight off the URL, never decoded: these links only need to carry the
   * program along, not read it. Null disables the ones that act on a program.
   */
  encodedProgram: Nullish<string>;
};

export function HeaderProgramActions({
  encodedProgram,
}: HeaderProgramActionsProps) {
  const program = encodedProgram ?? [];
  const hasProgram = Boolean(encodedProgram);

  return (
    <div className="flex flex-none items-center gap-2">
      <Link
        aria-disabled={!hasProgram}
        className={hasProgram ? undefined : 'pointer-events-none'}
        href={uiRoutes.runProgram(program)}
        tabIndex={hasProgram ? undefined : -1}
      >
        <Button disabled={!hasProgram}>Start program</Button>
      </Link>

      <Link href={uiRoutes.home()}>
        <Button severity="secondary" variant="outlined">
          New
        </Button>
      </Link>

      <Link
        aria-disabled={!hasProgram}
        className={hasProgram ? undefined : 'pointer-events-none'}
        href={uiRoutes.shareProgram(program)}
        tabIndex={hasProgram ? undefined : -1}
      >
        <Button disabled={!hasProgram} severity="secondary" variant="outlined">
          Share
        </Button>
      </Link>

      <ThemeToggle />
    </div>
  );
}
