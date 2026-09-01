import { isNumber } from '../util/isNumber';
import type { Nullish } from '../util/nullish';

type BoundedSchema = {
  maxValue: Nullish<number>;
  minValue: Nullish<number>;
};

export type Bounds = {
  max: number;
  min: number;
};

/** Throws rather than defaulting: a silently-guessed bound skews every score and slider built from it. */
export function numericBounds(schema: BoundedSchema): Bounds {
  const { maxValue, minValue } = schema;
  if (!isNumber(minValue) || !isNumber(maxValue) || minValue === maxValue) {
    throw new Error('a bounded field must declare a finite min and max');
  }

  return { max: maxValue, min: minValue };
}
