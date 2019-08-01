import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import * as Knex from 'knex';
import { ApiTokens, Organisations } from '../../../models';


export const ExternalCredentials = {
  async get (knex: Knex, token: string) {
    try {
      const match = await ApiTokens.find(knex, token);
      const org = await Organisations.getOne(knex, { where: { name: match.name } });

      return {
        isValid: true,
        credentials: { scope: [match.access], app: { organisation: org } },
      };
    } catch (error) {
      return { isValid: false, credentials: {} };
    }
  },

  fromRequest (req: Hapi.Request) {
    return Object.assign({ scope: req.auth.credentials.scope }, req.auth.credentials.app.app);
  },
};

const validateExternal = async (request: Hapi.Request, token: string, h: Hapi.ResponseToolkit) => {
  const { log, server: { app: { knex } } } = request;

  try {
    return ExternalCredentials.get(knex, token);
  } catch (error) {
    log('error', error);
    return Boom.badImplementation('Error with route authentication for 3rd party clients');
  }
};

export default validateExternal;
