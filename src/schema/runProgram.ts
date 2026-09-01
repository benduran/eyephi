import { z } from 'zod';

export const ProgramViewSchema = z.enum(['run', 'done']);
export type ProgramView = z.infer<typeof ProgramViewSchema>;

export const DEFAULT_PROGRAM_VIEW: ProgramView = 'run';

export const RunProgressSchema = z.object({
  /** Seconds spent on the current step. */
  stepElapsed: z.number().min(0),
  stepIndex: z.int().min(0),
  /** Seconds spent across every completed step plus the current one. */
  totalElapsed: z.number().min(0),
});
export type RunProgress = z.infer<typeof RunProgressSchema>;

export const IDLE_RUN_PROGRESS: RunProgress = {
  stepElapsed: 0,
  stepIndex: 0,
  totalElapsed: 0,
};
