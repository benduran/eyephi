'use client';

import type { Ref } from 'react';

export type ExerciseCanvasProps = {
  ariaLabel: string;
  className?: string | undefined;
  /** Owned by the caller -- the render loop that paints this canvas lives outside the component. */
  ref?: Ref<HTMLCanvasElement> | undefined;
};

export function ExerciseCanvas({
  ariaLabel,
  className,
  ref,
}: ExerciseCanvasProps) {
  return (
    <canvas aria-label={ariaLabel} className={className} ref={ref} role="img" />
  );
}
