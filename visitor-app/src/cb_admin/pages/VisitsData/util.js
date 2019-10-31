import moment from 'moment';
import { zip, identity, toPairs, head, last, map, assoc, assocPath, mergeWith, add, uniq, fromPairs, mergeDeepWith } from 'ramda';
import { collectBy, mapValues, ones } from '../../../util';
import { createAgeGroups } from '../../../shared/constants';
import DateRanges, { DateRangesEnum } from './dateRange';

export const AgeGroups = createAgeGroups(['0-17', '18-34', '35-50', '51-69', '70+']);

// isAgeGiven :: Log -> Boolean
const isAgeGiven = log => typeof log.birthYear === 'number';

// count :: { k: [a] } -> { k: Number }
const count = o => mapValues(xs => xs.length, o);

export const Stats = {
  // calculateGenderStatistics :: [Log] -> { k: Number }
  calculateGenderStatistics: logs => count(collectBy(log => log.gender, logs)),

  // calculateAgeGroupStatistics :: [Log] -> { k: Number }
  calculateAgeGroupStatistics: logs =>
    count(collectBy(
      identity,
      logs.filter(isAgeGiven).map(l => AgeGroups.fromBirthYear(l.birthYear)),
    )),

  // calculateCategoryStatistics :: [Log] -> { k: Number }
  calculateCategoryStatistics: logs =>
    count(collectBy(log => log.category, logs)),

  // calculateActivityStatistics :: [Log] -> { category: { activity: Number } }
  calculateActivityStatistics: logs =>
    mapValues(
      ls => count(collectBy(l => l.visitActivity, ls)),
      collectBy(log => log.category, logs),
    ),

  // calculateTimePeriodStatistics :: [Log] -> { k: Number }
  calculateTimePeriodStatistics: (since, until, dateRange, logs) =>
    DateRanges.zeroPadObject(
      since,
      until,
      dateRange,
      count(collectBy(
        identity,
        logs.map(log =>
          (dateRange === DateRangesEnum.LAST_MONTH
            ? moment(log.createdAt).startOf('isoWeek')
            : moment(log.createdAt)
          )
            .format(DateRanges.toFormat(dateRange))),
      )),
    ),
};

export const VisitorStats = {
  // calculateGenderStatistics :: [Visitor] -> { k: Number }
  calculateGenderStatistics: visitors => count(collectBy(log => log.gender, visitors)),

  // calculateAgeGroupStatistics :: [Visitor] -> { k: Number }
  calculateAgeGroupStatistics: visitors =>
    count(collectBy(
      identity,
      visitors.filter(isAgeGiven).map(l => AgeGroups.fromBirthYear(l.birthYear)),
    )),

  // calculateCategoryStatistics :: [Visitor] -> { k: Number }
  calculateCategoryStatistics: visitors =>
    visitors.reduce((acc, visitor) => {
      const cats = uniq(visitor.category);
      const categoriesCount = fromPairs(zip(cats, ones(cats.length)));
      return mergeWith(add, acc, categoriesCount);
    }, {}),

  // calculateActivityStatistics :: [Visitor] -> { category: { activity: Number } }
  calculateActivityStatistics: (visitors, activities) => {
    const activityToCategoryMap = activities
      .reduce((acc, act) => assoc(act.name, act.category, acc), {});

    return visitors.reduce((acc, visitor) => {
      const activitiesCount = uniq(visitor.visitActivity)
        .reduce((counts, activity) => {
          const cat = activityToCategoryMap[activity];
          return assocPath([cat, activity], 1, counts);
        }, {});

      return mergeDeepWith(add, acc, activitiesCount);
    }, {});
  },

  // calculateTimePeriodStatistics :: [Visitor] -> { k: Number }
  calculateTimePeriodStatistics: (since, until, dateRange, visitors) => {
    const empty = DateRanges.zeroPadObject(since, until, dateRange, {});
    const fmt = DateRanges.toFormat(dateRange);
    return visitors.reduce((acc, visitor) => {
      const visitorTotals = visitor.createdAt
        .map(date =>
          (dateRange === DateRangesEnum.LAST_MONTH
            ? moment(date).startOf('isoWeek')
            : moment(date)
          ).format(fmt))
        .reduce((counts, date) => assoc(date, date in counts ? counts[date] : 1, counts), {});
      return mergeWith(add, acc, visitorTotals);
    }, empty);
  },
};

// calculateStepSize :: { k: Number } -> Number
export const calculateStepSize = stats =>
  Math.max(1, Math.floor(Math.max(...Object.values(stats)) / 5));

// formatChartData :: ({ k: v }, [string], string?) -> { k: v }
export const formatChartData = (data, bgColor, label) => {
  const pairedData = toPairs(data);
  return {
    labels: map(head, pairedData),
    datasets: [
      {
        label,
        data: map(last, pairedData),
        backgroundColor: bgColor,
      },
    ],
  };
};
