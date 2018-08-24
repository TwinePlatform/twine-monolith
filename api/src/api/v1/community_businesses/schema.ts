/*
 * Route validation schema for Community business routes
 */
import * as Joi from 'joi';


export { query } from '../schema/request';
export { response } from '../schema/response';

export const since = Joi.date().iso();
export const until = Joi.date().iso();
