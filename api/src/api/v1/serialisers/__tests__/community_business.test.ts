import * as Cbs from '../community_business';

describe('Serialisers :: Community Business', () => {
  test('identity', () => {
    expect(Cbs.identity(1)).toBe(1);
  });
});
