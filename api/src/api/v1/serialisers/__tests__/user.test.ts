import { omit } from 'ramda';
import userSerialiser from '../user';
import factory from '../../../../../tests/utils/factory';

describe('Serialisers :: User', () => {
  test('identity', async () => {
    const user = await factory.build('user');
    expect(userSerialiser(user)).toEqual(omit(['password'], user));
  });
});
