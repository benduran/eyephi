'use client';

import type { Color, KAPLAYCtx } from 'kaplay';
import kaplay from 'kaplay';
import { useEffect, useRef, useState } from 'react';
import { PALETTES } from '../lib/palettes';
import type { Exercise } from '../schema/types';

export type ExerciseCanvasProps = {
  className?: string | undefined;
  exercise: Exercise;
  /** Holds the clock still without tearing the canvas down. */
  paused?: boolean | undefined;
};

/** Retina without paying for the 3x buffer some phones report. */
const MAX_DEVICE_PIXEL_RATIO = 2;

/** The axis a target travels along. Guide marks are drawn across it. */
type Axis = 'horizontal' | 'vertical';

/**
 * One frame's worth of derived geometry, in Kaplay's logical pixels. Painters
 * read it and draw; they never measure the stage or reach for the exercise.
 */
type Scene = {
  /** Half the target's travel, before any per-axis clamping. */
  amp: number;
  /** The stage colour, needed by drills that punch a hole through their own art. */
  background: Color;
  cx: number;
  cy: number;
  /** The target itself, and anything the patient is asked to track. */
  foreground: Color;
  /** Travel oscillations per second. */
  freq: number;
  h: number;
  intensity: number;
  k: KAPLAYCtx;
  /** Scale factor holding shape proportions on any canvas size. */
  scale: number;
  /** Guide ticks, halos and texture lines. */
  secondary: Color;
  speed: number;
  /** Target radius. */
  r: number;
  /** Seconds the exercise has been running. */
  t: number;
  w: number;
};

type Painter = (scene: Scene) => void;

/** Vertical travel is clamped because a stage is far wider than it is tall. */
function travel({ amp, h }: Scene, axis: Axis): number {
  return axis === 'horizontal' ? amp : Math.min(amp, h * 0.35);
}

function drawTarget(
  { foreground, k }: Scene,
  x: number,
  y: number,
  radius: number,
): void {
  k.drawCircle({ color: foreground, pos: k.vec2(x, y), radius });
}

function drawRing(
  { k, secondary }: Scene,
  x: number,
  y: number,
  radius: number,
  width: number,
): void {
  k.drawCircle({
    fill: false,
    outline: { color: secondary, width },
    pos: k.vec2(x, y),
    radius,
  });
}

/** An end-of-travel marker, drawn across the axis so it reads as a limit. */
function drawGuide(scene: Scene, axis: Axis, x: number, y: number): void {
  const { k, scale, secondary } = scene;
  const reach = 22 * scale;
  const along = axis === 'horizontal';

  k.drawLine({
    color: secondary,
    p1: k.vec2(along ? x : x - reach, along ? y - reach : y),
    p2: k.vec2(along ? x : x + reach, along ? y + reach : y),
    width: 3 * scale,
  });
}

/** Drifting diagonal lines, the optional visual load behind every other drill. */
function drawBackgroundNoise(scene: Scene): void {
  const { h, k, scale, secondary, speed, t, w } = scene;
  const gap = 36 * scale;
  const offset = (t * 18 * speed * scale) % gap;

  for (let x = -gap; x < w + gap; x += gap) {
    k.drawLine({
      color: secondary,
      opacity: 0.35,
      p1: k.vec2(x + offset, 0),
      p2: k.vec2(x + offset - 60 * scale, h),
      width: 2 * scale,
    });
  }
}

function paintOptokinetic(scene: Scene): void {
  const {
    background,
    cx,
    cy,
    foreground,
    h,
    intensity,
    k,
    scale,
    speed,
    t,
    w,
  } = scene;
  const stripe = Math.max(18, 70 - intensity * 4) * scale;
  const offset = (t * (30 + speed * 55) * scale) % (stripe * 2);

  for (let x = -stripe * 2; x < w + stripe * 2; x += stripe * 2) {
    k.drawRect({
      color: foreground,
      height: h,
      pos: k.vec2(x + offset, 0),
      width: stripe,
    });
  }

  // A punched-out disc keeps the fixation dot readable against the stripes.
  k.drawCircle({
    color: background,
    opacity: 0.9,
    pos: k.vec2(cx, cy),
    radius: 26 * scale,
  });

  drawTarget(scene, cx, cy, 9 * scale);
}

