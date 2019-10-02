import logSerialiser from '../volunteer_log';

describe('Serialisers :: Volunteer Log', () => {
  test('identity', () => {
    expect(logSerialiser(1)).toBe(1);
  });
});
