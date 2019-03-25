import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { getCommunityBusiness, isChildOrganisation } from '../../prerequisites';
import { id, response } from '../schema';

export default [
  {
    method: 'DELETE',
    path: '/community-businesses/temporary/{organisationId}',
    options: {
      description: 'Hard delete a temporary community businesses and all associated data',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['organisations_details-child:delete'],
        },
      },
      validate: {
        params: { organisationId: id },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
        { method: isChildOrganisation, assign: 'isChild' },
      ],
    },
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const { pre: { communityBusiness, isChild }, server: { app: { knex } } } = request;

      if (!isChild) {
        return Boom.forbidden('Insufficient permissions to access this resource');
      }

      if (!communityBusiness.isTemp) {
        return Boom.forbidden('Not a temporary organisation');
      }

      await knex.transaction(async (trx) => {
        // delete all users at this organisation
        await trx.raw('DELETE FROM user_account '
        + 'USING user_account_access_role '
        + 'WHERE user_account.user_account_id = user_account_access_role.user_account_id '
        + 'AND user_account_access_role.organisation_id = ?', [communityBusiness.id]);

        await trx('organisation')
          .delete()
          .where({ organisation_id: communityBusiness.id });
      });

      return null;
    },
  },
] as Hapi.ServerRoute[];
