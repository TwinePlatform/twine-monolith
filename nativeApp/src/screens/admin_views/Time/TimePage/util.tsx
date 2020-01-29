import moment from 'moment';

export const groupLogsByThisWeekLastWeekRest = (logs) => {
  const now = moment();
  const lastWeek = moment().subtract(1, 'week');
  const twoWeeksAgo = moment().subtract(2, 'weeks');
  const groupedLogs = logs.reduce((acc, log) => {
    const startedAt = moment(log.startedAt);

    if (startedAt.isBetween(lastWeek, now)) {
      return { ...acc, thisWeek: [...acc.thisWeek, log] };
    } if (startedAt.isBetween(twoWeeksAgo, lastWeek)) {
      return { ...acc, lastWeek: [...acc.lastWeek, log] };
    }
    return { ...acc, rest: [...acc.rest, log] };
  }, { thisWeek: [], lastWeek: [], rest: [] });

  return groupedLogs;
};
