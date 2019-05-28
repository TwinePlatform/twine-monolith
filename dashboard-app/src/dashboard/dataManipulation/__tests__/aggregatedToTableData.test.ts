import { Duration } from 'twine-util';
import { aggregatedToTableData } from '../aggregatedToTableData';
import { DurationUnitEnum } from '../../../types';


describe('aggregatedToTableData', () => {
  describe(':: convert aggreagated data to table data format', () => {
    test('SUCCESS - returns aggregated data with months headers', () => {
      const data = {
        headers: ['Activity', 'February 2018', 'March 2018', 'April 2018'],
        rows: [
          {
            Activity: 'Digging Holes',
            'April 2018': Duration.fromSeconds(0),
            'February 2018': Duration.fromSeconds(0),
            'March 2018': Duration.fromSeconds(120),
          },
          {
            Activity: 'Outdoor and practical work',
            'April 2018': Duration.fromSeconds(0),
            'February 2018': Duration.fromSeconds(0),
            'March 2018': Duration.fromSeconds(213),
          },
        ],
      };

      const expected = aggregatedToTableData({ data, unit: DurationUnitEnum.HOURS });

      expect(expected).toEqual({
        headers: ['Activity', 'Total Hours', 'Feb 18', 'Mar 18', 'Apr 18'],
        rows: [{
          columns: {
            Activity: { content: 'Digging Holes' },
            'Apr 18': { content: 0 },
            'Feb 18': { content: 0 },
            'Mar 18': { content: 0.03 },
            'Total Hours': { content: 0.03 } },
        },
        { columns: {
          Activity: { content: 'Outdoor and practical work' },
          'Apr 18': { content: 0 },
          'Feb 18': { content: 0 },
          'Mar 18': { content: 0.06 },
          'Total Hours': { content: 0.06 } },
        }],
      });
    });

    test('SUCCESS - returns aggregated data with volunteer names', () => {
      const data = {
        headers: ['Volunteer Name', 'Outdoor and practical work'],
        rows: [
          {
            'Outdoor and practical work': Duration.fromSeconds(312),
            'Volunteer Name': 'Aku Aku',
          },
          {
            'Outdoor and practical work': Duration.fromSeconds(102),
            'Volunteer Name': 'Crash Bandicoot',
          },
          {
            'Outdoor and practical work': Duration.fromSeconds(1110),
            'Volunteer Name': 'Crash Bandicoot',
          },
        ]};

      const expected = aggregatedToTableData({ data, unit: DurationUnitEnum.HOURS });

      expect(expected).toEqual({
        headers: ['Volunteer Name', 'Total Hours', 'Outdoor and practical work'],
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
        },
        { columns: {
          'Outdoor and practical work': { content: 0.31 },
          'Total Hours': { content: 0.31 },
          'Volunteer Name': { content: 'Crash Bandicoot' } },
        }],
      });
    });

    test('SUCCESS - changes aggregation & "Total" column based on unit input', () => {
      const data = {
        headers: ['Volunteer Name', 'Outdoor and practical work'],
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
        ]};

      const expected = aggregatedToTableData({ data, unit: DurationUnitEnum.DAYS });

      expect(expected).toEqual({
        headers: ['Volunteer Name', 'Total Days', 'Outdoor and practical work'],
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
