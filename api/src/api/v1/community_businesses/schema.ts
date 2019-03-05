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
  name: Joi.string().trim().required(),
  category: Joi.string().trim().required(),
};

export const visitActivitiesPutPayload = {
  name: Joi.string().min(2).trim(),
  category: Joi.string().min(3).trim(),
  monday: Joi.boolean(),
  tuesday: Joi.boolean(),
  wednesday: Joi.boolean(),
  thursday: Joi.boolean(),
  friday: Joi.boolean(),
  saturday: Joi.boolean(),
  sunday: Joi.boolean(),
};

export const cbPayload = {
  name: Joi.string().min(1).trim(),
  region: Joi.string().min(1).trim(),
  sector: Joi.string().min(1).trim(),
  logoUrl: Joi.string().uri().trim(),
  address1: Joi.string().min(1).trim(),
  address2: Joi.string().min(1).trim(),
  townCity: Joi.string().min(1).trim(),
  postCode: Joi.string().min(6).max(10).trim(),
  turnoverBand: Joi.string().min(5).max(11).trim(),
  _360GivingId: Joi.string().min(5).trim(),
};

export const meOrId = id.allow('me');

export const volunteerLogActivity = Joi.string().trim();

export const volunteerLogDuration = Joi.object({
  hours: Joi.number().integer().min(0),
  minutes: Joi.number().integer().min(0),
  seconds: Joi.number().integer().min(0),
});

export const volunteerProject = Joi.string().min(2).max(255);
