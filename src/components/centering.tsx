import type { PropsWithChildren } from 'react';

export function Centering({ children }: PropsWithChildren) {
  return (
    <div
      className="w-full px-6 maxcontent:max-w-280 maxcontent:mx-auto maxcontent:px-0"
      data-testid="centering"
    >
      {children}
    </div>
  );
}
