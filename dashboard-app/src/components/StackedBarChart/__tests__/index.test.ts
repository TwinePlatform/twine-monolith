import { createActiveData, zeroOutInactiveData, getYHeaderList } from '../index';
import { Row } from '../../../dashboard/dataManipulation/logsToAggregatedData';

// tslint:disable:max-line-length
describe('Helpers', () => {
  describe(':: createActiveData', async () => {
    test('Success :: creates a list of active data', async () => {
      const aggregatedData = {
        groupByX: 'Volunteer Name',
        groupByY: '',
        headers: ['Volunteer Name', 'Outdoor and practical work'],
        rows: [
            { 'Outdoor and practical work': { minutes: 2 }, 'Volunteer Name': 'Aku Aku' },
            { 'Outdoor and practical work': { hours: 4, minutes: 23 }, 'Volunteer Name': 'Crash Bandicoot' },
        ]};
      const expected = createActiveData(aggregatedData);
      expect(expected).toEqual([
        { active: true, key: 'Aku Aku' },
        { active: true, key: 'Crash Bandicoot' },
      ]);
    });
  });

  describe(':: getYHeaderList', async () => {
    test('Success :: lists all Y headers', async () => {
      const row = {
        'Outdoor and practical work': { minutes: 2 },
        Dancing: { minutes: 2 },
        Singing: { minutes: 2 },
        'Volunteer Name': 'Aku Aku',
      };

      const expected = getYHeaderList(row, 'Volunteer Name');
      expect(expected).toEqual(['Outdoor and practical work', 'Dancing', 'Singing']);
    });
  });

  describe(':: zeroOutInactiveData', async () => {
    test('Success :: replaces all inactive data with 0', async () => {
      const aggregatedData = {
        groupByX: 'Volunteer Name',
        groupByY: '',
        headers: ['Volunteer Name', 'Outdoor and practical work'],
        rows: [
            { 'Outdoor and practical work': { minutes: 2 }, 'Volunteer Name': 'Aku Aku' },
            { 'Outdoor and practical work': { hours: 4, minutes: 23 }, 'Volunteer Name': 'Crash Bandicoot' },
        ]};

      const activeData = [
        { active: false, key: 'Aku Aku' },
        { active: true, key: 'Crash Bandicoot' },
      ];
      const expected = zeroOutInactiveData(aggregatedData, activeData);
      expect(expected).toEqual({
        groupByX: 'Volunteer Name',
        groupByY: '',
        headers: ['Volunteer Name', 'Outdoor and practical work'],
        rows: [
          { 'Outdoor and practical work': 0, 'Volunteer Name': 'Aku Aku' },
          { 'Outdoor and practical work': { hours: 4, minutes: 23 }, 'Volunteer Name': 'Crash Bandicoot' },
        ] }
      );
    });
  });

});
