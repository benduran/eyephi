'use client';

import type { GameObj, KAPLAYCtx } from 'kaplay';
import { useEffect, useRef, useState } from 'react';
import { useKaplayEngine } from '../context/KaplayEngine';
import { PALETTES } from '../lib/palettes';
import type { Exercise, TargetPath } from '../schema/types';
import { DEFAULT_TARGET_PATH } from '../schema/types';
import type { Nullish } from '../util/nullish';

export type ExerciseCanvasProps = {
  className?: string | undefined;
  exercise: Exercise;
  /** Holds the clock still without tearing the canvas down. */
  paused?: boolean | undefined;
};

/** The axis a target travels along. Guide marks are drawn across it. */
type Axis = 'horizontal' | 'vertical';

/** Reads the exercise being drawn, so a slider moves the drill without a rebuild. */
type ReadExercise = () => Exercise;

/** Stage geometry for the current frame, derived rather than stored so a resize needs no rebuild. */
type Metrics = {
  /** Half the target's travel, before any per-axis clamping. */
  amp: number;
  cx: number;
  cy: number;
  /** Travel oscillations per second. */
  freq: number;
  h: number;
  /** Target radius. */
  r: number;
  /** Scale factor holding shape proportions on any canvas size. */
  scale: number;
  w: number;
};

type Stage = {
  k: KAPLAYCtx;
  read: ReadExercise;
  /** Seconds the drill has been running. Not k.time(), which ignores pausing. */
  time: () => number;
};

/** Tags every object a build owns, so the next build can clear them. */
const STAGE_TAG = 'stage';

/** Adds this drill's objects and wires their per-frame behaviour. */
type Build = (stage: Stage) => void;

function metrics(k: KAPLAYCtx, exercise: Exercise): Metrics {
  const w = k.width();
  const h = k.height();
  // Height counts for more than width so a wide, short stage still shrinks.
  const scale = Math.min(w, h * 1.6) / 1200;

  return {
    amp: (0.08 + exercise.intensity * 0.042) * (w / 2),
    cx: w / 2,
    cy: h / 2,
    freq: 0.1 + exercise.speed * 0.055,
    h,
    r: (16 + exercise.intensity * 1.4) * scale,
    scale,
    w,
  };
}

/** Vertical travel is clamped because a stage is far wider than it is tall. */
function travel(m: Metrics, axis: Axis): number {
  return axis === 'horizontal' ? m.amp : Math.min(m.amp, m.h * 0.35);
}

const foregroundOf = (k: KAPLAYCtx, exercise: Exercise) =>
  k.rgb(PALETTES[exercise.scheme].foreground);

const secondaryOf = (k: KAPLAYCtx, exercise: Exercise) =>
  k.rgb(PALETTES[exercise.scheme].secondaryIndicators);

function addDisc({ k }: Stage, radius = 1): GameObj {
  return k.add([
    k.circle(radius),
    k.color(),
    k.pos(0, 0),
    k.anchor('center'),
    STAGE_TAG,
  ]);
}

function addRing({ k }: Stage, radius = 1): GameObj {
  return k.add([
    k.circle(radius, { fill: false }),
    k.outline(1),
    k.pos(0, 0),
    k.anchor('center'),
    STAGE_TAG,
  ]);
}

function addBar({ k }: Stage): GameObj {
  return k.add([
    k.rect(1, 1),
    k.color(),
    k.pos(0, 0),
    k.rotate(0),
    k.anchor('center'),
    STAGE_TAG,
  ]);
}

/** An end-of-travel marker, laid across the axis so it reads as a limit. */
function addGuide(stage: Stage, axis: Axis, side: -1 | 1): void {
  const guide = addBar(stage);
  const { k, read } = stage;

  guide.onUpdate(() => {
    const exercise = read();
    const m = metrics(k, exercise);
    const reach = travel(m, axis) * side;
    const along = axis === 'horizontal';

    guide.color = secondaryOf(k, exercise);
    guide.width = (along ? 3 : 44) * m.scale;
    guide.height = (along ? 44 : 3) * m.scale;
    guide.pos = k.vec2(m.cx + (along ? reach : 0), m.cy + (along ? 0 : reach));
  });
}

