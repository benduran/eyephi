'use client';

import { Card } from '@primereact/ui/card';
import { Tag } from '@primereact/ui/tag';
import { ProgramPanelItem } from './programPanelItem';
import { ProgramSummary } from './programSummary';
import type { ProgramItemView } from './types';

export type ProgramPanelProps = {
  countLabel: string;
  difficultyLabel: string;
  difficultyPct: number;
  difficultyValue: string;
  emptyHint: string;
  items: ProgramItemView[];
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
  onSubmit: () => void;
  totalTimeLabel: string;
};

export function ProgramPanel({
  countLabel,
  difficultyLabel,
  difficultyPct,
  difficultyValue,
  emptyHint,
  items,
  onEdit,
  onRemove,
  onSubmit,
  totalTimeLabel,
}: ProgramPanelProps) {
  return (
    <Card.Root className="overflow-hidden p-0 aside:sticky aside:top-[88px]">
      <div className="flex items-center justify-between border-b border-surface-100 px-[18px] py-4 dark:border-surface-800">
        <span className="text-sm font-semibold">Your program</span>
        <Tag rounded severity="secondary">
          <span className="font-mono text-[11px]">{countLabel}</span>
        </Tag>
      </div>

      {items.length === 0 ? (
        <p className="m-[18px] rounded-md border border-dashed border-surface-300 px-[18px] py-7 text-center font-mono text-[11px] leading-loose tracking-wide text-surface-400 dark:border-surface-600 dark:text-surface-500">
          NO EXERCISES YET
          <br />
          {emptyHint}
        </p>
      ) : (
        <>
          <ul className="m-0 flex list-none flex-col p-0">
            {items.map((item) => (
              <ProgramPanelItem
                item={item}
                key={item.id}
                onEdit={onEdit}
                onRemove={onRemove}
              />
            ))}
          </ul>
          <ProgramSummary
            difficultyLabel={difficultyLabel}
            difficultyPct={difficultyPct}
            difficultyValue={difficultyValue}
            onSubmit={onSubmit}
            totalTimeLabel={totalTimeLabel}
          />
        </>
      )}
    </Card.Root>
  );
}
