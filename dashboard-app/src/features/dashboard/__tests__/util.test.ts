import { getColourByIndex } from '../util';
import { GraphColourList } from '../../../lib/ui/design_system';

describe('Dashboard Util tests', () => {
  describe('getColourByIndex', () => {
    test('returns first colour in GraphColourList', () => {
      expect(getColourByIndex(0)).toEqual(GraphColourList[0]);
    });
    test('returns fifth colour in GraphColourList', () => {
      expect(getColourByIndex(4)).toEqual(GraphColourList[4]);
    });
    test('loops colours if index is higher than GraphColourList length', () => {
      expect(getColourByIndex(99)).toEqual(GraphColourList[99 % GraphColourList.length]);
    });
  });
});
