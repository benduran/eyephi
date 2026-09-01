import { encodeExerciseProgram } from '../lib/programCodec';
import type { Exercise, Nullish, Program } from '../schema/types';

/**
 * Every query key the app reads, in one place so a route builder and the hook
 * that parses it cannot drift apart.
 */
export const QUERY_KEYS = {
  adding: 'adding',
  editing: 'editing',
  immersive: 'immersive',
  program: 'program',
  ready: 'ready',
  view: 'view',
} as const;

/**
 * The assembled program, or the encoded form already sitting in the URL.
 * Callers above the providers only have the latter and cannot decode it.
 */
type ProgramInput = Program | string;

function toEncodedProgram(program: ProgramInput): Nullish<string> {
  if (typeof program === 'string') return program || null;

  return program.length > 0 ? encodeExerciseProgram(program) : null;
}

/**
 * The program rides in the query string, so every link between routes has to
 * carry it or the patient loses what they assembled.
 */
function buildRoute(
  path: string,
  program: ProgramInput,
  extra: Record<string, string> = {},
): string {
  const params = new URLSearchParams(extra);
  const encoded = toEncodedProgram(program);
  if (encoded) params.set(QUERY_KEYS.program, encoded);

  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

export const uiRoutes = {
  basketBuilderAdd: (
    exerciseType: Exercise['type'],
    program: ProgramInput = [],
  ) => buildRoute('/', program, { [QUERY_KEYS.adding]: exerciseType }),
  basketBuilderEdit: (exerciseIndex: number, program: ProgramInput = []) =>
    buildRoute('/', program, { [QUERY_KEYS.editing]: String(exerciseIndex) }),
  home: (program: ProgramInput = []) => buildRoute('/', program),
  runProgram: (program: ProgramInput) => buildRoute('/program', program),
  shareProgram: (program: ProgramInput) =>
    buildRoute('/', program, { [QUERY_KEYS.ready]: 'true' }),
};
