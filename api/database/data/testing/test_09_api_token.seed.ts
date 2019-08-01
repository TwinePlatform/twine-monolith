import * as Knex from 'knex';
import { hashSync } from 'bcrypt';


const apertureScienceToken = 'aperture-token';
const blackMesaToken = 'blackmesa-token';


exports.seed = (knex: Knex) =>
  knex('api_token')
    .insert([
      { api_token_name: 'testaccount',
        api_token_access: 'frontline',
        api_token: '$2a$12$ljINX3VanQvCEycBOqvfw.UDMd4DXiRwU23Z9Vw6IVu3TDOKbrXlm',
      },
      { api_token_name: 'testaccount2',
        api_token_access: 'frontline',
        api_token: '$2a$12$ljINX3VanQvCEycBOqvfw.UDMd4DXiRwU23Z9Vw6IVu3TDOKbrXuG',
      },
      { api_token_name: 'Aperture Science',
        api_token_access: 'api:visitor:read',
        api_token: hashSync(apertureScienceToken, 1),
      },
      { api_token_name: 'Black Mesa Research',
        api_token_access: 'api:visitor:read',
        api_token: hashSync(blackMesaToken, 1),
      },
    ]);
