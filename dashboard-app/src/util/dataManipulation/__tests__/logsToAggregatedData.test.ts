import { logsToAggregatedData } from '../logsToAggregatedData';
import moment from 'moment';
import { DurationUnitEnum } from '../../../types';
import Months from '../../months';
// tslint:disable:max-line-length

describe('logsToAggregatedData', () => {
  test('SUCCESS - returns aggregated data without volunteer names', () => {
    const columnHeaders = ['Activity', 'February 18', 'March 18', 'April 18'];
    const logs = [
      {
        userId: 3,
        duration: { minutes: 2 },
        startedAt: '2018-03-26T11:46:33.000Z',
        createdAt: '2018-03-26T10:47:05.000Z',
        activity: 'Digging Holes',
      },
      {
        userId: 1,
        duration: { hours: 2 },
        startedAt: '2018-04-26T11:46:33.000Z',
        createdAt: '2018-04-26T10:47:05.000Z',
        activity: 'Outdoor and practical work',
      },
      {
        userId: 1,
        duration: { hours: 2, minutes: 23 },
        startedAt: '2018-03-26T11:46:33.000Z',
        createdAt: '2018-03-26T10:47:05.000Z',
        activity: 'Outdoor and practical work',
      },
    ];

    const expected = logsToAggregatedData({
      logs,
      columnHeaders,
      unit: DurationUnitEnum.HOURS,
      rowIdFromLogs: 'activity',
      getColumnIdFromLogs: (x: any) => moment(x.startedAt || x.createdAt).format(Months.format),
    });
    expect(expected).toEqual({
      headers: ['Activity', 'Total Hours', 'February 18', 'March 18', 'April 18'],
      rows: [
        {
          Activity: 'Digging Holes',
          'April 18': 0,
          'February 18': 0,
          'March 18': 0.03,
          'Total Hours': 0.03,
        },
        {
          Activity: 'Outdoor and practical work',
          'April 18': 2,
          'February 18': 0,
          'March 18': 2.38,
          'Total Hours': 4.38,
        },
      ]}
      );
  });
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
      headers: ['Volunteer Name', 'Total Hours', 'Outdoor and practical work'],
      rows: [
          { 'Outdoor and practical work': 0.03, 'Total Hours': 0.03, 'Volunteer Name': 'Aku Aku' },
          { 'Outdoor and practical work': 4.38, 'Total Hours': 4.38, 'Volunteer Name': 'Crash Bandicoot' },
      ]});
  });
});
