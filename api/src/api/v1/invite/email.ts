import * as Boom from '@hapi/boom';
import { Users } from '../../../models';
import { query, response } from './schema';
import { Credentials as StandardCredentials } from '../../../auth/strategies/standard';
import { Api } from '../types/api';
import { Serialisers } from '../serialisers';

import * as Postmark from 'postmark';
import { reset } from 'mockdate';


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

        const result = await EmailService.inviteVolunteer(config, payload.To, payload.email_subject, payload.text_above_link, payload.text_below_link);

        // var serverToken = "89eaa2ad-8f62-474d-9a13-7782eecdd603";

        // var client = new Postmark.ServerClient(serverToken);

        // const res = await client.sendEmailWithTemplate({
        //   "From": payload.From,
        //   "To": payload.To,
        //   // "TemplateId": 18382605,
        //   "templateId": EmailTemplate.WELCOME_CB_ADMIN,
        //   "TemplateModel": {
        //     "text_above_link": payload.TemplateModel.text_above_link,
        //     "text_below_link": payload.TemplateModel.text_below_link
        //   },
        // });

        // return result;
        return null;
      },
    },
  ]



export default routes;