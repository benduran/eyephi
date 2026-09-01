import type {
  Exercise,
  PathTunedExerciseKey,
  Program,
  TunedExerciseKey,
} from '../schema/types';
import {
  ColorSchemeSchema,
  ExerciseDurationSchema,
  ExerciseIntensitySchema,
  ExerciseSchema,
  ExerciseSpeedSchema,
  TargetPathSchema,
} from '../schema/types';
import type { Bounds } from './schemaBounds';
import { numericBounds } from './schemaBounds';

type Randomizer = () => number;

/** Below this a "program" is really just a couple of drills. */
export const MIN_RANDOM_EXERCISES = 3;

/** Durations land on the same quarter-minutes the config dialog's slider steps by. */
const DURATION_STEP = 15;

function randomInt(random: Randomizer, { max, min }: Bounds): number {
  return min + Math.floor(random() * (max - min + 1));
}

/** Snapped to `step`, then clamped, so the last bucket cannot overshoot the max. */
function randomSteppedInt(
  random: Randomizer,
  bounds: Bounds,
  step: number,
): number {
  const steps = Math.floor((bounds.max - bounds.min) / step);
  const value = bounds.min + Math.floor(random() * (steps + 1)) * step;

  return Math.min(bounds.max, value);
}

function pickOne<T>(random: Randomizer, options: readonly T[]): T {
  const picked = options[Math.floor(random() * options.length)];
  if (!picked) {
    throw new Error('cannot pick from an empty set of options');
  }

  return picked;
}

type TunedKey = TunedExerciseKey | PathTunedExerciseKey;

type RandomTuning = {
  [K in TunedKey]: (
    random: Randomizer,
  ) => Extract<Exercise, { [P in K]: unknown }>[K];
};

/**
 * Every knob a patient can tune, and how to roll it. `path` only exists on some
 * drills, which is why each roll is applied by key presence rather than blindly.
 */
const RANDOM_TUNING = {
  backgroundNoise: (random) => random() < 0.5,
  duration: (random) =>
    randomSteppedInt(
      random,
      numericBounds(ExerciseDurationSchema),
      DURATION_STEP,
    ),
  intensity: (random) =>
    randomInt(random, numericBounds(ExerciseIntensitySchema)),
  path: (random) => pickOne(random, TargetPathSchema.options),
  scheme: (random) => pickOne(random, ColorSchemeSchema.options),
  speed: (random) => randomInt(random, numericBounds(ExerciseSpeedSchema)),
} as const satisfies RandomTuning;

const TUNING_ENTRIES = Object.entries(RANDOM_TUNING) as [
  TunedKey,
  (random: Randomizer) => unknown,
][];

function tuneRandomly(exercise: Exercise, random: Randomizer): Exercise {
  const tuned: Record<string, unknown> = { ...exercise };
  for (const [key, roll] of TUNING_ENTRIES) {
    // Skips `path` on the drills that do not have one, so no key is invented.
    if (key in exercise) tuned[key] = roll(random);
  }

  // Interior parse: a shape that fails here is a bug in the rolls above.
  return ExerciseSchema.parse(tuned);
}

/**
 * Fisher-Yates over a copy, so the catalogue is never mutated. This is the
 * modern (Durstenfeld) form: walk down, swapping with a random earlier index.
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
 */
function shuffled(exercises: Exercise[], random: Randomizer): Exercise[] {
  const pool = [...exercises];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const a = pool[i];
    const b = pool[j];
    if (!a || !b) continue;
    pool[i] = b;
    pool[j] = a;
  }

  return pool;
}

/**
 * A ready-to-run program of distinct exercises, each with randomised tuning.
 * Picks between MIN_RANDOM_EXERCISES and however many the catalogue holds, and
 * clamps the floor too so a catalogue smaller than the minimum still works.
 */
export function buildRandomProgram(
  available: Exercise[],
  random: Randomizer = Math.random,
): Program {
  const max = available.length;
  if (max === 0) return [];

  const min = Math.min(MIN_RANDOM_EXERCISES, max);
  const count = randomInt(random, { max, min });

  return shuffled(available, random)
    .slice(0, count)
    .map((exercise) => tuneRandomly(exercise, random));
}
