import { omit } from 'ramda';
import * as Users from '../user';
import factory from '../../../../../tests/utils/factory';

describe('Serialisers :: User', () => {
  test('identity', async () => {
    const user = await factory.build('user');
    expect(Users.noSecrets(user)).toEqual(omit(['password'], user));
  });
});