type TargetShape = {
  /** Where the target sits at `phase` radians into its cycle. */
  at: (phase: number, m: Metrics) => { x: number; y: number };
  /** Only a straight path has ends worth marking. */
  guideAxis: Nullish<Axis>;
  /** How many fixation points a saccade snaps between on this shape. */
  stops: number;
  /** Only needed where even phase sampling would revisit a point, as on a path that retraces itself. */
  stopAt?: (
    stop: number,
    stops: number,
    m: Metrics,
  ) => { x: number; y: number };
};

/** Shared so the ping-pong variant can walk the same ring of points. */
const circleAt = (phase: number, m: Metrics) => ({
  x: m.cx + m.amp * Math.cos(phase),
  y: m.cy + liftOf(m) * Math.sin(phase),
});

/** Half a step in, so a two-stop line lands on its ends rather than twice through the middle. */
const stopPhase = (stop: number, stops: number) =>
  ((stop + 0.5) * 2 * Math.PI) / stops;

/** Vertical reach, clamped like every other vertical travel on the stage. */
const liftOf = (m: Metrics) => Math.min(m.amp, m.h * 0.35);

const TARGET_SHAPES = {
  circle: {
    at: circleAt,
    guideAxis: null,
    stops: 6,
  },
  figure_eight: {
    // Gerono's lemniscate: one horizontal sweep crossed by a doubled vertical.
    at: (phase, m) => ({
      x: m.cx + m.amp * Math.sin(phase),
      y: m.cy + liftOf(m) * Math.sin(phase) * Math.cos(phase),
    }),
    guideAxis: null,
    stops: 6,
  },
  horizontal: {
    at: (phase, m) => ({ x: m.cx + m.amp * Math.sin(phase), y: m.cy }),
    guideAxis: 'horizontal',
    stops: 2,
  },
  ping_pong_circle: {
    // The sweep eases to a stop at each end and retraces, so the lap angle
    // itself rides a cosine rather than climbing forever.
    at: (phase, m) => circleAt(Math.PI * (1 - Math.cos(phase)), m),
    guideAxis: null,
    stopAt: (stop, stops, m) => {
      const ring = stops / 2 + 1;
      const point = stop < ring ? stop : stops - stop;
      return circleAt((point * 2 * Math.PI) / ring, m);
    },
    // Six points on the ring, walked out and back: 0..5 then 4..1.
    stops: 10,
  },
  random: {
    // Summed incommensurate sines: it never repeats within a session but stays
    // reproducible, which a clinician comparing two runs needs.
    at: (phase, m) => ({
      x:
        m.cx +
        m.amp * (0.62 * Math.sin(phase) + 0.38 * Math.sin(1.7 * phase + 0.9)),
      y:
        m.cy +
        liftOf(m) *
          (0.62 * Math.cos(1.3 * phase) + 0.38 * Math.sin(2.3 * phase + 0.4)),
    }),
    guideAxis: null,
    stops: 6,
  },
  vertical: {
    at: (phase, m) => ({ x: m.cx, y: m.cy + liftOf(m) * Math.sin(phase) }),
    guideAxis: 'vertical',
    stops: 2,
  },
} as const satisfies Record<TargetPath, TargetShape>;

/** Keyed off the field, so a new drill with a path needs no change here. */
const pathOf = (exercise: Exercise): TargetPath =>
  'path' in exercise ? exercise.path : DEFAULT_TARGET_PATH;

function buildSmoothPursuit(stage: Stage): void {
  const { k, read, time } = stage;
  const { guideAxis } = TARGET_SHAPES[pathOf(read())];
  if (guideAxis) {
    addGuide(stage, guideAxis, -1);
    addGuide(stage, guideAxis, 1);
  }

  const target = addDisc(stage);
  target.onUpdate(() => {
    const exercise = read();
    const m = metrics(k, exercise);
    const shape = TARGET_SHAPES[pathOf(exercise)];
    // k.wave() and the design both take radians, so a lap is 2*PI of phase.
    const { x, y } = shape.at(2 * Math.PI * m.freq * time(), m);

    target.color = foregroundOf(k, exercise);
    target.radius = m.r;
    target.pos = k.vec2(x, y);
  });
}

