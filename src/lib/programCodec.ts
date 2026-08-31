import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';
import type { EncodedExercise, Exercise, Program } from '../schema/types';
import {
  ENCODED_EXERCISE_FIELDS,
  EncodedProgramSchema,
  PROGRAM_WIRE_VERSION,
  ProgramSchema,
} from '../schema/types';

// the typecast here is a little gross, but it's a necessary evil because Object.entries()
// widens the key type to be just "string"
const ENCODED_EXERCISE_FIELDS_ENTRIES = Object.entries(
  ENCODED_EXERCISE_FIELDS,
) as [keyof typeof ENCODED_EXERCISE_FIELDS, number][];

function toWire(exercise: Exercise): EncodedExercise {
  // Slots are filled by name below, which an empty tuple literal cannot express.
  const wire = new Array(
    ENCODED_EXERCISE_FIELDS_ENTRIES.length,
  ) as unknown as EncodedExercise;

  for (const [exerciseKey, tupleSlot] of ENCODED_EXERCISE_FIELDS_ENTRIES) {
    // also gross is the typecast here, but it's runtime-safe and a small price to pay
    // for having less verbose code
    (wire as unknown[])[tupleSlot] = exercise[exerciseKey];
  }

  return wire;
}

function fromWire(wire: EncodedExercise, catalog: Exercise[]): Exercise[] {
  // An exercise the catalogue no longer carries is dropped, not fatal.
  const definition = catalog.find(
    (entry) => entry.type === wire[ENCODED_EXERCISE_FIELDS.type],
  );
  if (!definition) return [];

  return [
    {
      ...definition,
      backgroundNoise: wire[ENCODED_EXERCISE_FIELDS.backgroundNoise],
      duration: wire[ENCODED_EXERCISE_FIELDS.duration],
      intensity: wire[ENCODED_EXERCISE_FIELDS.intensity],
      scheme: wire[ENCODED_EXERCISE_FIELDS.scheme],
      speed: wire[ENCODED_EXERCISE_FIELDS.speed],
    },
  ];
}

/**
 * Encoding is interior, so a shape that fails here is a bug in `toWire` rather
 * than bad input. It throws: swallowing it would silently blank the program out
 * of the user's URL, which is far harder to notice than a stack trace.
 */
export function encodeExerciseProgram(program: Program): string {
  const validated = EncodedProgramSchema.parse([
    PROGRAM_WIRE_VERSION,
    program.map(toWire),
  ]);

  return compressToEncodedURIComponent(JSON.stringify(validated));
}

/**
 * A shared link is untrusted input, so anything malformed decodes to an empty
 * program rather than throwing. `catalog` is injected because this runs on the
 * client and the catalogue module is server-only.
 */
export function decodeProgram(encoded: string, catalog: Exercise[]): Program {
  let json: string;
  try {
    json = decompressFromEncodedURIComponent(encoded);
    if (!json) return [];
  } catch {
    return [];
  }

  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return [];
  }

  const wire = EncodedProgramSchema.safeParse(raw);
  if (!wire.success) return [];

  const [, entries] = wire.data;
  const program = ProgramSchema.safeParse(
    entries.flatMap((entry) => fromWire(entry, catalog)),
  );

  return program.success ? program.data : [];
}
