import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { compare } from 'bcrypt';
import { identity as id, zip, pipe, filter, flatten, head } from 'ramda';

type ValidateExternal = (request: Hapi.Request, token: string, h: Hapi.ResponseToolkit)
  => Promise <{ isValid: boolean, credentials: any } | Boom<null>>;

const filterNoMatches: R.Filter<any> = filter((x) => x[1]);

const validateExternal: ValidateExternal = async ({ knex }, token, h) => {
  try {
    const tokenResponses = await knex('api_token').select(['api_token', 'api_token_access']);
    if (tokenResponses.length === 0) {
      throw new Error('No api token data in database');
    }

    const comparePromises: Promise<boolean>[] = tokenResponses.map((tokenHash: any) => {
      const { api_token: apiToken } = tokenHash;

      if (!apiToken) {
        throw new Error('Error collecting api token data from database');
      }
      return compare(token, apiToken);
    });

    const matches = await Promise.all(comparePromises);

    const findMatching: (a: boolean []) => any = pipe(
      zip(tokenResponses),
      filterNoMatches,
      flatten,
      head
    );

    return matches.some(id)
      ? { isValid: true, credentials: {
        scope: findMatching(matches).api_token_access,
      } }
      : { isValid: false, credentials: {} };
  } catch (error) {
    console.log(error);
    return Boom.badImplementation('Error with route authentication for 3rd party clients');
  }
};

export default validateExternal;
