import { omit } from 'ramda';
import volunteerSerialiser from '../volunteer';
import factory from '../../../../../tests/utils/factory';

describe('Serialisers :: User', () => {
  test('identity', async () => {
    const volunteer = await factory.build('volunteer');
    expect(volunteerSerialiser(volunteer)).toEqual(omit(['password'], volunteer));
  });
});
