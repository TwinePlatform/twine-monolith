import { Duration } from 'twine-util';
import { aggregatedToTableData } from '../aggregatedToTableData';
import { DurationUnitEnum } from '../../../types';
import { AggregatedData } from '../logsToAggregatedData';


describe('aggregatedToTableData', () => {
  describe(':: convert aggreagated data to table data format', () => {
    test('SUCCESS - returns aggregated data with months headers', () => {
      const data = {
        groupByX: 'Activity',
        groupByY: 'Month',
        rows: [
          {
            id: 2,
            name: 'Digging Holes',
            'April 2018': Duration.fromSeconds(0),
            'February 2018': Duration.fromSeconds(0),
            'March 2018': Duration.fromSeconds(120),
          },
          {
            id: 8,
            name: 'Outdoor and practical work',
            'April 2018': Duration.fromSeconds(0),
            'February 2018': Duration.fromSeconds(0),
            'March 2018': Duration.fromSeconds(213),
          },
        ],
      } as AggregatedData;

      const months = [
        { id: 20182, name: 'February 2018' },
        { id: 20183, name: 'March 2018' },
        { id: 20184, name: 'April 2018' },
      ];

      const expected = aggregatedToTableData({ data, unit: DurationUnitEnum.HOURS, yData: months });
      expect(expected).toEqual({
        groupByX: 'Activity',
        groupByY: 'Month',
        headers: ['Activity', 'Total Hours', 'Feb 2018', 'Mar 2018', 'Apr 2018'],
        rows: [{
          columns: {
            Activity: { content: 'Digging Holes' },
            'Apr 2018': { content: 0 },
            'Feb 2018': { content: 0 },
            'Mar 2018': { content: 0.03 },
            'Total Hours': { content: 0.03 } },
        },
        { columns: {
          Activity: { content: 'Outdoor and practical work' },
          'Apr 2018': { content: 0 },
          'Feb 2018': { content: 0 },
          'Mar 2018': { content: 0.06 },
          'Total Hours': { content: 0.06 } },
        }],
      });
    });

    test('SUCCESS - returns aggregated data with volunteer names', () => {
      const data = {
        groupByX: 'Volunteer Name',
        groupByY: 'Activity',
        rows: [
          {
            'Outdoor and practical work': Duration.fromSeconds(312),
            name: 'Aku Aku',
            id: 2,
          },
          {
            'Outdoor and practical work': Duration.fromSeconds(102),
            name: 'Crash Bandicoot',
            id: 3,
          },
        ]} as AggregatedData;

      const activities = [
          { id: 1, name: 'Digging Holes' },
          { id: 2, name: 'Outdoor and practical work' },
      ];

      const expected = aggregatedToTableData({
        data,
        unit: DurationUnitEnum.HOURS,
        yData: activities,
      });

      expect(expected).toEqual({
        groupByX: 'Volunteer Name',
        groupByY: 'Activity',
        headers: ['Volunteer Name', 'Total Hours', 'Digging Holes', 'Outdoor and practical work'],
        rows: [{
          columns: {
            'Outdoor and practical work': { content: 0.09 },
            'Total Hours': { content: 0.09 },
            'Volunteer Name': { content: 'Aku Aku' } },
        },
        { columns: {
          'Outdoor and practical work': { content: 0.03 },
          'Total Hours': { content: 0.03 },
          'Volunteer Name': { content: 'Crash Bandicoot' } },
        }],
      });
    });

    test('SUCCESS - changes aggregation & "Total" column based on unit input', () => {
      const data = {
        groupByX: 'Volunteer Name',
        groupByY: 'Activity',
        rows: [
          {
            'Outdoor and practical work': Duration.fromSeconds(31200),
            'Volunteer Name': 'Aku Aku',
          },
          {
            'Outdoor and practical work': Duration.fromSeconds(10200),
            'Volunteer Name': 'Crash Bandicoot',
          },
          {
            'Outdoor and practical work': Duration.fromSeconds(111000),
            'Volunteer Name': 'Crash Bandicoot',
          },
        ]} as AggregatedData;

      const activities = [
          { id: 1, name: 'Digging Holes' },
          { id: 2, name: 'Outdoor and practical work' },
      ];

      const expected = aggregatedToTableData({
        data,
        unit: DurationUnitEnum.DAYS,
        yData: activities,
      });

      expect(expected).toEqual({
        groupByX: 'Volunteer Name',
        groupByY: 'Activity',
        headers: ['Volunteer Name', 'Total Days', 'Digging Holes', 'Outdoor and practical work'],
        rows: [{
          columns: {
            'Outdoor and practical work': { content: 1.08 },
            'Total Days': { content: 1.08 },
            'Volunteer Name': { content: 'Aku Aku' } },
        },
        { columns: {
          'Outdoor and practical work': { content: 0.35 },
          'Total Days': { content: 0.35 },
          'Volunteer Name': { content: 'Crash Bandicoot' } },
        },
        { columns: {
          'Outdoor and practical work': { content: 3.85 },
          'Total Days': { content: 3.85 },
          'Volunteer Name': { content: 'Crash Bandicoot' } },
        }],
      });
    });
  });
});
