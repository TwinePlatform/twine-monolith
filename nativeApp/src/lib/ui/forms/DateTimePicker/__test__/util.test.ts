import MockDate from 'mockdate';
import { getDateWithCurrentTime } from '../util';

describe('Date Picker Utils', () => {
  beforeAll(() => {
    MockDate.set(new Date('2020-01-17T17:09:44.945Z'), 0);
  });

  afterAll(() => {
    MockDate.reset();
  });

  describe('::getDateWithCurrentTime', () => {
    test('takes a given date and adds current time to it', () => {
      const testDate = new Date('2019-10-10T00:00:00');
      const actual = getDateWithCurrentTime(testDate);
      expect(actual).toEqual(new Date('2019-10-16T16:09:44.945Z'));
    });
  });
});
