import * as Boom from '@hapi/boom';
import { omit } from 'ramda';

import { CommunityBusinesses, Users, CbAdmins } from '../../../models';
import { requireChildOrganisation } from '../prerequisites';
import { Api } from '../types/api';
import { response, cbPayload } from './schema';
import { userName, email } from '../users/schema';
import { Tokens } from '../../../models/token';
import { Serialisers } from '../serialisers';
import { SectorEnum } from '../../../models/types';
import { randomBytes } from 'crypto';


const routes: [Api.CommunityBusinesses.Register.POST.Route] = [
  {
    method: 'POST',
    path: '/community-businesses/register',
    options: {
      description: 'Register a new community businesses and invite admin user',
      auth: {
        mode: 'try',
        strategy: 'standard',
        access: {
          scope: ['user_details-child:write'],
        }
      },
      validate: {
        payload: {
          ...omit(['name'], cbPayload),
          orgName: cbPayload.name,
          adminName: userName.required(),
          adminEmail: email.required(),
        },
      },
      // pre: [requireChildOrganisation],
      response: { schema: response },
    },
    handler: async (request, h) => {
      const {
        server: { app: { knex, EmailService, config } },
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

      // Initial checks
      if (typeof _360GivingId !== 'undefined') {
        if (await CommunityBusinesses.exists(knex, { where: { _360GivingId } })) {
          return Boom.badRequest('360 Giving Id already exists');
        }
      }

      if (await Users.exists(knex, { where: { email: adminEmail } })) {
        return Boom.conflict('User already exists with this email');
      }

      const code = randomBytes(4).toString('hex');
      // Create accounts
      const { user, cb, token } = await knex.transaction(async (trx) => {
        const cb = await CommunityBusinesses.add(trx, {
          name: orgName,
          region,
          sector: SectorEnum.TEMPORARY_DATA, //can be enable when required
          address1,
          address2,
          townCity,
          postCode,
          turnoverBand,
          _360GivingId,
        }, code);
        console.log(cb);
        const user = await CbAdmins.addWithRole(trx, cb, {
          name: adminName,
          email: adminEmail,
        });
        const { token } = await Tokens.createPasswordResetToken(trx, user);
        return { user, cb, token };
      });

      await EmailService.newCbAdmin(config, user, cb, token, code);

      return Serialisers.communityBusinesses.identity(cb);
    },
  },
];

export default routes;
