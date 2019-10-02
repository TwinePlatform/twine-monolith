import cbSerialiser from '../community_business';

describe('Serialisers :: Community Business', () => {
  test('identity', () => {
    expect(cbSerialiser(1)).toBe(1);
  });
});
