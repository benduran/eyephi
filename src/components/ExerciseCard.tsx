'use client';

import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr';
import {
  CardBody,
  CardCaption,
  CardFooter,
  CardRoot,
  CardSubtitle,
  CardTitle,
} from '@primereact/ui/card';
import Link from 'next/link';
import { uiRoutes } from '../routing/uiRoutes';
import type { Exercise } from '../schema/types';

type ExerciseCardProps = {
  exercise: Exercise;
};

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const { blurb, displayName, type } = exercise;
  return (
    <Link className="group" href={uiRoutes.basketBuilderAdd(type)}>
      <CardRoot className="border-2 border-transparent transition-colors group-hover:border-primary">
        <CardBody className="flex flex-col grow justify-between">
          <CardCaption>
            <CardTitle>{displayName}</CardTitle>
            <CardSubtitle>
              <span className="text-sm">{blurb}</span>
            </CardSubtitle>
          </CardCaption>
          <CardFooter>
            <div className="text-right border-t border-t-gray-200 text-sm text-muted-color dark:border-t-gray-700 pt-3">
              <span className="inline-flex items-center gap-1">
                Configure
                <ArrowRightIcon />
              </span>
            </div>
          </CardFooter>
        </CardBody>
      </CardRoot>
    </Link>
  );
}
