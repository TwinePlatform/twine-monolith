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
import { Dictionary } from 'ramda';
import { Map } from '../../../types/internal';

/*
 * Types
 */
export type ApiRequestQuery = {
  fields: string[]
  sort: string
  order: string
  offset: number
  limit: number
};

export type ApiRequestBody = Dictionary<any>;


/*
 * Request query schema
 */
export const query: Map<keyof ApiRequestQuery, Joi.Schema> = {
  fields: Joi.array().items(Joi.string().min(1).max(255)),
  sort: Joi.string(),
  order: Joi.string(),
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
