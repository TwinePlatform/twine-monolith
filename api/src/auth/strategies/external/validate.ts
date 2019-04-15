import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as Knex from 'knex';
import { compare } from 'bcrypt';
import { asyncFind } from '../../../utils';
import { ApiTokenRow } from './types';


export const ExternalCredentials = {
  async get (knex: Knex, token: string) {
    const tokens: ApiTokenRow[] = await knex('api_token')
      .select(['api_token', 'api_token_access', 'api_token_name']);

    if (tokens.length < 1) {
      return { isValid: false, credentials: {} };
    }

    try {
      const match = await asyncFind<ApiTokenRow>((tkn) => compare(token, tkn.api_token), tokens);
      return {
        isValid: true,
        credentials: { scope: [match.api_token_access], app: match.api_token_name },
      };
    } catch (error) {
      return { isValid: false, credentials: {} };
    }
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
