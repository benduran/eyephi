'use client';

import { useState } from 'react';
import { AppHeader } from '../components/appHeader';
import { BuildView } from '../components/buildView';
import { ConfigDialog } from '../components/configDialog';
import { DoneView } from '../components/doneView';
import { ImmersiveOverlay } from '../components/immersiveOverlay';
import { MobileSubmitBar } from '../components/mobileSubmitBar';
import { ReadyDialog } from '../components/readyDialog';
import { RunView } from '../components/runView';
import { useTheme } from '../hooks/useTheme';
import type {
  CategoryView,
  ExerciseView,
  PaletteView,
  ProgramItemView,
  RunStepView,
} from '../schema/types';
import { Providers } from './providers';

/*
 * Visual fixture only -- static props so every component can be eyeballed in
 * both themes. Contains no application logic and is safe to delete.
 */

const CATEGORIES: CategoryView[] = [
  { id: 'all', label: 'All' },
  { id: 'gaze', label: 'Gaze stability' },
  { id: 'ocular', label: 'Ocular motor' },
  { id: 'habituation', label: 'Habituation' },
];

const EXERCISES: ExerciseView[] = [
  {
    blurb: 'Hold gaze on a fixed target while turning your head side to side.',
    category: 'Gaze stability',
    defaultLabel: '1:00 default',
    id: 'vor1h',
    name: 'VOR ×1 Horizontal',
  },
  {
    blurb: 'Fixed target, head nods up and down at a steady tempo.',
    category: 'Gaze stability',
    defaultLabel: '1:00 default',
    id: 'vor1v',
    name: 'VOR ×1 Vertical',
  },
  {
    blurb: 'Follow a slowly gliding target with your eyes only, head still.',
    category: 'Ocular motor',
    defaultLabel: '1:00 default',
    id: 'pursuit',
    name: 'Smooth Pursuit',
  },
  {
    blurb: 'A drifting striped field to desensitise motion intolerance.',
    category: 'Habituation',
    defaultLabel: '0:30 default',
    id: 'okn',
    name: 'Optokinetic Stripes',
  },
];

const PROGRAM_ITEMS: ProgramItemView[] = [
  {
    difficultyLabel: '4.5',
    difficultyPct: 45,
    durationLabel: '1:00',
    id: 'vor1h',
    name: 'VOR ×1 Horizontal',
    settingsLabel: 'SPD 4 · INT 4 · Soft mono',
  },
  {
    difficultyLabel: '7.2',
    difficultyPct: 72,
    durationLabel: '0:30',
    id: 'okn',
    name: 'Optokinetic Stripes',
    settingsLabel: 'SPD 6 · INT 7 · Cool',
  },
];

const RUN_STEPS: RunStepView[] = [
  {
    durationLabel: '1:00',
    id: 'vor1h',
    name: 'VOR ×1 Horizontal',
    num: '01',
    state: 'complete',
  },
  {
    durationLabel: '0:30',
    id: 'okn',
    name: 'Optokinetic Stripes',
    num: '02',
    state: 'current',
  },
  {
    durationLabel: '0:45',
    id: 'dva',
    name: 'Dynamic Visual Acuity',
    num: '03',
    state: 'upcoming',
  },
];

const PALETTES: PaletteView[] = [
  {
    background: '#f0f0ef',
    foreground: '#5c5c58',
    id: 'softmono',
    label: 'Soft mono',
  },
  {
    background: '#ffffff',
    foreground: '#111111',
    id: 'contrast',
    label: 'High contrast',
  },
  { background: '#0c1622', foreground: '#5aa9ff', id: 'cool', label: 'Cool' },
  { background: '#181206', foreground: '#ffb547', id: 'warm', label: 'Warm' },
];

const noop = () => undefined;

