import {
  isEveryDatumActive,
  isEveryDatumInactive,
  flipActiveOfAll,
  createLegendData,
  updateLegendData,
  sortByNameCaseInsensitive,
  sortAndZeroOutInactiveData,
  getYHeaderList
} from '../util';
import { AggregatedData, Row } from '../../../../dashboard/dataManipulation/logsToAggregatedData';

// tslint:disable:max-line-length
describe('Helpers', () => {
  describe(':: isEveryDatumActive', async () => {
    test('Success :: return true if all data is active', async () => {
      const activeData = [
        { active: true, name: 'Aku Aku', id: 7 },
        { active: true, name: 'Crash Bandicoot', id: 3 },
      ];
      const expected = isEveryDatumActive(activeData);
      expect(expected).toBe(true);
    });
    test('Success :: return false if one datum is inactive', async () => {
      const activeData = [
        { active: true, name: 'Aku Aku', id: 6 },
        { active: false, name: 'Crash Bandicoot', id: 3 },
      ];
      const expected = isEveryDatumActive(activeData);
      expect(expected).toBe(false);
    });
    test('Success :: return false if all data is inactive', async () => {
      const activeData = [
        { active: false, name: 'Aku Aku', id: 2 },
        { active: false, name: 'Crash Bandicoot', id: 5 },
      ];
      const expected = isEveryDatumActive(activeData);
      expect(expected).toBe(false);
    });
  });

  describe(':: isEveryDatumInactive', async () => {
    test('Success :: return true if all data is inactive', async () => {
      const activeData = [
        { active: false, name: 'Aku Aku', id: 3 },
        { active: false, name: 'Crash Bandicoot', id: 2 },
      ];
      const expected = isEveryDatumInactive(activeData);
      expect(expected).toBe(true);
    });
    test('Success :: return false if one datum is active', async () => {
      const activeData = [
        { active: true, name: 'Aku Aku', id: 2 },
        { active: false, name: 'Crash Bandicoot', id: 6 },
      ];
      const expected = isEveryDatumInactive(activeData);
      expect(expected).toBe(false);
    });
    test('Success :: return false if all data is active', async () => {
      const activeData = [
        { active: true, name: 'Aku Aku', id: 2 },
        { active: true, name: 'Crash Bandicoot', id: 6 },
      ];
      const expected = isEveryDatumInactive(activeData);
      expect(expected).toBe(false);
    });
  });

  describe(':: flipActiveOfAll', async () => {
    test('Success :: sets all to false if all are true', async () => {
      const activeData = [
        { active: true, name: 'Aku Aku', id: 2 },
        { active: true, name: 'Crash Bandicoot', id: 6 },
      ];
      const expected = flipActiveOfAll(activeData);
      expect(expected).toEqual([
        { active: false, name: 'Aku Aku', id: 2 },
        { active: false, name: 'Crash Bandicoot', id: 6 },
      ]);
    });
    test('Success :: sets all to false if one is false', async () => {
      const activeData = [
        { active: false, name: 'Aku Aku', id: 2 },
        { active: true, name: 'Crash Bandicoot', id: 6 },
      ];
      const expected = flipActiveOfAll(activeData);
      expect(expected).toEqual([
        { active: false, name: 'Aku Aku', id: 2 },
        { active: false, name: 'Crash Bandicoot', id: 6 },
      ]);
    });
    test('Success :: sets all to true if all are false', async () => {
      const activeData = [
        { active: false, name: 'Aku Aku', id: 2 },
        { active: false, name: 'Crash Bandicoot', id: 6 },
      ];
      const expected = flipActiveOfAll(activeData);
      expect(expected).toEqual([
        { active: true, name: 'Aku Aku', id: 2 },
        { active: true, name: 'Crash Bandicoot', id: 6 },
      ]);
    });
  });
  describe(':: createLegendData', async () => {
    test('Success :: creates a list of active data', async () => {
      const aggregatedData = {
        groupByX: 'Volunteer Name',
        groupByY: 'Activity',
        rows: [
            { 'Outdoor and practical work': { minutes: 2 }, name: 'Aku Aku', id: 2 },
            { 'Outdoor and practical work': { hours: 4, minutes: 23 }, name: 'Crash Bandicoot', id: 3 },
        ]} as AggregatedData;
      const expected = createLegendData(aggregatedData);
      expect(expected).toEqual([
        { active: true, name: 'Aku Aku', id: 2 },
        { active: true, name: 'Crash Bandicoot', id: 3 },
      ]);
    });
    test('Success :: Only creates items for users there is data for', async () => {
      const aggregatedData = {
        groupByX: 'Volunteer Name',
        groupByY: 'Activity',
        rows: [
            { 'Outdoor and practical work': { minutes: 2 }, name: 'Aku Aku', id: 2 },
            { 'Outdoor and practical work': { hours: 4, minutes: 23 }, name: 'Crash Bandicoot', id: 3 },
        ]} as AggregatedData;

      const expected = createLegendData(aggregatedData);
      expect(expected).toEqual([
        { active: true, name: 'Aku Aku', id: 2 },
        { active: true, name: 'Crash Bandicoot', id: 3 },
      ]);
    });
  });

  describe(':: updateLegendData', async () => {
    test('Success :: creates an updated list of active data', async () => {
      const aggregatedData = {
        groupByX: 'Volunteer Name',
        groupByY: 'Activity',
        rows: [
            { 'Outdoor and practical work': { minutes: 2 }, name: 'Aku Aku', id: 2 },
            { 'Outdoor and practical work': { hours: 4, minutes: 23 }, name: 'Crash Bandicoot', id: 3 },
        ]} as AggregatedData;

      const oldActiveData = [
        {
          active: true,
          name: 'Aku Aku',
          id: 2,
        },
        {
          active: false,
          name: 'Crash Bandicoot',
          id: 3,
        },
      ];
      const expected = updateLegendData(aggregatedData, oldActiveData);
      expect(expected).toEqual([
        { active: true, name: 'Aku Aku', id: 2 },
        { active: false, name: 'Crash Bandicoot', id: 3 },
      ]);
    });
  });

  describe(':: getYHeaderList', async () => {
    test('Success :: lists all Y headers', async () => {
      const row = {
        'Outdoor and practical work': { minutes: 2 },
        Dancing: { minutes: 2 },
        Singing: { minutes: 2 },
        name: 'Aku Aku',
        id: 2,
      } as Row;

      const expected = getYHeaderList(row);
      expect(expected).toEqual(['Outdoor and practical work', 'Dancing', 'Singing']);
    });
  });

  describe(':: sortByNameCaseInsensitive', async () => {
    test('Success :: reorders list of objects based on "name"', async () => {
      const activeData = [
        { active: false, name: 'Papu Papu', id: 35 },
        { active: false, name: 'nina cortex', id: 31 },
        { active: false, name: 'dingodile', id: 13 },
        { active: false, name: 'Ripper Roo', id: 3 },
        { active: true, name: 'Coco Bandicoot', id: 4 },
        { active: false, name: 'Aku Aku', id: 2 },
        { active: true, name: 'Crash Bandicoot', id: 9 },
      ];
      const expected = sortByNameCaseInsensitive(activeData);
      expect(expected).toEqual([
        { active: false, id: 2, name: 'Aku Aku' },
        { active: true, id: 4, name: 'Coco Bandicoot' },
        { active: true, id: 9, name: 'Crash Bandicoot' },
        { active: false, id: 13, name: 'dingodile' },
        { active: false, id: 31, name: 'nina cortex' },
        { active: false, id: 35, name: 'Papu Papu' },
        { active: false, id: 3, name: 'Ripper Roo' },
      ]);
    });
  });

  describe(':: sortAndZeroOutInactiveData', async () => {
    test('Success :: replaces all inactive data with 0', async () => {
      const aggregatedData = {
        groupByX: 'Volunteer Name',
        groupByY: '',
        rows: [
            { 'Outdoor and practical work': { minutes: 2 }, name: 'Aku Aku', id: 3 },
            { 'Outdoor and practical work': { hours: 4, minutes: 23 }, name: 'Crash Bandicoot', id: 4 },
        ]} as AggregatedData;

      const activeData = [
        { active: false, name: 'Aku Aku', id: 3 },
        { active: true, name: 'Crash Bandicoot', id: 4 },
      ];
      const expected = sortAndZeroOutInactiveData(aggregatedData, activeData);
      expect(expected).toEqual({
        groupByX: 'Volunteer Name',
        groupByY: '',
        rows: [
          { 'Outdoor and practical work': 0, name: 'Aku Aku', id: 3 },
          { 'Outdoor and practical work': { hours: 4, minutes: 23 }, name: 'Crash Bandicoot', id: 4 },
        ] }
      );
    });
  });
  describe(':: sortAndZeroOutInactiveData', async () => {
    test('Success :: replaces all inactive data with 0', async () => {
      const aggregatedData = {
        groupByX: 'Volunteer Name',
        groupByY: '',
        rows: [
            { 'Outdoor and practical work': { minutes: 2 }, name: 'Aku Aku', id: 3 },
            { 'Outdoor and practical work': { hours: 4, minutes: 23 }, name: 'Crash Bandicoot', id: 4 },
        ]} as AggregatedData;

      const activeData = [
        { active: false, name: 'Aku Aku', id: 3 },
        { active: true, name: 'Crash Bandicoot', id: 4 },
      ];
      const expected = sortAndZeroOutInactiveData(aggregatedData, activeData);
      expect(expected).toEqual({
        groupByX: 'Volunteer Name',
        groupByY: '',
        rows: [
          { 'Outdoor and practical work': 0, name: 'Aku Aku', id: 3 },
          { 'Outdoor and practical work': { hours: 4, minutes: 23 }, name: 'Crash Bandicoot', id: 4 },
        ] }
      );
    });
  });
});
