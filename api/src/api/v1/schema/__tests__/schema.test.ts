import * as Joi from 'joi';
import { DateJoi } from '../request';


describe('DateJoi extension', () => {
  describe('max', () => {
    test('successful validation returns Date object', () => {
      const schema = DateJoi.dynamicdate().max(() => new Date());
      const result = Joi.validate(new Date(0), schema);

      expect(result.error).toBeFalsy();
      expect(result.value).toEqual(new Date(0));
    });

    test('unsuccessful validation returns error object', () => {
      const schema = DateJoi.dynamicdate().max(() => new Date(2018, 1, 1));
      const result = Joi.validate(new Date(2019, 1, 1), schema);

      expect(result.error).toEqual(expect.objectContaining({
        message: '"value" 2019-02-01T00:00:00.000Z must be before 2018-02-01T00:00:00.000Z',
      }));
    });

    test('invalid parameter', () => {
      expect(() => DateJoi.dynamicdate().max('1970-1-1')).toThrow('"q" must be a Function');
    });

    test('valid function parameter returns invalid date', () => {
      const schema = DateJoi.dynamicdate().max(() => new Date(NaN));
      const result = Joi.validate(new Date(2019, 1, 1), schema);

      expect(result.error).toEqual(expect.objectContaining({
        message: '"value" 2019-02-01T00:00:00.000Z must be before null',
      }));
    });

    test('comparing invalid value', () => {
      const schema = DateJoi.dynamicdate().max(() => new Date(2018, 1, 1));
      const result = Joi.validate(new Date(NaN), schema);

      expect(result.error).toEqual(expect.objectContaining({
        message: '"value" must be a number of milliseconds or valid date string',
      }));
    });
  });

  describe('min', () => {
    test('successful validation returns Date object', () => {
      const now = new Date();
      const schema = DateJoi.dynamicdate().min(() => new Date(0));
      const result = Joi.validate(now, schema);

      expect(result.error).toBeFalsy();
      expect(result.value).toEqual(now);
    });

    test('unsuccessful validation returns error object', () => {
      const schema = DateJoi.dynamicdate().min(() => new Date(2019, 1, 1));
      const result = Joi.validate(new Date(2018, 1, 1), schema);

      expect(result.error).toEqual(expect.objectContaining({
        message: '"value" 2018-02-01T00:00:00.000Z must be after 2019-02-01T00:00:00.000Z',
      }));
    });

    test('invalid parameter', () => {
      expect(() => DateJoi.dynamicdate().min('1970-1-1')).toThrow('"q" must be a Function');
    });

    test('valid function parameter returns invalid date', () => {
      const schema = DateJoi.dynamicdate().min(() => new Date(NaN));
      const result = Joi.validate(new Date(2019, 1, 1), schema);

      expect(result.error).toEqual(expect.objectContaining({
        message: '"value" 2019-02-01T00:00:00.000Z must be after null',
      }));
    });

    test('comparing invalid value', () => {
      const schema = DateJoi.dynamicdate().min(() => new Date(2018, 1, 1));
      const result = Joi.validate(new Date(NaN), schema);

      expect(result.error).toEqual(expect.objectContaining({
        message: '"value" must be a number of milliseconds or valid date string',
      }));
    });
  });
});
