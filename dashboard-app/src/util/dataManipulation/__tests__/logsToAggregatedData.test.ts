import { logsToAggregatedData } from '../logsToAggregatedData';
import { DurationUnitEnum } from '../../../types';
import { tableType } from '../tableType';
// tslint:disable:max-line-length

describe('logsToAggregatedData', () => {
  test('SUCCESS - returns aggregated data without volunteer names', () => {
    const columnHeaders = ['Activity', 'February 2018', 'March 2018', 'April 2018'];
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
      tableType: tableType.MonthByActivity,
    });
    expect(expected).toEqual({
      headers: ['Activity', 'Total Hours', 'February 2018', 'March 2018', 'April 2018'],
      rows: [
        {
          Activity: 'Digging Holes',
          'April 2018': 0,
          'February 2018': 0,
          'March 2018': 0.03,
          'Total Hours': 0.03,
        },
        {
          Activity: 'Outdoor and practical work',
          'April 2018': 2,
          'February 2018': 0,
          'March 2018': 2.38,
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
      tableType: tableType.ActivityByName,
      volunteers,
    });
    expect(expected).toEqual({
      headers: ['Volunteer Name', 'Total Hours', 'Outdoor and practical work'],
      rows: [
          { 'Outdoor and practical work': 0.03, 'Total Hours': 0.03, 'Volunteer Name': 'Aku Aku' },
          { 'Outdoor and practical work': 4.38, 'Total Hours': 4.38, 'Volunteer Name': 'Crash Bandicoot' },
      ]});
  });
  test('SUCCESS - days aggregates data with correct precision', () => {
    const columnHeaders = ['Volunteer Name', 'Outdoor and practical work'];
    const logs = [
      {
        id: 1,
        userId: 1,
        duration: { minutes: 23 },
        startedAt: '2018-04-26T11:46:33.000Z',
        createdAt: '2018-04-26T10:47:05.000Z',
        activity: 'Outdoor and practical work',
      },
      {
        id: 2,
        userId: 1,
        duration: { minutes: 23 },
        startedAt: '2018-04-26T11:46:33.000Z',
        createdAt: '2018-04-26T10:47:05.000Z',
        activity: 'Outdoor and practical work',
      },
      {
        id: 3,
        userId: 1,
        duration: { minutes: 23 },
        startedAt: '2018-04-26T11:46:33.000Z',
        createdAt: '2018-04-26T10:47:05.000Z',
        activity: 'Outdoor and practical work',
      },
    ];
    const volunteers = [
      {
        id: 1,
        name: 'Crash Bandicoot',
      },
    ];

    const expected = logsToAggregatedData({
      logs,
      columnHeaders,
      unit: DurationUnitEnum.DAYS,
      tableType: tableType.ActivityByName,
      volunteers,
    });
    expect(expected).toEqual({
      headers: ['Volunteer Name', 'Total Days', 'Outdoor and practical work'],
      rows: [
          { 'Outdoor and practical work': 0.14, 'Total Days': 0.14, 'Volunteer Name': 'Crash Bandicoot' },
      ]});
  });
  test('SUCCESS - deleted user have own row, name replaced with deleted', () => {
    const columnHeaders = ['Volunteer Name', 'Outdoor and practical work'];
    const logs = [
      {
        id: 1,
        userId: 3,
        duration: { minutes: 45 },
        startedAt: '2018-04-26T11:46:33.000Z',
        createdAt: '2018-04-26T10:47:05.000Z',
        activity: 'Outdoor and practical work',
      },
      {
        id: 2,
        userId: 2,
        duration: { minutes: 23 },
        startedAt: '2018-04-26T11:46:33.000Z',
        createdAt: '2018-04-26T10:47:05.000Z',
        activity: 'Outdoor and practical work',
      },
      {
        id: 3,
        userId: 1,
        duration: { minutes: 17 },
        startedAt: '2018-04-26T11:46:33.000Z',
        createdAt: '2018-04-26T10:47:05.000Z',
        activity: 'Outdoor and practical work',
      },
    ];
    const volunteers = [
      {
        id: 1,
        name: 'Crash Bandicoot',
      },
    ];

    const expected = logsToAggregatedData({
      logs,
      columnHeaders,
      unit: DurationUnitEnum.DAYS,
      tableType: tableType.ActivityByName,
      volunteers,
    });
    expect(expected).toEqual({
      headers: ['Volunteer Name', 'Total Days', 'Outdoor and practical work'],
      rows: [
        { 'Outdoor and practical work': 0.09, 'Total Days': 0.09, 'Volunteer Name': 'Deleted' },
        { 'Outdoor and practical work': 0.05, 'Total Days': 0.05, 'Volunteer Name': 'Deleted' },
        { 'Outdoor and practical work': 0.04, 'Total Days': 0.04, 'Volunteer Name': 'Crash Bandicoot' },
      ] });
  });
});
