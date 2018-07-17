/*
 * API Response Schema and Type Definitions
 *
 * Common schema and type definitions for:
 * - Response payload
 *
 * Used, overridden and extended by individual routes
 */
import * as Joi from 'joi';
import { Dictionary } from 'ramda';


export type Response = {
  data: Dictionary<any>,
  error: {
    statusCode: number,
    type: string,
    message: string
  }
};

export const response = {
  data: Joi.object(),
  error: Joi.object({
    statusCode: Joi.number().integer().min(200).max(599),
    type: Joi.string().min(1).max(255),
    message: Joi.string().min(1).max(255),
  }),
  meta: Joi.object(),
};
