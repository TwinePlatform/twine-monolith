import * as Joi from '@hapi/joi';
import { assoc, Dictionary } from 'ramda';


export const validateForm = <T extends Dictionary<string | number>> (schema: Joi.Schema) => (values: T): Partial<T> => {
  const result = schema.validate(values, { abortEarly: false });

  if (!result.error) {
    return {};
  }

  return result.error
    .details
    .reduce((acc, item) => {
      const x = (item.context || {}).key;
      return x
        ? assoc(x, item.message, acc)
        : acc;
    }, {} as Partial<T>);
};
