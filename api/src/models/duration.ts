import { filter } from 'ramda';
import { Duration } from './types';

const SEC_PER_MIN = 60;
const MIN_PER_HR = 60;
const HRS_PER_DAY = 24;
const SEC_PER_HR = SEC_PER_MIN * MIN_PER_HR;
const SEC_PER_DAY = SEC_PER_HR * HRS_PER_DAY;


const Duration = {
  toHours: (d: Duration) =>
    Duration.toSeconds(d) / 3600,

  toSeconds: (d: Duration) => {
    return Object.entries(d).reduce((acc, [k, v]) => {
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
  },

  fromSeconds: (s: number) => {
    if (s < 0) {
      throw new Error('negative seconds not supported');
    }

    const days = Math.floor(s / SEC_PER_DAY);

    const hours = Math.floor(
      (s - (days * SEC_PER_DAY)) / SEC_PER_HR);

    const minutes = Math.floor(
      (s - (days * SEC_PER_DAY)
         - (hours * SEC_PER_HR)) / SEC_PER_MIN);

    const seconds = Math.floor(
      (s - (days * SEC_PER_DAY)
         - (hours * SEC_PER_HR)
         - (minutes * SEC_PER_MIN)));

    return filter((v) => v > 0, { days, hours, minutes, seconds });
  },

  sum: (d1: Duration, d2: Duration) =>
    Duration.fromSeconds(Duration.toSeconds(d1) + Duration.toSeconds(d2)),

};

export default Duration;
