import { logsToVolunteerTable } from '../helper';
import { DurationUnitEnum } from '../../../types';

describe('logsToVolunteerTable', () => {
  test('SUCCESS - standard 12 months', () => {
    const logs = [
      {
        id: 1,
        userId: 3,
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
    const volunteers = [
      {
        id: 1,
        name: 'Crash Bandicoot',
      },
      {
        id: 3,
        name: 'Aku Aku',
      },
    ];
    const tData = logsToVolunteerTable({
      data: { logs, volunteers },
      unit: DurationUnitEnum.HOURS,
      fromDate: new Date('02-01-18'),
      toDate: new Date('05-31-18'),
      setErrors: () => {},
    });
    expect(tData).toEqual({
      title: 'Data By Volunteer',
      headers: [
        'Volunteer Name',
        'Total Hours',
        'February 18',
        'March 18',
        'April 18',
        'May 18'],
      rows: [
        { columns: {
          'April 18': { content: 0 },
          'February 18': { content: 0 },
          'March 18': { content: 0.03 },
          'May 18': { content: 0 },
          'Total Hours': { content: 0.03 },
          'Volunteer Name': { content: 'Aku Aku' },
        } },
        { columns: {
          'April 18': { content: 2 },
          'February 18': { content: 0 },
          'March 18': { content: 2.38 },
          'May 18': { content: 0 },
          'Total Hours': { content: 4.38 },
          'Volunteer Name': { content: 'Crash Bandicoot' },
        } },
      ],
    });
  });
});
