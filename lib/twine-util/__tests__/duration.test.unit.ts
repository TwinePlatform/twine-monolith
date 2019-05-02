import Duration from '../duration';

describe('Duration', () => {
  describe('toSeconds', () => {
    test('empty object gives zero', () => {
      const seconds = Duration.toSeconds({});
      expect(seconds).toBe(0);
    });

    test('seconds transformed literally', () => {
      const seconds = Duration.toSeconds({ seconds: 160 });
      expect(seconds).toBe(160);
    });

    test('minutes transformed to seconds', () => {
      const seconds = Duration.toSeconds({ minutes: 2, seconds: 160 });
      expect(seconds).toBe(2 * 60 + 160);
    });

    test('hours transformed to seconds', () => {
      const seconds = Duration.toSeconds({ hours: 1, minutes: 2, seconds: 1 });
      expect(seconds).toBe(1 * 3600 + 2 * 60 + 1);
    });

    test('days transformed to seconds', () => {
      const seconds = Duration.toSeconds({ days: 1, seconds: 160 });
      expect(seconds).toBe(1 * 24 * 3600 + 160);
    });

    test('unrecognized keys ignored', () => {
      const seconds = Duration.toSeconds(<any> { foo: 1, seconds: 160 });
      expect(seconds).toBe(160);
    });
  });

  describe('fromSeconds', () => {
    test('integer # of seconds, < 1 min', () => {
      expect(Duration.fromSeconds(59)).toEqual({ seconds: 59 });
    });

    test('integer # of minutes, < 1 hour', () => {
      expect(Duration.fromSeconds(2400)).toEqual({ minutes: 40 });
    });

    test('non-integer # of minutes, < 1 hour', () => {
      expect(Duration.fromSeconds(2432)).toEqual({ minutes: 40, seconds: 32 });
    });

    test('integer # of hours, < 1 day', () => {
      expect(Duration.fromSeconds(18000)).toEqual({ hours: 5 });
    });

    test('non-integer # of hours, < 1 day', () => {
      expect(Duration.fromSeconds(18252)).toEqual({ hours: 5, minutes: 4, seconds: 12 });
    });

    test('integer # of days', () => {
      expect(Duration.fromSeconds(24 * 3600)).toEqual({ days: 1 });
    });

    test('non-integer # of days', () => {
      expect(Duration.fromSeconds(24 * 3600 + 12856))
        .toEqual({ days: 1, hours: 3, minutes: 34, seconds: 16 });
    });
  });
});
