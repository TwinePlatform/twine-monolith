import * as Logs from '../volunteer_log';

describe('Serialisers :: Volunteer Log', () => {
  test('identity', () => {
    expect(Logs.identity(1)).toBe(1);
  });
});