/** The same paths as Smooth Pursuit, sampled rather than glided along. */
function buildSaccades(stage: Stage): void {
  const { k, read, time } = stage;
  const { guideAxis } = TARGET_SHAPES[pathOf(read())];
  if (guideAxis) {
    addGuide(stage, guideAxis, -1);
    addGuide(stage, guideAxis, 1);
  }

  const target = addDisc(stage);
  target.onUpdate(() => {
    const exercise = read();
    const m = metrics(k, exercise);
    const shape: TargetShape = TARGET_SHAPES[pathOf(exercise)];
    const interval = Math.max(0.28, 1.4 - exercise.speed * 0.11);
    const stop = Math.floor(time() / interval) % shape.stops;
    const { x, y } = shape.stopAt
      ? shape.stopAt(stop, shape.stops, m)
      : shape.at(stopPhase(stop, shape.stops), m);

    target.color = foregroundOf(k, exercise);
    target.radius = m.r;
    target.pos = k.vec2(x, y);
  });
}

function buildNearFarConvergence(stage: Stage): void {
  const { k, read, time } = stage;

  const boundary = addRing(stage);
  const target = addDisc(stage);

  boundary.onUpdate(() => {
    const exercise = read();
    const m = metrics(k, exercise);

    boundary.outline.color = secondaryOf(k, exercise);
    boundary.outline.width = 2 * m.scale;
    boundary.radius = 8 * m.scale + (14 + exercise.intensity * 4) * m.scale;
    boundary.pos = k.vec2(m.cx, m.cy);
  });

  target.onUpdate(() => {
    const exercise = read();
    const m = metrics(k, exercise);
    const maxRadius = (14 + exercise.intensity * 4) * m.scale;

    target.color = foregroundOf(k, exercise);
    // Radians again: the convergence cycle is half the drill's frequency.
    target.radius =
      8 * m.scale + k.wave(0, maxRadius, Math.PI * m.freq * time());
    target.pos = k.vec2(m.cx, m.cy);
  });
}

/** Gaze stays on a still target; the pulsing ring paces the head movement. */
function buildVorX1(axis: Axis): Build {
  return (stage) => {
    const { k, read, time } = stage;
    const pacer = addRing(stage);
    const target = addDisc(stage);
    const cue = addBar(stage);

    const beatOf = (exercise: Exercise) =>
      (time() * (0.4 + exercise.speed * 0.14)) % 1;

    pacer.onUpdate(() => {
      const exercise = read();
      const m = metrics(k, exercise);
      const pulse = 1 + 0.25 * Math.sin(beatOf(exercise) * Math.PI * 2);

      pacer.outline.color = secondaryOf(k, exercise);
      pacer.outline.width = 3 * m.scale;
      pacer.radius = (m.r + 26 * m.scale) * pulse;
      pacer.pos = k.vec2(m.cx, m.cy);
    });

    target.onUpdate(() => {
      const exercise = read();
      const m = metrics(k, exercise);

      target.color = foregroundOf(k, exercise);
      target.radius = m.r;
      target.pos = k.vec2(m.cx, m.cy);
    });

    cue.onUpdate(() => {
      const exercise = read();
      const m = metrics(k, exercise);
      const along = axis === 'horizontal';
      const reach = travel(m, axis) * (beatOf(exercise) < 0.5 ? -1 : 1);

      cue.color = secondaryOf(k, exercise);
      cue.width = (along ? 16 : 8) * m.scale;
      cue.height = (along ? 8 : 16) * m.scale;
      cue.pos = k.vec2(m.cx + (along ? reach : 0), m.cy + (along ? 0 : reach));
    });
  };
}

