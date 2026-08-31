import { z } from 'zod';

export type Nullish<T> = T | null | undefined;

export const ThemeSchema = z.enum(['dark', 'light']).default('light');
export type Theme = 'dark' | 'light';

export const ProgramProgressViewSchema = z.object({
  elapsed: z.int().min(0),
  total: z.int().min(0),
});
export type ProgramProgressView = z.infer<typeof ProgramProgressViewSchema>;

export const ExerciseCategorySchema = z.enum([
  'gaze_stability',
  'ocular_motor',
  'habituation',
]);
export type ExerciseCategory = z.infer<typeof ExerciseCategorySchema>;

export const ColorSchemeSchema = z.enum([
  'soft_mono',
  'high_contrast',
  'cool',
  'warm',
]);
export type ColorScheme = z.infer<typeof ColorSchemeSchema>;

/** Plain-language band a difficulty score falls into. */
export const DifficultyBandSchema = z.enum([
  'gentle',
  'moderate',
  'challenging',
  'intense',
]);
export type DifficultyBand = z.infer<typeof DifficultyBandSchema>;

/** Shared by the model and the wire format so the bounds cannot drift apart. */
// value is in seconds
export const ExerciseDurationSchema = z
  .int()
  .min(30)
  .max(30 * 6);
export const ExerciseIntensitySchema = z.int().min(1).max(10);
export const ExerciseSpeedSchema = z.int().min(1).max(10);

/**
 * in case you're wondering, since we're persisting the exercise configuration to the user's
 * query string, we *don't* need a unique ID because we don't care about deduplicating.
 * in fact, it's okay if a user adds multiple copies of the same type of exercise to their plan
 */
const BaseExericseSchema = z.object({
  backgroundNoise: z.boolean(),
  blurb: z.string().nonempty().nonoptional(),
  category: ExerciseCategorySchema,
  /** Shown while the exercise runs, phrased as an instruction to the patient. */
  cue: z.string().nonempty().nonoptional(),
  displayName: z.string().nonempty().nonoptional(),
  duration: ExerciseDurationSchema,
  intensity: ExerciseIntensitySchema,
  scheme: ColorSchemeSchema,
  speed: ExerciseSpeedSchema,
  /** Clinical demand multiplier folded into the difficulty score. */
  weight: z.number().min(0.5).max(2),
});

// NOTE: The discriminated union will allow us to further expand into other exericses
// who might have non-uniform configuration options
export const ExerciseSchema = z.discriminatedUnion('type', [
  BaseExericseSchema.extend({
    type: z.literal('vor_x1_horizontal'),
  }),
  BaseExericseSchema.extend({
    type: z.literal('vor_x1_vertical'),
  }),
  BaseExericseSchema.extend({
    type: z.literal('vor_x2_horizontal'),
  }),
  BaseExericseSchema.extend({
    type: z.literal('vor_x2_vertical'),
  }),
  BaseExericseSchema.extend({
    type: z.literal('smooth_pursuit'),
  }),
  BaseExericseSchema.extend({
    type: z.literal('horizontal_saccades'),
  }),
  BaseExericseSchema.extend({
    type: z.literal('near_far_convergence'),
  }),
  BaseExericseSchema.extend({
    type: z.literal('optokinetic_stimulation'),
  }),
  BaseExericseSchema.extend({
    type: z.literal('dynamic_visual_acuity'),
  }),
]);
export type Exercise = z.infer<typeof ExerciseSchema>;

export const ProgramSchema = z.array(ExerciseSchema);
export type Program = z.infer<typeof ProgramSchema>;

/** Bump when the tuple layout changes so stale links fail cleanly instead of decoding wrong. */
export const PROGRAM_WIRE_VERSION = 1;

/**
 * Where each tuned field sits inside an encoded exercise tuple.
 */
export const ENCODED_EXERCISE_FIELDS = {
  backgroundNoise: 5,
  duration: 1,
  intensity: 3,
  scheme: 4,
  speed: 2,
  type: 0,
} as const satisfies Record<
  keyof Pick<
    Exercise,
    'backgroundNoise' | 'duration' | 'intensity' | 'scheme' | 'speed' | 'type'
  >,
  number
>;

/**
 * The shape a shared link actually carries: only the knobs a patient tunes.
 * Copy, category and weight are rehydrated from the catalogue on decode.
 * Append new fields to the end, never reorder.
 */
export const EncodedExerciseSchema = z.tuple([
  // Deliberately a loose string: a link naming a retired exercise should drop
  // that one entry on decode, not fail the whole program.
  z.string(),
  ExerciseDurationSchema,
  ExerciseSpeedSchema,
  ExerciseIntensitySchema,
  ColorSchemeSchema,
  z.boolean(),
]);
export type EncodedExercise = z.infer<typeof EncodedExerciseSchema>;

export const EncodedProgramSchema = z.tuple([
  z.literal(PROGRAM_WIRE_VERSION),
  z.array(EncodedExerciseSchema),
]);
export type EncodedProgram = z.infer<typeof EncodedProgramSchema>;
