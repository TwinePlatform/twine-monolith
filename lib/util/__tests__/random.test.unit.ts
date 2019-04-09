import * as moment from 'moment';
import { Random } from '..';


const callNTimes = (n: number, fn: Function) => {
  const results = [];
  for (let i = 0; i < n; i++) {
    results.push(fn());
  }
  return results;
};

describe('Utilities :: Random', () => {
  test('number', () => {
    callNTimes(
      100,
      () => Random.number(Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER)
    ).forEach((n) => {
      expect(typeof n).toBe('number');
      expect(isNaN(n)).toBe(false);
      expect(Number.isNaN(n)).toBe(false);
      expect(n).toBeGreaterThan(-Infinity);
      expect(n).toBeLessThan(Infinity);
    });
  });

  test('integer', () => {
    callNTimes(
      100,
      () => Random.integer(Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER)
    ).forEach((n) => {
      expect(typeof n).toBe('number');
      expect(isNaN(n)).toBe(false);
      expect(Number.isNaN(n)).toBe(false);
      expect(n).toBeGreaterThan(-Infinity);
      expect(n).toBeLessThan(Infinity);
      expect(Math.round(n)).toBe(n);
    });
  });

  test('element', () => {
    const xs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    callNTimes(100, () => Random.element(xs)).forEach((n) => {
      expect(typeof n).toBe('number');
      expect(xs.includes(n));
    });
  });

  test('date', () => {
    const from = new Date(0);
    const to = new Date('2099-01-01T00:00:00.000');

    callNTimes(100, () => Random.date(from, to)).forEach((d) => {
      expect(d instanceof Date).toBe(true);
      expect(moment(d).isBetween(from, to)).toBe(true);
    });
  });
});