/** The target drives opposite the head, so the halo mirrors it across centre. */
function buildVorX2(axis: Axis): Build {
  return (stage) => {
    const { k, read, time } = stage;
    addGuide(stage, axis, -1);
    addGuide(stage, axis, 1);

    const target = addDisc(stage);
    const halo = addRing(stage);

    const offsetOf = (m: Metrics) =>
      travel(m, axis) * Math.sin(2 * Math.PI * m.freq * 0.6 * time());

    target.onUpdate(() => {
      const exercise = read();
      const m = metrics(k, exercise);
      const offset = offsetOf(m);
      const along = axis === 'horizontal';

      target.color = foregroundOf(k, exercise);
      target.radius = m.r;
      target.pos = k.vec2(
        along ? m.cx - offset : m.cx,
        along ? m.cy : m.cy - offset,
      );
    });

    halo.onUpdate(() => {
      const exercise = read();
      const m = metrics(k, exercise);
      const offset = offsetOf(m);
      const along = axis === 'horizontal';

      halo.outline.color = secondaryOf(k, exercise);
      halo.outline.width = 3 * m.scale;
      halo.radius = m.r + 14 * m.scale;
      halo.pos = k.vec2(
        along ? m.cx + offset : m.cx,
        along ? m.cy : m.cy + offset,
      );
    });
  };
}

/**
 * A tumbling optotype: one parent carries the rotation and jitter, four child
 * bars form the glyph, so the group turns as a unit.
 */
function buildDynamicVisualAcuity(stage: Stage): void {
  const { k, read, time } = stage;
  const glyph = k.add([
    k.pos(0, 0),
    k.rotate(0),
    k.anchor('center'),
    STAGE_TAG,
  ]);
  const bars = [0, 1, 2, 3].map(() =>
    glyph.add([k.rect(1, 1), k.color(), k.pos(0, 0), k.anchor('topleft')]),
  );

  glyph.onUpdate(() => {
    const exercise = read();
    const m = metrics(k, exercise);
    const interval = Math.max(0.5, 1.8 - exercise.speed * 0.13);
    const jitter = Math.sin(2 * Math.PI * m.freq * 1.6 * time()) * m.amp * 0.12;

    glyph.angle = (Math.floor(time() / interval) % 4) * 90;
    glyph.pos = k.vec2(m.cx + jitter, m.cy);

    const size = Math.min((90 - exercise.intensity * 4) * m.scale, m.h * 0.5);
    const bar = size / 5;
    const layout: [x: number, y: number, width: number, height: number][] = [
      [-size / 2, -size / 2, bar, size],
      [-size / 2, -size / 2, size, bar],
      [-size / 2, -bar / 2, size, bar],
      [-size / 2, size / 2 - bar, size, bar],
    ];

    for (const [index, stroke] of bars.entries()) {
      const spec = layout[index];
      if (!spec) continue;
      const [x, y, width, height] = spec;

      stroke.color = foregroundOf(k, exercise);
      stroke.width = width;
      stroke.height = height;
      stroke.pos = k.vec2(x, y);
    }
  });
}

/** Enough stripes to tile the widest stage the drill is likely to get. */
const MAX_STRIPES = 64;

function buildOptokinetic(stage: Stage): void {
  const { k, read, time } = stage;
  const stripes = Array.from({ length: MAX_STRIPES }, () => {
    return k.add([
      k.rect(1, 1),
      k.color(),
      k.pos(0, 0),
      k.anchor('topleft'),
      STAGE_TAG,
    ]);
  });
  // Punched out of the stripes so the fixation dot stays readable.
  const well = addDisc(stage);
  const target = addDisc(stage);

  for (const [index, stripe] of stripes.entries()) {
    stripe.onUpdate(() => {
      const exercise = read();
      const m = metrics(k, exercise);
      const width = Math.max(18, 70 - exercise.intensity * 4) * m.scale;
      const stride = width * 2;
      const offset = (time() * (30 + exercise.speed * 55) * m.scale) % stride;

      stripe.color = foregroundOf(k, exercise);
      stripe.width = width;
      stripe.height = m.h;
      stripe.pos = k.vec2(-stride + offset + index * stride, 0);
    });
  }

  well.onUpdate(() => {
    const exercise = read();
    const m = metrics(k, exercise);

    well.color = k.rgb(PALETTES[exercise.scheme].background);
    well.opacity = 0.9;
    well.radius = 26 * m.scale;
    well.pos = k.vec2(m.cx, m.cy);
  });

  target.onUpdate(() => {
    const exercise = read();
    const m = metrics(k, exercise);

    target.color = foregroundOf(k, exercise);
    target.radius = 9 * m.scale;
    target.pos = k.vec2(m.cx, m.cy);
  });
}

