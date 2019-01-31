/*
 * Route validation schema for Community business routes
 */
import * as Joi from 'joi';
import { query } from '../users/schema';
import { id } from '../schema/request';


export { query, id, gender, since, until, startedAt } from '../schema/request';
export { response } from '../schema/response';

export const visitActivitiesGetQuery = {
  ...query,
  day: Joi.allow([
    'today',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'satday',
    'sunday',
  ]),
};

export const visitActivitiesPostPayload = {
  name: Joi.string().required(),
  category: Joi.string().required(),
};

export const visitActivitiesPutPayload = {
  category: Joi.string().min(3),
  monday: Joi.boolean(),
  tuesday: Joi.boolean(),
  wednesday: Joi.boolean(),
  thursday: Joi.boolean(),
  friday: Joi.boolean(),
  saturday: Joi.boolean(),
  sunday: Joi.boolean(),
};

export const cbPayload = {
  name: Joi.string().min(1),
  region: Joi.string().min(1),
  sector: Joi.string().min(1),
  logoUrl: Joi.string().uri(),
  address1: Joi.string().min(1),
  address2: Joi.string().min(1),
  townCity: Joi.string().min(1),
  postCode: Joi.string().min(6).max(10),
  turnoverBand: Joi.string().min(5).max(11),
  _360GivingId: Joi.string().min(5),
};

export const meOrId = id.allow('me');
