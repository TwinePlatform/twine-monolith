/*
 * API Request Schema and Type Definitions
 *
 * Common schema and type definitions for:
 * - Request query parameters
 * - Request path parameters
 * - Request payload
 *
 * Used, overridden and extended by individual routes
 */
import * as Joi from 'joi';
import { Dictionary } from 'ramda';


export type ApiRequestQuery = {
  fields: string[]
  sort: string
  order: string
  offset: number
  limit: number
};

export type ApiRequestBody = Dictionary<any>;

export const query = {
  fields: Joi.array().items(Joi.string().min(1).max(255)),
  sort: Joi.string(),
  order: Joi.string(),
  offset: Joi.number().integer().min(0),
  limit: Joi.number().integer().min(1).max(100),
};
