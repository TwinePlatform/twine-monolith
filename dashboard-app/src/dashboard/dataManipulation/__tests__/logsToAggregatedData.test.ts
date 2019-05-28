// tslint:disable:max-line-length
import { logsToAggregatedData } from '../logsToAggregatedData';
import { tableType } from '../tableType';

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
      tableType: tableType.MonthByActivity,
    });
    expect(expected).toEqual({
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
      { id: 1, name: 'Crash Bandicoot' },
      { id: 3, name: 'Aku Aku' },
    ];

    const expected = logsToAggregatedData({
      logs,
      columnHeaders,
      tableType: tableType.ActivityByName,
      volunteers,
    });
    expect(expected).toEqual({
      headers: ['Volunteer Name', 'Outdoor and practical work'],
      rows: [
          { 'Outdoor and practical work': { minutes: 2 }, 'Volunteer Name': 'Aku Aku' },
          { 'Outdoor and practical work': { hours: 4, minutes: 23 }, 'Volunteer Name': 'Crash Bandicoot' },
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
    const volunteers = [{ id: 1, name: 'Crash Bandicoot' }];

    const expected = logsToAggregatedData({
      logs,
      columnHeaders,
      tableType: tableType.ActivityByName,
      volunteers,
    });
    expect(expected).toEqual({
      headers: ['Volunteer Name', 'Outdoor and practical work'],
      rows: [
          { 'Outdoor and practical work': { hours: 1, minutes: 9 }, 'Volunteer Name': 'Crash Bandicoot' },
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
    const volunteers = [{ id: 1, name: 'Crash Bandicoot' }];

    const expected = logsToAggregatedData({
      logs,
      columnHeaders,
      tableType: tableType.ActivityByName,
      volunteers,
    });
    expect(expected).toEqual({
      headers: ['Volunteer Name', 'Outdoor and practical work'],
      rows: [
        { 'Outdoor and practical work': { minutes: 45 }, 'Volunteer Name': 'Deleted User' },
        { 'Outdoor and practical work': { minutes: 23 }, 'Volunteer Name': 'Deleted User' },
        { 'Outdoor and practical work': { minutes: 17 }, 'Volunteer Name': 'Crash Bandicoot' },
      ] });
  });
});
