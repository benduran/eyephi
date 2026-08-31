export type ProgramProgressView = {
  elapsedLabel: string;
  progressPct: number;
  totalTimeLabel: string;
};

export type CategoryView = {
  id: string;
  label: string;
};

export type ExerciseView = {
  blurb: string;
  category: string;
  defaultLabel: string;
  id: string;
  name: string;
};

export type ProgramItemView = {
  difficultyLabel: string;
  difficultyPct: number;
  durationLabel: string;
  id: string;
  name: string;
  settingsLabel: string;
};

export type RunStepState = 'complete' | 'current' | 'upcoming';

export type RunStepView = {
  durationLabel: string;
  id: string;
  name: string;
  num: string;
  state: RunStepState;
};

export type PaletteView = {
  background: string;
  foreground: string;
  id: string;
  label: string;
};
