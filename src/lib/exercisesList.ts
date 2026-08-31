import { setTimeout } from 'node:timers/promises';
import type { Exercise } from '../schema/types';
import { ExerciseSchema } from '../schema/types';

type ExerciseType = Exercise['type'];
type ExerciseDefaults = Omit<Exercise, 'type'>;

type ExerciseCopy = Pick<
  ExerciseDefaults,
  'blurb' | 'category' | 'cue' | 'displayName' | 'weight'
>;
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

const DEFAULT_OVERRIDES = {
  dynamic_visual_acuity: {
    blurb:
      'Read the orientation of a target while your head keeps moving. The acuity drill clinicians score you on.',
    category: 'habituation',
    cue: 'Call out which way the gap points.',
    displayName: 'Dynamic Visual Acuity',
    duration: 45,
    weight: 1.1,
  },
  horizontal_saccades: {
    blurb:
      'Snap your gaze between two alternating targets, head still. Trains the fast jumps your eyes make between fixations.',
    category: 'ocular_motor',
    cue: 'Jump your gaze to each target as it appears.',
    displayName: 'Horizontal Saccades',
    duration: 45,
    weight: 0.9,
  },
  near_far_convergence: {
    blurb:
      'The target approaches and recedes. Keep it single and sharp the whole way in.',
    category: 'ocular_motor',
    cue: 'Keep the target single as it approaches.',
    displayName: 'Near-Far Convergence',
    duration: 45,
    weight: 0.85,
  },
  optokinetic_stimulation: {
    blurb:
      'A drifting striped field that desensitises you to large-field motion. Stay relaxed and let it move past.',
    category: 'habituation',
    cue: 'Stay relaxed and let the field drift past.',
    displayName: 'Optokinetic Stimulation',
    duration: 30,
    weight: 1.25,
  },
  smooth_pursuit: {
    blurb:
      'Follow a target as it glides along a winding path, using your eyes only. Keep your head completely still.',
    category: 'ocular_motor',
    cue: 'Head still, follow with your eyes only.',
    displayName: 'Smooth Pursuit',
    weight: 0.8,
  },
  vor_x1_horizontal: {
    blurb:
      'Hold your gaze on a fixed target while turning your head side to side at a steady tempo.',
    category: 'gaze_stability',
    cue: 'Turn your head left and right, keep your eyes on the target.',
    displayName: 'VOR x1 Horizontal',
    weight: 0.95,
  },
  vor_x1_vertical: {
    blurb:
      'Hold your gaze on a fixed target while nodding your head up and down at a steady tempo.',
    category: 'gaze_stability',
    cue: 'Nod up and down, keep your eyes on the target.',
    displayName: 'VOR x1 Vertical',
    weight: 1,
  },
  vor_x2_horizontal: {
    blurb:
      'The target drifts opposite your head turn, so your eyes work twice as hard. The harder horizontal progression.',
    category: 'gaze_stability',
    cue: 'Move your head opposite to the target.',
    displayName: 'VOR x2 Horizontal',
    duration: 45,
    weight: 1.2,
  },
  vor_x2_vertical: {
    blurb:
      'The target drifts opposite your nod, so your eyes work twice as hard. The harder vertical progression.',
    category: 'gaze_stability',
    cue: 'Nod opposite to the drift of the target.',
    displayName: 'VOR x2 Vertical',
    duration: 45,
    weight: 1.25,
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