function paintSmoothPursuit(scene: Scene): void {
  const { amp, cx, cy, freq, r, t } = scene;

  drawGuide(scene, 'horizontal', cx - amp, cy);
  drawGuide(scene, 'horizontal', cx + amp, cy);
  drawTarget(scene, cx + amp * Math.sin(2 * Math.PI * freq * t), cy, r);
}

function paintHorizontalSaccades(scene: Scene): void {
  const { amp, cx, cy, r, speed, t } = scene;
  const interval = Math.max(0.28, 1.4 - speed * 0.11);
  const left = Math.floor(t / interval) % 2 === 0;

  drawGuide(scene, 'horizontal', cx - amp, cy);
  drawGuide(scene, 'horizontal', cx + amp, cy);
  drawTarget(scene, cx + (left ? -amp : amp), cy, r);
}

function paintNearFarConvergence(scene: Scene): void {
  const { cx, cy, freq, intensity, scale, t } = scene;
  const approach = (Math.sin(2 * Math.PI * freq * 0.5 * t) + 1) / 2;
  const maxRadius = (14 + intensity * 4) * scale;

  drawTarget(scene, cx, cy, 8 * scale + approach * maxRadius);
  drawRing(scene, cx, cy, 8 * scale + maxRadius, 2 * scale);
}

function paintDynamicVisualAcuity(scene: Scene): void {
  const { amp, cx, cy, foreground, freq, h, intensity, k, scale, speed, t } =
    scene;
  const interval = Math.max(0.5, 1.8 - speed * 0.13);
  const rotation = (Math.floor(t / interval) % 4) * (Math.PI / 2);
  const jitter = Math.sin(2 * Math.PI * freq * 1.6 * t) * amp * 0.12;
  const size = Math.min((90 - intensity * 4) * scale, h * 0.5);
  const bar = size / 5;

  k.pushTransform();
  k.pushTranslate(k.vec2(cx + jitter, cy));
  k.pushRotate(k.rad2deg(rotation));
  const strokes: [x: number, y: number, width: number, height: number][] = [
    [-size / 2, -size / 2, bar, size],
    [-size / 2, -size / 2, size, bar],
    [-size / 2, -bar / 2, size, bar],
    [-size / 2, size / 2 - bar, size, bar],
  ];
  for (const [x, y, width, height] of strokes) {
    k.drawRect({ color: foreground, height, pos: k.vec2(x, y), width });
  }
  k.popTransform();
}

/** Gaze stays on a still target; the pulsing ring paces the head movement. */
function paintVorX1(axis: Axis): Painter {
  return (scene) => {
    const { cx, cy, foreground, k, r, scale, speed, t } = scene;
    const beat = (t * (0.4 + speed * 0.14)) % 1;
    const pulse = 1 + 0.25 * Math.sin(beat * Math.PI * 2);

    drawRing(scene, cx, cy, (r + 26 * scale) * pulse, 3 * scale);
    drawTarget(scene, cx, cy, r);

    const reach = travel(scene, axis) * (beat < 0.5 ? -1 : 1);
    const along = axis === 'horizontal';
    k.drawRect({
      color: foreground,
      height: (along ? 8 : 16) * scale,
      pos: k.vec2(
        cx + (along ? reach : 0) - (along ? 8 : 4) * scale,
        cy + (along ? 0 : reach) - 8 * scale,
      ),
      width: (along ? 16 : 8) * scale,
    });
  };
}

