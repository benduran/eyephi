// Flat exports, not the `ProgressSpinner.*` namespace every client component
// uses: a namespace object collapses to one client reference across the RSC
// boundary, so a server component reading `.Root` off it gets undefined.
import {
  ProgressSpinnerRange,
  ProgressSpinnerRoot,
  ProgressSpinnerTrack,
} from '@primereact/ui/progressspinner';
import type { PropsWithChildren } from 'react';

type PageLoaderProps = PropsWithChildren & {
  size?: number;
};

export function PageLoader({ children, size = 48 }: PageLoaderProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-24"
      role="status"
    >
      <ProgressSpinnerRoot style={{ height: size, width: size }}>
        <ProgressSpinnerTrack />
        <ProgressSpinnerRange />
      </ProgressSpinnerRoot>
      <p className="text-sm text-muted-color">{children ?? 'Loading...'}</p>
    </div>
  );
}
