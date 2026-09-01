'use client';

import type { KAPLAYCtx } from 'kaplay';
import kaplay from 'kaplay';
import type { PropsWithChildren } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import type { Nullish } from '../schema/types';

type KaplayEngineContextVal = {
  /** Moves the engine's canvas into `host`, creating the engine on first use. */
  attach: (host: HTMLElement) => KAPLAYCtx;
  /** detaches kaplay from the canvas element */
  detach: () => void;
};

const context = createContext<Nullish<KaplayEngineContextVal>>(null);

/** Retina without paying for the 3x buffer some phones report. */
const MAX_DEVICE_PIXEL_RATIO = 2;

export function KaplayEngineProvider({ children }: PropsWithChildren) {
  /** refs */
  const engineRef = useRef<Nullish<KAPLAYCtx>>(null);
  const parkRef = useRef<HTMLDivElement>(null);

  /** callbacks */
  const attach = useCallback((host: HTMLElement) => {
    engineRef.current ??= kaplay({
      backgroundAudio: false,
      global: false,
      loadingScreen: false,
      pixelDensity: Math.min(
        MAX_DEVICE_PIXEL_RATIO,
        window.devicePixelRatio || 1,
      ),
      root: host,
      touchToMouse: false,
    });

    const { canvas } = engineRef.current;
    if (canvas.parentElement !== host) host.appendChild(canvas);

    return engineRef.current;
  }, []);

  const detach = useCallback(() => {
    const canvas = engineRef.current?.canvas;
    if (canvas && parkRef.current) parkRef.current.appendChild(canvas);
  }, []);

  /** effects */
  useEffect(
    () => () => {
      engineRef.current?.quit();
      engineRef.current = null;
    },
    [],
  );

  /** provider val */
  const providerVal = useMemo<KaplayEngineContextVal>(
    () => ({ attach, detach }),
    [attach, detach],
  );

  return (
    <context.Provider value={providerVal}>
      {children}
      {/* Where the canvas waits between stages, so it is never orphaned. */}
      <div hidden ref={parkRef} />
    </context.Provider>
  );
}

export function useKaplayEngine() {
  const ctx = useContext(context);
  if (!ctx) {
    throw new Error(
      'unable to useKaplayEngine() because no <KaplayEngineProvider /> was found in the parent tree',
    );
  }

  return ctx;
}
