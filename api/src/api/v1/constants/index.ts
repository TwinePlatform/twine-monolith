import * as Hapi from '@hapi/hapi';
import { query, response } from './schema';
import { Constants } from 'types-twine-api';


const createConstantRoute = (tableName: string): Hapi.ServerRoute => {
  const [resourceName] = tableName.split('community_business_').slice(-1);
  const resourceNamePlural = resourceName.slice(-1) === 'y'
    ? resourceName.replace(/y$/, 'ies').replace(/_/g, '-')
    : resourceName.concat('s').replace(/_/g, '-');

  return {
    method: 'GET',
    path: `/${ tableName === 'outreach_type'
      ? 'outreach-campaigns/types'
      : resourceNamePlural }`,
    options: {
      description: `Retreive list of ${resourceNamePlural}`,
      auth: false,
      validate: { query },
      response: { schema: response },
    },
    handler: async (request: Constants.getRequest, h: Hapi.ResponseToolkit) => {
      const { server: { app: { knex } } } = request;
      const rows = await knex(tableName)
        .select()
        .orderBy(`${resourceName}_name`)
        .whereNot({ [`${resourceName}_name`]: 'TEMPORARY DATA' });

      return rows.map((row: any) => ({
        id: row[`${tableName}_id`],
        name: row[`${resourceName}_name`],
      })) as Constants.getResponse;
    },
  };
};

export default [
  'gender',
  'ethnicity',
  'disability',
  'outreach_type',
  'subscription_type',
  'community_business_sector',
  'community_business_region',
  'visit_activity_category',
  'volunteer_activity',
]
  .map(createConstantRoute);
