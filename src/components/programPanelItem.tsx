'use client';

import { Button } from '@primereact/ui/button';
import type { ProgramItemView } from '../schema/types';
import { ProgressMeter } from './progressMeter';

export type ProgramPanelItemProps = {
  item: ProgramItemView;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
};

export function ProgramPanelItem({
  item,
  onEdit,
  onRemove,
}: ProgramPanelItemProps) {
  return (
    <li className="flex flex-col gap-2 border-b border-surface-100 px-[18px] py-3.5 dark:border-surface-800">
      <div className="flex items-baseline justify-between gap-2.5">
        <span className="text-[13px] font-medium tracking-tight">
          {item.name}
        </span>
        <span className="font-mono text-xs">{item.durationLabel}</span>
      </div>

      <div className="flex items-center gap-2">
        <ProgressMeter
          ariaLabel={`${item.name} difficulty`}
          className="flex-1"
          thickness={3}
          value={item.difficultyPct}
        />
        <span className="w-[52px] text-right font-mono text-[11px] text-surface-600 dark:text-surface-400">
          D {item.difficultyLabel}
        </span>
      </div>

      <div className="flex items-center gap-3.5">
        <span className="flex-1 font-mono text-[10px] uppercase tracking-[0.06em] text-surface-400 dark:text-surface-500">
          {item.settingsLabel}
        </span>
        <Button
          onClick={() => onEdit(item.id)}
          severity="secondary"
          size="small"
          variant="link"
        >
          Edit
        </Button>
        <Button
          onClick={() => onRemove(item.id)}
          severity="secondary"
          size="small"
          variant="link"
        >
          Remove
        </Button>
      </div>
    </li>
  );
}