const BUILDERS = {
  dynamic_visual_acuity: buildDynamicVisualAcuity,
  near_far_convergence: buildNearFarConvergence,
  optokinetic_stimulation: buildOptokinetic,
  saccades: buildSaccades,
  smooth_pursuit: buildSmoothPursuit,
  vor_x1_horizontal: buildVorX1('horizontal'),
  vor_x1_vertical: buildVorX1('vertical'),
  vor_x2_horizontal: buildVorX2('horizontal'),
  vor_x2_vertical: buildVorX2('vertical'),
} as const satisfies Record<Exercise['type'], Build>;

/** Enough slanted lines to cross the widest stage. */
const MAX_NOISE_LINES = 48;

/** Drifting diagonals, the optional visual load behind every drill but the stripes. */
function buildBackgroundNoise(stage: Stage): void {
  const { k, read, time } = stage;

  for (let index = 0; index < MAX_NOISE_LINES; index++) {
    const line = addBar(stage);
    line.onUpdate(() => {
      const exercise = read();
      const m = metrics(k, exercise);
      const gap = 36 * m.scale;
      const drift = (time() * 18 * exercise.speed * m.scale) % gap;
      const lean = 60 * m.scale;
      const top = -gap + drift + index * gap;

      line.color = secondaryOf(k, exercise);
      line.opacity = 0.35;
      line.width = Math.hypot(lean, m.h);
      line.height = 2 * m.scale;
      line.angle = (Math.atan2(m.h, -lean) * 180) / Math.PI;
      line.pos = k.vec2(top - lean / 2, m.h / 2);
    });
  }
}

/** Changing this means the drill differs structurally and its objects must be rebuilt. */
const stageSignature = (exercise: Exercise) =>
  [exercise.type, exercise.backgroundNoise, pathOf(exercise)].join('|');

export function ExerciseCanvas({
  className,
  exercise,
  paused = false,
}: ExerciseCanvasProps) {
  const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null);

  const { attach, detach } = useKaplayEngine();

  const exerciseRef = useRef(exercise);
  const pausedRef = useRef(paused);

  useEffect(() => {
    exerciseRef.current = exercise;
    pausedRef.current = paused;
  });

  useEffect(() => {
    if (!wrapper) return;

    const k = attach(wrapper);
    const read: ReadExercise = () => exerciseRef.current;
    // Own clock rather than k.time(), so a pause resumes where it froze.
    let elapsed = 0;
    const stage: Stage = { k, read, time: () => elapsed };
    // Blank, so the first frame always builds the drill on a reused engine.
    let signature = '';

    const frame = k.onUpdate(() => {
      if (!pausedRef.current) elapsed += k.dt();

      const current = read();
      k.setBackground(k.rgb(PALETTES[current.scheme].background));

      const next = stageSignature(current);
      if (next === signature) return;

      signature = next;
      k.destroyAll(STAGE_TAG);
      // Stripes are the optokinetic drill itself, so noise behind them is nonsense.
      if (
        current.backgroundNoise &&
        current.type !== 'optokinetic_stimulation'
      ) {
        buildBackgroundNoise(stage);
      }
      BUILDERS[current.type](stage);
    });

    return () => {
      frame.cancel();
      k.destroyAll(STAGE_TAG);
      detach();
    };
  }, [attach, detach, wrapper]);

  return (
    <div
      aria-label={exercise.cue}
      className={className}
      ref={setWrapper}
      role="img"
    />
  );
}
