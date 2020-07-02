import { getTimeLabel } from '../helpers';

describe('TimeForm Helpers', () => {
  describe(':: getTimeLabel', () => {
    test('Returns "You..." if forUser is Volunteer', () => {
      const actual = getTimeLabel('volunteer');
      expect(actual).toEqual('You volunteered for');
    });
    test('Returns a default message for empty volunteer name & forUser = admin', () => {
      const actual = getTimeLabel('admin', '');
      expect(actual).toEqual('Member volunteered for');
    });
    test('Returns a message with users name if volunteer set & forUser = admin', () => {
      const actual = getTimeLabel('admin', 'Beyonce');
      expect(actual).toEqual('Beyonce volunteered for');
    });
  });
});
