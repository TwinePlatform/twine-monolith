import { createLegendData, updateLegendData, zeroOutInactiveData, getYHeaderList } from '../index';
import { AggregatedData, Row } from '../../../dashboard/dataManipulation/logsToAggregatedData';

// tslint:disable:max-line-length
describe('Helpers', () => {
  describe(':: createLegendData', async () => {
    test('Success :: creates a list of active data', async () => {
      const aggregatedData = {
        groupByX: 'Volunteer Name',
        groupByY: 'Activity',
        rows: [
            { 'Outdoor and practical work': { minutes: 2 }, name: 'Aku Aku', id: 2 },
            { 'Outdoor and practical work': { hours: 4, minutes: 23 }, name: 'Crash Bandicoot', id: 3 },
        ]} as AggregatedData;
      const vols = [
        {
          name: 'Aku Aku',
          id: 2,
        },
        {
          name: 'Crash Bandicoot',
          id: 3,
        },
      ];
      const expected = createLegendData(aggregatedData, vols);
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
      const vols = [
        {
          name: 'Aku Aku',
          id: 2,
        },
        {
          name: 'Crash Bandicoot',
          id: 3,
        },
        {
          name: 'Dr Neo Cortex',
          id: 7,
        },
      ];
      const expected = createLegendData(aggregatedData, vols);
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
      const vols = [
        {
          name: 'Aku Aku',
          id: 2,
        },
        {
          name: 'Crash Bandicoot',
          id: 3,
        },
      ];
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
      const expected = updateLegendData(aggregatedData, vols, oldActiveData);
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

  describe(':: zeroOutInactiveData', async () => {
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
      const expected = zeroOutInactiveData(aggregatedData, activeData);
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
