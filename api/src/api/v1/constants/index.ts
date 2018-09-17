import * as Hapi from 'hapi';
import { query, response } from './schema';


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
    handler: async ({ server: { app: { knex } } }: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const query = await knex(tableName)
        .select()
        .orderBy(`${resourceName}_name`);

      return query.map((row: any) => row[`${resourceName}_name`]);
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
