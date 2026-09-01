import { z } from 'zod';

export const ThemeSchema = z.enum(['dark', 'light']);
export type Theme = z.infer<typeof ThemeSchema>;

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

export const TargetPathSchema = z.enum([
  'horizontal',
  'vertical',
  'circle',
  'ping_pong_circle',
  'figure_eight',
  'random',
]);
export type TargetPath = z.infer<typeof TargetPathSchema>;

export const DEFAULT_TARGET_PATH: TargetPath = 'horizontal';

/** Plain-language band a difficulty score falls into. */
export const DifficultyBandSchema = z.enum([
  'gentle',
  'moderate',
  'challenging',
  'intense',
]);
export type DifficultyBand = z.infer<typeof DifficultyBandSchema>;

/** Seconds. Shared by the model and the wire format so the bounds cannot drift apart. */
export const ExerciseDurationSchema = z
  .int()
  .min(30)
  .max(30 * 6);
export const ExerciseIntensitySchema = z.int().min(1).max(10);
export const ExerciseSpeedSchema = z.int().min(1).max(10);

/** No id: the same exercise may appear in a program more than once. */
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

// Discriminated so a future exercise can carry configuration the others don't.
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
    path: TargetPathSchema,
    type: z.literal('smooth_pursuit'),
  }),
  BaseExericseSchema.extend({
    path: TargetPathSchema,
    type: z.literal('saccades'),
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

/** Where each tuned field sits inside an encoded exercise tuple. */
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

export const ENCODED_TARGET_PATH_SLOT = 6;

export const EncodedExerciseSchema = z.tuple([
  // Deliberately a loose string: a link naming a retired exercise should drop
  // that one entry on decode, not fail the whole program.
  z.string(),
  ExerciseDurationSchema,
  ExerciseSpeedSchema,
  ExerciseIntensitySchema,
  ColorSchemeSchema,
  z.boolean(),
  TargetPathSchema.optional(),
]);
export type EncodedExercise = z.infer<typeof EncodedExerciseSchema>;

export const EncodedProgramSchema = z.tuple([
  z.literal(PROGRAM_WIRE_VERSION),
  z.array(EncodedExerciseSchema),
]);
export type EncodedProgram = z.infer<typeof EncodedProgramSchema>;
