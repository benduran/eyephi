'use client';

import { Button } from '@primereact/ui/button';
import { Card } from '@primereact/ui/card';

export type DoneViewProps = {
  onBackToEditor: () => void;
  onRestart: () => void;
  summary: string;
};

export function DoneView({
  onBackToEditor,
  onRestart,
  summary,
}: DoneViewProps) {
  return (
    <main className="mx-auto max-w-[600px] px-4 py-12 wide:px-7 wide:py-24">
      <Card.Root className="px-6 py-9 text-center">
        <h2 className="m-0 mb-2.5 text-[22px] font-semibold tracking-tight">
          Program complete
        </h2>
        <p className="m-0 mb-6 text-sm leading-relaxed text-surface-500 dark:text-surface-400">
          {summary}
        </p>
        <div className="flex flex-wrap justify-center gap-2.5">
          <Button onClick={onRestart}>Run again</Button>
          <Button
            onClick={onBackToEditor}
            severity="secondary"
            variant="outlined"
          >
            Back to editor
          </Button>
        </div>
      </Card.Root>
    </main>
  );
}
