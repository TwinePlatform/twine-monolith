import * as Knex from 'knex';
import { compare, hash } from 'bcrypt';
import { Promises } from 'twine-util';
import { ApiToken } from './types';
import { randomBytes } from 'crypto';


export const ApiTokens = {
  async find (client: Knex, token: string): Promise<ApiToken> {
    const tokens = await client('api_token')
      .select({
        id: 'api_token_id',
        name: 'api_token_name',
        token: 'api_token',
        access: 'api_token_access',
        createdAt: 'created_at',
        modifiedAt: 'modified_at',
        deletedAt: 'deleted_at',
      })
      .where({ deleted_at: null });

    return Promises.find<ApiToken>((tkn) => compare(token, tkn.token), tokens);
  },

  create (name: string, access: string): Partial<ApiToken> {
    return {
      token: randomBytes(16).toString('hex'),
      name,
      access,
    };
  },

  async add (client: Knex, token: Partial<ApiToken>): Promise<ApiToken> {
    const hashedToken = await hash(token, 12);
    const [res] = await client('api_token')
      .insert({
        api_token: hashedToken,
        api_token_access: token.access,
        api_token_name: token.name,
      })
      .returning('*');

    return {
      id: res.api_token_id,
      name: res.api_token_name,
      access: res.api_token_access,
      token: res.api_token,
      createdAt: res.created_at,
      modifiedAt: res.modified_at,
      deletedAt: res.deleted_at,
    };
  },

  async delete (client: Knex, token: ApiToken): Promise<number> {
    if (token.id) {
      return client('api_token')
        .update({ deleted_at: new Date() })
        .where({ api_token_id: token.id });

    } else {
      const tkn = await ApiTokens.find(client, token.token);
      return ApiTokens.delete(client, tkn);

    }
  },
};
