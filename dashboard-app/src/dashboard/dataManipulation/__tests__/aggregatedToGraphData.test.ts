import { aggregatedToStackedGraph } from '../aggregatedToGraphData';
import { DurationUnitEnum } from '../../../types';

describe('aggregatedToGraphData', () => {
  test('aggregatedToStackedGraph returns correct data', () => {
    const aggData = {
      groupByX: 'Activity',
      groupByY: 'Months',
      headers: ['Activity', 'February 2018', 'March 2018', 'April 2018'],
      rows: [
        {
          Activity: 'Digging Holes',
          'April 2018': {},
          'February 2018': {},
          'March 2018': { minutes: 2 },
        },
        {
          Activity: 'Outdoor and practical work',
          'April 2018': { hours: 2 },
          'February 2018': {},
          'March 2018': { hours: 2, minutes: 23 },
        },
      ]};

    const expected = aggregatedToStackedGraph(aggData, DurationUnitEnum.HOURS);
    expect(expected).toEqual({
      datasets: [
        { backgroundColor: '#F44336', data: [0, 0.03, 0], label: 'Digging Holes' },
        { backgroundColor: '#E91E63', data: [0, 2.38, 2], label: 'Outdoor and practical work' },
      ],
      labels: [['Feb', '2018'], ['Mar', '2018'], ['Apr', '2018']],
    });
  });
});
