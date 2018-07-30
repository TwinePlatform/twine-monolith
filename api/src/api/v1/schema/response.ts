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
  data?: Dictionary<any> | any[]
  error?: {
    statusCode: number
    type: string
    message: string
  }
  meta?: {
    offset: number
    total: number
  }
};

export const response = {
  data: Joi.alternatives(Joi.object(), Joi.array()),
  error: Joi.object({
    statusCode: Joi.number().integer().min(200).max(599),
    type: Joi.string().min(1).max(255),
    message: Joi.string().min(1).max(255),
  }),
  meta: Joi.object({
    offset: Joi.number().integer().min(0),
    total: Joi.number().integer().min(0),
  }),
};
