'use client';

import { ListIcon } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@primereact/ui/button';
import { Menu } from '@primereact/ui/menu';
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

  const startProgramLink = (
    <Link
      aria-disabled={!hasProgram}
      className={hasProgram ? undefined : 'pointer-events-none'}
      href={uiRoutes.runProgram(program)}
      tabIndex={hasProgram ? undefined : -1}
    >
      <Button disabled={!hasProgram}>Start program</Button>
    </Link>
  );

  const newProgramLink = (
    <Link href={uiRoutes.home()}>
      <Button severity="secondary" variant="outlined">
        New
      </Button>
    </Link>
  );

  const shareLink = (
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
  );

  return (
    <div>
      <div className="block md:hidden" id="mobile-menu">
        <Menu.Root>
          <Menu.Trigger>
            <ListIcon />
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner>
              <Menu.Popup className="w-50">
                <Menu.List>
                  <Menu.Item className="[&_a]:flex [&_a]:grow [&_a]:[&_button]:grow">
                    {startProgramLink}
                  </Menu.Item>
                  <Menu.Item className="[&_a]:flex [&_a]:grow [&_a]:[&_button]:grow">
                    {newProgramLink}
                  </Menu.Item>
                  <Menu.Item className="[&_a]:flex [&_a]:grow [&_a]:[&_button]:grow">
                    {shareLink}
                  </Menu.Item>
                </Menu.List>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </div>
      <div
        className="hidden md:flex flex-none items-center gap-2"
        id="desktop-menu"
      >
        {startProgramLink}
        {newProgramLink}
        {shareLink}

        <ThemeToggle />
      </div>
    </div>
  );
}
