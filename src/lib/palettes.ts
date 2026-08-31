import type { ColorScheme } from '../schema/types';

export type Palette = {
  /** Canvas background. */
  background: string;
  /** The target itself, and anything the patient is asked to track. */
  foreground: string;
  label: string;
  /**
   * How visually provoking the scheme is, 0 to 1. Feeds the difficulty score,
   * which is why the cool and warm schemes rate far above the monochrome ones.
   */
  stimulation: number;
  /** Secondary marks: guide ticks, halos, texture lines. */
  secondaryIndicators: string;
};

export const PALETTES = {
  cool: {
    background: '#0c1622',
    foreground: '#5aa9ff',
    label: 'Cool',
    secondaryIndicators: '#1d3450',
    stimulation: 0.78,
  },
  high_contrast: {
    background: '#ffffff',
    foreground: '#111111',
    label: 'High contrast',
    secondaryIndicators: '#cfcfcf',
    stimulation: 0.45,
  },
  soft_mono: {
    background: '#f0f0ef',
    foreground: '#5c5c58',
    label: 'Soft mono',
    secondaryIndicators: '#d8d8d5',
    stimulation: 0.12,
  },
  warm: {
    background: '#181206',
    foreground: '#ffb547',
    label: 'Warm',
    secondaryIndicators: '#4a3413',
    stimulation: 0.92,
  },
} satisfies Record<ColorScheme, Palette>;

export const DEFAULT_COLOR_SCHEME: ColorScheme = 'soft_mono';
