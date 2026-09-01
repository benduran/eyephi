'use client';

import { XIcon } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@primereact/ui/button';
import type { DialogRootChangeEvent } from '@primereact/ui/dialog';
import { Dialog } from '@primereact/ui/dialog';
import { InputText } from '@primereact/ui/inputtext';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import { formatProgramSummary } from '../lib/format';
import type { Exercise } from '../schema/types';

export type ReadyDialogProps = {
  exercises: Exercise[];
  onClose: () => void;
  onStartNow: () => void;
};

const COPIED_MS = 3000 as const;

export function ReadyDialog({
  exercises,
  onClose,
  onStartNow,
}: ReadyDialogProps) {
  const [, copy] = useCopyToClipboard();

  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState('');

  useEffect(() => {
    setShareLink(window.location.href);
  }, []);

  useEffect(() => {
    if (!copied) return;

    const timer = setTimeout(() => setCopied(false), COPIED_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  const summary = useMemo(() => formatProgramSummary(exercises), [exercises]);

  const copyShareLink = useCallback(async () => {
    setCopied(await copy(shareLink));
  }, [copy, shareLink]);

  const onOpenChange = useCallback(
    (event: DialogRootChangeEvent) => {
      if (!event.value) onClose();
    },
    [onClose],
  );

  return (
    <Dialog.Root modal onOpenChange={onOpenChange} open>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Popup className="w-full max-w-125">
            <Dialog.Header className="flex items-start justify-between gap-4">
              <Dialog.Title className="text-lg font-semibold tracking-tight">
                Your program is ready
              </Dialog.Title>
              <Dialog.HeaderActions>
                <Dialog.Close
                  aria-label="Close"
                  as={Button}
                  iconOnly
                  rounded
                  variant="text"
                >
                  <XIcon aria-hidden />
                </Dialog.Close>
              </Dialog.HeaderActions>
            </Dialog.Header>

            <Dialog.Content className="flex flex-col gap-4">
              <p className="font-mono text-tight text-muted-color">{summary}</p>

              <div className="flex flex-wrap items-center gap-2.5">
                <Button onClick={onStartNow}>Start now</Button>
                <Button
                  onClick={onClose}
                  severity="secondary"
                  variant="outlined"
                >
                  Later
                </Button>
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-mono text-tag uppercase tracking-wider text-muted-color">
                  Shareable link
                </span>
                <div className="flex items-center gap-2">
                  <InputText
                    aria-label="Shareable link"
                    className="flex-1"
                    readOnly
                    value={shareLink}
                  />
                  <Button
                    onClick={copyShareLink}
                    severity="secondary"
                    variant="outlined"
                  >
                    {copied ? 'Copied' : 'Copy'}
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
