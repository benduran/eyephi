import type { DifficultyBand, ExerciseCategory } from '../schema/types';

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

export function toCategoryLabel(category: ExerciseCategory): string {
  return CATEGORY_LABELS[category];
}

export function toDifficultyBandLabel(band: DifficultyBand): string {
  return DIFFICULTY_BAND_LABELS[band];
}
