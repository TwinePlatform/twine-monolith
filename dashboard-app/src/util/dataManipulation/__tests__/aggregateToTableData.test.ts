import {
  aggregatedToTableData,
  isDateString,
  abbreviateDateString } from '../aggregatedToTableData';
// tslint:disable:max-line-length

describe('aggregatedToTableData', () => {
  describe(':: convert aggreagated data to table data format', () => {
    test('SUCCESS - returns aggregated data with months headers', () => {
      const data = {
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
            'April 2018': 0,
            'February 2018': 0,
            'March 2018': 2.38,
            'Total Hours': 4.38,
          },
        ]};

      const expected = aggregatedToTableData({ title: 'Tasmanian Islands', data });
      expect(expected).toEqual({
        title: 'Tasmanian Islands',
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
          'Mar 18': { content: 2.38 },
          'Total Hours': { content: 4.38 } },
        }],
      });
    });

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

  describe(':: isDateString helper', () => {
    test('SUCCESS - returns true if given date string', () => {
      const expected = isDateString('January 2019');
      expect(expected).toBe(true);
    });
    test('SUCCESS - returns false if given non-date string', () => {
      const expected = isDateString('Jelly 2019');
      expect(expected).toBe(false);
    });
    test('SUCCESS - returns false if given non-date string', () => {
      const expected = isDateString('January');
      expect(expected).toBe(false);
    });
  });

  describe(':: abbreviateDateString helper', () => {
    test('SUCCESS - returns abbreviated month in date string', () => {
      const expected = abbreviateDateString('January 2019');
      expect(expected).toBe('Jan 19');
    });
  });
});
