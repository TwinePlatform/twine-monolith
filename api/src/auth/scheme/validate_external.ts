import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { compare } from 'bcrypt';

type ExternalStrategyResponse =
  Promise <{ isValid: boolean, credentials: { scope: string } | {} } | Boom<null>>;

type ValidateExternal = (request: Hapi.Request, token: string, h: Hapi.ResponseToolkit)
  => ExternalStrategyResponse;

type TokenResponse = { api_token: string, api_token_access: string };


const findMatching = async (xs: TokenResponse [], token: string): ExternalStrategyResponse => {
  if (xs.length < 1) return { isValid: false, credentials: {} };

  const { api_token: apiToken, api_token_access: scope } = xs[0];
  const match = await compare(token, apiToken);

  return match
  ? {
    isValid: true,
    credentials: { scope }, }
  : findMatching(xs.slice(1), token);
};

const validateExternal: ValidateExternal = async ({ knex }, token, h) => {
  try {
    const tokenResponses = await knex('api_token').select(['api_token', 'api_token_access']);
    if (tokenResponses.length === 0) {
      return Boom.unauthorized('No stored api token data');
    }

    return findMatching(tokenResponses, token);
  } catch (error) {
    console.log(error);
    return Boom.badImplementation('Error with route authentication for 3rd party clients');
  }
};

export default validateExternal;
