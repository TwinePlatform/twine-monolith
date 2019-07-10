import { Dictionary, toPairs, compose } from 'ramda';
import { Duration, Objects } from 'twine-util';


export const logsToDurations = compose(
  Duration.accumulate,
  (logs: any[]) => logs.map((log) => log.duration)
);

export const sumLogDurations = (a: Dictionary<any[]>) =>
  Objects.mapValues(logsToDurations, a);

export const sortByDuration = (xs: [string, Duration.Duration][]) =>
  xs.sort(([monthLeft, durationLeft], [monthRight, durationRight]) =>
    Duration.toSeconds(durationRight) - Duration.toSeconds(durationLeft));

export const maxByDuration = (xs: [string, Duration.Duration][]) =>
  xs.reduce((acc, [month, duration]) => {
    if (!acc[0]) {
      return [[month, duration] as [string, Duration.Duration]];
    } else if (Duration.greaterThan(duration, acc[0][1])) {
      return [[month, duration] as [string, Duration.Duration]];
    } else if (Duration.equals(duration, acc[0][1])) {
      return acc.concat([month, duration]);
    } else {
      return acc;
    }
  }, [] as [string, Duration.Duration][]);

export const findMostActive = compose(
  (ds) => ds
    .slice(0, 3)
    .map(([label, duration]) => ({ label, hours: Math.round(Duration.toHours(duration)) })),
  maxByDuration,
  sortByDuration,
  toPairs,
  sumLogDurations
);
