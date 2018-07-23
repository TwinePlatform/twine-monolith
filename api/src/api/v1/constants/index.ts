import * as Hapi from 'hapi';

const createConstantRoute = (tableName: string): Hapi.ServerRoute => {
  const [resourceName] = tableName.split('community_business_').slice(-1);
  const resourceNamePlural = resourceName.slice(-1) === 'y'
    ? resourceName.replace('y', 'ies')
    : resourceName.concat('s');

  return {
    method: 'GET',
    path: `/${ tableName === 'outreach_type'
      ? 'outreach_campaigns/types'
      : resourceNamePlural }`,
    options: {
      description: `Retreive list of ${resourceNamePlural}`,
      auth: false,
    },
    handler: async ({ knex }: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const query = await knex(tableName).select();
      const response = query.map((row: any) => row[`${resourceName}_name`]);

      return { [resourceNamePlural]: response };
    },
  };
};

const constants =
  [
    'gender',
    'ethnicity',
    'disability',
    'outreach_type',
    'subscription_type',
    'community_business_sector',
    'community_business_region',
  ]
  .map(createConstantRoute);

export default constants;
