import { timeLogsToTable } from '../helper';
import { DurationUnitEnum } from '../../../types';

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
    const tData = timeLogsToTable({
      data: logs,
      unit: DurationUnitEnum.HOURS,
      fromDate: new Date('01-01-18'),
      toDate: new Date('01-01-19'),
    });
    (expect(tData) as any).toEqual({
      title: 'Volunteer Activity over Months',
      headers: [
        'Activity',
        'Total Hours',
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      rows : [{
        columns: {
          Activity: { content: 'Outdoor and practical work' },
          April: { content: '2.00' },
          August: { content: 0 },
          December: { content: 0 },
          February: { content: 0 },
          January: { content: 0 },
          July: { content: 0 },
          June: { content: 0 },
          March: { content: '4.00' },
          May: { content: 0 },
          November: { content: 0 },
          October: { content: 0 },
          September: { content: 0 },
          'Total Hours': { content: '6.00' },
        },
      }],
    });
  });
});
