import moment from 'moment';


export const DateRangesEnum = {
  LAST_12_MONTHS: 'Last 12 Months',
  LAST_MONTH: 'Last Month',
  LAST_WEEK: 'Last Week',
  THIS_WEEK: 'This Week',
};


const getFormattedDateRange = (since, until, unit, format) =>
  [...Array(moment(until).diff(since, unit) + 1)]
    .map((_, i) => moment(since).add(i, unit).format(format));


const DateRanges = {
  toSelectOptions: () => [
    { key: '0', value: DateRangesEnum.THIS_WEEK },
    { key: '1', value: DateRangesEnum.LAST_WEEK },
    { key: '2', value: DateRangesEnum.LAST_MONTH },
    { key: '3', value: DateRangesEnum.LAST_12_MONTHS },
  ],

  toDates: (dateRange) => {
    switch (dateRange) {
      case DateRangesEnum.LAST_12_MONTHS:
        return {
          since: moment().subtract(12, 'months').toDate(),
          until: new Date(),
        };

      case DateRangesEnum.LAST_MONTH:
        return {
          since: moment().subtract(1, 'month').toDate(),
          until: new Date(),
        };

      case DateRangesEnum.LAST_WEEK:
        return {
          since: moment().subtract(1, 'week').startOf('isoWeek').toDate(),
          until: moment().subtract(1, 'week').endOf('isoWeek').toDate(),
        };

      case DateRangesEnum.THIS_WEEK:
        return {
          since: moment().startOf('isoWeek').toDate(),
          until: new Date(),
        };

      default:
        return {};
    }
  },

  toFormat: (dateRange) => {
    switch (dateRange) {
      case DateRangesEnum.LAST_12_MONTHS:
        return 'MMM YYYY';

      case DateRangesEnum.LAST_MONTH:
        return 'DD MMM';

      case DateRangesEnum.LAST_WEEK:
        return 'DD MMM';

      case DateRangesEnum.THIS_WEEK:
        return 'DD MMM';

      default:
        return 'DD-MM-YYY';
    }
  },

  toArray: (since, until, dateRange) => {
    switch (dateRange) {
      case DateRangesEnum.LAST_12_MONTHS:
        return getFormattedDateRange(since, until, 'month', DateRanges.toFormat(dateRange));

      case DateRangesEnum.LAST_MONTH:
        return getFormattedDateRange(since, until, 'week', DateRanges.toFormat(dateRange));

      case DateRangesEnum.LAST_WEEK:
        return getFormattedDateRange(since, until, 'day', DateRanges.toFormat(dateRange));

      case DateRangesEnum.THIS_WEEK:
        return getFormattedDateRange(since, until, 'day', DateRanges.toFormat(dateRange));

      default:
        return [];
    }
  },

  zeroPadObject: (since, until, dateRange, obj) =>
    DateRanges.toArray(since, until, dateRange)
      .reduce((acc, value) => value in acc ? acc : { ...acc, [value]: 0 }, obj),
};

export default DateRanges;
