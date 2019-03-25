import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { omit } from 'ramda';

import { CommunityBusinesses, Users, CbAdmins } from '../../../models';
import { isChildOrganisation } from '../prerequisites';
import { RegisterCommunityBusinessesRequest } from '../types';
import { response, cbPayload } from './schema';
import {
  userName,
  email,
} from '../users/schema';
import { EmailTemplate } from '../../../services/email/templates';

export default [
  {
    method: 'POST',
    path: '/community-businesses/register',
    options: {
      description: 'Register a new community businesses and invite admin user',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['organisations_details-child:write'],
        },
      },
      validate: {
        payload: {
          ...omit(['name'], cbPayload),
          orgName: cbPayload.name,
          adminName: userName.required(),
          adminEmail: email.required(),
        },
      },
      pre: [
        { method: isChildOrganisation, assign: 'isChild', failAction: 'error' },
      ],
      response: { schema: response },
    },
    handler: async (request: RegisterCommunityBusinessesRequest, h: Hapi.ResponseToolkit) => {
      const {
        pre: { isChild },
        server: { app: { knex, EmailService } },
        payload: {
          orgName,
          region,
          sector,
          address1,
          address2,
          townCity,
          postCode,
          turnoverBand,
          _360GivingId,
          adminName,
          adminEmail,
        },
      } = request;

      if (!isChild) {
        return Boom.forbidden('Insufficient permissions to create organisations');
      }

      // Initial checks
      if (await CommunityBusinesses.exists(knex, { where: { _360GivingId } })) {
        return Boom.badRequest('360 Giving Id already exists');
      }

      if (await Users.exists(knex, { where: { email: adminEmail } })) {
        return Boom.conflict('User already exists with this email');
      }

      // Create accounts
      const { user, cb, token } = await knex.transaction(async (trx) => {
        const cb = await CommunityBusinesses.add(trx, {
          name: orgName,
          region,
          sector,
          address1,
          address2,
          townCity,
          postCode,
          turnoverBand,
          _360GivingId,
        });
        const user = await CbAdmins.addWithRole(trx, cb, {
          name: adminName,
          email: adminEmail,
        });
        const { token } = await Users.createPasswordResetToken(trx, user);
        return { user, cb, token };
      });

      await EmailService.send({
        from: 'visitorapp@powertochange.org.uk', // this shouldn't be hardcoded
        to: user.email,
        templateId: EmailTemplate.WELCOME_CB_ADMIN,
        templateModel: { name: user.name, organisation: cb.name, token, email: user.email },
      });

      return CommunityBusinesses.serialise(cb);
    },
  },
] as Hapi.ServerRoute[];