export default function Home() {
  /** hooks */
  const [theme, setTheme] = useTheme();

  /** state */
  const [configOpen, setConfigOpen] = useState(false);
  const [readyOpen, setReadyOpen] = useState(false);
  const [immersive, setImmersive] = useState(false);

  return (
    <Providers>
      <AppHeader
        onNewProgram={noop}
        onPrimaryAction={noop}
        onShare={() => setReadyOpen(true)}
        onThemeChange={setTheme}
        primaryDisabled={false}
        primaryLabel="Start program"
        progress={{
          elapsedLabel: '0:42',
          progressPct: 38,
          totalTimeLabel: '2:15',
        }}
        shareDisabled={false}
        theme={theme}
      />

      <BuildView
        categories={CATEGORIES}
        exercises={EXERCISES}
        onCategoryChange={noop}
        onConfigure={() => setConfigOpen(true)}
        program={{
          countLabel: '2 EXERCISES',
          difficultyLabel: 'Moderate',
          difficultyPct: 56,
          difficultyValue: '5.6',
          emptyHint: 'Pick one from the left to begin',
          items: PROGRAM_ITEMS,
          onEdit: () => setConfigOpen(true),
          onRemove: noop,
          onSubmit: () => setReadyOpen(true),
          totalTimeLabel: '1:30',
        }}
        selectedCategoryId="all"
      />

      <RunView
        cueText="Turn your head left–right, keep eyes on the target."
        currentName="Optokinetic Stripes"
        difficultyValue="5.6"
        onEnterImmersive={() => setImmersive(true)}
        onExitRun={noop}
        onSkipStep={noop}
        onTogglePause={noop}
        pauseLabel="Pause"
        stepPositionLabel="STEP 2 OF 3"
        stepRemainingLabel="0:18"
        steps={RUN_STEPS}
      />

      <DoneView
        onBackToEditor={noop}
        onRestart={noop}
        summary="3 exercises · 2:15 · overall difficulty 5.6"
      />

      <MobileSubmitBar
        countLabel="2 EXERCISES"
        difficultyLabel="Moderate"
        difficultyValue="5.6"
        onSubmit={() => setReadyOpen(true)}
        totalTimeLabel="1:30"
      />

      <ConfigDialog
        addButtonLabel="Add to program"
        blurb="Hold gaze on a fixed target while turning your head side to side."
        category="Gaze stability"
        difficultyBreakdown="SPD 4 · INT 4 · 1:00 · SOFT MONO"
        difficultyPct={45}
        difficultyValue="4.5"
        duration={60}
        durationLabel="1:00"
        intensity={4}
        intensityLabel="4 / 10"
        name="VOR ×1 Horizontal"
        onAdd={() => setConfigOpen(false)}
        onDurationChange={noop}
        onIntensityChange={noop}
        onOpenChange={setConfigOpen}
        onPaletteChange={noop}
        onSpeedChange={noop}
        onTextureChange={noop}
        open={configOpen}
        paletteId="softmono"
        palettes={PALETTES}
        speed={4}
        speedLabel="4 / 10"
        texture={false}
      />

      <ReadyDialog
        copyLabel="Copy"
        onCopyLink={noop}
        onOpenChange={setReadyOpen}
        onStartNow={() => setReadyOpen(false)}
        open={readyOpen}
        shareLink="https://eyephi.app/p/a7k2x9"
        summary="2 exercises · 1:30 total · overall difficulty 5.6 (moderate)"
      />

      {immersive ? (
        <ImmersiveOverlay
          cueText="Stay relaxed, let the field drift past."
          currentName="Optokinetic Stripes"
          elapsedLabel="0:42"
          exitLabel="Windowed"
          onLeaveImmersive={() => setImmersive(false)}
          onSkipStep={noop}
          onTogglePause={noop}
          pauseLabel="Pause"
          progressPct={38}
          stepPositionLabel="STEP 2 OF 3"
          stepRemainingLabel="0:18"
          totalTimeLabel="2:15"
        />
      ) : null}
    </Providers>
  );
}
