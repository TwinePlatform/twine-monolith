// tslint:disable:max-line-length
import * as Knex from 'knex';

exports.seed = (knex: Knex) =>
  knex('volunteer_admin_code')
    .insert([
      {
        organisation_id: knex('organisation').select('organisation_id').where({ organisation_name: 'Aperture Science' }),
        code: '10101',
      },
      {
        organisation_id: knex('organisation').select('organisation_id').where({ organisation_name: 'Black Mesa Research' }),
        code: '70007',
      },
    ]);
