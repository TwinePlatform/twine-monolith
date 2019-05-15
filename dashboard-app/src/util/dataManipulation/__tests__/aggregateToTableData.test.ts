import { aggregatedToTableData } from '../aggregatedToTableData';
import { DurationUnitEnum } from '../../../types';
// tslint:disable:max-line-length

describe('aggregatedToTableData', () => {
  describe(':: convert aggreagated data to table data format', () => {
    test('SUCCESS - returns aggregated data with volunteer names', () => {
      const data = {
        headers: ['Volunteer Name', 'Total Hours', 'Outdoor and practical work'],
        rows: [
          { 'Outdoor and practical work': 0.03, 'Total Hours': 0.03, 'Volunteer Name': 'Aku Aku' },
          { 'Outdoor and practical work': 2, 'Total Hours': 2, 'Volunteer Name': 'Crash Bandicoot' },
          { 'Outdoor and practical work': 2.38, 'Total Hours': 2.38, 'Volunteer Name': 'Crash Bandicoot' },
        ]};

      const expected = aggregatedToTableData({ title: 'Tasmanian Islands', data });
      expect(expected).toEqual({
        title: 'Tasmanian Islands',
        headers: ['Volunteer Name', 'Total Hours', 'Outdoor and practical work'],
        rows: [{
          columns: {
            'Outdoor and practical work': { content: 0.03 },
            'Total Hours': { content: 0.03 },
            'Volunteer Name': { content: 'Aku Aku' } },
        },
        { columns: {
          'Outdoor and practical work': { content: 2 },
          'Total Hours': { content: 2 },
          'Volunteer Name': { content: 'Crash Bandicoot' } },
        },
        { columns: {
          'Outdoor and practical work': { content: 2.38 },
          'Total Hours': { content: 2.38 },
          'Volunteer Name': { content: 'Crash Bandicoot' } },
        }],
      });
    });
  });
});
