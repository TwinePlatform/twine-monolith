import * as Joi from '@hapi/joi';
import { postCode } from '../schema';

const ukPostCodeFormats = ['AA9A 9AA', 'A9A 9AA', 'A9 9AA', 'A99 9AA', 'AA9 9AA', 'AA99 9AA'];

const postCodeTest = (format: string) => {
  test(`Format ${format}`, () => {
    const validation = Joi.validate(format, postCode);
    expect(validation.error).toBeNull();
  });
};

describe('User Schema Validation', () => {
  describe('Post Code', () => {
    ukPostCodeFormats.map((x) => postCodeTest(x));
  });
});
