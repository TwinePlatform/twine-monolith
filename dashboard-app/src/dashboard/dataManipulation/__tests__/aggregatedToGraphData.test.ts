import { aggregatedToStackedGraph } from '../aggregatedToGraphData';
import { DurationUnitEnum } from '../../../types';
import { AggregatedData } from '../logsToAggregatedData';

describe('aggregatedToGraphData', () => {
  test('aggregatedToStackedGraph returns correct data', () => {
    const aggData = {
      groupByX: 'Activity',
      groupByY: 'Months',
      rows: [
        {
          id: 3,
          name: 'Digging Holes',
          'February 2018': {},
          'March 2018': { minutes: 2 },
          'April 2018': {},
        },
        {
          id: 5,
          name: 'Outdoor and practical work',
          'February 2018': {},
          'March 2018': { hours: 2, minutes: 23 },
          'April 2018': { hours: 2 },
        },
      ]} as AggregatedData;

    const expected = aggregatedToStackedGraph(aggData, DurationUnitEnum.HOURS);
    expect(expected).toEqual({
      datasets: [
        {
          backgroundColor: '#F44336',
          data: [0, 0.03, 0],
          label: 'Digging Holes',
          id: 3,
        },
        {
          backgroundColor: '#E91E63',
          data: [0, 2.38, 2],
          label: 'Outdoor and practical work',
          id: 5,
        },
      ],
      labels: [['Feb', '2018'], ['Mar', '2018'], ['Apr', '2018']],
    });
  });
});
