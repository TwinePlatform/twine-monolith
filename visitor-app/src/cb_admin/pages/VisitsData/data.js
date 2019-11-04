import { filter, flatten, pick } from 'ramda';
import { CommunityBusiness, Visitors, Activities } from '../../../api';
import { mapValues, combineValues } from '../../../util';
import DateRanges from './dateRange';
import { Stats, calculateStepSize, formatChartData, VisitorStats } from './util';
import { colors } from '../../../shared/style_guide';

const Colours = {
  DOUGHNUT: [colors.highlight_primary, colors.highlight_secondary, colors.light],
  BAR: colors.highlight_secondary,
};


export const getVisitsData = (filters, chartsOptions) => {
  const { since, until } = DateRanges.toDates(filters.time);

  const queryFilter = filter(Boolean, {
    gender: filters.gender,
    age: filters.age,
    visitActivity: filters.activity,
  });

  return CommunityBusiness.getVisits({ since, until, filter: queryFilter })
    .then((res) => {
      const logs = res.data.result;

      const genderStats = Stats.calculateGenderStatistics(logs);
      const ageGroupsStats = Stats.calculateAgeGroupStatistics(logs);
      const timeStats = Stats.calculateTimePeriodStatistics(since, until, filters.time, logs);
      const categoriesStats = Stats.calculateCategoryStatistics(logs);
      const activitiesStats = Stats.calculateActivityStatistics(logs);

      return {
        charts: {
          ...chartsOptions,
          time: { stepSize: calculateStepSize(timeStats) },
          category: { stepSize: calculateStepSize(categoriesStats) },
        },
        data: {
          time: formatChartData(timeStats, Colours.BAR),
          gender: formatChartData(genderStats, Colours.DOUGHNUT),
          category: formatChartData(categoriesStats, Colours.BAR),
          activity: mapValues(x => formatChartData(x, Colours.BAR), activitiesStats),
          age: formatChartData(ageGroupsStats, Colours.DOUGHNUT),
        },
      };
    });
};

export const getVisitorData = (filters, chartsOptions) => {
  const { since, until } = DateRanges.toDates(filters.time);

  const queryFilter = filter(Boolean, {
    gender: filters.gender,
    age: filters.age,
  });

  const pVisitors = Visitors.get({}, { filter: queryFilter, visits: true, fields: ['id', 'name', 'gender', 'birthYear'] });
  const pActivities = Activities.get();

  return Promise.all([pVisitors, pActivities])
    .then(([res, rActivities]) => {
      const { result } = res.data;
      const activities = rActivities.data.result;

      const visitors = flatten(
        result
          .filter(visitor =>
            visitor.visits.some(visit =>
              new Date(visit.createdAt) >= since
                && new Date(visit.createdAt) <= until
                && (filters.activity ? visit.visitActivity === filters.activity : true),
            ))
          .map(visitor => ({
            ...visitor,
            ...pick(
              ['visitActivity', 'category', 'createdAt'],
              combineValues(
                visitor.visits
                  .filter(visit =>
                    new Date(visit.createdAt) >= since
                      && new Date(visit.createdAt) <= until
                      && (filters.activity ? visit.visitActivity === filters.activity : true),
                  ),
              ),
            ),
          })));

      const genderStats = VisitorStats.calculateGenderStatistics(visitors);
      const ageGroupsStats = VisitorStats.calculateAgeGroupStatistics(visitors);
      const activitiesStats = VisitorStats.calculateActivityStatistics(visitors, activities);
      const categoriesStats = VisitorStats.calculateCategoryStatistics(visitors);
      const timeStats = VisitorStats.calculateTimePeriodStatistics(since, until, filters.time, visitors);

      return {
        charts: {
          ...chartsOptions,
          time: { stepSize: calculateStepSize(timeStats) },
          category: { stepSize: calculateStepSize(categoriesStats) },
        },
        data: {
          time: formatChartData(timeStats, Colours.BAR),
          gender: formatChartData(genderStats, Colours.DOUGHNUT),
          category: formatChartData(categoriesStats, Colours.BAR),
          activity: mapValues(x => formatChartData(x, Colours.BAR), activitiesStats),
          age: formatChartData(ageGroupsStats, Colours.DOUGHNUT),
        },
      };
    });
};
