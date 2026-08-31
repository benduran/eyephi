import type {
  DifficultyBand,
  Exercise,
  Nullish,
  Program,
} from '../schema/types';
import {
  ExerciseDurationSchema,
  ExerciseIntensitySchema,
  ExerciseSpeedSchema,
} from '../schema/types';
import { isNumber } from '../util/isNumber';
import { PALETTES } from './palettes';

type ScoreInput = {
  /** Turns a tuned value into a 0-1 scale of this input's weight. */
  scale: (exercise: Exercise) => number;
  /** How hard this input pulls on the score when at full value. */
  weight: number;
};

/**
 * Reads the bounds off the schema rather than restating them, so widening a
 * field's range cannot silently skew every score. Throws at module load.
 */
function scaledBySchema(
  schema: { maxValue: Nullish<number>; minValue: Nullish<number> },
  readVal: (exercise: Exercise) => number,
): ScoreInput['scale'] {
  const { maxValue, minValue } = schema;
  if (!isNumber(minValue) || !isNumber(maxValue) || minValue === maxValue) {
    throw new Error('a scored field must declare a finite min and max');
  }

  return (exercise) =>
    Math.min(
      1,
      Math.max(0, (readVal(exercise) - minValue) / (maxValue - minValue)),
    );
}

/**
 * Every input that moves the score, with how to read it. Adding one is a single
 * entry here and nothing else.
 */
const SCORE_INPUTS = {
  backgroundNoise: {
    scale: (exercise) => (exercise.backgroundNoise ? 1 : 0),
    weight: 0.14,
  },
  duration: {
    scale: scaledBySchema(ExerciseDurationSchema, (e) => e.duration),
    weight: 0.14,
  },
  intensity: {
    scale: scaledBySchema(ExerciseIntensitySchema, (e) => e.intensity),
    weight: 0.24,
  },
  scheme: {
    scale: (exercise) => PALETTES[exercise.scheme].stimulation,
    weight: 0.24,
  },
  speed: {
    scale: scaledBySchema(ExerciseSpeedSchema, (e) => e.speed),
    weight: 0.28,
  },
} as const satisfies Record<
  keyof Pick<
    Exercise,
    'backgroundNoise' | 'duration' | 'intensity' | 'scheme' | 'speed'
  >,
  ScoreInput
>;

const SCORE_MIN = 1;
const SCORE_MAX = 10;

/** Exclusive upper bound of each band. Anything above the last one is intense. */
const BAND_CEILINGS = [
  { band: 'gentle', ceiling: 3.5 },
  { band: 'moderate', ceiling: 6.5 },
  { band: 'challenging', ceiling: 8.2 },
] as const satisfies readonly { band: DifficultyBand; ceiling: number }[];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** One decimal place, which is the precision the design displays. */
function roundToTenth(value: number): number {
  return Math.round(value * 10) / 10;
}

export function scoreExercise(exercise: Exercise): number {
  const raw = Object.values(SCORE_INPUTS).reduce(
    (total, { scale, weight }) => total + weight * scale(exercise),
    0,
  );

  return roundToTenth(
    clamp(raw * SCORE_MAX * exercise.weight, SCORE_MIN, SCORE_MAX),
  );
}

export function totalDuration(program: Program): number {
  return program.reduce((total, exercise) => total + exercise.duration, 0);
}

/**
 * Duration-weighted mean, so a long gentle exercise counts for more than a
 * short brutal one. An empty program scores zero rather than the 1 floor a
 * single exercise would get.
 */
export function scoreProgram(program: Program): number {
  const seconds = totalDuration(program);
  if (!seconds) return 0;

  const weighted = program.reduce(
    (total, exercise) => total + scoreExercise(exercise) * exercise.duration,
    0,
  );

  return roundToTenth(weighted / seconds);
}

export function toDifficultyBand(score: number): DifficultyBand {
  return (
    BAND_CEILINGS.find(({ ceiling }) => score < ceiling)?.band ?? 'intense'
  );
}
