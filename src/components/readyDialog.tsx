'use client';

import { Button } from '@primereact/ui/button';
import type { DialogRootChangeEvent } from '@primereact/ui/dialog';
import { Dialog } from '@primereact/ui/dialog';
import { InputText } from '@primereact/ui/inputtext';

export type ReadyDialogProps = {
  copyLabel: string;
  onCopyLink: () => void;
  onOpenChange: (open: boolean) => void;
  onStartNow: () => void;
  open: boolean;
  shareLink: string;
  summary: string;
};

export function ReadyDialog({
  copyLabel,
  onCopyLink,
  onOpenChange,
  onStartNow,
  open,
  shareLink,
  summary,
}: ReadyDialogProps) {
  return (
    <Dialog.Root
      modal
      onOpenChange={(event: DialogRootChangeEvent) =>
        onOpenChange(Boolean(event.value))
      }
      open={open}
    >
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Popup className="max-h-[92vh] w-full max-w-[460px] overflow-auto">
            <Dialog.Header>
              <Dialog.Title className="m-0 text-lg font-semibold tracking-tight">
                Your program is ready
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Content>
              <p className="mt-0 mb-5 text-[13px] leading-relaxed text-surface-500 dark:text-surface-400">
                {summary}
              </p>

              <div className="mb-5 flex gap-2.5">
                <Button className="flex-1" onClick={onStartNow}>
                  Start now
                </Button>
                <Button
                  onClick={() => onOpenChange(false)}
                  severity="secondary"
                  variant="outlined"
                >
                  Later
                </Button>
              </div>

              <div className="border-t border-surface-100 pt-[18px] dark:border-surface-800">
                <div className="mb-2 text-xs text-surface-500 dark:text-surface-400">
                  Shareable link
                </div>
                <div className="flex gap-2">
                  <InputText
                    aria-label="Shareable link"
                    className="min-w-0 flex-1 font-mono text-xs"
                    readOnly
                    value={shareLink}
                  />
                  <Button
                    onClick={onCopyLink}
                    severity="secondary"
                    variant="outlined"
                  >
                    <span className="whitespace-nowrap">{copyLabel}</span>
                  </Button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Popup>
        </Dialog.Positioner>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
