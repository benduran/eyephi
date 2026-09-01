'use client';

import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr';
import { Card } from '@primereact/ui/card';
import Link from 'next/link';
import { useBasketBuilder } from '../context/BasketBuilder';
import { formatDuration } from '../lib/format';
import { toCategoryLabel } from '../lib/labels';
import { uiRoutes } from '../routing/uiRoutes';
import type { Exercise } from '../schema/types';

type ExerciseCardProps = {
  exercise: Exercise;
};

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const { exercises } = useBasketBuilder();

  const { blurb, category, displayName, duration, type } = exercise;
  return (
    <Link
      className="group flex flex-col"
      href={uiRoutes.basketBuilderAdd(type, exercises)}
    >
      <Card.Root className="border-2 border-transparent grow transition-colors group-hover:border-primary">
        <Card.Body className="flex flex-col grow justify-between">
          <Card.Caption>
            <div className="flex items-baseline justify-between gap-3">
              <Card.Title>{displayName}</Card.Title>
              <span className="font-mono text-tag uppercase tracking-wider text-muted-color whitespace-nowrap">
                {toCategoryLabel(category)}
              </span>
            </div>
            <Card.Subtitle>
              <span className="text-sm">{blurb}</span>
            </Card.Subtitle>
          </Card.Caption>
          <Card.Footer>
            <div className="flex items-center justify-between border-t border-surface-200 text-sm text-muted-color dark:border-surface-700 pt-3">
              <span className="font-mono text-xs">
                {formatDuration(duration)} default
              </span>
              <span className="inline-flex items-center gap-1">
                Configure
                <ArrowRightIcon aria-hidden />
              </span>
            </div>
          </Card.Footer>
        </Card.Body>
      </Card.Root>
    </Link>
  );
}
