import { filter } from 'ramda';
import { Duration } from '.';

const SEC_PER_MIN = 60;
const MIN_PER_HR = 60;
const HRS_PER_DAY = 24;
const HRS_PER_WORKING_DAY = 8;
const SEC_PER_HR = SEC_PER_MIN * MIN_PER_HR;
const SEC_PER_DAY = SEC_PER_HR * HRS_PER_DAY;

export type Duration = Partial<{
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
}>;

export const toSeconds = (d: Duration) => {
  return Object.entries(d).reduce((acc, [k, v = 0]) => {
    switch (k) {
    case 'days':
      return acc + v * SEC_PER_DAY;
    case 'hours':
      return acc + v * SEC_PER_HR;
    case 'minutes':
      return acc + v * SEC_PER_MIN;
    case 'seconds':
      return acc + v;
    default:
      return acc;
    }
  }, 0);
};

export const toWorkingDays = (d: Duration) =>
  toSeconds(d) / (SEC_PER_HR * HRS_PER_WORKING_DAY);

export const toHours = (d: Duration) =>
  toSeconds(d) / SEC_PER_HR;

export const fromSeconds = (s: number) => {
  if (s < 0) {
    throw new Error('negative seconds not supported');
  }

  const days = Math.floor(
    (s / SEC_PER_DAY));

  const hours = Math.floor(
    (s - (days * SEC_PER_DAY)) / SEC_PER_HR);

  const minutes = Math.floor(
    (s - (days * SEC_PER_DAY)
       - (hours * SEC_PER_HR)) / SEC_PER_MIN);

  const seconds = Math.floor(
    (s - (days * SEC_PER_DAY)
       - (hours * SEC_PER_HR)
       - (minutes * SEC_PER_MIN)));

  return filter((v) => v > 0, { days, hours, minutes, seconds }) as Duration;
};

export const sum = (d1: Duration, d2: Duration) =>
  fromSeconds(toSeconds(d1) + toSeconds(d2));

export const diff = (d1: Duration, d2: Duration) =>
  fromSeconds(toSeconds(d1) - toSeconds(d2));

export const equals = (d1: Duration, d2: Duration) =>
  toSeconds(d1) === toSeconds(d2);

export const greaterThan = (d1: Duration, d2: Duration) =>
  toSeconds(d1) > toSeconds(d2);

export const accumulate = (ds: Duration[]) =>
  ds.reduce((acc, d) => Duration.sum(acc, d), fromSeconds(0));
