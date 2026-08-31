import { setTimeout } from 'node:timers/promises';
import type { Exercise } from '../schema/types';
import { ExerciseSchema } from '../schema/types';

type ExerciseType = Exercise['type'];
type ExerciseDefaults = Omit<Exercise, 'type'>;

/** Prose that is unique per exercise, so it can never fall back to a default. */
type ExerciseCopy = Pick<ExerciseDefaults, 'blurb' | 'displayName'>;
/** The knobs that mostly share one sensible starting point. */
type ExerciseTuning = Omit<ExerciseDefaults, keyof ExerciseCopy>;

/** The starting point every exercise shares; entries below override only what differs. */
const BASE_DEFAULTS = {
  backgroundNoise: false,
  duration: 60,
  intensity: 3,
  scheme: 'soft_mono',
  speed: 3,
} satisfies ExerciseTuning;

/**
 * Copy plus any per-type deviations from BASE_DEFAULTS. Every entry must carry
 * its own blurb and displayName; only the tuning knobs are optional.
 *
 * Typed as a full Record so adding a member to ExerciseSchema's union fails
 * compilation here until it gets a default.
 */
const DEFAULT_OVERRIDES = {
  dynamic_moving_letters: {
    blurb:
      'Letters drift across the screen while your head keeps moving — call out each one as it becomes readable.',
    displayName: 'Dynamic moving letters',
    duration: 45,
  },
  optokinetic_stripes: {
    blurb:
      'A slow field of shapes drifts past to desensitise you to large-field motion. Stay relaxed and let it move.',
    displayName: 'Optokinetic shapes',
    duration: 30,
  },
  path_tracing: {
    blurb:
      'Follow a target as it glides along a winding path, using your eyes only. Keep your head completely still.',
    displayName: 'Path tracing',
  },
  random_saccades: {
    blurb:
      'Targets appear at unpredictable points. Snap your gaze to each one the moment it shows up.',
    displayName: 'Random Saccades',
    duration: 45,
  },
  vor_horizontal: {
    blurb:
      'Hold your gaze on a fixed target while turning your head side to side at a steady tempo.',
    displayName: 'VOR Horizontal',
  },
  vor_horizontal_combo: {
    blurb:
      'The target drifts opposite your head turn, so your eyes work twice as hard. The harder horizontal progression.',
    displayName: 'VOR Horizontal Combo',
    duration: 45,
  },
  vor_vertical: {
    blurb:
      'Hold your gaze on a fixed target while nodding your head up and down at a steady tempo.',
    displayName: 'VOR Vertical',
  },
  vor_vertical_combo: {
    blurb:
      'The target drifts opposite your nod, so your eyes work twice as hard. The harder vertical progression.',
    displayName: 'VOR Vertical Combo',
    duration: 45,
  },
} satisfies Record<ExerciseType, ExerciseCopy & Partial<ExerciseTuning>>;

const ALL_EXERCISES_DEFAULTS: Exercise[] = ExerciseSchema.array().parse(
  Object.entries(DEFAULT_OVERRIDES).map(([type, overrides]) => ({
    ...BASE_DEFAULTS,
    ...overrides,
    type,
  })),
);

/**
 * we are "faking" returning data on a delay like it was being fetched
 * from a real API by introducing a randomized delay, up to 3 seconds
 */
export async function fetchAllExerciseDefaults() {
  await setTimeout(Math.max(1, Math.floor(Math.random() * 4)) * 1000);
  return ALL_EXERCISES_DEFAULTS;
}
