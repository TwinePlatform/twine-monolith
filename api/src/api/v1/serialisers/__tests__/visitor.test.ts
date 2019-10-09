import { omit } from 'ramda';
import * as Visitors from '../visitor';
import factory from '../../../../../tests/utils/factory';

describe('Serialisers :: User', () => {
  test('identity', async () => {
    const visitor = await factory.build('visitor');
    const omitter = omit(['password', 'qrCode']);

    const result = await Visitors.noSecrets(visitor);

    expect(omitter(result)).toEqual(omitter(visitor));
    expect(result.qrCode).toEqual(expect.stringContaining('data:'));
  });
});
