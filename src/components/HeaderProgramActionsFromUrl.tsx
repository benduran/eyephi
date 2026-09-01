'use client';

import { parseAsString, useQueryState } from 'nuqs';
import { QUERY_KEYS } from '../routing/uiRoutes';
import { HeaderProgramActions } from './HeaderProgramActions';

/**
 * Reading the query is what forces the header's Suspense boundary, so it is
 * isolated here and the boundary can fall back to the same buttons, inert.
 */
export function HeaderProgramActionsFromUrl() {
  /** hooks */
  const [encodedProgram] = useQueryState(QUERY_KEYS.program, parseAsString);

  return <HeaderProgramActions encodedProgram={encodedProgram} />;
}
