import { curry } from 'ramda';

export const roundTo = curry((p: number, n: number): number => Math.round(n * (10 ** p)) / (10 ** p));