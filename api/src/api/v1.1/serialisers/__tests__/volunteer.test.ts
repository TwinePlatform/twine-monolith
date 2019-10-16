import { omit } from 'ramda';
import * as Volunteers from '../volunteer';
import factory from '../../../../../tests/utils/factory';

describe('Serialisers :: User', () => {
  test('identity', async () => {
    const volunteer = await factory.build('volunteer');
    expect(Volunteers.noSecrets(volunteer)).toEqual(omit(['password'], volunteer));
  });
});
