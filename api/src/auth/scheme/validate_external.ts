import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { compare } from 'bcrypt';
import { identity as id } from 'ramda';

type ValidateExternal = (request: Hapi.Request, token: string, h: Hapi.ResponseToolkit)
  => Promise <{isValid: boolean, credentials: any } | Boom<null>>;

const validateExternal: ValidateExternal = async ({ knex }, token, h) => {
  try {
    const tokenHashs = await knex('api_token').select('api_token');
    if (tokenHashs.length === 0) {
      throw new Error('No api token data in database');
    }

    const comparePromises: Promise<boolean>[] = tokenHashs.map((tokenHash: any) => {
      const { api_token: apiToken } = tokenHash;

      if (!apiToken) {
        throw new Error('Error collecting api token data from database');
      }
      return compare(token, apiToken);
    });

    const matches = await Promise.all(comparePromises);

    return matches.some(id)
      ? { isValid: true, credentials: {} }
      : { isValid: false, credentials: {} };
  } catch (error) {
    console.log(error);
    return Boom.badImplementation('Error with route authentication for 3rd party clients');
  }
};

export default validateExternal;
