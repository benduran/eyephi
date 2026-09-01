import type { Nullish } from '../schema/types';
import { isNumber } from '../util/isNumber';

type BoundedSchema = {
  maxValue: Nullish<number>;
  minValue: Nullish<number>;
};

export type Bounds = {
  max: number;
  min: number;
};

/**
 * Reads a numeric schema's range so callers never restate it. Throws rather
 * than guessing, because a bound that silently defaults skews every score and
 * every slider built from it.
 */
export function numericBounds(schema: BoundedSchema): Bounds {
  const { maxValue, minValue } = schema;
  if (!isNumber(minValue) || !isNumber(maxValue) || minValue === maxValue) {
    throw new Error('a bounded field must declare a finite min and max');
  }

  return { max: maxValue, min: minValue };
}
