import { logsToTimeTable } from '../helper';
import { DurationUnitEnum } from '../../../types';


describe('logsToTimeTable', () => {
  test('SUCCESS - standard 12 months', () => {
    const logs = [
      {
        id: 1,
        userId: 1,
        duration: { minutes: 2 },
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
        duration: { hours: 2, minutes: 23 },
        startedAt: '2018-03-26T11:46:33.000Z',
        createdAt: '2018-03-26T10:47:05.000Z',
        activity: 'Outdoor and practical work',
      },
    ];
    const tData = logsToTimeTable({
      data: logs,
      unit: DurationUnitEnum.HOURS,
      fromDate: new Date('01-01-18'),
      toDate: new Date('12-31-18'),
      setErrors: () => {},
    });
    expect(tData).toEqual({
      title: 'Volunteer Activity over Months',
      headers: [
        'Activity',
        'Total Hours',
        'January 18',
        'February 18',
        'March 18',
        'April 18',
        'May 18',
        'June 18',
        'July 18',
        'August 18',
        'September 18',
        'October 18',
        'November 18',
        'December 18',
      ],
      rows : [{
        columns: {
          Activity: { content: 'Outdoor and practical work' },
          'January 18': { content: 0 },
          'February 18': { content: 0 },
          'March 18': { content: 2.41 },
          'April 18': { content: 2 },
          'May 18': { content: 0 },
          'June 18': { content: 0 },
          'July 18': { content: 0 },
          'August 18': { content: 0 },
          'September 18': { content: 0 },
          'October 18': { content: 0 },
          'November 18': { content: 0 },
          'December 18': { content: 0 },
          'Total Hours': { content: 4.41 },
        },
      }],
    });
  });
});
