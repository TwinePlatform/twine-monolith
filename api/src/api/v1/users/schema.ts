/*
 * Route validation schema for User routes
 */
import * as Joi from 'joi';
import { gender } from '../schema/request';

export { query, gender, id } from '../schema/request';
export { response } from '../schema/response';

const currentYear = (new Date()).getFullYear();

/*
 * Common request schema
 */
export const visitorName =
  Joi.string()
    .min(3)
    .max(100)
    .regex(/[^\w\s\d]/, { name: 'alphanumeric', invert: true });

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
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, 'strong_pwd')
    .options({ language: { string: { regex: { name: 'is too weak' } } } });

export const phoneNumber =
  Joi.string()
    .min(11)
    .max(14);

export const postCode =
  Joi.string()
    .min(4)
    .max(10);

export const emailConsent =
  Joi.boolean();

export const smsConsent =
  Joi.boolean();

/*
 *
 */
export const filterQuery = {
  filter: Joi.object({
    age: Joi.array().length(2).items(Joi.number().integer().min(0)),
    activity: Joi.string(),
    gender,
  }),
};
