import * as Hapi from '@hapi/hapi';
import * as Knex from 'knex';
import { ApiTokens, Organisations } from '../../../models';


export const ExternalCredentials = {
  async get (knex: Knex, token: string): Promise<Hapi.AuthCredentials> {
    const match = await ApiTokens.find(knex, token);
    const org = await Organisations.getOne(knex, { where: { name: match.name } });
    return { scope: [match.access], app: { scope: [match.access], organisation: org } };
  },

  fromRequest (req: Hapi.Request) {
    return Object.assign({ scope: req.auth.credentials.scope }, req.auth.credentials.app);
  },
};

const validateExternal = async (request: Hapi.Request, token: string, h: Hapi.ResponseToolkit) => {
  const { server: { app: { knex } } } = request;

  try {
    const credentials = await ExternalCredentials.get(knex, token);
    return { isValid: true, credentials };

  } catch (error) {
    return { isValid: false, artifacts: error };

  }
};

export default validateExternal;
