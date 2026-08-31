export function isNumber(thing: unknown): thing is number {
  return typeof thing === 'number';
}
