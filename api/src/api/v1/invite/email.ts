import * as Boom from '@hapi/boom';
import { Users } from '../../../models';
import { query, response } from './schema';
import { Credentials as StandardCredentials } from '../../../auth/strategies/standard';
import { Api } from '../types/api';
import { Serialisers } from '../serialisers';


const routes: [Api.Invite.Email.POST.Route]
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
        const {
          payload,
          server: { app: { EmailService, knex, config } },
          pre: { communityBusiness },
        } = request;

        const result = await EmailService.inviteVolunteer(config, payload.email.To, payload.email.email_subject, payload.email.text_above_link, payload.email.text_below_link);

        return null;
      },
    },
  ]



export default routes;