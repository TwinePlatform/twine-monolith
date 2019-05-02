import { timeLogsToTable } from '../helper';
import { UnitEnum } from '../../../types';
import DateRange from '../../../util/dateRange';

describe('timeLogsToTable', () => {
  test('SUCCESS - standard 12 months', () => {
    const logs = [
      {
        id: 1,
        userId: 1,
        duration: { hours: 2 },
        startedAt: '2018-03-26T11:46:33.000Z',
        createdAt: '2018-03-26T10:47:05.000Z',
        activity: 'Outdoor and practical work',
      },
      {
        id: 1,
        userId: 1,
        duration: { hours: 2 },
        startedAt: '2018-04-26T11:46:33.000Z',
        createdAt: '2018-04-26T10:47:05.000Z',
        activity: 'Outdoor and practical work',
      },
      {
        id: 1,
        userId: 1,
        duration: { hours: 2 },
        startedAt: '2018-03-26T11:46:33.000Z',
        createdAt: '2018-03-26T10:47:05.000Z',
        activity: 'Outdoor and practical work',
      },
    ];
    const tData = timeLogsToTable({ data: logs, unit: UnitEnum.HOURS, months: DateRange.months });
    expect(tData).toEqual([{
      columns:
      { Activity: { content: 'Outdoor and practical work' },
        April: { content: 2 },
        August: { content: 0 },
        December: { content: 0 },
        February: { content: 0 },
        January: { content: 0 },
        July: { content: 0 },
        June: { content: 0 },
        March: { content: 4 },
        May: { content: 0 },
        November: { content: 0 },
        October: { content: 0 },
        September: { content: 0 },
        'Total hours': { content: 6 } } }]);
  });
});
