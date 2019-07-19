import { aggregatedToCsv } from '../aggregatedToCsv';
import { DurationUnitEnum } from '../../../../types';
import { Duration } from 'twine-util';
import { AggregatedData } from '../logsToAggregatedData';

describe('aggregatedToCsv', () => {
  test('SUCCESS - returns string in csv format', async () => {
    const unit = DurationUnitEnum.HOURS;
    const data = {
      groupByX: 'Activity',
      groupByY: 'Months',
      rows: [
        {
          id: 5,
          name: 'Digging Holes',
          'February 2018': Duration.fromSeconds(0),
          'March 2018': Duration.fromSeconds(120),
          'April 2018': Duration.fromSeconds(0),
        },
        {
          id: 7,
          name: 'Outdoor and practical work',
          'February 2018': Duration.fromSeconds(0),
          'March 2018': Duration.fromSeconds(213),
          'April 2018': Duration.fromSeconds(11112),
        },
      ],
    } as AggregatedData;

    const expected = await aggregatedToCsv(data, unit, { order: 'asc', sortByIndex: 0 });
    expect(expected).toEqual(`Activity,Total Hours,February 2018,March 2018,April 2018
Digging Holes,0.03,0,0.03,0
Outdoor and practical work,3.15,0,0.06,3.09`);
  });

  test('SUCCESS - returns string in csv format in correct units', async () => {
    const unit = DurationUnitEnum.DAYS;
    const data = {
      groupByX: 'Activity',
      groupByY: 'Months',
      rows: [
        {
          id: 3,
          name: 'Digging Holes',
          'February 2018': Duration.fromSeconds(0),
          'March 2018': Duration.fromSeconds(12000),
          'April 2018': Duration.fromSeconds(0),
        },
        {
          id: 4,
          name: 'Outdoor and practical work',
          'February 2018': Duration.fromSeconds(0),
          'March 2018': Duration.fromSeconds(2130),
          'April 2018': Duration.fromSeconds(11112),
        },
      ],
    } as AggregatedData;

    const expected = await aggregatedToCsv(data, unit, { order: 'asc', sortByIndex: 0 });
    expect(expected).toEqual(`Activity,Total Days,February 2018,March 2018,April 2018
Digging Holes,0.42,0,0.42,0
Outdoor and practical work,0.46,0,0.07,0.39`);
  });
});
