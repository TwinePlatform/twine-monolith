import * as Duration from '../duration';


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

  describe('toWorkingDays', () => {
    test('uses definition of 8 hours = 1 working day', () => {
      expect(Duration.toWorkingDays({ hours: 8 })).toBe(1);
    });
  });

  describe('toHours', () => {
    test('uses definition of 60 minutes = 1 hour', () => {
      expect(Duration.toHours({ minutes: 60 })).toBe(1);
    });
  });

  describe('sum', () => {
    test('correctly sum two durations together -- no carrying', () => {
      expect(Duration.sum({ hours: 1 }, { minutes: 12, seconds: 15 }))
        .toEqual({ hours: 1, minutes: 12, seconds: 15 });
    });

    test('correctly sum two durations together -- carrying', () => {
      expect(Duration.sum({ hours: 24, minutes: 32 }, { hours: 1, minutes: 45, seconds: 102 }))
        .toEqual({
          days: 1,
          hours: 2,
          minutes: 18,
          seconds: 42,
        });
    });
  });

  describe('diff', () => {
    test('negative difference throws error', () => {
      expect(() => Duration.diff({ hours: 1 }, { hours: 3 })).toThrow();
    });

    test('positive difference is correctly determined', () => {
      expect(Duration.diff({ days: 2, minutes: 3 }, { hours: 12, minutes: 1, seconds: 23 }))
        .toEqual({
          days: 1,
          hours: 12,
          minutes: 1,
          seconds: 37,
        });
    });
  });

  describe('equals', () => {
    test('exact matches return true', () => {
      expect(Duration.equals({ seconds: 10 }, { seconds: 10 })).toBe(true);
    });

    test('equivalent durations return true', () => {
      expect(Duration.equals({ minutes: 60 }, { hours: 1 })).toBe(true);
    });

    test('non-equivalent return false', () => {
      expect(Duration.equals({ minutes: 43 }, { seconds: 111 })).toBe(false);
      expect(Duration.equals({ minutes: 43 }, { minutes: 111 })).toBe(false);
    })
  });

  describe('greaterThan', () => {
    test('left > right -> true', () => {
      expect(Duration.greaterThan({ minutes: 50 }, { minutes: 10 })).toBe(true);
      expect(Duration.greaterThan({ minutes: 1 }, { seconds: 10 })).toBe(true);
    });
    test('left < right -> false', () => {
      expect(Duration.greaterThan({ minutes: 0 }, { minutes: 10 })).toBe(false);
      expect(Duration.greaterThan({ minutes: 10 }, { hours: 1 })).toBe(false);
    });
    test('left === right -> false', () => {
      expect(Duration.greaterThan({ minutes: 50 }, { minutes: 50 })).toBe(false);
      expect(Duration.greaterThan({ seconds: 60 }, { minutes: 1 })).toBe(false);
    });
  });

  describe('accumulate', () => {
    test('empty array sums to 0 duration', () => {
      expect(Duration.accumulate([])).toEqual(Duration.fromSeconds(0));
    });

    test('single element array returns head', () => {
      expect(Duration.accumulate([{ minutes: 10 }])).toEqual({ minutes: 10 })
    });

    test('multi-element array sums all elements', () => {
      expect(Duration.accumulate([
        { minutes: 10 },
        { minutes: 45 },
        { hours: 1 },
        { seconds: 1100 },
      ])).toEqual({ hours: 2, minutes: 13, seconds: 20 })
    })
  });
});
