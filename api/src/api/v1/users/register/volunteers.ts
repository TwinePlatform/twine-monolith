/*
 * Registration endpoints for volunteers
 */
import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as Joi from 'joi';
import {
  id,
  userName,
  birthYear,
  email,
  phoneNumber,
  postCode,
  password,
  isEmailConsentGranted,
  isSMSConsentGranted,
  gender,
  response
} from '../schema';
import {
  GenderEnum,
  Volunteers,
  Organisations,
  Users
} from '../../../../models';
import { RoleEnum } from '../../../../auth/types';
import { VolunteerRegisterRequest } from '../../types';

export default [
  {
    method: 'POST',
    path: '/users/register/volunteers',
    options: {
      description: 'Retreive list of all users',
      auth: false,
      validate: {
        payload: {
          organisationId: id.required(),
          role: Joi.alternatives(RoleEnum.VOLUNTEER, RoleEnum.VOLUNTEER_ADMIN),
          name: userName.required(),
          gender: gender.required(),
          birthYear: birthYear.required(),
          email: email.required(),
          phoneNumber: phoneNumber.allow(''),
          postCode: postCode.allow(''),
          password: password.required(),
          emailConsent: isEmailConsentGranted.default(false),
          smsConsent: isSMSConsentGranted.default(false),
        },
      },
      response: { schema: response },
    },
    handler: async (request: VolunteerRegisterRequest, h: Hapi.ResponseToolkit) => {
      const { server: { app: { knex } }, payload } = request;
      /*
       * Preliminaries
       */
      // check user doesn't already exist
      if (await Users.exists(knex, { where: { email: payload.email } })) {
        return Boom.conflict('User with this e-mail already registered');
      }
      const organisation = await Organisations
        .getOne(knex, { where: { id: payload.organisationId, deletedAt: null } });
      // check organisation exists
      if (!organisation) return Boom.badRequest('Unrecognised organisation');

      /*
       * Registation
       */
      const volunteer = await Volunteers.addWithRole(knex, payload, payload.role, organisation);

      // register login event
      await Volunteers.recordLogin(knex, volunteer);

      return Volunteers.serialise(volunteer);
    },
  },
] as Hapi.ServerRoute[];
