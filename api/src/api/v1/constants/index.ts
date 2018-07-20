import * as Hapi from 'hapi';

const createConstantRoute = (resource: string): Hapi.ServerRoute => (
{
  method: 'GET',
  path: `/${resource}`,
  options: {
    description: `Retreive list of ${resource}`,
    auth: false,
  },
  handler: async ({ knex }: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const [resourceName] = resource.split('community_business_').slice(-1);
    const query = await knex(resource).select();
    const response = query.map((row: any) => row[`${resourceName}_name`]);
    return { [resource]: response };
  },
});

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
