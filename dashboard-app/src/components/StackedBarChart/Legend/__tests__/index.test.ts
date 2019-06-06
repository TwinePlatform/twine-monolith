import { isEveryDatumActive, isEveryDatumInactive, flipActiveOfAll } from '../index';

// tslint:disable:max-line-length
describe('Helpers', () => {
  describe(':: isEveryDatumActive', async () => {
    test('Success :: return true if all data is active', async () => {
      const activeData = [
        { active: true, key: 'Aku Aku' },
        { active: true, key: 'Crash Bandicoot' },
      ];
      const expected = isEveryDatumActive(activeData);
      expect(expected).toBe(true);
    });
    test('Success :: return false if one datum is inactive', async () => {
      const activeData = [
        { active: true, key: 'Aku Aku' },
        { active: false, key: 'Crash Bandicoot' },
      ];
      const expected = isEveryDatumActive(activeData);
      expect(expected).toBe(false);
    });
    test('Success :: return false if all data is inactive', async () => {
      const activeData = [
        { active: false, key: 'Aku Aku' },
        { active: false, key: 'Crash Bandicoot' },
      ];
      const expected = isEveryDatumActive(activeData);
      expect(expected).toBe(false);
    });
  });

  describe(':: isEveryDatumInactive', async () => {
    test('Success :: return true if all data is inactive', async () => {
      const activeData = [
        { active: false, key: 'Aku Aku' },
        { active: false, key: 'Crash Bandicoot' },
      ];
      const expected = isEveryDatumInactive(activeData);
      expect(expected).toBe(true);
    });
    test('Success :: return false if one datum is active', async () => {
      const activeData = [
        { active: true, key: 'Aku Aku' },
        { active: false, key: 'Crash Bandicoot' },
      ];
      const expected = isEveryDatumInactive(activeData);
      expect(expected).toBe(false);
    });
    test('Success :: return false if all data is active', async () => {
      const activeData = [
        { active: true, key: 'Aku Aku' },
        { active: true, key: 'Crash Bandicoot' },
      ];
      const expected = isEveryDatumInactive(activeData);
      expect(expected).toBe(false);
    });
  });

  describe(':: flipActiveOfAll', async () => {
    test('Success :: sets all to false if all are true', async () => {
      const activeData = [
        { active: true, key: 'Aku Aku' },
        { active: true, key: 'Crash Bandicoot' },
      ];
      const expected = flipActiveOfAll(activeData);
      expect(expected).toEqual([
        { active: false, key: 'Aku Aku' },
        { active: false, key: 'Crash Bandicoot' },
      ]);
    });
    test('Success :: sets all to false if one is false', async () => {
      const activeData = [
        { active: false, key: 'Aku Aku' },
        { active: true, key: 'Crash Bandicoot' },
      ];
      const expected = flipActiveOfAll(activeData);
      expect(expected).toEqual([
        { active: false, key: 'Aku Aku' },
        { active: false, key: 'Crash Bandicoot' },
      ]);
    });
    test('Success :: sets all to true if all are false', async () => {
      const activeData = [
        { active: false, key: 'Aku Aku' },
        { active: false, key: 'Crash Bandicoot' },
      ];
      const expected = flipActiveOfAll(activeData);
      expect(expected).toEqual([
        { active: true, key: 'Aku Aku' },
        { active: true, key: 'Crash Bandicoot' },
      ]);
    });
  });

});
