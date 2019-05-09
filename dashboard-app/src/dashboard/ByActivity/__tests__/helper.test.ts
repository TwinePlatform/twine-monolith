import { logsToActivityTable } from '../helper';
import { DurationUnitEnum } from '../../../types';

describe('logsToActivityTable', () => {
  test('SUCCESS - standard 12 months', () => {
    const activities = ['Outdoor and practical work'];
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
    const tData = logsToActivityTable({
      data: { logs, volunteers },
      unit: DurationUnitEnum.HOURS,
      activities,
      setErrors: () => {},
    });
    expect(tData).toEqual({
      title: 'Volunteer Data By Activity',
      headers: [
        'Volunteer Name',
        'Total Hours',
        'Outdoor and practical work',
      ],
      rows: [
        {
          columns: {
            'Outdoor and practical work': { content: 0.03 },
            'Total Hours': { content: 0.03 },
            'Volunteer Name': { content: 'Aku Aku' },
          },
        },
        {
          columns: {
            'Outdoor and practical work': { content: 4.38 },
            'Total Hours': { content: 4.38 },
            'Volunteer Name': { content: 'Crash Bandicoot' },
          },
        },
      ],
    });
  });
});
