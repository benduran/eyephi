/** Seconds as `M:SS`. Negative and fractional inputs are clamped and rounded. */
export function formatDuration(seconds: number): string {
  const whole = Math.max(0, Math.round(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

/** Elapsed against total as a 0-100 percentage, saturating when total is 0. */
export function toPercentage(elapsed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}
