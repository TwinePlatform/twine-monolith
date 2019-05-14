import { logsToAggregatedData } from '../logsToAggregatedData';
import { DurationUnitEnum } from '../../../types';
// tslint:disable:max-line-length

describe('logsToAggregatedData', () => {
  describe(':: range', () => {
    test('SUCCESS - returns aggregated data with volunteer names', () => {
      const columnHeaders = ['Volunteer Name', 'Outdoor and practical work'];
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

      const expected = logsToAggregatedData({
        logs,
        columnHeaders,
        unit: DurationUnitEnum.HOURS,
        rowIdFromLogs: 'userId',
        getColumnIdFromLogs: (x) => x.activity,
        volunteers,
      });
      expect(expected).toEqual({
        columnHeaders: ['Volunteer Name', 'Total Hours', 'Outdoor and practical work'],
        rows: [
          { 'Outdoor and practical work': 0.03, 'Total Hours': 0.03, 'Volunteer Name': 'Aku Aku' },
          { 'Outdoor and practical work': 2, 'Total Hours': 2, 'Volunteer Name': 'Crash Bandicoot' },
          { 'Outdoor and practical work': 2.38, 'Total Hours': 2.38, 'Volunteer Name': 'Crash Bandicoot' },
        ]});
    });
  });
});
