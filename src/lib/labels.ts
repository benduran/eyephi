import type {
  DifficultyBand,
  ExerciseCategory,
  TargetPath,
} from '../schema/types';

const CATEGORY_LABELS = {
  gaze_stability: 'Gaze stability',
  habituation: 'Habituation',
  ocular_motor: 'Ocular motor',
} as const satisfies Record<ExerciseCategory, string>;

const DIFFICULTY_BAND_LABELS = {
  challenging: 'Challenging',
  gentle: 'Gentle',
  intense: 'Intense',
  moderate: 'Moderate',
} as const satisfies Record<DifficultyBand, string>;

const TARGET_PATH_LABELS = {
  circle: 'Circle',
  figure_eight: 'Figure 8',
  horizontal: 'Horizontal line',
  ping_pong_circle: 'Ping-pong circle',
  random: 'Random path',
  vertical: 'Vertical line',
} as const satisfies Record<TargetPath, string>;

export function toTargetPathLabel(path: TargetPath): string {
  return TARGET_PATH_LABELS[path];
}

export function toCategoryLabel(category: ExerciseCategory): string {
  return CATEGORY_LABELS[category];
}

export function toDifficultyBandLabel(band: DifficultyBand): string {
  return DIFFICULTY_BAND_LABELS[band];
}