/** The target drives opposite the head, so the halo mirrors it across centre. */
function paintVorX2(axis: Axis): Painter {
  return (scene) => {
    const { cx, cy, freq, r, scale, t } = scene;
    const reach = travel(scene, axis);
    const offset = reach * Math.sin(2 * Math.PI * freq * 0.6 * t);
    const along = axis === 'horizontal';
    const x = along ? cx - offset : cx;
    const y = along ? cy : cy - offset;

    drawGuide(scene, axis, along ? cx - reach : cx, along ? cy : cy - reach);
    drawGuide(scene, axis, along ? cx + reach : cx, along ? cy : cy + reach);
    drawTarget(scene, x, y, r);
    drawRing(scene, 2 * cx - x, 2 * cy - y, r + 14 * scale, 3 * scale);
  };
}

const PAINTERS = {
  dynamic_visual_acuity: paintDynamicVisualAcuity,
  horizontal_saccades: paintHorizontalSaccades,
  near_far_convergence: paintNearFarConvergence,
  optokinetic_stimulation: paintOptokinetic,
  smooth_pursuit: paintSmoothPursuit,
  vor_x1_horizontal: paintVorX1('horizontal'),
  vor_x1_vertical: paintVorX1('vertical'),
  vor_x2_horizontal: paintVorX2('horizontal'),
  vor_x2_vertical: paintVorX2('vertical'),
} as const satisfies Record<Exercise['type'], Painter>;

function toScene(k: KAPLAYCtx, exercise: Exercise, t: number): Scene {
  const w = k.width();
  const h = k.height();
  const palette = PALETTES[exercise.scheme];
  // Height counts for more than width so a wide, short stage still shrinks.
  const scale = Math.min(w, h * 1.6) / 1200;

  return {
    amp: (0.08 + exercise.intensity * 0.042) * (w / 2),
    background: k.rgb(palette.background),
    cx: w / 2,
    cy: h / 2,
    foreground: k.rgb(palette.foreground),
    freq: 0.1 + exercise.speed * 0.055,
    h,
    intensity: exercise.intensity,
    k,
    r: (16 + exercise.intensity * 1.4) * scale,
    scale,
    secondary: k.rgb(palette.secondaryIndicators),
    speed: exercise.speed,
    t,
    w,
  };
}

/** Draws one frame. Kaplay owns the stage, the loop and the clock. */
function paint(k: KAPLAYCtx, exercise: Exercise, t: number): void {
  const scene = toScene(k, exercise, t);

  k.setBackground(k.rgb(PALETTES[exercise.scheme].background));

  // Stripes are the optokinetic drill itself, so noise behind them is nonsense.
  if (exercise.backgroundNoise && exercise.type !== 'optokinetic_stimulation') {
    drawBackgroundNoise(scene);
  }

  PAINTERS[exercise.type](scene);
}

export function ExerciseCanvas({
  className,
  exercise,
  paused = false,
}: ExerciseCanvasProps) {
  /** state */
  const [stage, setStage] = useState<HTMLDivElement | null>(null);

  /** refs */
  const exerciseRef = useRef(exercise);
  const pausedRef = useRef(paused);

  /** effects */
  useEffect(() => {
    exerciseRef.current = exercise;
    pausedRef.current = paused;
  });

  useEffect(() => {
    if (!stage) return;

    // Kaplay makes its own canvas inside the stage and sizes it to the stage's
    // box. Handing it ours instead would reuse one GL context across remounts.
    const k = kaplay({
      backgroundAudio: false,
      global: false,
      loadingScreen: false,
      pixelDensity: Math.min(
        MAX_DEVICE_PIXEL_RATIO,
        window.devicePixelRatio || 1,
      ),
      root: stage,
      touchToMouse: false,
    });

    // Our own clock, so pausing freezes the drill without stopping the loop.
    let disposed = false;
    let elapsed = 0;
    k.onDraw(() => {
      if (disposed) return;
      if (!pausedRef.current) elapsed += k.dt();
      paint(k, exerciseRef.current, elapsed);
    });

    return () => {
      // quit() only tears down at the next frame end, so stop drawing now and
      // drop the canvas rather than leaving a live one for the next mount.
      disposed = true;
      k.quit();
      stage.replaceChildren();
    };
  }, [stage]);

  return (
    <div
      aria-label={exercise.cue}
      className={className}
      ref={setStage}
      role="img"
    />
  );
}
