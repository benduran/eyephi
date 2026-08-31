import { z } from 'zod';

export type Nullish<T> = T | null | undefined;

export const ThemeSchema = z.enum(['dark', 'light']).default('light');
export type Theme = 'dark' | 'light';

export const ProgramProgressViewSchema = z.object({
  elapsed: z.int().min(0).max(100),
  progress: z.int().min(0).max(100),
});
export type ProgramProgressView = z.infer<typeof ProgramProgressViewSchema>;

/**
 * in case you're wondering, since we're persisting the exercise configuration to the user's
 * query string, we *don't* need a unique ID because we don't care about deduplicating.
 * in fact, it's okay if a user adds multiple copies of the same type of exercise to their plan
 */
const BaseExericseSchema = z.object({
  backgroundNoise: z.boolean(),
  blurb: z.string().nonempty().nonoptional(),
  displayName: z.string().nonempty().nonoptional(),
  // value is in seconds
  duration: z
    .int()
    .min(30)
    .max(30 * 6),
  intensity: z.int().min(1).max(10),
  scheme: z.enum(['soft_mono', 'high_contrast', 'cool', 'warm']),
  speed: z.int().min(1).max(10),
});

// NOTE: The discriminated union will allow us to further expand into other exericses
// who might have non-uniform configuration options
export const ExerciseSchema = z.discriminatedUnion('type', [
  BaseExericseSchema.extend({
    type: z.literal('vor_horizontal'),
  }),
  BaseExericseSchema.extend({
    type: z.literal('vor_horizontal_combo'),
  }),
  BaseExericseSchema.extend({
    type: z.literal('vor_vertical'),
  }),
  BaseExericseSchema.extend({
    type: z.literal('vor_vertical_combo'),
  }),
  BaseExericseSchema.extend({
    type: z.literal('optokinetic_stripes'),
  }),
  BaseExericseSchema.extend({
    type: z.literal('dynamic_moving_letters'),
  }),
  BaseExericseSchema.extend({
    type: z.literal('path_tracing'),
  }),
  BaseExericseSchema.extend({
    type: z.literal('random_saccades'),
  }),
]);
export type Exercise = z.infer<typeof ExerciseSchema>;
