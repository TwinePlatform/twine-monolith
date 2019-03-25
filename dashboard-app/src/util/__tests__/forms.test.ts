import * as Joi from 'joi';
import { validateForm } from '../forms';

describe('Utils :: forms', () => {
  describe('validateForm', () => {
    test('Valid form values', () => {
      const schema = Joi.object({ key: Joi.string().min(3).max(5) });
      const values = { key: 'food' };
      const errors = validateForm(schema)(values);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    test('One invalid value', () => {
      const schema = Joi.object({
        a: Joi.string().min(3).max(5),
        b: Joi.number().integer().positive(),
      });
      const values = { a: 'fo', b: 10 };
      const errors = validateForm<{a: string, b: number}>(schema)(values);

      expect(Object.keys(errors)).toHaveLength(1);
      expect(errors.a).toBe('"a" length must be at least 3 characters long');
    });

    test('Multiple invalid values', () => {
      const schema = Joi.object({
        a: Joi.string().min(3).max(5),
        b: Joi.number().integer().positive(),
      });
      const values = { a: 'fo', b: -1 };
      const errors = validateForm<{a: string, b: number}>(schema)(values);

      expect(Object.keys(errors)).toHaveLength(2);
      expect(errors.a).toBe('"a" length must be at least 3 characters long');
      expect(errors.b).toBe('"b" must be a positive number');
    });
  });
});
