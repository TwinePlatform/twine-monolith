// tslint:disable:max-line-length
import { logsToAggregatedData } from '../logsToAggregatedData';
import { tableType } from '../tableType';

describe('logsToAggregatedData', () => {
  test('SUCCESS - returns aggregated data without volunteer names', () => {
    const months = [
      { id: 182, name: 'February 2018' },
      { id: 183, name: 'March 2018' },
      { id: 184, name: 'April 2018' },
    ];

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

    const activities = [
      { id: 1, name: 'Digging Holes' },
      { id: 2, name: 'Outdoor and practical work' },
    ];

    const expected = logsToAggregatedData({
      logs,
      tableType: tableType.MonthByActivity,
      xData: activities,
      yData: months,
    });

    expect(expected).toEqual({
      groupByX: 'Activity',
      groupByY: 'Month',
      rows: [
        {
          id: 1,
          name: 'Digging Holes',
          'April 2018': {},
          'February 2018': {},
          'March 2018': { minutes: 2 },
        },
        {
          id: 2,
          name: 'Outdoor and practical work',
          'April 2018': { hours: 2 },
          'February 2018': {},
          'March 2018': { hours: 2, minutes: 23 },
        },
      ]}
      );
  });
  test('SUCCESS - returns aggregated data with volunteer names', () => {
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
    const activities = [
      { id: 1, name: 'Digging Holes' },
      { id: 2, name: 'Outdoor and practical work' },
    ];

    const expected = logsToAggregatedData({
      logs,
      tableType: tableType.ActivityByName,
      xData: volunteers,
      yData: activities,
    });
    expect(expected).toEqual({
      groupByX: 'Volunteer Name',
      groupByY: 'Activity',
      rows: [
        {
          'Digging Holes': {},
          'Outdoor and practical work': { minutes: 2 },
          id: 3,
          name: 'Aku Aku',
        },
        {
          'Digging Holes': {},
          'Outdoor and practical work': { hours: 4, minutes: 23 },
          id: 1,
          name: 'Crash Bandicoot' ,
        },
      ]});
  });
  test('SUCCESS - days aggregates data with correct precision', () => {
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
    const activities = [
      { id: 11, name: 'Digging Holes' },
      { id: 12, name: 'Outdoor and practical work' },
    ];

    const expected = logsToAggregatedData({
      logs,
      tableType: tableType.ActivityByName,
      xData: volunteers,
      yData: activities,
    });
    expect(expected).toEqual({
      groupByX: 'Volunteer Name',
      groupByY: 'Activity',
      rows: [
        {
          'Digging Holes': {},
          'Outdoor and practical work': { hours: 1, minutes: 9 },
          name: 'Crash Bandicoot',
          id: 1,
        },
      ]});
  });
  test('SUCCESS - deleted user have own row, name replaced with deleted', () => {
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
    const activities = [
      { id: 1, name: 'Digging Holes' },
      { id: 2, name: 'Outdoor and practical work' },
    ];

    const expected = logsToAggregatedData({
      logs,
      tableType: tableType.ActivityByName,
      xData: volunteers,
      yData: activities,
    });
    expect(expected).toEqual({
      groupByX: 'Volunteer Name',
      groupByY: 'Activity',
      rows: [
        {
          'Digging Holes': {},
          'Outdoor and practical work': { minutes: 45 },
          id: 3,
          name: 'Deleted User',
        },
        {
          'Digging Holes': {},
          'Outdoor and practical work': { minutes: 23 },
          name: 'Deleted User',
          id: 2,
        },
        {
          'Digging Holes': {},
          'Outdoor and practical work': { minutes: 17 },
          name: 'Crash Bandicoot',
          id: 1,
        },
      ] });
  });
});
