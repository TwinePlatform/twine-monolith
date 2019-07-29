import { logsToDurations, findMostActive } from '../util';


describe('Dashboard statistics utilities', () => {
  describe('logsToDurations', () => {
    test('empty array gives zero duration', () => {
      expect(logsToDurations([])).toEqual({});
    });

    test('single log returns that logs duration', () => {
      expect(logsToDurations([{ duration: { minutes: 0 } }])).toEqual({});
      expect(logsToDurations([{ duration: { minutes: 10 } }])).toEqual({ minutes: 10 });
    });

    test('multiple logs have their durations extracted and summed', () => {
      expect(logsToDurations([
        { duration: { minutes: 10 } },
        { duration: { hours: 1 } },
        { duration: { hours: 2, seconds: 10 } },
      ]))
        .toEqual({ hours: 3, minutes: 10, seconds: 10 });
    });
  });

  describe('findMostActive', () => {
    test('empty dictionary gives empty value', () => {
      expect(findMostActive({})).toEqual({ labels: [], value: 0 });
    });

    test('single entry is returned as only max', () => {
      expect(findMostActive({ ['Jun 2018']: [{ duration: { minutes: 125 } }] }))
        .toEqual({ labels: ['Jun 2018'], value: 2 }); // rounded
    });

    test('multiple equal entries are all returned', () => {
      const logs = {
        ['Sept 2018']: [
          { duration: { hours: 1, minutes: 50 } },
          { duration: { hours: 1 } },
        ],
        ['Jun 2018']: [
          { duration: { hours: 2, minutes: 20 } },
          { duration: { minutes: 30 } },
        ],
      };

      expect(findMostActive(logs)).toEqual({
        labels: ['Jun 2018', 'Sept 2018'],
        value: 3,
      });
    });

    test('multiple different entries -- only max is returned', () => {
      const logs = {
        ['Sept 2018']: [
          { duration: { hours: 0.5, minutes: 50 } },
          { duration: { hours: 1 } },
        ],
        ['Jun 2018']: [
          { duration: { hours: 2, minutes: 20 } },
          { duration: { minutes: 30 } },
        ],
        ['Jan 2019']: [
          { duration: { hours: 1 } },
          { duration: { minutes: 10 } },
        ],
      };

      expect(findMostActive(logs)).toEqual({
        labels: ['Jun 2018'],
        value: 3,
      });
    });

    test('mix of equal and non-equal entries -- only max are returned', () => {
      const logs = {
        ['Sept 2018']: [
          { duration: { hours: 1, minutes: 50 } },
          { duration: { hours: 1 } },
        ],
        ['Jun 2018']: [
          { duration: { hours: 2, minutes: 20 } },
          { duration: { minutes: 30 } },
        ],
        ['Jan 2019']: [
          { duration: { hours: 1 } },
          { duration: { minutes: 10 } },
        ],
      };

      expect(findMostActive(logs)).toEqual({
        labels: ['Jun 2018', 'Sept 2018'],
        value: 3,
      });
    });

    test('non-date labels are sorted alphabetically', () => {
      const logs = {
        ['Toad']: [
          { duration: { hours: 1, minutes: 50 } },
          { duration: { hours: 1 } },
        ],
        ['Badger']: [
          { duration: { hours: 2, minutes: 20 } },
          { duration: { minutes: 30 } },
        ],
        ['Mole']: [
          { duration: { hours: 1 } },
          { duration: { minutes: 10 } },
        ],
      };

      expect(findMostActive(logs)).toEqual({
        labels: ['Badger', 'Toad'],
        value: 3,
      });
    });
  });
});
