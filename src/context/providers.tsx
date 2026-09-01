'use client';
import { PrimeReactProvider } from '@primereact/core';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { PropsWithChildren } from 'react';
import { KaplayEngineProvider } from './KaplayEngine';
import { ThemeProvider } from './ThemeProvider';

/** Monochrome only: patients in rehab are hyper-sensitive to visual noise. */
const neutralRamp = {
  50: '{neutral.50}',
  100: '{neutral.100}',
  200: '{neutral.200}',
  300: '{neutral.300}',
  400: '{neutral.400}',
  500: '{neutral.500}',
  600: '{neutral.600}',
  700: '{neutral.700}',
  800: '{neutral.800}',
  900: '{neutral.900}',
  950: '{neutral.950}',
};

const EyePhiPreset = definePreset(Aura, {
  components: {
    // Aura cycles this spinner red/blue/green/yellow over 6s, which is exactly
    // the visual noise the monochrome rule above exists to avoid.
    progressspinner: {
      root: {
        colorFour: '{primary.color}',
        colorOne: '{primary.color}',
        colorThree: '{primary.color}',
        colorTwo: '{primary.color}',
      },
    },
  },
  semantic: {
    primary: {
      ...neutralRamp,
      activeColor: 'light-dark({primary.700}, {primary.300})',
      color: 'light-dark({primary.900}, {primary.100})',
      contrastColor: 'light-dark({primary.50}, {primary.900})',
      hoverColor: 'light-dark({primary.800}, {primary.200})',
    },
    surface: {
      0: '#ffffff',
      ...neutralRamp,
    },
    // Aura's default ink is surface-700; the design uses surface-900.
    text: {
      color: 'light-dark({surface.900}, {surface.0})',
      hoverColor: 'light-dark({surface.950}, {surface.0})',
      hoverMutedColor: 'light-dark({surface.600}, {surface.300})',
      mutedColor: 'light-dark({surface.500}, {surface.400})',
    },
  },
});

const primereactConfig = {
  license:
    'eyJpZCI6IjUyNzhmNDRiLTRmNzctNDQ0ZS1iMjNlLTMyYjgxZGY1OTk5YiIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODgxODA5OTYsImV4cCI6MTgxOTcxNjk5Nn0.Jk-sf69J50wv4dasQ4Dzr_Oi0TAkxQSYXQfKhrSNmQ7ybn0Yulm204UzKyR5cgFZqvZay20E83PR6x7qnz1YDA',
  theme: {
    options: {
      darkModeSelector: '.dark',
    },
    preset: EyePhiPreset,
  },
};

export function Providers({ children }: PropsWithChildren) {
  return (
    <NuqsAdapter>
      <PrimeReactProvider {...primereactConfig}>
        <ThemeProvider>
          <KaplayEngineProvider>{children}</KaplayEngineProvider>
        </ThemeProvider>
      </PrimeReactProvider>
    </NuqsAdapter>
  );
}
