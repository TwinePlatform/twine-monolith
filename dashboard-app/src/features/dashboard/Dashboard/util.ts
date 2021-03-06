import { Dictionary, compose } from 'ramda';
import { Duration, Objects } from 'twine-util';
import Months from '../../../lib/util/months';


// Just to make it clearer whats being expected without reproducing the type def
type VolunteerLog = any;

const collectMaxDurations = (ds: Dictionary<Duration.Duration>) => {
  const init = {
    labels: [] as string[],
    value: Duration.fromSeconds(0),
  };

  return Object.entries(ds)
    .reduce((acc, [k, v]) => {
      if (Duration.equals(v, acc.value)) {
        return { value: acc.value, labels: acc.labels.concat(k) };

      } else if (Duration.greaterThan(v, acc.value)) {
        return { value: v, labels: [k] };

      } else {
        return acc;

      }
    }, init);
};

export const logsToDurations = compose(
  Duration.accumulate,
  (logs: VolunteerLog[]) => logs.map((log) => log.duration)
);

export const sumLogDurations = (a: Dictionary<VolunteerLog[]>) =>
  Objects.mapValues(logsToDurations, a);

const sortByMonthOrAlpha = (xs: string[]) =>
  xs.sort((a, b) => {
    if (isNaN(new Date(`01 ${b}`).valueOf())) {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    }
    return Months.diff(new Date(`01 ${b}`), new Date(`01 ${a}`));
  });

export const findMostActive = compose(
  ({ labels, value }) => ({
    labels: sortByMonthOrAlpha(labels),
    value: Math.round(Duration.toHours(value)),
  }),
  collectMaxDurations,
  sumLogDurations
);
