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
  Volunteers,
  Users,
  CommunityBusinesses
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
          role: Joi.alternatives(RoleEnum.VOLUNTEER, RoleEnum.VOLUNTEER_ADMIN).required(),
          adminCode: Joi.string().regex(/^\w{5,8}$/),
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
        failAction: (request, h, err) => err,
      },
      response: { schema: response },
    },
    handler: async (request: VolunteerRegisterRequest, h: Hapi.ResponseToolkit) => {
      const { server: { app: { knex } }, payload } = request;
      const { email, role, organisationId, adminCode } = payload;
      /*
       * Preliminaries
       */
      // check user doesn't already exist

      if (await Users.exists(knex, { where: { email } })) {
        return Boom.conflict('User with this e-mail already registered');
      }

      const communityBusiness = await CommunityBusinesses
      .getOne(knex, { where: { id: organisationId, deletedAt: null } });

      // check organisation exists
      if (!communityBusiness) return Boom.badRequest('Unrecognised organisation');

      /*
       * Registration
       */

      if (role === RoleEnum.VOLUNTEER_ADMIN && !adminCode) {
        return Boom.badRequest('Missing volunteer admin code');
      }

      try {
        const volunteer =
          await Volunteers.addWithRole(knex, payload, role, communityBusiness, adminCode);

        return Volunteers.serialise(volunteer);

      } catch (error) {
        if (error.message === 'Invalid volunteer admin code') {
          return Boom.unauthorized(error.message);
        }
        return error;
      }
    },
  },
] as Hapi.ServerRoute[];
