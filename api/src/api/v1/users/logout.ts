import { response } from './schema';
import { Sessions } from '../../../auth/strategies/standard';
import { Api } from '../types/api';


const routes: [
  Api.Users.Logout.GET.Route
] = [
  {
    method: 'GET',
    path: '/users/logout',
    options: {
      description: 'Logout users',
      response: { schema: response },
    },
    handler: async (request, h) => {
      Sessions.destroy(request);
      return null;
    },
  },
];

export default routes;
