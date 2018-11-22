/*
 * Route validation schema for User routes
 */
import * as Joi from 'joi';
import { gender } from '../schema/request';

export { query, gender, id, since, until, ApiRequestQuery } from '../schema/request';
export { response } from '../schema/response';

const currentYear = (new Date()).getFullYear();

/*
 * Common request schema
 */
export const userName =
  Joi.string()
    .min(3)
    .max(100)
    .regex(/^[a-zA-Z]{2,}\s?[a-zA-z]*['\-]?[a-zA-Z]*['\- ]?([a-zA-Z]{1,})?/, { name: 'alpha' })
    .options({ language: { string: { regex: { name: 'can only contain letters' } } } });

export const birthYear =
  Joi.number()
    .integer()
    .min(1890)
    .max(currentYear);

export const email =
  Joi.string()
    .email();

export const password =
  Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$%&()*+,\-./\\:;<=>@[\]^_{|}~?])(?=.{8,})/,
     'strong_pwd')
    .options({ language: { string: { regex: { name: 'is too weak' } } } });

// supports passwords from old volunteer app
export const DEPRECATED_password =
  Joi.string()
    .min(6);

export const phoneNumber =
  Joi.string()
    .regex(/^\+?[0-9 -]*$/, { name: 'numeric' })
    .min(9)
    .max(20)
    .options({ language: { string: { regex: { name: 'invalid number' } } } });

export const postCode =
  Joi.string()
    .min(4)
    .max(10);

export const isEmailConsentGranted =
  Joi.boolean();

export const isSMSConsentGranted =
  Joi.boolean();

export const disability =
  Joi.string().only(['yes', 'no', 'prefer not to say']);

export const ethnicity =
  Joi.string();

/*
 *
 */
export const filterQuery = {
  filter: Joi.object({
    age: Joi.array().length(2).items(Joi.number().integer().min(0)),
    visitActivity: Joi.string(),
    gender,
  }),
};
