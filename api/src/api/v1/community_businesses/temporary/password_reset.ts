import * as Boom from '@hapi/boom';
import { Random } from 'twine-util';
import { isChildOrganisation, getCommunityBusiness } from '../../prerequisites';
import { response, id } from '../schema';
import { CbAdmins, Users } from '../../../../models';
import { Api } from '../../types/api';


const routes: [Api.CommunityBusinesses.Temporary.Id.Password.Reset.GET.Route] = [
  {
    method: 'GET',
    path: '/community-businesses/temporary/{organisationId}/password/reset',
    options: {
      description: 'Reset password for a temporary organisation',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['organisations_details-child:read'],
        },
      },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
        { method: isChildOrganisation, failAction: 'error' },
      ],
      validate: {
        params: { organisationId: id },
      },
      response: { schema: response },
    },
    handler: async (request, h) => {
      const {
        pre: { communityBusiness },
        server: { app: { knex } },
      } = request;

      if (!communityBusiness.isTemp) {
        return Boom.forbidden('Not a temporary organisation');
      }

      const [admin] = await CbAdmins.fromOrganisation(knex, communityBusiness);

      const password = Random.password();
      const updatedAdmin = await Users.update(knex, admin, { password });
      return { ...updatedAdmin, password };
    },
  },
];

export default routes;
