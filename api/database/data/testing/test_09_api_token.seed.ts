import * as Knex from 'knex';
import { hashSync } from 'bcrypt';


const apertureScienceToken = 'aperture-token';
const blackMesaToken = 'blackmesa-token';


exports.seed = (knex: Knex) =>
  knex('api_token')
    .insert([
      { api_token_name: 'Aperture Science',
        api_token_access: 'api:visitor:read',
        api_token: hashSync(apertureScienceToken, 1),
      },
      { api_token_name: 'Black Mesa Research',
        api_token_access: 'api:visitor:read',
        api_token: hashSync(blackMesaToken, 1),
      },
    ]);
