/*
 * API Request Schema and Type Definitions
 *
 * Common schema and type definitions for:
 * - Request query parameters
 * - Request path parameters
 * - Request payload
 * - Commonly required payload parameters
 *
 * Used, overridden and extended by individual routes
 */
import * as Joi from 'joi';
import * as moment from 'moment';
import { Dictionary } from 'ramda';
import { Map } from '../../../types/internal';

/*
 * Types
 */
export type ApiRequestQuery = {
  fields: string[]
  sort: string
  order: 'asc' | 'desc'
  offset: number
  limit: number
};

export type ApiRequestBody = Dictionary<any>;


/*
 * Joi Extension to support dynamic date constraints
 */
export const DateJoi = Joi.extend((joi: any) => ({
  base: joi.date(),
  name: 'dynamicdate',
  language: {
    max: '{{v}} must be before {{q}}',
    min: '{{v}} must be after {{q}}',
  },
  rules: [
    {
      name: 'max',
      params: { q: joi.func() },
      validate (params: any, value: any, state: any, options: any) {
        const createError = (v: string, q: string) =>
          this.createError('dynamicdate.max', { v, q }, state, options);
        const now = moment(params.q());
        const when = moment(value);

        return when.isValid() && now.isValid() && now.isAfter(when)
          ? when.toDate()
          : createError(when.toISOString(), now.toISOString());
      },
    },

    {
      name: 'min',
      params: { q: joi.func() },
      validate (params: any, value: any, state: any, options: any) {
        const createError = (v: string, q: string) =>
          this.createError('dynamicdate.min', { v, q }, state, options);
        const now = moment(params.q());
        const when = moment(value);

        return when.isValid() && now.isValid() && now.isBefore(when)
          ? when.toDate()
          : createError(when.toISOString(), now.toISOString());
      },
    },
  ],
}));


/*
 * Request query schema
 */
export const query: Map<keyof ApiRequestQuery, Joi.Schema> = {
  fields: Joi.array().items(Joi.string().min(1).max(255)),
  sort: Joi.string(),
  order: Joi.string().only('asc', 'desc'),
  offset: Joi.number().integer().min(0),
  limit: Joi.number().integer().min(1).max(100),
};


/*
 * Commonly used payload schema
 */
export const gender =
  Joi.string().only(['male', 'female', 'prefer not to say']);

export const id =
  Joi.number().integer().positive();

export const since = Joi.date().iso().default('1970-01-01T00:00:00.000Z');
export const until = Joi.date().iso().default(() => Date.now(), 'Current date');

export const startedAt =
  DateJoi.dynamicdate()
    .min(() => moment().startOf('month'));
