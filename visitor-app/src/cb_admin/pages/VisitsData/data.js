/*
 * Data processing functions
 *
 * Transformation of API responses into visit and vistior statistics,
 * formatted to be compatible with Chart.js
 */
import { filter } from 'ramda';
import { CommunityBusiness, Visitors, Activities } from '../../../api';
import { mapValues, repeat } from '../../../util';
import DateRanges from './dateRange';
import { VisitsStats, calculateStepSize, formatChartData, VisitorStats, preProcessVisitors } from './util';
import { colors } from '../../../shared/style_guide';
import { AgeRange } from '../../../shared/constants';


/*
 * Chart colour spec
 *
 * - Doughnut chart cycles through 3 colours, since it displays either age groups or gender
 * - Bar charts use a single colour (purple) to reduce unnecessary visual noise
 */
const Colours = {
  DOUGHNUT: [colors.highlight_primary, colors.highlight_secondary, colors.dark],
  BAR: colors.highlight_secondary,
};

// sorter :: ([string, number], [string, number]) -> number
const sorter = (l, r) => AgeRange.fromStr(l[0])[0] - AgeRange.fromStr(r[0])[0];

/*
 * getVisitsData
 *
 * `filters` - an object of filters (directly from component state)
 * `chartOptions` - chart display options (directly from component state)
 *
 * Queries API and processes response into relevant statistics, then formats
 * this data into the shape expected by Chart.js
 *
 * NOTE:
 * The expection is `data.activity` which is a nested object { category: { activity: ChartData } }
 * in order to make data selection for chart drill down simpler.
 */
// ({ k: String }, { k: a }) -> { charts: a, data: { k: ChartData } }
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

      const genderStats = VisitsStats.calculateGenderStatistics(logs);
      const ageGroupsStats = VisitsStats.calculateAgeGroupStatistics(logs);
      const timeStats = VisitsStats.calculateTimePeriodStatistics(since, until, filters.time, logs);
      const categoriesStats = VisitsStats.calculateCategoryStatistics(logs);
      const activitiesStats = VisitsStats.calculateActivityStatistics(logs);

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
          age: formatChartData(ageGroupsStats, repeat(Colours.DOUGHNUT, Object.keys(ageGroupsStats).length), { sorter }),
        },
      };
    });
};

/*
 * getVisitorData
 *
 * `filters` - an object of filters (directly from component state)
 * `chartOptions` - chart display options (directly from component state)
 *
 * Queries API and processes response into relevant statistics, then formats
 * this data into the shape expected by Chart.js
 *
 * NOTE:
 * The expection is `data.activity` which is a nested object { category: { activity: ChartData } }
 * in order to make data selection for chart drill down simpler.
 */
// ({ k: String }, { k: a }) -> { charts: a, data: { k: ChartData } }
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
      const visitors = res.data.result;
      const activities = rActivities.data.result;

      const visitorsWithVisitData = preProcessVisitors(visitors, filters, since, until);

      const genderStats = VisitorStats.calculateGenderStatistics(visitorsWithVisitData);
      const ageGroupsStats = VisitorStats.calculateAgeGroupStatistics(visitorsWithVisitData);
      const categoriesStats = VisitorStats.calculateCategoryStatistics(visitorsWithVisitData);
      const activitiesStats = VisitorStats.calculateActivityStatistics(
        visitorsWithVisitData,
        activities,
      );
      const timeStats = VisitorStats.calculateTimePeriodStatistics(
        since,
        until,
        filters.time,
        visitorsWithVisitData,
      );

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
          age: formatChartData(ageGroupsStats, repeat(Colours.DOUGHNUT, Object.keys(ageGroupsStats).length), { sorter }),
        },
      };
    });
};
