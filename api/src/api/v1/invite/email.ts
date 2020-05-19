import * as Boom from '@hapi/boom';
import { Users } from '../../../models';
import { query, response } from './schema';
import { Credentials as StandardCredentials } from '../../../auth/strategies/standard';
import { Api } from '../types/api';
import { Serialisers } from '../serialisers';


const routes: [Api.Invite.Email.POST.Route]
//const route
 = [
  {
    method: 'POST',
    path: '/invite/email',
    options: {
      description: 'Invite a new volunteer via email',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['user_details-own:read'],
        },
      },
      validate: {
        query,
      },
      response: { schema: response },
    },
    handler: async (request, h) => {
      const { user } = StandardCredentials.fromRequest(request);
        console.log(request.payload);
        //add the postmark integration
        return Serialisers.invite.identity("email sent");
    },
  },
]



export default routes;