import * as Joi from 'joi';
import { Dictionary } from 'ramda';

export const validateForm = <T>(schema: Joi.Schema) => (values: T): Partial<T> => {
  const result = schema.validate(values, { abortEarly: false });

  if (!result.error) {
    return {};
  }

  return result.error
    .details
    .reduce((acc: Dictionary<string>, item) => {
      const x = (item.context || {}).key;
      if (x) {
        acc[x] = item.message;
      }
      return acc;
    }, {});
};
