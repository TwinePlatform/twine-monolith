/*
 * Route validation schema for Community business routes
 */
import * as Joi from 'joi';


export { query } from '../schema/request';
export { response } from '../schema/response';

export const since = Joi.date().iso().default(0);
export const until = Joi.date().iso().default(() => Date.now(), 'Current date');

export const visitActivitiesPostQuery = {
  name: Joi.string().required(),
  category: Joi.string().required(),
};

export const visitActivitiesPutQuery = {
  id: Joi.number().positive(),
  monday: Joi.boolean(),
  tuesday: Joi.boolean(),
  wednesday: Joi.boolean(),
  thursday: Joi.boolean(),
  friday: Joi.boolean(),
  saturday: Joi.boolean(),
  sunday: Joi.boolean(),
};

export const id = Joi.number().positive().required();
export const meOrId = Joi.number().positive().allow('me').required();
