/*
 * Utilities for data processing (see ./data.js)
 */
import moment from 'moment';
import { pick, zip, identity, toPairs, head, last, map, assoc, assocPath, mergeWith, add, uniq, fromPairs, mergeDeepWith } from 'ramda';
import { collectBy, mapValues, ones, combineValues } from '../../../util';
import { createAgeGroups } from '../../../shared/constants';
import DateRanges, { DateRangesEnum } from './dateRange';

export const AgeGroups = createAgeGroups(['0-17', '18-34', '35-50', '51-69', '70+']);

// isAgeGiven :: Log -> Boolean
const isAgeGiven = log => typeof log.birthYear === 'number';

// count :: { k: [a] } -> { k: Number }
const count = o => mapValues(xs => xs.length, o);

export const VisitsStats = {
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
  // calculateGenderStatistics :: [VisitorWithVisitData] -> { k: Number }
  calculateGenderStatistics: visitors => count(collectBy(log => log.gender, visitors)),

  // calculateAgeGroupStatistics :: [VisitorWithVisitData] -> { k: Number }
  calculateAgeGroupStatistics: visitors =>
    count(collectBy(
      identity,
      visitors.filter(isAgeGiven).map(l => AgeGroups.fromBirthYear(l.birthYear)),
    )),

  // calculateCategoryStatistics :: [VisitorWithVisitData] -> { k: Number }
  calculateCategoryStatistics: visitors =>
    visitors.reduce((acc, visitor) => {
      const cats = uniq(visitor.category);
      const categoriesCount = fromPairs(zip(cats, ones(cats.length)));
      return mergeWith(add, acc, categoriesCount);
    }, {}),

  // calculateActivityStatistics :: [VisitorWithVisitData] -> { category: { activity: Number } }
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

  // calculateTimePeriodStatistics :: [VisitorWithVisitData] -> { k: Number }
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


/*
 * Pre-processing of visitor/visits data in order to:
 * - apply filters
 * - make calculating statistics a little simpler
 */
// preProcessVisitors :: ([Visitor], Object, Date, Date) -> [VisitorWithVisitData]
export const preProcessVisitors = (visitors, filters, since, until) => visitors
  // Only keep those visitors whose visits fall within the date range
  // and match the visit activity filter (if set)
  .filter(visitor =>
    visitor.visits.some(visit =>
      new Date(visit.createdAt) >= since
        && new Date(visit.createdAt) <= until
        && (filters.activity ? visit.visitActivity === filters.activity : true),
    ))
  // Collect the values of the 'visitActivity', 'category' and 'createdAt' keys
  // onto the visitor object to make the calculation of statistics more straightforward
  .map(visitor => ({
    ...visitor,
    ...pick(
      ['visitActivity', 'category', 'createdAt'],
      combineValues(
        visitor.visits
          // Only keep those visits which fall within the date range
          // and match the visit activity filter (if set)
          .filter(visit =>
            new Date(visit.createdAt) >= since
              && new Date(visit.createdAt) <= until
              && (filters.activity ? visit.visitActivity === filters.activity : true),
          ),
      ),
    ),
  }));
